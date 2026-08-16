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
      "Name": "Registration flow name is required"
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

const internalErrorResponse = {
  "status": "500 Internal Server Error",
  "description": "An unexpected service or persistence error occurred.",
  "example": {
    "success": false,
    "error": "An unexpected error occurred"
  }
};

const invalidFlowUuidResponse = {
  "status": "400 Bad Request",
  "description": "The registration_flow_uuid path value is not a valid UUID.",
  "example": {
    "success": false,
    "error": "Invalid registration flow UUID"
  }
};

const flowDetailExample = {
  "registration_flow_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "name": "customer-signup",
  "description": "Self-service customer onboarding",
  "status": "active",
  "client_id": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
  "client": {
    "client_id": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
    "name": "app-web",
    "display_name": "Example Web Application",
    "identifier": "app-web-client",
    "status": "active"
  },
  "verification_required": true,
  "required_fields": ["fullname", "email"],
  "is_system": false,
  "created_at": "2026-08-01T09:00:00Z",
  "updated_at": "2026-08-10T09:00:00Z"
};

const roleRowExample = {
  "role_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "name": "customer",
  "description": "Default customer role",
  "is_default": false,
  "is_system": false,
  "status": "active",
  "created_at": "2026-08-01T09:00:00Z",
  "updated_at": "2026-08-01T09:00:00Z"
};

const group = {
  "slug": "registration-flows",
  "label": "Registration Flows",
  "description": "Registration-flow configuration APIs for self-registration rules, invite-based onboarding behavior, default roles, status, and lifecycle.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/registration_flows/",
      "summary": "List registration flows.",
      "surface": management,
      "details": {
        "overview": "Lists the tenant's registration flows with pagination, filtering, and sorting. The list projection is lean: required_fields and the resolved client summary are detail-only fields.",
        "notes": [
          "Requires the registration-flow:read permission.",
          "Results are scoped to the authenticated caller's tenant.",
          "status accepts a comma-separated list.",
          "Filter and search terms are capped at 100 characters."
        ],
        "parameters": [
          {
            "name": "name",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Filter by flow name. Maximum 100 characters."
          },
          {
            "name": "search",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Free-text search. Maximum 100 characters."
          },
          {
            "name": "status",
            "in": "query",
            "type": "string (comma-separated)",
            "required": false,
            "description": "Filter by status: active, inactive."
          },
          {
            "name": "client_id",
            "in": "query",
            "type": "string (UUID)",
            "required": false,
            "description": "Filter by the linked auth client UUID."
          },
          {
            "name": "is_system",
            "in": "query",
            "type": "boolean",
            "required": false,
            "description": "Filter by whether the flow is system-managed."
          },
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
            "description": "Field to sort by."
          },
          {
            "name": "sort_order",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Sort direction: asc or desc."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The paginated registration-flow list.",
            "example": {
              "success": true,
              "data": {
                "rows": [
                  {
                    "registration_flow_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                    "name": "customer-signup",
                    "description": "Self-service customer onboarding",
                    "status": "active",
                    "client_id": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
                    "verification_required": true,
                    "is_system": false,
                    "created_at": "2026-08-01T09:00:00Z",
                    "updated_at": "2026-08-10T09:00:00Z"
                  }
                ],
                "total": 2,
                "page": 1,
                "limit": 20,
                "total_pages": 1
              },
              "message": "Registration flows retrieved successfully"
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
      "path": "/registration_flows/{registration_flow_uuid}",
      "summary": "Read one registration flow.",
      "surface": management,
      "details": {
        "overview": "Returns one registration flow by UUID with its full detail projection: the resolved client summary and the required_fields set that the signup form must collect.",
        "notes": [
          "Requires the registration-flow:read permission.",
          "The client summary resolves the linked client to a human-readable name instead of a bare UUID.",
          "Flows in another tenant respond as not found."
        ],
        "parameters": [
          {
            "name": "registration_flow_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the registration flow."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The registration flow was retrieved.",
            "example": {
              "success": true,
              "data": flowDetailExample,
              "message": "Registration flow retrieved successfully"
            }
          },
          tenantMissingResponse,
          invalidFlowUuidResponse,
          forbiddenResponse,
          {
            "status": "404 Not Found",
            "description": "No registration flow matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "registration flow not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/registration_flows/",
      "summary": "Create a registration flow.",
      "surface": management,
      "details": {
        "overview": "Creates a registration flow for the tenant. The flow is linked to an auth client, and its name is the public selector used in registration links (?registration_flow=<name>). Users who register through the flow automatically receive its assigned roles.",
        "notes": [
          "Requires the registration-flow:create permission.",
          "The name is a URL-safe slug: lowercase letters, digits, single hyphens or underscores. It is the public registration-link selector and must be unique within the tenant.",
          "status defaults to active when omitted.",
          "verification_required defaults to false when omitted.",
          "required_fields accepts only fullname, email, and phone, without duplicates.",
          "System roles cannot be attached to a self-service flow; privileged onboarding must use an invite."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Registration flow creation payload.",
          "fields": [
            {
              "name": "name",
              "type": "string",
              "required": true,
              "description": "Public flow selector. 1-100 characters: lowercase letters, digits, hyphens, underscores (e.g. partner-signup)."
            },
            {
              "name": "description",
              "type": "string",
              "required": false,
              "description": "Human-readable description. Maximum 500 characters."
            },
            {
              "name": "status",
              "type": "string",
              "required": false,
              "description": "One of active or inactive. Defaults to active."
            },
            {
              "name": "client_id",
              "type": "string (UUID)",
              "required": true,
              "description": "UUID of the auth client this flow applies to."
            },
            {
              "name": "role_ids",
              "type": "array of UUID strings",
              "required": false,
              "description": "Roles automatically granted to users registering through this flow. At most 50. System roles are rejected."
            },
            {
              "name": "verification_required",
              "type": "boolean",
              "required": false,
              "description": "Whether new users must verify their email or phone after signup. Defaults to false."
            },
            {
              "name": "required_fields",
              "type": "array of strings",
              "required": false,
              "description": "Fields the signup form must collect. Only fullname, email, and phone are allowed."
            }
          ],
          "example": {
            "name": "customer-signup",
            "description": "Self-service customer onboarding",
            "client_id": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "role_ids": ["f47ac10b-58cc-4372-a567-0e02b2c3d479"],
            "verification_required": true,
            "required_fields": ["fullname", "email"]
          }
        },
        "responses": [
          {
            "status": "201 Created",
            "description": "The registration flow was created.",
            "example": {
              "success": true,
              "data": flowDetailExample,
              "message": "Registration flow created successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "404 Not Found",
            "description": "The linked auth client does not exist in the tenant.",
            "example": {
              "success": false,
              "error": "auth client not found"
            }
          },
          {
            "status": "409 Conflict",
            "description": "A flow with the same name already exists in the tenant.",
            "example": {
              "success": false,
              "error": "a registration flow with this name already exists"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/registration_flows/{registration_flow_uuid}",
      "summary": "Update a registration flow.",
      "surface": management,
      "details": {
        "overview": "Updates a registration flow. Every optional field carries omitted-means-unchanged semantics so a partial PUT never silently re-activates a disabled flow, turns off verification, or wipes the required-field set. RoleIDs, when present, replaces the flow's role membership with exactly the provided set.",
        "notes": [
          "Requires the registration-flow:update permission.",
          "Renaming a flow changes its public registration link, so previously published links stop resolving.",
          "role_ids with an empty array clears role membership; omitting the field leaves it untouched.",
          "System-managed flows cannot be mutated.",
          "System roles are rejected here as they are on create."
        ],
        "parameters": [
          {
            "name": "registration_flow_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the registration flow."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Registration flow update payload. Omitted fields remain unchanged.",
          "fields": [
            {
              "name": "name",
              "type": "string",
              "required": false,
              "description": "Public flow selector. 1-100 characters slug."
            },
            {
              "name": "description",
              "type": "string",
              "required": false,
              "description": "Human-readable description. Maximum 500 characters."
            },
            {
              "name": "status",
              "type": "string",
              "required": false,
              "description": "One of active or inactive."
            },
            {
              "name": "role_ids",
              "type": "array of UUID strings",
              "required": false,
              "description": "Replaces role membership with exactly this set (empty array clears it). At most 50. Omit to leave unchanged."
            },
            {
              "name": "verification_required",
              "type": "boolean",
              "required": false,
              "description": "Whether new users must verify their email or phone after signup."
            },
            {
              "name": "required_fields",
              "type": "array of strings",
              "required": false,
              "description": "Fields the signup form must collect. Only fullname, email, and phone are allowed."
            }
          ],
          "example": {
            "description": "Self-service customer onboarding (updated)",
            "verification_required": false
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The registration flow was updated.",
            "example": {
              "success": true,
              "data": flowDetailExample,
              "message": "Registration flow updated successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          invalidFlowUuidResponse,
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "404 Not Found",
            "description": "No registration flow matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "registration flow not found or access denied"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PATCH",
      "path": "/registration_flows/{registration_flow_uuid}/status",
      "summary": "Change registration-flow status.",
      "surface": management,
      "details": {
        "overview": "Updates only a flow's status. Status is the kill switch for a published registration link, so it has a dedicated endpoint rather than riding on the general update.",
        "notes": [
          "Requires the registration-flow:update permission.",
          "Status must be active or inactive.",
          "Disabling a flow takes effect immediately; the public registration_context endpoint reads live flow state."
        ],
        "parameters": [
          {
            "name": "registration_flow_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the registration flow."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Registration-flow status payload.",
          "fields": [
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "Target status: active or inactive."
            }
          ],
          "example": {
            "status": "inactive"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The flow status was updated.",
            "example": {
              "success": true,
              "data": flowDetailExample,
              "message": "Registration flow status updated successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          invalidFlowUuidResponse,
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "404 Not Found",
            "description": "No registration flow matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "registration flow not found or access denied"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/registration_flows/{registration_flow_uuid}",
      "summary": "Delete a registration flow.",
      "surface": management,
      "details": {
        "overview": "Soft-deletes a registration flow and clears its role membership. The flow's public registration link stops resolving immediately.",
        "notes": [
          "Requires the registration-flow:delete permission.",
          "Deletion is blocked while pending invites still reference the flow.",
          "System-managed flows cannot be deleted.",
          "The response returns the deleted flow's detail projection."
        ],
        "parameters": [
          {
            "name": "registration_flow_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the registration flow."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The flow was deleted. The response carries the deleted flow's detail projection.",
            "example": {
              "success": true,
              "data": flowDetailExample,
              "message": "Registration flow deleted successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          invalidFlowUuidResponse,
          forbiddenResponse,
          {
            "status": "404 Not Found",
            "description": "No registration flow matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "registration flow not found or access denied"
            }
          },
          {
            "status": "409 Conflict",
            "description": "The flow is still referenced by pending invites and cannot be deleted.",
            "example": {
              "success": false,
              "error": "cannot delete registration flow that is referenced by pending invites"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/registration_flows/{registration_flow_uuid}/roles",
      "summary": "Assign roles to a registration flow.",
      "surface": management,
      "details": {
        "overview": "Assigns roles to a registration flow. Users who register through this flow are automatically granted these roles, so the service caps the set: no system roles, and only roles the acting user themselves possesses (privileged onboarding goes through invites instead).",
        "notes": [
          "Requires the registration-flow:update permission.",
          "Between 1 and 50 role UUIDs per payload.",
          "System roles are rejected outright.",
          "Roles the actor does not possess are rejected: a flow cannot be used to self-escalate beyond what the creator holds."
        ],
        "parameters": [
          {
            "name": "registration_flow_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the registration flow."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Role assignment payload.",
          "fields": [
            {
              "name": "role_ids",
              "type": "array of UUID strings",
              "required": true,
              "description": "Between 1 and 50 role UUIDs to assign."
            }
          ],
          "example": {
            "role_ids": ["f47ac10b-58cc-4372-a567-0e02b2c3d479"]
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The roles were assigned. The response lists the assigned roles.",
            "example": {
              "success": true,
              "data": [roleRowExample],
              "message": "Roles assigned successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          invalidFlowUuidResponse,
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "404 Not Found",
            "description": "The flow or a referenced role does not exist in the tenant.",
            "example": {
              "success": false,
              "error": "registration flow not found or access denied"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/registration_flows/{registration_flow_uuid}/roles",
      "summary": "List roles assigned to a registration flow.",
      "surface": management,
      "details": {
        "overview": "Returns the roles assigned to a registration flow with pagination. These are the roles every user who registers through the flow receives automatically.",
        "notes": [
          "Requires the registration-flow:read permission.",
          "Supports the standard page and limit query parameters."
        ],
        "parameters": [
          {
            "name": "registration_flow_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the registration flow."
          },
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
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The paginated role list for the flow.",
            "example": {
              "success": true,
              "data": {
                "rows": [roleRowExample],
                "total": 1,
                "page": 1,
                "limit": 20,
                "total_pages": 1
              },
              "message": "Roles retrieved successfully"
            }
          },
          tenantMissingResponse,
          invalidFlowUuidResponse,
          forbiddenResponse,
          validationErrorResponse,
          {
            "status": "404 Not Found",
            "description": "No registration flow matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "registration flow not found or access denied"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/registration_flows/{registration_flow_uuid}/roles/{role_uuid}",
      "summary": "Remove a role from a registration flow.",
      "surface": management,
      "details": {
        "overview": "Removes a single role from a registration flow. Users who register afterwards no longer receive that role; users who already registered keep it.",
        "notes": [
          "Requires the registration-flow:update permission.",
          "The response returns the flow's updated detail projection."
        ],
        "parameters": [
          {
            "name": "registration_flow_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the registration flow."
          },
          {
            "name": "role_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the role to remove."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The role was removed. The data is the flow's updated detail projection.",
            "example": {
              "success": true,
              "data": flowDetailExample,
              "message": "Role removed successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          invalidFlowUuidResponse,
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
            "description": "The flow or the role assignment does not exist in the tenant.",
            "example": {
              "success": false,
              "error": "registration flow not found or access denied"
            }
          },
          internalErrorResponse
        ]
      }
    }
  ]
};

export default group;
