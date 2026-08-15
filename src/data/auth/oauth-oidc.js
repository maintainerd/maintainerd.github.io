// Endpoint details for this Auth API section.

const group = {
  "slug": "oauth-oidc",
  "label": "OAuth 2.0 and OIDC",
  "description": "Authorization server APIs for authorization code, PKCE, consent, token exchange, introspection, discovery, JWKS, userinfo, logout, PAR, device flow, CIBA, broker callbacks, signing keys, and dynamic client registration.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/.well-known/openid-configuration",
      "summary": "OpenID Connect discovery metadata.",
      "surface": "Router root"
    },
    {
      "method": "GET",
      "path": "/.well-known/oauth-authorization-server",
      "summary": "OAuth 2.0 authorization server metadata.",
      "surface": "Router root"
    },
    {
      "method": "GET",
      "path": "/.well-known/jwks.json",
      "summary": "JSON Web Key Set for token verification.",
      "surface": "Router root"
    },
    {
      "method": "GET",
      "path": "/oauth/authorize",
      "summary": "Start an OAuth authorization request.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/oauth/consent/{challenge_id}",
      "summary": "Read consent challenge details.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/oauth/consent",
      "summary": "Submit a consent allow or deny decision.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/oauth/authorize/continue",
      "summary": "Continue an interrupted authorization flow.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/oauth/broker/resume",
      "summary": "Resume a brokered identity-provider authorization flow.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/oauth/userinfo",
      "summary": "Read OpenID Connect UserInfo claims.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/oauth/consent/grants",
      "summary": "List consent grants for the authenticated user.",
      "surface": "Public identity API"
    },
    {
      "method": "DELETE",
      "path": "/oauth/consent/grants/{grant_uuid}",
      "summary": "Revoke one consent grant.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/oauth/device",
      "summary": "Approve a device flow user code.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/oauth/device/deny",
      "summary": "Deny a device flow user code.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/oauth/ciba/approve",
      "summary": "Approve a CIBA authentication request.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/oauth/ciba/deny",
      "summary": "Deny a CIBA authentication request.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/oauth/end_session",
      "summary": "Start RP-initiated logout.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/oauth/end_session",
      "summary": "Submit RP-initiated logout.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/oauth/token",
      "summary": "Exchange grants for tokens.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/oauth/revoke",
      "summary": "Revoke access or refresh tokens.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/oauth/connections",
      "summary": "List available brokered identity-provider connections.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/oauth/par",
      "summary": "Create a pushed authorization request.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/oauth/device_authorization",
      "summary": "Start OAuth device authorization.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/oauth/ciba",
      "summary": "Start a CIBA backchannel authentication request.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/oauth/callback/{idp_identifier}",
      "summary": "Handle brokered identity-provider callback.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/oauth/logout/backchannel",
      "summary": "Receive OIDC backchannel logout messages.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/oauth/introspect",
      "summary": "Introspect a token from the management surface.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/oauth/signing-keys",
      "summary": "List OAuth signing keys.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/oauth/signing-keys/rotate",
      "summary": "Rotate OAuth signing keys.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/oauth/signing-keys/{kid}/retire",
      "summary": "Retire one OAuth signing key.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/oauth/signing-keys/{kid}/compromise",
      "summary": "Mark one OAuth signing key as compromised.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/oauth/register",
      "summary": "Register an OAuth client dynamically.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/oauth/register/{client_id}",
      "summary": "Read a dynamically registered OAuth client.",
      "surface": "Internal management API"
    }
  ]
};

export default group;
