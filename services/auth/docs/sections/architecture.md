# Architecture

Architecture explains how Auth is divided internally and how those divisions appear in the app. You do not need to memorize package names to use Auth, but you should understand the boundaries before configuring tenants, users, clients, providers, and policies.

## Where To Find It In The App

The architecture is reflected across several console areas:

- Tenants: tenant boundary, settings, branding, and policy defaults.
- Users: account records, profiles, sessions, devices, identities, and consents.
- Members: administrator access to the tenant.
- Identity providers: external login connections and provider mapping.
- Applications or clients: OAuth/OIDC app configuration.
- Security: MFA, sessions, password, lockout, IP, and rate-limit policy.
- Events and audit: what happened and who changed it.
- Operations: runtime health, workers, keys, and dependencies.

The console does not require users to know the code architecture, but each screen maps to one of these responsibilities.

## Main Boundaries

Tenant boundary decides which organization, workspace, or customer owns the data and policy.

Identity boundary decides who the user is, which providers they use, and how sessions are established.

Authorization boundary decides what a user, member, service, or workload can do.

Runtime boundary decides which HTTP, gRPC, worker, and management surfaces are available.

Secret boundary decides where signing keys, encryption keys, provider secrets, and bootstrap credentials live.

Event boundary decides which security and audit records are emitted and delivered.

These boundaries are the reason Auth has separate screens for tenants, users, members, providers, clients, and account self-service.

## Surfaces

Console is for administrators. Use it to configure tenants, users, members, identity providers, clients, policies, events, and operational settings.

Hosted identity UI is for end users. Use it for login, registration, MFA, consent, recovery, and account self-service.

Public identity surface is for browsers and applications. It supports OAuth/OIDC, hosted login state, provider callbacks, public tenant lookup, and self-service behavior.

Internal management surface is for trusted administrators and automation. It should stay private.

gRPC surface is for Maintainerd service integration when runtime mode requires it.

## Objects You Will Manage

Tenant is the top-level boundary for users, members, settings, clients, providers, branding, audit, and policy.

User is the human account inside a tenant.

Tenant member is a user's administrator relationship to the tenant.

Client is an application that sends users to Auth for login.

Identity provider is a way for a user to prove identity.

Session is the continuity that keeps a user signed in.

Role and permission decide what the user or member can do.

Audit event records administrative and security-relevant changes.

## How A Login Moves Through The Architecture

1. The application redirects the browser to Auth.
2. Auth resolves tenant and client context.
3. Auth checks tenant, client, provider, registration, and security policy.
4. The hosted identity UI displays allowed login methods.
5. The user proves identity through password, magic link, SMS, OIDC, SAML, or another allowed method.
6. Auth completes MFA or step-up when required.
7. Auth creates or updates session state.
8. Auth sends the browser back to the client.
9. Events and audit records are emitted where appropriate.

This flow is why user-facing login should stay on the hosted identity UI instead of being rebuilt in every downstream application.

## How An Admin Change Moves Through The Architecture

1. The administrator signs in to the console.
2. Auth verifies the admin's user, tenant member, role, session, and step-up state.
3. The console shows only permitted actions.
4. The management surface validates the same permissions again.
5. The service layer applies tenant, user, provider, or policy changes.
6. Repositories persist the change.
7. Caches, sessions, events, and audit records are updated as needed.

Console visibility is helpful, but backend permission enforcement is the source of truth.

## Developer Rules

- Keep tenant-scoped data inside the tenant boundary.
- Use stable IDs for authorization and linking, not display names.
- Keep user self-service separate from administration.
- Keep management surfaces private.
- Keep provider secrets and tokens out of normal UI and logs.
- Use events and audit records for sensitive changes.
- Use the API reference for endpoint-level integration details.

## Troubleshooting

If a feature appears in the console but does not work at runtime, check whether the corresponding surface is enabled in the selected runtime mode.

If a user exists but cannot sign in, check tenant status, client status, provider connection, user status, MFA policy, and session policy.

If an administrator can see a button but the action fails, check backend permissions, tenant membership, step-up requirements, and audit logs.

If service-to-service traffic fails, check gRPC mode, service identity, workload identity, network policy, and secrets.
