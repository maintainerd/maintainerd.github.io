# Identity Flows

Auth can own credentials directly or broker identity from upstream providers while keeping local user, role, session, and authorization state under the tenant.

## Built-In Authentication

- Email and password login with password policy, brute-force protection, lockout, reset-password, and email verification.
- Registration flows that can assign roles during onboarding.
- Invite-based registration with pre-assigned roles.
- Magic-link login and SMS OTP login.

## User Self-Service

Users can manage profile and account state through the identity surface. The public authenticated surface includes profile, settings, account, trusted devices, MFA management, data-erasure self-service, and identity linking where appropriate.

## Federation

Auth supports upstream OIDC and OAuth federation. It can exchange upstream identity assertions, provision local users just in time, link identities, extract upstream claims, and use home-realm discovery to select the right provider by email domain.

## Local Authorization Remains Local

Even when authentication happens through an external provider, Auth keeps the local authorization model. The user still maps to local roles, permissions, policies, sessions, and tenant security rules.

