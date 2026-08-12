# OAuth & OIDC

M9d Auth acts as an OAuth 2.0 authorization server and OpenID Connect provider for browser apps, native apps, machine clients, and device flows.

## Supported Endpoint Families

- Authorization endpoint and token endpoint.
- Token revocation, token introspection, and userinfo.
- OpenID discovery, OAuth authorization-server metadata, and JWKS.
- Pushed authorization requests.
- Device authorization.
- Dynamic client registration.
- Consent challenge, consent decisions, consent grants, and grant revocation.
- End-session and back-channel logout.
- CIBA and token exchange flows.

## Supported Grant Shapes

- Authorization code with PKCE S256.
- Refresh token rotation with token-family tracking and reuse detection.
- Client credentials for machine and service clients.
- Device code.
- Token exchange.
- CIBA.

## Token Model

Access tokens are RS256 JWTs with normal issuer, audience, expiry, subject, JTI, and key ID claims. Refresh tokens and authorization codes are stored hashed. JWKS supports multiple signing keys and key rotation.

