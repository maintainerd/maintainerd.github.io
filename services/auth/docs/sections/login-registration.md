# Login & Registration

Auth's hosted identity UI owns interactive authentication and onboarding.

## Login Methods

- Email and password.
- Magic link.
- SMS login.
- Federated OIDC/OAuth2 login.
- SAML login.
- MFA challenge during login.
- Backup-code account recovery.

## Registration Methods

- Public registration.
- Invite-based registration.
- Profile completion after registration.
- Email verification.

## Recovery Methods

- Forgot password.
- Reset password.
- Backup-code recovery.
- Account locked and too-many-requests states.

## Important Boundaries

Interactive login is public identity work. The internal management API does not accept direct credential login for the console; the console starts an OAuth flow through the hosted identity app.
