# Tokens & Sessions

Auth uses tokens for API access and sessions for browser continuity.

## Tokens

- JWT access tokens.
- OIDC ID tokens.
- Refresh tokens.
- Authorization codes.
- Device codes.
- CIBA state.
- Revocation and introspection support.

## Signing And Verification

- JWT signing keys are loaded from the configured secret provider.
- JWKS publishes public verification keys.
- `kid` selects the active signing key.
- Signing keys can be rotated, retired, or marked compromised.

## Sessions

- Browser token delivery uses secure cookie helpers.
- Users can list sessions.
- Users can revoke one session, all sessions, or other sessions.
- Admins can revoke user sessions.
- Session policy includes idle timeout, absolute lifetime, and concurrent-session behavior.
