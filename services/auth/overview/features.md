# Features

This section captures the shipped `maintainerd-auth` feature surface at overview level. It focuses on implemented and wired capabilities from the Auth codebase and feature audit; roadmap-only items belong in planning docs, not the public overview.

## Core Authentication

- Email and password login with bcrypt password hashing.
- Brute-force protection, rate limiting, and account lockout helpers.
- Magic-link login with signed, single-use, time-limited links.
- Email verification OTP for signup and email verification.
- Forgot-password and reset-password token flow.
- User registration with registration-flow support and role assignment.
- Invite-based registration with pre-assigned roles.
- Internal management login without requiring a public `client_id`.
- Public identity-surface login with `client_id` and `provider_id`.
- OAuth revocation endpoint for token revocation.

## OAuth 2.0 And OpenID Connect

- Authorization endpoint.
- Token endpoint.
- Token revocation endpoint.
- Token introspection on the management surface.
- OpenID Connect UserInfo endpoint.
- OpenID discovery document.
- OAuth authorization-server metadata.
- JWKS endpoint.
- Pushed Authorization Request support.
- Device authorization plus user approval and denial endpoints.
- Dynamic client registration.
- End-session endpoint.
- Back-channel logout endpoint.
- CIBA endpoint plus approve and deny endpoints.
- Consent challenge retrieval.
- Consent decision submission.
- Consent grant listing.
- Per-grant consent revocation.

## OAuth Grants And Tokens

- Authorization code grant with PKCE S256.
- Refresh token grant with rotation, token-family tracking, and reuse detection.
- Client credentials grant.
- Device code grant.
- Token exchange grant.
- CIBA grant.
- RS256 JWT access tokens.
- Hashed refresh tokens.
- Hashed, single-use authorization codes.
- Refresh token family reuse detection with family-wide revocation.
- Standard token claims including `sub`, `aud`, `iss`, `iat`, `exp`, `jti`, and `nbf`.
- `kid` JWT headers and multi-key JWKS.
- RS256-only validation for normal JWTs.
- Crypto-secure token, JTI, OTP, and random value generation.

## OAuth Client Model

- Confidential clients.
- Public clients.
- Client types for traditional web apps, SPAs, mobile apps, and machine-to-machine clients.
- `client_secret_basic`, `client_secret_post`, and `none` token endpoint auth methods.
- Per-client `grant_types`.
- Per-client `response_types`.
- Per-client access token and refresh token TTL fields.
- Per-client consent requirement.
- Client redirect URIs.
- Client logout URIs.
- Client logo, policy, and terms fields.

## Multi-Factor Authentication

- TOTP enrollment.
- TOTP verification.
- TOTP disable flow.
- Backup-code generation.
- WebAuthn and passkey registration ceremonies.
- WebAuthn and passkey authentication ceremonies.
- SMS OTP login support.
- Step-up challenge endpoints.
- Step-up verification endpoints.
- Per-tenant MFA policy storage through security settings.
- Admin MFA reset endpoint.
- Trusted-device support.

## Federation And Identity Providers

- OIDC upstream federation and token exchange.
- Generic identity provider CRUD.
- Per-tenant identity provider configuration.
- Identity linking.
- Identity unlinking.
- Just-in-time user provisioning for federated login.
- Attribute and metadata extraction from upstream claims.
- Home-realm discovery by email domain.

## Tenants, Organizations, And RBAC

- Tenant lifecycle management.
- Tenant status management.
- Tenant public flag.
- Tenant settings.
- Tenant members with role assignment.
- Roles.
- Permissions.
- Policies.
- Services and APIs as IAM resources.
- Service principals linked to OAuth `client_credentials` clients.
- Service identity claims in access tokens, including `sub_type=service` and `svc`.
- IAM policy evaluator with default deny behavior.
- Explicit-deny-wins policy behavior.
- Wildcard permission matching.
- Service policy bundle endpoint with `ETag`.
- `304 Not Modified` support for unchanged service policy bundles.
- Service-to-service authorization endpoint.
- IAM policy update invalidation events.
- Service-policy assignment and removal invalidation events.
- API keys scoped to APIs and permissions.
- Registration flows with automatic role assignment.
- Invite system with pre-assigned roles.
- Permission middleware on management routes.
- Per-tenant rate-limit settings.
- Per-tenant audit settings.
- Per-tenant maintenance mode.
- Per-tenant branding.
- Per-tenant security settings for MFA, passwords, sessions, lockout, threat controls, and token configuration.

## Session Management

- Cookie-based token delivery for browser clients.
- Refresh token family tracking.
- Refresh token reuse detection.
- Family-wide refresh token revocation.
- Active session listing per user.
- Single session revocation by ID.
- Revoke-all-sessions endpoint.
- Session revocation on password reset and password change paths.
- Session revocation on permission changes.
- Session revocation on role changes.
- Concurrent session limit enforcement by evicting the oldest session.
- Idle session timeout with sliding `last_used_at`.
- Absolute session lifetime cap.

## Secret Management

- Pluggable secret manager abstraction.
- Environment variable secret provider.
- Local file and Docker secrets provider.
- AWS SSM Parameter Store provider.
- AWS Secrets Manager provider.
- HashiCorp Vault KV provider.
- Azure Key Vault provider.
- GCP Secret Manager provider.
- Provider selection through `SECRET_PROVIDER`.
- Secret prefixing through `SECRET_PREFIX` where supported.

## Password And Credential Policy

- Minimum password length default.
- Maximum password length default.
- Uppercase requirement by default.
- Lowercase requirement by default.
- Digit requirement by default.
- Special-character requirement by default.
- Common weak-password pattern blocklist.
- Configurable per-tenant password policy.
- Password history storage.
- Password reuse prevention.
- Password expiration policy fields.
- Login-time password expiry checks.

## Security Hardening

- Brute-force protection on login.
- Account lockout after repeated failures.
- Timing-safe login failure path with dummy bcrypt comparison.
- Timing-safe comparisons for secrets and tokens where implemented.
- CSRF protection on cookie-authenticated public state-changing routes.
- IP-based rate limiting on public and credential endpoints.
- Redis-backed global public rate limiting.
- CORS allow-list middleware.
- Rejection of unsafe wildcard credential CORS configuration.
- HSTS header support.
- Secure HTTP-only auth cookie helpers.
- Security headers for content type, frame policy, referrer policy, CSP, and permissions policy.
- DTO validation at HTTP boundaries.
- Redirect URI dangerous-scheme rejection.
- Request size limits on all routers.
- Stricter request limits on auth endpoints.

## Cryptography And Key Management

- RSA-2048 minimum signing-key validation at startup.
- RS256 signing.
- RS256 validation.
- JWT `kid` headers.
- Multi-key JWKS with active and retiring keys.
- Automatic key rotation runner.
- PKCE S256 validation.
- SHA-256 hashing for refresh tokens.
- SHA-256 hashing for authorization codes.
- Crypto-secure random generation for tokens, OTPs, JTIs, and IDs.

## Audit Logging

- Structured auth event model.
- Auth event REST API.
- Login success events.
- Login failure events.
- Token issuance events.
- Token revocation events.
- Token introspection events.
- Consent grant events.
- Consent revocation events.
- Selected privileged admin action events.
- Retention runner for old auth events.
- Append-only auth event migration.
- Trace ID capture on auth events when available.

## Webhooks

- Configurable webhook endpoints per tenant.
- Event-type subscription model on webhook endpoints.
- HMAC-SHA256 signature helper for delivery payloads.

## Email, SMS, And Templates

- Email provider abstraction.
- SMTP provider.
- AWS SES provider.
- SendGrid provider.
- Postmark provider.
- Mailgun provider.
- Resend provider.
- SMS provider abstraction.
- Twilio provider.
- AWS SNS provider.
- Vonage provider.
- Per-tenant email provider configuration.
- Per-tenant SMS provider configuration.
- Customizable email templates.
- Customizable SMS templates.
- Customizable login templates.

## REST API

- Management REST surface.
- Public identity REST surface.
- Versioned `/api/v1` REST routes.
- Consistent JSON success envelope.
- RFC-style OAuth error responses.
- OpenAPI spec served at `/openapi.json` on the management surface.
- Pagination helpers.
- Pagination on list endpoints.

## gRPC

- gRPC server on `:50051`.
- OpenTelemetry gRPC stats handler.
- Setup gRPC service.
- Tenant management gRPC service.
- gRPC reflection.
- Auth interceptor.
- Logging interceptor.
- Recovery interceptor.
- `grpc.health.v1` health check service.
- Service-to-service gRPC authorization path for protected methods.

## Architecture And Runtime

- Thin `cmd/server` executable entrypoint.
- Application composition root.
- Domain-grouped packages under `internal/`.
- Cross-cutting infrastructure under `internal/platform/`.
- Domain-owned models and repositories.
- Dual-port REST server.
- PostgreSQL with GORM.
- PostgreSQL OpenTelemetry instrumentation.
- Redis-backed cache primitives.
- Redis-backed rate-limit primitives.
- Redis-backed JTI primitives.
- OpenTelemetry tracing initialization.
- OpenTelemetry metrics initialization.
- Background runners for migrations.
- Background runners for seeding.
- Background runners for secret refresh.
- Background runners for key rotation.

## Deployment And Operations

- Multi-stage Dockerfile.
- Non-root runtime user.
- Container health check.
- `/health` liveness endpoint.
- `/ready` readiness endpoint checking DB and Redis.
- Graceful shutdown on `SIGTERM`.
- Prometheus `/metrics` endpoint on the management surface.
