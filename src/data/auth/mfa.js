// Endpoint details for this Auth API section.

const group = {
  "slug": "mfa",
  "label": "MFA",
  "description": "Multi-factor authentication APIs for status, step-up, TOTP, backup codes, WebAuthn passkeys, SMS, email OTP, self reset, and administrator resets.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/mfa/status",
      "summary": "Read enrolled MFA methods and available challenges.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/mfa/webauthn/auth/begin",
      "summary": "Begin a WebAuthn assertion for step-up.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/mfa/webauthn/auth/finish",
      "summary": "Finish a WebAuthn assertion for step-up.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/mfa/step-up/challenge",
      "summary": "Issue a step-up challenge.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/mfa/step-up/send-sms",
      "summary": "Send an SMS step-up challenge.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/mfa/step-up/send-email-otp",
      "summary": "Send an email OTP step-up challenge.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/mfa/step-up/verify",
      "summary": "Verify a step-up challenge.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/mfa/totp/enroll",
      "summary": "Begin TOTP enrollment.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/mfa/totp/verify",
      "summary": "Finish TOTP enrollment.",
      "surface": "Public identity API"
    },
    {
      "method": "DELETE",
      "path": "/mfa/totp",
      "summary": "Disable TOTP.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/mfa/backup-codes/count",
      "summary": "Read remaining backup-code count.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/mfa/backup-codes/regenerate",
      "summary": "Regenerate backup codes.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/mfa/webauthn/register/begin",
      "summary": "Begin WebAuthn passkey registration.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/mfa/webauthn/register/finish",
      "summary": "Finish WebAuthn passkey registration.",
      "surface": "Public identity API"
    },
    {
      "method": "DELETE",
      "path": "/mfa/webauthn/{credential_uuid}",
      "summary": "Delete a WebAuthn credential.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/mfa/webauthn/{credential_uuid}/download",
      "summary": "Download credential information for a WebAuthn passkey.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/mfa/sms/enroll",
      "summary": "Begin SMS MFA enrollment.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/mfa/sms/verify",
      "summary": "Finish SMS MFA enrollment.",
      "surface": "Public identity API"
    },
    {
      "method": "DELETE",
      "path": "/mfa/sms",
      "summary": "Disable SMS MFA.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/mfa/email-otp/enroll",
      "summary": "Begin email OTP enrollment.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/mfa/email-otp/verify",
      "summary": "Finish email OTP enrollment.",
      "surface": "Public identity API"
    },
    {
      "method": "DELETE",
      "path": "/mfa/email-otp",
      "summary": "Disable email OTP MFA.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/mfa/reset",
      "summary": "Reset the authenticated user's MFA factors.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/mfa/admin/users/{user_uuid}/reset",
      "summary": "Reset all MFA factors for a user.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/mfa/admin/users/{user_uuid}/reset/{method}",
      "summary": "Reset one MFA method for a user.",
      "surface": "Internal management API"
    }
  ]
};

export default group;
