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
  "description": "Public federation endpoints are unauthenticated by protocol design. Trust comes from the message itself: the upstream token, the RelayState nonce, or the IdP's XML signature."
};

const publicReadHeaders = [jsonAcceptHeader, noAuthHeader];
const publicJsonHeaders = [jsonContentHeader, jsonAcceptHeader, noAuthHeader];
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

const invalidIdpUuidResponse = {
  "status": "400 Bad Request",
  "description": "The identity_provider_uuid path value is not a valid UUID.",
  "example": {
    "success": false,
    "error": "Invalid identity provider UUID"
  }
};

const idpDetailExample = {
  "identity_provider_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "name": "google",
  "display_name": "Google",
  "provider": "google",
  "provider_type": "social",
  "identifier": "google-9d1d5b4d",
  "callback_url": "https://identity-api.auth.example.com/api/v1/oauth/callback/google-9d1d5b4d",
  "issuer": "https://accounts.google.com",
  "provider_client_id": "1234567890-abcdef.apps.googleusercontent.com",
  "allow_jit_provisioning": true,
  "allow_registration": false,
  "allow_token_federation": false,
  "allowed_audiences": [],
  "email_domains": ["example.com"],
  "config": {
    "scopes": ["openid", "email", "profile"],
    "attribute_mapping": {
      "email": "email"
    }
  },
  "status": "active",
  "is_default": false,
  "is_system": false,
  "created_at": "2026-08-01T09:00:00Z",
  "updated_at": "2026-08-10T09:00:00Z"
};

const loginTokenExample = {
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "rt_7b2d2d0e3c5b4f0a9c1d",
  "expires_in": 3600,
  "token_type": "Bearer",
  "issued_at": 1765209600,
  "session_id": "970834ab-e31d-4a30-afc6-0f30ec5772d6"
};

const group = {
  "slug": "identity-providers",
  "label": "Identity Providers",
  "description": "Provider trust configuration, connection testing, federation token exchange, home-realm discovery, SAML SSO, SAML metadata, and SAML single logout.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/identity_providers/",
      "summary": "List identity providers.",
      "surface": management,
      "details": {
        "overview": "Lists the tenant's identity providers with pagination, filtering, and sorting. The list shape deliberately omits the config blob and tenant object; use the detail endpoint for those.",
        "notes": [
          "Requires the idp:read permission.",
          "Results are scoped to the authenticated caller's tenant.",
          "status and provider filters accept comma-separated lists.",
          "callback_url is computed for OAuth2/OIDC providers and is empty for SAML providers (which use an ACS URL)."
        ],
        "parameters": [
          {
            "name": "search",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Free-text search across provider name and display name."
          },
          {
            "name": "name",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Filter by provider name."
          },
          {
            "name": "display_name",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Filter by display name."
          },
          {
            "name": "provider",
            "in": "query",
            "type": "string (comma-separated)",
            "required": false,
            "description": "Filter by provider: maintainerd, cognito, auth0, google, facebook, github, gitlab, microsoft, linkedin, twitter, saml."
          },
          {
            "name": "provider_type",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Filter by provider type: system, social, enterprise, saml."
          },
          {
            "name": "identifier",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Filter by the provider's tenant-scoped identifier."
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
            "description": "Filter by whether the provider is the tenant default."
          },
          {
            "name": "is_system",
            "in": "query",
            "type": "boolean",
            "required": false,
            "description": "Filter by whether the provider is a system provider."
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
            "description": "The paginated identity-provider list.",
            "example": {
              "success": true,
              "data": {
                "rows": [
                  {
                    "identity_provider_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                    "name": "google",
                    "display_name": "Google",
                    "provider": "google",
                    "provider_type": "social",
                    "identifier": "google-9d1d5b4d",
                    "callback_url": "https://identity-api.auth.example.com/api/v1/oauth/callback/google-9d1d5b4d",
                    "issuer": "https://accounts.google.com",
                    "provider_client_id": "1234567890-abcdef.apps.googleusercontent.com",
                    "allow_jit_provisioning": true,
                    "allow_token_federation": false,
                    "email_domains": ["example.com"],
                    "status": "active",
                    "is_default": false,
                    "is_system": false,
                    "created_at": "2026-08-01T09:00:00Z",
                    "updated_at": "2026-08-10T09:00:00Z"
                  }
                ],
                "total": 3,
                "page": 1,
                "limit": 20,
                "total_pages": 1
              },
              "message": "Identity providers fetched successfully"
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
      "path": "/identity_providers/{identity_provider_uuid}",
      "summary": "Read one identity provider.",
      "surface": management,
      "details": {
        "overview": "Returns one identity provider by UUID, including the config blob, allowed audiences, email domains, and the owning tenant summary. The provider client secret is never returned: the secret column is not selected on reads.",
        "notes": [
          "Requires the idp:read permission.",
          "The detail response adds config, allowed_audiences, allow_registration, and tenant over the list shape.",
          "Providers in another tenant respond as not found."
        ],
        "parameters": [
          {
            "name": "identity_provider_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the identity provider."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The identity provider was retrieved.",
            "example": {
              "success": true,
              "data": idpDetailExample,
              "message": "Identity provider fetched successfully"
            }
          },
          tenantMissingResponse,
          invalidIdpUuidResponse,
          forbiddenResponse,
          {
            "status": "404 Not Found",
            "description": "No identity provider matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "identity provider not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/identity_providers/",
      "summary": "Create an identity provider.",
      "surface": management,
      "details": {
        "overview": "Creates an identity-provider trust record for the caller's tenant. The provider's issuer, client credentials, allowed audiences, and JIT flag decide whose assertions can mint users and sessions here, so every mutation is step-up gated and audited.",
        "notes": [
          "Requires the idp:create permission and step-up authentication.",
          "name must be lowercase letters, digits, and hyphens only (3-50 characters).",
          "Active social/enterprise providers require issuer (except OAuth2-only providers like github/facebook/twitter, which require explicit endpoints), provider_client_id, and provider_client_secret.",
          "All external endpoints must use https (http is allowed only for localhost/127.0.0.1 during development).",
          "Fixed-domain providers are host-bound to their official domains: a google provider cannot point at a fake issuer, preventing client-secret exfiltration to attacker-controlled hosts.",
          "allow_token_federation requires an issuer and at least one allowed audience when the provider is active.",
          "Config keys are strictly allow-listed per provider family (OIDC/OAuth2 keys vs SAML keys)."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Identity provider creation payload.",
          "fields": [
            {
              "name": "name",
              "type": "string",
              "required": true,
              "description": "Machine name. 3-50 characters: lowercase letters, digits, hyphens; cannot start or end with a hyphen."
            },
            {
              "name": "display_name",
              "type": "string",
              "required": true,
              "description": "Human-readable name. 2-100 characters."
            },
            {
              "name": "provider",
              "type": "string",
              "required": true,
              "description": "One of maintainerd, cognito, auth0, google, facebook, github, gitlab, microsoft, linkedin, twitter, saml."
            },
            {
              "name": "provider_type",
              "type": "string",
              "required": true,
              "description": "One of system, social, enterprise, saml."
            },
            {
              "name": "issuer",
              "type": "string (URL)",
              "required": false,
              "description": "OIDC issuer. Required for active OIDC social/enterprise providers and for token federation. HTTPS only."
            },
            {
              "name": "provider_client_id",
              "type": "string",
              "required": false,
              "description": "Upstream client ID. Required for active social/enterprise providers."
            },
            {
              "name": "provider_client_secret",
              "type": "string",
              "required": false,
              "description": "Upstream client secret (write-only). Required for active social/enterprise providers on create."
            },
            {
              "name": "allow_jit_provisioning",
              "type": "boolean",
              "required": false,
              "description": "Whether users may be provisioned on first federated sign-in."
            },
            {
              "name": "allow_registration",
              "type": "boolean",
              "required": false,
              "description": "Whether registration through this provider is permitted."
            },
            {
              "name": "allow_token_federation",
              "type": "boolean",
              "required": false,
              "description": "Whether upstream tokens may be exchanged through POST /federation/token."
            },
            {
              "name": "allowed_audiences",
              "type": "array of strings",
              "required": false,
              "description": "Audiences accepted for token federation. At least one is required when token federation is enabled on an active provider."
            },
            {
              "name": "email_domains",
              "type": "array of strings",
              "required": false,
              "description": "Email domains routed to this provider by home-realm discovery. Each must be a valid domain."
            },
            {
              "name": "config",
              "type": "object",
              "required": false,
              "description": "Provider-family config: OIDC/OAuth2 (scopes, attribute_mapping, authorization_endpoint, token_endpoint, userinfo_endpoint) or SAML (entity_id, sso_url, slo_url, certificate, name_id_format, attribute_mapping)."
            },
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "One of active or inactive."
            }
          ],
          "example": {
            "name": "google",
            "display_name": "Google",
            "provider": "google",
            "provider_type": "social",
            "issuer": "https://accounts.google.com",
            "provider_client_id": "1234567890-abcdef.apps.googleusercontent.com",
            "provider_client_secret": "GOCSPX-secret",
            "allow_jit_provisioning": true,
            "allow_token_federation": false,
            "email_domains": ["example.com"],
            "config": {
              "scopes": ["openid", "email", "profile"]
            },
            "status": "active"
          }
        },
        "responses": [
          {
            "status": "201 Created",
            "description": "The identity provider was created.",
            "example": {
              "success": true,
              "data": idpDetailExample,
              "message": "Identity provider created successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          forbiddenResponse,
          stepUpResponse,
          validationErrorResponse,
          invalidBodyResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/identity_providers/{identity_provider_uuid}",
      "summary": "Update an identity provider.",
      "surface": management,
      "details": {
        "overview": "Replaces an identity provider's configuration. The provider client secret is write-only: sending a blank secret keeps the stored value, so partial updates never wipe a secret by omission.",
        "notes": [
          "Requires the idp:update permission and step-up authentication.",
          "The same validation rules as creation apply, including the host allow-list for fixed-domain providers.",
          "The plaintext client secret is redacted from the audit trail.",
          "Re-pointing the issuer of a JIT-enabled provider is a trust-anchor change; it is step-up gated for that reason."
        ],
        "parameters": [
          {
            "name": "identity_provider_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the identity provider."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Identity provider update payload (full replacement).",
          "fields": [
            {
              "name": "name",
              "type": "string",
              "required": true,
              "description": "Machine name. 3-50 characters: lowercase letters, digits, hyphens."
            },
            {
              "name": "display_name",
              "type": "string",
              "required": true,
              "description": "Human-readable name. 2-100 characters."
            },
            {
              "name": "provider",
              "type": "string",
              "required": true,
              "description": "One of maintainerd, cognito, auth0, google, facebook, github, gitlab, microsoft, linkedin, twitter, saml."
            },
            {
              "name": "provider_type",
              "type": "string",
              "required": true,
              "description": "One of system, social, enterprise, saml."
            },
            {
              "name": "issuer",
              "type": "string (URL)",
              "required": false,
              "description": "OIDC issuer. HTTPS only."
            },
            {
              "name": "provider_client_id",
              "type": "string",
              "required": false,
              "description": "Upstream client ID."
            },
            {
              "name": "provider_client_secret",
              "type": "string",
              "required": false,
              "description": "Write-only upstream client secret. Blank keeps the stored value."
            },
            {
              "name": "allow_jit_provisioning",
              "type": "boolean",
              "required": false,
              "description": "Whether users may be provisioned on first federated sign-in."
            },
            {
              "name": "allow_registration",
              "type": "boolean",
              "required": false,
              "description": "Whether registration through this provider is permitted."
            },
            {
              "name": "allow_token_federation",
              "type": "boolean",
              "required": false,
              "description": "Whether upstream tokens may be exchanged through POST /federation/token."
            },
            {
              "name": "allowed_audiences",
              "type": "array of strings",
              "required": false,
              "description": "Audiences accepted for token federation."
            },
            {
              "name": "email_domains",
              "type": "array of strings",
              "required": false,
              "description": "Email domains routed to this provider by home-realm discovery."
            },
            {
              "name": "config",
              "type": "object",
              "required": false,
              "description": "Provider-family config blob."
            },
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "One of active or inactive."
            }
          ],
          "example": {
            "name": "google",
            "display_name": "Google",
            "provider": "google",
            "provider_type": "social",
            "issuer": "https://accounts.google.com",
            "provider_client_id": "1234567890-abcdef.apps.googleusercontent.com",
            "provider_client_secret": "",
            "allow_jit_provisioning": true,
            "allow_registration": false,
            "allow_token_federation": false,
            "allowed_audiences": [],
            "email_domains": ["example.com"],
            "config": {
              "scopes": ["openid", "email", "profile"]
            },
            "status": "active"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The identity provider was updated.",
            "example": {
              "success": true,
              "data": idpDetailExample,
              "message": "Identity provider updated successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          invalidIdpUuidResponse,
          forbiddenResponse,
          stepUpResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "404 Not Found",
            "description": "No identity provider matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "identity provider not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/identity_providers/{identity_provider_uuid}/status",
      "summary": "Change identity-provider status.",
      "surface": management,
      "details": {
        "overview": "Sets a provider's status to the explicitly requested value. Activating a dormant JIT-enabled provider is an authentication trust-anchor change, which is why this endpoint is step-up gated.",
        "notes": [
          "Requires the idp:update permission and step-up authentication.",
          "Status must be active or inactive.",
          "Inactive providers stop being usable for federated sign-in, token federation, and home-realm discovery routing."
        ],
        "parameters": [
          {
            "name": "identity_provider_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the identity provider."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Identity-provider status payload.",
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
            "description": "The provider status was updated.",
            "example": {
              "success": true,
              "data": idpDetailExample,
              "message": "Identity provider status updated successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          invalidIdpUuidResponse,
          forbiddenResponse,
          stepUpResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "404 Not Found",
            "description": "No identity provider matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "identity provider not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/identity_providers/{identity_provider_uuid}",
      "summary": "Delete an identity provider.",
      "surface": management,
      "details": {
        "overview": "Deletes an identity provider from the tenant and returns the deleted record. Users who signed in through the provider keep their accounts; only future sign-ins through the provider stop working.",
        "notes": [
          "Requires the idp:delete permission and step-up authentication.",
          "Protected providers (the tenant default or system providers) are rejected by the service layer.",
          "The operation is audited with the acting user recorded."
        ],
        "parameters": [
          {
            "name": "identity_provider_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the identity provider."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The provider was deleted. The response carries the deleted record.",
            "example": {
              "success": true,
              "data": idpDetailExample,
              "message": "Identity provider deleted successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          invalidIdpUuidResponse,
          forbiddenResponse,
          stepUpResponse,
          {
            "status": "404 Not Found",
            "description": "No identity provider matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "identity provider not found"
            }
          },
          {
            "status": "409 Conflict",
            "description": "The provider cannot be deleted, for example because it is the tenant default or a protected system provider.",
            "example": {
              "success": false,
              "error": "cannot delete the tenant default identity provider"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/identity_providers/test",
      "summary": "Test an identity-provider configuration before saving it.",
      "surface": management,
      "details": {
        "overview": "Probes an unsaved provider configuration: it runs OIDC discovery against the discovery URL and a JWKS fetch probe through the SSRF-safe provider HTTP client, returning one check entry per step with per-check pass/fail results.",
        "notes": [
          "Requires the idp:create permission (no step-up: nothing is persisted).",
          "Nothing is written to the database by this endpoint.",
          "All outbound probes go through the SSRF-safe client, so private-range targets are refused.",
          "Use this before creating a provider so a bad configuration surfaces here instead of at first login."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Unsaved provider fields to probe.",
          "fields": [
            {
              "name": "provider",
              "type": "string",
              "required": true,
              "description": "Provider name, e.g. google, cognito, auth0, microsoft."
            },
            {
              "name": "client_id",
              "type": "string",
              "required": true,
              "description": "Upstream client ID to validate with."
            },
            {
              "name": "client_secret",
              "type": "string",
              "required": true,
              "description": "Upstream client secret to validate with. Used only for the probe."
            },
            {
              "name": "discovery_url",
              "type": "string (URL)",
              "required": true,
              "description": "OIDC discovery document URL to probe."
            }
          ],
          "example": {
            "provider": "google",
            "client_id": "1234567890-abcdef.apps.googleusercontent.com",
            "client_secret": "GOCSPX-secret",
            "discovery_url": "https://accounts.google.com/.well-known/openid-configuration"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The probe completed. Each check carries a step name, pass/fail flag, the probed URL, and an error when it failed.",
            "example": {
              "success": true,
              "data": {
                "success": true,
                "checks": [
                  {
                    "step": "oidc_discovery",
                    "ok": true,
                    "url": "https://accounts.google.com/.well-known/openid-configuration"
                  },
                  {
                    "step": "jwks_fetch",
                    "ok": true,
                    "url": "https://www.googleapis.com/oauth2/v3/certs"
                  }
                ]
              },
              "message": "Test connection completed"
            }
          },
          forbiddenResponse,
          invalidBodyResponse,
          {
            "status": "500 Internal Server Error",
            "description": "The probe could not run, for example because discovery was unreachable.",
            "example": {
              "success": false,
              "error": "Test connection failed"
            }
          }
        ]
      }
    },
    {
      "method": "POST",
      "path": "/federation/token",
      "summary": "Exchange an upstream OIDC token for Maintainerd Auth tokens.",
      "surface": publicIdentity,
      "details": {
        "overview": "Validates an upstream OIDC token against a configured provider (issuer, signature, audiences, and tenant policy) and, when the provider allows token federation, returns a Maintainerd Auth login token set for the resolved user.",
        "notes": [
          "The provider must have allow_token_federation enabled and the token's audience must be in the provider's allowed audiences.",
          "All three body fields are required.",
          "JIT provisioning and email-domain routing follow the provider's configuration.",
          "The response is the standard login token set shape."
        ],
        "parameters": [],
        "headers": publicJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Federation token exchange payload.",
          "fields": [
            {
              "name": "provider_identifier",
              "type": "string",
              "required": true,
              "description": "Tenant-scoped identifier of the configured identity provider."
            },
            {
              "name": "external_token",
              "type": "string (JWT)",
              "required": true,
              "description": "Raw OIDC token from the upstream provider."
            },
            {
              "name": "client_id",
              "type": "string",
              "required": true,
              "description": "Maintainerd OAuth client identifier scoping the issued tokens."
            }
          ],
          "example": {
            "provider_identifier": "google-9d1d5b4d",
            "external_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyMzQ1In0...",
            "client_id": "app-web-client"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The upstream token was accepted and Maintainerd tokens were issued.",
            "example": {
              "success": true,
              "data": loginTokenExample,
              "message": ""
            }
          },
          {
            "status": "400 Bad Request",
            "description": "A required body field is missing.",
            "example": {
              "success": false,
              "error": "provider_identifier, external_token and client_id are required"
            }
          },
          invalidBodyResponse,
          {
            "status": "401 Unauthorized",
            "description": "The upstream token is invalid, expired, from an untrusted issuer, or its audience is not allowed.",
            "example": {
              "success": false,
              "error": "token validation failed"
            }
          },
          {
            "status": "403 Forbidden",
            "description": "The provider does not allow token federation, or the provider is inactive.",
            "example": {
              "success": false,
              "error": "token federation is not enabled for this provider"
            }
          },
          {
            "status": "404 Not Found",
            "description": "The provider identifier does not resolve, or no user matches and JIT provisioning is disabled.",
            "example": {
              "success": false,
              "error": "identity provider not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/federation/oauth2/callback",
      "summary": "Exchange an upstream OAuth2 authorization code.",
      "surface": publicIdentity,
      "details": {
        "overview": "Completes an OAuth2 authorization-code flow against an OAuth2-only provider (github, facebook, twitter). It exchanges the code for an upstream access token, fetches the user's profile from the provider's userinfo endpoint, provisions or matches the user, and returns Maintainerd tokens.",
        "notes": [
          "Used for OAuth2-only providers that have no OIDC discovery document; OIDC providers use POST /federation/token.",
          "All four body fields are required.",
          "redirect_uri must match the value registered with the upstream provider."
        ],
        "parameters": [],
        "headers": publicJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "OAuth2 code exchange payload.",
          "fields": [
            {
              "name": "provider_identifier",
              "type": "string",
              "required": true,
              "description": "Tenant-scoped identifier of the configured identity provider."
            },
            {
              "name": "code",
              "type": "string",
              "required": true,
              "description": "Authorization code returned by the upstream provider."
            },
            {
              "name": "redirect_uri",
              "type": "string",
              "required": true,
              "description": "The redirect URI registered with the upstream provider for this exchange."
            },
            {
              "name": "client_id",
              "type": "string",
              "required": true,
              "description": "Maintainerd OAuth client identifier scoping the issued tokens."
            }
          ],
          "example": {
            "provider_identifier": "github-9d1d5b4d",
            "code": "gho_upstream-code",
            "redirect_uri": "https://app.example.com/auth/callback",
            "client_id": "app-web-client"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The code was exchanged and Maintainerd tokens were issued.",
            "example": {
              "success": true,
              "data": loginTokenExample,
              "message": ""
            }
          },
          {
            "status": "400 Bad Request",
            "description": "A required body field is missing.",
            "example": {
              "success": false,
              "error": "provider_identifier, code, redirect_uri and client_id are required"
            }
          },
          invalidBodyResponse,
          {
            "status": "401 Unauthorized",
            "description": "The upstream code exchange failed.",
            "example": {
              "success": false,
              "error": "upstream code exchange failed"
            }
          },
          {
            "status": "404 Not Found",
            "description": "The provider identifier does not resolve.",
            "example": {
              "success": false,
              "error": "identity provider not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/federation/hrd",
      "summary": "Discover the correct provider from an email domain.",
      "surface": publicIdentity,
      "details": {
        "overview": "Home-realm discovery: given an email address, returns the identity provider that handles its domain so the login UI can route the user (or prefill the provider) before any credentials are collected.",
        "notes": [
          "The public surface accepts client_id (which resolves the tenant); tenant_id is accepted only as an internal-surface fallback.",
          "When no provider is mapped to the domain, the tenant's default provider is returned.",
          "Returns only the provider identifier, provider name, and display name — never configuration or secrets."
        ],
        "parameters": [
          {
            "name": "email",
            "in": "query",
            "type": "string",
            "required": true,
            "description": "Email address whose domain determines the realm."
          },
          {
            "name": "client_id",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "OAuth client identifier; resolves the tenant for the public surface. Required when tenant_id is not supplied."
          },
          {
            "name": "tenant_id",
            "in": "query",
            "type": "string (integer)",
            "required": false,
            "description": "Internal-surface fallback: numeric tenant ID. Do not send this on the public surface."
          }
        ],
        "headers": publicReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The provider handling the email domain.",
            "example": {
              "success": true,
              "data": {
                "provider_identifier": "google-9d1d5b4d",
                "provider": "google",
                "display_name": "Google"
              },
              "message": ""
            }
          },
          {
            "status": "400 Bad Request",
            "description": "email is missing, the email is invalid, or neither client_id nor tenant_id was supplied.",
            "example": {
              "success": false,
              "error": "email query parameter is required"
            }
          },
          {
            "status": "404 Not Found",
            "description": "No provider exists for the resolved tenant.",
            "example": {
              "success": false,
              "error": "no identity provider found for this tenant"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/federation/saml/initiate",
      "summary": "Start SAML SP-initiated sign-in.",
      "surface": publicIdentity,
      "details": {
        "overview": "Starts a SAML SSO flow by building the IdP AuthnRequest and redirecting the browser to the IdP's SSO URL. The RelayState carries the downstream context (client and redirect URI) and is validated on the way back at the ACS.",
        "notes": [
          "provider_identifier, client_id, and redirect_uri are required.",
          "tenant_id is optional; when omitted the tenant resolves from the client.",
          "On success the response is a 302 redirect to the IdP, not a JSON body.",
          "The redirect URI must be registered for the client."
        ],
        "parameters": [
          {
            "name": "provider_identifier",
            "in": "query",
            "type": "string",
            "required": true,
            "description": "Identifier of the configured SAML provider."
          },
          {
            "name": "client_id",
            "in": "query",
            "type": "string",
            "required": true,
            "description": "Maintainerd OAuth client identifier."
          },
          {
            "name": "redirect_uri",
            "in": "query",
            "type": "string",
            "required": true,
            "description": "Where the frontend wants to land after the ACS completes."
          },
          {
            "name": "tenant_id",
            "in": "query",
            "type": "string (integer)",
            "required": false,
            "description": "Optional numeric tenant ID override."
          }
        ],
        "headers": publicReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "302 Found",
            "description": "The browser is redirected to the IdP's SSO URL with the AuthnRequest and RelayState.",
            "example": {
              "Location": "https://idp.example.com/sso?SAMLRequest=...&RelayState=..."
            }
          },
          {
            "status": "400 Bad Request",
            "description": "A required query parameter is missing, or tenant_id is not numeric.",
            "example": {
              "success": false,
              "error": "provider_identifier, client_id and redirect_uri are required"
            }
          },
          {
            "status": "404 Not Found",
            "description": "The provider does not exist or is not a SAML provider.",
            "example": {
              "success": false,
              "error": "saml provider not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/federation/saml/acs/{provider_identifier}",
      "summary": "Receive a SAML response at the assertion consumer service.",
      "surface": publicIdentity,
      "details": {
        "overview": "The Assertion Consumer Service. The IdP HTTP-POSTs its SAMLResponse here after the user authenticates. The handler verifies the XML signature against the provider's configured certificate, validates the RelayState nonce, provisions or matches the user, and redirects the browser onward carrying a short-lived exchange code.",
        "notes": [
          "The request is a form POST with SAMLResponse and RelayState fields.",
          "RelayState is required and is validated against the nonce issued at initiate time; replayed nonces are rejected.",
          "The redirect carries a single-use exchange code (5-minute TTL) that POST /federation/saml/exchange redeems for tokens.",
          "Trust comes entirely from the IdP's XML signature and the RelayState nonce — this endpoint is unauthenticated by protocol design."
        ],
        "parameters": [
          {
            "name": "provider_identifier",
            "in": "path",
            "type": "string",
            "required": true,
            "description": "Identifier of the configured SAML provider."
          }
        ],
        "headers": [
          {
            "name": "Content-Type",
            "value": "application/x-www-form-urlencoded",
            "required": true,
            "description": "The IdP posts the SAML response as a URL-encoded form."
          },
          noAuthHeader
        ],
        "requestBody": {
          "type": "URL-encoded form",
          "description": "SAML assertion consumer payload posted by the IdP.",
          "fields": [
            {
              "name": "SAMLResponse",
              "type": "string (base64 XML)",
              "required": true,
              "description": "Base64-encoded SAML response from the IdP."
            },
            {
              "name": "RelayState",
              "type": "string",
              "required": true,
              "description": "Opaque value issued by /federation/saml/initiate and echoed back by the IdP."
            }
          ],
          "example": "SAMLResponse=PHNhbWxwOlJlc3BvbnNl...&RelayState=relay-9d1d5b4d3a"
        },
        "responses": [
          {
            "status": "302 Found",
            "description": "The SAML response was accepted. The redirect carries the short-lived exchange code for POST /federation/saml/exchange.",
            "example": {
              "Location": "https://app.example.com/auth/callback?code=saml_exchange_9d1d5b4d3a"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "The form could not be parsed or RelayState is missing.",
            "example": {
              "success": false,
              "error": "missing RelayState"
            }
          },
          {
            "status": "401 Unauthorized",
            "description": "The SAML assertion failed signature verification, expired, or its nonce was already used.",
            "example": {
              "success": false,
              "error": "SAML assertion validation failed"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/federation/saml/exchange",
      "summary": "Exchange a SAML authorization code for tokens.",
      "surface": publicIdentity,
      "details": {
        "overview": "Exchanges the short-lived, single-use code issued by the ACS for the full Maintainerd login token set. The code lives in cache for 5 minutes and is deleted on first use.",
        "notes": [
          "code is required and is single-use.",
          "An expired or already-used code responds as unauthorized.",
          "The response is the standard login token set shape."
        ],
        "parameters": [],
        "headers": publicJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "SAML exchange code payload.",
          "fields": [
            {
              "name": "code",
              "type": "string",
              "required": true,
              "description": "Short-lived exchange code from the ACS redirect."
            }
          ],
          "example": {
            "code": "saml_exchange_9d1d5b4d3a"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The code was redeemed and tokens were issued.",
            "example": {
              "success": true,
              "data": loginTokenExample,
              "message": ""
            }
          },
          {
            "status": "400 Bad Request",
            "description": "code is missing.",
            "example": {
              "success": false,
              "error": "code is required"
            }
          },
          invalidBodyResponse,
          {
            "status": "401 Unauthorized",
            "description": "The code was not found or has expired.",
            "example": {
              "success": false,
              "error": "SAML exchange code not found or expired"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/federation/saml/metadata/{provider_identifier}",
      "summary": "Read service-provider SAML metadata XML.",
      "surface": publicIdentity,
      "details": {
        "overview": "Serves the service-provider SAML metadata XML for a configured SAML provider. Administrators import this XML into the IdP to establish the trust relationship, including our ACS and SLO endpoints and signing certificate.",
        "notes": [
          "The response Content-Type is application/samlmetadata+xml.",
          "The metadata is provider-scoped because each SAML provider has its own endpoints.",
          "No authentication is required to fetch metadata."
        ],
        "parameters": [
          {
            "name": "provider_identifier",
            "in": "path",
            "type": "string",
            "required": true,
            "description": "Identifier of the configured SAML provider."
          }
        ],
        "headers": publicReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The SP metadata XML document.",
            "example": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<md:EntityDescriptor xmlns:md=\"urn:oasis:names:tc:SAML:2.0:metadata\" entityID=\"https://identity-api.auth.example.com/saml/metadata/google-9d1d5b4d\">\n  <md:SPSSODescriptor AuthnRequestsSigned=\"true\" WantAssertionsSigned=\"true\">\n    <md:AssertionConsumerService Binding=\"urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST\" Location=\"https://identity-api.auth.example.com/api/v1/federation/saml/acs/google-9d1d5b4d\" index=\"0\"/>\n    <md:SingleLogoutService Binding=\"urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect\" Location=\"https://identity-api.auth.example.com/api/v1/federation/saml/slo/google-9d1d5b4d\"/>\n  </md:SPSSODescriptor>\n</md:EntityDescriptor>"
          },
          {
            "status": "400 Bad Request",
            "description": "provider_identifier is empty.",
            "example": {
              "success": false,
              "error": "provider_identifier is required"
            }
          },
          {
            "status": "404 Not Found",
            "description": "No SAML provider matches the identifier.",
            "example": {
              "success": false,
              "error": "saml provider not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/federation/saml/logout",
      "summary": "Start SAML logout with a browser redirect.",
      "surface": publicIdentity,
      "details": {
        "overview": "SP-initiated SAML Single Logout (GET binding). Ends the subject's local sessions, then redirects the browser to the IdP's SLO endpoint. The id_token_hint is the only credential this public surface has, and it identifies whose sessions end.",
        "notes": [
          "provider_identifier and id_token_hint are required.",
          "Local sessions are already revoked before the redirect is issued.",
          "The post_logout_redirect_uri, when present, is validated against the client's registered logout URIs.",
          "On success the response is a 302 redirect to the IdP's SLO URL."
        ],
        "parameters": [
          {
            "name": "provider_identifier",
            "in": "query",
            "type": "string",
            "required": true,
            "description": "Identifier of the configured SAML provider."
          },
          {
            "name": "id_token_hint",
            "in": "query",
            "type": "string (JWT)",
            "required": true,
            "description": "ID token identifying the subject whose sessions end."
          },
          {
            "name": "client_id",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Client identifier used to validate the post-logout redirect URI."
          },
          {
            "name": "post_logout_redirect_uri",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Registered post-logout landing URL."
          }
        ],
        "headers": publicReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "302 Found",
            "description": "The browser is redirected to the IdP's SLO endpoint with the LogoutRequest.",
            "example": {
              "Location": "https://idp.example.com/slo?SAMLRequest=...&RelayState=..."
            }
          },
          {
            "status": "400 Bad Request",
            "description": "A required parameter is missing.",
            "example": {
              "success": false,
              "error": "provider_identifier and id_token_hint are required"
            }
          },
          {
            "status": "404 Not Found",
            "description": "The provider does not exist, is not a SAML provider, or has no SLO URL configured.",
            "example": {
              "success": false,
              "error": "saml provider not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/federation/saml/logout",
      "summary": "Start SAML logout from a posted request.",
      "surface": publicIdentity,
      "details": {
        "overview": "Form-encoded variant of SP-initiated SAML Single Logout for relying parties that POST the logout request. Parameters are read from the form body; behavior matches the GET binding.",
        "notes": [
          "Accepts the same parameters as the GET variant, sent as form fields.",
          "Local sessions are revoked before the redirect is issued."
        ],
        "parameters": [],
        "headers": [
          {
            "name": "Content-Type",
            "value": "application/x-www-form-urlencoded",
            "required": true,
            "description": "The logout request is posted as a URL-encoded form."
          },
          noAuthHeader
        ],
        "requestBody": {
          "type": "URL-encoded form",
          "description": "SAML logout initiation payload.",
          "fields": [
            {
              "name": "provider_identifier",
              "type": "string",
              "required": true,
              "description": "Identifier of the configured SAML provider."
            },
            {
              "name": "id_token_hint",
              "type": "string (JWT)",
              "required": true,
              "description": "ID token identifying the subject whose sessions end."
            },
            {
              "name": "client_id",
              "type": "string",
              "required": false,
              "description": "Client identifier used to validate the post-logout redirect URI."
            },
            {
              "name": "post_logout_redirect_uri",
              "type": "string",
              "required": false,
              "description": "Registered post-logout landing URL."
            }
          ],
          "example": "provider_identifier=google-9d1d5b4d&id_token_hint=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...&client_id=app-web-client&post_logout_redirect_uri=https%3A%2F%2Fapp.example.com%2Flogout"
        },
        "responses": [
          {
            "status": "302 Found",
            "description": "The browser is redirected to the IdP's SLO endpoint with the LogoutRequest.",
            "example": {
              "Location": "https://idp.example.com/slo?SAMLRequest=...&RelayState=..."
            }
          },
          {
            "status": "400 Bad Request",
            "description": "The form could not be parsed or a required field is missing.",
            "example": {
              "success": false,
              "error": "provider_identifier and id_token_hint are required"
            }
          },
          {
            "status": "404 Not Found",
            "description": "The provider does not exist, is not a SAML provider, or has no SLO URL configured.",
            "example": {
              "success": false,
              "error": "saml provider not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/federation/saml/slo/{provider_identifier}",
      "summary": "Handle SAML single logout with GET binding.",
      "surface": publicIdentity,
      "details": {
        "overview": "The Single Logout endpoint published in our SP metadata (GET/HTTP-Redirect binding). It consumes the IdP's LogoutResponse (finishing a logout we started) and honors IdP-initiated LogoutRequests (which it answers with a LogoutResponse).",
        "notes": [
          "Unauthenticated by protocol design: trust comes from the IdP's XML signature.",
          "IdP-initiated LogoutRequests terminate the subject's local sessions and redirect back to the IdP carrying our LogoutResponse.",
          "SP-initiated LogoutResponses finish the flow and redirect to the validated post-logout landing page when one was recorded.",
          "When no redirect target remains, the endpoint returns a JSON success envelope."
        ],
        "parameters": [
          {
            "name": "provider_identifier",
            "in": "path",
            "type": "string",
            "required": true,
            "description": "Identifier of the configured SAML provider."
          },
          {
            "name": "SAMLRequest",
            "in": "query",
            "type": "string (base64 XML)",
            "required": false,
            "description": "IdP-initiated LogoutRequest."
          },
          {
            "name": "SAMLResponse",
            "in": "query",
            "type": "string (base64 XML)",
            "required": false,
            "description": "IdP's LogoutResponse to a logout we started."
          },
          {
            "name": "RelayState",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Opaque relay value issued at logout initiation."
          }
        ],
        "headers": publicReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "302 Found",
            "description": "The exchange produced a redirect: back to the IdP with our LogoutResponse, or to the recorded post-logout landing page.",
            "example": {
              "Location": "https://idp.example.com/slo?SAMLResponse=..."
            }
          },
          {
            "status": "200 OK",
            "description": "Logout completed and no redirect target remains.",
            "example": {
              "success": true,
              "data": null,
              "message": "logged out"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "provider_identifier is empty or the SAML message is malformed.",
            "example": {
              "success": false,
              "error": "provider_identifier is required"
            }
          },
          {
            "status": "401 Unauthorized",
            "description": "The SAML message failed signature verification.",
            "example": {
              "success": false,
              "error": "SAML single logout failed"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/federation/saml/slo/{provider_identifier}",
      "summary": "Handle SAML single logout with POST binding.",
      "surface": publicIdentity,
      "details": {
        "overview": "The Single Logout endpoint published in our SP metadata (POST binding). The IdP HTTP-POSTs its LogoutRequest or LogoutResponse here; behavior matches the GET binding.",
        "notes": [
          "Unauthenticated by protocol design: trust comes from the IdP's XML signature.",
          "Handles both IdP-initiated LogoutRequests and SP-initiated LogoutResponses."
        ],
        "parameters": [
          {
            "name": "provider_identifier",
            "in": "path",
            "type": "string",
            "required": true,
            "description": "Identifier of the configured SAML provider."
          }
        ],
        "headers": [
          {
            "name": "Content-Type",
            "value": "application/x-www-form-urlencoded",
            "required": true,
            "description": "The IdP posts the SAML message as a URL-encoded form."
          },
          noAuthHeader
        ],
        "requestBody": {
          "type": "URL-encoded form",
          "description": "SAML single logout message posted by the IdP.",
          "fields": [
            {
              "name": "SAMLRequest",
              "type": "string (base64 XML)",
              "required": false,
              "description": "IdP-initiated LogoutRequest."
            },
            {
              "name": "SAMLResponse",
              "type": "string (base64 XML)",
              "required": false,
              "description": "IdP's LogoutResponse to a logout we started."
            },
            {
              "name": "RelayState",
              "type": "string",
              "required": false,
              "description": "Opaque relay value issued at logout initiation."
            }
          ],
          "example": "SAMLResponse=PHNhbWxwOlJlc3BvbnNl...&RelayState=relay-9d1d5b4d3a"
        },
        "responses": [
          {
            "status": "302 Found",
            "description": "The exchange produced a redirect: back to the IdP with our LogoutResponse, or to the recorded post-logout landing page.",
            "example": {
              "Location": "https://idp.example.com/slo?SAMLResponse=..."
            }
          },
          {
            "status": "200 OK",
            "description": "Logout completed and no redirect target remains.",
            "example": {
              "success": true,
              "data": null,
              "message": "logged out"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "provider_identifier is empty or the SAML message is malformed.",
            "example": {
              "success": false,
              "error": "provider_identifier is required"
            }
          },
          {
            "status": "401 Unauthorized",
            "description": "The SAML message failed signature verification.",
            "example": {
              "success": false,
              "error": "SAML single logout failed"
            }
          },
          internalErrorResponse
        ]
      }
    }
  ]
};

export default group;
