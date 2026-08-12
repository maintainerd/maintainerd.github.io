# Architecture

Auth separates browser identity flows, operator controls, management probes, runtime service calls, and the optional Core control plane.

## Main Surfaces

- Public identity API on the public port.
- Internal management API for the console and control-plane operations.
- Management port for health, readiness, OpenAPI, and Prometheus metrics.
- Optional gRPC server for runtime service calls and, when explicitly enabled, Core provisioning.
- Hosted identity UI for end users.
- Admin console for operators.

## Runtime Dependencies

- PostgreSQL stores tenant, user, provider, client, policy, session, event, template, and configuration state.
- Redis supports rate limits, cache behavior, token/JTI state, and short-lived flow state.
- Secret providers load sensitive values such as JWT keys, database passwords, encryption keys, and HMAC secrets.

## Boundary Rule

Account self-service lives in the identity app. Administrative control lives in the console. Public OAuth and browser flows live on the public identity surface. Operator metrics and probes live on the management surface.

## Runtime Shape

The default deployment is standalone and does not bind gRPC. `GRPC_ENABLED=true` adds runtime gRPC for authorization, introspection, and peer reads. `CONTROL_PLANE_ENABLED=true` makes the instance Core-managed, implies gRPC, and enables provisioning RPCs under mTLS.

## Packaged Shape

The `maintainerd-auth` image is a single Go process with the console and identity SPAs embedded. The same binary serves the management API, public identity API, management probes, console UI, identity UI, workers, and optional gRPC listener.
