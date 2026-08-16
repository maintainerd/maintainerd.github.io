export const docsGroups = [
  {
    label: "Start",
    sections: [
      ["introduction", "Introduction"],
      ["feature-inventory", "Features"],
      ["identity-types", "Identity types"],
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
      ["transport-security", "Transport security"],
      ["messaging", "Messaging"],
      ["system-defaults", "System defaults"]
    ]
  },
  {
    label: "Tenants and users",
    sections: [
      ["tenants-members", "Tenants & members"],
      ["users-invites", "Users & invites"],
      ["registration-flows", "Registration flows"],
      ["login-registration", "Login & registration"],
      ["account", "Account self-service"],
      ["mfa", "MFA & step-up"]
    ]
  },
  {
    label: "Applications and federation",
    sections: [
      ["clients", "Applications & clients"],
      ["identity-providers", "Identity providers"],
      ["federated-login-client", "Federated login"],
      ["hosted-login-flow", "Hosted login flow"],
      ["oauth-oidc", "OAuth & OIDC"],
      ["tokens-sessions", "Tokens & sessions"],
      ["protect-api", "Protect an API"]
    ]
  },
  {
    label: "Authorization",
    sections: [
      ["authorization-model", "Authorization model"],
      ["policies", "Policies"],
      ["resources", "Services, APIs & permissions"],
      ["service-auth", "Service auth"],
      ["workload-identity", "Workload identity"]
    ]
  },
  {
    label: "Developer integration",
    sections: [
      ["developer-integration", "Integration overview"],
      ["external-app-setup", "External app setup"],
      ["example-workflows", "Example workflows"],
      ["api-map", "API map"],
      ["grpc", "gRPC"]
    ]
  },
  {
    label: "Operations",
    sections: [
      ["events-webhooks", "Events & webhooks"],
      ["audit", "Auth events"],
      ["security", "Security controls"],
      ["observability", "Observability"],
      ["data-lifecycle", "Data lifecycle"],
      ["branding", "Branding & templates"],
      ["control-plane", "Control plane"],
      ["lifecycle-runners", "Lifecycle runners"],
      ["troubleshooting", "Troubleshooting"]
    ]
  },
  {
    label: "Reference",
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

export const findDocSection = (slug) => docsSections.find((section) => section.slug === slug);
