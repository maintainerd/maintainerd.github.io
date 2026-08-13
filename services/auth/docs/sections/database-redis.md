# Database & Redis

Auth uses PostgreSQL as the durable system of record and Redis as the shared short-lived runtime store. Both are part of the identity runtime.

## Where To See Them

Operators usually see database and Redis state in:

- Deployment configuration.
- Setup or environment validation.
- Operations health and readiness screens.
- Logs during startup.
- Metrics and tracing.
- Managed database or cache dashboards.

The Auth console may show dependency health, but database and Redis connection values are deployment settings.

## What PostgreSQL Is For

PostgreSQL stores durable Auth data:

- Tenants and tenant settings.
- Users, profiles, sessions, consents, devices, and erasure requests.
- Tenant members, roles, permissions, and policies.
- OAuth clients, grants, authorization state, tokens, and consent records.
- Identity providers, provider mappings, registration flows, and invites.
- MFA factors, password history, lockout state, and WebAuthn credentials.
- Branding, messaging configuration, audit logs, auth events, webhook state, and outbox rows.

If data must survive restarts and must be backed up, it belongs in PostgreSQL.

## PostgreSQL Fields

`DB_HOST` is the database host Auth connects to.

`DB_PORT` is the PostgreSQL port.

`DB_USER` is the database user.

`DB_PASSWORD` is the secret-backed database password.

`DB_NAME` is the database name.

`DB_SSLMODE` controls database TLS. Production should not use disabled TLS for remote database traffic.

`DB_MAX_OPEN_CONNS` controls maximum open connections per Auth replica.

`DB_MAX_IDLE_CONNS` controls idle pooled connections.

`DB_CONN_MAX_LIFETIME_SEC` controls how long a connection may be reused.

`DB_STATEMENT_TIMEOUT_MS` limits database statement runtime.

## Migrations

Migrations update the database schema so the running Auth version and database agree.

During startup Auth should:

- Connect to PostgreSQL.
- Acquire migration coordination so only one replica applies changes.
- Run pending migrations in order.
- Record applied versions.
- Fail startup if migration fails.

Operators should treat failed migrations as a deployment issue, not as a user-facing recoverable error.

## What Redis Is For

Redis stores short-lived or performance-sensitive state:

- Rate-limit counters.
- Credential failure counters.
- Lockout markers.
- Authorization context cache entries.
- Revoked-token denylist entries.
- Refresh-token replay windows.
- WebAuthn ceremony sessions.
- Cached templates.
- Other TTL-bound security helpers.

Redis state should be fast, shared across replicas, and naturally expiring. It should not be the only place where durable account data lives.

## Redis Fields

`REDIS_ADDR` is the Redis host and port.

`REDIS_PASSWORD` is the optional secret-backed Redis password.

`REDIS_TLS` enables TLS for Redis.

Production Redis should be private, shared by every Auth replica, monitored, and protected with network policy and authentication where available.

## Readiness And Health

Auth readiness should check:

- PostgreSQL can be reached.
- Redis can be reached.
- Required signing key material is loaded.

When readiness fails, Auth should stay out of load balancer or orchestrator rotation. A live process is not enough if it cannot enforce identity state safely.

## Beginner Workflow

1. Start local PostgreSQL and Redis.
2. Configure Auth to reach them by service name or host.
3. Confirm startup connects to both.
4. Complete setup.
5. Open operations readiness.
6. Confirm database migrations completed.
7. Run login and account self-service tests.
8. Move to managed, backed-up, private dependencies for production.

## Production Checklist

- Use durable PostgreSQL infrastructure.
- Back up PostgreSQL and test restores.
- Use PostgreSQL TLS for remote connections.
- Store database and Redis passwords in the secret provider.
- Size connection pools for replica count and database capacity.
- Keep Redis private and shared across replicas.
- Monitor latency, connection count, storage, locks, slow queries, Redis memory, evictions, and availability.
- Do not point multiple unrelated environments at the same database or Redis.

## Troubleshooting

If Auth does not start, check database host, password, TLS mode, migrations, Redis address, Redis password, and signing key readiness.

If login rate limits behave inconsistently across replicas, check that every replica uses the same Redis.

If users stay signed in after revocation, check token revocation state, session storage, cache invalidation, and Redis availability.

If migrations fail, stop rollout and inspect the migration error before starting more replicas.
