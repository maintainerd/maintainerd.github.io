# Tenants & Clients

The tenant is the root ownership boundary. It owns users, members, identity providers, clients, roles, permissions, policies, API keys, registration flows, invites, branding, templates, security settings, notification providers, and webhook configuration.

## Tenant Context

Each tenant represents the organization or environment that owns the identity deployment. Tenant settings control instance-level behavior such as rate limits, audit settings, maintenance mode, email and SMS configuration, branding, and security defaults.

## Client Context

Clients are application registrations. They model SPA, mobile, traditional web, and machine-to-machine applications.

A client can define:

- Redirect URIs, logout URIs, CORS origins, and allowed origins.
- Grant types and response types.
- Access token and refresh token TTLs.
- Secret behavior for confidential clients.
- Consent requirements.
- Assigned API permissions.

## External And First-Party Split

External applications use public OAuth clients and identify with `client_id`.

First-party Maintainerd applications preserve tenant context with `tenant_id` and explicit system clients such as the console and identity app.

That distinction matters because a public external app should not be treated like an internal Maintainerd surface.

