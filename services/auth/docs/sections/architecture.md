# Architecture

Auth is a single deployable identity system with multiple runtime surfaces around one domain core. It is not a collection of separate microservices inside the container. The `maintainerd-auth` container runs one Go binary that serves the APIs, the embedded admin console, the hosted identity app, background workers, telemetry, and the optional gRPC listener.

The main architectural idea is separation by surface and responsibility: browsers use the public identity surface, operators use the console and internal management surface, probes and metrics use the management surface, peer services use runtime gRPC when enabled, and Core uses the control-plane gRPC surface only when explicitly configured.

## High-Level Shape

```text
Browser / user app
  -> hosted identity UI
  -> public identity API / OAuth issuer
  -> tokens, sessions, consent, account self-service

Operator
  -> admin console
  -> internal management API
  -> tenants, clients, providers, users, roles, policies, security, messaging, events

Peer service
  -> optional runtime gRPC
  -> authorization, introspection, user/profile reads

Core / orchestrator
  -> optional control-plane gRPC over mTLS
  -> setup and provisioning

All transports
  -> server handlers / gRPC handlers
  -> domain services
  -> repositories
  -> PostgreSQL, Redis, secret provider, event outbox, workers, telemetry
```

## Process Startup

The server starts in a fixed dependency order:

1. Load configuration and secrets.
2. Initialize OpenTelemetry logging, tracing, and metrics.
3. Load JWT keys from configuration or prepare database-backed signing keys.
4. Connect to PostgreSQL.
5. Connect to Redis.
6. Initialize shared security/rate-limit helpers.
7. Run database migrations.
8. Build repositories.
9. Build domain services.
10. Wire cross-cutting callbacks such as CORS origin resolution, tenant reference resolution, session validation, DPoP enforcement, event logging, and authorization cache invalidation.
11. Start background workers.
12. Start the REST servers.
13. Start gRPC in the background if the selected runtime mode enables it.

REST remains the foreground runtime that owns graceful shutdown. Background workers and gRPC receive the process context and stop when the server drains.

## Main Packages

`cmd/server` owns process bootstrap. It handles configuration load order, telemetry initialization, database and Redis startup, migrations, JWT signing-key setup, background worker startup, and the final call into the server package.

`internal/app` is the composition root. It creates every repository from the shared database handle, builds the domain services, connects adapters between packages, and returns a transport-focused application bundle to `internal/server`.

`internal/server` adapts the application bundle to HTTP and gRPC. It builds routers, handlers, middleware chains, OpenAPI serving, health checks, embedded SPA servers, gRPC service registration, gRPC auth, and gRPC audit logging.

Domain packages such as `authn`, `oauth`, `tenant`, `client`, `idp`, `iam`, `user`, `mfa`, `branding`, `notifier`, `event`, `webhook`, `auditlog`, `secpolicy`, `setup`, and `federation` own the business behavior for their areas.

`internal/platform` holds reusable infrastructure: configuration, database, cache, middleware, JWT, DPoP, logging, telemetry, secret loading, email/SMS providers, signed URLs, cryptography helpers, pagination, templates, and migration runners.

## HTTP Surfaces

Auth has separate HTTP surfaces so browser-facing identity flows, operator administration, and operational probes do not collapse into one boundary.

### Internal Management API

The internal management API runs on `:8080`.

It serves `/api/v1` management routes for:

- Setup.
- Tenants and tenant members.
- Services, APIs, permissions, policies, and roles.
- Identity providers and registration flows.
- Clients and client configuration.
- Users, user profiles, trusted devices, consent, sessions, and admin data erasure.
- Invites.
- Security settings and IP restriction rules.
- Email/SMS templates and provider configuration.
- Branding.
- Tenant settings.
- Webhook endpoints, subscriptions, replay, and delivery history.
- Auth events and integration event configuration.
- OAuth management, dynamic client registration, signing keys, and token revocation.
- Authorization checks.
- Management audit logs.
- Workload identity federation.
- Dashboard data.

The internal API applies a management-client audience guard. A token issued to a normal third-party OAuth client is not accepted as a management token.

### Public Identity API

The public identity API runs on `:8081`.

It serves the OAuth/OIDC issuer and browser-facing identity routes:

- OIDC discovery and JWKS.
- Tenant and client lookup needed by hosted login.
- Login, registration, password reset, email verification, magic link, SMS login, and invite registration.
- OAuth authorize, token, userinfo, consent, PAR, device authorization, CIBA, session, token exchange, and dynamic client registration surfaces where applicable.
- Account self-service routes for the hosted identity app.
- MFA enrollment and challenge flows for users.
- Federated login and identity linking.
- Public branding needed by the hosted login experience.

The public surface is tenant-aware. Tenant host/subdomain resolution is used for login, OAuth, tenant lifecycle checks, maintenance mode, rate limits, and IP restriction rules.

### Management Port

The management port defaults to `:8082` through `MANAGEMENT_PORT`.

It serves:

- `/health`
- `/healthz`
- `/ready`
- `/readyz`
- `/livez`
- `/openapi.json`
- `/metrics`

Keep this port private. Readiness checks database reachability, Redis reachability, and whether the JWKS/public signing key is loaded. Prometheus metrics are served from this management port.

### Embedded Console And Identity Apps

The console and identity SPAs are built into the Go binary with embedded assets.

The console app runs on `:3000`. Its management API is mounted same-origin at `/api`, and its public identity API is mounted same-origin at `/public-api`.

The identity app runs on `:3001`. Its public API is mounted same-origin at `/api`, and OIDC discovery is mounted under `/.well-known`.

This same-origin design matters because browser sessions use secure, host-bound cookies. The browser talks to one origin for each app, and the Go process routes API calls internally to the same routers used by the API ports.

## gRPC Architecture

gRPC is optional. Standalone mode does not bind the listener. Runtime gRPC mode binds `:50051` for peer-service runtime calls. Control-plane mode binds the same listener and registers provisioning services for Core.

The gRPC server has:

- Recovery interceptors.
- Structured request logging.
- Per-call timeout.
- Authentication and authorization.
- Rate limiting.
- Management audit logging for mutating unary calls.
- OpenTelemetry gRPC instrumentation.
- gRPC health service.
- Reflection only when explicitly enabled for trusted operator environments.

Runtime gRPC is for authorization decisions, token introspection, service policy bundle reads, default tenant lookup, and user/profile reads. Control-plane gRPC adds setup, tenant lifecycle, tenant settings, service/API/permission/policy/role/client provisioning, and workload identity federation.

The gRPC application surface is fail-closed. Methods must be explicitly classified. Unclassified `maintainerd.auth.v1` methods are denied.

## Domain Service Layer

Domain services are the central behavior layer. Handlers should translate transport inputs and outputs; services decide what the operation means.

Examples:

- `authn` coordinates login, registration, email verification, password reset, magic links, SMS login, account linking, sessions, lockout, and MFA handoff.
- `oauth` owns authorization code, token, refresh token, consent, PAR, device flow, CIBA, token exchange, DPoP, revocation, signing keys, sessions, discovery, and dynamic client registration behavior.
- `iam` owns services, APIs, permissions, policies, roles, authorization decisions, and policy version history.
- `client` owns application/client configuration, URI records, provider connections, API and permission assignments, role assignments, CORS origin resolution, and public client lookup.
- `idp` owns identity providers, registration flows, federation, home-realm discovery, external provider callback handling, and identity linking.
- `tenant` owns tenants, tenant members, tenant settings, tenant creation seeding, lifecycle status, and tenant-scoped operational configuration.
- `user` owns users, profiles, account self-service, consent, trusted devices, data erasure, sessions, and profile pictures.
- `mfa` owns TOTP, SMS/email OTP, WebAuthn/passkeys, backup codes, MFA policy challenge flows, and trusted-device support.
- `event` and `webhook` own integration events, event route configuration, outbox delivery, webhook subscriptions, replay, delivery history, retries, and retention.

Services can emit auth events, integration events, audit log entries, and authorization cache invalidations through explicitly wired collaborators.

## Repository Layer

Repositories wrap PostgreSQL access for each domain. They are created once from the shared Gorm database handle in `internal/app`, then injected into services.

PostgreSQL is the durable source of truth for tenants, users, identities, clients, sessions, OAuth artifacts, roles, permissions, policies, events, templates, settings, webhooks, audit logs, signing keys, revocations, and setup state.

Redis supports cache, rate limits, session/JTI denylist checks, short-lived flow state, WebAuthn and OTP challenge state, cross-replica event gate invalidation, and replay protection.

## Identity Boundary

Auth deliberately separates account self-service from administration.

The hosted identity app owns end-user account flows: login, registration, profile completion, account settings, MFA enrollment, device/session management, identity linking, consent, data export/deletion, password changes, and recovery.

The admin console owns operator workflows: tenants, users, clients, identity providers, registration flows, roles, permissions, policies, messaging, templates, branding, security controls, events, webhooks, audit logs, workload identity, and operational settings.

The internal management API is not a login endpoint. The console starts OAuth through the hosted identity app instead of posting credentials to the management surface.

## Tenant Boundary

Tenancy is enforced through tenant-aware routing, tenant-scoped records, and tenant-bound tokens.

Tenant names act as DNS-safe slugs for subdomain routing. Public identity requests resolve the tenant from the host/subdomain and then enforce tenant lifecycle, maintenance, IP restriction, and rate-limit rules before credential and OAuth flows proceed.

Clients, identity providers, identities, users, services, APIs, permissions, policies, roles, templates, branding, settings, events, and webhooks are tenant-scoped. Tokens carry tenant context so downstream checks do not have to guess which tenant a principal belongs to.

## Authorization Boundary

REST management routes use middleware to resolve the signed-in operator, tenant, client, roles, and permissions before calling handlers. Sensitive routes can require step-up authentication.

The internal management API also rejects tokens not minted for the management client. First-party account routes on the public surface reject normal third-party tokens before allowing self-service state changes.

gRPC uses service-account access tokens for normal calls. Permission-gated gRPC methods check the calling service principal through the authorization service. Some mutating gRPC calls require an `on_behalf_of` actor claim so audit attribution and tenant/escalation checks run against a real user.

DPoP-bound HTTP access tokens are enforced on resource calls. gRPC does not accept DPoP-bound tokens because DPoP proofs bind HTTP method and URL, not gRPC calls; gRPC uses certificate-bound token checks where configured.

## Event And Webhook Architecture

Auth has two event families.

Auth events are durable security and audit-relevant records such as login success/failure, lockout, new device, impossible travel, OAuth events, and authorization failures. They feed observability and operator review.

Integration events use the event outbox. Domain services ask the event service to emit an event. A write gate checks whether the event type is active, whether the tenant disabled it, and whether the tenant has any active listener. If the event should emit, it is written to the outbox.

The relay claims unpublished outbox rows with database locking, then sends each event independently to:

- Webhook delivery.
- RabbitMQ broker delivery when `RABBITMQ_URL` is configured.

Webhook delivery records per-endpoint delivery history. A retry worker re-attempts pending deliveries using the same delivery path. This makes delivery at-least-once and resilient across process restarts.

## Observability Architecture

Auth uses OpenTelemetry for traces, metrics, and logs.

When `OTEL_ENABLED=true`, traces and logs export over OTLP/gRPC using standard `OTEL_*` configuration. Metrics are exposed through a Prometheus exporter at `/metrics` on the management port.

The service registers build information and domain counters such as auth events, security denials, and audit write failures. HTTP and gRPC transports are instrumented so request activity can be correlated with logs and traces.

## Secret And Key Architecture

Configuration is split between ordinary environment variables and secret-backed values. The configured secret provider loads sensitive values such as database password, JWT keys, application encryption keys, HMAC key, setup bootstrap token, and retired encryption keys.

JWT signing can be operator-managed through `JWT_PRIVATE_KEY` and `JWT_PUBLIC_KEY`, or database-backed when those variables are absent. Database-backed signing keys can rotate automatically because all replicas read the same shared signing-key state. Environment-owned signing keys are rotated by changing the environment and redeploying.

The JTI revocation checker combines Redis and PostgreSQL: Redis is the fast denylist for logout and refresh rotation, while the database is the authoritative record for token revocation.

## Packaged Deployment

The Docker image builds the console SPA, builds the identity SPA, copies both build outputs into the Go source tree, and compiles the backend with embedded assets. The runtime image contains the single `auth` binary and runs it under `tini`.

The image exposes:

- `8080`: internal management API.
- `8081`: public identity API.
- `8082`: management probes and metrics.
- `3000`: admin console.
- `3001`: hosted identity app.

The gRPC listener uses `:50051` when enabled, but it is not exposed by the Dockerfile because it should be an explicit private-network decision.

## Design Rules

- Keep public login/OAuth/account flows on the public identity surface.
- Keep operator administration on the console and internal management API.
- Keep metrics and probes on the management port.
- Keep gRPC disabled unless peer services or Core need it.
- Keep control-plane mode behind mTLS and private networking.
- Treat PostgreSQL as durable truth and Redis as cache, rate-limit, short-lived state, and fast denylist infrastructure.
- Prefer domain services for business behavior and keep handlers transport-focused.
- Emit integration events through the outbox rather than direct side effects from handlers.
