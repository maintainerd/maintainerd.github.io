# Database & Redis

Auth requires PostgreSQL and Redis.

## PostgreSQL

PostgreSQL stores durable Auth state:

- Tenants, members, users, profiles, roles, permissions, policies, services, and APIs.
- OAuth clients, grants, consent, signing keys, and session records.
- Identity providers, linked identities, registration flows, invites, and account state.
- Messaging configuration, branding, templates, events, audit logs, and webhook records.

## PostgreSQL Tuning Variables

- `DB_SSLMODE`: defaults to `disable`.
- `DB_MAX_OPEN_CONNS`: defaults to `25`.
- `DB_MAX_IDLE_CONNS`: defaults to `10`.
- `DB_CONN_MAX_LIFETIME_SEC`: defaults to `300`.
- `DB_STATEMENT_TIMEOUT_MS`: defaults to `30000`.

## Redis

Redis backs runtime state that should be fast and short-lived:

- Rate limit counters.
- Cache primitives.
- Token and JTI state.
- OAuth, MFA, and identity flow state where short-lived storage is needed.

## Readiness

The `/ready` and `/readyz` endpoints should fail when required database or Redis dependencies are unavailable.
