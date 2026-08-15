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
  "description": "Tenant settings endpoints require an authenticated management token or session for the current tenant."
};

const readHeaders = [jsonAcceptHeader, bearerAuthHeader];
const writeHeaders = [jsonContentHeader, jsonAcceptHeader, bearerAuthHeader];

const emptyBody = {
  "type": "None",
  "description": "This endpoint does not accept a request body.",
  "fields": [],
  "example": null
};

const rateLimitConfig = {
  "enabled": false,
  "requests_per_window": 100,
  "window_duration_seconds": 60,
  "per_ip": true,
  "exempt_ips": [],
  "endpoint_overrides": {}
};

const auditConfig = {
  "enabled": true,
  "retention_days": 90,
  "pii_masking": true,
  "log_level": "info",
  "event_types": []
};

const maintenanceConfig = {
  "enabled": false,
  "message": "The system is currently undergoing maintenance. Please try again later.",
  "scheduled_start": null,
  "scheduled_end": null
};

const unauthorizedResponse = {
  "success": false,
  "error": "Tenant not found in context"
};

const forbiddenResponse = {
  "success": false,
  "error": "Forbidden"
};

const emptyConfigError = {
  "success": false,
  "error": "Validation failed",
  "details": "Config cannot be empty"
};

const serviceFailureResponse = (message) => ({
  "success": false,
  "error": message
});

const readNotes = (permission, configName) => [
  `Requires the ${permission} permission.`,
  "The setting is resolved from the authenticated tenant context, not from a tenant UUID path parameter.",
  `If the tenant setting row does not exist yet, the service creates the default ${configName} config before returning it.`,
  "The response body is the config object itself inside the shared success envelope. It does not include internal tenant or tenant-setting database IDs."
];

const writeNotes = (permission, configName) => [
  `Requires the ${permission} permission.`,
  "The setting is resolved from the authenticated tenant context, not from a tenant UUID path parameter.",
  "The request body must contain at least one allowed field. Unknown fields are rejected.",
  `Updates merge the submitted keys into the stored ${configName} config. Omitted keys keep their previous values.`,
  "The returned data is the full config after the merge."
];

const rateLimitFields = [
  {
    "name": "enabled",
    "type": "boolean",
    "required": false,
    "description": "Turns tenant request rate limiting on or off. The default is false."
  },
  {
    "name": "requests_per_window",
    "type": "integer",
    "required": false,
    "description": "Maximum requests allowed in each window. Must be between 1 and 100000. Default is 100."
  },
  {
    "name": "window_duration_seconds",
    "type": "integer",
    "required": false,
    "description": "Length of the rate-limit window in seconds. Must be between 1 and 3600. Default is 60."
  },
  {
    "name": "per_ip",
    "type": "boolean",
    "required": false,
    "description": "When true, the limiter tracks each client IP separately for each path. When false, the limiter tracks by tenant and path."
  },
  {
    "name": "exempt_ips",
    "type": "string[]",
    "required": false,
    "description": "Client IP addresses that bypass tenant request rate limiting. Values must be non-empty strings."
  },
  {
    "name": "endpoint_overrides",
    "type": "object",
    "required": false,
    "description": "Path-specific request limits. Keys are endpoint paths such as /api/v1/oauth/token, and values are positive integers."
  }
];

const auditFields = [
  {
    "name": "enabled",
    "type": "boolean",
    "required": false,
    "description": "Turns auth-event persistence for the tenant on or off. Default is true."
  },
  {
    "name": "retention_days",
    "type": "integer",
    "required": false,
    "description": "How long auth events are retained before cleanup. Must be between 1 and 3650 days. Default is 90."
  },
  {
    "name": "pii_masking",
    "type": "boolean",
    "required": false,
    "description": "When true, auth-event storage masks personally identifiable values where the event pipeline supports masking. Default is true."
  },
  {
    "name": "log_level",
    "type": "string",
    "required": false,
    "description": "Minimum severity to persist. Allowed values are debug, info, warn, and critical. Default is info."
  },
  {
    "name": "event_types",
    "type": "string[]",
    "required": false,
    "description": "Optional allow-list of auth event types to persist. Empty means all event types allowed by the severity filter."
  }
];

const maintenanceFields = [
  {
    "name": "enabled",
    "type": "boolean",
    "required": false,
    "description": "Turns maintenance enforcement on or off for the tenant. Default is false."
  },
  {
    "name": "message",
    "type": "string",
    "required": false,
    "description": "Message returned to blocked callers while maintenance mode is active. It must not be blank."
  },
  {
    "name": "scheduled_start",
    "type": "string | null",
    "required": false,
    "description": "Optional RFC3339 timestamp for when maintenance begins. Null means maintenance can begin immediately when enabled is true."
  },
  {
    "name": "scheduled_end",
    "type": "string | null",
    "required": false,
    "description": "Optional RFC3339 timestamp for when maintenance ends. When both timestamps are present, scheduled_start must be before scheduled_end."
  }
];

const group = {
  "slug": "tenant-settings",
  "label": "Tenant Settings",
  "description": "Per-tenant runtime controls for rate limiting, audit behavior, and maintenance windows.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/tenant-settings/rate-limit",
      "summary": "Read tenant rate-limit configuration.",
      "surface": management,
      "details": {
        "overview": "Returns the authenticated tenant's request rate-limit policy. The runtime middleware uses this config to throttle authenticated tenant traffic by tenant, path, and optionally client IP.",
        "notes": [
          ...readNotes("tenant-setting:read", "rate-limit"),
          "The middleware caches tenant rate-limit config briefly, so changes may take a few seconds to affect traffic.",
          "If Redis is unavailable, the tenant request limiter allows ordinary authenticated traffic through rather than causing a tenant-wide outage."
        ],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "Rate-limit config was returned.",
            "example": {
              "success": true,
              "data": rateLimitConfig,
              "message": "Rate limit config retrieved successfully"
            }
          },
          {
            "status": "401 Unauthorized",
            "description": "The request is authenticated incorrectly or no tenant context was resolved for the session.",
            "example": unauthorizedResponse
          },
          {
            "status": "403 Forbidden",
            "description": "The caller is authenticated but does not have tenant-setting:read.",
            "example": forbiddenResponse
          },
          {
            "status": "500 Internal Server Error",
            "description": "The service could not read or create tenant settings.",
            "example": serviceFailureResponse("Failed to get rate limit config")
          }
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/tenant-settings/rate-limit",
      "summary": "Update tenant rate-limit configuration.",
      "surface": management,
      "details": {
        "overview": "Updates the authenticated tenant's request rate-limit policy. Use it from a tenant settings UI when operators need to enable rate limiting, adjust request budgets, exempt trusted IPs, or set stricter limits for specific endpoints.",
        "notes": [
          ...writeNotes("tenant-setting:update", "rate-limit"),
          "Allowed fields are enabled, requests_per_window, window_duration_seconds, per_ip, exempt_ips, and endpoint_overrides.",
          "Endpoint override keys must be non-empty endpoint paths, and override values must be positive integers.",
          "When rate limiting is enabled but the stored request budget is missing or invalid, the middleware falls back to 100 requests per window."
        ],
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Partial rate-limit config. Submitted fields are merged into the stored config.",
          "fields": rateLimitFields,
          "example": {
            "enabled": true,
            "requests_per_window": 300,
            "window_duration_seconds": 60,
            "per_ip": true,
            "exempt_ips": ["203.0.113.10"],
            "endpoint_overrides": {
              "/api/v1/oauth/token": 60,
              "/api/v1/users/": 120
            }
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "Rate-limit config was updated and the merged config was returned.",
            "example": {
              "success": true,
              "data": {
                "enabled": true,
                "requests_per_window": 300,
                "window_duration_seconds": 60,
                "per_ip": true,
                "exempt_ips": ["203.0.113.10"],
                "endpoint_overrides": {
                  "/api/v1/oauth/token": 60,
                  "/api/v1/users/": 120
                }
              },
              "message": "Rate limit config updated successfully"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "The body is empty, invalid JSON, includes an unknown field, or fails rate-limit validation.",
            "example": {
              "success": false,
              "error": "Validation failed",
              "details": "window_duration_seconds must be between 1 and 3600"
            }
          },
          {
            "status": "401 Unauthorized",
            "description": "The request is authenticated incorrectly or no tenant context was resolved for the session.",
            "example": unauthorizedResponse
          },
          {
            "status": "403 Forbidden",
            "description": "The caller is authenticated but does not have tenant-setting:update.",
            "example": forbiddenResponse
          },
          {
            "status": "500 Internal Server Error",
            "description": "The service could not update tenant settings.",
            "example": serviceFailureResponse("Failed to update rate limit config")
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/tenant-settings/audit",
      "summary": "Read tenant audit logging configuration.",
      "surface": management,
      "details": {
        "overview": "Returns the authenticated tenant's auth-event audit policy. The auth-event pipeline uses this config to decide whether to persist events, which severities and event types are allowed, whether PII masking is enabled, and how long retained events remain available.",
        "notes": [
          ...readNotes("tenant-setting:read", "audit"),
          "The auth-event service caches audit config briefly, so changes may take a few seconds to affect newly emitted events.",
          "An empty event_types list means the tenant does not filter by event type."
        ],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "Audit config was returned.",
            "example": {
              "success": true,
              "data": auditConfig,
              "message": "Audit config retrieved successfully"
            }
          },
          {
            "status": "401 Unauthorized",
            "description": "The request is authenticated incorrectly or no tenant context was resolved for the session.",
            "example": unauthorizedResponse
          },
          {
            "status": "403 Forbidden",
            "description": "The caller is authenticated but does not have tenant-setting:read.",
            "example": forbiddenResponse
          },
          {
            "status": "500 Internal Server Error",
            "description": "The service could not read or create tenant settings.",
            "example": serviceFailureResponse("Failed to get audit config")
          }
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/tenant-settings/audit",
      "summary": "Update tenant audit logging configuration.",
      "surface": management,
      "details": {
        "overview": "Updates the authenticated tenant's auth-event audit policy. Use it to turn audit-event persistence on or off, tune retention, choose the minimum severity, mask PII, or limit stored events to selected event types.",
        "notes": [
          ...writeNotes("tenant-setting:update", "audit"),
          "Allowed fields are enabled, retention_days, pii_masking, log_level, and event_types.",
          "Allowed log levels are debug, info, warn, and critical.",
          "Retention must be between 1 and 3650 days."
        ],
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Partial audit config. Submitted fields are merged into the stored config.",
          "fields": auditFields,
          "example": {
            "enabled": true,
            "retention_days": 180,
            "pii_masking": true,
            "log_level": "warn",
            "event_types": ["authn_login_success", "authn_login_failed", "sys_maintenance_config_updated"]
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "Audit config was updated and the merged config was returned.",
            "example": {
              "success": true,
              "data": {
                "enabled": true,
                "retention_days": 180,
                "pii_masking": true,
                "log_level": "warn",
                "event_types": ["authn_login_success", "authn_login_failed", "sys_maintenance_config_updated"]
              },
              "message": "Audit config updated successfully"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "The body is empty, invalid JSON, includes an unknown field, or fails audit-config validation.",
            "example": {
              "success": false,
              "error": "Validation failed",
              "details": "log_level must be one of: debug, info, warn, critical"
            }
          },
          {
            "status": "401 Unauthorized",
            "description": "The request is authenticated incorrectly or no tenant context was resolved for the session.",
            "example": unauthorizedResponse
          },
          {
            "status": "403 Forbidden",
            "description": "The caller is authenticated but does not have tenant-setting:update.",
            "example": forbiddenResponse
          },
          {
            "status": "500 Internal Server Error",
            "description": "The service could not update tenant settings.",
            "example": serviceFailureResponse("Failed to update audit config")
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/tenant-settings/maintenance",
      "summary": "Read tenant maintenance window configuration.",
      "surface": management,
      "details": {
        "overview": "Returns the authenticated tenant's maintenance-mode policy. Runtime middleware uses this config to block tenant traffic while maintenance is active and to return the configured maintenance message.",
        "notes": [
          ...readNotes("tenant-setting:read", "maintenance"),
          "Maintenance config is cached briefly by middleware, so changes may take a few seconds to affect traffic.",
          "Health and readiness endpoints are excluded from maintenance blocking.",
          "End-user identity login and registration paths can be blocked for a tenant in maintenance, while console/admin login remains reachable so operators can turn maintenance off."
        ],
        "headers": readHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "Maintenance config was returned.",
            "example": {
              "success": true,
              "data": maintenanceConfig,
              "message": "Maintenance config retrieved successfully"
            }
          },
          {
            "status": "401 Unauthorized",
            "description": "The request is authenticated incorrectly or no tenant context was resolved for the session.",
            "example": unauthorizedResponse
          },
          {
            "status": "403 Forbidden",
            "description": "The caller is authenticated but does not have tenant-setting:read.",
            "example": forbiddenResponse
          },
          {
            "status": "500 Internal Server Error",
            "description": "The service could not read or create tenant settings.",
            "example": serviceFailureResponse("Failed to get maintenance config")
          }
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/tenant-settings/maintenance",
      "summary": "Update tenant maintenance window configuration.",
      "surface": management,
      "details": {
        "overview": "Updates the authenticated tenant's maintenance-mode policy. Use it to schedule or immediately enable a maintenance window, set the message shown to blocked callers, or clear a scheduled window.",
        "notes": [
          ...writeNotes("tenant-setting:update", "maintenance"),
          "Allowed fields are enabled, message, scheduled_start, and scheduled_end.",
          "scheduled_start and scheduled_end must be RFC3339 timestamps or null.",
          "When both scheduled_start and scheduled_end are present, scheduled_start must be before scheduled_end.",
          "Updating maintenance config emits a system auth event with type sys_maintenance_config_updated."
        ],
        "headers": writeHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Partial maintenance config. Submitted fields are merged into the stored config.",
          "fields": maintenanceFields,
          "example": {
            "enabled": true,
            "message": "Scheduled maintenance is in progress. Please try again after the window ends.",
            "scheduled_start": "2026-08-20T02:00:00Z",
            "scheduled_end": "2026-08-20T04:00:00Z"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "Maintenance config was updated and the merged config was returned.",
            "example": {
              "success": true,
              "data": {
                "enabled": true,
                "message": "Scheduled maintenance is in progress. Please try again after the window ends.",
                "scheduled_start": "2026-08-20T02:00:00Z",
                "scheduled_end": "2026-08-20T04:00:00Z"
              },
              "message": "Maintenance config updated successfully"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "The body is empty, invalid JSON, includes an unknown field, or fails maintenance-config validation.",
            "example": {
              "success": false,
              "error": "Validation failed",
              "details": "scheduled_start must be before scheduled_end"
            }
          },
          {
            "status": "401 Unauthorized",
            "description": "The request is authenticated incorrectly or no tenant context was resolved for the session.",
            "example": unauthorizedResponse
          },
          {
            "status": "403 Forbidden",
            "description": "The caller is authenticated but does not have tenant-setting:update.",
            "example": forbiddenResponse
          },
          {
            "status": "500 Internal Server Error",
            "description": "The service could not update tenant settings.",
            "example": serviceFailureResponse("Failed to update maintenance config")
          }
        ]
      }
    }
  ]
};

export default group;
