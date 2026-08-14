# Users & Invites

Users are human accounts inside a tenant. Invites are controlled onboarding records that let a person join with a known context.

Use this page when you are on the Users or Invites screens and need to understand what the fields and actions do.

## Where To Find It

In the console, open the tenant and then open Users or Invites.

The Users screen is for account review and administration. The Invites screen is for onboarding people before they have completed registration.

Account self-service is separate. A signed-in user managing their own profile, password, MFA, sessions, devices, consents, and linked identities should use the hosted account UI.

## Users List

The users list helps administrators find and review accounts.

Common columns:

| Column | What It Means |
|---|---|
| Email | User's contact or login email. |
| Username | Optional tenant-local identifier. |
| Phone | Optional phone number for SMS, MFA, or recovery. |
| Status | Whether the account can be used. |
| Email verified | Whether the user proved email ownership. |
| Phone verified | Whether the user proved phone ownership. |
| MFA | Whether factors are enrolled. |
| Created | When the account was created. |
| Updated or last active | When the account last changed or signed in. |

The list should not show passwords, password hashes, MFA secrets, backup codes, provider tokens, refresh tokens, access tokens, or session cookies.

## User Detail

Open a user to see account-specific information.

Common sections:

| Section | What It Shows |
|---|---|
| Account | Email, username, phone, status, verification, timestamps, and metadata. |
| Security | Password state, MFA summary, lockout state, and recovery state. |
| Roles | Product or API roles assigned to the user. |
| Tenant membership | Whether the user can administer the tenant. |
| Profiles | Display and personal information. |
| Linked identities | External provider accounts attached to this user. |
| Sessions | Active or recent sign-in sessions. |
| Devices | Remembered or trusted device records. |
| Consents | OAuth clients the user approved. |
| Erasure | Deletion or anonymization lifecycle state. |

Keep authorization and administration visually separate. A user can have application roles without being a tenant member.

## User Status

Status controls whether the account can participate in Auth flows.

| Status | Meaning |
|---|---|
| Pending | User exists but has not completed required onboarding, verification, first password setup, or invite acceptance. |
| Active | User can sign in when tenant, client, provider, MFA, rate-limit, and policy checks pass. |
| Disabled | Administrator or lifecycle process has blocked the account. |
| Locked | Account is temporarily blocked because of failed login attempts or risk controls. |
| Deleted or erased | Account has been removed or anonymized according to lifecycle rules. |

Changing status is sensitive. Disabling a user should block new login, token refresh, and self-service actions.

## User Actions

| Action | What It Does | Guidance |
|---|---|---|
| Create user | Creates an account directly. | Use for bootstrap, migration, or controlled provisioning. For normal onboarding, prefer invites. |
| Edit user | Changes account fields such as email, username, phone, status, or metadata. | Review downstream identity impact before saving. |
| Set password | Creates or replaces a local Auth password. | Usually require the user to change the password on next login. |
| Force password change | Marks the account so the next successful login must rotate the password. | Use after administrator-set passwords or suspected compromise. |
| Verify email or phone | Marks a contact method as proven. | Prefer user-driven verification unless an administrator has strong evidence. |
| Unlock | Clears temporary lockout. | Does not reset password or MFA unless those actions are performed separately. |
| Assign roles | Grants product or API permissions. | Grant least privilege. |
| Revoke sessions | Signs the user out from one or more sessions. | Use after account risk, password changes, or device loss. |
| Start erasure | Begins deletion or anonymization workflow. | Confirm lifecycle and retention requirements first. |

## Invites List

The invites list shows onboarding invitations.

Common columns:

| Column | What It Means |
|---|---|
| Email | Who is invited. |
| Type | User invite, member invite, or product-specific invite. |
| Status | Pending, accepted, expired, revoked, or canceled. |
| Role or access | What the user will receive after acceptance. |
| Expires | When the invite stops working. |
| Invited by | Which administrator created it. |
| Created | When it was issued. |

Invites are useful because they preserve intent before the person signs up.

## Invite Detail Fields

| Field | What It Controls |
|---|---|
| Email | Who can accept the invite when recipient matching is enforced. |
| Tenant | Where the invite is valid. |
| Role or access | What default access is granted after registration. |
| Registration flow | Which onboarding steps run. |
| Expiration | How long the invite can be used. |
| Status | Whether the invite can still be accepted. |
| Accepted by | Which user completed the invite. |
| Reason or note | Why the invite was created. |

## Invite Actions

| Action | What It Does |
|---|---|
| Create invite | Sends or creates a new onboarding path. |
| Resend invite | Sends the invitation again without changing who it is for. |
| Revoke invite | Makes the invite unusable before expiration. |
| Cancel invite | Marks it intentionally withdrawn. |
| View public invite state | Lets the hosted identity UI show safe invite context before registration. |
| Accept invite | Happens in the hosted identity UI, not the admin console. |

## Admin-Created User Vs Invite

Create a user directly when the account must exist before the person interacts with Auth, such as migration or bootstrap.

Create an invite when the person should accept, verify email, set a password, complete profile, or join through a registration flow.

Invites are usually better for normal onboarding because they create an audit trail and let the user prove control of the invited email.

## Permissions And Security

User administration requires tenant user-management permissions.

Invite creation and revocation require invite-management permissions.

Password resets, session revocation, unlocking, identity linking, role assignment, and erasure should require stronger permissions and audit records. Some should require administrator step-up MFA.

Never expose secrets in user or invite screens. Invite tokens, reset links, magic links, OTPs, session tokens, provider tokens, and MFA secrets should be hidden from normal UI and logs.

## Common Workflows

To invite a user:

1. Open Invites.
2. Choose the invite type.
3. Enter recipient email.
4. Choose registration flow and default access.
5. Set expiration.
6. Send the invite.
7. Watch status until accepted or expired.

To review a user:

1. Open Users.
2. Search by email, username, or status.
3. Open user detail.
4. Review account, security, roles, identities, sessions, devices, and consents.
5. Take only the action needed.
6. Check audit records after sensitive changes.

## Troubleshooting

If a user cannot sign in, check tenant status, user status, provider connection, password state, verification requirements, MFA policy, lockout, and sessions.

If an invite cannot be accepted, check expiration, revocation, tenant match, recipient email, registration flow, and whether the invite was already accepted.

If an administrator cannot edit a user, check member role, permissions, step-up requirements, and tenant status.

If role changes do not take effect, check authorization cache, active sessions, token lifetime, and whether the role belongs to the same tenant.
