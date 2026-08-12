# Auth Documentation

Auth is Maintainerd's identity and access service. It gives teams one place to run hosted login, OAuth 2.0, OpenID Connect, users, tenants, clients, external identity providers, MFA, sessions, service authorization, audit trails, events, webhooks, messaging templates, and operational controls.

Use these docs as a product map first, then as implementation guides section by section. The current focus is making every important Auth capability visible in the navigation so developers and operators know where each workflow belongs.

![Auth console identity provider configuration](/assets/auth-console-identity-provider.png)

## What Auth Is For

Auth is the boundary between an application, the people signing in to it, and the services enforcing access behind it.

For a developer-owned app, Auth can act as the OAuth/OIDC provider. The app creates a client, sends users to hosted login, receives an authorization code, exchanges it for tokens, verifies JWTs with JWKS, and uses UserInfo or token claims to create its own session.

For a Maintainerd service, Auth is also the authorization authority. Services can register APIs and permissions, receive policies, fetch policy bundles, call authorization endpoints, use token introspection, or use gRPC runtime APIs when that surface is enabled.

For operators, Auth is the console surface for managing tenants, users, identity providers, clients, roles, permissions, security controls, messaging, branding, webhooks, audit logs, and observability.

## The Main Building Blocks

### Tenants

A tenant owns users, clients, identity providers, roles, permissions, policies, templates, branding, settings, events, and security controls. Hosted identity and console URLs are tenant-aware, so each tenant can have its own login context.

### Users And Accounts

Users sign in through the hosted identity UI. Account self-service includes profile data, email and username changes, password changes, MFA factors, sessions, trusted devices, linked identities, consent records, export, and erasure flows.

### Clients

Clients represent applications. External apps use `client_id` in public OAuth/OIDC flows. Client configuration controls redirect URIs, post-logout redirect URIs, grants, response types, token authentication, consent behavior, token lifetimes, and which login providers appear for that app.

### Identity Providers

Identity providers let a tenant accept identities from built-in Auth credentials, social providers, enterprise OIDC/OAuth2 providers, and SAML providers. Providers can be attached to specific clients, which lets one application offer GitHub login while another offers only password or enterprise SSO.

### OAuth And Sessions

Auth handles authorization code with PKCE, refresh tokens, client credentials, device authorization, CIBA, token exchange, revocation, introspection, UserInfo, discovery, JWKS, consent, and end-session flows.

### Authorization

Auth models services, APIs, permissions, roles, and policies. Resource services can verify tokens locally, ask Auth for token state, fetch policy bundles, or call authorization APIs to make runtime access decisions.

## How Developers Use Auth

The typical external application workflow is:

1. Create or choose a tenant.
2. Create an OAuth client for the app.
3. Add redirect and post-logout redirect URIs.
4. Configure grant types, token settings, and consent behavior.
5. Optionally create an external identity provider.
6. Attach the provider to the client so it appears on that app's login screen.
7. Send users to hosted login with the app's `client_id`.
8. Exchange the authorization code for tokens.
9. Verify tokens using OIDC discovery and JWKS.
10. Protect application APIs with permissions, roles, policies, introspection, or authorization checks.

Start with **Developer workflows** when documenting app onboarding examples. Use **Applications & clients**, **Identity providers**, **OAuth & OIDC**, and **Protect an API** when expanding the implementation details.

## How Operators Use Auth

Operators usually start by making the instance production-ready:

- Finish setup and create the first tenant/admin.
- Configure public identity, internal management, console, and management hostnames.
- Configure PostgreSQL, Redis, secrets, signing keys, and cookie settings.
- Configure email and SMS providers before enabling flows that send messages.
- Review password, MFA, session, lockout, registration, and threat controls.
- Set up branding, templates, webhooks, auth events, management audit logs, metrics, traces, and logs.

## Runtime Modes

Auth can run standalone, with runtime gRPC, or under Core control.

- Standalone is the default. REST, OAuth/OIDC, the console, hosted identity, workers, metrics, and probes run without exposing the Core provisioning listener.
- Runtime gRPC adds machine APIs for authorization, introspection, and peer reads without enabling Core provisioning.
- Control-plane mode lets Maintainerd Core provision and manage Auth through mTLS gRPC.

Use **Runtime modes**, **Control plane**, **Surfaces & hostnames**, and **Transport security** when documenting deployments.

## What To Read Next

- **Quickstart** for the shortest path from container to first usable instance.
- **Setup** for first-run tenant and admin bootstrap.
- **External app setup** for connecting a developer-owned application.
- **Federated login per client** for adding social, enterprise, OIDC/OAuth2, or SAML login to one app.
- **Protect an API** for permissions, policies, and runtime authorization.
- **Feature inventory** for the current code-derived capability map.
