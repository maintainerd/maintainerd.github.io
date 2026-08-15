// Endpoint details for this Auth API section.

const publicIdentity = "Public identity API";
const management = "Internal management API";

const jsonContentHeader = {
  "name": "Content-Type",
  "value": "application/json",
  "required": true,
  "description": "Required when the endpoint accepts a JSON request body. WebAuthn finish endpoints accept the raw publicKeyCredential JSON produced by the browser API."
};

const jsonAcceptHeader = {
  "name": "Accept",
  "value": "application/json",
  "required": false,
  "description": "Use when the caller wants an explicit JSON response."
};

const bearerAuthHeader = {
  "name": "Authorization",
  "value": "Bearer <access_token>",
  "required": true,
  "description": "Required. The endpoint is mounted behind JWT authentication and user-context resolution. Self-service routes act only on the authenticated user's own factors."
};

const jwtReadHeaders = [jsonAcceptHeader, bearerAuthHeader];
const jwtJsonHeaders = [jsonContentHeader, jsonAcceptHeader, bearerAuthHeader];

const emptyBody = {
  "type": "None",
  "description": "This endpoint does not accept a request body.",
  "fields": [],
  "example": null
};

const unauthorizedResponse = {
  "status": "401 Unauthorized",
  "description": "The caller is not authenticated as an Auth user.",
  "example": {
    "success": false,
    "error": "Unauthorized"
  }
};

const forbiddenResponse = {
  "status": "403 Forbidden",
  "description": "The authenticated caller does not hold the required permission.",
  "example": {
    "success": false,
    "error": "Insufficient permissions"
  }
};

const stepUpResponse = {
  "status": "403 Forbidden",
  "description": "The operation requires a fresh step-up and the caller's session has not completed one within the tenant's freshness window.",
  "example": {
    "success": false,
    "error": "Step-up authentication required",
    "code": "step_up_required"
  }
};

const policyNotAllowedResponse = {
  "status": "403 Forbidden",
  "description": "The tenant policy does not permit this MFA method.",
  "example": {
    "success": false,
    "error": "TOTP MFA is not permitted by tenant policy"
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

const internalErrorResponse = {
  "status": "500 Internal Server Error",
  "description": "An unexpected service or persistence error occurred.",
  "example": {
    "success": false,
    "error": "An unexpected error occurred"
  }
};

const tenantMissingResponse = {
  "status": "401 Unauthorized",
  "description": "The authenticated context does not resolve a tenant.",
  "example": {
    "success": false,
    "error": "Tenant not found in context"
  }
};

const mfaStatusExample = {
  "is_totp_enabled": true,
  "is_webauthn_enabled": true,
  "is_sms_available": false,
  "is_email_otp_available": false,
  "backup_codes_count": 7,
  "webauthn_keys": [
    {
      "credential_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "name": "Security key",
      "transport": "usb,internal",
      "last_used_at": "2026-08-14T09:00:00Z",
      "created_at": "2026-08-01T09:00:00Z"
    }
  ],
  "mfa_enabled_at": "2026-07-15T09:00:00Z",
  "allowed_methods": ["totp", "webauthn", "sms", "backup_code"],
  "mfa_required": false,
  "totp_digits": 6
};

const stepUpVerifyExample = {
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
};

const group = {
  "slug": "mfa",
  "label": "MFA",
  "description": "Multi-factor authentication APIs for status, step-up, TOTP, backup codes, WebAuthn passkeys, SMS, email OTP, self reset, and administrator resets.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/mfa/status",
      "summary": "Read enrolled MFA methods and available challenges.",
      "surface": publicIdentity,
      "details": {
        "overview": "Returns the authenticated user's complete MFA state: which factors are enrolled, how many backup codes remain, the registered passkeys, and the tenant policy (allowed methods, whether MFA is required, and the TOTP digit length) so clients can render the right enrollment and challenge UI.",
        "notes": [
          "Requires the account:mfa:read:self permission.",
          "AllowedMethods is tenant policy; the enabled flags describe this user's actual enrollment. The UI needs both.",
          "totp_digits is 6 or 8 per tenant policy and drives authenticator code length."
        ],
        "parameters": [],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The user's MFA status and tenant policy.",
            "example": {
              "success": true,
              "data": mfaStatusExample,
              "message": "MFA status retrieved"
            }
          },
          unauthorizedResponse,
          forbiddenResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/mfa/webauthn/auth/begin",
      "summary": "Begin a WebAuthn assertion for step-up.",
      "surface": publicIdentity,
      "details": {
        "overview": "Starts a passkey assertion ceremony for step-up authentication. The returned options are passed to navigator.credentials.get, and the resulting assertion is submitted to /mfa/webauthn/auth/finish or used as the assertion in /mfa/step-up/verify.",
        "notes": [
          "Requires the account:mfa:verify:self permission.",
          "The ceremony is per-user: the assertion options are bound to the authenticated user's registered credentials.",
          "WebAuthn must be permitted by tenant policy."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The WebAuthn assertion ceremony was created. The data is the raw assertion options for the browser API.",
            "example": {
              "success": true,
              "data": {
                "challenge": "Q0hBTExFTkdFX0JBU0U2NFVSTA",
                "timeout": 60000,
                "rpId": "identity-api.auth.example.com",
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
          unauthorizedResponse,
          forbiddenResponse,
          {
            "status": "403 Forbidden",
            "description": "WebAuthn is not permitted by tenant policy.",
            "example": {
              "success": false,
              "error": "WebAuthn MFA is not permitted by tenant policy"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/mfa/webauthn/auth/finish",
      "summary": "Finish a WebAuthn assertion for step-up.",
      "surface": publicIdentity,
      "details": {
        "overview": "Completes the passkey assertion ceremony. The body is the raw publicKeyCredential JSON produced by navigator.credentials.get after /mfa/webauthn/auth/begin.",
        "notes": [
          "Requires the account:mfa:verify:self permission.",
          "The body is NOT a JSON object with named fields; it is the raw WebAuthn assertion response.",
          "The service verifies the assertion against the challenge issued at begin time."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "Raw WebAuthn assertion JSON",
          "description": "The publicKeyCredential object returned by navigator.credentials.get.",
          "fields": [
            {
              "name": "id",
              "type": "string",
              "required": true,
              "description": "Base64url credential ID."
            },
            {
              "name": "rawId",
              "type": "string",
              "required": true,
              "description": "Raw credential ID."
            },
            {
              "name": "type",
              "type": "string",
              "required": true,
              "description": "public-key."
            },
            {
              "name": "response",
              "type": "object",
              "required": true,
              "description": "Assertion response: clientDataJSON, authenticatorData, signature, userHandle."
            }
          ],
          "example": {
            "id": "Y3JlZGVudGlhbC1pZA",
            "rawId": "Y3JlZGVudGlhbC1pZA",
            "type": "public-key",
            "response": {
              "clientDataJSON": "eyJjaGFsbGVuZ2UiOiJRMGhoVEV4RlZHVkZSVUkyTlZWVVRBIiwidHlwZSI6IndlYmF1dGhuLmdldCJ9",
              "authenticatorData": "U1pZRm9yTWFjaGluZQ",
              "signature": "c2lnbmF0dXJl",
              "userHandle": "dXNlci1oYW5kbGU"
            }
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The assertion was verified.",
            "example": {
              "success": true,
              "data": {
                "credential_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "name": "Security key"
              },
              "message": "WebAuthn authentication succeeded"
            }
          },
          unauthorizedResponse,
          forbiddenResponse,
          {
            "status": "400 Bad Request",
            "description": "The body is not a valid WebAuthn assertion response.",
            "example": {
              "success": false,
              "error": "Invalid WebAuthn assertion response"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/mfa/step-up/challenge",
      "summary": "Issue a step-up challenge.",
      "surface": publicIdentity,
      "details": {
        "overview": "Issues a short-lived step-up challenge token (5-minute TTL) listing the factors the authenticated user may use to prove possession. The client presents the right challenge UI and submits the proof to /mfa/step-up/verify.",
        "notes": [
          "Requires the account:mfa:verify:self permission.",
          "The allowed methods are derived from the user's current enrollment.",
          "The challenge token is opaque and single-purpose."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The step-up challenge was issued.",
            "example": {
              "success": true,
              "data": {
                "challenge_token": "stepup_9d1d5b4d3a",
                "allowed_methods": ["totp", "webauthn", "backup_code"]
              },
              "message": "Step-up challenge issued"
            }
          },
          unauthorizedResponse,
          forbiddenResponse,
          {
            "status": "403 Forbidden",
            "description": "No MFA methods are permitted by tenant policy.",
            "example": {
              "success": false,
              "error": "no MFA methods are permitted by tenant policy"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/mfa/step-up/send-sms",
      "summary": "Send an SMS step-up challenge.",
      "surface": publicIdentity,
      "details": {
        "overview": "Sends an SMS OTP for step-up to the user's verified MFA phone number. The code is submitted through /mfa/step-up/verify with method sms.",
        "notes": [
          "Requires the account:mfa:verify:self permission.",
          "Requires a verified MFA phone on file and SMS permitted by tenant policy.",
          "The step-up SMS code expires after 10 minutes."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The SMS step-up code was sent.",
            "example": {
              "success": true,
              "data": null,
              "message": "SMS step-up code sent"
            }
          },
          unauthorizedResponse,
          forbiddenResponse,
          {
            "status": "400 Bad Request",
            "description": "No verified MFA phone is on file.",
            "example": {
              "success": false,
              "error": "no verified MFA phone on file"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/mfa/step-up/send-email-otp",
      "summary": "Send an email OTP step-up challenge.",
      "surface": publicIdentity,
      "details": {
        "overview": "Sends an email OTP for step-up to the user's verified MFA email. The code is submitted through /mfa/step-up/verify with method email_otp.",
        "notes": [
          "Requires the account:mfa:verify:self permission.",
          "Requires a verified MFA email on file and email OTP permitted by tenant policy."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The email OTP was sent.",
            "example": {
              "success": true,
              "data": null,
              "message": "Email OTP sent"
            }
          },
          unauthorizedResponse,
          forbiddenResponse,
          {
            "status": "400 Bad Request",
            "description": "No verified MFA email is on file.",
            "example": {
              "success": false,
              "error": "no verified MFA email on file"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/mfa/step-up/verify",
      "summary": "Verify a step-up challenge.",
      "surface": publicIdentity,
      "details": {
        "overview": "Verifies the submitted second-factor proof against the challenge and returns a fresh access token with an elevated acr claim. All step-up-gated operations require this token.",
        "notes": [
          "Requires the account:mfa:verify:self permission.",
          "method is one of totp, sms, email_otp, webauthn, or backup_code.",
          "Use code for typed proofs (TOTP, SMS, email OTP, backup code). Use assertion for WebAuthn, after beginning the ceremony with /mfa/webauthn/auth/begin.",
          "The returned token carries acr=2 and is valid for the tenant's step-up freshness window."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Step-up verification payload.",
          "fields": [
            {
              "name": "challenge_token",
              "type": "string",
              "required": true,
              "description": "Challenge token from /mfa/step-up/challenge."
            },
            {
              "name": "method",
              "type": "string",
              "required": true,
              "description": "Factor being used: totp, sms, email_otp, webauthn, or backup_code."
            },
            {
              "name": "code",
              "type": "string",
              "required": false,
              "description": "Typed proof for totp, sms, email_otp, or backup_code."
            },
            {
              "name": "assertion",
              "type": "object",
              "required": false,
              "description": "Raw WebAuthn assertion JSON for the webauthn method."
            }
          ],
          "example": {
            "challenge_token": "stepup_9d1d5b4d3a",
            "method": "totp",
            "code": "428193"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The step-up succeeded and an elevated access token was issued.",
            "example": {
              "success": true,
              "data": stepUpVerifyExample,
              "message": "Step-up authentication succeeded"
            }
          },
          unauthorizedResponse,
          forbiddenResponse,
          invalidBodyResponse,
          {
            "status": "401 Unauthorized",
            "description": "The challenge token is invalid or expired, or the proof was rejected.",
            "example": {
              "success": false,
              "error": "step-up challenge subject not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/mfa/totp/enroll",
      "summary": "Begin TOTP enrollment.",
      "surface": publicIdentity,
      "details": {
        "overview": "Generates a TOTP secret and otpauth QR-code URL for the authenticated user. The secret becomes active only after /mfa/totp/verify succeeds.",
        "notes": [
          "Requires the account:mfa:enroll:self permission.",
          "The route is gated by RequireStepUpForNewFactor: when the account already holds a factor, the caller needs a fresh step-up; the first-ever enrollment stays open.",
          "digits and period_seconds follow tenant TOTP policy (6 or 8 digits)."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The TOTP enrollment was started.",
            "example": {
              "success": true,
              "data": {
                "secret": "JBSWY3DPEHPK3PXP",
                "qr_code_url": "otpauth://totp/Auth:alex@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Auth&digits=6&period=30",
                "digits": 6,
                "period_seconds": 30
              },
              "message": "TOTP enrollment started"
            }
          },
          unauthorizedResponse,
          forbiddenResponse,
          stepUpResponse,
          policyNotAllowedResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/mfa/totp/verify",
      "summary": "Finish TOTP enrollment.",
      "surface": publicIdentity,
      "details": {
        "overview": "Verifies a TOTP code against the pending enrollment secret and activates TOTP. On success the response returns the freshly generated backup codes, shown exactly once.",
        "notes": [
          "Requires the account:mfa:enroll:self permission, with the same conditional step-up gate as enrollment.",
          "There must be a pending enrollment from /mfa/totp/enroll.",
          "The backup codes in the response are shown once and never retrievable again."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "TOTP enrollment verification payload.",
          "fields": [
            {
              "name": "code",
              "type": "string",
              "required": true,
              "description": "TOTP code from the authenticator app. 6 or 8 digits per tenant policy."
            }
          ],
          "example": {
            "code": "428193"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "TOTP was activated and fresh backup codes were issued.",
            "example": {
              "success": true,
              "data": {
                "codes": ["482913", "750291", "193847", "628405", "501726", "934815", "276490", "845102", "392647", "610938"]
              },
              "message": "TOTP enrolled successfully — save your backup codes"
            }
          },
          unauthorizedResponse,
          forbiddenResponse,
          stepUpResponse,
          policyNotAllowedResponse,
          invalidBodyResponse,
          {
            "status": "400 Bad Request",
            "description": "No pending TOTP enrollment exists, or the code is invalid.",
            "example": {
              "success": false,
              "error": "invalid TOTP code"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/mfa/totp",
      "summary": "Disable TOTP.",
      "surface": publicIdentity,
      "details": {
        "overview": "Removes TOTP enrollment for the authenticated user. This is a destructive self-service action and requires a fresh step-up from the caller.",
        "notes": [
          "Requires the account:mfa:disable:self permission plus RequireFreshStepUp.",
          "A caller without a fresh step-up is refused even if the account holds other factors.",
          "If this was the last factor, the MFA state is reconciled (backup codes are purged)."
        ],
        "parameters": [],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "TOTP was disabled.",
            "example": {
              "success": true,
              "data": null,
              "message": "TOTP disabled"
            }
          },
          unauthorizedResponse,
          forbiddenResponse,
          stepUpResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/mfa/backup-codes/count",
      "summary": "Read remaining backup-code count.",
      "surface": publicIdentity,
      "details": {
        "overview": "Returns how many unused backup codes remain for the authenticated user, so the UI can warn before the set runs out.",
        "notes": [
          "Requires the account:mfa:read:self permission.",
          "Codes themselves are never returned by this endpoint; only the count."
        ],
        "parameters": [],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The remaining backup-code count.",
            "example": {
              "success": true,
              "data": {
                "remaining": 7
              },
              "message": ""
            }
          },
          unauthorizedResponse,
          forbiddenResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/mfa/backup-codes/regenerate",
      "summary": "Regenerate backup codes.",
      "surface": publicIdentity,
      "details": {
        "overview": "Issues a fresh set of 10 backup codes and invalidates all previous ones. The new codes are returned exactly once.",
        "notes": [
          "Requires the account:mfa:enroll:self permission plus RequireFreshStepUp — minting codes from a single-factor foothold would defeat MFA.",
          "Old codes stop working immediately."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "A fresh set of backup codes was generated.",
            "example": {
              "success": true,
              "data": {
                "codes": ["482913", "750291", "193847", "628405", "501726", "934815", "276490", "845102", "392647", "610938"]
              },
              "message": "New backup codes generated — save them now"
            }
          },
          unauthorizedResponse,
          forbiddenResponse,
          stepUpResponse,
          policyNotAllowedResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/mfa/webauthn/register/begin",
      "summary": "Begin WebAuthn passkey registration.",
      "surface": publicIdentity,
      "details": {
        "overview": "Starts a passkey registration ceremony. The returned creation options are passed to navigator.credentials.create, and the resulting attestation is submitted to /mfa/webauthn/register/finish.",
        "notes": [
          "Requires the account:mfa:enroll:self permission, with the same conditional step-up gate as TOTP enrollment.",
          "WebAuthn must be permitted by tenant policy."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The WebAuthn registration ceremony was created.",
            "example": {
              "success": true,
              "data": {
                "challenge": "Q0hBTExFTkdFX0JBU0U2NFVSTA",
                "rp": {
                  "name": "Auth",
                  "id": "identity-api.auth.example.com"
                },
                "user": {
                  "id": "dXNlci1pZA",
                  "name": "alex@example.com",
                  "displayName": "Alex Rivera"
                },
                "pubKeyCredParams": [
                  {
                    "type": "public-key",
                    "alg": -7
                  }
                ],
                "timeout": 60000,
                "authenticatorSelection": {
                  "userVerification": "preferred"
                }
              },
              "message": "WebAuthn registration ceremony started"
            }
          },
          unauthorizedResponse,
          forbiddenResponse,
          stepUpResponse,
          {
            "status": "403 Forbidden",
            "description": "WebAuthn is not permitted by tenant policy.",
            "example": {
              "success": false,
              "error": "WebAuthn MFA is not permitted by tenant policy"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/mfa/webauthn/register/finish",
      "summary": "Finish WebAuthn passkey registration.",
      "surface": publicIdentity,
      "details": {
        "overview": "Completes the passkey registration ceremony with the raw attestation JSON produced by navigator.credentials.create. The credential name is supplied as a query parameter.",
        "notes": [
          "Requires the account:mfa:enroll:self permission plus the conditional step-up gate.",
          "The body is the raw WebAuthn creation response, not a named-field JSON object.",
          "name is an optional query parameter labeling the credential."
        ],
        "parameters": [
          {
            "name": "name",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Human-readable label for the passkey."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "Raw WebAuthn creation JSON",
          "description": "The publicKeyCredential object returned by navigator.credentials.create.",
          "fields": [
            {
              "name": "id",
              "type": "string",
              "required": true,
              "description": "Base64url credential ID."
            },
            {
              "name": "rawId",
              "type": "string",
              "required": true,
              "description": "Raw credential ID."
            },
            {
              "name": "type",
              "type": "string",
              "required": true,
              "description": "public-key."
            },
            {
              "name": "response",
              "type": "object",
              "required": true,
              "description": "Attestation response: clientDataJSON, attestationObject."
            }
          ],
          "example": {
            "id": "Y3JlZGVudGlhbC1pZA",
            "rawId": "Y3JlZGVudGlhbC1pZA",
            "type": "public-key",
            "response": {
              "clientDataJSON": "eyJjaGFsbGVuZ2UiOiJRMGhoVEV4RlZHVkZSVUkyTlZWVVRBIiwidHlwZSI6IndlYmF1dGhuLmNyZWF0ZSJ9",
              "attestationObject": "YXR0ZXN0YXRpb24tb2JqZWN0"
            }
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The passkey was registered.",
            "example": {
              "success": true,
              "data": {
                "credential_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "name": "Security key",
                "transport": "usb,internal",
                "created_at": "2026-08-15T09:00:00Z"
              },
              "message": "Passkey registered successfully"
            }
          },
          unauthorizedResponse,
          forbiddenResponse,
          stepUpResponse,
          {
            "status": "400 Bad Request",
            "description": "The body is not a valid WebAuthn creation response.",
            "example": {
              "success": false,
              "error": "Invalid WebAuthn credential response"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/mfa/webauthn/{credential_uuid}",
      "summary": "Delete a WebAuthn credential.",
      "surface": publicIdentity,
      "details": {
        "overview": "Removes a registered passkey from the authenticated user's account. After deletion the MFA state is reconciled: if this was the last primary factor, leftover backup codes are purged.",
        "notes": [
          "Requires the account:mfa:disable:self permission plus RequireFreshStepUp.",
          "The credential must belong to the authenticated user."
        ],
        "parameters": [
          {
            "name": "credential_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the WebAuthn credential to remove."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The credential was deleted.",
            "example": {
              "success": true,
              "data": null,
              "message": "Credential deleted"
            }
          },
          unauthorizedResponse,
          forbiddenResponse,
          stepUpResponse,
          {
            "status": "404 Not Found",
            "description": "The credential does not exist or belongs to another user.",
            "example": {
              "success": false,
              "error": "credential not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/mfa/webauthn/{credential_uuid}/download",
      "summary": "Download credential information for a WebAuthn passkey.",
      "surface": publicIdentity,
      "details": {
        "overview": "Downloads the credential record for a registered passkey, including the public key material, backup-eligibility flags, and creation time. The response carries a Content-Disposition attachment header.",
        "notes": [
          "Requires the account:mfa:read:self permission plus RequireFreshStepUp — exporting key material is sensitive even for its owner.",
          "The credential must belong to the authenticated user."
        ],
        "parameters": [
          {
            "name": "credential_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the WebAuthn credential."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The credential record, as a file attachment.",
            "example": {
              "success": true,
              "data": {
                "credential_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "name": "Security key",
                "credential_key_id": "Y3JlZGVudGlhbC1rZXktaWQ",
                "public_key_base64": "cHVibGljLWtleQ",
                "aaguid": "00000000-0000-0000-0000-000000000000",
                "transport": "usb",
                "is_backup_eligible": false,
                "is_backup_active": false,
                "created_at": "2026-08-01T09:00:00Z"
              },
              "message": "Credential downloaded"
            }
          },
          unauthorizedResponse,
          forbiddenResponse,
          stepUpResponse,
          {
            "status": "404 Not Found",
            "description": "The credential does not exist or belongs to another user.",
            "example": {
              "success": false,
              "error": "credential not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/mfa/sms/enroll",
      "summary": "Begin SMS MFA enrollment.",
      "surface": publicIdentity,
      "details": {
        "overview": "Sends an SMS verification code to the supplied phone number to begin SMS MFA enrollment. Enrollment completes with /mfa/sms/verify.",
        "notes": [
          "Requires the account:mfa:enroll:self permission plus the conditional step-up gate.",
          "SMS must be permitted by tenant policy.",
          "Enrolling while SMS is already active responds as a conflict."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "SMS enrollment payload.",
          "fields": [
            {
              "name": "phone",
              "type": "string",
              "required": true,
              "description": "Phone number for SMS MFA."
            }
          ],
          "example": {
            "phone": "+15551234567"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The SMS enrollment code was sent.",
            "example": {
              "success": true,
              "data": null,
              "message": "SMS enrollment code sent"
            }
          },
          unauthorizedResponse,
          forbiddenResponse,
          stepUpResponse,
          policyNotAllowedResponse,
          invalidBodyResponse,
          {
            "status": "409 Conflict",
            "description": "SMS MFA is already enrolled.",
            "example": {
              "success": false,
              "error": "SMS MFA is already enrolled — disable it first"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/mfa/sms/verify",
      "summary": "Finish SMS MFA enrollment.",
      "surface": publicIdentity,
      "details": {
        "overview": "Verifies the SMS code from /mfa/sms/enroll and activates SMS MFA for the phone number.",
        "notes": [
          "Requires the account:mfa:enroll:self permission plus the conditional step-up gate.",
          "The phone must match the pending enrollment."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "SMS enrollment verification payload.",
          "fields": [
            {
              "name": "phone",
              "type": "string",
              "required": true,
              "description": "Phone number from the enrollment request."
            },
            {
              "name": "code",
              "type": "string",
              "required": true,
              "description": "SMS verification code."
            }
          ],
          "example": {
            "phone": "+15551234567",
            "code": "482913"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "SMS MFA was enabled.",
            "example": {
              "success": true,
              "data": null,
              "message": "SMS MFA enabled"
            }
          },
          unauthorizedResponse,
          forbiddenResponse,
          stepUpResponse,
          policyNotAllowedResponse,
          invalidBodyResponse,
          {
            "status": "400 Bad Request",
            "description": "No pending SMS enrollment exists for this phone.",
            "example": {
              "success": false,
              "error": "no pending SMS enrollment for this phone"
            }
          },
          {
            "status": "401 Unauthorized",
            "description": "The SMS code is invalid or expired.",
            "example": {
              "success": false,
              "error": "invalid SMS code"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/mfa/sms",
      "summary": "Disable SMS MFA.",
      "surface": publicIdentity,
      "details": {
        "overview": "Removes SMS MFA for the authenticated user. Destructive self-service action requiring a fresh step-up.",
        "notes": [
          "Requires the account:mfa:disable:self permission plus RequireFreshStepUp."
        ],
        "parameters": [],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "SMS MFA was disabled.",
            "example": {
              "success": true,
              "data": null,
              "message": "SMS MFA disabled"
            }
          },
          unauthorizedResponse,
          forbiddenResponse,
          stepUpResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/mfa/email-otp/enroll",
      "summary": "Begin email OTP enrollment.",
      "surface": publicIdentity,
      "details": {
        "overview": "Sends an OTP email to begin email OTP MFA enrollment. Enrollment completes with /mfa/email-otp/verify.",
        "notes": [
          "Requires the account:mfa:enroll:self permission plus the conditional step-up gate.",
          "Email OTP must be permitted by tenant policy."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Email OTP enrollment payload.",
          "fields": [
            {
              "name": "email",
              "type": "string",
              "required": true,
              "description": "Email address for OTP delivery."
            }
          ],
          "example": {
            "email": "alex@example.com"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The email OTP enrollment was started.",
            "example": {
              "success": true,
              "data": null,
              "message": "Email OTP enrollment started — check your email for the code"
            }
          },
          unauthorizedResponse,
          forbiddenResponse,
          stepUpResponse,
          {
            "status": "403 Forbidden",
            "description": "Email OTP is not permitted by tenant policy.",
            "example": {
              "success": false,
              "error": "Email OTP MFA is not permitted by tenant policy"
            }
          },
          invalidBodyResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/mfa/email-otp/verify",
      "summary": "Finish email OTP enrollment.",
      "surface": publicIdentity,
      "details": {
        "overview": "Verifies the email OTP from /mfa/email-otp/enroll and activates email OTP MFA for the address.",
        "notes": [
          "Requires the account:mfa:enroll:self permission plus the conditional step-up gate.",
          "The email must match the pending enrollment."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Email OTP enrollment verification payload.",
          "fields": [
            {
              "name": "email",
              "type": "string",
              "required": true,
              "description": "Email address from the enrollment request."
            },
            {
              "name": "code",
              "type": "string",
              "required": true,
              "description": "Email OTP code."
            }
          ],
          "example": {
            "email": "alex@example.com",
            "code": "482913"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "Email OTP MFA was enabled.",
            "example": {
              "success": true,
              "data": null,
              "message": "Email OTP MFA enabled"
            }
          },
          unauthorizedResponse,
          forbiddenResponse,
          stepUpResponse,
          invalidBodyResponse,
          {
            "status": "401 Unauthorized",
            "description": "The email OTP code is invalid or expired.",
            "example": {
              "success": false,
              "error": "invalid email OTP code"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/mfa/email-otp",
      "summary": "Disable email OTP MFA.",
      "surface": publicIdentity,
      "details": {
        "overview": "Removes email OTP MFA for the authenticated user. Destructive self-service action requiring a fresh step-up.",
        "notes": [
          "Requires the account:mfa:disable:self permission plus RequireFreshStepUp."
        ],
        "parameters": [],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "Email OTP MFA was disabled.",
            "example": {
              "success": true,
              "data": null,
              "message": "Email OTP MFA disabled"
            }
          },
          unauthorizedResponse,
          forbiddenResponse,
          stepUpResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/mfa/reset",
      "summary": "Reset the authenticated user's MFA factors.",
      "surface": publicIdentity,
      "details": {
        "overview": "Removes every MFA factor for the authenticated user: TOTP, passkeys, SMS, email OTP, and backup codes. The target is always the caller — no target parameter exists — so this can only ever reset the caller's own MFA.",
        "notes": [
          "Requires the account:mfa:reset:self permission plus RequireFreshStepUp.",
          "This is the single most destructive MFA action a session can take, which is why it demands a fresh acr=2 proof.",
          "Users who lost their only factor and cannot step up are recovered by an admin via /mfa/admin/users/{user_uuid}/reset."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "All MFA factors were reset.",
            "example": {
              "success": true,
              "data": null,
              "message": "MFA reset successfully"
            }
          },
          unauthorizedResponse,
          forbiddenResponse,
          stepUpResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/mfa/admin/users/{user_uuid}/reset",
      "summary": "Reset all MFA factors for a user.",
      "surface": management,
      "details": {
        "overview": "Administrator remediation: removes every MFA factor for the target user. Use this when a user lost their only factor and cannot step up or log in.",
        "notes": [
          "Requires the user:mfa:reset permission plus strict step-up (acr=2).",
          "The target must belong to the caller's tenant.",
          "Affects a different user than the caller, unlike the self-service routes.",
          "The optional reason is recorded for audit purposes."
        ],
        "parameters": [
          {
            "name": "user_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the target user."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Optional reset payload.",
          "fields": [
            {
              "name": "reason",
              "type": "string",
              "required": false,
              "description": "Free-text reason for the reset, recorded in the audit trail."
            }
          ],
          "example": {
            "reason": "User lost their phone and backup codes"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The user's MFA was reset.",
            "example": {
              "success": true,
              "data": null,
              "message": "MFA reset successfully"
            }
          },
          unauthorizedResponse,
          tenantMissingResponse,
          forbiddenResponse,
          stepUpResponse,
          {
            "status": "404 Not Found",
            "description": "The target user does not exist.",
            "example": {
              "success": false,
              "error": "target user not found"
            }
          },
          {
            "status": "403 Forbidden",
            "description": "The target user does not belong to the caller's tenant.",
            "example": {
              "success": false,
              "error": "target user does not belong to your tenant"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/mfa/admin/users/{user_uuid}/reset/{method}",
      "summary": "Reset one MFA method for a user.",
      "surface": management,
      "details": {
        "overview": "Resets a single MFA factor for the target user, e.g. wiping a lost phone's TOTP or SMS while leaving a registered passkey intact.",
        "notes": [
          "Requires the user:mfa:reset permission plus strict step-up (acr=2).",
          "method is one of totp, webauthn, sms, or backup_code.",
          "The target must belong to the caller's tenant."
        ],
        "parameters": [
          {
            "name": "user_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the target user."
          },
          {
            "name": "method",
            "in": "path",
            "type": "string",
            "required": true,
            "description": "Factor to reset: totp, webauthn, sms, or backup_code."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The single MFA method was reset.",
            "example": {
              "success": true,
              "data": null,
              "message": "MFA method reset successfully"
            }
          },
          unauthorizedResponse,
          tenantMissingResponse,
          forbiddenResponse,
          stepUpResponse,
          {
            "status": "400 Bad Request",
            "description": "The method is not one of totp, webauthn, sms, backup_code.",
            "example": {
              "success": false,
              "error": "unsupported MFA method"
            }
          },
          {
            "status": "404 Not Found",
            "description": "The target user does not exist.",
            "example": {
              "success": false,
              "error": "target user not found"
            }
          },
          {
            "status": "403 Forbidden",
            "description": "The target user does not belong to the caller's tenant.",
            "example": {
              "success": false,
              "error": "target user does not belong to your tenant"
            }
          },
          internalErrorResponse
        ]
      }
    }
  ]
};

export default group;
