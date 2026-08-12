# Architecture

Auth separates browser identity flows, operator controls, management probes, and machine surfaces.

## Main Surfaces

- Public identity API on the public port.
- Internal management API for the console and control-plane operations.
- Management port for health, readiness, OpenAPI, and Prometheus metrics.
- gRPC server for selected control-plane and service-authorization workflows.
- Hosted identity UI for end users.
- Admin console for operators.

## Runtime Dependencies

- PostgreSQL stores tenant, user, provider, client, policy, session, event, template, and configuration state.
- Redis supports rate limits, cache behavior, token/JTI state, and short-lived flow state.
- Secret providers load sensitive values such as JWT keys, database passwords, encryption keys, and HMAC secrets.

## Boundary Rule

Account self-service lives in the identity app. Administrative control lives in the console. Public OAuth and browser flows live on the public identity surface. Operator metrics and probes live on the management surface.
