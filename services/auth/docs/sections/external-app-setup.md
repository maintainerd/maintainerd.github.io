# External App Setup

Use this workflow when a developer wants their own application to authenticate users with Auth.

## 1. Prepare The Tenant

- Complete instance setup.
- Choose the tenant that owns the app.
- Configure branding so the hosted identity screens match the tenant.
- Configure email before enabling registration, invite, magic-link, reset-password, or verification flows.
- Configure SMS before enabling SMS login or SMS MFA.

## 2. Create The Client

In the console, create an OAuth client for the application.

Capture these values:

- Client identifier.
- Client type: web, SPA, mobile, or machine-to-machine.
- Client secret, if the client is confidential.
- Redirect URIs.
- Post-logout redirect URIs.
- Grant types and response types.
- Token endpoint authentication method.
- Token lifetimes.
- Consent behavior.

For browser-based apps, use authorization code with PKCE. For backend web apps, use a confidential client and keep the secret server-side.

## 3. Wire The Application

The app should use the public identity surface:

- Discover metadata from `/.well-known/openid-configuration`.
- Start login at `/api/v1/oauth/authorize`.
- Exchange the authorization code at `/api/v1/oauth/token`.
- Verify JWTs with `/.well-known/jwks.json`.
- Read profile claims from `/api/v1/oauth/userinfo` when needed.
- End sessions with `/api/v1/oauth/end_session`.

## 4. Configure Logout

Add allowed post-logout redirect URIs to the client. Use the OIDC end-session endpoint so Auth can clear the hosted identity session and return the browser to the app.

## 5. Verify

- The redirect URI matches exactly.
- The app sends the expected `client_id`.
- The callback validates `state`.
- PKCE verifier and challenge match.
- JWKS verification uses the issuer from discovery.
- The hosted login page shows only the providers attached to the client.
