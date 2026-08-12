# Events & Audit

Auth records structured authentication and authorization events and exposes management APIs for event review, counts, retention, and configuration.

## Auth Events

Events cover important identity and OAuth activity, including login success, login failure, token issuance, token revocation, token introspection, consent grants, consent revocation, and selected privileged actions.

## Audit Context

Events can include trace identifiers when available. That makes it easier to investigate behavior across Auth, clients, resource services, and infrastructure logs.

## Webhook Configuration

Webhook endpoint configuration is tenant-scoped. Endpoints can subscribe to event types, and delivery payloads use HMAC-SHA256 signing support for outbound consumers.

Webhook configuration exists at the overview level. Full delivery behavior and consumer verification details belong in the developer docs.

