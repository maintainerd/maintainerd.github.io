# Tenants & Members

Tenants are the ownership and isolation boundary for Auth. A tenant owns its users, OAuth clients, identity providers, roles, permissions, policies, services, APIs, branding, messaging settings, security settings, event configuration, webhook configuration, and operational state.

Members connect users to a tenant with a tenant-level administrative relationship. The user is the account that signs in. The member record answers what that user can do as an operator inside the tenant, such as acting as an `owner`, `admin`, or regular `member`.

## Mental Model

Think of Auth as a tenant-aware identity system.

- A tenant is the workspace or organization boundary.
- A user is a human account inside one tenant.
- A tenant member is that user's administrative relationship to the tenant.
- IAM roles and permissions decide application and API access.
- OAuth clients decide which applications can send users through login.
- Identity providers decide how users authenticate.
- Tenant settings decide operational behavior for one tenant.

This split matters because tenant membership is not the same as product authorization. A user can be a tenant `member` and still receive application roles such as `billing-reader`, `project-admin`, or `support-agent` through Auth's IAM model.

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

## Tenant Shape

A tenant usually contains DNS-safe routing fields, display metadata, lifecycle state, and optional metadata used by operator tooling.

Example tenant record:

```json
{
  "tenant_id": "6a6eb931-3f50-4f60-81c1-15b3be0c9f4a",
  "name": "acme",
  "display_name": "Acme",
  "description": "Acme identity tenant",
  "status": "active",
  "metadata": {
    "language": "en",
    "timezone": "UTC",
    "date_format": "YYYY-MM-DD",
    "time_format": "24h"
  },
  "created_at": "2026-08-13T00:00:00Z",
  "updated_at": "2026-08-13T00:00:00Z"
}
```

Tenant names are used as DNS labels for tenant-aware console and identity hosts. Use lowercase letters, numbers, and hyphens. Start and end with a letter or number.

## Tenant Operations

Tenant administrators and platform operators commonly need to:

- List tenants.
- Create a tenant.
- View tenant detail.
- Update tenant metadata.
- Change tenant status.
- Configure tenant settings.
- Manage tenant members.
- Delete tenants when allowed.
- Read public tenant context for login screens.

The console is the normal interface for humans. The REST management API and control-plane gRPC services support automation and provisioning.

## What Tenant Operations Do

Listing tenants is an operator discovery action. The console uses it to show which tenants exist, what state each tenant is in, and which tenant an operator can manage. A list response can include tenant IDs, names, display names, status, and timestamps. It should not include provider credentials, email passwords, SMS tokens, webhook signing secrets, OAuth client secrets, or other sensitive values.

Creating a tenant establishes a new isolation boundary. Auth is not only saving a company name. It is creating the namespace where users, clients, identity providers, roles, permissions, policies, templates, events, webhooks, and settings will live. In production, tenant creation should also run baseline seeders so the tenant starts with required Auth resources and safe defaults.

Viewing tenant detail powers the tenant overview screen in the console. It should explain who the tenant is, whether it is usable, when it was created, and what high-level configuration exists. Detailed child resources such as members, clients, providers, policies, and messaging settings can be loaded from their own endpoints so each area can apply stricter permission checks.

Updating tenant metadata changes human-facing or operator-facing fields such as `display_name`, `description`, timezone, language, date format, and internal metadata used by automation. Metadata is useful for display and organization, but it should not become an authorization source unless the backend validates and enforces that exact field.

Changing tenant status changes runtime availability. This is a security and operations action, not a cosmetic edit. If a tenant is suspended or inactive, login, registration, OAuth, account self-service, and credential routes should stop before accepting secrets from the user.

Configuring tenant settings changes Auth behavior for one tenant. These settings can affect login availability, rate limits, messaging delivery, security requirements, branding, audit records, webhook delivery, and data retention. Update them through the console or management API so validation, cache invalidation, events, and audit logs happen consistently.

Managing tenant members changes who can administer the tenant. Membership changes should be treated as sensitive because the right member role can unlock access to users, clients, providers, policies, and settings.

Deleting a tenant is a destructive lifecycle action. A safe implementation checks whether deletion is allowed, prevents protected tenants from being deleted, handles sessions and tokens, and preserves audit records according to retention policy. Many production systems prefer suspension or soft deletion before permanent removal.

Reading public tenant context supports pre-login screens. The hosted identity UI may need to know that `acme` exists, that its display name is `Acme`, which branding to show, and which login methods are available. Public tenant lookup must never return internal settings, member lists, credentials, secrets, or administrative metadata.

## Creating A Tenant

During first-time setup, the console uses the setup tenant endpoint:

```bash
curl -fsS -X POST https://console-api.auth.example.com/api/v1/setup/create_tenant \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "acme",
    "display_name": "Acme",
    "description": "Acme identity tenant",
    "metadata": {
      "language": "en",
      "timezone": "UTC",
      "date_format": "YYYY-MM-DD",
      "time_format": "24h"
    }
  }'
```

After setup is complete, create additional tenants through the console, the tenant management API, or the control-plane `TenantService` when that mode is enabled.

Representative management API pattern:

```bash
curl -fsS -X POST https://console-api.auth.example.com/api/v1/tenants \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "northwind",
    "display_name": "Northwind Traders",
    "description": "Tenant for Northwind customer applications"
  }'
```

Use the generated OpenAPI reference from the management port for exact request and response schemas in your deployed version.

## Tenant Status

Tenant status is part of the runtime security boundary. Auth checks tenant lifecycle before credential, OAuth, and account routes proceed.

Common meanings:

- `pending`: the tenant exists but is not ready for normal sign-in.
- `active`: users can authenticate and clients can run normal OAuth flows.
- `suspended`: authentication and OAuth flows should be blocked.
- `inactive`: the tenant should not be used for runtime traffic.

Use `pending` while bootstrap or provisioning is still running. A pending tenant may have a database record but may not have seeded clients, roles, settings, identity providers, or admin membership yet. Runtime flows should treat it as unavailable.

Use `active` for normal production traffic. Active tenants can serve hosted login, OAuth authorization, token exchange, registration, account self-service, and service authorization as long as the client, provider, user, and policy checks also pass.

Use `suspended` when access should stop temporarily. Suspension is useful for abuse investigation, customer-requested access freeze, non-payment, legal review, or incident response. Authorized operators should still be able to inspect and repair the tenant from management surfaces.

Use `inactive` when the tenant is retired or should no longer receive runtime traffic. Inactive tenants should not accept new sessions or OAuth flows. Depending on retention policy, the data may remain available for audit, export, or controlled cleanup.

Status changes are operational actions. Treat them like production changes: audit them, require the right operator permission, and communicate the effect to application teams.

Example suspension pattern:

```bash
curl -fsS -X PATCH https://console-api.auth.example.com/api/v1/tenants/6a6eb931-3f50-4f60-81c1-15b3be0c9f4a/status \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "suspended",
    "reason": "Customer requested temporary access freeze"
  }'
```

## Tenant Host Resolution

Browser flows use the incoming host to resolve tenant context. Auth does not trust a caller-provided tenant ID to decide which tenant a login request belongs to.

Example system hosts:

```text
https://identity.auth.example.com
https://console.auth.example.com
```

Example tenant hosts:

```text
https://acme.identity.auth.example.com
https://acme.console.auth.example.com
```

If a user opens the Acme identity host, Auth resolves `acme` as the tenant slug before login, registration, MFA, consent, and account self-service continue.

## Public Tenant Lookup

Hosted login screens and external applications sometimes need public tenant context before authentication. Public lookup should return only information safe to show before sign-in, such as display name, branding hints, enabled login methods, or tenant availability.

Example pattern:

```bash
curl -fsS "https://identity.auth.example.com/api/v1/public/tenants/acme"
```

Do not expose internal tenant settings, member lists, audit configuration, secrets, SMTP credentials, OAuth client secrets, policy documents, or administrative metadata through public lookup.

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

Example settings shape:

```json
{
  "tenant_id": "6a6eb931-3f50-4f60-81c1-15b3be0c9f4a",
  "maintenance": {
    "enabled": false,
    "message": null,
    "reason": null
  },
  "rate_limits": {
    "enabled": true,
    "requests_per_minute": 600,
    "login_per_minute": 20,
    "password_reset_per_hour": 5,
    "mfa_challenge_per_hour": 10,
    "sms_per_day": 25
  },
  "messaging": {
    "email_config_source": "tenant",
    "sms_config_source": "system",
    "email_status": "active",
    "sms_status": "inherited"
  },
  "security": {
    "require_mfa_for_admins": true,
    "allow_password_login": true,
    "allow_magic_link_login": true,
    "session_idle_timeout_minutes": 60,
    "step_up_max_age_minutes": 10
  },
  "audit": {
    "enabled": true,
    "retention_days": 365
  },
  "events": {
    "enabled": true,
    "webhooks_enabled": true
  }
}
```

Settings should be changed through the console or management API so validation, permission checks, cache invalidation, events, and audit logs stay consistent.

## Maintenance Setting

The maintenance setting tells Auth whether the tenant is temporarily unavailable for normal user-facing runtime traffic. When maintenance is enabled, Auth should stop login, registration, OAuth, MFA, and account self-service flows early and return a controlled maintenance response. The important part is that Auth should not accept passwords, OTPs, or other credentials while the tenant is known to be unavailable.

Use maintenance for planned work such as tenant migration, provider rotation, incident response, or data repair. Do not use it as a long-term substitute for `suspended` or `inactive` status. Tenant status describes lifecycle. Maintenance describes a temporary operating window.

Important fields:

- `enabled`: turns maintenance behavior on or off.
- `message`: optional text the hosted identity UI can show users.
- `reason`: internal operator reason for audit logs and support review.
- `starts_at`: optional scheduled start time if the implementation supports scheduled windows.
- `ends_at`: optional scheduled end time if the implementation supports scheduled windows.

Developer behavior:

- Check maintenance before credential validation.
- Keep authorized management access available so an operator can turn maintenance off.
- Avoid revealing whether a submitted username or password would have been valid.
- Emit audit events when maintenance is enabled, changed, or disabled.

Before enabling maintenance mode:

- Confirm which tenant is affected.
- Confirm whether login, OAuth, and account routes will be unavailable.
- Make sure at least one operator still has a working path to disable maintenance.
- Record a reason for audit logs.

Example pattern:

```bash
curl -fsS -X PATCH https://console-api.auth.example.com/api/v1/tenants/6a6eb931-3f50-4f60-81c1-15b3be0c9f4a/settings \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "maintenance": {
      "enabled": true,
      "message": "Acme sign-in is temporarily unavailable during scheduled maintenance."
    }
  }'
```

## Rate Limit Settings

Rate limit settings control how much traffic one tenant can send to sensitive Auth routes during a time window. They protect the service from brute-force login attempts, password reset spam, SMS cost attacks, noisy clients, and accidental retry loops.

Tenant-wide limits apply across a tenant. Credential-specific limits apply to risky routes such as login, password reset, magic link, MFA challenge, SMS verification, and token exchange. Credential limits should usually be stricter than normal API limits because these routes can reveal timing signals, send messages, or spend money.

Example rate-limit settings:

```json
{
  "rate_limits": {
    "enabled": true,
    "requests_per_minute": 600,
    "login_per_minute": 20,
    "password_reset_per_hour": 5,
    "mfa_challenge_per_hour": 10,
    "sms_per_day": 25
  }
}
```

What each field does:

- `enabled`: turns tenant rate-limit enforcement on or off.
- `requests_per_minute`: caps broad tenant traffic across protected routes.
- `login_per_minute`: limits credential login attempts for the tenant.
- `password_reset_per_hour`: limits password reset emails for the tenant.
- `mfa_challenge_per_hour`: limits repeated MFA challenge creation.
- `sms_per_day`: limits SMS delivery to protect cost and reduce abuse.

Developer behavior:

- Return a `429 Too Many Requests` style response when a limit is exceeded.
- Do not reveal whether a username exists in rate-limit responses.
- Include tenant ID, route family, client ID, IP address, or user identifier in rate-limit keys depending on the route.
- Make limits configurable because tenants have different legitimate traffic patterns.

## Audit Settings

Audit settings control what Auth records for administrative, security, and lifecycle actions. Audit logs answer who changed something, what changed, which tenant was affected, when it happened, and whether it succeeded.

Examples of actions that should be audited include tenant creation, tenant suspension, settings changes, member promotion, member removal, provider changes, client secret rotation, redirect URI changes, role changes, policy changes, user disablement, session revocation, and denied admin attempts.

Example audit settings:

```json
{
  "audit": {
    "enabled": true,
    "log_successful_admin_actions": true,
    "log_denied_admin_actions": true,
    "retention_days": 365
  }
}
```

What each field does:

- `enabled`: controls whether audit logging is active for tenant management actions.
- `log_successful_admin_actions`: records successful changes so operators can reconstruct history.
- `log_denied_admin_actions`: records denied attempts, which helps detect probing or misconfigured permissions.
- `retention_days`: controls how long audit records are kept before retention cleanup can remove them.

Developer behavior:

- Include actor, tenant, action, target, result, timestamp, request ID, and reason when available.
- Do not store plaintext passwords, provider tokens, SMTP passwords, OAuth client secrets, or webhook signing secrets in audit logs.
- For secret changes, log that the secret was changed, not the value.
- Treat audit logs as security data, not ordinary debug logs.

## Email Settings

Email settings decide how Auth sends email for one tenant. Email is used for verification, password reset, magic links, invites, MFA email OTP, email change confirmation, device approval, and other identity flows.

A tenant can use its own SMTP configuration or inherit the system tenant's email configuration. Tenant-specific email is useful when a customer needs its own sender domain, brand identity, compliance setup, or delivery monitoring. System fallback is useful for simple deployments where one operator controls all messaging.

Example email settings:

```json
{
  "messaging": {
    "email_config_source": "tenant",
    "email": {
      "provider": "smtp",
      "host": "smtp.example.com",
      "port": 587,
      "username": "mailer@example.com",
      "from_address": "no-reply@acme.example.com",
      "from_name": "Acme Identity",
      "status": "active"
    }
  }
}
```

What each field does:

- `email_config_source`: selects tenant email settings or inherited system settings.
- `provider`: identifies the delivery method. Current runtime delivery uses SMTP-compatible providers.
- `host` and `port`: tell Auth where to connect for SMTP delivery.
- `username`: identifies the SMTP account.
- `password`: authenticates to the SMTP provider. It should be write-only and never returned in plaintext.
- `from_address`: the sender email address users see.
- `from_name`: the sender display name users see.
- `status`: controls whether this email configuration can be used.

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

Example SMS settings:

```json
{
  "messaging": {
    "sms_config_source": "tenant",
    "sms": {
      "provider": "twilio",
      "account_id": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "from_number": "+15551234567",
      "status": "active"
    }
  }
}
```

What each field does:

- `sms_config_source`: selects tenant SMS settings or inherited system settings.
- `provider`: selects the SMS delivery integration.
- `account_id`: identifies the provider account, such as a Twilio Account SID.
- `auth_token`: authenticates to the provider. It should be write-only and stored as a secret.
- `from_number`: the sender number used for outbound SMS when the provider requires one.
- `status`: controls whether this SMS configuration can be used.

Developer behavior:

- Never return `auth_token` in API responses.
- Use the `log` provider only for local development or controlled tests.
- Mask phone numbers in logs when a full number is not required.
- Apply tenant and route-specific rate limits to SMS flows.

## Branding Settings

Branding settings control what users see on hosted identity screens. This includes login, registration, consent, password reset, MFA, invite acceptance, and account self-service pages.

Branding exists because the same Auth deployment may serve many tenants. A user signing into Acme should see Acme's tenant name, visual identity, support link, and templates rather than another tenant's identity.

Example branding settings:

```json
{
  "branding": {
    "display_name": "Acme",
    "logo_url": "https://cdn.example.com/acme/logo.svg",
    "primary_color": "#2563eb",
    "support_url": "https://support.acme.example.com",
    "template_source": "tenant"
  }
}
```

What each field does:

- `display_name`: the human-readable tenant name shown in hosted identity screens.
- `logo_url`: the logo used by public branding routes and the hosted identity UI.
- `primary_color`: the main accent color for tenant-specific screens.
- `support_url`: where users can go when they need help.
- `template_source`: selects tenant templates or inherited default templates.

Developer behavior:

- Public branding lookup may expose safe display values such as name, color, logo route, support link, and enabled login methods.
- Do not expose unpublished template bodies, internal template IDs, credentials, or operator metadata through public branding routes.
- Validate URLs before rendering them in browser pages.

## Security Default Settings

Security default settings define the baseline security posture for a tenant. They let one tenant require stricter controls than another without forking the application.

Example security settings:

```json
{
  "security": {
    "require_mfa_for_admins": true,
    "allow_password_login": true,
    "allow_magic_link_login": true,
    "password_min_length": 12,
    "session_idle_timeout_minutes": 60,
    "step_up_max_age_minutes": 10
  }
}
```

What each field does:

- `require_mfa_for_admins`: requires admins or owners to complete MFA before sensitive console actions.
- `allow_password_login`: controls whether local password login is available.
- `allow_magic_link_login`: controls whether passwordless email links can be used.
- `password_min_length`: sets the minimum length for tenant-local passwords.
- `session_idle_timeout_minutes`: controls how long an idle browser session can remain valid.
- `step_up_max_age_minutes`: controls how fresh MFA proof must be before sensitive actions.

Developer behavior:

- Enforce security defaults on the backend, not only in the frontend.
- Re-check sensitive settings at action time because policy can change while a user is signed in.
- Combine member role, IAM permission, session state, and step-up proof for sensitive admin operations.

## IP Restriction Settings

IP restriction settings allow a tenant to limit access to specific source networks. This is commonly used for admin console access, internal workforces, partner integrations, or high-risk account actions.

Example IP restriction settings:

```json
{
  "ip_restrictions": {
    "enabled": true,
    "mode": "allowlist",
    "cidrs": [
      "203.0.113.0/24",
      "2001:db8:1234::/48"
    ],
    "applies_to": [
      "console",
      "management_api"
    ]
  }
}
```

What each field does:

- `enabled`: turns IP enforcement on or off.
- `mode`: describes whether listed ranges are allowed or denied.
- `cidrs`: contains the IPv4 or IPv6 network ranges.
- `applies_to`: describes which route families are protected.

Developer behavior:

- Evaluate IP restrictions before credential handlers or sensitive management handlers run.
- Trust proxy headers only when the reverse proxy is configured and trusted.
- Return a generic denied response that does not reveal tenant internals.
- Audit denied admin attempts when audit logging is enabled.

## Event And Webhook Settings

Event and webhook settings decide which tenant events Auth emits and where those events are delivered. Events are useful for integration, automation, security monitoring, and downstream product behavior.

Examples of tenant events include user registration, login success, login failure, password reset request, MFA enrollment, OAuth client creation, tenant member promotion, role changes, and policy changes.

Example event settings:

```json
{
  "events": {
    "enabled": true,
    "disabled_event_types": [
      "auth.debug.sample"
    ],
    "webhooks_enabled": true
  }
}
```

What each field does:

- `enabled`: controls whether tenant integration events can be emitted.
- `disabled_event_types`: disables specific event types for the tenant.
- `webhooks_enabled`: controls whether active webhook endpoints can receive tenant events.

Developer behavior:

- Emit events only after the database change succeeds.
- Use an outbox or retryable delivery design so webhook failure does not break the original user action.
- Sign webhook deliveries when a signing secret is configured.
- Never place plaintext passwords, access tokens, refresh tokens, provider tokens, or SMTP secrets in event payloads.

## Data Retention Settings

Data retention settings control how long Auth keeps tenant-owned operational data. This can include events, webhook delivery attempts, expired sessions, revoked tokens, device records, export requests, erasure requests, and audit logs.

Example retention settings:

```json
{
  "retention": {
    "audit_log_days": 365,
    "event_days": 90,
    "webhook_delivery_days": 30,
    "expired_session_days": 14,
    "revoked_token_days": 30
  }
}
```

What each field does:

- `audit_log_days`: how long administrative audit records are preserved.
- `event_days`: how long tenant event records are preserved.
- `webhook_delivery_days`: how long webhook attempt history is preserved.
- `expired_session_days`: how long expired browser session records remain available for review.
- `revoked_token_days`: how long revoked token identifiers remain available for enforcement or investigation.

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

Example member record:

```json
{
  "tenant_member_id": "8458334e-a94a-4bf7-8ea3-51bec0bbca26",
  "tenant_id": "6a6eb931-3f50-4f60-81c1-15b3be0c9f4a",
  "user_id": "b8a759a4-d32c-47c1-8362-3eaa02e25a54",
  "role": "admin",
  "created_at": "2026-08-13T00:00:00Z",
  "updated_at": "2026-08-13T00:00:00Z"
}
```

## Member Operations

Common member operations include:

- List tenant members.
- Add a user as a tenant member.
- Change a member role.
- Remove a tenant member.
- Transfer ownership.
- Prevent the last owner from being removed or downgraded.

Every member mutation should be audit logged because it changes who can administer the tenant.

Listing tenant members shows who can administer a tenant. A useful member list includes the member ID, user ID, email or display name, member role, user status, creation time, and update time. It should not include password hashes, MFA secrets, provider tokens, session secrets, recovery codes, or unrelated profile data.

Adding a member gives a user tenant-level administrative presence. This is different from giving someone product access. Add a member when the user needs console access or tenant administration. If the user only needs to use an application, assign IAM roles or product permissions instead.

Changing a member role changes what that user can administer. Promoting a user to `owner` should be treated as a high-risk action because owners can usually control tenant lifecycle, settings, membership, and other administrative resources. Demoting an owner should check that another owner remains.

Removing a member removes tenant administration access. It should not automatically delete the user account because the account may still be needed for application access, audit attribution, session review, data export, erasure workflow, or historical records.

Transferring ownership is a controlled sequence. Promote or add the new owner first, verify the tenant has at least one owner, then demote or remove the old owner. This avoids an ownerless tenant that no one can manage.

Preventing last-owner removal is a safety rule. Auth should reject any member update that would leave the tenant with zero owners. This check belongs in the backend, not only in the console UI.

## Adding A Member

Create or invite the user first, then add tenant membership if they need tenant-level access.

Representative API pattern:

```bash
curl -fsS -X POST https://console-api.auth.example.com/api/v1/tenants/6a6eb931-3f50-4f60-81c1-15b3be0c9f4a/members \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "user_id": "b8a759a4-d32c-47c1-8362-3eaa02e25a54",
    "role": "admin"
  }'
```

If the person only needs access inside an application, assign IAM roles or application-specific permissions instead of making them a tenant admin.

## Changing Member Roles

Role changes should be explicit. A good console flow shows the current role, the requested role, and the effect of the change.

Example pattern:

```bash
curl -fsS -X PATCH https://console-api.auth.example.com/api/v1/tenants/6a6eb931-3f50-4f60-81c1-15b3be0c9f4a/members/8458334e-a94a-4bf7-8ea3-51bec0bbca26 \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "role": "owner",
    "reason": "Promoting primary customer administrator"
  }'
```

Guardrails to preserve:

- Do not allow a tenant to have zero owners.
- Require strong authorization for owner promotion, owner demotion, and owner removal.
- Prefer step-up MFA for sensitive ownership changes.
- Emit audit events for who changed what and why.

## Removing A Member

Removing a member removes tenant administration access. It should not necessarily delete the user account, revoke application roles, or erase audit history.

Example pattern:

```bash
curl -fsS -X DELETE https://console-api.auth.example.com/api/v1/tenants/6a6eb931-3f50-4f60-81c1-15b3be0c9f4a/members/8458334e-a94a-4bf7-8ea3-51bec0bbca26 \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

After removing a member, decide separately whether to revoke sessions, remove IAM roles, disable the user, or start an erasure workflow.

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

Example: An accountant may need `billing-reader` permission in an app but should not be a tenant `admin`. A platform lead may be a tenant `owner` and also hold IAM roles for Maintainerd administration.

## Beginner Workflow

For a new application team, start with this sequence:

1. Create or select the tenant.
2. Confirm the tenant is `active`.
3. Configure identity providers for how users sign in.
4. Create OAuth clients for the applications that will use Auth.
5. Configure registration flows or invite-only onboarding.
6. Add tenant members only for administrators.
7. Create IAM roles and permissions for application behavior.
8. Test login from the tenant identity host.
9. Inspect the issued token and confirm the `tenant_id` claim.
10. Protect the application API by checking token issuer, audience, subject, tenant, and permissions.

## Developer Checklist

Before shipping tenant-aware integration, verify:

- The app uses the correct tenant hostname or tenant lookup flow.
- OAuth redirect URIs are registered on the correct tenant client.
- CORS origins are registered on the correct tenant client.
- Tokens contain the expected `tenant_id`.
- Admin screens use member roles only for tenant administration.
- Product permissions use IAM roles and policies.
- Suspended, inactive, and maintenance tenants are blocked from runtime flows.
- Public lookup does not leak administrative data.
- Member and tenant setting mutations create audit events.

## Troubleshooting

If users see the wrong tenant during login, check the hostname first. Browser flows resolve tenant context from the host, not from a user-supplied tenant ID.

If a tenant admin cannot access the console, confirm they have an active user account, a tenant member record, the expected member role, any required IAM role, and a valid session for the console client.

If an application receives tokens for the wrong tenant, check the OAuth client registration, redirect URI, issuer, hosted login URL, and tenant host.

If public login is unavailable for one tenant, check tenant status, maintenance mode, IP restrictions, rate limits, provider status, and client-provider connections.
