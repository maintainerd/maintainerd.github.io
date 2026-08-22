# Permissions

This page is the authorization reference for Secret: every `secret:` action, what it guards, how it scopes, and how to write a grant that means what you intended.

Permission checking is not hand-rolled in this service. Every route and every RPC is guarded through the shared Maintainerd SDK — the same enforcement point every Maintainerd service and third-party resource server uses. Secret contributes only its *vocabulary*: the permission constants, the route table, the gRPC method table, and the exemption set.

Auth is the policy authority: it owns principals, roles, and grants, and it mints the tokens that carry them. Secret enforces what a token carries. The twelve permission strings must be registered in Auth before any token can carry them — see [Standalone setup](#standalone-setup) step 3.

## Two Layers, Two Questions

Every request passes two independent checks. Both are required.

| Layer | Where | Question | Failure |
|---|---|---|---|
| Surface guard | The HTTP middleware and the gRPC interceptors | Is the caller authenticated, and is this a surface the service decided a permission for? | `403` / `codes.PermissionDenied` |
| Operation check | Inside the service, against the concrete target | May **this** principal perform **this** action on **this** resource's MRN? | `403`, with an audit row recording the denial |

Layer 1 without layer 2 is a vault where anyone who may read one secret may read all of them. Layer 2 is the one that matters, and it is the one a grant's MRN pattern narrows.

## The Twelve Permissions

| Permission | Grants |
|---|---|
| `secret:ReadMetadata` | List and describe secrets and the hierarchy. **Never returns a value.** |
| `secret:GetSecret` | **Reveal** — read a decrypted value. Individually audited; re-checked at every reference hop. |
| `secret:PutSecret` | Write a value: create the secret, or append a version. |
| `secret:DeleteSecret` | Soft-delete, restore, destroy. |
| `secret:RotateSecret` | Rotate a value on demand. |
| `secret:ListSecrets` | List a scope. Metadata only, like `ReadMetadata`; separate because listing a whole environment is a broader capability than describing one secret you already know the name of. |
| `secret:ManageProject` | Create, update, and delete projects. |
| `secret:ManageEnvironment` | Create, update, and delete environments. |
| `secret:ManageFolder` | Create, move, and delete folders, and manage scope imports (an import is a property of a folder). |
| `secret:ManageRotation` | Rotation policies and webhook endpoints — the machinery that rotates values and announces the change. |
| `secret:ReadAudit` | Read the access trail. |
| `secret:Admin` | Blanket. Implies every permission above. It does **not** widen resource scope. |

### `secret:Admin`

`secret:Admin` is declared as a blanket action, so a principal holding it satisfies every required action. It does not widen the resource side of a grant: an admin grant written for one tenant is still confined to that tenant's MRNs.

### Browse Versus Reveal

`secret:ReadMetadata` and `secret:GetSecret` are deliberately **different privileges**, and the split is a requirement rather than a nicety.

Browsing metadata — which secrets exist, when they were rotated, what they are for — is what an engineer needs to operate a system, and it is safe to hand out broadly. Revealing a value is seeing the production database password. Collapsing the two would mean every principal who can render a console page can also exfiltrate every credential on it, and the audit trail could no longer distinguish "who looked at the list" from "who read the value" during an incident review.

The audit trail keeps them apart too: `secret.read` and `secret.reveal` are distinct actions.

## REST Routes

The route table is keyed by the **first path segment** under `/api/v1`. `GET` and `HEAD` require the read permission; every other verb requires the write one.

| Segment | Read (`GET`/`HEAD`) | Write (everything else) |
|---|---|---|
| `/projects` | `secret:ReadMetadata` | `secret:ManageProject` |
| `/environments` | `secret:ReadMetadata` | `secret:ManageEnvironment` |
| `/folders` | `secret:ReadMetadata` | `secret:ManageFolder` |
| `/imports` | `secret:ReadMetadata` | `secret:ManageFolder` |
| `/secrets` | `secret:ReadMetadata` | `secret:ReadMetadata` † |
| `/bulk` | `secret:ReadMetadata` | `secret:ReadMetadata` † |
| `/webhooks` | `secret:ReadMetadata` | `secret:ManageRotation` |
| `/audit` | `secret:ReadAudit` | `secret:Admin` |
| `/setup` (and `/setup/status`) | *exempt* ‡ | *exempt* ‡ |
| `/healthz`, `/readyz` | *exempt* ‡ | — |

† **Both verbs carry the metadata baseline on purpose.** Several routes on those segments are reads carried by a `POST` — reveal takes a body so a secret address never lands in an access log, and batch get likewise — so a verb-derived split would demand a write permission for a read. The real privilege is enforced per operation against the target's MRN. See [Per-operation checks](#per-operation-checks).

‡ See [Exemptions](#exemptions).

Path segments are flat rather than nested precisely so this allowlist is meaningful: with everything nested under `/projects`, one entry would cover the whole API and the allowlist would be a single row saying "yes".

### The Routes The Segments Cover

| Method and path | Segment permission | Operation permission |
|---|---|---|
| `GET /api/v1/projects` | `secret:ReadMetadata` | `secret:ReadMetadata` |
| `POST /api/v1/projects` | `secret:ManageProject` | `secret:ManageProject` |
| `GET /api/v1/projects/{project}` | `secret:ReadMetadata` | `secret:ReadMetadata` |
| `PATCH /api/v1/projects/{project}` | `secret:ManageProject` | `secret:ManageProject` |
| `DELETE /api/v1/projects/{project}` | `secret:ManageProject` | `secret:ManageProject` |
| `GET /api/v1/environments` | `secret:ReadMetadata` | `secret:ReadMetadata` |
| `POST /api/v1/environments` | `secret:ManageEnvironment` | `secret:ManageEnvironment` |
| `GET /api/v1/environments/{project}/{environment}` | `secret:ReadMetadata` | `secret:ReadMetadata` |
| `PATCH /api/v1/environments/{project}/{environment}` | `secret:ManageEnvironment` | `secret:ManageEnvironment` |
| `DELETE /api/v1/environments/{project}/{environment}` | `secret:ManageEnvironment` | `secret:ManageEnvironment` |
| `GET /api/v1/folders` | `secret:ReadMetadata` | `secret:ReadMetadata` |
| `POST /api/v1/folders` | `secret:ManageFolder` | `secret:ManageFolder` |
| `POST /api/v1/folders/move` | `secret:ManageFolder` | `secret:ManageFolder` on **both** the source and destination |
| `DELETE /api/v1/folders` | `secret:ManageFolder` | `secret:ManageFolder` **and** `secret:DeleteSecret` |
| `GET /api/v1/imports` | `secret:ReadMetadata` | `secret:ReadMetadata` |
| `POST /api/v1/imports` | `secret:ManageFolder` | `secret:ManageFolder` on the target **and** `secret:GetSecret` on the source |
| `PATCH /api/v1/imports/{importUUID}` | `secret:ManageFolder` | `secret:ManageFolder` |
| `DELETE /api/v1/imports/{importUUID}` | `secret:ManageFolder` | `secret:ManageFolder` |
| `GET /api/v1/secrets` | `secret:ReadMetadata` | `secret:ListSecrets` |
| `POST /api/v1/secrets` | `secret:ReadMetadata` | `secret:PutSecret` |
| `PATCH /api/v1/secrets` | `secret:ReadMetadata` | `secret:PutSecret` |
| `GET /api/v1/secrets/describe` | `secret:ReadMetadata` | `secret:ReadMetadata` |
| `GET /api/v1/secrets/versions` | `secret:ReadMetadata` | `secret:ReadMetadata` |
| `GET /api/v1/secrets/deleted` | `secret:ReadMetadata` | `secret:ListSecrets` |
| `POST /api/v1/secrets/reveal` | `secret:ReadMetadata` | `secret:GetSecret` |
| `POST /api/v1/secrets/rollback` | `secret:ReadMetadata` | `secret:PutSecret` **and** `secret:GetSecret` |
| `POST /api/v1/secrets/rotate` | `secret:ReadMetadata` | `secret:RotateSecret` |
| `POST /api/v1/secrets/rotation-policy` | `secret:ReadMetadata` | `secret:ManageRotation` |
| `POST /api/v1/secrets/delete` | `secret:ReadMetadata` | `secret:DeleteSecret` |
| `POST /api/v1/secrets/restore` | `secret:ReadMetadata` | `secret:DeleteSecret` |
| `POST /api/v1/secrets/destroy` | `secret:ReadMetadata` | `secret:DeleteSecret` |
| `POST /api/v1/bulk/get` | `secret:ReadMetadata` | `secret:GetSecret`, per item |
| `POST /api/v1/bulk/put` | `secret:ReadMetadata` | `secret:PutSecret`, per item |
| `GET /api/v1/webhooks` | `secret:ReadMetadata` | `secret:ReadMetadata` |
| `POST /api/v1/webhooks` | `secret:ManageRotation` | `secret:ManageRotation` |
| `PATCH /api/v1/webhooks/{endpointUUID}` | `secret:ManageRotation` | `secret:ManageRotation` |
| `DELETE /api/v1/webhooks/{endpointUUID}` | `secret:ManageRotation` | `secret:ManageRotation` |
| `GET /api/v1/webhooks/{endpointUUID}/deliveries` | `secret:ReadMetadata` | `secret:ReadMetadata` |
| `GET /api/v1/audit` | `secret:ReadAudit` | `secret:ReadAudit` |

## gRPC Methods

The method table is keyed by the **full method name**, matched exactly.

`maintainerd.secret.v1.SecretService`:

| Method | Permission |
|---|---|
| `Put` | `secret:PutSecret` |
| `Get` | `secret:GetSecret` *(the legacy flat `Get` is a reveal)* |
| `List` | `secret:ListSecrets` |
| `Delete` | `secret:DeleteSecret` |
| `CreateProject` · `UpdateProject` · `DeleteProject` | `secret:ManageProject` |
| `ListProjects` · `GetProject` | `secret:ReadMetadata` |
| `CreateEnvironment` · `UpdateEnvironment` · `DeleteEnvironment` | `secret:ManageEnvironment` |
| `ListEnvironments` · `GetEnvironment` | `secret:ReadMetadata` |
| `CreateFolder` · `MoveFolder` · `DeleteFolder` | `secret:ManageFolder` |
| `ListFolders` | `secret:ReadMetadata` |
| `CreateImport` · `UpdateImport` · `DeleteImport` | `secret:ManageFolder` |
| `ListImports` | `secret:ReadMetadata` |
| `GetSecret` | `secret:GetSecret` |
| `DescribeSecret` · `ListSecretVersions` | `secret:ReadMetadata` |
| `ListSecrets` · `ListDeletedSecrets` | `secret:ListSecrets` |
| `PutSecret` · `UpdateSecretMetadata` · `RollbackSecret` | `secret:PutSecret` |
| `RotateSecret` | `secret:RotateSecret` |
| `SetRotationPolicy` | `secret:ManageRotation` |
| `DeleteSecret` · `RestoreSecret` · `DestroySecret` | `secret:DeleteSecret` |
| `BatchGetSecrets` · `BatchPutSecrets` | `secret:ReadMetadata` † |
| `CreateWebhookEndpoint` · `UpdateWebhookEndpoint` · `DeleteWebhookEndpoint` | `secret:ManageRotation` |
| `ListWebhookEndpoints` · `ListWebhookDeliveries` | `secret:ReadMetadata` |
| `ListAuditEvents` | `secret:ReadAudit` |
| `Ping` · `Setup` | *exempt* ‡ |

`maintainerd.secret.v1.SetupService` — `GetSetupStatus`, `Setup`, `CompleteSetup` — is *exempt* ‡.

† The batch baseline is metadata because a batch mixes items whose individual privileges differ; each item is checked with the operation's real permission against its own MRN. The deeper permissions are still declared, so Auth registers them.

The four flat-key methods `Put`, `Get`, `List`, and `Delete` are the legacy surface the kit's secret-provider client uses. Their permissions are the real ones for the operation, not a compatibility exemption: an old client with a token that cannot read secrets could never read them through the old RPC either.

## Per-Operation Checks

The route and method tables are the allowlist, never the authorization decision. The decision is made per operation against the concrete target's MRN. This is the layer a scoped grant narrows.

| Operation | Permission | Checked against |
|---|---|---|
| Reveal a value | `secret:GetSecret` | The secret's MRN |
| Resolve a reference hop | `secret:GetSecret` | The **target's** MRN, at every hop |
| Describe a secret | `secret:ReadMetadata` | The secret's MRN |
| List secret versions | `secret:ReadMetadata` | The secret's MRN |
| List secrets in a folder | `secret:ListSecrets` | The folder's MRN |
| List deleted secrets | `secret:ListSecrets` | The environment's MRN |
| Put a value | `secret:PutSecret` | The secret's MRN (resolved before it exists, for a create) |
| Update secret metadata | `secret:PutSecret` | The secret's MRN |
| Roll back | `secret:PutSecret` **and** `secret:GetSecret` | The secret's MRN |
| Rotate | `secret:RotateSecret` | The secret's MRN |
| Set a rotation policy | `secret:ManageRotation` | The secret's MRN |
| Delete, restore, destroy | `secret:DeleteSecret` | The secret's MRN |
| Create a project | `secret:ManageProject` | The project's MRN |
| Get or list projects | `secret:ReadMetadata` | The project's MRN |
| Update or delete a project | `secret:ManageProject` | The project's MRN |
| Create an environment | `secret:ManageEnvironment` | The environment's MRN |
| Get or list environments | `secret:ReadMetadata` | The environment's MRN |
| Update or delete an environment | `secret:ManageEnvironment` | The environment's MRN |
| Create a folder | `secret:ManageFolder` | The folder's MRN |
| List folders | `secret:ReadMetadata` | The folder's MRN |
| Move a folder | `secret:ManageFolder` | **Both** the source and the destination MRN |
| Delete a folder | `secret:ManageFolder` **and** `secret:DeleteSecret` | The folder's MRN |
| Create a scope import | `secret:ManageFolder` on the target folder **and** `secret:GetSecret` on the source | Two different MRNs |
| List, update, or delete an import | `secret:ReadMetadata` / `secret:ManageFolder` | The import's MRN |
| Create, update, or delete a webhook endpoint | `secret:ManageRotation` | The endpoint's MRN |
| List endpoints or deliveries | `secret:ReadMetadata` | The endpoint or collection MRN |
| Read the audit trail | `secret:ReadAudit` | The tenant's audit MRN |

Three of these are worth calling out.

**Rollback requires both write and reveal.** The write half is obvious. The reveal half is the important one: a rollback reads a value the caller did not supply and republishes it as current. A principal that may write but not read could otherwise use a rollback as a read primitive — write a known value, roll back, and compare version checksums to learn what the old value was.

**Deleting a folder requires `secret:DeleteSecret` as well as `secret:ManageFolder`**, because deleting a folder deletes what is in it.

**Creating a scope import requires reveal on the source.** An import makes another scope's values readable through this folder, so it cannot be authorized purely as a folder edit.

Reading the audit trail is itself audited. The first move of an attacker who has read a credential is to find out what the trail says about it, so "who read the audit log" is a first-class signal.

Every denial writes an audit row before the error is returned. A denied attempt is the most interesting row in the table — it is how an over-reaching or compromised principal is spotted.

## Resource Names

A grant's resource side is a Maintainerd resource name (MRN):

```text
mrn:<service>:<tenant>:<project>:<resource-path>
```

For this service the service segment is always `secret`, the tenant segment is the tenant slug, and the project segment is the project slug. The resource paths are deliberately disjoint by prefix:

| Resource path | What it names |
|---|---|
| `project` | The project named by the MRN's project segment |
| `environment/<env>` | One environment |
| `folder/<env>` | An environment's root folder |
| `folder/<env>/<path...>` | A folder |
| `secret/<env>/<path...>/<key>` | One secret |
| `import/<uuid>` | One scope-import edge |
| `webhook` | A project's webhook collection |
| `webhook/<uuid>` | One webhook endpoint |
| `audit` | The tenant's access trail (the project segment is empty) |
| `setup` | The one-time setup surface |

Folders are **not** under `secret/`, and that is on purpose. A grant that lets a principal read secrets in staging must not also let it *move* staging's folders — moving a folder rewrites the resource names of everything beneath it, which is a way to bring secrets into the reach of a grant that never covered them. Different privilege, different resource prefix, so no wildcard can bridge the two by accident.

Examples:

```text
mrn:secret:acme:billing-app:secret/prod/db/primary/PASSWORD
mrn:secret:acme:billing-app:folder/staging/db
mrn:secret:acme:billing-app:environment/prod
mrn:secret:acme::audit
```

## The Grant Grammar

A grant is one entry of a token's scope or permissions claim.

| Form | Meaning |
|---|---|
| `secret:GetSecret` | The action, **service-wide**. Equivalent to `secret:GetSecret=mrn:secret:*:*:*`. |
| `secret:GetSecret=<mrn-pattern>` | The action, **narrowed** to the resources the pattern matches. |

The separator is `=`, and only the first one splits, because an action never contains `=` while a resource pattern theoretically may.

An unqualified grant being service-wide is stated plainly rather than hidden: it is the one place the design trades safety for compatibility, so that a plain permission token minted by an Auth that knows nothing about resource names still works. The narrow form is what makes per-environment grants expressible, and it is the form to prefer.

### Pattern Rules

Matching is **segment-aware**, not a flat glob. A flat glob would let a wildcard run across colon boundaries, so `mrn:secret:acme:*` would match `mrn:secret:acmecorp:x:y` — a grant written for tenant `acme` silently reaching into tenant `acmecorp`. Confining a wildcard to the segment it was written in is what makes a pattern safe to use as a tenant-isolation boundary.

| Segment | Accepted |
|---|---|
| Service | A literal, or `*`. Required. |
| Tenant | A literal, `*`, or empty. |
| Project | A literal, `*`, or empty. |
| Resource path | A literal, a prefix ending in `*`, or a bare `*`. |

Mid-path wildcards such as `secret/*/PASSWORD` are **rejected at parse time** rather than accepted and silently mis-matched at evaluation time, where the miss would be invisible until it either denied legitimate access or granted more than the author intended.

An empty project segment means tenant-scoped; empty tenant and project means platform-scoped.

### Worked Examples

```text
secret:GetSecret
```

Reveal any secret in any tenant and any project this token reaches. Appropriate for an administrator, wrong for a workload.

```text
secret:GetSecret=mrn:secret:acme:billing-app:*
```

Reveal any resource in project `billing-app` of tenant `acme`, and nothing else.

```text
secret:GetSecret=mrn:secret:acme:billing-app:secret/prod/*
```

Reveal secrets in the `prod` environment of that project. Because folders live under `folder/` rather than `secret/`, this grant conveys no folder-management privilege at all.

```text
secret:ReadMetadata=mrn:secret:acme:billing-app:*
secret:GetSecret=mrn:secret:acme:billing-app:secret/staging/*
```

Browse the whole project; reveal values only in staging. This is the shape most engineer grants should have.

```text
secret:PutSecret=mrn:secret:acme:billing-app:secret/prod/db/primary/PASSWORD
```

A workload that may rewrite exactly one secret.

```text
secret:Admin=mrn:secret:acme:*:*
```

Every action, confined to tenant `acme`. `secret:Admin` widens the action side, never the resource side.

## Exemptions

Exactly ten surfaces are served with **no permission check**, and every one carries its own gate.

| Surface | Why it cannot be token-guarded | What guards it instead |
|---|---|---|
| `GET /healthz` | An orchestrator must be able to probe before it holds a credential. | Discloses the literal string `ok`. |
| `GET /readyz` | Same. | Discloses a dependency *name* (`database`, `auth`) — never an address, driver message, or version. |
| `/api/v1/setup` (and `/setup/status`) | Provisioning is what makes tokens mintable at all, so it must work **before** Auth exists. | `SETUP_BOOTSTRAP_TOKEN` compared in constant time, rate-limited per client IP, and refused entirely once an orchestrator owns the instance (or when `MAINTAINERD_MODE=core` declares one will). Anonymous status returns **one bit**. |
| `grpc.health.v1.Health/Check` and `/Watch` | As `/healthz`. | The standard health protocol leaks nothing beyond "serving". |
| `SecretService/Ping` | An orchestrator has to ask "is this provisioned yet" before provisioning the thing that mints tokens. | Answers `{ok, setup_complete}` and nothing else. |
| `SecretService/Setup` | The legacy flat-surface first-run RPC. | Bootstrap token, constant-time compare. |
| `SetupService/GetSetupStatus`, `/Setup`, `/CompleteSetup` | The controlled first-run surface. | The `x-setup-token` metadata header, constant-time compare. The full status payload additionally requires the token or `secret:Admin`. |

Exemptions are matched **exactly** for gRPC — never by service prefix — and on a **segment boundary** for HTTP. So a new RPC added to `SetupService`, or a route named `/api/v1/setup-admin`, fails closed rather than inheriting a neighbour's exemption.

The two HTTP probes are also mounted outside the `/api/v1` group the guard wraps, so they are exempt by construction as well as by declaration.

### Server Reflection

gRPC server reflection is **neither mapped nor exempt**. That combination is deliberate: an unmapped surface is denied by the allowlist when authorization is enforced, and reachable only in development-open mode, where the guard admits every caller before it consults the table.

Reflection enumerates every RPC and message in the service — useful with `grpcurl` on a laptop, a map of the vault's API in production. The bootstrap additionally registers the reflection service only in development, so in production there is nothing behind the door either.

## The Allowlist Property

The route and method tables **are** the allowlist. A surface that is not in them and not exempt is denied — to a valid token as much as to an anonymous caller.

That means the service cannot grow an unguarded endpoint by accident. Mounting a route or registering an RPC without deciding its permission fails **closed** instead of shipping open. A forgotten route is the failure mode that actually ships, because it does not throw, does not log, and does not look wrong in review — it looks like a handler.

A gap-audit test converts that runtime property into a build-time one. It:

1. Builds the real router the service mounts and walks it.
2. Flattens the generated gRPC service descriptors the server dispatches on — unary methods **and** streams, because streams dispatch through a different interceptor chain and a unary-only guard never sees them.
3. Requires every surface to be either mapped to a non-empty permission or covered by an exemption that has a **written justification** in the test file.
4. Checks the reverse direction: no mapped segment or method that nothing serves. Dead weight is what makes an authorization table stop being read.
5. Checks itself for vacuity, by requiring surfaces that do not exist to read as gaps.

Both lists are derived from the live surface, never hand-kept, because a hand-kept list drifts silently and a test that has stopped reading the surface is worse than no test: it reports "no gaps" with confidence.

Adding an unguarded route therefore requires writing down why, in a file a reviewer reads.

## Registering The Permissions In Auth

The guard demands these exact strings, and Auth must know them or no token can carry them. Registration and enforcement are two halves of one fact, and when they drift the failure is silent and total: every call using the missing permission answers `403` regardless of who makes it, with nothing in any log saying why.

A running instance reports the enforced list — derived from the code that enforces it — at `GET /api/v1/setup/status`, with the setup token or a verified `secret:Admin` grant. If a document and that endpoint ever disagree, the endpoint is right.

In standalone mode you register them by hand; see [Standalone setup](#standalone-setup) step 3. In core-attached mode Core registers them from the same derived list. See [Run modes](#run-modes).
