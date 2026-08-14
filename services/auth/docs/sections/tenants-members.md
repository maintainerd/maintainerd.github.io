# Tenants & Members

Tenants are the top-level boundaries in Auth. Members are the people allowed to administer those tenants from the console.

Use this page when you are looking at the tenant settings or member management screens and need to understand what each field does.

## Where To Find It

In the console, open the tenant area for the current tenant.

You should see screens like:

| Screen | What You Configure Or Review |
|---|---|
| Tenant overview | Tenant identity, slug, status, timestamps, and hostnames. |
| Tenant settings | Tenant-wide operational controls. |
| Branding | Logos, colors, names, and hosted identity presentation. |
| Security defaults | Password, MFA, session, lockout, threat, and step-up behavior. |
| Messaging | Email and SMS provider behavior. |
| Events and webhooks | Integration events, endpoints, subscriptions, and delivery behavior. |
| Data retention | Data lifecycle and retention rules. |
| Members | Administrators who can operate the tenant. |
| Member invites or member access | Administrator onboarding and access changes. |

Only users with tenant administration permissions should see these screens.

## Tenant Overview

The tenant overview summarizes the tenant's identity and runtime state.

Common fields:

| Field | What It Means |
|---|---|
| Name | Human-readable tenant name shown to administrators and sometimes users. |
| Slug | Stable short identifier used for routing and lookup. |
| Status | Whether the tenant can serve login, registration, OAuth, and self-service traffic. |
| Created time | When the tenant was created. |
| Updated time | When tenant metadata or settings last changed. |
| Hostnames | Tenant-specific console or identity domains when configured. |

Use the overview before changing deeper settings. It tells you which tenant you are editing and whether it is safe to expect runtime flows to work.

## Tenant Status

Tenant status controls whether the tenant can be used.

Typical statuses:

| Status | Meaning |
|---|---|
| Active | Normal runtime traffic can proceed. |
| Suspended | Tenant traffic should be blocked because of policy, billing, security, or operations. |
| Inactive | Tenant exists but should not serve normal traffic. |
| Deleted or erased | Tenant is no longer available except for required records. |

Changing status affects login, registration, OAuth, token refresh, account self-service, clients, and provider behavior. Treat it as an operational action, not a display-only field.

## Tenant Settings

Tenant settings are the controls that apply across the tenant.

| Setting Group | What It Controls |
|---|---|
| Maintenance | Temporarily stops normal user-facing identity flows while a tenant is changed, recovered, or investigated. |
| Rate limits | How much traffic the tenant can send through sensitive routes such as login, registration, reset, OTP, and API calls. |
| Audit | What administrative and security-sensitive changes are recorded and how long records are kept. |
| Email | Sender behavior for verification, invites, password reset, magic links, and security notifications. |
| SMS | Provider behavior for SMS login, OTP, MFA, and phone verification. |
| Branding | Logos, colors, names, and copy shown in hosted login, registration, MFA, consent, recovery, invite, and account pages. |
| Security defaults | Tenant-wide password policy, MFA, sessions, lockout, trusted devices, and step-up behavior. |
| IP restrictions | Which networks are allowed or denied for administrative or runtime access. |
| Events and webhooks | Which integration events are emitted and delivered. |
| Data retention | How long account, event, audit, token, and lifecycle data is kept. |

## Member List

The member list shows who can administer the tenant.

Common fields:

| Field | What It Means |
|---|---|
| Member name or email | The administrator account. |
| Role | Administration level. |
| Status | Invited, active, suspended, or removed. |
| Last activity | Useful for reviewing unused access. |
| Joined time | When access became active. |

Members should be reviewed regularly. Remove access for people who no longer administer the tenant.

## Member Roles

Member roles control console administration.

Common role patterns:

| Role Pattern | Typical Access |
|---|---|
| Owner | Can manage high-risk tenant settings and other administrators. |
| Admin | Can manage most tenant configuration and users. |
| Operator | Can view operations and perform limited support tasks. |
| Security reviewer | Can inspect audit and security state. |
| Read-only viewer | Can inspect settings without changing them. |

Use the least powerful role that lets the person do their job.

## Member Invites

Member invites bring administrators into the tenant.

Invite fields:

| Field | What It Means |
|---|---|
| Email | Who is being invited. |
| Role | What administration access they will receive. |
| Status | Pending, accepted, expired, revoked, or canceled. |
| Expiration | When the invite stops working. |
| Invited by | Who created it. |

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

| Sensitive Action | Why It Is High Risk |
|---|---|
| Changing tenant status | Can block or restore tenant traffic. |
| Enabling public registration | Can allow new users to create accounts. |
| Changing security defaults | Can weaken password, MFA, session, lockout, or threat controls. |
| Changing email or SMS providers | Can affect verification, recovery, invites, and MFA delivery. |
| Changing hostnames | Can break routing, redirects, cookies, CORS, and WebAuthn. |
| Changing retention | Can alter audit, event, token, and account data lifecycle. |
| Adding owners or administrators | Grants console authority. |
| Revoking administrator access | Can lock people out of tenant operations. |

## Troubleshooting

If users cannot sign in, check tenant status, maintenance, hostnames, client status, providers, and security settings.

If a member cannot open the console, check their user status, member status, role, tenant status, and whether they are using the correct console hostname.

If branding does not appear, check tenant host resolution and branding settings.

If an invite fails, check expiration, revocation, tenant match, recipient email, and invite status.
