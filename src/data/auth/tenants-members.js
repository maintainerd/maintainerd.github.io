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
  "description": "Management endpoints require an authenticated operator token. The token must carry the permission required by the endpoint."
};

const emptyBody = {
  "type": "None",
  "description": "This endpoint does not accept a request body.",
  "fields": [],
  "example": null
};

const tenantUuidParameter = {
  "name": "tenant_uuid",
  "in": "path",
  "type": "uuid",
  "required": true,
  "description": "Public tenant UUID from a tenant response. This is not the internal database ID."
};

const tenantMemberUuidParameter = {
  "name": "tenant_member_uuid",
  "in": "path",
  "type": "uuid",
  "required": true,
  "description": "Public tenant-member UUID from the members list. This is not the internal database ID."
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

const tenantListParameters = [
  {
    "name": "name",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Filter tenants by tenant slug/name."
  },
  {
    "name": "display_name",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Filter tenants by display name."
  },
  {
    "name": "description",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Filter tenants by description text."
  },
  {
    "name": "status",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Comma-separated statuses to include. Allowed values are active, inactive, pending, and suspended."
  },
  {
    "name": "is_system",
    "in": "query",
    "type": "boolean",
    "required": false,
    "description": "Filter system tenants. Use true for the system tenant and false for regular tenants."
  },
  ...paginationParameters
];

const memberListParameters = [
  tenantUuidParameter,
  {
    "name": "role",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Filter members by role. Allowed values are owner, admin, and member."
  },
  ...paginationParameters
];

const tenantFields = [
  {
    "name": "name",
    "type": "string",
    "required": true,
    "description": "Tenant slug used in tenant-aware routing and URLs. Use 3-63 lowercase letters, numbers, or hyphens. It must start and end with a letter or number and must not use a reserved slug such as system, api, auth, admin, root, console, www, rabbitmq, prometheus, grafana, or signoz."
  },
  {
    "name": "display_name",
    "type": "string",
    "required": false,
    "description": "Human-readable tenant name shown in consoles, identity pages, and operator-facing lists."
  },
  {
    "name": "description",
    "type": "string",
    "required": true,
    "description": "Tenant description. Use 8-200 characters."
  },
  {
    "name": "status",
    "type": "string",
    "required": true,
    "description": "Tenant lifecycle state. Allowed values are active, inactive, pending, and suspended."
  }
];

const tenantExample = {
  "tenant_id": "018f5e1c-8a44-7c21-b22e-69a7f7f4d421",
  "name": "acme",
  "display_name": "Acme",
  "description": "Acme production workspace",
  "status": "active",
  "is_system": false,
  "metadata": {},
  "created_at": "2026-08-15T02:24:18Z",
  "updated_at": "2026-08-15T02:24:18Z"
};

const systemTenantExample = {
  "tenant_id": "018f4f52-7c5a-79e0-bc62-5e4c2c09c650",
  "name": "system",
  "display_name": "Maintainerd",
  "description": "System tenant",
  "status": "active",
  "is_system": true,
  "metadata": {},
  "created_at": "2026-08-15T02:12:00Z",
  "updated_at": "2026-08-15T02:12:00Z"
};

const tenantListResponse = {
  "success": true,
  "data": {
    "rows": [systemTenantExample, tenantExample],
    "total": 2,
    "page": 1,
    "limit": 20,
    "total_pages": 1
  },
  "message": "Tenants fetched successfully"
};

const tenantResponse = {
  "success": true,
  "data": tenantExample,
  "message": "Tenant fetched successfully"
};

const tenantValidationError = {
  "success": false,
  "error": "Validation failed",
  "details": {
    "name": "Tenant name must be a DNS-safe lowercase slug",
    "description": "Tenant description must be between 8 and 200 characters",
    "status": "Status must be active, inactive, pending, or suspended"
  }
};

const tenantMemberExample = {
  "tenant_member_id": "0198b9a1-6f2d-753f-bc4c-2b282b64a2a1",
  "role": "admin",
  "user": {
    "user_id": "0198b91f-b129-7ad1-a5b2-37d18ad0e2ec",
    "username": "jane.admin",
    "fullname": "Jane Admin",
    "email": "jane.admin@example.com",
    "phone": "+15551234567",
    "is_email_verified": true,
    "is_phone_verified": false,
    "status": "active",
    "metadata": {},
    "created_at": "2026-08-15T02:18:10Z",
    "updated_at": "2026-08-15T02:18:10Z"
  },
  "created_at": "2026-08-15T02:25:00Z",
  "updated_at": "2026-08-15T02:25:00Z"
};

const ownerMemberExample = {
  ...tenantMemberExample,
  "tenant_member_id": "0198b9a2-8182-7e46-8ba4-9d7cd63972f1",
  "role": "owner",
  "user": {
    ...tenantMemberExample.user,
    "user_id": "0198b920-5179-7887-9482-18991953a958",
    "username": "alex.owner",
    "fullname": "Alex Owner",
    "email": "alex.owner@example.com"
  }
};

const memberListResponse = {
  "success": true,
  "data": {
    "rows": [ownerMemberExample, tenantMemberExample],
    "total": 2,
    "page": 1,
    "limit": 20,
    "total_pages": 1
  },
  "message": "Members retrieved successfully"
};

const unauthorizedResponse = {
  "success": false,
  "error": "Unauthorized"
};

const accessDeniedResponse = {
  "success": false,
  "error": "Access denied",
  "details": "You do not have access to manage this tenant"
};

const invalidTenantUuidResponse = {
  "success": false,
  "error": "Invalid tenant UUID"
};

const invalidUuidFormatResponse = {
  "success": false,
  "error": "Invalid UUID format"
};

const tenantNotFoundResponse = {
  "success": false,
  "error": "Tenant not found"
};

const serviceFailureResponse = (message) => ({
  "success": false,
  "error": message
});

const readHeaders = [jsonAcceptHeader, bearerAuthHeader];
const writeHeaders = [jsonContentHeader, jsonAcceptHeader, bearerAuthHeader];

const group = {
  "slug": "tenants-members",
  "label": "Tenants and Members",
  "description": "Tenant administration APIs for tenant lifecycle, tenant status, tenant membership, and ownership changes.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/tenants/",
      "summary": "List tenants available to the authenticated operator.",
      "surface": management,
      "details": {
        "overview": "Returns a paginated tenant list for the authenticated operator. System-tenant members can list all tenants. Regular tenant members are scoped to their current tenant even when they hold tenant:read.",
        "notes": [
          "Requires the tenant:read permission.",
          "Use this endpoint for tenant administration pages, tenant pickers, and operator dashboards.",
          "The response returns tenant_id as the public tenant UUID. It does not expose internal database integer IDs.",
          "Pagination defaults to page=1 and limit=20. The maximum accepted limit is 100."
        ],
        "parameters": tenantListParameters,
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The tenant list was returned successfully.",
            "example": tenantListResponse
          },
          {
            "status": "400 Bad Request",
            "description": "A query parameter failed validation, such as an unsupported status or sort order.",
            "example": {
              "success": false,
              "error": "Validation failed",
              "details": {
                "status": "Invalid status value",
                "sort_order": "Order must be either 'asc' or 'desc'"
              }
            }
          },
          {
            "status": "401 Unauthorized",
            "description": "The caller did not provide a valid authenticated management session or bearer token.",
            "example": unauthorizedResponse
          },
          {
            "status": "403 Forbidden",
            "description": "The caller is authenticated but does not have tenant:read.",
            "example": {
              "success": false,
              "error": "Forbidden"
            }
          },
          {
            "status": "500 Internal Server Error",
            "description": "The service could not load tenants from storage.",
            "example": serviceFailureResponse("Failed to fetch tenants")
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/tenants/{tenant_uuid}",
      "summary": "Read one tenant by UUID.",
      "surface": management,
      "details": {
        "overview": "Returns one tenant by public UUID. Regular tenant members can read only their own tenant. System-tenant members can read any tenant.",
        "notes": [
          "Requires the tenant:read permission.",
          "Use this endpoint when a console page needs the current tenant record before rendering settings, members, identity providers, clients, or policy controls.",
          "The tenant_uuid path value and tenant_id response value are UUIDs, not internal IDs."
        ],
        "parameters": [tenantUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The tenant was found and returned.",
            "example": tenantResponse
          },
          {
            "status": "400 Bad Request",
            "description": "The tenant_uuid path parameter is not a valid UUID.",
            "example": invalidTenantUuidResponse
          },
          {
            "status": "401 Unauthorized",
            "description": "The caller did not provide a valid authenticated management session or bearer token.",
            "example": unauthorizedResponse
          },
          {
            "status": "403 Forbidden",
            "description": "The caller has tenant:read but attempted to read a tenant outside their allowed scope.",
            "example": {
              "success": false,
              "error": "Access denied",
              "details": "You can only view your own tenant"
            }
          },
          {
            "status": "404 Not Found",
            "description": "No tenant exists for the supplied UUID.",
            "example": tenantNotFoundResponse
          },
          {
            "status": "500 Internal Server Error",
            "description": "The service could not load the tenant.",
            "example": serviceFailureResponse("Failed to fetch tenant")
          }
        ]
      }
    },
    {
      "method": "POST",
      "path": "/tenants/",
      "summary": "Create a tenant.",
      "surface": management,
      "details": {
        "overview": "Creates a regular tenant. Tenant creation is reserved for system-tenant operators so normal tenants cannot create sibling tenants.",
        "notes": [
          "Requires the tenant:create permission and membership in the system tenant.",
          "Use a DNS-safe name because the tenant slug becomes part of tenant-aware URLs.",
          "New tenants can be created as pending, active, inactive, or suspended. A pending tenant becomes active when an owner is assigned.",
          "Reserved names such as system, api, auth, admin, root, console, and www cannot be used."
        ],
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Tenant creation payload.",
          "fields": tenantFields,
          "example": {
            "name": "acme",
            "display_name": "Acme",
            "description": "Acme production workspace",
            "status": "pending"
          }
        },
        "responses": [
          {
            "status": "201 Created",
            "description": "The tenant was created.",
            "example": {
              "success": true,
              "data": {
                ...tenantExample,
                "status": "pending"
              },
              "message": "Tenant created successfully"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "The JSON body is invalid, required fields are missing, or tenant validation failed.",
            "example": tenantValidationError
          },
          {
            "status": "401 Unauthorized",
            "description": "The caller did not provide a valid authenticated management session or bearer token.",
            "example": unauthorizedResponse
          },
          {
            "status": "403 Forbidden",
            "description": "The caller is not a member of the system tenant or does not have tenant:create.",
            "example": {
              "success": false,
              "error": "Access denied",
              "details": "Only members of the system tenant can create tenants"
            }
          },
          {
            "status": "409 Conflict",
            "description": "A tenant with the same slug already exists.",
            "example": {
              "success": false,
              "error": "tenant already exists"
            }
          },
          {
            "status": "500 Internal Server Error",
            "description": "The service could not create the tenant.",
            "example": serviceFailureResponse("Failed to create tenant")
          }
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/tenants/{tenant_uuid}",
      "summary": "Update tenant metadata such as name, description, display name, and status.",
      "surface": management,
      "details": {
        "overview": "Replaces tenant editable fields with the supplied values. This route is privileged because it can change the tenant slug used by URLs and can also change status.",
        "notes": [
          "Requires tenant:update and a step-up authenticated session.",
          "The authenticated user must be a member of the target tenant or a member of the system tenant.",
          "Send the complete tenant payload, not only the changed field, because the request DTO validates name, description, and status.",
          "Use the dedicated status endpoint when only status should change."
        ],
        "parameters": [tenantUuidParameter],
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Complete tenant update payload.",
          "fields": tenantFields,
          "example": {
            "name": "acme",
            "display_name": "Acme",
            "description": "Acme production workspace",
            "status": "active"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The tenant was updated.",
            "example": {
              "success": true,
              "data": tenantExample,
              "message": "Tenant updated successfully"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "The tenant UUID is invalid, the body is invalid JSON, or tenant validation failed.",
            "example": tenantValidationError
          },
          {
            "status": "401 Unauthorized",
            "description": "The caller did not provide a valid authenticated management session or bearer token.",
            "example": unauthorizedResponse
          },
          {
            "status": "403 Forbidden",
            "description": "The caller is missing tenant:update, has not completed step-up, or cannot manage the target tenant.",
            "example": {
              "success": false,
              "error": "Access denied",
              "details": "You do not have access to update this tenant"
            }
          },
          {
            "status": "404 Not Found",
            "description": "No tenant exists for the supplied UUID.",
            "example": tenantNotFoundResponse
          },
          {
            "status": "500 Internal Server Error",
            "description": "The service could not update the tenant.",
            "example": serviceFailureResponse("Failed to update tenant")
          }
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/tenants/{tenant_uuid}/status",
      "summary": "Change the active, inactive, pending, or suspended status for a tenant.",
      "surface": management,
      "details": {
        "overview": "Changes only the tenant lifecycle status. Use it when an operator needs to activate, pause, suspend, or return a tenant to pending without editing the slug or display metadata.",
        "notes": [
          "Requires tenant:update and a step-up authenticated session.",
          "The authenticated user must be a member of the target tenant or a member of the system tenant.",
          "Allowed statuses are active, inactive, pending, and suspended.",
          "Suspending or deactivating a tenant should be treated as an administrative action because it can affect sign-in and tenant access."
        ],
        "parameters": [tenantUuidParameter],
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Tenant status update payload.",
          "fields": [
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "New tenant lifecycle state. Allowed values are active, inactive, pending, and suspended."
            }
          ],
          "example": {
            "status": "suspended"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The tenant status was updated.",
            "example": {
              "success": true,
              "data": {
                ...tenantExample,
                "status": "suspended"
              },
              "message": "Tenant status updated successfully"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "The tenant UUID is invalid, the body is invalid JSON, or status validation failed.",
            "example": {
              "success": false,
              "error": "Validation failed",
              "details": {
                "status": "Status must be active, inactive, pending, or suspended"
              }
            }
          },
          {
            "status": "401 Unauthorized",
            "description": "The caller did not provide a valid authenticated management session or bearer token.",
            "example": unauthorizedResponse
          },
          {
            "status": "403 Forbidden",
            "description": "The caller is missing tenant:update, has not completed step-up, or cannot manage the target tenant.",
            "example": {
              "success": false,
              "error": "Access denied",
              "details": "You do not have access to update this tenant"
            }
          },
          {
            "status": "404 Not Found",
            "description": "No tenant exists for the supplied UUID.",
            "example": tenantNotFoundResponse
          },
          {
            "status": "500 Internal Server Error",
            "description": "The service could not update tenant status.",
            "example": serviceFailureResponse("Failed to update tenant status")
          }
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/tenants/{tenant_uuid}",
      "summary": "Delete a tenant.",
      "surface": management,
      "details": {
        "overview": "Deletes a regular tenant by public UUID and returns the deleted tenant record. Deletion is reserved for system-tenant operators and cannot be used against the system tenant.",
        "notes": [
          "Requires tenant:delete, membership in the system tenant, and a step-up authenticated session.",
          "The system tenant cannot be deleted.",
          "Use tenant deletion carefully because dependent tenant-scoped records and access decisions may be affected."
        ],
        "parameters": [tenantUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The tenant was deleted and the deleted record was returned.",
            "example": {
              "success": true,
              "data": tenantExample,
              "message": "Tenant deleted successfully"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "The tenant_uuid path parameter is not a valid UUID.",
            "example": invalidTenantUuidResponse
          },
          {
            "status": "401 Unauthorized",
            "description": "The caller did not provide a valid authenticated management session or bearer token.",
            "example": unauthorizedResponse
          },
          {
            "status": "403 Forbidden",
            "description": "The caller is not a system-tenant member, is missing tenant:delete, has not completed step-up, or tried to delete the system tenant.",
            "example": {
              "success": false,
              "error": "Cannot delete system tenant",
              "details": "System tenants cannot be deleted"
            }
          },
          {
            "status": "404 Not Found",
            "description": "No tenant exists for the supplied UUID.",
            "example": tenantNotFoundResponse
          },
          {
            "status": "500 Internal Server Error",
            "description": "The service could not delete the tenant.",
            "example": serviceFailureResponse("Failed to delete tenant")
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/tenants/{tenant_uuid}/members",
      "summary": "List tenant members.",
      "surface": management,
      "details": {
        "overview": "Returns a paginated list of users who are members of a tenant. Each row includes the tenant-member UUID, role, timestamps, and the tenant view of the user profile.",
        "notes": [
          "Requires tenant:read.",
          "The authenticated user must be a member of the target tenant or a member of the system tenant.",
          "Use tenant_member_id for member role updates and member removal. It is a public UUID, not an internal database ID.",
          "Member user_id is the public user UUID."
        ],
        "parameters": memberListParameters,
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "Tenant members were returned successfully.",
            "example": memberListResponse
          },
          {
            "status": "400 Bad Request",
            "description": "The tenant UUID is invalid or a query parameter failed validation.",
            "example": {
              "success": false,
              "error": "Validation failed",
              "details": {
                "role": "Role must be 'owner', 'admin', or 'member'"
              }
            }
          },
          {
            "status": "401 Unauthorized",
            "description": "The caller did not provide a valid authenticated management session or bearer token.",
            "example": unauthorizedResponse
          },
          {
            "status": "403 Forbidden",
            "description": "The caller has tenant:read but cannot manage or view members for the target tenant.",
            "example": accessDeniedResponse
          },
          {
            "status": "404 Not Found",
            "description": "No tenant exists for the supplied UUID.",
            "example": tenantNotFoundResponse
          },
          {
            "status": "500 Internal Server Error",
            "description": "The service could not load tenant members.",
            "example": serviceFailureResponse("Failed to fetch members")
          }
        ]
      }
    },
    {
      "method": "POST",
      "path": "/tenants/{tenant_uuid}/members",
      "summary": "Add a member to a tenant.",
      "surface": management,
      "details": {
        "overview": "Adds an existing system-tenant user to the target tenant with the requested role. If user provisioning is enabled, the service ensures the user has a tenant-local user record before creating the membership.",
        "notes": [
          "Requires tenant:update and a step-up authenticated session.",
          "The authenticated user must be a member of the target tenant or a member of the system tenant.",
          "The user_id request field must be the public user UUID of a user that exists in the system tenant shared user pool.",
          "Only system-tenant administrators can assign owner during member creation.",
          "Adding an owner can activate a pending tenant and grants the tenant super-admin role to the owner."
        ],
        "parameters": [tenantUuidParameter],
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Tenant member creation payload.",
          "fields": [
            {
              "name": "user_id",
              "type": "uuid",
              "required": true,
              "description": "Public UUID of the user to add. The source user must exist in the system tenant before being added to a regular tenant."
            },
            {
              "name": "role",
              "type": "string",
              "required": true,
              "description": "Role to grant in the tenant. Allowed values are owner, admin, and member."
            }
          ],
          "example": {
            "user_id": "0198b91f-b129-7ad1-a5b2-37d18ad0e2ec",
            "role": "admin"
          }
        },
        "responses": [
          {
            "status": "201 Created",
            "description": "The member was added to the tenant.",
            "example": {
              "success": true,
              "data": tenantMemberExample,
              "message": "Member added successfully"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "The tenant UUID is invalid, the body is invalid JSON, or member validation failed.",
            "example": {
              "success": false,
              "error": "Validation failed",
              "details": {
                "user_id": "User ID is required",
                "role": "Role must be 'owner', 'admin', or 'member'"
              }
            }
          },
          {
            "status": "401 Unauthorized",
            "description": "The caller did not provide a valid authenticated management session or bearer token.",
            "example": unauthorizedResponse
          },
          {
            "status": "403 Forbidden",
            "description": "The caller is missing tenant:update, has not completed step-up, cannot manage the target tenant, attempted to add a non-system source user, or attempted to assign owner without system-tenant authority.",
            "example": {
              "success": false,
              "error": "user must exist in the system tenant before being added to a tenant"
            }
          },
          {
            "status": "404 Not Found",
            "description": "The target tenant or source user was not found.",
            "example": {
              "success": false,
              "error": "user not found"
            }
          },
          {
            "status": "409 Conflict",
            "description": "The user is already a member of the tenant, or the tenant already has an owner and ownership must be transferred instead.",
            "example": {
              "success": false,
              "error": "user is already a member of this tenant"
            }
          },
          {
            "status": "500 Internal Server Error",
            "description": "The service could not add the member.",
            "example": serviceFailureResponse("Failed to add member")
          }
        ]
      }
    },
    {
      "method": "PATCH",
      "path": "/tenants/{tenant_uuid}/members/{tenant_member_uuid}/role",
      "summary": "Change a tenant member role or transfer ownership.",
      "surface": management,
      "details": {
        "overview": "Updates a tenant member's role. Promoting a member to owner performs an ownership transfer: the previous owner becomes a member and the new owner receives the tenant super-admin role.",
        "notes": [
          "Requires tenant:update and a step-up authenticated session.",
          "The authenticated user must be a member of the target tenant or a member of the system tenant.",
          "Allowed roles are owner, admin, and member.",
          "A current owner cannot be demoted directly. Transfer ownership by promoting another member to owner.",
          "Only the current tenant owner or a system-tenant administrator can transfer ownership.",
          "Ownership transfer is blocked for the system tenant."
        ],
        "parameters": [tenantUuidParameter, tenantMemberUuidParameter],
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Member role update payload.",
          "fields": [
            {
              "name": "role",
              "type": "string",
              "required": true,
              "description": "New tenant member role. Allowed values are owner, admin, and member."
            }
          ],
          "example": {
            "role": "owner"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The member role was updated.",
            "example": {
              "success": true,
              "data": ownerMemberExample,
              "message": "Member role updated successfully"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "A path UUID is invalid, the body is invalid JSON, the role failed validation, or an ownership rule was violated.",
            "example": {
              "success": false,
              "error": "cannot demote a tenant owner directly - transfer ownership instead"
            }
          },
          {
            "status": "401 Unauthorized",
            "description": "The caller did not provide a valid authenticated management session or bearer token.",
            "example": unauthorizedResponse
          },
          {
            "status": "403 Forbidden",
            "description": "The caller is missing tenant:update, has not completed step-up, cannot manage the target tenant, or is not allowed to transfer ownership.",
            "example": {
              "success": false,
              "error": "only the tenant owner or a system tenant administrator can transfer tenant ownership"
            }
          },
          {
            "status": "404 Not Found",
            "description": "The target tenant or tenant member was not found, or the member does not belong to the target tenant.",
            "example": {
              "success": false,
              "error": "tenant member not found"
            }
          },
          {
            "status": "500 Internal Server Error",
            "description": "The service could not update the member role.",
            "example": serviceFailureResponse("Failed to update member role")
          }
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/tenants/{tenant_uuid}/members/{tenant_member_uuid}",
      "summary": "Remove a member from a tenant.",
      "surface": management,
      "details": {
        "overview": "Removes a tenant member by public tenant-member UUID. Removing a member strips that user's tenant membership and tenant access.",
        "notes": [
          "Requires tenant:update and a step-up authenticated session.",
          "The authenticated user must be a member of the target tenant or a member of the system tenant.",
          "A tenant owner cannot be removed directly. Transfer ownership first, then remove the former owner if needed.",
          "The response data is null on success."
        ],
        "parameters": [tenantUuidParameter, tenantMemberUuidParameter],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The member was removed from the tenant.",
            "example": {
              "success": true,
              "data": null,
              "message": "Member removed successfully"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "A path UUID is invalid, or the caller attempted to remove a tenant owner directly.",
            "example": {
              "success": false,
              "error": "cannot remove a tenant owner directly - transfer ownership first"
            }
          },
          {
            "status": "401 Unauthorized",
            "description": "The caller did not provide a valid authenticated management session or bearer token.",
            "example": unauthorizedResponse
          },
          {
            "status": "403 Forbidden",
            "description": "The caller is missing tenant:update, has not completed step-up, or cannot manage the target tenant.",
            "example": accessDeniedResponse
          },
          {
            "status": "404 Not Found",
            "description": "The target tenant or tenant member was not found, or the member does not belong to the target tenant.",
            "example": {
              "success": false,
              "error": "tenant member not found"
            }
          },
          {
            "status": "500 Internal Server Error",
            "description": "The service could not remove the member.",
            "example": serviceFailureResponse("Failed to remove member")
          }
        ]
      }
    }
  ]
};

export default group;
