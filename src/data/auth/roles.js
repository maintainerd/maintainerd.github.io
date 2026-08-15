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
  "description": "Required. The endpoint is mounted behind JWT authentication and user-context resolution. Tenant context is derived from the authenticated caller."
};

const jwtReadHeaders = [jsonAcceptHeader, bearerAuthHeader];
const jwtJsonHeaders = [jsonContentHeader, jsonAcceptHeader, bearerAuthHeader];

const emptyBody = {
  "type": "None",
  "description": "This endpoint does not accept a request body.",
  "fields": [],
  "example": null
};

const validationErrorResponse = {
  "status": "400 Bad Request",
  "description": "The JSON body or query string failed validation.",
  "example": {
    "success": false,
    "error": "Validation failed",
    "details": {
      "name": "Name is required"
    }
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

const tenantMissingResponse = {
  "status": "401 Unauthorized",
  "description": "The authenticated context does not resolve a tenant.",
  "example": {
    "success": false,
    "error": "Tenant not found in context"
  }
};

const userMissingResponse = {
  "status": "401 Unauthorized",
  "description": "The authenticated context does not resolve a user actor.",
  "example": {
    "success": false,
    "error": "User not found in context"
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
  "description": "The operation requires step-up authentication and the caller's session has not completed it recently.",
  "example": {
    "success": false,
    "error": "Step-up authentication required",
    "code": "step_up_required"
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

const paginatedRows = (rowExample) => ({
  "success": true,
  "data": {
    "rows": [rowExample],
    "total": 1,
    "page": 1,
    "limit": 20,
    "total_pages": 1
  }
});

const roleRowExample = {
  "role_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "name": "billing-admin",
  "description": "Manages billing operations",
  "is_default": false,
  "is_system": false,
  "status": "active",
  "created_at": "2026-08-01T09:00:00Z",
  "updated_at": "2026-08-10T09:00:00Z"
};

const permissionRowExample = {
  "permission_id": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
  "name": "invoices:read",
  "description": "Read invoices",
  "api": {
    "api_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
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
  "updated_at": "2026-08-01T09:00:00Z"
};

const standardPaginationParams = [
  {
    "name": "page",
    "in": "query",
    "type": "integer",
    "required": false,
    "description": "Page number, starting at 1. Defaults to 1."
  },
  {
    "name": "limit",
    "in": "query",
    "type": "integer",
    "required": false,
    "description": "Page size. Defaults to 20, maximum 100."
  },
  {
    "name": "sort_by",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Field to sort by. Only allowlisted fields are honored; unknown values fall back to created_at descending."
  },
  {
    "name": "sort_order",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Sort direction: asc or desc."
  }
];

const statusActiveInactive = "One of active or inactive.";

const group = {
  "slug": "roles",
  "label": "Roles",
  "description": "Role CRUD, status lifecycle, and role-permission assignment APIs used to define what users receive when a role is assigned.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/roles/",
      "summary": "List roles.",
      "surface": management,
      "details": {
        "overview": "Lists the tenant's roles with pagination, filtering, and sorting. List rows never include the permissions array.",
        "notes": [
          "Requires the role:read permission.",
          "search overrides name and description filters when present.",
          "status accepts a comma-separated list."
        ],
        "parameters": [
          {
            "name": "search",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "OR-search across name and description (case-insensitive)."
          },
          {
            "name": "name",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Case-insensitive partial match on name (ignored when search is present)."
          },
          {
            "name": "description",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Case-insensitive partial match on description (ignored when search is present)."
          },
          {
            "name": "is_default",
            "in": "query",
            "type": "boolean",
            "required": false,
            "description": "Filter by default-role flag."
          },
          {
            "name": "is_system",
            "in": "query",
            "type": "boolean",
            "required": false,
            "description": "Filter by system flag."
          },
          {
            "name": "status",
            "in": "query",
            "type": "string (comma-separated)",
            "required": false,
            "description": "Filter by status: active, inactive."
          },
          ...standardPaginationParams
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The paginated role list.",
            "example": {
              "success": true,
              "data": paginatedRows(roleRowExample).data,
              "message": "Roles fetched successfully"
            }
          },
          tenantMissingResponse,
          forbiddenResponse,
          validationErrorResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/roles/{role_uuid}",
      "summary": "Read one role.",
      "surface": management,
      "details": {
        "overview": "Returns one role by UUID. The permissions array is not preloaded on the single-role read; use the role-permissions endpoint.",
        "notes": [
          "Requires the role:read permission.",
          "Roles in another tenant respond as not found."
        ],
        "parameters": [
          {
            "name": "role_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the role."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The role.",
            "example": {
              "success": true,
              "data": roleRowExample,
              "message": "Role fetched successfully"
            }
          },
          tenantMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The role_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid role UUID"
            }
          },
          forbiddenResponse,
          {
            "status": "404 Not Found",
            "description": "No role matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "role not found or access denied"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/roles/",
      "summary": "Create a role.",
      "surface": management,
      "details": {
        "overview": "Creates a role for the tenant. A newly created role grants nothing until permissions are attached; the attach edge is step-up gated.",
        "notes": [
          "Requires the role:create permission (no step-up).",
          "Name rules: 3-20 characters, lowercase letters, digits, hyphens, and colons.",
          "is_default and is_system are always false for API-created roles; those flags are reserved for seeding.",
          "Name is unique per tenant.",
          "Emits role.created and a management audit record."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Role creation payload.",
          "fields": [
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
              "description": statusActiveInactive
            }
          ],
          "example": {
            "name": "billing-admin",
            "description": "Manages billing operations",
            "status": "active"
          }
        },
        "responses": [
          {
            "status": "201 Created",
            "description": "The role was created.",
            "example": {
              "success": true,
              "data": roleRowExample,
              "message": "Role created successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "409 Conflict",
            "description": "A role with the same name already exists in the tenant.",
            "example": {
              "success": false,
              "error": "billing-admin role already exist"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/roles/{role_uuid}",
      "summary": "Update a role.",
      "surface": management,
      "details": {
        "overview": "Updates a role's name, description, and status. The default and system flags are protected and cannot be changed through this endpoint.",
        "notes": [
          "Requires the role:update permission and step-up authentication.",
          "System roles cannot be updated.",
          "After commit, affected authorization caches and sessions are invalidated.",
          "Emits role.updated only when a field actually changed."
        ],
        "parameters": [
          {
            "name": "role_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the role."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Role update payload.",
          "fields": [
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
              "description": statusActiveInactive
            }
          ],
          "example": {
            "name": "billing-admin",
            "description": "Manages all billing operations",
            "status": "active"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The role was updated.",
            "example": {
              "success": true,
              "data": roleRowExample,
              "message": "Role updated successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The role_uuid path value is not a valid UUID, or the target is a system role.",
            "example": {
              "success": false,
              "error": "system role is not allowed to be updated"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "404 Not Found",
            "description": "No role matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "role not found or access denied"
            }
          },
          {
            "status": "409 Conflict",
            "description": "The new name collides with another role in the tenant.",
            "example": {
              "success": false,
              "error": "billing-admin role already exists"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/roles/{role_uuid}/status",
      "summary": "Change role status.",
      "surface": management,
      "details": {
        "overview": "Updates only a role's status. Deactivating a role removes what it grants everywhere it is assigned.",
        "notes": [
          "Requires the role:update permission and step-up authentication.",
          "System roles cannot be updated, and the tenant default role cannot be deactivated.",
          "No integration event is emitted for status-only changes; authorization invalidation still runs."
        ],
        "parameters": [
          {
            "name": "role_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the role."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Role status payload.",
          "fields": [
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": statusActiveInactive
            }
          ],
          "example": {
            "status": "inactive"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The role status was updated.",
            "example": {
              "success": true,
              "data": roleRowExample,
              "message": "Role updated successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The role_uuid path value is not a valid UUID, the target is a system role, or the default role is being deactivated.",
            "example": {
              "success": false,
              "error": "default role cannot be deactivated"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "404 Not Found",
            "description": "No role matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "role not found or access denied"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/roles/{role_uuid}",
      "summary": "Delete a role.",
      "surface": management,
      "details": {
        "overview": "Soft-deletes a role. Assignments referencing the role stop granting.",
        "notes": [
          "Requires the role:delete permission and step-up authentication.",
          "System roles and the tenant default role cannot be deleted.",
          "Emits role.deleted."
        ],
        "parameters": [
          {
            "name": "role_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the role."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The role was deleted. The response carries the deleted record.",
            "example": {
              "success": true,
              "data": roleRowExample,
              "message": "Role deleted successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The role_uuid path value is not a valid UUID, the target is a system role, or it is the default role.",
            "example": {
              "success": false,
              "error": "default role cannot be deleted"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          {
            "status": "404 Not Found",
            "description": "No role matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "role not found or access denied"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/roles/{role_uuid}/permissions",
      "summary": "List permissions assigned to a role.",
      "surface": management,
      "details": {
        "overview": "Returns the permissions attached to a role with pagination. Each row carries the owning API projection.",
        "notes": [
          "Requires the role:read permission.",
          "status is a single exact filter with no enum validation."
        ],
        "parameters": [
          {
            "name": "role_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the role."
          },
          {
            "name": "status",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Exact status match."
          },
          ...standardPaginationParams
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The paginated permission list for the role.",
            "example": {
              "success": true,
              "data": paginatedRows(permissionRowExample).data,
              "message": "Role permissions fetched successfully"
            }
          },
          tenantMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The role_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid role UUID"
            }
          },
          forbiddenResponse,
          {
            "status": "404 Not Found",
            "description": "No role matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "role not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/roles/{role_uuid}/permissions",
      "summary": "Assign permissions to a role.",
      "surface": management,
      "details": {
        "overview": "Attaches permissions to a role. This is the privilege-escalation edge: the actor may not attach an elevated permission they do not themselves hold.",
        "notes": [
          "Requires the role:permission:create permission and step-up authentication.",
          "Between 1 and 200 permission UUIDs per request.",
          "System roles cannot be modified.",
          "Idempotent: already-existing associations are skipped.",
          "The escalation guard exempts public:* and account:*:self permissions.",
          "Emits role.permissions.changed."
        ],
        "parameters": [
          {
            "name": "role_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the role."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Role permission assignment payload.",
          "fields": [
            {
              "name": "permissions",
              "type": "array of UUID strings",
              "required": true,
              "description": "1-200 permission UUIDs to attach."
            }
          ],
          "example": {
            "permissions": ["e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d"]
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The permissions were added. The data is the role with its permissions array populated.",
            "example": {
              "success": true,
              "data": {
                ...roleRowExample,
                "permissions": [permissionRowExample]
              },
              "message": "Permissions added to role successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The role_uuid path value is not a valid UUID, or the target is a system role.",
            "example": {
              "success": false,
              "error": "system role is not allowed to be updated"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "403 Forbidden",
            "description": "The actor does not hold one of the elevated permissions being attached.",
            "example": {
              "success": false,
              "error": "you cannot grant \"service:delete\" because you do not hold it"
            }
          },
          {
            "status": "404 Not Found",
            "description": "The role or one of the permissions does not exist in the tenant.",
            "example": {
              "success": false,
              "error": "one or more permissions not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/roles/{role_uuid}/permissions/{permission_uuid}",
      "summary": "Remove a permission from a role.",
      "surface": management,
      "details": {
        "overview": "Detaches a single permission from a role. Idempotent: removing an association that does not exist still succeeds.",
        "notes": [
          "Requires the role:permission:delete permission and step-up authentication.",
          "System roles cannot be modified.",
          "Emits role.permissions.changed only when an association actually existed."
        ],
        "parameters": [
          {
            "name": "role_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the role."
          },
          {
            "name": "permission_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the permission to detach."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The permission was removed. The data is the role with its permissions array populated.",
            "example": {
              "success": true,
              "data": roleRowExample,
              "message": "Permission removed from role successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The role_uuid or permission_uuid path value is not a valid UUID, or the target is a system role.",
            "example": {
              "success": false,
              "error": "Invalid permission UUID"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          {
            "status": "404 Not Found",
            "description": "The role or permission does not exist in the caller's tenant.",
            "example": {
              "success": false,
              "error": "permission not found or access denied"
            }
          },
          internalErrorResponse
        ]
      }
    },

    // ──────────────────────────────────────────────────────────────────────────
  ]
};

export default group;
