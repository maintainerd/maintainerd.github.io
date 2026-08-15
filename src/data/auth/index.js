export const apiBaseUrls = [
  {
    "label": "Internal management API",
    "url": "https://auth.example.com/api/v1",
    "description": "Authenticated console and administration endpoints."
  },
  {
    "label": "Public identity API",
    "url": "https://tenant.auth.example.com/api/v1",
    "description": "Browser-facing login, registration, OAuth, account, MFA, and federation endpoints."
  },
  {
    "label": "Discovery and operations",
    "url": "https://tenant.auth.example.com",
    "description": "Root-level health, readiness, OpenAPI, OIDC discovery, JWKS, and metrics surfaces."
  }
];

export const apiGroupNav = [
  {
    "slug": "setup",
    "label": "Setup",
    "description": "Initial bootstrap APIs for first tenant creation, first administrator creation, setup completion, and control-service registration.",
    "endpointCount": 6
  },
  {
    "slug": "operations",
    "label": "Operations",
    "description": "Health, readiness, liveness, OpenAPI, and private metrics endpoints used by load balancers and operators.",
    "endpointCount": 7
  },
  {
    "slug": "tenant-discovery",
    "label": "Tenant Discovery",
    "description": "Unauthenticated tenant lookup endpoints used by the identity app and console to resolve tenant context before authentication.",
    "endpointCount": 2
  },
  {
    "slug": "tenants-members",
    "label": "Tenants and Members",
    "description": "Tenant administration APIs for tenant lifecycle, tenant status, tenant membership, and ownership changes.",
    "endpointCount": 10
  },
  {
    "slug": "tenant-settings",
    "label": "Tenant Settings",
    "description": "Per-tenant runtime controls for rate limiting, audit behavior, and maintenance windows.",
    "endpointCount": 6
  },
  {
    "slug": "users",
    "label": "Users",
    "description": "Administrative user APIs for account lifecycle, status, verification, roles, MFA visibility, identities, devices, sessions, consents, profiles, lockout remediation, and erasure requests.",
    "endpointCount": 32
  },
  {
    "slug": "roles",
    "label": "Roles",
    "description": "Role CRUD, status lifecycle, and role-permission assignment APIs used to define what users receive when a role is assigned.",
    "endpointCount": 9
  },
  {
    "slug": "invites",
    "label": "Invites",
    "description": "Invitation management APIs plus the public invite context endpoint used before invited-user registration.",
    "endpointCount": 6
  },
  {
    "slug": "account-self-service",
    "label": "Account Self-Service",
    "description": "Authenticated user-owned APIs for account details, profile management, devices, sessions, consent, recovery, settings, external identity links, and self-service erasure.",
    "endpointCount": 39
  },
  {
    "slug": "auth",
    "label": "Authentication",
    "description": "Public login, registration, token refresh, logout, password recovery, email verification, magic links, SMS login, MFA challenge completion, and registration context APIs.",
    "endpointCount": 19
  },
  {
    "slug": "oauth-oidc",
    "label": "OAuth 2.0 and OIDC",
    "description": "Authorization server APIs for authorization code, PKCE, consent, token exchange, introspection, discovery, JWKS, userinfo, logout, PAR, device flow, CIBA, broker callbacks, signing keys, and dynamic client registration.",
    "endpointCount": 32
  },
  {
    "slug": "clients",
    "label": "Applications and Clients",
    "description": "Public client discovery plus administrative OAuth client lifecycle, secrets, configuration, URIs, identity-provider connections, API audiences, permissions, and role assignments.",
    "endpointCount": 27
  },
  {
    "slug": "identity-providers",
    "label": "Identity Providers",
    "description": "Provider trust configuration, connection testing, federation token exchange, home-realm discovery, SAML SSO, SAML metadata, and SAML single logout.",
    "endpointCount": 18
  },
  {
    "slug": "registration-flows",
    "label": "Registration Flows",
    "description": "Registration-flow configuration APIs for self-registration rules, invite-based onboarding behavior, default roles, status, and lifecycle.",
    "endpointCount": 9
  },
  {
    "slug": "iam",
    "label": "APIs & Resources",
    "description": "Resource APIs, permissions, policies, services, policy bindings, policy history, policy bundles, and service-to-service authorization decisions.",
    "endpointCount": 31
  },
  {
    "slug": "mfa",
    "label": "MFA",
    "description": "Multi-factor authentication APIs for status, step-up, TOTP, backup codes, WebAuthn passkeys, SMS, email OTP, self reset, and administrator resets.",
    "endpointCount": 25
  },
  {
    "slug": "security-controls",
    "label": "Security Controls",
    "description": "Tenant security configuration APIs for MFA policy, password policy, session policy, threat controls, lockout rules, registration controls, token policy, and IP restriction rules.",
    "endpointCount": 20
  },
  {
    "slug": "branding",
    "label": "Branding",
    "description": "Branding records and active theme control, public branding and logo serving, and the email and SMS templates that carry the tenant's message content.",
    "endpointCount": 16
  },
  {
    "slug": "messaging",
    "label": "Messaging",
    "description": "Email and SMS delivery-provider configuration: SMTP credentials, SMS providers, delivery status, and write-only secrets.",
    "endpointCount": 6
  },
  {
    "slug": "events-webhooks",
    "label": "Events and Webhooks",
    "description": "Webhook receiver configuration, subscriptions, delivery history, replay, auth event history, event type configuration, event routes, and management audit logs.",
    "endpointCount": 25
  },
  {
    "slug": "workload-identity-federation",
    "label": "Workload Identity Federation",
    "description": "Configuration APIs for trusted workload identity federation providers used by services and automation.",
    "endpointCount": 5
  }
];

const apiGroupLoaders = {
  "setup": () => import("./setup.js"),
  "operations": () => import("./operations.js"),
  "tenant-discovery": () => import("./tenant-discovery.js"),
  "tenants-members": () => import("./tenants-members.js"),
  "tenant-settings": () => import("./tenant-settings.js"),
  "users": () => import("./users.js"),
  "roles": () => import("./roles.js"),
  "account-self-service": () => import("./account-self-service.js"),
  "auth": () => import("./auth.js"),
  "oauth-oidc": () => import("./oauth-oidc.js"),
  "clients": () => import("./clients.js"),
  "identity-providers": () => import("./identity-providers.js"),
  "registration-flows": () => import("./registration-flows.js"),
  "invites": () => import("./invites.js"),
  "iam": () => import("./iam.js"),
  "mfa": () => import("./mfa.js"),
  "security-controls": () => import("./security-controls.js"),
  "branding": () => import("./branding.js"),
  "messaging": () => import("./messaging.js"),
  "events-webhooks": () => import("./events-webhooks.js"),
  "workload-identity-federation": () => import("./workload-identity-federation.js")
};

export const apiEndpointCount = apiGroupNav.reduce((total, group) => total + group.endpointCount, 0);

export const defaultApiGroupSlug = apiGroupNav[0]?.slug || null;

export const findApiGroupNav = (slug) => apiGroupNav.find((group) => group.slug === slug) || apiGroupNav[0] || null;

export const loadApiGroup = async (slug) => {
  const target = findApiGroupNav(slug);

  if (!target) {
    return null;
  }

  const module = await apiGroupLoaders[target.slug]();
  return module.default;
};
