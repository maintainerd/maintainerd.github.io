# OAuth & OIDC

Auth acts as an OAuth 2.0 and OpenID Connect provider for external applications and Maintainerd surfaces.

## Discovery

- OpenID Connect discovery.
- OAuth authorization-server metadata.
- JWKS.

## Browser Flows

- Authorization endpoint.
- Consent challenge.
- Consent decision.
- Consent continuation.
- End session.
- Back-channel logout.

## Token And Extension Flows

- Token endpoint.
- Revocation endpoint.
- UserInfo endpoint.
- Pushed Authorization Requests.
- Device authorization.
- CIBA.
- Token exchange.
- Internal token introspection.

## Grants

- Authorization code with PKCE.
- Refresh token.
- Client credentials.
- Device code.
- CIBA.
- Token exchange.

## Developer Workflow

External applications should start with hosted login and authorization code with PKCE. Use OIDC discovery for endpoint metadata, JWKS for token verification, and the client configuration to control redirect URIs, logout URIs, consent, grants, token lifetimes, and allowed login providers.

## Internal Controls

- Dynamic client registration create/read on the internal surface.
- Signing-key list, rotate, retire, and compromise operations.
