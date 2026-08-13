# Registration Flows

Registration flows decide how new users enter a tenant. They control whether signup is open, invite-only, provider-driven, or blocked until an administrator takes action.

## Where To Find It

In the console, open Registration flows for the tenant.

You should see:

- Flow list.
- Flow status.
- Signup type.
- Allowed clients.
- Allowed providers.
- Invite behavior.
- Verification requirements.
- Profile completion requirements.
- Default role or access behavior.
- Tenant membership behavior.

Users experience these settings in the hosted identity UI during signup, invite acceptance, and first login.

## Flow List

The flow list shows which onboarding paths exist.

Common columns:

- Name: administrator-facing flow label.
- Type: open, invite-based, provider-driven, admin-created, or disabled.
- Status: draft, active, disabled, or archived.
- Clients: applications allowed to use the flow.
- Providers: providers allowed to create or activate users through the flow.
- Requires verification: whether email or phone must be proven.
- Requires profile: whether the user must complete profile fields.
- Updated: when the flow last changed.

Only active flows should affect user-facing registration.

## Flow Detail Fields

Name helps administrators recognize the flow.

Type controls the basic onboarding model.

Status controls whether the flow can be used.

Client scope controls which applications can use the flow.

Provider scope controls which providers can create users through the flow.

Invite requirement controls whether a valid invite is needed.

Verification requirement controls whether email or phone must be verified.

Profile requirement controls whether users must complete profile fields.

Default access controls conservative initial roles or permissions.

Tenant membership controls whether registration can create tenant administrators. This should normally be disabled for public signup.

## Flow Types

Open registration lets users create accounts without an invite. Use it for public products only when abuse controls, verification, and safe default roles are ready.

Invite-based registration requires a valid invite. Use it for private tenants, B2B onboarding, administrator-approved access, and role pre-assignment.

Provider-driven registration lets a trusted identity provider create users during login. Use it for enterprise SSO or controlled domain-based onboarding.

Admin-created onboarding starts from a user created by an administrator. Use it for migration, bootstrap, or support-led account creation.

Disabled registration blocks new signup while still allowing existing users to sign in if other policy allows it.

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

- Enabling public registration.
- Changing invite requirements.
- Enabling provider-driven user creation.
- Changing default roles.
- Allowing registration to create tenant members.
- Disabling required verification.
- Connecting a flow to a production client.

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
