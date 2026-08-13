# Tenants & Members

Tenants are the top-level boundaries in Auth. Members are the people allowed to administer those tenants from the console.

Use this page when you are looking at the tenant settings or member management screens and need to understand what each field does.

## Where To Find It

In the console, open the tenant area for the current tenant.

You should see screens like:

- Tenant overview.
- Tenant settings.
- Branding.
- Security defaults.
- Messaging.
- Events and webhooks.
- Data retention.
- Members.
- Member invites or member access.

Only users with tenant administration permissions should see these screens.

## Tenant Overview

The tenant overview summarizes the tenant's identity and runtime state.

Common fields:

- Name: the human-readable tenant name shown to administrators and sometimes users.
- Slug: the stable short identifier used for routing and lookup.
- Status: whether the tenant can serve login, registration, OAuth, and self-service traffic.
- Created time: when the tenant was created.
- Updated time: when tenant metadata or settings last changed.
- Hostnames: tenant-specific console or identity domains when configured.

Use the overview before changing deeper settings. It tells you which tenant you are editing and whether it is safe to expect runtime flows to work.

## Tenant Status

Tenant status controls whether the tenant can be used.

Typical statuses:

- Active: normal runtime traffic can proceed.
- Suspended: tenant traffic should be blocked because of policy, billing, security, or operations.
- Inactive: tenant exists but should not serve normal traffic.
- Deleted or erased: tenant is no longer available except for required records.

Changing status affects login, registration, OAuth, token refresh, account self-service, clients, and provider behavior. Treat it as an operational action, not a cosmetic field.

## Tenant Settings

Tenant settings are the controls that apply across the tenant.

Maintenance setting temporarily stops normal user-facing identity flows. Use it when the tenant is being changed, recovered, or investigated.

Rate-limit settings decide how much traffic the tenant can send through sensitive routes such as login, registration, reset, OTP, and API calls.

Audit settings decide what administrative and security-sensitive changes are recorded and how long records are kept.

Email settings decide sender behavior for verification, invites, password reset, magic links, and security notifications.

SMS settings decide provider behavior for SMS login, OTP, MFA, and phone verification.

Branding settings decide logos, colors, names, and copy shown in hosted login, registration, MFA, consent, recovery, invite, and account pages.

Security defaults decide tenant-wide behavior for password policy, MFA, sessions, lockout, trusted devices, and step-up.

IP restriction settings decide which networks are allowed or denied for administrative or runtime access.

Event and webhook settings decide which integration events are emitted and delivered.

Data retention settings decide how long account, event, audit, token, and lifecycle data is kept.

## Member List

The member list shows who can administer the tenant.

Common fields:

- Member name or email: the administrator account.
- Role: the administration level.
- Status: invited, active, suspended, or removed.
- Last activity: useful for reviewing unused access.
- Joined time: when access became active.

Members should be reviewed regularly. Remove access for people who no longer administer the tenant.

## Member Roles

Member roles control console administration.

Common role patterns:

- Owner: can manage high-risk tenant settings and other administrators.
- Admin: can manage most tenant configuration and users.
- Operator: can view operations and perform limited support tasks.
- Security reviewer: can inspect audit and security state.
- Read-only viewer: can inspect settings without changing them.

Use the least powerful role that lets the person do their job.

## Member Invites

Member invites bring administrators into the tenant.

Invite fields:

- Email: who is being invited.
- Role: what administration access they will receive.
- Status: pending, accepted, expired, revoked, or canceled.
- Expiration: when the invite stops working.
- Invited by: who created it.

Invite links are bearer secrets. Do not paste them into logs, tickets, or public channels.

## Common Workflows

To create a tenant:

1. Open the tenant creation screen.
2. Enter name and slug.
3. Choose initial status.
4. Review default settings.
5. Save the tenant.
6. Configure hostnames, branding, security, messaging, and registration before inviting users.

To update settings:

1. Open tenant settings.
2. Select the setting group.
3. Read the field description.
4. Make the change.
5. Review affected flows.
6. Save.
7. Test login or registration if the change affects users.

To add a member:

1. Open Members.
2. Create an invite or add an existing user.
3. Choose the least-privileged role.
4. Send or save.
5. Confirm acceptance.
6. Review audit records.

## Permissions And Security

Tenant changes require tenant administration permissions. Member changes should require stronger permissions than normal user management because they grant console access.

Sensitive tenant actions should require audit records and may require step-up MFA:

- Changing tenant status.
- Enabling public registration.
- Changing security defaults.
- Changing email or SMS providers.
- Changing hostnames.
- Changing retention.
- Adding owners or administrators.
- Revoking administrator access.

## Troubleshooting

If users cannot sign in, check tenant status, maintenance, hostnames, client status, providers, and security settings.

If a member cannot open the console, check their user status, member status, role, tenant status, and whether they are using the correct console hostname.

If branding does not appear, check tenant host resolution and branding settings.

If an invite fails, check expiration, revocation, tenant match, recipient email, and invite status.
