# Users & Invites

Users are human accounts inside a tenant. Invites are controlled onboarding paths that let an administrator bring a person into a tenant with a known registration context.

Use this section when you are building admin screens, onboarding flows, support tools, account recovery, invite registration, or API integrations that need to understand user lifecycle.

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

## User Shape

A user record stores account state, not just display information.

Example user:

```json
{
  "user_id": "1d8f6cb5-920f-4c35-bd8a-cb4ce2a92598",
  "tenant_id": "6a6eb931-3f50-4f60-81c1-15b3be0c9f4a",
  "email": "mira@example.com",
  "username": "mira",
  "phone_number": "+15551234567",
  "status": "active",
  "is_email_verified": true,
  "is_phone_verified": false,
  "is_totp_enabled": true,
  "is_webauthn_enabled": false,
  "must_change_password": false,
  "failed_login_count": 0,
  "locked_until": null,
  "created_at": "2026-08-13T00:00:00Z",
  "updated_at": "2026-08-13T00:00:00Z"
}
```

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

Setting a password creates or replaces the local Auth credential. Password writes must hash the password server-side and must never return the plaintext password. Admin password set should usually set `must_change_password` so the user rotates it on next login.

Forcing password change marks the account so the next successful login must complete a password update before normal use. This is useful after admin-created passwords, suspected compromise, password policy migration, or support recovery.

Verifying email or phone marks that contact method as confirmed. Admin verification should be used carefully because it bypasses user proof. Prefer normal verification links or OTPs unless an operator has strong evidence.

Unlocking an account clears temporary lockout state such as `locked_until` and failed attempt counters. It should not disable MFA or reset the password unless an explicit recovery flow does that separately.

Assigning roles grants application or API permissions through Auth's IAM model. This is different from tenant membership. A user can have product roles without being a tenant admin.

Linking provider identities connects one Auth user to an upstream provider subject. For example, the same user can sign in with local password and GitHub. Account linking must protect against accidental account takeover when email addresses match.

Inspecting devices, sessions, consents, and profiles helps support account review. Admin screens should clearly separate read-only inspection from destructive actions such as revoking sessions or deleting devices.

Revoking sessions signs the user out from one or more browser sessions. Use it after disabling an account, rotating credentials after compromise, or responding to a user support request.

Starting erasure creates a controlled account anonymization workflow. Erasure should not be a simple row delete because Auth needs to preserve audit trail, security traceability, and referential integrity.

## Creating A User

Use direct user creation when an operator or provisioning system needs to create an account without a human invite acceptance step. This is common for bootstrap admins, directory sync, or controlled migrations.

Representative management API pattern:

```bash
curl -fsS -X POST https://console-api.auth.example.com/api/v1/users \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "tenant_id": "6a6eb931-3f50-4f60-81c1-15b3be0c9f4a",
    "email": "mira@example.com",
    "username": "mira",
    "status": "pending",
    "send_verification_email": true
  }'
```

Use your generated OpenAPI reference for the exact fields supported by your deployed version.

Developer behavior:

- Validate email and username uniqueness inside the tenant.
- Normalize email for comparison without losing the original display value if your product cares about casing.
- Do not create a tenant member automatically unless the flow is explicitly tenant administration onboarding.
- Emit an audit event for admin-created users.

## User Detail Response

A user detail response should help an administrator understand the account without exposing secret material.

Example response shape:

```json
{
  "user": {
    "user_id": "1d8f6cb5-920f-4c35-bd8a-cb4ce2a92598",
    "tenant_id": "6a6eb931-3f50-4f60-81c1-15b3be0c9f4a",
    "email": "mira@example.com",
    "username": "mira",
    "status": "active",
    "is_email_verified": true,
    "is_phone_verified": false,
    "must_change_password": false
  },
  "security": {
    "mfa_enabled": true,
    "totp_enabled": true,
    "webauthn_enabled": false,
    "locked_until": null,
    "failed_login_count": 0
  },
  "counts": {
    "sessions": 3,
    "trusted_devices": 1,
    "linked_identities": 2,
    "roles": 4
  }
}
```

Do not include password hashes, backup codes, MFA seeds, refresh tokens, access tokens, OAuth authorization codes, provider refresh tokens, or reset links.

## Password Administration

Password administration is sensitive because it can directly change account access.

Admin password set should be used for support recovery, migration, bootstrap, or emergency remediation. It should not be the normal way users change passwords. Normal users should change passwords from the hosted identity UI after authenticating.

Example password set pattern:

```bash
curl -fsS -X POST https://console-api.auth.example.com/api/v1/users/1d8f6cb5-920f-4c35-bd8a-cb4ce2a92598/set-password \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "password": "Use-A-Strong-Unique-Password-1!",
    "must_change_password": true,
    "revoke_existing_sessions": true,
    "reason": "Support-assisted credential recovery"
  }'
```

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

Example admin verification pattern:

```bash
curl -fsS -X POST https://console-api.auth.example.com/api/v1/users/1d8f6cb5-920f-4c35-bd8a-cb4ce2a92598/verify-email \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "reason": "Verified during enterprise migration"
  }'
```

Developer behavior:

- Changing an email address should usually set `is_email_verified` back to false.
- Changing a phone number should usually set `is_phone_verified` back to false.
- Verification links and OTPs must expire.
- Verification responses should not reveal whether another account owns the email or phone.

## Lockout And Unlock

Lockout protects accounts from repeated failed login attempts and other suspicious behavior. Auth may set `locked_until`, increment failed counters, or require additional verification before the user can continue.

Unlocking clears temporary lockout state. It should not reset the password, disable MFA, or mark the account verified unless the admin explicitly performs those actions.

Example unlock pattern:

```bash
curl -fsS -X POST https://console-api.auth.example.com/api/v1/users/1d8f6cb5-920f-4c35-bd8a-cb4ce2a92598/unlock \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "reason": "User passed support verification"
  }'
```

Developer behavior:

- Audit admin unlocks.
- Preserve enough security-event history to investigate repeated lockouts.
- Do not reveal lockout details on public login responses beyond what is safe for users.

## Roles And Permissions

Roles assigned to users control product and API authorization. Tenant member roles control tenant administration. Keep them separate.

Example role assignment pattern:

```bash
curl -fsS -X POST https://console-api.auth.example.com/api/v1/users/1d8f6cb5-920f-4c35-bd8a-cb4ce2a92598/roles \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "role_id": "project-admin",
    "reason": "Grant project administration access"
  }'
```

Developer behavior:

- Check that the role belongs to the same tenant.
- Audit role assignment and removal.
- Invalidate or refresh authorization caches after role changes.
- Do not use tenant member role as a shortcut for product permissions.

## Provider Identities

Provider identities let one Auth user sign in through more than one provider. For example, a user may have local password login plus Google Workspace and GitHub identities.

Example linked identity:

```json
{
  "identity_id": "9b99b5dd-fc40-47de-9c3f-305cb989cf7c",
  "user_id": "1d8f6cb5-920f-4c35-bd8a-cb4ce2a92598",
  "provider": "github",
  "sub": "98453412",
  "metadata": {
    "email": "mira@example.com",
    "email_verified": true,
    "name": "Mira Reyes"
  }
}
```

Developer behavior:

- Treat `(tenant_id, provider_id, sub)` as the stable upstream identity key.
- Do not silently merge users just because emails match.
- Use account-link confirmation when a provider email matches an existing user.
- Do not unlink the built-in local identity if that would leave the account without a safe anchor.
- Never return upstream access tokens or refresh tokens to admin list views.

## Sessions

Sessions represent browser continuity. A user may have several sessions across browsers, devices, and locations.

Admin session review helps support and security teams answer where an account is currently signed in. Session revocation helps respond to lost devices, suspected compromise, account disablement, or password reset.

Example session summary:

```json
{
  "session_id": "sid_01J4M9TVV5SMH5G0WY9B8N2K6C",
  "user_id": "1d8f6cb5-920f-4c35-bd8a-cb4ce2a92598",
  "client_id": "console",
  "created_at": "2026-08-13T00:00:00Z",
  "last_seen_at": "2026-08-13T01:15:00Z",
  "ip_address": "203.0.113.10",
  "user_agent": "Mozilla/5.0 ...",
  "current": false
}
```

Example revoke pattern:

```bash
curl -fsS -X DELETE https://console-api.auth.example.com/api/v1/users/1d8f6cb5-920f-4c35-bd8a-cb4ce2a92598/sessions/sid_01J4M9TVV5SMH5G0WY9B8N2K6C \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

Developer behavior:

- Let users revoke their own sessions from the hosted identity UI.
- Let admins revoke sessions from the console when they have permission.
- Revoke sessions when disabling an account if policy requires immediate cutoff.
- Do not expose session cookies, refresh tokens, or access tokens in session list responses.

## Devices

Devices represent remembered or trusted browser/device state. They can support security notifications, remembered MFA, trusted-device lists, or account review.

A device record is not proof that a person owns a physical device forever. Treat it as a remembered browser/device signal that can change, expire, or be revoked.

Developer behavior:

- Show device name, browser, approximate location, first seen, and last seen when available.
- Let users remove trusted devices from self-service.
- Let admins inspect trusted devices when they have permission.
- Avoid storing or displaying unnecessarily precise location data.

## Consents

Consent records capture what a user approved for an OAuth client. They are useful when a client asks for scopes such as profile, email, offline access, or application-specific permissions.

Developer behavior:

- Store which client, scopes, user, tenant, and time were approved.
- Let users review and revoke consent where supported.
- Re-check consent when a client requests new scopes.
- Do not treat consent as a substitute for authorization policy.

## Profiles

Profiles store display and personal information. Use profiles for names, display names, avatars, profile URLs, birthdate, gender, and user-managed metadata.

Profiles should not drive authorization decisions. Use users, identities, tenant members, IAM roles, permissions, and policies for access control.

Example profile:

```json
{
  "profile_id": "prof_01J4MA2TP1RB8VBD3E78J41NYH",
  "user_id": "1d8f6cb5-920f-4c35-bd8a-cb4ce2a92598",
  "display_name": "Mira Reyes",
  "first_name": "Mira",
  "last_name": "Reyes",
  "profile_url": "https://cdn.example.com/profiles/mira.png",
  "is_default": true
}
```

## Invitations

Invites are controlled onboarding paths into a tenant. They let an administrator send or create a registration path with known context such as email, role assignments, registration flow, expiration, and invite status.

Use invites when:

- Registration should be invite-only.
- A tenant admin wants to pre-assign roles.
- A new user should land in a specific registration flow.
- The organization wants an auditable onboarding action.
- The user should prove email ownership before the account becomes active.

An invite is not a password. Treat invite tokens as short-lived bearer secrets. Anyone with a valid invite link may be able to continue the invite flow, so links must expire and should be single-use where possible.

## Invite Shape

Example invite:

```json
{
  "invite_id": "inv_01J4MA8QXFMQ65HBQ1W4FX6S5J",
  "tenant_id": "6a6eb931-3f50-4f60-81c1-15b3be0c9f4a",
  "email": "new.user@example.com",
  "status": "pending",
  "registration_flow_id": "flow_01J4MA9J8DM7V2YW3G8D7VAQ91",
  "role_ids": [
    "project-reader"
  ],
  "expires_at": "2026-08-16T00:00:00Z",
  "created_by": "1d8f6cb5-920f-4c35-bd8a-cb4ce2a92598",
  "created_at": "2026-08-13T00:00:00Z",
  "accepted_at": null
}
```

Common invite statuses:

- `pending`: the invite exists and can still be accepted.
- `accepted`: the invite was used to register or connect a user.
- `expired`: the invite is past its allowed lifetime.
- `revoked`: an administrator canceled the invite.

The default invite lifetime is controlled by `INVITE_TTL_HOURS` when configured. The docs use 72 hours as the default described in environment configuration.

## Creating Invites

Create an invite when a tenant admin wants to onboard a person intentionally.

Representative management API pattern:

```bash
curl -fsS -X POST https://console-api.auth.example.com/api/v1/invites \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "tenant_id": "6a6eb931-3f50-4f60-81c1-15b3be0c9f4a",
    "email": "new.user@example.com",
    "registration_flow_id": "flow_01J4MA9J8DM7V2YW3G8D7VAQ91",
    "role_ids": [
      "project-reader"
    ],
    "send_email": true
  }'
```

Developer behavior:

- Validate that the invite email belongs to the intended tenant context.
- Validate that pre-assigned roles belong to the same tenant.
- Store only a hashed invite token if the implementation uses bearer tokens.
- Send invite email through tenant messaging settings.
- Audit who created the invite and which roles were pre-assigned.

## Public Invite Lookup

Invite registration screens need to read safe invite context before the user signs in. Public invite lookup should reveal only what is needed to render the invite acceptance page.

Example public lookup pattern:

```bash
curl -fsS "https://identity.auth.example.com/api/v1/public/invites/inv_01J4MA8QXFMQ65HBQ1W4FX6S5J"
```

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

Example invite registration pattern:

```bash
curl -fsS -X POST https://identity.auth.example.com/api/v1/register/invite \
  -H 'Content-Type: application/json' \
  -d '{
    "invite_token": "signed-invite-token-from-email",
    "email": "new.user@example.com",
    "password": "Use-A-Strong-Unique-Password-1!",
    "profile": {
      "display_name": "New User"
    }
  }'
```

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

Example admin erasure request pattern:

```bash
curl -fsS -X POST https://console-api.auth.example.com/api/v1/users/1d8f6cb5-920f-4c35-bd8a-cb4ce2a92598/erasure-requests \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "reason": "User requested deletion through support",
    "process_after": "2026-08-20T00:00:00Z"
  }'
```

Developer behavior:

- Make erasure explicit and auditable.
- Support a delay or due date when policy requires a waiting period.
- Revoke active sessions when erasure begins or completes.
- Anonymize personal data instead of breaking historical audit records.
- Do not use erasure as a substitute for normal account disablement.

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

1. Confirm the tenant is `active`.
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

1. Confirm the tenant is `active`.
2. Create the user in `pending` or `active` status according to policy.
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

## Troubleshooting

If a user cannot sign in, check tenant status, user status, email verification, lockout state, MFA requirements, provider status, client configuration, IP restrictions, rate limits, and whether existing sessions were revoked.

If an invite link does not work, check invite status, expiration, token signing key, tenant status, registration flow status, allowed provider configuration, and whether the invite was already accepted or revoked.

If a user receives the wrong tenant branding during invite registration, check the invite URL host, tenant slug, public tenant lookup, and branding settings.

If a role from an invite is not applied, check that the role belongs to the same tenant, the registration flow allows it, and the invite acceptance transaction completed.

If an admin cannot reset a password or revoke sessions, check their tenant member role, IAM permissions, step-up requirements, and management-client session.
