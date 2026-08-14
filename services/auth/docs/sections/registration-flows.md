# Registration Flows

Registration flows decide how new users enter a tenant. They control whether signup is open, invite-only, provider-driven, or blocked until an administrator takes action.

## Where To Find It

In the console, open Registration flows for the tenant.

You should see:

| Area | What It Controls |
|---|---|
| Flow list | Existing onboarding paths for the tenant. |
| Flow status | Whether a flow is draft, active, disabled, or archived. |
| Signup type | Whether signup is open, invite-based, provider-driven, admin-created, or disabled. |
| Allowed clients | Which applications can use the flow. |
| Allowed providers | Which identity providers can create or activate users through the flow. |
| Invite behavior | Whether an invite is required and how invite acceptance works. |
| Verification requirements | Whether email or phone must be proven. |
| Profile completion requirements | Whether profile fields must be completed. |
| Default role or access behavior | Which conservative initial access a new user receives. |
| Tenant membership behavior | Whether registration can create administrators; this should normally be disabled for public signup. |

Users experience these settings in the hosted identity UI during signup, invite acceptance, and first login.

## Flow List

The flow list shows which onboarding paths exist.

Common columns:

| Column | What It Means |
|---|---|
| Name | Administrator-facing flow label. |
| Type | Open, invite-based, provider-driven, admin-created, or disabled. |
| Status | Draft, active, disabled, or archived. |
| Clients | Applications allowed to use the flow. |
| Providers | Providers allowed to create or activate users through the flow. |
| Requires verification | Whether email or phone must be proven. |
| Requires profile | Whether the user must complete profile fields. |
| Updated | When the flow last changed. |

Only active flows should affect user-facing registration.

## Flow Detail Fields

| Field | What It Controls |
|---|---|
| Name | How administrators recognize the flow. |
| Type | The basic onboarding model. |
| Status | Whether the flow can be used. |
| Client scope | Which applications can use the flow. |
| Provider scope | Which providers can create users through the flow. |
| Invite requirement | Whether a valid invite is needed. |
| Verification requirement | Whether email or phone must be verified. |
| Profile requirement | Whether users must complete profile fields. |
| Default access | Conservative initial roles or permissions. |
| Tenant membership | Whether registration can create tenant administrators. This should normally be disabled for public signup. |

## Flow Types

| Flow Type | What It Does | When To Use It |
|---|---|---|
| Open registration | Lets users create accounts without an invite. | Public products where abuse controls, verification, and safe default roles are ready. |
| Invite-based registration | Requires a valid invite. | Private tenants, B2B onboarding, administrator-approved access, and role pre-assignment. |
| Provider-driven registration | Lets a trusted identity provider create users during login. | Enterprise SSO or controlled domain-based onboarding. |
| Admin-created onboarding | Starts from a user created by an administrator. | Migration, bootstrap, or support-led account creation. |
| Disabled registration | Blocks new signup while still allowing existing users to sign in if policy allows it. | Tenants that are closed to new users. |

## How Users Experience Registration

1. The user opens the hosted identity UI from an application or invite.
2. Auth resolves tenant and client context.
3. Auth checks the active registration flow.
4. The UI shows the allowed registration method.
5. The user proves required email, phone, invite, or provider context.
6. The user completes required profile fields.
7. Auth creates or activates the user.
8. Auth assigns conservative default access where configured.
9. Auth continues to login, MFA, consent, or the application redirect.

## Default Access

Default access should be conservative. Registration should not silently create tenant administrators unless the flow is explicitly for administrator onboarding.

Use default roles for low-risk application access. Use member invites for tenant administration.

## Verification And Profile Completion

Email verification proves the user controls an email address. Use it before trusting the email for recovery, magic links, password reset, or invite ownership.

Phone verification proves control of a phone number. Use it when SMS login, SMS MFA, or phone recovery depends on that number.

Profile completion gathers display data such as name, avatar, locale, timezone, or product fields. It should not control authorization.

## Permissions And Security

Registration-flow management requires tenant configuration permissions.

Sensitive changes include:

| Sensitive Change | Risk |
|---|---|
| Enabling public registration | Opens account creation to a wider audience. |
| Changing invite requirements | Can allow users to join without administrator intent. |
| Enabling provider-driven user creation | Lets upstream providers create local users. |
| Changing default roles | Can grant too much access to new users. |
| Allowing registration to create tenant members | Can create administrators through onboarding. |
| Disabling required verification | Reduces proof of email or phone ownership. |
| Connecting a flow to a production client | Immediately changes real user onboarding. |

These changes should be audited and may require step-up MFA.

## Common Workflow

1. Open Registration flows.
2. Create or select a flow.
3. Choose the flow type.
4. Set status to draft while configuring.
5. Choose allowed clients.
6. Choose allowed providers.
7. Configure invite, verification, and profile requirements.
8. Configure conservative default access.
9. Activate the flow.
10. Test signup from the hosted identity UI.
11. Review users, invites, events, and audit records.

## Troubleshooting

If signup is not shown, check tenant status, client status, flow status, client scope, and whether registration is disabled.

If invite signup fails, check invite status, expiration, tenant match, recipient email, and flow type.

If provider login creates unexpected users, check provider-driven registration, JIT provisioning, domain routing, and default access.

If new users receive too much access, check default roles and whether tenant membership is being granted by mistake.
