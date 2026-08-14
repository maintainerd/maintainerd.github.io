# Example Workflows

These are the guide-level examples that should be expanded into full walkthroughs.

## Basic Web App Login

- Create a tenant.
- Create a web client.
- Add redirect and logout URIs.
- Configure authorization code flow.
- Redirect users to hosted login.
- Exchange the code for tokens.
- Verify ID/access tokens with JWKS.
- Call UserInfo or start an app session.

## SPA Or Mobile Login With PKCE

- Create a public client.
- Allow authorization code with PKCE.
- Add redirect URIs for the app.
- Store no client secret in the browser or mobile app.
- Validate `state` and PKCE verifier on callback.

## Social Login For One App

- Create a Google, GitHub, Microsoft, or other provider.
- Test the provider.
- Attach it to one client.
- Start login with that client's `client_id`.
- Confirm the provider appears only in that client's hosted login choices.

## Enterprise SSO For One Tenant

- Create an OIDC/OAuth2 or SAML provider.
- Configure email-domain home-realm discovery if needed.
- Configure JIT provisioning rules.
- Attach the provider to one or more clients.
- Verify account linking and role assignment behavior.

## Protected Resource API

- Create a service.
- Create API and permission records.
- Create roles and policies.
- Assign roles to users.
- Validate access tokens.
- Enforce permissions with policy bundles, `/authorize/`, introspection, or gRPC authorization.

## Machine-To-Machine Client

- Create a machine-to-machine client.
- Configure client authentication.
- Grant service permissions through policies.
- Use client credentials or workload identity where appropriate.
- Introspect or verify tokens on the resource server.
