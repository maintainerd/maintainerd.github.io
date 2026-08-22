import { screenshots, serviceIcon, serviceLogo } from "@/data/assets.js";

export const maintainerdServices = [
  {
    slug: "auth",
    name: "Auth",
    eyebrow: "Identity & Access",
    status: "v0.1.0",
    statusKind: "version",
    icon: serviceIcon("auth"),
    summary: "Identity and access: OAuth/OIDC, hosted login, MFA, SAML, clients, policies, users, and API authorization.",
    description: "Auth is the identity and access service for Maintainerd. It provides OAuth 2.0 and OpenID Connect, hosted login, tenant-aware users, MFA, identity providers, registration controls, and application authorization.",
    headline: "OAuth/OIDC identity, federation, MFA, tenants, users, clients, and policies.",
    image: screenshots.authIdentityProvider,
    imageAlt: "Maintainerd Auth console showing identity provider configuration",
    command: "docker pull xreyc/maintainerd-auth:latest",
    href: "/services/auth/docs/",
    docsHref: "/services/auth/docs/",
    apiHref: "/services/auth/api/",
    grpcHref: "/services/auth/grpc/",
    dockerHref: "https://hub.docker.com/r/xreyc/maintainerd-auth",
    githubHref: "https://github.com/maintainerd/maintainerd-auth",
    docsBlurb:
      "Use them for setup, client configuration, identity providers, OAuth/OIDC integration, tenant management, security controls, and troubleshooting.",
    features: [
      "Hosted login, registration, and account self-service",
      "Built-in Maintainerd identity plus external OAuth, OIDC, and SAML providers",
      "Tenant-aware clients, roles, permissions, sessions, events, and security controls"
    ]
  },
  {
    slug: "core",
    name: "M9d Core",
    shortName: "Core",
    eyebrow: "Control Plane",
    status: "Planned",
    statusKind: "planned",
    icon: serviceIcon("core"),
    summary: "Control plane for tenants, service inventory, runtime providers, topology, health, and provisioning.",
    description: "Core coordinates tenants, service registration, provider delegation, health, topology, and operations. It is the shared control plane for Maintainerd services and for externally deployed applications.",
    headline: "Tenant, service, topology, and operations control plane.",
    command: "docker pull maintainerd/maintainerd-core",
    features: [
      "Tenant and environment inventory",
      "Service registry and dependency topology",
      "Delegated provisioning through Docker, Kubernetes, database, storage, and domain providers"
    ]
  },
  {
    slug: "docker",
    name: "M9d Docker",
    shortName: "Docker",
    eyebrow: "Docker Runtime Provider",
    status: "Planned",
    statusKind: "idea",
    icon: serviceIcon("docker"),
    summary: "Run and manage Docker workloads from the dashboard — the built-in engine on your own hosts, or a connected Docker host.",
    description: "Docker is the lightweight runtime provider. Core can ask it to run Maintainerd products, developer-owned applications, Docker Hub images, or private registry images without making the control plane host-specific.",
    headline: "Docker runtime provider for built-in services and external images.",
    command: "docker pull maintainerd/maintainerd-docker",
    features: [
      "Deploy arbitrary container images",
      "Start, stop, restart, inspect, and update workloads",
      "Report ports, images, health, and runtime metadata to Core"
    ]
  },
  {
    slug: "kubernetes",
    name: "M9d Kubernetes",
    shortName: "Kubernetes",
    eyebrow: "Kubernetes Runtime Provider",
    status: "Planned",
    statusKind: "planned",
    icon: serviceIcon("kubernetes"),
    summary: "Manage Kubernetes from the dashboard — a built-in cluster, or one you already run.",
    description: "Kubernetes is the cluster runtime provider for Maintainerd. It lets Core delegate service and workload provisioning to Kubernetes while keeping tenant, service, and operational state consistent.",
    headline: "Cluster-backed runtime provider for scaled workloads.",
    command: "docker pull maintainerd/maintainerd-kubernetes",
    features: [
      "Namespace and workload provisioning",
      "Service, ingress, config, and secret integration",
      "Health and deployment status reporting back to Core"
    ]
  },
  {
    slug: "registry",
    name: "M9d Registry",
    shortName: "Registry",
    eyebrow: "Container Registry",
    status: "Planned",
    statusKind: "planned",
    icon: serviceIcon("registry"),
    summary: "Private container registry — the built-in registry, or connect a registry you already run.",
    description: "Registry stores and serves the container images your Docker and Kubernetes workloads run. Use the built-in registry (on top of Harbor/Distribution) for on-prem, or connect any OCI registry you already run and drive it from the same dashboard.",
    headline: "One registry surface — built-in on-prem, or one you already run.",
    command: "docker pull maintainerd/maintainerd-registry",
    features: [
      "Built-in OCI registry, or connect an existing one",
      "Push, tag, scan, and promote images from the dashboard",
      "Repository access tied to Auth roles and per-tenant scoping"
    ]
  },
  {
    slug: "build",
    name: "M9d Build",
    shortName: "Build",
    eyebrow: "CI/CD & Deployments",
    status: "Planned",
    statusKind: "planned",
    icon: serviceIcon("build"),
    summary: "Build and deploy pipelines — run built-in runners, or connect the CI/CD you already use.",
    description: "Build turns source into running workloads: connect a repository, build an image, push it to Registry, and roll it out to Docker or Kubernetes. Use built-in runners on your own infrastructure, or orchestrate an external CI/CD provider from the same place.",
    headline: "Source to running workload — built-in runners or your CI provider.",
    command: "docker pull maintainerd/maintainerd-build",
    features: [
      "Repo to image to deploy, targeting Docker or Kubernetes",
      "Built-in runners, or connect your existing CI/CD",
      "Environments, rollbacks, and deployment history"
    ]
  },
  {
    slug: "database",
    name: "M9d Database",
    shortName: "Database",
    eyebrow: "Database Provisioning Control",
    status: "Planned",
    statusKind: "idea",
    icon: serviceIcon("database"),
    summary: "Provision and manage databases — the built-in engine, or a managed database you already run.",
    description: "Database standardizes how teams create, attach, monitor, and back up PostgreSQL, MySQL, Redis, MongoDB, and provider-managed engines. It does not replace databases; it controls the lifecycle around them.",
    headline: "Provision and manage existing database engines.",
    command: "docker pull maintainerd/maintainerd-database",
    features: [
      "Provision existing engines",
      "Credential handoff through M9d Secret or external secret providers",
      "Backup and retention policy hooks"
    ]
  },
  {
    slug: "cache",
    name: "M9d Cache",
    shortName: "Cache",
    eyebrow: "Cache & Key-Value",
    status: "Planned",
    statusKind: "idea",
    icon: serviceIcon("cache"),
    summary: "Managed cache and key-value — the built-in Redis, or a managed cache you already run.",
    description: "Cache provisions the fast key-value layer applications rely on for sessions, rate limits, and hot data. Run the built-in engine (on top of Redis) on your own hosts, or connect a managed cache you already run from the same dashboard.",
    headline: "One key-value surface — built-in Redis, or one you already run.",
    command: "docker pull maintainerd/maintainerd-cache",
    features: [
      "Built-in Redis-compatible engine, or connect an existing one",
      "Instances, sizing, eviction policy, and credentials",
      "Connection details wired to your apps through Core"
    ]
  },
  {
    slug: "domains",
    name: "M9d Domains",
    shortName: "Domains",
    eyebrow: "DNS & Certificates",
    status: "Planned",
    statusKind: "idea",
    icon: serviceIcon("domains"),
    summary: "Domain bindings, DNS automation, certificate lifecycle, and public hostname ownership.",
    description: "Domains gives Maintainerd a first-party way to attach hostnames to services, automate DNS provider updates, issue certificates, renew certificates, and connect public endpoints to Core-managed workloads.",
    headline: "Domain bindings, DNS automation, and certificate lifecycle.",
    command: "docker pull maintainerd/maintainerd-domains",
    features: [
      "Service domain bindings",
      "DNS provider automation",
      "TLS certificate lifecycle"
    ]
  },
  {
    slug: "secret",
    name: "M9d Secret",
    shortName: "Secret",
    eyebrow: "Secrets Layer",
    status: "Building",
    statusKind: "building",
    icon: serviceIcon("secret"),
    summary: "A first-party vault: envelope-encrypted, versioned secrets with audited reveals, rotation, and its own console.",
    description: "Secret is Maintainerd's own secret manager. It stores secrets in a tenant, project, environment, and folder hierarchy, encrypts every version under its own data key, records every access including reads and denials, and enforces permissions on each secret's resource name.",
    headline: "Envelope-encrypted, versioned secrets with audited reveals.",
    command: "docker pull maintainerd/maintainerd-secret",
    href: "/services/secret/docs/",
    docsHref: "/services/secret/docs/",
    githubHref: "https://github.com/maintainerd/maintainerd-secret",
    docsBlurb:
      "Use them for the run modes, the standalone runbook, the permission reference, environment variables, the console, and the security guarantees.",
    features: [
      "Envelope encryption with a pluggable root key, and append-only versions",
      "Browsing metadata and revealing a value are separate grants, and every reveal is audited",
      "Adoptable alone: Auth plus Secret is a complete deployment"
    ]
  },
  {
    slug: "gateway",
    name: "M9d Gateway",
    shortName: "Gateway",
    eyebrow: "API Edge",
    status: "Planned",
    statusKind: "idea",
    icon: serviceIcon("gateway"),
    summary: "Routing, ingress, and service exposure — built-in Traefik/Caddy, or the load balancer or gateway you already run.",
    description: "Gateway handles public and private routing for Maintainerd services and deployed applications. It is the place for ingress, API edge behavior, request policy, and service exposure.",
    headline: "Ingress, routing, and API edge behavior.",
    command: "docker pull maintainerd/maintainerd-gateway",
    features: [
      "HTTP routing and service exposure",
      "Auth-aware ingress policies",
      "Rate limiting and edge controls"
    ]
  },
  {
    slug: "storage",
    name: "M9d Storage",
    shortName: "Storage",
    eyebrow: "Storage APIs & Drive App",
    status: "Planned",
    statusKind: "planned",
    icon: serviceIcon("storage"),
    summary: "Object storage, buckets, and signed URLs — a built-in object store, or connect storage you already run.",
    description: "Storage wraps object stores, local storage, and future file experiences behind a Maintainerd service. It can expose developer APIs, administrator controls, and an end-user drive surface.",
    headline: "Storage APIs, object storage controls, and drive-style app experiences.",
    command: "docker pull maintainerd/maintainerd-storage",
    features: [
      "Object-storage and local backends",
      "Bucket, policy, quota, and provider console",
      "Drive-style file manager for teams"
    ]
  },
  {
    slug: "messaging",
    name: "M9d Messaging",
    shortName: "Messaging",
    eyebrow: "Notifications",
    status: "Planned",
    statusKind: "idea",
    icon: serviceIcon("messaging"),
    summary: "Email, SMS, and push with templates and delivery logs — built-in SMTP, or a delivery provider you already use.",
    description: "Messaging standardizes email, SMS, push, templates, delivery logs, and notification workflows across Maintainerd services and customer applications.",
    headline: "Notification delivery and templates.",
    command: "docker pull maintainerd/maintainerd-messaging",
    features: [
      "Email, SMS, and push channels",
      "Template management and personalization",
      "Delivery logs and channel management"
    ]
  },
  {
    slug: "jobs",
    name: "M9d Jobs",
    shortName: "Jobs",
    eyebrow: "Workers & Schedules",
    status: "Planned",
    statusKind: "idea",
    icon: serviceIcon("jobs"),
    summary: "Queues, workers, schedules, retries, recurring work, and background execution.",
    description: "Jobs provides background execution for queues, workers, schedules, retries, recurring work, and long-running operational tasks.",
    headline: "Background jobs and recurring work.",
    command: "docker pull maintainerd/maintainerd-jobs",
    features: [
      "Queues and workers",
      "Schedules and recurring jobs",
      "Retries, dead-letter handling, and execution history"
    ]
  },
  {
    slug: "observability",
    name: "M9d Observability",
    shortName: "Observability",
    eyebrow: "Logs, Metrics & Health",
    status: "Planned",
    statusKind: "idea",
    icon: serviceIcon("observability"),
    summary: "Logs, metrics, traces, and alerts — a built-in Prometheus/Grafana/Loki stack, or connect the tools you already run.",
    description: "Observability integrates logs, metrics, traces, alerts, dashboards, and health signals so Maintainerd services and user-deployed apps can be operated from a shared view.",
    headline: "Operational visibility for services and applications.",
    command: "docker pull maintainerd/maintainerd-observability",
    features: [
      "Metrics and health dashboards",
      "Logs, traces, and audit signals",
      "Alerts routed through Messaging or external tools"
    ]
  },
  {
    slug: "billing",
    name: "M9d Billing",
    shortName: "Billing",
    eyebrow: "Subscriptions & Usage",
    status: "Planned",
    statusKind: "idea",
    icon: serviceIcon("billing"),
    summary: "Plans, subscriptions, metering, invoices, usage records, and payment provider wiring.",
    description: "Billing targets the SaaS billing logic teams repeatedly implement: plans, trials, subscriptions, usage metering, invoices, lifecycle events, and payment provider integrations.",
    headline: "Plans, subscriptions, usage, invoices, and payment providers.",
    command: "docker pull maintainerd/maintainerd-billing",
    features: [
      "Plans and subscriptions",
      "Usage metering",
      "Invoices and provider connections"
    ]
  },
];

export const externalCategories = [
  {
    slug: "database",
    title: "Databases",
    optionsLabel: "Databases",
    services: [
      { mark: "Pg", icon: serviceLogo("postgresql"), name: "PostgreSQL", image: "postgres", summary: "Relational database for applications that need SQL, transactions, extensions, and durable state." },
      { mark: "My", icon: serviceLogo("mysql"), name: "MySQL", image: "mysql", summary: "Relational database for common application stacks and managed-compatible workloads." },
      { mark: "Ma", icon: serviceLogo("mariadb"), name: "MariaDB", image: "mariadb", summary: "MySQL-compatible relational database for application deployments." },
      { mark: "Mo", icon: serviceLogo("mongodb"), name: "MongoDB", image: "mongo", summary: "Document database for JSON-style application data and flexible schemas." }
    ]
  },
  {
    slug: "cache",
    title: "Cache and key-value",
    optionsLabel: "Cache and key-value",
    services: [
      { mark: "Re", icon: serviceLogo("redis"), name: "Redis", image: "redis", summary: "Cache, queues, rate limits, sessions, and short-lived state for application services." },
      { mark: "Va", icon: serviceLogo("valkey"), name: "Valkey", image: "valkey/valkey", summary: "Redis-compatible key-value service for cache and ephemeral runtime data." }
    ]
  },
  {
    slug: "edge",
    title: "Edge and proxy",
    optionsLabel: "Edge and proxy",
    services: [
      { mark: "Nx", icon: serviceLogo("nginx"), name: "nginx", image: "nginx", summary: "Reverse proxy and static edge for applications, APIs, and service hostnames." },
      { mark: "Cy", icon: serviceLogo("caddy"), name: "Caddy", image: "caddy", summary: "HTTPS-first web server and reverse proxy with automatic certificate support." },
      { mark: "Tr", icon: serviceLogo("traefik"), name: "Traefik", image: "traefik", summary: "Dynamic reverse proxy for routed containers and service discovery." }
    ]
  },
  {
    slug: "observability",
    title: "Observability",
    optionsLabel: "Observability",
    services: [
      { mark: "Gr", icon: serviceLogo("grafana"), name: "Grafana", image: "grafana/grafana", summary: "Dashboards for metrics, logs, traces, and service health." },
      { mark: "Pr", icon: serviceLogo("prometheus"), name: "Prometheus", image: "prom/prometheus", summary: "Metrics collection and alerting for services and infrastructure." },
      { mark: "Lo", icon: serviceLogo("loki"), name: "Loki", image: "grafana/loki", summary: "Log aggregation that pairs naturally with Grafana dashboards." }
    ]
  },
  {
    slug: "messaging",
    title: "Messaging and queues",
    optionsLabel: "Messaging and queues",
    services: [
      { mark: "Rq", icon: serviceLogo("rabbitmq"), name: "RabbitMQ", image: "rabbitmq", summary: "Message broker for queues, event routing, and asynchronous services." },
      { mark: "Na", icon: serviceLogo("nats"), name: "NATS", image: "nats", summary: "Lightweight messaging and eventing for distributed services." },
      { mark: "Kf", icon: serviceLogo("kafka"), name: "Kafka", image: "apache/kafka", summary: "Streaming event backbone for high-throughput event pipelines." }
    ]
  },
  {
    slug: "storage",
    title: "Storage",
    optionsLabel: "Storage",
    services: [
      { mark: "Mi", icon: serviceLogo("minio"), name: "MinIO", image: "minio/minio", summary: "S3-compatible object storage for files, backups, and application assets." },
      { mark: "Nc", icon: serviceLogo("nextcloud"), name: "Nextcloud", image: "nextcloud", summary: "File collaboration and personal cloud storage for teams." }
    ]
  },
  {
    slug: "developer",
    title: "Developer tools",
    optionsLabel: "Developer tools",
    services: [
      { mark: "Gt", icon: serviceLogo("gitea"), name: "Gitea", image: "gitea/gitea", summary: "Self-hosted Git service for repositories, teams, and lightweight project collaboration." },
      { mark: "Jk", icon: serviceLogo("jenkins"), name: "Jenkins", image: "jenkins/jenkins", summary: "Automation server for CI workflows, jobs, and deployment pipelines." }
    ]
  },
  {
    slug: "cms",
    title: "Content and commerce",
    optionsLabel: "Content and commerce",
    services: [
      { mark: "Wp", icon: serviceLogo("wordpress"), name: "WordPress", image: "wordpress", summary: "Publishing and site management for content-heavy applications." },
      { mark: "St", icon: serviceLogo("strapi"), name: "Strapi", image: "strapi/strapi", summary: "Headless CMS for content APIs and editorial workflows." },
      { mark: "Me", icon: serviceLogo("medusa"), name: "Medusa", image: "medusajs/medusa", summary: "Commerce backend for product, cart, order, and storefront workflows." }
    ]
  }
];

export const serviceNav = maintainerdServices.map((service) => ({
  href: service.docsHref || `/services/${service.slug}/`,
  label: service.name
}));

export const serviceSlugs = maintainerdServices.map((service) => service.slug);

export const findService = (slug) => maintainerdServices.find((service) => service.slug === slug);
