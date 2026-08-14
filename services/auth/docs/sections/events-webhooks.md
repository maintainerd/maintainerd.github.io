# Events & Webhooks

Events and webhooks let downstream systems react when Auth changes identity, tenant, client, service, API, role, permission, policy, session, or token state.

Use this section when an external application needs to receive notifications from Auth. For example, a billing system can learn that a tenant was created, a CRM can learn that a user was added, or a protected API can refresh cached permissions after a role changes.

Auth sends integration events through a transactional outbox. That means the event is written with the business change, then a background relay delivers it to subscribed webhook endpoints and, when configured, to RabbitMQ. Delivery is at least once and unordered, so receivers must deduplicate and fetch current state when they need full details.

Integration events are not audit logs and they are not full data exports. They are compact, signed notifications designed for system-to-system workflows. Audit concepts are documented in [Audit events](#audit). Deployment-level broker setup is documented in [Deployment](#deployment).

## Webhooks, Broker Events, And Audit Logs

Auth has three event-related concepts that serve different jobs:

| Feature | Purpose | Audience | Delivery |
|---|---|---|---|
| Integration events | Tell external systems that Auth state changed. | Application developers and platform integrators. | HTTPS webhooks and optional RabbitMQ messages. |
| Webhook delivery history | Show whether a webhook endpoint received an integration event. | Operators investigating integrations. | Console records inside Auth. |
| Audit events | Record security and administration activity for review. | Security, compliance, and administrators. | Audit views and retention workflows. |

Use integration events when another application must take action. Use audit events when a person needs to review who did what.

## Complete Event Catalog

This is the current Auth integration-event catalog. These are the event names you use when choosing webhook subscriptions or RabbitMQ routes.

Each event includes a `subject_uuid` when the changed resource has a public UUID. The `subject_type` tells the receiver what kind of record changed. Payloads stay thin; receivers should fetch current state when they need the full record.

### User Events

Use user events when an external system needs to provision access, sync account state, update directory records, or react to identity-link changes.

| Event Type | What Changed | Subject Type | Subscribe When |
|---|---|---|---|
| `user.created` | A user account was created. | `user` | Create a matching user record, provision default access, or start onboarding. |
| `user.updated` | User identity or profile fields changed. | `user` | Sync user profile, display name, email, phone, or other account metadata. |
| `user.status_changed` | User status changed, such as active, suspended, or locked. | `user` | Suspend downstream access, re-enable access, or notify security automation. |
| `user.deleted` | A user account was deleted. | `user` | Deprovision access, archive linked records, or remove user cache entries. |
| `user.role_assigned` | A role was assigned to a user. | `user` | Refresh authorization caches or grant application access. |
| `user.role_removed` | A role was removed from a user. | `user` | Refresh authorization caches or revoke application access. |
| `identity.linked` | An external identity was linked to a user. | `user` | Sync federation state or update account-linking records. |
| `identity.unlinked` | An external identity was removed from a user. | `user` | Remove federation links or alert when an identity provider connection changes. |

### Tenant Events

Use tenant events when billing, provisioning, support, CRM, or other business systems need to track organization lifecycle.

| Event Type | What Changed | Subject Type | Subscribe When |
|---|---|---|---|
| `tenant.created` | A tenant was created. | `tenant` | Create billing, support, provisioning, or workspace records. |
| `tenant.updated` | Tenant attributes changed. | `tenant` | Sync tenant name, slug, settings, or external account metadata. |
| `tenant.status_changed` | Tenant status changed, such as active or suspended. | `tenant` | Pause downstream access, resume service, or notify account operations. |
| `tenant.deleted` | A tenant was deleted. | `tenant` | Deprovision tenant resources and archive external records. |
| `tenant_member.added` | A user became a member of the tenant. | `tenant_member` | Sync membership into downstream tools or provision tenant-scoped access. |
| `tenant_member.removed` | A user was removed from the tenant. | `tenant_member` | Remove tenant-scoped access or update membership directories. |
| `tenant_member.ownership_transferred` | Tenant ownership moved to another member. | `tenant_member` | Update billing owner, support owner, approval owner, or escalation contacts. |

### IAM Events

Use IAM events when downstream APIs, gateways, policy engines, or caches need to react to authorization model changes.

| Event Type | What Changed | Subject Type | Subscribe When |
|---|---|---|---|
| `role.created` | A role was created. | `role` | Sync available roles or refresh role catalogs. |
| `role.updated` | A role's label, status, or metadata changed. | `role` | Refresh role displays, access tooling, or cached role metadata. |
| `role.deleted` | A role was deleted. | `role` | Remove role references and refresh authorization caches. |
| `role.permissions_changed` | A role's permission set changed. | `role` | Rebuild authorization decisions for users or clients using the role. |
| `permission.created` | A permission was created. | `permission` | Sync permission catalogs into policy or gateway tooling. |
| `permission.updated` | A permission definition changed. | `permission` | Refresh permission metadata and policy displays. |
| `permission.deleted` | A permission was deleted. | `permission` | Remove permission references and refresh policy caches. |
| `iam.policy.updated` | An IAM policy changed. | `policy` | Refresh policy engines or invalidate tenant authorization cache. |
| `policy.created` | A policy was created. | `policy` | Sync policy inventory into downstream systems. |
| `policy.deleted` | A policy was deleted. | `policy` | Remove policy references and refresh authorization cache. |
| `iam.service.policy.assigned` | A policy was attached to a service. | `service` | Refresh service authorization and service-to-service access. |
| `iam.service.policy.removed` | A policy was removed from a service. | `service` | Revoke service permissions and refresh service authorization. |

### Client Events

Use client events when external app inventory, compliance, or automation systems need to track OAuth/OIDC client changes.

| Event Type | What Changed | Subject Type | Subscribe When |
|---|---|---|---|
| `client.created` | An OAuth/OIDC client was created. | `client` | Sync application inventory or start downstream app setup. |
| `client.updated` | Client settings changed. | `client` | Refresh redirect URI, grant, scope, consent, or metadata inventory. |
| `client.deleted` | A client was deleted. | `client` | Remove app inventory and revoke downstream automation for the client. |
| `client.status_changed` | A client was enabled, disabled, or otherwise changed status. | `client` | Pause or resume downstream app access. |
| `client.secret_rotated` | A client secret was rotated. | `client` | Notify operations, refresh compliance evidence, or trigger secret rollout workflows. |

### Session And Token Events

Use session events when security automation or protected services need to react to revoked access.

| Event Type | What Changed | Subject Type | Subscribe When |
|---|---|---|---|
| `session.revoked` | A user session was revoked. | `session` | Clear downstream sessions or update security dashboards. |
| `token.revoked` | A token was revoked. | `token` | Update token denylist caches or notify protected services. |

### API Events

Use API events when gateways, policy engines, or service catalogs need to track protected API records.

| Event Type | What Changed | Subject Type | Subscribe When |
|---|---|---|---|
| `api.created` | A protected API record was created. | `api` | Register the API in gateway or policy tooling. |
| `api.updated` | API metadata or configuration changed. | `api` | Refresh gateway configuration or API catalog data. |
| `api.status_changed` | API status changed. | `api` | Enable, disable, or update downstream enforcement. |
| `api.deleted` | A protected API record was deleted. | `api` | Remove gateway or policy references. |

### Service Events

Use service events when platform automation tracks service principals or service records.

| Event Type | What Changed | Subject Type | Subscribe When |
|---|---|---|---|
| `service.created` | A service record or service principal was created. | `service` | Register the service in inventory or policy tooling. |
| `service.updated` | Service metadata or configuration changed. | `service` | Refresh service inventory and service authorization context. |
| `service.status_changed` | Service status changed. | `service` | Pause, resume, or update service-level automation. |
| `service.deleted` | A service record was deleted. | `service` | Remove service inventory and authorization references. |

## Which Events To Subscribe To

Choose the smallest event set that supports the receiver's job.

| Receiver | Recommended Events | Why |
|---|---|---|
| User directory sync | `user.created`, `user.updated`, `user.status_changed`, `user.deleted` | Keeps external user records aligned with Auth user lifecycle. |
| Application access sync | `user.role_assigned`, `user.role_removed`, `role.permissions_changed`, `iam.policy.updated` | Keeps app authorization aligned with Auth roles and policies. |
| Tenant provisioning | `tenant.created`, `tenant.updated`, `tenant.status_changed`, `tenant.deleted` | Creates, updates, suspends, or deprovisions tenant resources. |
| Tenant membership sync | `tenant_member.added`, `tenant_member.removed`, `tenant_member.ownership_transferred` | Keeps external tenant memberships and owners current. |
| OAuth client inventory | `client.created`, `client.updated`, `client.status_changed`, `client.secret_rotated`, `client.deleted` | Tracks relying-party applications and credential rotation. |
| API gateway configuration | `api.created`, `api.updated`, `api.status_changed`, `api.deleted`, `permission.created`, `permission.updated`, `permission.deleted`, `iam.policy.updated` | Refreshes routing and authorization enforcement. |
| Service authorization | `service.created`, `service.updated`, `service.status_changed`, `service.deleted`, `iam.service.policy.assigned`, `iam.service.policy.removed` | Keeps service principals and service policies current. |
| Security automation | `session.revoked`, `token.revoked`, `user.status_changed`, `identity.linked`, `identity.unlinked` | Reacts to revocation, account state changes, and federation changes. |

## What Events Are For

Use events when another system needs to react after Auth state changes.

Good use cases:

- Provision or deprovision application access when a user is created, deleted, suspended, or assigned a role.
- Clear authorization caches when roles, permissions, policies, APIs, or service access changes.
- Synchronize tenant lifecycle into billing, CRM, support, or data platforms.
- Notify security automation when sessions or tokens are revoked.
- Trigger operational workflows when a client, service, or API status changes.

Events are signals, not the source of truth. The payload is intentionally thin. It tells the receiver what changed, which tenant owns the change, and which resource changed. The receiver should use its own stored data or call Auth with proper credentials when it needs the latest full record.

## Where To Find It

In the console, open the tenant that owns the integration, then open **Events** or **Webhooks**.

The area usually contains:

- Event type catalog: the list of event names Auth can emit for the tenant.
- Tenant event type settings: tenant-level switches that enable or disable event emission.
- Webhook endpoint list: the HTTPS receivers configured for the tenant.
- Create webhook endpoint: the form for registering a receiver URL and delivery behavior.
- Endpoint detail: the endpoint URL, status, retry policy, timeout, and subscription mode.
- Endpoint status controls: active and inactive states, plus quarantine handling after repeated failures.
- Subscription controls: the exact event types an endpoint receives when it is not subscribed to everything.
- Delivery history: the attempt log for endpoint deliveries.
- Delivery replay: a recovery tool for sending an existing event again.
- Broker route configuration: RabbitMQ routing for tenants that consume events through a broker.

Only administrators with webhook and event-management permissions should configure this area. Normal end users do not create webhook endpoints.

## The Usual Setup Flow

A clean production setup normally follows this order:

1. Create or select the tenant that owns the integration.
2. Confirm the tenant's event type catalog is available.
3. Build the downstream HTTPS receiver.
4. Add signature verification to the receiver before any business logic.
5. Add durable deduplication keyed by `event_id`.
6. Decide which event types the receiver needs.
7. Create the webhook endpoint in Auth.
8. Store the signing secret returned by Auth.
9. Subscribe the endpoint to selected event types.
10. Trigger one safe change that emits a selected event.
11. Confirm delivery history shows the expected response.
12. Add monitoring for failed, pending, and dead-letter deliveries.

Do not start by enabling every event type. Start with the smallest set the receiving system can actually process.

## How Delivery Works

One Auth change can produce one integration event. The delivery path is:

1. A domain operation changes Auth state, such as updating a user or rotating a client secret.
2. Auth creates an integration event in the same database transaction.
3. The write gate checks whether the event type is active, whether the tenant has disabled that type, and whether at least one listener exists.
4. The event is stored in the outbox.
5. A relay claims unpublished outbox rows and delivers them independently to webhook endpoints and RabbitMQ routes.
6. For each matching webhook endpoint, Auth creates a delivery-history record.
7. Auth sends an HTTPS delivery to the endpoint with HMAC signature headers.
8. A response with status lower than 300 is treated as successful.
9. A failed delivery is retried according to the endpoint retry settings.
10. Repeated failures can move the endpoint to a quarantined state.

The original operation does not wait for every external receiver. Webhook and broker delivery happen in the background so Auth can remain responsive while downstream systems process events.

The write gate exists to avoid creating integration-event noise that has nowhere to go. An event is normally written only when the event type is active, the tenant has not disabled that type, and the tenant has at least one active listener. A listener can be a webhook endpoint or an enabled broker route.

Webhook delivery and broker delivery are independent arms of the same outbox row. A temporary RabbitMQ failure should not cause successful webhook fan-out to run again just because the broker arm still needs to publish. Each arm records completion separately, and the outbox row is fully published after both required arms are complete.

## Delivery Guarantees

Auth provides at-least-once delivery. A receiver can receive the same event more than once because of retries, replay, process restarts, network timeouts, or delivery uncertainty.

Auth does not guarantee ordering. Two events for the same subject can arrive out of order, especially when a receiver is slow or retries occur.

Receivers should:

- Deduplicate by `event_id`.
- Treat the event as a notification that something changed.
- Fetch the current state before making final decisions that depend on current data.
- Make processing idempotent.
- Return success only after the event has been safely stored or processed.
- Avoid relying on event order as the only correctness mechanism.

## Required Administrative Access

Webhook and event configuration is tenant-scoped.

The permissions used by the console are:

| Permission | Allows |
|---|---|
| `webhook-endpoint:read` | View event types, tenant event settings, webhook endpoints, endpoint subscriptions, delivery history, and broker routes. |
| `webhook-endpoint:create` | Create webhook endpoints and broker routes. |
| `webhook-endpoint:update` | Edit webhook endpoints, rotate signing secrets, activate or deactivate endpoints, change subscriptions, enable or disable tenant event types, update broker routes, and replay deliveries. |
| `webhook-endpoint:delete` | Delete webhook endpoints and broker routes. |

Use least privilege. A support operator who only investigates failed deliveries usually needs `webhook-endpoint:read`, not update or delete access. Operators who rotate secrets, replay deliveries, or change subscriptions need `webhook-endpoint:update`.

## Event Type Records

Event types are the named changes Auth can emit. The complete list is in [Complete event catalog](#complete-event-catalog).

In the console, each event type record shows:

- Key: stable event name, such as `user.updated`.
- Category: grouping used for browsing and filtering.
- Description: administrator-facing explanation.
- Version: payload version for that event type.
- Active status: whether Auth can emit that event type.
- Tenant setting: whether the selected tenant allows that event type.

Use the event type catalog before creating subscriptions. It shows the event types available for the selected tenant and helps administrators decide which events should be routed to each receiver.

## Tenant Event Type Settings

Tenant event type settings are the tenant-level master switches for event emission.

If an event type is disabled for the tenant, Auth should not persist or deliver that event for the tenant. This is different from a webhook subscription. Tenant event settings decide whether Auth emits the event at all. Webhook subscriptions decide which endpoints receive emitted events.

Event types are enabled by default unless the tenant has an explicit disabled setting for that event type. In practice, this means a new tenant can emit catalog events once it has an active listener, but an administrator can turn off noisy or unwanted event types per tenant.

Use tenant event settings when:

- A tenant does not use a category of integration events.
- A tenant wants to reduce downstream noise.
- A tenant wants to pause a category of integrations during maintenance.
- Operators need to prevent an event from reaching both webhook and broker listeners.

After changing tenant event settings, trigger a small safe change and review delivery history to confirm the intended behavior.

Example: disabling `user.updated` for a tenant prevents Auth from writing future `user.updated` outbox rows for that tenant. It does not delete old delivery-history records, and it does not stop other user events such as `user.created` unless those are disabled too.

## Create A Webhook Endpoint

A webhook endpoint represents one HTTPS receiver owned by a downstream system.

Before creating the endpoint, prepare:

- A stable HTTPS URL owned by the receiving application.
- A receiver that can parse the event envelope.
- Raw-body access for signature verification.
- Secure storage for the signing secret.
- Idempotent processing keyed by `event_id`.
- A decision about selected event types versus `subscribe_all`.
- Monitoring for failures and retry volume.

Example endpoint planning values:

```text
Receiver name:     CRM user sync
URL:               https://integrations.example.com/maintainerd/auth-events
Description:       Sync Auth user and tenant lifecycle into CRM
Subscriptions:     user.created, user.updated, tenant.created, tenant.updated
Timeout seconds:   10
Maximum retries:   5
Initial status:    active
```

Use one endpoint per receiving system. Create separate endpoints when systems have different owners, secrets, retry behavior, subscriptions, or incident response paths.

Each tenant can have up to 50 webhook endpoints. This keeps one tenant from creating an unbounded number of outbound delivery targets.

## Webhook Endpoint Fields

URL is the HTTPS address Auth delivers to. It must be reachable from the Auth deployment and must not point to private, loopback, link-local, multicast, unspecified, benchmarking, CGNAT, NAT64, or other blocked network destinations. Auth also validates the destination again at delivery time and on redirects.

Description explains who owns the receiver and what it does. Use a clear operational label, such as `Provisioning worker`, `Billing tenant sync`, or `Security event bridge`.

Status controls whether Auth sends deliveries. Active endpoints can receive events. Inactive endpoints do not receive new deliveries. Quarantined endpoints have been disabled automatically after sustained failures.

Subscribe all controls whether the endpoint receives all emitted event types. Use it only for broad event sinks that intentionally process every category.

Subscriptions list the exact event types the endpoint receives when `subscribe_all` is disabled.

Maximum retries controls how many retries Auth attempts after the first delivery attempt. The default is `3`, the minimum is `0`, and the maximum is `10`. For example, a value of `3` means Auth can try up to four total attempts: the first attempt plus three retries.

Timeout seconds controls how long Auth waits for the receiver to respond before treating an attempt as failed. The default is `30`, the minimum is `1`, and the maximum is `120`.

Signing secret is generated by Auth and returned when the endpoint is created or when the secret is rotated. Store it immediately in the receiver's secret manager. Auth does not show the existing secret again later.

Metadata can store operational labels for the endpoint. Do not store receiver secrets in metadata.

Recommended endpoint settings:

| Scenario | Subscribe All | Max Retries | Timeout Seconds | Notes |
|---|---:|---:|---:|---|
| User sync worker | No | 3-5 | 10-30 | Subscribe only to user and role assignment events. |
| Authorization cache invalidator | No | 3 | 5-10 | Keep the receiver fast; invalidate cache and return success. |
| Audit or analytics collector | Yes, only if intentionally broad | 5-10 | 10-30 | Store first, process asynchronously. |
| Critical provisioning workflow | No | 5-10 | 30-60 | Alert on dead letters and replay after outages. |
| Slow downstream processor | No | 3 | 5-10 | Accept quickly, enqueue internally, and process after responding. |

## Subscribe To Events

Subscriptions connect a webhook endpoint to event types.

Recommended process:

1. Open the endpoint.
2. Review whether `subscribe_all` is enabled.
3. If `subscribe_all` is disabled, open subscriptions.
4. Add each required event type.
5. Save the endpoint.
6. Trigger a safe change for one selected event type.
7. Confirm a delivery-history record appears.

Choose events based on what the receiver actually needs:

- User sync usually needs `user.created`, `user.updated`, `user.status_changed`, and `user.deleted`.
- Role or permission cache invalidation usually needs IAM and API events.
- Tenant provisioning usually needs tenant and tenant-member events.
- OAuth client inventory usually needs client events.
- Session or security automation usually needs session and token revocation events.

If the receiver needs full entity data, it should use the event identifiers to fetch the current record from Auth or its own application database.

Subscriptions are checked at delivery time for each active endpoint:

- If `subscribe_all` is enabled, the endpoint receives every emitted event for the tenant.
- If `subscribe_all` is disabled, the endpoint receives only the event types listed in its subscriptions.
- Subscriptions are tenant-isolated. An endpoint cannot subscribe to another tenant's event type.
- Removing a subscription stops future fan-out for that event type. It does not remove old delivery history.

## Delivery Headers

Each webhook delivery includes headers that identify the event and allow the receiver to verify the signature.

| Header | Meaning |
|---|---|
| `Content-Type` | `application/json`. |
| `X-Maintainerd-Event` | Event type, such as `user.updated`. |
| `X-Maintainerd-Event-Id` | Stable event ID. Retries and replays use the same event ID. |
| `X-Maintainerd-Delivery` | Delivery-history UUID for this endpoint delivery attempt record. |
| `X-Maintainerd-Attempt` | Attempt number for this delivery. |
| `X-Maintainerd-Timestamp` | Unix timestamp used when signing the delivery. |
| `X-Maintainerd-Signature-256` | HMAC-SHA256 signature in `sha256=<hex>` format. |

Use `X-Maintainerd-Event-Id` as the deduplication key. Use `X-Maintainerd-Delivery` when correlating with Auth delivery history.

## Webhook Payload Structure

Webhook deliveries use the same thin envelope as broker events.

Example delivery body:

```json
{
  "event_id": "9c8e0b3e-2c7b-4fc3-8e13-6c6b083e8f21",
  "event_type": "user.updated",
  "event_version": 1,
  "tenant_id": "770e8400-e29b-41d4-a716-446655440001",
  "actor_user_id": "880e8400-e29b-41d4-a716-446655440002",
  "subject_uuid": "1b9d6bcd-8f89-4b98-84a7-f0ef70cc7f8a",
  "subject_type": "user",
  "changed_fields": ["email", "status"],
  "payload": {},
  "occurred_at": "2026-06-06T10:15:30Z",
  "trace_id": "f7b1f95f0bb94416a9911f6d2fc8f1f4",
  "request_id": "req_01JZ9H6Z8Q6WBN9JZ9M3YAVK2P"
}
```

Fields:

| Field | Type | Meaning |
|---|---|---|
| `event_id` | UUID string | Stable ID for the event. Use it for deduplication. Retries and replays keep the same event ID. |
| `event_type` | String | Canonical event type, such as `client.secret_rotated`. Use it to route receiver logic. |
| `event_version` | Number | Event schema version. Current catalog starts at `1`. |
| `tenant_id` | UUID string | Public tenant UUID that owns the event. Receivers that handle multiple tenants should filter by this field. |
| `actor_user_id` | UUID string or `null` | Public user UUID for the user who triggered the change when Auth can identify one. It is `null` for system or service actions. |
| `subject_uuid` | UUID string or `null` | Public UUID of the resource that changed. Some system events may not have a single subject. |
| `subject_type` | String | Resource family, such as `user`, `tenant`, `client`, `role`, `permission`, `policy`, `api`, or `service`. |
| `changed_fields` | String array | Field names that changed. Values are not included. Empty means the event does not expose field-level detail. |
| `payload` | Object | Optional event metadata. It should not contain personal data, secrets, credentials, or full resource records. |
| `occurred_at` | ISO-8601 timestamp | Time Auth recorded the event. |
| `trace_id` | String | Trace correlation value when available. It may be empty. |
| `request_id` | String | Request correlation value when available. It may be empty. |

The payload is intentionally not a full object snapshot. For example, `user.updated` tells the receiver which user changed and which field names changed. It does not send the user's new email, status value, profile, roles, tokens, provider credentials, or secrets.

Auth must not expose internal database integer IDs in webhook or broker payloads. Public identifier fields use UUID strings. If a receiver ever sees a numeric `tenant_id`, `actor_user_id`, or resource identifier in an external event payload, treat it as a defect and stop relying on that payload until it is fixed.

## Verify The Signature

The receiver must verify every delivery before processing it.

Auth signs the raw body with the endpoint signing secret:

```text
signed_value = "{timestamp}.{raw_body}"
signature = "sha256=" + HMAC_SHA256(endpoint_secret, signed_value)
```

Receiver requirements:

- Read the exact raw request body bytes.
- Read `X-Maintainerd-Timestamp`.
- Read `X-Maintainerd-Signature-256`.
- Reject missing signature fields.
- Reject timestamps outside the receiver's replay window.
- Compute the expected HMAC using the stored endpoint secret.
- Compare signatures using a constant-time comparison.
- Deduplicate by `event_id` after signature verification.

Example receiver storage table:

```sql
CREATE TABLE maintainerd_webhook_events (
  event_id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  stored_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE maintainerd_webhook_jobs (
  job_id BIGSERIAL PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES maintainerd_webhook_events(event_id),
  job_type TEXT NOT NULL,
  subject_uuid UUID,
  tenant_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Example Node.js receiver using Express and PostgreSQL:

```js
import crypto from "node:crypto";
import express from "express";
import pg from "pg";

const app = express();
const { Pool } = pg;
const db = new Pool({ connectionString: process.env.DATABASE_URL });
const endpointSecret = process.env.MAINTAINERD_WEBHOOK_SECRET;
const expectedTenantId = process.env.MAINTAINERD_TENANT_ID;

app.use("/maintainerd/auth-events", express.raw({ type: "application/json" }));

app.post("/maintainerd/auth-events", async (req, res) => {
  const timestamp = req.header("X-Maintainerd-Timestamp");
  const signature = req.header("X-Maintainerd-Signature-256");

  if (!timestamp || !signature || !endpointSecret) {
    return res.sendStatus(401);
  }

  const timestampSeconds = Number(timestamp);
  const nowSeconds = Math.floor(Date.now() / 1000);

  if (!Number.isFinite(timestampSeconds) || Math.abs(nowSeconds - timestampSeconds) > 300) {
    return res.sendStatus(401);
  }

  const signedValue = Buffer.concat([
    Buffer.from(timestamp),
    Buffer.from("."),
    req.body
  ]);

  const expected = "sha256=" + crypto
    .createHmac("sha256", endpointSecret)
    .update(signedValue)
    .digest("hex");

  const receivedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  const valid = receivedBuffer.length === expectedBuffer.length
    && crypto.timingSafeEqual(receivedBuffer, expectedBuffer);

  if (!valid) {
    return res.sendStatus(401);
  }

  let event;
  try {
    event = JSON.parse(req.body.toString("utf8"));
  } catch {
    return res.sendStatus(400);
  }

  if (event.tenant_id !== expectedTenantId) {
    return res.sendStatus(403);
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      `INSERT INTO maintainerd_webhook_events
         (event_id, tenant_id, event_type, payload)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (event_id) DO NOTHING`,
      [event.event_id, event.tenant_id, event.event_type, event]
    );

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.sendStatus(204);
    }

    await processEvent(client, event);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("failed to store Maintainerd webhook event", error);
    return res.sendStatus(500);
  } finally {
    client.release();
  }

  return res.sendStatus(204);
});

async function processEvent(client, event) {
  switch (event.event_type) {
    case "user.created":
    case "user.updated":
    case "user.status_changed":
      await enqueueUserSync(client, event, event.subject_uuid);
      break;
    case "role.permissions_changed":
    case "iam.policy.updated":
      await enqueueAuthorizationCacheRefresh(client, event, event.tenant_id);
      break;
    default:
      break;
  }
}

async function enqueueUserSync(client, event, subjectUuid) {
  await client.query(
    `INSERT INTO maintainerd_webhook_jobs
       (event_id, job_type, subject_uuid, tenant_id)
     VALUES ($1, 'sync_user', $2, $3)`,
    [event.event_id, subjectUuid, event.tenant_id]
  );
}

async function enqueueAuthorizationCacheRefresh(client, event, tenantId) {
  await client.query(
    `INSERT INTO maintainerd_webhook_jobs
       (event_id, job_type, tenant_id)
     VALUES ($1, 'refresh_authorization_cache', $2)`,
    [event.event_id, tenantId]
  );
}
```

Store the endpoint secret outside the application source code. Rotate it from the Auth console if it may have been exposed. The route above must be reachable through the HTTPS URL registered on the webhook endpoint.

## Process Events Safely

Webhook receivers should follow this processing pattern:

1. Verify the signature.
2. Reject stale timestamps.
3. Parse the event envelope.
4. Deduplicate by `event_id`.
5. Confirm the `tenant_id` is one the receiver expects.
6. Confirm the `event_type` is one the receiver handles.
7. Store the event or processing marker before doing side effects.
8. Fetch current state when the receiver needs full data.
9. Execute idempotent business logic.
10. Return a success status only after the event is safely handled.

Do not trust `changed_fields` as authorization. It is a synchronization hint. Authorization decisions should use validated Auth tokens, service credentials, permissions, and policies. API protection is covered in [Protect an API](#protect-api).

Receiver response rules:

| Receiver Result | What To Return | Why |
|---|---|---|
| Signature is invalid | `401` or `403` | Auth should not treat the delivery as accepted. |
| Tenant is not expected | `403` | The receiver should reject events outside its configured tenant set. |
| Event was already processed | `204` | Duplicate delivery is safe and should not retry. |
| Event was stored and queued | `200`, `202`, or `204` | Auth treats any final status lower than 300 as success. |
| Receiver is temporarily unavailable | `500`, `502`, `503`, or timeout | Auth should retry according to endpoint settings. |
| Event cannot ever be processed by this receiver | `400` or another non-2xx status | Auth retries until attempts are exhausted, then dead-letters. Use this only when retrying is acceptable operationally. |

For slow work, store the event and enqueue a job, then return success. Do not keep the webhook request open while performing long external calls.

## Delivery History

Delivery history shows what Auth attempted for each endpoint.

Useful fields:

- Delivery ID.
- Endpoint.
- Event ID.
- Event type.
- Attempt count.
- Response status.
- Response summary.
- Error reason.
- Next retry time.
- Final status.
- Replay marker.
- Created and updated timestamps.

Final status values:

- `pending`: Auth will retry when the next retry time is reached.
- `success`: The receiver returned a final status lower than 300.
- `dead_letter`: Auth exhausted attempts or the event could no longer be delivered.

Use delivery history to answer:

- Did Auth attempt the delivery?
- Which endpoint received it?
- Which status did the receiver return?
- Is Auth still retrying?
- Did the endpoint become quarantined?
- Which event ID should the receiver use for deduplication?

## Endpoint Lifecycle

Webhook endpoints move through these operational states:

| Status | Meaning | New Deliveries |
|---|---|---|
| `active` | The endpoint is enabled and can receive matching events. | Yes |
| `inactive` | An administrator disabled the endpoint. | No |
| `quarantined` | Auth disabled the endpoint after sustained failures. | No |

Reactivating an inactive or quarantined endpoint clears the consecutive failure counter. After reactivation, replay only the events that the receiver actually needs to recover.

## Retry, Replay, And Quarantine

Retries happen automatically for failed deliveries while attempts remain.

Retry behavior:

- The first attempt happens when the relay fans out the event.
- Additional attempts are scheduled in delivery history.
- Timeout is controlled per endpoint.
- Max retries is controlled per endpoint.
- Retry backoff uses jitter and is capped at about one minute.
- The background retry worker checks pending retries periodically, so a retry may not fire at the exact second shown in delivery history.

Replay is a manual recovery tool. Use it when a receiver had a temporary outage, a downstream processor failed after accepting the delivery, or a developer wants to retest handling for an existing event.

Replay sends the same event ID again and creates a new delivery-history record marked as replay. Receivers must handle this as a duplicate unless their recovery process intentionally reprocesses it.

Quarantine protects Auth and receivers from repeated failures. After sustained dead-lettered deliveries, Auth marks the endpoint as quarantined and stops sending new deliveries to it. Fix the receiver, then reactivate the endpoint and replay any required events.

Auth quarantines an endpoint after 10 consecutive dead-lettered deliveries. A successful delivery resets the consecutive failure counter.

## RabbitMQ Event Routing

RabbitMQ is optional. Use it when downstream systems prefer broker consumption instead of HTTPS webhooks.

Use RabbitMQ when:

- Multiple consumers need the same event stream.
- Consumers are already built around queues.
- A receiver should not expose an HTTPS webhook endpoint.
- Downstream processing is asynchronous and fan-out belongs in the broker.
- Operations wants queue depth, dead-letter queues, and broker-side routing controls.

Use webhooks when one external system needs a direct HTTPS callback and can own signature verification.

To enable broker delivery, operators configure the broker connection:

```env
RABBITMQ_URL=amqps://maintainerd-auth:secret@rabbitmq.example.internal:5671/
```

Auth declares a durable topic exchange:

```text
maintainerd-auth.events
```

Broker messages use the event type as the routing key, such as `user.updated` or `tenant_member.added`.

Consumer queues can bind with topic patterns:

```text
user.*
tenant_member.*
iam.#
#
```

Broker messages use:

| Message Property | Value |
|---|---|
| Exchange | `maintainerd-auth.events` |
| Exchange type | Durable topic exchange |
| Routing key | Event type, such as `user.updated` |
| Content type | `application/json` |
| Message ID | Event ID |
| Type | Event type |
| Delivery mode | Persistent |

Tenant broker routes decide which event types Auth publishes to RabbitMQ for a tenant. A configured broker connection alone is not enough; the selected tenant also needs an enabled broker route for the event type.

Recommended broker setup:

1. Configure `RABBITMQ_URL` with an `amqps://` URL.
2. Give Auth credentials that can declare the `maintainerd-auth.events` exchange and publish persistent messages.
3. Create consumer queues owned by downstream systems.
4. Bind each queue to the routing keys it needs.
5. In Auth, enable broker routes for the tenant and event types that should publish to RabbitMQ.
6. Have consumers deduplicate by `event_id`.
7. Have consumers filter by `tenant_id` when a queue receives events for multiple tenants.
8. Monitor unroutable messages, queue depth, publish failures, and consumer dead-letter queues.

Auth uses publisher confirms. A broker publish is treated as complete only after the broker acknowledges it. If RabbitMQ is unavailable or the broker does not confirm the publish, the broker arm remains incomplete and the outbox row can be claimed again later.

Broker delivery still uses the same event envelope and at-least-once behavior. Consumers should deduplicate by `event_id`, filter by `tenant_id`, and fetch current state when needed.

For deployment requirements, network planning, and broker environment variables, see [Deployment](#deployment) and [Environment variables](#environment).

## Security Controls

Webhook delivery includes several protections:

- HTTPS is required for endpoint URLs.
- Destination validation rejects unsafe network destinations.
- Redirects must remain HTTPS.
- Each endpoint has its own signing secret.
- Signing secrets are encrypted at rest.
- Secrets are returned when created or rotated, not on ordinary reads.
- Payloads are thin and should not carry personal data or secrets.
- Configuration is tenant-scoped.
- Subscriptions cannot use another tenant's event types.
- Replays cannot send another tenant's event to your endpoint.
- Repeated failures can quarantine an endpoint.

Receiver responsibilities:

- Verify signatures before parsing or processing.
- Reject stale timestamps.
- Store endpoint secrets securely.
- Rotate secrets after exposure.
- Deduplicate events.
- Filter tenant IDs.
- Keep processing idempotent.
- Return success only after durable handling.
- Avoid logging raw payloads if your processor adds sensitive context.

## Monitoring Checklist

Monitor:

- Endpoint status.
- Consecutive failures.
- Pending delivery count.
- Dead-letter count.
- Retry volume.
- Delivery latency.
- Outbox growth.
- Receiver response status.
- Receiver timeout rate.
- RabbitMQ publish failures when broker routing is enabled.

Alert when an endpoint is quarantined, pending deliveries grow, delivery attempts fail for a critical integration, or broker publish failures continue.

## Common Setup Examples

User lifecycle sync:

1. Create an endpoint for the user-sync worker.
2. Subscribe to `user.created`, `user.updated`, `user.status_changed`, `user.deleted`, `user.role_assigned`, and `user.role_removed`.
3. Store each received `event_id`.
4. Fetch current user state before updating the downstream directory.
5. Treat a missing user during fetch as a deleted or unavailable resource, depending on the event type.

Authorization cache invalidation:

1. Create an endpoint for the API or permission-cache service.
2. Subscribe to IAM, API, service, and user role events.
3. Verify the signature and tenant ID.
4. Invalidate cache entries for the subject or tenant.
5. Fetch policy or permission data again before allowing sensitive actions.

Tenant provisioning:

1. Create an endpoint for the provisioning service.
2. Subscribe to `tenant.created`, `tenant.updated`, `tenant.status_changed`, `tenant.deleted`, and tenant-member events.
3. Use `tenant_id` and `subject_uuid` as lookup keys.
4. Make provisioning idempotent so replay does not duplicate work.
5. Alert on dead-lettered tenant events.

Broker analytics sink:

1. Configure `RABBITMQ_URL`.
2. Create broker routes for the event types needed by analytics.
3. Bind consumer queues to the `maintainerd-auth.events` exchange.
4. Deduplicate by `event_id`.
5. Filter by `tenant_id`.
6. Store only the fields needed by the analytics system.

## Troubleshooting

No deliveries appear: check whether the tenant event type is enabled, whether at least one active listener exists, whether the endpoint is active, and whether the endpoint is subscribed to the emitted event type.

Endpoint receives duplicates: this is expected with at-least-once delivery. Deduplicate by `event_id`.

Endpoint receives events out of order: this is expected. Fetch current state before applying stateful changes.

Signature verification fails: check that the receiver uses the raw body, the correct endpoint secret, the exact timestamp header, and the `timestamp.raw_body` signing format.

Receiver times out: reduce receiver work during the webhook response path. Store the event quickly, return success, and process longer work asynchronously.

Events go to dead letter: inspect response status, error reason, endpoint timeout, network reachability, and receiver logs for the same event ID and delivery ID.

Endpoint is quarantined: fix the receiver, reactivate the endpoint, and replay required events.

RabbitMQ does not receive events: check `RABBITMQ_URL`, broker connectivity, tenant broker routes, queue bindings, and whether the event type is enabled for the tenant.
