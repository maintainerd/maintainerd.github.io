// Endpoint details for this Auth API section.

const group = {
  "slug": "auth",
  "label": "Authentication",
  "description": "Public login, registration, token refresh, logout, password recovery, email verification, magic links, SMS login, MFA challenge completion, and registration context APIs.",
  "endpoints": [
    {
      "method": "POST",
      "path": "/account-link/{token}/confirm",
      "summary": "Confirm an account-link token for the authenticated user.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/email-verification/send",
      "summary": "Send an email verification message.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/email-verification/verify",
      "summary": "Verify an email address with a code or token.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/forgot-password",
      "summary": "Start a forgot-password flow.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/login",
      "summary": "Authenticate with credentials.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/refresh-token",
      "summary": "Exchange a refresh token for a fresh token set.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/logout",
      "summary": "End a login session.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/login/mfa/verify",
      "summary": "Verify an MFA challenge during login.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/login/mfa/send-sms",
      "summary": "Send an SMS MFA challenge during login.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/login/mfa/send-email-otp",
      "summary": "Send an email OTP MFA challenge during login.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/login/mfa/webauthn/begin",
      "summary": "Begin WebAuthn authentication during login MFA.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/magic-link/send",
      "summary": "Send a magic-link login email.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/magic-link/verify",
      "summary": "Verify a magic-link login token.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/register",
      "summary": "Register a new user account.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/register/invite",
      "summary": "Complete registration from an invitation.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/reset-password",
      "summary": "Reset a password with a reset token.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/sms-login/send",
      "summary": "Send an SMS login code.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/sms-login/verify",
      "summary": "Verify an SMS login code and issue tokens.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/registration_context",
      "summary": "Read tenant/client registration context for the public app.",
      "surface": "Public identity API"
    }
  ]
};

export default group;
