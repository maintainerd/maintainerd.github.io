// Endpoint details for this Auth API section.

const publicIdentity = "Public identity API";

const jsonContentHeader = {
  "name": "Content-Type",
  "value": "application/json",
  "required": true,
  "description": "Required when the endpoint accepts a JSON request body."
};

const multipartContentHeader = {
  "name": "Content-Type",
  "value": "multipart/form-data",
  "required": true,
  "description": "Required for profile picture uploads. Send the image in the file form field."
};

const jsonAcceptHeader = {
  "name": "Accept",
  "value": "application/json",
  "required": false,
  "description": "Use when the caller wants an explicit JSON response."
};

const imageAcceptHeader = {
  "name": "Accept",
  "value": "image/*",
  "required": false,
  "description": "Use when requesting a profile picture image response."
};

const ifNoneMatchHeader = {
  "name": "If-None-Match",
  "value": "\"<etag>\"",
  "required": false,
  "description": "Optional cache validator for profile picture reads. A matching ETag returns 304 Not Modified."
};

const bearerAuthHeader = {
  "name": "Authorization",
  "value": "Bearer <access_token>",
  "required": true,
  "description": "Account self-service endpoints act on the authenticated user in the token or session."
};

const noAuthHeader = {
  "name": "Authorization",
  "value": "Not required",
  "required": false,
  "description": "Backup-code recovery is unauthenticated because it is used when the user cannot complete the normal MFA sign-in flow."
};

const readHeaders = [jsonAcceptHeader, bearerAuthHeader];
const writeHeaders = [jsonContentHeader, jsonAcceptHeader, bearerAuthHeader];
const noAuthJsonHeaders = [jsonContentHeader, jsonAcceptHeader, noAuthHeader];

const emptyBody = {
  "type": "None",
  "description": "This endpoint does not accept a request body.",
  "fields": [],
  "example": null
};

const sessionUuidParameter = {
  "name": "session_uuid",
  "in": "path",
  "type": "uuid",
  "required": true,
  "description": "Public session UUID returned by the account sessions list."
};

const deviceUuidParameter = {
  "name": "device_uuid",
  "in": "path",
  "type": "uuid",
  "required": true,
  "description": "Public trusted-device UUID returned by the devices list."
};

const profileUuidParameter = {
  "name": "profile_uuid",
  "in": "path",
  "type": "uuid",
  "required": true,
  "description": "Public profile UUID owned by the authenticated user."
};

const identityUuidParameter = {
  "name": "identity_uuid",
  "in": "path",
  "type": "string",
  "required": true,
  "description": "Public linked-identity UUID returned by the identities list."
};

const paginationParameters = [
  {
    "name": "page",
    "in": "query",
    "type": "integer",
    "required": false,
    "description": "Page number. Defaults to 1 when omitted or invalid."
  },
  {
    "name": "limit",
    "in": "query",
    "type": "integer",
    "required": false,
    "description": "Rows per page. Defaults to 20 and is capped at 100."
  },
  {
    "name": "sort_by",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Optional field name to sort by."
  },
  {
    "name": "sort_order",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Sort direction. Allowed values are asc and desc."
  }
];

const profileListParameters = [
  {
    "name": "first_name",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Filter profiles by first name."
  },
  {
    "name": "last_name",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Filter profiles by last name."
  },
  {
    "name": "email",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Filter profiles by profile email."
  },
  ...paginationParameters
];

const profileFields = [
  {
    "name": "first_name",
    "type": "string",
    "required": true,
    "description": "First name, 1-100 characters."
  },
  {
    "name": "middle_name",
    "type": "string",
    "required": false,
    "description": "Optional middle name, up to 100 characters."
  },
  {
    "name": "last_name",
    "type": "string",
    "required": false,
    "description": "Optional last name, up to 100 characters."
  },
  {
    "name": "display_name",
    "type": "string",
    "required": false,
    "description": "Optional display name, up to 100 characters."
  },
  {
    "name": "birthdate",
    "type": "string",
    "required": false,
    "description": "Optional birthdate in YYYY-MM-DD format."
  },
  {
    "name": "gender",
    "type": "string",
    "required": false,
    "description": "Optional gender. Allowed values are male, female, other, and prefer_not_to_say."
  },
  {
    "name": "email",
    "type": "string",
    "required": false,
    "description": "Optional profile email. Must be a valid email address when present."
  },
  {
    "name": "timezone",
    "type": "string",
    "required": false,
    "description": "Optional timezone, up to 50 characters."
  },
  {
    "name": "language",
    "type": "string",
    "required": false,
    "description": "Optional language code, up to 10 characters."
  },
  {
    "name": "profile_url",
    "type": "string",
    "required": false,
    "description": "Optional externally hosted profile image URL. Must be a valid URL."
  },
  {
    "name": "metadata",
    "type": "object",
    "required": false,
    "description": "Optional profile metadata. Use metadata.address for OIDC-style address data."
  }
];

const userSettingFields = [
  {
    "name": "timezone",
    "type": "string",
    "required": false,
    "description": "Optional timezone, up to 50 characters."
  },
  {
    "name": "preferred_language",
    "type": "string",
    "required": false,
    "description": "Optional preferred language, 2-10 characters."
  },
  {
    "name": "locale",
    "type": "string",
    "required": false,
    "description": "Optional locale, 2-10 characters."
  }
];

const accountExample = {
  "user_id": "0198b91f-b129-7ad1-a5b2-37d18ad0e2ec",
  "email": "jane.admin@example.com",
  "phone": "+15551234567",
  "email_verified": true,
  "phone_verified": false,
  "profiles": [
    {
      "profile_id": "0198b98a-df4e-78f8-a07f-2a17d057869d",
      "first_name": "Jane",
      "last_name": "Admin",
      "display_name": "Jane Admin",
      "default": true
    }
  ],
  "roles": ["support-admin"],
  "permissions": ["account:user:read:self", "account:profile:update:self"],
  "tenant": {
    "tenant_id": "018f5e1c-8a44-7c21-b22e-69a7f7f4d421",
    "name": "acme",
    "display_name": "Acme",
    "identifier": "acme"
  }
};

const sessionExample = {
  "session_id": "0198b97d-3e3b-70fe-a58d-6de0f1b6e86a",
  "ip_address": "203.0.113.24",
  "user_agent": "Mozilla/5.0",
  "last_used_at": "2026-08-15T02:18:10Z",
  "expires_at": "2026-08-15T03:18:10Z",
  "absolute_expires_at": "2026-08-16T02:18:10Z",
  "created_at": "2026-08-15T02:00:00Z"
};

const deviceExample = {
  "uuid": "0198b960-f94e-75f9-b2e8-921586fd471e",
  "device_fingerprint": "b8c0a4f82e9f",
  "device_name": "Jane's MacBook",
  "location": "Manila, PH",
  "ip_address": "203.0.113.24",
  "user_agent": "Mozilla/5.0",
  "trusted_until": "2026-09-15T02:18:10Z",
  "last_seen_at": "2026-08-15T02:18:10Z",
  "created_at": "2026-08-01T02:18:10Z",
  "current": true
};

const profileExample = {
  "profile_id": "0198b98a-df4e-78f8-a07f-2a17d057869d",
  "first_name": "Jane",
  "middle_name": null,
  "last_name": "Admin",
  "display_name": "Jane Admin",
  "birthdate": "1990-01-25",
  "gender": "prefer_not_to_say",
  "email": "jane.admin@example.com",
  "timezone": "Asia/Manila",
  "language": "en",
  "profile_url": "https://cdn.example.com/profiles/jane.png",
  "metadata": {
    "address": {
      "country": "PH"
    }
  },
  "is_default": true,
  "created_at": "2026-08-14T09:00:00Z",
  "updated_at": "2026-08-15T02:18:10Z"
};

const identityExample = {
  "identity_id": "0198b950-c097-7466-b26b-84f0f756a346",
  "provider": "oidc",
  "sub": "00u1abcd2EFGHijk3456",
  "is_default": false,
  "created_at": "2026-08-15T02:18:10Z",
  "email": "jane.admin@example.com",
  "name": "Jane Admin",
  "picture": "https://idp.example.com/avatar/jane.png"
};

const userSettingExample = {
  "user_setting_id": "0198b9a0-4bd8-72a4-b91e-58c262d9d564",
  "timezone": "Asia/Manila",
  "preferred_language": "en",
  "locale": "en-PH",
  "created_at": "2026-08-14T09:00:00Z",
  "updated_at": "2026-08-15T02:18:10Z"
};

const erasureExample = {
  "uuid": "0198b996-ccad-7ac3-9729-af67833276e5",
  "status": "pending",
  "reason": "User requested account erasure",
  "scheduled_at": "2026-08-22T02:18:10Z",
  "created_at": "2026-08-15T02:18:10Z"
};

const tokenExample = {
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ...",
  "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ...",
  "refresh_token": "mtr_refresh_9f4f5a...",
  "expires_in": 3600,
  "token_type": "Bearer",
  "issued_at": 1786760290,
  "session_id": "0198b97d-3e3b-70fe-a58d-6de0f1b6e86a"
};

const accountExportExample = {
  "user_id": "0198b91f-b129-7ad1-a5b2-37d18ad0e2ec",
  "username": "jane.admin",
  "email": "jane.admin@example.com",
  "phone": "+15551234567",
  "created_at": "2026-08-14T09:00:00Z",
  "profile": profileExample,
  "roles": ["support-admin"],
  "settings": userSettingExample
};

const success = (data, message) => ({
  "success": true,
  "data": data,
  "message": message
});

const error = (message, details) => ({
  "success": false,
  "error": message,
  ...(details === undefined ? {} : { "details": details })
});

const unauthorizedResponse = error("Unauthorized");
const forbiddenResponse = error("Forbidden");

const commonReadResponses = (okDescription, okExample, failMessage = "Failed to fetch resource") => [
  {
    "status": "200 OK",
    "description": okDescription,
    "example": okExample
  },
  {
    "status": "401 Unauthorized",
    "description": "The caller is not authenticated or the session is no longer valid.",
    "example": unauthorizedResponse
  },
  {
    "status": "403 Forbidden",
    "description": "The authenticated user does not have the required self-service permission.",
    "example": forbiddenResponse
  },
  {
    "status": "500 Internal Server Error",
    "description": "The service could not complete the operation.",
    "example": error(failMessage)
  }
];

const commonWriteResponses = (okDescription, okExample, failMessage = "Failed to save resource") => [
  {
    "status": "200 OK",
    "description": okDescription,
    "example": okExample
  },
  {
    "status": "400 Bad Request",
    "description": "The JSON body, multipart body, path UUID, or field validation is invalid.",
    "example": error("Validation failed", {
      "current_password": "cannot be blank"
    })
  },
  {
    "status": "401 Unauthorized",
    "description": "The caller is not authenticated or the session is no longer valid.",
    "example": unauthorizedResponse
  },
  {
    "status": "403 Forbidden",
    "description": "The authenticated user does not have the required self-service permission or step-up state.",
    "example": forbiddenResponse
  },
  {
    "status": "429 Too Many Requests",
    "description": "Returned by endpoints that verify current_password after too many failed password-verification attempts.",
    "example": error("Too many attempts. Please try again later.")
  },
  {
    "status": "500 Internal Server Error",
    "description": "The service could not complete the operation.",
    "example": error(failMessage)
  }
];

const readNotes = (permission) => [
  `Requires the ${permission} permission.`,
  "The endpoint acts only on the authenticated user's own account.",
  "Responses use public UUID fields and do not expose internal database integer IDs."
];

const writeNotes = (permission, stepUp = false) => [
  `Requires the ${permission} permission.${stepUp ? " Requires step-up when the tenant MFA policy or route requires it." : ""}`,
  "The endpoint acts only on the authenticated user's own account.",
  "Sensitive endpoints that verify current_password share a per-user throttle so attempts cannot be multiplied across account routes."
];

const group = {
  "slug": "account-self-service",
  "label": "Account Self-Service",
  "description": "Authenticated user-owned APIs for account details, profile management, devices, sessions, consent, recovery, settings, external identity links, and self-service erasure.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/account/",
      "summary": "Read the authenticated user's account.",
      "surface": publicIdentity,
      "details": {
        "overview": "Returns the current user's account summary, including contact verification flags, profiles, role names, effective permission names, and tenant context.",
        "notes": [
          "Requires an authenticated session. The route itself does not add a named permission gate.",
          "Use this endpoint to render signed-in user state and account navigation."
        ],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonReadResponses("Account data was returned.", success(accountExample, "Account retrieved"))
      }
    },
    {
      "method": "POST",
      "path": "/account/email/change",
      "summary": "Start an email change flow.",
      "surface": publicIdentity,
      "details": {
        "overview": "Starts a verified email-change flow by checking the current password and sending an OTP to the new email address.",
        "notes": writeNotes("account:user:update:self", true),
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Email change initiation payload.",
          "fields": [
            {
              "name": "new_email",
              "type": "string",
              "required": true,
              "description": "New email address. Must be a valid email address."
            },
            {
              "name": "current_password",
              "type": "string",
              "required": true,
              "description": "Current account password used as proof of knowledge."
            }
          ],
          "example": {
            "new_email": "jane.new@example.com",
            "current_password": "current-account-password"
          }
        },
        "responses": commonWriteResponses("The verification code was sent.", success(null, "Verification code sent to new email address"), "Failed to initiate email change")
      }
    },
    {
      "method": "POST",
      "path": "/account/email/verify",
      "summary": "Verify and complete an email change.",
      "surface": publicIdentity,
      "details": {
        "overview": "Completes a pending email change by validating the six-digit OTP sent to the new address.",
        "notes": writeNotes("account:user:update:self", true),
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Email change verification payload.",
          "fields": [
            {
              "name": "otp",
              "type": "string",
              "required": true,
              "description": "Six-character email verification code."
            }
          ],
          "example": {
            "otp": "123456"
          }
        },
        "responses": commonWriteResponses("The email address was updated.", success(null, "Email address updated successfully"), "Failed to verify email change")
      }
    },
    {
      "method": "POST",
      "path": "/account/phone/send-verification",
      "summary": "Send a phone verification code.",
      "surface": publicIdentity,
      "details": {
        "overview": "Sends an SMS OTP so the authenticated user can verify ownership of a phone number.",
        "notes": writeNotes("account:user:update:self", false),
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Phone verification initiation payload.",
          "fields": [
            {
              "name": "phone",
              "type": "string",
              "required": true,
              "description": "Phone number to verify. Must satisfy the service phone-number validator."
            }
          ],
          "example": {
            "phone": "+15551234567"
          }
        },
        "responses": commonWriteResponses("The phone verification code was sent.", success(null, "Verification code sent to phone number"), "Failed to send phone verification code")
      }
    },
    {
      "method": "POST",
      "path": "/account/phone/verify",
      "summary": "Verify a phone number.",
      "surface": publicIdentity,
      "details": {
        "overview": "Validates the SMS code and marks the authenticated user's phone number as verified.",
        "notes": writeNotes("account:user:update:self", false),
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Phone verification payload.",
          "fields": [
            {
              "name": "phone",
              "type": "string",
              "required": true,
              "description": "Phone number being verified."
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
            "code": "123456"
          }
        },
        "responses": commonWriteResponses("The phone number was verified.", success(null, "Phone number verified successfully"), "Failed to verify phone number")
      }
    },
    {
      "method": "PUT",
      "path": "/account/username",
      "summary": "Change the authenticated user's username.",
      "surface": publicIdentity,
      "details": {
        "overview": "Changes the signed-in user's username after verifying the current password. Usernames must be 3-50 characters and may contain letters, digits, dot, underscore, and hyphen.",
        "notes": writeNotes("account:user:update:self", true),
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Username change payload.",
          "fields": [
            {
              "name": "new_username",
              "type": "string",
              "required": true,
              "description": "New username. It cannot contain @ and must use only letters, digits, dot, underscore, or hyphen."
            },
            {
              "name": "current_password",
              "type": "string",
              "required": true,
              "description": "Current account password used as proof of knowledge."
            }
          ],
          "example": {
            "new_username": "jane.admin",
            "current_password": "current-account-password"
          }
        },
        "responses": commonWriteResponses("The username was updated.", success(null, "Username updated successfully"), "Failed to change username")
      }
    },
    {
      "method": "PUT",
      "path": "/account/password",
      "summary": "Change the authenticated user's password.",
      "surface": publicIdentity,
      "details": {
        "overview": "Rotates the signed-in user's own password. The tenant password policy validates the new password, and other sessions are revoked after a successful change.",
        "notes": [
          ...writeNotes("account:change-password:self", true),
          "The current session is spared when the signed sid claim can identify it. If it cannot, reauthentication_required is true."
        ],
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Password change payload.",
          "fields": [
            {
              "name": "current_password",
              "type": "string",
              "required": true,
              "description": "Current account password."
            },
            {
              "name": "new_password",
              "type": "string",
              "required": true,
              "description": "New password. Tenant password policy is the source of truth for length, complexity, breach checks, and reuse checks."
            }
          ],
          "example": {
            "current_password": "current-account-password",
            "new_password": "new-policy-compliant-password"
          }
        },
        "responses": commonWriteResponses(
          "The password was changed.",
          success({
            "other_sessions_revoked": true,
            "reauthentication_required": false
          }, "Password changed successfully"),
          "Failed to change password"
        )
      }
    },
    {
      "method": "DELETE",
      "path": "/account/",
      "summary": "Delete the authenticated user's account.",
      "surface": publicIdentity,
      "details": {
        "overview": "Permanently deletes the authenticated user's account after validating the current password.",
        "notes": writeNotes("account:user:delete:self", true),
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Account deletion confirmation payload.",
          "fields": [
            {
              "name": "current_password",
              "type": "string",
              "required": true,
              "description": "Current account password used to confirm deletion."
            }
          ],
          "example": {
            "current_password": "current-account-password"
          }
        },
        "responses": commonWriteResponses("The account was deleted.", success(null, "Account deleted successfully"), "Failed to delete account")
      }
    },
    {
      "method": "GET",
      "path": "/account/export",
      "summary": "Export the authenticated user's account data.",
      "surface": publicIdentity,
      "details": {
        "overview": "Exports account data for the signed-in user for data portability workflows.",
        "notes": readNotes("account:user:read:self"),
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonReadResponses("Account export data was returned.", success(accountExportExample, "Account data exported successfully"), "Failed to export account data")
      }
    },
    {
      "method": "GET",
      "path": "/account/sessions",
      "summary": "List the authenticated user's sessions.",
      "surface": publicIdentity,
      "details": {
        "overview": "Lists active sessions for the signed-in user.",
        "notes": readNotes("account:session:read:self"),
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonReadResponses("Sessions were returned.", success([sessionExample], "Sessions retrieved successfully"), "Failed to list sessions")
      }
    },
    {
      "method": "DELETE",
      "path": "/account/sessions",
      "summary": "Revoke all sessions for the authenticated user.",
      "surface": publicIdentity,
      "details": {
        "overview": "Revokes every active session for the signed-in user, forcing sign-out everywhere.",
        "notes": writeNotes("account:session:terminate:self", true),
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonWriteResponses("All sessions were revoked.", success(null, "All sessions revoked successfully"), "Failed to revoke all sessions")
      }
    },
    {
      "method": "DELETE",
      "path": "/account/sessions/others",
      "summary": "Revoke all sessions except the current session.",
      "surface": publicIdentity,
      "details": {
        "overview": "Revokes every session for the signed-in user except the current session identified by the signed sid claim.",
        "notes": writeNotes("account:session:terminate:self", true),
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonWriteResponses("Other sessions were revoked.", success(null, "Other sessions revoked successfully"), "Failed to revoke other sessions")
      }
    },
    {
      "method": "DELETE",
      "path": "/account/sessions/{session_uuid}",
      "summary": "Revoke one session owned by the authenticated user.",
      "surface": publicIdentity,
      "details": {
        "overview": "Revokes one session owned by the signed-in user.",
        "notes": writeNotes("account:session:terminate:self", true),
        "parameters": [sessionUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonWriteResponses("The session was revoked.", success(null, "Session revoked successfully"), "Failed to revoke session")
      }
    },
    {
      "method": "POST",
      "path": "/account/consent",
      "summary": "Record consent for the authenticated user.",
      "surface": publicIdentity,
      "details": {
        "overview": "Records that the signed-in user accepted a policy version. This appends a consent record rather than mutating a single flag.",
        "notes": [
          ...writeNotes("account:user:update:self", false),
          "Allowed consent_type values are terms_of_service, privacy_policy, and data_processing."
        ],
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Consent recording payload.",
          "fields": [
            {
              "name": "consent_type",
              "type": "string",
              "required": true,
              "description": "Consent type. Allowed values are terms_of_service, privacy_policy, and data_processing."
            },
            {
              "name": "policy_version",
              "type": "string",
              "required": true,
              "description": "Policy version accepted by the user."
            }
          ],
          "example": {
            "consent_type": "privacy_policy",
            "policy_version": "2026-08"
          }
        },
        "responses": commonWriteResponses("Consent was recorded.", success({ "status": "recorded" }, "Consent recorded successfully"), "Failed to record consent")
      }
    },
    {
      "method": "GET",
      "path": "/me/devices",
      "summary": "List the authenticated user's trusted devices.",
      "surface": publicIdentity,
      "details": {
        "overview": "Returns trusted devices for the signed-in user. The current browser is marked with current=true when its trusted-device cookie matches a stored device.",
        "notes": readNotes("account:user:read:self"),
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonReadResponses("Trusted devices were returned.", success([deviceExample], "Devices retrieved successfully"), "Failed to retrieve devices")
      }
    },
    {
      "method": "DELETE",
      "path": "/me/devices/{device_uuid}",
      "summary": "Remove one trusted device from the authenticated user.",
      "surface": publicIdentity,
      "details": {
        "overview": "Removes a trusted device owned by the signed-in user. If the removed device is the current browser, trusted-device cookies are cleared too.",
        "notes": writeNotes("account:user:update:self", false),
        "parameters": [deviceUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonWriteResponses("The trusted device was removed.", success(null, "Device removed successfully"), "Failed to delete device")
      }
    },
    {
      "method": "POST",
      "path": "/me/erasure-request",
      "summary": "Request erasure of the authenticated user's data.",
      "surface": publicIdentity,
      "details": {
        "overview": "Creates a self-service data erasure request for the signed-in user. Empty request bodies are allowed and create a default request.",
        "notes": [
          ...writeNotes("account:user:delete:self", true),
          "reason is optional and is stored with the erasure request when provided."
        ],
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Optional erasure request metadata.",
          "fields": [
            {
              "name": "reason",
              "type": "string",
              "required": false,
              "description": "Optional reason for the erasure request."
            }
          ],
          "example": {
            "reason": "User requested account erasure"
          }
        },
        "responses": commonWriteResponses("The erasure request was created.", success(erasureExample, "Data erasure request created successfully"), "Failed to create erasure request")
      }
    },
    {
      "method": "GET",
      "path": "/profile/",
      "summary": "Read the authenticated user's default profile.",
      "surface": publicIdentity,
      "details": {
        "overview": "Returns the default profile for the signed-in user.",
        "notes": readNotes("account:profile:read:self"),
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonReadResponses("The default profile was returned.", success(profileExample, "Profile retrieved successfully"), "Profile not found")
      }
    },
    {
      "method": "POST",
      "path": "/profile/",
      "summary": "Create or update the default profile.",
      "surface": publicIdentity,
      "details": {
        "overview": "Creates or updates the signed-in user's default profile.",
        "notes": writeNotes("account:profile:update:self", false),
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Default profile payload.",
          "fields": profileFields,
          "example": {
            "first_name": "Jane",
            "last_name": "Admin",
            "display_name": "Jane Admin",
            "birthdate": "1990-01-25",
            "gender": "prefer_not_to_say",
            "email": "jane.admin@example.com",
            "timezone": "Asia/Manila",
            "language": "en",
            "metadata": {}
          }
        },
        "responses": commonWriteResponses("The profile was saved.", success(profileExample, "Profile saved successfully"), "Save profile failed")
      }
    },
    {
      "method": "PUT",
      "path": "/profile/",
      "summary": "Update the default profile.",
      "surface": publicIdentity,
      "details": {
        "overview": "Updates the signed-in user's default profile. Behavior matches POST /profile/.",
        "notes": writeNotes("account:profile:update:self", false),
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Default profile payload.",
          "fields": profileFields,
          "example": {
            "first_name": "Jane",
            "last_name": "Admin",
            "display_name": "Jane Admin",
            "birthdate": "1990-01-25",
            "gender": "prefer_not_to_say",
            "email": "jane.admin@example.com",
            "timezone": "Asia/Manila",
            "language": "en",
            "metadata": {}
          }
        },
        "responses": commonWriteResponses("The profile was saved.", success(profileExample, "Profile saved successfully"), "Save profile failed")
      }
    },
    {
      "method": "DELETE",
      "path": "/profile/",
      "summary": "Delete the default profile.",
      "surface": publicIdentity,
      "details": {
        "overview": "Deletes the signed-in user's default profile and returns the deleted profile projection.",
        "notes": writeNotes("account:profile:delete:self", false),
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonWriteResponses("The profile was deleted.", success(profileExample, "Profile deleted successfully"), "Delete profile failed")
      }
    },
    {
      "method": "GET",
      "path": "/profiles/",
      "summary": "List all profiles for the authenticated user.",
      "surface": publicIdentity,
      "details": {
        "overview": "Returns all profiles owned by the signed-in user. Use this when the identity app supports multiple profiles.",
        "notes": readNotes("account:profile:read:self"),
        "parameters": profileListParameters,
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonReadResponses("Profiles were returned.", success([profileExample], "Profiles fetched successfully"), "Failed to fetch profiles")
      }
    },
    {
      "method": "POST",
      "path": "/profiles/",
      "summary": "Create a profile for the authenticated user.",
      "surface": publicIdentity,
      "details": {
        "overview": "Creates a new profile for the signed-in user and generates a profile UUID.",
        "notes": writeNotes("account:profile:update:self", false),
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Profile creation payload.",
          "fields": profileFields,
          "example": {
            "first_name": "Jane",
            "last_name": "Admin",
            "display_name": "Jane Admin",
            "birthdate": "1990-01-25",
            "gender": "prefer_not_to_say",
            "email": "jane.admin@example.com",
            "timezone": "Asia/Manila",
            "language": "en",
            "metadata": {}
          }
        },
        "responses": commonWriteResponses("The profile was created.", success(profileExample, "Profile created successfully"), "Create profile failed")
      }
    },
    {
      "method": "GET",
      "path": "/profiles/{profile_uuid}",
      "summary": "Read one profile owned by the authenticated user.",
      "surface": publicIdentity,
      "details": {
        "overview": "Returns one profile after verifying it belongs to the signed-in user.",
        "notes": readNotes("account:profile:read:self"),
        "parameters": [profileUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonReadResponses("The profile was returned.", success(profileExample, "Profile retrieved successfully"), "Failed to fetch profile")
      }
    },
    {
      "method": "PUT",
      "path": "/profiles/{profile_uuid}",
      "summary": "Update one profile owned by the authenticated user.",
      "surface": publicIdentity,
      "details": {
        "overview": "Updates one profile after verifying ownership.",
        "notes": writeNotes("account:profile:update:self", false),
        "parameters": [profileUuidParameter],
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Profile update payload.",
          "fields": profileFields,
          "example": {
            "first_name": "Jane",
            "last_name": "Admin",
            "display_name": "Jane Admin",
            "birthdate": "1990-01-25",
            "gender": "prefer_not_to_say",
            "email": "jane.admin@example.com",
            "timezone": "Asia/Manila",
            "language": "en",
            "metadata": {}
          }
        },
        "responses": commonWriteResponses("The profile was updated.", success(profileExample, "Profile updated successfully"), "Update profile failed")
      }
    },
    {
      "method": "PUT",
      "path": "/profiles/{profile_uuid}/set-default",
      "summary": "Set a profile as the default profile.",
      "surface": publicIdentity,
      "details": {
        "overview": "Marks one owned profile as the signed-in user's default profile.",
        "notes": writeNotes("account:profile:update:self", false),
        "parameters": [profileUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonWriteResponses("The default profile was updated.", success(profileExample, "Default profile updated"), "Set default profile failed")
      }
    },
    {
      "method": "DELETE",
      "path": "/profiles/{profile_uuid}",
      "summary": "Delete one profile owned by the authenticated user.",
      "surface": publicIdentity,
      "details": {
        "overview": "Deletes one owned profile by public profile UUID and returns the deleted profile projection.",
        "notes": writeNotes("account:profile:delete:self", false),
        "parameters": [profileUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonWriteResponses("The profile was deleted.", success(profileExample, "Profile deleted successfully"), "Failed to delete profile")
      }
    },
    {
      "method": "POST",
      "path": "/profiles/{profile_uuid}/picture",
      "summary": "Upload a profile picture.",
      "surface": publicIdentity,
      "details": {
        "overview": "Uploads and stores a raster profile picture for an owned profile. The service decodes the bytes to verify the real image type instead of trusting filename or multipart content type.",
        "notes": [
          ...writeNotes("account:profile:update:self", false),
          "Use multipart field name file.",
          "Allowed formats are PNG, JPEG, WebP, and GIF. SVG is not accepted.",
          "Maximum upload size is 2 MiB and maximum declared dimensions are 8192 by 8192 pixels."
        ],
        "parameters": [profileUuidParameter],
        "headers": [multipartContentHeader, jsonAcceptHeader, bearerAuthHeader],
        "requestBody": {
          "type": "multipart/form-data",
          "description": "Profile picture upload form.",
          "fields": [
            {
              "name": "file",
              "type": "file",
              "required": true,
              "description": "PNG, JPEG, WebP, or GIF image file up to 2 MiB."
            }
          ],
          "example": {
            "file": "<binary image file>"
          }
        },
        "responses": commonWriteResponses(
          "The profile picture was updated.",
          success({ "profile_url": "/api/v1/profiles/0198b98a-df4e-78f8-a07f-2a17d057869d/picture" }, "Profile picture updated"),
          "Failed to upload profile picture"
        )
      }
    },
    {
      "method": "DELETE",
      "path": "/profiles/{profile_uuid}/picture",
      "summary": "Delete a profile picture.",
      "surface": publicIdentity,
      "details": {
        "overview": "Removes the stored profile picture from an owned profile.",
        "notes": writeNotes("account:profile:update:self", false),
        "parameters": [profileUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonWriteResponses("The profile picture was removed.", success(null, "Profile picture removed"), "Failed to remove profile picture")
      }
    },
    {
      "method": "GET",
      "path": "/profiles/{profile_uuid}/picture",
      "summary": "Read a profile picture.",
      "surface": publicIdentity,
      "details": {
        "overview": "Serves a stored profile picture. The caller must own the profile or hold user:read, which lets admin surfaces render other users' avatars.",
        "notes": [
          "Requires account:profile:read:self on this route. A caller with user:read may also view another user's profile picture.",
          "Successful responses are binary image bytes, not the shared JSON envelope.",
          "The response includes private cache headers, ETag, X-Content-Type-Options: nosniff, and a restrictive Content-Security-Policy."
        ],
        "parameters": [profileUuidParameter],
        "headers": [imageAcceptHeader, ifNoneMatchHeader, bearerAuthHeader],
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The profile picture bytes were returned.",
            "example": "<binary image/png, image/jpeg, image/webp, or image/gif response>"
          },
          {
            "status": "304 Not Modified",
            "description": "The If-None-Match header matched the stored profile picture ETag.",
            "example": null
          },
          {
            "status": "400 Bad Request",
            "description": "The profile_uuid path parameter is invalid.",
            "example": error("Invalid profile UUID")
          },
          {
            "status": "401 Unauthorized",
            "description": "The caller is not authenticated.",
            "example": error("No valid authentication found")
          },
          {
            "status": "404 Not Found",
            "description": "The profile picture does not exist or the caller is not allowed to know the profile exists.",
            "example": error("Profile picture not found")
          },
          {
            "status": "500 Internal Server Error",
            "description": "The service could not load the profile picture.",
            "example": error("Failed to load profile picture")
          }
        ]
      }
    },
    {
      "method": "POST",
      "path": "/recovery/backup-code",
      "summary": "Recover an account by verifying a backup code.",
      "surface": publicIdentity,
      "details": {
        "overview": "Issues tokens after validating the user's email, password, and backup code. The backup code is a recovery second factor, not a standalone credential.",
        "notes": [
          "This endpoint is unauthenticated by design.",
          "The password field is required so backup-code recovery still has a primary credential plus a recovery second factor.",
          "client_id and provider_id scope the issued tokens to the intended OAuth client and provider context."
        ],
        "headers": noAuthJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Backup-code recovery payload.",
          "fields": [
            {
              "name": "email",
              "type": "string",
              "required": true,
              "description": "Account email address."
            },
            {
              "name": "password",
              "type": "string",
              "required": true,
              "description": "Account password."
            },
            {
              "name": "code",
              "type": "string",
              "required": true,
              "description": "Unused backup code."
            },
            {
              "name": "client_id",
              "type": "string",
              "required": true,
              "description": "OAuth client identifier that should receive the session."
            },
            {
              "name": "provider_id",
              "type": "string",
              "required": true,
              "description": "Provider identifier used by the recovery flow."
            }
          ],
          "example": {
            "email": "jane.admin@example.com",
            "password": "current-account-password",
            "code": "ABCD-1234",
            "client_id": "acme-identity",
            "provider_id": "maintainerd"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "Backup-code recovery succeeded and tokens were issued.",
            "example": success(tokenExample, "Account recovered successfully")
          },
          {
            "status": "400 Bad Request",
            "description": "The body is invalid or a required field is missing.",
            "example": error("Validation failed", {
              "email": "cannot be blank"
            })
          },
          {
            "status": "401 Unauthorized",
            "description": "The password or backup code is invalid.",
            "example": error("Backup code verification failed")
          },
          {
            "status": "500 Internal Server Error",
            "description": "The service could not complete recovery.",
            "example": error("Backup code verification failed")
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/account/identities/",
      "summary": "List external identities linked to the authenticated user.",
      "surface": publicIdentity,
      "details": {
        "overview": "Returns external or federated provider identities linked to the signed-in user's account.",
        "notes": readNotes("account:identity:read:self"),
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonReadResponses("Linked identities were returned.", success([identityExample], ""), "Failed to retrieve identities")
      }
    },
    {
      "method": "POST",
      "path": "/account/identities/link",
      "summary": "Link an external identity to the authenticated user.",
      "surface": publicIdentity,
      "details": {
        "overview": "Links an external identity to the signed-in user by validating an upstream token from a configured provider.",
        "notes": [
          ...writeNotes("account:identity:link:self", false),
          "For normal browser flows, prefer /account/identities/link/start and /account/identities/link/callback because users should not paste raw provider tokens."
        ],
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Direct identity link payload.",
          "fields": [
            {
              "name": "provider_identifier",
              "type": "string",
              "required": true,
              "description": "Identifier of the configured identity provider."
            },
            {
              "name": "external_token",
              "type": "string",
              "required": true,
              "description": "Raw upstream provider token to validate and link."
            }
          ],
          "example": {
            "provider_identifier": "acme-sso",
            "external_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ..."
          }
        },
        "responses": commonWriteResponses("The identity was linked.", success(identityExample, "Identity linked successfully"), "Failed to link identity")
      }
    },
    {
      "method": "POST",
      "path": "/account/identities/link/start",
      "summary": "Start an OAuth identity-link redirect.",
      "surface": publicIdentity,
      "details": {
        "overview": "Creates a short-lived identity-link request and returns the upstream authorization URL that the frontend should redirect the user to.",
        "notes": [
          ...writeNotes("account:identity:link:self", false),
          "redirect_uri is validated against the authenticated client's registered redirect URIs when client context is available.",
          "This endpoint does not issue a session; it only starts account linking for the current session."
        ],
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "OAuth identity-link start payload.",
          "fields": [
            {
              "name": "provider_identifier",
              "type": "string",
              "required": true,
              "description": "Identifier of the configured provider to link."
            },
            {
              "name": "redirect_uri",
              "type": "string",
              "required": true,
              "description": "Client callback URL that will receive the upstream authorization code."
            }
          ],
          "example": {
            "provider_identifier": "acme-sso",
            "redirect_uri": "https://identity.example.com/account/identities/callback"
          }
        },
        "responses": commonWriteResponses(
          "The link flow was started.",
          success({
            "authorization_url": "https://idp.example.com/oauth2/authorize?client_id=...",
            "state": "link_0198b9..."
          }, ""),
          "Failed to start identity link"
        )
      }
    },
    {
      "method": "POST",
      "path": "/account/identities/link/callback",
      "summary": "Complete an OAuth identity-link callback.",
      "surface": publicIdentity,
      "details": {
        "overview": "Completes identity linking after the upstream provider redirects back with an authorization code and state.",
        "notes": writeNotes("account:identity:link:self", false),
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "OAuth identity-link callback payload.",
          "fields": [
            {
              "name": "state",
              "type": "string",
              "required": true,
              "description": "State value returned from the start endpoint and round-tripped through the provider."
            },
            {
              "name": "code",
              "type": "string",
              "required": true,
              "description": "Authorization code returned by the upstream provider."
            },
            {
              "name": "redirect_uri",
              "type": "string",
              "required": true,
              "description": "The same redirect URI used when starting the link flow."
            }
          ],
          "example": {
            "state": "link_0198b9...",
            "code": "provider-auth-code",
            "redirect_uri": "https://identity.example.com/account/identities/callback"
          }
        },
        "responses": commonWriteResponses("The identity was linked.", success(identityExample, "Identity linked successfully"), "Failed to link identity")
      }
    },
    {
      "method": "DELETE",
      "path": "/account/identities/{identity_uuid}",
      "summary": "Unlink an external identity from the authenticated user.",
      "surface": publicIdentity,
      "details": {
        "overview": "Unlinks one external identity from the signed-in user's account.",
        "notes": writeNotes("account:identity:unlink:self", false),
        "parameters": [identityUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonWriteResponses("The identity was unlinked.", success(null, "Identity unlinked successfully"), "Failed to unlink identity")
      }
    },
    {
      "method": "POST",
      "path": "/user-settings/",
      "summary": "Create or update user settings.",
      "surface": publicIdentity,
      "details": {
        "overview": "Creates or updates the signed-in user's preference settings.",
        "notes": writeNotes("settings:update:self", false),
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "User settings payload.",
          "fields": userSettingFields,
          "example": {
            "timezone": "Asia/Manila",
            "preferred_language": "en",
            "locale": "en-PH"
          }
        },
        "responses": commonWriteResponses("User settings were saved.", success(userSettingExample, "User setting saved successfully"), "Save user setting failed")
      }
    },
    {
      "method": "GET",
      "path": "/user-settings/",
      "summary": "Read user settings.",
      "surface": publicIdentity,
      "details": {
        "overview": "Returns the signed-in user's preference settings.",
        "notes": readNotes("settings:read:self"),
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonReadResponses("User settings were returned.", success(userSettingExample, "User setting retrieved successfully"), "User setting not found")
      }
    },
    {
      "method": "DELETE",
      "path": "/user-settings/",
      "summary": "Delete user settings.",
      "surface": publicIdentity,
      "details": {
        "overview": "Deletes the signed-in user's preference settings and returns the deleted settings projection.",
        "notes": writeNotes("settings:update:self", false),
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonWriteResponses("User settings were deleted.", success(userSettingExample, "User setting deleted successfully"), "Delete user setting failed")
      }
    }
  ]
};

export default group;
