// Endpoint details for this Auth API section.

const publicIdentity = "Public identity API";

const jsonAcceptHeader = {
  "name": "Accept",
  "value": "application/json",
  "required": false,
  "description": "Use when the caller wants an explicit JSON response."
};

const noAuthHeader = {
  "name": "Authorization",
  "value": "Not required",
  "required": false,
  "description": "Tenant discovery is intentionally available before login so the hosted identity app and console can resolve tenant context, public branding, password policy, registration policy, and enabled login methods."
};

const emptyBody = {
  "type": "None",
  "description": "This endpoint does not accept a request body.",
  "fields": [],
  "example": null
};

const publicTenantExample = {
  "success": true,
  "data": {
    "name": "system",
    "display_name": "Maintainerd",
    "description": "System tenant",
    "status": "active",
    "is_system": true,
    "is_default": false,
    "password_config": {
      "min_length": 12,
      "max_length": 128,
      "require_uppercase": true,
      "require_lowercase": true,
      "require_number": true,
      "require_symbol": true,
      "min_strength_score": 3,
      "reject_common_passwords": true,
      "check_hibp": true
    },
    "registration_config": {
      "self_registration_enabled": true,
      "require_email_verification": true,
      "captcha_on_signup": false
    },
    "branding": {
      "layout": "centered",
      "company_name": "Maintainerd",
      "logo_label": "Maintainerd",
      "logo_detail": "Auth",
      "show_logo_label": true,
      "identity_logo_label": "Maintainerd",
      "identity_show_logo_label": true,
      "logo_url": "https://auth.example.com/assets/logo.png",
      "favicon_url": "https://auth.example.com/assets/favicon.ico",
      "support_url": "https://support.example.com",
      "privacy_policy_url": "https://example.com/privacy",
      "terms_of_service_url": "https://example.com/terms",
      "metadata": {}
    }
  },
  "message": "System tenant fetched successfully"
};

const namedTenantExample = {
  "success": true,
  "data": {
    "name": "acme",
    "display_name": "Acme",
    "description": "Acme workspace",
    "status": "active",
    "is_system": false,
    "is_default": false,
    "password_config": {
      "min_length": 14,
      "max_length": 128,
      "require_uppercase": true,
      "require_lowercase": true,
      "require_number": true,
      "require_symbol": true,
      "min_strength_score": 3,
      "reject_common_passwords": true,
      "check_hibp": true
    },
    "registration_config": {
      "self_registration_enabled": false,
      "require_email_verification": true,
      "captcha_on_signup": true
    },
    "branding": {
      "layout": "split",
      "company_name": "Acme",
      "logo_label": "Acme",
      "logo_detail": "Identity",
      "show_logo_label": true,
      "identity_logo_label": "Acme",
      "identity_show_logo_label": true,
      "logo_url": "https://cdn.example.com/acme/logo.png",
      "favicon_url": "https://cdn.example.com/acme/favicon.ico",
      "support_url": "https://support.acme.example",
      "privacy_policy_url": "https://acme.example/privacy",
      "terms_of_service_url": "https://acme.example/terms",
      "metadata": {
        "theme": "enterprise"
      }
    }
  },
  "message": "Tenant fetched successfully"
};

const bootstrapExample = {
  "success": true,
  "data": {
    "tenant": {
      "tenant_id": "018f5e1c-8a44-7c21-b22e-69a7f7f4d421",
      "name": "acme",
      "display_name": "Acme",
      "description": "Acme workspace",
      "status": "active",
      "is_system": false
    },
    "surface": "identity",
    "identity_url": "https://acme.auth.example.com",
    "console_url": "https://acme.console.auth.example.com",
    "password_config": {
      "min_length": 14,
      "max_length": 128,
      "require_uppercase": true,
      "require_lowercase": true,
      "require_number": true,
      "require_symbol": true,
      "min_strength_score": 3,
      "reject_common_passwords": true,
      "check_hibp": true
    },
    "registration_config": {
      "self_registration_enabled": false,
      "require_email_verification": true,
      "captcha_on_signup": true
    },
    "branding": {
      "layout": "split",
      "company_name": "Acme",
      "logo_label": "Acme",
      "logo_detail": "Identity",
      "show_logo_label": true,
      "identity_logo_label": "Acme",
      "identity_show_logo_label": true,
      "logo_url": "https://cdn.example.com/acme/logo.png",
      "favicon_url": "https://cdn.example.com/acme/favicon.ico",
      "support_url": "https://support.acme.example",
      "privacy_policy_url": "https://acme.example/privacy",
      "terms_of_service_url": "https://acme.example/terms",
      "metadata": {
        "theme": "enterprise"
      }
    },
    "client": {
      "client_id": "acme-identity",
      "name": "acme-identity",
      "display_name": "Acme Identity",
      "client_type": "spa"
    },
    "connections": [
      {
        "identifier": "google",
        "display_name": "Google",
        "provider": "google",
        "provider_type": "social",
        "is_default": false,
        "display_order": 10
      },
      {
        "identifier": "acme-sso",
        "display_name": "Acme SSO",
        "provider": "oidc",
        "provider_type": "enterprise",
        "is_default": true,
        "display_order": 20
      }
    ],
    "magic_link_enabled": true
  },
  "message": "Tenant bootstrap fetched successfully"
};

const group = {
  "slug": "tenant-discovery",
  "label": "Tenant Discovery",
  "description": "Unauthenticated tenant lookup endpoints used by the identity app and console to resolve tenant context before authentication.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/tenant/",
      "summary": "Resolve the system tenant or bootstrap a tenant from a browser host.",
      "surface": publicIdentity,
      "details": {
        "overview": "Returns tenant context before a user is authenticated. Without query parameters, it returns the system tenant's public projection. With domain, it resolves the requested identity or console hostname to a tenant, surface, canonical URLs, branding, password policy, registration policy, seeded surface client, and federated login options.",
        "notes": [
          "Use this endpoint from the hosted identity app and console before rendering login, registration, password reset, or tenant-aware UI.",
          "The domain parameter should be the browser-facing host, such as auth.example.com, acme.auth.example.com, console.auth.example.com, or acme.console.auth.example.com.",
          "System tenant hosts use the configured base host directly. Regular tenants use a single subdomain label before the configured base host.",
          "The optional client_id parameter only affects client-attached branding selection during bootstrap. The resolved surface client still comes from the hostname and tenant.",
          "The response exposes public UUIDs and public client identifiers only. It must not expose internal database integer IDs."
        ],
        "parameters": [
          {
            "name": "domain",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Browser host to resolve. When omitted, the endpoint returns the system tenant public projection. When present, it returns the tenant bootstrap payload for the resolved host."
          },
          {
            "name": "client_id",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Optional public client identifier used to select client-attached branding. It does not override the tenant or surface resolved from domain."
          }
        ],
        "headers": [jsonAcceptHeader, noAuthHeader],
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "No domain parameter was provided, so the system tenant public projection was returned.",
            "example": publicTenantExample
          },
          {
            "status": "200 OK",
            "description": "The domain was recognized and the tenant bootstrap payload was returned.",
            "example": bootstrapExample
          },
          {
            "status": "404 Not Found",
            "description": "The supplied domain does not match a configured identity or console host, or the resolved tenant does not exist.",
            "example": {
              "success": false,
              "error": "Unknown domain"
            }
          },
          {
            "status": "500 Internal Server Error",
            "description": "The service could not load the system tenant or resolved tenant because of an internal dependency failure.",
            "example": {
              "success": false,
              "error": "System tenant not found"
            }
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/tenant/{name}",
      "summary": "Resolve a tenant by DNS-safe tenant slug.",
      "surface": publicIdentity,
      "details": {
        "overview": "Returns the public projection of a tenant by its DNS-safe name. The response is designed for pre-authentication UI setup, not tenant administration.",
        "notes": [
          "Use the tenant slug from the URL or tenant selector, not the tenant display name.",
          "This endpoint returns public tenant data, public security policy, and active branding. It does not return members, secrets, internal IDs, private settings, or administrative metadata.",
          "For full administrative tenant records, use the authenticated tenant administration endpoints in Tenants and Members."
        ],
        "parameters": [
          {
            "name": "name",
            "in": "path",
            "type": "string",
            "required": true,
            "description": "DNS-safe tenant slug, such as acme. This is the same value used in tenant subdomains."
          }
        ],
        "headers": [jsonAcceptHeader, noAuthHeader],
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The tenant was found and its public projection was returned.",
            "example": namedTenantExample
          },
          {
            "status": "404 Not Found",
            "description": "No tenant exists with the supplied slug.",
            "example": {
              "success": false,
              "error": "tenant not found"
            }
          },
          {
            "status": "500 Internal Server Error",
            "description": "The service could not resolve the tenant because of an internal dependency failure.",
            "example": {
              "success": false,
              "error": "Tenant not found"
            }
          }
        ]
      }
    }
  ]
};

export default group;
