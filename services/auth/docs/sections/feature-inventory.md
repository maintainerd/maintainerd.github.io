# Features

This inventory is based on the current `maintainerd-auth` codebase. It comes from the mounted backend routes, the `web/console` admin experience, the `web/identity` hosted identity experience, and the current protobuf service definitions.

The product name is **Auth**. The repository and Docker image name remain `maintainerd-auth`.

## Product Surfaces

- All-in-one service package for the Go backend, admin console, and hosted identity UI.
- Admin console for operators and tenant administrators.
- Hosted identity UI for end-user login, OAuth browser journeys, MFA, and account self-service.
- Internal management REST API under `/api/v1` for the console and control-plane operations.
- Public identity REST API under `/api/v1` for browser, OAuth, self-service, and public lookup flows.
- Private management port for probes, metrics, and machine-readable OpenAPI.
- OpenAPI served at `/openapi.json` on public, internal, and management routers.
- Health and readiness aliases: `/health`, `/healthz`, `/ready`, `/readyz`, and `/livez`.
- Prometheus metrics on the management surface at `/metrics`.
- gRPC surface for selected control-plane and service-authorization operations.
- Standalone mode by default, with no gRPC listener bound unless explicitly enabled.
- Runtime gRPC mode for authorization, token introspection, and peer reads.
- Core control-plane mode for orchestrated Maintainerd provisioning.
- System and regular instance roles for ecosystem deployments.
- Embedded console and identity SPAs in the production image.

## Setup And Bootstrap

- Setup status endpoint for detecting first-run state.
- Tenant bootstrap flow.
- Admin bootstrap flow.
- Profile creation during setup.
- Control-service registration.
- gRPC setup bootstrap gated by `SETUP_BOOTSTRAP_TOKEN`.
- Setup window bounded by `SETUP_WINDOW_TTL`.
- Control client, resource API, role, and console client ensure operations for Core-managed setup.
- Console setup pages for tenant and admin creation.
- Dedicated no-access and service-unavailable console states.

## Admin Console

- Dashboard page for high-level operational state.
- Monitoring and log detail pages.
- Tenant listing, creation, detail, editing, membership, and settings pages.
- User-management hub for users, invitations, and roles.
- User listing, user creation, user detail, user editing, and administrative user actions.
- Invitation creation and invitation detail pages.
- Role listing, creation, detail, editing, permission assignment, and permission removal.
- Authentication hub for identity providers and registration flows.
- Applications hub for OAuth clients and workload identity federations.
- APIs and resources hub for services, APIs, permissions, and policies.
- Service listing, creation, detail, editing, status, and policy assignment workflows.
- API listing, creation, detail, editing, and status workflows.
- Permission listing and permission detail operations.
- Policy listing, creation, detail, editing, status, service attachment, and version history.
- Identity provider listing, creation, detail, editing, status, and connection test workflows.
- OAuth client listing, creation, detail, and editing workflows.
- Registration flow listing, creation, detail, editing, status, and role assignment workflows.
- Workload identity federation listing, creation, detail, and editing workflows.
- Events and webhooks hub.
- Webhook creation, detail, editing, subscriptions, delivery history, and replay workflows.
- Auth event and management audit-log detail pages.
- Branding hub for visual branding, login templates, email templates, and SMS templates.
- Email messaging configuration page.
- SMS messaging configuration page.
- Security hub for MFA, password, session, token, lockout, registration, and threat controls.
- Tenant settings page for tenant-level operational controls.
- Console account read-only surface for "signed in as" and avatar display.
- Console step-up flow for sensitive administrative actions.
- Admin MFA reset for all factors or a selected factor.

## Hosted Identity UI

- Login page.
- Registration page.
- Invite-registration page.
- Email-verification page.
- Forgot-password page.
- Reset-password page.
- Magic-link page.
- OAuth authorization page.
- OAuth callback page.
- Logout page.
- OAuth consent page.
- OAuth device-code page.
- OAuth CIBA page.
- OAuth grants page.
- OAuth end-session page.
- Profile completion after registration.
- Login-success landing page.
- MFA hub.
- TOTP setup page.
- Passkey setup page.
- SMS MFA setup page.
- Email OTP setup page.
- SMS login page.
- Backup-code recovery page.
- Account-locked page.
- Too-many-requests page.
- Account-link confirmation page.
- Account erasure page.
- Account profile list, create, edit, default-profile, and avatar workflows.
- Account security hub.
- Email change page.
- Username change page.
- Password change page.
- Session management page.
- Trusted-device management page.
- Account settings page.
- Account data page.
- Linked identities page.
- Phone verification page.

## Authentication

- Email and password login.
- Refresh-token endpoint for browser/session continuity.
- Logout endpoint.
- User registration.
- Invite-based registration.
- Registration-context lookup for the hosted UI.
- Email verification send and verify flows.
- Forgot-password flow.
- Reset-password flow.
- Magic-link send and verify flows.
- SMS login send and verify flows.
- Backup-code account recovery.
- MFA challenge handling during login.
- Login MFA verification endpoint.
- Login-time SMS OTP send endpoint.
- Login-time email OTP send endpoint.
- Login-time WebAuthn assertion begin endpoint.
- Account-link confirmation for connecting an upstream identity to an existing account.
- Public tenant lookup for login context.
- Public client lookup for resolving `client_id` into identity-context and branding.

## OAuth 2.0 And OpenID Connect

- Authorization endpoint.
- Token endpoint.
- Token revocation endpoint.
- Token introspection on the internal management surface.
- OpenID Connect UserInfo endpoint.
- OpenID Connect discovery document.
- OAuth authorization-server metadata.
- JWKS endpoint.
- DPoP proof validation for token requests.
- DPoP server nonce gate for clients that require DPoP.
- Pushed Authorization Requests.
- Device authorization flow.
- Device-code verify and deny endpoints.
- CIBA initiation.
- CIBA approve and deny endpoints.
- End-session endpoint with GET and POST support.
- Back-channel logout endpoint.
- Consent challenge retrieval.
- Consent decision submission.
- OAuth consent continuation.
- Consent grants listing.
- Per-grant consent revocation.
- OAuth connections endpoint.
- OAuth broker resume path.
- Dynamic client registration on the internal surface.
- Dynamic client registration read support through the internal OAuth registration handler.
- Signing-key listing, rotation, retirement, and compromise handling on the internal surface.

## OAuth Grants And Tokens

- Authorization code flow with PKCE.
- Refresh-token grant.
- Client-credentials grant.
- Device-code grant.
- Token-exchange grant.
- CIBA grant.
- JWT access tokens.
- Refresh-token hashing.
- Authorization-code hashing.
- Refresh-token family tracking.
- Refresh-token reuse detection and family revocation.
- Token revocation.
- Token introspection.
- `kid` based signing-key selection.
- Multi-key JWKS publication.
- DPoP-bound access tokens with `cnf.jkt`.
- DPoP-bound refresh-token family behavior.
- Certificate-bound token enforcement for gRPC clients with registered certificate thumbprints.

## Clients

- OAuth client management in the console.
- Public client lookup for identity pages.
- Confidential clients.
- Public clients.
- Web, SPA, mobile, and machine-to-machine client types.
- Configurable grant types.
- Configurable response types.
- Configurable redirect URIs.
- Configurable post-logout redirect URIs.
- Client logo, policy URI, terms URI, and consent settings.
- Token endpoint authentication methods.
- Access-token and refresh-token TTL settings.
- First-party client guard for cookie-authenticated account-management routes.
- Management-client audience guard for internal API access.
- Client DPoP requirement flag.
- Private-key JWT client authentication through inline JWKS or JWKS URL.
- Dynamic client registration kept on the internal management surface only.

## Federation And Identity Providers

- Identity provider management.
- Provider status management.
- Provider connection testing.
- OIDC federation.
- OAuth2 federation callback handling.
- External token exchange.
- Multi-issuer token resolution for allowed upstream issuers.
- Home-realm discovery by email domain.
- SAML login initiation.
- SAML ACS endpoint.
- SAML token exchange.
- SAML metadata endpoint.
- SAML logout endpoint.
- SAML single logout endpoint.
- Account identity listing.
- Account identity link start.
- Account identity link callback.
- Account identity unlink.
- Account-link confirmation from the identity surface.
- Just-in-time provisioning controls.
- Allowed-audience handling for upstream identity providers.

## Tenants And Membership

- Tenant lifecycle management.
- Tenant listing, creation, detail, update, delete, and status operations.
- Public tenant lookup by default tenant or identifier.
- Tenant settings management.
- Tenant member management.
- Tenant owner and member flows surfaced in the console.
- Tenant-level maintenance controls.
- Tenant-level rate-limit controls.
- Tenant-level audit controls.
- Tenant-level branding controls.
- Tenant-level security policy controls.

## Users And Invites

- User listing.
- User creation.
- User detail and update operations.
- User status management.
- User email verification by admin.
- User phone verification by admin.
- User password set by admin.
- Force-password-change support.
- User unlock support.
- User role assignment and removal.
- User identity link and unlink by admin.
- User session revocation by admin.
- User trusted-device inspection by admin.
- User consent inspection by admin.
- User profile management by admin.
- User erasure request administration.
- Invite creation.
- Invite detail, status, and public invite lookup.
- Invite registration with pre-assigned roles.

## Roles, Permissions, Policies, Services, And APIs

- Role CRUD.
- Role status management.
- Role-permission listing.
- Role-permission assignment and removal.
- Permission CRUD.
- Permission status management.
- API resource CRUD.
- API resource status management.
- Service CRUD.
- Service status management.
- Service-policy assignment and removal.
- Policy CRUD.
- Policy status management.
- Policy-service listing.
- Policy version history.
- Service policy bundle endpoint at `/services/me/policy-bundle`.
- `ETag` support for service policy bundles.
- `304 Not Modified` support for unchanged policy bundles.
- Service-to-service authorization endpoint at `/authorize/`.
- JWT-authenticated service authorization requests.
- Explicit step-up guards on sensitive IAM changes.
- Permission middleware on management routes.

## MFA And Step-Up

- MFA status endpoint.
- TOTP enrollment.
- TOTP verification.
- TOTP disable flow.
- Backup-code count endpoint.
- Backup-code regeneration.
- WebAuthn and passkey registration.
- WebAuthn and passkey authentication.
- WebAuthn credential deletion.
- WebAuthn credential download.
- SMS MFA enrollment.
- SMS MFA verification.
- SMS MFA disable flow.
- Email OTP MFA enrollment.
- Email OTP MFA verification.
- Email OTP MFA disable flow.
- Self-service MFA reset.
- Step-up challenge issuance.
- Step-up SMS send.
- Step-up email OTP send.
- Step-up verification.
- Policy-aware step-up for sensitive account actions.
- Fresh-step-up requirement for destructive factor changes.
- Admin MFA reset.
- Admin single-factor reset.

## Account Self-Service

- Account overview endpoint.
- Email change initiation and verification.
- Phone verification send and verify.
- Username change.
- Password change.
- Account deletion.
- Account data export.
- Session listing.
- Revoke all sessions.
- Revoke other sessions.
- Revoke one session.
- Consent recording.
- Default profile read, create/update, and delete.
- Multi-profile listing, creation, detail, update, default selection, and deletion.
- Profile picture upload, delete, and authenticated fetch.
- User settings create, read, and delete.
- Trusted-device listing and deletion.
- Self-service data-erasure request.
- Admin-created data-erasure request.
- GDPR-style erasure worker for due requests.
- Federation identity link and unlink.

## Security Controls

- Security settings API.
- MFA configuration.
- Password policy configuration.
- Session-management configuration.
- Token configuration.
- Lockout configuration.
- Registration configuration.
- Threat-control configuration.
- IP restriction rules.
- Tenant request rate limiting.
- Public global IP rate limiting.
- Tighter public credential-endpoint rate limiting.
- Tenant maintenance gate for authentication and runtime routes.
- Tenant status gate for authentication, OAuth, and account routes.
- Tenant IP restriction enforcement before credential flows.
- Cookie-authenticated state-changing routes protected by CSRF middleware.
- First-party client requirement for hosted account-management routes.
- Management-client requirement for the internal API.
- gRPC system-instance gate for Core provisioning RPCs.
- gRPC service-account token requirement.
- gRPC `on_behalf_of` actor claim for actor-attributed mutations.
- gRPC refusal of DPoP-bound access tokens.
- Request size limits.
- Request timeouts.
- CORS allow-list middleware.
- JSON content-type enforcement.
- Security headers middleware.
- Structured access logging.
- Panic recovery middleware.

## Passwords, Sessions, And Credentials

- Password hashing for stored passwords.
- Password-policy validation.
- Password-history support.
- Password reuse prevention.
- Password expiration fields.
- Login-time password-expiry checks.
- Lockout after repeated failures.
- Brute-force protection helpers.
- Session listing and revocation.
- Idle session timeout support.
- Absolute session lifetime support.
- Concurrent session limit behavior.
- Session revocation after sensitive account changes.
- Token TTL configuration.
- Refresh-token rotation behavior.
- Secure cookie helpers for browser token delivery.

## Events, Audit, And Webhooks

- Structured auth event model.
- Auth event listing.
- Auth event detail page.
- Management audit log.
- Management audit-log detail page.
- Event configuration routes.
- Event type listing.
- Tenant event type listing.
- Event route configuration.
- Webhook endpoint CRUD.
- Webhook endpoint status management.
- Webhook subscription listing, add, and remove operations.
- Webhook delivery history.
- Webhook delivery replay.
- HMAC-signed webhook delivery support.
- Auth-event retention runner.
- Tenant retention runner.
- OAuth short-lived row cleanup runner.
- Auth event partition manager.
- Trace/request context capture for operational correlation.

## Branding, Email, And SMS

- Branding template management.
- Public branding lookup.
- Public logo route.
- Login and identity-surface branding controls.
- Email template management.
- SMS template management.
- Email provider configuration.
- Email provider test operation.
- SMS provider configuration.
- SMS provider test operation.
- SMTP email support.
- AWS SES email support.
- SendGrid email support.
- Postmark email support.
- Mailgun email support.
- Resend email support.
- Twilio SMS support.
- AWS SNS SMS support.
- Vonage SMS support.

## Workload Identity

- Workload identity federation management.
- Workload identity listing, creation, detail, update, and delete flows.
- Workload identity provider configuration.
- Console pages for workload identity federations.
- gRPC `WorkloadIdentityFederationService` definition.

## Secrets, Crypto, And Keys

- Pluggable secret manager abstraction.
- `SECRET_PROVIDER` startup selection.
- Environment variable secret provider.
- Local file and Docker secret provider.
- AWS SSM Parameter Store provider.
- AWS Secrets Manager provider.
- HashiCorp Vault KV provider.
- Azure Key Vault provider.
- GCP Secret Manager provider.
- Environment fallback for absent provider secrets.
- Strict provider mode with `SECRET_STRICT=true`.
- Secret refresh runner.
- Application encryption key loading through the secret provider.
- JWT signing key loading through the secret provider.
- HMAC signing secret loading through the secret provider.
- RSA signing key validation.
- Signing-key lifecycle management.
- JWKS publication.
- Crypto-secure random generation for tokens, OTPs, identifiers, and nonces.

## APIs And Developer Integration

- Versioned REST routes under `/api/v1`.
- OAuth/OIDC browser integration for external applications.
- Hosted login through the identity UI.
- Public discovery metadata for OIDC clients.
- Public JWKS for JWT verification.
- UserInfo endpoint for OIDC profile claims.
- Public tenant and client lookup for tenant-aware login screens.
- Service policy bundle endpoint for resource services.
- Service authorization endpoint for runtime access decisions.
- Token introspection for internal management callers.
- OpenAPI reference served by the running service.
- gRPC server on `:50051`.
- gRPC health service.
- gRPC reflection.
- gRPC auth, logging, recovery, and OpenTelemetry interceptors.
- Protobuf services for setup, tenants, tenant settings, users, profiles, clients, APIs, permissions, policies, roles, services, authorization, OAuth introspection, and workload identity federation.
- Control-plane gRPC requires mTLS and valid client CA configuration.
- Runtime-only gRPC with administrative services withheld when the control plane is off.

## Runtime And Operations

- Thin server entrypoint.
- Domain-grouped internal packages.
- PostgreSQL persistence through GORM.
- Redis-backed cache and rate-limit primitives.
- Redis-backed token/JTI state where needed.
- OpenTelemetry tracing initialization.
- OpenTelemetry metrics initialization.
- OpenTelemetry log export.
- PostgreSQL OpenTelemetry instrumentation.
- Migration runner.
- Seeder runner.
- Secret refresh runner.
- Signing-key rotation runner.
- Data erasure worker.
- Event retention and partition workers.
- Graceful shutdown handling.
- Multi-stage Dockerfile.
- Non-root container runtime user.
- Container health check.
