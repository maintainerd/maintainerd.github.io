# Permissions

This page is the authorization reference for Secret: every `secret:` action, every route and RPC that demands one, which class of caller may reach it, and how to write a grant that means what you intended.

Permission checking is not hand-rolled in this service. Every route and every RPC is guarded through the shared Maintainerd SDK — the same enforcement point every Maintainerd service and third-party resource server uses. Secret contributes only its *vocabulary*: the permission constants, the exact route table, the gRPC method table, and the exemption set.

Auth is the policy authority: it owns principals, roles, and grants, and it mints the tokens that carry them. Secret enforces what a token carries. The eighteen permission strings must be registered in Auth before any token can carry them — see [Standalone setup](#standalone-setup) step 3, or [Run modes](#run-modes) if Core provisions the service for you.

## Two Layers, Two Questions

Every request passes two independent checks. Both are required, and **neither is a placeholder for the other**.

| Layer | Where | Question | Failure |
|---|---|---|---|
| Surface guard | The HTTP middleware and the gRPC interceptors | Is the caller authenticated, is this a surface the service decided a rule for, is this **class** of caller allowed on it, and does the caller hold the permission the operation actually performs? | `403` / `codes.PermissionDenied` |
| Operation check | Inside the service, against the concrete target | May **this** principal perform **this** action on **this** resource's MRN? | `403`, with an audit row recording the denial |

**The surface guard demands the permission the operation really performs.** It used to carry a metadata *baseline* on the `/secrets` and `/bulk` segments and defer the real privilege to the operation layer. The reasoning was sound — a reveal is a read carried by a `POST` so a secret's address never lands in an access log — but the ordering was inverted: the weak check ran first, the route table stopped saying what a route does, and a new handler added beside them that forgot its deeper check would have shipped guarded by `secret:ReadMetadata` alone.

Every route now declares its own rule, so **layer 1 is correct on its own and layer 2 is defence in depth** rather than the only defence. Layer 2 is still where a scoped grant is narrowed to a target MRN, and it is the only place a second, resource-dependent permission can be demanded — see [Permissions enforced deeper](#permissions-enforced-deeper).

## The Eighteen Permissions

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
| `secret:ManageDynamicRole` | Configure a dynamic role: which PostgreSQL instance it targets, the SQL that creates and revokes a credential, and the TTLs. |
| `secret:IssueDynamicCredential` | Obtain one on-demand credential from a role, and revoke one. Does **not** imply any ability to read the role's administrative connection string. |
| `secret:Encrypt` | Seal a plaintext under a transit key and receive a ciphertext token. Recovers nothing on its own. |
| `secret:Decrypt` | Recover a plaintext from a transit ciphertext token. Audited on every use, like a reveal. |
| `secret:ManageTransitKey` | Create, rotate, update, and delete transit keys. Key *lifecycle*, never key material — there is no export operation to grant. |
| `secret:ManageLease` | Set and clear a secret's lease policy, and revoke outstanding leases. **Not** required in order to read a leased secret. |
| `secret:Admin` | Blanket. Implies every permission above. It does **not** widen resource scope. |

These eighteen are the whole vocabulary. A standalone operator registers them by hand; Core registers exactly the same eighteen when it provisions the service. See [Registering the permissions in Auth](#registering-the-permissions-in-auth).

### Why Dynamic, Transit, And Lease Actions Are Split The Way They Are

Each split exists to keep a blast radius small, and collapsing any of them would undo the feature it belongs to.

**Configuring a dynamic role is not issuing from one.** Whoever holds `ManageDynamicRole` writes the SQL that decides what every credential issued from that role can do — a privileged, reviewable act. `IssueDynamicCredential` only asks for the short-lived account that configuration already described, which is why it is deliberately open to **service** principals: a workload fetching its own database credential at boot *is* the feature, and demanding a human there would push consumers back onto a shared static password. The blast radius is bounded by the MRN grant (which roles) and by the role's creation template (what the credential can do) — not by the caller's class.

**Encrypt is not Decrypt.** A write-only workload — an ingest path that stores encrypted fields and never reads them back — can hold `Encrypt` alone. If the two were one permission, every service that *writes* an encrypted column could also *read* every encrypted column. That is the same mistake as folding `ReadMetadata` into `GetSecret`.

**A lease is not authorization.** Reading a leased secret still requires `secret:GetSecret`; `ManageLease` is the administrative grant that decides *how much* reading an already-authorized principal may do. Requiring both to read would make every leased secret unreadable by exactly the consumers the lease was written for.

### `secret:Admin`

`secret:Admin` is declared as a blanket action, so a principal holding it satisfies every required action. It does not widen the resource side of a grant: an admin grant written for one tenant is still confined to that tenant's MRNs. That is what makes "administrator of the `acme` tenant" a thing that can exist at all.

A blanket action is the service's own vocabulary rather than the platform's, so the SDK learns it from Secret's table. It is the **only** blanket action this service declares — a second one would be a second key to the whole vault.

### Browse Versus Reveal

`secret:ReadMetadata` and `secret:GetSecret` are deliberately **different privileges**, and the split is a requirement rather than a nicety.

Browsing metadata — which secrets exist, when they were rotated, what they are for — is what an engineer needs to operate a system, and it is safe to hand out broadly. Revealing a value is seeing the production database password. Collapsing the two would mean every principal who can render a console page can also exfiltrate every credential on it, and the audit trail could no longer distinguish "who looked at the list" from "who read the value" during an incident review.

The audit trail keeps them apart too: `secret.read` and `secret.reveal` are distinct actions.

## Service Access Versus Console Access

A permission answers *"may this principal do X?"*. It cannot answer *"should this class of caller be doing X at all?"* — and that second question is the one that catches a **stolen machine-to-machine credential**. Its grants are real, so no permission check will refuse it. But a workload creating a project, rewiring a webhook, destroying a secret, or reading the audit trail is, by itself, the signal.

So every surface also declares an **actor class**, checked alongside the permission and never instead of it.

| Actor class | Accepts | Used for |
|---|---|---|
| `any` | Every authenticated caller | Reveal, describe, list, and the ordinary write, rotate, and delete of a secret a workload owns. Both a workload and a console operator legitimately do these. |
| `user-only` | Only a caller classified as a human | The administrative surfaces: setup, audit, destroy, restore, and project, environment, folder, webhook, and rotation-policy management. |

Secret declares no `service-only` surface. The SDK supports one; this service has no path a human is forbidden from driving.

### How A Caller Is Classified

The class is derived from the **verified claims** on the token, never from anything the caller supplies alongside it. Auth stamps the claims; Secret reads them.

| Token carries | Classified as | Why |
|---|---|---|
| An `svc` claim | **Service** | Auth stamps `svc` only for a client bound to a registered service identity, and it is a reserved claim, so a client-configured claim mapper cannot forge one. It is the single most reliable marker of an m2m caller. |
| `sub_type` of `service`, `client`, or `exchange` | **Service** | A service-bound client, a bare `client_credentials` client, and an RFC 8693 token exchange where the actor is a delegating client. |
| `sub_type` of `user`, `device`, or `ciba` | **User** | A person: stamped explicitly, approving on a second screen (RFC 8628), or approving out of band (OIDC CIBA). |
| Any other non-empty `sub_type` | **Service** | A flow the SDK does not recognise. Treating an unknown flow as a human is the direction that opens a user-only administrative surface, so it does not. |
| Neither `svc` nor `sub_type` | **User** | **This is the rule that needs the argument.** Auth does *not* stamp `sub_type` on the interactive authorization-code + PKCE login the consoles use, while every machine path it has does stamp something. So "neither claim present" is not an unknown caller — it is the shape of an interactive login. |

A service that mints its own tokens some other way must classify its principal itself. **An unclassified caller is refused by every constrained surface**, which is the fail-closed direction: "we could not classify this caller" is not a reason to admit it to a surface somebody deliberately restricted.

The same classification is written to the `actor_kind` column of every audit row — including denials — so an incident review can tell a human reading a value from a workload reading it.

### Why An m2m Token Is Refused On An Administrative Surface

The two classes reach this vault through entirely different trust contexts. A human arrived through an interactive OAuth2 authorization-code + PKCE flow with a browser session behind it. A workload arrived m2m with a long-lived client credential deployed next to it. The two are compromised in different ways, and a grant list cannot express the difference: a workload's token legitimately carries broad grants precisely because nobody is sitting behind it to be phished.

The deliberate choices worth knowing:

- **Reveal, describe, list, and bulk are open to both classes.** A workload fetching its own secrets is the core machine-to-machine case, and it is what this service exists for.
- **Writes and rotation are open to services too**, and that is a decision rather than an omission. A rotator replacing the credential it manages, or a reconciler converging an environment it owns, is a first-class case. The blast radius is bounded by the **MRN grant**, not by the caller's class: a service principal can only write what its grant names. Restricting writes to humans would push rotation back into a person's hands, which is the outcome a secret store exists to remove.
- **Restore and destroy are user-only** because both authorize at **tenant** scope — the target's project and environment are not known until the deleted row is read — so they need a grant far wider than any single workload's. Destroy is additionally irreversible. Both are recovery-desk operations a human drives from the console.
- **The audit trail is user-only on both verbs.** It is the record an incident review reads, and a workload reading it is reconnaissance rather than work.

### Reading A Denial

The actor check runs **before** the permission check, so a caller that has no business on the surface never receives the permission-shaped refusal that names the exact grant it would need.

| Code | Meaning | What to do |
|---|---|---|
| `actor_kind_not_permitted` | The **class** is wrong — a service principal on a user-only surface. | Do not widen a grant. Either the client is misconfigured (a console flow using a machine credential), or an m2m credential is being driven somewhere it should not be. |
| `insufficient_permission` | The class is fine; the principal lacks the grant. | Grant the named permission, narrowed to the MRN it needs. |
| `no_permission_mapping` | The surface is not in the allowlist. | Nothing to grant — see [The allowlist property](#the-allowlist-property). |
| `missing_token` / `invalid_token` | `401`. Deliberately generic about *which* check failed. | Compare the token's `iss` and `aud` against the boot log. |
| `auth_unavailable` | `503`. The guard has no identity configuration. | See [Run modes](#run-modes). |

The HTTP status stays `403` and the gRPC code stays `PermissionDenied` for both of the first two, deliberately: the reason differs but the answer does not, and a distinct status would tell a caller probing the surface *why* it was refused. The distinction lives in the stable `code` field and the audit row, which operators read and attackers do not.

## REST Routes

Every route below is declared with the permission its operation performs and the class of caller allowed to reach it. Where a handler enforces **more** than one permission, the table names the primary one the route guard demands and the secondary one the operation layer checks against the concrete target — see [Permissions enforced deeper](#permissions-enforced-deeper).

### Secrets And Bulk

These two segments carry a listing, a metadata read, a write, a reveal, a rollback, a rotation, a delete, and a destroy. They are declared **route by route**, and they are **not in the segment table at all**.

That is strictly stronger than a baseline. A segment pair can only ever be as strong as the weakest route on the segment, because one pair guards them all. With the segments removed entirely, a new handler mounted beside these matches no exact entry and no segment pair, so it is **unmapped and denied to every caller** rather than inheriting a weak permission.

| Method and path | Permission | Actor | Also enforced deeper |
|---|---|---|---|
| `GET /api/v1/secrets` | `secret:ListSecrets` | any | — |
| `GET /api/v1/secrets/deleted` | `secret:ListSecrets` | any | — |
| `GET /api/v1/secrets/describe` | `secret:ReadMetadata` | any | — |
| `GET /api/v1/secrets/versions` | `secret:ReadMetadata` | any | — |
| `POST /api/v1/secrets/reveal` | `secret:GetSecret` | any | — |
| `POST /api/v1/secrets` | `secret:PutSecret` | any | — |
| `PATCH /api/v1/secrets` | `secret:PutSecret` | any | — |
| `POST /api/v1/secrets/rollback` | `secret:PutSecret` | any | `secret:GetSecret` |
| `POST /api/v1/secrets/rotate` | `secret:RotateSecret` | any | — |
| `POST /api/v1/secrets/delete` | `secret:DeleteSecret` | any | — |
| `POST /api/v1/secrets/restore` | `secret:DeleteSecret` | **user-only** | — |
| `POST /api/v1/secrets/destroy` | `secret:DeleteSecret` | **user-only** | — |
| `POST /api/v1/secrets/rotation-policy` | `secret:ManageRotation` | **user-only** | — |
| `POST /api/v1/bulk/get` | `secret:GetSecret` | any | Every item, on its own MRN |
| `POST /api/v1/bulk/put` | `secret:PutSecret` | any | Every item, on its own MRN |
| `GET /api/v1/secrets/lease-policy` | `secret:ReadMetadata` | any | — |
| `GET /api/v1/secrets/leases` | `secret:ReadMetadata` | any | — |
| `POST /api/v1/secrets/lease-policy` | `secret:ManageLease` | **user-only** | — |
| `POST /api/v1/secrets/leases/revoke` | `secret:ManageLease` | **user-only** | — |

### Transit

| Route | Permission | Actor | Also enforced deeper |
|---|---|---|---|
| `GET /api/v1/transit` | `secret:ReadMetadata` | any | — |
| `GET /api/v1/transit/describe` | `secret:ReadMetadata` | any | — |
| `GET /api/v1/transit/versions` | `secret:ReadMetadata` | any | — |
| `POST /api/v1/transit` | `secret:ManageTransitKey` | **user-only** | — |
| `PATCH /api/v1/transit` | `secret:ManageTransitKey` | **user-only** | — |
| `DELETE /api/v1/transit` | `secret:ManageTransitKey` | **user-only** | — |
| `POST /api/v1/transit/rotate` | `secret:ManageTransitKey` | **user-only** | — |
| `POST /api/v1/transit/encrypt` | `secret:Encrypt` | any | — |
| `POST /api/v1/transit/decrypt` | `secret:Decrypt` | any | Authorized against the **token's** key |

### Dynamic credentials

| Route | Permission | Actor | Also enforced deeper |
|---|---|---|---|
| `GET /api/v1/dynamic` | `secret:ReadMetadata` | any | — |
| `GET /api/v1/dynamic/describe` | `secret:ReadMetadata` | any | — |
| `GET /api/v1/dynamic/leases` | `secret:ReadMetadata` | any | — |
| `POST /api/v1/dynamic` | `secret:ManageDynamicRole` | **user-only** | — |
| `PATCH /api/v1/dynamic` | `secret:ManageDynamicRole` | **user-only** | — |
| `DELETE /api/v1/dynamic` | `secret:ManageDynamicRole` | **user-only** | Refused while any lease is outstanding |
| `POST /api/v1/dynamic/credentials` | `secret:IssueDynamicCredential` | any | — |
| `POST /api/v1/dynamic/credentials/revoke` | `secret:IssueDynamicCredential` | any | — |

A few rows are worth reading twice.

**Transit decrypt is authorized against the token's key, not the project.** The ciphertext token names the key that sealed it, and that name is what the permission check resolves — otherwise a grant on one key in a project would open every ciphertext in it. The service then resolves the same name inside the caller's own tenant and rebuilds the binding from the row it found, so the key checked is the key opened.

**Revoking a dynamic credential takes the issue grant, not the management grant.** A workload handing back the credential it asked for is the ordinary end of the lifecycle. Putting revocation behind `ManageDynamicRole` would mean the only principal able to clean up is one no workload holds, so credentials would be left to expire instead of being returned — and revoking early is strictly the safe direction. The store is idempotent on an already-revoked lease, so a retry reports success rather than a conflict: making the safe action look like a failure teaches callers not to take it.

**Deleting a dynamic role is refused while credentials are outstanding.** The revocation template is the only thing that can drop the accounts issued from that role, so removing the config first would strand every one of them permanently.

**Issuing is a write, and it is audited before the credential is returned.** If the audit row cannot be written the account that was just created is **dropped** and the lease closed. Returning it would leave a live account nobody can prove was issued; returning an error and leaving it up would leave one nobody knows to revoke.

**Neither `IssueDynamicCredential` nor anything else exposes the target DSN.** A role config holds a secret *reference* to the administrative connection string, resolved internally at issue time and returned by no path. That is the point of a credential broker: requiring the caller to be able to read the admin DSN would mean every consumer held the admin DSN, which is the situation dynamic secrets exist to end.

**Listing is not describing.** `GET /api/v1/secrets` authorizes a whole **scope** against the folder's MRN, which is a broader capability than describing one secret whose name you already know — hence `secret:ListSecrets` rather than `secret:ReadMetadata`.

**Version history is metadata.** It returns version numbers, wrapping key ids, and checksums, never payloads. Browsing it must never be a way to pull every value a credential has ever held.

**Reveal and batch get are `POST` requests carrying reads.** A secret's address in a URL ends up in access logs, proxy logs, browser history, and referer headers; a body does not. That was never an argument for a weak permission — it was an argument against *deriving* the permission from the HTTP verb, which is exactly what declaring the route exactly settles.

**A batch is a transport optimisation, not a weaker operation.** The route guard is the floor; every item is additionally authorized on its own MRN inside the service. A batch that checked once against the scope would be the easiest way to turn a narrow grant into a broad one.

**A soft delete is open to both classes** — it opens a recovery window and is scoped to the target's own MRN, so a workload decommissioning a secret it owns is legitimate. Restore and destroy are not; see [above](#why-an-m2m-token-is-refused-on-an-administrative-surface).

### Hierarchy, Webhooks, And Audit

These segments genuinely are "browse these, manage these", so one read permission and one write permission say everything true about the whole noun. They are declared as segment pairs keyed by the **first path segment** under `/api/v1`: `GET` and `HEAD` require the read rule, every other verb the write rule.

| Segment | Read (`GET`/`HEAD`) | Write (everything else) |
|---|---|---|
| `/projects` | `secret:ReadMetadata` · any | `secret:ManageProject` · **user-only** |
| `/environments` | `secret:ReadMetadata` · any | `secret:ManageEnvironment` · **user-only** |
| `/folders` | `secret:ReadMetadata` · any | `secret:ManageFolder` · **user-only** |
| `/imports` | `secret:ReadMetadata` · any | `secret:ManageFolder` · **user-only** |
| `/webhooks` | `secret:ReadMetadata` · any | `secret:ManageRotation` · **user-only** |
| `/audit` | `secret:ReadAudit` · **user-only** | `secret:Admin` · **user-only** † |

† There is no write route on `/audit` today. The pair keeps the answer ready for one that is added.

The reads stay open to either class — a workload resolving its own scope legitimately browses the hierarchy. The writes are user-only: creating a project, moving a folder, and rewiring a webhook are administrative acts a human performs from the console.

The routes those pairs cover, in full:

| Method and path | Permission | Actor | Also enforced deeper |
|---|---|---|---|
| `GET /api/v1/projects` | `secret:ReadMetadata` | any | — |
| `GET /api/v1/projects/{project}` | `secret:ReadMetadata` | any | — |
| `POST /api/v1/projects` | `secret:ManageProject` | **user-only** | — |
| `PATCH /api/v1/projects/{project}` | `secret:ManageProject` | **user-only** | — |
| `DELETE /api/v1/projects/{project}` | `secret:ManageProject` | **user-only** | — |
| `GET /api/v1/environments` | `secret:ReadMetadata` | any | — |
| `GET /api/v1/environments/{project}/{environment}` | `secret:ReadMetadata` | any | — |
| `POST /api/v1/environments` | `secret:ManageEnvironment` | **user-only** | — |
| `PATCH /api/v1/environments/{project}/{environment}` | `secret:ManageEnvironment` | **user-only** | — |
| `DELETE /api/v1/environments/{project}/{environment}` | `secret:ManageEnvironment` | **user-only** | — |
| `GET /api/v1/folders` | `secret:ReadMetadata` | any | — |
| `POST /api/v1/folders` | `secret:ManageFolder` | **user-only** | — |
| `POST /api/v1/folders/move` | `secret:ManageFolder` | **user-only** | `secret:ManageFolder` on **both** the source and the destination |
| `DELETE /api/v1/folders` | `secret:ManageFolder` | **user-only** | `secret:DeleteSecret` |
| `GET /api/v1/imports` | `secret:ReadMetadata` | any | — |
| `POST /api/v1/imports` | `secret:ManageFolder` | **user-only** | `secret:GetSecret` on the **source** scope |
| `PATCH /api/v1/imports/{importUUID}` | `secret:ManageFolder` | **user-only** | — |
| `DELETE /api/v1/imports/{importUUID}` | `secret:ManageFolder` | **user-only** | — |
| `GET /api/v1/webhooks` | `secret:ReadMetadata` | any | — |
| `GET /api/v1/webhooks/{endpointUUID}/deliveries` | `secret:ReadMetadata` | any | — |
| `POST /api/v1/webhooks` | `secret:ManageRotation` | **user-only** | — |
| `PATCH /api/v1/webhooks/{endpointUUID}` | `secret:ManageRotation` | **user-only** | — |
| `DELETE /api/v1/webhooks/{endpointUUID}` | `secret:ManageRotation` | **user-only** | — |
| `GET /api/v1/audit` | `secret:ReadAudit` | **user-only** | — |

`/api/v1/setup` and `/setup/status`, and the `/healthz` and `/readyz` probes, are served with no permission check at all — see [Exemptions](#exemptions).

Path segments are flat rather than nested precisely so this allowlist is meaningful: with everything nested under `/projects`, one entry would cover the whole API and the allowlist would be a single row saying "yes".

## gRPC Methods

The method table is keyed by the **full method name**, matched exactly, and it is the mirror of the REST surface. The two transports are thin adapters over one service, so a constraint that held on one and not the other would be no constraint at all — a caller refused over REST would simply open a gRPC channel. A test asserts the two agree surface by surface.

`maintainerd.secret.v1.SecretService`:

| Method | Permission | Actor | Also enforced deeper |
|---|---|---|---|
| `Put` | `secret:PutSecret` | any | — |
| `Get` | `secret:GetSecret` | any | — |
| `List` | `secret:ListSecrets` | any | — |
| `Delete` | `secret:DeleteSecret` | any | — |
| `GetSecret` | `secret:GetSecret` | any | — |
| `DescribeSecret` | `secret:ReadMetadata` | any | — |
| `ListSecrets` | `secret:ListSecrets` | any | — |
| `ListSecretVersions` | `secret:ReadMetadata` | any | — |
| `ListDeletedSecrets` | `secret:ListSecrets` | any | — |
| `PutSecret` | `secret:PutSecret` | any | — |
| `UpdateSecretMetadata` | `secret:PutSecret` | any | — |
| `RollbackSecret` | `secret:PutSecret` | any | `secret:GetSecret` |
| `RotateSecret` | `secret:RotateSecret` | any | — |
| `DeleteSecret` | `secret:DeleteSecret` | any | — |
| `RestoreSecret` | `secret:DeleteSecret` | **user-only** | — |
| `DestroySecret` | `secret:DeleteSecret` | **user-only** | — |
| `SetRotationPolicy` | `secret:ManageRotation` | **user-only** | — |
| `BatchGetSecrets` | `secret:GetSecret` | any | Every item, on its own MRN |
| `BatchPutSecrets` | `secret:PutSecret` | any | Every item, on its own MRN |
| `ListProjects` · `GetProject` | `secret:ReadMetadata` | any | — |
| `CreateProject` · `UpdateProject` · `DeleteProject` | `secret:ManageProject` | **user-only** | — |
| `ListEnvironments` · `GetEnvironment` | `secret:ReadMetadata` | any | — |
| `CreateEnvironment` · `UpdateEnvironment` · `DeleteEnvironment` | `secret:ManageEnvironment` | **user-only** | — |
| `ListFolders` | `secret:ReadMetadata` | any | — |
| `CreateFolder` · `MoveFolder` | `secret:ManageFolder` | **user-only** | — |
| `DeleteFolder` | `secret:ManageFolder` | **user-only** | `secret:DeleteSecret` |
| `ListImports` | `secret:ReadMetadata` | any | — |
| `CreateImport` | `secret:ManageFolder` | **user-only** | `secret:GetSecret` on the **source** scope |
| `UpdateImport` · `DeleteImport` | `secret:ManageFolder` | **user-only** | — |
| `ListWebhookEndpoints` · `ListWebhookDeliveries` | `secret:ReadMetadata` | any | — |
| `CreateWebhookEndpoint` · `UpdateWebhookEndpoint` · `DeleteWebhookEndpoint` | `secret:ManageRotation` | **user-only** | — |
| `ListAuditEvents` | `secret:ReadAudit` | **user-only** | — |
| `Ping` · `Setup` | *exempt* ‡ | — | — |

`maintainerd.secret.v1.SetupService` — `GetSetupStatus`, `Setup`, and `CompleteSetup` — is *exempt* ‡.

‡ See [Exemptions](#exemptions).

The four flat-key methods `Put`, `Get`, `List`, and `Delete` are the legacy surface the kit's secret-provider client uses. Their permissions are the real ones for the operation, not a compatibility exemption: an old client with a token that cannot read secrets could never read them through the old RPC either. The legacy flat `Get` calls the reveal path, so it demands `secret:GetSecret`.

## Permissions Enforced Deeper

The surface guard demands the primary permission. The operation layer then authorizes against the concrete target's MRN — and for three operations it demands a **second** permission, because the operation reaches further than its primary permission describes.

| Operation | Route guard demands | Operation layer additionally demands | Why |
|---|---|---|---|
| Roll back a secret | `secret:PutSecret` | `secret:GetSecret` on the secret | A rollback republishes a value the caller did not supply. A principal that may write but not read could otherwise use it as a read primitive — write a known value, roll back, and compare version checksums to learn what the old value was. |
| Delete a folder | `secret:ManageFolder` | `secret:DeleteSecret` on the folder | Deleting a folder deletes the secrets under it. Folder management alone must not be a way to delete values. |
| Create a scope import | `secret:ManageFolder` on the target | `secret:GetSecret` on the **source** scope | An import makes another scope's values readable through this one, so creating it must require the ability to read them. |

Two more per-operation properties, which are not second permissions but are checked the same way:

- **Moving a folder** requires `secret:ManageFolder` against **both** the source and the destination MRN.
- **A reference chain re-checks `secret:GetSecret` at every hop**, against the target's MRN. A reference cannot become a privilege-escalation path.

Every permission the operation layer can demand is still registered in Auth. That property has to hold even for a permission that has no route of its own — otherwise the deeper check would demand something no token could ever carry, and the failure would be a `403` with nothing in any log explaining it.

The MRN each operation authorizes against:

| Operation | Checked against |
|---|---|
| Reveal, describe, put, update metadata, roll back, rotate, delete, restore, destroy | The secret's MRN (resolved before it exists, for a create) |
| Resolve a reference hop | The **target's** MRN, at every hop |
| List secrets in a folder | The folder's MRN |
| List deleted secrets, restore, destroy | Tenant scope — the project and environment are unknown until the row is read |
| Set a rotation policy | The secret's MRN |
| Project operations | The project's MRN |
| Environment operations | The environment's MRN |
| Folder operations | The folder's MRN (a move: both source and destination) |
| Import operations | The import's MRN; a create additionally the source scope's |
| Webhook operations | The endpoint or collection MRN |
| Read the audit trail | The tenant's audit MRN |

Reading the audit trail is itself audited. The first move of an attacker who has read a credential is to find out what the trail says about it, so "who read the audit log" is a first-class signal.

Every denial writes an audit row — carrying the actor kind — before the error is returned. A denied attempt is the most interesting row in the table.

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

Both claim shapes Auth can mint are read — the space-separated `scope` string and the `permissions` array. Reading only one would be a silent half-outage, where every token minted in the other shape authorizes nothing.

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
secret:GetSecret=mrn:secret:acme:billing-app:secret/prod/db/primary/*
```

A workload that may read exactly the secrets under one path, and nothing else. This is the shape a machine grant should have — the actor class lets an m2m token onto the reveal path, and the MRN pattern is what bounds it once it is there.

```text
secret:PutSecret=mrn:secret:acme:billing-app:secret/prod/db/primary/PASSWORD
secret:GetSecret=mrn:secret:acme:billing-app:secret/prod/db/primary/PASSWORD
secret:RotateSecret=mrn:secret:acme:billing-app:secret/prod/db/primary/PASSWORD
```

A rotator: it may replace exactly the credential it manages, and read it back. Writes and rotation are open to service principals precisely so this can be a workload rather than a person, and the grant — not the caller's class — is what keeps it to one secret.

```text
secret:ReadAudit=mrn:secret:acme::audit
```

Read tenant `acme`'s access trail. A **user** principal only: `/audit` and `ListAuditEvents` refuse a service principal whatever its grants say.

```text
secret:Admin=mrn:secret:acme:*:*
```

Every action, confined to tenant `acme`. `secret:Admin` widens the action side, never the resource side — and it does not lift an actor constraint either. An m2m token holding `secret:Admin` still cannot create a project.

## Exemptions

Eleven surfaces — four HTTP routes and seven RPCs — are served with **no permission check**, and every one carries its own gate.

| Surface | Why it cannot be token-guarded | What guards it instead |
|---|---|---|
| `GET /healthz` | An orchestrator must be able to probe before it holds a credential. | Discloses the literal string `ok`. |
| `GET /readyz` | Same. | Discloses a dependency *name* (`database`, `auth`) — never an address, driver message, or version. |
| `POST /api/v1/setup` and `GET /api/v1/setup/status` | Provisioning is what makes tokens mintable at all, so it must work **before** Auth exists. | `SETUP_BOOTSTRAP_TOKEN` compared in constant time, rate-limited per client IP, and refused entirely once an orchestrator owns the instance (or when `MAINTAINERD_MODE=core` declares one will). Anonymous status returns **one bit**. |
| `grpc.health.v1.Health/Check` and `/Watch` | As `/healthz`. | The standard health protocol leaks nothing beyond "serving". `Watch` is server-streaming, which is why the stream interceptor is installed as well as the unary one. |
| `SecretService/Ping` | An orchestrator has to ask "is this provisioned yet" before provisioning the thing that mints tokens. | Answers `{ok, setup_complete}` and nothing else. |
| `SecretService/Setup` | The legacy flat-surface first-run RPC. | Bootstrap token, constant-time compare. |
| `SetupService/GetSetupStatus`, `/Setup`, `/CompleteSetup` | The controlled first-run surface. | The `x-setup-token` metadata header, constant-time compare. The full status payload additionally requires the token or `secret:Admin`. |

Exemptions are matched **exactly** for gRPC — never by service prefix — and on a **segment boundary** for HTTP. So a new RPC added to `SetupService`, or a route named `/api/v1/setup-admin`, fails closed rather than inheriting a neighbour's exemption.

The two HTTP probes are also mounted outside the `/api/v1` group the guard wraps, so they are exempt by construction as well as by declaration.

Every exemption has a written justification in a test file, and the test fails if the two lists are not the same set. Adding an unguarded surface requires writing down why, where a reviewer reads it.

### Server Reflection

gRPC server reflection is **neither mapped nor exempt**. That combination is deliberate: an unmapped surface is denied by the allowlist when authorization is enforced, and reachable only in development-open mode, where the guard admits every caller before it consults the table.

Reflection enumerates every RPC and message in the service — useful with `grpcurl` on a laptop, a map of the vault's API in production. The bootstrap additionally registers the reflection service only in development, so in production there is nothing behind the door either.

## The Allowlist Property

The route and method tables **are** the allowlist. A surface that is not in them and not exempt is denied — to a valid token as much as to an anonymous caller.

That means the service cannot grow an unguarded endpoint by accident. Mounting a route or registering an RPC without deciding its permission fails **closed** instead of shipping open. A forgotten route is the failure mode that actually ships, because it does not throw, does not log, and does not look wrong in review — it looks like a handler.

Dropping `/secrets` and `/bulk` from the segment table strengthens this. A new handler mounted beside a declared route now matches nothing, so it is denied outright rather than inheriting a neighbour's permission.

A gap-audit test converts that runtime property into a build-time one. It:

1. Builds the real router the service mounts and walks it.
2. Flattens the generated gRPC service descriptors the server dispatches on — unary methods **and** streams, because streams dispatch through a different interceptor chain and a unary-only guard never sees them.
3. Requires every surface to resolve to **exactly** the permission and actor class written down for it in a specification table, or to be covered by an exemption with a **written justification**.
4. Refuses to let a surface whose handler **mutates** be guarded by a read-only permission (`ReadMetadata`, `ListSecrets`, `ReadAudit`). A read-only grant is the one an operator hands out broadly, precisely because it cannot change anything.
5. Checks the reverse direction: no specification row and no mapped surface that nothing serves. Dead weight is what makes an authorization table stop being read.
6. Checks that the two transports agree, surface by surface, on both the permission and the actor class.
7. Checks itself for vacuity, by requiring surfaces that do not exist to read as gaps.

The specification table is written **independently** of the enforcement table — each row derived by reading the handler, following it to the service method, and recording what that method actually demands. A table that merely restated the enforcement map would pass forever and prove nothing.

Both surface lists are derived from the live surface, never hand-kept, because a hand-kept list drifts silently and a test that has stopped reading the surface is worse than no test: it reports "no gaps" with confidence.

## Registering The Permissions In Auth

The guard demands these exact strings, and Auth must know them or no token can carry them. Registration and enforcement are two halves of one fact, and when they drift the failure is silent and total: every call using the missing permission answers `403` regardless of who makes it, with nothing in any log saying why.

The list Secret *reports* is **derived from the enforcement table** rather than hand-listed somewhere else, so a permission the guard can demand is a permission the service declares — including one that only ever appears as a second, deeper check.

| Mode | Who registers them |
|---|---|
| Standalone | You do, by hand, on the resource API. See [Standalone setup](#standalone-setup) step 3. |
| Core-attached | Core registers the same eighteen from its catalog when it provisions the service. See [Run modes](#run-modes). |

The two lists are the same eighteen, so an instance that moves between modes demands and receives the same vocabulary. Core cannot import Secret's package — Secret is optional and independently released — so its catalog is kept in step by review rather than by the compiler. If a core-provisioned install answers `403` on one whole area of the console, that is the drift to check first.

A running instance reports the enforced list — derived from the code that enforces it — at `GET /api/v1/setup/status`, with the setup token or a verified `secret:Admin` grant. **If a document and that endpoint ever disagree, the endpoint is right.**
