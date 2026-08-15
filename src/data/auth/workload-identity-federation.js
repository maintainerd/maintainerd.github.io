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
  "description": "The JSON body failed validation.",
  "example": {
    "success": false,
    "error": "Validation failed",
    "details": {
      "issuer_url": "issuer_url must be a valid https URL"
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

const invalidWifUuidResponse = {
  "status": "400 Bad Request",
  "description": "The workload_identity_federation_uuid path value is not a valid UUID.",
  "example": {
    "success": false,
    "error": "Invalid workload identity federation UUID"
  }
};

const wifExample = {
  "workload_identity_federation_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "client_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
  "name": "github-actions-ci",
  "description": "Trusts GitHub Actions OIDC tokens for the CI pipeline",
  "issuer_url": "https://token.actions.githubusercontent.com",
  "audience": "maintainerd-auth-ci",
  "subject_claim": "sub",
  "subject_pattern": "repo:my-org/my-repo:*",
  "allowed_scopes": ["service:read"],
  "attribute_mapping": {
    "repository": "repo"
  },
  "is_active": true,
  "created_at": "2026-08-01T09:00:00Z",
  "updated_at": "2026-08-10T09:00:00Z"
};

const createUpdateFields = [
  {
    "name": "name",
    "type": "string",
    "required": true,
    "description": "Federation name. 1-100 characters, unique per tenant."
  },
  {
    "name": "description",
    "type": "string",
    "required": false,
    "description": "Description. At most 2000 characters."
  },
  {
    "name": "issuer_url",
    "type": "string (URL)",
    "required": true,
    "description": "The upstream OIDC issuer. Must be a valid https URL and a reachable OIDC issuer. Trusting this server's own issuer is rejected."
  },
  {
    "name": "audience",
    "type": "string",
    "required": true,
    "description": "Expected audience of the upstream token. 1-512 characters."
  },
  {
    "name": "subject_claim",
    "type": "string",
    "required": false,
    "description": "Claim carrying the workload subject. At most 100 characters. Defaults to sub."
  },
  {
    "name": "subject_pattern",
    "type": "string",
    "required": true,
    "description": "Wildcard pattern the subject must match. 1-512 characters. Must be anchored on a whole organisation or namespace segment; a leading wildcard is rejected."
  },
  {
    "name": "allowed_scopes",
    "type": "array of strings",
    "required": false,
    "description": "Scopes the exchanged token may request. Each at most 128 characters."
  },
  {
    "name": "attribute_mapping",
    "type": "object",
    "required": false,
    "description": "Upstream-claim to internal-claim map (at most 16 entries). Destination claims must be lowercase letters, digits, and underscores, and cannot override reserved claims."
  },
  {
    "name": "is_active",
    "type": "boolean",
    "required": false,
    "description": "Whether the trust rule is live."
  }
];

const group = {
  "slug": "workload-identity-federation",
  "label": "Workload Identity Federation",
  "description": "Configuration APIs for trusted workload identity federation providers used by services and automation.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/workload-identity-federations/",
      "summary": "List workload identity federation providers.",
      "surface": management,
      "details": {
        "overview": "Lists the tenant's workload identity federation trust rules with pagination and filtering. Each rule lets an external workload exchange an upstream OIDC token (for example from GitHub Actions or AWS) for a tenant-scoped access token without storing long-lived credentials.",
        "notes": [
          "Requires the workload-identity-federation:read permission.",
          "name performs a case-insensitive substring match.",
          "is_active accepts active, inactive, true, or false."
        ],
        "parameters": [
          {
            "name": "name",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Case-insensitive substring match on the federation name."
          },
          {
            "name": "is_active",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Filter by active state: active, inactive, true, or false."
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
            "description": "Sort field. Unknown fields fall back to created_at descending."
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
            "description": "The paginated workload identity federation list.",
            "example": {
              "success": true,
              "data": {
                "rows": [wifExample],
                "total": 2,
                "page": 1,
                "limit": 20,
                "total_pages": 1
              },
              "message": "Workload identity federations retrieved successfully"
            }
          },
          tenantMissingResponse,
          forbiddenResponse,
          validationErrorResponse,
          {
            "status": "500 Internal Server Error",
            "description": "An unexpected service or persistence error occurred.",
            "example": {
              "success": false,
              "error": "Failed to get workload identity federations"
            }
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/workload-identity-federations/{workload_identity_federation_uuid}",
      "summary": "Read one workload identity federation provider.",
      "surface": management,
      "details": {
        "overview": "Returns one workload identity federation trust rule by UUID, scoped to the caller's tenant.",
        "notes": [
          "Requires the workload-identity-federation:read permission.",
          "Federations in another tenant respond as not found."
        ],
        "parameters": [
          {
            "name": "workload_identity_federation_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the workload identity federation."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The workload identity federation.",
            "example": {
              "success": true,
              "data": wifExample,
              "message": "Workload identity federation retrieved successfully"
            }
          },
          tenantMissingResponse,
          invalidWifUuidResponse,
          forbiddenResponse,
          {
            "status": "404 Not Found",
            "description": "No workload identity federation matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "workload identity federation not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/workload-identity-federations/",
      "summary": "Create a workload identity federation provider.",
      "surface": management,
      "details": {
        "overview": "Creates a workload identity federation trust rule. The issuer is probed over OIDC discovery before the rule is persisted, so an unreachable issuer is rejected up front.",
        "notes": [
          "Requires the workload-identity-federation:create permission.",
          "The mapped client must exist in the tenant and be active.",
          "issuer_url must be a reachable OIDC issuer over https; trusting this server's own issuer is rejected to prevent token-refresh loops.",
          "subject_pattern is the trust boundary: it must be anchored on a whole organisation or namespace segment. A leading or partial-segment wildcard is rejected.",
          "attribute_mapping destinations cannot override reserved claims like sub, client_id, or svc.",
          "The create, update, and delete operations are audited."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Workload identity federation creation payload.",
          "fields": [
            {
              "name": "client_uuid",
              "type": "string (UUID)",
              "required": true,
              "description": "UUID of the mapped OAuth client. Immutable after creation."
            },
            ...createUpdateFields
          ],
          "example": {
            "client_uuid": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "name": "github-actions-ci",
            "description": "Trusts GitHub Actions OIDC tokens for the CI pipeline",
            "issuer_url": "https://token.actions.githubusercontent.com",
            "audience": "maintainerd-auth-ci",
            "subject_claim": "sub",
            "subject_pattern": "repo:my-org/my-repo:*",
            "allowed_scopes": ["service:read"],
            "attribute_mapping": {
              "repository": "repo"
            },
            "is_active": true
          }
        },
        "responses": [
          {
            "status": "201 Created",
            "description": "The workload identity federation was created.",
            "example": {
              "success": true,
              "data": wifExample,
              "message": "Workload identity federation created successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "400 Bad Request",
            "description": "The issuer is not a reachable OIDC issuer, or the mapped client is not active.",
            "example": {
              "success": false,
              "error": "issuer_url is not a reachable OIDC issuer"
            }
          },
          {
            "status": "404 Not Found",
            "description": "The mapped client does not exist in the tenant.",
            "example": {
              "success": false,
              "error": "client not found"
            }
          },
          {
            "status": "409 Conflict",
            "description": "A federation with the same name already exists in the tenant.",
            "example": {
              "success": false,
              "error": "a workload identity federation with this name already exists"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/workload-identity-federations/{workload_identity_federation_uuid}",
      "summary": "Update a workload identity federation provider.",
      "surface": management,
      "details": {
        "overview": "Updates a workload identity federation trust rule. The mapped client cannot be changed. When the issuer URL changes, it is re-probed over OIDC discovery before the update persists.",
        "notes": [
          "Requires the workload-identity-federation:update permission.",
          "All trust-boundary fields are re-validated with the same rules as creation.",
          "The update is audited."
        ],
        "parameters": [
          {
            "name": "workload_identity_federation_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the workload identity federation."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Workload identity federation update payload.",
          "fields": createUpdateFields,
          "example": {
            "name": "github-actions-ci",
            "description": "Trusts GitHub Actions OIDC tokens for the CI pipeline (updated)",
            "issuer_url": "https://token.actions.githubusercontent.com",
            "audience": "maintainerd-auth-ci",
            "subject_claim": "sub",
            "subject_pattern": "repo:my-org/my-repo:*",
            "allowed_scopes": ["service:read"],
            "attribute_mapping": {
              "repository": "repo"
            },
            "is_active": false
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The workload identity federation was updated.",
            "example": {
              "success": true,
              "data": wifExample,
              "message": "Workload identity federation updated successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          invalidWifUuidResponse,
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "400 Bad Request",
            "description": "The new issuer is not a reachable OIDC issuer.",
            "example": {
              "success": false,
              "error": "issuer_url is not a reachable OIDC issuer"
            }
          },
          {
            "status": "404 Not Found",
            "description": "No workload identity federation matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "workload identity federation not found"
            }
          },
          {
            "status": "409 Conflict",
            "description": "The new name collides with another federation in the tenant.",
            "example": {
              "success": false,
              "error": "a workload identity federation with this name already exists"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/workload-identity-federations/{workload_identity_federation_uuid}",
      "summary": "Delete a workload identity federation provider.",
      "surface": management,
      "details": {
        "overview": "Soft-deletes a workload identity federation trust rule. Deleting instantly revokes the affected workload's ability to exchange upstream tokens for tenant access tokens.",
        "notes": [
          "Requires the workload-identity-federation:delete permission.",
          "The delete is audited."
        ],
        "parameters": [
          {
            "name": "workload_identity_federation_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the workload identity federation."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The federation was deleted. The response carries the deleted record.",
            "example": {
              "success": true,
              "data": wifExample,
              "message": "Workload identity federation deleted successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          invalidWifUuidResponse,
          forbiddenResponse,
          {
            "status": "404 Not Found",
            "description": "No workload identity federation matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "workload identity federation not found"
            }
          },
          internalErrorResponse
        ]
      }
    }
  ]
};

export default group;
