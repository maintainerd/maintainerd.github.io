// Endpoint details for this Auth API section.

const publicIdentity = "Public identity API";

const jsonContentHeader = {
  "name": "Content-Type",
  "value": "application/json",
  "required": true,
  "description": "Required when the endpoint accepts a JSON request body."
};

const jsonAcceptHeader = {
  "name": "Accept",
  "value": "application/json",
  "required": false,
  "description": "Use when the caller wants an explicit JSON response."
};

const tokenDeliveryHeader = {
  "name": "X-Token-Delivery",
  "value": "cookie",
  "required": false,
  "description": "Optional for browser clients that want access, ID, and refresh tokens delivered as Secure HttpOnly cookies. Omit it when the app stores bearer tokens from the JSON response."
};

const sessionHeader = {
  "name": "X-Session-ID",
  "value": "<session_id>",
  "required": false,
  "description": "Optional refresh-token session hint. If omitted, cookie-based clients can derive the session from the access-token cookie."
};

const bearerAuthHeader = {
  "name": "Authorization",
  "value": "Bearer <access_token>",
  "required": true,
  "description": "Required only for account-link confirmation. The token must belong to the existing account that is approving the link."
};

const noAuthHeader = {
  "name": "Authorization",
  "value": "Not required",
  "required": false,
  "description": "Public authentication endpoints are unauthenticated. Tenant/application context is supplied by client_id when required."
};

const publicReadHeaders = [jsonAcceptHeader, noAuthHeader];
const publicJsonHeaders = [jsonContentHeader, jsonAcceptHeader, noAuthHeader];
const tokenJsonHeaders = [jsonContentHeader, jsonAcceptHeader, tokenDeliveryHeader, noAuthHeader];
const cookieCapableHeaders = [jsonContentHeader, jsonAcceptHeader, tokenDeliveryHeader, noAuthHeader];
const accountLinkHeaders = [jsonAcceptHeader, bearerAuthHeader];

const emptyBody = {
  "type": "None",
  "description": "This endpoint does not accept a request body.",
  "fields": [],
  "example": null
};

const clientIdParameter = {
  "name": "client_id",
  "in": "query",
  "type": "string",
  "required": true,
  "description": "Public application client identifier. The public auth surface requires client_id and rejects tenant_id for these routes."
};

const registrationFlowParameter = {
  "name": "registration_flow",
  "in": "query",
  "type": "string",
  "required": false,
  "description": "Optional registration flow name. Use the same flow selector that was configured for the client, for example customer-signup or partner_invite."
};

const signedTokenParameter = {
  "name": "token",
  "in": "query",
  "type": "string",
  "required": true,
  "description": "Server-issued token embedded in the signed link. Treat it as a bearer credential and never log it."
};

const signedExpiresParameter = {
  "name": "expires",
  "in": "query",
  "type": "string",
  "required": true,
  "description": "Expiration value produced by the signed URL generator. The server validates it before using the token."
};

const signedSigParameter = {
  "name": "sig",
  "in": "query",
  "type": "string",
  "required": true,
  "description": "Signed URL signature. The server rejects missing, changed, or expired signatures before processing the request."
};

const authTokenData = {
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "rt_7b2d2d0e3c5b4f0a9c1d",
  "expires_in": 3600,
  "token_type": "Bearer",
  "issued_at": 1765209600,
  "session_id": "970834ab-e31d-4a30-afc6-0f30ec5772d6"
};

const loginTokenResponse = {
  "status": "200 OK",
  "description": "Authentication succeeded and tokens were issued. Cookie delivery is also possible when X-Token-Delivery is set to cookie.",
  "example": {
    "success": true,
    "data": authTokenData,
    "message": "Login successful"
  }
};

const registrationTokenResponse = {
  "status": "201 Created",
  "description": "Registration succeeded and the new account was signed in. Cookie delivery is also possible when X-Token-Delivery is set to cookie.",
  "example": {
    "success": true,
    "data": authTokenData,
    "message": "Registration successful"
  }
};

const mfaRequiredResponse = {
  "status": "200 OK",
  "description": "The primary login proof was accepted, but tenant policy requires an MFA step before tokens are issued.",
  "example": {
    "success": true,
    "data": {
      "mfa_required": true,
      "mfa_challenge_token": "mfa_challenge_9d1d5b4d3a",
      "mfa_allowed_methods": ["totp", "webauthn", "backup_code"],
      "mfa_totp_digits": 6
    },
    "message": "MFA verification required"
  }
};

const validationErrorResponse = {
  "status": "400 Bad Request",
  "description": "The JSON body, query string, or signed link parameters failed validation.",
  "example": {
    "success": false,
    "error": "Validation failed",
    "details": {
      "email": "Email must be a valid email address"
    }
  }
};

const clientContextErrorResponse = {
  "status": "400 Bad Request",
  "description": "The public route was called without client_id or with tenant_id in the query string.",
  "example": {
    "success": false,
    "error": "Public login requires client_id and does not accept tenant_id"
  }
};

const invalidBodyResponse = {
  "status": "400 Bad Request",
  "description": "The request body was not valid JSON.",
  "example": {
    "success": false,
    "error": "Invalid request body"
  }
};

const unauthorizedResponse = {
  "status": "401 Unauthorized",
  "description": "Credentials, token, OTP, session, or challenge data could not be accepted.",
  "example": {
    "success": false,
    "error": "Authentication failed"
  }
};

const rateLimitResponse = {
  "status": "429 Too Many Requests",
  "description": "The endpoint-specific rate limit, OTP budget, or lockout policy rejected the attempt.",
  "example": {
    "success": false,
    "error": "Too many requests. Please try again later."
  }
};

const internalErrorResponse = {
  "status": "500 Internal Server Error",
  "description": "An unexpected service or persistence error occurred. The response uses the endpoint fallback message.",
  "example": {
    "success": false,
    "error": "Authentication failed"
  }
};

const publicAuthNotes = [
  "Public authentication endpoints are called on the Public identity API base URL.",
  "Use client_id to identify the external application. Do not send tenant_id on these public routes.",
  "When X-Token-Delivery: cookie is used, the response can set Secure HttpOnly cookies while still returning the JSON envelope."
];

const emailField = {
  "name": "email",
  "type": "string",
  "required": true,
  "description": "Email address. Must be a valid email address and 255 characters or less."
};

const phoneField = {
  "name": "phone",
  "type": "string",
  "required": true,
  "description": "Phone number for SMS login. Use the tenant-supported phone format; the value must be 20 characters or less."
};

const otpField = {
  "name": "otp",
  "type": "string",
  "required": true,
  "description": "One-time code supplied by the user."
};

const challengeTokenField = {
  "name": "mfa_challenge_token",
  "type": "string",
  "required": true,
  "description": "Opaque challenge token returned by /login or /magic-link/verify when MFA is required."
};

const tokenResponses = [loginTokenResponse, mfaRequiredResponse, validationErrorResponse, clientContextErrorResponse, invalidBodyResponse, unauthorizedResponse, rateLimitResponse, internalErrorResponse];
const simplePublicResponses = [validationErrorResponse, clientContextErrorResponse, invalidBodyResponse, rateLimitResponse, internalErrorResponse];

const group = {
  "slug": "auth",
  "label": "Authentication",
  "description": "Public login, registration, token refresh, logout, password recovery, email verification, magic links, SMS login, MFA challenge completion, and registration context APIs.",
  "endpoints": [
    {
      "method": "POST",
      "path": "/account-link/{token}/confirm",
      "summary": "Confirm an account-link token for the authenticated user.",
      "surface": publicIdentity,
      "details": {
        "overview": "Finalizes a pending social-login account-link request. The user must already be authenticated as the existing account that is approving the link, which prevents an untrusted browser from linking an external identity by only possessing the link token.",
        "notes": [
          "This is the only endpoint in this section that requires an authenticated user token.",
          "The token path value is server-issued and should be treated as an opaque confirmation secret.",
          "The response exposes the public account_link_request_id and provider name, not internal IDs."
        ],
        "parameters": [
          {
            "name": "token",
            "in": "path",
            "type": "string",
            "required": true,
            "description": "Opaque account-link confirmation token from the account-link flow. Maximum length is 255 characters."
          }
        ],
        "headers": accountLinkHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The external identity was linked to the authenticated account.",
            "example": {
              "success": true,
              "data": {
                "account_link_request_id": "b0e9a882-308a-44c4-bb4d-7615975d5d2a",
                "provider": "google",
                "status": "confirmed"
              },
              "message": "Account linked successfully"
            }
          },
          {
            "status": "401 Unauthorized",
            "description": "The caller is not authenticated as the existing account.",
            "example": {
              "success": false,
              "error": "Unauthorized"
            }
          },
          validationErrorResponse,
          {
            "status": "404 Not Found",
            "description": "The token does not match a pending account-link request.",
            "example": {
              "success": false,
              "error": "account link request not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/email-verification/send",
      "summary": "Send an email verification message.",
      "surface": publicIdentity,
      "details": {
        "overview": "Sends or resends a verification code for an email address in the client context. Use this after registration when the tenant requires email verification, or when a user needs a fresh verification message.",
        "notes": [
          ...publicAuthNotes,
          "The endpoint is rate limited by email address.",
          "For security, clients should present the same success wording even when account existence is ambiguous."
        ],
        "parameters": [clientIdParameter],
        "headers": publicJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Email verification send payload.",
          "fields": [emailField],
          "example": {
            "email": "alex@example.com"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The verification send request was accepted.",
            "example": {
              "success": true,
              "data": {
                "message": "Verification email sent",
                "success": true
              },
              "message": "Verification email sent"
            }
          },
          ...simplePublicResponses
        ]
      }
    },
    {
      "method": "POST",
      "path": "/email-verification/verify",
      "summary": "Verify an email address with an OTP.",
      "surface": publicIdentity,
      "details": {
        "overview": "Consumes the email verification OTP and marks the matching email as verified in the resolved client tenant.",
        "notes": [
          ...publicAuthNotes,
          "OTP values must be between 4 and 12 characters.",
          "The endpoint is rate limited by email address."
        ],
        "parameters": [clientIdParameter],
        "headers": publicJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Email verification consume payload.",
          "fields": [
            emailField,
            {
              ...otpField,
              "description": "Verification code from the email. Must be between 4 and 12 characters."
            }
          ],
          "example": {
            "email": "alex@example.com",
            "otp": "482913"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The email address was verified.",
            "example": {
              "success": true,
              "data": {
                "message": "Email verified",
                "success": true
              },
              "message": "Email verified"
            }
          },
          ...simplePublicResponses
        ]
      }
    },
    {
      "method": "POST",
      "path": "/forgot-password",
      "summary": "Start a forgot-password flow.",
      "surface": publicIdentity,
      "details": {
        "overview": "Starts password recovery for a user in the client tenant by sending a signed reset link to the submitted email address.",
        "notes": [
          ...publicAuthNotes,
          "The endpoint is rate limited by email address.",
          "The reset link generated by this flow calls /reset-password with signed query parameters."
        ],
        "parameters": [clientIdParameter],
        "headers": publicJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Password recovery request payload.",
          "fields": [emailField],
          "example": {
            "email": "alex@example.com"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The password reset request was accepted.",
            "example": {
              "success": true,
              "data": {
                "message": "Password reset email sent",
                "success": true
              },
              "message": "Password reset email sent"
            }
          },
          ...simplePublicResponses
        ]
      }
    },
    {
      "method": "POST",
      "path": "/login",
      "summary": "Authenticate with username or email and password.",
      "surface": publicIdentity,
      "details": {
        "overview": "Authenticates a user for an external application. The service resolves the tenant from client_id, applies tenant security policy, checks password and account state, and either issues tokens or returns an MFA challenge.",
        "notes": [
          ...publicAuthNotes,
          "username can be a username or an email address. User lookup remains tenant-scoped.",
          "trusted_device_token can skip MFA only when the tenant trust policy accepts the token for this user, tenant, and browser/device.",
          "A response with require_password_change=true means the user must complete a password-change flow before a normal session is issued."
        ],
        "parameters": [clientIdParameter],
        "headers": cookieCapableHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Credential login payload.",
          "fields": [
            {
              "name": "username",
              "type": "string",
              "required": true,
              "description": "Username or email address. Must be 255 characters or less."
            },
            {
              "name": "password",
              "type": "string",
              "required": true,
              "description": "Password. Must be 128 characters or less."
            },
            {
              "name": "trusted_device_token",
              "type": "string",
              "required": false,
              "description": "Optional trusted-device token from a previous MFA verification. Browser clients can rely on the HttpOnly trusted-device cookie instead."
            }
          ],
          "example": {
            "username": "alex@example.com",
            "password": "CorrectHorseBatteryStaple!1"
          }
        },
        "responses": tokenResponses
      }
    },
    {
      "method": "POST",
      "path": "/refresh-token",
      "summary": "Exchange a refresh token for a fresh token set.",
      "surface": publicIdentity,
      "details": {
        "overview": "Rotates a refresh token and returns a fresh access token, ID token, and refresh token. Bearer-token clients send refresh_token in the JSON body. Cookie-based browser clients can omit the body and rely on the refresh-token cookie.",
        "notes": [
          "Refresh tokens rotate. Store the newest refresh token or cookie from every successful response.",
          "If an invalid cookie refresh token is detected, auth cookies are cleared so the browser can return to login cleanly.",
          "When X-Token-Delivery: cookie is present, or the incoming refresh token came from a cookie, the rotated tokens are delivered as cookies."
        ],
        "headers": [jsonContentHeader, jsonAcceptHeader, tokenDeliveryHeader, sessionHeader, noAuthHeader],
        "requestBody": {
          "type": "JSON object",
          "description": "Optional in cookie mode. Required for bearer-token clients.",
          "fields": [
            {
              "name": "refresh_token",
              "type": "string",
              "required": false,
              "description": "Refresh token to rotate. If omitted, the server tries the refresh-token cookie."
            }
          ],
          "example": {
            "refresh_token": "rt_7b2d2d0e3c5b4f0a9c1d"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The refresh token was accepted and rotated.",
            "example": {
              "success": true,
              "data": authTokenData,
              "message": "Token refreshed successfully"
            }
          },
          {
            "status": "401 Unauthorized",
            "description": "No refresh token was provided, or the refresh token/session is expired, revoked, reused, or otherwise invalid.",
            "example": {
              "success": false,
              "error": "Refresh token is required"
            }
          },
          invalidBodyResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/logout",
      "summary": "End a browser login session.",
      "surface": publicIdentity,
      "details": {
        "overview": "Clears auth cookies for the caller. When an access-token cookie is present, the service also attempts to revoke the token server-side. This endpoint is safe to call even when the browser is already logged out.",
        "notes": [
          "The endpoint clears access, ID, and refresh cookies if they exist.",
          "Use forget_device=true only when the user wants this browser removed from trusted-device MFA bypass.",
          "Bearer-token clients should discard their local tokens after calling logout because the handler only extracts access tokens from cookies."
        ],
        "parameters": [
          {
            "name": "forget_device",
            "in": "query",
            "type": "boolean",
            "required": false,
            "description": "When true, revokes the trusted-device token from the browser cookie and clears the trusted-device cookies."
          }
        ],
        "headers": publicReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "Logout completed and cookies were cleared.",
            "example": {
              "success": true,
              "message": "Logout successful"
            }
          }
        ]
      }
    },
    {
      "method": "POST",
      "path": "/login/mfa/verify",
      "summary": "Verify an MFA challenge during login.",
      "surface": publicIdentity,
      "details": {
        "overview": "Completes the second step of a login or magic-link flow after an MFA challenge has been issued. On success, the response is the same token response shape as /login.",
        "notes": [
          ...publicAuthNotes,
          "Allowed method values are driven by tenant policy and enrolled factors. Common values are totp, sms, email_otp, webauthn, and backup_code.",
          "Use code for TOTP, SMS OTP, email OTP, or backup code. Use assertion for WebAuthn/passkey responses.",
          "remember_device asks the server to issue a trusted-device token when tenant policy allows it."
        ],
        "parameters": [clientIdParameter],
        "headers": tokenJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "MFA challenge verification payload.",
          "fields": [
            challengeTokenField,
            {
              "name": "method",
              "type": "string",
              "required": true,
              "description": "MFA method being used, such as totp, sms, email_otp, webauthn, or backup_code."
            },
            {
              "name": "code",
              "type": "string",
              "required": false,
              "description": "Typed proof for TOTP, SMS OTP, email OTP, or backup-code methods."
            },
            {
              "name": "assertion",
              "type": "object",
              "required": false,
              "description": "Raw WebAuthn assertion JSON returned by the browser passkey ceremony."
            },
            {
              "name": "remember_device",
              "type": "boolean",
              "required": false,
              "description": "When true, asks the server to trust this device for future logins according to tenant policy."
            }
          ],
          "example": {
            "mfa_challenge_token": "mfa_challenge_9d1d5b4d3a",
            "method": "totp",
            "code": "428193",
            "remember_device": true
          }
        },
        "responses": [
          loginTokenResponse,
          validationErrorResponse,
          clientContextErrorResponse,
          invalidBodyResponse,
          unauthorizedResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/login/mfa/send-sms",
      "summary": "Send an SMS MFA challenge during login.",
      "surface": publicIdentity,
      "details": {
        "overview": "Sends an SMS OTP for an in-flight login MFA challenge. The challenge token identifies the pending login attempt, so the request body does not include a phone number.",
        "notes": [
          "Call this only when the login response includes sms in mfa_allowed_methods.",
          "The challenge token is opaque and short-lived.",
          "The endpoint returns a generic success message after the service accepts the send request."
        ],
        "headers": publicJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "MFA SMS send payload.",
          "fields": [challengeTokenField],
          "example": {
            "mfa_challenge_token": "mfa_challenge_9d1d5b4d3a"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The SMS MFA code send request was accepted.",
            "example": {
              "success": true,
              "message": "SMS code sent"
            }
          },
          invalidBodyResponse,
          unauthorizedResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/login/mfa/send-email-otp",
      "summary": "Send an email OTP MFA challenge during login.",
      "surface": publicIdentity,
      "details": {
        "overview": "Sends an email OTP for an in-flight login MFA challenge. Use it when email_otp is one of the allowed MFA methods returned by the challenge.",
        "notes": [
          "The challenge token identifies the pending login attempt and target user.",
          "The endpoint does not accept email in the body because the MFA challenge already contains the login context."
        ],
        "headers": publicJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "MFA email OTP send payload.",
          "fields": [challengeTokenField],
          "example": {
            "mfa_challenge_token": "mfa_challenge_9d1d5b4d3a"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The email OTP send request was accepted.",
            "example": {
              "success": true,
              "message": "Email OTP code sent"
            }
          },
          invalidBodyResponse,
          unauthorizedResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/login/mfa/webauthn/begin",
      "summary": "Begin WebAuthn authentication during login MFA.",
      "surface": publicIdentity,
      "details": {
        "overview": "Starts the passkey assertion ceremony for an in-flight MFA challenge. The returned options are passed to the browser WebAuthn API, and the resulting assertion is sent to /login/mfa/verify.",
        "notes": [
          "Call this only when webauthn is one of mfa_allowed_methods.",
          "The response data is WebAuthn assertion options generated by the MFA service."
        ],
        "headers": publicJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "WebAuthn MFA begin payload.",
          "fields": [challengeTokenField],
          "example": {
            "mfa_challenge_token": "mfa_challenge_9d1d5b4d3a"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The WebAuthn assertion ceremony was created.",
            "example": {
              "success": true,
              "data": {
                "challenge": "Q0hBTExFTkdFX0JBU0U2NFVSTA",
                "timeout": 60000,
                "rpId": "tenant.auth.example.com",
                "allowCredentials": [
                  {
                    "type": "public-key",
                    "id": "Y3JlZGVudGlhbC1pZA"
                  }
                ],
                "userVerification": "preferred"
              },
              "message": "WebAuthn authentication ceremony started"
            }
          },
          invalidBodyResponse,
          unauthorizedResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/magic-link/send",
      "summary": "Send a magic-link login email.",
      "surface": publicIdentity,
      "details": {
        "overview": "Sends a passwordless sign-in link to a user in the resolved client tenant. The link includes signed query parameters and is verified by /magic-link/verify.",
        "notes": [
          ...publicAuthNotes,
          "The endpoint is rate limited by email address.",
          "Magic-link sign-in can still require MFA when tenant policy or risk-based step-up requires it."
        ],
        "parameters": [clientIdParameter],
        "headers": publicJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Magic-link send payload.",
          "fields": [emailField],
          "example": {
            "email": "alex@example.com"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The sign-in link send request was accepted.",
            "example": {
              "success": true,
              "data": {
                "message": "Sign-in link sent",
                "success": true
              },
              "message": "Sign-in link sent"
            }
          },
          ...simplePublicResponses
        ]
      }
    },
    {
      "method": "POST",
      "path": "/magic-link/verify",
      "summary": "Verify a magic-link login token.",
      "surface": publicIdentity,
      "details": {
        "overview": "Consumes a signed magic-link URL and exchanges it for a session. The server validates the URL signature and expiration before using the embedded token.",
        "notes": [
          "The request body is intentionally empty. The token, client_id, expires, and sig values come from the signed URL.",
          "The signed link must contain client_id and must not contain tenant_id.",
          "A successful link can return tokens immediately or an MFA challenge, depending on tenant policy."
        ],
        "parameters": [signedTokenParameter, clientIdParameter, signedExpiresParameter, signedSigParameter],
        "headers": [jsonAcceptHeader, tokenDeliveryHeader, noAuthHeader],
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The magic link was accepted and tokens were issued.",
            "example": {
              "success": true,
              "data": authTokenData,
              "message": "Signed in"
            }
          },
          mfaRequiredResponse,
          {
            "status": "400 Bad Request",
            "description": "The signed link is missing parameters, expired, invalid, or contains tenant_id.",
            "example": {
              "success": false,
              "error": "Invalid or expired magic link"
            }
          },
          unauthorizedResponse,
          rateLimitResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/register",
      "summary": "Register a new user account.",
      "surface": publicIdentity,
      "details": {
        "overview": "Creates a new user for an external application client, applies the selected registration flow, enforces tenant registration and password policy, assigns flow-defined roles, and signs the user in when registration succeeds.",
        "notes": [
          ...publicAuthNotes,
          "registration_flow is optional, but use it when the signup link is tied to a configured flow.",
          "Required fields are the effective set from the registration flow and tenant policy. Read /registration_context before rendering a dynamic signup form.",
          "captcha_token is forwarded to the registration policy check when the tenant requires captcha."
        ],
        "parameters": [clientIdParameter, registrationFlowParameter],
        "headers": cookieCapableHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Self-registration payload.",
          "fields": [
            {
              "name": "username",
              "type": "string",
              "required": true,
              "description": "Username, 1-255 characters. Allowed characters are letters, digits, dot, underscore, and hyphen."
            },
            {
              "name": "fullname",
              "type": "string",
              "required": false,
              "description": "Full name, up to 255 characters. May become required by the selected registration flow."
            },
            {
              "name": "email",
              "type": "string",
              "required": false,
              "description": "Email address. May become required by the selected flow or email-verification policy."
            },
            {
              "name": "phone",
              "type": "string",
              "required": false,
              "description": "Phone number. May become required by the selected flow or phone-verification policy."
            },
            {
              "name": "password",
              "type": "string",
              "required": true,
              "description": "Password. Must satisfy the tenant password policy and be between 8 and 128 characters."
            },
            {
              "name": "captcha_token",
              "type": "string",
              "required": false,
              "description": "Captcha proof when tenant registration policy requires captcha."
            }
          ],
          "example": {
            "username": "alex",
            "fullname": "Alex Rivera",
            "email": "alex@example.com",
            "phone": "+15551234567",
            "password": "CorrectHorseBatteryStaple!1",
            "captcha_token": "captcha-response-token"
          }
        },
        "responses": [
          registrationTokenResponse,
          validationErrorResponse,
          clientContextErrorResponse,
          invalidBodyResponse,
          {
            "status": "409 Conflict",
            "description": "A username, email, or other unique value already exists in the tenant.",
            "example": {
              "success": false,
              "error": "A record with these values already exists"
            }
          },
          rateLimitResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/register/invite",
      "summary": "Complete registration from an invitation.",
      "surface": publicIdentity,
      "details": {
        "overview": "Completes invited-user registration with a signed invite URL. The invite token and signed parameters prove the invitation context, while the body supplies the username and password for the invited account.",
        "notes": [
          ...publicAuthNotes,
          "The signed URL must contain invite_token, client_id, expires, and sig.",
          "The request body intentionally reuses the login credential shape: username and password.",
          "The invite determines the tenant-side invitation context; do not add tenant_id to the public URL."
        ],
        "parameters": [
          clientIdParameter,
          {
            "name": "invite_token",
            "in": "query",
            "type": "string",
            "required": true,
            "description": "Signed invite token from the invitation email. Maximum length is 500 characters."
          },
          signedExpiresParameter,
          signedSigParameter
        ],
        "headers": cookieCapableHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Invited-user credential payload.",
          "fields": [
            {
              "name": "username",
              "type": "string",
              "required": true,
              "description": "Username for the invited user. Must be 255 characters or less."
            },
            {
              "name": "password",
              "type": "string",
              "required": true,
              "description": "Password for the invited user. Must be 128 characters or less and satisfy tenant password policy."
            }
          ],
          "example": {
            "username": "alex",
            "password": "CorrectHorseBatteryStaple!1"
          }
        },
        "responses": [
          registrationTokenResponse,
          validationErrorResponse,
          clientContextErrorResponse,
          invalidBodyResponse,
          unauthorizedResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/reset-password",
      "summary": "Reset a password with a signed reset link.",
      "surface": publicIdentity,
      "details": {
        "overview": "Consumes a signed password reset URL and sets the new password. The reset token is read from the signed query string, not from the request body.",
        "notes": [
          "The reset URL must contain token, client_id, expires, and sig.",
          "The signed link must contain client_id and must not contain tenant_id.",
          "new_password is checked by the tenant password policy in the service layer."
        ],
        "parameters": [signedTokenParameter, clientIdParameter, signedExpiresParameter, signedSigParameter],
        "headers": publicJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Password reset payload.",
          "fields": [
            {
              "name": "new_password",
              "type": "string",
              "required": true,
              "description": "New password to set for the user. It must satisfy the tenant password policy."
            }
          ],
          "example": {
            "new_password": "NewCorrectHorseBatteryStaple!2"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The password was reset.",
            "example": {
              "success": true,
              "data": {
                "message": "Password has been reset successfully",
                "success": true
              },
              "message": "Password reset successfully"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "The signed link is invalid, expired, missing required parameters, or the new password failed validation.",
            "example": {
              "success": false,
              "error": "Invalid or expired reset link"
            }
          },
          invalidBodyResponse,
          rateLimitResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/sms-login/send",
      "summary": "Send an SMS login code.",
      "surface": publicIdentity,
      "details": {
        "overview": "Sends a one-time SMS code for passwordless phone login in the resolved client tenant.",
        "notes": [
          ...publicAuthNotes,
          "The service sends a generic success message so callers do not learn whether a phone number maps to an account.",
          "The SMS code length is 6 digits and expires according to SMS login policy.",
          "Provider delivery failures are handled server-side; the API response remains generic when the request is accepted."
        ],
        "parameters": [clientIdParameter],
        "headers": publicJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "SMS login send payload.",
          "fields": [phoneField],
          "example": {
            "phone": "+15551234567"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The SMS login send request was accepted.",
            "example": {
              "success": true,
              "message": "If a matching account exists, a verification code has been sent"
            }
          },
          validationErrorResponse,
          clientContextErrorResponse,
          invalidBodyResponse,
          rateLimitResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/sms-login/verify",
      "summary": "Verify an SMS login code and issue tokens.",
      "surface": publicIdentity,
      "details": {
        "overview": "Verifies a one-time SMS code for passwordless phone login. On success, the phone is treated as verified and the endpoint returns the normal token response shape.",
        "notes": [
          ...publicAuthNotes,
          "OTP must be exactly 6 characters.",
          "SMS login can still require a different MFA factor when tenant MFA policy requires step-up beyond the SMS proof."
        ],
        "parameters": [clientIdParameter],
        "headers": tokenJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "SMS login verification payload.",
          "fields": [
            phoneField,
            {
              ...otpField,
              "description": "Six-character SMS OTP sent by /sms-login/send."
            }
          ],
          "example": {
            "phone": "+15551234567",
            "otp": "482913"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The SMS code was accepted and tokens were issued.",
            "example": {
              "success": true,
              "data": authTokenData,
              "message": "Authenticated successfully"
            }
          },
          mfaRequiredResponse,
          validationErrorResponse,
          clientContextErrorResponse,
          invalidBodyResponse,
          unauthorizedResponse,
          rateLimitResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/registration_context",
      "summary": "Read tenant/client registration context for the public app.",
      "surface": publicIdentity,
      "details": {
        "overview": "Returns the effective fields a signup form must collect for the selected client and optional registration flow. This lets external applications render registration forms without first submitting incomplete data to /register.",
        "notes": [
          ...publicAuthNotes,
          "The response deliberately withholds flow roles, IDs, timestamps, status, is_system, and descriptions.",
          "Cache-Control is set to no-store because disabling a registration flow should take effect immediately.",
          "registration_flow must be a valid flow name: lowercase letters or digits separated by hyphen or underscore."
        ],
        "parameters": [clientIdParameter, registrationFlowParameter],
        "headers": publicReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "Registration context was resolved.",
            "example": {
              "success": true,
              "data": {
                "registration_flow": "customer-signup",
                "required_fields": ["fullname", "email", "phone"],
                "verification_required": true
              },
              "message": "Registration context retrieved"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "client_id is missing, tenant_id was supplied, or registration_flow has an invalid format.",
            "example": {
              "success": false,
              "error": "Public registration context requires client_id and does not accept tenant_id"
            }
          },
          {
            "status": "404 Not Found",
            "description": "The client or registration flow cannot be used for public registration.",
            "example": {
              "success": false,
              "error": "registration flow not found for this client"
            }
          },
          internalErrorResponse
        ]
      }
    }
  ]
};

export default group;
