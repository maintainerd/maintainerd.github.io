# Database & Redis

Auth requires both PostgreSQL and Redis at startup. PostgreSQL is the durable system of record. Redis is the fast runtime store used for caches, rate limits, revocation checks, replay windows, and short-lived ceremony/session data.

Auth connects to both dependencies before it starts serving traffic. Readiness stays tied to both dependencies, so operators can safely keep an instance out of rotation when either dependency is unhealthy.

## Dependency Roles

PostgreSQL stores durable Auth state:

- Tenants, tenant members, tenant settings, lifecycle state, and maintenance settings.
- Users, profiles, identities, sessions, consents, trusted devices, account state, and data-erasure requests.
- Services, APIs, permissions, roles, policies, policy history, and workload identity federation.
- OAuth clients, redirect/origin configuration, grants, authorization codes, refresh tokens, consent challenges, PAR requests, device codes, CIBA requests, broker sessions, token revocations, token exchanges, DPoP nonces, and signing keys.
- Identity providers, provider domain rules, provider audiences, registration flows, invites, and account-link requests.
- MFA state such as TOTP secrets, WebAuthn credentials/challenges, backup codes, MFA phones, MFA emails, password history, and lockouts.
- Branding, email/SMS configuration, email/SMS templates, security settings, IP restriction rules, audit logs, auth events, event routes, webhook endpoints, webhook subscriptions, delivery history, and integration event outbox rows.

Redis stores short-lived or performance-sensitive runtime state:

- Global and tenant-aware request rate-limit counters.
- Credential failure counters and account lockout markers.
- Cached user context entries used by authorization and middleware.
- JTI denylist entries for explicitly revoked access tokens.
- Refresh-token replay payloads for the short overlap window used during refresh rotation.
- WebAuthn ceremony sessions between begin and finish calls.
- Cached email and SMS templates.
- Threat/security helper state that is safe to expire.

Use PostgreSQL for data that must survive restarts. Use Redis for data that should be fast, shared across replicas, and naturally bounded by TTL.

## PostgreSQL Configuration

Required PostgreSQL variables:

- `DB_HOST`: PostgreSQL host.
- `DB_PORT`: PostgreSQL port, usually `5432`.
- `DB_USER`: PostgreSQL username.
- `DB_PASSWORD`: required secret-backed password.
- `DB_NAME`: PostgreSQL database name.

Optional PostgreSQL variables:

- `DB_SSLMODE`: optional, default `disable`. Controls PostgreSQL TLS behavior.
- `DB_MAX_OPEN_CONNS`: optional, default `25`. Maximum open connections in the pool.
- `DB_MAX_IDLE_CONNS`: optional, default `10`. Maximum idle connections retained by the pool.
- `DB_CONN_MAX_LIFETIME_SEC`: optional, default `300`. Maximum lifetime for a pooled connection.
- `DB_STATEMENT_TIMEOUT_MS`: optional, default `30000`. PostgreSQL statement timeout in milliseconds.

For the complete environment-variable reference, including secret-provider selection and non-database settings, see [Environment variables](#environment).

Auth builds a PostgreSQL keyword/value DSN from these values and passes `statement_timeout` through the connection `options` parameter. The timeout applies at the database session level so long-running queries are bounded even when a handler forgets to add a narrower context timeout.

Example PostgreSQL values for the quickstart:

```env
DB_HOST=postgres
DB_PORT=5432
DB_USER=maintainerd
DB_PASSWORD=change-me
DB_NAME=maintainerd
DB_SSLMODE=require
DB_MAX_OPEN_CONNS=25
DB_MAX_IDLE_CONNS=10
DB_CONN_MAX_LIFETIME_SEC=300
DB_STATEMENT_TIMEOUT_MS=30000
```

Example production PostgreSQL values:

```env
APP_ENV=production
DB_HOST=auth-prod.cluster-example.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_USER=maintainerd_auth
DB_NAME=maintainerd_auth
DB_SSLMODE=require
DB_MAX_OPEN_CONNS=50
DB_MAX_IDLE_CONNS=10
DB_CONN_MAX_LIFETIME_SEC=300
DB_STATEMENT_TIMEOUT_MS=30000
```

With `SECRET_PROVIDER=aws_secrets` and `SECRET_PREFIX=maintainerd/prod/auth`, put the database password in AWS Secrets Manager as:

```text
maintainerd/prod/auth/db-password
```

## PostgreSQL TLS

Auth defaults to `APP_ENV=production` when `APP_ENV` is unset. In production mode, startup rejects `DB_SSLMODE=disable`.

Use `DB_SSLMODE=require` or stricter for production deployments. Use `verify-ca` or `verify-full` when your PostgreSQL platform provides a CA chain and stable host identity.

## Connection Startup

The PostgreSQL driver is opened first, then Auth verifies the real database connection with `PingContext`.

Startup behavior:

- Pool limits are applied before the first ping.
- Auth retries PostgreSQL connection attempts with exponential backoff.
- Each ping attempt has a short timeout.
- If the database remains unavailable, startup fails.
- GORM is configured with translated database errors so unique and foreign-key violations can map to application-level errors instead of generic 500s.
- The OpenTelemetry GORM plugin is registered so database work can be traced when telemetry is enabled.

## Migrations

Auth runs database migrations during server startup after PostgreSQL and Redis are connected and before repositories/services are used.

Migration behavior:

- Auth creates `schema_migrations` when it does not exist.
- Each migration is recorded by version.
- Already-applied versions are skipped.
- Pending migrations run in order.
- A PostgreSQL session-level advisory lock ensures only one instance runs migrations at a time when multiple replicas start against the same database.
- Startup fails if a migration fails.

This means a rolling deployment can start multiple Auth replicas safely against the same database. One replica applies pending migrations while the others wait on the advisory lock and then skip already-applied versions.

## Redis Configuration

Redis variables:

- `REDIS_ADDR`: optional, default `redis-db:6379`. Redis host and port.
- `REDIS_PASSWORD`: optional secret-backed password. Leave unset for Redis deployments without AUTH.
- `REDIS_TLS`: optional, default `false`. Enables TLS for Redis.

Redis TLS is also enabled automatically when `REDIS_ADDR` starts with `rediss://`. When TLS is enabled, Auth uses TLS 1.2 or newer.

For provider-specific secret names for `DB_PASSWORD` and `REDIS_PASSWORD`, see [Secrets & keys](#secrets).

Example local Redis values:

```env
REDIS_ADDR=redis:6379
REDIS_TLS=false
```

Example production Redis values:

```env
REDIS_ADDR=auth-prod-cache.example.use1.cache.amazonaws.com:6379
REDIS_TLS=true
```

If Redis AUTH is enabled with AWS Secrets Manager:

```text
maintainerd/prod/auth/redis-password
```

## Redis Startup

Auth creates a Redis client, loads `REDIS_PASSWORD` through the configured secret provider, and pings Redis with retry/backoff before the service is considered started.

Startup fails when Redis cannot be reached. Redis backs cross-replica security behavior, not optional display caching.

Redis commands are instrumented with OpenTelemetry tracing through the Redis OTel integration.

## Runtime Redis Usage

Redis-backed request rate limiting is used on both management and public identity surfaces. The public surface applies a global IP rate limit, and credential/reset endpoints apply tighter limits.

Tenant-aware rate limiting reads tenant policy from PostgreSQL and uses Redis counters to enforce the configured window. Per-tenant rate-limit configuration is cached briefly in process memory to avoid reading tenant settings on every request.

Credential lockout counters are Redis-backed and intentionally fail closed when Redis is configured but unavailable. A short authentication outage is safer than allowing unmetered password guessing.

User-context cache entries use a 10-minute TTL and can be invalidated by user, by user across clients, or globally after permission-affecting changes.

Refresh-token replay cache entries exist only for the short overlap window used to make concurrent refresh retries idempotent. If the cache entry is missing, Auth falls back to stricter replay handling.

WebAuthn ceremony sessions are serialized to Redis with a TTL between the begin and finish steps.

Email and SMS template rendering can use Redis-backed template caches to avoid repeated database reads for active tenant templates.

## Readiness And Health

The management port serves health and readiness endpoints:

- `/health` and `/healthz`: liveness-style responses that return `ok`.
- `/livez`: liveness response including the running version.
- `/ready` and `/readyz`: dependency readiness responses.

Readiness checks:

- PostgreSQL connection can be obtained and pinged.
- Redis can be pinged.
- JWKS/public signing key material is loaded.

When any required readiness check fails, `/ready` and `/readyz` return `503` with dependency status details. Keep the management port private, but wire readiness into your orchestrator or load balancer.

When gRPC is enabled, its health status uses the same core dependency checks: PostgreSQL, Redis, and JWKS.

## Quickstart Values

The quickstart compose stack uses service names for internal networking:

```env
DB_HOST=postgres
DB_PORT=5432
DB_USER=maintainerd
DB_PASSWORD=change-me
DB_NAME=maintainerd
DB_SSLMODE=require

REDIS_ADDR=redis:6379
REDIS_TLS=false
```

These values are for local evaluation. In production, use real PostgreSQL and Redis infrastructure, real credentials, TLS where available, and managed backups.

## Production Practices

For PostgreSQL:

- Run PostgreSQL as durable infrastructure, not as an ephemeral sidecar.
- Use `DB_SSLMODE=require`, `verify-ca`, or `verify-full`.
- Store `DB_PASSWORD` in the configured secret provider.
- Size `DB_MAX_OPEN_CONNS` for the database capacity and replica count.
- Keep `DB_MAX_IDLE_CONNS` lower than or equal to `DB_MAX_OPEN_CONNS`.
- Keep `DB_STATEMENT_TIMEOUT_MS` bounded so slow queries do not consume workers indefinitely.
- Back up the database regularly and test restores.
- Monitor connection count, query latency, deadlocks, locks, slow statements, storage, WAL, and replication health.

For Redis:

- Use a shared Redis reachable by every Auth replica.
- Protect Redis with network policy, private networking, and AUTH/TLS when supported.
- Store `REDIS_PASSWORD` in the configured secret provider.
- Size memory for rate-limit keys, cache entries, short-lived sessions, and replay windows.
- Configure eviction policy carefully. Evicting security keys can reduce protections, while refusing writes can fail credential flows closed.
- Monitor Redis latency, memory, evictions, rejected connections, command errors, and availability.

For deployments:

- Keep the management port private but connect `/ready` or `/readyz` to orchestration.
- Expect startup to fail when PostgreSQL, Redis, required migrations, or signing keys are unavailable.
- Do not point multiple environments at the same database or Redis instance unless they are intentionally sharing Auth state.
- Do not reset production volumes. The local quickstart may use `docker compose down -v` for a clean evaluation stack, but production data lives in PostgreSQL and must be treated as customer identity data.
