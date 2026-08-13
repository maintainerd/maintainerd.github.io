# Events & Webhooks

Events and webhooks let downstream systems react when Auth changes identity, tenant, client, service, API, role, permission, policy, session, or token state.

Use this section when an external application needs to receive notifications from Auth. For example, a billing system can learn that a tenant was created, a CRM can learn that a user was added, or a protected API can refresh cached permissions after a role changes.

Auth sends integration events through a transactional outbox. That means the event is written with the business change, then a background relay delivers it to subscribed webhook endpoints and, when configured, to RabbitMQ. Delivery is at least once and unordered, so receivers must deduplicate and fetch current state when they need full details.

Auth events and management audit logs are separate from integration events. Audit concepts are documented in [Audit events](#audit). Deployment-level broker setup is documented in [Deployment](#deployment).

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

In the console, open the tenant, then open **Events** or **Webhooks**.

The area usually contains:

- Event type catalog.
- Tenant event type settings.
- Webhook endpoint list.
- Create webhook endpoint.
- Endpoint detail.
- Endpoint status controls.
- Subscription controls.
- Delivery history.
- Delivery replay.
- Broker route configuration when RabbitMQ delivery is used.

Only administrators with webhook and event-management permissions should configure this area. Normal end users do not create webhook endpoints.

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

## Setup Overview

Set up webhooks in this order:

1. Decide which tenant owns the event configuration.
2. Decide which downstream system should receive events.
3. Build an HTTPS endpoint in that downstream system.
4. Implement signature verification using the raw request body.
5. Implement deduplication using `event_id`.
6. Decide which event types the receiver needs.
7. Create the webhook endpoint in Auth.
8. Store the signing secret returned at creation time.
9. Subscribe the endpoint to selected events, or enable `subscribe_all` when the receiver intentionally handles every event.
10. Trigger a safe test change.
11. Review delivery history.
12. Replay a delivery when testing or recovery requires it.
13. Configure RabbitMQ routes only when broker-based consumption is required.

Do not subscribe a receiver to every event unless it is designed to process every event category. Narrow subscriptions reduce noise, operational load, and accidental data coupling.

## Required Administrative Access

Webhook and event configuration is tenant-scoped.

Typical setup requires permission to:

- View event types.
- Enable or disable tenant event types.
- Create webhook endpoints.
- Edit webhook endpoints.
- Activate, deactivate, or delete webhook endpoints.
- Add or remove endpoint subscriptions.
- View delivery history.
- Replay deliveries.
- Create or edit broker routes when RabbitMQ is used.

These permissions are commonly grouped under webhook endpoint administration. Use least privilege so operators who only investigate deliveries do not also rotate secrets or change subscriptions.

## Event Types

Event types are the named changes Auth can emit. Each tenant has its own event type catalog and tenant-level enablement settings.

An event type has:

- Key: stable event name, such as `user.updated`.
- Category: grouping used for browsing and filtering.
- Description: administrator-facing explanation.
- Version: payload version for that event type.
- Active status: whether Auth can emit that event type.
- Tenant setting: whether the selected tenant allows that event type.

Current event categories:

```text
USER
IAM
TENANT
CLIENT
SESSION
API
SERVICE
```

Current event type catalog:

| Event Type | Category | When It Is Emitted |
|---|---|---|
| `user.created` | USER | A user is created. |
| `user.updated` | USER | Identity or profile fields change. |
| `user.status_changed` | USER | A user is activated, suspended, locked, or otherwise changes status. |
| `user.deleted` | USER | A user is deleted. |
| `user.role_assigned` | USER | A role is assigned to a user. |
| `user.role_removed` | USER | A role is removed from a user. |
| `role.created` | IAM | A role is created. |
| `role.updated` | IAM | A role is updated. |
| `role.deleted` | IAM | A role is deleted. |
| `role.permissions_changed` | IAM | A role's permissions change. |
| `permission.created` | IAM | A permission is created. |
| `permission.updated` | IAM | A permission is updated. |
| `permission.deleted` | IAM | A permission is deleted. |
| `iam.policy.updated` | IAM | An IAM policy is updated. |
| `policy.created` | IAM | A policy is created. |
| `policy.deleted` | IAM | A policy is deleted. |
| `iam.service.policy.assigned` | IAM | A service policy link is assigned. |
| `iam.service.policy.removed` | IAM | A service policy link is removed. |
| `tenant.created` | TENANT | A tenant is created. |
| `tenant.updated` | TENANT | Tenant attributes change. |
| `tenant.status_changed` | TENANT | A tenant is activated, suspended, or otherwise changes status. |
| `tenant.deleted` | TENANT | A tenant is deleted. |
| `tenant_member.added` | TENANT | A member is added to a tenant. |
| `tenant_member.removed` | TENANT | A member is removed from a tenant. |
| `tenant_member.ownership_transferred` | TENANT | Tenant ownership is transferred. |
| `client.created` | CLIENT | An OAuth client is created. |
| `client.updated` | CLIENT | An OAuth client is updated. |
| `client.deleted` | CLIENT | An OAuth client is deleted. |
| `client.status_changed` | CLIENT | A client is enabled, disabled, or otherwise changes status. |
| `client.secret_rotated` | CLIENT | A client secret is rotated. |
| `session.revoked` | SESSION | A session is revoked. |
| `token.revoked` | SESSION | A token is revoked. |
| `identity.linked` | USER | An external identity is linked to a user. |
| `identity.unlinked` | USER | An external identity is unlinked from a user. |
| `api.created` | API | A protected API record is created. |
| `api.updated` | API | A protected API record is updated. |
| `api.status_changed` | API | A protected API changes status. |
| `api.deleted` | API | A protected API record is deleted. |
| `service.created` | SERVICE | A service principal or service record is created. |
| `service.updated` | SERVICE | A service record is updated. |
| `service.status_changed` | SERVICE | A service changes status. |
| `service.deleted` | SERVICE | A service record is deleted. |

Use the catalog screen before creating subscriptions. It shows the event types available for the selected tenant.

## Tenant Event Type Settings

Tenant event type settings are the tenant-level master switches for event emission.

If an event type is disabled for the tenant, Auth should not persist or deliver that event for the tenant. This is different from a webhook subscription. Tenant event settings decide whether Auth emits the event at all. Webhook subscriptions decide which endpoints receive emitted events.

Use tenant event settings when:

- A tenant does not use a category of integration events.
- A tenant wants to reduce downstream noise.
- A tenant wants to pause a category of integrations during maintenance.
- Operators need to prevent an event from reaching both webhook and broker listeners.

After changing tenant event settings, trigger a small safe change and review delivery history to confirm the intended behavior.

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

## Webhook Endpoint Fields

URL is the HTTPS address Auth delivers to. It must be reachable from the Auth deployment and must not point to private, loopback, link-local, multicast, or otherwise blocked network destinations.

Description explains who owns the receiver and what it does. Use a clear operational label, such as `Provisioning worker`, `Billing tenant sync`, or `Security event bridge`.

Status controls whether Auth sends deliveries. Active endpoints can receive events. Inactive endpoints do not receive new deliveries. Quarantined endpoints have been disabled automatically after sustained failures.

Subscribe all controls whether the endpoint receives all emitted event types. Use it only for broad event sinks that intentionally process every category.

Subscriptions list the exact event types the endpoint receives when `subscribe_all` is disabled.

Maximum retries controls how many retries Auth attempts after the first delivery attempt. For example, a value of `3` means Auth can try up to four total attempts: the first attempt plus three retries.

Timeout seconds controls how long Auth waits for the receiver to respond before treating an attempt as failed.

Signing secret is generated by Auth and returned when the endpoint is created or when the secret is rotated. Store it immediately in the receiver's secret manager. Auth does not show the existing secret again later.

Metadata can store operational labels for the endpoint. Do not store receiver secrets in metadata.

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

Example structure:

```text
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

| Field | Meaning |
|---|---|
| `event_id` | Stable UUID for the event. Use it for deduplication. |
| `event_type` | Canonical event type, such as `client.secret_rotated`. |
| `event_version` | Event schema version. Current catalog starts at `1`. |
| `tenant_id` | Tenant UUID that owns the event. Receivers should filter by it when they process multiple tenants. |
| `actor_user_id` | User UUID for the user who triggered the change when Auth can identify one. It can be empty for system or service actions. |
| `subject_uuid` | UUID of the changed resource. |
| `subject_type` | Resource type, such as `user`, `tenant`, `client`, `role`, `permission`, `api`, or `service`. |
| `changed_fields` | Names of fields that changed. Values are not included. |
| `payload` | Optional event metadata. It should not contain personal data, secrets, or full resource records. |
| `occurred_at` | Time the event occurred. |
| `trace_id` | Trace correlation value when available. |
| `request_id` | Request correlation value when available. |

The payload is intentionally not a full object snapshot. For example, `user.updated` tells the receiver which user changed and which field names changed. It does not send the user's new email, status value, profile, roles, tokens, provider credentials, or secrets.

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

Example Node.js receiver:

```js
import crypto from "node:crypto";
import express from "express";

const app = express();
const endpointSecret = process.env.MAINTAINERD_WEBHOOK_SECRET;

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

  const event = JSON.parse(req.body.toString("utf8"));

  if (await alreadyProcessed(event.event_id)) {
    return res.sendStatus(204);
  }

  await storeEventIdempotently(event.event_id, event);
  await processEvent(event);

  return res.sendStatus(204);
});
```

Store the secret outside the application source code. Rotate it from the Auth console if it may have been exposed.

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
- `success`: The receiver returned a status lower than 300.
- `dead_letter`: Auth exhausted attempts or the event could no longer be delivered.

Use delivery history to answer:

- Did Auth attempt the delivery?
- Which endpoint received it?
- Which status did the receiver return?
- Is Auth still retrying?
- Did the endpoint become quarantined?
- Which event ID should the receiver use for deduplication?

## Retry, Replay, And Quarantine

Retries happen automatically for failed deliveries while attempts remain.

Retry behavior:

- The first attempt happens when the relay fans out the event.
- Additional attempts are scheduled in delivery history.
- Backoff uses jitter and is capped.
- Timeout is controlled per endpoint.
- Max retries is controlled per endpoint.

Replay is a manual recovery tool. Use it when a receiver had a temporary outage, a downstream processor failed after accepting the delivery, or a developer wants to retest handling for an existing event.

Replay sends the same event ID again. Receivers must handle this as a duplicate unless their recovery process intentionally reprocesses it.

Quarantine protects Auth and receivers from repeated failures. After sustained dead-lettered deliveries, Auth marks the endpoint as quarantined and stops sending new deliveries to it. Fix the receiver, then reactivate the endpoint and replay any required events.

## RabbitMQ Event Routing

RabbitMQ is optional. Use it when downstream systems prefer broker consumption instead of HTTPS webhooks.

To enable broker delivery, operators configure:

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
