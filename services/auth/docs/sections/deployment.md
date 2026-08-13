# Deployment

Deployment turns Auth from a local app into a reliable identity service. It covers runtime mode, hostnames, TLS, secrets, database, Redis, workers, probes, messaging, observability, and rollout behavior.

## Where Deployment Shows Up

Deployment is configured outside the normal user-facing screens, but it affects what the console reports.

You will touch:

- Container image and runtime platform.
- Environment variables.
- Secret provider.
- PostgreSQL.
- Redis.
- Reverse proxy or ingress.
- DNS and TLS.
- Background worker configuration.
- Metrics and logs.
- Maintainerd Core service registration when orchestrated.

The console can help verify the result through setup status, tenant status, dependency health, runtime summaries, and audit/events.

## What You Are Deploying

A production Auth deployment usually includes:

- Auth application process.
- Console frontend.
- Hosted identity frontend.
- Public identity API.
- Private management API.
- Management health and metrics port.
- Optional gRPC listener.
- Background workers.
- PostgreSQL.
- Redis.
- Secret provider.
- Reverse proxy with TLS.
- Optional RabbitMQ and OpenTelemetry collector.

Small deployments can run combined roles. Larger deployments may split web traffic and background workers.

## Deployment Fields And Decisions

Runtime mode decides whether Auth is standalone, runtime gRPC, or control-plane integrated.

Image version decides which Auth build runs. Pin versions deliberately instead of floating production to whatever is newest.

Replica count decides how many Auth processes serve traffic or workers.

Environment values define hostnames, database, Redis, runtime, cookies, proxies, observability, and feature wiring.

Secret provider decides where sensitive values are read from.

Database settings decide durable state connectivity and pool behavior.

Redis settings decide shared short-lived state connectivity.

Ingress or reverse proxy settings decide which public host reaches which Auth surface.

TLS settings decide whether browser and service traffic is encrypted and trusted.

Probe settings decide when the platform sends traffic to Auth.

Worker settings decide whether background lifecycle work is processed.

## Hostname Plan

Before deploying, write down:

- Console hostname.
- Identity UI hostname.
- Public identity API hostname.
- Private management API hostname.
- Management/metrics access path.
- Tenant-specific hostname pattern if used.
- Application callback domains.
- WebAuthn relying-party domain.
- Cookie domain if required.

Hostnames are not cosmetic. They affect issuer metadata, redirects, cookies, passkeys, tenant routing, and user trust.

## Infrastructure Requirements

PostgreSQL must be durable, backed up, private, and reachable by Auth.

Redis must be shared by every replica that participates in runtime traffic.

Secrets must be available before startup and refreshable when the provider supports it.

TLS must terminate at a trusted edge or be served directly by Auth's platform.

The management port must be reachable by operations tooling but not treated as a public user surface.

## Rollout Workflow

1. Choose and pin the Auth image version.
2. Provision PostgreSQL and Redis.
3. Configure the secret provider.
4. Configure hostnames and DNS.
5. Configure TLS.
6. Configure reverse proxy or ingress routing.
7. Deploy Auth with required environment values.
8. Wait for readiness.
9. Complete setup if this is a new install.
10. Sign in to the console.
11. Configure tenant, providers, registration, and clients.
12. Test hosted login and account self-service.
13. Connect metrics, logs, and alerts.

For upgrades, run the same workflow but focus on version notes, migration behavior, readiness, and rollback planning.

## Probes And Health

Use liveness to know whether the process is running.

Use readiness to know whether Auth can safely receive traffic. Readiness should check PostgreSQL, Redis, and signing-key availability.

Do not send user traffic to an instance that is alive but not ready.

## Background Workers

Background workers process identity lifecycle work such as cleanup, event outbox delivery, webhook delivery, erasure, key refresh, retention, and other scheduled tasks.

If workers are disabled everywhere, user-facing flows may appear to work while cleanup, delivery, and lifecycle tasks stall.

In split deployments, make sure at least one healthy worker role is running.

## Messaging And Events

Auth can emit security events, audit records, webhook deliveries, and integration events.

If RabbitMQ or webhook delivery is configured, treat delivery credentials as secrets and monitor failed delivery queues. If messaging is disabled, make sure the product does not depend on external event delivery.

## Observability

Production Auth should have:

- Structured logs.
- Metrics.
- Readiness and liveness probes.
- Traces when available.
- Alerts for dependency failures.
- Alerts for high authentication failures, lockouts, webhook failures, and audit write failures.

Identity systems fail best when operators can see problems early.

## Permissions And Security

Deployment changes are operator-level actions. They can expose private APIs, rotate secrets, change issuers, break login, or invalidate tokens.

Protect:

- Secret provider access.
- Database credentials.
- Redis credentials.
- JWT keys.
- Application encryption keys.
- HMAC keys.
- Private management surface.
- gRPC mTLS material.
- Reverse proxy rules.

## Production Checklist

- Production hostnames use HTTPS.
- Management and metrics surfaces are private.
- PostgreSQL is backed up and TLS-protected.
- Redis is private and shared across replicas.
- Secrets are not stored in source control or frontend config.
- Cookie settings match the hostname plan.
- WebAuthn relying-party ID is correct before passkeys launch.
- Readiness probes are connected.
- Workers are running.
- Logs and metrics are collected.
- Setup is locked after first-run configuration.
- Tenant, provider, registration, login, and account flows are tested end to end.

## Troubleshooting

If the deployment starts but never becomes ready, check PostgreSQL, Redis, migrations, signing keys, and secret provider access.

If login redirects fail after deployment, check issuer hostname, identity hostname, reverse proxy headers, client redirect URIs, and TLS.

If setup appears again after deployment, check database persistence and setup lock state.

If background work is not happening, check worker roles, logs, queues, and scheduled runner state.

If one replica behaves differently, check whether all replicas use the same image, environment, secret provider, database, Redis, and key material.
