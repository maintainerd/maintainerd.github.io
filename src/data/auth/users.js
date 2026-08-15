// Endpoint details for this Auth API section.

const management = "Internal management API";

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

const bearerAuthHeader = {
  "name": "Authorization",
  "value": "Bearer <access_token>",
  "required": true,
  "description": "User administration endpoints require an authenticated management token or session for the current tenant."
};

const readHeaders = [jsonAcceptHeader, bearerAuthHeader];
const writeHeaders = [jsonContentHeader, jsonAcceptHeader, bearerAuthHeader];

const emptyBody = {
  "type": "None",
  "description": "This endpoint does not accept a request body.",
  "fields": [],
  "example": null
};

const userUuidParameter = {
  "name": "user_uuid",
  "in": "path",
  "type": "uuid",
  "required": true,
  "description": "Public user UUID from a user response. This is not the internal database ID."
};

const roleUuidParameter = {
  "name": "role_uuid",
  "in": "path",
  "type": "uuid",
  "required": true,
  "description": "Public role UUID to remove from the target user."
};

const identityUuidParameter = {
  "name": "identity_uuid",
  "in": "path",
  "type": "uuid",
  "required": true,
  "description": "Public user-identity UUID returned by the identities list."
};

const deviceUuidParameter = {
  "name": "device_uuid",
  "in": "path",
  "type": "uuid",
  "required": true,
  "description": "Public trusted-device UUID returned by the devices list."
};

const sessionUuidParameter = {
  "name": "session_uuid",
  "in": "path",
  "type": "uuid",
  "required": true,
  "description": "Public session UUID returned by the sessions list."
};

const profileUuidParameter = {
  "name": "profile_uuid",
  "in": "path",
  "type": "uuid",
  "required": true,
  "description": "Public profile UUID returned by the profiles list."
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
    "description": "Optional field name to sort by. Keep values to 50 characters or less."
  },
  {
    "name": "sort_order",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Sort direction. Allowed values are asc and desc."
  }
];

const userListParameters = [
  {
    "name": "search",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "General search term for user list pages."
  },
  {
    "name": "username",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Filter by username."
  },
  {
    "name": "email",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Filter by email address."
  },
  {
    "name": "phone",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Filter by phone number."
  },
  {
    "name": "fullname",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Filter by full name."
  },
  {
    "name": "status",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Comma-separated statuses. Allowed values are active, inactive, pending, and suspended."
  },
  {
    "name": "role_id",
    "in": "query",
    "type": "uuid",
    "required": false,
    "description": "Filter users assigned to a role UUID."
  },
  {
    "name": "client_id",
    "in": "query",
    "type": "uuid",
    "required": false,
    "description": "Filter users related to a client UUID when the backend service supports that relation."
  },
  ...paginationParameters
];

const membershipCandidateParameters = [
  {
    "name": "search",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Search system-tenant users by the candidate fields used by the picker."
  },
  ...paginationParameters
];

const roleListParameters = [
  userUuidParameter,
  {
    "name": "name",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Filter roles by role name."
  },
  {
    "name": "description",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Filter roles by description."
  },
  {
    "name": "status",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Filter roles by status."
  },
  ...paginationParameters
];

const identityListParameters = [
  userUuidParameter,
  {
    "name": "provider",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Filter linked identities by provider value."
  },
  ...paginationParameters
];

const profileListParameters = [
  userUuidParameter,
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

const userFields = [
  {
    "name": "username",
    "type": "string",
    "required": true,
    "description": "Login username. Must be 3-50 characters."
  },
  {
    "name": "email",
    "type": "string",
    "required": false,
    "description": "Optional email address. When present and non-empty, it must be a valid email address."
  },
  {
    "name": "phone",
    "type": "string",
    "required": false,
    "description": "Optional phone number. When present and non-empty, it must be a valid phone number."
  },
  {
    "name": "status",
    "type": "string",
    "required": true,
    "description": "User lifecycle status. Allowed values are active, inactive, pending, and suspended."
  },
  {
    "name": "metadata",
    "type": "object",
    "required": false,
    "description": "Optional tenant-defined metadata stored with the user."
  }
];

const profileFields = [
  {
    "name": "first_name",
    "type": "string",
    "required": true,
    "description": "Profile first name. Must be 1-100 characters."
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
    "description": "Optional timezone string, up to 50 characters."
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
    "description": "Optional profile image URL. Must be a valid URL and at most 1000 characters."
  },
  {
    "name": "metadata",
    "type": "object",
    "required": false,
    "description": "Optional profile metadata. Use metadata.address for OIDC address-style profile claims."
  }
];

const userExample = {
  "user_id": "0198b91f-b129-7ad1-a5b2-37d18ad0e2ec",
  "username": "jane.admin",
  "fullname": "Jane Admin",
  "email": "jane.admin@example.com",
  "phone": "+15551234567",
  "is_email_verified": true,
  "is_phone_verified": false,
  "phone_verified_at": null,
  "status": "active",
  "metadata": {
    "department": "operations"
  },
  "last_login_at": "2026-08-15T02:18:10Z",
  "login_count": 42,
  "email_verified_at": "2026-08-14T09:30:00Z",
  "external_id": "hr-1042",
  "created_at": "2026-08-14T09:00:00Z",
  "updated_at": "2026-08-15T02:18:10Z"
};

const roleExample = {
  "role_id": "0198b930-6092-72a9-a9a2-5fda2a27fda1",
  "name": "support-admin",
  "description": "Support administrator",
  "is_default": false,
  "is_system": false,
  "status": "active",
  "created_at": "2026-08-14T09:00:00Z",
  "updated_at": "2026-08-14T09:00:00Z"
};

const identityExample = {
  "user_identity_id": "0198b950-c097-7466-b26b-84f0f756a346",
  "provider": "oidc",
  "sub": "00u1abcd2EFGHijk3456",
  "metadata": {
    "issuer": "https://idp.example.com"
  },
  "identity_provider_id": "0198b949-0153-7a0c-a496-3f1f43a8ab2d",
  "identity_provider_name": "Acme SSO",
  "created_at": "2026-08-15T02:18:10Z",
  "updated_at": "2026-08-15T02:18:10Z"
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
  "created_at": "2026-08-01T02:18:10Z"
};

const consentExample = {
  "uuid": "0198b972-0a90-7700-b93c-470aa504a5da",
  "consent_type": "privacy_policy",
  "policy_version": "2026-08",
  "accepted": true,
  "ip_address": "203.0.113.24",
  "user_agent": "Mozilla/5.0",
  "created_at": "2026-08-15T02:18:10Z"
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

const erasureExample = {
  "uuid": "0198b996-ccad-7ac3-9729-af67833276e5",
  "status": "pending",
  "reason": "User requested account erasure",
  "scheduled_at": "2026-08-22T02:18:10Z",
  "created_at": "2026-08-15T02:18:10Z"
};

const paginated = (rows) => ({
  "rows": rows,
  "total": rows.length,
  "page": 1,
  "limit": 20,
  "total_pages": 1
});

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

const unauthorizedResponse = error("Tenant not found in context");
const forbiddenResponse = error("Forbidden");
const invalidUserUuidResponse = error("Invalid user UUID");
const userNotFoundResponse = error("User not found");

const commonReadResponses = (okDescription, okExample, failMessage = "Failed to fetch user") => [
  {
    "status": "200 OK",
    "description": okDescription,
    "example": okExample
  },
  {
    "status": "400 Bad Request",
    "description": "A path parameter or query parameter is invalid.",
    "example": invalidUserUuidResponse
  },
  {
    "status": "401 Unauthorized",
    "description": "The request is authenticated incorrectly or no tenant context was resolved for the session.",
    "example": unauthorizedResponse
  },
  {
    "status": "403 Forbidden",
    "description": "The caller is authenticated but does not have the required permission.",
    "example": forbiddenResponse
  },
  {
    "status": "404 Not Found",
    "description": "The target user or target child resource was not found in the authenticated tenant.",
    "example": userNotFoundResponse
  },
  {
    "status": "500 Internal Server Error",
    "description": "The service could not complete the read operation.",
    "example": error(failMessage)
  }
];

const commonWriteResponses = (okStatus, okDescription, okExample, failMessage = "Failed to update user") => [
  {
    "status": okStatus,
    "description": okDescription,
    "example": okExample
  },
  {
    "status": "400 Bad Request",
    "description": "The JSON body is invalid, a path UUID is invalid, or field validation failed.",
    "example": error("Validation failed", {
      "status": "Status must be 'active', 'inactive', 'pending', or 'suspended'"
    })
  },
  {
    "status": "401 Unauthorized",
    "description": "The request is authenticated incorrectly or no tenant context was resolved for the session.",
    "example": unauthorizedResponse
  },
  {
    "status": "403 Forbidden",
    "description": "The caller is authenticated but does not have the required permission or step-up state.",
    "example": forbiddenResponse
  },
  {
    "status": "404 Not Found",
    "description": "The target user or target child resource was not found in the authenticated tenant.",
    "example": userNotFoundResponse
  },
  {
    "status": "500 Internal Server Error",
    "description": "The service could not complete the write operation.",
    "example": error(failMessage)
  }
];

const readNotes = (permission) => [
  `Requires the ${permission} permission.`,
  "The operation is scoped to the authenticated tenant context.",
  "The response uses public UUID fields only and does not expose internal database integer IDs."
];

const writeNotes = (permission, stepUp = false) => [
  `Requires the ${permission} permission.${stepUp ? " Requires a step-up authenticated session." : ""}`,
  "The operation is scoped to the authenticated tenant context.",
  "The target user must belong to the authenticated tenant, otherwise the service returns not found."
];

const group = {
  "slug": "users",
  "label": "Users",
  "description": "Administrative user APIs for account lifecycle, status, verification, roles, MFA visibility, identities, devices, sessions, consents, profiles, lockout remediation, and erasure requests.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/users/",
      "summary": "List users with pagination and filtering.",
      "surface": management,
      "details": {
        "overview": "Returns users in the authenticated tenant. Use this for user management tables, search, role-filtered views, and tenant-scoped administration.",
        "notes": [
          ...readNotes("user:read"),
          "Supported status values are active, inactive, pending, and suspended.",
          "Pagination defaults to page=1 and limit=20. The maximum accepted limit is 100."
        ],
        "parameters": userListParameters,
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "Users were returned successfully.",
            "example": success(paginated([userExample]), "Users fetched successfully")
          },
          {
            "status": "400 Bad Request",
            "description": "A query parameter failed validation, such as an invalid status, role_id, client_id, or sort order.",
            "example": error("Validation failed", {
              "role_id": "Role ID must be a valid UUID"
            })
          },
          {
            "status": "401 Unauthorized",
            "description": "The request is authenticated incorrectly or no tenant context was resolved for the session.",
            "example": unauthorizedResponse
          },
          {
            "status": "403 Forbidden",
            "description": "The caller is authenticated but does not have user:read.",
            "example": forbiddenResponse
          },
          {
            "status": "500 Internal Server Error",
            "description": "The service could not load users.",
            "example": error("Failed to fetch users")
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/users/membership-candidates",
      "summary": "List system-tenant users that can be added as tenant members.",
      "surface": management,
      "details": {
        "overview": "Returns active system-tenant users that can be selected when adding a member to a regular tenant. The system tenant is resolved server-side; callers cannot point this endpoint at arbitrary tenants.",
        "notes": [
          "Requires the tenant:member:create permission.",
          "The response is intentionally smaller than the full user projection because the candidates come from the system tenant user pool.",
          "Use this endpoint to power the Add Member picker before calling the tenant member creation API."
        ],
        "parameters": membershipCandidateParameters,
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonReadResponses(
          "Membership candidates were returned successfully.",
          success(paginated([
            {
              "user_id": "0198b920-5179-7887-9482-18991953a958",
              "username": "alex.owner",
              "email": "alex.owner@example.com",
              "fullname": "Alex Owner"
            }
          ]), "Membership candidates fetched successfully"),
          "Failed to list membership candidates"
        )
      }
    },
    {
      "method": "GET",
      "path": "/users/{user_uuid}",
      "summary": "Read one user by UUID.",
      "surface": management,
      "details": {
        "overview": "Returns one tenant-scoped user by public UUID. Use this for user detail pages before loading related roles, identities, sessions, devices, consents, or profiles.",
        "notes": readNotes("user:read"),
        "parameters": [userUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonReadResponses(
          "The user was returned successfully.",
          success(userExample, "User fetched successfully"),
          "User not found"
        )
      }
    },
    {
      "method": "POST",
      "path": "/users/",
      "summary": "Create a user.",
      "surface": management,
      "details": {
        "overview": "Creates a user in the authenticated tenant. Password complexity and reuse checks are enforced by the tenant password policy rather than duplicated in this DTO.",
        "notes": [
          "Requires the user:create permission.",
          "The created user belongs to the authenticated tenant context.",
          "Password is required and may be up to 4096 characters at the DTO boundary; policy validation decides whether it is acceptable."
        ],
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "User creation payload.",
          "fields": [
            ...userFields.slice(0, 3),
            {
              "name": "password",
              "type": "string",
              "required": true,
              "description": "Initial password. Required; tenant password policy enforces length, complexity, breach/common-password checks, and reuse rules."
            },
            ...userFields.slice(3)
          ],
          "example": {
            "username": "jane.admin",
            "email": "jane.admin@example.com",
            "phone": "+15551234567",
            "password": "Use-a-tenant-policy-compliant-password",
            "status": "active",
            "metadata": {
              "department": "operations"
            }
          }
        },
        "responses": commonWriteResponses(
          "201 Created",
          "The user was created.",
          success(userExample, "User created successfully"),
          "Failed to create user"
        )
      }
    },
    {
      "method": "PUT",
      "path": "/users/{user_uuid}",
      "summary": "Update a user record.",
      "surface": management,
      "details": {
        "overview": "Updates core user fields such as username, email, phone, status, and metadata. This route is step-up gated because changing sign-in identifiers or status can affect account control.",
        "notes": [
          ...writeNotes("user:update", true),
          "Send the complete editable user payload because username and status are required by the update DTO."
        ],
        "parameters": [userUuidParameter],
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Complete user update payload.",
          "fields": userFields,
          "example": {
            "username": "jane.admin",
            "email": "jane.admin@example.com",
            "phone": "+15551234567",
            "status": "active",
            "metadata": {
              "department": "security"
            }
          }
        },
        "responses": commonWriteResponses(
          "200 OK",
          "The user was updated.",
          success({ ...userExample, "metadata": { "department": "security" } }, "User updated successfully"),
          "Failed to update user"
        )
      }
    },
    {
      "method": "PUT",
      "path": "/users/{user_uuid}/password",
      "summary": "Set a user's password administratively.",
      "surface": management,
      "details": {
        "overview": "Sets a user's password as an administrator remediation action. The service enforces the tenant password policy, stores the new secret, and revokes the user's active sessions.",
        "notes": [
          ...writeNotes("user:update", true),
          "Use temporary=true when the user must choose their own password at next login.",
          "The password is never returned in the response and is not written into the audit diff.",
          "sessions_revoked is true on success."
        ],
        "parameters": [userUuidParameter],
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Administrative password set payload.",
          "fields": [
            {
              "name": "password",
              "type": "string",
              "required": true,
              "description": "New password. Tenant password policy is the source of truth for complexity and reuse checks."
            },
            {
              "name": "temporary",
              "type": "boolean",
              "required": false,
              "description": "When true, the user must change the password on next login."
            }
          ],
          "example": {
            "password": "Use-a-tenant-policy-compliant-password",
            "temporary": true
          }
        },
        "responses": commonWriteResponses(
          "200 OK",
          "The password was set.",
          success({
            "temporary": true,
            "force_password_change": true,
            "sessions_revoked": true
          }, "Password set successfully"),
          "Failed to set password"
        )
      }
    },
    {
      "method": "PATCH",
      "path": "/users/{user_uuid}/status",
      "summary": "Change a user's status.",
      "surface": management,
      "details": {
        "overview": "Changes only the user's lifecycle status. Use it for activate, deactivate, pending, and suspend controls without editing identity fields.",
        "notes": writeNotes("user:update", true),
        "parameters": [userUuidParameter],
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Status update payload.",
          "fields": [
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "Allowed values are active, inactive, pending, and suspended."
            }
          ],
          "example": {
            "status": "suspended"
          }
        },
        "responses": commonWriteResponses(
          "200 OK",
          "The user status was updated.",
          success({ ...userExample, "status": "suspended" }, "User status updated successfully"),
          "Failed to update user status"
        )
      }
    },
    {
      "method": "PATCH",
      "path": "/users/{user_uuid}/verify-email",
      "summary": "Mark a user's email as verified.",
      "surface": management,
      "details": {
        "overview": "Administratively marks the user's email as verified. The handler also completes the account when email verification is the remaining completion requirement.",
        "notes": writeNotes("user:update", false),
        "parameters": [userUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonWriteResponses(
          "200 OK",
          "The email was marked verified.",
          success({ ...userExample, "is_email_verified": true }, "Email verified and account completed successfully"),
          "Failed to verify email"
        )
      }
    },
    {
      "method": "PATCH",
      "path": "/users/{user_uuid}/verify-phone",
      "summary": "Mark a user's phone number as verified.",
      "surface": management,
      "details": {
        "overview": "Administratively marks the user's phone number as verified for account recovery or MFA-related administration.",
        "notes": writeNotes("user:update", false),
        "parameters": [userUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonWriteResponses(
          "200 OK",
          "The phone was marked verified.",
          success({ ...userExample, "is_phone_verified": true, "phone_verified_at": "2026-08-15T02:18:10Z" }, "Phone verified successfully"),
          "Failed to verify phone"
        )
      }
    },
    {
      "method": "DELETE",
      "path": "/users/{user_uuid}",
      "summary": "Delete a user.",
      "surface": management,
      "details": {
        "overview": "Deletes a user from the authenticated tenant and returns the deleted user projection. This is a destructive administrative action.",
        "notes": writeNotes("user:delete", true),
        "parameters": [userUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonWriteResponses(
          "200 OK",
          "The user was deleted.",
          success(userExample, "User deleted successfully"),
          "Failed to delete user"
        )
      }
    },
    {
      "method": "PUT",
      "path": "/users/{user_uuid}/force-password-change",
      "summary": "Require a password change on the next login.",
      "surface": management,
      "details": {
        "overview": "Marks a user so the next successful sign-in must continue through password rotation. This does not set a new password by itself.",
        "notes": [
          ...writeNotes("user:update", true),
          "Use the password set endpoint when the user cannot sign in at all."
        ],
        "parameters": [userUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonWriteResponses(
          "200 OK",
          "The force-password-change flag was enabled.",
          success(null, "User will be required to change password on next login"),
          "Failed to set force password change"
        )
      }
    },
    {
      "method": "GET",
      "path": "/users/{user_uuid}/roles",
      "summary": "List roles assigned to a user.",
      "surface": management,
      "details": {
        "overview": "Returns the roles currently assigned to a user in the authenticated tenant.",
        "notes": readNotes("user:read"),
        "parameters": roleListParameters,
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonReadResponses(
          "User roles were returned.",
          success(paginated([roleExample]), "User roles fetched successfully"),
          "Failed to fetch user roles"
        )
      }
    },
    {
      "method": "POST",
      "path": "/users/{user_uuid}/roles",
      "summary": "Assign roles to a user.",
      "surface": management,
      "details": {
        "overview": "Assigns one or more roles to the target user. The service uses the authenticated actor to prevent granting roles the caller is not allowed to grant.",
        "notes": [
          ...writeNotes("user:update", true),
          "role_ids is required and must contain 1-10 role UUIDs."
        ],
        "parameters": [userUuidParameter],
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Role assignment payload.",
          "fields": [
            {
              "name": "role_ids",
              "type": "uuid[]",
              "required": true,
              "description": "Role UUIDs to assign. Must include at least one and no more than ten roles."
            }
          ],
          "example": {
            "role_ids": ["0198b930-6092-72a9-a9a2-5fda2a27fda1"]
          }
        },
        "responses": commonWriteResponses(
          "200 OK",
          "Roles were assigned.",
          success(userExample, "Roles assigned to user successfully"),
          "Failed to assign roles to user"
        )
      }
    },
    {
      "method": "DELETE",
      "path": "/users/{user_uuid}/roles/{role_uuid}",
      "summary": "Remove a role from a user.",
      "surface": management,
      "details": {
        "overview": "Removes one role assignment from the user, revoking permissions granted by that role.",
        "notes": writeNotes("user:update", true),
        "parameters": [userUuidParameter, roleUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonWriteResponses(
          "200 OK",
          "The role was removed from the user.",
          success(userExample, "Role removed from user successfully"),
          "Failed to remove role from user"
        )
      }
    },
    {
      "method": "GET",
      "path": "/users/{user_uuid}/mfa",
      "summary": "Read a user's MFA enrollment status for administration.",
      "surface": management,
      "details": {
        "overview": "Returns admin-visible MFA enrollment state for a user, including which factor families are enabled, backup-code count, WebAuthn keys, and first enrollment time.",
        "notes": readNotes("user:read"),
        "parameters": [userUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonReadResponses(
          "User MFA state was returned.",
          success({
            "is_totp_enabled": true,
            "is_webauthn_enabled": true,
            "is_sms_enabled": false,
            "is_email_otp_enabled": true,
            "backup_codes_count": 8,
            "webauthn_keys": [
              {
                "credential_uuid": "0198b9a7-e065-7956-a315-d48a7cf4a7f8",
                "name": "Security Key",
                "transport": "usb",
                "last_used_at": "2026-08-15T02:18:10Z",
                "created_at": "2026-08-01T02:18:10Z"
              }
            ],
            "mfa_enabled_at": "2026-08-01T02:18:10Z"
          }, "User MFA fetched successfully"),
          "Failed to fetch user MFA"
        )
      }
    },
    {
      "method": "GET",
      "path": "/users/{user_uuid}/identities",
      "summary": "List external identities linked to a user.",
      "surface": management,
      "details": {
        "overview": "Returns federated or external identities linked to the user. Use it to inspect which upstream identity providers can authenticate the account.",
        "notes": readNotes("user:read"),
        "parameters": identityListParameters,
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonReadResponses(
          "Linked identities were returned.",
          success(paginated([identityExample]), "User identities fetched successfully"),
          "Failed to fetch user identities"
        )
      }
    },
    {
      "method": "POST",
      "path": "/users/{user_uuid}/identities",
      "summary": "Link an external identity to a user.",
      "surface": management,
      "details": {
        "overview": "Links an existing upstream identity-provider subject to the user. This is an operator remedy for duplicate accounts or lost self-service access.",
        "notes": [
          ...writeNotes("user:update", true),
          "identity_provider_id must be the public UUID of an identity provider in the tenant.",
          "sub must be the subject identifier issued by the upstream provider and must be 1-255 characters."
        ],
        "parameters": [userUuidParameter],
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "External identity link payload.",
          "fields": [
            {
              "name": "identity_provider_id",
              "type": "uuid",
              "required": true,
              "description": "Public identity provider UUID."
            },
            {
              "name": "sub",
              "type": "string",
              "required": true,
              "description": "Upstream subject identifier for this user. Must be 1-255 characters."
            }
          ],
          "example": {
            "identity_provider_id": "0198b949-0153-7a0c-a496-3f1f43a8ab2d",
            "sub": "00u1abcd2EFGHijk3456"
          }
        },
        "responses": commonWriteResponses(
          "200 OK",
          "The identity was linked.",
          success(identityExample, "Identity linked successfully"),
          "Failed to link identity"
        )
      }
    },
    {
      "method": "DELETE",
      "path": "/users/{user_uuid}/identities/{identity_uuid}",
      "summary": "Unlink an external identity from a user.",
      "surface": management,
      "details": {
        "overview": "Unlinks an external identity from the user. The federation service enforces tenant scope and rejects unlinking the built-in identity.",
        "notes": writeNotes("user:update", true),
        "parameters": [userUuidParameter, identityUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonWriteResponses(
          "200 OK",
          "The identity was unlinked.",
          success(null, "Identity unlinked successfully"),
          "Failed to unlink identity"
        )
      }
    },
    {
      "method": "GET",
      "path": "/users/{user_uuid}/devices",
      "summary": "List trusted devices for a user.",
      "surface": management,
      "details": {
        "overview": "Returns trusted devices registered for the user. Admin access is tenant-isolated: a guessed user UUID from another tenant returns not found.",
        "notes": readNotes("user:read"),
        "parameters": [userUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonReadResponses(
          "Trusted devices were returned.",
          success([deviceExample], "User devices retrieved successfully"),
          "Failed to retrieve devices"
        )
      }
    },
    {
      "method": "DELETE",
      "path": "/users/{user_uuid}/devices/{device_uuid}",
      "summary": "Revoke a user's trusted device.",
      "surface": management,
      "details": {
        "overview": "Revokes one trusted device from the target user. The handler verifies the device belongs to the target user before deleting it.",
        "notes": writeNotes("user:update", true),
        "parameters": [userUuidParameter, deviceUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonWriteResponses(
          "200 OK",
          "The trusted device was revoked.",
          success(null, "Device revoked successfully"),
          "Failed to revoke device"
        )
      }
    },
    {
      "method": "GET",
      "path": "/users/{user_uuid}/consents",
      "summary": "List consent records for a user.",
      "surface": management,
      "details": {
        "overview": "Returns policy consent records for the target user, including accepted and withdrawn consent rows.",
        "notes": readNotes("user:read"),
        "parameters": [userUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonReadResponses(
          "User consent records were returned.",
          success([consentExample], "User consents fetched successfully"),
          "Failed to retrieve consents"
        )
      }
    },
    {
      "method": "POST",
      "path": "/users/{user_uuid}/consents/withdraw",
      "summary": "Withdraw consent on behalf of a user.",
      "surface": management,
      "details": {
        "overview": "Records a consent withdrawal for the user. The original consent grant is preserved and a withdrawal row is appended.",
        "notes": [
          ...writeNotes("user:update", true),
          "Allowed consent_type values are terms_of_service, privacy_policy, and data_processing."
        ],
        "parameters": [userUuidParameter],
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Consent withdrawal payload.",
          "fields": [
            {
              "name": "consent_type",
              "type": "string",
              "required": true,
              "description": "Consent type to withdraw. Allowed values are terms_of_service, privacy_policy, and data_processing."
            }
          ],
          "example": {
            "consent_type": "privacy_policy"
          }
        },
        "responses": commonWriteResponses(
          "200 OK",
          "The consent withdrawal was recorded.",
          success(null, "Consent withdrawn successfully"),
          "Failed to withdraw consent"
        )
      }
    },
    {
      "method": "GET",
      "path": "/users/{user_uuid}/sessions",
      "summary": "List active sessions for a user.",
      "surface": management,
      "details": {
        "overview": "Returns active sessions for the user so an operator can inspect sign-in locations, user agents, and expiry information.",
        "notes": readNotes("user:read"),
        "parameters": [userUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonReadResponses(
          "User sessions were returned.",
          success([sessionExample], "User sessions fetched successfully"),
          "Failed to fetch user sessions"
        )
      }
    },
    {
      "method": "DELETE",
      "path": "/users/{user_uuid}/sessions/{session_uuid}",
      "summary": "Revoke a single user session.",
      "surface": management,
      "details": {
        "overview": "Revokes one active session for the user by public session UUID.",
        "notes": writeNotes("user:update", true),
        "parameters": [userUuidParameter, sessionUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonWriteResponses(
          "200 OK",
          "The session was revoked.",
          success(null, "Session revoked successfully"),
          "Failed to revoke session"
        )
      }
    },
    {
      "method": "DELETE",
      "path": "/users/{user_uuid}/sessions",
      "summary": "Revoke all sessions for a user.",
      "surface": management,
      "details": {
        "overview": "Revokes every active session for the user, forcing global sign-out across devices.",
        "notes": writeNotes("user:update", true),
        "parameters": [userUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonWriteResponses(
          "200 OK",
          "All sessions were revoked.",
          success(null, "All sessions revoked successfully"),
          "Failed to revoke sessions"
        )
      }
    },
    {
      "method": "POST",
      "path": "/users/{user_uuid}/unlock",
      "summary": "Clear a user's failed-login lockout.",
      "surface": management,
      "details": {
        "overview": "Clears failed-login lockout state for the user. The handler clears both username and email identifiers so the user is fully unlocked regardless of which identifier they use to sign in.",
        "notes": [
          ...writeNotes("user:update", true),
          "If the lockout clearer service is not wired, the endpoint returns 503 Service Unavailable."
        ],
        "parameters": [userUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": [
          ...commonWriteResponses(
            "200 OK",
            "The account lockout was cleared.",
            success(null, "Account unlocked successfully"),
            "Failed to unlock account"
          ),
          {
            "status": "503 Service Unavailable",
            "description": "The lockout clearer is unavailable in the running service.",
            "example": error("Unlock is not available")
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/users/{user_uuid}/profiles",
      "summary": "List profiles for a user.",
      "surface": management,
      "details": {
        "overview": "Returns profiles for the target user. Admin profile endpoints verify the target user belongs to the authenticated tenant before reading profile data.",
        "notes": readNotes("user:read"),
        "parameters": profileListParameters,
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonReadResponses(
          "Profiles were returned.",
          success(paginated([profileExample]), "Profiles fetched successfully"),
          "Failed to fetch profiles"
        )
      }
    },
    {
      "method": "POST",
      "path": "/users/{user_uuid}/profiles",
      "summary": "Create a profile for a user.",
      "surface": management,
      "details": {
        "overview": "Creates a new profile for the target user. The service generates a new public profile UUID.",
        "notes": writeNotes("user:update", false),
        "parameters": [userUuidParameter],
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
            "profile_url": "https://cdn.example.com/profiles/jane.png",
            "metadata": {
              "address": {
                "country": "PH"
              }
            }
          }
        },
        "responses": commonWriteResponses(
          "201 Created",
          "The profile was created.",
          success(profileExample, "Profile created successfully"),
          "Create profile failed"
        )
      }
    },
    {
      "method": "GET",
      "path": "/users/{user_uuid}/profiles/{profile_uuid}",
      "summary": "Read one user profile.",
      "surface": management,
      "details": {
        "overview": "Returns one profile for the target user after verifying tenant access to that user.",
        "notes": readNotes("user:read"),
        "parameters": [userUuidParameter, profileUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonReadResponses(
          "The profile was returned.",
          success(profileExample, "Profile retrieved successfully"),
          "Profile not found"
        )
      }
    },
    {
      "method": "PUT",
      "path": "/users/{user_uuid}/profiles/{profile_uuid}",
      "summary": "Update one user profile.",
      "surface": management,
      "details": {
        "overview": "Updates a specific profile for the target user. Birthdate is accepted and returned as YYYY-MM-DD so clients can round-trip profile data.",
        "notes": writeNotes("user:update", false),
        "parameters": [userUuidParameter, profileUuidParameter],
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
            "profile_url": "https://cdn.example.com/profiles/jane.png",
            "metadata": {
              "address": {
                "country": "PH"
              }
            }
          }
        },
        "responses": commonWriteResponses(
          "200 OK",
          "The profile was updated.",
          success(profileExample, "Profile updated successfully"),
          "Update profile failed"
        )
      }
    },
    {
      "method": "DELETE",
      "path": "/users/{user_uuid}/profiles/{profile_uuid}",
      "summary": "Delete one user profile.",
      "surface": management,
      "details": {
        "overview": "Deletes one profile for the target user and returns the deleted profile projection.",
        "notes": writeNotes("user:delete", false),
        "parameters": [userUuidParameter, profileUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": commonWriteResponses(
          "200 OK",
          "The profile was deleted.",
          success(profileExample, "Profile deleted successfully"),
          "Delete profile failed"
        )
      }
    },
    {
      "method": "POST",
      "path": "/users/{user_uuid}/erasure-requests",
      "summary": "Create an administrative data-erasure request for a user.",
      "surface": management,
      "details": {
        "overview": "Creates a GDPR-style data-erasure request for the target user. The target user must belong to the authenticated tenant. Empty request bodies are allowed and create a default request.",
        "notes": [
          ...writeNotes("user:delete", true),
          "This schedules destructive account anonymisation/erasure work; treat it as the most sensitive user administration operation.",
          "reason is optional and is stored on the erasure request when provided."
        ],
        "parameters": [userUuidParameter],
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Optional erasure request metadata.",
          "fields": [
            {
              "name": "reason",
              "type": "string",
              "required": false,
              "description": "Optional operator reason for the erasure request."
            }
          ],
          "example": {
            "reason": "User requested account erasure"
          }
        },
        "responses": commonWriteResponses(
          "200 OK",
          "The data-erasure request was created.",
          success(erasureExample, "Data erasure request created successfully"),
          "Failed to create erasure request"
        )
      }
    }
  ]
};

export default group;
