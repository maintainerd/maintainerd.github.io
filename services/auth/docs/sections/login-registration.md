# Login & Registration

Login and registration are the hosted identity journeys users see in the browser. The console configures the rules; the hosted identity UI shows only the methods and steps allowed by those rules.

## Where Users See It

Users enter the hosted identity UI when:

- An application sends them to sign in.
- They open a tenant identity hostname.
- They accept an invite.
- They start registration.
- They reset a password.
- They complete MFA.
- They approve consent for an application.

Administrators configure the experience through tenants, clients, identity providers, registration flows, security settings, branding, messaging, and account self-service settings. This page explains the user journey; the detailed configuration pages are [Applications & clients](#clients), [Identity providers](#identity-providers), [Registration flows](#registration-flows), [Messaging](#messaging), and [Security controls](#security).

## What The Login Screen Shows

The login screen can show:

- Tenant or application branding.
- Email/password fields.
- Magic-link option.
- SMS login option.
- Social or enterprise provider buttons.
- SAML SSO option.
- Registration link when signup is allowed.
- Forgot-password link.
- MFA challenge after primary login.
- Consent screen when an application needs approval.
- Error or lockout states.

The screen shows a method only when tenant, client, provider, registration, and security policy allow it.

## Login Context

Before rendering the screen, Auth resolves:

- Tenant from hostname or trusted context.
- Client from the application login request.
- Tenant status.
- Client status.
- Provider connections.
- Registration policy.
- Security policy.
- Branding.

This context decides what the user sees. Backend enforcement must repeat the same checks when the user submits a form or returns from a provider.

## Login Methods

Email and password lets users sign in with a local Auth-managed credential.

Magic link sends a short-lived email link so users can sign in without a password.

SMS login sends a one-time code to a phone number.

OIDC or OAuth2 login sends users to an external provider such as Google, GitHub, Microsoft, Auth0, Cognito, or GitLab.

SAML login sends users through enterprise SSO.

MFA challenge asks for a second proof after primary login.

Backup-code recovery lets users recover when they lose normal MFA factors.

Each method has different operational and security cost. Enable only the methods the tenant intends to support.

## Registration Entry

Registration can appear as:

- Public signup.
- Invite acceptance.
- Provider-driven signup.
- Profile completion after first login.
- Email or phone verification.
- First password setup.

Registration follows the active registration flow for the tenant and client. The available onboarding models and field meanings are documented in [Registration flows](#registration-flows).

## Fields Users Enter

Email identifies the account for email login, recovery, invite matching, magic links, or verification.

Username is optional and depends on tenant policy.

Password proves access for local Auth accounts.

Phone number is used only when SMS login, phone verification, recovery, or SMS MFA is enabled.

OTP or verification code proves control of email, phone, or an MFA factor.

Provider button starts external login.

Invite link or code proves the user has an onboarding invitation.

Profile fields collect display information after or during registration.

## Recovery Links

Forgot password starts recovery for a user who cannot sign in with their password.

Reset password completes recovery after the user proves control of a recovery channel.

Magic-link login is authentication, not a password reset. It should be short-lived and protected like a bearer secret.

Account locked and too-many-requests states protect users and the service from repeated attempts.

## Permissions And Security

Login is a public user flow, but configuration requires administrator permissions.

Administrators need permissions to:

- Enable or disable login methods.
- Configure providers.
- Configure registration flows.
- Configure password and lockout policy.
- Configure MFA.
- Configure messaging.
- Configure branding.
- Unlock users.
- Reset passwords.
- Revoke sessions.

Sensitive administrative changes should be audited and may require step-up MFA.

## Common User Journey

1. User opens an application.
2. Application sends user to Auth.
3. Auth resolves tenant and client.
4. Hosted identity UI shows allowed login methods.
5. User chooses a method.
6. Auth validates the proof.
7. Auth completes MFA when required.
8. Auth completes consent when required.
9. Auth redirects the user back to the application.

## Common Admin Workflow

1. Open tenant settings and confirm tenant is active.
2. Open application/client settings and confirm redirect URIs.
3. Open identity providers and enable intended login methods.
4. Connect providers to the client.
5. Open registration flows and choose signup behavior.
6. Open branding and messaging settings.
7. Test login, registration, MFA, recovery, and logout.
8. Review events and audit records.

## Troubleshooting

If a login method is missing, check tenant status, client status, provider status, client-provider connection, and registration policy.

If password login fails, check user status, password state, lockout, verification requirements, and MFA policy.

If magic links or reset links do not arrive, check email provider, templates, sender settings, rate limits, and logs.

If SMS login fails, check SMS provider, phone verification, rate limits, OTP lifetime, and tenant SMS settings.

If provider login fails, check upstream provider configuration, callback settings, issuer, certificates, state, nonce, and account-linking rules.

If registration creates users unexpectedly, check public registration, JIT provisioning, invite requirements, and default access.
