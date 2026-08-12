# Hosted Login Flow

Hosted login is the default browser integration model for external applications.

## Flow

1. The external app creates an OAuth authorization request.
2. The browser is sent to Auth's hosted identity UI.
3. Auth resolves the tenant and client from the request and host.
4. Auth displays login methods allowed for that client.
5. The user signs in with password, magic link, SMS, passkey, MFA, or an attached external provider.
6. Auth handles consent when the client requires it.
7. Auth redirects back to the app's callback URI with an authorization code.
8. The app exchanges the code for tokens.
9. The app verifies tokens and starts its own application session.

## Tenant And Client Context

External apps use `client_id` on OAuth paths. The hosted identity UI uses public tenant/client lookup to render the correct branding, client name, login methods, and registration context.

## MFA And Step-Up

Login can require MFA based on tenant policy and user enrollment. Sensitive account actions can require step-up, which is a fresh MFA proof rather than a full re-login.

## Registration

Registration can be open, invite-driven, or governed by registration flows. Registration flows can assign roles and determine how the user enters the tenant.

## Consent

When consent is required, Auth creates a consent challenge and the hosted identity UI collects the user's decision before continuing the authorization request.
