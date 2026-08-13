# Tenants & Members

Tenants are the ownership and isolation boundary for Auth. A tenant owns its users, OAuth clients, identity providers, roles, permissions, policies, services, APIs, branding, messaging settings, security settings, event configuration, webhook configuration, and operational state.

Members connect users to a tenant with a tenant-level administrative relationship. The user is the account that signs in. The member record answers what that user can do as an operator inside the tenant, such as acting as an `owner`, `admin`, or regular `member`.

This page explains what tenant and membership features do. Exact management endpoints, request bodies, response schemas, status codes, and generated-client examples belong in the API reference.

## Mental Model

Think of Auth as a tenant-aware identity system.

- A tenant is the workspace or organization boundary.
- A user is a human account inside one tenant.
- A tenant member is that user's administrative relationship to the tenant.
- IAM roles and permissions decide application and API access.
- OAuth clients decide which applications can send users through login.
- Identity providers decide how users authenticate.
- Tenant settings decide operational behavior for one tenant.

Tenant membership is not the same as product authorization. A user can be a tenant `member` and still receive product roles such as `billing-reader`, `project-admin`, or `support-agent` through IAM.

## Common Lifecycle

Most installations follow this flow:

1. Create the system tenant during setup.
2. Create the first admin user.
3. Auth creates a tenant membership for that admin as `owner`.
4. Configure tenant settings, branding, messaging, providers, and clients.
5. Invite or create more users.
6. Assign tenant member roles only to people who need tenant administration.
7. Assign IAM roles and permissions for application access.

Standalone deployments often run one tenant and treat it as the identity boundary for the application. Maintainerd-managed deployments can run a system tenant plus regular tenants provisioned by the control plane.

## Tenant Fields And Options

A tenant usually has:

- Stable tenant ID: the opaque identifier stored on tenant-scoped records and carried in tokens.
- DNS-safe name or slug: the value used for tenant-aware host routing.
- Display name: the human-readable name shown in console and hosted identity screens.
- Description: operator-facing context for support and administration.
- Status: lifecycle state such as pending, active, suspended, or inactive.
- System flag: whether the tenant is the system tenant created during setup.
- Metadata: optional operator or automation data such as timezone, locale, or internal tags.
- Timestamps: creation and update history for audit and review.

Tenant names should be DNS-safe: lowercase letters, numbers, and hyphens, starting and ending with a letter or number. This matters because tenant names become subdomain labels in tenant-aware host routing.

Do not store secrets in tenant metadata. Use the secret and settings systems for credentials, provider secrets, SMTP passwords, webhook signing secrets, and tokens.

## Tenant Operations

Tenant administrators and platform operators commonly need to list tenants, create tenants, view tenant detail, update tenant metadata, change tenant status, configure tenant settings, manage tenant members, delete tenants when allowed, and read public tenant context for login screens.

The console is the normal interface for humans. The management API and control-plane gRPC services support automation and provisioning. The API reference owns exact operations and wire contracts.

## What Tenant Operations Do

Listing tenants is an operator discovery action. The console uses it to show which tenants exist, what state each tenant is in, and which tenant an operator can manage. A list response can include tenant IDs, names, display names, status, and timestamps. It should not include provider credentials, email passwords, SMS tokens, webhook signing secrets, OAuth client secrets, or other sensitive values.

Creating a tenant establishes a new isolation boundary. Auth is not only saving a company name. It is creating the namespace where users, clients, identity providers, roles, permissions, policies, templates, events, webhooks, and settings live. In production, tenant creation should also run baseline seeders so the tenant starts with required Auth resources and safe defaults.

Viewing tenant detail powers the tenant overview screen in the console. It should explain who the tenant is, whether it is usable, when it was created, and what high-level configuration exists. Detailed child resources such as members, clients, providers, policies, and messaging settings can be loaded from their own feature areas so each area can apply stricter permission checks.

Updating tenant metadata changes human-facing or operator-facing fields such as display name, description, timezone, language, date format, and internal metadata used by automation. Metadata is useful for display and organization, but it should not become an authorization source unless the backend validates and enforces that exact field.

Changing tenant status changes runtime availability. This is a security and operations action, not a cosmetic edit. If a tenant is suspended or inactive, login, registration, OAuth, account self-service, and credential routes should stop before accepting secrets from the user.

Configuring tenant settings changes Auth behavior for one tenant. These settings can affect login availability, rate limits, messaging delivery, security requirements, branding, audit records, webhook delivery, and data retention. Update them through validated management flows so permission checks, cache invalidation, events, and audit logs happen consistently.

Managing tenant members changes who can administer the tenant. Membership changes should be treated as sensitive because the right member role can unlock access to users, clients, providers, policies, and settings.

Deleting a tenant is a destructive lifecycle action. A safe implementation checks whether deletion is allowed, prevents protected tenants from being deleted, handles sessions and tokens, and preserves audit records according to retention policy. Many production systems prefer suspension or soft deletion before permanent removal.

Reading public tenant context supports pre-login screens. The hosted identity UI may need to know that a tenant exists, what display name and branding to show, and which login methods are available. Public tenant lookup must never return internal settings, member lists, credentials, secrets, or administrative metadata.

## Tenant Status

Tenant status is part of the runtime security boundary. Auth checks tenant lifecycle before credential, OAuth, and account routes proceed.

Common statuses:

- `pending`: the tenant exists but is not ready for normal sign-in.
- `active`: users can authenticate and clients can run normal OAuth flows.
- `suspended`: authentication and OAuth flows should be blocked.
- `inactive`: the tenant should not be used for runtime traffic.

Use `pending` while bootstrap or provisioning is still running. A pending tenant may have a database record but may not have seeded clients, roles, settings, identity providers, or admin membership yet. Runtime flows should treat it as unavailable.

Use `active` for normal production traffic. Active tenants can serve hosted login, OAuth authorization, token exchange, registration, account self-service, and service authorization as long as client, provider, user, and policy checks also pass.

Use `suspended` when access should stop temporarily. Suspension is useful for abuse investigation, customer-requested access freeze, non-payment, legal review, or incident response. Authorized operators should still be able to inspect and repair the tenant from management surfaces.

Use `inactive` when the tenant is retired or should no longer receive runtime traffic. Inactive tenants should not accept new sessions or OAuth flows. Depending on retention policy, the data may remain available for audit, export, or controlled cleanup.

Status changes are operational actions. Treat them like production changes: audit them, require the right operator permission, and communicate the effect to application teams.

## Tenant Host Resolution

Browser flows use the incoming host to resolve tenant context. Auth does not trust a caller-provided tenant ID to decide which tenant a login request belongs to.

The system identity and console hosts represent the system tenant. Regular tenant hosts are derived by prepending the tenant slug before the configured system host. For example, an `acme` tenant can have tenant-specific identity and console hosts under the configured identity and console domains.

If a user opens a tenant identity host, Auth resolves the tenant slug before login, registration, MFA, consent, and account self-service continue. This prevents a caller from choosing a tenant by manually submitting a tenant ID.

## Public Tenant Lookup

Hosted login screens and external applications sometimes need public tenant context before authentication. Public lookup should return only information safe to show before sign-in.

Safe public tenant information may include:

- Tenant display name.
- Public branding hints.
- Public logo route.
- Enabled login methods.
- Whether the tenant is available for sign-in.
- Support URL or help text intended for unauthenticated users.

Public lookup must not expose internal tenant settings, member lists, audit configuration, secrets, SMTP credentials, SMS tokens, OAuth client secrets, policy documents, webhook settings, or administrative metadata.

## Tenant Settings

Tenant settings are per-tenant controls that change Auth behavior without changing application code. They answer practical questions:

- Should this tenant accept login traffic right now?
- How quickly can this tenant call credential, token, or account endpoints?
- Should this tenant use its own email sender or inherit the system sender?
- Does this tenant require MFA for administrators?
- Which IP ranges can access sensitive routes?
- Which events should be emitted for integrations and webhooks?
- How long should audit, event, session, and webhook records be kept?

Some settings are configured directly on the tenant. Other settings can inherit from the system tenant or deployment defaults. Inheritance is useful when most tenants should share safe platform defaults but one tenant needs custom branding, a custom email sender, stricter security, or a temporary maintenance window.

Settings should be changed through the console or management API so validation, permission checks, cache invalidation, events, and audit logs stay consistent.

## Maintenance Setting

The maintenance setting tells Auth whether the tenant is temporarily unavailable for normal user-facing runtime traffic. When maintenance is enabled, Auth should stop login, registration, OAuth, MFA, and account self-service flows early and return a controlled maintenance response. Auth should not accept passwords, OTPs, or other credentials while the tenant is known to be unavailable.

Use maintenance for planned work such as tenant migration, provider rotation, incident response, or data repair. Do not use it as a long-term substitute for `suspended` or `inactive` status. Tenant status describes lifecycle. Maintenance describes a temporary operating window.

Important options:

- Enabled flag: turns maintenance behavior on or off.
- User-facing message: optional text the hosted identity UI can show users.
- Internal reason: operator reason for audit logs and support review.
- Scheduled start and end: optional planned window if scheduling is supported.

Developer behavior:

- Check maintenance before credential validation.
- Keep authorized management access available so an operator can turn maintenance off.
- Avoid revealing whether a submitted username or password would have been valid.
- Emit audit events when maintenance is enabled, changed, or disabled.

## Rate Limit Settings

Rate limit settings control how much traffic one tenant can send to sensitive Auth routes during a time window. They protect the service from brute-force login attempts, password reset spam, SMS cost attacks, noisy clients, and accidental retry loops.

Tenant-wide limits apply across a tenant. Credential-specific limits apply to risky routes such as login, password reset, magic link, MFA challenge, SMS verification, and token exchange. Credential limits should usually be stricter than normal API limits because these routes can reveal timing signals, send messages, or spend money.

Important options:

- Enabled flag: turns tenant rate-limit enforcement on or off.
- Broad request limit: caps protected tenant traffic across route families.
- Login limit: limits credential login attempts.
- Password reset limit: limits password reset emails.
- MFA challenge limit: limits repeated challenge creation.
- SMS limit: limits text-message delivery to protect cost and reduce abuse.

Developer behavior:

- Return a rate-limited response when a limit is exceeded.
- Do not reveal whether a username exists in rate-limit responses.
- Include tenant ID, route family, client ID, IP address, or user identifier in rate-limit keys depending on the route.
- Make limits configurable because tenants have different legitimate traffic patterns.

## Audit Settings

Audit settings control what Auth records for administrative, security, and lifecycle actions. Audit logs answer who changed something, what changed, which tenant was affected, when it happened, and whether it succeeded.

Examples of actions that should be audited include tenant creation, tenant suspension, settings changes, member promotion, member removal, provider changes, client secret rotation, redirect URI changes, role changes, policy changes, user disablement, session revocation, and denied admin attempts.

Important options:

- Enabled flag: controls whether audit logging is active for tenant management actions.
- Successful-action logging: records completed changes so operators can reconstruct history.
- Denied-action logging: records denied attempts, which helps detect probing or misconfigured permissions.
- Retention window: controls how long audit records are kept before cleanup can remove them.

Developer behavior:

- Include actor, tenant, action, target, result, timestamp, request ID, and reason when available.
- Do not store plaintext passwords, provider tokens, SMTP passwords, OAuth client secrets, or webhook signing secrets in audit logs.
- For secret changes, log that the secret was changed, not the value.
- Treat audit logs as security data, not ordinary debug logs.

## Email Settings

Email settings decide how Auth sends email for one tenant. Email is used for verification, password reset, magic links, invites, MFA email OTP, email change confirmation, device approval, and other identity flows.

A tenant can use its own SMTP configuration or inherit the system tenant's email configuration. Tenant-specific email is useful when a customer needs its own sender domain, brand identity, compliance setup, or delivery monitoring. System fallback is useful for simple deployments where one operator controls all messaging.

Important options:

- Configuration source: selects tenant email settings or inherited system settings.
- Provider: identifies the delivery method. Current runtime delivery uses SMTP-compatible providers.
- Host and port: tell Auth where to connect for SMTP delivery.
- Username: identifies the SMTP account.
- Password or token: authenticates to the SMTP provider and must be stored as a secret.
- From address: the sender email address users see.
- From name: the sender display name users see.
- Status: controls whether this email configuration can be used.

Developer behavior:

- Store passwords and provider tokens as secrets.
- Return secret presence or configuration status, not plaintext secret values.
- Validate sender fields before activating a tenant sender.
- Test delivery before switching from inherited email to tenant email.

## SMS Settings

SMS settings decide how Auth sends text messages for SMS login, SMS MFA, phone verification, and short approval flows. SMS can be expensive and easy to abuse, so it should be paired with strict rate limits and provider status checks.

Supported provider families in these docs are:

- `log`: development or no-op style provider that writes messages to logs.
- `twilio`: Twilio delivery.
- `sns`: AWS SNS delivery.
- `vonage`: Vonage delivery.

Important options:

- Configuration source: selects tenant SMS settings or inherited system settings.
- Provider: selects the SMS delivery integration.
- Account ID: identifies the provider account.
- Auth token: authenticates to the provider and must be stored as a secret.
- From number: sender number used for outbound SMS when the provider requires one.
- Status: controls whether this SMS configuration can be used.

Developer behavior:

- Never return SMS auth tokens in API responses.
- Use the `log` provider only for local development or controlled tests.
- Mask phone numbers in logs when a full number is not required.
- Apply tenant and route-specific rate limits to SMS flows.

## Branding Settings

Branding settings control what users see on hosted identity screens. This includes login, registration, consent, password reset, MFA, invite acceptance, and account self-service pages.

Branding exists because the same Auth deployment may serve many tenants. A user signing into Acme should see Acme's tenant name, visual identity, support link, and templates rather than another tenant's identity.

Important options:

- Display name: the human-readable tenant name shown in hosted identity screens.
- Logo: the logo used by public branding routes and the hosted identity UI.
- Primary color: the main accent color for tenant-specific screens.
- Support URL: where users can go when they need help.
- Template source: selects tenant templates or inherited default templates.

Developer behavior:

- Public branding lookup may expose safe display values such as name, color, logo route, support link, and enabled login methods.
- Do not expose unpublished template bodies, internal template IDs, credentials, or operator metadata through public branding routes.
- Validate URLs before rendering them in browser pages.

## Security Default Settings

Security default settings define the baseline security posture for a tenant. They let one tenant require stricter controls than another without forking the application.

Important options:

- Require MFA for admins: requires admins or owners to complete MFA before sensitive console actions.
- Allow password login: controls whether local password login is available.
- Allow magic-link login: controls whether passwordless email links can be used.
- Password policy: defines minimum strength, length, reuse, and rotation expectations.
- Session idle timeout: controls how long an idle browser session can remain valid.
- Step-up max age: controls how fresh MFA proof must be before sensitive actions.

Developer behavior:

- Enforce security defaults on the backend, not only in the frontend.
- Re-check sensitive settings at action time because policy can change while a user is signed in.
- Combine member role, IAM permission, session state, and step-up proof for sensitive admin operations.

## IP Restriction Settings

IP restriction settings allow a tenant to limit access to specific source networks. This is commonly used for admin console access, internal workforces, partner integrations, or high-risk account actions.

Important options:

- Enabled flag: turns IP enforcement on or off.
- Mode: describes whether listed ranges are allowed or denied.
- CIDR ranges: IPv4 or IPv6 network ranges.
- Route families: which surfaces or workflows are protected.

Developer behavior:

- Evaluate IP restrictions before credential handlers or sensitive management handlers run.
- Trust proxy headers only when the reverse proxy is configured and trusted.
- Return a generic denied response that does not reveal tenant internals.
- Audit denied admin attempts when audit logging is enabled.

## Event And Webhook Settings

Event and webhook settings decide which tenant events Auth emits and where those events are delivered. Events are useful for integration, automation, security monitoring, and downstream product behavior.

Examples of tenant events include user registration, login success, login failure, password reset request, MFA enrollment, OAuth client creation, tenant member promotion, role changes, and policy changes.

Important options:

- Enabled flag: controls whether tenant integration events can be emitted.
- Disabled event types: turns off specific event types for the tenant.
- Webhook delivery flag: controls whether active webhook endpoints can receive tenant events.
- Listener configuration: determines which destinations receive which events.

Developer behavior:

- Emit events only after the database change succeeds.
- Use an outbox or retryable delivery design so webhook failure does not break the original user action.
- Sign webhook deliveries when a signing secret is configured.
- Never place plaintext passwords, access tokens, refresh tokens, provider tokens, or SMTP secrets in event payloads.

## Data Retention Settings

Data retention settings control how long Auth keeps tenant-owned operational data. This can include events, webhook delivery attempts, expired sessions, revoked tokens, device records, export requests, erasure requests, and audit logs.

Important options:

- Audit log retention: how long administrative audit records are preserved.
- Event retention: how long tenant event records are preserved.
- Webhook delivery retention: how long webhook attempt history is preserved.
- Expired session retention: how long expired browser session records remain available for review.
- Revoked token retention: how long revoked token identifiers remain available for enforcement or investigation.

Developer behavior:

- Retention runners should remove only records older than the configured window.
- Legal hold or compliance requirements may override normal retention.
- Avoid deleting audit logs needed to explain security-sensitive tenant changes.
- Make retention behavior visible to operators so cleanup is not surprising.

## Membership

A tenant member represents a user's administrative relationship to a tenant. It is not the user's login identity and it is not a replacement for IAM roles.

Built-in member roles:

- `owner`: can manage the tenant at the highest administrative level.
- `admin`: can administer tenant resources according to assigned permissions.
- `member`: belongs to the tenant but does not automatically receive broad administration rights.

Member records usually include a member ID, tenant ID, user ID, role, timestamps, and audit metadata. Keep password state, MFA secrets, provider tokens, and unrelated profile data out of member responses.

## Member Operations

Common member operations include listing tenant members, adding a user as a tenant member, changing a member role, removing a tenant member, transferring ownership, and preventing the last owner from being removed or downgraded.

Every member mutation should be audit logged because it changes who can administer the tenant.

Listing tenant members shows who can administer a tenant. A useful member list includes the member ID, user ID, email or display name, member role, user status, creation time, and update time. It should not include password hashes, MFA secrets, provider tokens, session secrets, recovery codes, or unrelated personal data.

Adding a member gives a user tenant-level administrative presence. This is different from giving someone product access. Add a member when the user needs console access or tenant administration. If the user only needs to use an application, assign IAM roles or product permissions instead.

Changing a member role changes what that user can administer. Promoting a user to `owner` should be treated as a high-risk action because owners can usually control tenant lifecycle, settings, membership, and other administrative resources. Demoting an owner should check that another owner remains.

Removing a member removes tenant administration access. It should not automatically delete the user account because the account may still be needed for application access, audit attribution, session review, data export, erasure workflow, or historical records.

Transferring ownership is a controlled sequence. Promote or add the new owner first, verify the tenant has at least one owner, then demote or remove the old owner. This avoids an ownerless tenant that no one can manage.

Preventing last-owner removal is a safety rule. Auth should reject any member update that would leave the tenant with zero owners. This check belongs in the backend, not only in the console UI.

## Permissions

Tenant and member actions should be protected by tenant-scoped management permissions.

Typical permission areas:

- Tenant read: list and view tenant records.
- Tenant create: create new tenant boundaries.
- Tenant update: edit tenant metadata and settings.
- Tenant status update: suspend, reactivate, or retire tenants.
- Tenant delete: perform destructive tenant lifecycle actions.
- Member read: list and inspect tenant members.
- Member write: add members or update member roles.
- Member delete: remove members from tenant administration.
- Owner transfer: promote, demote, or remove owners.

Sensitive actions such as owner promotion, owner removal, tenant deletion, maintenance enablement, security-setting changes, and secret-bearing messaging changes should require strong authorization and may require step-up MFA.

## Tenant Members Vs IAM Roles

Use tenant member roles for tenant administration. Use IAM roles and permissions for product and API access.

Choose tenant membership when:

- The user manages tenant settings.
- The user manages providers, clients, users, policies, or branding.
- The user needs console administration access.
- The user can suspend, maintain, or otherwise operate the tenant.

Choose IAM roles when:

- The user needs access to an application feature.
- A service route checks a permission.
- A product team wants fine-grained authorization.
- A downstream API needs policy decisions.

An accountant may need billing read permission in an application but should not automatically be a tenant admin. A platform lead may be a tenant owner and also hold IAM roles for Maintainerd administration.

## Beginner Workflow

For a new application team, start with this sequence:

1. Create or select the tenant.
2. Confirm the tenant is active.
3. Configure identity providers for how users sign in.
4. Create OAuth clients for the applications that will use Auth.
5. Configure registration flows or invite-only onboarding.
6. Add tenant members only for administrators.
7. Create IAM roles and permissions for application behavior.
8. Test login from the tenant identity host.
9. Inspect issued tokens conceptually and confirm tenant context is present.
10. Protect the application API by checking issuer, audience, subject, tenant, and permissions.

## Developer Checklist

Before shipping tenant-aware integration, verify:

- The app uses the correct tenant hostname or tenant lookup flow.
- OAuth redirect URIs are registered on the correct tenant client.
- CORS origins are registered on the correct tenant client.
- Tokens contain the expected tenant context.
- Admin screens use member roles only for tenant administration.
- Product permissions use IAM roles and policies.
- Suspended, inactive, and maintenance tenants are blocked from runtime flows.
- Public lookup does not leak administrative data.
- Member and tenant setting mutations create audit events.
- API request and response details are documented in the API reference, not duplicated in this conceptual page.

## Troubleshooting

If users see the wrong tenant during login, check the hostname first. Browser flows resolve tenant context from the host, not from a user-supplied tenant ID.

If a tenant admin cannot access the console, confirm they have an active user account, a tenant member record, the expected member role, any required IAM role, and a valid session for the console client.

If an application receives tokens for the wrong tenant, check the OAuth client registration, redirect URI, issuer, hosted login URL, and tenant host.

If public login is unavailable for one tenant, check tenant status, maintenance mode, IP restrictions, rate limits, provider status, and client-provider connections.
