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
  "description": "Required. The endpoint is mounted behind JWT authentication. Management routes also resolve the caller's user and tenant context."
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

const apiRowExample = {
  "api_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "name": "billing",
  "display_name": "Billing API",
  "description": "Billing and invoicing endpoints",
  "identifier": "api-9d1d5b4d3a7e",
  "service": {
    "service_id": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
    "name": "billing-service",
    "display_name": "Billing Service",
    "description": "Handles billing operations",
    "version": "1.0.0",
    "status": "active",
    "is_system": false,
    "api_count": 0,
    "policy_count": 0,
    "created_at": "2026-08-01T09:00:00Z",
    "updated_at": "2026-08-01T09:00:00Z"
  },
  "status": "active",
  "is_system": false,
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

const policyDetailExample = {
  "policy_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "name": "billing-read",
  "description": "Allows read access to billing",
  "document": {
    "version": "v1",
    "statement": [
      {
        "effect": "allow",
        "action": ["invoices:read"],
        "resource": ["billing-api"]
      }
    ]
  },
  "version": "1",
  "status": "active",
  "is_system": false,
  "created_at": "2026-08-01T09:00:00Z",
  "updated_at": "2026-08-10T09:00:00Z"
};

const serviceRowExample = {
  "service_id": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
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
  "slug": "iam",
  "label": "APIs & Resources",
  "description": "Resource APIs, permissions, roles, policies, services, policy bindings, policy history, policy bundles, and service-to-service authorization decisions.",
  "endpoints": [
    // ──────────────────────────────────────────────────────────────────────────
    // APIs
    // ──────────────────────────────────────────────────────────────────────────
    {
      "method": "GET",
      "path": "/apis/",
      "summary": "List API resource definitions.",
      "surface": management,
      "details": {
        "overview": "Lists the tenant's API resource definitions with pagination, filtering, and sorting. Each API carries its server-generated audience identifier and the service it belongs to.",
        "notes": [
          "Requires the api:read permission.",
          "identifier is server-generated (api-<random>) and used as the audience that token issuance and permission scoping resolve against.",
          "service_id filters by UUID; an unknown or cross-tenant service responds as not found.",
          "status accepts a comma-separated list."
        ],
        "parameters": [
          {
            "name": "name",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Case-insensitive partial match on name."
          },
          {
            "name": "display_name",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Case-insensitive partial match on display name."
          },
          {
            "name": "identifier",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Exact match on the audience identifier."
          },
          {
            "name": "service_id",
            "in": "query",
            "type": "string (UUID)",
            "required": false,
            "description": "Filter by owning service UUID."
          },
          {
            "name": "status",
            "in": "query",
            "type": "string (comma-separated)",
            "required": false,
            "description": "Filter by status: active, inactive."
          },
          {
            "name": "is_system",
            "in": "query",
            "type": "boolean",
            "required": false,
            "description": "Filter by system flag."
          },
          ...standardPaginationParams
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The paginated API list.",
            "example": {
              "success": true,
              "data": paginatedRows(apiRowExample).data,
              "message": "APIs fetched successfully"
            }
          },
          tenantMissingResponse,
          forbiddenResponse,
          validationErrorResponse,
          {
            "status": "400 Bad Request",
            "description": "service_id is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid service UUID format"
            }
          },
          {
            "status": "404 Not Found",
            "description": "The service filter does not resolve to a service in the caller's tenant.",
            "example": {
              "success": false,
              "error": "service not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/apis/{api_uuid}",
      "summary": "Read one API resource definition.",
      "surface": management,
      "details": {
        "overview": "Returns one API resource definition by UUID, including its nested service projection.",
        "notes": [
          "Requires the api:read permission.",
          "APIs in another tenant respond as not found."
        ],
        "parameters": [
          {
            "name": "api_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the API resource definition."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The API resource definition.",
            "example": {
              "success": true,
              "data": apiRowExample,
              "message": "API fetched successfully"
            }
          },
          tenantMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The api_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid API UUID"
            }
          },
          forbiddenResponse,
          {
            "status": "404 Not Found",
            "description": "No API matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "api not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/apis/",
      "summary": "Create an API resource definition.",
      "surface": management,
      "details": {
        "overview": "Creates an API resource definition for the tenant. The server generates the audience identifier (api-<12 random alphanumerics>); the name is unique per tenant.",
        "notes": [
          "Requires the api:create permission (no step-up: a new API grants nothing until permissions are wired to roles).",
          "The identifier is the audience that token issuance and permission scoping resolve against.",
          "is_system is always false for API-created rows.",
          "The create emits an api.created integration event and a management audit record."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "API creation payload.",
          "fields": [
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
              "description": statusActiveInactive
            },
            {
              "name": "service_id",
              "type": "string (UUID)",
              "required": true,
              "description": "UUID of the owning service."
            }
          ],
          "example": {
            "name": "billing",
            "display_name": "Billing API",
            "description": "Billing and invoicing endpoints",
            "status": "active",
            "service_id": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d"
          }
        },
        "responses": [
          {
            "status": "201 Created",
            "description": "The API resource definition was created.",
            "example": {
              "success": true,
              "data": apiRowExample,
              "message": "API created successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "404 Not Found",
            "description": "The referenced service does not exist or belongs to another tenant.",
            "example": {
              "success": false,
              "error": "service not found or access denied"
            }
          },
          {
            "status": "409 Conflict",
            "description": "An API with the same name already exists in the tenant.",
            "example": {
              "success": false,
              "error": "billing api already exists"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/apis/{api_uuid}",
      "summary": "Update an API resource definition.",
      "surface": management,
      "details": {
        "overview": "Replaces an API resource definition. Because the identifier is the audience that token issuance and permission scoping resolve against, editing an existing API is step-up gated.",
        "notes": [
          "Requires the api:update permission and step-up authentication.",
          "System APIs cannot be updated.",
          "The name uniqueness check applies when the name changes.",
          "Emits api.updated and a management audit record."
        ],
        "parameters": [
          {
            "name": "api_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the API resource definition."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "API update payload (full replacement).",
          "fields": [
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
              "description": statusActiveInactive
            },
            {
              "name": "service_id",
              "type": "string (UUID)",
              "required": true,
              "description": "UUID of the owning service."
            }
          ],
          "example": {
            "name": "billing",
            "display_name": "Billing API",
            "description": "Billing and invoicing endpoints (updated)",
            "status": "active",
            "service_id": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The API resource definition was updated.",
            "example": {
              "success": true,
              "data": apiRowExample,
              "message": "API updated successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The api_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid API UUID"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "400 Bad Request",
            "description": "The target is a system API.",
            "example": {
              "success": false,
              "error": "system API cannot be updated"
            }
          },
          {
            "status": "404 Not Found",
            "description": "No API matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "api not found or access denied"
            }
          },
          {
            "status": "409 Conflict",
            "description": "The new name collides with another API in the tenant.",
            "example": {
              "success": false,
              "error": "billing api already exists"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/apis/{api_uuid}/status",
      "summary": "Change API resource status.",
      "surface": management,
      "details": {
        "overview": "Updates only an API's status. Deactivating an API stops its permissions from being issuable in tokens.",
        "notes": [
          "Requires the api:update permission and step-up authentication.",
          "System API status cannot be updated.",
          "Emits api.status_changed."
        ],
        "parameters": [
          {
            "name": "api_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the API resource definition."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "API status payload.",
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
            "description": "The API status was updated.",
            "example": {
              "success": true,
              "data": apiRowExample,
              "message": "API status updated successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The api_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid API UUID"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "400 Bad Request",
            "description": "The target is a system API.",
            "example": {
              "success": false,
              "error": "system API status cannot be updated"
            }
          },
          {
            "status": "404 Not Found",
            "description": "No API matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "api not found or access denied"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/apis/{api_uuid}",
      "summary": "Delete an API resource definition.",
      "surface": management,
      "details": {
        "overview": "Soft-deletes an API resource definition. All permissions belonging to the API within the tenant are soft-deleted in the same transaction.",
        "notes": [
          "Requires the api:delete permission and step-up authentication.",
          "System APIs cannot be deleted.",
          "Deleting an API removes the audience its permissions resolved against."
        ],
        "parameters": [
          {
            "name": "api_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the API resource definition."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The API was deleted. The response carries the deleted record.",
            "example": {
              "success": true,
              "data": apiRowExample,
              "message": "API deleted successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The api_uuid path value is not a valid UUID, or the target is a system API.",
            "example": {
              "success": false,
              "error": "Invalid API UUID"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          {
            "status": "404 Not Found",
            "description": "No API matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "api not found or access denied"
            }
          },
          internalErrorResponse
        ]
      }
    },

    // ──────────────────────────────────────────────────────────────────────────
    // Permissions
    // ──────────────────────────────────────────────────────────────────────────
    {
      "method": "GET",
      "path": "/permissions/",
      "summary": "List permissions.",
      "surface": management,
      "details": {
        "overview": "Lists the tenant's permissions with pagination, filtering, and sorting. Each permission carries its owning API projection.",
        "notes": [
          "Requires the permission:read permission.",
          "api_id and role_id filters resolve by UUID; unknown or cross-tenant references respond as not found.",
          "The legacy client_id filter is intentionally unsupported and returns 400.",
          "status is a single exact value, not a list."
        ],
        "parameters": [
          {
            "name": "name",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Case-insensitive partial match on name."
          },
          {
            "name": "description",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Case-insensitive partial match on description."
          },
          {
            "name": "api_id",
            "in": "query",
            "type": "string (UUID)",
            "required": false,
            "description": "Filter by owning API UUID."
          },
          {
            "name": "role_id",
            "in": "query",
            "type": "string (UUID)",
            "required": false,
            "description": "Filter by role assignment."
          },
          {
            "name": "client_id",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Unsupported: presence returns 400. Use the auth client API endpoints instead."
          },
          {
            "name": "status",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Exact status match: active or inactive."
          },
          {
            "name": "is_system",
            "in": "query",
            "type": "boolean",
            "required": false,
            "description": "Filter by system flag."
          },
          ...standardPaginationParams
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The paginated permission list.",
            "example": {
              "success": true,
              "data": paginatedRows(permissionRowExample).data,
              "message": "Permissions fetched successfully"
            }
          },
          tenantMissingResponse,
          forbiddenResponse,
          validationErrorResponse,
          {
            "status": "400 Bad Request",
            "description": "The client_id filter was supplied.",
            "example": {
              "success": false,
              "error": "auth client filtering is no longer supported - use auth client API endpoints instead"
            }
          },
          {
            "status": "404 Not Found",
            "description": "The api_id or role_id filter does not resolve in the caller's tenant.",
            "example": {
              "success": false,
              "error": "api not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/permissions/{permission_uuid}",
      "summary": "Read one permission.",
      "surface": management,
      "details": {
        "overview": "Returns one permission by UUID, including its owning API projection.",
        "notes": [
          "Requires the permission:read permission.",
          "Permissions in another tenant respond as not found."
        ],
        "parameters": [
          {
            "name": "permission_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the permission."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The permission.",
            "example": {
              "success": true,
              "data": permissionRowExample,
              "message": "Permission fetched successfully"
            }
          },
          tenantMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The permission_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid permission UUID"
            }
          },
          forbiddenResponse,
          {
            "status": "404 Not Found",
            "description": "No permission matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "permission not found or access denied"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/permissions/",
      "summary": "Create a permission.",
      "surface": management,
      "details": {
        "overview": "Creates a permission under an API resource. The permission name is the authorization token: it must match the strict segment format and cannot start with a reserved namespace.",
        "notes": [
          "Requires the permission:create permission (no step-up: a new permission grants nothing until attached to a role).",
          "Name format: 2 to 4 lowercase colon-separated segments, e.g. invoices:read or users:read:own.",
          "Reserved first-segment namespaces (user, role, api, service, tenant, and others) are rejected to prevent privilege escalation.",
          "Permissions cannot be added to a system API.",
          "The api association is immutable after creation.",
          "Emits permission.created and a management audit record."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Permission creation payload.",
          "fields": [
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
              "description": statusActiveInactive
            },
            {
              "name": "api_id",
              "type": "string (UUID)",
              "required": true,
              "description": "UUID of the owning API resource."
            }
          ],
          "example": {
            "name": "invoices:read",
            "description": "Read invoices",
            "status": "active",
            "api_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          }
        },
        "responses": [
          {
            "status": "201 Created",
            "description": "The permission was created.",
            "example": {
              "success": true,
              "data": permissionRowExample,
              "message": "Permission created successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "400 Bad Request",
            "description": "The referenced API is a system API.",
            "example": {
              "success": false,
              "error": "permissions cannot be added to a system API"
            }
          },
          {
            "status": "404 Not Found",
            "description": "The referenced API does not exist or belongs to another tenant.",
            "example": {
              "success": false,
              "error": "api not found or access denied"
            }
          },
          {
            "status": "409 Conflict",
            "description": "A permission with the same name already exists in the tenant.",
            "example": {
              "success": false,
              "error": "invoices:read permission already exists"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/permissions/{permission_uuid}",
      "summary": "Update a permission.",
      "surface": management,
      "details": {
        "overview": "Updates a permission's name, description, and status. Renaming a permission re-points every existing role grant at a different guard, so the operation is step-up gated.",
        "notes": [
          "Requires the permission:update permission and step-up authentication.",
          "System permissions cannot be updated.",
          "The API association cannot be changed.",
          "After commit, affected authorization tokens are invalidated.",
          "Emits permission.updated only when something changed."
        ],
        "parameters": [
          {
            "name": "permission_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the permission."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Permission update payload.",
          "fields": [
            {
              "name": "name",
              "type": "string",
              "required": true,
              "description": "Permission name. Same rules as creation."
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
              "description": statusActiveInactive
            }
          ],
          "example": {
            "name": "invoices:read",
            "description": "Read all invoices",
            "status": "active"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The permission was updated.",
            "example": {
              "success": true,
              "data": permissionRowExample,
              "message": "Permission updated successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The permission_uuid path value is not a valid UUID, or the target is a system permission.",
            "example": {
              "success": false,
              "error": "system permission cannot be updated"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "404 Not Found",
            "description": "No permission matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "permission not found or access denied"
            }
          },
          {
            "status": "409 Conflict",
            "description": "The new name collides with another permission in the tenant.",
            "example": {
              "success": false,
              "error": "invoices:read permission already exists"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/permissions/{permission_uuid}/status",
      "summary": "Change permission status.",
      "surface": management,
      "details": {
        "overview": "Updates only a permission's status. Deactivating a permission revokes it everywhere at once: inactive rows no longer grant, and affected authorization tokens are invalidated.",
        "notes": [
          "Requires the permission:update permission and step-up authentication.",
          "System permissions cannot be modified.",
          "No integration event is emitted for status-only changes; authorization invalidation still runs."
        ],
        "parameters": [
          {
            "name": "permission_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the permission."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Permission status payload.",
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
            "description": "The permission status was updated.",
            "example": {
              "success": true,
              "data": permissionRowExample,
              "message": "Permission status updated successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The permission_uuid path value is not a valid UUID, or the target is a system permission.",
            "example": {
              "success": false,
              "error": "system permissions cannot be modified"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "404 Not Found",
            "description": "No permission matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "permission not found or access denied"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/permissions/{permission_uuid}",
      "summary": "Delete a permission.",
      "surface": management,
      "details": {
        "overview": "Soft-deletes a permission. Every role that held the permission loses it, and affected authorization tokens are invalidated.",
        "notes": [
          "Requires the permission:delete permission and step-up authentication.",
          "System permissions cannot be deleted.",
          "Emits permission.deleted."
        ],
        "parameters": [
          {
            "name": "permission_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the permission."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The permission was deleted. The response carries the deleted record.",
            "example": {
              "success": true,
              "data": permissionRowExample,
              "message": "Permission deleted successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The permission_uuid path value is not a valid UUID, or the target is a system permission.",
            "example": {
              "success": false,
              "error": "system permission cannot be deleted"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          {
            "status": "404 Not Found",
            "description": "No permission matches the UUID in the caller's tenant.",
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
    // Roles
    // ──────────────────────────────────────────────────────────────────────────
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
    // Policies
    // ──────────────────────────────────────────────────────────────────────────
    {
      "method": "GET",
      "path": "/policies/",
      "summary": "List policies.",
      "surface": management,
      "details": {
        "overview": "Lists the tenant's policies with pagination, filtering, and sorting. List rows omit the policy document.",
        "notes": [
          "Requires the policy:read permission.",
          "status accepts a comma-separated list (at most 2 values).",
          "service_id joins through service_policies and live services."
        ],
        "parameters": [
          {
            "name": "name",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Case-insensitive partial match on name. 1-150 characters."
          },
          {
            "name": "description",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Case-insensitive partial match on description. 1-500 characters."
          },
          {
            "name": "version",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Case-insensitive partial match on version. 1-20 characters."
          },
          {
            "name": "status",
            "in": "query",
            "type": "string (comma-separated)",
            "required": false,
            "description": "Filter by status: active, inactive. At most 2 values."
          },
          {
            "name": "is_system",
            "in": "query",
            "type": "boolean",
            "required": false,
            "description": "Filter by system flag."
          },
          {
            "name": "service_id",
            "in": "query",
            "type": "string (UUID)",
            "required": false,
            "description": "Filter by a bound service UUID."
          },
          ...standardPaginationParams
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The paginated policy list (rows omit the document).",
            "example": {
              "success": true,
              "data": {
                "rows": [
                  {
                    "policy_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                    "name": "billing-read",
                    "description": "Allows read access to billing",
                    "version": "1",
                    "status": "active",
                    "is_system": false,
                    "created_at": "2026-08-01T09:00:00Z",
                    "updated_at": "2026-08-10T09:00:00Z"
                  }
                ],
                "total": 1,
                "page": 1,
                "limit": 20,
                "total_pages": 1
              },
              "message": "Policies retrieved successfully"
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
      "path": "/policies/{policy_uuid}",
      "summary": "Read one policy.",
      "surface": management,
      "details": {
        "overview": "Returns one policy by UUID with its full document.",
        "notes": [
          "Requires the policy:read permission.",
          "Policies in another tenant respond as not found."
        ],
        "parameters": [
          {
            "name": "policy_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the policy."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The policy with its document.",
            "example": {
              "success": true,
              "data": policyDetailExample,
              "message": "Policy retrieved successfully"
            }
          },
          tenantMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The policy_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid policy UUID"
            }
          },
          forbiddenResponse,
          {
            "status": "404 Not Found",
            "description": "No policy matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "policy not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/policies/{policy_uuid}/services",
      "summary": "List services using a policy.",
      "surface": management,
      "details": {
        "overview": "Returns the caller's services that are bound to the policy, with pagination and filtering. Policy ownership is checked first.",
        "notes": [
          "Requires the policy:read permission.",
          "Only services belonging to the caller's tenant are returned."
        ],
        "parameters": [
          {
            "name": "policy_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the policy."
          },
          {
            "name": "name",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Filter by service name. At most 150 characters."
          },
          {
            "name": "display_name",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Filter by display name. At most 150 characters."
          },
          {
            "name": "description",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Filter by description. At most 500 characters."
          },
          ...standardPaginationParams
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The paginated service list.",
            "example": {
              "success": true,
              "data": paginatedRows(serviceRowExample).data,
              "message": "Services retrieved successfully"
            }
          },
          tenantMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The policy_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid policy UUID"
            }
          },
          forbiddenResponse,
          validationErrorResponse,
          {
            "status": "404 Not Found",
            "description": "No policy matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "policy not found or access denied"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/policies/{policy_uuid}/history",
      "summary": "List policy version history.",
      "surface": management,
      "details": {
        "overview": "Lists the append-only version-history snapshots for a policy, newest first. Every successful update writes a before-state snapshot with the acting user and optional change reason.",
        "notes": [
          "Requires the policy:read permission.",
          "History rows are immutable at the database level.",
          "Requires the policy version-history feature to be wired; otherwise the endpoint responds 404."
        ],
        "parameters": [
          {
            "name": "policy_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the policy."
          },
          {
            "name": "page",
            "in": "query",
            "type": "integer",
            "required": false,
            "description": "Page number, starting at 1."
          },
          {
            "name": "limit",
            "in": "query",
            "type": "integer",
            "required": false,
            "description": "Page size, 1-100."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The paginated version history, newest first.",
            "example": {
              "success": true,
              "data": {
                "rows": [
                  {
                    "uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
                    "version_number": 1,
                    "name": "billing-read",
                    "description": "Allows read access to billing",
                    "policy_version": "1",
                    "snapshot_at": "2026-08-10T09:00:00Z"
                  }
                ],
                "total": 1,
                "page": 1,
                "limit": 20,
                "total_pages": 1
              },
              "message": "Policy history retrieved successfully"
            }
          },
          tenantMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The policy_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid policy UUID"
            }
          },
          forbiddenResponse,
          {
            "status": "404 Not Found",
            "description": "The policy does not exist in the tenant, or version history is not available in this deployment.",
            "example": {
              "success": false,
              "error": "policy version history is not available"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/policies/{policy_uuid}/history/{version_number}",
      "summary": "Read one policy history version.",
      "surface": management,
      "details": {
        "overview": "Returns a single version-history snapshot, including the document as it was at snapshot time and the change reason when one was recorded.",
        "notes": [
          "Requires the policy:read permission.",
          "Version numbers increment from 1 on each update."
        ],
        "parameters": [
          {
            "name": "policy_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the policy."
          },
          {
            "name": "version_number",
            "in": "path",
            "type": "integer",
            "required": true,
            "description": "History version number, 1 or greater."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The version snapshot with its document.",
            "example": {
              "success": true,
              "data": {
                "uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
                "version_number": 1,
                "name": "billing-read",
                "description": "Allows read access to billing",
                "document": {
                  "version": "v1",
                  "statement": [
                    {
                      "effect": "allow",
                      "action": ["invoices:read"],
                      "resource": ["billing-api"]
                    }
                  ]
                },
                "policy_version": "1",
                "change_reason": "scoped down to read-only",
                "snapshot_at": "2026-08-10T09:00:00Z"
              },
              "message": "Policy version retrieved successfully"
            }
          },
          tenantMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The policy_uuid or version_number path value is invalid.",
            "example": {
              "success": false,
              "error": "Invalid version number"
            }
          },
          forbiddenResponse,
          {
            "status": "404 Not Found",
            "description": "The policy, the history feature, or the version does not exist.",
            "example": {
              "success": false,
              "error": "policy version not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/policies/",
      "summary": "Create a policy.",
      "surface": management,
      "details": {
        "overview": "Creates a policy document for the tenant. The document is the authorization decision for every service it gets bound to: version must be v1 and each statement declares an effect with actions and resources.",
        "notes": [
          "Requires the policy:create permission (no step-up: a new policy decides nothing until bound to a service).",
          "Document schema: version (v1), statement[] with effect (allow|deny), action[], resource[].",
          "Action and resource values support wildcard patterns evaluated at decision time.",
          "Uniqueness is per-tenant on (name, version).",
          "is_system is always false for API-created policies.",
          "Emits policy.created."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Policy creation payload.",
          "fields": [
            {
              "name": "name",
              "type": "string",
              "required": true,
              "description": "Policy name. 3-150 characters: lowercase letters, numbers, underscores, colons, slashes, hyphens."
            },
            {
              "name": "description",
              "type": "string",
              "required": false,
              "description": "Description. At most 500 characters."
            },
            {
              "name": "document",
              "type": "object",
              "required": true,
              "description": "Policy document: { version: \"v1\", statement: [{ effect, action[], resource[] }] }."
            },
            {
              "name": "version",
              "type": "string",
              "required": true,
              "description": "Policy version. 1-20 characters."
            },
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": statusActiveInactive
            }
          ],
          "example": {
            "name": "billing-read",
            "description": "Allows read access to billing",
            "document": {
              "version": "v1",
              "statement": [
                {
                  "effect": "allow",
                  "action": ["invoices:read"],
                  "resource": ["billing-api"]
                }
              ]
            },
            "version": "1",
            "status": "active"
          }
        },
        "responses": [
          {
            "status": "201 Created",
            "description": "The policy was created.",
            "example": {
              "success": true,
              "data": policyDetailExample,
              "message": "Policy created successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "409 Conflict",
            "description": "A policy with the same name and version already exists in the tenant.",
            "example": {
              "success": false,
              "error": "policy with name 'billing-read' and version '1' already exists"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/policies/{policy_uuid}",
      "summary": "Update a policy.",
      "surface": management,
      "details": {
        "overview": "Replaces a policy. A policy document IS the authorization decision for every service it is bound to, so editing one is step-up gated. Every update snapshots the before-state into append-only version history.",
        "notes": [
          "Requires the policy:update permission and step-up authentication.",
          "System policies cannot be updated.",
          "change_reason is recorded on the version-history row.",
          "Emits IAMPolicyUpdated only when something changed."
        ],
        "parameters": [
          {
            "name": "policy_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the policy."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Policy update payload.",
          "fields": [
            {
              "name": "name",
              "type": "string",
              "required": true,
              "description": "Policy name. Same rules as creation."
            },
            {
              "name": "description",
              "type": "string",
              "required": false,
              "description": "Description. At most 500 characters."
            },
            {
              "name": "document",
              "type": "object",
              "required": true,
              "description": "Policy document with version v1 and statements."
            },
            {
              "name": "version",
              "type": "string",
              "required": true,
              "description": "Policy version. 1-20 characters."
            },
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": statusActiveInactive
            },
            {
              "name": "change_reason",
              "type": "string",
              "required": false,
              "description": "Free-text reason recorded on the version-history snapshot."
            }
          ],
          "example": {
            "name": "billing-read",
            "description": "Allows read access to billing",
            "document": {
              "version": "v1",
              "statement": [
                {
                  "effect": "allow",
                  "action": ["invoices:read"],
                  "resource": ["billing-api"]
                }
              ]
            },
            "version": "1",
            "status": "active",
            "change_reason": "scoped down to read-only"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The policy was updated.",
            "example": {
              "success": true,
              "data": policyDetailExample,
              "message": "Policy updated successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The policy_uuid path value is not a valid UUID, or the target is a system policy.",
            "example": {
              "success": false,
              "error": "system policy cannot be updated"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "404 Not Found",
            "description": "No policy matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "policy not found or access denied"
            }
          },
          {
            "status": "409 Conflict",
            "description": "The new name and version collide with another policy in the tenant.",
            "example": {
              "success": false,
              "error": "policy with name 'billing-read' and version '2' already exists"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/policies/{policy_uuid}/status",
      "summary": "Change policy status.",
      "surface": management,
      "details": {
        "overview": "Updates only a policy's status. Deactivating a policy stops it from being included in the policy bundles served to bound services.",
        "notes": [
          "Requires the policy:update permission and step-up authentication.",
          "System policy status cannot be updated.",
          "Emits IAMPolicyUpdated with the changed status field."
        ],
        "parameters": [
          {
            "name": "policy_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the policy."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Policy status payload.",
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
            "description": "The policy status was updated.",
            "example": {
              "success": true,
              "data": policyDetailExample,
              "message": "Policy status updated successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The policy_uuid path value is not a valid UUID, or the target is a system policy.",
            "example": {
              "success": false,
              "error": "system policy status cannot be updated"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "404 Not Found",
            "description": "No policy matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "policy not found or access denied"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/policies/{policy_uuid}",
      "summary": "Delete a policy.",
      "surface": management,
      "details": {
        "overview": "Soft-deletes a policy. Bound services stop receiving the policy in their bundles.",
        "notes": [
          "Requires the policy:delete permission and step-up authentication.",
          "System policies cannot be deleted.",
          "Emits policy.deleted."
        ],
        "parameters": [
          {
            "name": "policy_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the policy."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The policy was deleted. The response carries the deleted record.",
            "example": {
              "success": true,
              "data": policyDetailExample,
              "message": "Policy deleted successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The policy_uuid path value is not a valid UUID, or the target is a system policy.",
            "example": {
              "success": false,
              "error": "system policies cannot be deleted"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          {
            "status": "404 Not Found",
            "description": "No policy matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "policy not found or access denied"
            }
          },
          internalErrorResponse
        ]
      }
    },

    // ──────────────────────────────────────────────────────────────────────────
    // Services
    // ──────────────────────────────────────────────────────────────────────────
    {
      "method": "GET",
      "path": "/services/me/policy-bundle",
      "summary": "Read the calling service principal policy bundle.",
      "surface": management,
      "details": {
        "overview": "Returns the policy bundle for the calling service principal. The bundle is the complete set of authorization documents a running workload enforces, addressed to its own service identity.",
        "notes": [
          "JWT authentication only: no permission middleware and no user-context middleware.",
          "The token must identify a service: the svc claim, or sub with sub_type=service. Tenant comes from the token claims.",
          "Only active services can fetch a bundle; only active policies are included.",
          "Bundle version is a content hash; the response carries an ETag and Cache-Control: max-age=30, and honors If-None-Match with 304 Not Modified.",
          "One unparseable attached policy fails the whole bundle rather than silently dropping a deny."
        ],
        "parameters": [],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The service principal's policy bundle.",
            "example": {
              "success": true,
              "data": {
                "service": "billing-service",
                "version": "v9f2c1a3b4d5e6",
                "policies": [
                  {
                    "version": "v1",
                    "statement": [
                      {
                        "effect": "allow",
                        "action": ["invoices:read"],
                        "resource": ["billing-api"]
                      }
                    ]
                  }
                ],
                "generated_at": "2026-08-15T09:00:00Z"
              },
              "message": "Policy bundle fetched successfully"
            }
          },
          {
            "status": "304 Not Modified",
            "description": "The If-None-Match header matches the current bundle ETag.",
            "example": null
          },
          {
            "status": "401 Unauthorized",
            "description": "The token does not identify a service principal.",
            "example": {
              "success": false,
              "error": "Service token required"
            }
          },
          {
            "status": "403 Forbidden",
            "description": "The token is not bound to a tenant.",
            "example": {
              "success": false,
              "error": "this token is not bound to a tenant"
            }
          },
          {
            "status": "404 Not Found",
            "description": "The service principal does not exist or is not active.",
            "example": {
              "success": false,
              "error": "service principal not found or inactive"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/services/",
      "summary": "List services.",
      "surface": management,
      "details": {
        "overview": "Lists the tenant's services with pagination, filtering, and sorting. Each row includes API and policy counts.",
        "notes": [
          "Requires the service:read permission.",
          "status accepts a comma-separated list from active, maintenance, deprecated, inactive."
        ],
        "parameters": [
          {
            "name": "name",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Case-insensitive partial match on name."
          },
          {
            "name": "display_name",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Case-insensitive partial match on display name."
          },
          {
            "name": "description",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Case-insensitive partial match on description."
          },
          {
            "name": "version",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Case-insensitive partial match on version."
          },
          {
            "name": "status",
            "in": "query",
            "type": "string (comma-separated)",
            "required": false,
            "description": "Filter by status: active, maintenance, deprecated, inactive."
          },
          {
            "name": "is_system",
            "in": "query",
            "type": "boolean",
            "required": false,
            "description": "Filter by system flag."
          },
          ...standardPaginationParams
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The paginated service list.",
            "example": {
              "success": true,
              "data": paginatedRows(serviceRowExample).data,
              "message": "Services fetched successfully"
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
      "path": "/services/{service_uuid}",
      "summary": "Read one service.",
      "surface": management,
      "details": {
        "overview": "Returns one service by UUID, including its API and policy counts.",
        "notes": [
          "Requires the service:read permission.",
          "Services in another tenant respond as not found."
        ],
        "parameters": [
          {
            "name": "service_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the service."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The service.",
            "example": {
              "success": true,
              "data": serviceRowExample,
              "message": "Service fetched successfully"
            }
          },
          tenantMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The service_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid service UUID"
            }
          },
          forbiddenResponse,
          {
            "status": "404 Not Found",
            "description": "No service matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "service not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/services/",
      "summary": "Create a service.",
      "surface": management,
      "details": {
        "overview": "Creates a service principal for the tenant. A service row is the identity that policy bundles are served to and that APIs hang off.",
        "notes": [
          "Requires the service:create permission (no step-up: a new service authorizes nothing until bound to policies).",
          "Service names are unique per tenant.",
          "is_system is always false for API-created services.",
          "Emits service.created."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Service creation payload.",
          "fields": [
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
          "example": {
            "name": "billing-service",
            "display_name": "Billing Service",
            "description": "Handles billing operations",
            "version": "1.0.0",
            "status": "active"
          }
        },
        "responses": [
          {
            "status": "201 Created",
            "description": "The service was created.",
            "example": {
              "success": true,
              "data": serviceRowExample,
              "message": "Service created successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "409 Conflict",
            "description": "A service with the same name already exists in the tenant.",
            "example": {
              "success": false,
              "error": "billing-service service already exists for this tenant"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/services/{service_uuid}",
      "summary": "Update a service.",
      "surface": management,
      "details": {
        "overview": "Replaces a service. A service row is the identity policy bundles are served to, so renaming or disabling one redirects or blanks the authorization rules a running workload enforces — the operation is step-up gated.",
        "notes": [
          "Requires the service:update permission and step-up authentication.",
          "System services cannot be updated.",
          "Emits service.updated."
        ],
        "parameters": [
          {
            "name": "service_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the service."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Service update payload.",
          "fields": [
            {
              "name": "name",
              "type": "string",
              "required": true,
              "description": "Service name. 3-50 characters."
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
          "example": {
            "name": "billing-service",
            "display_name": "Billing Service",
            "description": "Handles billing and payment operations",
            "version": "1.1.0",
            "status": "active"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The service was updated.",
            "example": {
              "success": true,
              "data": serviceRowExample,
              "message": "Service updated successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The service_uuid path value is not a valid UUID, or the target is a system service.",
            "example": {
              "success": false,
              "error": "system service cannot be updated"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "404 Not Found",
            "description": "No service matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "service not found"
            }
          },
          {
            "status": "409 Conflict",
            "description": "The new name collides with another service in the tenant.",
            "example": {
              "success": false,
              "error": "billing-service service already exists"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/services/{service_uuid}/status",
      "summary": "Change service status.",
      "surface": management,
      "details": {
        "overview": "Updates only a service's status. Disabling a service stops it from fetching policy bundles and therefore blanks the authorization rules its workload enforces.",
        "notes": [
          "Requires the service:update permission and step-up authentication.",
          "System service status cannot be updated.",
          "Emits service.status_changed."
        ],
        "parameters": [
          {
            "name": "service_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the service."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Service status payload.",
          "fields": [
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "One of active, maintenance, deprecated, inactive."
            }
          ],
          "example": {
            "status": "maintenance"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The service status was updated.",
            "example": {
              "success": true,
              "data": serviceRowExample,
              "message": "Service updated successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The service_uuid path value is not a valid UUID, or the target is a system service.",
            "example": {
              "success": false,
              "error": "system service status cannot be updated"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "404 Not Found",
            "description": "No service matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "service not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/services/{service_uuid}",
      "summary": "Delete a service.",
      "surface": management,
      "details": {
        "overview": "Soft-deletes a service, cascading to its APIs and their permissions in the same transaction.",
        "notes": [
          "Requires the service:delete permission and step-up authentication.",
          "System services cannot be deleted.",
          "Emits service.deleted."
        ],
        "parameters": [
          {
            "name": "service_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the service."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The service was deleted. The response carries the deleted record.",
            "example": {
              "success": true,
              "data": serviceRowExample,
              "message": "Service deleted successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The service_uuid path value is not a valid UUID, or the target is a system service.",
            "example": {
              "success": false,
              "error": "system service cannot be deleted"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          {
            "status": "404 Not Found",
            "description": "No service matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "service not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/services/{service_uuid}/policies/{policy_uuid}",
      "summary": "Assign a policy to a service.",
      "surface": management,
      "details": {
        "overview": "Binds a policy to a service. This edge is where an inert policy document starts deciding real requests for the service's workload, which is why it is step-up gated.",
        "notes": [
          "Requires the service:policy:assign permission and step-up authentication.",
          "Both the service and the policy must belong to the caller's tenant.",
          "Idempotent: an existing assignment returns success without a duplicate.",
          "Emits IAMServicePolicyAssigned so bundle consumers are invalidated immediately."
        ],
        "parameters": [
          {
            "name": "service_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the service."
          },
          {
            "name": "policy_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the policy to bind."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The policy was assigned to the service.",
            "example": {
              "success": true,
              "message": "Policy assigned to service successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The service_uuid or policy_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid service UUID"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          {
            "status": "404 Not Found",
            "description": "The service or policy does not exist in the caller's tenant.",
            "example": {
              "success": false,
              "error": "policy not found or access denied"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/services/{service_uuid}/policies/{policy_uuid}",
      "summary": "Remove a policy from a service.",
      "surface": management,
      "details": {
        "overview": "Unbinds a policy from a service. Dropping a deny policy changes what the workload allows, so removal is step-up gated like assignment.",
        "notes": [
          "Requires the service:policy:remove permission and step-up authentication.",
          "Idempotent: removing an assignment that does not exist still succeeds.",
          "Emits IAMServicePolicyRemoved for revocation propagation."
        ],
        "parameters": [
          {
            "name": "service_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the service."
          },
          {
            "name": "policy_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the policy to unbind."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The policy was removed from the service.",
            "example": {
              "success": true,
              "message": "Policy removed from service successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The service_uuid or policy_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid policy UUID"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          {
            "status": "404 Not Found",
            "description": "The service or policy does not exist in the caller's tenant.",
            "example": {
              "success": false,
              "error": "service not found"
            }
          },
          internalErrorResponse
        ]
      }
    },

    // ──────────────────────────────────────────────────────────────────────────
    // Authorize
    // ──────────────────────────────────────────────────────────────────────────
    {
      "method": "POST",
      "path": "/authorize/",
      "summary": "Evaluate an authorization decision.",
      "surface": management,
      "details": {
        "overview": "Evaluates a single authorization decision for the calling service principal against its policy bundle. Wildcards are supported on both action and resource; deny wins; unknown document versions or effects fail closed.",
        "notes": [
          "JWT authentication only: no permission middleware and no user-context middleware.",
          "principal and tenant_id in the body are ignored; both are taken from the token claims to prevent mass-assignment.",
          "A statement matches only when BOTH action and resource match; document version must be exactly v1.",
          "Deny responses are still HTTP 200: the decision lives in the body."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Authorization decision request.",
          "fields": [
            {
              "name": "action",
              "type": "string",
              "required": false,
              "description": "The action being asked about, e.g. invoices:read. Wildcards supported."
            },
            {
              "name": "resource",
              "type": "string",
              "required": false,
              "description": "The resource being asked about, e.g. billing-api. Wildcards supported."
            },
            {
              "name": "principal",
              "type": "string",
              "required": false,
              "description": "Ignored: the principal is taken from the token (svc claim or service subject)."
            },
            {
              "name": "tenant_id",
              "type": "integer",
              "required": false,
              "description": "Ignored: the tenant is taken from the token claims."
            }
          ],
          "example": {
            "action": "invoices:read",
            "resource": "billing-api"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The decision was evaluated. allowed is true only when a statement matched; reason explains the outcome.",
            "example": {
              "success": true,
              "data": {
                "allowed": true,
                "reason": "matched allow"
              },
              "message": "Authorization decision evaluated"
            }
          },
          {
            "status": "200 OK",
            "description": "Denied because a matching statement carries effect deny (deny wins).",
            "example": {
              "success": true,
              "data": {
                "allowed": false,
                "reason": "explicit deny"
              },
              "message": "Authorization decision evaluated"
            }
          },
          invalidBodyResponse,
          {
            "status": "401 Unauthorized",
            "description": "The request carries no valid JWT claims.",
            "example": {
              "success": false,
              "error": "Authentication required"
            }
          },
          {
            "status": "403 Forbidden",
            "description": "The token has no service principal, or it is not bound to a tenant.",
            "example": {
              "success": false,
              "error": "This token has no principal to authorize"
            }
          },
          internalErrorResponse
        ]
      }
    }
  ]
};

export default group;
