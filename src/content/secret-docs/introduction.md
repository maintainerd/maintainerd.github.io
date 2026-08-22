# Introduction

Secret is Maintainerd's own secret manager. It is a first-party vault: it stores encrypted material itself rather than proxying to somebody else's store. HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, and GCP Secret Manager are *alternative providers an operator may choose instead of this service*; Secret never forwards to them.

Every secret value is envelope-encrypted, every write appends an immutable version, and reading a value is a separate, individually audited privilege from browsing what exists. The service ships its own console at `console.secret.maintainerd.local`.

**Secret is adoptable alone.** An organization can run Maintainerd Auth and Maintainerd Secret and nothing else, and get a fully enforcing vault. Standalone is the default run mode and a first-class way to run the service, not a fallback. See [Run modes](#run-modes) and the [Standalone setup](#standalone-setup) runbook.

Secret does not perform authentication. Auth mints tokens and owns principals, roles, and grants; Secret enforces the permissions a token carries. The run mode decides how Secret learns which Auth to trust, not whether it trusts one.

## How To Use These Docs

Read these pages in the same order you would stand the service up.

| Step | What You Do | Start With |
|---:|---|---|
| 1 | Understand what the service stores and how it is addressed. | This page |
| 2 | Decide whether you are running standalone or attached to Core. | [Run modes](#run-modes) |
| 3 | Create the identity records in Auth and start the service. | [Standalone setup](#standalone-setup) |
| 4 | Set the full runtime configuration. | [Environment variables](#environment) |
| 5 | Deploy the dashboard and its OAuth client. | [Console](#console) |
| 6 | Write grants for operators and workloads. | [Permissions](#permissions) |
| 7 | Review the guarantees before production. | [Security](#security) |

## The Hierarchy

Secret addresses everything through one containment chain.

| Level | What It Is | Notes |
|---|---|---|
| Tenant | Mirrors an Auth tenant (`auth_tenant_uuid`). | Auth owns identity; Secret owns encrypted material. Every secret query is tenant-scoped. |
| Project | An application or a team's slice of the vault. | Project slugs are permanent — they are a segment of every resource name below them. |
| Environment | `dev`, `staging`, `prod`. | First-class, because that is the level real grants are written at. The same key name is expected to exist once per environment. |
| Folder | A path inside an environment, nested to any depth. | Stored as an adjacency list plus a materialized absolute path, so prefix listing is one indexed comparison rather than a recursive walk. Moving a folder rewrites the subtree's paths and resource names in one transaction. |
| Secret | Identity and metadata: key, description, tags, timestamps. | There is no value column on a secret. |
| Version | The encrypted payload. | Append-only, enforced by a database trigger. Every write appends; nothing rewrites history. |

Because payloads live exclusively in versions, a listing structurally cannot leak one.

## What The Service Does

| Capability | What It Means |
|---|---|
| Envelope encryption | Each version gets its own data key (DEK), sealed with AES-256-GCM. A root key (KEK) encrypts the DEK and never touches a payload. See [Security](#security). |
| Immutable versions | Every put appends. Get-latest, get-by-version, and rollback are all reads of history; rollback appends a new version rather than rewriting one. Retention (`SECRET_KEEP_VERSIONS`) prunes the oldest and never the current. |
| Audited reveals | Reading a decrypted value is `secret:GetSecret`, distinct from `secret:ReadMetadata`. Every reveal writes an audit row, and a reveal that cannot be audited fails. |
| Soft delete and recovery | A delete schedules destruction and destroys nothing. Restore brings the secret back with its full history. Hard destroy is refused inside the recovery window by the SQL itself, compared against the database's clock. |
| References | A value may point at another secret, resolved at read time with a cycle detector and a reveal check at *every* hop, so a reference is never a privilege-escalation path. |
| Scope imports | A folder can import another scope's secrets, with own-value-wins precedence. Creating an import requires reveal access to the source. |
| Rotation | Manual rotation with a generator (random with length and charset, or a supplied value), rotation policies with an interval and next-due time, and a background rotator. |
| Webhooks | HMAC-signed notifications that a value changed. A delivery carries the resource name and version and never a value. |
| Audit trail | Append-only, and it records reads as well as writes. `secret.read` and `secret.reveal` are distinct actions. |

## Surfaces

| Surface | Default | What It Serves |
|---|---|---|
| REST | `:8092` | The hierarchical API under `/api/v1`, plus the first-run setup wizard. |
| gRPC | `:9092` | `maintainerd.secret.v1.SecretService` and `maintainerd.secret.v1.SetupService`. |
| Probes | `:8092` | `GET /healthz` (liveness) and `GET /readyz` (readiness), mounted outside `/api/v1`. |
| Console | Your host | A separate single-page app. See [Console](#console). |

REST path segments are deliberately flat — `/projects`, `/environments`, `/folders`, `/secrets`, `/bulk`, `/imports`, `/webhooks`, `/audit`, `/setup` — rather than nested. That is what makes the permission table an allowlist worth having: with everything nested under `/projects`, one entry would cover the whole API. See [Permissions](#permissions).

Reveal and batch-get are `POST` requests despite being reads. A secret's address in a URL ends up in access logs, proxy logs, browser history, and referer headers; a request body does not. The permission required is still the read one — the HTTP verb is a transport detail and the privilege is not.

## Resource Names

Every authorization decision is keyed on a Maintainerd resource name (MRN):

```text
mrn:secret:<tenant>:<project>:<resource-path>
```

For example, the `PASSWORD` key in the `/db/primary` folder of the `prod` environment, in project `billing-app` of tenant `acme`:

```text
mrn:secret:acme:billing-app:secret/prod/db/primary/PASSWORD
```

Grants are written against these names, which is what makes "may read staging, must not read prod" expressible. The full resource-path vocabulary and the grant grammar are on the [Permissions](#permissions) page.

## Two Different Privileges

The single most important thing to understand before writing grants:

| Permission | What It Does |
|---|---|
| `secret:ReadMetadata` | Browse. Lists and describes secrets and the hierarchy. It never returns a value. |
| `secret:GetSecret` | Reveal. Reads a decrypted value. |

They are deliberately separate grants. Browsing what exists — which secrets there are, when they were rotated, what they are for — is what an engineer needs to operate a system, and it is safe to hand out broadly. Revealing a value is seeing the production database password. Collapsing the two would mean every principal who can render a console page can also exfiltrate every credential on it, and the audit trail could no longer distinguish "who looked at the list" from "who read the value" during an incident review.

Start people on `secret:ReadMetadata` and add `secret:GetSecret` deliberately.

## What Secret Is Not

Stated plainly so nothing on these pages reads as a promise:

| Not | Detail |
|---|---|
| Not a facade over another vault | It never proxies to Vault, AWS Secrets Manager, Azure Key Vault, or GCP Secret Manager. |
| Not a certificate authority | Domain and certificate lifecycle belong to a different service. |
| Not a boot dependency | Core and the agent boot before Secret exists and can never use it. A deployment can run with no Secret service at all. |
| Not dynamic secrets | On-demand database credentials with a TTL are designed for and not built. |
| Not transit encryption | Encrypt/decrypt-as-a-service without exposing keys is designed for and not built. |
| Not leases on static secrets | Expiring reads for high-sensitivity values are designed for and not built. |
| Not replicated | Single-node durability first; a replicated or HA store is not built. |

Root-key providers backed by AWS KMS, GCP KMS, and Azure Key Vault are registered but not built: the configuration for them validates, and construction fails with a clear message. Only the `env` and `file` providers work today. See [Security](#security).
