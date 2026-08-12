# Auth Documentation

Auth is Maintainerd's self-hostable identity and access platform. It gives teams a single service for authentication, federation, OAuth 2.0, OpenID Connect, users, tenants, clients, policies, MFA, sessions, service authorization, audit events, and operational controls.

These docs are organized around the way Auth is operated and integrated: setup, configuration, identity, OAuth, authorization, messaging, events, observability, and runtime operations.

This documentation is sourced from the current `maintainerd-auth` backend, `web/console`, `web/identity`, and protobuf service surface.

![Auth console interface preview](/assets/m9d-auth-console.png)

## What Auth Includes

- A Go backend that exposes public identity APIs, internal management APIs, management probes, metrics, and gRPC.
- A hosted identity UI for login, registration, consent, MFA, account management, sessions, devices, and linked identities.
- An admin console for tenants, users, clients, identity providers, registration flows, roles, permissions, policies, services, APIs, webhooks, templates, messaging, security, and observability views.
- Runtime integrations for PostgreSQL, Redis, OpenTelemetry, Prometheus, SMTP, SMS providers, webhook delivery, and secret managers.

## Who It Serves

- Application users use the hosted identity UI for login, registration, reset-password, MFA, consent, and account self-service.
- Administrators use the console to manage tenants, users, members, clients, providers, roles, permissions, policies, templates, webhooks, and security settings.
- Services use OAuth service clients, service principals, policy bundles, authorization checks, gRPC authorization, token introspection, and audit-ready event trails.

## How To Think About It

Auth is not only a login box. It is the identity boundary and authorization brain for the system. External apps can use it as a self-hosted OAuth/OIDC provider, while Maintainerd services can use it as the central place for service identity and policy decisions.

Start with **Quickstart** and **Setup** when deploying a new instance. Use **Environment variables**, **Secrets & keys**, and **Database & Redis** for runtime configuration. Use the Identity, OAuth, and Authorization groups when integrating external apps or Maintainerd services.
