# Account Self-Service

Account self-service is the part of Auth where a signed-in user manages their own account. It belongs to the hosted identity UI and the public identity surface, not the internal administration console.

Use this section to understand what users can safely change for themselves, which options affect those changes, where step-up MFA is required, and what developers should protect when building account pages. Exact endpoints, request bodies, response schemas, and generated-client examples belong in the API reference.

## Mental Model

Account self-service is different from user administration.

- Self-service: the current signed-in user manages their own account.
- Administration: an operator manages another user's account through the console or management API.
- Recovery: the user regains access when they cannot complete normal login.
- Step-up: Auth asks for fresh proof before a sensitive account action.

The self-service surface should only act on the current user. A normal user should not be able to pass another user ID and modify someone else's email, profile, sessions, MFA factors, linked identities, consents, or erasure state.

Self-service can update sensitive data, so it still needs strong authorization. A valid session proves who the user is, but sensitive actions may also require fresh MFA, password confirmation, email verification, provider re-authentication, or an account recovery challenge.

## What Belongs In Self-Service

Self-service usually covers:

- Account identifiers such as email, username, and phone number.
- Password changes for users with a local Auth password.
- Email and phone verification.
- Profile details and profile pictures.
- MFA factor enrollment and removal.
- Backup-code management.
- Sessions and devices.
- Trusted devices.
- OAuth consent records.
- Linked external identities.
- Data export.
- Account deletion or erasure request.

These flows should feel like user-facing account settings. They should not expose tenant administration, role assignment, provider secrets, user search, audit administration, or privileged support actions.

## Hosted Account UI

The hosted account UI is the safest default place to build self-service. Applications can send users to Auth for account settings instead of implementing password, MFA, linked identity, and recovery screens themselves.

The hosted account UI can show:

- Profile settings.
- Security settings.
- Password settings.
- MFA factor settings.
- Session and device review.
- Connected accounts.
- Consent review.
- Data export and deletion controls.

This keeps credential handling and account security controls centralized in Auth. Downstream applications can still show a link to account settings, but they should avoid collecting Auth passwords, MFA secrets, backup codes, reset links, provider tokens, or other sensitive identity material.

## Account Context

Before allowing self-service, Auth should resolve:

- Tenant: the tenant that owns the current user.
- User: the authenticated account from the current session.
- Client: the application that initiated the session, when relevant.
- Session state: whether the session is valid, expired, revoked, or requires re-authentication.
- User status: whether the account is active, locked, disabled, pending, or erased.
- Tenant status: whether the tenant can serve identity traffic.
- Security policy: whether MFA, step-up, password confirmation, IP restrictions, or rate limits apply.
- Feature settings: which self-service actions the tenant allows.

Frontend visibility should follow this context, but backend enforcement must make the final decision. Hiding the "Delete account" button or "Change email" button is not enough.

## Account Security

Account security covers identifiers and credentials that affect how the user signs in and recovers access.

Common actions:

- Change email.
- Verify email change.
- Change username.
- Change password.
- Verify phone number.
- Delete account.

These actions are sensitive because they can affect login, recovery, notifications, audit attribution, and account ownership.

## Change Email

Changing email updates the address Auth uses for contact, recovery, magic links, password reset, or email-based login depending on tenant policy.

Use email change when:

- The user has a new contact address.
- The tenant allows users to maintain their own email.
- Email verification can prove the new address belongs to the user.
- The change does not violate tenant-local uniqueness rules.

Important options:

- Whether users can change email themselves.
- Whether old email confirmation is required.
- Whether new email verification is required before the change becomes active.
- Whether email login uses the new email immediately or after verification.
- Whether existing sessions are kept or revoked.
- Whether security notifications are sent to the old and new addresses.

Developer behavior:

- Require fresh authentication or step-up for email changes.
- Verify the new email before trusting it for recovery.
- Prevent duplicate emails inside the same tenant when tenant policy requires uniqueness.
- Avoid revealing whether an email belongs to another account.
- Audit the change without logging verification links or tokens.

## Verify Email Change

Email verification proves control of an address. In a safe email-change flow, the user requests a change, Auth sends a verification challenge, and the new email becomes trusted only after verification succeeds.

Important options:

- Verification challenge lifetime.
- Resend limits.
- Whether the old email must confirm the change.
- Whether the new email becomes primary immediately or only after verification.
- Whether the user must re-login after verification.

Developer behavior:

- Treat verification links and codes like bearer secrets.
- Do not log full verification URLs.
- Expire unused challenges.
- Rate-limit resend attempts.
- Show safe messages that do not reveal account existence.

## Change Username

Username changes update a tenant-local identifier or display handle. A username may be used for login, display, mentions, audit labels, or product-specific account discovery depending on configuration.

Use username changes only when the tenant intentionally supports mutable usernames. If usernames appear in public URLs, audit records, or integrations, changing them may have downstream effects.

Important options:

- Whether usernames are enabled.
- Whether users can change usernames themselves.
- Username uniqueness scope.
- Allowed characters and length.
- Reserved names.
- Cooldown period between changes.
- Whether username can be used for login.

Developer behavior:

- Validate usernames consistently.
- Prevent reserved or misleading names.
- Keep stable user IDs as the real account key.
- Do not use username as the only authorization identifier.
- Audit changes when usernames are visible in operational records.

## Change Password

Password change lets a user rotate their local Auth password while already signed in. This is different from password reset, which is a recovery flow for a user who may not be signed in.

Use password change when:

- The user has a local password identity.
- Password login is enabled for the tenant or client.
- The user can provide the current password or satisfy a step-up check.
- The new password satisfies the tenant password policy.

Important options:

- Whether password login is enabled.
- Whether current password confirmation is required.
- Whether MFA step-up is required.
- Password length and complexity policy.
- Password history rules.
- Whether existing sessions are revoked after password change.
- Whether security notification email is sent.

Developer behavior:

- Never return or log plaintext passwords.
- Hash passwords server-side.
- Require strong password validation at completion.
- Consider revoking other sessions after a password change.
- Do not let password change bypass account status, tenant status, or MFA policy.

## Verify Phone Number

Phone verification proves control of a phone number. Auth may use a verified phone number for SMS login, SMS MFA, account notifications, or recovery depending on tenant policy.

Use phone verification carefully because SMS has deliverability, cost, interception, and SIM-swap risks.

Important options:

- Whether phone numbers are enabled.
- Whether phone verification is required.
- OTP lifetime.
- Retry and resend limits.
- Daily SMS limits.
- Whether SMS can be used for login, MFA, recovery, or notifications.
- Whether changing phone number clears previous verification state.

Developer behavior:

- Mask phone numbers in user-facing lists and logs where possible.
- Rate-limit sends and verification attempts.
- Avoid revealing whether a phone number belongs to another account.
- Do not use development SMS logging outside controlled environments.
- Prefer stronger factors for administrators and high-risk users.

## Delete Account

Account deletion is the user-facing path for leaving the tenant or requesting removal of personal data. In Auth, deletion should usually create or enter a controlled erasure workflow rather than immediately hard-deleting rows.

Use account deletion when:

- The product allows users to close their own account.
- Legal or privacy policy requires user-requested erasure.
- The user understands the impact on login, sessions, tokens, profiles, devices, consents, and linked identities.
- Any required retention rules are respected.

Important options:

- Whether self-service deletion is enabled.
- Whether step-up MFA is required.
- Whether password confirmation is required.
- Whether deletion is immediate or delayed.
- Whether the user can cancel during a grace period.
- Which personal data is anonymized.
- Which audit or security records are retained.

Developer behavior:

- Require clear confirmation and fresh proof.
- Revoke sessions and tokens when deletion completes.
- Preserve audit traceability without retaining personal details that should be erased.
- Do not allow account deletion to bypass billing, compliance, legal hold, or tenant policy decisions.
- Make sure deleted or erased accounts cannot authenticate.

## Profiles

Profiles store user-facing personal details. They are different from the account identity itself.

A profile can contain display name, first name, last name, avatar, locale, timezone, job title, bio, or other product-facing attributes. Profiles help applications show human-friendly account information without using email, provider subject, or user ID as display text.

Profiles should not control authorization. Access control should come from users, tenant members, roles, permissions, policies, sessions, and provider identities.

## Default Profile

The default profile is the profile applications should use when they need the user's normal display information.

Use a default profile when:

- The product shows a single display identity for the user.
- OAuth claims or user info responses need a consistent display name.
- The user can update personal details after registration.
- Applications need a stable fallback profile.

Important options:

- Whether a default profile is created during registration.
- Which fields users may edit.
- Which fields are required.
- Whether profile completion is required before normal access.
- Whether profile changes require review or moderation.

Developer behavior:

- Keep profile data separate from login identifiers.
- Validate display fields for length and safe rendering.
- Do not use profile display name as an authorization key.
- Avoid exposing private profile fields to OAuth clients unless consent and scope allow it.

## Multiple Profiles

Multiple profiles let a single account present different display information in different contexts. This can be useful for workspaces, organizations, personas, product areas, or privacy-sensitive applications.

Use multiple profiles only when the product genuinely needs them. Many applications are simpler and safer with one default profile.

Important options:

- Whether multiple profiles are enabled.
- Maximum number of profiles per user.
- Which profile is default.
- Whether profiles are tenant-wide or application-specific.
- Whether profile pictures are shared across profiles.

Developer behavior:

- Always store ownership by user ID.
- Make default profile selection explicit.
- Avoid leaking one profile's private details into another application context.
- Keep profile selection separate from role or permission selection.

## Profile Pictures

Profile pictures are user-uploaded assets connected to profiles.

Important options:

- Allowed file types.
- Maximum file size.
- Image dimensions.
- Whether images are resized or normalized.
- Storage provider.
- Public or signed delivery behavior.
- Moderation or malware scanning policy.

Developer behavior:

- Validate content type and file size.
- Strip unnecessary metadata when possible.
- Do not trust file extensions alone.
- Delete old images when replacing or deleting a profile picture, according to retention policy.
- Avoid exposing private storage URLs directly when signed delivery is required.

## Sessions And Devices

Sessions and devices show where the account is currently signed in and which browsers or devices Auth remembers.

This is useful for security review. A user who sees an unfamiliar session should be able to revoke it. A user who sees an old trusted device should be able to remove it.

## Sessions

A session represents ongoing browser continuity for a signed-in user. It may be backed by cookies, refresh tokens, server-side session records, or a combination depending on runtime mode.

Self-service session actions:

- List sessions.
- Revoke one session.
- Revoke all sessions.
- Revoke all other sessions.

Important options:

- Whether users can view sessions.
- Whether users can revoke their current session.
- Whether users can revoke all other sessions.
- Session lifetime.
- Idle timeout.
- Device labels.
- IP and user-agent display.
- Whether refresh tokens are revoked with the session.

Developer behavior:

- Show enough context to help users recognize a session without exposing sensitive data.
- Let users revoke unfamiliar sessions.
- Require fresh proof before revoking all sessions when policy requires it.
- Do not show raw session tokens, refresh tokens, access tokens, or cookies.
- Revoke downstream refresh state consistently.

## Devices

Devices describe remembered browsers or device fingerprints used for security context, MFA remember-device behavior, or account review.

Device records are not proof that a physical device belongs to a user forever. They are contextual records created from browser and security signals.

Important options:

- Whether device tracking is enabled.
- Device label behavior.
- Remembered-device lifetime.
- Whether trusted devices reduce MFA prompts.
- Whether users can rename or delete devices.
- Whether administrators can inspect devices.

Developer behavior:

- Avoid overclaiming device identity in UI.
- Mask IP addresses or detailed fingerprints when privacy policy requires it.
- Delete trusted-device state when the user removes a device.
- Re-run MFA when a remembered device is no longer trusted.

## Trusted Devices

Trusted devices reduce friction after the user has completed MFA from a known browser or device.

Use trusted devices when:

- The tenant allows remembered MFA.
- Device trust expires automatically.
- Users can review and remove trusted devices.
- High-risk roles can opt out or require stricter rules.

Important options:

- Whether trusted devices are enabled.
- Trust lifetime.
- Whether trust applies per tenant, per client, or per factor.
- Whether trust can be revoked by user or admin.
- Whether high-risk actions still require step-up.

Developer behavior:

- Store trusted-device secrets securely.
- Make trusted-device removal revoke the remembered state immediately.
- Do not let trusted devices bypass step-up for destructive account actions unless policy explicitly allows it.
- Audit creation and removal of trusted devices.

## Data And Identity

Data and identity self-service lets users understand what Auth knows about them and how their account is connected to external systems.

Common areas:

- Data export.
- Data erasure request.
- Consent review.
- Linked identities.
- Link an upstream identity.
- Unlink an upstream identity.

These features often overlap with privacy policy, OAuth policy, provider configuration, and tenant governance.

## Data Export

Data export lets a user obtain a copy of account data Auth stores about them.

Use data export when:

- Privacy policy requires data portability.
- Users need visibility into profile, consent, session, device, and identity data.
- Support wants users to retrieve their own account data without admin intervention.

Important options:

- Whether self-service export is enabled.
- Which categories are included.
- Whether export is immediate or prepared asynchronously.
- Download expiration.
- Whether sensitive security fields are excluded or redacted.
- Notification behavior.

Developer behavior:

- Exclude secrets such as password hashes, MFA seeds, backup-code hashes, access tokens, refresh tokens, session cookies, and provider tokens.
- Avoid including another user's data through linked tenant or shared resource records.
- Make exports expire.
- Audit export requests and completions.

## Data Erasure

Data erasure removes or anonymizes personal account data while preserving required audit, security, and referential records.

Use erasure when:

- A user closes an account.
- Privacy law or product policy allows data deletion.
- An administrator approves an erasure request.
- A retention schedule requires cleanup.

Important options:

- Whether users can request erasure themselves.
- Whether erasure is immediate, scheduled, or approval-based.
- Grace period.
- Cancellation rules.
- Which records are anonymized.
- Which records are retained for security or legal reasons.
- Notification behavior.

Developer behavior:

- Treat erasure as a workflow, not a simple delete.
- Revoke sessions and tokens when erasure completes.
- Prevent erased users from logging in again with the same erased account.
- Preserve audit traceability without keeping personal data that should be removed.
- Make retention exceptions explicit and permission-gated.

## Consent Records

Consent records track what a user approved for an OAuth client or connected application.

Use consent review when:

- Applications request user approval for scopes.
- Users need to see which applications can access their information.
- Users should be able to revoke access from account settings.

Important options:

- Whether consent is required for a client.
- Which scopes are shown to users.
- Whether consent expires.
- Whether users can revoke consent.
- Whether revoking consent also revokes sessions or refresh tokens for that client.

Developer behavior:

- Explain scopes in user-friendly language.
- Revoke related refresh tokens when consent is revoked if policy requires it.
- Do not show consent for privileged internal clients unless the product intentionally exposes it.
- Audit consent grants and revocations.

## Linked Identities

Linked identities connect the Auth user to external providers such as Google, GitHub, Microsoft, Auth0, Cognito, GitLab, or SAML providers.

A linked identity should be based on a stable upstream subject, not just an email address. Emails can change, be unverified, or collide across providers.

Use linked identities when:

- Users can sign in with more than one provider.
- A tenant wants account linking after federated login.
- A user wants to connect or disconnect an external account.
- Support needs visibility into how a user authenticates.

Important options:

- Which providers allow user-initiated linking.
- Whether linking requires step-up MFA.
- Whether unlinking requires password fallback or another linked provider.
- Whether email-domain routing affects linking.
- Whether JIT provisioning can create users automatically.

Developer behavior:

- Require fresh proof before linking or unlinking identities.
- Prevent unlinking the user's last usable login method unless recovery is available.
- Never expose provider access tokens or refresh tokens in self-service pages.
- Audit link and unlink events.
- Protect against account takeover when emails match across providers.

## MFA Self-Service

MFA self-service lets users enroll, verify, manage, and recover second factors.

Common actions:

- Enroll TOTP.
- Add passkeys or WebAuthn credentials.
- Add SMS or email OTP factors when policy allows.
- Generate backup codes.
- Regenerate backup codes.
- Remove a factor.
- Reset the caller's own MFA when policy allows.

Important options:

- Allowed factor types.
- Required factor count.
- Whether backup codes are required.
- Whether removing a factor requires step-up.
- Whether admins can reset factors.
- Whether high-risk users need stronger factors.

Developer behavior:

- Require step-up before destructive MFA changes.
- Show backup codes only at generation time.
- Store MFA secrets and backup codes securely.
- Do not let users remove their last required factor unless policy provides a safe recovery path.
- Audit MFA enrollment, removal, reset, and backup-code regeneration.

## Permissions

Self-service actions usually rely on the current user's session, but they still need permission checks.

Typical permission areas:

- Self profile read and write: view and update the caller's own profile.
- Self account read: view the caller's own account summary.
- Self account write: update username, phone, or non-sensitive account fields.
- Self email change: request or complete email changes.
- Self password change: rotate the caller's own password.
- Self MFA management: manage the caller's own factors and backup codes.
- Self session management: view and revoke the caller's own sessions.
- Self device management: view and remove trusted devices.
- Self consent management: view and revoke OAuth consents.
- Self identity linking: link or unlink the caller's own external identities.
- Self data export: request and download account export.
- Self erasure request: request account deletion or erasure.

Sensitive actions should require fresh proof even when the user is already signed in. Examples include email change, password change, MFA removal, backup-code regeneration, linked-identity unlinking, deleting trusted devices, revoking all sessions, data export, and account deletion.

## Important Boundaries

Self-service should be intentionally narrow.

Important boundaries:

- A user can manage their own account only.
- Self-service should not assign roles.
- Self-service should not create tenant members.
- Self-service should not change tenant settings.
- Self-service should not expose provider secrets.
- Self-service should not expose raw tokens, cookies, MFA secrets, backup-code hashes, reset links, magic links, or invite tokens.
- Self-service should not bypass tenant status, user status, client policy, MFA policy, or rate limits.
- Admin remediation belongs to the console and must be permission-gated.

When a self-service action overlaps with administration, prefer separate routes, separate permissions, and separate audit event names. That separation makes accidental privilege escalation easier to spot.

## Events And Audit

Self-service should emit security events and audit records where appropriate.

Security-event examples:

- Email change requested.
- Email change verified.
- Username changed.
- Password changed.
- Phone verification requested.
- Phone verified.
- MFA factor enrolled.
- MFA factor removed.
- Backup codes generated.
- Session revoked.
- Trusted device added.
- Trusted device removed.
- External identity linked.
- External identity unlinked.
- Consent granted.
- Consent revoked.
- Data export requested.
- Account deletion requested.
- Account erasure completed.

Audit records should identify the actor as the user, not an administrator. For sensitive actions, include enough context for investigation, such as tenant, client, action type, target account, time, IP family or coarse location when appropriate, and whether step-up was satisfied.

Do not place plaintext passwords, OTPs, backup codes, magic links, reset links, invite tokens, session cookies, access tokens, refresh tokens, provider tokens, or MFA seeds in events, audit records, logs, or analytics payloads.

## Developer Workflow

For a normal self-service account area:

1. Resolve the tenant and current user from the session.
2. Check tenant, user, client, and session status.
3. Load only the self-service actions enabled by tenant policy.
4. Display profile, security, sessions, devices, connected accounts, consent, and data controls.
5. Require step-up before sensitive changes.
6. Send verification challenges for email and phone changes.
7. Revoke sessions or tokens when policy requires it.
8. Emit security events and audit records.
9. Notify the user about sensitive changes.
10. Keep endpoint details and payload examples in the API reference.

## Developer Checklist

Before shipping account self-service, verify:

- The user can only act on their own account.
- Disabled, locked, pending, or erased accounts cannot perform unauthorized self-service actions.
- Tenant maintenance or suspension blocks self-service before accepting secrets.
- Sensitive actions require fresh proof when policy says so.
- Email and phone changes reset verification state until verified.
- Password changes enforce password policy.
- MFA removal cannot leave the user below required factor policy.
- Backup codes are shown only at generation time.
- Session and device pages never expose raw tokens or cookies.
- Linked identity pages never expose provider tokens.
- Consent revocation affects downstream refresh state when required.
- Data export excludes secret material.
- Erasure follows retention and audit rules.
- Security notifications are sent for sensitive changes when configured.
- API request and response details are documented in the API reference, not duplicated here.

## Troubleshooting

If users cannot open account settings, check tenant status, user status, session validity, client policy, and whether the hosted identity UI is using the expected tenant context.

If a user cannot change email, check whether self-service email changes are enabled, whether the new email is already used in the tenant, whether verification is required, and whether step-up was satisfied.

If password change fails, check whether the user has a local password identity, whether password login is enabled, whether the current password or step-up proof is valid, and whether the new password satisfies policy.

If MFA changes are blocked, check required factor policy, step-up freshness, factor ownership, recovery settings, and whether the user is trying to remove the last required factor.

If sessions do not disappear after revocation, check refresh-token storage, session cache invalidation, cookie clearing, and whether downstream applications still have separate application sessions.

If a linked identity cannot be removed, check whether it is the user's last usable login method, whether unlinking requires step-up, and whether tenant provider policy prevents removal.

If export or erasure does not complete, check background workers, retention policy, legal holds, storage access, event logs, and whether the request is waiting for approval or a grace period.
