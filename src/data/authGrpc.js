// gRPC service reference for Auth. Each group is one gRPC service with its
// RPC surface. Details are filled in per-RPC later; for now the reference
// lists the full method inventory.

export const grpcPackage = "maintainerd.auth.v1";

export const grpcGroupNav = [
  {
    "slug": "setup",
    "label": "Setup",
    "description": "One-time bootstrap RPCs for tenant creation, first administrator, control-service registration, and setup completion.",
    "rpcCount": 10,
    "rpcs": [
      { "name": "GetSetupStatus", "request": "GetSetupStatusRequest", "response": "GetSetupStatusResponse" },
      { "name": "CreateTenant", "request": "CreateTenantRequest", "response": "CreateTenantResponse" },
      { "name": "CreateAdmin", "request": "CreateAdminRequest", "response": "CreateAdminResponse" },
      { "name": "CreateProfile", "request": "CreateProfileRequest", "response": "CreateProfileResponse" },
      { "name": "RegisterControlService", "request": "RegisterControlServiceRequest", "response": "RegisterControlServiceResponse" },
      { "name": "EnsureControlClient", "request": "EnsureControlClientRequest", "response": "EnsureControlClientResponse" },
      { "name": "EnsureResourceAPI", "request": "EnsureResourceAPIRequest", "response": "EnsureResourceAPIResponse" },
      { "name": "EnsureRole", "request": "EnsureRoleRequest", "response": "EnsureRoleResponse" },
      { "name": "EnsureConsoleClient", "request": "EnsureConsoleClientRequest", "response": "EnsureConsoleClientResponse" },
      { "name": "CompleteSetup", "request": "CompleteSetupRequest", "response": "CompleteSetupResponse" }
    ]
  },
  {
    "slug": "tenants",
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
    "label": "Authorization",
    "description": "Service-to-service authorization decisions.",
    "rpcCount": 1,
    "rpcs": [
      { "name": "Authorize", "request": "AuthorizeRequest", "response": "AuthorizeResponse" }
    ]
  },
  {
    "slug": "oauth-introspection",
    "label": "OAuth Introspection",
    "description": "Token introspection for resource services.",
    "rpcCount": 1,
    "rpcs": [
      { "name": "Introspect", "request": "IntrospectRequest", "response": "IntrospectResponse" }
    ]
  },
  {
    "slug": "health",
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
