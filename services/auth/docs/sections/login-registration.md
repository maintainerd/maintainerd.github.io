# Login & Registration

Auth's hosted identity UI owns interactive authentication and onboarding. It is the browser-facing surface where users sign in, register, recover accounts, complete MFA, and continue OAuth flows back to applications.

Use this section to understand what login and registration features do, which options affect them, how the hosted identity UI decides what to show, and which security boundaries apply. Exact endpoints, request bodies, response schemas, OAuth wire details, and generated-client examples belong in the API reference.

## Mental Model

Interactive authentication has three audiences:

- The user: the person proving identity.
- The client: the application asking Auth to sign the user in.
- The tenant: the boundary that owns users, providers, registration rules, branding, policies, and settings.

Auth resolves tenant and client context first. Then it decides which login and registration options are available. The hosted identity UI renders those options, but backend policy remains the source of truth.

Login proves an existing account. Registration creates or activates an account. Recovery restores access to an account. MFA strengthens a login. Step-up proves fresh MFA for sensitive actions after login.

## Hosted Identity UI

The hosted identity UI is the default browser integration model. External applications send users to Auth rather than collecting passwords themselves.

The hosted UI handles:

- Login method selection.
- Password login.
- Magic-link login.
- SMS login.
- External OIDC/OAuth2 login.
- SAML login.
- MFA challenges.
- Registration.
- Invite acceptance.
- Email verification.
- Password reset.
- Account locked and too-many-requests states.
- Consent screens when OAuth clients require user consent.
- Redirecting the browser back to the requesting application after Auth finishes.

This keeps credential handling, recovery, MFA, provider callbacks, and account onboarding inside Auth instead of duplicating those flows in every application.

## Login Context Resolution

Before showing login choices, Auth should resolve:

- Tenant: from tenant-aware host routing or trusted tenant context.
- Client: from the OAuth request or hosted identity state.
- Tenant status: whether the tenant can serve runtime traffic.
- Client status: whether the application is allowed to start login.
- Provider connections: which identity providers are attached to that client.
- Registration policy: whether signup should be shown.
- Security policy: whether MFA, lockout, IP restrictions, or rate limits apply.
- Branding: which tenant and client names, logos, and messages should appear.

Frontend display should follow this context, but backend routes must enforce the same decisions. Hiding a login button is not security.

## Login Methods

Auth can support several login methods. Tenants and clients decide which are enabled.

- Email and password: local Auth account login through the built-in provider.
- Magic link: passwordless email-based login.
- SMS login: phone-based login using SMS OTP.
- Federated OIDC/OAuth2 login: external OAuth/OIDC providers such as Google, GitHub, Microsoft, Auth0, or Cognito.
- SAML login: enterprise SAML SSO.
- MFA challenge during login: second-factor verification after primary authentication.
- Backup-code recovery: emergency MFA/account recovery using one-time recovery codes.

Each method has different security and operational requirements. Do not enable a method just because it exists. Decide based on tenant policy, support burden, threat model, and messaging configuration.

## Email And Password Login

Email and password login is the built-in local account path. Auth validates tenant, client, user status, password policy, lockout state, provider connection, and MFA requirements before issuing a session.

Use password login when:

- The tenant wants local Auth-managed accounts.
- Users may not have an external identity provider.
- Password recovery and verification email are configured.
- Password policy and lockout controls are acceptable for the risk level.

Important options:

- Whether password login is enabled for the client.
- Whether the built-in provider is connected to the client.
- Password policy.
- Lockout policy.
- MFA policy.
- Password reset availability.
- Email verification requirement.

Developer behavior:

- Never send credentials to the management API.
- Never collect Auth passwords in downstream applications.
- Rate-limit credential attempts.
- Return safe error messages that do not reveal whether the email exists.
- Require MFA when tenant or user policy requires it.

## Magic-Link Login

Magic-link login sends a short-lived email link that lets the user continue authentication without entering a password.

Use magic links when:

- The tenant wants lower-friction login.
- Email delivery is reliable.
- Links can be short-lived and signed.
- The tenant understands that email inbox access becomes the authentication proof.

Important options:

- Whether magic-link login is enabled for the client.
- Link lifetime.
- Email template and sender configuration.
- Rate limits for link requests.
- Whether the link can create a new user or only authenticate existing users.
- Whether MFA is still required after link validation.

Developer behavior:

- Treat magic links like bearer secrets.
- Keep links short-lived and single-use where possible.
- Do not log full links or tokens.
- Rate-limit link sending to prevent email spam.
- Continue to enforce tenant, client, user, and MFA policy after link validation.

## SMS Login

SMS login sends a one-time code to a verified or allowed phone number.

Use SMS login carefully. It can be convenient, but it has cost, deliverability, SIM-swap, interception, and abuse concerns.

Important options:

- Whether SMS login is enabled.
- SMS provider configuration.
- OTP length and lifetime.
- Retry and resend limits.
- Daily SMS limit.
- Whether phone verification is required before SMS login.
- Whether SMS can satisfy MFA or only primary login.

Developer behavior:

- Rate-limit SMS sends and verification attempts.
- Mask phone numbers in logs and UI where possible.
- Avoid revealing whether a phone number is registered.
- Do not use the development `log` provider outside controlled environments.
- Consider stronger factors for administrators and sensitive roles.

## Federated OIDC/OAuth2 Login

Federated OIDC/OAuth2 login sends users to an external provider and lets Auth map the upstream proof into a tenant-scoped Auth user.

Use it when:

- Users should sign in with providers such as Google, GitHub, Microsoft, Auth0, Cognito, GitLab, or another OIDC provider.
- A tenant wants enterprise SSO through OIDC.
- JIT provisioning or account linking is part of the onboarding model.

Important options:

- Provider status.
- Client provider connection.
- Issuer, client ID, client secret, scopes, and discovery metadata.
- Attribute mapping.
- Email-domain routing.
- JIT provisioning.
- Account-linking rules.
- Registration policy.

Developer behavior:

- Validate upstream issuer, audience, expiry, signature, state, and nonce.
- Do not trust email alone for account resolution.
- Link provider subjects to Auth users.
- Keep upstream provider tokens out of browser and admin list responses.
- Audit provider validation failures and account-link outcomes.

## SAML Login

SAML login supports enterprise SSO with SAML 2.0 identity providers.

Use SAML when a tenant's workforce identity system depends on SAML metadata, signed assertions, and SAML attribute mapping.

Important options:

- SAML provider status.
- Client provider connection.
- Entity ID.
- SSO URL.
- Signing certificate.
- NameID format.
- Attribute mapping.
- Assertion validation policy.
- JIT provisioning and registration behavior.

Developer behavior:

- Validate signatures, issuer, audience, destination, recipient, time conditions, and replay protections.
- Map a stable subject, not a mutable display name.
- Keep SAML assertion contents out of normal logs.
- Test certificate rotation before production changes.

## MFA During Login

MFA during login adds a second proof after primary authentication. It can use factors such as TOTP, WebAuthn/passkeys, SMS OTP, email OTP, or backup codes.

MFA can be required by tenant policy, user enrollment, risk controls, client policy, or role sensitivity. A user may complete password or provider login and still be blocked until MFA succeeds.

Important options:

- Required MFA policy.
- Allowed factor types.
- Remembered-device behavior.
- Backup-code availability.
- Challenge lifetime.
- Retry limits.
- Recovery behavior when the user loses a factor.

Developer behavior:

- Treat MFA as part of the same authentication transaction.
- Rate-limit challenge attempts.
- Do not reveal which factor exists unless the user is allowed to know.
- Use step-up for sensitive actions after login instead of asking for a full re-login every time.

## Backup-Code Recovery

Backup codes are one-time recovery codes used when a user loses access to normal MFA factors.

Use backup codes as an emergency path, not as a routine login method. Users should generate and store them during MFA setup. Administrators may have remediation tools, but direct bypass should be controlled and audited.

Important options:

- Whether backup codes are enabled.
- Number of codes generated.
- Code lifetime or rotation policy.
- Whether codes can satisfy MFA recovery.
- Whether using a backup code triggers factor reset or security notification.

Developer behavior:

- Store backup codes hashed.
- Show backup codes only at generation time.
- Mark used codes as consumed.
- Audit recovery events.
- Encourage users to regenerate codes after use.

## Registration Methods

Registration creates or activates an Auth user inside a tenant.

Supported registration patterns include:

- Public registration.
- Invite-based registration.
- Provider-driven registration through JIT provisioning.
- Profile completion after registration.
- Email verification.
- Admin-created onboarding outside the public identity flow.

Registration should always respect tenant status, client context, provider context, registration flow policy, invite state, role assignment rules, rate limits, and security settings.

## Public Registration

Public registration lets users create accounts without a prior invite.

Use it when:

- The tenant intentionally supports self-service signup.
- New accounts should receive low-risk default access.
- Email verification and abuse controls are configured.
- The product has a clear post-signup onboarding path.

Public registration should not grant tenant administration membership. It should assign conservative application roles and require verification steps when policy says so.

## Invite-Based Registration

Invite-based registration requires a valid invite before the user can enter the tenant.

Use it when:

- The tenant is private or B2B.
- Administrators should approve users first.
- Roles should be pre-assigned.
- The invite should expire if unused.
- Onboarding needs a clear audit trail.

Auth should reject expired, revoked, already accepted, malformed, or wrong-tenant invites. Invite tokens are bearer secrets and should not appear in logs.

## Profile Completion

Profile completion collects user-facing personal details after or during registration.

Use profile completion when the product needs display name, first name, last name, avatar, locale, timezone, or other non-authentication profile fields.

Profiles should not control authorization. Use users, tenant members, roles, permissions, policies, and provider identities for access control.

## Email Verification

Email verification proves the user controls an email address.

Use it when:

- The email is used for account recovery.
- The email receives magic links or password reset links.
- The tenant requires verified contact information before normal access.
- Invite acceptance should prove the recipient owns the invited email.

Verification links and codes should expire, be rate-limited, and avoid revealing whether an email belongs to an account.

## Recovery Methods

Recovery methods help users regain access without weakening account security.

Common recovery paths:

- Forgot password.
- Reset password.
- Backup-code recovery.
- Account locked state.
- Too-many-requests state.
- Admin-assisted recovery from the console.

Recovery flows must balance usability and abuse resistance. They should not reveal account existence, should avoid leaking tokens, and should be audited when administrators intervene.

## Forgot And Reset Password

Forgot password starts recovery. Reset password completes it after the user proves control of a recovery channel.

Important options:

- Reset link lifetime.
- Email template and sender.
- Rate limits.
- Whether existing sessions are revoked after reset.
- Whether MFA is required after reset.
- Whether password history prevents reuse.

Developer behavior:

- Treat reset links like bearer secrets.
- Do not log full reset URLs.
- Require strong password policy at completion.
- Consider revoking sessions after password reset.
- Avoid revealing whether the email exists.

## Account Locked And Too Many Requests

Lockout and too-many-requests states protect users and the service from repeated attempts.

Account lockout usually applies to a user account after failed authentication. Too-many-requests usually applies to a route, tenant, IP address, client, or identifier after excessive traffic.

Developer behavior:

- Show a safe user-facing message.
- Avoid exposing whether an account exists.
- Preserve enough event history for investigation.
- Let administrators unlock users only with proper permissions.
- Keep automated unlock behavior consistent with tenant security policy.

## Important Boundaries

Interactive login is public identity work. The internal management API does not accept direct credential login for the console; the console starts an OAuth flow through the hosted identity app.

Important boundaries:

- Downstream applications should not collect Auth passwords.
- Management APIs should not be used as login endpoints.
- Hosted identity UI owns browser credential and recovery flows.
- Public identity APIs must enforce tenant, client, provider, session, CSRF, and rate-limit controls.
- Account self-service belongs to the identity surface, not the admin console.
- Administrative recovery belongs to the console and must be permission-gated.

## Permissions

Login itself is a public user flow, but configuration and remediation require permissions.

Typical permission areas:

- Security policy read and write: configure password, lockout, MFA, session, and threat settings.
- Registration flow read and write: configure onboarding behavior.
- Client read and write: configure which login options an app can use.
- Provider read and write: configure external providers and client connections.
- Messaging read and write: configure email and SMS senders/templates.
- User credential administration: reset passwords or force password change.
- User unlock: clear account lockout.
- Session administration: revoke user sessions.
- MFA remediation: reset factors or help a user recover.
- Invite administration: create, resend, or revoke invites.

Sensitive actions such as disabling password login, enabling public registration, changing MFA requirements, resetting passwords, unlocking accounts, and enabling SMS login should require strong authorization and may require step-up MFA.

## Events And Audit

Login and registration flows should emit security events and audit records where appropriate.

Security-event examples:

- Login succeeded.
- Login failed.
- MFA challenge issued.
- MFA challenge failed.
- Password reset requested.
- Password reset completed.
- Magic link requested.
- SMS code requested.
- Account locked.
- Registration completed.
- Invite accepted.
- Provider callback validation failed.

Audit-worthy admin actions:

- Login method enabled or disabled.
- Registration behavior changed.
- Password policy changed.
- MFA policy changed.
- User unlocked.
- Password reset by admin.
- Sessions revoked by admin.
- Invite created, resent, or revoked.

Do not place plaintext passwords, OTPs, magic links, reset links, invite tokens, session cookies, access tokens, refresh tokens, or provider tokens in logs, audit records, or event payloads.

## Developer Workflow

For a normal external application:

1. Create or select the tenant.
2. Create the OAuth client.
3. Configure redirect and logout behavior.
4. Choose allowed login methods for that client.
5. Configure identity providers and client provider connections.
6. Configure registration flow behavior.
7. Configure email and SMS delivery before enabling flows that send messages.
8. Configure MFA, password, lockout, session, and rate-limit policies.
9. Test successful login.
10. Test failed login, locked account, MFA failure, and recovery flows.
11. Review auth events and audit records.

## Developer Checklist

Before shipping login and registration, verify:

- Tenant context is resolved before showing login options.
- Client context is resolved before showing login options.
- Disabled tenants cannot serve login or registration.
- Disabled clients cannot start login.
- Disabled or misconfigured providers do not appear.
- Password, magic-link, SMS, external provider, and SAML methods are enabled only when intentionally configured.
- Registration follows registration-flow policy.
- Invite-only registration rejects missing, expired, revoked, or already accepted invites.
- Password reset and magic-link tokens expire and are not logged.
- SMS flows are rate-limited.
- MFA is required when tenant or user policy says so.
- Account lockout and too-many-requests states produce safe user messages.
- API request and response details are documented in the API reference, not duplicated in this conceptual page.

## Troubleshooting

If the login page shows the wrong branding, check tenant host resolution, client lookup, tenant branding, and whether the browser is on the expected identity host.

If a login method does not appear, check tenant settings, client configuration, provider connection, registration flow policy, and whether the method is enabled for that client.

If password login fails for a valid user, check user status, tenant status, client status, password policy, lockout state, email verification requirements, and MFA requirements.

If magic links or password reset emails do not arrive, check tenant messaging settings, inherited system messaging, template status, sender configuration, rate limits, and event logs.

If SMS login fails, check SMS provider status, phone verification policy, rate limits, OTP lifetime, and tenant SMS settings.

If external provider login fails, check provider status, client provider connection, upstream provider settings, callback validation, account-linking rules, and JIT provisioning policy.

If registration creates unexpected users, check open registration, provider JIT provisioning, invite requirements, registration flow scope, and email-domain routing.
