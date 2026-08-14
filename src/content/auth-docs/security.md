# Security Controls

Security controls define how a tenant protects sign-in, registration, sessions, tokens, account recovery, sensitive actions, and tenant access. These controls are tenant-scoped: changing one tenant's policy does not change another tenant's policy.

Use this section when configuring the console for a tenant or when deciding which values an external application must expect from Auth. OAuth client setup is covered in [Applications & clients](#clients), MFA enrollment behavior is covered in [MFA](#mfa), and token validation for external APIs is covered in [Protect an API](#protect-api).

## How Security Controls Are Organized

Auth stores tenant security settings as one security setting record with seven configuration groups.

| Config Type | What It Controls |
|---|---|
| Password | Password length, strength, breach checks, history, temporary-password lifetime, and hashing algorithm. |
| MFA | MFA mode, allowed factors, TOTP behavior, trusted devices, recovery codes, grace periods, and step-up freshness. |
| Session | Access-token lifetime, refresh-token lifetime, concurrent sessions, idle and absolute timeouts, cookie behavior, and password-change session revocation. |
| Token | Token signing algorithm, clock-skew leeway, additional tenant-resolved claims, and PKCE requirement. |
| Lockout | Account lockout after failed sign-in attempts, progressive lockout, observation window, unlock behavior, and lockout notifications. |
| Registration | Self-registration, verification requirements, email-domain rules, CAPTCHA, and registration rate limits. |
| Threat | Brute-force, credential-stuffing, new-device, impossible-travel, and risk-score controls. |

IP restriction rules are separate tenant-scoped security records because operators manage them as a list of allow and deny rules.

## Console Workflow

In the console, select the tenant, then open **Security controls**. Work through the security areas in this order when configuring a tenant:

1. Configure **Password** so every local password path has a baseline.
2. Configure **MFA** and decide whether MFA is optional or enforced.
3. Configure **Session** and **Token** lifetimes so browser sessions and OAuth clients behave as expected.
4. Configure **Lockout** and **Threat** controls to handle abuse and credential-stuffing signals.
5. Configure **Registration** if the tenant accepts self-service signup.
6. Add **IP restriction rules** if the tenant must limit where users can authenticate from.
7. Review [Auth events](#audit) and management audit logs after any security-policy change.

Security setting updates are partial by config group. Updating password settings does not replace MFA, session, token, lockout, registration, or threat settings. Unknown fields are rejected, and stored settings are normalized with the shipped defaults so missing fields still have predictable values.

## Permissions

Security controls are administrative. Grant them only to trusted operators.

| Permission | Allows |
|---|---|
| `security-setting:read` | Read password, MFA, session, token, lockout, registration, and threat settings for the tenant. |
| `security-setting:update` | Update those security setting groups. Updates require step-up. |
| `ip-restriction-rule:read` | List and view tenant IP restriction rules. |
| `ip-restriction-rule:create` | Create an IP restriction rule. |
| `ip-restriction-rule:update` | Update a rule or activate/deactivate it. |
| `ip-restriction-rule:delete` | Delete an IP restriction rule. |

Security setting updates require a fresh step-up because these controls can weaken tenant-wide authentication. The step-up lifetime is controlled by the MFA setting `step_up_ttl_minutes`.

## Audit Behavior

Every security setting update writes a security settings audit record with:

- Tenant.
- Config type changed.
- Old config.
- New config.
- Operator.
- Client IP address.
- User agent.
- Timestamp.

Security controls also influence Auth events. For example, MFA enrollment, lockouts, failed logins, token reuse, new-device signals, impossible-travel signals, and audit exports are visible in [Auth events](#audit).

## Password Settings

Password settings apply to local-password registration, invite acceptance, password reset, self-service password change, and administrator-created or administrator-reset passwords.

Auth defaults to a modern password posture: longer passwords, no forced composition rules, common-password rejection, breach checking, password history, and Argon2id hashing.

| Field | Default | Allowed Values | What It Does |
|---|---:|---|---|
| `min_length` | `12` | `1` or higher, and not greater than `max_length` | Minimum password length. The shipped default is 12; lowering it is a tenant policy choice. |
| `max_length` | `128` | `64` to `128` | Maximum password length accepted by Auth. |
| `require_uppercase` | `false` | `true` or `false` | Requires at least one uppercase letter when enabled. |
| `require_lowercase` | `false` | `true` or `false` | Requires at least one lowercase letter when enabled. |
| `require_number` | `false` | `true` or `false` | Requires at least one digit when enabled. |
| `require_symbol` | `false` | `true` or `false` | Requires at least one supported symbol when enabled. |
| `reject_common_passwords` | `true` | `true` or `false` | Rejects common weak passwords and common disguised variants. |
| `check_hibp` | `true` | `true` or `false` | Checks passwords against Have I Been Pwned using k-anonymity. If that dependency is unavailable, Auth fails open for availability and logs the degradation. |
| `password_history_count` | `5` | `0` to `24` | Prevents reuse of the most recent password hashes. `0` disables history enforcement. |
| `max_age_days` | `0` | `0` to `3650` | Maximum password age. `0` means no forced rotation. |
| `temporary_password_validity_hours` | `72` | `1` to `720` | Lifetime of temporary passwords issued during administrative flows. |
| `hash_algorithm` | `argon2id` | `argon2id`, `bcrypt`, `scrypt`, `pbkdf2` | Password hashing algorithm for new password writes. |
| `min_strength_score` | `2` | `0` to `4` | Minimum password strength score. `0` disables strength-score enforcement. |

Important behavior:

- Password policy is loaded per tenant. If settings cannot be read, Auth falls back to shipped defaults and logs the degradation.
- Password checks are policy-driven. Composition checks only run when their fields are enabled.
- Passwords are checked against user context when available, so obvious identity restatements are rejected even when the common-password blocklist is disabled.
- Password history enforcement depends on password-history writes. If history recording fails after a committed password change, Auth logs the gap.

Recommended production baseline:

- Keep `min_length` at least `12`.
- Keep `reject_common_passwords` and `check_hibp` enabled.
- Avoid composition rules unless the tenant has a hard compliance requirement.
- Keep `password_history_count` above `0` for workforce tenants.
- Prefer `argon2id` unless migration compatibility requires another algorithm.

## MFA Settings

MFA settings control whether users must enroll a second factor, which factors are allowed, how trusted devices behave, and how long a recent step-up remains valid.

| Field | Default | Allowed Values | What It Does |
|---|---:|---|---|
| `mode` | `optional` | `disabled`, `optional`, `enforced` | Controls tenant-wide MFA requirement. `disabled` turns off MFA enforcement, `optional` allows users to enroll, and `enforced` requires MFA according to grace rules. |
| `allowed_methods` | `totp`, `webauthn`, `recovery_code` | `totp`, `webauthn`, `sms`, `email_otp`, `recovery_code` | Controls which MFA methods users may use. Runtime displays recovery codes as backup codes. |
| `totp_issuer` | `Maintainerd-Auth` | Non-empty string when TOTP is allowed | Issuer name shown in authenticator apps. |
| `trusted_device_period_days` | `14` | `0` to `365` | How long a trusted device can reduce repeated MFA prompts. `0` disables the remembered-device window. |
| `grace_period_days` | `30` | `0` to `90` | User grace period before enforced MFA blocks access for users without a factor. |
| `preferred_method` | `webauthn` | One of `allowed_methods` | Default factor Auth should prefer when multiple factors exist. |
| `allow_sms` | `false` | `true` or `false` | Enables SMS as an allowed MFA method. `sms` cannot appear in `allowed_methods` unless this is true. |
| `allow_email_otp` | `false` | `true` or `false` | Enables email OTP as an allowed MFA method. `email_otp` cannot appear in `allowed_methods` unless this is true. |
| `totp_digits` | `6` | `6` or `8` | Number of digits in generated TOTP codes. |
| `totp_period_seconds` | `30` | `30` to `90` | TOTP time step. |
| `recovery_codes_count` | `10` | `0`, or `8` to `16` | Number of recovery codes generated. `0` disables recovery-code generation. |
| `require_mfa_for_sensitive_actions` | `true` | `true` or `false` | Requires step-up before sensitive self-service and administrative actions when the user has MFA available. |
| `admin_grace_period_days` | `0` | `0` to `90` | Grace period for administrators when MFA is enforced. |
| `step_up_ttl_minutes` | `5` | `1` to `60` | How long a completed step-up remains fresh for protected actions. |

Important behavior:

- When MFA mode is `enforced`, the effective session policy requires ACR level `2`.
- Sensitive actions use step-up even when the user is already signed in.
- SMS and email OTP require both the method and the matching allow flag.
- WebAuthn is the preferred high-assurance method for phishing-resistant MFA.
- Recovery codes are for account recovery when the normal second factor is unavailable.

Recommended production baseline:

- Prefer `webauthn` and `totp`.
- Keep `require_mfa_for_sensitive_actions` enabled.
- Keep `step_up_ttl_minutes` short, usually `5` to `15`.
- Use SMS only when the tenant accepts the delivery and SIM-swap risk.
- Use email OTP as a fallback, not as the strongest factor.

## Session Settings

Session settings control the runtime session policy for browser sessions and token issuance. Client-specific settings can only shorten selected tenant session values; they cannot extend them above the tenant policy.

| Field | Default | Allowed Values | What It Does |
|---|---:|---|---|
| `access_token_ttl_minutes` | `15` | `1` to `60` | Lifetime of issued access tokens. |
| `refresh_token_ttl_days` | `30` | `1` to `365` | Lifetime of refresh tokens. |
| `max_concurrent_sessions` | `5` | `0` or higher | Maximum active sessions per user. `0` means no configured concurrent-session cap. |
| `idle_timeout_minutes` | `30` | `1` or higher | Session inactivity timeout. |
| `absolute_timeout_hours` | `24` | `1` or higher | Maximum session lifetime regardless of activity. |
| `rotate_refresh_tokens` | `true` | `true` or `false` | Rotates refresh tokens during refresh flows. |
| `refresh_token_reuse_interval_seconds` | `10` | `0` or higher | Grace interval for detecting refresh-token reuse. |
| `cookie_secure` | `true` | `true` or `false` | Marks Auth cookies as Secure. Keep enabled for HTTPS. |
| `cookie_http_only` | `true` | `true` or `false` | Prevents JavaScript from reading session cookies. |
| `cookie_same_site` | `Lax` | `Strict`, `Lax`, `None` | Controls browser cross-site cookie behavior. `None` requires `cookie_secure=true`. |
| `revoke_sessions_on_password_change` | `true` | `true` or `false` | Revokes existing sessions after password change. |

Important behavior:

- Short access tokens reduce stale authorization risk.
- Refresh-token rotation helps detect token theft. Reuse detection is strongest when rotation stays enabled.
- Password changes should normally revoke sessions so stolen sessions do not survive credential rotation.
- `cookie_secure` should remain enabled because production traffic should use HTTPS.
- `cookie_same_site=None` is only for intentional cross-site cookie use and must be paired with secure cookies.

## Token Settings

Token settings control how Auth signs tokens and which tenant-resolved claims are allowed in issued tokens. These settings do not let operators insert arbitrary claims.

| Field | Default | Allowed Values | What It Does |
|---|---:|---|---|
| `clock_skew_leeway_seconds` | `30` | `0` to `300` | Leeway accepted around token time claims during validation. |
| `additional_id_token_claims` | `roles`, `tenant_id` | `roles`, `tenant_id` | Extra server-resolved claims Auth may add to ID tokens. |
| `additional_access_token_claims` | `roles`, `tenant_id` | `roles`, `tenant_id` | Extra server-resolved claims Auth may add to access tokens. |
| `signing_algorithm` | `RS256` | `RS256`, `PS256` | Signing algorithm used for issued tokens. |
| `require_pkce` | `true` | `true` or `false` | Requires PKCE for authorization-code flows when applicable. Public clients are forced to use PKCE regardless of this setting. |

Important behavior:

- Only `roles` and `tenant_id` are allowed as configurable additional claims.
- Authentication-context claims, nonce/hash claims, personal profile claims, and permission lists are not operator-configurable token additions.
- Public clients such as SPAs, native apps, and clients using `token_endpoint_auth_method=none` always require PKCE.
- External APIs should validate issuer, audience, signature, expiry, and required authorization context. See [Protect an API](#protect-api).

## Lockout Settings

Lockout settings protect individual accounts from repeated failed login attempts.

| Field | Default | Allowed Values | What It Does |
|---|---:|---|---|
| `enabled` | `true` | `true` or `false` | Enables account lockout. |
| `max_failed_attempts` | `5` | `1` to `100` | Number of failed attempts allowed inside the observation window. |
| `lockout_duration_minutes` | `30` | `1` or higher | Base lockout duration. |
| `progressive_lockout` | `true` | `true` or `false` | Increases lockout duration after repeated lockouts. |
| `auto_unlock` | `true` | `true` or `false` | Allows locked accounts to unlock automatically after the duration expires. |
| `reset_count_on_success` | `true` | `true` or `false` | Clears failure count after successful authentication. |
| `observation_window_minutes` | `15` | `1` or higher | Time window used when counting failures. |
| `max_lockout_duration_minutes` | `60` | At least `lockout_duration_minutes` | Maximum progressive lockout duration. |
| `progression_reset_hours` | `24` | `1` or higher | Time after which progressive lockout history resets. |
| `notify_user_on_lockout` | `true` | `true` or `false` | Sends or emits lockout notification behavior when notification wiring is configured. |

Important behavior:

- Lockout is account-focused. It handles many attempts against one account.
- Threat controls handle aggregate IP behavior, such as one IP trying many different accounts.
- If lockout settings cannot be read, Auth falls back to shipped defaults and keeps lockout enabled.
- Lockout-related activity is visible in [Auth events](#audit).

## Registration Settings

Registration settings control self-service signup and email/phone verification behavior. Invitation-only tenants should disable self-registration and rely on [Users & invites](#users-invites).

| Field | Default | Allowed Values | What It Does |
|---|---:|---|---|
| `self_registration_enabled` | `true` | `true` or `false` | Allows users to register without an invite when the client and registration flow also permit it. |
| `require_email_verification` | `true` | `true` or `false` | Keeps new users pending until email verification completes, unless auto-confirm is enabled. |
| `require_phone_verification` | `false` | `true` or `false` | Requires phone verification when the registration flow collects a phone number. |
| `allowed_email_domains` | Empty list | Domain names or wildcard domains such as `*.example.com` | When non-empty, self-registration is allowed only for matching email domains. |
| `blocked_email_domains` | Empty list | Domain names or wildcard domains such as `*.example.com` | Blocks matching domains. Blocklist takes precedence over allowlist. |
| `auto_confirm_enabled` | `false` | `true` or `false` | Activates new accounts without requiring email verification. Cannot be true when `require_email_verification` is true. |
| `verification_token_ttl_hours` | `24` | `1` or higher | Lifetime for verification tokens or OTPs. |
| `captcha_on_signup` | `false` | `true` or `false` | Requires CAPTCHA verification during signup when a CAPTCHA provider is configured. |
| `registration_rate_limit_per_ip_per_hour` | `10` | `1` or higher | Per-IP hourly registration limit. |

Important behavior:

- Blocked domains are a hard provisioning block and apply beyond self-registration, including invite and federated just-in-time provisioning paths.
- Allowed domains are a self-registration gate. They do not replace invite approval.
- `allowed_email_domains` and `blocked_email_domains` cannot overlap.
- `auto_confirm_enabled` and `require_email_verification` cannot both be true.
- `captcha_on_signup` requires CAPTCHA provider configuration. Relevant production secrets/settings are `CAPTCHA_SECRET`, optional `CAPTCHA_VERIFY_URL`, and optional `CAPTCHA_MIN_SCORE`.
- If no CAPTCHA provider is configured, a tenant with `captcha_on_signup=true` is warned as unenforceable instead of silently blocking all signups.

## Threat Settings

Threat settings score and react to abuse patterns that are broader than one account.

| Field | Default | Allowed Values | What It Does |
|---|---:|---|---|
| `brute_force_detection_enabled` | `true` | `true` or `false` | Enables failed-login threat counters. |
| `impossible_travel_detection_enabled` | `true` | `true` or `false` | Emits a signal when a user logs in from a different IP too quickly after a prior login. |
| `new_device_notification_enabled` | `true` | `true` or `false` | Emits a signal when a new device fingerprint is observed for a user. |
| `velocity_check_enabled` | `true` | `true` or `false` | Scores high failed-login volume from an IP. |
| `risk_based_step_up_enabled` | `false` | `true` or `false` | Requires step-up when the risk score reaches `risk_step_up_threshold`. |
| `compromised_credential_monitoring_enabled` | `true` | `true` or `false` | Enables compromised-credential monitoring paths such as post-auth password breach checks. |
| `ip_reputation_check_enabled` | `false` | `false` only unless an IP reputation provider is added | Reserved for IP reputation integration. Enabling is rejected when no provider exists. |
| `block_tor_exit_nodes` | `false` | `false` only unless a Tor exit-node source is added | Reserved for Tor exit-node blocking. Enabling is rejected when no source exists. |
| `risk_step_up_threshold` | `21` | `0` to `100` | Risk score at which step-up is required when risk-based step-up is enabled. |
| `risk_block_threshold` | `81` | `0` to `100`, and at least `risk_step_up_threshold` | Risk score at which Auth blocks the attempt. |
| `velocity_failures_per_ip_per_hour` | `50` | `1` or higher | Failure-volume threshold for one IP. |
| `distinct_accounts_per_ip_per_hour` | `10` | `1` or higher | Distinct-account fan-out threshold for credential-stuffing detection. |

Important behavior:

- Volume detects many failures from one IP.
- Distinct-account fan-out detects one IP trying many accounts.
- New-device and impossible-travel signals can create Auth events when notification hooks are wired.
- Threat scoring uses shared state. If that store is unavailable, scoring can degrade and Auth logs the degradation.
- IP reputation and Tor blocking are intentionally not advertised as active controls until a provider is wired.

## IP Restriction Rules

IP restriction rules control where users can authenticate from and where authenticated tenant routes can be used from.

| Field | Meaning |
|---|---|
| Description | Operator-readable explanation of why the rule exists. Maximum 500 characters. |
| Type | `allow`, `deny`, `whitelist`, or `blacklist`. Use `allow` and `deny` for runtime enforcement; `whitelist` and `blacklist` are accepted legacy labels in the management model but should not be used for new rules. |
| IP address | IPv4 address to match. |
| Status | `active` or `inactive`. Only active rules are enforced. |

Runtime behavior:

- No active rules means the request is allowed by IP policy.
- Deny-only rules block matching IPs and allow everything else.
- Allow rules create an allowlist: if at least one allow rule exists, the client IP must match an allow rule.
- Deny match wins immediately.
- Pre-auth credential endpoints derive the tenant from the request host, not from request body fields.
- Pre-auth rule loading fails closed for an identified tenant when no cached rules are available.
- Authenticated tenant routes fail open on a cold rule-load error to avoid ejecting an already-authenticated user during a transient store issue.
- Loaded rule sets are cached briefly per tenant.

Because IP restrictions depend on the resolved client IP, configure trusted proxy handling correctly. Relevant deployment settings are `TRUSTED_PROXY_CIDRS`; `TRUST_ALL_PROXIES=true` should be used only when the platform guarantees forwarding headers are overwritten by a trusted edge.

## Runtime Enforcement Controls

These controls are not edited inside the tenant security settings form, but they are part of the security behavior operators must understand.

| Control | What It Does |
|---|---|
| Security headers | Adds browser protections such as `X-Content-Type-Options`, `X-Frame-Options`, CSP, referrer policy, permissions policy, and HSTS in production. |
| Security context | Records client IP, user agent, and request ID for logs and audit correlation. |
| Request size limit | Applies a 10 MB global body-size limit. |
| Request timeout | Applies a 60 second global request timeout. |
| CORS allowlist | Allows configured origins, tenant-surface origins, and active client CORS origins. Wildcard origins are never combined with credentials. |
| JSON content-type enforcement | Requires state-changing JSON requests to identify JSON bodies correctly. |
| Global public IP rate limit | Limits public traffic by client IP. The default public rate is 100 requests per minute per IP. |
| Credential endpoint rate limit | Applies a tighter public rate limit to login, registration, password reset, SMS login, magic link, and account recovery. The default is 10 requests per minute per IP. |
| Tenant request rate limit | Applies tenant rate-limit settings on tenant-scoped routes. Tenant rate-limit configuration is documented in [Tenants & members](#tenants-members). |
| Tenant maintenance gate | Blocks tenant identity traffic during configured maintenance windows. |
| Tenant status gate | Blocks authentication and identity routes for suspended or inactive tenants. |
| Management client gate | Requires JWTs on the internal management API to be minted for the management client. |
| First-party account gate | Prevents third-party OAuth client tokens from managing the user's own account. |
| CSRF protection | Uses a double-submit `__Host-csrf` cookie and `X-CSRF-Token` header for cookie-authenticated state-changing account routes. Authorization-header requests are not CSRF-gated. |
| DPoP enforcement | Sender-constrained access tokens must be presented with the `DPoP` scheme and a valid DPoP proof. |
| gRPC certificate binding | Configured gRPC clients can require certificate-bound access tokens. |
| mTLS control plane | The control plane should be deployed behind mTLS/private network controls. See [Transport security](#transport-security). |

## Sensitive Actions And Step-Up

Sensitive actions require stronger proof when policy requires it. Examples include security setting updates, MFA changes, password changes, email or username changes, session revocation, account deletion, and other account-management actions.

Step-up behavior depends on:

- The current token/session authentication context.
- Whether the action is protected by step-up middleware.
- The tenant MFA policy.
- Whether the user has an enrolled MFA method.
- `require_mfa_for_sensitive_actions`.
- `step_up_ttl_minutes`.

Use short step-up freshness windows for administrator actions. A long step-up window makes it easier for a stolen session to remain useful after a user completes MFA once.

## Production Checklist

Before treating a tenant as ready for production use:

- Password settings have a strong minimum length, common-password rejection, breach checking, and history enabled.
- MFA is at least optional for end users and enforced for administrators or high-risk tenants.
- Sensitive actions require MFA step-up.
- Access-token lifetime is short and refresh-token rotation is enabled.
- Session revocation on password change is enabled.
- PKCE is required, especially for public clients.
- Registration is either intentionally open or invite-only.
- Email-domain rules are configured when the tenant only accepts users from known domains.
- CAPTCHA is enabled only when a provider is configured and the signup UI can supply tokens.
- Lockout and threat controls are enabled.
- IP restrictions are configured for tenants that require location or network boundaries.
- Trusted proxy settings are correct so rate limits, audit logs, and IP restrictions use the real client IP.
- CORS origins are limited to the tenant surfaces and registered external applications.
- Auth events and management audit logs are monitored after security changes.
