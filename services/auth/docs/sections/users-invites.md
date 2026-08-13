# Users & Invites

Users are human accounts inside a tenant. Invites are controlled onboarding paths that let an administrator bring a person into a tenant with a known registration context.

Use this section when you are building admin screens, onboarding flows, support tools, account recovery, invite registration, or API integrations that need to understand user lifecycle. Exact endpoints, request bodies, response schemas, and generated-client examples belong in the API reference.

## Mental Model

Auth separates user lifecycle into a few related objects:

- User: the account Auth owns inside one tenant.
- Profile: display and personal information for the user.
- User identity: the link between a user and a login provider subject.
- Tenant member: the user's tenant-level administration relationship.
- IAM roles: product or API permissions assigned to the user.
- Session: browser continuity for an authenticated user.
- Device: remembered or trusted browser/device state.
- Consent: a record of user approval for OAuth client access.
- Invite: a controlled registration link or code for onboarding.
- Erasure request: a lifecycle request to anonymize account data.

The user is the center of the account. Profiles, identities, sessions, devices, consents, and roles attach to that user. Invites create or connect users through a controlled registration path.

## User Fields And Options

A user record stores account state, not just display information.

Common user fields and meanings:

- User ID: stable tenant-local account identifier.
- Tenant ID: the tenant boundary that owns the user.
- Email: contact and login identifier when email login or recovery is enabled.
- Username: optional login or display identifier depending on tenant policy.
- Phone number: contact method for SMS login, phone verification, or SMS MFA.
- Status: lifecycle state such as pending, active, disabled, locked, or erased.
- Email verification flag: whether the user has proven control of the email address.
- Phone verification flag: whether the user has proven control of the phone number.
- MFA flags: summary of enrolled factors such as TOTP, WebAuthn, SMS, or email OTP.
- Password lifecycle flags: whether a password exists, was reset by admin, or must be changed.
- Lockout fields: failed login counters and temporary lockout expiry.
- Metadata: tenant-local operator or application context.
- Timestamps: creation and update history for support and audit review.

Important rules:

- Users are tenant-scoped.
- Email and username uniqueness are tenant-local.
- A user can have one local Auth identity and multiple linked external identities.
- A user can have MFA factors, sessions, trusted devices, consents, profiles, and roles.
- A user can be a tenant member, but user and member are different records.

The same email can exist as separate users in different tenants. Do not use email alone as a global identifier.

## User Status

User status determines whether the account can participate in runtime flows.

Common statuses:

- `pending`: the user exists but has not completed the required onboarding or verification flow.
- `active`: the user can sign in when tenant, client, provider, security, and policy checks pass.
- `disabled`: the user is blocked by an administrator or lifecycle process.
- `locked`: the user is temporarily blocked after lockout or risk controls.
- `deleted` or `erased`: the user has gone through deletion or anonymization, depending on implementation.

Use `pending` for newly created users that still need invite acceptance, email verification, profile completion, or first password setup.

Use `active` only when the account is allowed to authenticate. Active does not bypass MFA, tenant status, client configuration, provider status, rate limits, or IP restrictions.

Use `disabled` when an administrator intentionally blocks access. Disabled users should not receive new sessions or tokens.

Use `locked` for temporary security lockout, such as too many failed login attempts. Lockout can expire automatically or be cleared by an administrator.

Use `deleted` or `erased` after account deletion or anonymization workflows. Erasure should preserve audit traceability without keeping personal data that should be removed.

## User Administration

Administrators manage users from the console and management API. These flows are not the same as user self-service.

Common user administration actions:

- List users.
- Create users.
- View user detail.
- Edit users.
- Set user status.
- Set password.
- Force password change.
- Verify email or phone.
- Unlock account.
- Assign and remove roles.
- Link and unlink provider identities.
- Inspect devices, consents, sessions, and profiles.
- Revoke sessions.
- Start or administer erasure workflows.

Each action should have a clear security boundary. Admin flows should require management permissions, should audit sensitive changes, and should avoid returning secrets.

## What User Operations Do

Listing users helps operators find accounts in a tenant. A useful list includes user ID, email, username, status, verification state, MFA flags, creation time, and update time. It should not include password hashes, MFA secrets, recovery codes, refresh tokens, access tokens, or provider tokens.

Creating a user makes a tenant-local account. Admin-created users can be created as active, pending, email-verified, or passwordless depending on policy. If the user needs to complete registration, prefer an invite instead of creating a fully active account silently.

Viewing user detail powers support and admin screens. Detail can include account status, verification flags, MFA summary, profiles, linked identities, roles, consents, devices, and sessions. Sensitive child objects should be fetched through permission-checked routes and should mask secrets.

Editing a user changes account fields such as email, username, phone number, metadata, or status. Some edits should trigger downstream effects. For example, changing email may require re-verification, changing phone may require phone verification, and disabling a user should usually revoke sessions.

Setting user status controls whether the user can authenticate. Disabling a user should block new login, token refresh, and account self-service actions. Unlocking should clear lockout state without silently weakening password or MFA policy.

Setting a password creates or replaces the local Auth credential. Password writes must hash the password server-side and must never return the plaintext password. Admin password set should usually set a must-change-password flag so the user rotates it on next login.

Forcing password change marks the account so the next successful login must complete a password update before normal use. This is useful after admin-created passwords, suspected compromise, password policy migration, or support recovery.

Verifying email or phone marks that contact method as confirmed. Admin verification should be used carefully because it bypasses user proof. Prefer normal verification links or OTPs unless an operator has strong evidence.

Unlocking an account clears temporary lockout state and failed attempt counters. It should not disable MFA or reset the password unless an explicit recovery flow does that separately.

Assigning roles grants application or API permissions through Auth's IAM model. This is different from tenant membership. A user can have product roles without being a tenant admin.

Linking provider identities connects one Auth user to an upstream provider subject. For example, the same user can sign in with local password and GitHub. Account linking must protect against accidental account takeover when email addresses match.

Inspecting devices, sessions, consents, and profiles helps support account review. Admin screens should clearly separate read-only inspection from destructive actions such as revoking sessions or deleting devices.

Revoking sessions signs the user out from one or more browser sessions. Use it after disabling an account, rotating credentials after compromise, or responding to a user support request.

Starting erasure creates a controlled account anonymization workflow. Erasure should not be a simple row delete because Auth needs to preserve audit trail, security traceability, and referential integrity.

## Creating A User

Use direct user creation when an operator or provisioning system needs to create an account without a human invite acceptance step. This is common for bootstrap admins, directory sync, or controlled migrations.

Important creation options:

- Tenant context: determines which tenant owns the user.
- Email and username: identify the account inside that tenant.
- Initial status: controls whether the account starts pending, active, or disabled.
- Verification behavior: controls whether Auth sends verification email or marks a contact method as already verified.
- Password behavior: controls whether the user starts passwordless, receives an admin-set password, or must set a password later.
- Profile behavior: controls whether a default profile is created during onboarding or completed after sign-in.
- Role behavior: controls whether roles are assigned immediately or by invite/registration flow.

Developer behavior:

- Validate email and username uniqueness inside the tenant.
- Normalize email for comparison without losing the original display value if your product cares about casing.
- Do not create a tenant member automatically unless the flow is explicitly tenant administration onboarding.
- Emit an audit event for admin-created users.

## User Detail

A user detail screen should help an administrator understand the account without exposing secret material.

Useful detail areas:

- Account basics: user ID, tenant, email, username, phone, status, and timestamps.
- Verification state: email and phone verification.
- Security state: MFA summary, lockout state, and password lifecycle state.
- Authorization state: assigned roles and tenant membership, shown separately.
- Linked identities: configured provider links without upstream tokens.
- Sessions and devices: current account access footprint.
- Consents: OAuth clients the user approved.
- Profiles: display and personal details.

Do not include password hashes, backup codes, MFA seeds, refresh tokens, access tokens, OAuth authorization codes, provider refresh tokens, or reset links.

## Password Administration

Password administration is sensitive because it can directly change account access.

Admin password set should be used for support recovery, migration, bootstrap, or emergency remediation. It should not be the normal way users change passwords. Normal users should change passwords from the hosted identity UI after authenticating.

Important password options:

- New password: accepted only on write and never returned.
- Must change password: forces the user to rotate the admin-set password at next login.
- Revoke existing sessions: signs the user out after a credential recovery action.
- Reason: operator explanation for audit logs.

Developer behavior:

- Hash passwords server-side with the configured password hashing policy.
- Never log plaintext passwords.
- Never return plaintext passwords.
- Consider revoking existing sessions after admin password reset.
- Require step-up MFA for administrators before password reset when policy requires it.
- Audit who changed the password and why, without storing the password.

## Email And Phone Verification

Verification flags tell Auth whether a contact method has been proven.

Email verification is used for account recovery, password reset, magic link, invite acceptance, and general trust decisions. Phone verification is used for SMS login, SMS MFA, and account recovery flows that depend on phone ownership.

Admin verification should be rare. A safer default is to send a verification email or OTP and let the user prove control.

Important verification options:

- Verification method: email link, email OTP, SMS OTP, or admin exception.
- Expiration: how long the verification challenge remains valid.
- Resend behavior: how often a new challenge can be sent.
- Contact reset behavior: whether changing email or phone clears verification state.
- Reason: required for admin exception flows.

Developer behavior:

- Changing an email address should usually set email verification back to false.
- Changing a phone number should usually set phone verification back to false.
- Verification links and OTPs must expire.
- Verification responses should not reveal whether another account owns the email or phone.

## Lockout And Unlock

Lockout protects accounts from repeated failed login attempts and other suspicious behavior. Auth may set a temporary lockout, increment failed counters, or require additional verification before the user can continue.

Unlocking clears temporary lockout state. It should not reset the password, disable MFA, or mark the account verified unless the admin explicitly performs those actions.

Important lockout options:

- Failed attempt threshold: how many failures trigger lockout.
- Lockout duration: how long the user remains blocked.
- Reset behavior: when failed counters return to zero.
- Admin unlock reason: why an operator cleared lockout.
- Notification behavior: whether the user receives a security notice.

Developer behavior:

- Audit admin unlocks.
- Preserve enough security-event history to investigate repeated lockouts.
- Do not reveal lockout details on public login responses beyond what is safe for users.

## Roles And Permissions

Roles assigned to users control product and API authorization. Tenant member roles control tenant administration. Keep them separate.

Important role assignment options:

- Role ID or name: identifies the tenant-local role to assign.
- Scope or resource context: optional boundary if your role model supports scoped grants.
- Assignment source: admin action, registration flow, invite, migration, or control plane.
- Reason: operator explanation for audit history.

Developer behavior:

- Check that the role belongs to the same tenant.
- Audit role assignment and removal.
- Invalidate or refresh authorization caches after role changes.
- Do not use tenant member role as a shortcut for product permissions.

## Provider Identities

Provider identities let one Auth user sign in through more than one provider. For example, a user may have local password login plus Google Workspace and GitHub identities.

Important linked-identity fields and meanings:

- Provider: which configured provider proved the identity.
- Subject: the provider's stable user identifier.
- Tenant: the tenant boundary for the link.
- User: the Auth user that owns the link.
- Metadata: normalized upstream claims such as email, name, avatar, locale, and verification state.
- Provisioning source: whether the identity came from JIT provisioning, admin linking, or user self-service.

Developer behavior:

- Treat tenant, provider, and subject as the stable upstream identity key.
- Do not silently merge users just because emails match.
- Use account-link confirmation when a provider email matches an existing user.
- Do not unlink the built-in local identity if that would leave the account without a safe anchor.
- Never return upstream access tokens or refresh tokens to admin list views.

## Sessions

Sessions represent browser continuity. A user may have several sessions across browsers, devices, and locations.

Admin session review helps support and security teams answer where an account is currently signed in. Session revocation helps respond to lost devices, suspected compromise, account disablement, or password reset.

Useful session fields:

- Session ID: stable identifier for review and revocation.
- Client: which application created the session.
- Created time: when the session began.
- Last seen time: when Auth last observed activity.
- IP address and user agent: useful for account security review.
- Current flag: whether the listed session is the caller's current session.

Developer behavior:

- Let users revoke their own sessions from the hosted identity UI.
- Let admins revoke sessions from the console when they have permission.
- Revoke sessions when disabling an account if policy requires immediate cutoff.
- Do not expose session cookies, refresh tokens, or access tokens in session list responses.

## Devices

Devices represent remembered or trusted browser/device state. They can support security notifications, remembered MFA, trusted-device lists, or account review.

A device record is not proof that a person owns a physical device forever. Treat it as a remembered browser/device signal that can change, expire, or be revoked.

Useful device fields:

- Device ID: stable identifier for review and removal.
- Display name: user-facing name when available.
- Browser or platform: user agent-derived context.
- First seen and last seen: lifecycle and security review data.
- Trust status: whether the device can satisfy remembered-device behavior.
- Approximate location: optional and should be coarse.

Developer behavior:

- Show device name, browser, approximate location, first seen, and last seen when available.
- Let users remove trusted devices from self-service.
- Let admins inspect trusted devices when they have permission.
- Avoid storing or displaying unnecessarily precise location data.

## Consents

Consent records capture what a user approved for an OAuth client. They are useful when a client asks for scopes such as profile, email, offline access, or application-specific permissions.

Useful consent fields:

- Client: the application the user approved.
- User and tenant: who granted the consent and where.
- Scopes: what the client requested and the user approved.
- Granted time: when approval occurred.
- Revoked time: when the user or admin withdrew consent.

Developer behavior:

- Store which client, scopes, user, tenant, and time were approved.
- Let users review and revoke consent where supported.
- Re-check consent when a client requests new scopes.
- Do not treat consent as a substitute for authorization policy.

## Profiles

Profiles store display and personal information. Use profiles for names, display names, avatars, profile URLs, birthdate, gender, and user-managed metadata.

Profiles should not drive authorization decisions. Use users, identities, tenant members, IAM roles, permissions, and policies for access control.

Useful profile fields:

- Profile ID: stable profile identifier.
- User ID: the account that owns the profile.
- Display name: user-facing name.
- First and last name: structured personal name fields.
- Profile image or URL: avatar source.
- Default flag: which profile is used by default.
- Metadata: user or tenant-specific display context.

## Invitations

Invites are controlled onboarding paths into a tenant. They let an administrator send or create a registration path with known context such as email, role assignments, registration flow, expiration, and invite status.

Use invites when:

- Registration should be invite-only.
- A tenant admin wants to pre-assign roles.
- A new user should land in a specific registration flow.
- The organization wants an auditable onboarding action.
- The user should prove email ownership before the account becomes active.

An invite is not a password. Treat invite tokens as short-lived bearer secrets. Anyone with a valid invite link may be able to continue the invite flow, so links must expire and should be single-use where possible.

## Invite Fields And Status

Common invite fields and meanings:

- Invite ID: stable identifier used by management and support workflows.
- Tenant ID: the tenant that owns the invite.
- Email: the intended recipient.
- Status: pending, accepted, expired, or revoked.
- Registration flow: the onboarding rules applied when the invite is accepted.
- Pre-assigned roles: roles applied after successful acceptance.
- Expiration time: when the invite stops being valid.
- Creator: the admin or service that created the invite.
- Accepted time: when the invite was consumed.

Common invite statuses:

- `pending`: the invite exists and can still be accepted.
- `accepted`: the invite was used to register or connect a user.
- `expired`: the invite is past its allowed lifetime.
- `revoked`: an administrator canceled the invite.

The default invite lifetime is controlled by `INVITE_TTL_HOURS` when configured. The docs use 72 hours as the default described in environment configuration.

## Creating Invites

Create an invite when a tenant admin wants to onboard a person intentionally.

Important invite creation options:

- Tenant context: which tenant owns the invite.
- Recipient email: who should receive the invite.
- Registration flow: which onboarding behavior applies.
- Pre-assigned roles: product or API roles granted after successful acceptance.
- Email delivery flag: whether Auth should send the invitation email.
- Expiration: how long the invite remains valid.
- Metadata or reason: operator context for audit and support.

Developer behavior:

- Validate that the invite email belongs to the intended tenant context.
- Validate that pre-assigned roles belong to the same tenant.
- Store only a hashed invite token if the implementation uses bearer tokens.
- Send invite email through tenant messaging settings.
- Audit who created the invite and which roles were pre-assigned.

## Public Invite Lookup

Invite registration screens need to read safe invite context before the user signs in. Public invite lookup should reveal only what is needed to render the invite acceptance page.

Safe public fields may include:

- Tenant display name.
- Invite email.
- Invite status.
- Expiration state.
- Registration flow display hints.
- Branding information.

Do not expose role IDs, internal metadata, creator IDs, audit records, raw invite tokens, SMTP details, or management-only tenant settings through public invite lookup.

## Invite Registration

Invite registration turns a pending invite into a user account or connects the invite to an existing user when policy allows it.

Typical invite registration flow:

1. The admin creates an invite.
2. Auth stores invite state and sends an email link.
3. The user opens the hosted identity invite-registration page.
4. The identity UI calls public invite lookup.
5. The user sets a password or signs in with an allowed provider.
6. Auth validates the invite token, tenant, registration flow, email, and expiration.
7. Auth creates or resolves the user.
8. Auth applies invite role assignments.
9. Auth marks the invite accepted.
10. Auth starts the normal login or post-registration flow.

Developer behavior:

- Validate the invite token server-side.
- Reject expired, revoked, or already accepted invites.
- Keep invite acceptance idempotent where possible so browser retries do not create duplicate users.
- Apply pre-assigned roles only after the user is created or safely resolved.
- Mark the invite accepted in the same logical transaction as registration when possible.
- Avoid leaking whether an email already has an account unless the flow intentionally supports existing-user acceptance.

## Invite Security

Invite links are sensitive because they can authorize onboarding. They should be protected like password reset and magic-link URLs.

Security expectations:

- Invite links must expire.
- Invite tokens should be unguessable and signed or stored as hashed tokens.
- Invite acceptance should be single-use unless a deliberate multi-use flow exists.
- Revoked invites must stop working immediately.
- Invite emails should use tenant branding and the correct tenant identity host.
- Invite responses should not expose internal role or policy details.

The `HMAC_SECRET_KEY` signs invite links and other short-lived URL state. Rotating it invalidates links signed by the previous key after deployment. Plan key rotation around outstanding invite, magic-link, and password-reset URLs.

## Admin-Created User Vs Invite

Use an admin-created user when:

- A migration imports existing accounts.
- A control plane provisions accounts.
- A bootstrap flow creates the first admin.
- The user should exist before they receive an email.

Use an invite when:

- A human should accept onboarding.
- The user should verify email ownership.
- Registration should assign pre-approved roles.
- The tenant wants an auditable invitation flow.
- The account should remain pending until the user acts.

Beginners often try to use direct user creation for every onboarding flow. Invites are safer for normal human onboarding because they combine identity proof, expiration, tenant context, and role assignment in one flow.

## Self-Service Split

Administrators manage users from the console. Users manage their own account from the hosted identity UI.

Admin-owned flows:

- Create users.
- Disable users.
- Reset passwords.
- Unlock accounts.
- Verify email or phone by exception.
- Assign roles.
- Review sessions and devices.
- Revoke user sessions.
- Start admin erasure workflows.
- Create and revoke invites.

User-owned flows:

- Sign in.
- Change password.
- Change email.
- Verify email.
- Change username.
- Manage profiles.
- Enroll or remove MFA factors.
- Manage passkeys and backup codes.
- Review and revoke sessions.
- Review trusted devices.
- Link or unlink external identities.
- Export account data.
- Request account deletion or erasure.

This split protects users and operators. The console is for administration. The hosted identity UI is for direct account ownership.

## Account Erasure

Erasure is the controlled anonymization path for user data. Auth supports self-service erasure requests from the identity app and admin-created erasure requests from the management API.

Erasure should process related account data such as identities, MFA factors, trusted devices, tokens, sessions, profiles, and related account records. It should preserve audit traceability without keeping personal details that should be removed.

Important erasure options:

- Request source: self-service user request or admin-created request.
- Reason: user or operator explanation.
- Process-after time: optional waiting period before anonymization.
- Session handling: whether active sessions are revoked immediately.
- Audit preservation: how the system keeps traceability while removing personal data.

Developer behavior:

- Make erasure explicit and auditable.
- Support a delay or due date when policy requires a waiting period.
- Revoke active sessions when erasure begins or completes.
- Anonymize personal data instead of breaking historical audit records.
- Do not use erasure as a substitute for normal account disablement.

## Permissions

User and invite operations should be protected by tenant-scoped management permissions.

Typical permission areas:

- User read: list and view user records.
- User create: create accounts.
- User update: edit account fields and status.
- User credential administration: set password or force password change.
- User verification administration: verify email or phone by exception.
- User unlock: clear lockout state.
- User role write: assign or remove roles.
- User identity administration: link or unlink provider identities.
- Session administration: inspect and revoke sessions.
- Device administration: inspect or remove trusted devices.
- Consent administration: inspect or revoke consents where supported.
- Erasure administration: create or manage erasure requests.
- Invite read: view invite records.
- Invite create: create and send invites.
- Invite revoke: cancel pending invites.

Sensitive actions such as password reset, MFA remediation, disabling users, erasure, role assignment, session revocation, and invite creation should require strong authorization and may require step-up MFA.

## Events And Audit

User and invite changes should produce useful audit and event records.

Audit records are for administrative traceability. Events are for integration and automation.

Examples of audit-worthy actions:

- Admin created a user.
- Admin disabled a user.
- Admin reset a password.
- Admin verified email by exception.
- Admin assigned or removed a role.
- Admin unlocked an account.
- Admin revoked sessions.
- Admin created, revoked, or resent an invite.
- User accepted an invite.
- User requested erasure.

Developer behavior:

- Include actor, tenant, action, target user or invite, result, timestamp, request ID, and reason when available.
- Do not put plaintext passwords, invite tokens, OTPs, MFA secrets, access tokens, refresh tokens, or provider tokens in audit logs or events.
- Emit events after the database change succeeds.
- Use retryable delivery for integration events and webhooks.

## Beginner Workflow

For normal invite-based onboarding:

1. Confirm the tenant is active.
2. Configure email delivery for the tenant or inherited system tenant.
3. Configure registration flows and allowed identity providers.
4. Create roles that new users may need.
5. Create an invite with the user's email and pre-approved roles.
6. Send the invite email.
7. User opens the invite link on the tenant identity host.
8. Hosted identity UI performs public invite lookup.
9. User completes registration.
10. Auth applies roles and marks the invite accepted.
11. User signs in normally.

For admin-created onboarding:

1. Confirm the tenant is active.
2. Create the user in pending or active status according to policy.
3. Set a temporary password only when necessary.
4. Force password change on first login.
5. Assign IAM roles separately from tenant membership.
6. Send verification or welcome email.
7. Revoke any accidental sessions if the account should not be usable yet.

## Developer Checklist

Before shipping user and invite integration, verify:

- User identifiers are tenant-scoped.
- Email and username uniqueness checks include tenant context.
- User list and detail responses never include secrets.
- Password writes are hashed server-side and never logged.
- Admin password resets are audited.
- Disabling a user blocks login and token refresh.
- Session revocation works for one session and all sessions.
- Role assignments are tenant-local.
- Invite tokens expire and cannot be guessed.
- Revoked invites stop working.
- Public invite lookup returns only safe display information.
- Invite acceptance applies roles only after validation succeeds.
- Email, magic-link, reset, and invite flows use the correct tenant host.
- Erasure workflows anonymize personal data while preserving audit traceability.
- API request and response details are documented in the API reference, not duplicated in this conceptual page.

## Troubleshooting

If a user cannot sign in, check tenant status, user status, email verification, lockout state, MFA requirements, provider status, client configuration, IP restrictions, rate limits, and whether existing sessions were revoked.

If an invite link does not work, check invite status, expiration, token signing key, tenant status, registration flow status, allowed provider configuration, and whether the invite was already accepted or revoked.

If a user receives the wrong tenant branding during invite registration, check the invite URL host, tenant slug, public tenant lookup, and branding settings.

If a role from an invite is not applied, check that the role belongs to the same tenant, the registration flow allows it, and the invite acceptance transaction completed.

If an admin cannot reset a password or revoke sessions, check their tenant member role, IAM permissions, step-up requirements, and management-client session.
