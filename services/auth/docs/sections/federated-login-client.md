# Federated Login Per Client

Use this workflow when a tenant wants a specific external application to offer a social, enterprise, OIDC/OAuth2, or SAML login option.

## 1. Create The Identity Provider

In the console, create an identity provider for the tenant.

For OIDC/OAuth2 providers, prepare:

- Issuer or authorization/token/UserInfo endpoints.
- Provider client ID.
- Provider client secret.
- Scopes.
- Attribute mappings.
- Email domains for home-realm discovery when needed.
- Allowed audiences when accepting upstream tokens.
- JIT provisioning and token federation settings.

For SAML providers, prepare:

- Entity ID.
- SSO URL.
- Optional SLO URL.
- Signing certificate.
- NameID format.
- Attribute mappings.
- Service provider metadata or ACS URL from Auth.

## 2. Test The Provider

Use the console's provider connection test before assigning the provider to a client. Confirm that discovery, metadata, signing keys, or SAML metadata resolve as expected.

## 3. Attach The Provider To A Client

Open the OAuth client and enable the provider for that client. Auth's public connections endpoint returns only the login methods allowed for the selected client, so the hosted login page can show provider choices per app.

## 4. Verify The Login Screen

Start an authorization request with the target `client_id`. The hosted login page should show:

- The tenant branding.
- The app/client display name.
- Built-in login methods allowed for the client.
- The newly attached external provider.

## 5. Account Linking

If the upstream identity matches an existing user, Auth can link the external identity to that account. Users can also manage linked identities from the identity account surface.
