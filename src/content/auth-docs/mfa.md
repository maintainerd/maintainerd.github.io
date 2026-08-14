# MFA & Step-Up

Auth separates everyday login MFA from step-up checks for sensitive actions.

## Supported Factors

- TOTP.
- Passkeys and WebAuthn.
- SMS OTP.
- Email OTP.
- Backup codes.

## Self-Service

- Enroll factors.
- Verify factors.
- Disable factors.
- Regenerate backup codes.
- Reset the caller's own MFA.
- Manage passkey credentials.

## Step-Up

- Issue a step-up challenge.
- Send SMS step-up code.
- Send email OTP step-up code.
- Verify step-up proof.
- Require fresh step-up before destructive factor changes.
- Require policy-aware step-up for sensitive account actions.

## Admin Remediation

- Reset all MFA factors for a user.
- Reset a selected factor for a user.
