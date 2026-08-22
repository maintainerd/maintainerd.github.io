# Security

This page is the set of guarantees an operator can rely on, and — just as important — the list of things that are designed for but not built. Nothing here is aspirational; where a capability is incomplete it says so.

Authorization is covered separately, on [Permissions](#permissions).

## Envelope Encryption

Every version gets its **own data encryption key** (DEK). The DEK encrypts the payload; a **root key** (KEK) encrypts the DEK and never touches a payload.

| Property | Detail |
|---|---|
| Cipher | AES-256-GCM, under a random 12-byte nonce. |
| Additional authenticated data | The tenant UUID, the secret UUID, and the version number. A ciphertext copied into a different secret's row fails authentication instead of decrypting into the wrong place. |
| Why those coordinates | The AAD binds *immutable* identity on purpose. Binding the folder path would mean an administrative folder move silently destroyed every value beneath it. Path is an authorization concern, enforced over the resource name instead. |
| Integrity checksum | SHA-256 of the plaintext, stored so "did this value change?" and "is this row intact?" are answerable without the root key. A write whose checksum matches the current version creates **no new version**, which is what stops a rotation loop from inflating history. |
| Zeroization | Plaintexts and DEKs are zeroized after use. |

## Root Key

The root key always comes from **outside** the database. A store cannot unlock itself.

| Provider | Status | Notes |
|---|---|---|
| `env` | **Built** | 32 bytes from `SECRET_ROOT_KEY`, hex or base64, validated at boot. |
| `file` | **Built** | A sealed key file. **Refuses** a group- or world-readable file. |
| `aws_kms`, `gcp_kms`, `azure_kv` | **Registered, not built** | The interface is the seam. Configuration for them validates today; construction fails with a clear message. |

Outside `APP_ENV=development` a missing or malformed root key is a **boot error**, never a silently generated one. A generated key makes every secret written before the next restart permanently undecryptable, and the failure is invisible until it is far too late.

### Rotating The Root Key

Rotating the root key **re-wraps DEKs and never rewrites ciphertext** — that is the whole point of the envelope. The re-wrap is batched, resumable, and idempotent, and it records which key wrapped what, so the work is enumerable and retirement is provable. The old key is retired only once a count proves no version still references it.

`SECRET_REWRAP_BATCH_SIZE` controls the batch size. See [Environment variables](#environment).

## Append-Only Versions

Every write appends. Nothing rewrites history, and that is enforced by a database trigger rather than by convention.

There is exactly **one** sanctioned exception: the root-key re-wrap, which must replace a version's wrapped DEK in place. It is gated by a transaction-local database setting and additionally verified to leave the ciphertext, nonce, version number, checksum, and creation timestamp untouched. A re-wrap that changed any of those would not be a re-wrap.

Retention pruning deletes the oldest versions through the same sanctioned path and **never** the current version.

## Deletion

| Stage | Behaviour |
|---|---|
| Delete | Schedules destruction and destroys nothing. The secret and its full history remain. |
| Restore | Brings the secret back with its full history. |
| Destroy | Refused inside the recovery window **by the SQL itself**, compared against the database's own clock — not the application's. |

`SECRET_RECOVERY_WINDOW` defaults to `720h`. A value of `0` is refused outside development, because it makes every delete immediately unrecoverable.

## Audit

The audit trail is append-only and **it records reads**. `secret.read` (metadata) and `secret.reveal` (value) are distinct actions, because metadata access and value access are different grants.

| Event | Recorded |
|---|---|
| Successful reveal | Yes — and the operation cannot report success if the audit row could not be written. An unaudited reveal that the caller believes succeeded is strictly worse than a failed reveal, because the value is out and nothing records it. |
| Successful mutation | Yes, on the same strict terms. |
| **Denial** | Yes, before the `403` is returned. A denied attempt is the most interesting row in the table — it is how an over-reaching or compromised principal is spotted. |
| The **class** of caller | Yes, on every row including denials. `actor_kind` records whether the caller was a human or a machine identity, taken from the verified claims and never from anything the caller supplied. An incident review can tell a person reading a value from a workload reading it. |
| Non-authorization failure | Yes, with the cause redacted. An internal error's wrapped cause is deliberately excluded: it is a database message describing the store's structure, and the audit log is readable by anyone with `secret:ReadAudit` — a broader audience than the operator reading the server log. |
| Reading the trail itself | Yes. The first move of an attacker who has read a credential is to find out what the trail says about it. Reading it also requires a **user** principal — a workload reading the trail is reconnaissance rather than work. |
| Each item of a batch | Individually authorized and individually audited. A batch is a transport optimisation, not a semantic one. |

The service refuses to run an authorized operation at all without an auditor configured, so there is structurally no unaudited path to a value.

## Values Never Leak

| Surface | Guarantee |
|---|---|
| List responses | A secret row has no value column — payloads live exclusively in versions — so a listing structurally cannot leak one. |
| Logs | A decrypted value is a redacting type: it renders as `[REDACTED]` through string formatting, structured logging, and JSON marshalling. |
| Errors | No error in this service carries a value, a DEK, or a root key. |
| Webhook payloads | A delivery carries the resource name and version and never a value. Deliveries are HMAC-signed. |
| Credentials in the boot log | Neither the client secret nor the private-key path is ever logged. The issuer, audience, and the two public client ids are, because they appear in every token the service verifies and are the values most often subtly wrong. |
| URLs | Reveal and batch-get are `POST` requests so a secret's address lands in a body rather than in access logs, proxy logs, browser history, and referer headers. That is a transport decision, not a weaker check: both routes demand `secret:GetSecret` at the door. The console holds the same line — see [Console](#console). |

## Tenant Isolation

`tenant_id` is in the `WHERE` clause of every secret query, enforced at the query layer: the generated data-access code will not compile a call that omits it.

A caller may *name* any tenant. Asking is free; the answer for a tenant you hold no grant in is a denial, and an audited one, rather than a data leak. The tenant a request names is a **selector**, never an authorization: naming a tenant gets you a resource name in that tenant, and the grant check then decides whether you may touch it.

Resource-name matching is segment-aware rather than a flat glob, so a wildcard cannot run across a segment boundary — a grant written for tenant `acme` can never reach into `acmecorp`. See [Permissions](#permissions).

## Every Surface Demands What It Performs

The surface guard — the HTTP middleware and the gRPC interceptors — demands the permission the operation **actually performs**, route by route. It is not a baseline with the real privilege deferred to a deeper check.

That ordering matters because the surface guard runs **first**. A weak rule at the door is the check an attacker meets first, and a handler added later that forgets its deeper check would ship carrying only that weak permission. The `/secrets` and `/bulk` segments used to work that way — every verb, including the write, the delete, and the destroy, resolved to `secret:ReadMetadata`. They are now declared route by route and are not in the segment table at all, so a new handler mounted beside them matches nothing and is **denied to every caller** rather than inheriting a permission.

Two properties are enforced by test rather than by convention:

- **No surface whose handler changes durable state may be guarded by a read-only permission** (`secret:ReadMetadata`, `secret:ListSecrets`, `secret:ReadAudit`). Those are the grants an operator hands out broadly precisely because they cannot change anything.
- **The two transports must agree**, surface by surface, on both the permission and the class of caller. A rule that held over REST and not over gRPC would be no rule at all — a refused caller would simply open a channel.

The per-operation check against the target's MRN is still made, and it is still the only place a scoped grant is narrowed. It is now the second layer rather than the only one. See [Permissions](#permissions).

## Two Classes Of Caller

A permission answers "may this principal do X". It cannot answer "should this **class** of caller be doing X at all" — and that is the question that catches a **stolen machine-to-machine credential**, whose grants are real and which therefore passes every permission check.

So each surface also declares which class may reach it, derived from the verified claims on the token:

| Class | Reaches |
|---|---|
| Service — a machine identity carrying Auth's `svc` claim, or a `sub_type` of `service`, `client`, or `exchange` | Reveal, describe, list, bulk get and put, and the ordinary write, rotate, and soft delete of a secret it holds a grant on. |
| User — a person signed in through the interactive authorization-code + PKCE flow | All of the above, plus the administrative surfaces: setup, audit, restore, destroy, and project, environment, folder, import, webhook, and rotation-policy management. |

Writes and rotation are deliberately open to services. A rotator replacing the credential it manages is the case a secret store exists to enable, and the blast radius is bounded by the **MRN grant** rather than by the caller's class. Restore and destroy are not: both authorize at **tenant** scope, so they need a grant far wider than any single workload's, and destroy is irreversible.

An **unclassified** caller — one this service cannot place in either class — is refused by every constrained surface. "We could not classify this caller" is not a reason to admit it to a surface somebody deliberately restricted.

A class refusal carries the distinct code `actor_kind_not_permitted` rather than `insufficient_permission`, because the two want different responses: one is fixed by granting a permission, and the other is a misconfigured client or a stolen credential and is not a permissions problem at all. Both answer `403`, deliberately — the reason differs but the answer does not, and a distinct status would tell a caller probing the surface why it was refused.

## Fail-Closed Startup

Outside `APP_ENV=development`, a missing auth configuration does **not** degrade to open:

- Every guarded surface answers `503` / `codes.Unavailable`.
- `/readyz` reports not-ready.
- The probes and the self-guarded setup surface stay reachable, so the instance can still be provisioned.

In development the service opens with a loud boot banner that names every disabled guard **individually** rather than saying "auth disabled" — including the line "reveal gating — ANY caller can read ANY secret's decrypted value". A one-line summary is easy to skim past in a startup log; that line is not.

`APP_ENV` is matched against the exact string `development`, so a typo such as `dev` or `Development` reads as production and fails closed. `DB_SSLMODE=disable` is likewise refused outside development.

A *partial* identity configuration — a JWKS URL without an issuer and audience — is a boot error in either run mode, because it looks configured and accepts any token Auth ever signed, including tokens minted for a different service.

The setup lock is a durable database row rather than process memory, so the first-run window does not reopen on restart. The bootstrap token is compared in constant time and the setup surface is rate-limited per client IP.

## Reveal Is A Separate Grant

`secret:GetSecret` (reveal a value) is a different privilege from `secret:ReadMetadata` (browse what exists), and the split is load-bearing rather than decorative. It is what lets an engineer operate a system without being able to exfiltrate every credential in it, and what lets an incident review distinguish "who looked at the list" from "who read the value".

Two consequences worth knowing:

- **A reference chain re-checks reveal at every hop.** A reference cannot become a privilege-escalation path.
- **Rollback requires reveal as well as write.** A rollback republishes a value the caller did not supply, so a write-only principal could otherwise use it as a read primitive.

Creating a scope import likewise requires reveal on the source scope, because an import makes another scope's values readable through a folder you control.

## Rate Limiting

| Budget | Default | Keyed by |
|---|---|---|
| Reveal | 300 per minute | Principal |
| Write | 120 per minute | Principal |
| Setup | 10 per minute | Client IP |

The reveal budget is the exfiltration bound: a compromised token with broad grants is metered on how fast it can walk the store. It is separate from the write budget so that a workload writing at its full rate is still able to read.

REST and gRPC spend **one** budget. A per-transport budget is not a budget: a client that exhausted its reveal allowance over REST would otherwise open a gRPC channel and spend a second one against the same secrets with the same grants.

**The limiter is per process, not cluster-wide.** With N replicas behind a load balancer the effective ceiling is N times the configured budget. It is a brute-force and burst dampener, not a distributed quota. Meter at your ingress if you need a real quota; `SECRET_RATE_LIMIT_ENABLED=false` is a supported configuration for a deployment that does.

## Transport And Request Hardening

| Control | Detail |
|---|---|
| Security headers | Set before anything can write a response, including a `413` from the body cap or a `500` from recovery. A header that is only on the happy path is a header an attacker routes around. |
| Body cap | Applied before routing, because the setup surface is unauthenticated and the guard has not run yet. |
| Per-request deadline | Bounded, and required to be shorter than the write deadline so a timed-out request returns an error rather than a truncated response. |
| Probes outside the guard | `/healthz` and `/readyz` are mounted outside `/api/v1`, so they are exempt by construction as well as by declaration, and outside the per-request timeout — a liveness probe must not inherit a 30-second budget. |
| What the probes disclose | `/healthz` returns the literal string `ok`. `/readyz` discloses a dependency *name* (`database`, `auth`) and never an address, driver message, or version. |
| Server reflection | Registered only in development, and neither mapped nor exempt in the permission table, so it is denied by the allowlist when authorization is enforced. |

## What Is Not Built

An honest list. None of these are available today.

| Capability | Status |
|---|---|
| KMS root-key providers (`aws_kms`, `gcp_kms`, `azure_kv`) | Registered, not built. Configuration validates; construction fails with a clear message. Use `env` or `file`. |
| Dynamic secrets — on-demand credentials with a TTL | Designed for, not built. |
| Transit encryption — encrypt and decrypt as a service without exposing keys | Designed for, not built. |
| Leases or TTL on static secrets | Designed for, not built. |
| Replication or an HA store | Designed for, not built. Single-node durability first. |
| Cluster-wide rate limiting | Not built. The limiter is per process; see above. |
| Server-side audit filtering | Not built. The trail pages but does not filter by action, actor, resource, or date. |
| A documented backup and restore runbook | Not written. The store is durable, but the procedure — ciphertext and wrapped DEKs only, and what a restore needs from the root-key provider — is not yet published. |
| A certificate authority | Out of scope. Certificate lifecycle belongs to a different service. |

Infrastructure-side controls — mutual TLS on service-to-service gRPC, TLS termination and minimum version, at-rest encryption for the database volume, and declared CPU and memory limits — are deployment concerns this service does not configure for you.
