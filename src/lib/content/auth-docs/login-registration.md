# Login & Registration

Login and registration are the hosted identity journeys users see in the browser. The console configures the rules; the hosted identity UI shows only the methods and steps allowed by those rules.

## Where Users See It

Users enter the hosted identity UI when:

| Entry Point | Why The User Arrives There |
|---|---|
| Application sign-in | An application redirects the user to Auth. |
| Tenant identity hostname | The user opens the tenant identity experience directly. |
| Invite acceptance | The user follows an onboarding invite. |
| Registration | The user starts signup where policy allows it. |
| Password reset | The user needs account recovery. |
| MFA challenge | The user must complete a second proof. |
| Consent | The user approves application access. |

Administrators configure the experience through tenants, clients, identity providers, registration flows, security settings, branding, messaging, and account self-service settings. This page explains the user journey; the detailed configuration pages are [Applications & clients](#clients), [Identity providers](#identity-providers), [Registration flows](#registration-flows), [Messaging](#messaging), and [Security controls](#security).

## What The Login Screen Shows

The login screen can show:

| Screen Element | Why It Appears |
|---|---|
| Tenant or application branding | Branding is configured for the tenant or client. |
| Email/password fields | Built-in credential login is enabled. |
| Magic-link option | Email passwordless login is enabled and messaging is configured. |
| SMS login option | SMS login is enabled and SMS delivery is configured. |
| Social or enterprise provider buttons | External providers are active and connected to the client. |
| SAML SSO option | A SAML provider is active and connected to the client. |
| Registration link | Signup is allowed by tenant, client, and registration flow. |
| Forgot-password link | Password recovery is enabled for local accounts. |
| MFA challenge | User or tenant policy requires a second proof. |
| Consent screen | The application needs user approval. |
| Error or lockout state | Auth blocked or delayed the flow because a check failed. |

The screen shows a method only when tenant, client, provider, registration, and security policy allow it.

## Login Context

Before rendering the screen, Auth resolves:

| Context | How It Affects The Screen |
|---|---|
| Tenant from hostname or trusted context | Selects tenant policy, branding, providers, and lifecycle state. |
| Client from the application login request | Selects redirect, scopes, provider connections, and client status. |
| Tenant status | Blocks or allows tenant runtime flows. |
| Client status | Blocks or allows the application flow. |
| Provider connections | Decides which external provider buttons can appear. |
| Registration policy | Decides whether signup or invite acceptance is available. |
| Security policy | Decides password, MFA, lockout, rate-limit, and verification behavior. |
| Branding | Decides the visual presentation. |

This context decides what the user sees. Backend enforcement must repeat the same checks when the user submits a form or returns from a provider.

## Login Methods

| Method | What It Does | Dependency |
|---|---|---|
| Email and password | Lets users sign in with a local Auth-managed credential. | Built-in provider and password policy. |
| Magic link | Sends a short-lived email link so users can sign in without a password. | Email provider, template, and rate limits. |
| SMS login | Sends a one-time code to a phone number. | SMS provider, template, and phone rules. |
| OIDC or OAuth2 login | Sends users to an external provider such as Google, GitHub, Microsoft, Auth0, Cognito, or GitLab. | Active provider connected to the client. |
| SAML login | Sends users through enterprise SSO. | Active SAML provider connected to the client. |
| MFA challenge | Asks for a second proof after primary login. | MFA enrollment and tenant MFA policy. |
| Backup-code recovery | Lets users recover when they lose normal MFA factors. | Backup codes and recovery policy. |

Each method has different operational and security cost. Enable only the methods the tenant intends to support.

## Registration Entry

Registration can appear as:

| Entry | What It Means |
|---|---|
| Public signup | The user can create an account without an invite. |
| Invite acceptance | The user joins through an invite. |
| Provider-driven signup | A trusted provider creates or activates the user during login. |
| Profile completion after first login | The user supplies required profile fields after authentication. |
| Email or phone verification | The user proves contact ownership. |
| First password setup | The user sets an initial local password. |

Registration follows the active registration flow for the tenant and client. The available onboarding models and field meanings are documented in [Registration flows](#registration-flows).

## Fields Users Enter

| Field Or Control | What It Is Used For |
|---|---|
| Email | Email login, recovery, invite matching, magic links, or verification. |
| Username | Optional tenant-local identifier when policy allows it. |
| Password | Local Auth credential proof. |
| Phone number | SMS login, phone verification, recovery, or SMS MFA when enabled. |
| OTP or verification code | Proof of email, phone, or MFA factor control. |
| Provider button | Starts external login. |
| Invite link or code | Proves the user has an onboarding invitation. |
| Profile fields | Collect display information after or during registration. |

## Recovery Links

Forgot password starts recovery for a user who cannot sign in with their password.

Reset password completes recovery after the user proves control of a recovery channel.

Magic-link login is authentication, not a password reset. It should be short-lived and protected like a bearer secret.

Account locked and too-many-requests states protect users and the service from repeated attempts.

## Permissions And Security

Login is a public user flow, but configuration requires administrator permissions.

Administrators need permissions to:

| Permission Area | What It Allows |
|---|---|
| Login method management | Enable or disable sign-in methods. |
| Provider management | Configure identity providers. |
| Registration-flow management | Configure signup and onboarding behavior. |
| Password and lockout management | Configure credential and failed-attempt policy. |
| MFA management | Configure factor requirements and recovery behavior. |
| Messaging management | Configure email and SMS delivery. |
| Branding management | Configure tenant and hosted identity presentation. |
| User remediation | Unlock users, reset passwords, and revoke sessions. |

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
