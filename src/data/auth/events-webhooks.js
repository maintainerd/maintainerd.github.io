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
      "url": "URL is required"
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

const invalidEndpointUuidResponse = {
  "status": "400 Bad Request",
  "description": "The webhook_endpoint_uuid path value is not a valid UUID.",
  "example": {
    "success": false,
    "error": "Invalid webhook endpoint UUID"
  }
};

const endpointNotFoundResponse = {
  "status": "404 Not Found",
  "description": "No webhook endpoint matches the UUID in the caller's tenant.",
  "example": {
    "success": false,
    "error": "webhook endpoint not found"
  }
};

const endpointExample = {
  "webhook_endpoint_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "url": "https://api.example.com/webhooks/auth",
  "subscribe_all": false,
  "max_retries": 3,
  "timeout_seconds": 30,
  "status": "active",
  "description": "Primary delivery endpoint",
  "last_triggered_at": "2026-08-14T09:00:00Z",
  "created_at": "2026-08-01T09:00:00Z",
  "updated_at": "2026-08-10T09:00:00Z"
};

const urlField = {
  "name": "url",
  "type": "string (URL)",
  "required": true,
  "description": "Delivery URL. Must be valid https, and must not resolve to a private, loopback, link-local, or otherwise disallowed address."
};

const subscribeAllField = {
  "name": "subscribe_all",
  "type": "boolean",
  "required": false,
  "description": "Deliver all event types to this endpoint, ignoring explicit subscriptions. Defaults to false."
};

const maxRetriesField = {
  "name": "max_retries",
  "type": "integer",
  "required": false,
  "description": "Retry attempts per delivery. 0-10; defaults to 3."
};

const timeoutField = {
  "name": "timeout_seconds",
  "type": "integer",
  "required": false,
  "description": "Delivery timeout. 1-120 seconds; defaults to 30."
};

const descriptionField = {
  "name": "description",
  "type": "string",
  "required": false,
  "description": "Description. At most 500 characters."
};

const statusField = {
  "name": "status",
  "type": "string",
  "required": false,
  "description": "One of active or inactive. Defaults to active."
};

const authEventExample = {
  "auth_event_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "ip_address": "203.0.113.7",
  "user_agent": "Mozilla/5.0 (X11; Linux x86_64)",
  "category": "AUTHN",
  "event_type": "authn_login_success",
  "severity": "INFO",
  "result": "success",
  "description": "User signed in",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "metadata": {
    "mfa_used": true
  },
  "created_at": "2026-08-14T09:00:00Z"
};

const auditLogExample = {
  "uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "action": "user.update",
  "resource_type": "user",
  "resource_id": "123",
  "outcome": "success",
  "ip_address": "203.0.113.7",
  "created_at": "2026-08-14T09:00:00Z",
  "actor_user_name": "Alex Rivera",
  "actor_client_name": "Auth Console",
  "changes": "{\"update\":{\"email\":\"alex@example.com\"}}",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736"
};

const authEventFilters = [
  {
    "name": "category",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Exact category: AUTHN, AUTHZ, SESSION, USER, or SYSTEM."
  },
  {
    "name": "event_type",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Prefix match on the event type (e.g. authn_login matches authn_login_success and authn_login_fail). At most 60 characters."
  },
  {
    "name": "severity",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Exact severity: INFO, WARN, or CRITICAL."
  },
  {
    "name": "result",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Exact result: success or failure."
  },
  {
    "name": "date_from",
    "in": "query",
    "type": "string (RFC 3339)",
    "required": false,
    "description": "Inclusive lower bound on created_at."
  },
  {
    "name": "date_to",
    "in": "query",
    "type": "string (RFC 3339)",
    "required": false,
    "description": "Inclusive upper bound on created_at."
  },
  {
    "name": "user",
    "in": "query",
    "type": "string (UUID)",
    "required": false,
    "description": "Events where the user acted or was the target."
  },
  {
    "name": "ip_address",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Prefix match on the event IP address."
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
];

const group = {
  "slug": "events-webhooks",
  "label": "Events and Webhooks",
  "description": "Webhook receiver configuration, subscriptions, delivery history, replay, auth event history, event type configuration, event routes, and management audit logs.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/webhook-endpoints/",
      "summary": "List webhook endpoints.",
      "surface": management,
      "details": {
        "overview": "Lists the tenant's webhook endpoints with pagination and filtering. The signing secret is never returned in list responses.",
        "notes": [
          "Requires the webhook-endpoint:read permission.",
          "status accepts a comma-separated list; the system-managed quarantined state appears in responses but cannot be set through the API.",
          "url performs a case-insensitive substring match.",
          "A maximum of 50 endpoints per tenant is enforced at creation."
        ],
        "parameters": [
          {
            "name": "status",
            "in": "query",
            "type": "string (comma-separated)",
            "required": false,
            "description": "Filter by status: active, inactive."
          },
          {
            "name": "url",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Case-insensitive substring match on the URL."
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
            "description": "The paginated webhook endpoint list.",
            "example": {
              "success": true,
              "data": {
                "rows": [endpointExample],
                "total": 2,
                "page": 1,
                "limit": 20,
                "total_pages": 1
              },
              "message": "Webhook endpoints retrieved successfully"
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
              "error": "Failed to get webhook endpoints"
            }
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/webhook-endpoints/{webhook_endpoint_uuid}",
      "summary": "Read one webhook endpoint.",
      "surface": management,
      "details": {
        "overview": "Returns one webhook endpoint by UUID. The signing secret is never returned: it is shown exactly once at creation.",
        "notes": [
          "Requires the webhook-endpoint:read permission.",
          "Endpoints in another tenant respond as not found."
        ],
        "parameters": [
          {
            "name": "webhook_endpoint_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the webhook endpoint."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The webhook endpoint.",
            "example": {
              "success": true,
              "data": endpointExample,
              "message": "Webhook endpoint retrieved successfully"
            }
          },
          tenantMissingResponse,
          invalidEndpointUuidResponse,
          forbiddenResponse,
          endpointNotFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/webhook-endpoints/",
      "summary": "Create a webhook endpoint.",
      "surface": management,
      "details": {
        "overview": "Creates a webhook endpoint. The signing secret is generated server-side and returned exactly once in the 201 response. The URL is validated against SSRF rules: https only, and it must not resolve to loopback, private, link-local, or otherwise disallowed addresses.",
        "notes": [
          "Requires the webhook-endpoint:create permission.",
          "At most 50 endpoints per tenant.",
          "Outbound deliveries are signed with X-Maintainerd-Signature-256: an HMAC-SHA256 over timestamp + body using the signing secret.",
          "subscribe_all=true delivers every event type regardless of subscriptions.",
          "max_retries defaults to 3 and timeout_seconds to 30."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Webhook endpoint creation payload.",
          "fields": [urlField, subscribeAllField, maxRetriesField, timeoutField, descriptionField, statusField],
          "example": {
            "url": "https://api.example.com/webhooks/auth",
            "subscribe_all": false,
            "max_retries": 3,
            "timeout_seconds": 30,
            "description": "Primary delivery endpoint",
            "status": "active"
          }
        },
        "responses": [
          {
            "status": "201 Created",
            "description": "The endpoint was created. signing_secret appears exactly once in this response.",
            "example": {
              "success": true,
              "data": {
                ...endpointExample,
                "signing_secret": "whsec_9d1d5b4d3a7e2f1a9b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c"
              },
              "message": "Webhook endpoint created successfully"
            }
          },
          tenantMissingResponse,
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "429 Too Many Requests",
            "description": "The tenant has reached the maximum of 50 webhook endpoints.",
            "example": {
              "success": false,
              "error": "Maximum number of webhook endpoints reached for this tenant"
            }
          },
          {
            "status": "503 Service Unavailable",
            "description": "The endpoint quota could not be verified.",
            "example": {
              "success": false,
              "error": "Unable to verify webhook endpoint quota, try again later"
            }
          },
          {
            "status": "500 Internal Server Error",
            "description": "An unexpected service error occurred, or the signing secret could not be generated.",
            "example": {
              "success": false,
              "error": "Failed to create webhook endpoint"
            }
          }
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/webhook-endpoints/{webhook_endpoint_uuid}",
      "summary": "Update a webhook endpoint.",
      "surface": management,
      "details": {
        "overview": "Replaces a webhook endpoint's configuration. rotate_secret=true generates a new signing secret, but the rotated secret is never returned — it is written to a secure store and must be retrieved there.",
        "notes": [
          "Requires the webhook-endpoint:update permission.",
          "Reactivation (status change from non-active to active) resets the consecutive-failure counter.",
          "subscribe_all uses full-replacement semantics when omitted (defaults to false).",
          "max_retries and timeout_seconds keep their stored values when omitted."
        ],
        "parameters": [
          {
            "name": "webhook_endpoint_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the webhook endpoint."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Webhook endpoint update payload.",
          "fields": [
            urlField,
            {
              "name": "rotate_secret",
              "type": "boolean",
              "required": false,
              "description": "Generate a new signing secret. The new secret is never returned by the API."
            },
            subscribeAllField,
            maxRetriesField,
            timeoutField,
            descriptionField,
            statusField
          ],
          "example": {
            "url": "https://api.example.com/webhooks/auth",
            "subscribe_all": false,
            "max_retries": 5,
            "timeout_seconds": 30,
            "description": "Primary delivery endpoint (updated)",
            "status": "active"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The webhook endpoint was updated.",
            "example": {
              "success": true,
              "data": endpointExample,
              "message": "Webhook endpoint updated successfully"
            }
          },
          tenantMissingResponse,
          invalidEndpointUuidResponse,
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          endpointNotFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/webhook-endpoints/{webhook_endpoint_uuid}",
      "summary": "Delete a webhook endpoint.",
      "surface": management,
      "details": {
        "overview": "Soft-deletes a webhook endpoint. The endpoint stops receiving deliveries immediately.",
        "notes": [
          "Requires the webhook-endpoint:delete permission.",
          "Endpoints in another tenant respond as not found."
        ],
        "parameters": [
          {
            "name": "webhook_endpoint_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the webhook endpoint."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The endpoint was deleted. The response carries the deleted record.",
            "example": {
              "success": true,
              "data": endpointExample,
              "message": "Webhook endpoint deleted successfully"
            }
          },
          tenantMissingResponse,
          invalidEndpointUuidResponse,
          forbiddenResponse,
          endpointNotFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PATCH",
      "path": "/webhook-endpoints/{webhook_endpoint_uuid}/status",
      "summary": "Change webhook endpoint status.",
      "surface": management,
      "details": {
        "overview": "Updates only a webhook endpoint's status. Setting the status back to active resets the consecutive-failure counter.",
        "notes": [
          "Requires the webhook-endpoint:update permission.",
          "quarantined is system-managed and cannot be set through this endpoint.",
          "Inactive endpoints stop receiving deliveries and are skipped by the background retrier."
        ],
        "parameters": [
          {
            "name": "webhook_endpoint_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the webhook endpoint."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Webhook endpoint status payload.",
          "fields": [
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "One of active or inactive."
            }
          ],
          "example": {
            "status": "inactive"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The endpoint status was updated.",
            "example": {
              "success": true,
              "data": endpointExample,
              "message": "Webhook endpoint status updated successfully"
            }
          },
          tenantMissingResponse,
          invalidEndpointUuidResponse,
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          endpointNotFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/webhook-endpoints/{webhook_endpoint_uuid}/subscriptions",
      "summary": "List subscriptions for a webhook endpoint.",
      "surface": management,
      "details": {
        "overview": "Returns the explicit event-type subscriptions for a webhook endpoint. Subscriptions matter only when subscribe_all is false.",
        "notes": [
          "Requires the webhook-endpoint:read permission.",
          "The response is a plain array of { event_type_id, event_type_key } pairs; no pagination."
        ],
        "parameters": [
          {
            "name": "webhook_endpoint_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the webhook endpoint."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The endpoint's subscriptions.",
            "example": {
              "success": true,
              "data": [
                {
                  "event_type_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                  "event_type_key": "user.created"
                }
              ],
              "message": "Subscriptions retrieved successfully"
            }
          },
          tenantMissingResponse,
          invalidEndpointUuidResponse,
          forbiddenResponse,
          {
            "status": "404 Not Found",
            "description": "No webhook endpoint matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "Webhook endpoint not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/webhook-endpoints/{webhook_endpoint_uuid}/subscriptions",
      "summary": "Add subscriptions to a webhook endpoint.",
      "surface": management,
      "details": {
        "overview": "Adds one event-type subscription to a webhook endpoint. The event type must exist in the caller's tenant.",
        "notes": [
          "Requires the webhook-endpoint:update permission.",
          "The operation is additive; posting the same event type twice creates duplicate subscription rows.",
          "subscribe_all on the endpoint overrides explicit subscriptions at delivery time."
        ],
        "parameters": [
          {
            "name": "webhook_endpoint_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the webhook endpoint."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Subscription payload.",
          "fields": [
            {
              "name": "event_type_id",
              "type": "string (UUID)",
              "required": true,
              "description": "UUID of the event type to subscribe to."
            }
          ],
          "example": {
            "event_type_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          }
        },
        "responses": [
          {
            "status": "201 Created",
            "description": "The subscription was added.",
            "example": {
              "success": true,
              "data": {
                "event_type_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "event_type_key": "user.created"
              },
              "message": "Subscription added successfully"
            }
          },
          tenantMissingResponse,
          invalidEndpointUuidResponse,
          forbiddenResponse,
          invalidBodyResponse,
          {
            "status": "400 Bad Request",
            "description": "event_type_id is missing.",
            "example": {
              "success": false,
              "error": "event_type_id is required"
            }
          },
          {
            "status": "404 Not Found",
            "description": "The endpoint or the event type does not exist in the caller's tenant.",
            "example": {
              "success": false,
              "error": "Event type not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/webhook-endpoints/{webhook_endpoint_uuid}/subscriptions",
      "summary": "Remove subscriptions from a webhook endpoint.",
      "surface": management,
      "details": {
        "overview": "Removes one event-type subscription from a webhook endpoint. Idempotent: removing a subscription that does not exist still succeeds.",
        "notes": [
          "Requires the webhook-endpoint:update permission."
        ],
        "parameters": [
          {
            "name": "webhook_endpoint_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the webhook endpoint."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Subscription removal payload.",
          "fields": [
            {
              "name": "event_type_id",
              "type": "string (UUID)",
              "required": true,
              "description": "UUID of the event type to unsubscribe."
            }
          ],
          "example": {
            "event_type_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The subscription was removed.",
            "example": {
              "success": true,
              "data": null,
              "message": "Subscription removed"
            }
          },
          tenantMissingResponse,
          invalidEndpointUuidResponse,
          forbiddenResponse,
          invalidBodyResponse,
          {
            "status": "400 Bad Request",
            "description": "event_type_id is missing.",
            "example": {
              "success": false,
              "error": "event_type_id is required"
            }
          },
          {
            "status": "404 Not Found",
            "description": "The endpoint or the event type does not exist in the caller's tenant.",
            "example": {
              "success": false,
              "error": "Event type not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/webhook-endpoints/{webhook_endpoint_uuid}/deliveries",
      "summary": "List delivery history for a webhook endpoint.",
      "surface": management,
      "details": {
        "overview": "Returns the delivery history for a webhook endpoint, newest first. Each row describes the final state of one delivery attempt sequence for one event.",
        "notes": [
          "Requires the webhook-endpoint:read permission.",
          "The response is a plain array limited by the limit parameter (default 20, max 100); there is no page offset.",
          "final_status values are pending, success, or dead_letter.",
          "Replays appear with is_replay=true.",
          "Delivery history is retained for 90 days."
        ],
        "parameters": [
          {
            "name": "webhook_endpoint_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the webhook endpoint."
          },
          {
            "name": "limit",
            "in": "query",
            "type": "integer",
            "required": false,
            "description": "Number of rows to return. Defaults to 20, maximum 100."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The delivery history, newest first.",
            "example": {
              "success": true,
              "data": [
                {
                  "delivery_history_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                  "event_id": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
                  "event_type": "user.created",
                  "attempt_count": 2,
                  "final_status": "success",
                  "response_status": 200,
                  "response_summary": "HTTP 200",
                  "is_replay": false,
                  "created_at": "2026-08-14T09:00:00Z"
                }
              ],
              "message": "Delivery history retrieved successfully"
            }
          },
          tenantMissingResponse,
          invalidEndpointUuidResponse,
          forbiddenResponse,
          {
            "status": "404 Not Found",
            "description": "No webhook endpoint matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "Webhook endpoint not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/webhook-replay/",
      "summary": "Replay a webhook delivery.",
      "surface": management,
      "details": {
        "overview": "Replays a previously emitted event. With a webhook_endpoint_id the event is replayed to that one endpoint; without it, the event is replayed to every active endpoint in the tenant. Each replay creates a new delivery-history row flagged is_replay=true.",
        "notes": [
          "Requires the webhook-endpoint:update permission.",
          "The original event is loaded from the outbox; an unknown or cross-tenant event fails the replay.",
          "Per-endpoint failures during a broadcast replay are skipped; replayed counts only successes.",
          "The replay runs through the normal delivery path, including signature headers and retries."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Replay payload.",
          "fields": [
            {
              "name": "event_id",
              "type": "string (UUID)",
              "required": true,
              "description": "UUID of the original event to replay."
            },
            {
              "name": "webhook_endpoint_id",
              "type": "string (UUID)",
              "required": false,
              "description": "Target endpoint. Omitted or empty replays to all active endpoints of the tenant."
            }
          ],
          "example": {
            "event_id": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The replay was initiated for a single endpoint.",
            "example": {
              "success": true,
              "data": null,
              "message": "Replay initiated"
            }
          },
          {
            "status": "200 OK",
            "description": "The broadcast replay completed. replayed counts successful deliveries; total is the number of active endpoints.",
            "example": {
              "success": true,
              "data": {
                "replayed": 2,
                "total": 3,
                "event_id": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d"
              },
              "message": "Replay completed"
            }
          },
          tenantMissingResponse,
          forbiddenResponse,
          invalidBodyResponse,
          {
            "status": "400 Bad Request",
            "description": "event_id or webhook_endpoint_id is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid event_id UUID"
            }
          },
          {
            "status": "404 Not Found",
            "description": "The target webhook endpoint does not exist in the caller's tenant.",
            "example": {
              "success": false,
              "error": "Webhook endpoint not found"
            }
          },
          {
            "status": "503 Service Unavailable",
            "description": "Webhook replay is not available in this deployment.",
            "example": {
              "success": false,
              "error": "Webhook replay is not available on this deployment"
            }
          },
          {
            "status": "500 Internal Server Error",
            "description": "The replay failed, for example because the original event no longer exists.",
            "example": {
              "success": false,
              "error": "Replay failed"
            }
          }
        ]
      }
    },

    // ──────────────────────────────────────────────────────────────────────────
    // Auth events
    // ──────────────────────────────────────────────────────────────────────────
    {
      "method": "GET",
      "path": "/auth-events/",
      "summary": "List authentication, authorization, and security events.",
      "surface": management,
      "details": {
        "overview": "Lists the tenant's auth events with filtering and pagination. Events are append-only and never expose actor or target user identifiers: only UUIDs leave the service.",
        "notes": [
          "Requires the auth_event:read permission.",
          "event_type is a prefix match here; the count endpoint uses exact match.",
          "date_from and date_to are RFC 3339; unparseable values are silently ignored.",
          "The response uses keyset pagination: page and total_pages are always 0; total is the exact tenant-scoped count.",
          "Categories are AUTHN, AUTHZ, SESSION, USER, and SYSTEM."
        ],
        "parameters": authEventFilters,
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The filtered auth events.",
            "example": {
              "success": true,
              "data": {
                "rows": [authEventExample],
                "total": 128,
                "page": 0,
                "limit": 20,
                "total_pages": 0
              },
              "message": "Auth events retrieved successfully"
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
              "error": "Failed to get auth events"
            }
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/auth-events/count",
      "summary": "Count auth events by filters.",
      "surface": management,
      "details": {
        "overview": "Returns an exact-match count of auth events for a single event type in the caller's tenant.",
        "notes": [
          "Requires the auth_event:read permission.",
          "event_type is required and matches exactly (unlike the list endpoint's prefix search)."
        ],
        "parameters": [
          {
            "name": "event_type",
            "in": "query",
            "type": "string",
            "required": true,
            "description": "Exact event type to count, e.g. authn_login_fail."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The event count.",
            "example": {
              "success": true,
              "data": {
                "count": 42
              },
              "message": "Auth event count retrieved successfully"
            }
          },
          tenantMissingResponse,
          forbiddenResponse,
          {
            "status": "400 Bad Request",
            "description": "event_type is missing from the query string.",
            "example": {
              "success": false,
              "error": "event_type query parameter is required"
            }
          },
          {
            "status": "500 Internal Server Error",
            "description": "An unexpected service or persistence error occurred.",
            "example": {
              "success": false,
              "error": "Failed to count auth events"
            }
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/auth-events/export",
      "summary": "Export auth events.",
      "surface": management,
      "details": {
        "overview": "Exports filtered auth events as a downloadable file: JSON (default) or CSV. Exports are capped at 10,000 rows and every export is itself recorded as a system audit event.",
        "notes": [
          "Requires the auth_event:read permission.",
          "format defaults to json; csv is also supported.",
          "All list filters apply; page and limit are ignored.",
          "The response is raw file bytes with a Content-Disposition attachment header, not the JSON envelope.",
          "Every successful export durably records a SYSTEM system_audit_export event."
        ],
        "parameters": [
          {
            "name": "format",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Export format: csv or json. Defaults to json."
          },
          ...authEventFilters
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The exported events as a JSON array file.",
            "example": {
              "Content-Type": "application/json",
              "Content-Disposition": "attachment; filename=\"auth-events.json\"",
              "Body": "[{\"auth_event_id\":\"...\",\"category\":\"AUTHN\",\"event_type\":\"authn_login_success\",\"result\":\"success\",\"created_at\":\"2026-08-14T09:00:00Z\"}]"
            }
          },
          {
            "status": "200 OK",
            "description": "The exported events as a CSV file.",
            "example": {
              "Content-Type": "text/csv",
              "Content-Disposition": "attachment; filename=\"auth-events.csv\"",
              "Body": "auth_event_id,ip_address,user_agent,category,event_type,severity,result,description,error_reason,trace_id,metadata,created_at"
            }
          },
          tenantMissingResponse,
          forbiddenResponse,
          validationErrorResponse,
          {
            "status": "400 Bad Request",
            "description": "An unsupported format was requested.",
            "example": {
              "success": false,
              "error": "unsupported auth event export format: xml"
            }
          },
          {
            "status": "501 Not Implemented",
            "description": "Export is not available in this deployment.",
            "example": {
              "success": false,
              "error": "Auth event export is not available"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/auth-events/{auth_event_uuid}",
      "summary": "Read one auth event.",
      "surface": management,
      "details": {
        "overview": "Returns one auth event by UUID, scoped to the caller's tenant.",
        "notes": [
          "Requires the auth_event:read permission.",
          "Events in another tenant respond as not found."
        ],
        "parameters": [
          {
            "name": "auth_event_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the auth event."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The auth event.",
            "example": {
              "success": true,
              "data": authEventExample,
              "message": "Auth event retrieved successfully"
            }
          },
          tenantMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The auth_event_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid auth event UUID"
            }
          },
          forbiddenResponse,
          {
            "status": "404 Not Found",
            "description": "No auth event matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "auth event not found"
            }
          },
          internalErrorResponse
        ]
      }
    },

    // ──────────────────────────────────────────────────────────────────────────
    // Event types and routes
    // ──────────────────────────────────────────────────────────────────────────
    {
      "method": "GET",
      "path": "/event-types/",
      "summary": "List available event types.",
      "surface": management,
      "details": {
        "overview": "Lists the tenant's integration event-type catalog: the 42 event types that webhook endpoints and event routes can subscribe to.",
        "notes": [
          "Requires the webhook-endpoint:read permission.",
          "The catalog is per-tenant and seeded at tenant creation.",
          "Categories are USER, TENANT, IAM, CLIENT, SESSION, SERVICE, and API.",
          "This endpoint lists active catalog entries regardless of the tenant enable/disable overrides."
        ],
        "parameters": [],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The event-type catalog, sorted by key.",
            "example": {
              "success": true,
              "data": [
                {
                  "uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                  "key": "user.created",
                  "category": "USER",
                  "description": "User created",
                  "version": 1,
                  "is_active": true
                }
              ],
              "message": "Event types retrieved successfully"
            }
          },
          tenantMissingResponse,
          forbiddenResponse,
          {
            "status": "500 Internal Server Error",
            "description": "An unexpected service or persistence error occurred.",
            "example": {
              "success": false,
              "error": "Failed to list event types"
            }
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/tenant-event-types/",
      "summary": "Read event types enabled for the tenant.",
      "surface": management,
      "details": {
        "overview": "Returns the tenant's event-type overrides. The model is default-on: absence of a row means enabled. Only event types explicitly touched through the PUT endpoint appear here.",
        "notes": [
          "Requires the webhook-endpoint:read permission.",
          "A tenant that never changed a toggle gets an empty array — everything is on."
        ],
        "parameters": [],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The stored tenant event-type overrides.",
            "example": {
              "success": true,
              "data": [
                {
                  "tenant_event_type_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                  "tenant_id": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
                  "event_type_id": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                  "event_type_key": "user.created",
                  "enabled": false
                }
              ],
              "message": "Tenant event types retrieved successfully"
            }
          },
          tenantMissingResponse,
          forbiddenResponse,
          {
            "status": "500 Internal Server Error",
            "description": "An unexpected service or persistence error occurred.",
            "example": {
              "success": false,
              "error": "Failed to get tenant event types"
            }
          }
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/tenant-event-types/",
      "summary": "Enable or disable a tenant event type.",
      "surface": management,
      "details": {
        "overview": "Sets the tenant-wide master switch for one event type. Disabling stops the event type from being delivered through any route or webhook; enabling restores it. The operation is an upsert.",
        "notes": [
          "Requires the webhook-endpoint:update permission.",
          "The event type must belong to the caller's tenant.",
          "Each change invalidates the tenant write-gate cache."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Tenant event-type toggle payload.",
          "fields": [
            {
              "name": "event_type_id",
              "type": "string (UUID)",
              "required": true,
              "description": "UUID of the event type to toggle."
            },
            {
              "name": "enabled",
              "type": "boolean",
              "required": true,
              "description": "false disables the event type; true enables it."
            }
          ],
          "example": {
            "event_type_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            "enabled": false
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The tenant event-type toggle was updated.",
            "example": {
              "success": true,
              "data": {
                "tenant_event_type_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "tenant_id": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
                "event_type_id": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                "event_type_key": "user.created",
                "enabled": false
              },
              "message": "Tenant event type updated successfully"
            }
          },
          tenantMissingResponse,
          forbiddenResponse,
          invalidBodyResponse,
          {
            "status": "404 Not Found",
            "description": "The event type does not exist.",
            "example": {
              "success": false,
              "error": "event type not found"
            }
          },
          {
            "status": "403 Forbidden",
            "description": "The event type belongs to another tenant.",
            "example": {
              "success": false,
              "error": "event type does not belong to your tenant"
            }
          },
          {
            "status": "500 Internal Server Error",
            "description": "An unexpected service or persistence error occurred.",
            "example": {
              "success": false,
              "error": "Failed to update tenant event type"
            }
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/event-routes/",
      "summary": "List event routes.",
      "surface": management,
      "details": {
        "overview": "Lists the tenant's event routes: RabbitMQ broker routes that publish each routed event type to the message broker.",
        "notes": [
          "Requires the webhook-endpoint:read permission.",
          "Event routes are RabbitMQ-only; the channel is fixed to rabbitmq."
        ],
        "parameters": [],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The event routes.",
            "example": {
              "success": true,
              "data": [
                {
                  "uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                  "event_type_id": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                  "event_type_key": "user.created",
                  "channel": "rabbitmq",
                  "enabled": true,
                  "created_at": "2026-08-01T09:00:00Z",
                  "updated_at": "2026-08-01T09:00:00Z"
                }
              ],
              "message": "Event routes retrieved successfully"
            }
          },
          tenantMissingResponse,
          forbiddenResponse,
          {
            "status": "500 Internal Server Error",
            "description": "An unexpected service or persistence error occurred.",
            "example": {
              "success": false,
              "error": "Failed to list event routes"
            }
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/event-routes/{event_route_uuid}",
      "summary": "Read one event route.",
      "surface": management,
      "details": {
        "overview": "Returns one event route by UUID.",
        "notes": [
          "Requires the webhook-endpoint:read permission.",
          "Routes in another tenant respond as not found."
        ],
        "parameters": [
          {
            "name": "event_route_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the event route."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The event route.",
            "example": {
              "success": true,
              "data": {
                "uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "event_type_id": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                "event_type_key": "user.created",
                "channel": "rabbitmq",
                "enabled": true,
                "created_at": "2026-08-01T09:00:00Z",
                "updated_at": "2026-08-01T09:00:00Z"
              },
              "message": "Event route retrieved successfully"
            }
          },
          tenantMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The event_route_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid event route UUID"
            }
          },
          forbiddenResponse,
          {
            "status": "404 Not Found",
            "description": "No event route matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "event route not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/event-routes/",
      "summary": "Create an event route.",
      "surface": management,
      "details": {
        "overview": "Creates a RabbitMQ event route for one event type. Routed events are published to the message broker for downstream consumers.",
        "notes": [
          "Requires the webhook-endpoint:create permission.",
          "Routes are always created enabled; the event type must be active.",
          "One route per (tenant, event type, channel) — duplicates respond as a conflict."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Event route creation payload.",
          "fields": [
            {
              "name": "event_type_id",
              "type": "string (UUID)",
              "required": true,
              "description": "UUID of the event type to route."
            },
            {
              "name": "enabled",
              "type": "boolean",
              "required": false,
              "description": "Ignored on create: routes are always created enabled."
            }
          ],
          "example": {
            "event_type_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
          }
        },
        "responses": [
          {
            "status": "201 Created",
            "description": "The event route was created.",
            "example": {
              "success": true,
              "data": {
                "uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "event_type_id": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                "event_type_key": "user.created",
                "channel": "rabbitmq",
                "enabled": true,
                "created_at": "2026-08-15T09:00:00Z",
                "updated_at": "2026-08-15T09:00:00Z"
              },
              "message": "Event route created successfully"
            }
          },
          tenantMissingResponse,
          forbiddenResponse,
          invalidBodyResponse,
          {
            "status": "400 Bad Request",
            "description": "event_type_id is missing, or the event type is inactive.",
            "example": {
              "success": false,
              "error": "event type is not active and cannot be routed"
            }
          },
          {
            "status": "404 Not Found",
            "description": "The event type does not exist.",
            "example": {
              "success": false,
              "error": "event type not found"
            }
          },
          {
            "status": "403 Forbidden",
            "description": "The event type belongs to another tenant.",
            "example": {
              "success": false,
              "error": "event type does not belong to your tenant"
            }
          },
          {
            "status": "409 Conflict",
            "description": "A route for this event type already exists.",
            "example": {
              "success": false,
              "error": "A record with these values already exists"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/event-routes/{event_route_uuid}",
      "summary": "Update an event route.",
      "surface": management,
      "details": {
        "overview": "Updates an event route's enabled state. The event_type_id field is parsed but ignored: routes cannot be re-pointed at another event type.",
        "notes": [
          "Requires the webhook-endpoint:update permission.",
          "enabled defaults to true when omitted, which silently re-enables a disabled route — send the field explicitly when intending to disable."
        ],
        "parameters": [
          {
            "name": "event_route_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the event route."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Event route update payload.",
          "fields": [
            {
              "name": "enabled",
              "type": "boolean",
              "required": false,
              "description": "Route enabled state. Defaults to true when omitted."
            },
            {
              "name": "event_type_id",
              "type": "string (UUID)",
              "required": false,
              "description": "Ignored on update."
            }
          ],
          "example": {
            "enabled": false
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The event route was updated.",
            "example": {
              "success": true,
              "data": {
                "uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "event_type_id": "e1c2a3b4-5d6e-4f0a-9c1d-7e2f1a9b4c3d",
                "event_type_key": "user.created",
                "channel": "rabbitmq",
                "enabled": false,
                "created_at": "2026-08-01T09:00:00Z",
                "updated_at": "2026-08-15T09:00:00Z"
              },
              "message": "Event route updated successfully"
            }
          },
          tenantMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The event_route_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid event route UUID"
            }
          },
          forbiddenResponse,
          invalidBodyResponse,
          {
            "status": "404 Not Found",
            "description": "No event route matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "event route not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/event-routes/{event_route_uuid}",
      "summary": "Delete an event route.",
      "surface": management,
      "details": {
        "overview": "Deletes an event route. The event type stops being published to the broker.",
        "notes": [
          "Requires the webhook-endpoint:delete permission."
        ],
        "parameters": [
          {
            "name": "event_route_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the event route."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The event route was deleted.",
            "example": {
              "success": true,
              "message": "Event route deleted successfully"
            }
          },
          tenantMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The event_route_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid event route UUID"
            }
          },
          forbiddenResponse,
          {
            "status": "404 Not Found",
            "description": "No event route matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "event route not found"
            }
          },
          internalErrorResponse
        ]
      }
    },

    // ──────────────────────────────────────────────────────────────────────────
    // Management audit log
    // ──────────────────────────────────────────────────────────────────────────
    {
      "method": "GET",
      "path": "/management-audit-log/",
      "summary": "List management audit log entries.",
      "surface": management,
      "details": {
        "overview": "Lists the tenant's management audit log: the durable record of administrative mutations (who changed what, when, from which IP, and with what outcome). Actor and client display names are resolved at read time.",
        "notes": [
          "Requires the audit:read permission.",
          "changes is a raw JSON string of the before/after payload recorded by the mutation.",
          "sort_by is allowlisted to created_at, action, resource_type, and outcome.",
          "Newest entries first by default."
        ],
        "parameters": [
          {
            "name": "resource_type",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Exact match on the resource type, e.g. user, client, role."
          },
          {
            "name": "action",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Exact match on the action, e.g. user.update."
          },
          {
            "name": "outcome",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Exact match on the outcome, e.g. success."
          },
          {
            "name": "actor_user_id",
            "in": "query",
            "type": "integer",
            "required": false,
            "description": "Filter by the acting user ID."
          },
          {
            "name": "sort_by",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "One of created_at, action, resource_type, outcome. Unknown fields fall back to created_at."
          },
          {
            "name": "sort_order",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "asc or desc. Defaults to desc (newest first)."
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
            "description": "The paginated management audit log.",
            "example": {
              "success": true,
              "data": {
                "rows": [auditLogExample],
                "total": 320,
                "page": 1,
                "limit": 20,
                "total_pages": 16
              },
              "message": "Management audit log retrieved successfully"
            }
          },
          tenantMissingResponse,
          forbiddenResponse,
          {
            "status": "500 Internal Server Error",
            "description": "An unexpected repository error occurred.",
            "example": {
              "success": false,
              "error": "Failed to retrieve audit log"
            }
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/management-audit-log/{audit_log_uuid}",
      "summary": "Read one management audit log entry.",
      "surface": management,
      "details": {
        "overview": "Returns one management audit log entry by UUID, including the recorded changes payload and resolved actor names.",
        "notes": [
          "Requires the audit:read permission.",
          "Entries in another tenant respond as not found."
        ],
        "parameters": [
          {
            "name": "audit_log_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the management audit log entry."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The management audit log entry.",
            "example": {
              "success": true,
              "data": auditLogExample,
              "message": "Management audit log entry retrieved successfully"
            }
          },
          tenantMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The audit_log_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid audit log UUID"
            }
          },
          forbiddenResponse,
          {
            "status": "404 Not Found",
            "description": "No audit log entry matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "Audit log entry not found"
            }
          },
          {
            "status": "500 Internal Server Error",
            "description": "An unexpected repository error occurred.",
            "example": {
              "success": false,
              "error": "Failed to retrieve audit log entry"
            }
          }
        ]
      }
    }
  ]
};

export default group;
