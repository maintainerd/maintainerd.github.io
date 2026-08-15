// Endpoint details for this Auth API section.

const group = {
  "slug": "setup",
  "label": "Setup",
  "description": "Initial bootstrap APIs for first tenant creation, first administrator creation, setup completion, and control-service registration.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/setup/status",
      "summary": "Read whether setup is pending or already completed.",
      "surface": "Internal management API",
      "details": {
        "overview": "Checks which setup steps are already complete. It is safe to call from a setup UI before the tenant or first admin exists.",
        "notes": [
          "This endpoint is read-only and does not lock setup.",
          "is_setup_complete becomes true when the system tenant is active."
        ],
        "headers": [
          {
            "name": "Accept",
            "value": "application/json",
            "required": false,
            "description": "Use when the client wants an explicit JSON response."
          },
          {
            "name": "Authorization",
            "value": "Not required",
            "required": false,
            "description": "Standalone REST setup endpoints are unauthenticated and close after setup is locked. Orchestrator-managed instances must use the gRPC setup service instead."
          }
        ],
        "requestBody": {
          "type": "None",
          "description": "This endpoint does not accept a request body.",
          "fields": [],
          "example": null
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "Setup status was read successfully.",
            "example": {
              "success": true,
              "data": {
                "is_tenant_setup": true,
                "is_admin_setup": true,
                "is_profile_setup": false,
                "is_setup_complete": true
              },
              "message": "Setup status retrieved successfully"
            }
          },
          {
            "status": "500 Internal Server Error",
            "description": "The service could not read setup state.",
            "example": {
              "success": false,
              "error": "Failed to get setup status"
            }
          }
        ]
      }
    },
    {
      "method": "POST",
      "path": "/setup/complete",
      "summary": "Mark the installation setup flow as completed.",
      "surface": "Internal management API",
      "details": {
        "overview": "Locks setup after the system tenant and first admin have been created. The admin profile is optional and does not block completion.",
        "notes": [
          "Calling this endpoint after setup is already complete returns success with is_setup_complete=true.",
          "All REST setup responses use the shared JSON envelope. Success responses include success, data, and message. Error responses include success=false, error, and optional details."
        ],
        "headers": [
          {
            "name": "Accept",
            "value": "application/json",
            "required": false,
            "description": "Use when the client wants an explicit JSON response."
          },
          {
            "name": "Authorization",
            "value": "Not required",
            "required": false,
            "description": "Standalone REST setup endpoints are unauthenticated and close after setup is locked. Orchestrator-managed instances must use the gRPC setup service instead."
          }
        ],
        "requestBody": {
          "type": "None",
          "description": "This endpoint does not accept a request body.",
          "fields": [],
          "example": null
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "Setup is complete and locked.",
            "example": {
              "success": true,
              "data": {
                "is_setup_complete": true
              },
              "message": "Setup completed successfully"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "Tenant and admin setup are not both complete.",
            "example": {
              "success": false,
              "error": "tenant and admin setup must be completed before locking setup"
            }
          },
          {
            "status": "403 Forbidden",
            "description": "Returned when the instance is orchestrator-managed and REST setup is disabled.",
            "example": {
              "success": false,
              "error": "this instance is provisioned by an orchestrator: bootstrap it through the gRPC SetupService with its bootstrap credential, not the REST setup wizard"
            }
          },
          {
            "status": "500 Internal Server Error",
            "description": "The service could not lock setup.",
            "example": {
              "success": false,
              "error": "Failed to complete setup"
            }
          }
        ]
      }
    },
    {
      "method": "POST",
      "path": "/setup/register-control-service",
      "summary": "Register the control-plane service during bootstrap.",
      "surface": "Internal management API",
      "details": {
        "overview": "Registers the control-plane or orchestrator service inside the system tenant and attaches the control policy it will use.",
        "notes": [
          "The system tenant must already exist, so create the tenant before calling this endpoint.",
          "If the service already exists, the endpoint is idempotent and can still return 201 with already_existed=true.",
          "AllowedActions and PolicyName are advanced optional fields. They use PascalCase JSON names because the request DTO does not define snake_case JSON tags for those fields."
        ],
        "headers": [
          {
            "name": "Content-Type",
            "value": "application/json",
            "required": true,
            "description": "Required on setup endpoints that accept a JSON request body."
          },
          {
            "name": "Accept",
            "value": "application/json",
            "required": false,
            "description": "Use when the client wants an explicit JSON response."
          },
          {
            "name": "Authorization",
            "value": "Not required",
            "required": false,
            "description": "Standalone REST setup endpoints are unauthenticated and close after setup is locked. Orchestrator-managed instances must use the gRPC setup service instead."
          }
        ],
        "requestBody": {
          "type": "JSON object",
          "description": "Service registration payload.",
          "fields": [
            {
              "name": "name",
              "type": "string",
              "required": true,
              "description": "Unique service name. Use 2-100 letters, numbers, hyphens, underscores, or dots."
            },
            {
              "name": "display_name",
              "type": "string",
              "required": true,
              "description": "Human-readable service name, 2-100 characters."
            },
            {
              "name": "description",
              "type": "string",
              "required": false,
              "description": "Optional service description, up to 500 characters."
            },
            {
              "name": "version",
              "type": "string",
              "required": false,
              "description": "Optional version. Defaults to v1 when omitted. Use 1-50 letters, numbers, hyphens, underscores, or dots."
            },
            {
              "name": "AllowedActions",
              "type": "string[]",
              "required": false,
              "description": "Optional control-policy action list. Empty means the documented default control actions."
            },
            {
              "name": "PolicyName",
              "type": "string",
              "required": false,
              "description": "Optional policy name. Use when one Auth instance serves more than one orchestrator grant."
            }
          ],
          "example": {
            "name": "core",
            "display_name": "Maintainerd Core",
            "description": "Provisioning and lifecycle orchestrator",
            "version": "v1"
          }
        },
        "responses": [
          {
            "status": "201 Created",
            "description": "Control service was registered and the policy attachment was ensured.",
            "example": {
              "success": true,
              "data": {
                "service_uuid": "0f25a746-44f3-4f95-98d4-72dfb41c87cc",
                "name": "core",
                "display_name": "Maintainerd Core",
                "policy_uuid": "64b71589-a8c5-4c85-84cc-52c28a70e019",
                "policy_name": "control-service-policy",
                "already_existed": false,
                "policy_was_attached": true
              },
              "message": "Control service registered successfully"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "The JSON body is invalid, required fields are missing, field validation fails, or a prerequisite setup step has not been completed.",
            "example": {
              "success": false,
              "error": "Validation failed",
              "details": {
                "name": "Tenant name is required"
              }
            }
          },
          {
            "status": "403 Forbidden",
            "description": "Returned when the instance is orchestrator-managed and REST setup is disabled.",
            "example": {
              "success": false,
              "error": "this instance is provisioned by an orchestrator: bootstrap it through the gRPC SetupService with its bootstrap credential, not the REST setup wizard"
            }
          },
          {
            "status": "500 Internal Server Error",
            "description": "An unexpected service or persistence error occurred. The response uses the endpoint's fallback message.",
            "example": {
              "success": false,
              "error": "Failed to create tenant"
            }
          },
          {
            "status": "409 Conflict",
            "description": "Setup is already complete and locked.",
            "example": {
              "success": false,
              "error": "setup is complete and locked"
            }
          }
        ]
      }
    },
    {
      "method": "POST",
      "path": "/setup/create_tenant",
      "summary": "Create the first tenant during setup.",
      "surface": "Internal management API",
      "details": {
        "overview": "Creates the initial system tenant and seeds the built-in Auth resources needed for the rest of setup.",
        "notes": [
          "This endpoint can only be run once. The tenant name becomes a DNS-safe tenant slug.",
          "The created tenant starts as pending and becomes active when the first admin is created or setup is completed.",
          "All REST setup responses use the shared JSON envelope. Success responses include success, data, and message. Error responses include success=false, error, and optional details."
        ],
        "headers": [
          {
            "name": "Content-Type",
            "value": "application/json",
            "required": true,
            "description": "Required on setup endpoints that accept a JSON request body."
          },
          {
            "name": "Accept",
            "value": "application/json",
            "required": false,
            "description": "Use when the client wants an explicit JSON response."
          },
          {
            "name": "Authorization",
            "value": "Not required",
            "required": false,
            "description": "Standalone REST setup endpoints are unauthenticated and close after setup is locked. Orchestrator-managed instances must use the gRPC setup service instead."
          }
        ],
        "requestBody": {
          "type": "JSON object",
          "description": "Initial tenant payload.",
          "fields": [
            {
              "name": "name",
              "type": "string",
              "required": true,
              "description": "DNS-safe tenant slug, 3-63 characters. Lowercase letters, numbers, and hyphens only; must start and end with a letter or number."
            },
            {
              "name": "display_name",
              "type": "string",
              "required": true,
              "description": "Human-readable tenant name, 2-100 characters."
            },
            {
              "name": "description",
              "type": "string",
              "required": false,
              "description": "Optional tenant description, up to 200 characters."
            },
            {
              "name": "metadata",
              "type": "object",
              "required": false,
              "description": "Optional tenant metadata such as logo URL, favicon URL, language, timezone, date/time formats, privacy policy URL, and terms of service URL."
            },
            {
              "name": "metadata.application_logo_url",
              "type": "string",
              "required": false,
              "description": "Valid URL for the tenant logo, up to 500 characters."
            },
            {
              "name": "metadata.favicon_url",
              "type": "string",
              "required": false,
              "description": "Valid URL for the tenant favicon, up to 500 characters."
            },
            {
              "name": "metadata.language",
              "type": "string",
              "required": false,
              "description": "Language code such as en or en-US."
            },
            {
              "name": "metadata.timezone",
              "type": "string",
              "required": false,
              "description": "Timezone label, up to 50 characters."
            },
            {
              "name": "metadata.privacy_policy_url",
              "type": "string",
              "required": false,
              "description": "Valid privacy policy URL, up to 500 characters."
            },
            {
              "name": "metadata.term_of_service_url",
              "type": "string",
              "required": false,
              "description": "Valid terms of service URL, up to 500 characters."
            }
          ],
          "example": {
            "name": "maintainerd",
            "display_name": "Maintainerd",
            "description": "System tenant for Maintainerd services",
            "metadata": {
              "language": "en-US",
              "timezone": "Asia/Manila",
              "privacy_policy_url": "https://auth.example.com/privacy",
              "term_of_service_url": "https://auth.example.com/terms"
            }
          }
        },
        "responses": [
          {
            "status": "201 Created",
            "description": "The system tenant was created.",
            "example": {
              "success": true,
              "data": {
                "tenant_id": "aab19868-3f66-47c3-9336-d4413d4496a6",
                "name": "maintainerd",
                "display_name": "Maintainerd",
                "description": "System tenant for Maintainerd services",
                "status": "pending",
                "is_system": true,
                "metadata": {
                  "language": "en-US",
                  "timezone": "Asia/Manila"
                },
                "created_at": "2026-08-15T01:00:00Z",
                "updated_at": "2026-08-15T01:00:00Z"
              },
              "message": "Tenant created successfully"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "The JSON body is invalid, required fields are missing, field validation fails, or a prerequisite setup step has not been completed.",
            "example": {
              "success": false,
              "error": "Validation failed",
              "details": {
                "name": "Tenant name is required"
              }
            }
          },
          {
            "status": "403 Forbidden",
            "description": "Returned when the instance is orchestrator-managed and REST setup is disabled.",
            "example": {
              "success": false,
              "error": "this instance is provisioned by an orchestrator: bootstrap it through the gRPC SetupService with its bootstrap credential, not the REST setup wizard"
            }
          },
          {
            "status": "500 Internal Server Error",
            "description": "An unexpected service or persistence error occurred. The response uses the endpoint's fallback message.",
            "example": {
              "success": false,
              "error": "Failed to create tenant"
            }
          },
          {
            "status": "409 Conflict",
            "description": "A tenant already exists or setup is already locked.",
            "example": {
              "success": false,
              "error": "tenant already exists: setup can only be run once"
            }
          }
        ]
      }
    },
    {
      "method": "POST",
      "path": "/setup/create_admin",
      "summary": "Create the first administrator account.",
      "surface": "Internal management API",
      "details": {
        "overview": "Creates the first super-admin user, verifies the email immediately, assigns registered and super-admin roles, and adds the user as tenant owner.",
        "notes": [
          "Create the tenant before creating the admin.",
          "The password is checked against the default password policy before the admin is created.",
          "Creating the admin activates the system tenant because the tenant now has an owner."
        ],
        "headers": [
          {
            "name": "Content-Type",
            "value": "application/json",
            "required": true,
            "description": "Required on setup endpoints that accept a JSON request body."
          },
          {
            "name": "Accept",
            "value": "application/json",
            "required": false,
            "description": "Use when the client wants an explicit JSON response."
          },
          {
            "name": "Authorization",
            "value": "Not required",
            "required": false,
            "description": "Standalone REST setup endpoints are unauthenticated and close after setup is locked. Orchestrator-managed instances must use the gRPC setup service instead."
          }
        ],
        "requestBody": {
          "type": "JSON object",
          "description": "Initial administrator payload.",
          "fields": [
            {
              "name": "username",
              "type": "string",
              "required": true,
              "description": "Admin username, 3-50 characters. Allows letters, numbers, underscore, hyphen, dot, and @."
            },
            {
              "name": "email",
              "type": "string",
              "required": true,
              "description": "Valid email address, up to 100 characters. Marked verified on creation."
            },
            {
              "name": "password",
              "type": "string",
              "required": true,
              "description": "Admin password, 8-100 characters, validated against the default password policy."
            },
            {
              "name": "fullname",
              "type": "string",
              "required": false,
              "description": "Optional full name. Defaults to username when omitted."
            }
          ],
          "example": {
            "username": "admin",
            "email": "admin@maintainerd.example",
            "password": "Use-A-Strong-Password-Here",
            "fullname": "Maintainerd Administrator"
          }
        },
        "responses": [
          {
            "status": "201 Created",
            "description": "The first administrator was created.",
            "example": {
              "success": true,
              "data": {
                "user_id": "5c6b7121-f986-4555-bf67-cbb04b525062",
                "username": "admin",
                "fullname": "Maintainerd Administrator",
                "email": "admin@maintainerd.example",
                "phone": "",
                "is_email_verified": true,
                "is_phone_verified": false,
                "status": "active",
                "created_at": "2026-08-15T01:05:00Z",
                "updated_at": "2026-08-15T01:05:00Z"
              },
              "message": "Admin user created successfully"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "The JSON body is invalid, required fields are missing, field validation fails, or a prerequisite setup step has not been completed.",
            "example": {
              "success": false,
              "error": "Validation failed",
              "details": {
                "name": "Tenant name is required"
              }
            }
          },
          {
            "status": "403 Forbidden",
            "description": "Returned when the instance is orchestrator-managed and REST setup is disabled.",
            "example": {
              "success": false,
              "error": "this instance is provisioned by an orchestrator: bootstrap it through the gRPC SetupService with its bootstrap credential, not the REST setup wizard"
            }
          },
          {
            "status": "500 Internal Server Error",
            "description": "An unexpected service or persistence error occurred. The response uses the endpoint's fallback message.",
            "example": {
              "success": false,
              "error": "Failed to create tenant"
            }
          },
          {
            "status": "404 Not Found",
            "description": "A required seeded system record, such as the default tenant or auth-console client, was not found.",
            "example": {
              "success": false,
              "error": "auth-console system client not found"
            }
          },
          {
            "status": "409 Conflict",
            "description": "The first admin already exists, the email is already used, or setup is locked.",
            "example": {
              "success": false,
              "error": "admin user already exists: setup can only be run once"
            }
          }
        ]
      }
    },
    {
      "method": "POST",
      "path": "/setup/create_profile",
      "summary": "Create the first administrator profile.",
      "surface": "Internal management API",
      "details": {
        "overview": "Optionally seeds the first admin profile before anyone signs in. Normal interactive installs may skip this and let the identity app collect profile details on first login.",
        "notes": [
          "Create the admin before creating the profile.",
          "This endpoint is idempotent during setup: if the admin already has a profile, it returns the existing profile.",
          "Only profile fields used by setup are persisted by this setup path."
        ],
        "headers": [
          {
            "name": "Content-Type",
            "value": "application/json",
            "required": true,
            "description": "Required on setup endpoints that accept a JSON request body."
          },
          {
            "name": "Accept",
            "value": "application/json",
            "required": false,
            "description": "Use when the client wants an explicit JSON response."
          },
          {
            "name": "Authorization",
            "value": "Not required",
            "required": false,
            "description": "Standalone REST setup endpoints are unauthenticated and close after setup is locked. Orchestrator-managed instances must use the gRPC setup service instead."
          }
        ],
        "requestBody": {
          "type": "JSON object",
          "description": "Initial profile payload for the bootstrapped super-admin.",
          "fields": [
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
              "name": "suffix",
              "type": "string",
              "required": false,
              "description": "Optional name suffix, up to 50 characters."
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
              "description": "Calendar date in YYYY-MM-DD format."
            },
            {
              "name": "gender",
              "type": "string",
              "required": false,
              "description": "Allowed values: male, female, other, prefer_not_to_say."
            },
            {
              "name": "bio",
              "type": "string",
              "required": false,
              "description": "Optional biography, up to 1000 characters."
            },
            {
              "name": "phone",
              "type": "string",
              "required": false,
              "description": "Optional phone value, up to 20 characters."
            },
            {
              "name": "email",
              "type": "string",
              "required": false,
              "description": "Optional profile email, up to 255 characters."
            },
            {
              "name": "address",
              "type": "string",
              "required": false,
              "description": "Optional address, up to 500 characters."
            },
            {
              "name": "city",
              "type": "string",
              "required": false,
              "description": "Optional city, up to 100 characters."
            },
            {
              "name": "country",
              "type": "string",
              "required": false,
              "description": "Optional two-character ISO country code such as US or PH."
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
              "description": "Optional language value, up to 10 characters."
            },
            {
              "name": "profile_url",
              "type": "string",
              "required": false,
              "description": "Optional valid URL for a profile image or profile page, up to 1000 characters."
            },
            {
              "name": "metadata",
              "type": "object",
              "required": false,
              "description": "Optional custom profile metadata."
            }
          ],
          "example": {
            "first_name": "Maintainerd",
            "last_name": "Admin",
            "display_name": "Maintainerd Admin",
            "birthdate": "1990-01-25",
            "gender": "prefer_not_to_say",
            "country": "PH",
            "timezone": "Asia/Manila",
            "language": "en"
          }
        },
        "responses": [
          {
            "status": "201 Created",
            "description": "The first admin profile was created or an existing setup profile was returned.",
            "example": {
              "success": true,
              "data": {
                "profile_id": "8fdd95a5-b3ee-4e87-857d-3ec14d5c4e41",
                "first_name": "Maintainerd",
                "last_name": "Admin",
                "display_name": "Maintainerd Admin",
                "birthdate": "1990-01-25",
                "gender": "prefer_not_to_say",
                "metadata": {},
                "is_default": true,
                "created_at": "2026-08-15T01:10:00Z",
                "updated_at": "2026-08-15T01:10:00Z"
              },
              "message": "Profile created successfully"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "The JSON body is invalid, required fields are missing, field validation fails, or a prerequisite setup step has not been completed.",
            "example": {
              "success": false,
              "error": "Validation failed",
              "details": {
                "name": "Tenant name is required"
              }
            }
          },
          {
            "status": "403 Forbidden",
            "description": "Returned when the instance is orchestrator-managed and REST setup is disabled.",
            "example": {
              "success": false,
              "error": "this instance is provisioned by an orchestrator: bootstrap it through the gRPC SetupService with its bootstrap credential, not the REST setup wizard"
            }
          },
          {
            "status": "500 Internal Server Error",
            "description": "An unexpected service or persistence error occurred. The response uses the endpoint's fallback message.",
            "example": {
              "success": false,
              "error": "Failed to create tenant"
            }
          },
          {
            "status": "409 Conflict",
            "description": "Setup is already complete and locked.",
            "example": {
              "success": false,
              "error": "setup is complete and locked"
            }
          }
        ]
      }
    }
  ]
};

export default group;
