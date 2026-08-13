# Account Self-Service

Account self-service is where a signed-in user manages their own Auth account. It belongs to the hosted identity UI, not the administrator console.

## Where Users Find It

Users open account self-service from the hosted identity UI or from an application link such as Account, Profile, Security, or Manage account.

The account area can include:

- Profile.
- Security.
- Email and phone.
- Password.
- MFA.
- Sessions.
- Devices.
- Connected accounts.
- Consents.
- Data export.
- Delete account.

Administrators may inspect some of the same information from user detail, but they should use administrator permissions and audit records. Self-service always acts on the current signed-in user.

## Account Overview

The overview helps users understand which account they are managing.

Fields users may see:

- Email: contact, login, recovery, or verification address.
- Username: optional tenant-local identifier.
- Phone number: optional phone used for SMS login, MFA, recovery, or notifications.
- Status: whether the account is active, pending, locked, disabled, or erased.
- Verification state: whether email or phone is verified.
- MFA state: whether extra factors are enrolled.
- Linked identities: external accounts connected to the Auth user.

The page should not show secrets, tokens, password hashes, MFA seeds, backup-code hashes, or provider tokens.

## Profile

Profile settings control display information, not access.

Fields can include:

- Display name.
- First name.
- Last name.
- Avatar.
- Locale.
- Timezone.
- Bio or product-specific fields.

Users update profiles so applications can show friendly names and preferences. Authorization should still use user ID, roles, permissions, memberships, and policies.

## Email

Email settings let a user change or verify their email address.

Field meanings:

- Current email: the email currently attached to the account.
- New email: the address the user wants to use.
- Verification status: whether Auth trusts the email.
- Verification challenge: the email link or code used to prove ownership.

Changing email can affect login, password reset, magic links, invites, notifications, and audit identity. Require fresh proof when policy says so.

## Username

Username settings let a user change an optional tenant-local handle.

Field meanings:

- Current username: the active handle.
- New username: the requested replacement.
- Availability: whether the username is allowed and unused in the tenant.

Use stable user IDs for application logic. Usernames can change when tenant policy allows it.

## Phone

Phone settings let a user add, change, or verify a phone number.

Field meanings:

- Phone number: the number attached to the account.
- Verification status: whether the user proved control of the number.
- OTP challenge: the one-time code used for verification.

SMS has cost and security tradeoffs. Rate-limit sends and avoid exposing full numbers in logs.

## Password

Password settings let a signed-in user rotate their local Auth password.

Fields users may see:

- Current password.
- New password.
- Confirm new password.
- Password policy guidance.

Password change is not the same as forgot-password recovery. A signed-in password change should require current password or step-up proof and should enforce tenant password policy.

## MFA

MFA settings let users enroll, review, and remove second factors.

Controls can include:

- Add authenticator app.
- Add passkey or WebAuthn credential.
- Add SMS or email OTP factor when allowed.
- Generate backup codes.
- Regenerate backup codes.
- Remove a factor.

Removing MFA factors, regenerating backup codes, or resetting MFA should require fresh proof. Users should not be able to remove their last required factor unless a safe recovery path exists.

## Sessions

Sessions show where the account is currently signed in.

Fields users may see:

- Device or browser label.
- Approximate location.
- IP context when policy allows.
- Last active time.
- Created time.
- Current session marker.

Actions can include revoking one session, revoking all sessions, or revoking all other sessions. Never show raw tokens or cookies.

## Devices And Trusted Devices

Devices represent remembered browser or device context. Trusted devices can reduce MFA prompts when tenant policy allows it.

Fields users may see:

- Device label.
- Browser or platform hint.
- Trusted status.
- Last used time.
- Expiration.

Users should be able to remove devices they do not recognize. Removing a trusted device should revoke its remembered MFA state.

## Connected Accounts

Connected accounts are linked external identities such as Google, GitHub, Microsoft, OIDC, or SAML accounts.

Fields users may see:

- Provider name.
- Linked email or display name from the provider.
- Linked time.
- Last used time.

Users can link or unlink providers when tenant policy allows it. Do not allow unlinking the last usable login method unless recovery is available.

## Consents

Consent records show which applications the user has approved.

Fields users may see:

- Application name.
- Approved scopes.
- Approval time.
- Expiration when configured.

Users should be able to revoke consent where policy allows. Revoking consent may also revoke refresh tokens or sessions for that client.

## Data Export And Delete Account

Data export lets a user request a copy of account data Auth stores about them. Export should exclude secrets and other users' data.

Delete account starts account deletion or erasure. It should require clear confirmation and fresh proof.

Account deletion should revoke sessions and tokens when complete and should preserve required audit traceability without retaining personal data that should be erased.

## Permissions And Security

Self-service uses the current user's session, but sensitive actions still need permission checks and fresh proof.

Sensitive actions include:

- Changing email.
- Changing password.
- Removing MFA.
- Regenerating backup codes.
- Linking or unlinking providers.
- Revoking all sessions.
- Exporting data.
- Deleting the account.

Self-service must never let a user pass another user ID to edit someone else's account.

## Common Workflow

1. User signs in.
2. User opens account settings.
3. Auth loads the current user's account state.
4. UI shows only enabled self-service areas.
5. User chooses an action.
6. Auth asks for step-up or verification when required.
7. Auth applies the change.
8. Auth emits security events and audit records.
9. Auth sends security notifications when configured.

## Troubleshooting

If account settings do not open, check session validity, tenant status, user status, and identity hostname.

If email change fails, check duplicate email rules, verification challenge state, and step-up freshness.

If password change fails, check whether the user has a local password identity and whether the new password passes policy.

If MFA cannot be removed, check required factor policy and whether another recovery method exists.

If sessions remain active after revocation, check refresh-token revocation, session cache invalidation, and downstream application sessions.

If data export or deletion stalls, check background workers, retention policy, legal holds, and event logs.
