// Endpoint details for this Auth API section.

const routerRoot = "Router root";
const publicIdentity = "Public identity API";
const management = "Internal management API";

const jsonContentHeader = {
  "name": "Content-Type",
  "value": "application/json",
  "required": true,
  "description": "Required when the endpoint accepts a JSON request body."
};

const formContentHeader = {
  "name": "Content-Type",
  "value": "application/x-www-form-urlencoded",
  "required": true,
  "description": "Required for form-encoded OAuth endpoints. The request body is a URL-encoded form, not JSON."
};

const jsonAcceptHeader = {
  "name": "Accept",
  "value": "application/json",
  "required": false,
  "description": "Use when the caller wants an explicit JSON response."
};

const basicAuthHeader = {
  "name": "Authorization",
  "value": "Basic <base64(client_id:client_secret)>",
  "required": false,
  "description": "Client authentication using HTTP Basic (RFC 6749 §2.3.1). Takes precedence over client credentials sent in the request body."
};

const bearerAuthHeader = {
  "name": "Authorization",
  "value": "Bearer <access_token>",
  "required": true,
  "description": "Required. The endpoint is mounted behind JWT authentication. The token must belong to an authenticated Auth user."
};

const noAuthHeader = {
  "name": "Authorization",
  "value": "Not required",
  "required": false,
  "description": "The endpoint performs no application-level bearer-token check. OAuth protocol endpoints authenticate the client with Basic auth or client credentials in the request body where required."
};

const publicReadHeaders = [jsonAcceptHeader, noAuthHeader];
const publicFormHeaders = [formContentHeader, jsonAcceptHeader, basicAuthHeader, noAuthHeader];
const jwtReadHeaders = [jsonAcceptHeader, bearerAuthHeader];
const jwtJsonHeaders = [jsonContentHeader, jsonAcceptHeader, bearerAuthHeader];
const jwtFormHeaders = [formContentHeader, jsonAcceptHeader, bearerAuthHeader];

const emptyBody = {
  "type": "None",
  "description": "This endpoint does not accept a request body.",
  "fields": [],
  "example": null
};

// OAuth 2.0 error responses follow RFC 6749 §5.2: a JSON object with an
// error code plus optional error_description. Cache-Control is no-store.
const oauthError = (status, code, description, exampleDescription) => ({
  "status": status,
  "description": description,
  "example": {
    "error": code,
    "error_description": exampleDescription || description
  }
});

const oauthInvalidRequest = oauthError("400 Bad Request", "invalid_request", "A required parameter is missing, malformed, or fails validation.");
const oauthInvalidClient = oauthError("401 Unauthorized", "invalid_client", "Client authentication failed or the token endpoint authentication method is not supported.");
const oauthUnauthorizedClient = oauthError("401 Unauthorized", "unauthorized_client", "The client is not allowed to use the requested grant type or endpoint.");
const oauthInvalidGrant = oauthError("400 Bad Request", "invalid_grant", "The authorization code, refresh token, or other credential is invalid, expired, revoked, or was issued to another client.");
const oauthInvalidScope = oauthError("400 Bad Request", "invalid_scope", "The requested scope is invalid, unknown, or malformed.");
const oauthInvalidTarget = oauthError("400 Bad Request", "invalid_target", "The requested resource or audience is not one the caller may address.");
const oauthUnsupportedGrantType = oauthError("400 Bad Request", "unsupported_grant_type", "The requested grant_type is not supported by the authorization server.");
const oauthUnsupportedResponseType = oauthError("400 Bad Request", "unsupported_response_type", "The requested response_type is not supported.");
const oauthAccessDenied = oauthError("403 Forbidden", "access_denied", "The resource owner or the server denied the request.");
const oauthLoginRequired = oauthError("401 Unauthorized", "login_required", "No authenticated session is present. The hosted identity app must log the user in and re-issue the authorization request.");
const oauthConsentRequiredError = oauthError("403 Forbidden", "consent_required", "User consent is required but has not been given.");
const oauthInteractionRequired = oauthError("403 Forbidden", "interaction_required", "The request cannot complete without user interaction.");
const oauthServerError = oauthError("500 Internal Server Error", "server_error", "An unexpected internal error occurred. The description does not leak internal details.");

const validationErrorResponse = {
  "status": "400 Bad Request",
  "description": "The query string, form body, or JSON body failed validation.",
  "example": {
    "success": false,
    "error": "Validation failed",
    "details": {
      "redirect_uri": "redirect_uri is required"
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

const authRequiredResponse = {
  "status": "401 Unauthorized",
  "description": "The caller is not authenticated as an Auth user.",
  "example": {
    "success": false,
    "error": "Authentication required"
  }
};

const forbiddenResponse = {
  "status": "403 Forbidden",
  "description": "The authenticated caller does not hold the required permission.",
  "example": {
    "success": false,
    "error": "Forbidden"
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

const oAuthErrorResponses = [oauthInvalidRequest, oauthInvalidClient, oauthUnauthorizedClient, oauthInvalidGrant, oauthInvalidScope, oauthServerError];

const discoveryExample = {
  "issuer": "https://identity-api.auth.example.com",
  "authorization_endpoint": "https://identity-api.auth.example.com/api/v1/oauth/authorize",
  "token_endpoint": "https://identity-api.auth.example.com/api/v1/oauth/token",
  "userinfo_endpoint": "https://identity-api.auth.example.com/api/v1/oauth/userinfo",
  "jwks_uri": "https://identity-api.auth.example.com/.well-known/jwks.json",
  "revocation_endpoint": "https://identity-api.auth.example.com/api/v1/oauth/revoke",
  "end_session_endpoint": "https://identity-api.auth.example.com/api/v1/oauth/end_session",
  "pushed_authorization_request_endpoint": "https://identity-api.auth.example.com/api/v1/oauth/par",
  "device_authorization_endpoint": "https://identity-api.auth.example.com/api/v1/oauth/device_authorization",
  "backchannel_authentication_endpoint": "https://identity-api.auth.example.com/api/v1/oauth/ciba",
  "scopes_supported": ["openid", "profile", "email", "offline_access"],
  "response_types_supported": ["code"],
  "response_modes_supported": ["query"],
  "grant_types_supported": [
    "authorization_code",
    "refresh_token",
    "client_credentials",
    "urn:ietf:params:oauth:grant-type:device_code",
    "urn:ietf:params:oauth:grant-type:token-exchange",
    "urn:openid:params:grant-type:ciba"
  ],
  "subject_types_supported": ["public"],
  "id_token_signing_alg_values_supported": ["RS256"],
  "token_endpoint_auth_methods_supported": ["client_secret_basic", "client_secret_post", "none", "private_key_jwt", "client_secret_jwt"],
  "token_endpoint_auth_signing_alg_values_supported": ["RS256", "RS384", "RS512", "ES256", "ES384", "ES512"],
  "acr_values_supported": ["1", "2"],
  "claims_supported": [
    "sub", "iss", "aud", "exp", "iat", "nbf", "jti", "auth_time",
    "nonce", "acr", "amr", "sid", "scope", "client_id",
    "email", "email_verified", "phone_number", "phone_number_verified",
    "name", "picture", "updated_at"
  ],
  "code_challenge_methods_supported": ["S256"],
  "request_parameter_supported": false,
  "request_uri_parameter_supported": true,
  "dpop_signing_alg_values_supported": ["RS256", "RS384", "RS512", "ES256", "ES384", "ES512"]
};

const asMetadataExample = {
  "issuer": "https://identity-api.auth.example.com",
  "authorization_endpoint": "https://identity-api.auth.example.com/api/v1/oauth/authorize",
  "token_endpoint": "https://identity-api.auth.example.com/api/v1/oauth/token",
  "jwks_uri": "https://identity-api.auth.example.com/.well-known/jwks.json",
  "revocation_endpoint": "https://identity-api.auth.example.com/api/v1/oauth/revoke",
  "pushed_authorization_request_endpoint": "https://identity-api.auth.example.com/api/v1/oauth/par",
  "device_authorization_endpoint": "https://identity-api.auth.example.com/api/v1/oauth/device_authorization",
  "backchannel_authentication_endpoint": "https://identity-api.auth.example.com/api/v1/oauth/ciba",
  "end_session_endpoint": "https://identity-api.auth.example.com/api/v1/oauth/end_session",
  "scopes_supported": ["openid", "profile", "email", "offline_access"],
  "response_types_supported": ["code"],
  "grant_types_supported": [
    "authorization_code",
    "refresh_token",
    "client_credentials",
    "urn:ietf:params:oauth:grant-type:device_code",
    "urn:ietf:params:oauth:grant-type:token-exchange",
    "urn:openid:params:grant-type:ciba"
  ],
  "token_endpoint_auth_methods_supported": ["client_secret_basic", "client_secret_post", "none", "private_key_jwt", "client_secret_jwt"],
  "token_endpoint_auth_signing_alg_values_supported": ["RS256", "RS384", "RS512", "ES256", "ES384", "ES512"],
  "code_challenge_methods_supported": ["S256"],
  "backchannel_token_delivery_modes_supported": ["poll"],
  "dpop_signing_alg_values_supported": ["RS256", "RS384", "RS512", "ES256", "ES384", "ES512"]
};

const jwksExample = {
  "keys": [
    {
      "kty": "RSA",
      "use": "sig",
      "kid": "2025-04-01T00-00-00Z",
      "alg": "RS256",
      "n": "0vx7agoebGcQSuuPiLJXZptN9nndrQmbXEps2aiAFbWhM78LhWx4cbbfAAtVT86zwu1RK7aPFFxuhDR1L6tSoc_BJECPebWKRXjBZCiFV4n3oknjhMstn64tZ_2W-5JsGY4Hc5n9yBXArwl93lqt7_RN5w6Cf0h4QyQ5v-65YGjQR0_FDW2QvzqY368QQMicAtaSqzs8KJZgnYb9c7d0zgdAZHzu6qMQvRL5hajrn1n91CbOpbISD08qNLyrdkt-bFTWhAI4vMQFh6WeZu0fM4lFd2NcRwr3XPksINHaQ-G_xBniIqbw0Ls1jF44-csFCur-kEgU8awapJzKnqDKgw",
      "e": "AQAB"
    }
  ]
};

const tokenExample = {
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "rt_7b2d2d0e3c5b4f0a9c1d",
  "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "scope": "openid email profile"
};

const authorizeSuccessResponse = {
  "status": "200 OK",
  "description": "The user is authenticated and the client is allowed to proceed. The redirect_uri carries the authorization code and state; the hosted identity app sends the browser there.",
  "example": {
    "success": true,
    "data": {
      "redirect_uri": "https://app.example.com/auth/callback?code=authcode_9d1d5b4d3a&state=K8f3n2v9sL0pQ4x7"
    },
    "message": "Authorization successful"
  }
};

const consentRequiredResponse = {
  "status": "200 OK",
  "description": "The user must approve the requested scopes before a code can be issued. The hosted identity app loads the challenge with GET /oauth/consent/{challenge_id}.",
  "example": {
    "success": true,
    "data": {
      "consent_challenge": "b0e9a882-308a-44c4-bb4d-7615975d5d2a"
    },
    "message": "Consent required"
  }
};

const brokerRedirectResponse = {
  "status": "200 OK",
  "description": "idp_hint was provided, so the broker leg started. The redirect_uri points at the upstream identity provider; the hosted identity app sends the browser there.",
  "example": {
    "success": true,
    "data": {
      "redirect_uri": "https://accounts.example.com/o/oauth2/v2/auth?client_id=external-client&scope=openid%20email"
    },
    "message": "Redirecting to identity provider"
  }
};

const emptyOkResponse = (message) => ({
  "status": "200 OK",
  "description": message,
  "example": {
    "success": true,
    "data": null,
    "message": message
  }
});

const group = {
  "slug": "oauth-oidc",
  "label": "OAuth 2.0 and OIDC",
  "description": "Authorization server APIs for authorization code, PKCE, consent, token exchange, introspection, discovery, JWKS, userinfo, logout, PAR, device flow, CIBA, broker callbacks, signing keys, and dynamic client registration.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/.well-known/openid-configuration",
      "summary": "OpenID Connect discovery metadata.",
      "surface": routerRoot,
      "details": {
        "overview": "Publishes the OpenID Connect Discovery 1.0 document. Applications and OIDC libraries load this document to discover the issuer, authorization, token, userinfo, JWKS, revocation, logout, PAR, device, and CIBA endpoints without hard-coding protocol locations.",
        "notes": [
          "The issuer is the configured public identity origin (APP_PUBLIC_HOSTNAME).",
          "introspection_endpoint is deliberately omitted because POST /oauth/introspect is only mounted on the internal control plane.",
          "request_parameter_supported is false: signed request objects (JAR) are not implemented. Use PAR (request_uri) instead.",
          "acr_values_supported advertises 1 (single-factor) and 2 (multi-factor) so relying parties can request step-up at the protocol level.",
          "The response is cacheable with the discovery cache max age."
        ],
        "parameters": [],
        "headers": publicReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The OpenID Connect discovery document.",
            "example": discoveryExample
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/.well-known/oauth-authorization-server",
      "summary": "OAuth 2.0 authorization server metadata.",
      "surface": routerRoot,
      "details": {
        "overview": "Publishes the RFC 8414 OAuth 2.0 Authorization Server Metadata document. It is the OAuth-only counterpart of the OIDC discovery document and omits OIDC-specific fields such as userinfo_endpoint and id_token_signing_alg_values_supported.",
        "notes": [
          "registration_endpoint is deliberately omitted: Dynamic Client Registration is mounted on the internal control plane only and is not reachable on the public host.",
          "introspection_endpoint is omitted for the same control-plane reason.",
          "backchannel_token_delivery_modes_supported advertises poll, the only CIBA delivery mode implemented.",
          "The response is cacheable with the discovery cache max age."
        ],
        "parameters": [],
        "headers": publicReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The OAuth 2.0 authorization server metadata document.",
            "example": asMetadataExample
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/.well-known/jwks.json",
      "summary": "JSON Web Key Set for token verification.",
      "surface": routerRoot,
      "details": {
        "overview": "Publishes the public JSON Web Key Set (RFC 7517) that relying parties use to verify access-token and ID-token signatures. The set is the union of database-backed global signing keys and the in-memory key store, de-duplicated by key ID.",
        "notes": [
          "Published keys are RSA public keys with use=sig and alg=RS256. Private material is never exposed.",
          "Publishing the union guarantees every key that could have signed an in-flight token is listed, including keys the boot-time rotation runner installed in memory.",
          "Cache the response according to the discovery cache max age and refresh when a token header carries an unknown kid.",
          "A 500 error means the server has no signing key material loaded at all."
        ],
        "parameters": [],
        "headers": publicReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The current JSON Web Key Set.",
            "example": jwksExample
          },
          {
            "status": "500 Internal Server Error",
            "description": "No signing keys are initialised, so no token can be verified.",
            "example": {
              "error": "keys not initialised"
            }
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/oauth/authorize",
      "summary": "Start an OAuth authorization request.",
      "surface": publicIdentity,
      "details": {
        "overview": "The OAuth 2.0 authorization endpoint (RFC 6749 §4.1.1). It is session-aware: with a valid Auth session it validates the client, applies tenant policy, and returns a redirect carrying an authorization code (or a consent challenge); without a session it validates the request enough to be safe and responds with login_required so the hosted identity app renders login and re-issues the request.",
        "notes": [
          "Only response_type=code is supported. response_mode is limited to query.",
          "When request_uri (PAR) is present, the pushed request replaces the query parameters wholesale; the client_id on the wire must match the pushed client.",
          "The request (JAR) parameter is rejected with request_not_supported rather than silently ignored.",
          "idp_hint starts the brokered identity-provider leg. Combined with prompt=none it returns interaction_required.",
          "prompt=none is the only supported prompt value.",
          "screen_hint=signup without a session persists the pending request and returns a request_id plus an httpOnly browser-binding cookie that POST /oauth/authorize/continue must match.",
          "Tenant context resolves from the incoming host (Origin → X-Forwarded-Host → Host) and the client_id-to-tenant binding."
        ],
        "parameters": [
          {
            "name": "response_type",
            "in": "query",
            "type": "string",
            "required": true,
            "description": "Must be code."
          },
          {
            "name": "client_id",
            "in": "query",
            "type": "string",
            "required": true,
            "description": "Application client identifier. Maximum 255 characters."
          },
          {
            "name": "redirect_uri",
            "in": "query",
            "type": "string",
            "required": true,
            "description": "Exact registered callback URL. Maximum 2048 characters and must match one of the client's redirect URIs."
          },
          {
            "name": "scope",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Space-separated requested scopes. Maximum 1024 characters. Include openid for OIDC login."
          },
          {
            "name": "state",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Opaque CSRF binding value. Maximum 512 characters and echoed back in the redirect."
          },
          {
            "name": "nonce",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "OIDC nonce bound to the ID token. Maximum 512 characters."
          },
          {
            "name": "code_challenge",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "PKCE challenge derived from the client's one-time verifier. Between 43 and 128 characters."
          },
          {
            "name": "code_challenge_method",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Must be S256 when present."
          },
          {
            "name": "idp_hint",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Directs the user to a specific connected identity provider. Maximum 255 characters."
          },
          {
            "name": "screen_hint",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "UI hint. Must be signup or login when present."
          },
          {
            "name": "registration_flow",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Registration flow selector for signup. Maximum 255 characters."
          },
          {
            "name": "prompt",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Only none is supported."
          },
          {
            "name": "acr_values",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Requested authentication context classes. Maximum 255 characters. Use the values advertised by discovery (1 or 2)."
          },
          {
            "name": "max_age",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Maximum acceptable session age in seconds. Must be a non-negative integer. 0 forces re-authentication."
          },
          {
            "name": "login_hint",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Prefills the identifier on the hosted login page. Maximum 320 characters. Not proof of identity."
          },
          {
            "name": "response_mode",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Only query is supported."
          },
          {
            "name": "ui_locales",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Preferred rendering locale list. Maximum 255 characters."
          },
          {
            "name": "request_uri",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "PAR handle from POST /oauth/par. When present it replaces the other query parameters."
          },
          {
            "name": "request",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "JAR request object. Rejected with request_not_supported."
          }
        ],
        "headers": publicReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          authorizeSuccessResponse,
          consentRequiredResponse,
          brokerRedirectResponse,
          oauthLoginRequired,
          oauthInteractionRequired,
          validationErrorResponse,
          oauthInvalidRequest,
          oauthInvalidClient,
          oauthUnauthorizedClient,
          oauthInvalidScope,
          oauthAccessDenied,
          oauthUnsupportedResponseType,
          oauthServerError
        ]
      }
    },
    {
      "method": "GET",
      "path": "/oauth/consent/{challenge_id}",
      "summary": "Read consent challenge details.",
      "surface": publicIdentity,
      "details": {
        "overview": "Returns the pending consent challenge so the hosted identity app can render the consent screen: which application is asking, which scopes it wants, where the browser will be sent, and when the challenge expires.",
        "notes": [
          "Challenges are short-lived (10 minutes).",
          "The challenge is scoped to the authenticated user; a different user cannot read it.",
          "Consent challenges are created by the authorization endpoint when tenant or client policy requires user approval."
        ],
        "parameters": [
          {
            "name": "challenge_id",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the pending consent challenge returned by GET /oauth/authorize or POST /oauth/authorize/continue."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The consent challenge was retrieved.",
            "example": {
              "success": true,
              "data": {
                "challenge_id": "b0e9a882-308a-44c4-bb4d-7615975d5d2a",
                "client_name": "Example App",
                "client_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "scopes": ["openid", "email", "profile"],
                "redirect_uri": "https://app.example.com/auth/callback",
                "expires_at": 1765209600
              },
              "message": "Consent challenge retrieved"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "The challenge_id path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid challenge ID"
            }
          },
          authRequiredResponse,
          {
            "status": "404 Not Found",
            "description": "No pending challenge matches the ID for this user, or it has expired.",
            "example": {
              "success": false,
              "error": "consent challenge not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/oauth/consent",
      "summary": "Submit a consent allow or deny decision.",
      "surface": publicIdentity,
      "details": {
        "overview": "Processes the user's consent decision for a pending challenge. On approval the service persists a consent grant and returns the redirect URI carrying the authorization code; on denial it returns a redirect URI carrying the OAuth error parameters.",
        "notes": [
          "The decision is scoped to the authenticated user.",
          "Approving records a consent grant that later authorization requests can reuse according to tenant consent policy.",
          "Denying returns access_denied on the redirect; the user can be asked again on the next authorization request."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Consent decision payload.",
          "fields": [
            {
              "name": "challenge_id",
              "type": "string (UUID)",
              "required": true,
              "description": "UUID of the pending consent challenge."
            },
            {
              "name": "approved",
              "type": "boolean",
              "required": true,
              "description": "true to approve and issue a code; false to deny the request."
            }
          ],
          "example": {
            "challenge_id": "b0e9a882-308a-44c4-bb4d-7615975d5d2a",
            "approved": true
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The decision was processed. redirect_uri carries the authorization code (approved) or the error parameters (denied).",
            "example": {
              "success": true,
              "data": {
                "redirect_uri": "https://app.example.com/auth/callback?code=authcode_9d1d5b4d3a&state=K8f3n2v9sL0pQ4x7"
              },
              "message": "Consent processed"
            }
          },
          authRequiredResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "400 Bad Request",
            "description": "The challenge is expired or does not match the authenticated user.",
            "example": {
              "error": "invalid_request",
              "error_description": "consent challenge not found"
            }
          },
          oauthServerError
        ]
      }
    },
    {
      "method": "POST",
      "path": "/oauth/authorize/continue",
      "summary": "Continue an interrupted authorization flow.",
      "surface": publicIdentity,
      "details": {
        "overview": "Resumes a persisted authorization request after the user finished an interrupted step such as signup. The request_id must be accompanied by the httpOnly browser-binding cookie set when the request was prepared (screen_hint=signup); the service compares it against the stored secret hash before issuing a code.",
        "notes": [
          "The binding cookie prevents a leaked request_id from being continued from another browser or session.",
          "The cookie is cleared (spent) after a successful or rejected continuation.",
          "The response shape matches GET /oauth/authorize: redirect_uri or consent_challenge."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Authorization continuation payload.",
          "fields": [
            {
              "name": "request_id",
              "type": "string",
              "required": true,
              "description": "Opaque request identifier returned by the login_required response of GET /oauth/authorize when screen_hint=signup."
            }
          ],
          "example": {
            "request_id": "authreq_9d1d5b4d3a"
          }
        },
        "responses": [
          authorizeSuccessResponse,
          consentRequiredResponse,
          authRequiredResponse,
          {
            "status": "400 Bad Request",
            "description": "request_id is missing.",
            "example": {
              "success": false,
              "error": "request_id is required"
            }
          },
          invalidBodyResponse,
          oauthInvalidRequest,
          oauthAccessDenied,
          oauthServerError
        ]
      }
    },
    {
      "method": "POST",
      "path": "/oauth/broker/resume",
      "summary": "Resume a brokered identity-provider authorization flow.",
      "surface": publicIdentity,
      "details": {
        "overview": "Completes a brokered OAuth flow after the user confirms an account link that was triggered by a social-login email collision. It redeems the confirmed link token and the pending broker session, issues an authorization code for the linked user, and returns the downstream redirect URL.",
        "notes": [
          "Both broker_session_id and account_link_token are required.",
          "When the resume issues an SSO access token, it is also delivered as httpOnly auth cookies.",
          "The response exposes the downstream redirect_url, not internal IDs."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Broker resume payload.",
          "fields": [
            {
              "name": "broker_session_id",
              "type": "string (UUID)",
              "required": true,
              "description": "UUID of the pending broker session created during the upstream provider leg."
            },
            {
              "name": "account_link_token",
              "type": "string",
              "required": true,
              "description": "Confirmed account-link token from the account-link flow."
            }
          ],
          "example": {
            "broker_session_id": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "account_link_token": "linktoken_9d1d5b4d3a"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The broker flow was resumed and the downstream redirect URL was returned. access_token is present when an SSO token was issued.",
            "example": {
              "success": true,
              "data": {
                "redirect_url": "https://app.example.com/auth/callback?code=authcode_9d1d5b4d3a&state=K8f3n2v9sL0pQ4x7",
                "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
              },
              "message": ""
            }
          },
          authRequiredResponse,
          {
            "status": "400 Bad Request",
            "description": "broker_session_id or account_link_token is missing.",
            "example": {
              "success": false,
              "error": "broker_session_id and account_link_token are required"
            }
          },
          invalidBodyResponse,
          oauthInvalidGrant,
          oauthServerError
        ]
      }
    },
    {
      "method": "GET",
      "path": "/oauth/userinfo",
      "summary": "Read OpenID Connect UserInfo claims.",
      "surface": publicIdentity,
      "details": {
        "overview": "The OpenID Connect UserInfo endpoint (OIDC Core §5.3). Returns claims about the authenticated user based on the scopes present in the access token: email claims require the email scope, phone claims require the phone scope, and profile claims require the profile scope.",
        "notes": [
          "sub is always returned and mirrors the token subject.",
          "The name claim is composed from the user profile display name, falling back to first and last name.",
          "The response uses Cache-Control: no-store.",
          "Resource authorization should validate access tokens, not rely on UserInfo alone."
        ],
        "parameters": [],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "UserInfo claims for the authenticated user, filtered by token scopes.",
            "example": {
              "sub": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "email": "alex@example.com",
              "email_verified": true,
              "name": "Alex Rivera",
              "picture": "https://profiles.auth.example.com/alex.png",
              "updated_at": 1765209600
            }
          },
          {
            "status": "401 Unauthorized",
            "description": "The access token is invalid or has expired.",
            "example": {
              "error": "invalid_token",
              "error_description": "the access token is invalid or has expired"
            }
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/oauth/consent/grants",
      "summary": "List consent grants for the authenticated user.",
      "surface": publicIdentity,
      "details": {
        "overview": "Returns every consent grant the authenticated user has previously approved, so account settings can show which applications have standing access and let the user revoke them individually.",
        "notes": [
          "Grants are scoped to the authenticated user only.",
          "Revoking a grant forces the application to ask for consent again on its next authorization request."
        ],
        "parameters": [],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The user's consent grants.",
            "example": {
              "success": true,
              "data": [
                {
                  "consent_grant_id": "b0e9a882-308a-44c4-bb4d-7615975d5d2a",
                  "client_name": "Example App",
                  "client_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                  "scopes": ["openid", "email", "profile"],
                  "granted_at": "2026-08-01T09:00:00Z",
                  "updated_at": "2026-08-01T09:00:00Z"
                }
              ],
              "message": "Consent grants retrieved"
            }
          },
          authRequiredResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/oauth/consent/grants/{grant_uuid}",
      "summary": "Revoke one consent grant.",
      "surface": publicIdentity,
      "details": {
        "overview": "Revokes a single consent grant owned by the authenticated user. The application must request consent again on its next authorization request for the affected scopes.",
        "notes": [
          "Only grants owned by the authenticated user can be revoked.",
          "The endpoint is idempotent from the caller's perspective: revoking an already-revoked grant is safe."
        ],
        "parameters": [
          {
            "name": "grant_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the consent grant to revoke, from GET /oauth/consent/grants."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          emptyOkResponse("Consent grant revoked"),
          {
            "status": "400 Bad Request",
            "description": "The grant_uuid path value is not a valid UUID.",
            "example": {
              "success": false,
              "error": "Invalid grant UUID"
            }
          },
          authRequiredResponse,
          {
            "status": "404 Not Found",
            "description": "The grant does not exist or belongs to another user.",
            "example": {
              "success": false,
              "error": "consent grant not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/oauth/device",
      "summary": "Approve a device flow user code.",
      "surface": publicIdentity,
      "details": {
        "overview": "Approves a pending OAuth device authorization request (RFC 8628). The authenticated user submits the user_code shown on the device at the verification URI; the device then polls the token endpoint until the result is available.",
        "notes": [
          "Both user and tenant context are required; a caller without a resolved tenant is refused.",
          "The user_code must be 8 characters in XXXX-XXXX format (the hyphen is trimmed before matching).",
          "Device codes expire after 15 minutes."
        ],
        "parameters": [],
        "headers": jwtFormHeaders,
        "requestBody": {
          "type": "URL-encoded form",
          "description": "Device user-code approval payload.",
          "fields": [
            {
              "name": "user_code",
              "type": "string",
              "required": true,
              "description": "User-facing code shown on the device, 8 characters in XXXX-XXXX format."
            }
          ],
          "example": "user_code=WDJB-MJHT"
        },
        "responses": [
          emptyOkResponse("device authorized"),
          authRequiredResponse,
          validationErrorResponse,
          oauthInvalidGrant,
          oauthAccessDenied,
          oauthServerError
        ]
      }
    },
    {
      "method": "POST",
      "path": "/oauth/device/deny",
      "summary": "Deny a device flow user code.",
      "surface": publicIdentity,
      "details": {
        "overview": "Denies a pending OAuth device authorization request. The device's next poll receives an access_denied error and the device code stops being redeemable.",
        "notes": [
          "Both user and tenant context are required.",
          "The user_code must be 8 characters in XXXX-XXXX format."
        ],
        "parameters": [],
        "headers": jwtFormHeaders,
        "requestBody": {
          "type": "URL-encoded form",
          "description": "Device user-code denial payload.",
          "fields": [
            {
              "name": "user_code",
              "type": "string",
              "required": true,
              "description": "User-facing code shown on the device, 8 characters in XXXX-XXXX format."
            }
          ],
          "example": "user_code=WDJB-MJHT"
        },
        "responses": [
          emptyOkResponse("device authorization denied"),
          authRequiredResponse,
          validationErrorResponse,
          oauthInvalidGrant,
          oauthServerError
        ]
      }
    },
    {
      "method": "POST",
      "path": "/oauth/ciba/approve",
      "summary": "Approve a CIBA authentication request.",
      "surface": publicIdentity,
      "details": {
        "overview": "Approves a pending Client-Initiated Backchannel Authentication request (OpenID CIBA Core §7.2). The authenticated user confirms the out-of-band authentication request; the initiating client's next poll receives tokens.",
        "notes": [
          "Both user and tenant context are required; the approval binds to the caller's (user, tenant) pair.",
          "CIBA requests expire after 5 minutes and are polled with a 5-second interval."
        ],
        "parameters": [],
        "headers": jwtFormHeaders,
        "requestBody": {
          "type": "URL-encoded form",
          "description": "CIBA approval payload.",
          "fields": [
            {
              "name": "auth_req_id",
              "type": "string",
              "required": true,
              "description": "Authentication request identifier from the CIBA initiation response."
            }
          ],
          "example": "auth_req_id=ar-9d1d5b4d3a"
        },
        "responses": [
          emptyOkResponse("request approved"),
          authRequiredResponse,
          {
            "status": "400 Bad Request",
            "description": "auth_req_id is missing.",
            "example": {
              "success": false,
              "error": "auth_req_id is required"
            }
          },
          oauthInvalidGrant,
          oauthAccessDenied,
          oauthServerError
        ]
      }
    },
    {
      "method": "POST",
      "path": "/oauth/ciba/deny",
      "summary": "Deny a CIBA authentication request.",
      "surface": publicIdentity,
      "details": {
        "overview": "Denies a pending CIBA authentication request. The initiating client's next poll receives an access_denied error.",
        "notes": [
          "Both user and tenant context are required.",
          "Denial events are audited."
        ],
        "parameters": [],
        "headers": jwtFormHeaders,
        "requestBody": {
          "type": "URL-encoded form",
          "description": "CIBA denial payload.",
          "fields": [
            {
              "name": "auth_req_id",
              "type": "string",
              "required": true,
              "description": "Authentication request identifier from the CIBA initiation response."
            }
          ],
          "example": "auth_req_id=ar-9d1d5b4d3a"
        },
        "responses": [
          emptyOkResponse("request denied"),
          authRequiredResponse,
          {
            "status": "400 Bad Request",
            "description": "auth_req_id is missing.",
            "example": {
              "success": false,
              "error": "auth_req_id is required"
            }
          },
          oauthInvalidGrant,
          oauthServerError
        ]
      }
    },
    {
      "method": "GET",
      "path": "/oauth/end_session",
      "summary": "Start RP-initiated logout.",
      "surface": publicIdentity,
      "details": {
        "overview": "RP-Initiated Logout (OIDC Session Management 1.0 §5). Ends the browser session by clearing the auth cookies, terminating the session identified by id_token_hint, revoking the session-scoped refresh tokens, and redirecting to the registered post-logout redirect URI when one was validated.",
        "notes": [
          "id_token_hint validation failure is silently ignored per OIDC Session Management §5.",
          "With a valid sid the logout is scoped to that session; without one the user's refresh tokens are revoked as a fallback.",
          "post_logout_redirect_uri is only honored when it is a valid, safe URL registered on the client.",
          "The response clears the access, ID, and refresh auth cookies."
        ],
        "parameters": [
          {
            "name": "id_token_hint",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Previously issued ID token used to identify the session to end."
          },
          {
            "name": "client_id",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Client identifier used together with id_token_hint to resolve the user."
          },
          {
            "name": "post_logout_redirect_uri",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Registered post-logout return URL. Maximum 2048 characters."
          },
          {
            "name": "state",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Opaque value echoed back on the post-logout redirect. Maximum 512 characters."
          }
        ],
        "headers": publicReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "302 Found",
            "description": "The browser is redirected to the validated, registered post-logout redirect URI with state appended.",
            "example": {
              "Location": "https://app.example.com/logout/done?state=K8f3n2v9sL0pQ4x7"
            }
          },
          emptyOkResponse("session ended")
        ]
      }
    },
    {
      "method": "POST",
      "path": "/oauth/end_session",
      "summary": "Submit RP-initiated logout.",
      "surface": publicIdentity,
      "details": {
        "overview": "Form-encoded variant of RP-Initiated Logout for relying parties that POST the logout request instead of redirecting the browser with a query string. Behavior matches GET /oauth/end_session.",
        "notes": [
          "Accepts the same parameters as the GET variant, sent as form fields.",
          "The response clears the auth cookies and redirects only when the post-logout redirect URI is validated and registered."
        ],
        "parameters": [],
        "headers": publicFormHeaders,
        "requestBody": {
          "type": "URL-encoded form",
          "description": "RP-initiated logout payload.",
          "fields": [
            {
              "name": "id_token_hint",
              "type": "string",
              "required": false,
              "description": "Previously issued ID token used to identify the session to end."
            },
            {
              "name": "client_id",
              "type": "string",
              "required": false,
              "description": "Client identifier used together with id_token_hint to resolve the user."
            },
            {
              "name": "post_logout_redirect_uri",
              "type": "string",
              "required": false,
              "description": "Registered post-logout return URL. Maximum 2048 characters."
            },
            {
              "name": "state",
              "type": "string",
              "required": false,
              "description": "Opaque value echoed back on the post-logout redirect. Maximum 512 characters."
            }
          ],
          "example": "id_token_hint=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...&client_id=app-web-client&post_logout_redirect_uri=https%3A%2F%2Fapp.example.com%2Flogout%2Fdone&state=K8f3n2v9sL0pQ4x7"
        },
        "responses": [
          {
            "status": "302 Found",
            "description": "The browser is redirected to the validated, registered post-logout redirect URI with state appended.",
            "example": {
              "Location": "https://app.example.com/logout/done?state=K8f3n2v9sL0pQ4x7"
            }
          },
          emptyOkResponse("session ended"),
          {
            "status": "400 Bad Request",
            "description": "The form body could not be parsed.",
            "example": {
              "success": false,
              "error": "invalid form data"
            }
          }
        ]
      }
    },
    {
      "method": "POST",
      "path": "/oauth/token",
      "summary": "Exchange grants for tokens.",
      "surface": publicIdentity,
      "details": {
        "overview": "The OAuth 2.0 token endpoint (RFC 6749 §4.1.3, §4.4, §6). Dispatches by grant_type: authorization_code, refresh_token, and client_credentials are handled by the core token service; device_code, token-exchange, and ciba grants are routed to their dedicated handlers. On success it returns access tokens (plus refresh and ID tokens when the grant and client entitle them).",
        "notes": [
          "Client authentication resolves from the HTTP Basic Authorization header first, then from client_id/client_secret in the form body (client_secret_post). private_key_jwt and client_secret_jwt use client_assertion_type and client_assertion.",
          "token_endpoint_auth_method=none is accepted only for public client types.",
          "mTLS token endpoint authentication is rejected explicitly as unsupported.",
          "DPoP proofs are validated when present; clients with dpop_required=true must complete the DPoP-Nonce challenge first.",
          "X-Token-Delivery: cookie delivers tokens as httpOnly cookies for the admin console in addition to the JSON body.",
          "All responses use Cache-Control: no-store."
        ],
        "parameters": [],
        "headers": [formContentHeader, jsonAcceptHeader, basicAuthHeader, noAuthHeader],
        "requestBody": {
          "type": "URL-encoded form",
          "description": "Token exchange payload. Field requirements depend on the grant type.",
          "fields": [
            {
              "name": "grant_type",
              "type": "string",
              "required": true,
              "description": "One of authorization_code, refresh_token, client_credentials for the core service, or urn:ietf:params:oauth:grant-type:device_code, urn:ietf:params:oauth:grant-type:token-exchange, urn:openid:params:grant-type:ciba for the specialized handlers."
            },
            {
              "name": "code",
              "type": "string",
              "required": false,
              "description": "Authorization code. Required for authorization_code."
            },
            {
              "name": "redirect_uri",
              "type": "string",
              "required": false,
              "description": "Must byte-for-byte match the redirect_uri used on the authorization request. Required for authorization_code."
            },
            {
              "name": "code_verifier",
              "type": "string",
              "required": false,
              "description": "PKCE verifier for authorization_code when a code_challenge was used."
            },
            {
              "name": "refresh_token",
              "type": "string",
              "required": false,
              "description": "Refresh token to rotate. Required for refresh_token."
            },
            {
              "name": "scope",
              "type": "string",
              "required": false,
              "description": "Requested scope. For refresh_token it must not exceed the originally granted scope."
            },
            {
              "name": "audience",
              "type": "string",
              "required": false,
              "description": "RFC 8707 audience identifier for a registered resource API."
            },
            {
              "name": "resource",
              "type": "string",
              "required": false,
              "description": "RFC 8707 resource identifier for a registered resource API."
            },
            {
              "name": "client_id",
              "type": "string",
              "required": false,
              "description": "Client identifier when using client_secret_post or a public client."
            },
            {
              "name": "client_secret",
              "type": "string",
              "required": false,
              "description": "Client secret when using client_secret_post."
            },
            {
              "name": "client_assertion_type",
              "type": "string",
              "required": false,
              "description": "Assertion type URI for private_key_jwt or client_secret_jwt (RFC 7523)."
            },
            {
              "name": "client_assertion",
              "type": "string",
              "required": false,
              "description": "Signed client assertion JWT for private_key_jwt or client_secret_jwt."
            }
          ],
          "example": "grant_type=authorization_code&code=authcode_9d1d5b4d3a&redirect_uri=https%3A%2F%2Fapp.example.com%2Fauth%2Fcallback&code_verifier=vG4p7qX2nK9mR5tW8sL1cD3fJ6hB0zA4yE7uI2oP5&client_id=app-web-client"
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The grant was exchanged and tokens were issued. refresh_token and id_token appear only when the grant and client entitle them.",
            "example": tokenExample
          },
          oauthInvalidRequest,
          oauthInvalidClient,
          oauthInvalidGrant,
          oauthUnauthorizedClient,
          oauthInvalidScope,
          oauthInvalidTarget,
          oauthUnsupportedGrantType,
          {
            "status": "400 Bad Request",
            "description": "A DPoP-required client must retry with the server nonce returned in the DPoP-Nonce header.",
            "example": {
              "error": "use_dpop_nonce",
              "error_description": "a valid DPoP nonce is required; retry with the provided nonce"
            }
          },
          oauthServerError
        ]
      }
    },
    {
      "method": "POST",
      "path": "/oauth/revoke",
      "summary": "Revoke access or refresh tokens.",
      "surface": publicIdentity,
      "details": {
        "overview": "Token revocation endpoint (RFC 7009). Invalidates the submitted access or refresh token so it can no longer be exchanged or accepted by revocation-checking resource services.",
        "notes": [
          "Responds with 200 OK and an empty body per RFC 7009 §2.2, including when the token is unknown or already revoked.",
          "Client authentication follows the same rules as the token endpoint.",
          "Revoking a refresh token revokes the derived tokens where the deployment tracks them."
        ],
        "parameters": [],
        "headers": [formContentHeader, jsonAcceptHeader, basicAuthHeader, noAuthHeader],
        "requestBody": {
          "type": "URL-encoded form",
          "description": "Token revocation payload.",
          "fields": [
            {
              "name": "token",
              "type": "string",
              "required": true,
              "description": "The access or refresh token to revoke."
            },
            {
              "name": "token_type_hint",
              "type": "string",
              "required": false,
              "description": "Hint for the server: access_token or refresh_token."
            },
            {
              "name": "client_id",
              "type": "string",
              "required": false,
              "description": "Client identifier when using client_secret_post."
            },
            {
              "name": "client_secret",
              "type": "string",
              "required": false,
              "description": "Client secret when using client_secret_post."
            }
          ],
          "example": "token=rt_7b2d2d0e3c5b4f0a9c1d&token_type_hint=refresh_token&client_id=app-web-client&client_secret=app-secret"
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The token was revoked, or was already unknown or revoked. The body is empty per RFC 7009.",
            "example": null
          },
          oauthInvalidRequest,
          oauthInvalidClient,
          oauthServerError
        ]
      }
    },
    {
      "method": "GET",
      "path": "/oauth/connections",
      "summary": "List available brokered identity-provider connections.",
      "surface": publicIdentity,
      "details": {
        "overview": "Returns the login options for a client so the hosted identity app can render its login page: whether username/password, registration, and magic-link login are available, which OAuth2 identity providers are connected, and the client branding to display.",
        "notes": [
          "Provider configuration and secrets are never returned.",
          "The identifier field is what the identity app passes back as idp_hint on GET /oauth/authorize.",
          "The response deliberately does not depend on any registration_flow parameter."
        ],
        "parameters": [
          {
            "name": "client_id",
            "in": "query",
            "type": "string",
            "required": true,
            "description": "Client identifier whose login options are being requested."
          }
        ],
        "headers": publicReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The client's login options and connected providers.",
            "example": {
              "success": true,
              "data": {
                "password_enabled": true,
                "registration_enabled": true,
                "magic_link_enabled": true,
                "branding": {
                  "branding_id": "b0e9a882-308a-44c4-bb4d-7615975d5d2a",
                  "company_name": "Example Corp",
                  "logo_url": "https://cdn.auth.example.com/logos/example.png"
                },
                "connections": [
                  {
                    "identifier": "google",
                    "display_name": "Google",
                    "provider": "google",
                    "provider_type": "oauth2",
                    "is_default": true,
                    "display_order": 1
                  }
                ]
              },
              "message": "Connections retrieved"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "client_id is missing.",
            "example": {
              "success": false,
              "error": "client_id is required"
            }
          },
          {
            "status": "404 Not Found",
            "description": "No active client matches the identifier.",
            "example": {
              "success": false,
              "error": "client not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/oauth/par",
      "summary": "Create a pushed authorization request.",
      "surface": publicIdentity,
      "details": {
        "overview": "Pushed Authorization Requests (RFC 9126). The client pushes the authorization parameters to the server before redirecting the browser, and receives a short-lived request_uri. The authorization endpoint then honors the pushed copy and discards anything else in the query string.",
        "notes": [
          "request_uri values expire after 90 seconds.",
          "A request_uri is a bearer handle: GET /oauth/authorize requires the wire client_id to match the client the request was pushed for.",
          "Client authentication follows the same rules as the token endpoint.",
          "PAR does not replace redirect-URI validation, PKCE, consent, or client policy."
        ],
        "parameters": [],
        "headers": [formContentHeader, jsonAcceptHeader, basicAuthHeader, noAuthHeader],
        "requestBody": {
          "type": "URL-encoded form",
          "description": "Pushed authorization request payload.",
          "fields": [
            {
              "name": "response_type",
              "type": "string",
              "required": true,
              "description": "Must be code."
            },
            {
              "name": "client_id",
              "type": "string",
              "required": true,
              "description": "Client identifier. Maximum 255 characters."
            },
            {
              "name": "redirect_uri",
              "type": "string",
              "required": true,
              "description": "Exact registered callback URL. Maximum 2048 characters."
            },
            {
              "name": "scope",
              "type": "string",
              "required": false,
              "description": "Space-separated requested scopes. Maximum 1024 characters."
            },
            {
              "name": "state",
              "type": "string",
              "required": false,
              "description": "Opaque CSRF binding value. Maximum 512 characters."
            },
            {
              "name": "nonce",
              "type": "string",
              "required": false,
              "description": "OIDC nonce. Maximum 512 characters."
            },
            {
              "name": "code_challenge",
              "type": "string",
              "required": false,
              "description": "PKCE challenge. Between 43 and 128 characters."
            },
            {
              "name": "code_challenge_method",
              "type": "string",
              "required": false,
              "description": "Must be S256 when present."
            },
            {
              "name": "client_secret",
              "type": "string",
              "required": false,
              "description": "Client secret when using client_secret_post."
            }
          ],
          "example": "response_type=code&client_id=app-web-client&redirect_uri=https%3A%2F%2Fapp.example.com%2Fauth%2Fcallback&scope=openid%20email%20profile&state=K8f3n2v9sL0pQ4x7&nonce=n-0S6_WzA2Mj&code_challenge=Q1n4x9p8h7r6s5t4u3v2w1y0zA-B-C-D-E-F-G&code_challenge_method=S256"
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The authorization request was pushed and a request_uri was minted.",
            "example": {
              "request_uri": "urn:ietf:params:oauth:request_uri:par_9d1d5b4d3a",
              "expires_in": 90
            }
          },
          validationErrorResponse,
          oauthInvalidRequest,
          oauthInvalidClient,
          oauthUnauthorizedClient,
          oauthInvalidScope,
          oauthServerError
        ]
      }
    },
    {
      "method": "POST",
      "path": "/oauth/device_authorization",
      "summary": "Start OAuth device authorization.",
      "surface": publicIdentity,
      "details": {
        "overview": "Device Authorization Grant (RFC 8628 §3.1). Starts a device flow for constrained devices: the server returns a device code, a short user code, and the verification URI. The user signs in elsewhere and approves the code, and the device polls the token endpoint with the device code.",
        "notes": [
          "Device codes and user codes expire after 15 minutes.",
          "The recommended polling interval is 5 seconds; polling faster is answered with slow_down.",
          "The client must have the device_code grant enabled.",
          "verification_uri_complete is included so the verification page can pre-fill the user code."
        ],
        "parameters": [],
        "headers": [formContentHeader, jsonAcceptHeader, basicAuthHeader, noAuthHeader],
        "requestBody": {
          "type": "URL-encoded form",
          "description": "Device authorization request payload.",
          "fields": [
            {
              "name": "client_id",
              "type": "string",
              "required": true,
              "description": "Client identifier. Maximum 255 characters."
            },
            {
              "name": "scope",
              "type": "string",
              "required": false,
              "description": "Space-separated requested scopes. Maximum 1024 characters."
            },
            {
              "name": "client_secret",
              "type": "string",
              "required": false,
              "description": "Client secret when using client_secret_post."
            }
          ],
          "example": "client_id=cli-tool&scope=openid%20offline_access"
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The device flow started. The device polls POST /oauth/token with grant_type=urn:ietf:params:oauth:grant-type:device_code using the device_code.",
            "example": {
              "device_code": "device_9d1d5b4d3a",
              "user_code": "WDJB-MJHT",
              "verification_uri": "https://identity-api.auth.example.com/api/v1/device/verify",
              "verification_uri_complete": "https://identity-api.auth.example.com/api/v1/device/verify?user_code=WDJB-MJHT",
              "expires_in": 900,
              "interval": 5
            }
          },
          validationErrorResponse,
          oauthInvalidClient,
          oauthUnauthorizedClient,
          oauthInvalidScope,
          oauthServerError
        ]
      }
    },
    {
      "method": "POST",
      "path": "/oauth/ciba",
      "summary": "Start a CIBA backchannel authentication request.",
      "surface": publicIdentity,
      "details": {
        "overview": "Client-Initiated Backchannel Authentication (OpenID CIBA Core §7.1). Initiates an out-of-band authentication request: the server returns an auth_req_id and notifies the user out of band, the user approves or denies through POST /oauth/ciba/approve or /oauth/ciba/deny, and the client polls the token endpoint with the CIBA grant.",
        "notes": [
          "The client must be explicitly allowed to use CIBA.",
          "CIBA requests expire after 5 minutes with a 5-second polling interval.",
          "The only backchannel token delivery mode is poll.",
          "login_hint is required unless login_hint_token or id_token_hint is supplied."
        ],
        "parameters": [],
        "headers": [formContentHeader, jsonAcceptHeader, basicAuthHeader, noAuthHeader],
        "requestBody": {
          "type": "URL-encoded form",
          "description": "CIBA initiation payload.",
          "fields": [
            {
              "name": "client_id",
              "type": "string",
              "required": true,
              "description": "Client identifier."
            },
            {
              "name": "scope",
              "type": "string",
              "required": true,
              "description": "Space-separated requested scopes. Maximum 1024 characters."
            },
            {
              "name": "login_hint",
              "type": "string",
              "required": false,
              "description": "Hint identifying the user to authenticate. Required unless login_hint_token or id_token_hint is provided."
            },
            {
              "name": "login_hint_token",
              "type": "string",
              "required": false,
              "description": "Alternative opaque hint token identifying the user."
            },
            {
              "name": "id_token_hint",
              "type": "string",
              "required": false,
              "description": "Alternative ID token hint identifying the user."
            },
            {
              "name": "binding_message",
              "type": "string",
              "required": false,
              "description": "Human-readable message shown to the user during approval. Maximum 128 characters."
            },
            {
              "name": "client_notification_token",
              "type": "string",
              "required": false,
              "description": "Bearer token the client expects to receive on push notifications."
            },
            {
              "name": "acr_values",
              "type": "string",
              "required": false,
              "description": "Requested authentication context classes."
            },
            {
              "name": "user_code",
              "type": "string",
              "required": false,
              "description": "User identifier for CIBA usercode mode when the deployment supports it."
            },
            {
              "name": "requested_expiry",
              "type": "integer",
              "required": false,
              "description": "Requested expiration in seconds for the authentication request."
            },
            {
              "name": "client_secret",
              "type": "string",
              "required": false,
              "description": "Client secret when using client_secret_post."
            }
          ],
          "example": "client_id=banking-app&scope=openid&login_hint=alex%40example.com&binding_message=Confirm%20payment%20of%20%24100"
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The CIBA request was accepted. The client polls POST /oauth/token with grant_type=urn:openid:params:grant-type:ciba using the auth_req_id.",
            "example": {
              "auth_req_id": "ar-9d1d5b4d3a",
              "expires_in": 300,
              "interval": 5
            }
          },
          validationErrorResponse,
          oauthInvalidRequest,
          oauthInvalidClient,
          oauthUnauthorizedClient,
          oauthInvalidScope,
          oauthServerError
        ]
      }
    },
    {
      "method": "GET",
      "path": "/oauth/callback/{idp_identifier}",
      "summary": "Handle brokered identity-provider callback.",
      "surface": publicIdentity,
      "details": {
        "overview": "The upstream identity provider redirects the browser back here after the user authenticates (broker leg 2). The handler exchanges the upstream code, provisions or matches the user, issues a maintainerd authorization code for the original downstream application, and redirects the browser onward.",
        "notes": [
          "This endpoint is only ever reached by a browser redirect from an upstream provider.",
          "Every failure redirects back to the identity login UI with a curated error; no raw JSON dead-end is returned.",
          "Upstream error codes are mapped to fixed, curated messages. Free-form error_description text is never reflected, preventing phishing content injection on the trusted auth origin.",
          "Missing code or state redirects with invalid_request."
        ],
        "parameters": [
          {
            "name": "idp_identifier",
            "in": "path",
            "type": "string",
            "required": true,
            "description": "Identifier of the connected identity provider, matching the connections list."
          },
          {
            "name": "code",
            "in": "query",
            "type": "string",
            "required": true,
            "description": "Authorization code returned by the upstream provider."
          },
          {
            "name": "state",
            "in": "query",
            "type": "string",
            "required": true,
            "description": "State value the broker leg sent to the upstream provider."
          },
          {
            "name": "error",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "OAuth error code returned by the upstream provider instead of a code."
          }
        ],
        "headers": publicReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "302 Found",
            "description": "Success: the browser is redirected onward with the maintainerd authorization code for the downstream app.",
            "example": {
              "Location": "https://identity.auth.example.com/oauth/complete?code=authcode_9d1d5b4d3a"
            }
          },
          {
            "status": "302 Found",
            "description": "Failure: the browser is redirected to the tenant login UI with a curated error code appended.",
            "example": {
              "Location": "https://identity.auth.example.com/login?error=access_denied&error_description=sign-in%20with%20the%20identity%20provider%20could%20not%20be%20completed"
            }
          }
        ]
      }
    },
    {
      "method": "POST",
      "path": "/oauth/logout/backchannel",
      "summary": "Receive OIDC backchannel logout messages.",
      "surface": publicIdentity,
      "details": {
        "overview": "OIDC Back-Channel Logout 1.0 §2.5. Accepts a logout_token signed by Auth and revokes the identified user/client sessions without relying on the browser. Use it only when the application is built to receive and process these notifications.",
        "notes": [
          "The endpoint is unauthenticated, so logout-token shape validation is the authentication: the token must carry a sub, an events claim declaring back-channel logout, and a jti.",
          "logout_token must not contain a nonce claim; that is what distinguishes it from an ID token.",
          "The jti is single-use with replay protection shared across replicas through the JTI denylist.",
          "Responds with 200 OK and an empty body on success."
        ],
        "parameters": [],
        "headers": publicFormHeaders,
        "requestBody": {
          "type": "URL-encoded form",
          "description": "Backchannel logout payload.",
          "fields": [
            {
              "name": "logout_token",
              "type": "string (JWT)",
              "required": true,
              "description": "Signed logout token issued by Auth. Must contain sub, events (back-channel logout), and a single-use jti, and must not contain nonce."
            }
          ],
          "example": "logout_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The logout token was accepted and the affected sessions were revoked. The body is empty.",
            "example": null
          },
          {
            "status": "400 Bad Request",
            "description": "The form body could not be parsed.",
            "example": {
              "success": false,
              "error": "invalid form data"
            }
          },
          validationErrorResponse,
          {
            "status": "400 Bad Request",
            "description": "The logout token failed shape validation, is expired, or was already used.",
            "example": {
              "error": "invalid_request",
              "error_description": "logout_token has already been used"
            }
          }
        ]
      }
    },
    {
      "method": "POST",
      "path": "/oauth/introspect",
      "summary": "Introspect a token from the management surface.",
      "surface": management,
      "details": {
        "overview": "Token introspection (RFC 7662) for trusted management callers. Returns the current status and metadata of an access or refresh token so revocation state can be checked centrally instead of relying only on local JWT validation.",
        "notes": [
          "Mounted only on the internal control plane; it is deliberately not advertised in the public discovery documents.",
          "The route is behind JWT authentication and user context middleware.",
          "Client credentials are read from the form body; HTTP Basic takes precedence when present.",
          "An inactive or unknown token returns active=false with no other claims."
        ],
        "parameters": [],
        "headers": jwtFormHeaders,
        "requestBody": {
          "type": "URL-encoded form",
          "description": "Token introspection payload.",
          "fields": [
            {
              "name": "token",
              "type": "string",
              "required": true,
              "description": "The access or refresh token to introspect."
            },
            {
              "name": "token_type_hint",
              "type": "string",
              "required": false,
              "description": "Hint for the server: access_token or refresh_token."
            },
            {
              "name": "client_id",
              "type": "string",
              "required": false,
              "description": "Client identifier when using client_secret_post."
            },
            {
              "name": "client_secret",
              "type": "string",
              "required": false,
              "description": "Client secret when using client_secret_post."
            }
          ],
          "example": "token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...&token_type_hint=access_token"
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The token is active. Omitted fields depend on the token type and what the server records.",
            "example": {
              "active": true,
              "scope": "openid email profile",
              "client_id": "app-web-client",
              "username": "alex@example.com",
              "token_type": "Bearer",
              "exp": 1765213200,
              "iat": 1765209600,
              "sub": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              "aud": "app-web-client",
              "iss": "https://identity-api.auth.example.com",
              "jti": "9d1d5b4d-3a4c-4f0a-9c1d-7e2f1a9b4c3d"
            }
          },
          {
            "status": "200 OK",
            "description": "The token is inactive, unknown, expired, or revoked.",
            "example": {
              "active": false
            }
          },
          authRequiredResponse,
          oauthInvalidRequest,
          oauthInvalidClient,
          oauthServerError
        ]
      }
    },
    {
      "method": "GET",
      "path": "/oauth/signing-keys",
      "summary": "List OAuth signing keys.",
      "surface": management,
      "details": {
        "overview": "Lists the database-backed global signing keys with their lifecycle status so operators can see which keys are active, rotated, retired, or compromised.",
        "notes": [
          "Requires the security:rotate-keys permission.",
          "The response deliberately exposes no private key material, encrypted or otherwise.",
          "This management surface is separate from the public JWKS document, which only publishes public verification keys."
        ],
        "parameters": [],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The signing-key records.",
            "example": {
              "success": true,
              "data": [
                {
                  "kid": "2025-04-01T00-00-00Z",
                  "algorithm": "RS256",
                  "use": "sig",
                  "status": "active",
                  "public_key_pem": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...\n-----END PUBLIC KEY-----",
                  "rotated_at": "2026-04-01T00:00:00Z",
                  "expires_at": "2027-04-01T00:00:00Z",
                  "created_at": "2025-04-01T00:00:00Z"
                }
              ],
              "message": "Signing keys retrieved"
            }
          },
          authRequiredResponse,
          forbiddenResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/oauth/signing-keys/rotate",
      "summary": "Rotate OAuth signing keys.",
      "surface": management,
      "details": {
        "overview": "Mints and persists a new signing key and installs it as the active key. The previous key remains published in JWKS until it is retired or expires, so tokens signed by it keep verifying during the rotation window.",
        "notes": [
          "Requires the security:rotate-keys permission.",
          "In addition to manual rotation, the service rotates the in-memory signing key at boot and on a 24-hour schedule.",
          "Rotation events should be audited."
        ],
        "parameters": [],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          emptyOkResponse("Signing key rotated"),
          authRequiredResponse,
          forbiddenResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/oauth/signing-keys/{kid}/retire",
      "summary": "Retire one OAuth signing key.",
      "surface": management,
      "details": {
        "overview": "Stops publishing the named signing key in JWKS. Use it after a successful rotation when every token signed by the old key has expired or been replaced.",
        "notes": [
          "Requires the security:rotate-keys permission.",
          "The service refuses to retire the last active key: retiring it would leave the deployment unable to sign tokens. That refusal is a 409 caller error, not a server fault."
        ],
        "parameters": [
          {
            "name": "kid",
            "in": "path",
            "type": "string",
            "required": true,
            "description": "Key ID of the signing key to retire."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          emptyOkResponse("Signing key retired"),
          {
            "status": "400 Bad Request",
            "description": "kid is missing or empty.",
            "example": {
              "success": false,
              "error": "kid is required"
            }
          },
          authRequiredResponse,
          forbiddenResponse,
          {
            "status": "409 Conflict",
            "description": "The last active key cannot be retired.",
            "example": {
              "success": false,
              "error": "cannot retire the last active signing key"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/oauth/signing-keys/{kid}/compromise",
      "summary": "Mark one OAuth signing key as compromised.",
      "surface": management,
      "details": {
        "overview": "Immediately disowns a leaked signing key: it is removed from JWKS and must never be used to verify tokens again. Use this during an incident when a key's private material may have been exposed.",
        "notes": [
          "Requires the security:rotate-keys permission.",
          "Compromise events are audited and should be followed by rotation and token revocation according to the incident runbook."
        ],
        "parameters": [
          {
            "name": "kid",
            "in": "path",
            "type": "string",
            "required": true,
            "description": "Key ID of the signing key to mark compromised."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          emptyOkResponse("Signing key marked compromised"),
          {
            "status": "400 Bad Request",
            "description": "kid is missing or empty.",
            "example": {
              "success": false,
              "error": "kid is required"
            }
          },
          authRequiredResponse,
          forbiddenResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/oauth/register",
      "summary": "Register an OAuth client dynamically.",
      "surface": management,
      "details": {
        "overview": "Dynamic Client Registration (RFC 7591 §3) for trusted management callers. Creates an OAuth client from the submitted metadata and returns the client_id (and a one-time client_secret for confidential clients).",
        "notes": [
          "Mounted on the internal control plane only; registration_endpoint is deliberately not advertised in public discovery.",
          "Requires the client:create permission. The RFC's initial access token is the caller's own access token.",
          "The client is created in the authenticated caller's tenant, never the system tenant.",
          "Allowed grant types are authorization_code, refresh_token, and client_credentials. Authorization code is the default when omitted.",
          "Redirect URI schemes are validated at registration time, not just at the authorization endpoint.",
          "The client secret is shown exactly once in the response and is never retrievable again."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Dynamic client registration payload.",
          "fields": [
            {
              "name": "client_name",
              "type": "string",
              "required": true,
              "description": "Human-readable client name. Maximum 255 characters."
            },
            {
              "name": "redirect_uris",
              "type": "array of strings",
              "required": true,
              "description": "Between 1 and 10 registered redirect URIs."
            },
            {
              "name": "grant_types",
              "type": "array of strings",
              "required": false,
              "description": "One or more of authorization_code, refresh_token, client_credentials. Defaults to authorization_code."
            },
            {
              "name": "response_types",
              "type": "array of strings",
              "required": false,
              "description": "Response types the client may request. Defaults to code."
            },
            {
              "name": "token_endpoint_auth_method",
              "type": "string",
              "required": false,
              "description": "One of client_secret_basic, client_secret_post, or none."
            },
            {
              "name": "scope",
              "type": "string",
              "required": false,
              "description": "Default scope for the client. Maximum 1024 characters."
            },
            {
              "name": "logo_uri",
              "type": "string",
              "required": false,
              "description": "URL of the client logo shown on consent screens."
            },
            {
              "name": "policy_uri",
              "type": "string",
              "required": false,
              "description": "URL of the client privacy policy."
            },
            {
              "name": "tos_uri",
              "type": "string",
              "required": false,
              "description": "URL of the client terms of service."
            },
            {
              "name": "contacts",
              "type": "array of strings",
              "required": false,
              "description": "Contact addresses for the client operator."
            },
            {
              "name": "identity_provider_id",
              "type": "integer",
              "required": true,
              "description": "ID of the identity provider to associate with the client. Must be a positive integer."
            }
          ],
          "example": {
            "client_name": "Example App",
            "redirect_uris": ["https://app.example.com/auth/callback"],
            "grant_types": ["authorization_code", "refresh_token"],
            "response_types": ["code"],
            "token_endpoint_auth_method": "client_secret_basic",
            "scope": "openid email profile",
            "logo_uri": "https://app.example.com/logo.png",
            "policy_uri": "https://app.example.com/privacy",
            "tos_uri": "https://app.example.com/terms",
            "contacts": ["ops@example.com"],
            "identity_provider_id": 3
          }
        },
        "responses": [
          {
            "status": "201 Created",
            "description": "The client was registered. client_secret appears only for confidential clients and is shown exactly once. client_secret_expires_at is 0 (does not expire) per RFC 7591.",
            "example": {
              "client_id": "cl_9d1d5b4d3a7e2f1a9b4c",
              "client_secret": "secret_48char...",
              "client_id_issued_at": 1765209600,
              "client_secret_expires_at": 0,
              "client_name": "Example App",
              "redirect_uris": ["https://app.example.com/auth/callback"],
              "grant_types": ["authorization_code", "refresh_token"],
              "response_types": ["code"],
              "token_endpoint_auth_method": "client_secret_basic",
              "scope": "openid email profile"
            }
          },
          authRequiredResponse,
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "400 Bad Request",
            "description": "The metadata failed registration rules, such as a forbidden redirect scheme or a grant type that is not available through dynamic registration.",
            "example": {
              "error": "invalid_request",
              "error_description": "grant_type is not available through dynamic registration: urn:openid:params:grant-type:ciba"
            }
          },
          oauthServerError
        ]
      }
    },
    {
      "method": "GET",
      "path": "/oauth/register/{client_id}",
      "summary": "Read a dynamically registered OAuth client.",
      "surface": management,
      "details": {
        "overview": "Dynamic Client Registration Management (RFC 7592 §2.1). Returns the registered metadata for a dynamically created client in the caller's tenant.",
        "notes": [
          "Requires the client:read permission.",
          "The client secret is never returned: it is shown exactly once at registration.",
          "A client in another tenant reports the same not-found error as an unknown client, so the response cannot confirm cross-tenant existence."
        ],
        "parameters": [
          {
            "name": "client_id",
            "in": "path",
            "type": "string",
            "required": true,
            "description": "Client identifier returned by POST /oauth/register."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The registered client metadata without the client secret.",
            "example": {
              "client_id": "cl_9d1d5b4d3a7e2f1a9b4c",
              "client_id_issued_at": 1765209600,
              "client_secret_expires_at": 0,
              "client_name": "Example App",
              "redirect_uris": ["https://app.example.com/auth/callback"],
              "grant_types": ["authorization_code", "refresh_token"],
              "response_types": ["code"],
              "token_endpoint_auth_method": "client_secret_basic"
            }
          },
          authRequiredResponse,
          forbiddenResponse,
          {
            "status": "400 Bad Request",
            "description": "client_id is missing.",
            "example": {
              "success": false,
              "error": "client_id is required"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "The client does not exist in the caller's tenant.",
            "example": {
              "error": "invalid_request",
              "error_description": "client not found"
            }
          },
          oauthServerError
        ]
      }
    }
  ]
};

export default group;
