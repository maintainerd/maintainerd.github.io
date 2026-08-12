# Environment Variables

Auth reads normal runtime settings from environment variables and reads credentials through its configured secret provider. In the default local mode the secret provider is `env`, so secret-backed values are still environment variables. In production, the same secret names can come from Docker secrets, AWS, Vault, GCP, or Azure without changing the application code.

This page is the operator-facing reference for the `maintainerd-auth` service, the embedded console, and the embedded identity app.

## How Configuration Is Loaded

At startup Auth:

1. Loads a local `.env` file when one exists.
2. Selects the secret provider from `SECRET_PROVIDER`.
3. Loads required host, database, frontend, key, and encryption settings.
4. Connects to PostgreSQL and Redis.
5. Starts the REST surfaces, background workers, management port, and optional gRPC listener.

Plain environment variables are used for values that are not credentials, such as hostnames, ports, runtime mode, CORS allowlists, logging, and pool sizes.

Secret-backed values are used for credentials and key material, such as database passwords, JWT keys, encryption keys, Redis passwords, signed URL keys, and control-plane bootstrap tokens.

Required variables fail startup when missing or empty. Optional variables either have a documented default or disable the feature when unset.

## Minimal Standalone Configuration

A standalone Auth instance needs these plain variables:

- `APP_ENV`: optional runtime environment, default `production`. Set `APP_ENV=development` only for local development or test environments that intentionally need relaxed security behavior.
- `APP_PUBLIC_HOSTNAME`: public API and OAuth issuer origin, for example `https://identity-api.auth.example.com`.
- `APP_PRIVATE_HOSTNAME`: internal management API origin, for example `https://console-api.auth.example.com`.
- `APP_FRONTEND_IDENTITY_HOSTNAME`: hosted identity UI origin, for example `https://identity.auth.example.com`.
- `APP_FRONTEND_CONSOLE_HOSTNAME`: admin console origin, for example `https://console.auth.example.com`.
- `DB_HOST`: PostgreSQL host.
- `DB_PORT`: PostgreSQL port.
- `DB_USER`: PostgreSQL username.
- `DB_NAME`: PostgreSQL database name.

It also needs these secret-backed values:

- `DB_PASSWORD`: PostgreSQL password.
- `JWT_PRIVATE_KEY`: PEM private key used to sign JWTs.
- `JWT_PUBLIC_KEY`: PEM public key published through JWKS and used for verification.
- `APP_ENCRYPTION_KEY`: exactly 32 bytes. Used as the current AES-256 application encryption key.
- `HMAC_SECRET_KEY`: signing key for signed URLs and short-lived links.

For local quickstart, `examples/quickstart/setup.sh` generates the required key material and appends it to the local `.env`.

## Secret Provider

`SECRET_PROVIDER` selects where Auth reads secret-backed values. Supported values:

- `env`: read secret values directly from environment variables. This is the default and is simplest for local development.
- `file`: read secret files from `SECRET_FILE_PATH`, default `/run/secrets`.
- `aws_secrets`: read from AWS Secrets Manager.
- `aws_ssm`: read from AWS SSM Parameter Store.
- `vault`: read from HashiCorp Vault KV v2.
- `gcp`: read from GCP Secret Manager.
- `azure_kv`: read from Azure Key Vault.

`SECRET_PREFIX` defaults to `maintainerd/auth`. External providers use it as the namespace or path prefix for Auth secrets.

Secret values are normalized consistently across providers:

- Leading and trailing whitespace is trimmed.
- Values prefixed with `base64:` are base64-decoded before use.
- Empty required secrets fail startup.

## Secret Provider Variables

- `SECRET_PROVIDER`: optional, default `env`. Selects the active secret provider.
- `SECRET_PREFIX`: optional, default `maintainerd/auth`. Prefix for external secret names.
- `SECRET_STRICT`: optional, default `false`. When `false`, a missing secret in a non-env provider may fall back to the same key in the process environment. When `true`, the configured provider is authoritative and missing secrets fail startup.
- `SECRET_FILE_PATH`: optional, default `/run/secrets`. Directory used by the `file` provider. Secret filenames are lowercase with underscores converted to hyphens, so `JWT_PRIVATE_KEY` becomes `jwt-private-key`.
- `AWS_REGION`: optional, default `us-east-1`. Region used by `aws_secrets` and `aws_ssm`.
- `VAULT_ADDR`: optional for Vault, default `http://localhost:8200`. Must use HTTPS outside local development when `APP_ENV=production`.
- `VAULT_TOKEN`: optional Vault token. If unset, Auth uses Vault AppRole.
- `VAULT_MOUNT`: optional, default `secret`. Vault KV v2 mount.
- `VAULT_SECRET_FIELD`: optional, default `value`. Field read from each Vault secret.
- `VAULT_ROLE_ID`: required for Vault AppRole when `VAULT_TOKEN` is unset.
- `VAULT_SECRET_ID`: required for Vault AppRole when `VAULT_TOKEN` is unset.
- `GCP_PROJECT_ID`: required when `SECRET_PROVIDER=gcp`.
- `AZURE_KEYVAULT_URL`: required when `SECRET_PROVIDER=azure_kv`.

## Required Secret Values

- `DB_PASSWORD`: PostgreSQL password. Loaded through the secret provider.
- `JWT_PRIVATE_KEY`: private signing key for access tokens, ID tokens, and other JWTs.
- `JWT_PUBLIC_KEY`: public verification key exposed through JWKS.
- `APP_ENCRYPTION_KEY`: current application encryption key. It must be exactly 32 bytes because Auth uses it as AES-256 key material.
- `HMAC_SECRET_KEY`: HMAC key used by the signed URL signer, including invite and short-lived link flows.

Keep these values out of logs, source control, Docker image layers, and frontend builds.

## Optional Secret Values

- `REDIS_PASSWORD`: Redis password. Leave unset for local Redis without AUTH.
- `APP_ENCRYPTION_KEYS_PREVIOUS`: comma-separated list of retired 32-byte encryption keys. These keys are decrypt-only and are used during encryption-key rotation so old encrypted rows can still be read until they are re-encrypted.
- `SETUP_BOOTSTRAP_TOKEN`: bootstrap credential for the gRPC setup service used by Core or another control plane. Standalone deployments normally leave it unset and use the REST setup wizard instead.

## Application Identity

- `APP_ENV`: optional, default `production`. Controls production-sensitive behavior such as security headers, database/TLS expectations, gRPC hardening, and development-only conveniences. Set `APP_ENV=development` explicitly for local work.
- `APP_VERSION`: optional. Overrides the build-injected version shown in telemetry and build info. If unset, Auth uses the version baked into the binary; local builds fall back to `dev`.
- `LOG_LEVEL`: optional, default `info`. Supported values are `debug`, `info`, `warn`, and `error`. `warning` is also accepted as `warn`.

`ENV=production` is still recognized as a compatibility fallback for security middleware, but new deployments should use `APP_ENV`. Because Auth is secure by default, an unset `APP_ENV` is treated as `production`.

## Hostnames And Surfaces

- `APP_PUBLIC_HOSTNAME`: required. Public API origin and OAuth/OIDC issuer origin. This is the origin used by discovery, JWKS, OAuth authorize/token flows, hosted identity API calls, and external application authentication.
- `APP_PRIVATE_HOSTNAME`: required. Internal management API origin used by the console and operator/admin workflows.
- `APP_FRONTEND_IDENTITY_HOSTNAME`: required. System-tenant hosted identity UI origin.
- `APP_FRONTEND_CONSOLE_HOSTNAME`: required. System-tenant admin console UI origin.
- `APP_CONSOLE_PORT`: optional, default `3000`. Embedded console SPA listener inside the released image.
- `APP_IDENTITY_PORT`: optional, default `3001`. Embedded identity SPA listener inside the released image.
- `MANAGEMENT_PORT`: optional, default `8082`. Operational listener for health, readiness, OpenAPI JSON, and Prometheus metrics.

Use full HTTPS origins for hostnames in deployed environments. The frontend hostname variables describe the system tenant host; tenant-specific identity and console hosts are derived from tenant DNS slugs.

## Database

- `DB_HOST`: required. PostgreSQL host.
- `DB_PORT`: required. PostgreSQL port, usually `5432`.
- `DB_USER`: required. PostgreSQL username.
- `DB_PASSWORD`: required secret. PostgreSQL password.
- `DB_NAME`: required. PostgreSQL database name.
- `DB_SSLMODE`: optional, default `disable`. Use stronger modes such as `require` or `verify-full` in production when PostgreSQL is remote or managed.
- `DB_MAX_OPEN_CONNS`: optional, default `25`. Maximum open connections in the database pool.
- `DB_MAX_IDLE_CONNS`: optional, default `10`. Maximum idle connections retained by the pool.
- `DB_CONN_MAX_LIFETIME_SEC`: optional, default `300`. Maximum connection lifetime in seconds.
- `DB_STATEMENT_TIMEOUT_MS`: optional, default `30000`. Per-statement timeout applied to database work in milliseconds.

The database stores tenants, users, OAuth clients, identity providers, roles, policies, MFA state, sessions, event outbox rows, webhook deliveries, audit logs, branding, messaging configuration, and setup state.

## Redis

- `REDIS_ADDR`: optional, default `redis-db:6379`. Redis address used for cache-backed runtime state.
- `REDIS_PASSWORD`: optional secret. Password for Redis AUTH.
- `REDIS_TLS`: optional, default `false`. Enables TLS for Redis. TLS is also enabled automatically when `REDIS_ADDR` starts with `rediss://`.

Auth connects to Redis during startup and readiness depends on Redis being reachable.

## Cookies And Browser Sessions

- `COOKIE_SECURE`: optional, default `true`. When true, session cookies require HTTPS. Set to `false` only for local development without TLS.
- `COOKIE_SAMESITE`: optional, default `lax`. Controls browser SameSite behavior. `lax` is the practical default for federated login redirects.
- `COOKIE_DOMAIN`: optional. When unset, cookies are host-only. When set, Auth scopes cookies to a shared parent domain so first-party surfaces under that domain can share a session.

Use `COOKIE_DOMAIN` only for a domain whose subdomains you control. Setting a cookie domain changes the cookie prefix strategy from host-only cookies to secure domain-scoped cookies. External relying-party applications do not share these cookies; they use OAuth/OIDC tokens and their own application sessions.

## Proxy And Client IP Handling

- `TRUSTED_PROXY_CIDRS`: optional. Comma-separated list of proxy CIDRs or bare proxy IPs allowed to provide forwarding headers. Defaults to loopback plus private IPv4 ranges and the RFC4193 IPv6 private range.
- `TRUST_ALL_PROXIES`: optional, default `false`. When `true`, Auth accepts forwarding headers from any peer. Use only when the platform guarantees those headers are overwritten by a trusted load balancer or reverse proxy.

Client IP resolution affects rate limits, IP restriction rules, security events, and audit context. Production deployments should prefer explicit `TRUSTED_PROXY_CIDRS` over `TRUST_ALL_PROXIES=true`.

## CORS

- `CORS_ALLOWED_ORIGINS`: optional. Comma-separated list of extra origins allowed by the CORS middleware.

This variable is for operational exceptions and static allowlists. It is not the normal way to onboard external applications. External applications should be registered as clients; their configured origins and redirect URIs become part of the tenant/client trust model and can be checked dynamically.

## Runtime Modes And gRPC

- `CONTROL_PLANE_ENABLED`: optional, default `false`. Enables control-plane mode for a Maintainerd ecosystem deployment managed by Core. Enabling this also enables gRPC and forces mTLS.
- `GRPC_ENABLED`: optional, default `false`. Enables the gRPC listener without enabling full control-plane mode.
- `INSTANCE_ROLE`: optional, default `system`. Valid values are `system` and `regular`. Used by orchestrated deployments to distinguish a system instance from a regular tenant-scoped instance.
- `SETUP_BOOTSTRAP_TOKEN`: optional secret. Required for orchestrated gRPC setup flows that provision Auth through Core. Leave unset for standalone REST setup.
- `SETUP_WINDOW_TTL`: optional, default `30m`. Duration that bounds the orchestrated setup window after process start. Must be a positive Go duration such as `10m`, `30m`, or `1h`.
- `GRPC_TLS_CERT_FILE`: optional unless gRPC TLS/mTLS is required. Path to the server certificate file.
- `GRPC_TLS_KEY_FILE`: optional unless gRPC TLS/mTLS is required. Path to the server private key file.
- `GRPC_CLIENT_CA_FILE`: optional unless mTLS is required. Path to the client CA bundle used to verify gRPC clients.
- `GRPC_REQUIRE_MTLS`: optional, default `false`. Requires client certificates for gRPC when manually enabling gRPC. It is forced to true when `CONTROL_PLANE_ENABLED=true`.

Standalone Auth uses the REST setup wizard and normally leaves `CONTROL_PLANE_ENABLED`, `GRPC_ENABLED`, and `SETUP_BOOTSTRAP_TOKEN` unset. Maintainerd ecosystem deployments controlled by Core enable the control plane and provide mTLS material plus a bootstrap token.

## JWT And Key Rotation

- `JWT_PRIVATE_KEY`: required secret. Current JWT signing private key.
- `JWT_PUBLIC_KEY`: required secret. Public key paired with `JWT_PRIVATE_KEY`.
- `JWT_KEY_ID`: optional, default `maintainerd-auth-key-1`. Key ID installed into the in-memory signing key store and exposed through token headers/JWKS.
- `JWT_KEY_ROTATION_PERIOD_SECONDS`: optional, default `86400`. Period used by the JWT key rotation runner.
- `SECRET_REFRESH_PERIOD_SECONDS`: optional, default `300`. Period used by the runtime secret refresh loop.

JWT keys should be rotated deliberately. Keep old public keys available long enough for already-issued tokens to expire or for consumers to refresh JWKS.

## WebAuthn And Passkeys

- `WEBAUTHN_RP_ID`: optional. Overrides the relying-party ID derived from `APP_PUBLIC_HOSTNAME`.

Set this when console, identity, and tenant subdomains need passkeys to work across a shared registrable parent domain. For example, if identity runs at `identity.auth.example.com` and tenant identity surfaces run under `*.auth.example.com`, use `WEBAUTHN_RP_ID=auth.example.com`.

Auth validates WebAuthn ceremony origins at request time against the RP ID. A removed older setting named `WEBAUTHN_EXTRA_ORIGINS` is no longer used.

## CAPTCHA

- `CAPTCHA_SECRET`: optional. Enables CAPTCHA verification for flows that provide a CAPTCHA token. When unset, CAPTCHA verification is disabled for local development and tests.
- `CAPTCHA_VERIFY_URL`: optional, default `https://www.google.com/recaptcha/api/siteverify`. Verification endpoint used by the configured CAPTCHA provider.
- `CAPTCHA_MIN_SCORE`: optional, default `0.5`. Risk threshold for providers that return a score, such as reCAPTCHA v3. Providers that only return success/failure are accepted based on their success result.

Do not put CAPTCHA provider secrets in frontend bundles. Browser apps should send only the provider response token; Auth sends the secret to the provider from the server side.

## Events And Webhooks

- `RABBITMQ_URL`: optional. Enables AMQP publishing when set, for example `amqp://user:password@rabbitmq:5672/`.

When unset, the broker integration is disabled. When set, Auth connects to RabbitMQ, declares the durable topic exchange `maintainerd-auth.events`, and publishes integration events with publisher confirms. The URL contains credentials, so treat it as secret operational configuration even though it is currently read as a normal environment variable.

## Invites, OTP, And Local Testing

- `INVITE_TTL_HOURS`: optional, default `72`. Number of hours before invite links expire.
- `MAINTAINERD_DEV_LOG_OTP`: optional, default `false`. When exactly `true`, OTP values are printed to logs for local development flows without a real email or SMS provider.

Never enable `MAINTAINERD_DEV_LOG_OTP` in a deployed environment. OTPs are single-use credentials, and logs are often shipped to shared systems.

Email providers, SMS providers, templates, branding, and tenant messaging behavior are primarily configured through Auth management data instead of process environment variables.

## Observability

- `OTEL_ENABLED`: optional, default `false`. Enables OTLP export for traces and logs when set to `true`.
- `OTEL_SERVICE_NAME`: optional, default `maintainerd-auth`. Service name attached to OpenTelemetry resources and the slog-to-OTel bridge.
- `OTEL_EXPORTER_OTLP_ENDPOINT`: optional. Standard OpenTelemetry endpoint for OTLP/gRPC export, commonly `http://otel-collector:4317`.

Auth uses the standard OpenTelemetry SDK, so standard `OTEL_*` variables for headers, TLS, protocol-specific endpoints, and exporter behavior are also respected by the SDK.

Prometheus metrics are available from the management port at `/metrics`. The Prometheus exporter is initialized for the management endpoint even when OTLP trace/log export is disabled.

Important built-in metrics include:

- `build_info`: version, service name, and build metadata.
- `auth_events_total`: authentication and authorization event counts.
- `security_denials_total`: middleware access-denial counts.
- `audit_write_failures_total`: management audit-log write failures.

## GeoIP

- `GEOIP_DB_PATH`: optional. Path to a local GeoIP database used for resolving request location context when available.

When unset or unavailable, Auth continues without GeoIP enrichment.

## Frontend Runtime Variables

The released image can inject SPA configuration at container start through `/config.js` and `window.__ENV__`. Build-time `VITE_*` values remain as fallbacks for local or split frontend deployments.

Console variables:

- `VITE_AUTH_API_BASE_URL`: internal management API base URL for the console. In production it defaults to `/api/v1` when same-origin proxying is used.
- `VITE_AUTH_PUBLIC_API_BASE_URL`: public identity API base URL for console flows that need the public/OAuth data plane. In production it defaults to `/public-api/api/v1` when same-origin proxying is used.
- `VITE_AUTH_IDENTITY_BASE_URL`: fallback identity UI origin. The console normally prefers tenant bootstrap data when it knows the tenant-specific identity URL.

Identity variables:

- `VITE_AUTH_API_BASE_URL`: public API base URL for the hosted identity app. In production it defaults to `/api/v1` when same-origin proxying is used.

In Vite development mode, the console and identity apps ignore these absolute values and use relative proxy paths instead. This keeps local cookies and API calls on the same browser origin.

## Example Local Environment

```env
APP_ENV=development
APP_PUBLIC_HOSTNAME=https://identity-api.auth.maintainerd.local
APP_PRIVATE_HOSTNAME=https://console-api.auth.maintainerd.local
APP_FRONTEND_IDENTITY_HOSTNAME=https://identity.auth.maintainerd.local
APP_FRONTEND_CONSOLE_HOSTNAME=https://console.auth.maintainerd.local

DB_HOST=postgres
DB_PORT=5432
DB_USER=maintainerd
DB_PASSWORD=change-me
DB_NAME=maintainerd
DB_SSLMODE=disable

REDIS_ADDR=redis:6379
COOKIE_SECURE=true
COOKIE_SAMESITE=lax
WEBAUTHN_RP_ID=auth.maintainerd.local
LOG_LEVEL=info

SECRET_PROVIDER=env
APP_ENCRYPTION_KEY=replace-with-32-byte-secret-value
HMAC_SECRET_KEY=replace-with-random-secret
JWT_PRIVATE_KEY=replace-with-private-pem
JWT_PUBLIC_KEY=replace-with-public-pem
```

For the maintained local setup, prefer the quickstart files because they generate key material and wire the Docker service names correctly.

## Production Checklist

Before running Auth in production:

- Leave `APP_ENV` unset or set `APP_ENV=production` explicitly.
- Use HTTPS origins for all public, private, console, and identity hostnames.
- Keep `COOKIE_SECURE=true`.
- Use an explicit `COOKIE_DOMAIN` only when shared first-party sessions are required and every subdomain is trusted.
- Use `DB_SSLMODE=require` or stronger for remote PostgreSQL.
- Move secrets out of plain env when your platform supports a secret manager.
- Set `SECRET_STRICT=true` after every required secret has been migrated to the configured provider.
- Use explicit `TRUSTED_PROXY_CIDRS` for the reverse proxy or load balancer.
- Keep `MANAGEMENT_PORT` private.
- Configure `WEBAUTHN_RP_ID` when passkeys span multiple subdomains.
- Configure `RABBITMQ_URL` only when events/webhooks should publish to RabbitMQ.
- Configure `OTEL_ENABLED=true` and `OTEL_EXPORTER_OTLP_ENDPOINT` when exporting traces and logs to a collector.
- Leave `MAINTAINERD_DEV_LOG_OTP` unset.
