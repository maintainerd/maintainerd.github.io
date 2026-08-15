// gRPC service reference for Auth. Each group is one gRPC service with its
// RPC surface. Details are filled in per-RPC later; for now the reference
// lists the full method inventory.

export const grpcPackage = "maintainerd.auth.v1";

export const protoBaseUrl = "https://github.com/maintainerd/maintainerd-auth/blob/main/proto/maintainerd/auth/v1";
export const protoRawBaseUrl = "https://raw.githubusercontent.com/maintainerd/maintainerd-auth/main/proto/maintainerd/auth/v1";

export const grpcGroupNav = [
  {
    "slug": "setup",
    "proto": "setup.proto",
    "label": "Setup",
    "description": "One-time bootstrap RPCs for tenant creation, first administrator, control-service registration, and setup completion.",
    "rpcCount": 10,
    "rpcs": [
      {
                "auth": "bootstrap",
"name": "GetSetupStatus",
        "request": "GetSetupStatusRequest",
        "response": "GetSetupStatusResponse",
        "details": {
          "overview": "Reports the current bootstrap progress of the instance. Read-only and always callable, including after setup has completed.",
          "notes": [
            "is_setup_complete is true once the system tenant is active — the same durable fact the setup gate checks on every mutating RPC.",
            "All four flags are booleans; there is no secret or configuration exposed."
          ],
          "requestFields": [],
          "responseFields": [
            { "name": "is_tenant_setup", "type": "bool", "description": "True once the system tenant has been created." },
            { "name": "is_admin_setup", "type": "bool", "description": "True once the first administrator has been created." },
            { "name": "is_profile_setup", "type": "bool", "description": "True once the administrator's profile has been created." },
            { "name": "is_setup_complete", "type": "bool", "description": "True once setup is finished and locked." }
          ],
                    "requestExample": {},
          "responseExample": {
            "is_tenant_setup": true,
            "is_admin_setup": false,
            "is_profile_setup": false,
            "is_setup_complete": false
          },
"errors": [
            { "code": "Internal", "description": "The bootstrap state could not be read from storage." }
          ]
        }
      },
      {
                "auth": "bootstrap",
"name": "CreateTenant",
        "request": "CreateTenantRequest",
        "response": "CreateTenantResponse",
        "details": {
          "overview": "Creates the system tenant that owns the instance. This is the one unauthenticated bootstrap call that mints the tenant every other resource hangs off, so it is replay-guarded: a retry after a lost response returns the same tenant instead of failing or duplicating.",
          "notes": [
            "The tenant name is a DNS-safe slug — it becomes the tenant subdomain and is matched against incoming Host headers.",
            "The response includes the seeded default client and default identity provider identifiers.",
            "The system tenant becomes the durable, replica-shared fact that setup is complete once it is active."
          ],
          "requestFields": [
            { "name": "name", "type": "string", "required": true, "description": "Tenant name. 3-63 characters: lowercase letters, numbers, and hyphens, starting and ending with an alphanumeric." },
            { "name": "display_name", "type": "string", "required": true, "description": "Human-readable tenant name. 2-100 characters." },
            { "name": "description", "type": "string", "required": false, "description": "Description. At most 200 characters." },
            { "name": "metadata", "type": "TenantMetadata", "required": false, "description": "Tenant display metadata; each field is optional and validated independently." },
            { "name": "metadata.application_logo_url", "type": "string", "required": false, "description": "Application logo URL. Valid URL, at most 500 characters." },
            { "name": "metadata.favicon_url", "type": "string", "required": false, "description": "Favicon URL. Valid URL, at most 500 characters." },
            { "name": "metadata.language", "type": "string", "required": false, "description": "Locale, e.g. en or en-US." },
            { "name": "metadata.timezone", "type": "string", "required": false, "description": "Timezone label. At most 50 characters." },
            { "name": "metadata.date_format", "type": "string", "required": false, "description": "Date format preference. At most 20 characters." },
            { "name": "metadata.time_format", "type": "string", "required": false, "description": "Time format preference. At most 20 characters." },
            { "name": "metadata.privacy_policy_url", "type": "string", "required": false, "description": "Privacy policy URL. Valid URL, at most 500 characters." },
            { "name": "metadata.term_of_service_url", "type": "string", "required": false, "description": "Terms of service URL. Valid URL, at most 500 characters." }
          ],
          "responseFields": [
            { "name": "tenant_uuid", "type": "string", "description": "UUID of the created system tenant." },
            { "name": "name", "type": "string", "description": "Tenant name as stored." },
            { "name": "display_name", "type": "string", "description": "Tenant display name as stored." },
            { "name": "default_client_id", "type": "string", "description": "OAuth client identifier of the tenant's seeded default client." },
            { "name": "default_provider_id", "type": "string", "description": "Identifier of the tenant's seeded default identity provider." }
          ],
          "requestExample": {
            "name": "acme",
            "display_name": "Acme Inc.",
            "description": "The system tenant for the Acme deployment.",
            "metadata": {
              "application_logo_url": "https://cdn.acme.example/logo.png",
              "language": "en-US",
              "timezone": "Asia/Manila"
            }
          },
          "responseExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "name": "acme",
            "display_name": "Acme Inc.",
            "default_client_id": "console-acme",
            "default_provider_id": "maintainerd-acme"
          },
"errors": [
            { "code": "InvalidArgument", "description": "A required field is missing or fails validation (field violations are carried in the BadRequest details)." },
            { "code": "AlreadyExists", "description": "A tenant already exists in this instance, or setup has completed and is locked." },
            { "code": "PermissionDenied", "description": "The orchestrated setup window has expired (SETUP_WINDOW_TTL)." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      },
      {
                "auth": "bootstrap",
"name": "CreateAdmin",
        "request": "CreateAdminRequest",
        "response": "CreateAdminResponse",
        "details": {
          "overview": "Creates the instance's first administrator. The new user receives the seeded super-admin role, making them the account that can grant every other access.",
          "notes": [
            "The bootstrap creates are replay-guarded: a retry after a lost response returns the same administrator instead of failing.",
            "The password is validated by the tenant password policy after the credential rules pass."
          ],
          "requestFields": [
            { "name": "username", "type": "string", "required": true, "description": "Username. 3-50 characters: letters, numbers, underscore, hyphen, dot, or @." },
            { "name": "fullname", "type": "string", "required": false, "description": "Full name for the administrator account." },
            { "name": "password", "type": "string", "required": true, "description": "Initial password. 8-100 characters." },
            { "name": "email", "type": "string", "required": true, "description": "Email address. Valid format, at most 100 characters." }
          ],
          "responseFields": [
            { "name": "user_uuid", "type": "string", "description": "UUID of the created administrator." },
            { "name": "username", "type": "string", "description": "Username as stored." },
            { "name": "fullname", "type": "string", "description": "Full name as stored." },
            { "name": "email", "type": "string", "description": "Email address as stored." },
            { "name": "status", "type": "string", "description": "Account status, e.g. active." }
          ],
                    "requestExample": {
            "username": "admin",
            "fullname": "Acme Administrator",
            "password": "CorrectHorseBatteryStaple!1",
            "email": "admin@acme.example"
          },
          "responseExample": {
            "user_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "username": "admin",
            "fullname": "Acme Administrator",
            "email": "admin@acme.example",
            "status": "active"
          },
"errors": [
            { "code": "InvalidArgument", "description": "A required field is missing or fails validation." },
            { "code": "AlreadyExists", "description": "An administrator already exists, or setup has completed and is locked." },
            { "code": "PermissionDenied", "description": "The orchestrated setup window has expired." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      },
      {
                "auth": "bootstrap",
"name": "CreateProfile",
        "request": "CreateProfileRequest",
        "response": "CreateProfileResponse",
        "details": {
          "overview": "Creates the administrator's profile record — the display identity the account uses across the console and hosted surfaces.",
          "notes": [
            "Only first_name is required; every other field is optional and validated independently when present.",
            "birthdate must be YYYY-MM-DD, country a 2-character ISO code, and gender one of male, female, other, or prefer_not_to_say.",
            "metadata is a free-form protobuf Struct carried through unchanged."
          ],
          "requestFields": [
            { "name": "first_name", "type": "string", "required": true, "description": "First name. 1-100 characters." },
            { "name": "middle_name", "type": "string", "required": false, "description": "Middle name. At most 100 characters." },
            { "name": "last_name", "type": "string", "required": false, "description": "Last name. At most 100 characters." },
            { "name": "suffix", "type": "string", "required": false, "description": "Name suffix. At most 50 characters." },
            { "name": "display_name", "type": "string", "required": false, "description": "Display name. At most 100 characters." },
            { "name": "birthdate", "type": "string", "required": false, "description": "Birthdate in YYYY-MM-DD format." },
            { "name": "gender", "type": "string", "required": false, "description": "One of male, female, other, prefer_not_to_say." },
            { "name": "bio", "type": "string", "required": false, "description": "Biography. At most 1000 characters." },
            { "name": "phone", "type": "string", "required": false, "description": "Phone number. At most 20 characters." },
            { "name": "email", "type": "string", "required": false, "description": "Email address. Valid format, at most 255 characters." },
            { "name": "address", "type": "string", "required": false, "description": "Street address. At most 500 characters." },
            { "name": "city", "type": "string", "required": false, "description": "City. At most 100 characters." },
            { "name": "country", "type": "string", "required": false, "description": "2-character ISO country code, e.g. US or PH." },
            { "name": "timezone", "type": "string", "required": false, "description": "Timezone label. At most 50 characters." },
            { "name": "language", "type": "string", "required": false, "description": "Language preference. At most 10 characters." },
            { "name": "profile_url", "type": "string", "required": false, "description": "Profile URL. Valid URL, at most 1000 characters." },
            { "name": "metadata", "type": "google.protobuf.Struct", "required": false, "description": "Free-form profile metadata." }
          ],
          "responseFields": [
            { "name": "profile_uuid", "type": "string", "description": "UUID of the created profile." },
            { "name": "first_name", "type": "string", "description": "First name as stored." },
            { "name": "display_name", "type": "string", "description": "Display name as resolved (empty when not set)." }
          ],
                    "requestExample": {
            "first_name": "Acme",
            "middle_name": "A.",
            "last_name": "Administrator",
            "suffix": "",
            "display_name": "Acme Admin",
            "birthdate": "1990-01-25",
            "gender": "prefer_not_to_say",
            "bio": "Instance administrator",
            "phone": "+15551234567",
            "email": "admin@acme.example",
            "address": "1 Acme Way",
            "city": "Manila",
            "country": "PH",
            "timezone": "Asia/Manila",
            "language": "en-US",
            "profile_url": "https://acme.example/team/admin",
            "metadata": {
              "department": "platform"
            }
          },
          "responseExample": {
            "profile_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
            "first_name": "Acme",
            "display_name": "Acme Admin"
          },
"errors": [
            { "code": "InvalidArgument", "description": "A required field is missing or fails validation." },
            { "code": "AlreadyExists", "description": "Setup has completed and is locked." },
            { "code": "PermissionDenied", "description": "The orchestrated setup window has expired." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      },
      {
                "auth": "bootstrap",
"name": "RegisterControlService",
        "request": "RegisterControlServiceRequest",
        "response": "RegisterControlServiceResponse",
        "details": {
          "overview": "Registers the orchestrator (Maintainerd Core or another ecosystem control plane) as a service principal, and attaches a control policy granting exactly the actions listed in allowed_actions.",
          "notes": [
            "allowed_actions is the control policy, supplied explicitly instead of read from a seeded row. Empty means the documented default control set, which excludes user:* and account:*:self.",
            "policy_name names the orchestrator's own control policy; empty means auth-control. Distinct names keep separate orchestrators' grants separate — an existing policy is returned unchanged rather than widened.",
            "The response flags already_existed and policy_was_attached so a retry can tell a fresh grant from a replay."
          ],
          "requestFields": [
            { "name": "name", "type": "string", "required": true, "description": "Service name. 2-100 characters: letters, numbers, hyphen, underscore, dot." },
            { "name": "display_name", "type": "string", "required": true, "description": "Human-readable name. 2-100 characters." },
            { "name": "description", "type": "string", "required": false, "description": "Description. At most 500 characters." },
            { "name": "version", "type": "string", "required": false, "description": "Service version. 1-50 characters: letters, numbers, hyphen, underscore, dot." },
            { "name": "allowed_actions", "type": "repeated string", "required": false, "description": "Permission names the control policy grants. Empty means the documented default control set." },
            { "name": "policy_name", "type": "string", "required": false, "description": "Name of the control policy. Empty means auth-control." }
          ],
          "responseFields": [
            { "name": "service_uuid", "type": "string", "description": "UUID of the registered service principal." },
            { "name": "name", "type": "string", "description": "Service name as stored." },
            { "name": "display_name", "type": "string", "description": "Display name as stored." },
            { "name": "policy_uuid", "type": "string", "description": "UUID of the control policy." },
            { "name": "policy_name", "type": "string", "description": "Name of the control policy as stored." },
            { "name": "already_existed", "type": "bool", "description": "True when the service already existed and was returned unchanged." },
            { "name": "policy_was_attached", "type": "bool", "description": "True when this call attached the policy to the service." }
          ],
                    "requestExample": {
            "name": "maintainerd-core",
            "display_name": "Maintainerd Core",
            "description": "The platform control plane orchestrating this instance.",
            "version": "1.0.0",
            "allowed_actions": [
              "tenant:read",
              "tenant:create",
              "tenant:update",
              "service:read",
              "service:create"
            ],
            "policy_name": "core-control"
          },
          "responseExample": {
            "service_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "name": "maintainerd-core",
            "display_name": "Maintainerd Core",
            "policy_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "policy_name": "core-control",
            "already_existed": false,
            "policy_was_attached": true
          },
"errors": [
            { "code": "InvalidArgument", "description": "A required field is missing or fails validation, or allowed_actions names permissions that do not exist." },
            { "code": "AlreadyExists", "description": "Setup has completed and is locked." },
            { "code": "PermissionDenied", "description": "The orchestrated setup window has expired." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      },
      {
                "auth": "bootstrap",
"name": "EnsureControlClient",
        "request": "EnsureControlClientRequest",
        "response": "EnsureControlClientResponse",
        "details": {
          "overview": "Declaratively registers the machine client the orchestrator authenticates as for every call after setup closes. Authentication is private_key_jwt: the orchestrator generates its keypair and sends only its public JWKS, so this service never holds a credential that could impersonate it.",
          "notes": [
            "service_name is required: it binds the client to the service principal from RegisterControlService, which is what makes the client's tokens carry the svc claim that the authorization interceptor resolves policies by.",
            "jwks and jwks_uri are alternatives; send jwks_uri to rotate keys later without re-entering setup.",
            "Get-or-create semantics make the RPC safely retryable — there is no returned-exactly-once secret to lose.",
            "audience empty means this instance's own management audience."
          ],
          "requestFields": [
            { "name": "name", "type": "string", "required": true, "description": "Client machine name." },
            { "name": "display_name", "type": "string", "required": false, "description": "Human-readable client name." },
            { "name": "service_name", "type": "string", "required": true, "description": "Binds this client to the service principal registered by RegisterControlService." },
            { "name": "jwks", "type": "string", "required": false, "description": "The orchestrator's public JWK Set, serialized. Alternative to jwks_uri." },
            { "name": "jwks_uri", "type": "string", "required": false, "description": "HTTPS URL serving the orchestrator's public keys. Alternative to jwks." },
            { "name": "audience", "type": "string", "required": false, "description": "API identifier tokens for this client are minted for. Empty means the instance's own management audience." }
          ],
          "responseFields": [
            { "name": "client_uuid", "type": "string", "description": "UUID of the control client." },
            { "name": "client_id", "type": "string", "description": "OAuth client identifier the orchestrator authenticates with." },
            { "name": "token_endpoint_auth_method", "type": "string", "description": "The authentication method configured for this client (private_key_jwt)." },
            { "name": "service_uuid", "type": "string", "description": "UUID of the bound service principal." },
            { "name": "already_existed", "type": "bool", "description": "True when the client already existed and was returned unchanged." }
          ],
                    "requestExample": {
            "name": "maintainerd-core",
            "display_name": "Maintainerd Core",
            "service_name": "maintainerd-core",
            "jwks_uri": "https://core.acme.example/.well-known/jwks.json",
            "audience": "maintainerd-auth"
          },
          "responseExample": {
            "client_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
            "client_id": "core-maintainerd-core",
            "token_endpoint_auth_method": "private_key_jwt",
            "service_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "already_existed": false
          },
"errors": [
            { "code": "InvalidArgument", "description": "A required field is missing or fails validation (for example, both jwks and jwks_uri empty)." },
            { "code": "AlreadyExists", "description": "Setup has completed and is locked." },
            { "code": "PermissionDenied", "description": "The orchestrated setup window has expired." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      },
      {
                "auth": "bootstrap",
"name": "EnsureResourceAPI",
        "request": "EnsureResourceAPIRequest",
        "response": "EnsureResourceAPIResponse",
        "details": {
          "overview": "Declaratively registers an API this instance protects on the orchestrator's behalf, together with the permissions that API defines. Core is not only a client of Auth — it is also a resource server whose own users are authorized by permissions that live here.",
          "notes": [
            "identifier is the API's audience value (aud) in issued tokens.",
            "Get-or-create: a retry after a lost response returns the same API and permissions.",
            "service_name references the service principal from RegisterControlService."
          ],
          "requestFields": [
            { "name": "service_name", "type": "string", "required": true, "description": "Name of the service principal the API belongs to." },
            { "name": "service_display_name", "type": "string", "required": false, "description": "Display name for the service when it must be created." },
            { "name": "name", "type": "string", "required": true, "description": "API machine name." },
            { "name": "display_name", "type": "string", "required": false, "description": "Human-readable API name." },
            { "name": "identifier", "type": "string", "required": true, "description": "The API's audience value (aud) in issued tokens." },
            { "name": "permissions", "type": "repeated EnsureResourceAPIPermission", "required": false, "description": "Permissions this API defines." },
            { "name": "permissions[].name", "type": "string", "required": true, "description": "Permission name." },
            { "name": "permissions[].description", "type": "string", "required": false, "description": "Permission description." }
          ],
          "responseFields": [
            { "name": "service_uuid", "type": "string", "description": "UUID of the owning service principal." },
            { "name": "api_uuid", "type": "string", "description": "UUID of the registered API." },
            { "name": "identifier", "type": "string", "description": "The API audience identifier." },
            { "name": "permission_names", "type": "repeated string", "description": "Names of the permissions registered under the API." },
            { "name": "already_existed", "type": "bool", "description": "True when the API already existed and was returned unchanged." }
          ],
                    "requestExample": {
            "service_name": "maintainerd-core",
            "service_display_name": "Maintainerd Core",
            "name": "core-api",
            "display_name": "Core API",
            "identifier": "maintainerd-core-api",
            "permissions": [
              {
                "name": "projects:read",
                "description": "Read projects"
              },
              {
                "name": "projects:write",
                "description": "Create and update projects"
              }
            ]
          },
          "responseExample": {
            "service_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "api_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "identifier": "maintainerd-core-api",
            "permission_names": [
              "projects:read",
              "projects:write"
            ],
            "already_existed": false
          },
"errors": [
            { "code": "InvalidArgument", "description": "A required field is missing or fails validation." },
            { "code": "AlreadyExists", "description": "Setup has completed and is locked." },
            { "code": "PermissionDenied", "description": "The orchestrated setup window has expired." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      },
      {
                "auth": "bootstrap",
"name": "EnsureRole",
        "request": "EnsureRoleRequest",
        "response": "EnsureRoleResponse",
        "details": {
          "overview": "Declaratively creates a role carrying the given permissions and optionally grants it to a user — how Core gives its first administrator full access to itself.",
          "notes": [
            "assign_to_user_uuid is a UUID rather than a username so it can only name a principal the caller already created in this same setup window.",
            "Get-or-create and grant semantics: assigned and already_existed let a retry tell a fresh grant from a replay."
          ],
          "requestFields": [
            { "name": "name", "type": "string", "required": true, "description": "Role name." },
            { "name": "description", "type": "string", "required": false, "description": "Role description." },
            { "name": "permission_names", "type": "repeated string", "required": false, "description": "Permission names the role carries." },
            { "name": "assign_to_user_uuid", "type": "string", "required": false, "description": "UUID of the user the role should be granted to." }
          ],
          "responseFields": [
            { "name": "role_uuid", "type": "string", "description": "UUID of the role." },
            { "name": "name", "type": "string", "description": "Role name as stored." },
            { "name": "permission_names", "type": "repeated string", "description": "Permission names the role carries." },
            { "name": "assigned", "type": "bool", "description": "True when the role was granted to the requested user." },
            { "name": "already_existed", "type": "bool", "description": "True when the role already existed." }
          ],
                    "requestExample": {
            "name": "core-admin",
            "description": "Full access to the core control plane",
            "permission_names": [
              "projects:read",
              "projects:write"
            ],
            "assign_to_user_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          },
          "responseExample": {
            "role_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
            "name": "core-admin",
            "permission_names": [
              "projects:read",
              "projects:write"
            ],
            "assigned": true,
            "already_existed": false
          },
"errors": [
            { "code": "InvalidArgument", "description": "A required field is missing or fails validation." },
            { "code": "NotFound", "description": "The user named by assign_to_user_uuid was not found." },
            { "code": "AlreadyExists", "description": "Setup has completed and is locked." },
            { "code": "PermissionDenied", "description": "The orchestrated setup window has expired." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      },
      {
                "auth": "bootstrap",
"name": "EnsureConsoleClient",
        "request": "EnsureConsoleClientRequest",
        "response": "EnsureConsoleClientResponse",
        "details": {
          "overview": "Declaratively registers the browser application Core's operators sign in to, which authenticates against this service over OIDC.",
          "notes": [
            "The client is PUBLIC: a single-page app cannot keep a secret, so it uses authorization_code with PKCE (S256) and no credential. No secret is issued or returned.",
            "domain is the site the app is served from and also decides first-party status.",
            "Get-or-create: retryable with already_existed in the response."
          ],
          "requestFields": [
            { "name": "name", "type": "string", "required": true, "description": "Client machine name." },
            { "name": "display_name", "type": "string", "required": false, "description": "Human-readable client name." },
            { "name": "domain", "type": "string", "required": true, "description": "The site the app is served from; also decides first-party status." },
            { "name": "redirect_uris", "type": "repeated string", "required": false, "description": "Registered OIDC callback URLs." },
            { "name": "post_logout_redirect_uris", "type": "repeated string", "required": false, "description": "Registered post-logout return URLs." }
          ],
          "responseFields": [
            { "name": "client_uuid", "type": "string", "description": "UUID of the console client." },
            { "name": "client_id", "type": "string", "description": "OAuth client identifier the console authenticates with." },
            { "name": "redirect_uris", "type": "repeated string", "description": "Registered redirect URIs as stored." },
            { "name": "post_logout_redirect_uris", "type": "repeated string", "description": "Registered post-logout redirect URIs as stored." },
            { "name": "already_existed", "type": "bool", "description": "True when the client already existed and was returned unchanged." }
          ],
                    "requestExample": {
            "name": "core-console",
            "display_name": "Core Console",
            "domain": "console.acme.example",
            "redirect_uris": [
              "https://console.acme.example/auth/callback"
            ],
            "post_logout_redirect_uris": [
              "https://console.acme.example/logout"
            ]
          },
          "responseExample": {
            "client_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "client_id": "console-core-console",
            "redirect_uris": [
              "https://console.acme.example/auth/callback"
            ],
            "post_logout_redirect_uris": [
              "https://console.acme.example/logout"
            ],
            "already_existed": false
          },
"errors": [
            { "code": "InvalidArgument", "description": "A required field is missing or fails validation." },
            { "code": "AlreadyExists", "description": "Setup has completed and is locked." },
            { "code": "PermissionDenied", "description": "The orchestrated setup window has expired." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      },
      {
                "auth": "bootstrap",
"name": "CompleteSetup",
        "request": "CompleteSetupRequest",
        "response": "CompleteSetupResponse",
        "details": {
          "overview": "Locks setup so no further bootstrap RPCs are accepted. Tenant and administrator setup must both be finished first.",
          "notes": [
            "The lock is one-way and durable: an active system tenant is the fact every setup gate checks, so there is no separate close flag to drift.",
            "The RPC is idempotent — calling it on an already-complete instance returns is_setup_complete=true.",
            "For orchestrated instances the setup window also expires on a deadline (SETUP_WINDOW_TTL) so an abandoned provision fails closed."
          ],
          "requestFields": [],
          "responseFields": [
            { "name": "is_setup_complete", "type": "bool", "description": "True once setup is locked." }
          ],
                    "requestExample": {},
          "responseExample": {
            "is_setup_complete": true
          },
"errors": [
            { "code": "InvalidArgument", "description": "Tenant and admin setup were not completed before locking." },
            { "code": "PermissionDenied", "description": "The orchestrated setup window has expired." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      }
    ]
  },
  {
    "slug": "tenants",
    "label": "Tenants",
    "description": "Tenant lifecycle and tenant membership management.",
    "rpcCount": 11,
    "rpcs": [
      {
                "permission": "",
"name": "GetDefaultTenant",
        "request": "GetDefaultTenantRequest",
        "response": "GetDefaultTenantResponse",
        "details": {
          "overview": "Returns the system tenant — the default tenant an instance resolves to when no tenant context applies.",
          "notes": [
            "Requires an authenticated actor; the system tenant lookup itself has no further authorization.",
            "The system tenant is the same record every tenant-management boundary check compares against."
          ],
          "requestFields": [],
          "responseFields": [
            { "name": "tenant", "type": "Tenant", "description": "The system tenant record." },
            { "name": "tenant.tenant_uuid", "type": "string", "description": "UUID of the tenant." },
            { "name": "tenant.name", "type": "string", "description": "Tenant name (the DNS subdomain slug)." },
            { "name": "tenant.display_name", "type": "string", "description": "Human-readable tenant name." },
            { "name": "tenant.description", "type": "string", "description": "Tenant description." },
            { "name": "tenant.status", "type": "string", "description": "Status: active, inactive, pending, or suspended." },
            { "name": "tenant.is_system", "type": "bool", "description": "True for the system tenant." },
            { "name": "tenant.metadata", "type": "google.protobuf.Struct", "description": "Free-form tenant metadata." },
            { "name": "tenant.created_at", "type": "google.protobuf.Timestamp", "description": "Creation time." },
            { "name": "tenant.updated_at", "type": "google.protobuf.Timestamp", "description": "Last update time." }
          ],
                    "requestExample": {},
          "responseExample": {
            "tenant": {
              "tenant_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "system",
              "display_name": "System",
              "description": "The platform system tenant.",
              "status": "active",
              "is_system": true,
              "metadata": {},
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-01T09:00:00Z"
            }
          },
"errors": [
            { "code": "Unauthenticated", "description": "No authenticated actor is bound to the request." },
            { "code": "NotFound", "description": "The system tenant does not exist yet (setup not completed)." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      },
      {
                "permission": "tenant:read",
"name": "ListTenants",
        "request": "ListTenantsRequest",
        "response": "ListTenantsResponse",
        "details": {
          "overview": "Lists tenants with filtering and pagination. System-tenant principals enumerate every tenant; any other principal is scoped to their own tenant only.",
          "notes": [
            "The tenant scope is resolved from the issuer-stamped tenant_id claim — it cannot be forged from the request.",
            "status accepts multiple values.",
            "Pagination defaults to page 1 and the standard page size when omitted."
          ],
          "requestFields": [
            { "name": "name", "type": "string", "required": false, "description": "Filter by tenant name." },
            { "name": "display_name", "type": "string", "required": false, "description": "Filter by display name." },
            { "name": "description", "type": "string", "required": false, "description": "Filter by description." },
            { "name": "status", "type": "repeated string", "required": false, "description": "Filter by status: active, inactive, pending, suspended." },
            { "name": "is_system", "type": "optional bool", "required": false, "description": "Filter by system flag." },
            { "name": "pagination.page", "type": "int32", "required": false, "description": "Page number, starting at 1." },
            { "name": "pagination.limit", "type": "int32", "required": false, "description": "Page size." },
            { "name": "pagination.sort_by", "type": "string", "required": false, "description": "Sort field." },
            { "name": "pagination.sort_order", "type": "string", "required": false, "description": "Sort direction: asc or desc." }
          ],
          "responseFields": [
            { "name": "tenants", "type": "repeated Tenant", "description": "The matching tenant records." },
            { "name": "page.total", "type": "int64", "description": "Total matching tenants." },
            { "name": "page.page", "type": "int32", "description": "Current page." },
            { "name": "page.limit", "type": "int32", "description": "Page size." },
            { "name": "page.total_pages", "type": "int32", "description": "Total page count." }
          ],
                    "requestExample": {
            "status": [
              "active"
            ],
            "pagination": {
              "page": 1,
              "limit": 20,
              "sort_by": "created_at",
              "sort_order": "desc"
            }
          },
          "responseExample": {
            "tenants": [
              {
                "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
                "name": "acme",
                "display_name": "Acme Inc.",
                "description": "Acme tenant",
                "status": "active",
                "is_system": false,
                "metadata": {},
                "created_at": "2026-08-01T09:00:00Z",
                "updated_at": "2026-08-10T09:00:00Z"
              }
            ],
            "page": {
              "total": 1,
              "page": 1,
              "limit": 20,
              "total_pages": 1
            }
          },
"errors": [
            { "code": "Unauthenticated", "description": "No authenticated actor is bound to the request." },
            { "code": "InvalidArgument", "description": "Filter or pagination validation failed." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      },
      {
                "permission": "tenant:read",
"name": "GetTenant",
        "request": "GetTenantRequest",
        "response": "GetTenantResponse",
        "details": {
          "overview": "Returns one tenant by UUID. Non-system principals may read only their own tenant record.",
          "notes": [
            "A tenant-bound principal requesting another tenant's record is refused, not silently scoped."
          ],
          "requestFields": [
            { "name": "tenant_uuid", "type": "string", "required": true, "description": "UUID of the tenant to read." }
          ],
          "responseFields": [
            { "name": "tenant", "type": "Tenant", "description": "The tenant record." }
          ],
                    "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d"
          },
          "responseExample": {
            "tenant": {
              "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
              "name": "acme",
              "display_name": "Acme Inc.",
              "description": "Acme tenant",
              "status": "active",
              "is_system": false,
              "metadata": {},
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          },
"errors": [
            { "code": "Unauthenticated", "description": "No authenticated actor is bound to the request." },
            { "code": "InvalidArgument", "description": "tenant_uuid is missing or not a valid UUID." },
            { "code": "PermissionDenied", "description": "The caller is not the system tenant and requested another tenant's record." },
            { "code": "NotFound", "description": "No tenant matches the UUID." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      },
      {
                "permission": "tenant:create",
"name": "CreateTenant",
        "request": "TenantServiceCreateTenantRequest",
        "response": "TenantServiceCreateTenantResponse",
        "details": {
          "overview": "Creates a tenant. Only system-tenant principals may create tenants; the new tenant's name is the DNS subdomain slug used to resolve incoming hosts.",
          "notes": [
            "The name is security-critical: it becomes the tenant subdomain, so reserved platform slugs (system, console, api, control, auth, www, admin, root, rabbitmq, prometheus, grafana, signoz, and others) are rejected.",
            "Authorization runs before validation so an unauthorized caller cannot consume an otherwise-valid name.",
            "Creation seeds the tenant's default identity provider and other baseline records."
          ],
          "requestFields": [
            { "name": "name", "type": "string", "required": true, "description": "Tenant name. 3-63 characters: lowercase letters, numbers, and hyphens, starting and ending with an alphanumeric. Reserved slugs are rejected." },
            { "name": "display_name", "type": "string", "required": false, "description": "Human-readable tenant name." },
            { "name": "description", "type": "string", "required": true, "description": "Description. 8-200 characters." },
            { "name": "status", "type": "string", "required": true, "description": "Status: active, inactive, pending, or suspended." }
          ],
          "responseFields": [
            { "name": "tenant", "type": "Tenant", "description": "The created tenant record." }
          ],
                    "requestExample": {
            "name": "beta",
            "display_name": "Beta Program",
            "description": "Beta program tenant",
            "status": "active"
          },
          "responseExample": {
            "tenant": {
              "tenant_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
              "name": "beta",
              "display_name": "Beta Program",
              "description": "Beta program tenant",
              "status": "active",
              "is_system": false,
              "metadata": {},
              "created_at": "2026-08-15T09:00:00Z",
              "updated_at": "2026-08-15T09:00:00Z"
            }
          },
"errors": [
            { "code": "Unauthenticated", "description": "No authenticated actor is bound to the request." },
            { "code": "PermissionDenied", "description": "The caller is not a member of the system tenant." },
            { "code": "InvalidArgument", "description": "A required field is missing or fails validation, including reserved names." },
            { "code": "AlreadyExists", "description": "A tenant with this name already exists." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      },
      {
                "permission": "tenant:update",
"name": "UpdateTenant",
        "request": "TenantServiceUpdateTenantRequest",
        "response": "TenantServiceUpdateTenantResponse",
        "details": {
          "overview": "Updates a tenant's name, display name, description, and status. The caller must be a system-tenant principal or a member of the target tenant with management rights.",
          "notes": [
            "Renaming changes the tenant's DNS subdomain slug, so the same name rules as creation apply.",
            "The tenant-management boundary is enforced before any field is touched."
          ],
          "requestFields": [
            { "name": "tenant_uuid", "type": "string", "required": true, "description": "UUID of the tenant to update." },
            { "name": "name", "type": "string", "required": true, "description": "Tenant name. 3-63 characters DNS-safe slug; reserved slugs rejected." },
            { "name": "display_name", "type": "string", "required": false, "description": "Human-readable tenant name." },
            { "name": "description", "type": "string", "required": true, "description": "Description. 8-200 characters." },
            { "name": "status", "type": "string", "required": true, "description": "Status: active, inactive, pending, or suspended." }
          ],
          "responseFields": [
            { "name": "tenant", "type": "Tenant", "description": "The updated tenant record." }
          ],
                    "requestExample": {
            "tenant_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
            "name": "beta",
            "display_name": "Beta Program",
            "description": "Beta program tenant (updated)",
            "status": "active"
          },
          "responseExample": {
            "tenant": {
              "tenant_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
              "name": "beta",
              "display_name": "Beta Program",
              "description": "Beta program tenant (updated)",
              "status": "active",
              "is_system": false,
              "metadata": {},
              "created_at": "2026-08-15T09:00:00Z",
              "updated_at": "2026-08-15T09:30:00Z"
            }
          },
"errors": [
            { "code": "Unauthenticated", "description": "No authenticated actor is bound to the request." },
            { "code": "PermissionDenied", "description": "The caller is neither a system-tenant principal nor a manager of the target tenant." },
            { "code": "InvalidArgument", "description": "A required field is missing or fails validation." },
            { "code": "AlreadyExists", "description": "The new name collides with another tenant." },
            { "code": "NotFound", "description": "No tenant matches the UUID." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      },
      {
                "permission": "tenant:update",
        "stepUp": true,
"name": "SetTenantStatus",
        "request": "SetTenantStatusRequest",
        "response": "SetTenantStatusResponse",
        "details": {
          "overview": "Updates only a tenant's status. Changing status affects login availability and maintenance behavior immediately.",
          "notes": [
            "The tenant-management boundary applies exactly as on UpdateTenant.",
            "The system tenant's active status is the durable setup-complete fact, so it cannot be moved to inactive through this RPC."
          ],
          "requestFields": [
            { "name": "tenant_uuid", "type": "string", "required": true, "description": "UUID of the tenant." },
            { "name": "status", "type": "string", "required": true, "description": "Status: active, inactive, pending, or suspended." }
          ],
          "responseFields": [
            { "name": "tenant", "type": "Tenant", "description": "The updated tenant record." }
          ],
                    "requestExample": {
            "tenant_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
            "status": "suspended"
          },
          "responseExample": {
            "tenant": {
              "tenant_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
              "name": "beta",
              "display_name": "Beta Program",
              "description": "Beta program tenant (updated)",
              "status": "suspended",
              "is_system": false,
              "metadata": {},
              "created_at": "2026-08-15T09:00:00Z",
              "updated_at": "2026-08-15T10:00:00Z"
            }
          },
"errors": [
            { "code": "Unauthenticated", "description": "No authenticated actor is bound to the request." },
            { "code": "PermissionDenied", "description": "The caller cannot manage the target tenant." },
            { "code": "InvalidArgument", "description": "tenant_uuid or status is missing or invalid." },
            { "code": "NotFound", "description": "No tenant matches the UUID." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      },
      {
                "permission": "tenant:delete",
        "stepUp": true,
        "actorRequired": true,
"name": "DeleteTenant",
        "request": "DeleteTenantRequest",
        "response": "DeleteTenantResponse",
        "details": {
          "overview": "Soft-deletes a tenant. Only system-tenant principals may delete tenants, and the system tenant itself cannot be deleted.",
          "notes": [
            "The acting user must be resolvable from the verified token — the request body's actor_user_uuid is never trusted for attribution.",
            "Deleting a tenant takes its users, clients, and configuration out of service."
          ],
          "requestFields": [
            { "name": "tenant_uuid", "type": "string", "required": true, "description": "UUID of the tenant to delete." },
            { "name": "actor_user_uuid", "type": "string", "required": false, "description": "Reserved field; attribution is taken from the authenticated token, never from the body." }
          ],
          "responseFields": [
            { "name": "tenant", "type": "Tenant", "description": "The deleted tenant record." }
          ],
                    "requestExample": {
            "tenant_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d"
          },
          "responseExample": {
            "tenant": {
              "tenant_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
              "name": "beta",
              "display_name": "Beta Program",
              "description": "Beta program tenant (updated)",
              "status": "suspended",
              "is_system": false,
              "metadata": {},
              "created_at": "2026-08-15T09:00:00Z",
              "updated_at": "2026-08-15T10:10:00Z"
            }
          },
"errors": [
            { "code": "Unauthenticated", "description": "No authenticated actor is bound to the request." },
            { "code": "PermissionDenied", "description": "The caller is not a system-tenant principal or administrator." },
            { "code": "InvalidArgument", "description": "tenant_uuid is missing or invalid, or the target is the system tenant." },
            { "code": "NotFound", "description": "No tenant matches the UUID." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      },
      {
                "permission": "tenant:read",
"name": "ListTenantMembers",
        "request": "ListTenantMembersRequest",
        "response": "ListTenantMembersResponse",
        "details": {
          "overview": "Lists a tenant's members with an optional role filter and pagination. The caller must be a system-tenant principal or a member of the target tenant with management rights.",
          "notes": [
            "Each member row carries the resolved user projection (username, email, verification flags, status)."
          ],
          "requestFields": [
            { "name": "tenant_uuid", "type": "string", "required": true, "description": "UUID of the tenant whose members are listed." },
            { "name": "role", "type": "string", "required": false, "description": "Filter by role: owner, admin, or member." },
            { "name": "pagination", "type": "Pagination", "required": false, "description": "Standard pagination." }
          ],
          "responseFields": [
            { "name": "members", "type": "repeated TenantMember", "description": "The matching member records." },
            { "name": "members[].tenant_member_uuid", "type": "string", "description": "UUID of the membership record." },
            { "name": "members[].role", "type": "string", "description": "Membership role: owner, admin, or member." },
            { "name": "members[].user", "type": "TenantMemberUser", "description": "The resolved user record." },
            { "name": "members[].user.user_uuid", "type": "string", "description": "UUID of the user." },
            { "name": "members[].user.username", "type": "string", "description": "Username." },
            { "name": "members[].user.fullname", "type": "string", "description": "Full name." },
            { "name": "members[].user.email", "type": "string", "description": "Email address." },
            { "name": "members[].user.phone", "type": "string", "description": "Phone number." },
            { "name": "members[].user.is_email_verified", "type": "bool", "description": "Email verification state." },
            { "name": "members[].user.is_phone_verified", "type": "bool", "description": "Phone verification state." },
            { "name": "members[].user.is_profile_completed", "type": "bool", "description": "Profile completion state." },
            { "name": "members[].user.is_account_completed", "type": "bool", "description": "Account completion state." },
            { "name": "members[].user.status", "type": "string", "description": "User account status." },
            { "name": "page", "type": "PageMetadata", "description": "Pagination metadata." }
          ],
                    "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "role": "admin",
            "pagination": {
              "page": 1,
              "limit": 20
            }
          },
          "responseExample": {
            "members": [
              {
                "tenant_member_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "role": "admin",
                "user": {
                  "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                  "username": "admin",
                  "fullname": "Acme Administrator",
                  "email": "admin@acme.example",
                  "phone": "+15551234567",
                  "is_email_verified": true,
                  "is_phone_verified": false,
                  "is_profile_completed": true,
                  "is_account_completed": true,
                  "status": "active",
                  "metadata": {},
                  "created_at": "2026-08-01T09:00:00Z",
                  "updated_at": "2026-08-01T09:00:00Z"
                },
                "created_at": "2026-08-01T09:00:00Z",
                "updated_at": "2026-08-01T09:00:00Z"
              }
            ],
            "page": {
              "total": 1,
              "page": 1,
              "limit": 20,
              "total_pages": 1
            }
          },
"errors": [
            { "code": "Unauthenticated", "description": "No authenticated actor is bound to the request." },
            { "code": "PermissionDenied", "description": "The caller cannot manage the target tenant." },
            { "code": "InvalidArgument", "description": "tenant_uuid or the role filter is invalid." },
            { "code": "NotFound", "description": "No tenant matches the UUID." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      },
      {
                "permission": "tenant:update",
        "actorRequired": true,
"name": "AddTenantMember",
        "request": "AddTenantMemberRequest",
        "response": "AddTenantMemberResponse",
        "details": {
          "overview": "Adds a user to a tenant with a membership role. The user must already exist in the system tenant before they can be added to another tenant.",
          "notes": [
            "Assigning the owner role is restricted to system-tenant administrators, and a tenant can hold only one owner — use UpdateTenantMemberRole for ownership transfers.",
            "The acting user comes from the verified token, never from actor_user_uuid in the body.",
            "System-tenant ownership can only be established during initial setup."
          ],
          "requestFields": [
            { "name": "tenant_uuid", "type": "string", "required": true, "description": "UUID of the target tenant." },
            { "name": "user_uuid", "type": "string", "required": true, "description": "UUID of the user to add." },
            { "name": "role", "type": "string", "required": true, "description": "Role: owner, admin, or member." },
            { "name": "actor_user_uuid", "type": "string", "required": false, "description": "Reserved field; attribution is taken from the authenticated token." }
          ],
          "responseFields": [
            { "name": "member", "type": "TenantMember", "description": "The created membership record." }
          ],
                    "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
            "role": "member"
          },
          "responseExample": {
            "member": {
              "tenant_member_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "role": "member",
              "user": {
                "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                "username": "admin",
                "fullname": "Acme Administrator",
                "email": "admin@acme.example",
                "phone": "+15551234567",
                "is_email_verified": true,
                "is_phone_verified": false,
                "is_profile_completed": true,
                "is_account_completed": true,
                "status": "active",
                "metadata": {},
                "created_at": "2026-08-01T09:00:00Z",
                "updated_at": "2026-08-01T09:00:00Z"
              },
              "created_at": "2026-08-15T09:00:00Z",
              "updated_at": "2026-08-15T09:00:00Z"
            }
          },
"errors": [
            { "code": "Unauthenticated", "description": "No authenticated actor is bound to the request." },
            { "code": "PermissionDenied", "description": "The caller cannot manage the tenant, or is not a system-tenant administrator while assigning the owner role." },
            { "code": "InvalidArgument", "description": "A required field is missing or the role is invalid." },
            { "code": "NotFound", "description": "The tenant or user does not exist." },
            { "code": "AlreadyExists", "description": "The user is already a member of the tenant." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      },
      {
                "permission": "tenant:update",
        "actorRequired": true,
"name": "UpdateTenantMemberRole",
        "request": "UpdateTenantMemberRoleRequest",
        "response": "UpdateTenantMemberRoleResponse",
        "details": {
          "overview": "Changes a member's role within a tenant. This is also how ownership is transferred: assigning owner to a member replaces the previous owner.",
          "notes": [
            "Only system-tenant administrators can assign the owner role.",
            "The acting user comes from the verified token."
          ],
          "requestFields": [
            { "name": "tenant_uuid", "type": "string", "required": true, "description": "UUID of the target tenant." },
            { "name": "tenant_member_uuid", "type": "string", "required": true, "description": "UUID of the membership record." },
            { "name": "role", "type": "string", "required": true, "description": "New role: owner, admin, or member." },
            { "name": "actor_user_uuid", "type": "string", "required": false, "description": "Reserved field; attribution is taken from the authenticated token." }
          ],
          "responseFields": [
            { "name": "member", "type": "TenantMember", "description": "The updated membership record." }
          ],
                    "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "tenant_member_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "role": "admin"
          },
          "responseExample": {
            "member": {
              "tenant_member_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "role": "admin",
              "user": {
                "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                "username": "admin",
                "fullname": "Acme Administrator",
                "email": "admin@acme.example",
                "phone": "+15551234567",
                "is_email_verified": true,
                "is_phone_verified": false,
                "is_profile_completed": true,
                "is_account_completed": true,
                "status": "active",
                "metadata": {},
                "created_at": "2026-08-01T09:00:00Z",
                "updated_at": "2026-08-01T09:00:00Z"
              },
              "created_at": "2026-08-15T09:00:00Z",
              "updated_at": "2026-08-15T09:30:00Z"
            }
          },
"errors": [
            { "code": "Unauthenticated", "description": "No authenticated actor is bound to the request." },
            { "code": "PermissionDenied", "description": "The caller cannot manage the tenant, or is not a system-tenant administrator while assigning the owner role." },
            { "code": "InvalidArgument", "description": "A required field is missing or the role is invalid." },
            { "code": "NotFound", "description": "The tenant or membership record does not exist." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      },
      {
                "permission": "tenant:update",
        "actorRequired": true,
"name": "RemoveTenantMember",
        "request": "RemoveTenantMemberRequest",
        "response": "RemoveTenantMemberResponse",
        "details": {
          "overview": "Removes a member from a tenant. The acting user comes from the verified token.",
          "notes": [
            "Removal is guarded by the same tenant-management boundary as the other member RPCs."
          ],
          "requestFields": [
            { "name": "tenant_uuid", "type": "string", "required": true, "description": "UUID of the target tenant." },
            { "name": "tenant_member_uuid", "type": "string", "required": true, "description": "UUID of the membership record to remove." },
            { "name": "actor_user_uuid", "type": "string", "required": false, "description": "Reserved field; attribution is taken from the authenticated token." }
          ],
          "responseFields": [
            { "name": "removed", "type": "bool", "description": "Always true on success." }
          ],
                    "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "tenant_member_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          },
          "responseExample": {
            "removed": true
          },
"errors": [
            { "code": "Unauthenticated", "description": "No authenticated actor is bound to the request." },
            { "code": "PermissionDenied", "description": "The caller cannot manage the target tenant." },
            { "code": "InvalidArgument", "description": "tenant_uuid or tenant_member_uuid is missing or invalid." },
            { "code": "NotFound", "description": "The tenant or membership record does not exist." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      }
    ]
  },
  {
    "slug": "tenant-settings",
    "proto": "tenant.proto",
    "label": "Tenant Settings",
    "description": "Per-tenant runtime controls for rate limiting, audit behavior, and maintenance windows.",
    "rpcCount": 6,
    "rpcs": [
      {
        "permission": "tenant-setting:read",
        "name": "GetRateLimitConfig",
        "request": "GetRateLimitConfigRequest",
        "response": "GetRateLimitConfigResponse",
        "details": {
          "overview": "Returns the tenant's rate-limit configuration: the per-window request budget, window length, per-IP enforcement, exempt IPs, and per-endpoint overrides.",
          "notes": [
            "The tenant-management boundary applies: the caller must be a system-tenant principal or a member of the target tenant.",
            "Unlike the REST surface (which resolves the tenant from context), the tenant is named by tenant_uuid in the request.",
            "If the tenant setting row does not exist yet, the default config is created before returning it."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant whose settings are being read or updated."
            },
            {
              "name": "config.enabled",
              "type": "boolean",
              "required": false,
              "description": "Master switch for tenant rate limiting."
            },
            {
              "name": "config.requests_per_window",
              "type": "number",
              "required": false,
              "description": "Request budget per window. 1-100000."
            },
            {
              "name": "config.window_duration_seconds",
              "type": "number",
              "required": false,
              "description": "Window length in seconds. 1-3600."
            },
            {
              "name": "config.per_ip",
              "type": "boolean",
              "required": false,
              "description": "Apply the budget per IP instead of per tenant."
            },
            {
              "name": "config.exempt_ips",
              "type": "array of strings",
              "required": false,
              "description": "IP addresses exempt from rate limiting."
            },
            {
              "name": "config.endpoint_overrides",
              "type": "object",
              "required": false,
              "description": "Per-endpoint overrides: keys are endpoint names, values are positive integer budgets."
            }
          ],
          "responseFields": [
            {
              "name": "config",
              "type": "google.protobuf.Struct",
              "description": "The full configuration object after the operation."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller is neither a system-tenant principal nor a member of the target tenant with management rights."
            },
            {
              "code": "InvalidArgument",
              "description": "tenant_uuid is missing or invalid, or the config contains unknown or invalid fields."
            },
            {
              "code": "NotFound",
              "description": "No tenant matches the UUID."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "config": {}
          },
          "responseExample": {
            "config": {
              "enabled": false,
              "requests_per_window": 100,
              "window_duration_seconds": 60,
              "per_ip": true,
              "exempt_ips": [],
              "endpoint_overrides": {}
            }
          }
        }
      },
      {
        "permission": "tenant-setting:update",
        "name": "UpdateRateLimitConfig",
        "request": "UpdateRateLimitConfigRequest",
        "response": "UpdateRateLimitConfigResponse",
        "details": {
          "overview": "Updates the tenant's rate-limit configuration. The submitted keys are merged over the stored config and the full result is returned.",
          "notes": [
            "The tenant-management boundary applies: the caller must be a system-tenant principal or a member of the target tenant.",
            "The config object is validated with the same per-section rules as the REST surface; unknown fields are rejected and field-level violations are carried in the BadRequest detail.",
            "Updates merge the submitted keys into the stored config; omitted keys keep their previous values.",
            "The response returns the full config after the merge."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant whose settings are being read or updated."
            },
            {
              "name": "config",
              "type": "google.protobuf.Struct",
              "required": true,
              "description": "Rate-limit configuration object. Unknown fields are rejected; omitted keys keep their stored values."
            },
            {
              "name": "config.enabled",
              "type": "boolean",
              "required": false,
              "description": "Master switch for tenant rate limiting."
            },
            {
              "name": "config.requests_per_window",
              "type": "number",
              "required": false,
              "description": "Request budget per window. 1-100000."
            },
            {
              "name": "config.window_duration_seconds",
              "type": "number",
              "required": false,
              "description": "Window length in seconds. 1-3600."
            },
            {
              "name": "config.per_ip",
              "type": "boolean",
              "required": false,
              "description": "Apply the budget per IP instead of per tenant."
            },
            {
              "name": "config.exempt_ips",
              "type": "array of strings",
              "required": false,
              "description": "IP addresses exempt from rate limiting."
            },
            {
              "name": "config.endpoint_overrides",
              "type": "object",
              "required": false,
              "description": "Per-endpoint overrides: keys are endpoint names, values are positive integer budgets."
            }
          ],
          "responseFields": [
            {
              "name": "config",
              "type": "google.protobuf.Struct",
              "description": "The full configuration object after the operation."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller is neither a system-tenant principal nor a member of the target tenant with management rights."
            },
            {
              "code": "InvalidArgument",
              "description": "tenant_uuid is missing or invalid, or the config contains unknown or invalid fields."
            },
            {
              "code": "NotFound",
              "description": "No tenant matches the UUID."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "config": {
              "enabled": true,
              "requests_per_window": 300,
              "window_duration_seconds": 60,
              "per_ip": true,
              "exempt_ips": [
                "203.0.113.10"
              ]
            }
          },
          "responseExample": {
            "config": {
              "enabled": true,
              "requests_per_window": 300,
              "window_duration_seconds": 60,
              "per_ip": true,
              "exempt_ips": [
                "203.0.113.10"
              ],
              "endpoint_overrides": {}
            }
          }
        }
      },
      {
        "permission": "tenant-setting:read",
        "name": "GetAuditConfig",
        "request": "GetAuditConfigRequest",
        "response": "GetAuditConfigResponse",
        "details": {
          "overview": "Returns the tenant's audit configuration: audit enablement, PII masking, retention, log level, and audited event types.",
          "notes": [
            "The tenant-management boundary applies: the caller must be a system-tenant principal or a member of the target tenant.",
            "Unlike the REST surface (which resolves the tenant from context), the tenant is named by tenant_uuid in the request.",
            "If the tenant setting row does not exist yet, the default config is created before returning it."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant whose settings are being read or updated."
            },
            {
              "name": "config.enabled",
              "type": "boolean",
              "required": false,
              "description": "Master switch for the audit log."
            },
            {
              "name": "config.pii_masking",
              "type": "boolean",
              "required": false,
              "description": "Mask personally identifiable information in audit entries."
            },
            {
              "name": "config.retention_days",
              "type": "number",
              "required": false,
              "description": "Audit entry retention in days. 1-3650."
            },
            {
              "name": "config.log_level",
              "type": "string",
              "required": false,
              "description": "One of debug, info, warn, critical."
            },
            {
              "name": "config.event_types",
              "type": "array of strings",
              "required": false,
              "description": "Event types to audit. Each entry must be a non-empty string."
            }
          ],
          "responseFields": [
            {
              "name": "config",
              "type": "google.protobuf.Struct",
              "description": "The full configuration object after the operation."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller is neither a system-tenant principal nor a member of the target tenant with management rights."
            },
            {
              "code": "InvalidArgument",
              "description": "tenant_uuid is missing or invalid, or the config contains unknown or invalid fields."
            },
            {
              "code": "NotFound",
              "description": "No tenant matches the UUID."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "config": {}
          },
          "responseExample": {
            "config": {
              "enabled": true,
              "retention_days": 90,
              "pii_masking": true,
              "log_level": "info",
              "event_types": []
            }
          }
        }
      },
      {
        "permission": "tenant-setting:update",
        "name": "UpdateAuditConfig",
        "request": "UpdateAuditConfigRequest",
        "response": "UpdateAuditConfigResponse",
        "details": {
          "overview": "Updates the tenant's audit configuration. The submitted keys are merged over the stored config and the full result is returned.",
          "notes": [
            "The tenant-management boundary applies: the caller must be a system-tenant principal or a member of the target tenant.",
            "The config object is validated with the same per-section rules as the REST surface; unknown fields are rejected and field-level violations are carried in the BadRequest detail.",
            "Updates merge the submitted keys into the stored config; omitted keys keep their previous values.",
            "The response returns the full config after the merge."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant whose settings are being read or updated."
            },
            {
              "name": "config",
              "type": "google.protobuf.Struct",
              "required": true,
              "description": "Audit configuration object. Unknown fields are rejected; omitted keys keep their stored values."
            },
            {
              "name": "config.enabled",
              "type": "boolean",
              "required": false,
              "description": "Master switch for the audit log."
            },
            {
              "name": "config.pii_masking",
              "type": "boolean",
              "required": false,
              "description": "Mask personally identifiable information in audit entries."
            },
            {
              "name": "config.retention_days",
              "type": "number",
              "required": false,
              "description": "Audit entry retention in days. 1-3650."
            },
            {
              "name": "config.log_level",
              "type": "string",
              "required": false,
              "description": "One of debug, info, warn, critical."
            },
            {
              "name": "config.event_types",
              "type": "array of strings",
              "required": false,
              "description": "Event types to audit. Each entry must be a non-empty string."
            }
          ],
          "responseFields": [
            {
              "name": "config",
              "type": "google.protobuf.Struct",
              "description": "The full configuration object after the operation."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller is neither a system-tenant principal nor a member of the target tenant with management rights."
            },
            {
              "code": "InvalidArgument",
              "description": "tenant_uuid is missing or invalid, or the config contains unknown or invalid fields."
            },
            {
              "code": "NotFound",
              "description": "No tenant matches the UUID."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "config": {
              "retention_days": 180,
              "log_level": "warn"
            }
          },
          "responseExample": {
            "config": {
              "enabled": true,
              "retention_days": 180,
              "pii_masking": true,
              "log_level": "warn",
              "event_types": []
            }
          }
        }
      },
      {
        "permission": "tenant-setting:read",
        "name": "GetMaintenanceConfig",
        "request": "GetMaintenanceConfigRequest",
        "response": "GetMaintenanceConfigResponse",
        "details": {
          "overview": "Returns the tenant's maintenance configuration: the maintenance flag, user-facing message, and optional scheduled window.",
          "notes": [
            "The tenant-management boundary applies: the caller must be a system-tenant principal or a member of the target tenant.",
            "Unlike the REST surface (which resolves the tenant from context), the tenant is named by tenant_uuid in the request.",
            "If the tenant setting row does not exist yet, the default config is created before returning it."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant whose settings are being read or updated."
            },
            {
              "name": "config.enabled",
              "type": "boolean",
              "required": false,
              "description": "Master switch for the maintenance window."
            },
            {
              "name": "config.message",
              "type": "string",
              "required": false,
              "description": "User-facing maintenance message. Cannot be empty when present."
            },
            {
              "name": "config.scheduled_start",
              "type": "string (RFC3339) or null",
              "required": false,
              "description": "Optional scheduled start timestamp."
            },
            {
              "name": "config.scheduled_end",
              "type": "string (RFC3339) or null",
              "required": false,
              "description": "Optional scheduled end timestamp. Must be after scheduled_start when both are present."
            }
          ],
          "responseFields": [
            {
              "name": "config",
              "type": "google.protobuf.Struct",
              "description": "The full configuration object after the operation."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller is neither a system-tenant principal nor a member of the target tenant with management rights."
            },
            {
              "code": "InvalidArgument",
              "description": "tenant_uuid is missing or invalid, or the config contains unknown or invalid fields."
            },
            {
              "code": "NotFound",
              "description": "No tenant matches the UUID."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "config": {}
          },
          "responseExample": {
            "config": {
              "enabled": false,
              "message": "The system is currently undergoing maintenance. Please try again later.",
              "scheduled_start": null,
              "scheduled_end": null
            }
          }
        }
      },
      {
        "permission": "tenant-setting:update",
        "name": "UpdateMaintenanceConfig",
        "request": "UpdateMaintenanceConfigRequest",
        "response": "UpdateMaintenanceConfigResponse",
        "details": {
          "overview": "Updates the tenant's maintenance configuration. The submitted keys are merged over the stored config and the full result is returned.",
          "notes": [
            "The tenant-management boundary applies: the caller must be a system-tenant principal or a member of the target tenant.",
            "The config object is validated with the same per-section rules as the REST surface; unknown fields are rejected and field-level violations are carried in the BadRequest detail.",
            "Updates merge the submitted keys into the stored config; omitted keys keep their previous values.",
            "The response returns the full config after the merge."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant whose settings are being read or updated."
            },
            {
              "name": "config",
              "type": "google.protobuf.Struct",
              "required": true,
              "description": "Maintenance configuration object. Unknown fields are rejected; omitted keys keep their stored values."
            },
            {
              "name": "config.enabled",
              "type": "boolean",
              "required": false,
              "description": "Master switch for the maintenance window."
            },
            {
              "name": "config.message",
              "type": "string",
              "required": false,
              "description": "User-facing maintenance message. Cannot be empty when present."
            },
            {
              "name": "config.scheduled_start",
              "type": "string (RFC3339) or null",
              "required": false,
              "description": "Optional scheduled start timestamp."
            },
            {
              "name": "config.scheduled_end",
              "type": "string (RFC3339) or null",
              "required": false,
              "description": "Optional scheduled end timestamp. Must be after scheduled_start when both are present."
            }
          ],
          "responseFields": [
            {
              "name": "config",
              "type": "google.protobuf.Struct",
              "description": "The full configuration object after the operation."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller is neither a system-tenant principal nor a member of the target tenant with management rights."
            },
            {
              "code": "InvalidArgument",
              "description": "tenant_uuid is missing or invalid, or the config contains unknown or invalid fields."
            },
            {
              "code": "NotFound",
              "description": "No tenant matches the UUID."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "config": {
              "enabled": true,
              "message": "Scheduled maintenance from 02:00 to 04:00 UTC.",
              "scheduled_start": "2026-08-20T02:00:00Z",
              "scheduled_end": "2026-08-20T04:00:00Z"
            }
          },
          "responseExample": {
            "config": {
              "enabled": true,
              "message": "Scheduled maintenance from 02:00 to 04:00 UTC.",
              "scheduled_start": "2026-08-20T02:00:00Z",
              "scheduled_end": "2026-08-20T04:00:00Z"
            }
          }
        }
      },
    ]
  },
  {
    "slug": "users",
    "proto": "user.proto",
    "label": "Users",
    "description": "User account lifecycle, verification, roles, and identities.",
    "rpcCount": 14,
    "rpcs": [
      {         "permission": "user:read",
"name": "ListUsers", "request": "ListUsersRequest", "response": "ListUsersResponse" },
      {         "permission": "user:read",
"name": "GetUser", "request": "GetUserRequest", "response": "GetUserResponse" },
      {         "permission": "user:create",
"name": "CreateUser", "request": "CreateUserRequest", "response": "CreateUserResponse" },
      {         "permission": "user:update",
"name": "UpdateUser", "request": "UpdateUserRequest", "response": "UpdateUserResponse" },
      {         "permission": "user:update",
        "stepUp": true,
"name": "SetUserStatus", "request": "SetUserStatusRequest", "response": "SetUserStatusResponse" },
      {         "permission": "user:update",
"name": "VerifyUserEmail", "request": "VerifyUserEmailRequest", "response": "VerifyUserEmailResponse" },
      {         "permission": "user:update",
"name": "VerifyUserPhone", "request": "VerifyUserPhoneRequest", "response": "VerifyUserPhoneResponse" },
      {         "permission": "user:update",
"name": "CompleteUserAccount", "request": "CompleteUserAccountRequest", "response": "CompleteUserAccountResponse" },
      {         "permission": "user:delete",
        "stepUp": true,
"name": "DeleteUser", "request": "DeleteUserRequest", "response": "DeleteUserResponse" },
      {         "permission": "user:update",
        "stepUp": true,
"name": "ForceUserPasswordChange", "request": "ForceUserPasswordChangeRequest", "response": "ForceUserPasswordChangeResponse" },
      {         "permission": "user:read",
"name": "ListUserRoles", "request": "ListUserRolesRequest", "response": "ListUserRolesResponse" },
      {         "permission": "user:read",
"name": "ListUserIdentities", "request": "ListUserIdentitiesRequest", "response": "ListUserIdentitiesResponse" },
      {         "permission": "user:create",
        "stepUp": true,
        "actorRequired": true,
"name": "AssignUserRoles", "request": "AssignUserRolesRequest", "response": "AssignUserRolesResponse" },
      {         "permission": "user:create",
        "stepUp": true,
"name": "RemoveUserRole", "request": "RemoveUserRoleRequest", "response": "RemoveUserRoleResponse" }
    ]
  },
  {
    "slug": "user-profiles",
    "proto": "user.proto",
    "label": "User Profiles",
    "description": "Profile records attached to users, including default-profile selection.",
    "rpcCount": 6,
    "rpcs": [
      {         "permission": "user:read",
"name": "ListUserProfiles", "request": "ListUserProfilesRequest", "response": "ListUserProfilesResponse" },
      {         "permission": "user:read",
"name": "GetUserProfile", "request": "GetUserProfileRequest", "response": "GetUserProfileResponse" },
      {         "permission": "user:update",
"name": "CreateUserProfile", "request": "CreateUserProfileRequest", "response": "CreateUserProfileResponse" },
      {         "permission": "user:update",
"name": "UpdateUserProfile", "request": "UpdateUserProfileRequest", "response": "UpdateUserProfileResponse" },
      {         "permission": "user:update",
"name": "SetDefaultUserProfile", "request": "SetDefaultUserProfileRequest", "response": "SetDefaultUserProfileResponse" },
      {         "permission": "user:delete",
"name": "DeleteUserProfile", "request": "DeleteUserProfileRequest", "response": "DeleteUserProfileResponse" }
    ]
  },
  {
    "slug": "clients",
    "proto": "client.proto",
    "label": "Applications and Clients",
    "description": "OAuth client lifecycle, secrets, URIs, API audiences, and API permissions.",
    "rpcCount": 19,
    "rpcs": [
      {         "permission": "client:read",
"name": "ListClients", "request": "ListClientsRequest", "response": "ListClientsResponse" },
      {         "permission": "client:read",
"name": "GetClient", "request": "GetClientRequest", "response": "GetClientResponse" },
      {         "permission": "client:secret:read",
        "stepUp": true,
"name": "GetClientSecret", "request": "GetClientSecretRequest", "response": "GetClientSecretResponse" },
      {         "permission": "client:secret:rotate",
        "stepUp": true,
"name": "RotateClientSecret", "request": "RotateClientSecretRequest", "response": "RotateClientSecretResponse" },
      {         "permission": "client:config:read",
"name": "GetClientConfig", "request": "GetClientConfigRequest", "response": "GetClientConfigResponse" },
      {         "permission": "client:create",
"name": "CreateClient", "request": "CreateClientRequest", "response": "CreateClientResponse" },
      {         "permission": "client:update",
"name": "UpdateClient", "request": "UpdateClientRequest", "response": "UpdateClientResponse" },
      {         "permission": "client:update",
"name": "SetClientStatus", "request": "SetClientStatusRequest", "response": "SetClientStatusResponse" },
      {         "permission": "client:delete",
"name": "DeleteClient", "request": "DeleteClientRequest", "response": "DeleteClientResponse" },
      {         "permission": "client:uri:read",
"name": "ListClientURIs", "request": "ListClientURIsRequest", "response": "ListClientURIsResponse" },
      {         "permission": "client:uri:create",
"name": "CreateClientURI", "request": "CreateClientURIRequest", "response": "CreateClientURIResponse" },
      {         "permission": "client:uri:update",
"name": "UpdateClientURI", "request": "UpdateClientURIRequest", "response": "UpdateClientURIResponse" },
      {         "permission": "client:uri:delete",
"name": "DeleteClientURI", "request": "DeleteClientURIRequest", "response": "DeleteClientURIResponse" },
      {         "permission": "client:api:read",
"name": "ListClientAPIs", "request": "ListClientAPIsRequest", "response": "ListClientAPIsResponse" },
      {         "permission": "client:api:create",
"name": "AddClientAPIs", "request": "AddClientAPIsRequest", "response": "AddClientAPIsResponse" },
      {         "permission": "client:api:delete",
"name": "RemoveClientAPI", "request": "RemoveClientAPIRequest", "response": "RemoveClientAPIResponse" },
      {         "permission": "client:api:permission:read",
"name": "ListClientAPIPermissions", "request": "ListClientAPIPermissionsRequest", "response": "ListClientAPIPermissionsResponse" },
      {         "permission": "client:api:permission:create",
"name": "AddClientAPIPermissions", "request": "AddClientAPIPermissionsRequest", "response": "AddClientAPIPermissionsResponse" },
      {         "permission": "client:api:permission:delete",
"name": "RemoveClientAPIPermission", "request": "RemoveClientAPIPermissionRequest", "response": "RemoveClientAPIPermissionResponse" }
    ]
  },
  {
    "slug": "services",
    "proto": "service.proto",
    "label": "Services",
    "description": "Service principals, policy bundles, and service-to-policy bindings.",
    "rpcCount": 9,
    "rpcs": [
      {         "permission": "",
"name": "GetMyPolicyBundle", "request": "GetMyPolicyBundleRequest", "response": "GetMyPolicyBundleResponse" },
      {         "permission": "service:read",
"name": "ListServices", "request": "ListServicesRequest", "response": "ListServicesResponse" },
      {         "permission": "service:read",
"name": "GetService", "request": "GetServiceRequest", "response": "GetServiceResponse" },
      {         "permission": "service:create",
"name": "CreateService", "request": "CreateServiceRequest", "response": "CreateServiceResponse" },
      {         "permission": "service:update",
"name": "UpdateService", "request": "UpdateServiceRequest", "response": "UpdateServiceResponse" },
      {         "permission": "service:update",
"name": "SetServiceStatus", "request": "SetServiceStatusRequest", "response": "SetServiceStatusResponse" },
      {         "permission": "service:delete",
"name": "DeleteService", "request": "DeleteServiceRequest", "response": "DeleteServiceResponse" },
      {         "permission": "service:policy:assign",
"name": "AssignServicePolicy", "request": "AssignServicePolicyRequest", "response": "AssignServicePolicyResponse" },
      {         "permission": "service:policy:remove",
"name": "RemoveServicePolicy", "request": "RemoveServicePolicyRequest", "response": "RemoveServicePolicyResponse" }
    ]
  },
  {
    "slug": "apis",
    "proto": "api.proto",
    "label": "APIs",
    "description": "API resource definitions used as token audiences.",
    "rpcCount": 6,
    "rpcs": [
      {         "permission": "api:read",
"name": "ListAPIs", "request": "ListAPIsRequest", "response": "ListAPIsResponse" },
      {         "permission": "api:read",
"name": "GetAPI", "request": "GetAPIRequest", "response": "GetAPIResponse" },
      {         "permission": "api:create",
"name": "CreateAPI", "request": "CreateAPIRequest", "response": "CreateAPIResponse" },
      {         "permission": "api:update",
"name": "UpdateAPI", "request": "UpdateAPIRequest", "response": "UpdateAPIResponse" },
      {         "permission": "api:update",
"name": "SetAPIStatus", "request": "SetAPIStatusRequest", "response": "SetAPIStatusResponse" },
      {         "permission": "api:delete",
"name": "DeleteAPI", "request": "DeleteAPIRequest", "response": "DeleteAPIResponse" }
    ]
  },
  {
    "slug": "permissions",
    "proto": "permission.proto",
    "label": "Permissions",
    "description": "Permission definitions scoped to API resources.",
    "rpcCount": 6,
    "rpcs": [
      {         "permission": "permission:read",
"name": "ListPermissions", "request": "ListPermissionsRequest", "response": "ListPermissionsResponse" },
      {         "permission": "permission:read",
"name": "GetPermission", "request": "GetPermissionRequest", "response": "GetPermissionResponse" },
      {         "permission": "permission:create",
"name": "CreatePermission", "request": "CreatePermissionRequest", "response": "CreatePermissionResponse" },
      {         "permission": "permission:update",
"name": "UpdatePermission", "request": "UpdatePermissionRequest", "response": "UpdatePermissionResponse" },
      {         "permission": "permission:update",
"name": "SetPermissionStatus", "request": "SetPermissionStatusRequest", "response": "SetPermissionStatusResponse" },
      {         "permission": "permission:delete",
"name": "DeletePermission", "request": "DeletePermissionRequest", "response": "DeletePermissionResponse" }
    ]
  },
  {
    "slug": "roles",
    "proto": "role.proto",
    "label": "Roles",
    "description": "Role CRUD and role-permission assignment.",
    "rpcCount": 9,
    "rpcs": [
      {         "permission": "role:read",
"name": "ListRoles", "request": "ListRolesRequest", "response": "ListRolesResponse" },
      {         "permission": "role:read",
"name": "GetRole", "request": "GetRoleRequest", "response": "GetRoleResponse" },
      {         "permission": "role:create",
        "actorRequired": true,
"name": "CreateRole", "request": "CreateRoleRequest", "response": "CreateRoleResponse" },
      {         "permission": "role:update",
        "actorRequired": true,
"name": "UpdateRole", "request": "UpdateRoleRequest", "response": "UpdateRoleResponse" },
      {         "permission": "role:update",
        "actorRequired": true,
"name": "SetRoleStatus", "request": "SetRoleStatusRequest", "response": "SetRoleStatusResponse" },
      {         "permission": "role:delete",
        "actorRequired": true,
"name": "DeleteRole", "request": "DeleteRoleRequest", "response": "DeleteRoleResponse" },
      {         "permission": "role:read",
"name": "ListRolePermissions", "request": "ListRolePermissionsRequest", "response": "ListRolePermissionsResponse" },
      {         "permission": "role:permission:create",
        "actorRequired": true,
"name": "AddRolePermissions", "request": "AddRolePermissionsRequest", "response": "AddRolePermissionsResponse" },
      {         "permission": "role:permission:delete",
        "actorRequired": true,
"name": "RemoveRolePermission", "request": "RemoveRolePermissionRequest", "response": "RemoveRolePermissionResponse" }
    ]
  },
  {
    "slug": "policies",
    "proto": "policy.proto",
    "label": "Policies",
    "description": "Policy documents and the services they are bound to.",
    "rpcCount": 7,
    "rpcs": [
      {         "permission": "policy:read",
"name": "ListPolicies", "request": "ListPoliciesRequest", "response": "ListPoliciesResponse" },
      {         "permission": "policy:read",
"name": "GetPolicy", "request": "GetPolicyRequest", "response": "GetPolicyResponse" },
      {         "permission": "policy:read",
"name": "ListPolicyServices", "request": "ListPolicyServicesRequest", "response": "ListPolicyServicesResponse" },
      {         "permission": "policy:create",
"name": "CreatePolicy", "request": "CreatePolicyRequest", "response": "CreatePolicyResponse" },
      {         "permission": "policy:update",
"name": "UpdatePolicy", "request": "UpdatePolicyRequest", "response": "UpdatePolicyResponse" },
      {         "permission": "policy:update",
"name": "SetPolicyStatus", "request": "SetPolicyStatusRequest", "response": "SetPolicyStatusResponse" },
      {         "permission": "policy:delete",
"name": "DeletePolicy", "request": "DeletePolicyRequest", "response": "DeletePolicyResponse" }
    ]
  },
  {
    "slug": "workload-identity-federation",
    "proto": "workload_identity.proto",
    "label": "Workload Identity Federation",
    "description": "Trusted external OIDC issuers for workload token exchange.",
    "rpcCount": 5,
    "rpcs": [
      {         "permission": "workload-identity-federation:read",
"name": "ListWorkloadIdentityFederations", "request": "ListWorkloadIdentityFederationsRequest", "response": "ListWorkloadIdentityFederationsResponse" },
      {         "permission": "workload-identity-federation:read",
"name": "GetWorkloadIdentityFederation", "request": "GetWorkloadIdentityFederationRequest", "response": "GetWorkloadIdentityFederationResponse" },
      {         "permission": "workload-identity-federation:create",
"name": "CreateWorkloadIdentityFederation", "request": "CreateWorkloadIdentityFederationRequest", "response": "CreateWorkloadIdentityFederationResponse" },
      {         "permission": "workload-identity-federation:update",
"name": "UpdateWorkloadIdentityFederation", "request": "UpdateWorkloadIdentityFederationRequest", "response": "UpdateWorkloadIdentityFederationResponse" },
      {         "permission": "workload-identity-federation:delete",
"name": "DeleteWorkloadIdentityFederation", "request": "DeleteWorkloadIdentityFederationRequest", "response": "DeleteWorkloadIdentityFederationResponse" }
    ]
  },
  {
    "slug": "authorization",
    "proto": "authorization.proto",
    "label": "Authorization",
    "description": "Service-to-service authorization decisions.",
    "rpcCount": 1,
    "rpcs": [
      {         "permission": "",
"name": "Authorize", "request": "AuthorizeRequest", "response": "AuthorizeResponse" }
    ]
  },
  {
    "slug": "oauth-introspection",
    "proto": "oauth.proto",
    "label": "OAuth Introspection",
    "description": "Token introspection for resource services.",
    "rpcCount": 1,
    "rpcs": [
      {         "permission": "",
"name": "Introspect", "request": "IntrospectRequest", "response": "IntrospectResponse" }
    ]
  },
  {
    "slug": "health",
    "proto": "https://github.com/grpc/grpc/blob/master/src/proto/grpc/health/v1/health.proto",
    "protoExternal": true,
    "label": "Health",
    "description": "Standard gRPC health checking for the control plane.",
    "rpcCount": 2,
    "rpcs": [
      {         "auth": "infrastructure",
"name": "Check", "request": "HealthCheckRequest", "response": "HealthCheckResponse" },
      {         "auth": "infrastructure",
"name": "Watch", "request": "HealthCheckRequest", "response": "stream HealthCheckResponse" }
    ]
  }
];

export const grpcRpcCount = grpcGroupNav.reduce((total, group) => total + group.rpcCount, 0);

export const defaultGrpcGroupSlug = grpcGroupNav[0]?.slug || null;

export const findGrpcGroupNav = (slug) => grpcGroupNav.find((group) => group.slug === slug) || grpcGroupNav[0] || null;
