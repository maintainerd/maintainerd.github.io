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
          "errors": [
            { "code": "Internal", "description": "The bootstrap state could not be read from storage." }
          ]
        }
      },
      {
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
          "errors": [
            { "code": "InvalidArgument", "description": "A required field is missing or fails validation (field violations are carried in the BadRequest details)." },
            { "code": "AlreadyExists", "description": "A tenant already exists in this instance, or setup has completed and is locked." },
            { "code": "PermissionDenied", "description": "The orchestrated setup window has expired (SETUP_WINDOW_TTL)." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      },
      {
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
          "errors": [
            { "code": "InvalidArgument", "description": "A required field is missing or fails validation." },
            { "code": "AlreadyExists", "description": "An administrator already exists, or setup has completed and is locked." },
            { "code": "PermissionDenied", "description": "The orchestrated setup window has expired." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      },
      {
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
          "errors": [
            { "code": "InvalidArgument", "description": "A required field is missing or fails validation." },
            { "code": "AlreadyExists", "description": "Setup has completed and is locked." },
            { "code": "PermissionDenied", "description": "The orchestrated setup window has expired." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      },
      {
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
          "errors": [
            { "code": "InvalidArgument", "description": "A required field is missing or fails validation, or allowed_actions names permissions that do not exist." },
            { "code": "AlreadyExists", "description": "Setup has completed and is locked." },
            { "code": "PermissionDenied", "description": "The orchestrated setup window has expired." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      },
      {
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
          "errors": [
            { "code": "InvalidArgument", "description": "A required field is missing or fails validation (for example, both jwks and jwks_uri empty)." },
            { "code": "AlreadyExists", "description": "Setup has completed and is locked." },
            { "code": "PermissionDenied", "description": "The orchestrated setup window has expired." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      },
      {
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
          "errors": [
            { "code": "InvalidArgument", "description": "A required field is missing or fails validation." },
            { "code": "AlreadyExists", "description": "Setup has completed and is locked." },
            { "code": "PermissionDenied", "description": "The orchestrated setup window has expired." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      },
      {
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
          "errors": [
            { "code": "InvalidArgument", "description": "A required field is missing or fails validation." },
            { "code": "AlreadyExists", "description": "Setup has completed and is locked." },
            { "code": "PermissionDenied", "description": "The orchestrated setup window has expired." },
            { "code": "Internal", "description": "An unexpected storage or service error occurred." }
          ]
        }
      },
      {
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
    "proto": "tenant.proto",
    "label": "Tenants",
    "description": "Tenant lifecycle and tenant membership management.",
    "rpcCount": 11,
    "rpcs": [
      { "name": "GetDefaultTenant", "request": "GetDefaultTenantRequest", "response": "GetDefaultTenantResponse" },
      { "name": "ListTenants", "request": "ListTenantsRequest", "response": "ListTenantsResponse" },
      { "name": "GetTenant", "request": "GetTenantRequest", "response": "GetTenantResponse" },
      { "name": "CreateTenant", "request": "TenantServiceCreateTenantRequest", "response": "TenantServiceCreateTenantResponse" },
      { "name": "UpdateTenant", "request": "TenantServiceUpdateTenantRequest", "response": "TenantServiceUpdateTenantResponse" },
      { "name": "SetTenantStatus", "request": "SetTenantStatusRequest", "response": "SetTenantStatusResponse" },
      { "name": "DeleteTenant", "request": "DeleteTenantRequest", "response": "DeleteTenantResponse" },
      { "name": "ListTenantMembers", "request": "ListTenantMembersRequest", "response": "ListTenantMembersResponse" },
      { "name": "AddTenantMember", "request": "AddTenantMemberRequest", "response": "AddTenantMemberResponse" },
      { "name": "UpdateTenantMemberRole", "request": "UpdateTenantMemberRoleRequest", "response": "UpdateTenantMemberRoleResponse" },
      { "name": "RemoveTenantMember", "request": "RemoveTenantMemberRequest", "response": "RemoveTenantMemberResponse" }
    ]
  },
  {
    "slug": "tenant-settings",
    "proto": "tenant.proto",
    "label": "Tenant Settings",
    "description": "Per-tenant runtime controls for rate limiting, audit behavior, and maintenance windows.",
    "rpcCount": 6,
    "rpcs": [
      { "name": "GetRateLimitConfig", "request": "GetRateLimitConfigRequest", "response": "GetRateLimitConfigResponse" },
      { "name": "UpdateRateLimitConfig", "request": "UpdateRateLimitConfigRequest", "response": "UpdateRateLimitConfigResponse" },
      { "name": "GetAuditConfig", "request": "GetAuditConfigRequest", "response": "GetAuditConfigResponse" },
      { "name": "UpdateAuditConfig", "request": "UpdateAuditConfigRequest", "response": "UpdateAuditConfigResponse" },
      { "name": "GetMaintenanceConfig", "request": "GetMaintenanceConfigRequest", "response": "GetMaintenanceConfigResponse" },
      { "name": "UpdateMaintenanceConfig", "request": "UpdateMaintenanceConfigRequest", "response": "UpdateMaintenanceConfigResponse" }
    ]
  },
  {
    "slug": "users",
    "proto": "user.proto",
    "label": "Users",
    "description": "User account lifecycle, verification, roles, and identities.",
    "rpcCount": 14,
    "rpcs": [
      { "name": "ListUsers", "request": "ListUsersRequest", "response": "ListUsersResponse" },
      { "name": "GetUser", "request": "GetUserRequest", "response": "GetUserResponse" },
      { "name": "CreateUser", "request": "CreateUserRequest", "response": "CreateUserResponse" },
      { "name": "UpdateUser", "request": "UpdateUserRequest", "response": "UpdateUserResponse" },
      { "name": "SetUserStatus", "request": "SetUserStatusRequest", "response": "SetUserStatusResponse" },
      { "name": "VerifyUserEmail", "request": "VerifyUserEmailRequest", "response": "VerifyUserEmailResponse" },
      { "name": "VerifyUserPhone", "request": "VerifyUserPhoneRequest", "response": "VerifyUserPhoneResponse" },
      { "name": "CompleteUserAccount", "request": "CompleteUserAccountRequest", "response": "CompleteUserAccountResponse" },
      { "name": "DeleteUser", "request": "DeleteUserRequest", "response": "DeleteUserResponse" },
      { "name": "ForceUserPasswordChange", "request": "ForceUserPasswordChangeRequest", "response": "ForceUserPasswordChangeResponse" },
      { "name": "ListUserRoles", "request": "ListUserRolesRequest", "response": "ListUserRolesResponse" },
      { "name": "ListUserIdentities", "request": "ListUserIdentitiesRequest", "response": "ListUserIdentitiesResponse" },
      { "name": "AssignUserRoles", "request": "AssignUserRolesRequest", "response": "AssignUserRolesResponse" },
      { "name": "RemoveUserRole", "request": "RemoveUserRoleRequest", "response": "RemoveUserRoleResponse" }
    ]
  },
  {
    "slug": "user-profiles",
    "proto": "user.proto",
    "label": "User Profiles",
    "description": "Profile records attached to users, including default-profile selection.",
    "rpcCount": 6,
    "rpcs": [
      { "name": "ListUserProfiles", "request": "ListUserProfilesRequest", "response": "ListUserProfilesResponse" },
      { "name": "GetUserProfile", "request": "GetUserProfileRequest", "response": "GetUserProfileResponse" },
      { "name": "CreateUserProfile", "request": "CreateUserProfileRequest", "response": "CreateUserProfileResponse" },
      { "name": "UpdateUserProfile", "request": "UpdateUserProfileRequest", "response": "UpdateUserProfileResponse" },
      { "name": "SetDefaultUserProfile", "request": "SetDefaultUserProfileRequest", "response": "SetDefaultUserProfileResponse" },
      { "name": "DeleteUserProfile", "request": "DeleteUserProfileRequest", "response": "DeleteUserProfileResponse" }
    ]
  },
  {
    "slug": "clients",
    "proto": "client.proto",
    "label": "Applications and Clients",
    "description": "OAuth client lifecycle, secrets, URIs, API audiences, and API permissions.",
    "rpcCount": 19,
    "rpcs": [
      { "name": "ListClients", "request": "ListClientsRequest", "response": "ListClientsResponse" },
      { "name": "GetClient", "request": "GetClientRequest", "response": "GetClientResponse" },
      { "name": "GetClientSecret", "request": "GetClientSecretRequest", "response": "GetClientSecretResponse" },
      { "name": "RotateClientSecret", "request": "RotateClientSecretRequest", "response": "RotateClientSecretResponse" },
      { "name": "GetClientConfig", "request": "GetClientConfigRequest", "response": "GetClientConfigResponse" },
      { "name": "CreateClient", "request": "CreateClientRequest", "response": "CreateClientResponse" },
      { "name": "UpdateClient", "request": "UpdateClientRequest", "response": "UpdateClientResponse" },
      { "name": "SetClientStatus", "request": "SetClientStatusRequest", "response": "SetClientStatusResponse" },
      { "name": "DeleteClient", "request": "DeleteClientRequest", "response": "DeleteClientResponse" },
      { "name": "ListClientURIs", "request": "ListClientURIsRequest", "response": "ListClientURIsResponse" },
      { "name": "CreateClientURI", "request": "CreateClientURIRequest", "response": "CreateClientURIResponse" },
      { "name": "UpdateClientURI", "request": "UpdateClientURIRequest", "response": "UpdateClientURIResponse" },
      { "name": "DeleteClientURI", "request": "DeleteClientURIRequest", "response": "DeleteClientURIResponse" },
      { "name": "ListClientAPIs", "request": "ListClientAPIsRequest", "response": "ListClientAPIsResponse" },
      { "name": "AddClientAPIs", "request": "AddClientAPIsRequest", "response": "AddClientAPIsResponse" },
      { "name": "RemoveClientAPI", "request": "RemoveClientAPIRequest", "response": "RemoveClientAPIResponse" },
      { "name": "ListClientAPIPermissions", "request": "ListClientAPIPermissionsRequest", "response": "ListClientAPIPermissionsResponse" },
      { "name": "AddClientAPIPermissions", "request": "AddClientAPIPermissionsRequest", "response": "AddClientAPIPermissionsResponse" },
      { "name": "RemoveClientAPIPermission", "request": "RemoveClientAPIPermissionRequest", "response": "RemoveClientAPIPermissionResponse" }
    ]
  },
  {
    "slug": "services",
    "proto": "service.proto",
    "label": "Services",
    "description": "Service principals, policy bundles, and service-to-policy bindings.",
    "rpcCount": 9,
    "rpcs": [
      { "name": "GetMyPolicyBundle", "request": "GetMyPolicyBundleRequest", "response": "GetMyPolicyBundleResponse" },
      { "name": "ListServices", "request": "ListServicesRequest", "response": "ListServicesResponse" },
      { "name": "GetService", "request": "GetServiceRequest", "response": "GetServiceResponse" },
      { "name": "CreateService", "request": "CreateServiceRequest", "response": "CreateServiceResponse" },
      { "name": "UpdateService", "request": "UpdateServiceRequest", "response": "UpdateServiceResponse" },
      { "name": "SetServiceStatus", "request": "SetServiceStatusRequest", "response": "SetServiceStatusResponse" },
      { "name": "DeleteService", "request": "DeleteServiceRequest", "response": "DeleteServiceResponse" },
      { "name": "AssignServicePolicy", "request": "AssignServicePolicyRequest", "response": "AssignServicePolicyResponse" },
      { "name": "RemoveServicePolicy", "request": "RemoveServicePolicyRequest", "response": "RemoveServicePolicyResponse" }
    ]
  },
  {
    "slug": "apis",
    "proto": "api.proto",
    "label": "APIs",
    "description": "API resource definitions used as token audiences.",
    "rpcCount": 6,
    "rpcs": [
      { "name": "ListAPIs", "request": "ListAPIsRequest", "response": "ListAPIsResponse" },
      { "name": "GetAPI", "request": "GetAPIRequest", "response": "GetAPIResponse" },
      { "name": "CreateAPI", "request": "CreateAPIRequest", "response": "CreateAPIResponse" },
      { "name": "UpdateAPI", "request": "UpdateAPIRequest", "response": "UpdateAPIResponse" },
      { "name": "SetAPIStatus", "request": "SetAPIStatusRequest", "response": "SetAPIStatusResponse" },
      { "name": "DeleteAPI", "request": "DeleteAPIRequest", "response": "DeleteAPIResponse" }
    ]
  },
  {
    "slug": "permissions",
    "proto": "permission.proto",
    "label": "Permissions",
    "description": "Permission definitions scoped to API resources.",
    "rpcCount": 6,
    "rpcs": [
      { "name": "ListPermissions", "request": "ListPermissionsRequest", "response": "ListPermissionsResponse" },
      { "name": "GetPermission", "request": "GetPermissionRequest", "response": "GetPermissionResponse" },
      { "name": "CreatePermission", "request": "CreatePermissionRequest", "response": "CreatePermissionResponse" },
      { "name": "UpdatePermission", "request": "UpdatePermissionRequest", "response": "UpdatePermissionResponse" },
      { "name": "SetPermissionStatus", "request": "SetPermissionStatusRequest", "response": "SetPermissionStatusResponse" },
      { "name": "DeletePermission", "request": "DeletePermissionRequest", "response": "DeletePermissionResponse" }
    ]
  },
  {
    "slug": "roles",
    "proto": "role.proto",
    "label": "Roles",
    "description": "Role CRUD and role-permission assignment.",
    "rpcCount": 9,
    "rpcs": [
      { "name": "ListRoles", "request": "ListRolesRequest", "response": "ListRolesResponse" },
      { "name": "GetRole", "request": "GetRoleRequest", "response": "GetRoleResponse" },
      { "name": "CreateRole", "request": "CreateRoleRequest", "response": "CreateRoleResponse" },
      { "name": "UpdateRole", "request": "UpdateRoleRequest", "response": "UpdateRoleResponse" },
      { "name": "SetRoleStatus", "request": "SetRoleStatusRequest", "response": "SetRoleStatusResponse" },
      { "name": "DeleteRole", "request": "DeleteRoleRequest", "response": "DeleteRoleResponse" },
      { "name": "ListRolePermissions", "request": "ListRolePermissionsRequest", "response": "ListRolePermissionsResponse" },
      { "name": "AddRolePermissions", "request": "AddRolePermissionsRequest", "response": "AddRolePermissionsResponse" },
      { "name": "RemoveRolePermission", "request": "RemoveRolePermissionRequest", "response": "RemoveRolePermissionResponse" }
    ]
  },
  {
    "slug": "policies",
    "proto": "policy.proto",
    "label": "Policies",
    "description": "Policy documents and the services they are bound to.",
    "rpcCount": 7,
    "rpcs": [
      { "name": "ListPolicies", "request": "ListPoliciesRequest", "response": "ListPoliciesResponse" },
      { "name": "GetPolicy", "request": "GetPolicyRequest", "response": "GetPolicyResponse" },
      { "name": "ListPolicyServices", "request": "ListPolicyServicesRequest", "response": "ListPolicyServicesResponse" },
      { "name": "CreatePolicy", "request": "CreatePolicyRequest", "response": "CreatePolicyResponse" },
      { "name": "UpdatePolicy", "request": "UpdatePolicyRequest", "response": "UpdatePolicyResponse" },
      { "name": "SetPolicyStatus", "request": "SetPolicyStatusRequest", "response": "SetPolicyStatusResponse" },
      { "name": "DeletePolicy", "request": "DeletePolicyRequest", "response": "DeletePolicyResponse" }
    ]
  },
  {
    "slug": "workload-identity-federation",
    "proto": "workload_identity.proto",
    "label": "Workload Identity Federation",
    "description": "Trusted external OIDC issuers for workload token exchange.",
    "rpcCount": 5,
    "rpcs": [
      { "name": "ListWorkloadIdentityFederations", "request": "ListWorkloadIdentityFederationsRequest", "response": "ListWorkloadIdentityFederationsResponse" },
      { "name": "GetWorkloadIdentityFederation", "request": "GetWorkloadIdentityFederationRequest", "response": "GetWorkloadIdentityFederationResponse" },
      { "name": "CreateWorkloadIdentityFederation", "request": "CreateWorkloadIdentityFederationRequest", "response": "CreateWorkloadIdentityFederationResponse" },
      { "name": "UpdateWorkloadIdentityFederation", "request": "UpdateWorkloadIdentityFederationRequest", "response": "UpdateWorkloadIdentityFederationResponse" },
      { "name": "DeleteWorkloadIdentityFederation", "request": "DeleteWorkloadIdentityFederationRequest", "response": "DeleteWorkloadIdentityFederationResponse" }
    ]
  },
  {
    "slug": "authorization",
    "proto": "authorization.proto",
    "label": "Authorization",
    "description": "Service-to-service authorization decisions.",
    "rpcCount": 1,
    "rpcs": [
      { "name": "Authorize", "request": "AuthorizeRequest", "response": "AuthorizeResponse" }
    ]
  },
  {
    "slug": "oauth-introspection",
    "proto": "oauth.proto",
    "label": "OAuth Introspection",
    "description": "Token introspection for resource services.",
    "rpcCount": 1,
    "rpcs": [
      { "name": "Introspect", "request": "IntrospectRequest", "response": "IntrospectResponse" }
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
      { "name": "Check", "request": "HealthCheckRequest", "response": "HealthCheckResponse" },
      { "name": "Watch", "request": "HealthCheckRequest", "response": "stream HealthCheckResponse" }
    ]
  }
];

export const grpcRpcCount = grpcGroupNav.reduce((total, group) => total + group.rpcCount, 0);

export const defaultGrpcGroupSlug = grpcGroupNav[0]?.slug || null;

export const findGrpcGroupNav = (slug) => grpcGroupNav.find((group) => group.slug === slug) || grpcGroupNav[0] || null;
