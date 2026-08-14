export const docsGroups = [
  {
    label: "Start",
    sections: [
      ["introduction", "Introduction"],
      ["quickstart", "Quickstart"],
      ["setup", "Setup"]
    ]
  },
  {
    label: "Production configuration",
    sections: [
      ["deployment", "Deployment"],
      ["environment", "Environment variables"],
      ["secrets", "Secrets & keys"],
      ["database-redis", "Database & Redis"],
      ["surfaces-hostnames", "Hostnames & tenant URLs"],
      ["messaging", "Messaging"]
    ]
  },
  {
    label: "Tenants and users",
    sections: [
      ["tenants-members", "Tenants & members"],
      ["users-invites", "Users & invites"],
      ["registration-flows", "Registration flows"],
      ["login-registration", "Login & registration"],
      ["account", "Account self-service"]
    ]
  },
  {
    label: "Applications and federation",
    sections: [
      ["clients", "Applications & clients"],
      ["identity-providers", "Identity providers"],
      ["oauth-oidc", "OAuth & OIDC"],
      ["protect-api", "Protect an API"]
    ]
  },
  {
    label: "Operations",
    sections: [
      ["events-webhooks", "Events & webhooks"],
      ["audit", "Auth events"],
      ["security", "Security controls"],
      ["troubleshooting", "Troubleshooting"]
    ]
  },
  {
    label: "Developer reference",
    sections: [
      ["architecture", "Architecture"],
      ["glossary", "Glossary"]
    ]
  }
];

export const docsSections = docsGroups.flatMap((group) =>
  group.sections.map(([slug, title]) => ({
    slug,
    title
  }))
);

export const docAnchors = [
  "account",
  "account-and-step-up-issues",
  "api-map",
  "architecture",
  "audit",
  "auth-events-and-audit",
  "authorization-issues",
  "authorization-model",
  "branding",
  "clients",
  "complete-event-catalog",
  "control-plane",
  "data-lifecycle",
  "database-and-redis",
  "database-redis",
  "deployment",
  "developer-integration",
  "edge-and-proxy-issues",
  "environment",
  "events-and-webhooks",
  "events-webhooks",
  "example-workflows",
  "external-api-token-validation",
  "external-app-setup",
  "feature-inventory",
  "federated-login-client",
  "glossary",
  "grpc",
  "grpc-issues",
  "hosted-login-flow",
  "identity-providers",
  "identity-types",
  "introduction",
  "lifecycle-runners",
  "login-issues",
  "login-registration",
  "messaging",
  "messaging-issues",
  "mfa",
  "oauth-and-oidc-issues",
  "oauth-oidc",
  "observability",
  "policies",
  "protect-api",
  "quickstart",
  "readiness-failures",
  "registration-flows",
  "registration-issues",
  "resources",
  "secrets",
  "security",
  "service-auth",
  "session-and-cookie-issues",
  "setup",
  "startup-failures",
  "surfaces-hostnames",
  "system-defaults",
  "tenants-members",
  "tokens-sessions",
  "transport-security",
  "troubleshooting",
  "users-invites",
  "workload-identity"
];

export const findDocSection = (slug) => docsSections.find((section) => section.slug === slug);
