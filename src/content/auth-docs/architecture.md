# Architecture

Maintainerd Auth is a single deployable identity system that serves multiple responsibilities from one Go backend: hosted login, OAuth/OIDC, account self-service, administration, events, webhooks, health checks, metrics, and optional gRPC service-to-service integration.

The important architectural idea is separation by boundary, not separation by container. The same deployment owns the identity domain, but each caller reaches Auth through the surface designed for that caller:

- End users and external applications use the hosted identity app and public identity API.
- Operators use the admin console and internal management API.
- External APIs validate tokens issued by the public issuer.
- Webhook receivers consume signed event deliveries.
- Platform services use gRPC only when service-to-service or control-plane integration is intentionally enabled.
- Health checks, readiness checks, and metrics stay on the private management surface.

For setup steps, start with [Setup](#setup). For hostnames and tenant URL behavior, see [Hostnames & tenant URLs](#surfaces-hostnames). For production deployment configuration, see [Deployment](#deployment), [Environment variables](#environment), and [Secrets & keys](#secrets).

## Mental Model

Think of Auth as one identity authority with several doors.

```text
External application
  -> redirects users to hosted identity
  -> receives tokens from OAuth/OIDC
  -> protects its own API by validating Auth-issued tokens

Tenant administrator
  -> opens the admin console
  -> configures tenants, members, clients, providers, users, roles, security, events

Auth backend
  -> applies tenant routing, security gates, authorization, domain rules
  -> stores durable state in PostgreSQL
  -> uses Redis for shared short-lived state, cache, rate limits, and denylist checks
  -> emits Auth events, management audit logs, integration events, and webhook deliveries
```

This means a developer integrating an application usually needs to understand three things:

1. Which tenant and hostname the application should use.
2. Which OAuth client represents the application.
3. Which token claims, roles, permissions, and events the application depends on.

Those details are configured in the console, then consumed by the external app through OAuth/OIDC, token validation, and optional webhooks.

## Deployed Shape

The packaged Auth deployment runs one backend binary with embedded console and identity assets. It exposes separate ports so the edge can route public identity traffic and private administration traffic differently.

| Surface | Internal Port | Typical External Hostname | Who Uses It | What It Does | Exposure |
|---|---:|---|---|---|---|
| Hosted identity app | `3001` | `https://identity.auth.example.com` and tenant identity hostnames | End users and external apps | Login, registration, MFA, consent, account self-service, IdP selection. | Public |
| Public identity API | `8081` | `https://identity-api.auth.example.com` | External apps and hosted identity | OAuth/OIDC issuer, discovery, tokens, userinfo, public account flows, public branding. | Public |
| Admin console | `3000` | `https://console.auth.example.com` | Tenant administrators and operators | Browser UI for configuring and operating Auth. | Private |
| Internal management API | `8080` | `https://console-api.auth.example.com` | Console and trusted internal automation | Tenants, users, clients, providers, roles, policies, security, messaging, events, audit. | Private |
| Management surface | `8082` | `https://auth-management.internal` | Probes, Prometheus, platform operators | Health, readiness, liveness, OpenAPI JSON, metrics. | Private |
| gRPC | `50051` when enabled | Private service address | Peer services and control-plane automation | Authorization checks, introspection, selected reads, provisioning when enabled. | Private |

Public exposure should be intentional. In a typical deployment, only hosted identity and the public identity API are reachable from the internet. The console, internal management API, management surface, database, Redis, and gRPC listener stay behind private networking.

## Edge Routing

Auth expects browsers to see HTTPS origins. TLS may terminate at the load balancer, ingress, or reverse proxy, but the external URL seen by users and applications should be HTTPS.

The edge must preserve the original host so tenant routing works. It should forward the real client IP so rate limits, lockout, IP restrictions, and threat controls act on the user or application address instead of the proxy address. It must also allow enough response-header buffer for cookie-based login responses.

Common edge responsibilities:

| Responsibility | Why It Matters |
|---|---|
| Preserve `Host` | Tenant subdomain and system-host routing depend on the request hostname. |
| Forward scheme | Secure cookies and issuer URLs depend on the external HTTPS scheme. |
| Forward client IP | Rate limits, lockout, IP restrictions, security events, and audit trails need the real caller IP. |
| Keep public/private split | Public users should not reach management, metrics, or gRPC surfaces. |
| Size response headers | Auth sets secure cookies during browser flows; small proxy buffers can cause login failures. |
| Enforce HTTPS at the edge | Browser security, cookie security, OAuth redirect expectations, and HSTS depend on HTTPS. |

For concrete proxy settings, see [Deployment](#deployment) and [Troubleshooting](#troubleshooting).

## Tenant Architecture

Tenant context is the root of Auth behavior. Tenants define the security boundary for users, clients, providers, roles, permissions, branding, registration, messaging, events, webhooks, and operational settings.

Auth distinguishes between:

| Tenant Type | Purpose |
|---|---|
| System tenant | Owns platform-level administration and built-in Auth operation. It is used for operating Auth itself and for system-level setup. |
| Regular tenant | Represents an organization or application tenant that signs in users, owns clients, configures providers, and receives events. |

Tenant routing is usually hostname-based. The system hostname reaches the system tenant experience. Tenant hostnames or tenant subdomains reach a regular tenant. The exact hostname plan depends on [Hostnames & tenant URLs](#surfaces-hostnames).

Tenant-aware routing affects:

- Which branding is shown.
- Which identity providers are available.
- Which registration rules apply.
- Which clients can start OAuth/OIDC flows.
- Which users and memberships are valid.
- Which security controls, rate limits, IP restrictions, and maintenance settings are enforced.
- Which events and webhooks receive activity.

Avoid treating Auth as a flat global user store. A user identity must be evaluated in the tenant and client context where the sign-in or API access happens.

## Application Architecture

An external application integrates with Auth by creating an OAuth/OIDC client for that application. The client defines how the application can authenticate users and which redirect, logout, origin, and permission settings are allowed.

Typical application types:

| Application Type | Client Style | Auth Behavior |
|---|---|---|
| Browser SPA | Public client with PKCE | The browser redirects to hosted identity and exchanges through a PKCE-safe flow. |
| Server-rendered web app | Confidential client | The server stores the client secret, performs the code exchange, and owns its application session. |
| Native mobile app | Public client with PKCE | The app uses a registered redirect pattern and a verifier/challenge pair. |
| Machine-to-machine service | Confidential client or service identity | The service obtains tokens for backend automation without an end-user browser session. |
| External API | Resource server | The API validates Auth-issued access tokens and enforces its own authorization decisions. |

Client settings decide the allowed redirect URIs, post-logout redirect URIs, CORS origins, scopes, grant types, PKCE requirements, token lifetimes, provider availability, and permissions. For the step-by-step client setup, see [Applications & clients](#clients). For redirect flow examples and parameter meanings, see [OAuth & OIDC](#oauth-oidc).

## Identity Provider Architecture

Auth always has a built-in Maintainerd identity provider for native username/password, OTP, MFA, and account flows. A tenant can also add external providers such as Google, GitHub, Microsoft, Okta, Auth0, Cognito, or another Maintainerd Auth deployment.

External provider integration is brokered:

```text
User selects provider
  -> Auth redirects to the upstream provider
  -> upstream provider authenticates the user
  -> upstream provider returns the user to Auth
  -> Auth maps the upstream identity to a local user identity
  -> Auth issues its own tokens for the tenant and client
```

This distinction matters. The upstream provider proves who the user is; Auth still owns the tenant membership, roles, permissions, sessions, consent, events, and application tokens.

Federation is useful when another organization already runs Maintainerd Auth or another identity platform and your tenant wants to trust that provider for sign-in. The local tenant still controls authorization after the external identity is linked.

For provider-by-provider setup, see [Identity providers](#identity-providers). For brokered and federated sign-in behavior, see [Federated login client](#federated-login-client).

## Request Flow: Hosted Login

A hosted login flow moves through Auth in this order:

```text
External app
  -> redirects browser to the tenant identity hostname
  -> Auth resolves tenant, client, redirect URI, scopes, prompt, hints, and security policy
  -> hosted identity renders login, registration, MFA, consent, or provider selection
  -> Auth authenticates the user locally or through an external provider
  -> Auth creates or updates session state
  -> Auth returns the browser to the registered application redirect URI
  -> external app completes its own session or token handling
```

The application should not collect the user's Auth password. It should send the user to hosted identity and let Auth handle credential entry, MFA, consent, registration, account recovery, and provider routing.

Useful related sections:

- [OAuth & OIDC](#oauth-oidc) for the full authorize flow and parameter meanings.
- [Hosted login flow](#hosted-login-flow) for the browser experience.
- [Login and registration](#login-registration) for available sign-in and signup behaviors.
- [Tokens & sessions](#tokens-sessions) for token and cookie behavior.

## Request Flow: Admin Console

The console flow is separate from end-user application login.

```text
Administrator
  -> opens private console hostname
  -> console starts Auth-managed sign-in
  -> Auth verifies tenant membership and management permissions
  -> console calls the internal management API
  -> management API checks token audience, tenant context, roles, permissions, and step-up when required
  -> domain services apply configuration changes
  -> audit logs and Auth events record the result
```

The management API is not an end-user login endpoint. It exists for console and trusted administrative automation. Tokens issued for ordinary third-party clients should not be accepted as management tokens.

Administrative permissions depend on the feature being changed:

| Feature Area | Typical Permission Category |
|---|---|
| Tenants and tenant members | Tenant and membership management permissions. |
| Applications and clients | Client management permissions. |
| Identity providers and registration flows | Identity-provider and registration-flow management permissions. |
| Users, invites, and account remediation | User and invite management permissions. |
| Roles, permissions, policies, services, APIs | Authorization and IAM management permissions. |
| Security controls and IP restrictions | Security-setting and IP-restriction management permissions. |
| Messaging, templates, branding | Messaging, template, and branding management permissions. |
| Events, webhooks, audit | Event, webhook, and audit-log management permissions. |

For exact feature behavior, use the relevant page from the sidebar. For the authorization model, see [Authorization model](#authorization-model), [Policies](#policies), and [Resources](#resources).

## Request Flow: Protecting An External API

External APIs are responsible for enforcing access to their own resources. Auth issues tokens and provides identity, tenant, client, role, and permission context; the API decides whether that context is enough for the requested operation.

```text
External application
  -> obtains an Auth-issued access token
  -> calls its own API with that token
  -> API validates issuer, audience, signature, expiration, tenant, and token type
  -> API maps claims, roles, permissions, or introspection results to local authorization rules
  -> API allows or denies the operation
```

This keeps Auth as the identity authority while allowing each product API to own its domain rules. For example, Auth can say the caller has `invoice:read`; the billing API still decides whether the caller may read invoice `INV-1001`.

For practical validation steps, see [Protect an API](#protect-api). For token shape and lifecycle behavior, see [Tokens & sessions](#tokens-sessions).

## Request Flow: Events And Webhooks

Auth emits two broad categories of events:

| Event Family | Purpose | Typical Consumer |
|---|---|---|
| Auth events | Security and audit-relevant identity activity such as login, MFA, OAuth, lockout, authorization failure, and account changes. | Operators, security review, dashboards, investigation workflows. |
| Integration events | Product integration events delivered to webhooks or broker routes. | External apps, automation, customer systems, downstream services. |

Integration events use an outbox architecture:

```text
Domain service changes state
  -> event service evaluates tenant event configuration
  -> event row is written with the same durable storage boundary
  -> relay worker claims pending rows
  -> delivery worker sends to subscribed webhook endpoints or broker routes
  -> delivery history records success, retry, or failure
```

Webhook delivery is at least once. Receivers should verify signatures, process quickly, deduplicate events, and fetch current state when they need the latest resource view.

For setup and payload structure, see [Events & webhooks](#events-webhooks). For the security event catalog, see [Auth events](#audit).

## Request Flow: Optional gRPC

gRPC is private infrastructure. It is not the browser login API and not a replacement for OAuth/OIDC.

There are two gRPC uses:

| gRPC Use | What It Allows | Typical Caller |
|---|---|---|
| Service-to-service runtime calls | Authorization decisions, token introspection, policy bundle reads, selected user/profile reads. | Internal product services that need Auth decisions at runtime. |
| Control-plane provisioning | Setup, tenant lifecycle, service/API/permission/policy/role/client provisioning, workload identity federation. | Maintainerd Core or trusted platform automation. |

The gRPC listener is intentionally private and should use TLS or mTLS according to the deployment. Control-plane provisioning must be treated as highly privileged because it can change tenant, client, permission, and policy state.

For gRPC setup, method boundaries, service-auth rules, and mTLS behavior, see [gRPC](#grpc), [Service authentication](#service-auth), [Workload identity](#workload-identity), and [Transport security](#transport-security).

## Internal Layers

Inside the backend, the code follows a clear responsibility flow.

```text
Transport handlers
  -> domain services
  -> repositories
  -> PostgreSQL and Redis

Shared platform helpers
  -> configuration, secrets, JWT, DPoP, middleware, telemetry, email, SMS, templates
```

| Layer | Responsibility |
|---|---|
| Process bootstrap | Loads configuration and secrets, initializes logging/telemetry, connects dependencies, runs migrations, starts workers and servers. |
| Composition root | Builds repositories, services, adapters, and transport dependencies from one shared application graph. |
| Transport layer | Handles HTTP and gRPC routing, middleware, request parsing, response formatting, and status mapping. |
| Domain services | Own business rules for authentication, OAuth, tenants, clients, users, IAM, MFA, providers, events, webhooks, messaging, and setup. |
| Repositories | Encapsulate PostgreSQL reads and writes for each domain. |
| Platform layer | Provides reusable infrastructure that should not own product behavior. |

Handlers should stay thin. Domain services decide what an operation means, which validations apply, which events are emitted, and which repositories change.

## Domain Ownership

Auth is organized by product domain instead of one large generic service layer.

| Domain | Owns |
|---|---|
| Authentication | Login, registration, password reset, magic links, SMS login, account linking, sessions, lockout, and MFA handoff. |
| OAuth/OIDC | Authorization, token issuance, refresh, consent, discovery, JWKS, userinfo, PAR, device flow, CIBA, token exchange, revocation, DPoP. |
| Tenants | Tenant records, tenant settings, tenant members, lifecycle status, maintenance, tenant creation defaults. |
| Clients | OAuth applications, client URIs, secrets, grant settings, provider assignment, API and permission assignment, CORS origins. |
| Identity providers | Built-in provider, external OAuth/OIDC providers, SAML-style federation where supported, provider credentials, identity linking. |
| Users | User records, profiles, account self-service, consent, trusted devices, sessions, data export, data deletion. |
| MFA | TOTP, SMS/email OTP, WebAuthn/passkeys, backup codes, challenge policy, trusted devices. |
| IAM | Services, APIs, permissions, roles, policies, policy bundles, authorization decisions. |
| Security policy | Password policy, MFA enforcement, session rules, lockout, rate limits, threat signals, IP restrictions. |
| Messaging | Email/SMS providers, templates, verification, invites, OTP, password reset, notification delivery. |
| Events and webhooks | Integration event configuration, outbox, delivery workers, retries, webhook endpoints, subscriptions, delivery history. |
| Audit | Auth events, management audit logs, security review, investigation evidence. |
| Branding | Tenant-specific logo, color, login UI presentation, templates, and hosted identity appearance. |
| Setup | Initial tenant, admin, default provider, console client, default roles, and bootstrap completion. |
| Federation and workload identity | External service identity, token exchange, federated trust, and service-to-service credentials. |

This domain ownership is useful when reading the documentation too. If the architecture page introduces a concept, the detailed configuration belongs in the feature page for that domain.

## Startup And Dependency Order

Auth starts in a fixed order so configuration errors fail before traffic is accepted.

1. Load configuration and secret-backed values.
2. Initialize logging, traces, and metrics.
3. Load or prepare JWT signing keys.
4. Connect to PostgreSQL.
5. Connect to Redis when configured.
6. Initialize shared security helpers such as rate limiting.
7. Run database migrations.
8. Build repositories.
9. Build domain services and cross-domain adapters.
10. Start background workers.
11. Start REST surfaces.
12. Start gRPC when configured.

Readiness only succeeds when the service can serve real traffic. Health only proves the process is alive. For probe behavior and failure diagnosis, see [Troubleshooting](#troubleshooting).

## Storage Architecture

PostgreSQL is the durable source of truth. Redis is shared short-lived infrastructure.

| Store | Role |
|---|---|
| PostgreSQL | Tenants, users, identities, memberships, clients, providers, sessions, OAuth artifacts, roles, permissions, policies, events, templates, settings, webhooks, audit logs, signing keys, revocations, setup state. |
| Redis | Rate limits, OTP and WebAuthn challenge state, short-lived OAuth state, cache, session/JTI denylist checks, replay protection, cross-replica coordination. |

Redis absence may not always stop the process, but production deployments should treat Redis as important for reliable rate limiting, revocation, OTP throttling, and multi-replica behavior.

For operational storage configuration, see [Database & Redis](#database-redis).

## Secret And Key Architecture

Auth separates ordinary configuration from sensitive configuration.

Ordinary environment variables describe hostnames, ports, feature flags, lifetimes, provider selection, CORS, proxy trust, and telemetry. Secrets supply database passwords, JWT keys, encryption keys, HMAC keys, setup bootstrap credentials, retired encryption keys, provider credentials, SMTP credentials, SMS credentials, webhook signing secrets, and TLS material.

Key responsibilities:

| Secret Or Key | What It Protects |
|---|---|
| JWT signing keys | Access tokens, ID tokens, refresh-token-related verification, OIDC trust. |
| Application encryption key | Encrypted provider credentials and sensitive stored configuration. |
| HMAC secret | Signed internal values and tamper-evident tokens where HMAC is used. |
| Webhook signing secrets | Receiver verification for outbound webhook deliveries. |
| gRPC TLS and client CA material | Service-to-service and control-plane transport identity. |
| Retired encryption keys | Decryption during key rotation windows. |

All replicas must agree on the active key material. If one replica signs tokens with different keys or cannot decrypt provider credentials, users will see inconsistent authentication behavior across requests.

For exact variables and rotation guidance, see [Environment variables](#environment) and [Secrets & keys](#secrets).

## Security Boundaries

Architecture is also a security control. Auth intentionally separates public identity, private administration, tenant context, token audience, and service-to-service trust.

| Boundary | What It Prevents |
|---|---|
| Public identity vs internal management | A normal application token should not become an admin token. |
| Tenant routing and tenant-scoped records | Users, clients, providers, roles, and events should not bleed across tenants. |
| OAuth client audience | Tokens issued to one application should not be reused as another application's credential. |
| Step-up gates | Sensitive account and administrative actions require stronger recent authentication. |
| IP restriction and rate-limit middleware | Abusive or disallowed traffic is stopped before expensive domain work. |
| DPoP and certificate binding | Sender-constrained tokens are harder to replay from a different client. |
| Private management and gRPC surfaces | Operational and provisioning functions remain off the public internet. |
| Audit and Auth events | Security-relevant changes and decisions leave evidence. |

For configuration, see [Security controls](#security), [Transport security](#transport-security), and [Tokens & sessions](#tokens-sessions).

## Observability Architecture

Auth emits operational and security signals through several channels:

| Signal | Purpose |
|---|---|
| Structured logs | Request IDs, trace IDs, errors, security denials, worker activity, delivery failures. |
| Metrics | Health, request activity, latency, error rates, event counts, audit write failures, worker behavior. |
| Traces | Cross-service request flow when OpenTelemetry export is configured. |
| Auth events | Security and identity activity by tenant and user. |
| Management audit logs | Administrative mutations, actor identity, target, result, and timestamp. |
| Webhook delivery history | Per-endpoint delivery attempts, failures, retries, and response metadata. |

Developers should capture request IDs and trace IDs from failed flows. Operators should correlate those IDs across logs, metrics, Auth events, and audit logs. For details, see [Observability](#observability), [Auth events](#audit), and [Troubleshooting](#troubleshooting).

## Background Workers

Some Auth behavior runs outside the browser request that triggered it.

| Worker Responsibility | What It Does |
|---|---|
| Event relay | Claims pending outbox events and routes them to webhooks or broker delivery. |
| Webhook retry | Retries failed deliveries according to delivery policy. |
| Retention cleanup | Removes or archives records according to configured retention rules. |
| Signing-key rotation | Supports database-backed signing-key lifecycle when configured. |
| Security and cache invalidation tasks | Keeps authorization and event-related state fresh across replicas. |

Background work should be designed as retryable and idempotent. If a request commits state and emits an event, the receiver may see the event later, more than once, or after a retry.

For lifecycle behavior, see [Lifecycle runners](#lifecycle-runners), [Data lifecycle](#data-lifecycle), and [Events & webhooks](#events-webhooks).

## Deployment Layouts

There are two common deployment layouts.

| Layout | Use It When | Key Decisions |
|---|---|---|
| Standalone Auth | A product team wants Auth as the identity service for its own stack. | Configure hostnames, setup tenant/admin, create clients, connect providers, configure security, expose identity public surfaces, keep management private. |
| Maintainerd ecosystem Auth | Auth is provisioned and managed by Maintainerd Core. | Configure control-plane trust, mTLS, workload identity, provisioning boundaries, service-to-service networking, and platform ownership. |

Both layouts still use the same core concepts: tenants, clients, providers, roles, permissions, policies, tokens, events, and private management surfaces.

## Developer Decisions Before Integration

Before integrating an application, decide:

| Decision | Why It Matters | Where To Configure |
|---|---|---|
| Tenant hostname | Determines which tenant handles login and registration. | [Hostnames & tenant URLs](#surfaces-hostnames) |
| Application client type | Determines PKCE, secrets, grant types, redirect behavior, and token handling. | [Applications & clients](#clients) |
| Redirect and logout URLs | OAuth requires exact registered URLs. | [Applications & clients](#clients) and [OAuth & OIDC](#oauth-oidc) |
| Identity providers | Determines whether users authenticate locally, externally, or through federation. | [Identity providers](#identity-providers) |
| Registration behavior | Determines whether users can self-sign up, use invites, verify email/phone, or receive default roles. | [Registration flows](#registration-flows) |
| Roles and permissions | Determines what users and clients can do after login. | [Authorization model](#authorization-model), [Policies](#policies), [Resources](#resources) |
| API protection strategy | Determines how your API validates tokens and maps authorization. | [Protect an API](#protect-api) |
| Session and token lifetimes | Determines user experience, refresh behavior, revocation, and cookie policy. | [Tokens & sessions](#tokens-sessions) and [Security controls](#security) |
| Event subscriptions | Determines which downstream systems receive Auth activity. | [Events & webhooks](#events-webhooks) |
| Observability signals | Determines how incidents are diagnosed. | [Observability](#observability) and [Troubleshooting](#troubleshooting) |

This is the practical path: set up Auth, configure the tenant, create the client, choose providers, assign permissions, protect the external API, then subscribe to the events your product needs.

## Design Rules

- Keep public login, OAuth, and account flows on the public identity surfaces.
- Keep operator administration on the console and internal management API.
- Keep health, readiness, metrics, OpenAPI JSON, database, Redis, and gRPC on private networking.
- Preserve tenant hostnames at the edge.
- Treat tenant context as required input for identity, authorization, security, and event behavior.
- Treat PostgreSQL as durable truth and Redis as shared short-lived infrastructure.
- Let Auth issue identity tokens, but let each product API enforce its own resource-level authorization.
- Use the outbox and webhook delivery path for integration events instead of direct side effects from request handlers.
- Store sensitive values in the configured secret provider, not in documentation, tickets, or client-side application code.
- Reference the feature pages for setup details instead of duplicating configuration rules across sections.
