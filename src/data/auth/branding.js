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
  "description": "Public branding endpoints are unauthenticated: they expose only non-sensitive theme colors and logo assets."
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
  "description": "The JSON body or query string failed validation.",
  "example": {
    "success": false,
    "error": "Validation failed",
    "details": {
      "Name": "Name must not exceed 100 characters"
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

const invalidBrandingUuidResponse = {
  "status": "400 Bad Request",
  "description": "The branding_uuid path value is not a valid UUID.",
  "example": {
    "success": false,
    "error": "Invalid branding UUID"
  }
};

const brandingNotFoundResponse = {
  "status": "404 Not Found",
  "description": "No branding matches the UUID in the caller's tenant.",
  "example": {
    "success": false,
    "error": "branding not found"
  }
};

const brandingExample = {
  "branding_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "name": "custom-theme",
  "is_system": false,
  "is_active": true,
  "layout": "centered",
  "company_name": "Example Corp",
  "logo_label": "Example",
  "logo_detail": "Secure access",
  "show_logo_label": true,
  "identity_logo_label": "Example Auth",
  "identity_show_logo_label": true,
  "logo_url": "/public/branding/f47ac10b-58cc-4372-a567-0e02b2c3d479/logo",
  "favicon_url": "https://cdn.example.com/favicon.ico",
  "support_url": "https://example.com/support",
  "privacy_policy_url": "https://example.com/privacy",
  "terms_of_service_url": "https://example.com/terms",
  "metadata": {
    "layout": "centered",
    "colors": {
      "primary": "#2563eb"
    },
    "font": "Inter",
    "effects": {},
    "components": {},
    "logo_label": "Example",
    "show_logo_label": true
  },
  "created_at": "2026-08-01T09:00:00Z",
  "updated_at": "2026-08-10T09:00:00Z"
};

const brandingUpdateFields = [
  {
    "name": "name",
    "type": "string",
    "required": false,
    "description": "Theme name. At most 100 characters."
  },
  {
    "name": "layout",
    "type": "string",
    "required": false,
    "description": "Login page layout: centered, full_page, or split."
  },
  {
    "name": "company_name",
    "type": "string",
    "required": false,
    "description": "Company name. At most 255 characters."
  },
  {
    "name": "logo_label",
    "type": "string",
    "required": false,
    "description": "Text next to the logo. At most 255 characters."
  },
  {
    "name": "logo_detail",
    "type": "string",
    "required": false,
    "description": "Secondary logo text. At most 255 characters."
  },
  {
    "name": "show_logo_label",
    "type": "boolean",
    "required": false,
    "description": "Whether the logo label is rendered. Defaults to true."
  },
  {
    "name": "identity_logo_label",
    "type": "string",
    "required": false,
    "description": "Logo label for the identity surface. At most 255 characters."
  },
  {
    "name": "identity_show_logo_label",
    "type": "boolean",
    "required": false,
    "description": "Whether the identity logo label is rendered. Defaults to true."
  },
  {
    "name": "logo_url",
    "type": "string (URL)",
    "required": false,
    "description": "External logo URL. At most 2048 characters, http or https."
  },
  {
    "name": "logo_data",
    "type": "string (base64)",
    "required": false,
    "description": "Base64-encoded logo image to upload. PNG, JPEG, or WebP, under 256 KB."
  },
  {
    "name": "logo_content_type",
    "type": "string",
    "required": false,
    "description": "MIME type of the uploaded logo: image/png, image/jpeg, or image/webp."
  },
  {
    "name": "favicon_url",
    "type": "string (URL)",
    "required": false,
    "description": "Favicon URL. At most 2048 characters, http or https."
  },
  {
    "name": "support_url",
    "type": "string (URL)",
    "required": false,
    "description": "Support URL. At most 2048 characters."
  },
  {
    "name": "privacy_policy_url",
    "type": "string (URL)",
    "required": false,
    "description": "Privacy policy URL. At most 2048 characters."
  },
  {
    "name": "terms_of_service_url",
    "type": "string (URL)",
    "required": false,
    "description": "Terms of service URL. At most 2048 characters."
  },
  {
    "name": "metadata",
    "type": "object",
    "required": false,
    "description": "Free-form theme metadata (colors, fonts, effects, components)."
  }
];

const emailTemplateListExample = {
  "email_template_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "name": "user:password:reset",
  "subject": "Password Reset Request",
  "status": "active",
  "is_default": false,
  "is_system": false,
  "created_at": "2026-08-01T09:00:00Z",
  "updated_at": "2026-08-10T09:00:00Z"
};

const emailTemplateDetailExample = {
  ...emailTemplateListExample,
  "body_html": "<p>Reset your password: <a href=\"{{.ResetURL}}\">{{.ResetURL}}</a></p>",
  "body_plain": "Reset your password: {{.ResetURL}}",
  "parameters_doc": "Available variables: {{.ResetURL}}, {{.LogoURL}}"
};

const smsTemplateListExample = {
  "sms_template_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "name": "sms:login:otp",
  "description": "SMS Login OTP",
  "status": "active",
  "is_default": false,
  "is_system": false,
  "created_at": "2026-08-01T09:00:00Z",
  "updated_at": "2026-08-10T09:00:00Z"
};

const smsTemplateDetailExample = {
  ...smsTemplateListExample,
  "message": "Your verification code is: {{.OTP}}",
  "parameters_doc": "Available variables: {{.OTP}}"
};

const templatePaginationParams = [
  {
    "name": "name",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Case-insensitive substring match on the template name."
  },
  {
    "name": "status",
    "in": "query",
    "type": "string",
    "required": false,
    "description": "Exact status match: active or inactive."
  },
  {
    "name": "is_default",
    "in": "query",
    "type": "boolean",
    "required": false,
    "description": "Filter by default-flag."
  },
  {
    "name": "is_system",
    "in": "query",
    "type": "boolean",
    "required": false,
    "description": "Filter by system flag."
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
    "description": "Field to sort by. Unknown fields fall back to created_at descending."
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
  "slug": "branding",
  "label": "Branding",
  "description": "Branding records and active theme control, public branding and logo serving, and the email and SMS templates that carry the tenant's message content.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/branding/",
      "summary": "List branding configurations.",
      "surface": management,
      "details": {
        "overview": "Lists the tenant's branding configurations (themes). System themes are listed first, then custom themes oldest first. Each record carries the full metadata including layout, colors, fonts, and logo labels.",
        "notes": [
          "Requires the branding:read permission.",
          "Logo bytes and content type are never returned.",
          "is_active marks the tenant's current theme; exactly one record is active at a time."
        ],
        "parameters": [],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The tenant's branding configurations.",
            "example": {
              "success": true,
              "data": [brandingExample],
              "message": "Branding retrieved successfully"
            }
          },
          tenantMissingResponse,
          forbiddenResponse,
          {
            "status": "500 Internal Server Error",
            "description": "An unexpected service or persistence error occurred.",
            "example": {
              "success": false,
              "error": "Failed to list branding"
            }
          }
        ]
      }
    },
    {
      "method": "POST",
      "path": "/branding/",
      "summary": "Create branding configuration.",
      "surface": management,
      "details": {
        "overview": "Creates a custom branding theme for the tenant. New themes are created inactive and must be activated explicitly. A base64 logo can be uploaded inline; after upload the logo is served from the public branding endpoint.",
        "notes": [
          "Requires the branding:create permission.",
          "layout must be centered, full_page, or split; the value lives in metadata.",
          "Created themes are is_system=false and is_active=false.",
          "The response is HTTP 200 (not 201)."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Branding creation payload.",
          "fields": brandingUpdateFields,
          "example": {
            "name": "custom-theme",
            "layout": "centered",
            "company_name": "Example Corp",
            "logo_label": "Example",
            "metadata": {
              "colors": {
                "primary": "#2563eb"
              },
              "font": "Inter"
            }
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The branding theme was created.",
            "example": {
              "success": true,
              "data": brandingExample,
              "message": "Branding created successfully"
            }
          },
          tenantMissingResponse,
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "500 Internal Server Error",
            "description": "An unexpected service error occurred, or the logo upload failed.",
            "example": {
              "success": false,
              "error": "Failed to store logo"
            }
          }
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/branding/{branding_uuid}",
      "summary": "Update branding configuration.",
      "surface": management,
      "details": {
        "overview": "Updates a branding theme's fields. System themes can be edited (colors, company name, URLs) but their name is immutable.",
        "notes": [
          "Requires the branding:update permission.",
          "is_active and is_system are never changed here; activation is a separate endpoint.",
          "The logo cache is invalidated on every update.",
          "Uploaded logo bytes replace any previously stored logo."
        ],
        "parameters": [
          {
            "name": "branding_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the branding theme."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Branding update payload.",
          "fields": brandingUpdateFields,
          "example": {
            "company_name": "Example Corp",
            "support_url": "https://example.com/support",
            "metadata": {
              "colors": {
                "primary": "#1d4ed8"
              }
            }
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The branding theme was updated.",
            "example": {
              "success": true,
              "data": brandingExample,
              "message": "Branding updated successfully"
            }
          },
          tenantMissingResponse,
          invalidBrandingUuidResponse,
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          brandingNotFoundResponse,
          {
            "status": "500 Internal Server Error",
            "description": "An unexpected service error occurred, or the logo upload failed.",
            "example": {
              "success": false,
              "error": "Failed to store logo"
            }
          }
        ]
      }
    },
    {
      "method": "PATCH",
      "path": "/branding/{branding_uuid}/restore",
      "summary": "Restore system branding values.",
      "surface": management,
      "details": {
        "overview": "Restores a system theme to its seeded default: company name, logo, favicon, support and legal URLs, and the seeded theme metadata. The theme's UUID, name, tenant, and active flag are preserved.",
        "notes": [
          "Requires the branding:update permission.",
          "Only system themes (default, light, dark) can be restored.",
          "The seeded default is matched by theme name."
        ],
        "parameters": [
          {
            "name": "branding_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the system branding theme."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The system theme was restored to its seeded defaults.",
            "example": {
              "success": true,
              "data": brandingExample,
              "message": "Branding restored successfully"
            }
          },
          tenantMissingResponse,
          invalidBrandingUuidResponse,
          forbiddenResponse,
          brandingNotFoundResponse,
          {
            "status": "400 Bad Request",
            "description": "The theme is not a system theme, or it has no seeded default.",
            "example": {
              "success": false,
              "error": "only system branding themes can be restored"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PATCH",
      "path": "/branding/{branding_uuid}/activate",
      "summary": "Activate a branding configuration.",
      "surface": management,
      "details": {
        "overview": "Makes the given theme the tenant's active branding. Activation deactivates every other theme in the tenant (including system themes), so exactly one theme is always active.",
        "notes": [
          "Requires the branding:activate permission.",
          "Any theme can be activated, including system themes."
        ],
        "parameters": [
          {
            "name": "branding_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the branding theme to activate."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The theme was activated.",
            "example": {
              "success": true,
              "data": brandingExample,
              "message": "Branding activated successfully"
            }
          },
          tenantMissingResponse,
          invalidBrandingUuidResponse,
          forbiddenResponse,
          brandingNotFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/branding/{branding_uuid}",
      "summary": "Delete branding configuration.",
      "surface": management,
      "details": {
        "overview": "Soft-deletes a custom branding theme. System themes are protected and cannot be deleted.",
        "notes": [
          "Requires the branding:delete permission.",
          "The response carries no data payload.",
          "The logo cache is invalidated."
        ],
        "parameters": [
          {
            "name": "branding_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the branding theme."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The branding theme was deleted.",
            "example": {
              "success": true,
              "message": "Branding deleted successfully"
            }
          },
          tenantMissingResponse,
          invalidBrandingUuidResponse,
          forbiddenResponse,
          brandingNotFoundResponse,
          {
            "status": "400 Bad Request",
            "description": "The theme is a protected system theme.",
            "example": {
              "success": false,
              "error": "system branding cannot be deleted"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/public/branding",
      "summary": "Read public branding for the request tenant.",
      "surface": publicIdentity,
      "details": {
        "overview": "Returns the active branding for a tenant (or the global system branding when no tenant is specified) so unauthenticated login pages can render the right theme. Only non-sensitive data is exposed: colors, logo, and legal URLs.",
        "notes": [
          "Unauthenticated.",
          "tenant_id is optional; an invalid value is treated as absent.",
          "Without a tenant the global system default is returned."
        ],
        "parameters": [
          {
            "name": "tenant_id",
            "in": "query",
            "type": "integer",
            "required": false,
            "description": "Tenant whose active branding should be returned. Falls back to the global system branding."
          }
        ],
        "headers": publicReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The active branding.",
            "example": {
              "success": true,
              "data": brandingExample,
              "message": "Branding retrieved successfully"
            }
          },
          {
            "status": "500 Internal Server Error",
            "description": "An unexpected service error occurred, or no system default exists.",
            "example": {
              "success": false,
              "error": "Failed to get public branding"
            }
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/public/branding/{branding_id}/logo",
      "summary": "Serve a public branding logo asset.",
      "surface": publicIdentity,
      "details": {
        "overview": "Serves the stored logo image for a branding theme as a raw binary with the stored content type. The response is cached with a 1-hour max-age and an ETag.",
        "notes": [
          "Unauthenticated.",
          "The response is the raw image, not the JSON envelope.",
          "Cache-Control: public, max-age=3600 and ETag are set on success."
        ],
        "parameters": [
          {
            "name": "branding_id",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the branding theme whose logo should be served."
          }
        ],
        "headers": publicReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The logo image bytes with the stored content type.",
            "example": "<binary image data>"
          },
          {
            "status": "400 Bad Request",
            "description": "The branding_id path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid branding UUID"
            }
          },
          {
            "status": "404 Not Found",
            "description": "No branding matches the UUID, or no logo is stored for it.",
            "example": {
              "success": false,
              "error": "No logo stored for this branding"
            }
          }
        ]
      }
    },

    // ──────────────────────────────────────────────────────────────────────────
    // Email templates
    // ──────────────────────────────────────────────────────────────────────────
    {
      "method": "GET",
      "path": "/email_templates/",
      "summary": "List email templates.",
      "surface": management,
      "details": {
        "overview": "Lists the tenant's email templates with pagination and filtering. List rows omit the template bodies.",
        "notes": [
          "Requires the email-template:read permission.",
          "Seeded templates include user:invite, user:password:reset, user:email:verification, user:magic_link, user:ciba:notification, user:device:approved, user:email:change, user:email:changed, user:mfa:enroll, and user:mfa:stepup."
        ],
        "parameters": templatePaginationParams,
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The paginated email template list.",
            "example": {
              "success": true,
              "data": {
                "rows": [emailTemplateListExample],
                "total": 10,
                "page": 1,
                "limit": 20,
                "total_pages": 1
              },
              "message": "Email templates retrieved successfully"
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
              "error": "Failed to get email templates"
            }
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/email_templates/{email_template_uuid}",
      "summary": "Read one email template.",
      "surface": management,
      "details": {
        "overview": "Returns one email template by UUID with its HTML and plain-text bodies and the documented placeholder variables.",
        "notes": [
          "Requires the email-template:read permission.",
          "Templates in another tenant respond as not found."
        ],
        "parameters": [
          {
            "name": "email_template_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the email template."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The email template with its bodies.",
            "example": {
              "success": true,
              "data": emailTemplateDetailExample,
              "message": "Email template retrieved successfully"
            }
          },
          tenantMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The email_template_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid email template UUID"
            }
          },
          forbiddenResponse,
          {
            "status": "404 Not Found",
            "description": "No email template matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "email template not found or access denied"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/email_templates/{email_template_uuid}",
      "summary": "Update one email template.",
      "surface": management,
      "details": {
        "overview": "Updates an email template's subject, HTML body, plain-text body, and status. The rendered-template cache is invalidated on success.",
        "notes": [
          "Requires the email-template:update permission.",
          "System templates cannot be updated (seeded templates are not system rows and can be edited).",
          "status defaults to active when omitted."
        ],
        "parameters": [
          {
            "name": "email_template_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the email template."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Email template update payload.",
          "fields": [
            {
              "name": "subject",
              "type": "string",
              "required": true,
              "description": "Email subject. 1-255 characters."
            },
            {
              "name": "body_html",
              "type": "string",
              "required": true,
              "description": "HTML body. Supports Go template placeholders."
            },
            {
              "name": "body_plain",
              "type": "string",
              "required": false,
              "description": "Plain-text body."
            },
            {
              "name": "status",
              "type": "string",
              "required": false,
              "description": "One of active or inactive. Defaults to active."
            }
          ],
          "example": {
            "subject": "Password Reset Request",
            "body_html": "<p>Reset your password: <a href=\"{{.ResetURL}}\">{{.ResetURL}}</a></p>",
            "body_plain": "Reset your password: {{.ResetURL}}",
            "status": "active"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The email template was updated.",
            "example": {
              "success": true,
              "data": emailTemplateDetailExample,
              "message": "Email template updated successfully"
            }
          },
          tenantMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The email_template_uuid path value is not a valid UUID, or the target is a system template.",
            "example": {
              "success": false,
              "error": "cannot update system email template"
            }
          },
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "404 Not Found",
            "description": "No email template matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "email template not found or access denied"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PATCH",
      "path": "/email_templates/{email_template_uuid}/status",
      "summary": "Change email template status.",
      "surface": management,
      "details": {
        "overview": "Updates only a template's status. Inactive templates are skipped at render time.",
        "notes": [
          "Requires the email-template:update permission.",
          "System template status cannot be changed.",
          "The rendered-template cache is invalidated."
        ],
        "parameters": [
          {
            "name": "email_template_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the email template."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Email template status payload.",
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
            "description": "The template status was updated.",
            "example": {
              "success": true,
              "data": emailTemplateDetailExample,
              "message": "Email template status updated successfully"
            }
          },
          tenantMissingResponse,
          {
            "status": "400 Bad Request",
            "description": "The email_template_uuid path value is not a valid UUID, or the target is a system template.",
            "example": {
              "success": false,
              "error": "cannot update status of system email template"
            }
          },
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "404 Not Found",
            "description": "No email template matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "email template not found or access denied"
            }
          },
          internalErrorResponse
        ]
      }
    },

    // ──────────────────────────────────────────────────────────────────────────
    // SMS templates
    // ──────────────────────────────────────────────────────────────────────────
    {
      "method": "GET",
      "path": "/sms_templates/",
      "summary": "List SMS templates.",
      "surface": management,
      "details": {
        "overview": "Lists the tenant's SMS templates with pagination and filtering. List rows omit the message content.",
        "notes": [
          "Requires the sms-template:read permission.",
          "Seeded templates include sms:login:otp, sms:mfa:stepup, and sms:mfa:enroll."
        ],
        "parameters": templatePaginationParams,
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The paginated SMS template list.",
            "example": {
              "success": true,
              "data": {
                "rows": [smsTemplateListExample],
                "total": 3,
                "page": 1,
                "limit": 20,
                "total_pages": 1
              },
              "message": "SMS templates retrieved successfully"
            }
          },
          {
            "status": "401 Unauthorized",
            "description": "The authenticated context does not resolve a tenant.",
            "example": {
              "success": false,
              "error": "Unauthorized"
            }
          },
          forbiddenResponse,
          validationErrorResponse,
          {
            "status": "500 Internal Server Error",
            "description": "An unexpected service or persistence error occurred.",
            "example": {
              "success": false,
              "error": "Failed to get SMS templates"
            }
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/sms_templates/{sms_template_uuid}",
      "summary": "Read one SMS template.",
      "surface": management,
      "details": {
        "overview": "Returns one SMS template by UUID with its message content and documented placeholder variables.",
        "notes": [
          "Requires the sms-template:read permission.",
          "Templates in another tenant respond as not found."
        ],
        "parameters": [
          {
            "name": "sms_template_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the SMS template."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The SMS template with its message.",
            "example": {
              "success": true,
              "data": smsTemplateDetailExample,
              "message": "SMS template retrieved successfully"
            }
          },
          {
            "status": "401 Unauthorized",
            "description": "The authenticated context does not resolve a tenant.",
            "example": {
              "success": false,
              "error": "Unauthorized"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "The sms_template_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid SMS template UUID"
            }
          },
          forbiddenResponse,
          {
            "status": "404 Not Found",
            "description": "No SMS template matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "SMS template not found or access denied"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/sms_templates/{sms_template_uuid}",
      "summary": "Update one SMS template.",
      "surface": management,
      "details": {
        "overview": "Updates an SMS template's message content, description, and status. The rendered-template cache is invalidated on success.",
        "notes": [
          "Requires the sms-template:update permission.",
          "System templates cannot be updated (seeded templates are not system rows and can be edited).",
          "status defaults to active when omitted."
        ],
        "parameters": [
          {
            "name": "sms_template_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the SMS template."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "SMS template update payload.",
          "fields": [
            {
              "name": "description",
              "type": "string",
              "required": false,
              "description": "Human-readable description."
            },
            {
              "name": "message",
              "type": "string",
              "required": true,
              "description": "Message content. Supports Go template placeholders."
            },
            {
              "name": "status",
              "type": "string",
              "required": false,
              "description": "One of active or inactive. Defaults to active."
            }
          ],
          "example": {
            "description": "SMS Login OTP",
            "message": "Your verification code is: {{.OTP}}",
            "status": "active"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The SMS template was updated.",
            "example": {
              "success": true,
              "data": smsTemplateDetailExample,
              "message": "SMS template updated successfully"
            }
          },
          {
            "status": "401 Unauthorized",
            "description": "The authenticated context does not resolve a tenant.",
            "example": {
              "success": false,
              "error": "Unauthorized"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "The sms_template_uuid path value is not a valid UUID, or the target is a system template.",
            "example": {
              "success": false,
              "error": "cannot update system SMS template"
            }
          },
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "404 Not Found",
            "description": "No SMS template matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "SMS template not found or access denied"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PATCH",
      "path": "/sms_templates/{sms_template_uuid}/status",
      "summary": "Change SMS template status.",
      "surface": management,
      "details": {
        "overview": "Updates only a template's status. Inactive templates are skipped at render time.",
        "notes": [
          "Requires the sms-template:update permission.",
          "System template status cannot be changed.",
          "The rendered-template cache is invalidated."
        ],
        "parameters": [
          {
            "name": "sms_template_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the SMS template."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "SMS template status payload.",
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
            "description": "The template status was updated.",
            "example": {
              "success": true,
              "data": smsTemplateDetailExample,
              "message": "SMS template status updated successfully"
            }
          },
          {
            "status": "401 Unauthorized",
            "description": "The authenticated context does not resolve a tenant.",
            "example": {
              "success": false,
              "error": "Unauthorized"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "The sms_template_uuid path value is not a valid UUID, or the target is a system template.",
            "example": {
              "success": false,
              "error": "cannot update status of system SMS template"
            }
          },
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "404 Not Found",
            "description": "No SMS template matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "SMS template not found or access denied"
            }
          },
          internalErrorResponse
        ]
      }
    }
  ]
};

export default group;
