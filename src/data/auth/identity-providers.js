// Endpoint details for this Auth API section.

const group = {
  "slug": "identity-providers",
  "label": "Identity Providers",
  "description": "Provider trust configuration, connection testing, federation token exchange, home-realm discovery, SAML SSO, SAML metadata, and SAML single logout.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/identity_providers/",
      "summary": "List identity providers.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/identity_providers/{identity_provider_uuid}",
      "summary": "Read one identity provider.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/identity_providers/",
      "summary": "Create an identity provider.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/identity_providers/{identity_provider_uuid}",
      "summary": "Update an identity provider.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/identity_providers/{identity_provider_uuid}/status",
      "summary": "Change identity-provider status.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/identity_providers/{identity_provider_uuid}",
      "summary": "Delete an identity provider.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/identity_providers/test",
      "summary": "Test an identity-provider configuration before saving it.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/federation/token",
      "summary": "Exchange an upstream OIDC token for Maintainerd Auth tokens.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/federation/oauth2/callback",
      "summary": "Exchange an upstream OAuth2 authorization code.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/federation/hrd",
      "summary": "Discover the correct provider from an email domain.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/federation/saml/initiate",
      "summary": "Start SAML SP-initiated sign-in.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/federation/saml/acs/{provider_identifier}",
      "summary": "Receive a SAML response at the assertion consumer service.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/federation/saml/exchange",
      "summary": "Exchange a SAML authorization code for tokens.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/federation/saml/metadata/{provider_identifier}",
      "summary": "Read service-provider SAML metadata XML.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/federation/saml/logout",
      "summary": "Start SAML logout with a browser redirect.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/federation/saml/logout",
      "summary": "Start SAML logout from a posted request.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/federation/saml/slo/{provider_identifier}",
      "summary": "Handle SAML single logout with GET binding.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/federation/saml/slo/{provider_identifier}",
      "summary": "Handle SAML single logout with POST binding.",
      "surface": "Public identity API"
    }
  ]
};

export default group;
