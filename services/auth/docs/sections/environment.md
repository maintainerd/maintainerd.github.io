# Environment Variables

Environment variables are the deployment settings Auth reads when the process starts. They describe the runtime, hostnames, database, Redis, cookies, proxies, observability, and secret-provider behavior.

Use this page when you are looking at deployment settings and need to understand what a field means. Keep secret values in the configured secret provider whenever possible.

## Where To Configure Them

You configure environment variables in the place that starts Auth:

- Local quickstart environment file.
- Docker Compose service environment.
- Kubernetes Deployment, Secret, and ConfigMap.
- Container platform settings.
- Maintainerd Core service configuration when Auth is orchestrated.
- CI/CD deployment variables.

The Auth console can show runtime summaries and health, but process environment changes usually require a redeploy or restart.

## How Auth Loads Configuration

At startup Auth loads normal configuration, selects the secret provider, reads secret-backed values, connects to PostgreSQL and Redis, validates signing keys, and starts the enabled surfaces.

Plain environment variables are for non-secret settings such as hostnames, ports, runtime mode, CORS allowlists, logging, and pool sizes.

Secret-backed values are for credentials and key material such as database passwords, Redis passwords, JWT keys, encryption keys, HMAC keys, and bootstrap tokens.

If a required value is missing, Auth should fail startup instead of serving an incomplete identity system.

## Field Types

When a field asks for an origin URL, use a full browser origin with scheme and hostname.

When a field asks for a hostname or address, use the value the Auth process can reach from inside its runtime network.

When a field asks for a boolean, use `true` or `false`.

When a field asks for seconds or milliseconds, use an integer.

When a field asks for a duration, use a duration format supported by the runtime, such as minutes or hours.

When a field asks for a comma-separated list, enter each value exactly and avoid spaces unless the deployment platform trims them safely.

When a field is secret-backed, store the value in the configured secret provider instead of exposing it in browser-visible or source-controlled configuration.

## Application Identity Fields

`APP_ENV` tells Auth whether it is running in production-like behavior or development behavior. Production is the safe default. Use development only for local work.

`APP_VERSION` controls the version shown in build info and telemetry when the build does not already provide one.

`LOG_LEVEL` controls how much detail Auth writes to logs. Use debug sparingly because identity logs can become noisy and may include sensitive context if the application is misconfigured.

## Hostname Fields

`APP_PUBLIC_HOSTNAME` is the public identity API and OAuth/OIDC issuer origin. Applications, discovery, JWKS, OAuth flows, and hosted identity API calls depend on this value.

`APP_PRIVATE_HOSTNAME` is the internal management API origin used by the console and administrator workflows. Keep it private or strongly protected.

`APP_FRONTEND_IDENTITY_HOSTNAME` is the hosted identity UI origin where users sign in, register, reset passwords, complete MFA, and manage account settings.

`APP_FRONTEND_CONSOLE_HOSTNAME` is the administrator console origin.

`APP_CONSOLE_PORT` and `APP_IDENTITY_PORT` are the embedded frontend listener ports inside the released image.

`MANAGEMENT_PORT` is the operational listener for health, readiness, OpenAPI JSON, and metrics. It should not be treated as a public user surface.

## Database Fields

`DB_HOST`, `DB_PORT`, `DB_USER`, and `DB_NAME` tell Auth how to reach PostgreSQL.

`DB_PASSWORD` is the secret-backed PostgreSQL password.

`DB_SSLMODE` controls PostgreSQL TLS. Production should use TLS for remote or managed PostgreSQL.

`DB_MAX_OPEN_CONNS` limits total database connections per Auth replica.

`DB_MAX_IDLE_CONNS` controls how many idle connections stay open.

`DB_CONN_MAX_LIFETIME_SEC` limits how long pooled connections are reused.

`DB_STATEMENT_TIMEOUT_MS` bounds database statements so slow queries do not consume workers indefinitely.

## Redis Fields

`REDIS_ADDR` tells Auth where Redis is reachable.

`REDIS_PASSWORD` is the optional secret-backed Redis password.

`REDIS_TLS` enables TLS for Redis. Some Redis URLs also imply TLS.

Redis is used for short-lived security and performance state. Treat Redis availability as part of the identity runtime, not as optional decoration.

## Cookie And Browser Fields

`COOKIE_SECURE` controls whether browser cookies require HTTPS. Keep it true outside local development.

`COOKIE_SAMESITE` controls how cookies behave across browser navigations. `lax` is the practical default for login redirects.

`COOKIE_DOMAIN` allows first-party Auth subdomains to share cookie scope. Use it only for a domain whose subdomains you control.

`WEBAUTHN_RP_ID` controls the relying-party ID for passkeys. It must match the hostname plan users will actually visit.

## Proxy And Origin Fields

`TRUSTED_PROXY_CIDRS` lists proxies allowed to provide forwarding headers. This affects client IP detection, rate limits, audit context, and IP restrictions.

`TRUST_ALL_PROXIES` accepts forwarding headers from any peer. Use it only when your infrastructure guarantees headers are overwritten by a trusted edge.

`CORS_ALLOWED_ORIGINS` adds static CORS exceptions. This should not replace registering applications as clients.

## Runtime And gRPC Fields

`CONTROL_PLANE_ENABLED` enables Maintainerd control-plane behavior.

`GRPC_ENABLED` enables the gRPC listener without the full control-plane mode.

`INSTANCE_ROLE` describes how the process participates in orchestrated deployments.

`SETUP_BOOTSTRAP_TOKEN` is a secret-backed setup credential for orchestrated setup.

`SETUP_WINDOW_TTL` limits how long orchestrated setup remains available after start.

`GRPC_TLS_CERT_FILE`, `GRPC_TLS_KEY_FILE`, `GRPC_CLIENT_CA_FILE`, and `GRPC_REQUIRE_MTLS` configure gRPC TLS and mTLS.

## Secret Provider Fields

`SECRET_PROVIDER` chooses where Auth reads secret-backed values. Common choices are environment, file secrets, cloud secret managers, Vault, GCP Secret Manager, and Azure Key Vault.

`SECRET_PREFIX` scopes secret names inside providers that support namespaces or paths.

`SECRET_STRICT` decides whether missing provider secrets may fall back to environment variables. Use strict mode after migration to a real provider is complete.

Provider-specific fields such as AWS region, Vault address, GCP project, or Azure Key Vault URL tell Auth how to reach the selected provider.

## Observability Fields

`OTEL_ENABLED` enables OpenTelemetry export.

`OTEL_SERVICE_NAME` controls the service name attached to telemetry.

`OTEL_EXPORTER_OTLP_ENDPOINT` points to the OpenTelemetry collector.

`GEOIP_DB_PATH` points to optional GeoIP enrichment data.

Prometheus metrics are exposed from the management port. Keep that port private while still connecting readiness and metrics to your operations stack.

## Messaging And Local Testing Fields

`RABBITMQ_URL` enables AMQP event publishing when configured. Treat it as secret operational configuration because broker URLs commonly include credentials.

`INVITE_TTL_HOURS` controls default invite expiration.

`MAINTAINERD_DEV_LOG_OTP` prints OTP values to logs for local development. Never enable it in shared or production environments.

Email providers, SMS providers, templates, and tenant messaging behavior are mainly configured through Auth management data rather than process environment variables.

## Beginner Workflow

1. Start from the quickstart values locally.
2. Confirm hostnames match what you open in the browser.
3. Confirm PostgreSQL and Redis are reachable.
4. Move secrets into a secret provider before production.
5. Turn on production cookie and database TLS behavior.
6. Configure proxies and CORS only after the hostname plan is clear.
7. Add observability once the service is reachable.
8. Restart or redeploy after changing process environment.

## Production Checklist

- Use HTTPS origins for all public, private, console, and identity hostnames.
- Keep the management port private.
- Keep `COOKIE_SECURE` enabled.
- Use database TLS for remote PostgreSQL.
- Store secret-backed values outside source control and frontend builds.
- Use explicit trusted proxy settings.
- Configure WebAuthn before enabling passkeys across subdomains.
- Leave development OTP logging disabled.
- Verify readiness checks before sending traffic.

## Troubleshooting

If Auth will not start, check missing required values, secret-provider access, PostgreSQL, Redis, and signing keys.

If login redirects to the wrong place, check public, console, identity, and tenant hostnames.

If cookies do not stick, check HTTPS, cookie domain, SameSite, and proxy headers.

If passkeys fail, check the WebAuthn relying-party ID and browser origin.

If rate limits or audit IPs look wrong, check trusted proxy settings.
