# MFA & Sessions

The session layer is built around short-lived access tokens, hashed refresh tokens, token-family tracking, cookie delivery for browser clients, and revocation paths that react to security changes.

## MFA

MFA support includes:

- TOTP enrollment and verification.
- WebAuthn and passkey registration and authentication.
- SMS OTP.
- Backup codes.
- Trusted devices.
- Admin MFA reset.
- Step-up challenges.

Tenant security settings decide how MFA is enforced for the tenant.

## Sessions

Session management includes active session listing, single-session revocation, revoke-all-sessions, idle timeout, absolute lifetime, concurrent-session limits, and sliding last-used tracking.

Refresh token rotation includes token-family tracking and reuse detection. When a reused refresh token is detected, the token family can be revoked.

## Security Reactions

Sessions can be revoked when sensitive security state changes, such as password changes, password resets, role changes, or permission changes.

