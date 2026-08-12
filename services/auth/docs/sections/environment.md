# Environment Variables

Auth loads non-sensitive configuration from environment variables and sensitive values through the configured secret provider.

## Required Application Variables

- `APP_PUBLIC_HOSTNAME`: public API hostname.
- `APP_PRIVATE_HOSTNAME`: internal API hostname.
- `APP_FRONTEND_IDENTITY_HOSTNAME`: hosted identity UI hostname.
- `APP_FRONTEND_CONSOLE_HOSTNAME`: admin console hostname.
- `DB_HOST`: PostgreSQL host.
- `DB_PORT`: PostgreSQL port.
- `DB_USER`: PostgreSQL user.
- `DB_NAME`: PostgreSQL database name.

## Required Secrets

- `DB_PASSWORD`: PostgreSQL password.
- `JWT_PRIVATE_KEY`: JWT signing private key.
- `JWT_PUBLIC_KEY`: JWT verification public key.
- `APP_ENCRYPTION_KEY`: 32-byte AES-256 encryption key.
- `HMAC_SECRET_KEY`: signing secret for signed URLs and short-lived links.

## Common Runtime Variables

- `APP_ENV`: defaults to `development`.
- `APP_VERSION`: optional runtime version override.
- `MANAGEMENT_PORT`: defaults to `8082`.
- `LOG_LEVEL`: defaults to `info`.
- `REDIS_ADDR`: defaults to `redis-db:6379`.
- `REDIS_TLS`: defaults to `false`.
- `COOKIE_SECURE`: defaults to `true`.
- `COOKIE_SAMESITE`: defaults to `lax`.
- `COOKIE_DOMAIN`: optional shared cookie domain.

## Control Plane And gRPC

- `CONTROL_PLANE_ENABLED`: enables control-plane mode and implies gRPC.
- `GRPC_ENABLED`: enables the gRPC listener when control plane is not enabled.
- `GRPC_TLS_CERT_FILE`: server TLS certificate.
- `GRPC_TLS_KEY_FILE`: server TLS key.
- `GRPC_CLIENT_CA_FILE`: client CA for mTLS.
- `GRPC_REQUIRE_MTLS`: defaults to `false`, but is forced on when the control plane is enabled.
- `INSTANCE_ROLE`: `system` or `regular`; only meaningful when the control plane is enabled.

## Frontend And Surface Variables

- `APP_FRONTEND_IDENTITY_HOSTNAME`: system-tenant identity host.
- `APP_FRONTEND_CONSOLE_HOSTNAME`: system-tenant console host.
- `APP_CONSOLE_PORT`: embedded console listener; defaults to `3000`.
- `APP_IDENTITY_PORT`: embedded identity listener; defaults to `3001`.

The production image injects frontend config at runtime through `/config.js`. Split-host frontend deployments can use `VITE_AUTH_API_BASE_URL`, `VITE_AUTH_PUBLIC_API_BASE_URL`, and `VITE_AUTH_IDENTITY_BASE_URL` in the SPA build/runtime environment.

## Rotation And Maintenance

- `JWT_KEY_ROTATION_PERIOD_SECONDS`: defaults to `86400`.
- `SECRET_REFRESH_PERIOD_SECONDS`: defaults to `300`.
- `APP_ENCRYPTION_KEYS_PREVIOUS`: comma-separated retired encryption keys for decrypting old rows.
- `SETUP_WINDOW_TTL`: defaults to `30m`.
- `SETUP_BOOTSTRAP_TOKEN`: optional bootstrap credential.
