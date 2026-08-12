# Lifecycle Runners

Auth starts background workers alongside REST so operational state stays current without a separate maintenance process.

## Startup Sequence

At startup Auth:

- Loads configuration and secrets.
- Initializes OpenTelemetry logs, traces, and metrics.
- Initializes JWT signing keys from env or the database.
- Connects to PostgreSQL and Redis.
- Runs database migrations.
- Wires the application services.
- Starts background workers.
- Starts REST and, if enabled, gRPC.

## Migrations

Migrations run before the application services are used. PostgreSQL advisory locking ensures only one replica applies migrations at a time when several instances start against the same database.

## Workers

Auth starts workers for:

- Auth event retention.
- Tenant data retention.
- OAuth short-lived row cleanup.
- Data erasure processing.
- Auth event partition management.
- Signing-key rotation when keys are database-backed.
- Secret refresh.
- gRPC serving when enabled.

## Signing-Key Ownership

When `JWT_PRIVATE_KEY` is set, the operator owns signing-key rotation by changing the secret and redeploying. Automatic rotation is disabled because process-local keys are not shared across replicas.

When JWT keys are database-backed, Auth can rotate signing keys through shared persistent state and keep JWKS consistent across replicas.
