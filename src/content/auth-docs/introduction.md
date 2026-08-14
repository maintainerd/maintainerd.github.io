# Auth Documentation

Auth is Maintainerd's identity and access service. It gives your platform a place to manage tenants, users, login, registration, identity providers, sessions, MFA, application clients, permissions, audit events, and account self-service.

These docs are written as an app and setup guide. They explain where a feature appears in the Auth console or hosted identity UI, what the screen is for, what fields mean, what choices are available, how to configure the service, and what permissions or security rules apply.

Setup commands, environment examples, DNS examples, reverse-proxy examples, and deployment snippets belong in these docs because developers need them to run Auth. API request samples, endpoint payloads, response schemas, and generated-client examples belong in the API reference.

## How To Use These Docs

Read the docs in the same order you would set up Auth.

| Step | What You Do | Start With |
|---:|---|---|
| 1 | Understand the product areas and runtime boundaries. | [Architecture](#architecture) and [Glossary](#glossary) |
| 2 | Run Auth or open the deployed setup surface. | [Quickstart](#quickstart) and [Setup](#setup) |
| 3 | Complete bootstrap and create the first administrator. | [Setup](#setup) |
| 4 | Configure HTTPS hostnames, secrets, database, Redis, and deployment. | [Deployment](#deployment), [Environment variables](#environment), [Secrets & keys](#secrets), [Database & Redis](#database-redis) |
| 5 | Configure tenants and understand system-vs-tenant URLs. | [Tenants & members](#tenants-members) and [Hostnames & tenant URLs](#surfaces-hostnames) |
| 6 | Create application clients. | [Applications & clients](#clients) |
| 7 | Configure identity providers, brokered login, and federation. | [Identity providers](#identity-providers) and [Federated login client](#federated-login-client) |
| 8 | Configure registration, login, and account self-service. | [Registration flows](#registration-flows), [Login & registration](#login-registration), [Account self-service](#account) |

When a page mentions a screen, treat the navigation path as the starting point. The field explanations tell you what you are looking at and what each choice changes. The workflow sections tell you the normal order of operations.

## Main App Areas

Auth has two user-facing surfaces:

| Area | Who Uses It | What It Is For |
|---|---|---|
| Console | Administrators and operators. | Configure tenants, users, providers, clients, policies, audit, security, messaging, events, and operations. |
| Hosted identity UI | End users signing in to applications. | Login, registration, MFA, consent, password reset, invite acceptance, and account settings. |

Auth also has service surfaces used by applications and Maintainerd services:

| Surface | Who Uses It | What It Is For |
|---|---|---|
| Public identity surface | Hosted identity and external applications. | OAuth/OIDC, public identity routes, account flows, discovery, and token behavior. |
| Internal management surface | Console and trusted automation. | Tenant, user, client, provider, security, event, webhook, and audit administration. |
| Optional private service surface | Peer services and platform automation. | Service-to-service authorization, introspection, policy reads, and control-plane provisioning when enabled. |

Beginners should start in the console. Developers integrating an app should also understand the hosted identity UI because that is where users complete sign-in and account flows.

## Navigation Map

Use this map to know where a feature normally lives:

| Page | Use It For |
|---|---|
| [Setup](#setup) | Opening the setup wizard before the first tenant and admin user exist. |
| [Architecture](#architecture) | Understanding boundaries before integrating services. |
| [Environment variables](#environment) | Configuring process-level runtime values. |
| [Secrets & keys](#secrets) | Configuring signing, encryption, bootstrap, and provider secrets. |
| [Database & Redis](#database-redis) | Configuring persistence, migrations, cache, sessions, and background state. |
| [Hostnames & tenant URLs](#surfaces-hostnames) | Configuring console, identity, API, and tenant hostnames. |
| [Deployment](#deployment) | Preparing runtime, reverse proxy, TLS, workers, and probes. |
| [Tenants & members](#tenants-members) | Managing tenant settings and administrator access. |
| [Users & invites](#users-invites) | Managing human accounts and onboarding invitations. |
| [Applications & clients](#clients) | Registering applications, redirects, logout URLs, CORS origins, grants, and provider connections. |
| [Identity providers](#identity-providers) | Configuring built-in sign-in, social login, OIDC, SAML, brokered login, federation, and provider mapping. |
| [OAuth & OIDC](#oauth-oidc) | Understanding the protocol behavior your clients use. |
| [Registration flows](#registration-flows) | Choosing who can create accounts and what happens during onboarding. |
| [Login & registration](#login-registration) | Understanding the hosted user journey. |
| [Account self-service](#account) | Understanding what signed-in users can manage themselves. |

## Important Concepts

| Concept | What It Means | Why It Matters |
|---|---|---|
| Tenant | The security boundary. Tenant settings decide which users, providers, clients, policies, branding, events, and data lifecycle rules apply. | Most configuration is tenant-scoped. See [Tenants & members](#tenants-members). |
| User | A human account inside a tenant. A user can have profiles, sessions, devices, MFA factors, consents, linked identities, and roles. | User administration and onboarding are covered in [Users & invites](#users-invites). |
| Tenant member | An administrator relationship that allows a person to manage tenant settings in the console. | Tenant membership is separate from application roles. |
| Client | An application that uses Auth for login. Clients define redirect behavior, logout behavior, allowed login methods, provider connections, and OAuth/OIDC behavior. | Client setup controls whether an external app can authenticate users. See [Applications & clients](#clients). |
| Identity provider | A way to prove identity. Auth can use built-in email/password, passwordless methods, OIDC/OAuth2 providers, SAML providers, and other configured provider types. | Providers decide where sign-in happens. See [Identity providers](#identity-providers). |
| Registration flow | A configured account creation path. It controls open signup, invite-only signup, provider-driven signup, profile completion, verification, and default access. | Registration flows decide who can join and what access they receive. See [Registration flows](#registration-flows). |

## Permissions Model

Auth separates user self-service from administration.

| Actor | What They Can Do | Guardrail |
|---|---|---|
| Normal user | Manage their own account where policy allows. | Account self-service does not grant tenant administration. |
| Tenant administrator | Manage tenant settings and users based on member role and permissions. | Administrative permissions and step-up can still be required. |
| Service identity or workload | Call service surfaces when explicitly trusted. | Service authentication, audience, tenant, and permission checks apply. |
| Sensitive action actor | Complete high-risk changes such as security, secret, account, or deletion changes. | Step-up MFA may be required even for administrators. |

This separation matters because many identity features look similar but have different risk. A user changing their own password is not the same as an administrator resetting another user's password.

## What Belongs In These Docs

These docs should include:

| Content Type | Belongs Here Because |
|---|---|
| Step-by-step setup commands | Developers need a runnable path to bring Auth online. |
| Configuration examples | Operators need examples for hostnames, secrets, storage, proxies, and runtime services. |
| Environment-variable examples | Process configuration must be understandable without reading source code. |
| DNS and TLS examples | Hosted login, OAuth redirects, cookies, and WebAuthn depend on correct HTTPS hostnames. |
| Reverse-proxy and deployment examples | Auth has public and private surfaces that must be routed differently. |
| Console navigation guidance | Administrators need to know where a feature appears in the app. |
| Field explanations | Beginners need to know what each option changes before saving it. |
| Permission and security notes | Identity configuration can change access, risk, or tenant isolation. |
| Troubleshooting guidance | Developers need to diagnose setup, login, OAuth, messaging, webhook, and token failures. |

The goal is that a beginner can follow the setup pages without guessing what command to run or what a field means.

## What Belongs In The API Reference

These docs intentionally avoid API request samples and response shapes. Use the API reference when you need:

| API Reference Content | Why It Lives There |
|---|---|
| Exact endpoint paths | Endpoint contracts change independently from conceptual guidance. |
| Request and response fields | The generated reference is the source of truth for payload shape. |
| Status codes | API behavior should be read from the dedicated reference. |
| Generated client usage | Client-library examples belong with the API contract. |
| Authentication headers | Header details are part of exact API usage. |
| Pagination, filtering, and sorting behavior | These are endpoint-level mechanics. |

Use these docs when you need to understand what the feature does, where it appears in the app, which option to choose, and what the security impact is.

## First-Time Path

For a new deployment:

| Order | Task | Result |
|---:|---|---|
| 1 | Read [Setup](#setup). | You understand what bootstrap creates and locks. |
| 2 | Run the quickstart or open your deployed setup wizard. | Auth is reachable through the expected HTTPS hostnames. |
| 3 | Create the first tenant and administrator. | The console has an owner who can continue configuration. |
| 4 | Configure HTTPS hostnames. | Browser flows, redirects, cookies, and tenant routing are aligned. |
| 5 | Configure secrets, database, and Redis. | Auth can safely store durable state and shared short-lived state. |
| 6 | Create an application client. | Your app has a registered OAuth/OIDC identity. |
| 7 | Configure identity providers and connect them to the client. | Users can sign in through the allowed methods. |
| 8 | Configure login and registration. | Onboarding behavior matches tenant policy. |
| 9 | Add users or invites. | People can access the tenant with intended roles. |
| 10 | Test hosted identity and account self-service. | Users can complete login, MFA, consent, profile, and session workflows. |

## Common Beginner Mistakes

| Mistake | What To Do Instead |
|---|---|
| Treating tenant members as application users. | Keep administrator membership separate from end-user application access. |
| Using email as a global user identifier. | Use tenant context and public identifiers when integrating identity data. |
| Collecting Auth passwords inside downstream apps. | Redirect users to the hosted identity UI. |
| Enabling public registration before default roles and abuse controls are ready. | Configure registration flows, roles, verification, CAPTCHA, rate limits, and security controls first. |
| Configuring an identity provider without connecting it to the client that should use it. | Attach the provider to the application client that should display that login option. |
| Changing hostnames without updating cookies, redirects, CORS, and WebAuthn origins. | Treat hostname changes as an OAuth, browser, cookie, and WebAuthn change. |
| Looking for endpoint payloads in conceptual docs. | Use the API reference for endpoint contracts and these docs for product behavior. |
