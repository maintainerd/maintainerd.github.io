# Surfaces & Hostnames

Auth exposes several surfaces from one `maintainerd-auth` process. The important rule is simple: each surface has a different audience, and the hostname tells Auth which tenant, browser app, or API boundary the request belongs to.

Use this section when deciding DNS names, reverse-proxy routes, frontend runtime config, client domains, redirect URIs, and tenant subdomain behavior.

## Surface Model

Auth separates these surfaces:

| Surface | Audience | Purpose |
|---|---|---|
| Internal management API | Console and trusted operators. | Operator/admin API used by the console. |
| Public identity API | Hosted identity, external applications, and relying parties. | OAuth/OIDC issuer, hosted login data plane, account self-service, and public client/tenant lookup. |
| Management port | Platform probes and monitoring. | Health, readiness, OpenAPI JSON, and Prometheus metrics. |
| Embedded admin console | Operators and tenant administrators. | Browser UI for administration. |
| Embedded hosted identity UI | End users and OAuth browser flows. | Browser UI for login, registration, MFA, consent, recovery, and account self-service. |
| Optional gRPC surface | Peer services and control-plane automation. | Runtime and control-plane machine traffic when enabled. |

The HTTP API ports are plain process listeners. In production, put TLS termination, DNS, and public/private exposure rules in front of them with a load balancer, ingress, reverse proxy, or platform routing layer.

## Process Ports

Default listeners:

| Port | Surface | Exposure |
|---:|---|---|
| `8080` | Internal management API | Private. |
| `8081` | Public identity API and OAuth/OIDC issuer | Public. |
| `8082` | Management port for probes, OpenAPI JSON, and metrics | Private. |
| `3000` | Embedded admin console | Private. |
| `3001` | Embedded hosted identity UI | Public. |

Configurable listener variables:

| Variable | Default | Accepted Shape |
|---|---|---|
| `MANAGEMENT_PORT` | `8082` | `8082` or `:8082`. |
| `APP_CONSOLE_PORT` | `3000` | `3000` or `:3000`. |
| `APP_IDENTITY_PORT` | `3001` | `3001` or `:3001`. |

The internal API and public API ports are fixed in the current server: internal API on `:8080`, public API on `:8081`.

Example local process listeners:

```env
MANAGEMENT_PORT=8082
APP_CONSOLE_PORT=3000
APP_IDENTITY_PORT=3001
```

## Required Hostname Variables

Auth requires four deployment hostnames:

| Variable | Role |
|---|---|
| `APP_PUBLIC_HOSTNAME` | Public API and OAuth/OIDC issuer origin. |
| `APP_PRIVATE_HOSTNAME` | Internal management API origin. |
| `APP_FRONTEND_IDENTITY_HOSTNAME` | System-tenant hosted identity UI origin. |
| `APP_FRONTEND_CONSOLE_HOSTNAME` | System-tenant admin console UI origin. |

Valid shape:

```env
APP_PUBLIC_HOSTNAME=https://identity-api.auth.example.com
APP_PRIVATE_HOSTNAME=https://console-api.auth.example.com
APP_FRONTEND_IDENTITY_HOSTNAME=https://identity.auth.example.com
APP_FRONTEND_CONSOLE_HOSTNAME=https://console.auth.example.com
```

Use full HTTPS origins in production. Do not include `/api/v1` in these values; paths are mounted by Auth and the reverse proxy.

## What Each Hostname Means

`APP_PUBLIC_HOSTNAME` is the authorization-server origin. It is used for OAuth/OIDC discovery, JWKS, token issuer behavior, public identity API calls, and external application authentication.

The exact discovery, JWKS, OAuth, and token paths belong in the API reference. This page defines which origin owns that public identity traffic.

`APP_PRIVATE_HOSTNAME` is the internal management API origin used by the console and operator/admin workflows. Keep it on private networking or behind operator-only access controls.

The exact management paths belong in the API reference. This page defines which origin should be private and operator-facing.

`APP_FRONTEND_IDENTITY_HOSTNAME` is the system-tenant hosted identity UI. It is where users see login, registration, MFA, consent, password reset, invite registration, and account self-service screens.

Example identity UI URL:

```text
https://identity.auth.example.com/login
```

`APP_FRONTEND_CONSOLE_HOSTNAME` is the system-tenant admin console UI. It is where operators manage tenants, clients, identity providers, policies, users, messaging, events, webhooks, security settings, and observability-adjacent views.

Example console URL:

```text
https://console.auth.example.com/clients
```

## Embedded Frontends

Auth can serve the console and identity SPAs from the same process.

The console listener serves:

- Static console assets.
- `/config.js` for runtime frontend configuration.
- `/api/` mounted to the internal management router.
- `/public-api/` mounted to the public identity router.

The identity listener serves:

- Static hosted identity assets.
- `/config.js` for runtime frontend configuration.
- `/api/` mounted to the public identity router.
- `/.well-known/` mounted to public OIDC discovery and JWKS.

This same-origin design is intentional. Browser sessions use secure host-bound cookies, so the browser should call the API on the same origin as the SPA whenever possible.

In embedded mode, console browser calls stay on the console origin and identity browser calls stay on the identity origin. The mounted API paths are implementation details covered by the API reference and frontend runtime configuration.

## Reverse Proxy Shape

A typical production routing shape is:

| Hostname | Upstream | Exposure |
|---|---|---|
| `console.auth.example.com` | `auth:3000` | Private operator access. |
| `identity.auth.example.com` | `auth:3001` | Public hosted identity. |
| `console-api.auth.example.com` | `auth:8080` | Private management API. |
| `identity-api.auth.example.com` | `auth:8081` | Public identity API and issuer. |
| `auth-management.internal` | `auth:8082` | Private probes and metrics. |

The local quickstart uses the same shape with `.local` hostnames:

```env
APP_FRONTEND_CONSOLE_HOSTNAME=https://console.auth.maintainerd.local
APP_FRONTEND_IDENTITY_HOSTNAME=https://identity.auth.maintainerd.local
APP_PUBLIC_HOSTNAME=https://identity-api.auth.maintainerd.local
APP_PRIVATE_HOSTNAME=https://console-api.auth.maintainerd.local
```

Do not expose `:8080` or `:8082` directly to the public internet. The public internet should normally reach the hosted identity UI and the public identity/OAuth API, not the management API or management probe port.

## Tenant Host Resolution

`APP_FRONTEND_IDENTITY_HOSTNAME` and `APP_FRONTEND_CONSOLE_HOSTNAME` define the system-tenant hosts. Regular tenant hosts are derived by prepending one DNS label before the configured system host.

Example:

```text
System identity UI: https://identity.auth.example.com
Tenant identity UI: https://acme.identity.auth.example.com

System console UI:  https://console.auth.example.com
Tenant console UI:  https://acme.console.auth.example.com
```

Auth resolves tenant hosts by comparing the incoming `Host` header to the configured frontend bases:

| Host Match | Meaning |
|---|---|
| Exact match to the configured frontend base | System tenant. |
| A single label before the base | Regular tenant slug. |
| Deeper nested host | Rejected for tenant resolution. |
| Unknown host | Does not resolve to a tenant. |

Valid tenant host:

```text
acme.identity.auth.example.com
```

Rejected as a tenant slug because it has more than one label before the base:

```text
dev.acme.identity.auth.example.com
```

The incoming host is authoritative for tenant-bound browser flows. Auth does not trust a caller-provided tenant ID to decide which tenant a browser request belongs to.

## Frontend URL Generation

When Auth needs to build a frontend URL, it uses the configured system-tenant frontend host and the tenant slug.

For the system tenant:

```text
https://identity.auth.example.com/reset-password
https://console.auth.example.com/settings
```

For a regular tenant named `acme`:

```text
https://acme.identity.auth.example.com/reset-password
https://acme.console.auth.example.com/settings
```

The URL helper normalizes frontend hosts to HTTPS. Production DNS and TLS certificates must cover both the system host and tenant subdomains.

## Frontend Runtime Configuration

The embedded frontends get runtime configuration from `/config.js` and `window.__ENV__`. This page explains which host owns each browser surface and why same-origin API mounts are preferred for browser sessions. For the actual `VITE_*` variable list and defaults, see [Environment variables](#environment).

## External Application Domains

External application domains are not the same as Auth deployment hostnames.

Auth deployment hostnames answer:

- Where is Auth's public API?
- Where is Auth's private management API?
- Where is Auth's hosted identity UI?
- Where is Auth's console UI?

Client configuration answers:

- What application is asking users to sign in?
- What is the client's domain?
- Which redirect URIs are allowed?
- Which CORS origins are allowed?
- Which login/logout URIs are allowed?

Example external app:

```text
Application domain: https://app.customer.example
Redirect URI:       https://app.customer.example/auth/callback
CORS origin URI:    https://app.customer.example
Post logout URI:    https://app.customer.example/logout/callback
```

For browser OAuth clients, redirect URI matching is exact. Wildcards, prefix matching, and arbitrary subdomain matching are not accepted. Use HTTPS redirect URIs for browser applications. Mobile clients may use reverse-domain private schemes such as `com.example.app:/oauth`.

Register external app domains, redirect URIs, logout URIs, and CORS origins on the client record. Do not change `APP_PUBLIC_HOSTNAME` or frontend hostnames to onboard an external application. For client fields and workflows, see [Applications & clients](#clients).

## CORS And Origins

Auth has two CORS paths:

- `CORS_ALLOWED_ORIGINS`: static operator allowlist from environment.
- Client `cors_origin_uri` entries: dynamic per-tenant origins registered with clients.

Client CORS origins are scoped to the tenant whose host received the request. This prevents one tenant's registered origin from reading another tenant's credentialed responses.

Example static allowlist:

```env
CORS_ALLOWED_ORIGINS=https://ops.example.com,https://admin.example.com
```

Example client origin:

```text
https://app.customer.example
```

Prefer client `cors_origin_uri` entries for external applications. Use `CORS_ALLOWED_ORIGINS` for operator-owned exceptions that are not modeled as a tenant client.

## Cookie Domain And Same-Site Boundaries

`COOKIE_DOMAIN` is optional. When unset, cookies are host-only. When set, cookies can be shared across first-party Auth surfaces under a parent domain.

Example:

```env
COOKIE_DOMAIN=auth.example.com
```

Only set `COOKIE_DOMAIN` for a domain whose subdomains you control. External applications on other domains do not share Auth cookies. They authenticate through OAuth/OIDC and maintain their own application session.

First-party browser trust is based on same-site/domain behavior, not a row flag. A client is treated as first-party only when its stored domain shares the same registrable domain as the Auth deployment's public hostname.

## WebAuthn Hostname Planning

Passkeys depend on the relying-party ID. By default, Auth derives the RP ID from `APP_PUBLIC_HOSTNAME`. If users enroll passkeys across console, identity, and tenant subdomains, set `WEBAUTHN_RP_ID` to the shared parent domain.

Example:

```env
APP_PUBLIC_HOSTNAME=https://identity-api.auth.example.com
APP_FRONTEND_IDENTITY_HOSTNAME=https://identity.auth.example.com
APP_FRONTEND_CONSOLE_HOSTNAME=https://console.auth.example.com
WEBAUTHN_RP_ID=auth.example.com
```

With this shape, passkey ceremonies can work across:

```text
identity.auth.example.com
console.auth.example.com
acme.identity.auth.example.com
acme.console.auth.example.com
```

## Production Checklist

Before deploying hostnames:

- Use HTTPS origins for all `APP_*_HOSTNAME` values.
- Keep public identity API and hosted identity UI reachable by end users and external OAuth clients.
- Keep the internal management API private.
- Keep the management port private.
- Route console and identity SPA API calls same-origin when using the embedded image.
- Configure DNS and TLS certificates for tenant subdomains.
- Register external application domains and redirect/origin URIs on client records, not in Auth deployment hostname variables.
- Configure `COOKIE_DOMAIN` only when you intentionally want first-party Auth surfaces to share browser sessions.
- Configure `WEBAUTHN_RP_ID` when passkeys must work across multiple Auth subdomains.
