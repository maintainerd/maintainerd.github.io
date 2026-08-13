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

- Email: the user's contact or login email.
- Username: optional tenant-local identifier.
- Phone: optional phone number for SMS, MFA, or recovery.
- Status: whether the account can be used.
- Email verified: whether the user proved email ownership.
- Phone verified: whether the user proved phone ownership.
- MFA: whether factors are enrolled.
- Created: when the account was created.
- Updated or last active: when the account last changed or signed in.

The list should not show passwords, password hashes, MFA secrets, backup codes, provider tokens, refresh tokens, access tokens, or session cookies.

## User Detail

Open a user to see account-specific information.

Common sections:

- Account: email, username, phone, status, verification, timestamps, and metadata.
- Security: password state, MFA summary, lockout state, and recovery state.
- Roles: product or API roles assigned to the user.
- Tenant membership: whether the user can administer the tenant.
- Profiles: display and personal information.
- Linked identities: external provider accounts attached to this user.
- Sessions: active or recent sign-in sessions.
- Devices: remembered or trusted device records.
- Consents: OAuth clients the user approved.
- Erasure: deletion or anonymization lifecycle state.

Keep authorization and administration visually separate. A user can have application roles without being a tenant member.

## User Status

Status controls whether the account can participate in Auth flows.

Pending means the user exists but has not completed required onboarding, verification, first password setup, or invite acceptance.

Active means the user can sign in when tenant, client, provider, MFA, rate-limit, and policy checks pass.

Disabled means an administrator or lifecycle process has blocked the account.

Locked means the account is temporarily blocked because of failed login attempts or risk controls.

Deleted or erased means the account has been removed or anonymized according to lifecycle rules.

Changing status is sensitive. Disabling a user should block new login, token refresh, and self-service actions.

## User Actions

Create user creates an account directly. Use it for bootstrap, migration, or controlled provisioning. For normal onboarding, prefer invites.

Edit user changes account fields such as email, username, phone, status, or metadata.

Set password creates or replaces a local Auth password. It should usually require the user to change the password on next login.

Force password change marks the account so the next successful login must rotate the password before normal access.

Verify email or phone marks a contact method as proven. Prefer user-driven verification unless an administrator has strong evidence.

Unlock clears temporary lockout. It should not reset password or MFA unless those actions are performed separately.

Assign roles grants product or API permissions.

Revoke sessions signs the user out from one or more sessions.

Start erasure begins deletion or anonymization workflow.

## Invites List

The invites list shows onboarding invitations.

Common columns:

- Email: who is invited.
- Type: user invite, member invite, or product-specific invite.
- Status: pending, accepted, expired, revoked, or canceled.
- Role or access: what the user will receive after acceptance.
- Expires: when the invite stops working.
- Invited by: which administrator created it.
- Created: when it was issued.

Invites are useful because they preserve intent before the person signs up.

## Invite Detail Fields

Email decides who can accept the invite when recipient matching is enforced.

Tenant decides where the invite is valid.

Role or access decides what default access is granted after registration.

Registration flow decides what onboarding steps run.

Expiration limits how long the invite can be used.

Status tells whether the invite can still be accepted.

Accepted by links the invite to the user who completed it.

Reason or note helps administrators understand why the invite was created.

## Invite Actions

Create invite sends or creates a new onboarding path.

Resend invite sends the invitation again without changing who it is for.

Revoke invite makes the invite unusable before expiration.

Cancel invite marks it intentionally withdrawn.

View public invite state lets the hosted identity UI show safe invite context before registration.

Accept invite happens in the hosted identity UI, not the admin console.

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
