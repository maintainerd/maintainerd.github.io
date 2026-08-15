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
      {
        "permission": "user:read",
        "name": "ListUsers",
        "request": "ListUsersRequest",
        "response": "ListUsersResponse",
        "details": {
          "overview": "Lists users in a tenant with filtering and pagination.",
          "notes": [
            "The tenant is named by tenant_uuid in the request; the caller's token must be bound to a scope that allows reading it.",
            "username, email, and phone filters are partial-match filters; status accepts multiple values."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the user belongs to."
            },
            {
              "name": "username",
              "type": "string",
              "required": false,
              "description": "Filter by username."
            },
            {
              "name": "email",
              "type": "string",
              "required": false,
              "description": "Filter by email."
            },
            {
              "name": "phone",
              "type": "string",
              "required": false,
              "description": "Filter by phone."
            },
            {
              "name": "status",
              "type": "repeated string",
              "required": false,
              "description": "Filter by status: active, inactive, pending, suspended."
            },
            {
              "name": "pagination",
              "type": "Pagination",
              "required": false,
              "description": "Standard pagination: page, limit, sort_by, sort_order."
            }
          ],
          "responseFields": [
            {
              "name": "users",
              "type": "repeated User",
              "description": "The matching user records."
            },
            {
              "name": "page.total",
              "type": "int64",
              "description": "Total matching users."
            },
            {
              "name": "page.page",
              "type": "int32",
              "description": "Current page."
            },
            {
              "name": "page.limit",
              "type": "int32",
              "description": "Page size."
            },
            {
              "name": "page.total_pages",
              "type": "int32",
              "description": "Total page count."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, or a step-up/actor requirement failed."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or user does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "status": [
              "active"
            ],
            "pagination": {
              "page": 1,
              "limit": 20
            }
          },
          "responseExample": {
            "users": [
              {
                "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                "username": "alex",
                "fullname": "Alex Rivera",
                "email": "alex@acme.example",
                "phone": "+15551234567",
                "is_email_verified": true,
                "is_phone_verified": false,
                "is_profile_completed": true,
                "is_account_completed": true,
                "status": "active",
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
          }
        }
      },
      {
        "permission": "user:read",
        "name": "GetUser",
        "request": "GetUserRequest",
        "response": "GetUserResponse",
        "details": {
          "overview": "Returns one user by UUID in the named tenant.",
          "notes": [
            "Users outside the caller's scope respond as not found."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the user belongs to."
            },
            {
              "name": "user_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the target user."
            }
          ],
          "responseFields": [
            {
              "name": "user",
              "type": "User",
              "description": "The user record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, or a step-up/actor requirement failed."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or user does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d"
          },
          "responseExample": {
            "user": {
              "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
              "username": "alex",
              "fullname": "Alex Rivera",
              "email": "alex@acme.example",
              "phone": "+15551234567",
              "is_email_verified": true,
              "is_phone_verified": false,
              "is_profile_completed": true,
              "is_account_completed": true,
              "status": "active",
              "metadata": {},
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "user:create",
        "name": "CreateUser",
        "request": "CreateUserRequest",
        "response": "CreateUserResponse",
        "details": {
          "overview": "Creates a user in the named tenant. The acting user comes from the verified token, and the create is replay-guarded: a retry after a lost response returns the original user instead of a conflict.",
          "notes": [
            "Password length and complexity are enforced by the tenant's password policy; the DTO only requires a value.",
            "Duplicate usernames and emails within the tenant answer AlreadyExists.",
            "The display name lives in the profile, so CreateUser has no fullname field."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the user belongs to."
            },
            {
              "name": "username",
              "type": "string",
              "required": true,
              "description": "Username. 3-50 characters, unique per tenant."
            },
            {
              "name": "email",
              "type": "string",
              "required": false,
              "description": "Email address. Must be valid when present."
            },
            {
              "name": "phone",
              "type": "string",
              "required": false,
              "description": "Phone number. Must be valid when present."
            },
            {
              "name": "password",
              "type": "string",
              "required": true,
              "description": "Initial password. 1-4096 characters; complexity per tenant policy."
            },
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "Status: active, inactive, pending, or suspended."
            },
            {
              "name": "metadata",
              "type": "google.protobuf.Struct",
              "required": false,
              "description": "Free-form user metadata."
            },
            {
              "name": "actor_user_uuid",
              "type": "string",
              "required": false,
              "description": "Reserved field; attribution is taken from the authenticated token, never from the body."
            }
          ],
          "responseFields": [
            {
              "name": "user",
              "type": "User",
              "description": "The created user record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, or a step-up/actor requirement failed."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or user does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "username": "alex",
            "email": "alex@acme.example",
            "phone": "+15551234567",
            "password": "CorrectHorseBatteryStaple!1",
            "status": "active"
          },
          "responseExample": {
            "user": {
              "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
              "username": "alex",
              "fullname": "Alex Rivera",
              "email": "alex@acme.example",
              "phone": "+15551234567",
              "is_email_verified": true,
              "is_phone_verified": false,
              "is_profile_completed": true,
              "is_account_completed": true,
              "status": "active",
              "metadata": {},
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "user:update",
        "name": "UpdateUser",
        "request": "UpdateUserRequest",
        "response": "UpdateUserResponse",
        "details": {
          "overview": "Updates a user's username, email, phone, status, and metadata in the named tenant.",
          "notes": [
            "The acting user comes from the verified token, never from actor_user_uuid in the body.",
            "Duplicate usernames and emails within the tenant answer AlreadyExists."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the user belongs to."
            },
            {
              "name": "user_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the target user."
            },
            {
              "name": "username",
              "type": "string",
              "required": true,
              "description": "Username. 3-50 characters."
            },
            {
              "name": "email",
              "type": "string",
              "required": false,
              "description": "Email address. Must be valid when present."
            },
            {
              "name": "phone",
              "type": "string",
              "required": false,
              "description": "Phone number. Must be valid when present."
            },
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "Status: active, inactive, pending, or suspended."
            },
            {
              "name": "metadata",
              "type": "google.protobuf.Struct",
              "required": false,
              "description": "Free-form user metadata."
            },
            {
              "name": "actor_user_uuid",
              "type": "string",
              "required": false,
              "description": "Reserved field; attribution is taken from the authenticated token, never from the body."
            }
          ],
          "responseFields": [
            {
              "name": "user",
              "type": "User",
              "description": "The updated user record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, or a step-up/actor requirement failed."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or user does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
            "username": "alex",
            "email": "alex@acme.example",
            "phone": "+15551234567",
            "status": "active"
          },
          "responseExample": {
            "user": {
              "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
              "username": "alex",
              "fullname": "Alex Rivera",
              "email": "alex@acme.example",
              "phone": "+15551234567",
              "is_email_verified": true,
              "is_phone_verified": false,
              "is_profile_completed": true,
              "is_account_completed": true,
              "status": "active",
              "metadata": {},
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "user:update",
        "stepUp": true,
        "name": "SetUserStatus",
        "request": "SetUserStatusRequest",
        "response": "SetUserStatusResponse",
        "details": {
          "overview": "Changes a user's status. Suspending or deactivating a user blocks their sign-in immediately.",
          "notes": [
            "Requires a step-up token (acr=2).",
            "The acting user comes from the verified token."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the user belongs to."
            },
            {
              "name": "user_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the target user."
            },
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "Status: active, inactive, pending, or suspended."
            },
            {
              "name": "actor_user_uuid",
              "type": "string",
              "required": false,
              "description": "Reserved field; attribution is taken from the authenticated token, never from the body."
            }
          ],
          "responseFields": [
            {
              "name": "user",
              "type": "User",
              "description": "The updated user record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, or a step-up/actor requirement failed."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or user does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
            "status": "suspended"
          },
          "responseExample": {
            "user": {
              "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
              "username": "alex",
              "fullname": "Alex Rivera",
              "email": "alex@acme.example",
              "phone": "+15551234567",
              "is_email_verified": true,
              "is_phone_verified": false,
              "is_profile_completed": true,
              "is_account_completed": true,
              "status": "suspended",
              "metadata": {},
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "user:update",
        "name": "VerifyUserEmail",
        "request": "VerifyUserEmailRequest",
        "response": "VerifyUserEmailResponse",
        "details": {
          "overview": "Marks the user's email address as verified by an administrator.",
          "notes": [
            "No user actor is required: this is a verification state change, not an impersonation."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the user belongs to."
            },
            {
              "name": "user_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the target user."
            }
          ],
          "responseFields": [
            {
              "name": "user",
              "type": "User",
              "description": "The updated user record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, or a step-up/actor requirement failed."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or user does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d"
          },
          "responseExample": {
            "user": {
              "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
              "username": "alex",
              "fullname": "Alex Rivera",
              "email": "alex@acme.example",
              "phone": "+15551234567",
              "is_email_verified": true,
              "is_phone_verified": false,
              "is_profile_completed": true,
              "is_account_completed": true,
              "status": "active",
              "metadata": {},
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "user:update",
        "name": "VerifyUserPhone",
        "request": "VerifyUserPhoneRequest",
        "response": "VerifyUserPhoneResponse",
        "details": {
          "overview": "Marks the user's phone number as verified by an administrator.",
          "notes": [
            "No user actor is required."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the user belongs to."
            },
            {
              "name": "user_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the target user."
            }
          ],
          "responseFields": [
            {
              "name": "user",
              "type": "User",
              "description": "The updated user record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, or a step-up/actor requirement failed."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or user does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d"
          },
          "responseExample": {
            "user": {
              "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
              "username": "alex",
              "fullname": "Alex Rivera",
              "email": "alex@acme.example",
              "phone": "+15551234567",
              "is_email_verified": true,
              "is_phone_verified": true,
              "is_profile_completed": true,
              "is_account_completed": true,
              "status": "active",
              "metadata": {},
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "user:update",
        "name": "CompleteUserAccount",
        "request": "CompleteUserAccountRequest",
        "response": "CompleteUserAccountResponse",
        "details": {
          "overview": "Completes a user's account record, typically after an administrator provisioned it partially.",
          "notes": [
            "No user actor is required."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the user belongs to."
            },
            {
              "name": "user_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the target user."
            }
          ],
          "responseFields": [
            {
              "name": "user",
              "type": "User",
              "description": "The updated user record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, or a step-up/actor requirement failed."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or user does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d"
          },
          "responseExample": {
            "user": {
              "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
              "username": "alex",
              "fullname": "Alex Rivera",
              "email": "alex@acme.example",
              "phone": "+15551234567",
              "is_email_verified": true,
              "is_phone_verified": false,
              "is_profile_completed": true,
              "is_account_completed": true,
              "status": "active",
              "metadata": {},
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "user:delete",
        "stepUp": true,
        "name": "DeleteUser",
        "request": "DeleteUserRequest",
        "response": "DeleteUserResponse",
        "details": {
          "overview": "Soft-deletes a user in the named tenant. The acting user comes from the verified token.",
          "notes": [
            "Requires a step-up token (acr=2)."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the user belongs to."
            },
            {
              "name": "user_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the target user."
            },
            {
              "name": "actor_user_uuid",
              "type": "string",
              "required": false,
              "description": "Reserved field; attribution is taken from the authenticated token, never from the body."
            }
          ],
          "responseFields": [
            {
              "name": "user",
              "type": "User",
              "description": "The deleted user record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, or a step-up/actor requirement failed."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or user does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d"
          },
          "responseExample": {
            "user": {
              "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
              "username": "alex",
              "fullname": "Alex Rivera",
              "email": "alex@acme.example",
              "phone": "+15551234567",
              "is_email_verified": true,
              "is_phone_verified": false,
              "is_profile_completed": true,
              "is_account_completed": true,
              "status": "active",
              "metadata": {},
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "user:update",
        "stepUp": true,
        "name": "ForceUserPasswordChange",
        "request": "ForceUserPasswordChangeRequest",
        "response": "ForceUserPasswordChangeResponse",
        "details": {
          "overview": "Forces (or clears) the require-password-change flag on a user, making the next login require a new password.",
          "notes": [
            "Requires a step-up token (acr=2).",
            "No user actor is required."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the user belongs to."
            },
            {
              "name": "user_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the target user."
            },
            {
              "name": "force",
              "type": "bool",
              "required": true,
              "description": "True to require a password change at the next login."
            }
          ],
          "responseFields": [
            {
              "name": "success",
              "type": "bool",
              "description": "Always true on success."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, or a step-up/actor requirement failed."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or user does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
            "force": true
          },
          "responseExample": {
            "success": true
          }
        }
      },
      {
        "permission": "user:read",
        "name": "ListUserRoles",
        "request": "ListUserRolesRequest",
        "response": "ListUserRolesResponse",
        "details": {
          "overview": "Lists the roles assigned to a user with pagination.",
          "notes": [
            "Each row is the resolved role record with name, description, and flags."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the user belongs to."
            },
            {
              "name": "user_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the target user."
            },
            {
              "name": "pagination",
              "type": "Pagination",
              "required": false,
              "description": "Standard pagination: page, limit, sort_by, sort_order."
            }
          ],
          "responseFields": [
            {
              "name": "roles",
              "type": "repeated UserRole",
              "description": "The user's roles."
            },
            {
              "name": "roles[].role_uuid",
              "type": "string",
              "description": "Role UUID."
            },
            {
              "name": "roles[].name",
              "type": "string",
              "description": "Role name."
            },
            {
              "name": "roles[].description",
              "type": "string",
              "description": "Role description."
            },
            {
              "name": "roles[].is_default",
              "type": "bool",
              "description": "Default-role flag."
            },
            {
              "name": "roles[].is_system",
              "type": "bool",
              "description": "System-role flag."
            },
            {
              "name": "roles[].status",
              "type": "string",
              "description": "Role status."
            },
            {
              "name": "page",
              "type": "PageMetadata",
              "description": "Pagination metadata."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, or a step-up/actor requirement failed."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or user does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
            "pagination": {
              "page": 1,
              "limit": 20
            }
          },
          "responseExample": {
            "roles": [
              {
                "role_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "name": "billing-admin",
                "description": "Manages billing operations",
                "is_default": false,
                "is_system": false,
                "status": "active",
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
          }
        }
      },
      {
        "permission": "user:read",
        "name": "ListUserIdentities",
        "request": "ListUserIdentitiesRequest",
        "response": "ListUserIdentitiesResponse",
        "details": {
          "overview": "Lists the external provider identities linked to a user with pagination.",
          "notes": [
            "Each row carries the provider name and the upstream subject."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the user belongs to."
            },
            {
              "name": "user_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the target user."
            },
            {
              "name": "pagination",
              "type": "Pagination",
              "required": false,
              "description": "Standard pagination: page, limit, sort_by, sort_order."
            }
          ],
          "responseFields": [
            {
              "name": "identities",
              "type": "repeated UserIdentity",
              "description": "The user's linked identities."
            },
            {
              "name": "identities[].user_identity_uuid",
              "type": "string",
              "description": "Identity UUID."
            },
            {
              "name": "identities[].provider",
              "type": "string",
              "description": "Provider name, e.g. google."
            },
            {
              "name": "identities[].sub",
              "type": "string",
              "description": "Upstream subject identifier."
            },
            {
              "name": "page",
              "type": "PageMetadata",
              "description": "Pagination metadata."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, or a step-up/actor requirement failed."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or user does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
            "pagination": {
              "page": 1,
              "limit": 20
            }
          },
          "responseExample": {
            "identities": [
              {
                "user_identity_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "provider": "google",
                "sub": "google-oauth2|1234567890",
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
          }
        }
      },
      {
        "permission": "user:create",
        "stepUp": true,
        "actorRequired": true,
        "name": "AssignUserRoles",
        "request": "AssignUserRolesRequest",
        "response": "AssignUserRolesResponse",
        "details": {
          "overview": "Assigns one or more roles to a user. The acting user must be a user principal carried in the token's on_behalf_of claim \u2014 service tokens cannot assign roles.",
          "notes": [
            "Requires a step-up token (acr=2) and an on_behalf_of user actor.",
            "Between 1 and 10 role UUIDs per request.",
            "The escalation guard prevents granting roles the acting user does not hold."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the user belongs to."
            },
            {
              "name": "user_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the target user."
            },
            {
              "name": "role_uuids",
              "type": "repeated string",
              "required": true,
              "description": "1-10 role UUIDs to assign."
            }
          ],
          "responseFields": [
            {
              "name": "user",
              "type": "User",
              "description": "The updated user record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, or a step-up/actor requirement failed."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or user does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
            "role_uuids": [
              "f47ac10b-58cc-4372-a567-0e02b2c3d479"
            ]
          },
          "responseExample": {
            "user": {
              "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
              "username": "alex",
              "fullname": "Alex Rivera",
              "email": "alex@acme.example",
              "phone": "+15551234567",
              "is_email_verified": true,
              "is_phone_verified": false,
              "is_profile_completed": true,
              "is_account_completed": true,
              "status": "active",
              "metadata": {},
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "user:create",
        "stepUp": true,
        "name": "RemoveUserRole",
        "request": "RemoveUserRoleRequest",
        "response": "RemoveUserRoleResponse",
        "details": {
          "overview": "Removes one role from a user in the named tenant.",
          "notes": [
            "Requires a step-up token (acr=2)."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the user belongs to."
            },
            {
              "name": "user_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the target user."
            },
            {
              "name": "role_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the role to remove."
            }
          ],
          "responseFields": [
            {
              "name": "user",
              "type": "User",
              "description": "The updated user record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, or a step-up/actor requirement failed."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or user does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
            "role_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          },
          "responseExample": {
            "user": {
              "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
              "username": "alex",
              "fullname": "Alex Rivera",
              "email": "alex@acme.example",
              "phone": "+15551234567",
              "is_email_verified": true,
              "is_phone_verified": false,
              "is_profile_completed": true,
              "is_account_completed": true,
              "status": "active",
              "metadata": {},
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
    ]
  },
  {
    "slug": "user-profiles",
    "proto": "user.proto",
    "label": "User Profiles",
    "description": "Profile records attached to users, including default-profile selection.",
    "rpcCount": 6,
    "rpcs": [
      {
        "permission": "user:read",
        "name": "ListUserProfiles",
        "request": "ListUserProfilesRequest",
        "response": "ListUserProfilesResponse",
        "details": {
          "overview": "Lists a user's profiles with filtering and pagination.",
          "notes": [
            "The effective filters are first_name, last_name, and email. The request message also declares phone, city, country, and is_default fields, which the current implementation does not apply.",
            "Profiles are scoped to the user_uuid in the request."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the user belongs to."
            },
            {
              "name": "user_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the user who owns the profile."
            },
            {
              "name": "first_name",
              "type": "string",
              "required": false,
              "description": "Filter by first name."
            },
            {
              "name": "last_name",
              "type": "string",
              "required": false,
              "description": "Filter by last name."
            },
            {
              "name": "email",
              "type": "string",
              "required": false,
              "description": "Filter by email."
            },
            {
              "name": "pagination",
              "type": "Pagination",
              "required": false,
              "description": "Standard pagination: page, limit, sort_by, sort_order."
            }
          ],
          "responseFields": [
            {
              "name": "profiles",
              "type": "repeated UserProfile",
              "description": "The user's profiles."
            },
            {
              "name": "page.total",
              "type": "int64",
              "description": "Total matching profiles."
            },
            {
              "name": "page.page",
              "type": "int32",
              "description": "Current page."
            },
            {
              "name": "page.limit",
              "type": "int32",
              "description": "Page size."
            },
            {
              "name": "page.total_pages",
              "type": "int32",
              "description": "Total page count."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, user, or profile does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
            "pagination": {
              "page": 1,
              "limit": 20
            }
          },
          "responseExample": {
            "profiles": [
              {
                "profile_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "first_name": "Alex",
                "middle_name": "J.",
                "last_name": "Rivera",
                "display_name": "Alex Rivera",
                "gender": "prefer_not_to_say",
                "email": "alex@acme.example",
                "timezone": "Asia/Manila",
                "language": "en-US",
                "profile_url": "https://acme.example/team/alex",
                "birthdate": "1990-01-25",
                "is_default": true,
                "metadata": {
                  "department": "platform"
                },
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
          }
        }
      },
      {
        "permission": "user:read",
        "name": "GetUserProfile",
        "request": "GetUserProfileRequest",
        "response": "GetUserProfileResponse",
        "details": {
          "overview": "Returns one profile by UUID, scoped to the named user.",
          "notes": [
            "The profile must belong to the user_uuid in the request; a mismatch is refused."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the user belongs to."
            },
            {
              "name": "user_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the user who owns the profile."
            },
            {
              "name": "profile_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the profile."
            }
          ],
          "responseFields": [
            {
              "name": "profile",
              "type": "UserProfile",
              "description": "The profile record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, user, or profile does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
            "profile_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          },
          "responseExample": {
            "profile": {
              "profile_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "first_name": "Alex",
              "middle_name": "J.",
              "last_name": "Rivera",
              "display_name": "Alex Rivera",
              "gender": "prefer_not_to_say",
              "email": "alex@acme.example",
              "timezone": "Asia/Manila",
              "language": "en-US",
              "profile_url": "https://acme.example/team/alex",
              "birthdate": "1990-01-25",
              "is_default": true,
              "metadata": {
                "department": "platform"
              },
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "user:update",
        "name": "CreateUserProfile",
        "request": "CreateUserProfileRequest",
        "response": "CreateUserProfileResponse",
        "details": {
          "overview": "Creates a profile for the named user. The create is replay-guarded: the profile UUID is minted per call, so the ledger is what prevents a retry from creating a duplicate profile.",
          "notes": [
            "The tenant is named by tenant_uuid and the profile is always scoped to the user_uuid in the request.",
            "The request message declares additional fields (suffix, bio, phone, address, city, country); the current implementation stores the fields listed above only.",
            "Create is replay-guarded: a retry after a lost response returns the original profile instead of minting a duplicate."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the user belongs to."
            },
            {
              "name": "user_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the user who owns the profile."
            },
            {
              "name": "first_name",
              "type": "string",
              "required": true,
              "description": "First name. 1-100 characters."
            },
            {
              "name": "middle_name",
              "type": "string",
              "required": false,
              "description": "Middle name. At most 100 characters."
            },
            {
              "name": "last_name",
              "type": "string",
              "required": false,
              "description": "Last name. At most 100 characters."
            },
            {
              "name": "display_name",
              "type": "string",
              "required": false,
              "description": "Display name. At most 100 characters."
            },
            {
              "name": "birthdate",
              "type": "string",
              "required": false,
              "description": "Birthdate in YYYY-MM-DD format."
            },
            {
              "name": "gender",
              "type": "string",
              "required": false,
              "description": "One of male, female, other, prefer_not_to_say."
            },
            {
              "name": "email",
              "type": "string",
              "required": false,
              "description": "Email address. Valid format, at most 255 characters."
            },
            {
              "name": "timezone",
              "type": "string",
              "required": false,
              "description": "Timezone label. At most 50 characters."
            },
            {
              "name": "language",
              "type": "string",
              "required": false,
              "description": "Language preference. At most 10 characters."
            },
            {
              "name": "profile_url",
              "type": "string",
              "required": false,
              "description": "Profile URL. Valid URL, at most 1000 characters."
            },
            {
              "name": "metadata",
              "type": "google.protobuf.Struct",
              "required": false,
              "description": "Free-form profile metadata."
            }
          ],
          "responseFields": [
            {
              "name": "profile",
              "type": "UserProfile",
              "description": "The created profile record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, user, or profile does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
            "first_name": "Alex",
            "last_name": "Rivera",
            "email": "alex@acme.example",
            "timezone": "Asia/Manila",
            "language": "en-US"
          },
          "responseExample": {
            "profile": {
              "profile_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "first_name": "Alex",
              "middle_name": "J.",
              "last_name": "Rivera",
              "display_name": "Alex Rivera",
              "gender": "prefer_not_to_say",
              "email": "alex@acme.example",
              "timezone": "Asia/Manila",
              "language": "en-US",
              "profile_url": "https://acme.example/team/alex",
              "birthdate": "1990-01-25",
              "is_default": true,
              "metadata": {
                "department": "platform"
              },
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "user:update",
        "name": "UpdateUserProfile",
        "request": "UpdateUserProfileRequest",
        "response": "UpdateUserProfileResponse",
        "details": {
          "overview": "Updates a profile for the named user. The operation is create-or-update against the named profile UUID and the same validation rules as creation apply.",
          "notes": [
            "The tenant is named by tenant_uuid and the profile is always scoped to the user_uuid in the request.",
            "The request message declares additional fields (suffix, bio, phone, address, city, country); the current implementation stores the fields listed above only.",
            "Create is replay-guarded: a retry after a lost response returns the original profile instead of minting a duplicate."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the user belongs to."
            },
            {
              "name": "user_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the user who owns the profile."
            },
            {
              "name": "profile_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the profile."
            },
            {
              "name": "first_name",
              "type": "string",
              "required": true,
              "description": "First name. 1-100 characters."
            },
            {
              "name": "middle_name",
              "type": "string",
              "required": false,
              "description": "Middle name. At most 100 characters."
            },
            {
              "name": "last_name",
              "type": "string",
              "required": false,
              "description": "Last name. At most 100 characters."
            },
            {
              "name": "display_name",
              "type": "string",
              "required": false,
              "description": "Display name. At most 100 characters."
            },
            {
              "name": "birthdate",
              "type": "string",
              "required": false,
              "description": "Birthdate in YYYY-MM-DD format."
            },
            {
              "name": "gender",
              "type": "string",
              "required": false,
              "description": "One of male, female, other, prefer_not_to_say."
            },
            {
              "name": "email",
              "type": "string",
              "required": false,
              "description": "Email address. Valid format, at most 255 characters."
            },
            {
              "name": "timezone",
              "type": "string",
              "required": false,
              "description": "Timezone label. At most 50 characters."
            },
            {
              "name": "language",
              "type": "string",
              "required": false,
              "description": "Language preference. At most 10 characters."
            },
            {
              "name": "profile_url",
              "type": "string",
              "required": false,
              "description": "Profile URL. Valid URL, at most 1000 characters."
            },
            {
              "name": "metadata",
              "type": "google.protobuf.Struct",
              "required": false,
              "description": "Free-form profile metadata."
            }
          ],
          "responseFields": [
            {
              "name": "profile",
              "type": "UserProfile",
              "description": "The updated profile record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, user, or profile does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
            "profile_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "first_name": "Alex",
            "last_name": "Rivera",
            "display_name": "Alex J. Rivera"
          },
          "responseExample": {
            "profile": {
              "profile_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "first_name": "Alex",
              "middle_name": "J.",
              "last_name": "Rivera",
              "display_name": "Alex J. Rivera",
              "gender": "prefer_not_to_say",
              "email": "alex@acme.example",
              "timezone": "Asia/Manila",
              "language": "en-US",
              "profile_url": "https://acme.example/team/alex",
              "birthdate": "1990-01-25",
              "is_default": true,
              "metadata": {
                "department": "platform"
              },
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "user:update",
        "name": "SetDefaultUserProfile",
        "request": "SetDefaultUserProfileRequest",
        "response": "SetDefaultUserProfileResponse",
        "details": {
          "overview": "Marks a profile as the user's default. The profile must belong to the named user.",
          "notes": [
            "In the current single-profile model the returned profile always carries is_default=true."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the user belongs to."
            },
            {
              "name": "user_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the user who owns the profile."
            },
            {
              "name": "profile_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the profile."
            }
          ],
          "responseFields": [
            {
              "name": "profile",
              "type": "UserProfile",
              "description": "The profile record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, user, or profile does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
            "profile_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          },
          "responseExample": {
            "profile": {
              "profile_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "first_name": "Alex",
              "middle_name": "J.",
              "last_name": "Rivera",
              "display_name": "Alex Rivera",
              "gender": "prefer_not_to_say",
              "email": "alex@acme.example",
              "timezone": "Asia/Manila",
              "language": "en-US",
              "profile_url": "https://acme.example/team/alex",
              "birthdate": "1990-01-25",
              "is_default": true,
              "metadata": {
                "department": "platform"
              },
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "user:delete",
        "name": "DeleteUserProfile",
        "request": "DeleteUserProfileRequest",
        "response": "DeleteUserProfileResponse",
        "details": {
          "overview": "Deletes a profile owned by the named user.",
          "notes": [
            "A profile that does not belong to the named user is refused rather than deleted."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the user belongs to."
            },
            {
              "name": "user_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the user who owns the profile."
            },
            {
              "name": "profile_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the profile."
            }
          ],
          "responseFields": [
            {
              "name": "profile",
              "type": "UserProfile",
              "description": "The deleted profile record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, user, or profile does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "user_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
            "profile_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          },
          "responseExample": {
            "profile": {
              "profile_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "first_name": "Alex",
              "middle_name": "J.",
              "last_name": "Rivera",
              "display_name": "Alex Rivera",
              "gender": "prefer_not_to_say",
              "email": "alex@acme.example",
              "timezone": "Asia/Manila",
              "language": "en-US",
              "profile_url": "https://acme.example/team/alex",
              "birthdate": "1990-01-25",
              "is_default": true,
              "metadata": {
                "department": "platform"
              },
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
    ]
  },
  {
    "slug": "clients",
    "proto": "client.proto",
    "label": "Applications and Clients",
    "description": "OAuth client lifecycle, secrets, URIs, API audiences, and API permissions.",
    "rpcCount": 19,
    "rpcs": [
      {
        "permission": "client:read",
        "name": "ListClients",
        "request": "ListClientsRequest",
        "response": "ListClientsResponse",
        "details": {
          "overview": "Lists clients in a tenant with filtering and pagination.",
          "notes": [
            "The caller may act on its own tenant; a system-tenant principal may list any tenant's clients.",
            "client_type and status accept multiple values."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the client belongs to."
            },
            {
              "name": "name",
              "type": "string",
              "required": false,
              "description": "Filter by client name."
            },
            {
              "name": "display_name",
              "type": "string",
              "required": false,
              "description": "Filter by display name."
            },
            {
              "name": "client_type",
              "type": "repeated string",
              "required": false,
              "description": "Filter by client type: traditional, spa, mobile, m2m."
            },
            {
              "name": "identity_provider_uuid",
              "type": "string",
              "required": false,
              "description": "Filter by a connected identity provider UUID."
            },
            {
              "name": "status",
              "type": "repeated string",
              "required": false,
              "description": "Filter by status: active, inactive."
            },
            {
              "name": "is_default",
              "type": "optional bool",
              "required": false,
              "description": "Filter by default flag."
            },
            {
              "name": "is_system",
              "type": "optional bool",
              "required": false,
              "description": "Filter by system flag."
            },
            {
              "name": "pagination",
              "type": "Pagination",
              "required": false,
              "description": "Standard pagination."
            }
          ],
          "responseFields": [
            {
              "name": "clients",
              "type": "repeated Client",
              "description": "The matching client records."
            },
            {
              "name": "page.total",
              "type": "int64",
              "description": "Total matching clients."
            },
            {
              "name": "page.page",
              "type": "int32",
              "description": "Current page."
            },
            {
              "name": "page.limit",
              "type": "int32",
              "description": "Page size."
            },
            {
              "name": "page.total_pages",
              "type": "int32",
              "description": "Total page count."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, the token is not bound to a tenant, or the token may only act on its own tenant."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or client does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "status": [
              "active"
            ],
            "pagination": {
              "page": 1,
              "limit": 20
            }
          },
          "responseExample": {
            "clients": [
              {
                "client_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "name": "app-web",
                "display_name": "Example Web Application",
                "client_type": "traditional",
                "domain": "app.acme.example",
                "status": "active",
                "is_default": false,
                "is_system": false,
                "allow_registration": false,
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
          }
        }
      },
      {
        "permission": "client:read",
        "name": "GetClient",
        "request": "GetClientRequest",
        "response": "GetClientResponse",
        "details": {
          "overview": "Returns one client by UUID in the named tenant.",
          "notes": [
            "Clients outside the caller's tenant scope respond as not found."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the client belongs to."
            },
            {
              "name": "client_uuid",
              "type": "string",
              "required": true,
              "description": "Management UUID of the client."
            }
          ],
          "responseFields": [
            {
              "name": "client",
              "type": "Client",
              "description": "The client record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, the token is not bound to a tenant, or the token may only act on its own tenant."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or client does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "client_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          },
          "responseExample": {
            "client": {
              "client_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "app-web",
              "display_name": "Example Web Application",
              "client_type": "traditional",
              "domain": "app.acme.example",
              "status": "active",
              "is_default": false,
              "is_system": false,
              "allow_registration": false,
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "client:secret:read",
        "stepUp": true,
        "name": "GetClientSecret",
        "request": "GetClientSecretRequest",
        "response": "GetClientSecretResponse",
        "details": {
          "overview": "Deliberately unimplemented: client secrets are hashed at rest and can never be retrieved after creation.",
          "notes": [
            "This RPC exists only because the generated service interface requires it; it always answers Unimplemented.",
            "Use RotateClientSecret to issue a new secret instead."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the client belongs to."
            },
            {
              "name": "client_uuid",
              "type": "string",
              "required": true,
              "description": "Management UUID of the client."
            }
          ],
          "responseFields": [
            {
              "name": "client_id",
              "type": "string",
              "description": "Never populated; the RPC always fails."
            },
            {
              "name": "message",
              "type": "string",
              "description": "Never populated; the RPC always fails."
            }
          ],
          "errors": [
                        {"code": "Unimplemented", "description": "Always returned: client secrets cannot be retrieved after creation; use RotateClientSecret to issue a new one."},
{
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, the token is not bound to a tenant, or the token may only act on its own tenant."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or client does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "client_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          },
          "responseExample": {}
        }
      },
      {
        "permission": "client:secret:rotate",
        "stepUp": true,
        "name": "RotateClientSecret",
        "request": "RotateClientSecretRequest",
        "response": "RotateClientSecretResponse",
        "details": {
          "overview": "Generates a new client secret and returns it exactly once. The previous secret can remain valid for a bounded grace period.",
          "notes": [
            "Requires a step-up token (acr=2) and a user actor from the token.",
            "grace_period_hours is capped at 168 (7 days); 0 revokes the previous secret immediately."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the client belongs to."
            },
            {
              "name": "client_uuid",
              "type": "string",
              "required": true,
              "description": "Management UUID of the client."
            },
            {
              "name": "actor_user_uuid",
              "type": "string",
              "required": false,
              "description": "Reserved field; attribution is taken from the authenticated token, never from the body."
            },
            {
              "name": "grace_period_hours",
              "type": "int32",
              "required": false,
              "description": "Hours the previous secret stays valid. 0-168."
            }
          ],
          "responseFields": [
            {
              "name": "client_secret",
              "type": "string",
              "description": "The new plaintext secret, shown exactly once."
            },
            {
              "name": "previous_secret_expires_at",
              "type": "string",
              "description": "Declared in the proto; the current implementation does not populate it."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, the token is not bound to a tenant, or the token may only act on its own tenant."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or client does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "client_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "grace_period_hours": 24
          },
          "responseExample": {
            "client_secret": "newsecret_9d1d5b4d3a",
            "previous_secret_expires_at": ""
          }
        }
      },
      {
        "permission": "client:config:read",
        "name": "GetClientConfig",
        "request": "GetClientConfigRequest",
        "response": "GetClientConfigResponse",
        "details": {
          "overview": "Returns the client's effective config: the free-form config overlaid with the authoritative runtime columns, exactly as the runtime enforces them.",
          "notes": [
            "Mirrored keys are reported from the columns; keys with no backing column pass through untouched."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the client belongs to."
            },
            {
              "name": "client_uuid",
              "type": "string",
              "required": true,
              "description": "Management UUID of the client."
            }
          ],
          "responseFields": [
            {
              "name": "config",
              "type": "google.protobuf.Struct",
              "description": "The effective configuration object."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, the token is not bound to a tenant, or the token may only act on its own tenant."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or client does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "client_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          },
          "responseExample": {
            "config": {
              "grant_types": [
                "authorization_code",
                "refresh_token"
              ],
              "response_types": [
                "code"
              ],
              "token_endpoint_auth_method": "client_secret_basic",
              "allowed_scopes": [
                "openid",
                "email",
                "profile"
              ],
              "require_pkce": true
            }
          }
        }
      },
      {
        "permission": "client:create",
        "name": "CreateClient",
        "request": "CreateClientRequest",
        "response": "CreateClientResponse",
        "details": {
          "overview": "Creates a client in the named tenant and returns its credentials exactly once. The create is replay-guarded: a retry after a lost response returns the original credentials instead of stranding a secret.",
          "notes": [
            "Every mutating RPC requires a user actor carried in the token's on_behalf_of claim; service tokens without an actor fail closed.",
            "The OAuth matrix is validated on write: auth method none only for public clients, secret methods require a secret, private_key_jwt requires jwks or jwks_uri, client_credentials requires client authentication and a non-empty allowed_scopes.",
            "allow_registration defaults to true when omitted."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the client belongs to."
            },
            {
              "name": "name",
              "type": "string",
              "required": true,
              "description": "Machine name. 3-50 characters."
            },
            {
              "name": "display_name",
              "type": "string",
              "required": true,
              "description": "Human-readable name. 8-200 characters."
            },
            {
              "name": "client_type",
              "type": "string",
              "required": true,
              "description": "One of traditional, spa, mobile, m2m."
            },
            {
              "name": "domain",
              "type": "string",
              "required": true,
              "description": "Application domain. 3-253 characters: a hostname or https URL. It becomes the token issuer."
            },
            {
              "name": "config",
              "type": "google.protobuf.Struct",
              "required": false,
              "description": "Configuration object, at most 16KB. Advanced keys (jwks, jwks_uri, mtls_bound_cert_thumbprint, scope_claim_mappings, claim_mappers, grant/response types, token endpoint auth method, TTLs) are mirrored into runtime columns and validated as a coherent OAuth matrix."
            },
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "One of active or inactive."
            },
            {
              "name": "identity_provider_uuid",
              "type": "string",
              "required": false,
              "description": "Legacy single identity-provider binding."
            },
            {
              "name": "branding_id",
              "type": "string",
              "required": false,
              "description": "Branding theme UUID."
            },
            {
              "name": "allow_registration",
              "type": "optional bool",
              "required": false,
              "description": "Self-registration flag. Defaults to true."
            },
            {
              "name": "actor_user_uuid",
              "type": "string",
              "required": false,
              "description": "Reserved field; attribution is taken from the authenticated token, never from the body."
            }
          ],
          "responseFields": [
            {
              "name": "client",
              "type": "Client",
              "description": "The created client record."
            },
            {
              "name": "credentials.client_uuid",
              "type": "string",
              "description": "Management UUID of the client."
            },
            {
              "name": "credentials.client_id",
              "type": "string",
              "description": "The OAuth client identifier."
            },
            {
              "name": "credentials.client_secret",
              "type": "string",
              "description": "The plaintext secret, shown exactly once."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, the token is not bound to a tenant, or the token may only act on its own tenant."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or client does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "name": "app-web",
            "display_name": "Example Web Application",
            "client_type": "traditional",
            "domain": "app.acme.example",
            "config": {
              "grant_types": [
                "authorization_code",
                "refresh_token"
              ],
              "token_endpoint_auth_method": "client_secret_basic",
              "allowed_scopes": [
                "openid",
                "email",
                "profile"
              ]
            },
            "status": "active",
            "allow_registration": false
          },
          "responseExample": {
            "client": {
              "client_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "app-web",
              "display_name": "Example Web Application",
              "client_type": "traditional",
              "domain": "app.acme.example",
              "status": "active",
              "is_default": false,
              "is_system": false,
              "allow_registration": false,
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            },
            "credentials": {
              "client_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "client_id": "app-web-client",
              "client_secret": "secret_9d1d5b4d3a"
            }
          }
        }
      },
      {
        "permission": "client:update",
        "name": "UpdateClient",
        "request": "UpdateClientRequest",
        "response": "UpdateClientResponse",
        "details": {
          "overview": "Updates a client's fields in the named tenant. An omitted config means leave it unchanged.",
          "notes": [
            "Every mutating RPC requires a user actor carried in the token's on_behalf_of claim; service tokens without an actor fail closed.",
            "The same DTO validation and OAuth matrix rules as creation apply."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the client belongs to."
            },
            {
              "name": "client_uuid",
              "type": "string",
              "required": true,
              "description": "Management UUID of the client."
            },
            {
              "name": "name",
              "type": "string",
              "required": true,
              "description": "Machine name. 3-50 characters."
            },
            {
              "name": "display_name",
              "type": "string",
              "required": true,
              "description": "Human-readable name. 8-200 characters."
            },
            {
              "name": "client_type",
              "type": "string",
              "required": true,
              "description": "One of traditional, spa, mobile, m2m."
            },
            {
              "name": "domain",
              "type": "string",
              "required": true,
              "description": "Application domain. 3-253 characters: a hostname or https URL. It becomes the token issuer."
            },
            {
              "name": "config",
              "type": "google.protobuf.Struct",
              "required": false,
              "description": "Configuration object, at most 16KB. Advanced keys (jwks, jwks_uri, mtls_bound_cert_thumbprint, scope_claim_mappings, claim_mappers, grant/response types, token endpoint auth method, TTLs) are mirrored into runtime columns and validated as a coherent OAuth matrix."
            },
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "One of active or inactive."
            },
            {
              "name": "branding_id",
              "type": "string",
              "required": false,
              "description": "Branding theme UUID."
            },
            {
              "name": "allow_registration",
              "type": "optional bool",
              "required": false,
              "description": "Self-registration flag."
            },
            {
              "name": "actor_user_uuid",
              "type": "string",
              "required": false,
              "description": "Reserved field; attribution is taken from the authenticated token, never from the body."
            }
          ],
          "responseFields": [
            {
              "name": "client",
              "type": "Client",
              "description": "The updated client record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, the token is not bound to a tenant, or the token may only act on its own tenant."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or client does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "client_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "name": "app-web",
            "display_name": "Example Web Application",
            "client_type": "traditional",
            "domain": "app.acme.example",
            "status": "active"
          },
          "responseExample": {
            "client": {
              "client_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "app-web",
              "display_name": "Example Web Application",
              "client_type": "traditional",
              "domain": "app.acme.example",
              "status": "active",
              "is_default": false,
              "is_system": false,
              "allow_registration": false,
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "client:update",
        "name": "SetClientStatus",
        "request": "SetClientStatusRequest",
        "response": "SetClientStatusResponse",
        "details": {
          "overview": "Changes a client's status to the explicitly requested value.",
          "notes": [
            "Every mutating RPC requires a user actor carried in the token's on_behalf_of claim; service tokens without an actor fail closed."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the client belongs to."
            },
            {
              "name": "client_uuid",
              "type": "string",
              "required": true,
              "description": "Management UUID of the client."
            },
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "One of active or inactive."
            },
            {
              "name": "actor_user_uuid",
              "type": "string",
              "required": false,
              "description": "Reserved field; attribution is taken from the authenticated token, never from the body."
            }
          ],
          "responseFields": [
            {
              "name": "client",
              "type": "Client",
              "description": "The updated client record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, the token is not bound to a tenant, or the token may only act on its own tenant."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or client does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "client_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "status": "inactive"
          },
          "responseExample": {
            "client": {
              "client_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "app-web",
              "display_name": "Example Web Application",
              "client_type": "traditional",
              "domain": "app.acme.example",
              "status": "inactive",
              "is_default": false,
              "is_system": false,
              "allow_registration": false,
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "client:delete",
        "name": "DeleteClient",
        "request": "DeleteClientRequest",
        "response": "DeleteClientResponse",
        "details": {
          "overview": "Soft-deletes a client in the named tenant.",
          "notes": [
            "Every mutating RPC requires a user actor carried in the token's on_behalf_of claim; service tokens without an actor fail closed."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the client belongs to."
            },
            {
              "name": "client_uuid",
              "type": "string",
              "required": true,
              "description": "Management UUID of the client."
            },
            {
              "name": "actor_user_uuid",
              "type": "string",
              "required": false,
              "description": "Reserved field; attribution is taken from the authenticated token, never from the body."
            }
          ],
          "responseFields": [
            {
              "name": "client",
              "type": "Client",
              "description": "The deleted client record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, the token is not bound to a tenant, or the token may only act on its own tenant."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or client does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "client_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          },
          "responseExample": {
            "client": {
              "client_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "app-web",
              "display_name": "Example Web Application",
              "client_type": "traditional",
              "domain": "app.acme.example",
              "status": "active",
              "is_default": false,
              "is_system": false,
              "allow_registration": false,
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "client:uri:read",
        "name": "ListClientURIs",
        "request": "ListClientURIsRequest",
        "response": "ListClientURIsResponse",
        "details": {
          "overview": "Returns the URI records attached to a client.",
          "notes": [
            "These records drive redirect validation, CORS allowlisting, and logout return URLs."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the client belongs to."
            },
            {
              "name": "client_uuid",
              "type": "string",
              "required": true,
              "description": "Management UUID of the client."
            }
          ],
          "responseFields": [
            {
              "name": "uris",
              "type": "repeated ClientURI",
              "description": "The client's URI records."
            },
            {
              "name": "uris[].client_uri_uuid",
              "type": "string",
              "description": "URI record UUID."
            },
            {
              "name": "uris[].uri",
              "type": "string",
              "description": "The URI value."
            },
            {
              "name": "uris[].type",
              "type": "string",
              "description": "URI type: redirect_uri, origin_uri, logout_uri, login_uri, cors_origin_uri."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, the token is not bound to a tenant, or the token may only act on its own tenant."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or client does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "client_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          },
          "responseExample": {
            "uris": [
              {
                "client_uri_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                "uri": "https://app.acme.example/auth/callback",
                "type": "redirect_uri",
                "created_at": "2026-08-01T09:00:00Z",
                "updated_at": "2026-08-01T09:00:00Z"
              }
            ]
          }
        }
      },
      {
        "permission": "client:uri:create",
        "name": "CreateClientURI",
        "request": "CreateClientURIRequest",
        "response": "CreateClientURIResponse",
        "details": {
          "overview": "Attaches a URI record to a client.",
          "notes": [
            "Every mutating RPC requires a user actor carried in the token's on_behalf_of claim; service tokens without an actor fail closed."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the client belongs to."
            },
            {
              "name": "client_uuid",
              "type": "string",
              "required": true,
              "description": "Management UUID of the client."
            },
            {
              "name": "uri",
              "type": "string",
              "required": true,
              "description": "The URI value. 5-200 characters."
            },
            {
              "name": "type",
              "type": "string",
              "required": true,
              "description": "URI type: redirect_uri, origin_uri, logout_uri, login_uri, or cors_origin_uri."
            },
            {
              "name": "actor_user_uuid",
              "type": "string",
              "required": false,
              "description": "Reserved field; attribution is taken from the authenticated token, never from the body."
            }
          ],
          "responseFields": [
            {
              "name": "uri.client_uri_uuid",
              "type": "string",
              "description": "URI record UUID."
            },
            {
              "name": "uri.uri",
              "type": "string",
              "description": "The URI value."
            },
            {
              "name": "uri.type",
              "type": "string",
              "description": "URI type."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, the token is not bound to a tenant, or the token may only act on its own tenant."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or client does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "client_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "uri": "https://app.acme.example/auth/callback",
            "type": "redirect_uri"
          },
          "responseExample": {
            "uri": {
              "client_uri_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
              "uri": "https://app.acme.example/auth/callback",
              "type": "redirect_uri",
              "created_at": "2026-08-15T09:00:00Z",
              "updated_at": "2026-08-15T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "client:uri:update",
        "name": "UpdateClientURI",
        "request": "UpdateClientURIRequest",
        "response": "UpdateClientURIResponse",
        "details": {
          "overview": "Updates an existing URI record's value and type.",
          "notes": [
            "Every mutating RPC requires a user actor carried in the token's on_behalf_of claim; service tokens without an actor fail closed."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the client belongs to."
            },
            {
              "name": "client_uuid",
              "type": "string",
              "required": true,
              "description": "Management UUID of the client."
            },
            {
              "name": "client_uri_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the URI record."
            },
            {
              "name": "uri",
              "type": "string",
              "required": true,
              "description": "The URI value. 5-200 characters."
            },
            {
              "name": "type",
              "type": "string",
              "required": true,
              "description": "URI type: redirect_uri, origin_uri, logout_uri, login_uri, or cors_origin_uri."
            },
            {
              "name": "actor_user_uuid",
              "type": "string",
              "required": false,
              "description": "Reserved field; attribution is taken from the authenticated token, never from the body."
            }
          ],
          "responseFields": [
            {
              "name": "uri.client_uri_uuid",
              "type": "string",
              "description": "URI record UUID."
            },
            {
              "name": "uri.uri",
              "type": "string",
              "description": "The URI value."
            },
            {
              "name": "uri.type",
              "type": "string",
              "description": "URI type."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, the token is not bound to a tenant, or the token may only act on its own tenant."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or client does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "client_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "client_uri_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
            "uri": "https://app.acme.example/auth/callback",
            "type": "redirect_uri"
          },
          "responseExample": {
            "uri": {
              "client_uri_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
              "uri": "https://app.acme.example/auth/callback",
              "type": "redirect_uri",
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-15T09:30:00Z"
            }
          }
        }
      },
      {
        "permission": "client:uri:delete",
        "name": "DeleteClientURI",
        "request": "DeleteClientURIRequest",
        "response": "DeleteClientURIResponse",
        "details": {
          "overview": "Removes a URI record from a client.",
          "notes": [
            "Every mutating RPC requires a user actor carried in the token's on_behalf_of claim; service tokens without an actor fail closed."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the client belongs to."
            },
            {
              "name": "client_uuid",
              "type": "string",
              "required": true,
              "description": "Management UUID of the client."
            },
            {
              "name": "client_uri_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the URI record."
            },
            {
              "name": "actor_user_uuid",
              "type": "string",
              "required": false,
              "description": "Reserved field; attribution is taken from the authenticated token, never from the body."
            }
          ],
          "responseFields": [
            {
              "name": "client",
              "type": "Client",
              "description": "The updated client record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, the token is not bound to a tenant, or the token may only act on its own tenant."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or client does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "client_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "client_uri_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d"
          },
          "responseExample": {
            "client": {
              "client_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "app-web",
              "display_name": "Example Web Application",
              "client_type": "traditional",
              "domain": "app.acme.example",
              "status": "active",
              "is_default": false,
              "is_system": false,
              "allow_registration": false,
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "client:api:read",
        "name": "ListClientAPIs",
        "request": "ListClientAPIsRequest",
        "response": "ListClientAPIsResponse",
        "details": {
          "overview": "Returns the APIs assigned to a client together with the permissions granted for each.",
          "notes": [
            "API assignments define which audiences the client's tokens may address."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the client belongs to."
            },
            {
              "name": "client_uuid",
              "type": "string",
              "required": true,
              "description": "Management UUID of the client."
            }
          ],
          "responseFields": [
            {
              "name": "apis",
              "type": "repeated ClientAPI",
              "description": "The client's API assignments."
            },
            {
              "name": "apis[].client_api_uuid",
              "type": "string",
              "description": "Assignment UUID."
            },
            {
              "name": "apis[].api.api_uuid",
              "type": "string",
              "description": "API UUID."
            },
            {
              "name": "apis[].api.name",
              "type": "string",
              "description": "API name."
            },
            {
              "name": "apis[].api.display_name",
              "type": "string",
              "description": "API display name."
            },
            {
              "name": "apis[].api.status",
              "type": "string",
              "description": "API status."
            },
            {
              "name": "apis[].permissions",
              "type": "repeated ClientAPIPermission",
              "description": "Permissions granted for the API."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, the token is not bound to a tenant, or the token may only act on its own tenant."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or client does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "client_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          },
          "responseExample": {
            "apis": [
              {
                "client_api_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                "api": {
                  "api_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
                  "name": "billing",
                  "display_name": "Billing API",
                  "description": "Billing endpoints",
                  "status": "active",
                  "is_system": false,
                  "created_at": "2026-08-01T09:00:00Z",
                  "updated_at": "2026-08-01T09:00:00Z"
                },
                "permissions": [
                  {
                    "permission_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                    "name": "invoices:read",
                    "description": "Read invoices",
                    "status": "active",
                    "is_system": false,
                    "created_at": "2026-08-01T09:00:00Z",
                    "updated_at": "2026-08-01T09:00:00Z"
                  }
                ],
                "created_at": "2026-08-01T09:00:00Z"
              }
            ]
          }
        }
      },
      {
        "permission": "client:api:create",
        "name": "AddClientAPIs",
        "request": "AddClientAPIsRequest",
        "response": "AddClientAPIsResponse",
        "details": {
          "overview": "Assigns one or more APIs to a client. The mutation is refused without an actor holding an identity in the tenant.",
          "notes": [
            "Every mutating RPC requires a user actor carried in the token's on_behalf_of claim; service tokens without an actor fail closed."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the client belongs to."
            },
            {
              "name": "client_uuid",
              "type": "string",
              "required": true,
              "description": "Management UUID of the client."
            },
            {
              "name": "api_uuids",
              "type": "repeated string",
              "required": true,
              "description": "API UUIDs to assign."
            },
            {
              "name": "actor_user_uuid",
              "type": "string",
              "required": false,
              "description": "Reserved field; attribution is taken from the authenticated token, never from the body."
            }
          ],
          "responseFields": [
            {
              "name": "message",
              "type": "string",
              "description": "Success confirmation message."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, the token is not bound to a tenant, or the token may only act on its own tenant."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or client does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "client_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "api_uuids": [
              "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d"
            ]
          },
          "responseExample": {
            "message": "APIs added to auth client successfully"
          }
        }
      },
      {
        "permission": "client:api:delete",
        "name": "RemoveClientAPI",
        "request": "RemoveClientAPIRequest",
        "response": "RemoveClientAPIResponse",
        "details": {
          "overview": "Removes an API assignment from a client.",
          "notes": [
            "Every mutating RPC requires a user actor carried in the token's on_behalf_of claim; service tokens without an actor fail closed."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the client belongs to."
            },
            {
              "name": "client_uuid",
              "type": "string",
              "required": true,
              "description": "Management UUID of the client."
            },
            {
              "name": "api_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the assigned API."
            },
            {
              "name": "actor_user_uuid",
              "type": "string",
              "required": false,
              "description": "Reserved field; attribution is taken from the authenticated token, never from the body."
            }
          ],
          "responseFields": [
            {
              "name": "message",
              "type": "string",
              "description": "Success confirmation message."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, the token is not bound to a tenant, or the token may only act on its own tenant."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or client does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "client_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "api_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d"
          },
          "responseExample": {
            "message": "API removed from auth client successfully"
          }
        }
      },
      {
        "permission": "client:api:permission:read",
        "name": "ListClientAPIPermissions",
        "request": "ListClientAPIPermissionsRequest",
        "response": "ListClientAPIPermissionsResponse",
        "details": {
          "overview": "Returns the permissions a client holds under a specific assigned API.",
          "notes": [
            "The API must already be assigned to the client."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the client belongs to."
            },
            {
              "name": "client_uuid",
              "type": "string",
              "required": true,
              "description": "Management UUID of the client."
            },
            {
              "name": "api_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the assigned API."
            }
          ],
          "responseFields": [
            {
              "name": "permissions",
              "type": "repeated ClientAPIPermission",
              "description": "The client's permissions for the API."
            },
            {
              "name": "permissions[].permission_uuid",
              "type": "string",
              "description": "Permission UUID."
            },
            {
              "name": "permissions[].name",
              "type": "string",
              "description": "Permission name."
            },
            {
              "name": "permissions[].description",
              "type": "string",
              "description": "Permission description."
            },
            {
              "name": "permissions[].status",
              "type": "string",
              "description": "Permission status."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, the token is not bound to a tenant, or the token may only act on its own tenant."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or client does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "client_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "api_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d"
          },
          "responseExample": {
            "permissions": [
              {
                "permission_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "name": "invoices:read",
                "description": "Read invoices",
                "status": "active",
                "is_system": false,
                "created_at": "2026-08-01T09:00:00Z",
                "updated_at": "2026-08-01T09:00:00Z"
              }
            ]
          }
        }
      },
      {
        "permission": "client:api:permission:create",
        "name": "AddClientAPIPermissions",
        "request": "AddClientAPIPermissionsRequest",
        "response": "AddClientAPIPermissionsResponse",
        "details": {
          "overview": "Grants one or more permissions under an assigned API to the client.",
          "notes": [
            "Every mutating RPC requires a user actor carried in the token's on_behalf_of claim; service tokens without an actor fail closed."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the client belongs to."
            },
            {
              "name": "client_uuid",
              "type": "string",
              "required": true,
              "description": "Management UUID of the client."
            },
            {
              "name": "api_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the assigned API."
            },
            {
              "name": "permission_uuids",
              "type": "repeated string",
              "required": true,
              "description": "Permission UUIDs to grant."
            },
            {
              "name": "actor_user_uuid",
              "type": "string",
              "required": false,
              "description": "Reserved field; attribution is taken from the authenticated token, never from the body."
            }
          ],
          "responseFields": [
            {
              "name": "message",
              "type": "string",
              "description": "Success confirmation message."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, the token is not bound to a tenant, or the token may only act on its own tenant."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or client does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "client_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "api_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "permission_uuids": [
              "f47ac10b-58cc-4372-a567-0e02b2c3d479"
            ]
          },
          "responseExample": {
            "message": "Permissions added to auth client API successfully"
          }
        }
      },
      {
        "permission": "client:api:permission:delete",
        "name": "RemoveClientAPIPermission",
        "request": "RemoveClientAPIPermissionRequest",
        "response": "RemoveClientAPIPermissionResponse",
        "details": {
          "overview": "Revokes a single permission under an assigned API from the client.",
          "notes": [
            "Every mutating RPC requires a user actor carried in the token's on_behalf_of claim; service tokens without an actor fail closed."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the client belongs to."
            },
            {
              "name": "client_uuid",
              "type": "string",
              "required": true,
              "description": "Management UUID of the client."
            },
            {
              "name": "api_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the assigned API."
            },
            {
              "name": "permission_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the permission to revoke."
            },
            {
              "name": "actor_user_uuid",
              "type": "string",
              "required": false,
              "description": "Reserved field; attribution is taken from the authenticated token, never from the body."
            }
          ],
          "responseFields": [
            {
              "name": "message",
              "type": "string",
              "description": "Success confirmation message."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, the token is not bound to a tenant, or the token may only act on its own tenant."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant or client does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "client_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "api_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "permission_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          },
          "responseExample": {
            "message": "Permission removed from auth client API successfully"
          }
        }
      },
    ]
  },
  {
    "slug": "services",
    "proto": "service.proto",
    "label": "Services",
    "description": "Service principals, policy bundles, and service-to-policy bindings.",
    "rpcCount": 9,
    "rpcs": [
      {
        "permission": "",
        "name": "GetMyPolicyBundle",
        "request": "GetMyPolicyBundleRequest",
        "response": "GetMyPolicyBundleResponse",
        "details": {
          "overview": "Returns the policy bundle for the calling service principal: the complete set of authorization documents a running workload enforces, addressed to its own service identity.",
          "notes": [
            "The identity comes from the token's svc claim (or a service subject), never from the request.",
            "The bundle version is a content hash carried in etag; sending if_none_match equal to the etag returns not_modified=true with no bundle.",
            "Only active policies are included; one unparseable attached policy fails the whole bundle."
          ],
          "requestFields": [
            {
              "name": "if_none_match",
              "type": "string",
              "required": false,
              "description": "Previously received etag; when it matches the current bundle, the response is not_modified=true."
            }
          ],
          "responseFields": [
            {
              "name": "bundle.service",
              "type": "string",
              "description": "The service principal name."
            },
            {
              "name": "bundle.version",
              "type": "string",
              "description": "Content-hash version of the bundle."
            },
            {
              "name": "bundle.policies",
              "type": "repeated google.protobuf.Struct",
              "description": "The policy documents: { version: v1, statement: [{ effect, action[], resource[] }] }."
            },
            {
              "name": "bundle.generated_at",
              "type": "google.protobuf.Timestamp",
              "description": "Generation time."
            },
            {
              "name": "etag",
              "type": "string",
              "description": "The current bundle etag."
            },
            {
              "name": "not_modified",
              "type": "bool",
              "description": "True when if_none_match matched; the bundle is omitted."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, service, or policy does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "if_none_match": "v9f2c1a3b4d5e6"
          },
          "responseExample": {
            "bundle": {
              "service": "billing-service",
              "version": "v9f2c1a3b4d5e6",
              "policies": [
                {
                  "version": "v1",
                  "statement": [
                    {
                      "effect": "allow",
                      "action": [
                        "invoices:read"
                      ],
                      "resource": [
                        "billing-api"
                      ]
                    }
                  ]
                }
              ],
              "generated_at": "2026-08-15T09:00:00Z"
            },
            "etag": "v9f2c1a3b4d5e6",
            "not_modified": false
          }
        }
      },
      {
        "permission": "service:read",
        "name": "ListServices",
        "request": "ListServicesRequest",
        "response": "ListServicesResponse",
        "details": {
          "overview": "Lists services in a tenant with filtering and pagination. Each row includes API and policy counts.",
          "notes": [
            "status accepts multiple values from active, maintenance, deprecated, inactive."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the service belongs to."
            },
            {
              "name": "name",
              "type": "string",
              "required": false,
              "description": "Case-insensitive partial match on name."
            },
            {
              "name": "display_name",
              "type": "string",
              "required": false,
              "description": "Case-insensitive partial match on display name."
            },
            {
              "name": "description",
              "type": "string",
              "required": false,
              "description": "Case-insensitive partial match on description."
            },
            {
              "name": "version",
              "type": "string",
              "required": false,
              "description": "Case-insensitive partial match on version."
            },
            {
              "name": "status",
              "type": "repeated string",
              "required": false,
              "description": "Filter by status: active, maintenance, deprecated, inactive."
            },
            {
              "name": "is_system",
              "type": "optional bool",
              "required": false,
              "description": "Filter by system flag."
            },
            {
              "name": "pagination",
              "type": "Pagination",
              "required": false,
              "description": "Standard pagination."
            }
          ],
          "responseFields": [
            {
              "name": "services",
              "type": "repeated Service",
              "description": "The matching service records."
            },
            {
              "name": "page.total",
              "type": "int64",
              "description": "Total matching services."
            },
            {
              "name": "page.page",
              "type": "int32",
              "description": "Current page."
            },
            {
              "name": "page.limit",
              "type": "int32",
              "description": "Page size."
            },
            {
              "name": "page.total_pages",
              "type": "int32",
              "description": "Total page count."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, service, or policy does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "status": [
              "active"
            ],
            "pagination": {
              "page": 1,
              "limit": 20
            }
          },
          "responseExample": {
            "services": [
              {
                "service_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "name": "billing-service",
                "display_name": "Billing Service",
                "description": "Handles billing operations",
                "version": "1.0.0",
                "status": "active",
                "is_system": false,
                "api_count": 2,
                "policy_count": 1,
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
          }
        }
      },
      {
        "permission": "service:read",
        "name": "GetService",
        "request": "GetServiceRequest",
        "response": "GetServiceResponse",
        "details": {
          "overview": "Returns one service principal by UUID in the named tenant.",
          "notes": [
            "Services outside the caller's tenant scope respond as not found."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the service belongs to."
            },
            {
              "name": "service_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the service principal."
            }
          ],
          "responseFields": [
            {
              "name": "service",
              "type": "Service",
              "description": "The service record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, service, or policy does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "service_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          },
          "responseExample": {
            "service": {
              "service_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "billing-service",
              "display_name": "Billing Service",
              "description": "Handles billing operations",
              "version": "1.0.0",
              "status": "active",
              "is_system": false,
              "api_count": 2,
              "policy_count": 1,
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "service:create",
        "name": "CreateService",
        "request": "CreateServiceRequest",
        "response": "CreateServiceResponse",
        "details": {
          "overview": "Creates a service principal in the named tenant. A service row is the identity that policy bundles are served to and that APIs hang off.",
          "notes": [
            "Service names are unique per tenant."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the service belongs to."
            },
            {
              "name": "name",
              "type": "string",
              "required": true,
              "description": "Service name. 3-50 characters, unique per tenant."
            },
            {
              "name": "display_name",
              "type": "string",
              "required": true,
              "description": "Human-readable name. 3-100 characters."
            },
            {
              "name": "description",
              "type": "string",
              "required": false,
              "description": "Description. At most 255 characters."
            },
            {
              "name": "version",
              "type": "string",
              "required": true,
              "description": "Service version. 1-20 characters."
            },
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "One of active, maintenance, deprecated, inactive."
            }
          ],
          "responseFields": [
            {
              "name": "service",
              "type": "Service",
              "description": "The created service record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, service, or policy does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "name": "billing-service",
            "display_name": "Billing Service",
            "description": "Handles billing operations",
            "version": "1.0.0",
            "status": "active"
          },
          "responseExample": {
            "service": {
              "service_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "billing-service",
              "display_name": "Billing Service",
              "description": "Handles billing operations",
              "version": "1.0.0",
              "status": "active",
              "is_system": false,
              "api_count": 2,
              "policy_count": 1,
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "service:update",
        "name": "UpdateService",
        "request": "UpdateServiceRequest",
        "response": "UpdateServiceResponse",
        "details": {
          "overview": "Replaces a service's fields. Renaming or disabling a service redirects or blanks the authorization rules a running workload enforces.",
          "notes": [
            "System services cannot be updated."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the service belongs to."
            },
            {
              "name": "service_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the service principal."
            },
            {
              "name": "name",
              "type": "string",
              "required": true,
              "description": "Service name. 3-50 characters, unique per tenant."
            },
            {
              "name": "display_name",
              "type": "string",
              "required": true,
              "description": "Human-readable name. 3-100 characters."
            },
            {
              "name": "description",
              "type": "string",
              "required": false,
              "description": "Description. At most 255 characters."
            },
            {
              "name": "version",
              "type": "string",
              "required": true,
              "description": "Service version. 1-20 characters."
            },
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "One of active, maintenance, deprecated, inactive."
            }
          ],
          "responseFields": [
            {
              "name": "service",
              "type": "Service",
              "description": "The updated service record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, service, or policy does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "service_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "name": "billing-service",
            "display_name": "Billing Service",
            "description": "Handles billing and payments",
            "version": "1.1.0",
            "status": "active"
          },
          "responseExample": {
            "service": {
              "service_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "billing-service",
              "display_name": "Billing Service",
              "description": "Handles billing operations",
              "version": "1.1.0",
              "status": "active",
              "is_system": false,
              "api_count": 2,
              "policy_count": 1,
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "service:update",
        "name": "SetServiceStatus",
        "request": "SetServiceStatusRequest",
        "response": "SetServiceStatusResponse",
        "details": {
          "overview": "Updates only a service's status. Disabling a service stops it from fetching policy bundles and blanks the authorization rules its workload enforces.",
          "notes": [
            "System service status cannot be updated."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the service belongs to."
            },
            {
              "name": "service_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the service principal."
            },
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "One of active, maintenance, deprecated, inactive."
            }
          ],
          "responseFields": [
            {
              "name": "service",
              "type": "Service",
              "description": "The updated service record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, service, or policy does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "service_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "status": "maintenance"
          },
          "responseExample": {
            "service": {
              "service_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "billing-service",
              "display_name": "Billing Service",
              "description": "Handles billing operations",
              "version": "1.0.0",
              "status": "maintenance",
              "is_system": false,
              "api_count": 2,
              "policy_count": 1,
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "service:delete",
        "name": "DeleteService",
        "request": "DeleteServiceRequest",
        "response": "DeleteServiceResponse",
        "details": {
          "overview": "Soft-deletes a service, cascading to its APIs and their permissions in the same transaction.",
          "notes": [
            "System services cannot be deleted."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the service belongs to."
            },
            {
              "name": "service_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the service principal."
            }
          ],
          "responseFields": [
            {
              "name": "service",
              "type": "Service",
              "description": "The deleted service record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, service, or policy does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "service_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          },
          "responseExample": {
            "service": {
              "service_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "billing-service",
              "display_name": "Billing Service",
              "description": "Handles billing operations",
              "version": "1.0.0",
              "status": "active",
              "is_system": false,
              "api_count": 2,
              "policy_count": 1,
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "service:policy:assign",
        "name": "AssignServicePolicy",
        "request": "AssignServicePolicyRequest",
        "response": "AssignServicePolicyResponse",
        "details": {
          "overview": "Binds a policy to a service. This is where an inert policy document starts deciding real requests for the service's workload.",
          "notes": [
            "Both the service and the policy must belong to the named tenant.",
            "Idempotent: an existing assignment returns success without a duplicate."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the service belongs to."
            },
            {
              "name": "service_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the service principal."
            },
            {
              "name": "policy_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the policy to bind."
            }
          ],
          "responseFields": [
            {
              "name": "assigned",
              "type": "bool",
              "description": "Always true on success."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, service, or policy does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "service_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "policy_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d"
          },
          "responseExample": {
            "assigned": true
          }
        }
      },
      {
        "permission": "service:policy:remove",
        "name": "RemoveServicePolicy",
        "request": "RemoveServicePolicyRequest",
        "response": "RemoveServicePolicyResponse",
        "details": {
          "overview": "Unbinds a policy from a service. Dropping a deny policy changes what the workload allows.",
          "notes": [
            "Idempotent: removing an assignment that does not exist still succeeds."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the service belongs to."
            },
            {
              "name": "service_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the service principal."
            },
            {
              "name": "policy_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the policy to unbind."
            }
          ],
          "responseFields": [
            {
              "name": "removed",
              "type": "bool",
              "description": "Always true on success."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, service, or policy does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "service_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "policy_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d"
          },
          "responseExample": {
            "removed": true
          }
        }
      },
    ]
  },
  {
    "slug": "apis",
    "proto": "api.proto",
    "label": "APIs",
    "description": "API resource definitions used as token audiences.",
    "rpcCount": 6,
    "rpcs": [
      {
        "permission": "api:read",
        "name": "ListAPIs",
        "request": "ListAPIsRequest",
        "response": "ListAPIsResponse",
        "details": {
          "overview": "Lists API resource definitions in a tenant with filtering and pagination. Each API carries its server-generated audience identifier.",
          "notes": [
            "The identifier is the audience that token issuance and permission scoping resolve against.",
            "status accepts multiple values."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the API belongs to."
            },
            {
              "name": "name",
              "type": "string",
              "required": false,
              "description": "Case-insensitive partial match on name."
            },
            {
              "name": "display_name",
              "type": "string",
              "required": false,
              "description": "Case-insensitive partial match on display name."
            },
            {
              "name": "identifier",
              "type": "string",
              "required": false,
              "description": "Exact match on the audience identifier."
            },
            {
              "name": "service_uuid",
              "type": "string",
              "required": false,
              "description": "Filter by owning service UUID."
            },
            {
              "name": "status",
              "type": "repeated string",
              "required": false,
              "description": "Filter by status: active, inactive."
            },
            {
              "name": "is_system",
              "type": "optional bool",
              "required": false,
              "description": "Filter by system flag."
            },
            {
              "name": "pagination",
              "type": "Pagination",
              "required": false,
              "description": "Standard pagination."
            }
          ],
          "responseFields": [
            {
              "name": "apis",
              "type": "repeated API",
              "description": "The matching API records."
            },
            {
              "name": "page.total",
              "type": "int64",
              "description": "Total matching APIs."
            },
            {
              "name": "page.page",
              "type": "int32",
              "description": "Current page."
            },
            {
              "name": "page.limit",
              "type": "int32",
              "description": "Page size."
            },
            {
              "name": "page.total_pages",
              "type": "int32",
              "description": "Total page count."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, API, or owning service does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "status": [
              "active"
            ],
            "pagination": {
              "page": 1,
              "limit": 20
            }
          },
          "responseExample": {
            "apis": [
              {
                "api_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "name": "billing",
                "display_name": "Billing API",
                "description": "Billing and invoicing endpoints",
                "identifier": "api-9d1d5b4d3a7e",
                "status": "active",
                "is_system": false,
                "service": {
                  "service_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                  "name": "billing-service",
                  "display_name": "Billing Service",
                  "description": "Handles billing operations",
                  "version": "1.0.0",
                  "status": "active",
                  "is_system": false,
                  "api_count": 2,
                  "policy_count": 1,
                  "created_at": "2026-08-01T09:00:00Z",
                  "updated_at": "2026-08-01T09:00:00Z"
                },
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
          }
        }
      },
      {
        "permission": "api:read",
        "name": "GetAPI",
        "request": "GetAPIRequest",
        "response": "GetAPIResponse",
        "details": {
          "overview": "Returns one API resource definition by UUID in the named tenant.",
          "notes": [
            "APIs outside the caller's tenant scope respond as not found."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the API belongs to."
            },
            {
              "name": "api_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the API resource."
            }
          ],
          "responseFields": [
            {
              "name": "api",
              "type": "API",
              "description": "The API record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, API, or owning service does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "api_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          },
          "responseExample": {
            "api": {
              "api_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "billing",
              "display_name": "Billing API",
              "description": "Billing and invoicing endpoints",
              "identifier": "api-9d1d5b4d3a7e",
              "status": "active",
              "is_system": false,
              "service": {
                "service_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                "name": "billing-service",
                "display_name": "Billing Service",
                "description": "Handles billing operations",
                "version": "1.0.0",
                "status": "active",
                "is_system": false,
                "api_count": 2,
                "policy_count": 1,
                "created_at": "2026-08-01T09:00:00Z",
                "updated_at": "2026-08-01T09:00:00Z"
              },
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "api:create",
        "name": "CreateAPI",
        "request": "CreateAPIRequest",
        "response": "CreateAPIResponse",
        "details": {
          "overview": "Creates an API resource definition in the named tenant. The server generates the audience identifier (api-<random>).",
          "notes": [
            "The identifier is the audience that token issuance and permission scoping resolve against.",
            "API names are unique per tenant."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the API belongs to."
            },
            {
              "name": "name",
              "type": "string",
              "required": true,
              "description": "Machine name. 3-50 characters, unique per tenant."
            },
            {
              "name": "display_name",
              "type": "string",
              "required": true,
              "description": "Human-readable name. 3-50 characters."
            },
            {
              "name": "description",
              "type": "string",
              "required": false,
              "description": "Description. At most 200 characters."
            },
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "One of active or inactive."
            },
            {
              "name": "service_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the owning service."
            }
          ],
          "responseFields": [
            {
              "name": "api",
              "type": "API",
              "description": "The created API record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, API, or owning service does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "name": "billing",
            "display_name": "Billing API",
            "description": "Billing and invoicing endpoints",
            "status": "active",
            "service_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d"
          },
          "responseExample": {
            "api": {
              "api_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "billing",
              "display_name": "Billing API",
              "description": "Billing and invoicing endpoints",
              "identifier": "api-9d1d5b4d3a7e",
              "status": "active",
              "is_system": false,
              "service": {
                "service_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                "name": "billing-service",
                "display_name": "Billing Service",
                "description": "Handles billing operations",
                "version": "1.0.0",
                "status": "active",
                "is_system": false,
                "api_count": 2,
                "policy_count": 1,
                "created_at": "2026-08-01T09:00:00Z",
                "updated_at": "2026-08-01T09:00:00Z"
              },
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "api:update",
        "name": "UpdateAPI",
        "request": "UpdateAPIRequest",
        "response": "UpdateAPIResponse",
        "details": {
          "overview": "Replaces an API resource definition. Because the identifier is the audience that token issuance and permission scoping resolve against, editing an existing API is sensitive.",
          "notes": [
            "System APIs cannot be updated."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the API belongs to."
            },
            {
              "name": "api_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the API resource."
            },
            {
              "name": "name",
              "type": "string",
              "required": true,
              "description": "Machine name. 3-50 characters, unique per tenant."
            },
            {
              "name": "display_name",
              "type": "string",
              "required": true,
              "description": "Human-readable name. 3-50 characters."
            },
            {
              "name": "description",
              "type": "string",
              "required": false,
              "description": "Description. At most 200 characters."
            },
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "One of active or inactive."
            },
            {
              "name": "service_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the owning service."
            }
          ],
          "responseFields": [
            {
              "name": "api",
              "type": "API",
              "description": "The updated API record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, API, or owning service does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "api_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "name": "billing",
            "display_name": "Billing API",
            "description": "Billing and invoicing endpoints (updated)",
            "status": "active",
            "service_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d"
          },
          "responseExample": {
            "api": {
              "api_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "billing",
              "display_name": "Billing API",
              "description": "Billing and invoicing endpoints",
              "identifier": "api-9d1d5b4d3a7e",
              "status": "active",
              "is_system": false,
              "service": {
                "service_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                "name": "billing-service",
                "display_name": "Billing Service",
                "description": "Handles billing operations",
                "version": "1.0.0",
                "status": "active",
                "is_system": false,
                "api_count": 2,
                "policy_count": 1,
                "created_at": "2026-08-01T09:00:00Z",
                "updated_at": "2026-08-01T09:00:00Z"
              },
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "api:update",
        "name": "SetAPIStatus",
        "request": "SetAPIStatusRequest",
        "response": "SetAPIStatusResponse",
        "details": {
          "overview": "Updates only an API's status. Deactivating an API stops its permissions from being issuable in tokens.",
          "notes": [
            "System API status cannot be updated."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the API belongs to."
            },
            {
              "name": "api_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the API resource."
            },
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "One of active or inactive."
            }
          ],
          "responseFields": [
            {
              "name": "api",
              "type": "API",
              "description": "The updated API record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, API, or owning service does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "api_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "status": "inactive"
          },
          "responseExample": {
            "api": {
              "api_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "billing",
              "display_name": "Billing API",
              "description": "Billing and invoicing endpoints",
              "identifier": "api-9d1d5b4d3a7e",
              "status": "inactive",
              "is_system": false,
              "service": {
                "service_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                "name": "billing-service",
                "display_name": "Billing Service",
                "description": "Handles billing operations",
                "version": "1.0.0",
                "status": "active",
                "is_system": false,
                "api_count": 2,
                "policy_count": 1,
                "created_at": "2026-08-01T09:00:00Z",
                "updated_at": "2026-08-01T09:00:00Z"
              },
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "api:delete",
        "name": "DeleteAPI",
        "request": "DeleteAPIRequest",
        "response": "DeleteAPIResponse",
        "details": {
          "overview": "Soft-deletes an API resource definition. All permissions belonging to the API within the tenant are soft-deleted in the same transaction.",
          "notes": [
            "System APIs cannot be deleted."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the API belongs to."
            },
            {
              "name": "api_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the API resource."
            }
          ],
          "responseFields": [
            {
              "name": "api",
              "type": "API",
              "description": "The deleted API record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, API, or owning service does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "api_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          },
          "responseExample": {
            "api": {
              "api_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "billing",
              "display_name": "Billing API",
              "description": "Billing and invoicing endpoints",
              "identifier": "api-9d1d5b4d3a7e",
              "status": "active",
              "is_system": false,
              "service": {
                "service_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                "name": "billing-service",
                "display_name": "Billing Service",
                "description": "Handles billing operations",
                "version": "1.0.0",
                "status": "active",
                "is_system": false,
                "api_count": 2,
                "policy_count": 1,
                "created_at": "2026-08-01T09:00:00Z",
                "updated_at": "2026-08-01T09:00:00Z"
              },
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
    ]
  },
  {
    "slug": "permissions",
    "proto": "permission.proto",
    "label": "Permissions",
    "description": "Permission definitions scoped to API resources.",
    "rpcCount": 6,
    "rpcs": [
      {
        "permission": "permission:read",
        "name": "ListPermissions",
        "request": "ListPermissionsRequest",
        "response": "ListPermissionsResponse",
        "details": {
          "overview": "Lists permissions in a tenant with filtering and pagination. Each permission carries its owning API projection.",
          "notes": [
            "api_uuid and role_uuid filters resolve by UUID; unknown or cross-tenant references answer NotFound.",
            "The legacy client_uuid filter is unsupported."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the permission belongs to."
            },
            {
              "name": "name",
              "type": "string",
              "required": false,
              "description": "Case-insensitive partial match on name."
            },
            {
              "name": "description",
              "type": "string",
              "required": false,
              "description": "Case-insensitive partial match on description."
            },
            {
              "name": "api_uuid",
              "type": "string",
              "required": false,
              "description": "Filter by owning API UUID."
            },
            {
              "name": "role_uuid",
              "type": "string",
              "required": false,
              "description": "Filter by role assignment."
            },
            {
              "name": "client_uuid",
              "type": "string",
              "required": false,
              "description": "Unsupported legacy filter."
            },
            {
              "name": "status",
              "type": "string",
              "required": false,
              "description": "Exact status match: active or inactive."
            },
            {
              "name": "is_system",
              "type": "optional bool",
              "required": false,
              "description": "Filter by system flag."
            },
            {
              "name": "pagination",
              "type": "Pagination",
              "required": false,
              "description": "Standard pagination."
            }
          ],
          "responseFields": [
            {
              "name": "permissions",
              "type": "repeated Permission",
              "description": "The matching permission records."
            },
            {
              "name": "page.total",
              "type": "int64",
              "description": "Total matching permissions."
            },
            {
              "name": "page.page",
              "type": "int32",
              "description": "Current page."
            },
            {
              "name": "page.limit",
              "type": "int32",
              "description": "Page size."
            },
            {
              "name": "page.total_pages",
              "type": "int32",
              "description": "Total page count."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, permission, or owning API does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "api_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
            "pagination": {
              "page": 1,
              "limit": 20
            }
          },
          "responseExample": {
            "permissions": [
              {
                "permission_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "name": "invoices:read",
                "description": "Read invoices",
                "api": {
                  "api_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                  "name": "billing",
                  "display_name": "Billing API",
                  "description": "Billing and invoicing endpoints",
                  "identifier": "api-9d1d5b4d3a7e",
                  "status": "active",
                  "is_system": false,
                  "created_at": "2026-08-01T09:00:00Z",
                  "updated_at": "2026-08-01T09:00:00Z"
                },
                "status": "active",
                "is_system": false,
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
          }
        }
      },
      {
        "permission": "permission:read",
        "name": "GetPermission",
        "request": "GetPermissionRequest",
        "response": "GetPermissionResponse",
        "details": {
          "overview": "Returns one permission by UUID in the named tenant.",
          "notes": [
            "Permissions outside the caller's tenant scope respond as not found."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the permission belongs to."
            },
            {
              "name": "permission_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the permission."
            }
          ],
          "responseFields": [
            {
              "name": "permission",
              "type": "Permission",
              "description": "The permission record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, permission, or owning API does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "permission_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          },
          "responseExample": {
            "permission": {
              "permission_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "invoices:read",
              "description": "Read invoices",
              "api": {
                "api_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                "name": "billing",
                "display_name": "Billing API",
                "description": "Billing and invoicing endpoints",
                "identifier": "api-9d1d5b4d3a7e",
                "status": "active",
                "is_system": false,
                "created_at": "2026-08-01T09:00:00Z",
                "updated_at": "2026-08-01T09:00:00Z"
              },
              "status": "active",
              "is_system": false,
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "permission:create",
        "name": "CreatePermission",
        "request": "CreatePermissionRequest",
        "response": "CreatePermissionResponse",
        "details": {
          "overview": "Creates a permission under an API resource. The permission name is the authorization token: it must match the strict segment format and cannot start with a reserved namespace.",
          "notes": [
            "Name format: 2 to 4 lowercase colon-separated segments, e.g. invoices:read or users:read:own.",
            "Reserved first-segment namespaces (user, role, api, service, tenant, and others) are rejected.",
            "Permissions cannot be added to a system API.",
            "The api association is immutable after creation."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the permission belongs to."
            },
            {
              "name": "name",
              "type": "string",
              "required": true,
              "description": "Permission name, 3-50 characters: 2-4 lowercase colon-separated segments, unique per tenant, no reserved namespace."
            },
            {
              "name": "description",
              "type": "string",
              "required": false,
              "description": "Description. At most 200 characters."
            },
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "One of active or inactive."
            },
            {
              "name": "api_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the owning API resource. Immutable after creation."
            }
          ],
          "responseFields": [
            {
              "name": "permission",
              "type": "Permission",
              "description": "The created permission record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, permission, or owning API does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "name": "invoices:read",
            "description": "Read invoices",
            "status": "active",
            "api_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d"
          },
          "responseExample": {
            "permission": {
              "permission_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "invoices:read",
              "description": "Read invoices",
              "api": {
                "api_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                "name": "billing",
                "display_name": "Billing API",
                "description": "Billing and invoicing endpoints",
                "identifier": "api-9d1d5b4d3a7e",
                "status": "active",
                "is_system": false,
                "created_at": "2026-08-01T09:00:00Z",
                "updated_at": "2026-08-01T09:00:00Z"
              },
              "status": "active",
              "is_system": false,
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "permission:update",
        "name": "UpdatePermission",
        "request": "UpdatePermissionRequest",
        "response": "UpdatePermissionResponse",
        "details": {
          "overview": "Updates a permission's name, description, and status. Renaming a permission re-points every existing role grant at a different guard.",
          "notes": [
            "System permissions cannot be updated.",
            "The API association cannot be changed."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the permission belongs to."
            },
            {
              "name": "permission_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the permission."
            },
            {
              "name": "name",
              "type": "string",
              "required": true,
              "description": "Permission name, 3-50 characters: 2-4 lowercase colon-separated segments, unique per tenant, no reserved namespace."
            },
            {
              "name": "description",
              "type": "string",
              "required": false,
              "description": "Description. At most 200 characters."
            },
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "One of active or inactive."
            }
          ],
          "responseFields": [
            {
              "name": "permission",
              "type": "Permission",
              "description": "The updated permission record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, permission, or owning API does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "permission_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "name": "invoices:read",
            "description": "Read all invoices",
            "status": "active"
          },
          "responseExample": {
            "permission": {
              "permission_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "invoices:read",
              "description": "Read all invoices",
              "api": {
                "api_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                "name": "billing",
                "display_name": "Billing API",
                "description": "Billing and invoicing endpoints",
                "identifier": "api-9d1d5b4d3a7e",
                "status": "active",
                "is_system": false,
                "created_at": "2026-08-01T09:00:00Z",
                "updated_at": "2026-08-01T09:00:00Z"
              },
              "status": "active",
              "is_system": false,
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "permission:update",
        "name": "SetPermissionStatus",
        "request": "SetPermissionStatusRequest",
        "response": "SetPermissionStatusResponse",
        "details": {
          "overview": "Updates only a permission's status. Deactivating a permission revokes it everywhere at once.",
          "notes": [
            "System permissions cannot be modified."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the permission belongs to."
            },
            {
              "name": "permission_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the permission."
            },
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "One of active or inactive."
            }
          ],
          "responseFields": [
            {
              "name": "permission",
              "type": "Permission",
              "description": "The updated permission record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, permission, or owning API does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "permission_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "status": "inactive"
          },
          "responseExample": {
            "permission": {
              "permission_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "invoices:read",
              "description": "Read invoices",
              "api": {
                "api_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                "name": "billing",
                "display_name": "Billing API",
                "description": "Billing and invoicing endpoints",
                "identifier": "api-9d1d5b4d3a7e",
                "status": "active",
                "is_system": false,
                "created_at": "2026-08-01T09:00:00Z",
                "updated_at": "2026-08-01T09:00:00Z"
              },
              "status": "inactive",
              "is_system": false,
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "permission:delete",
        "name": "DeletePermission",
        "request": "DeletePermissionRequest",
        "response": "DeletePermissionResponse",
        "details": {
          "overview": "Soft-deletes a permission. Every role that held the permission loses it.",
          "notes": [
            "System permissions cannot be deleted."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the permission belongs to."
            },
            {
              "name": "permission_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the permission."
            }
          ],
          "responseFields": [
            {
              "name": "permission",
              "type": "Permission",
              "description": "The deleted permission record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, permission, or owning API does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "permission_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          },
          "responseExample": {
            "permission": {
              "permission_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "invoices:read",
              "description": "Read invoices",
              "api": {
                "api_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                "name": "billing",
                "display_name": "Billing API",
                "description": "Billing and invoicing endpoints",
                "identifier": "api-9d1d5b4d3a7e",
                "status": "active",
                "is_system": false,
                "created_at": "2026-08-01T09:00:00Z",
                "updated_at": "2026-08-01T09:00:00Z"
              },
              "status": "active",
              "is_system": false,
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
    ]
  },
  {
    "slug": "roles",
    "proto": "role.proto",
    "label": "Roles",
    "description": "Role CRUD and role-permission assignment.",
    "rpcCount": 9,
    "rpcs": [
      {
        "permission": "role:read",
        "name": "ListRoles",
        "request": "ListRolesRequest",
        "response": "ListRolesResponse",
        "details": {
          "overview": "Lists roles in a tenant with filtering and pagination. List rows do not include permissions.",
          "notes": [
            "The status filter is a single exact value."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the role belongs to."
            },
            {
              "name": "name",
              "type": "string",
              "required": false,
              "description": "Case-insensitive partial match on name."
            },
            {
              "name": "description",
              "type": "string",
              "required": false,
              "description": "Case-insensitive partial match on description."
            },
            {
              "name": "is_default",
              "type": "optional bool",
              "required": false,
              "description": "Filter by default-role flag."
            },
            {
              "name": "is_system",
              "type": "optional bool",
              "required": false,
              "description": "Filter by system flag."
            },
            {
              "name": "status",
              "type": "string",
              "required": false,
              "description": "Exact status match: active or inactive."
            },
            {
              "name": "pagination",
              "type": "Pagination",
              "required": false,
              "description": "Standard pagination."
            }
          ],
          "responseFields": [
            {
              "name": "roles",
              "type": "repeated Role",
              "description": "The matching role records."
            },
            {
              "name": "page.total",
              "type": "int64",
              "description": "Total matching roles."
            },
            {
              "name": "page.page",
              "type": "int32",
              "description": "Current page."
            },
            {
              "name": "page.limit",
              "type": "int32",
              "description": "Page size."
            },
            {
              "name": "page.total_pages",
              "type": "int32",
              "description": "Total page count."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, or an on_behalf_of actor is required and missing."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, role, or permission does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "status": "active",
            "pagination": {
              "page": 1,
              "limit": 20
            }
          },
          "responseExample": {
            "roles": [
              {
                "role_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "name": "billing-admin",
                "description": "Manages billing operations",
                "is_default": false,
                "is_system": false,
                "status": "active",
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
          }
        }
      },
      {
        "permission": "role:read",
        "name": "GetRole",
        "request": "GetRoleRequest",
        "response": "GetRoleResponse",
        "details": {
          "overview": "Returns one role by UUID in the named tenant.",
          "notes": [
            "Roles outside the caller's tenant scope respond as not found."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the role belongs to."
            },
            {
              "name": "role_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the role."
            }
          ],
          "responseFields": [
            {
              "name": "role",
              "type": "Role",
              "description": "The role record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, or an on_behalf_of actor is required and missing."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, role, or permission does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "role_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          },
          "responseExample": {
            "role": {
              "role_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "billing-admin",
              "description": "Manages billing operations",
              "is_default": false,
              "is_system": false,
              "status": "active",
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "role:create",
        "actorRequired": true,
        "name": "CreateRole",
        "request": "CreateRoleRequest",
        "response": "CreateRoleResponse",
        "details": {
          "overview": "Creates a role in the named tenant. A newly created role grants nothing until permissions are attached.",
          "notes": [
            "Role mutations require a user actor carried in the token's on_behalf_of claim; service tokens without an actor fail closed.",
            "is_default and is_system are always false for roles created through this RPC.",
            "Role names are unique per tenant."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the role belongs to."
            },
            {
              "name": "actor_user_uuid",
              "type": "string",
              "required": false,
              "description": "Reserved field; attribution is taken from the authenticated token, never from the body."
            },
            {
              "name": "name",
              "type": "string",
              "required": true,
              "description": "Role name. 3-20 characters: lowercase letters, numbers, hyphens, colons."
            },
            {
              "name": "description",
              "type": "string",
              "required": false,
              "description": "Description. At most 100 characters."
            },
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "One of active or inactive."
            }
          ],
          "responseFields": [
            {
              "name": "role",
              "type": "Role",
              "description": "The created role record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, or an on_behalf_of actor is required and missing."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, role, or permission does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "name": "billing-admin",
            "description": "Manages billing operations",
            "status": "active"
          },
          "responseExample": {
            "role": {
              "role_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "billing-admin",
              "description": "Manages billing operations",
              "is_default": false,
              "is_system": false,
              "status": "active",
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "role:update",
        "actorRequired": true,
        "name": "UpdateRole",
        "request": "UpdateRoleRequest",
        "response": "UpdateRoleResponse",
        "details": {
          "overview": "Updates a role's name, description, and status in the named tenant.",
          "notes": [
            "Role mutations require a user actor carried in the token's on_behalf_of claim; service tokens without an actor fail closed.",
            "System roles cannot be updated.",
            "The default and system flags cannot be changed through this RPC."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the role belongs to."
            },
            {
              "name": "actor_user_uuid",
              "type": "string",
              "required": false,
              "description": "Reserved field; attribution is taken from the authenticated token, never from the body."
            },
            {
              "name": "role_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the role."
            },
            {
              "name": "name",
              "type": "string",
              "required": true,
              "description": "Role name. 3-20 characters: lowercase letters, numbers, hyphens, colons."
            },
            {
              "name": "description",
              "type": "string",
              "required": false,
              "description": "Description. At most 100 characters."
            },
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "One of active or inactive."
            }
          ],
          "responseFields": [
            {
              "name": "role",
              "type": "Role",
              "description": "The updated role record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, or an on_behalf_of actor is required and missing."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, role, or permission does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "role_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "name": "billing-admin",
            "description": "Manages all billing operations",
            "status": "active"
          },
          "responseExample": {
            "role": {
              "role_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "billing-admin",
              "description": "Manages all billing operations",
              "is_default": false,
              "is_system": false,
              "status": "active",
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "role:update",
        "actorRequired": true,
        "name": "SetRoleStatus",
        "request": "SetRoleStatusRequest",
        "response": "SetRoleStatusResponse",
        "details": {
          "overview": "Updates only a role's status. Deactivating a role removes what it grants everywhere it is assigned.",
          "notes": [
            "Role mutations require a user actor carried in the token's on_behalf_of claim; service tokens without an actor fail closed.",
            "System roles cannot be updated, and the tenant default role cannot be deactivated."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the role belongs to."
            },
            {
              "name": "actor_user_uuid",
              "type": "string",
              "required": false,
              "description": "Reserved field; attribution is taken from the authenticated token, never from the body."
            },
            {
              "name": "role_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the role."
            },
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "One of active or inactive."
            }
          ],
          "responseFields": [
            {
              "name": "role",
              "type": "Role",
              "description": "The updated role record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, or an on_behalf_of actor is required and missing."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, role, or permission does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "role_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "status": "inactive"
          },
          "responseExample": {
            "role": {
              "role_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "billing-admin",
              "description": "Manages billing operations",
              "is_default": false,
              "is_system": false,
              "status": "inactive",
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "role:delete",
        "actorRequired": true,
        "name": "DeleteRole",
        "request": "DeleteRoleRequest",
        "response": "DeleteRoleResponse",
        "details": {
          "overview": "Soft-deletes a role in the named tenant. Assignments referencing the role stop granting.",
          "notes": [
            "Role mutations require a user actor carried in the token's on_behalf_of claim; service tokens without an actor fail closed.",
            "System roles and the tenant default role cannot be deleted."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the role belongs to."
            },
            {
              "name": "actor_user_uuid",
              "type": "string",
              "required": false,
              "description": "Reserved field; attribution is taken from the authenticated token, never from the body."
            },
            {
              "name": "role_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the role."
            }
          ],
          "responseFields": [
            {
              "name": "role",
              "type": "Role",
              "description": "The deleted role record."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, or an on_behalf_of actor is required and missing."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, role, or permission does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "role_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          },
          "responseExample": {
            "role": {
              "role_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "billing-admin",
              "description": "Manages billing operations",
              "is_default": false,
              "is_system": false,
              "status": "active",
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
      {
        "permission": "role:read",
        "name": "ListRolePermissions",
        "request": "ListRolePermissionsRequest",
        "response": "ListRolePermissionsResponse",
        "details": {
          "overview": "Returns the permissions attached to a role with pagination. Each row carries the owning API projection.",
          "notes": [
            "status is a single exact filter with no enum validation."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the role belongs to."
            },
            {
              "name": "role_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the role."
            },
            {
              "name": "status",
              "type": "string",
              "required": false,
              "description": "Exact status match."
            },
            {
              "name": "pagination",
              "type": "Pagination",
              "required": false,
              "description": "Standard pagination."
            }
          ],
          "responseFields": [
            {
              "name": "permissions",
              "type": "repeated Permission",
              "description": "The role's permissions."
            },
            {
              "name": "page",
              "type": "PageMetadata",
              "description": "Pagination metadata."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, or an on_behalf_of actor is required and missing."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, role, or permission does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "role_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "pagination": {
              "page": 1,
              "limit": 20
            }
          },
          "responseExample": {
            "permissions": [
              {
                "permission_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                "name": "invoices:read",
                "description": "Read invoices",
                "status": "active",
                "is_system": false,
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
          }
        }
      },
      {
        "permission": "role:permission:create",
        "actorRequired": true,
        "name": "AddRolePermissions",
        "request": "AddRolePermissionsRequest",
        "response": "AddRolePermissionsResponse",
        "details": {
          "overview": "Attaches permissions to a role. This is the privilege-escalation edge: the actor may not attach an elevated permission they do not themselves hold.",
          "notes": [
            "Role mutations require a user actor carried in the token's on_behalf_of claim; service tokens without an actor fail closed.",
            "Between 1 and 200 permission UUIDs per request.",
            "System roles cannot be modified.",
            "Idempotent: already-existing associations are skipped."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the role belongs to."
            },
            {
              "name": "actor_user_uuid",
              "type": "string",
              "required": false,
              "description": "Reserved field; attribution is taken from the authenticated token, never from the body."
            },
            {
              "name": "role_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the role."
            },
            {
              "name": "permission_uuids",
              "type": "repeated string",
              "required": true,
              "description": "1-200 permission UUIDs to attach."
            }
          ],
          "responseFields": [
            {
              "name": "role",
              "type": "Role",
              "description": "The role with its permissions array populated."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, or an on_behalf_of actor is required and missing."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, role, or permission does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "role_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "permission_uuids": [
              "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d"
            ]
          },
          "responseExample": {
            "role": {
              "role_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "billing-admin",
              "description": "Manages billing operations",
              "is_default": false,
              "is_system": false,
              "status": "active",
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z",
              "permissions": [
                {
                  "permission_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                  "name": "invoices:read",
                  "description": "Read invoices",
                  "status": "active",
                  "is_system": false,
                  "created_at": "2026-08-01T09:00:00Z",
                  "updated_at": "2026-08-01T09:00:00Z"
                }
              ]
            }
          }
        }
      },
      {
        "permission": "role:permission:delete",
        "actorRequired": true,
        "name": "RemoveRolePermission",
        "request": "RemoveRolePermissionRequest",
        "response": "RemoveRolePermissionResponse",
        "details": {
          "overview": "Detaches a single permission from a role. Idempotent: removing an association that does not exist still succeeds.",
          "notes": [
            "Role mutations require a user actor carried in the token's on_behalf_of claim; service tokens without an actor fail closed.",
            "System roles cannot be modified."
          ],
          "requestFields": [
            {
              "name": "tenant_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the tenant the role belongs to."
            },
            {
              "name": "actor_user_uuid",
              "type": "string",
              "required": false,
              "description": "Reserved field; attribution is taken from the authenticated token, never from the body."
            },
            {
              "name": "role_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the role."
            },
            {
              "name": "permission_uuid",
              "type": "string",
              "required": true,
              "description": "UUID of the permission to detach."
            }
          ],
          "responseFields": [
            {
              "name": "role",
              "type": "Role",
              "description": "The role with its permissions array populated."
            }
          ],
          "errors": [
            {
              "code": "Unauthenticated",
              "description": "No authenticated actor is bound to the request."
            },
            {
              "code": "PermissionDenied",
              "description": "The caller's policy does not allow the mapped permission, or an on_behalf_of actor is required and missing."
            },
            {
              "code": "InvalidArgument",
              "description": "A UUID is missing or invalid, or a field fails validation."
            },
            {
              "code": "NotFound",
              "description": "The tenant, role, or permission does not exist in scope."
            },
            {
              "code": "Internal",
              "description": "An unexpected storage or service error occurred."
            }
          ],
          "requestExample": {
            "tenant_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "role_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "permission_uuid": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d"
          },
          "responseExample": {
            "role": {
              "role_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "name": "billing-admin",
              "description": "Manages billing operations",
              "is_default": false,
              "is_system": false,
              "status": "active",
              "created_at": "2026-08-01T09:00:00Z",
              "updated_at": "2026-08-10T09:00:00Z"
            }
          }
        }
      },
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
