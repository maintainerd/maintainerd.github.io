# Auth Documentation

Auth is Maintainerd's identity and access service. It gives your platform a place to manage tenants, users, login, registration, identity providers, sessions, MFA, application clients, permissions, audit events, and account self-service.

These docs are written as an app and setup guide. They explain where a feature appears in the Auth console or hosted identity UI, what the screen is for, what fields mean, what choices are available, how to configure the service, and what permissions or security rules apply.

Setup commands, environment examples, DNS examples, reverse-proxy examples, and deployment snippets belong in these docs because developers need them to run Auth. API request samples, endpoint payloads, response schemas, and generated-client examples belong in the API reference.

## How To Use These Docs

Read the docs in the same order you would set up Auth:

1. Understand the product areas.
2. Run or open Auth.
3. Complete setup.
4. Configure HTTPS hostnames, secrets, database, Redis, and deployment.
5. Create tenants and understand system-vs-tenant URLs.
6. Create application clients.
7. Configure identity providers, brokered login, and federation.
8. Configure registration, login, and account self-service.

When a page mentions a screen, treat the navigation path as the starting point. The field explanations tell you what you are looking at and what each choice changes. The workflow sections tell you the normal order of operations.

## Main App Areas

Auth has two user-facing surfaces:

- Console: the administrator app for configuring tenants, users, providers, clients, policies, audit, and operations.
- Hosted identity UI: the end-user app for login, registration, MFA, consent, password reset, invite acceptance, and account settings.

Auth also has service surfaces used by applications and Maintainerd services:

- Public identity surface: the browser and application-facing identity layer.
- Internal management surface: the private administrator and automation layer.
- Optional private service surface: service-to-service traffic when your production platform enables it.

Beginners should start in the console. Developers integrating an app should also understand the hosted identity UI because that is where users complete sign-in and account flows.

## Navigation Map

Use this map to know where a feature normally lives:

- Setup: open the setup wizard before the first tenant and admin user exist.
- Architecture: understand the boundaries before integrating services.
- Environment variables: configure process-level runtime values.
- Secrets and keys: configure signing, encryption, bootstrap, and provider secrets.
- Database and Redis: configure persistence, migrations, cache, sessions, and background state.
- Hostnames and tenant URLs: configure console, identity, API, and tenant hostnames.
- Deployment: prepare production runtime, reverse proxy, TLS, workers, and probes.
- Tenants and members: manage tenant settings and administrator access.
- Users and invites: manage human accounts and onboarding invitations.
- Applications and clients: register production applications, redirects, logout URLs, CORS origins, grants, and provider connections.
- Identity providers: configure password, social login, OIDC, SAML, and provider mapping.
- OAuth and OIDC: understand the protocol behavior your clients use.
- Registration flows: choose who can create accounts and what happens during onboarding.
- Login and registration: understand the hosted user journey.
- Account self-service: understand what signed-in users can manage themselves.

## Important Concepts

A tenant is the security boundary. Tenant settings decide which users, providers, clients, policies, branding, events, and data lifecycle rules apply. The full tenant and member model is in [Tenants & members](#tenants-members).

A user is a human account inside one tenant. A user can have profiles, sessions, devices, MFA factors, consents, linked identities, and roles. See [Users & invites](#users-invites) for administration and onboarding.

A tenant member is an administrator relationship. Members are people allowed to manage tenant settings in the console. Tenant membership is separate from application roles.

A client is an application that uses Auth for login. Clients define redirect behavior, logout behavior, allowed login methods, provider connections, and OAuth/OIDC behavior. See [Applications & clients](#clients) for setup fields.

An identity provider is a way to prove identity. Auth can use built-in email/password, passwordless methods, OIDC/OAuth2 providers, SAML providers, and other configured provider types. See [Identity providers](#identity-providers) for brokered login and federation.

A registration flow decides how accounts are created. It controls open signup, invite-only signup, provider-driven signup, profile completion, verification, and default access. See [Registration flows](#registration-flows) for onboarding choices.

## Permissions Model

Auth separates user self-service from administration.

- Normal users can manage only their own account where policy allows.
- Tenant administrators can manage tenant settings and users based on their member role.
- Service identities and workloads can call service surfaces only when explicitly trusted.
- Sensitive changes may require step-up MFA even for administrators.

This separation matters because many identity features look similar but have different risk. A user changing their own password is not the same as an administrator resetting another user's password.

## What Belongs In These Docs

These docs should include:

- Step-by-step setup commands.
- Configuration examples.
- Environment-variable examples.
- DNS and TLS examples.
- Reverse-proxy and deployment examples.
- Console navigation guidance.
- Field explanations.
- Permission and security notes.
- Troubleshooting guidance.

The goal is that a beginner can follow the setup pages without guessing what command to run or what a field means.

## What Belongs In The API Reference

These docs intentionally avoid API request samples and response shapes. Use the API reference when you need:

- Exact endpoint paths.
- Request and response fields.
- Status codes.
- Generated client usage.
- Authentication headers.
- Pagination, filtering, and sorting behavior.

Use these docs when you need to understand what the feature does, where it appears in the app, which option to choose, and what the security impact is.

## First-Time Path

For a new deployment:

1. Read Setup.
2. Run the quickstart or open your deployed setup wizard.
3. Create the first tenant and administrator.
4. Configure HTTPS hostnames.
6. Configure secrets, database, and Redis.
7. Create an application client.
8. Configure identity providers and connect them to the client.
9. Configure login and registration.
10. Add users or invites.
11. Test the hosted identity UI and account self-service.

## Common Beginner Mistakes

- Treating tenant members as application users. They are related, but not the same.
- Using email as a global user identifier. Users are tenant-scoped.
- Collecting Auth passwords inside downstream apps. Use the hosted identity UI.
- Enabling public registration before default roles and abuse controls are ready.
- Configuring an identity provider without connecting it to the client that should use it.
- Changing hostnames without updating cookies, redirects, CORS, and WebAuthn origins.
- Looking for endpoint payloads in conceptual docs instead of the API reference.
