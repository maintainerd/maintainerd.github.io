# Account Self-Service

Account self-service is where a signed-in user manages their own Auth account. It belongs to the hosted identity UI, not the administrator console.

## Where Users Find It

Users open account self-service from the hosted identity UI or from an application link such as Account, Profile, Security, or Manage account.

The account area can include:

| Area | What Users Manage |
|---|---|
| Profile | Display and preference information. |
| Security | Account protection state and sensitive actions. |
| Email and phone | Contact methods and verification. |
| Password | Local Auth password rotation. |
| MFA | Second-factor enrollment, recovery, and removal. |
| Sessions | Active and recent sign-in sessions. |
| Devices | Remembered and trusted devices. |
| Connected accounts | Linked external providers. |
| Consents | Application approvals. |
| Data export | User-owned export request. |
| Delete account | Account deletion or erasure request. |

Administrators may inspect some of the same information from user detail, but they should use administrator permissions and audit records. Self-service always acts on the current signed-in user.

## Account Overview

The overview helps users understand which account they are managing.

Fields users may see:

| Field | What It Means |
|---|---|
| Email | Contact, login, recovery, or verification address. |
| Username | Optional tenant-local identifier. |
| Phone number | Optional phone used for SMS login, MFA, recovery, or notifications. |
| Status | Whether the account is active, pending, locked, disabled, or erased. |
| Verification state | Whether email or phone is verified. |
| MFA state | Whether extra factors are enrolled. |
| Linked identities | External accounts connected to the Auth user. |

The page should not show secrets, tokens, password hashes, MFA seeds, backup-code hashes, or provider tokens.

## Profile

Profile settings control display information, not access.

Fields can include:

| Field | Purpose |
|---|---|
| Display name | Friendly name shown in applications. |
| First name | Optional personal profile detail. |
| Last name | Optional personal profile detail. |
| Avatar | Profile image or picture reference. |
| Locale | Language and formatting preference. |
| Timezone | User's timezone preference. |
| Bio or product-specific fields | Optional profile details used by connected applications. |

Users update profiles so applications can show friendly names and preferences. Authorization should still use user ID, roles, permissions, memberships, and policies.

## Email

Email settings let a user change or verify their email address.

Field meanings:

| Field | What It Means |
|---|---|
| Current email | Email currently attached to the account. |
| New email | Address the user wants to use. |
| Verification status | Whether Auth trusts the email. |
| Verification challenge | Email link or code used to prove ownership. |

Changing email can affect login, password reset, magic links, invites, notifications, and audit identity. Require fresh proof when policy says so.

## Username

Username settings let a user change an optional tenant-local handle.

Field meanings:

| Field | What It Means |
|---|---|
| Current username | Active handle. |
| New username | Requested replacement. |
| Availability | Whether the username is allowed and unused in the tenant. |

Use stable user IDs for application logic. Usernames can change when tenant policy allows it.

## Phone

Phone settings let a user add, change, or verify a phone number.

Field meanings:

| Field | What It Means |
|---|---|
| Phone number | Number attached to the account. |
| Verification status | Whether the user proved control of the number. |
| OTP challenge | One-time code used for verification. |

SMS has cost and security tradeoffs. Rate-limit sends and avoid exposing full numbers in logs.

## Password

Password settings let a signed-in user rotate their local Auth password.

Fields users may see:

| Field | What It Means |
|---|---|
| Current password | Proof that the signed-in user knows the existing password. |
| New password | Replacement password. |
| Confirm new password | Confirmation to reduce accidental entry errors. |
| Password policy guidance | Rules the new password must satisfy. |

Password change is not the same as forgot-password recovery. A signed-in password change should require current password or step-up proof and should enforce tenant password policy.

## MFA

MFA settings let users enroll, review, and remove second factors.

Controls can include:

| Control | What It Does |
|---|---|
| Add authenticator app | Enrolls a TOTP factor. |
| Add passkey or WebAuthn credential | Enrolls a phishing-resistant factor where supported. |
| Add SMS or email OTP factor | Enrolls an OTP factor when tenant policy allows it. |
| Generate backup codes | Creates recovery codes. |
| Regenerate backup codes | Replaces existing recovery codes. |
| Remove a factor | Deletes an enrolled factor. |

Removing MFA factors, regenerating backup codes, or resetting MFA should require fresh proof. Users should not be able to remove their last required factor unless a safe recovery path exists.

## Sessions

Sessions show where the account is currently signed in.

Fields users may see:

| Field | What It Means |
|---|---|
| Device or browser label | Human-readable session hint. |
| Approximate location | Location derived from request context when available. |
| IP context | Client IP information when policy allows display. |
| Last active time | Most recent activity for the session. |
| Created time | When the session started. |
| Current session marker | Shows which session the user is currently using. |

Actions can include revoking one session, revoking all sessions, or revoking all other sessions. Never show raw tokens or cookies.

## Devices And Trusted Devices

Devices represent remembered browser or device context. Trusted devices can reduce MFA prompts when tenant policy allows it.

Fields users may see:

| Field | What It Means |
|---|---|
| Device label | Human-readable device name. |
| Browser or platform hint | Browser or operating-system context. |
| Trusted status | Whether the device can reduce MFA prompts. |
| Last used time | When the device was last seen. |
| Expiration | When trust expires. |

Users should be able to remove devices they do not recognize. Removing a trusted device should revoke its remembered MFA state.

## Connected Accounts

Connected accounts are linked external identities such as Google, GitHub, Microsoft, OIDC, or SAML accounts.

Fields users may see:

| Field | What It Means |
|---|---|
| Provider name | External provider attached to the account. |
| Linked email or display name | Identity information returned by the provider. |
| Linked time | When the provider identity was linked. |
| Last used time | When the linked provider was last used. |

Users can link or unlink providers when tenant policy allows it. Do not allow unlinking the last usable login method unless recovery is available.

## Consents

Consent records show which applications the user has approved.

Fields users may see:

| Field | What It Means |
|---|---|
| Application name | Client the user approved. |
| Approved scopes | Access the user consented to. |
| Approval time | When consent was granted. |
| Expiration | When consent expires, if configured. |

Users should be able to revoke consent where policy allows. Revoking consent may also revoke refresh tokens or sessions for that client.

## Data Export And Delete Account

Data export lets a user request a copy of account data Auth stores about them. Export should exclude secrets and other users' data.

Delete account starts account deletion or erasure. It should require clear confirmation and fresh proof.

Account deletion should revoke sessions and tokens when complete and should preserve required audit traceability without retaining personal data that should be erased.

## Permissions And Security

Self-service uses the current user's session, but sensitive actions still need permission checks and fresh proof.

Sensitive actions include:

| Sensitive Action | Why It Needs Extra Care |
|---|---|
| Changing email | Can affect login, recovery, invites, notifications, and audit identity. |
| Changing password | Changes the local credential. |
| Removing MFA | Weakens account protection. |
| Regenerating backup codes | Replaces recovery material. |
| Linking or unlinking providers | Changes available sign-in methods. |
| Revoking all sessions | Signs the user out across devices. |
| Exporting data | Produces personal information. |
| Deleting the account | Starts deletion or erasure lifecycle. |

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
