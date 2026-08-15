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
      "provider": "Provider must be smtp"
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

const emailConfigExample = {
  "email_config_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "provider": "smtp",
  "host": "smtp.example.com",
  "port": 587,
  "username": "mailer@example.com",
  "from_address": "auth@example.com",
  "from_name": "Example Auth",
  "reply_to": "support@example.com",
  "encryption": "tls",
  "logo_url": "https://cdn.example.com/logo.png",
  "test_mode": false,
  "status": "active",
  "created_at": "2026-08-01T09:00:00Z",
  "updated_at": "2026-08-10T09:00:00Z"
};

const smsConfigExample = {
  "sms_config_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "provider": "twilio",
  "account_sid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "from_number": "+15551234567",
  "sender_id": "",
  "test_mode": false,
  "daily_send_limit": 1000,
  "status": "active",
  "created_at": "2026-08-01T09:00:00Z",
  "updated_at": "2026-08-10T09:00:00Z"
};

const group = {
  "slug": "messaging",
  "label": "Messaging",
  "description": "Email and SMS delivery-provider configuration: SMTP credentials, SMS providers, delivery status, and write-only secrets.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/email-config/",
      "summary": "Read email delivery configuration.",
      "surface": management,
      "details": {
        "overview": "Returns the tenant's email delivery configuration. When no record exists yet, the service returns defaults instead of a 404. The password is never returned.",
        "notes": [
          "Requires the email-config:read permission.",
          "The SMTP password is write-only and never appears in any response.",
          "A missing record returns defaults: provider smtp, status active, zero-valued fields."
        ],
        "parameters": [],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The email delivery configuration.",
            "example": {
              "success": true,
              "data": emailConfigExample,
              "message": "Email config retrieved successfully"
            }
          },
          tenantMissingResponse,
          forbiddenResponse,
          {
            "status": "500 Internal Server Error",
            "description": "An unexpected service or persistence error occurred.",
            "example": {
              "success": false,
              "error": "Failed to get email config"
            }
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/email-config/status",
      "summary": "Read email delivery provider status.",
      "surface": management,
      "details": {
        "overview": "Returns a lightweight delivery-readiness summary: whether email is configured, and the provider and status when a record exists. The check is a stored-row heuristic, not a live connectivity probe.",
        "notes": [
          "Requires the email-config:read permission.",
          "configured means a record exists with status active, a non-empty provider, from_address, and host.",
          "A missing record returns only { \"configured\": false }."
        ],
        "parameters": [],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The email delivery status.",
            "example": {
              "success": true,
              "data": {
                "configured": true,
                "provider": "smtp",
                "status": "active"
              },
              "message": "Email config status retrieved successfully"
            }
          },
          tenantMissingResponse,
          forbiddenResponse,
          {
            "status": "500 Internal Server Error",
            "description": "An unexpected service or persistence error occurred.",
            "example": {
              "success": false,
              "error": "Failed to get email config status"
            }
          }
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/email-config/",
      "summary": "Update email delivery configuration.",
      "surface": management,
      "details": {
        "overview": "Creates or replaces the tenant's email delivery configuration. Non-secret fields are fully replaced on every write. The SMTP password is write-only: a blank value keeps the stored secret, and switching providers with a blank password clears it.",
        "notes": [
          "Requires the email-config:update permission.",
          "provider must be smtp: the former SaaS providers (ses, sendgrid, mailgun, postmark, resend) are rejected.",
          "from_address is required; host may be empty (the status endpoint then reports configured: false).",
          "encryption is one of tls, ssl, or none.",
          "Secrets are encrypted at rest and never returned."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Email delivery configuration payload.",
          "fields": [
            {
              "name": "provider",
              "type": "string",
              "required": true,
              "description": "Delivery provider. Must be smtp."
            },
            {
              "name": "host",
              "type": "string",
              "required": false,
              "description": "SMTP host. At most 255 characters."
            },
            {
              "name": "port",
              "type": "integer",
              "required": false,
              "description": "SMTP port. 1-65535; 0 means unset."
            },
            {
              "name": "username",
              "type": "string",
              "required": false,
              "description": "SMTP username. At most 255 characters."
            },
            {
              "name": "password",
              "type": "string",
              "required": false,
              "description": "SMTP password (write-only). Blank keeps the stored secret."
            },
            {
              "name": "from_address",
              "type": "string (email)",
              "required": true,
              "description": "From address. Valid email, at most 255 characters."
            },
            {
              "name": "from_name",
              "type": "string",
              "required": false,
              "description": "From display name. At most 255 characters."
            },
            {
              "name": "reply_to",
              "type": "string (email)",
              "required": false,
              "description": "Reply-to address. Valid email when present."
            },
            {
              "name": "encryption",
              "type": "string",
              "required": false,
              "description": "One of tls, ssl, or none."
            },
            {
              "name": "logo_url",
              "type": "string",
              "required": false,
              "description": "Logo URL rendered in emails."
            },
            {
              "name": "test_mode",
              "type": "boolean",
              "required": false,
              "description": "Test-mode flag. Omitted leaves the stored value unchanged."
            }
          ],
          "example": {
            "provider": "smtp",
            "host": "smtp.example.com",
            "port": 587,
            "username": "mailer@example.com",
            "password": "smtp-password",
            "from_address": "auth@example.com",
            "from_name": "Example Auth",
            "reply_to": "support@example.com",
            "encryption": "tls"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The email delivery configuration was created or replaced.",
            "example": {
              "success": true,
              "data": emailConfigExample,
              "message": "Email config updated successfully"
            }
          },
          tenantMissingResponse,
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "500 Internal Server Error",
            "description": "An unexpected service error occurred, or the secret could not be encrypted.",
            "example": {
              "success": false,
              "error": "Failed to update email config"
            }
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/sms-config/",
      "summary": "Read SMS delivery configuration.",
      "surface": management,
      "details": {
        "overview": "Returns the tenant's SMS delivery configuration. When no record exists yet, the service returns defaults instead of a 404. The auth token is never returned.",
        "notes": [
          "Requires the sms-config:read permission.",
          "The provider auth token is write-only and never appears in any response.",
          "A missing record returns defaults: daily_send_limit 1000, status active, empty provider."
        ],
        "parameters": [],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The SMS delivery configuration.",
            "example": {
              "success": true,
              "data": smsConfigExample,
              "message": "SMS config retrieved successfully"
            }
          },
          tenantMissingResponse,
          forbiddenResponse,
          {
            "status": "500 Internal Server Error",
            "description": "An unexpected service or persistence error occurred.",
            "example": {
              "success": false,
              "error": "Failed to get SMS config"
            }
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/sms-config/status",
      "summary": "Read SMS delivery provider status.",
      "surface": management,
      "details": {
        "overview": "Returns a lightweight delivery-readiness summary: whether SMS is configured, and the provider and status when a record exists. The check is a stored-row heuristic, not a live connectivity probe.",
        "notes": [
          "Requires the sms-config:read permission.",
          "configured means a record exists with status active, a non-empty provider, a from_number or sender_id, and a stored auth token.",
          "A missing record returns only { \"configured\": false }."
        ],
        "parameters": [],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The SMS delivery status.",
            "example": {
              "success": true,
              "data": {
                "configured": true,
                "provider": "twilio",
                "status": "active"
              },
              "message": "SMS config status retrieved successfully"
            }
          },
          tenantMissingResponse,
          forbiddenResponse,
          {
            "status": "500 Internal Server Error",
            "description": "An unexpected service or persistence error occurred.",
            "example": {
              "success": false,
              "error": "Failed to get SMS config status"
            }
          }
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/sms-config/",
      "summary": "Update SMS delivery configuration.",
      "surface": management,
      "details": {
        "overview": "Creates or replaces the tenant's SMS delivery configuration. Non-secret fields are fully replaced on every write. The provider auth token is write-only: a blank value keeps the stored secret, and switching providers with a blank token clears it.",
        "notes": [
          "Requires the sms-config:update permission.",
          "provider is one of twilio, sns, vonage, messagebird, or log.",
          "daily_send_limit and test_mode are nullable: omitted leaves the stored value unchanged.",
          "Secrets are encrypted at rest and never returned."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "SMS delivery configuration payload.",
          "fields": [
            {
              "name": "provider",
              "type": "string",
              "required": true,
              "description": "Delivery provider: twilio, sns, vonage, messagebird, or log."
            },
            {
              "name": "account_sid",
              "type": "string",
              "required": false,
              "description": "Provider account SID. At most 255 characters."
            },
            {
              "name": "auth_token",
              "type": "string",
              "required": false,
              "description": "Provider auth token (write-only). Blank keeps the stored secret."
            },
            {
              "name": "from_number",
              "type": "string",
              "required": false,
              "description": "Sender phone number. At most 50 characters."
            },
            {
              "name": "sender_id",
              "type": "string",
              "required": false,
              "description": "Alphanumeric sender ID. At most 50 characters."
            },
            {
              "name": "daily_send_limit",
              "type": "integer",
              "required": false,
              "description": "Daily send cap. Omitted leaves the stored value unchanged."
            },
            {
              "name": "test_mode",
              "type": "boolean",
              "required": false,
              "description": "Test-mode flag. Omitted leaves the stored value unchanged."
            }
          ],
          "example": {
            "provider": "twilio",
            "account_sid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            "auth_token": "twilio-auth-token",
            "from_number": "+15551234567",
            "daily_send_limit": 1000
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The SMS delivery configuration was created or replaced.",
            "example": {
              "success": true,
              "data": smsConfigExample,
              "message": "SMS config updated successfully"
            }
          },
          tenantMissingResponse,
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "500 Internal Server Error",
            "description": "An unexpected service error occurred, or the secret could not be encrypted.",
            "example": {
              "success": false,
              "error": "Failed to update SMS config"
            }
          }
        ]
      }
    }
  ]
};

export default group;
