# Troubleshooting

Troubleshooting Auth starts by identifying the surface, tenant, client, request ID, and exact failure point. The same symptom can have different causes depending on whether the request is hitting the hosted identity app, the public identity API, the internal management API, the console, the management port, gRPC, PostgreSQL, Redis, SMTP/SMS, a webhook receiver, RabbitMQ, or an upstream identity provider.

Use this page as the first operational guide when something does not work. It focuses on what to check, what the failure usually means, and where to go next. Configuration reference lives in [Environment variables](#environment), secret handling lives in [Secrets & keys](#secrets), tenant URL behavior lives in [Hostnames & tenant URLs](#surfaces-hostnames), and API shapes live in the dedicated API reference.

## First Triage

Before changing configuration, collect the facts that identify the failing path.

| Check | What To Capture | Why It Matters |
|---|---|---|
| Surface | Console, hosted identity app, public identity API, internal management API, management port, or gRPC. | Each surface has different auth, network, and exposure rules. |
| Hostname | Full browser URL or request origin. | Tenant routing depends on `Host`, system hostnames, and tenant DNS slugs. |
| Tenant | System tenant or tenant slug. | Security settings, rate limits, maintenance, IP rules, clients, providers, and users are tenant-scoped. |
| Client | OAuth client identifier and client type. | Redirects, CORS, PKCE, scopes, IdP routing, and token audience are client-specific. |
| User | User UUID/email if known. | Login, MFA, lockout, sessions, consent, and membership issues are user-specific. |
| Request ID | `X-Request-ID` response header or log field. | Fastest way to correlate the browser/API error with backend logs. |
| Trace ID | Trace ID from logs or Auth events. | Connects Auth events, logs, and telemetry. |
| Time window | Exact timestamp and timezone. | Required for Auth events, audit logs, metrics, and upstream provider logs. |

Recommended first checks:

```bash
curl -fsS https://identity-api.auth.example.com/readyz
curl -fsS https://auth-management.internal/readyz
curl -fsS https://auth-management.internal/metrics
```

Then check structured logs for the same time window:

```bash
docker logs auth --since 30m
kubectl logs deployment/maintainerd-auth --since=30m
```

Use the command that matches your deployment platform. Do not paste access tokens, refresh tokens, authorization codes, client secrets, private keys, OTPs, or identity-provider assertions into tickets or chat.

## Surface Map

Most routing problems come from sending traffic to the wrong Auth surface.

| Surface | Typical Hostname | Purpose | Exposure |
|---|---|---|---|
| Hosted identity app | `https://identity.auth.example.com` and tenant subdomains | Login, registration, MFA, consent, account self-service. | Public. |
| Public identity API | `https://identity-api.auth.example.com` | OAuth/OIDC issuer, token flows, public identity routes. | Public. |
| Admin console | `https://console.auth.example.com` and tenant subdomains | Tenant and Auth administration UI. | Internal or operator-only. |
| Internal management API | `https://console-api.auth.example.com` | Management operations used by the console and trusted operators. | Private/VPN-only. |
| Management port | `https://auth-management.internal` | Health, readiness, liveness, metrics, OpenAPI JSON. | Private. |
| gRPC | Internal service address on port `50051` when enabled | Runtime and optional control-plane RPCs. | Private, normally mTLS. |

If a request works on one hostname but fails on another, check [Hostnames & tenant URLs](#surfaces-hostnames) and [Deployment](#deployment) before changing clients or security settings.

## Symptom Index

| Symptom | Likely Cause | Start Here |
|---|---|---|
| Container exits immediately | Missing required config, invalid secret, invalid key pair, database SSL failure, unsupported secret provider. | [Startup Failures](#startup-failures) |
| `/healthz` is OK but `/readyz` returns unavailable | Database, Redis, or JWKS is not ready. | [Readiness Failures](#readiness-failures) |
| Browser shows 502 after login or refresh | Reverse proxy response-header buffer too small for JWT cookies. | [Edge And Proxy Issues](#edge-and-proxy-issues) |
| OAuth callback says redirect mismatch | Client redirect URI does not exactly match the registered URI. | [OAuth And OIDC Issues](#oauth-and-oidc-issues) |
| Token request fails with client authentication error | Wrong client secret, unsupported method, wrong audience, disabled client, wrong tenant. | [OAuth And OIDC Issues](#oauth-and-oidc-issues) |
| User cannot sign in to a tenant | Tenant status, maintenance, IP restriction, lockout, MFA, password policy, IdP, or client setting. | [Login Issues](#login-issues) |
| User is repeatedly returned to login | Cookie domain/SameSite/Secure issue, wrong frontend/API hostnames, session timeout, token audience mismatch. | [Session And Cookie Issues](#session-and-cookie-issues) |
| Console returns forbidden for management pages | Missing permission, wrong management client token, wrong tenant membership, stale session. | [Authorization Issues](#authorization-issues) |
| Account self-service returns forbidden | Third-party OAuth token tried to manage the account, or step-up is missing. | [Account And Step-Up Issues](#account-and-step-up-issues) |
| Registration succeeds but user is pending | Email verification is required. | [Registration Issues](#registration-issues) |
| Registration is blocked | Self-registration disabled, domain rule, CAPTCHA, rate limit, flow status, client registration setting. | [Registration Issues](#registration-issues) |
| Email or invite does not arrive | SMTP configuration, template, recipient, provider error, or mail filtering. | [Messaging Issues](#messaging-issues) |
| SMS login or SMS MFA does not arrive | SMS provider, phone format, template, throttling, or tenant MFA setting. | [Messaging Issues](#messaging-issues) |
| Webhook receiver sees duplicates | At-least-once delivery without receiver deduplication. | [Events And Webhooks](#events-and-webhooks) |
| Webhooks stop delivering | Endpoint disabled, signing secret mismatch, receiver timeout, RabbitMQ/outbox issue. | [Events And Webhooks](#events-and-webhooks) |
| Auth events are missing | Audit config disabled, event type allowlist, log level, retention, wrong tenant, or wrong time range. | [Auth Events And Audit](#auth-events-and-audit) |
| External API rejects tokens | Issuer, audience, JWKS cache, token type, DPoP proof, or authorization mapping. | [External API Token Validation](#external-api-token-validation) |
| gRPC calls are denied | Control plane disabled, TLS/mTLS issue, missing service token, wrong tenant, permission map denial. | [gRPC Issues](#grpc-issues) |

## Startup Failures

When Auth does not start, look at the first fatal error in the container logs. Startup is intentionally fail-fast for required configuration and required secrets.

Common startup causes:

- Required hostnames are missing or malformed.
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_NAME`, or `DB_PASSWORD` is missing.
- Production database SSL settings are invalid for the database endpoint.
- `JWT_PRIVATE_KEY` or `JWT_PUBLIC_KEY` is missing, not valid PEM, not RSA, or not a matching pair.
- `APP_ENCRYPTION_KEY` is not exactly 32 bytes after normalization.
- `HMAC_SECRET_KEY` is empty.
- `SECRET_PROVIDER` is not one of the supported providers.
- A remote secret provider is unavailable, unauthorized, misconfigured, or using an insecure transport.
- A mounted secret or certificate file is not readable by the non-root container user.
- The database user cannot create or inspect required schema objects during migration.

Useful checks:

```bash
docker logs auth --tail 200
kubectl logs deployment/maintainerd-auth --tail=200
kubectl describe pod -l app=maintainerd-auth
```

If the log mentions a secret, verify the secret name and provider mapping in [Secrets & keys](#secrets). If the log mentions database SSL, connection pool, or migrations, continue with [Database And Redis](#database-and-redis).

## Readiness Failures

`/healthz` and `/livez` prove the process is running. `/readyz` proves Auth can serve real traffic.

Readiness checks:

| Dependency | Ready Value | Unready Values | Meaning |
|---|---|---|---|
| Database | `ok` | `unavailable`, `unreachable` | Auth cannot get a database handle or cannot ping PostgreSQL. |
| Redis | `ok` | `unreachable`, `not configured` | Redis is unreachable, or Redis is intentionally not configured. |
| JWKS | `ok` | `not loaded` | Public signing key is missing or did not load. |

Diagnosis steps:

1. Check `/readyz` on the public, internal, or management surface that your platform uses for probes.
2. Check logs for the same timestamp and request ID.
3. Confirm PostgreSQL DNS, network policy, credentials, SSL mode, and server certificate trust.
4. Confirm Redis address, password, TLS mode, and network policy.
5. Confirm JWT key secrets are loaded and match.
6. If only one replica is failing, compare its mounted secrets and environment with a healthy replica.

`Redis` as `not configured` is not always fatal. Some features degrade or disable when Redis is absent. Rate limits, denylist behavior, OTP throttling, OAuth short-lived state, and multi-replica coordination depend on Redis for reliable production behavior.

## Edge And Proxy Issues

Auth expects HTTPS at the browser and public API edge. The container can receive plain HTTP from a trusted reverse proxy, but externally visible URLs and cookies must behave as HTTPS.

Common proxy symptoms:

| Symptom | What It Usually Means | Fix |
|---|---|---|
| Login returns 502 through the edge | Response-header buffer is too small for JWT `Set-Cookie` headers. | Raise proxy response-header buffer, for example 16 KB or higher. |
| Cookies are not stored by the browser | Missing HTTPS, `COOKIE_SECURE=false`, invalid cookie domain, or incompatible SameSite setting. | Use HTTPS externally, keep secure cookies enabled, and align cookie domain with Auth hostnames. |
| Rate limits or IP rules use the proxy IP | Forwarded headers are not trusted or not forwarded. | Forward `X-Forwarded-For` and configure `TRUSTED_PROXY_CIDRS` to the edge ranges. |
| Tenant URLs route to the system tenant | Wildcard DNS, Host preservation, or tenant slug routing is wrong. | Preserve the original `Host` header and verify wildcard tenant records. |
| Browser calls are blocked by CORS | Origin is not statically allowed, not a tenant surface, and not registered on the OAuth client. | Add the external application origin to the client CORS origins or global CORS allowlist. |
| HSTS is missing | Runtime is not using production behavior or traffic is not reaching the expected surface. | Confirm `APP_ENV=production` or leave it unset, and check the response from the HTTPS edge. |

Useful edge checks:

```bash
dig +short identity.auth.example.com
dig +short acme.identity.auth.example.com
curl -I https://identity.auth.example.com
curl -I https://identity-api.auth.example.com/.well-known/openid-configuration
```

For hostname planning, see [Hostnames & tenant URLs](#surfaces-hostnames). For proxy layout, see [Deployment](#deployment).

## Login Issues

Start with the tenant host and the Auth event stream. Login problems are usually visible as `AUTHN` events.

Common login causes:

- User is in the wrong tenant or does not belong to the tenant.
- Tenant is suspended or inactive.
- Tenant maintenance window is active.
- IP restriction rule blocks the client IP.
- Public credential endpoint rate limit is active.
- Account lockout is active after failed attempts.
- Password policy rejected the password during registration or reset.
- MFA is enforced but the user has not completed enrollment.
- Trusted device has expired or is not recognized.
- Upstream identity provider returned an error or did not map the user identity.
- The request used the system host when a tenant host was required, or the opposite.

What to check:

1. Open [Auth events](#audit) for the tenant and filter to `AUTHN`.
2. Check the exact `event_type`, `result`, `ip_address`, `user_agent`, and `trace_id`.
3. Confirm the user status and tenant membership in [Users & invites](#users-invites).
4. Confirm the tenant status, maintenance config, and rate-limit config in [Tenants & members](#tenants-members).
5. Confirm IP restriction rules and MFA/lockout settings in [Security controls](#security).
6. If the login is brokered through an identity provider, check [Identity providers](#identity-providers).

Do not diagnose login only from the browser error. Browser-facing login errors intentionally avoid leaking account existence or tenant lifecycle details.

## Registration Issues

Registration depends on tenant registration settings, client settings, optional registration flows, domain policy, password policy, verification policy, and abuse controls.

Common registration symptoms:

| Symptom | Likely Cause | What To Check |
|---|---|---|
| Signup is not available | Self-registration is disabled, the client disallows registration, or the selected flow is inactive. | Tenant registration config, client registration settings, registration flow status. |
| Email is rejected | Email domain is blocked or not in the allowlist. | `blocked_email_domains` and `allowed_email_domains`. |
| User remains pending | Email verification is required and auto-confirm is off. | Verification email delivery and `require_email_verification`. |
| Phone verification blocks progress | Tenant or flow requires phone verification. | SMS configuration and `require_phone_verification`. |
| CAPTCHA blocks signup | `captcha_on_signup` is enabled and provider verification fails. | CAPTCHA provider secret, verify URL, minimum score, and frontend token delivery. |
| Registration rate limit appears | Too many registration attempts from the same IP. | Registration rate limit and trusted proxy client IP resolution. |
| Invite redemption grants fewer roles than expected | Role grant is no longer allowed at redemption time. | Registration flow roles and current role permissions. |

Registration domain rules matter:

- Blocklist takes precedence.
- A blocked domain applies to self-registration, invite flows, and federated just-in-time provisioning.
- An allowlist limits self-registration.
- Exact domains and wildcard domains such as `*.example.com` are supported.

For configuration details, see [Registration flows](#registration-flows), [Users & invites](#users-invites), and [Security controls](#security).

## OAuth And OIDC Issues

OAuth failures are usually caused by client registration, tenant binding, redirect URI mismatch, PKCE, consent, token lifetime, or issuer/audience expectations.

Common OAuth symptoms:

| Symptom | Likely Cause | What To Check |
|---|---|---|
| Authorization fails before login | Wrong `client_id`, inactive client, invalid redirect URI, tenant host mismatch, unsupported response type, missing scope, missing PKCE. | Client settings and the authorize URL parameters. |
| Redirect URI mismatch | The callback URL differs from the registered redirect URI. | Scheme, host, path, trailing slash, URL encoding, and tenant-specific callback. |
| Consent screen is unexpected | Client is third-party or requested scopes require consent. | Client trust type, scopes, and prior user consent. |
| Token exchange fails | Code expired, code already used, verifier mismatch, client authentication failed, or tenant/client mismatch. | Token exchange Auth events and client settings. |
| Refresh fails | Refresh token expired, revoked, reused, or bound to another client/session. | Session policy, token events, and revocation state. |
| Userinfo or API calls fail | Token audience, issuer, expiration, DPoP proof, or authorization mapping is wrong. | Token validation settings and API protection rules. |
| Discovery metadata looks wrong | `APP_PUBLIC_HOSTNAME` is wrong. | Environment hostnames and public issuer route. |

Important checks:

- The issuer must be the public identity API origin.
- The browser login/consent UI usually lives on the hosted identity frontend origin.
- The redirect URI must exactly match a registered client redirect URI.
- Public clients must use PKCE.
- A token issued for one client should not be replayed against the management API or account self-service API.

For the full authentication flow and parameter meanings, see [OAuth & OIDC](#oauth-oidc).

## Session And Cookie Issues

Session problems usually show up as login loops, missing cookies, immediate logout, failed refresh, or inconsistent behavior across tenants.

What to check:

- Browser is using HTTPS.
- `COOKIE_SECURE` is enabled for HTTPS deployments.
- `COOKIE_DOMAIN` matches the Auth hostnames when cross-subdomain cookies are needed.
- `COOKIE_SAMESITE` matches the browser flow. `None` requires secure cookies.
- The frontend hostnames and API hostnames are configured as full HTTPS origins.
- Access-token and refresh-token TTLs are not shorter than the application expects.
- Refresh-token rotation is enabled and the client handles refresh responses correctly.
- Password change revoked sessions as configured.
- Multiple replicas share Redis-backed revocation and short-lived state.
- User did not exceed `max_concurrent_sessions`.

If sessions fail only on tenant subdomains, check wildcard DNS, cookie domain, and host preservation at the reverse proxy.

## Authorization Issues

Authorization problems usually appear as forbidden management pages, denied protected API calls, missing navigation, or successful login without expected access.

Common causes:

- User is not a member of the selected tenant.
- User has the role, but the role lacks the required permission.
- Role is inactive, system-only, or not grantable through the current flow.
- Policy or service policy was changed but the application is using stale authorization data.
- Token audience does not match the API being called.
- The management API rejected a token that was not minted for the management client.
- A third-party OAuth token tried to access account self-service.
- The request is using the system tenant when it should use a tenant subdomain.

What to check:

1. Confirm tenant membership in [Tenants & members](#tenants-members).
2. Confirm the user's roles and permissions in [Authorization model](#authorization-model), [Policies](#policies), and [Resources](#resources).
3. Review `AUTHZ` events in [Auth events](#audit), especially `authz_fail`.
4. Confirm the OAuth client audience and token issuer.
5. If an external API is doing its own checks, verify its token validation and permission mapping in [Protect an API](#protect-api).

## Account And Step-Up Issues

Sensitive account and administrator actions can fail even when the user is signed in.

Common symptoms:

| Symptom | Likely Cause |
|---|---|
| Security setting update is denied | Missing `security-setting:update`, missing step-up, stale step-up, or no usable MFA method. |
| MFA enrollment or reset is denied | Step-up required for new factors or administrative remediation. |
| Email, username, or password change is denied | Sensitive action requires MFA step-up. |
| Third-party app cannot update account | Account self-service requires a first-party client token. |
| Step-up succeeds but action still fails | New token was not used, step-up TTL expired, or the required permission is still missing. |

Check `require_mfa_for_sensitive_actions` and `step_up_ttl_minutes` in [Security controls](#security). Check MFA enrollment and supported methods in [MFA](#mfa).

## Identity Provider Issues

Identity-provider problems depend on provider type, but the troubleshooting sequence is consistent.

Check:

- Provider is active for the tenant.
- Client is allowed to use that provider.
- Provider callback/redirect URL is registered exactly at the upstream provider.
- Upstream client ID and secret are correct.
- Issuer, authorization endpoint, token endpoint, JWKS endpoint, and userinfo endpoint match the provider metadata.
- Requested scopes match what the provider allows.
- The upstream subject maps consistently to the local user identity.
- Email-domain block rules do not reject just-in-time provisioning.
- Provider secrets can be decrypted with the current `APP_ENCRYPTION_KEY`.
- The browser returns to the correct tenant identity hostname after callback.

For provider-specific setup, see [Identity providers](#identity-providers). For brokered and federated login behavior, see [Federated login client](#federated-login-client).

## Messaging Issues

Email and SMS affect verification, invites, password reset, magic links, OTP, MFA, and notifications.

Email checks:

- SMTP provider is configured and reachable.
- SMTP credentials are valid.
- Sender address is allowed by the provider.
- Tenant email config is active.
- The relevant template exists and renders.
- The recipient address is valid and not suppressed by the provider.
- Provider logs do not show bounce, suppression, or policy rejection.

SMS checks:

- SMS provider is supported and active.
- Provider credentials and sender values are correct.
- Phone number is normalized and accepted by the provider.
- Tenant SMS config is active.
- The relevant SMS template exists and renders.
- OTP send throttling has not been exceeded.
- The destination country and carrier are allowed by the provider account.

If the action succeeds but no message arrives, check provider delivery logs before changing Auth configuration. If the action fails, check Auth logs and the management audit log around the timestamp.

## Events And Webhooks

Webhook delivery is at least once. Receivers must deduplicate by event identity and fetch current state from Auth when they need full details.

Common webhook symptoms:

| Symptom | Likely Cause | Fix |
|---|---|---|
| Receiver sees duplicate events | Expected retry or redelivery behavior. | Store processed event IDs and make handlers idempotent. |
| Receiver gets no events | Endpoint inactive, subscription missing, event type not subscribed, relay not running, or delivery repeatedly fails. | Check endpoint status, subscription event types, delivery history, and worker logs. |
| Signature validation fails | Wrong webhook secret, raw body changed before verification, or timestamp tolerance issue. | Verify against the exact raw request body and current endpoint secret. |
| Delivery times out | Receiver is slow or blocked by network/firewall. | Return success quickly and process asynchronously. |
| Broker delivery fails | RabbitMQ URL, credentials, exchange, routing key, or network is wrong. | Check broker connection logs and event route config. |

Use [Events & webhooks](#events-webhooks) for event types, webhook setup, delivery behavior, signing, replay, and receiver design.

## Auth Events And Audit

Auth events and management audit logs are separate but both are useful during incidents.

If Auth events are missing:

- Confirm you are viewing the correct tenant.
- Confirm tenant audit configuration is enabled.
- Check retention settings and selected date range.
- Check whether the event type allowlist excludes the expected event.
- Check whether the tenant log level filters out the expected severity.
- Confirm the feature path actually emits that event.
- Check service logs for audit write failures or retention cleanup.

If management audit entries are missing:

- Confirm the action was a management mutation.
- Confirm the management surface handled the action.
- Check `audit_write_failures_total` and structured logs.
- Check whether you are looking at Auth events instead of management audit logs.

Use [Auth events](#audit) for security event review and event catalog details.

## Database And Redis

PostgreSQL is required for Auth. Redis is optional at process level but important for production behavior.

Database symptoms:

| Symptom | Likely Cause |
|---|---|
| Startup fails | Database credentials, SSL mode, network policy, schema permissions, or migration failure. |
| `/readyz` says database `unreachable` | PostgreSQL cannot be pinged from the Auth instance. |
| Slow console or login flows | Database latency, missing capacity, saturated pool, or long-running queries. |
| Duplicate/conflict errors | Unique constraint hit, repeated setup, duplicate user/client/provider/domain. |
| Auth events disappear sooner than expected | Retention configuration or partition cleanup. |

Redis symptoms:

| Symptom | Likely Cause |
|---|---|
| `/readyz` says Redis `unreachable` | Address, TLS, password, DNS, or network policy issue. |
| Rate limits behave inconsistently | Redis missing, Redis unreachable, or multiple replicas without shared Redis. |
| Refresh/token revocation behavior is inconsistent | Denylist or short-lived token state is not shared correctly. |
| OTP throttling is inconsistent | Redis counters are unavailable or reset. |
| Threat scoring is weak | Velocity and distinct-account signals need shared state. |

For storage responsibilities and configuration, see [Database & Redis](#database-redis).

## External API Token Validation

When an external API rejects an Auth token, check the validation contract first.

External APIs should verify:

- Issuer is the Auth public issuer origin.
- Audience matches the API or client expectation.
- Signature validates against JWKS.
- Token is not expired and respects clock skew.
- Token type is appropriate for the call.
- Tenant claim matches the protected tenant.
- Subject/client/service identity is allowed.
- Required roles or permissions are present or confirmed centrally.
- DPoP-bound tokens include a valid DPoP proof when used as sender-constrained access tokens.

Common causes:

- API cached old JWKS too long after signing-key rotation.
- API accepts the wrong issuer for tenant or system URLs.
- API expects claims Auth intentionally does not add to access tokens.
- API uses stale role or permission data.
- Token was issued to a different OAuth client or audience.
- DPoP proof is missing, uses the wrong HTTP method/URL, or does not match the token binding.

For recommended validation and authorization patterns, see [Protect an API](#protect-api).

## gRPC Issues

gRPC is private infrastructure. Troubleshoot it separately from browser and HTTP API flows.

Common gRPC issues:

- gRPC is not enabled or the control-plane services are not registered.
- The listener is not reachable from the caller network.
- TLS or mTLS certificates are missing, expired, unreadable, or signed by the wrong CA.
- The caller uses a token without the required service identity.
- The caller is missing the mapped permission for the RPC.
- A tenant-less service token reached a tenant-gated method.
- The PDP/authorization service is unavailable, causing protected methods to fail closed.
- Message size exceeds the configured gRPC limits.

Check gRPC health, certificate chain, service token audience, tenant context, and permission mapping. See [gRPC](#grpc) and [Transport security](#transport-security).

## Error And Status Guide

| Status | Meaning In Auth | What To Check |
|---:|---|---|
| `400` | Request validation failed or OAuth parameter is invalid. | Missing required field, invalid enum, malformed UUID, unsupported OAuth parameter. |
| `401` | Authentication is missing or invalid. | Expired token, invalid signature, missing session, wrong credential type. |
| `403` | Authenticated but not allowed, or tenant/security gate denied the request. | Permission, tenant membership, tenant status, IP rules, first-party/management-client gate, CSRF. |
| `404` | Resource not found in this tenant or intentionally hidden. | Tenant scope, UUID, soft-deleted resource, cross-tenant access. |
| `409` | Resource conflict. | Duplicate client, user, provider, role, route, or existing state transition. |
| `413` | Request body too large. | Payload size; global body limit is 10 MB. |
| `415` | Content type is not accepted for a JSON mutation. | Missing or wrong `Content-Type`. |
| `429` | Rate limit or lockout threshold exceeded. | Public IP limiter, credential limiter, tenant rate limit, OTP throttle, account lockout. |
| `503` | Dependency unavailable or tenant maintenance gate active. | Readiness, database, Redis, IP rule load, maintenance window, policy read failure. |

OAuth endpoints can return OAuth-standard error names instead of the normal JSON error envelope. Interpret those errors using [OAuth & OIDC](#oauth-oidc).

## Evidence To Collect Before Escalating

Include:

- Exact user-visible error text.
- Full URL without secrets.
- Surface and hostname.
- Tenant slug and tenant UUID when available.
- OAuth client identifier when available.
- Timestamp and timezone.
- Request ID and trace ID.
- Relevant Auth event IDs.
- Relevant management audit entry IDs.
- Readiness response dependency statuses.
- Recent application logs around the request ID.
- Edge/proxy log entry for the same request.
- Upstream provider request ID when federation, email, SMS, or webhook delivery is involved.

Never include:

- Access tokens.
- Refresh tokens.
- Authorization codes.
- Client secrets.
- Private keys.
- OTPs.
- Passwords.
- Raw SAML assertions.
- Raw upstream identity-provider tokens.
