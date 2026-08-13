# Registration Flows

Registration flows define how users enter a tenant and which roles or onboarding rules apply when they become Auth users.

Use this section when deciding whether registration is open, invite-only, provider-driven, or controlled by tenant policy. Exact endpoints, request bodies, response schemas, and generated-client examples belong in the API reference.

## Mental Model

A registration flow is the rule set Auth consults before creating or activating a user through a registration path.

It answers questions such as:

- Is registration allowed for this tenant and client?
- Can this provider create users, or only authenticate existing users?
- Does the user need an invite?
- Which roles are assigned after successful registration?
- Does the user start active or pending?
- Does email verification need to happen before normal sign-in?
- Does profile completion happen during registration or after first sign-in?

Registration flows sit between identity proof and user creation. A provider can prove who the person is, but the registration flow decides whether that person may enter the tenant and what access they receive.

## Flow Types

Auth can support several registration patterns.

- Open registration: users can create accounts when the tenant and client allow it.
- Invite-based registration: users can enter only through a valid invite.
- Provider-driven registration: an external identity provider can create users when JIT provisioning is allowed.
- Admin-created onboarding: an administrator creates a user directly, sometimes with a pending state.
- Bootstrap registration: setup creates the first admin owner during initial system setup.

Not every tenant should enable every pattern. Most production tenants should choose a deliberate onboarding model rather than leaving registration open by accident.

## What A Flow Controls

A registration flow can control whether registration is available, which client or provider context applies, which roles are assigned, whether the flow is active, and how invite-based registration maps into tenant access.

It can also control:

- Tenant scope: which tenant owns the flow.
- Client scope: whether the flow applies to all clients or selected clients.
- Provider scope: whether it applies to local accounts, a specific OIDC provider, SAML, or all enabled providers.
- Invite requirement: whether a valid invite must be present.
- Email verification requirement: whether the user must verify email before normal use.
- Phone verification requirement: whether phone verification is required.
- Profile requirement: whether profile fields must be completed.
- Initial user status: whether users start pending or active.
- Role assignments: which IAM roles are granted after successful registration.
- Member assignment: whether tenant membership is created, usually only for admin onboarding flows.
- Availability status: whether the flow is active, inactive, or retired.
- Audit behavior: what registration and role-assignment events are recorded.

## Open Registration

Open registration lets users create accounts without an invite. It is useful for public products, developer portals, trials, or community applications.

Use open registration when:

- The tenant intentionally allows self-service signup.
- Abuse controls, rate limits, email verification, and bot protections are configured.
- New users should receive limited default roles.
- The product has a clear onboarding path after account creation.

Be careful with open registration because it can create accounts from unauthenticated traffic. Pair it with tenant status checks, client checks, rate limits, email verification, and conservative role assignment.

## Invite-Based Registration

Invite-based registration requires a valid invite before the user can enter the tenant. It is the safer default for private organizations, internal tools, B2B tenants, and admin-controlled onboarding.

Use invite registration when:

- The tenant wants to approve users before account creation.
- Roles should be pre-approved by an administrator.
- The invite should expire if the user does not act.
- Onboarding needs audit history.
- Users should prove email ownership through the invite flow.

The invite provides context, but the registration flow still decides whether the invite can create the user and which access is applied. Expired, revoked, already accepted, or tenant-mismatched invites must be rejected.

## Provider-Driven Registration

Provider-driven registration happens when an external identity provider can create users through just-in-time provisioning.

Use provider-driven registration when:

- The tenant trusts the upstream provider.
- The provider returns stable subject and identity claims.
- Email-domain routing or tenant policy confirms the user belongs in the tenant.
- New users should not need a separate admin-created account first.

Provider-driven registration should still pass through registration-flow checks. A valid Google, Microsoft, GitHub, or SAML login does not automatically mean the user may enter the tenant. Auth should validate tenant status, provider status, client connection, JIT settings, registration policy, and account-linking rules before creating a user.

## Flow Status

Registration flows should have lifecycle status.

Common statuses:

- Active: the flow can be used by hosted identity and registration routes.
- Inactive: the flow exists but should not be used for new registrations.
- Draft or pending: the flow is being configured and is not ready.
- Retired: the flow is no longer used but may remain for audit history.

Status matters because old links, stale clients, or cached frontend state should not be able to use a flow that operators disabled.

## Role Assignment

Registration flows can assign roles to newly registered users. This is powerful and should be conservative.

Use role assignment for:

- Default user access after signup.
- Invite-approved product access.
- Trial or starter roles.
- Tenant-specific onboarding roles.
- Provider-specific roles when tenant policy allows it.

Avoid granting broad administrator roles through open registration. Tenant administration should usually require explicit member management or a tightly controlled invite/admin flow.

Role assignment rules should check:

- The role belongs to the same tenant.
- The flow is active.
- The client and provider are allowed for the flow.
- The user or invite satisfies the flow requirements.
- The assignment is audited.
- Authorization caches are invalidated or refreshed.

## Tenant Membership During Registration

Tenant membership is different from IAM role assignment.

Most normal registration flows should create a user and assign product roles, not tenant administration membership. Tenant member creation should be reserved for setup, owner invite flows, administrative onboarding, or explicit tenant-admin workflows.

If a registration flow can create tenant members, treat it as sensitive. Owner or admin membership should require strict permissions, invite approval, and step-up MFA for the operator creating or modifying that flow.

## Provider Context

Registration flows can be tied to provider context.

Examples:

- Local account registration through the built-in provider.
- Google Workspace registration for users from a tenant-owned domain.
- SAML registration for employees.
- Invite registration through any provider connected to the client.
- Provider registration disabled while provider login remains allowed for existing users.

Provider context helps prevent accidental account creation. A tenant may allow Google login for existing linked users but disallow Google JIT registration for new users.

## Client Context

Registration is also client-aware.

One OAuth client may allow self-registration while another client is invite-only. A public customer portal may allow open signup. An admin console should not. A mobile client may use different onboarding text and allowed providers from a web portal.

The hosted identity UI should render registration choices based on tenant, client, provider connections, and registration-flow policy. Frontend display alone is not enough; the backend must enforce the same rules.

## Verification And Profile Completion

Registration flows can require follow-up steps before normal access.

Common requirements:

- Email verification before sign-in.
- Phone verification before SMS login or SMS MFA.
- Password setup for local accounts.
- MFA enrollment for admin or high-risk roles.
- Profile completion for display name or required profile fields.
- Consent collection when the OAuth client requires it.

These requirements should be explicit. A user may exist in pending state while waiting for verification or profile completion.

## Invite Mapping

Invite mapping decides how invite context becomes user access.

Invite context can include:

- Recipient email.
- Tenant.
- Registration flow.
- Pre-approved roles.
- Expiration.
- Creator.
- Status.

The flow should validate that the invite is valid, belongs to the same tenant, has not expired, has not been revoked, and has not already been accepted. Role assignments should happen only after the user is safely created or resolved.

## Console Operations

Operators commonly need to list registration flows, create flows, view flow detail, edit flow metadata, change status, assign roles, remove role assignments, and inspect usage history.

Each operation should be permission-gated and audited. Editing a registration flow can change who is allowed to enter a tenant, so treat it like a security-sensitive management action.

## Permissions

Registration flow administration should be protected by tenant-scoped management permissions.

Typical permission areas:

- Registration flow read: list and view flows.
- Registration flow create: create onboarding rules.
- Registration flow update: edit flow options, metadata, provider context, or client context.
- Registration flow status update: activate, deactivate, or retire flows.
- Registration role read: inspect roles assigned by a flow.
- Registration role write: add or remove role assignments.
- Invite integration read: inspect how invites map into a flow.
- Registration audit read: review registration and role-assignment history.

Sensitive actions such as enabling open registration, enabling provider-driven registration, assigning broad roles, allowing tenant member creation, or changing owner-invite behavior should require strong authorization and may require step-up MFA.

## Security Boundaries

Registration flows affect account creation and initial authorization.

Security expectations:

- Enforce registration rules on the backend.
- Check tenant status before registration.
- Check client status and provider connection before registration.
- Check provider status before provider-driven registration.
- Apply rate limits to public registration paths.
- Require valid invites for invite-only flows.
- Keep invite tokens and verification tokens out of logs.
- Avoid granting administrator roles from open registration.
- Audit registration flow changes and role assignments.
- Do not leak whether an email already exists unless the flow intentionally allows existing-user handling.

## Events And Audit

Registration flows should produce audit records and, where configured, integration events.

Audit-worthy actions:

- Flow created.
- Flow updated.
- Flow activated or deactivated.
- Flow retired.
- Role added to a flow.
- Role removed from a flow.
- Open registration enabled or disabled.
- Invite-only behavior changed.
- Provider-driven registration enabled or disabled.
- User registered through a flow.
- Registration rejected by flow policy.

Audit records should include actor, tenant, flow, action, result, timestamp, request ID, and reason when available. They should not include passwords, invite tokens, verification codes, provider tokens, or raw upstream callback payloads.

## Runtime Use

The hosted identity UI reads registration context so it can present the correct tenant, provider, and flow behavior to the user.

At runtime, Auth should resolve:

- Tenant from host or trusted tenant context.
- Client from the OAuth request or identity UI context.
- Provider from selected login method or home-realm discovery.
- Invite from signed invite state when invite registration is used.
- Registration flow from tenant, client, provider, and invite rules.
- Role assignments and required follow-up steps from the selected flow.

The frontend can hide or show options, but backend validation is the source of truth.

## Developer Workflow

For a typical private tenant:

1. Keep open registration disabled.
2. Configure email delivery.
3. Create roles for normal application access.
4. Create an invite-based registration flow.
5. Attach only the roles a newly invited user should receive.
6. Configure providers that invited users may use.
7. Create invites for approved users.
8. Test invite acceptance with an allowed provider.
9. Test expired, revoked, and wrong-tenant invite behavior.
10. Review audit events.

For a public signup tenant:

1. Confirm open registration is intended.
2. Configure rate limits and bot-abuse controls.
3. Require email verification.
4. Assign only low-risk default roles.
5. Keep tenant membership out of the open flow.
6. Test duplicate email, existing account, and provider-linking behavior.
7. Monitor registration events and failure rates.

## Developer Checklist

Before shipping registration flow behavior, verify:

- Registration rules are tenant-scoped.
- Registration rules are enforced on the backend.
- Client context is checked.
- Provider context is checked.
- Invite-only flows reject missing, expired, revoked, or already accepted invites.
- Open registration assigns only low-risk roles.
- Provider-driven registration requires explicit JIT provisioning and tenant policy.
- Role assignments belong to the same tenant.
- Tenant member creation is not allowed unless the flow is explicitly administrative.
- Email verification and profile completion requirements are clear.
- Registration events and admin changes are audited.
- API request and response details are documented in the API reference, not duplicated in this conceptual page.

## Troubleshooting

If the registration button does not appear, check tenant status, client registration settings, provider connections, registration flow status, and whether the hosted identity UI resolved the expected tenant and client.

If invite registration fails, check invite status, expiration, tenant match, registration flow status, provider status, and whether the invite has already been accepted.

If users are created unexpectedly, check open registration, provider JIT provisioning, email-domain routing, and registration-flow client/provider scope.

If roles are missing after registration, check role assignment on the flow, tenant match, invite mapping, and authorization cache refresh.

If an admin cannot edit a flow, check registration-flow permissions, tenant member role, IAM permissions, step-up requirements, and whether the flow is protected by system policy.
