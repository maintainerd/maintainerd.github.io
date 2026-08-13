# Auth Documentation

Auth is Maintainerd's identity and access service. It gives your platform a place to manage tenants, users, login, registration, identity providers, sessions, MFA, application clients, permissions, audit events, and account self-service.

These docs are written as an app and setup guide. They explain where a feature appears in the Auth console or hosted identity UI, what the screen is for, what fields mean, what choices are available, how to configure the service, and what permissions or security rules apply.

Setup commands, environment examples, DNS examples, reverse-proxy examples, and deployment snippets belong in these docs because developers need them to run Auth. API request samples, endpoint payloads, response schemas, and generated-client examples belong in the API reference.

## How To Use These Docs

Read the docs in the same order you would set up Auth:

1. Understand the product areas.
2. Run or open Auth.
3. Complete setup.
4. Configure runtime, hostnames, secrets, database, and deployment.
5. Create tenants.
6. Add users or invites.
7. Configure identity providers.
8. Configure registration, login, and account self-service.

When a page mentions a screen, treat the navigation path as the starting point. The field explanations tell you what you are looking at and what each choice changes. The workflow sections tell you the normal order of operations.

## Main App Areas

Auth has two user-facing surfaces:

- Console: the administrator app for configuring tenants, users, providers, clients, policies, audit, and operations.
- Hosted identity UI: the end-user app for login, registration, MFA, consent, password reset, invite acceptance, and account settings.

Auth also has service surfaces used by applications and Maintainerd services:

- Public identity surface: the browser and application-facing identity layer.
- Internal management surface: the private administrator and automation layer.
- Optional gRPC surface: the service-to-service control-plane layer.

Beginners should start in the console. Developers integrating an app should also understand the hosted identity UI because that is where users complete sign-in and account flows.

## Navigation Map

Use this map to know where a feature normally lives:

- Setup: open the setup wizard before the first tenant and admin user exist.
- Runtime modes: choose how Auth runs in your environment.
- Architecture: understand the boundaries before integrating services.
- Environment variables: configure process-level runtime values.
- Secrets and keys: configure signing, encryption, bootstrap, and provider secrets.
- Database and Redis: configure persistence, migrations, cache, sessions, and background state.
- Surfaces and hostnames: configure console, identity, API, and tenant hostnames.
- Deployment: prepare production runtime, reverse proxy, TLS, workers, and probes.
- Identity types: learn what tenant, user, member, provider, client, and session mean.
- Tenants and members: manage tenant settings and administrator access.
- Users and invites: manage human accounts and onboarding invitations.
- Identity providers: configure password, social login, OIDC, SAML, and provider mapping.
- Registration flows: choose who can create accounts and what happens during onboarding.
- Login and registration: understand the hosted user journey.
- Account self-service: understand what signed-in users can manage themselves.

## Important Concepts

A tenant is the security boundary. Tenant settings decide which users, providers, clients, policies, branding, events, and data lifecycle rules apply.

A user is a human account inside one tenant. A user can have profiles, sessions, devices, MFA factors, consents, linked identities, and roles.

A tenant member is an administrator relationship. Members are people allowed to manage tenant settings in the console. Tenant membership is separate from application roles.

A client is an application that uses Auth for login. Clients define redirect behavior, logout behavior, allowed login methods, provider connections, and OAuth/OIDC behavior.

An identity provider is a way to prove identity. Auth can use built-in email/password, passwordless methods, OIDC/OAuth2 providers, SAML providers, and other configured provider types.

A registration flow decides how accounts are created. It controls open signup, invite-only signup, provider-driven signup, profile completion, verification, and default access.

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
4. Review runtime mode.
5. Configure hostnames.
6. Configure secrets, database, and Redis.
7. Create an application client.
8. Configure login and registration.
9. Add users or invites.
10. Test the hosted identity UI and account self-service.

## Common Beginner Mistakes

- Treating tenant members as application users. They are related, but not the same.
- Using email as a global user identifier. Users are tenant-scoped.
- Collecting Auth passwords inside downstream apps. Use the hosted identity UI.
- Enabling public registration before default roles and abuse controls are ready.
- Configuring an identity provider without connecting it to the client that should use it.
- Changing hostnames without updating cookies, redirects, CORS, and WebAuthn origins.
- Looking for endpoint payloads in conceptual docs instead of the API reference.
