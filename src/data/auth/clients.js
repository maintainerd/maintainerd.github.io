// Endpoint details for this Auth API section.

const publicIdentity = "Public identity API";
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

const noAuthHeader = {
  "name": "Authorization",
  "value": "Not required",
  "required": false,
  "description": "Public client-discovery endpoints are unauthenticated. Context is resolved from the query string only."
};

const publicReadHeaders = [jsonAcceptHeader, noAuthHeader];
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
      "Name": "Name is required"
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

const notFoundResponse = {
  "status": "404 Not Found",
  "description": "The client or child record does not exist in the caller's tenant.",
  "example": {
    "success": false,
    "error": "auth client not found"
  }
};

const invalidClientUuidResponse = {
  "status": "400 Bad Request",
  "description": "The client_uuid path value is not a valid UUID.",
  "example": {
    "success": false,
    "error": "Invalid auth client UUID"
  }
};

const clientResponseExample = {
  "client_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "identifier": "app-web-client",
  "name": "app-web",
  "display_name": "Example Web Application",
  "client_type": "traditional",
  "domain": "app.example.com",
  "status": "active",
  "is_default": false,
  "is_system": false,
  "allow_registration": true,
  "allow_magic_link": false,
  "backchannel_logout_session_required": false,
  "dpop_required": false,
  "token_endpoint_auth_method": "client_secret_basic",
  "grant_types": ["authorization_code", "refresh_token"],
  "response_types": ["code"],
  "allowed_scopes": ["openid", "email", "profile"],
  "created_at": "2026-08-01T09:00:00Z",
  "updated_at": "2026-08-10T09:00:00Z"
};

const successMessageResponse = (message) => ({
  "status": "200 OK",
  "description": message,
  "example": {
    "success": true,
    "data": {
      "message": message
    },
    "message": message
  }
});

const group = {
  "slug": "clients",
  "label": "Applications and Clients",
  "description": "Public client discovery plus administrative OAuth client lifecycle, secrets, configuration, URIs, identity-provider connections, API audiences, permissions, and role assignments.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/client",
      "summary": "Resolve public client context.",
      "surface": publicIdentity,
      "details": {
        "overview": "Resolves the public context for an external application client from its OAuth client identifier. The hosted identity app uses this to learn which application is initiating login so it can render the right name, type, domain, and tenant context.",
        "notes": [
          "Only the OAuth client_id (identifier) is accepted; tenant_id is rejected on this route.",
          "Only active clients with a tenant are returned; inactive or tenantless clients respond as not found.",
          "The response deliberately omits secrets, grant configuration, and internal identifiers."
        ],
        "parameters": [
          {
            "name": "client_id",
            "in": "query",
            "type": "string",
            "required": true,
            "description": "OAuth 2.0 client identifier (the value applications send as client_id in protocol requests)."
          }
        ],
        "headers": publicReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The public client context was resolved.",
            "example": {
              "success": true,
              "data": {
                "client_id": "app-web-client",
                "name": "app-web",
                "display_name": "Example Web Application",
                "client_type": "traditional",
                "domain": "app.example.com",
                "tenant_id": "example"
              },
              "message": "Auth client fetched successfully"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "client_id is missing, or tenant_id was supplied on a route that rejects it.",
            "example": {
              "success": false,
              "error": "client_id is required and tenant_id is not accepted"
            }
          },
          {
            "status": "404 Not Found",
            "description": "No active client matches the identifier.",
            "example": {
              "success": false,
              "error": "auth client not found"
            }
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/client/console",
      "summary": "Resolve console client context.",
      "surface": publicIdentity,
      "details": {
        "overview": "Resolves the seeded first-party console client (auth-console) for a tenant identifier. The hosted console uses this to obtain its own OAuth client context when booting its login flow.",
        "notes": [
          "Only tenant_id is accepted; client_id is rejected on this route.",
          "The returned client is the tenant's seeded system console client; it never exposes secrets.",
          "An inactive or missing system client responds as not found."
        ],
        "parameters": [
          {
            "name": "tenant_id",
            "in": "query",
            "type": "string",
            "required": true,
            "description": "Tenant identifier whose console client should be resolved."
          }
        ],
        "headers": publicReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The console client context was resolved.",
            "example": {
              "success": true,
              "data": {
                "client_id": "console-example",
                "name": "auth-console",
                "display_name": "Auth Console",
                "client_type": "spa",
                "domain": "console.auth.example.com",
                "tenant_id": "example"
              },
              "message": "Console client fetched successfully"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "tenant_id is missing, or client_id was supplied on a route that rejects it.",
            "example": {
              "success": false,
              "error": "tenant_id is required and client_id is not accepted"
            }
          },
          {
            "status": "404 Not Found",
            "description": "No active console client exists for the tenant.",
            "example": {
              "success": false,
              "error": "console client not found"
            }
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/clients/",
      "summary": "List OAuth clients.",
      "surface": management,
      "details": {
        "overview": "Lists the tenant's OAuth clients with pagination, filtering, and sorting. Use it to render the console's applications list and to audit which clients exist in the tenant.",
        "notes": [
          "Requires the client:read permission.",
          "Results are scoped to the authenticated caller's tenant.",
          "Filter values for client_type and status are comma-separated lists.",
          "Sorting is allowlisted by the service; unknown sort fields are ignored or rejected rather than interpolated."
        ],
        "parameters": [
          {
            "name": "name",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Filter by client name."
          },
          {
            "name": "display_name",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Filter by display name."
          },
          {
            "name": "client_type",
            "in": "query",
            "type": "string (comma-separated)",
            "required": false,
            "description": "Filter by client type: traditional, spa, mobile, m2m."
          },
          {
            "name": "identity_provider_id",
            "in": "query",
            "type": "string (UUID)",
            "required": false,
            "description": "Filter by a connected identity provider UUID."
          },
          {
            "name": "status",
            "in": "query",
            "type": "string (comma-separated)",
            "required": false,
            "description": "Filter by status: active, inactive."
          },
          {
            "name": "is_default",
            "in": "query",
            "type": "boolean",
            "required": false,
            "description": "Filter by whether the client is the tenant default."
          },
          {
            "name": "is_system",
            "in": "query",
            "type": "boolean",
            "required": false,
            "description": "Filter by whether the client is a system client."
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
            "description": "The paginated client list.",
            "example": {
              "success": true,
              "data": {
                "rows": [clientResponseExample],
                "total": 12,
                "page": 1,
                "limit": 20,
                "total_pages": 1
              },
              "message": "Auth clients fetched successfully"
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
      "path": "/clients/{client_uuid}",
      "summary": "Read one OAuth client.",
      "surface": management,
      "details": {
        "overview": "Returns one OAuth client by its management UUID, including the OAuth metadata the runtime enforces, optional URI records, the legacy single identity-provider projection, connections, and permissions when present.",
        "notes": [
          "Requires the client:read permission.",
          "The client_id field in the response is the management UUID (console URL handle), while identifier is the OAuth 2.0 client_id applications use.",
          "Secrets are never returned; the only way to obtain a secret after creation is rotation.",
          "Clients in another tenant respond as not found."
        ],
        "parameters": [
          {
            "name": "client_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "Management UUID of the client."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The client was retrieved.",
            "example": {
              "success": true,
              "data": clientResponseExample,
              "message": "Auth client fetched successfully"
            }
          },
          tenantMissingResponse,
          invalidClientUuidResponse,
          forbiddenResponse,
          notFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/clients/{client_uuid}/rotate-secret",
      "summary": "Rotate a confidential client secret.",
      "surface": management,
      "details": {
        "overview": "Generates a new client secret and returns the plaintext exactly once. The previous secret can remain valid for a bounded grace period so services can be restarted with the new value before the old one stops working.",
        "notes": [
          "Requires the client:secret:rotate permission and step-up authentication.",
          "grace_period_hours is capped at 168 (7 days); 0 revokes the previous secret immediately.",
          "When the body is omitted or invalid JSON, the service defaults to a 24-hour grace period.",
          "The plaintext secret is shown exactly once in the response and can never be retrieved again.",
          "There is deliberately no GET secret endpoint: secrets are stored hashed and cannot be read back."
        ],
        "parameters": [
          {
            "name": "client_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "Management UUID of the client."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Secret rotation payload. Optional: omitting the body applies the 24-hour default.",
          "fields": [
            {
              "name": "grace_period_hours",
              "type": "integer",
              "required": false,
              "description": "Hours the previous secret stays valid. 0 to 168 (7 days). Defaults to 24 when the body is absent."
            }
          ],
          "example": {
            "grace_period_hours": 24
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The secret was rotated. previous_secret_expires_at is present when a grace period was applied.",
            "example": {
              "success": true,
              "data": {
                "client_id": "app-web-client",
                "client_secret": "newsecret_9d1d5b4d3a",
                "previous_secret_expires_at": "2026-08-16T09:00:00Z"
              },
              "message": "Client secret rotated successfully. Store the new secret now — it will not be shown again."
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          invalidClientUuidResponse,
          forbiddenResponse,
          stepUpResponse,
          validationErrorResponse,
          notFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/clients/{client_uuid}/config",
      "summary": "Read generated client configuration.",
      "surface": management,
      "details": {
        "overview": "Returns the client's effective config blob: the free-form config overlaid with the authoritative runtime columns. This is what the runtime actually enforces, so the console never shows stale values that would be silently reverted on save.",
        "notes": [
          "Requires the client:config:read permission.",
          "Mirrored keys (grant_types, token_endpoint_auth_method, TTLs, security overrides, jwks, jwks_uri, claim mappers, and others) are reported from the columns, which are authoritative.",
          "A column that is NULL or empty is reported as an absent key, which expresses inherit-the-tenant-default.",
          "Keys with no backing column (for example cors_enabled or custom metadata) pass through untouched."
        ],
        "parameters": [
          {
            "name": "client_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "Management UUID of the client."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The effective client configuration object.",
            "example": {
              "success": true,
              "data": {
                "grant_types": ["authorization_code", "refresh_token"],
                "response_types": ["code"],
                "allowed_scopes": ["openid", "email", "profile"],
                "token_endpoint_auth_method": "client_secret_basic",
                "require_consent": true,
                "require_pkce": true,
                "refresh_token_rotation": true,
                "custom": {
                  "owner_team": "platform"
                }
              },
              "message": "Auth client config fetched successfully"
            }
          },
          tenantMissingResponse,
          invalidClientUuidResponse,
          forbiddenResponse,
          notFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/clients/",
      "summary": "Create an OAuth client.",
      "surface": management,
      "details": {
        "overview": "Creates an OAuth client for the caller's tenant. The service generates the OAuth client identifier and, for confidential clients, a plaintext secret that is returned exactly once. The OAuth metadata inside the config blob is mirrored into runtime columns and validated as a coherent matrix.",
        "notes": [
          "Requires the client:create permission.",
          "client_type must be traditional, spa, mobile, or m2m.",
          "The config blob is capped at 16KB and its advanced keys (jwks, jwks_uri, mtls_bound_cert_thumbprint, scope_claim_mappings, claim_mappers) are validated before anything is written.",
          "The OAuth matrix is enforced: auth method none is only valid for public clients (spa, mobile); secret methods require a secret; private_key_jwt requires jwks or jwks_uri; client_credentials requires client authentication and a non-empty allowed_scopes; mTLS methods are rejected as unimplemented.",
          "service_id binds the client to a service (m2m only), which makes the client that service's credential for service-to-service authorization.",
          "allow_registration defaults to true and allow_magic_link to false when omitted.",
          "The returned client secret is shown exactly once."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Client creation payload.",
          "fields": [
            {
              "name": "name",
              "type": "string",
              "required": true,
              "description": "Machine name. Between 3 and 50 characters."
            },
            {
              "name": "display_name",
              "type": "string",
              "required": true,
              "description": "Human-readable name. Between 8 and 200 characters."
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
              "description": "Application domain. Between 3 and 253 characters; a hostname or https URL. It becomes the token issuer."
            },
            {
              "name": "config",
              "type": "object",
              "required": true,
              "description": "Free-form configuration object, up to 16KB. Advanced keys are mirrored into runtime columns and validated."
            },
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "One of active or inactive."
            },
            {
              "name": "identity_provider_id",
              "type": "string (UUID)",
              "required": false,
              "description": "Legacy single identity-provider binding. Prefer the connections endpoints."
            },
            {
              "name": "branding_id",
              "type": "string (UUID)",
              "required": false,
              "description": "Branding record UUID for the client's hosted login theme."
            },
            {
              "name": "allow_registration",
              "type": "boolean",
              "required": false,
              "description": "Whether self-registration is enabled for this client. Defaults to true."
            },
            {
              "name": "allow_magic_link",
              "type": "boolean",
              "required": false,
              "description": "Whether magic-link login is enabled for this client. Defaults to false."
            },
            {
              "name": "service_id",
              "type": "string (UUID)",
              "required": false,
              "description": "Binds the client to a service so it acts as that service's credential. Only m2m clients may be bound."
            },
            {
              "name": "backchannel_logout_uri",
              "type": "string (URL)",
              "required": false,
              "description": "Back-channel logout notification URI. At most 2048 characters."
            },
            {
              "name": "frontchannel_logout_uri",
              "type": "string (URL)",
              "required": false,
              "description": "Front-channel logout URI. At most 2048 characters."
            },
            {
              "name": "backchannel_logout_session_required",
              "type": "boolean",
              "required": false,
              "description": "Whether a session is required for back-channel logout."
            },
            {
              "name": "dpop_required",
              "type": "boolean",
              "required": false,
              "description": "Whether tokens issued to this client must be DPoP sender-constrained."
            }
          ],
          "example": {
            "name": "app-web",
            "display_name": "Example Web Application",
            "client_type": "traditional",
            "domain": "app.example.com",
            "config": {
              "grant_types": ["authorization_code", "refresh_token"],
              "response_types": ["code"],
              "token_endpoint_auth_method": "client_secret_basic",
              "allowed_scopes": ["openid", "email", "profile"],
              "require_pkce": true
            },
            "status": "active",
            "allow_registration": false,
            "allow_magic_link": true
          }
        },
        "responses": [
          {
            "status": "201 Created",
            "description": "The client was created. The credentials block carries the OAuth client_id and the one-time plaintext secret.",
            "example": {
              "success": true,
              "data": {
                "client": {
                  "client_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                  "identifier": "app-web-client",
                  "name": "app-web",
                  "display_name": "Example Web Application",
                  "client_type": "traditional",
                  "domain": "app.example.com",
                  "status": "active",
                  "grant_types": ["authorization_code", "refresh_token"],
                  "response_types": ["code"],
                  "allowed_scopes": ["openid", "email", "profile"],
                  "created_at": "2026-08-15T09:00:00Z",
                  "updated_at": "2026-08-15T09:00:00Z"
                },
                "credentials": {
                  "client_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                  "oauth_client_id": "app-web-client",
                  "client_secret": "secret_9d1d5b4d3a"
                }
              },
              "message": "Auth client created successfully. Store the client_secret now — it will not be shown again."
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "404 Not Found",
            "description": "A referenced record, such as the branding record, does not exist in the tenant.",
            "example": {
              "success": false,
              "error": "branding not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/clients/{client_uuid}",
      "summary": "Update an OAuth client.",
      "surface": management,
      "details": {
        "overview": "Replaces an OAuth client's configuration. Because the update replaces the whole client, the caller may include expected_updated_at as an optimistic-concurrency token to prevent two operators from silently overwriting each other.",
        "notes": [
          "Requires the client:update permission and step-up authentication.",
          "The body is the full client shape (create fields minus identity_provider_id, plus expected_updated_at and allow_magic_link).",
          "service_id with an empty string unbinds the client from its service; omitting the field leaves the binding unchanged.",
          "The OAuth matrix rules from creation apply again on update.",
          "expected_updated_at, when present, must match the stored updated_at or the update is rejected as a conflict."
        ],
        "parameters": [
          {
            "name": "client_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "Management UUID of the client."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Client update payload (full replacement).",
          "fields": [
            {
              "name": "name",
              "type": "string",
              "required": true,
              "description": "Machine name. Between 3 and 50 characters."
            },
            {
              "name": "display_name",
              "type": "string",
              "required": true,
              "description": "Human-readable name. Between 8 and 200 characters."
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
              "description": "Application domain. Between 3 and 253 characters; a hostname or https URL."
            },
            {
              "name": "config",
              "type": "object",
              "required": true,
              "description": "Free-form configuration object, up to 16KB."
            },
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "One of active or inactive."
            },
            {
              "name": "branding_id",
              "type": "string (UUID)",
              "required": false,
              "description": "Branding record UUID for the client's hosted login theme."
            },
            {
              "name": "allow_registration",
              "type": "boolean",
              "required": false,
              "description": "Whether self-registration is enabled for this client."
            },
            {
              "name": "allow_magic_link",
              "type": "boolean",
              "required": false,
              "description": "Whether magic-link login is enabled for this client."
            },
            {
              "name": "service_id",
              "type": "string (UUID)",
              "required": false,
              "description": "Binds the client to a service (m2m only). An empty string unbinds; omitting the field leaves the binding unchanged."
            },
            {
              "name": "backchannel_logout_uri",
              "type": "string (URL)",
              "required": false,
              "description": "Back-channel logout notification URI. At most 2048 characters."
            },
            {
              "name": "frontchannel_logout_uri",
              "type": "string (URL)",
              "required": false,
              "description": "Front-channel logout URI. At most 2048 characters."
            },
            {
              "name": "backchannel_logout_session_required",
              "type": "boolean",
              "required": false,
              "description": "Whether a session is required for back-channel logout."
            },
            {
              "name": "dpop_required",
              "type": "boolean",
              "required": false,
              "description": "Whether tokens issued to this client must be DPoP sender-constrained."
            },
            {
              "name": "expected_updated_at",
              "type": "string (RFC 3339)",
              "required": false,
              "description": "Optimistic-concurrency token: the updated_at value the caller loaded. Mismatches are rejected as a conflict."
            }
          ],
          "example": {
            "name": "app-web",
            "display_name": "Example Web Application",
            "client_type": "traditional",
            "domain": "app.example.com",
            "config": {
              "grant_types": ["authorization_code", "refresh_token"],
              "response_types": ["code"],
              "token_endpoint_auth_method": "client_secret_basic",
              "allowed_scopes": ["openid", "email", "profile"],
              "require_pkce": true
            },
            "status": "active",
            "expected_updated_at": "2026-08-10T09:00:00Z"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The client was updated.",
            "example": {
              "success": true,
              "data": clientResponseExample,
              "message": "Auth client updated successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          invalidClientUuidResponse,
          forbiddenResponse,
          stepUpResponse,
          validationErrorResponse,
          invalidBodyResponse,
          notFoundResponse,
          {
            "status": "409 Conflict",
            "description": "expected_updated_at did not match the stored updated_at, or a uniqueness constraint was violated.",
            "example": {
              "success": false,
              "error": "client was modified by another operation"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/clients/{client_uuid}/status",
      "summary": "Change client status.",
      "surface": management,
      "details": {
        "overview": "Sets a client's status to the explicitly requested value. The body names the target status so a stale or double-clicked toggle can never land on the opposite of what the operator picked.",
        "notes": [
          "Requires the client:update permission and step-up authentication.",
          "Status must be active or inactive; the server does not blind-toggle.",
          "Inactive clients stop working at the authorization and token endpoints."
        ],
        "parameters": [
          {
            "name": "client_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "Management UUID of the client."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Client status payload.",
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
            "description": "The client status was updated.",
            "example": {
              "success": true,
              "data": {
                "client_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "status": "inactive",
                "updated_at": "2026-08-15T10:00:00Z"
              },
              "message": "Auth client status updated successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          invalidClientUuidResponse,
          forbiddenResponse,
          stepUpResponse,
          validationErrorResponse,
          invalidBodyResponse,
          notFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/clients/{client_uuid}",
      "summary": "Delete an OAuth client.",
      "surface": management,
      "details": {
        "overview": "Deletes an OAuth client from the tenant and returns the deleted record. Deleting a client revokes its applications' ability to obtain tokens immediately.",
        "notes": [
          "Requires the client:delete permission and step-up authentication.",
          "System clients and the tenant default client are protected by the service layer.",
          "The operation is audited with the acting user recorded."
        ],
        "parameters": [
          {
            "name": "client_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "Management UUID of the client."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The client was deleted. The response carries the deleted record.",
            "example": {
              "success": true,
              "data": clientResponseExample,
              "message": "Auth client deleted successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The client_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid Auth Client UUID"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          notFoundResponse,
          {
            "status": "409 Conflict",
            "description": "The client cannot be deleted, for example because it is the tenant default or a protected system client.",
            "example": {
              "success": false,
              "error": "cannot delete the tenant default client"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/clients/{client_uuid}/uris",
      "summary": "List redirect, logout, and origin URI records.",
      "surface": management,
      "details": {
        "overview": "Returns all URI records attached to a client: redirect URIs, origin URIs, logout URIs, login URIs, and CORS origin URIs. These records drive redirect validation, CORS allowlisting, and logout return URLs.",
        "notes": [
          "Requires the client:uri:read permission.",
          "The client_uuid must exist and belong to the caller's tenant; the URIs are returned as part of the client lookup."
        ],
        "parameters": [
          {
            "name": "client_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "Management UUID of the client."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The client's URI records.",
            "example": {
              "success": true,
              "data": {
                "uris": [
                  {
                    "uri_id": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
                    "uri": "https://app.example.com/auth/callback",
                    "type": "redirect_uri",
                    "created_at": "2026-08-01T09:00:00Z",
                    "updated_at": "2026-08-01T09:00:00Z"
                  }
                ]
              },
              "message": "URIs retrieved successfully"
            }
          },
          tenantMissingResponse,
          invalidClientUuidResponse,
          forbiddenResponse,
          notFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/clients/{client_uuid}/uris",
      "summary": "Create a client URI record.",
      "surface": management,
      "details": {
        "overview": "Attaches a URI record to a client. The URI type determines how the runtime uses it: redirect_uri for authorization callbacks, origin_uri and cors_origin_uri for browser origins, logout_uri for post-logout returns, and login_uri for the client's login start page.",
        "notes": [
          "Requires the client:uri:create permission and step-up authentication.",
          "The service validates the URI against the type's safety rules before persisting.",
          "Duplicate handling and scheme allowlists are enforced by the service."
        ],
        "parameters": [
          {
            "name": "client_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "Management UUID of the client."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Client URI creation payload.",
          "fields": [
            {
              "name": "uri",
              "type": "string",
              "required": true,
              "description": "The URI value. Between 5 and 200 characters."
            },
            {
              "name": "type",
              "type": "string",
              "required": true,
              "description": "One of redirect_uri, origin_uri, logout_uri, login_uri, cors_origin_uri."
            }
          ],
          "example": {
            "uri": "https://app.example.com/auth/callback",
            "type": "redirect_uri"
          }
        },
        "responses": [
          {
            "status": "201 Created",
            "description": "The URI record was created.",
            "example": {
              "success": true,
              "data": {
                "uri_id": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
                "uri": "https://app.example.com/auth/callback",
                "type": "redirect_uri",
                "created_at": "2026-08-15T09:00:00Z",
                "updated_at": "2026-08-15T09:00:00Z"
              },
              "message": "URI created successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          invalidClientUuidResponse,
          forbiddenResponse,
          stepUpResponse,
          validationErrorResponse,
          invalidBodyResponse,
          notFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/clients/{client_uuid}/uris/{client_uri_uuid}",
      "summary": "Update a client URI record.",
      "surface": management,
      "details": {
        "overview": "Updates an existing URI record's value and type. Changing a redirect URI immediately affects which callbacks the authorization endpoint accepts.",
        "notes": [
          "Requires the client:uri:update permission and step-up authentication.",
          "The same URI and type validation rules as creation apply."
        ],
        "parameters": [
          {
            "name": "client_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "Management UUID of the client."
          },
          {
            "name": "client_uri_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the URI record to update."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Client URI update payload.",
          "fields": [
            {
              "name": "uri",
              "type": "string",
              "required": true,
              "description": "The URI value. Between 5 and 200 characters."
            },
            {
              "name": "type",
              "type": "string",
              "required": true,
              "description": "One of redirect_uri, origin_uri, logout_uri, login_uri, cors_origin_uri."
            }
          ],
          "example": {
            "uri": "https://app.example.com/auth/callback",
            "type": "redirect_uri"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The URI record was updated.",
            "example": {
              "success": true,
              "data": {
                "uri_id": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
                "uri": "https://app.example.com/auth/callback",
                "type": "redirect_uri",
                "created_at": "2026-08-01T09:00:00Z",
                "updated_at": "2026-08-15T09:30:00Z"
              },
              "message": "URI updated successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          invalidClientUuidResponse,
          {
            "status": "400 Bad Request",
            "description": "The client_uri_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid auth client URI UUID"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          validationErrorResponse,
          invalidBodyResponse,
          notFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/clients/{client_uuid}/uris/{client_uri_uuid}",
      "summary": "Delete a client URI record.",
      "surface": management,
      "details": {
        "overview": "Removes a URI record from a client. The authorization endpoint stops accepting the removed redirect URI immediately.",
        "notes": [
          "Requires the client:uri:delete permission and step-up authentication.",
          "The response returns the parent client with its remaining URI records."
        ],
        "parameters": [
          {
            "name": "client_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "Management UUID of the client."
          },
          {
            "name": "client_uri_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the URI record to delete."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The URI record was deleted. The data is the updated client record.",
            "example": {
              "success": true,
              "data": clientResponseExample,
              "message": "URI deleted successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          invalidClientUuidResponse,
          {
            "status": "400 Bad Request",
            "description": "The client_uri_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid auth client URI UUID"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          notFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/clients/{client_uuid}/identity_providers",
      "summary": "List identity-provider connections for a client.",
      "surface": management,
      "details": {
        "overview": "Returns the identity providers connected to a client, with their enabled state, default flag, and display order. These connections determine which login buttons appear for the client and which providers its users can authenticate against.",
        "notes": [
          "Requires the client:identity_provider:read permission.",
          "The built-in system provider wins the default resolution regardless of ordering.",
          "Identities belong to a provider rather than to a client; every identity path resolves through the client's default enabled connection."
        ],
        "parameters": [
          {
            "name": "client_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "Management UUID of the client."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The client's identity-provider connections.",
            "example": {
              "success": true,
              "data": {
                "connections": [
                  {
                    "client_identity_provider_id": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
                    "identity_provider": {
                      "identity_provider_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                      "name": "google",
                      "display_name": "Google",
                      "provider": "google",
                      "provider_type": "oauth2",
                      "identifier": "google",
                      "status": "active",
                      "is_default": false,
                      "is_system": false,
                      "created_at": "2026-08-01T09:00:00Z",
                      "updated_at": "2026-08-01T09:00:00Z"
                    },
                    "is_default": true,
                    "enabled": true,
                    "display_order": 1,
                    "created_at": "2026-08-01T09:00:00Z",
                    "updated_at": "2026-08-01T09:00:00Z"
                  }
                ]
              },
              "message": "Identity provider connections retrieved successfully"
            }
          },
          tenantMissingResponse,
          invalidClientUuidResponse,
          forbiddenResponse,
          notFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/clients/{client_uuid}/identity_providers",
      "summary": "Connect an identity provider to a client.",
      "surface": management,
      "details": {
        "overview": "Connects an identity provider to a client so its users can sign in through it. The connection carries the default flag, enabled state, and display order used by the hosted login page.",
        "notes": [
          "Requires the client:identity_provider:create permission and step-up authentication.",
          "enabled defaults to true when omitted.",
          "display_order must be zero or greater.",
          "The response returns the full updated client record."
        ],
        "parameters": [
          {
            "name": "client_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "Management UUID of the client."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Identity-provider connection payload.",
          "fields": [
            {
              "name": "identity_provider_id",
              "type": "string (UUID)",
              "required": true,
              "description": "UUID of the identity provider to connect."
            },
            {
              "name": "is_default",
              "type": "boolean",
              "required": false,
              "description": "Whether this provider is the client's default connection."
            },
            {
              "name": "enabled",
              "type": "boolean",
              "required": false,
              "description": "Whether the connection is enabled. Defaults to true."
            },
            {
              "name": "display_order",
              "type": "integer",
              "required": false,
              "description": "Display position on the login page. Zero or greater."
            }
          ],
          "example": {
            "identity_provider_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "is_default": true,
            "enabled": true,
            "display_order": 1
          }
        },
        "responses": [
          {
            "status": "201 Created",
            "description": "The provider was connected. The data is the updated client record including its connections.",
            "example": {
              "success": true,
              "data": clientResponseExample,
              "message": "Identity provider connected successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          invalidClientUuidResponse,
          {
            "status": "400 Bad Request",
            "description": "The identity_provider_id is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid identity provider UUID"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          validationErrorResponse,
          invalidBodyResponse,
          notFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/clients/{client_uuid}/identity_providers/{client_identity_provider_uuid}",
      "summary": "Update a client identity-provider connection.",
      "surface": management,
      "details": {
        "overview": "Updates a connection's default flag, enabled state, and display order. Every field carries omitted-means-unchanged semantics, so partial payloads (for example toggling only enabled) never silently reset the other fields.",
        "notes": [
          "Requires the client:identity_provider:update permission and step-up authentication.",
          "Send a field only when you intend to change it; a field omitted from the body is left at its stored value.",
          "The response returns the full updated client record."
        ],
        "parameters": [
          {
            "name": "client_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "Management UUID of the client."
          },
          {
            "name": "client_identity_provider_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the connection to update."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Partial connection update. Omitted fields remain unchanged.",
          "fields": [
            {
              "name": "is_default",
              "type": "boolean",
              "required": false,
              "description": "Whether this provider is the client's default connection."
            },
            {
              "name": "enabled",
              "type": "boolean",
              "required": false,
              "description": "Whether the connection is enabled."
            },
            {
              "name": "display_order",
              "type": "integer",
              "required": false,
              "description": "Display position on the login page. Zero or greater."
            }
          ],
          "example": {
            "enabled": false
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The connection was updated. The data is the updated client record.",
            "example": {
              "success": true,
              "data": clientResponseExample,
              "message": "Identity provider connection updated successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          invalidClientUuidResponse,
          {
            "status": "400 Bad Request",
            "description": "The client_identity_provider_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid identity provider connection UUID"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          validationErrorResponse,
          invalidBodyResponse,
          notFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/clients/{client_uuid}/identity_providers/{client_identity_provider_uuid}",
      "summary": "Remove a client identity-provider connection.",
      "surface": management,
      "details": {
        "overview": "Detaches an identity provider from a client. The provider's login button disappears from the client's login page and new identities can no longer be created through it for this client.",
        "notes": [
          "Requires the client:identity_provider:delete permission and step-up authentication.",
          "Removing a connection does not delete identities that were already created through the provider.",
          "The response returns the full updated client record."
        ],
        "parameters": [
          {
            "name": "client_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "Management UUID of the client."
          },
          {
            "name": "client_identity_provider_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the connection to remove."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The connection was removed. The data is the updated client record.",
            "example": {
              "success": true,
              "data": clientResponseExample,
              "message": "Identity provider connection removed successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          invalidClientUuidResponse,
          {
            "status": "400 Bad Request",
            "description": "The client_identity_provider_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid identity provider connection UUID"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          notFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/clients/{client_uuid}/apis",
      "summary": "List APIs assigned to a client.",
      "surface": management,
      "details": {
        "overview": "Returns the resource APIs assigned to a client together with the permissions granted for each. API assignments define which audiences the client's access tokens may address and which permissions it receives at those APIs.",
        "notes": [
          "Requires the client:api:read permission.",
          "Each entry includes the API metadata and the permissions currently granted to the client for that API."
        ],
        "parameters": [
          {
            "name": "client_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "Management UUID of the client."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The client's API assignments with their permissions.",
            "example": {
              "success": true,
              "data": {
                "apis": [
                  {
                    "client_api_id": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
                    "api": {
                      "api_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                      "name": "billing",
                      "display_name": "Billing API",
                      "description": "Billing and invoicing endpoints",
                      "identifier": "billing-api",
                      "status": "active",
                      "is_system": false,
                      "created_at": "2026-08-01T09:00:00Z",
                      "updated_at": "2026-08-01T09:00:00Z"
                    },
                    "permissions": [
                      {
                        "permission_id": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
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
              },
              "message": "Auth client APIs retrieved successfully"
            }
          },
          tenantMissingResponse,
          invalidClientUuidResponse,
          forbiddenResponse,
          notFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/clients/{client_uuid}/apis",
      "summary": "Assign APIs to a client.",
      "surface": management,
      "details": {
        "overview": "Assigns one or more resource APIs to a client. After assignment, the client may request tokens addressed to those API audiences and receive the permissions configured for them.",
        "notes": [
          "Requires the client:api:create permission and step-up authentication.",
          "api_ids must be a non-empty list of valid UUIDs.",
          "The tenant and the acting user are both trust boundaries on this grant mutation."
        ],
        "parameters": [
          {
            "name": "client_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "Management UUID of the client."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "API assignment payload.",
          "fields": [
            {
              "name": "api_ids",
              "type": "array of UUID strings",
              "required": true,
              "description": "Non-empty list of resource API UUIDs to assign."
            }
          ],
          "example": {
            "api_ids": ["f47ac10b-58cc-4372-a567-0e02b2c3d479"]
          }
        },
        "responses": [
          successMessageResponse("APIs added to auth client successfully"),
          tenantMissingResponse,
          userMissingResponse,
          invalidClientUuidResponse,
          forbiddenResponse,
          stepUpResponse,
          validationErrorResponse,
          invalidBodyResponse,
          notFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/clients/{client_uuid}/apis/{api_uuid}",
      "summary": "Remove an API assignment from a client.",
      "surface": management,
      "details": {
        "overview": "Removes an API assignment from a client. Tokens already issued are unaffected, but the client can no longer request tokens addressed to the removed API audience.",
        "notes": [
          "Requires the client:api:delete permission and step-up authentication.",
          "Removing the API also removes the client's permissions under that API."
        ],
        "parameters": [
          {
            "name": "client_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "Management UUID of the client."
          },
          {
            "name": "api_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the assigned API to remove."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          successMessageResponse("API removed from auth client successfully"),
          tenantMissingResponse,
          userMissingResponse,
          invalidClientUuidResponse,
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
          notFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/clients/{client_uuid}/apis/{api_uuid}/permissions",
      "summary": "List API permissions assigned to a client.",
      "surface": management,
      "details": {
        "overview": "Returns the permissions a client holds under a specific assigned API. These permissions are what the resource server checks when the client's access token is presented at that API.",
        "notes": [
          "Requires the client:api:permission:read permission.",
          "The API must already be assigned to the client."
        ],
        "parameters": [
          {
            "name": "client_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "Management UUID of the client."
          },
          {
            "name": "api_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the assigned API."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The client's permissions for the API.",
            "example": {
              "success": true,
              "data": {
                "permissions": [
                  {
                    "permission_id": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                    "name": "invoices:read",
                    "description": "Read invoices",
                    "status": "active",
                    "is_system": false,
                    "created_at": "2026-08-01T09:00:00Z",
                    "updated_at": "2026-08-01T09:00:00Z"
                  }
                ]
              },
              "message": "Auth client API permissions retrieved successfully"
            }
          },
          tenantMissingResponse,
          invalidClientUuidResponse,
          {
            "status": "400 Bad Request",
            "description": "The api_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid API UUID"
            }
          },
          forbiddenResponse,
          notFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/clients/{client_uuid}/apis/{api_uuid}/permissions",
      "summary": "Assign API permissions to a client.",
      "surface": management,
      "details": {
        "overview": "Grants one or more permissions under an assigned API to the client. The permissions are resolved into the client's access tokens for that API audience.",
        "notes": [
          "Requires the client:api:permission:create permission and step-up authentication.",
          "permission_ids must be a non-empty list of valid UUIDs belonging to the API.",
          "The tenant and the acting user are both trust boundaries on this grant mutation."
        ],
        "parameters": [
          {
            "name": "client_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "Management UUID of the client."
          },
          {
            "name": "api_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the assigned API."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Permission assignment payload.",
          "fields": [
            {
              "name": "permission_ids",
              "type": "array of UUID strings",
              "required": true,
              "description": "Non-empty list of permission UUIDs to grant under the API."
            }
          ],
          "example": {
            "permission_ids": ["e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d"]
          }
        },
        "responses": [
          successMessageResponse("Permissions added to auth client API successfully"),
          tenantMissingResponse,
          userMissingResponse,
          invalidClientUuidResponse,
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
          notFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/clients/{client_uuid}/apis/{api_uuid}/permissions/{permission_uuid}",
      "summary": "Remove an API permission from a client.",
      "surface": management,
      "details": {
        "overview": "Revokes a single permission under an assigned API from the client. Future tokens issued for that API audience no longer carry the removed permission.",
        "notes": [
          "Requires the client:api:permission:delete permission and step-up authentication.",
          "The tenant and the acting user are both trust boundaries on this grant mutation."
        ],
        "parameters": [
          {
            "name": "client_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "Management UUID of the client."
          },
          {
            "name": "api_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the assigned API."
          },
          {
            "name": "permission_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the permission to revoke."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          successMessageResponse("Permission removed from auth client API successfully"),
          tenantMissingResponse,
          userMissingResponse,
          invalidClientUuidResponse,
          {
            "status": "400 Bad Request",
            "description": "The api_uuid or permission_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid permission UUID"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          notFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/clients/{client_uuid}/roles",
      "summary": "List roles assigned to a client.",
      "surface": management,
      "details": {
        "overview": "Returns the roles assigned to a client. Client roles contribute to what the client is authorized to do, resolved through the policy bundle and authorizer.",
        "notes": [
          "Requires the client:role:read permission.",
          "Each row carries the role's name and description so the console does not need a second lookup per row."
        ],
        "parameters": [
          {
            "name": "client_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "Management UUID of the client."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The roles assigned to the client.",
            "example": {
              "success": true,
              "data": [
                {
                  "client_role_id": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
                  "role_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                  "name": "billing-service",
                  "description": "Billing service role",
                  "created_at": "2026-08-01T09:00:00Z"
                }
              ],
              "message": "Client roles retrieved successfully"
            }
          },
          tenantMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The client_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid client UUID"
            }
          },
          forbiddenResponse,
          notFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/clients/{client_uuid}/roles",
      "summary": "Assign a role to a client.",
      "surface": management,
      "details": {
        "overview": "Assigns a role to a client. A role grant decides what the client may do, so it is attributable: the acting user is recorded on the grant.",
        "notes": [
          "Requires the client:role:create permission and step-up authentication.",
          "role_id must be a valid UUID of a role in the caller's tenant.",
          "The acting user becomes the grant's created_by stamp."
        ],
        "parameters": [
          {
            "name": "client_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "Management UUID of the client."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Role assignment payload.",
          "fields": [
            {
              "name": "role_id",
              "type": "string (UUID)",
              "required": true,
              "description": "UUID of the role to assign."
            }
          ],
          "example": {
            "role_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          }
        },
        "responses": [
          {
            "status": "201 Created",
            "description": "The role was assigned to the client.",
            "example": {
              "success": true,
              "data": {
                "client_role_id": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
                "role_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "created_at": "2026-08-15T09:00:00Z"
              },
              "message": "Role assigned to client successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The client_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid client UUID"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          validationErrorResponse,
          invalidBodyResponse,
          notFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/clients/{client_uuid}/roles/{role_uuid}",
      "summary": "Remove a role from a client.",
      "surface": management,
      "details": {
        "overview": "Revokes a role assignment from a client. The client stops receiving the authorizations carried by that role.",
        "notes": [
          "Requires the client:role:delete permission and step-up authentication.",
          "The acting user is recorded on the audit trail."
        ],
        "parameters": [
          {
            "name": "client_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "Management UUID of the client."
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
            "description": "The role was removed from the client.",
            "example": {
              "success": true,
              "data": null,
              "message": "Role removed from client successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The client_uuid or role_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid role UUID"
            }
          },
          forbiddenResponse,
          stepUpResponse,
          notFoundResponse,
          internalErrorResponse
        ]
      }
    }
  ]
};

export default group;
