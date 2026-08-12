# Security & Ops

Auth is designed for self-hosted operation with explicit runtime boundaries, secret sourcing, key management, observability, and request protection.

## Token And Key Security

- RS256 JWTs.
- Multi-key JWKS.
- `kid` headers.
- Automatic key rotation.
- Hashed authorization codes.
- Hashed refresh tokens.
- Secure random IDs, OTPs, JTIs, and tokens.
- PKCE S256 validation.

## Request Protection

- Credential throttling.
- Account lockout.
- CSRF protection for cookie-authenticated state changes.
- CORS allow-listing.
- Request-size limits.
- Security headers.
- Redirect URI validation.

## Secret Providers

Secret values can come from environment variables, mounted files, Docker secrets, AWS SSM, AWS Secrets Manager, HashiCorp Vault, Azure Key Vault, or GCP Secret Manager.

## Observability

The service exposes health checks, Prometheus metrics, OpenTelemetry traces and metrics, structured logs, and operational management endpoints.

