# Identity Types

Identity types are the objects you see across the Auth console and hosted identity UI. Understanding them makes every later screen easier: tenants own configuration, users sign in, members administer tenants, clients represent applications, and providers prove identity.

## Where You See Them

In the console:

- Tenants shows tenant identity and tenant-wide settings.
- Members shows who can administer a tenant.
- Users shows human accounts.
- Profiles appears inside user detail and account self-service.
- Identity providers shows login sources.
- Applications or clients shows apps that rely on Auth.
- Sessions, devices, and consents appear in user detail and self-service security pages.
- Roles and permissions appear in authorization screens.

In the hosted identity UI:

- Users see login methods from providers.
- Users complete registration into a tenant.
- Users manage their profile, sessions, devices, linked identities, MFA, and consents.

## Tenant

A tenant is the main boundary in Auth. It owns users, members, clients, providers, settings, branding, registration rules, audit behavior, and security policy.

Fields you will commonly see:

- Name: human-readable label.
- Slug: short stable identifier for routing.
- Status: whether the tenant can serve traffic.
- Branding: logo, colors, and user-facing copy.
- Settings: rate limits, maintenance, messaging, audit, security defaults, and retention.

Use tenants to separate customers, organizations, environments, or product spaces that need separate identity policy.

## User

A user is a human account inside one tenant. Users sign in, receive sessions, own profiles, enroll MFA, link identities, and approve consents.

Fields you will commonly see:

- Email, username, or phone: identifiers and contact methods.
- Status: active, pending, disabled, locked, deleted, or erased.
- Verification flags: whether email or phone has been proven.
- MFA summary: whether factors are enrolled.
- Created and updated timestamps.
- Linked identities, sessions, devices, consents, and profiles.

Users are tenant-scoped. The same email can exist as separate users in different tenants.

## Tenant Member

A tenant member is the relationship that lets a user administer a tenant in the console.

Fields you will commonly see:

- User: the account that receives admin access.
- Member role: the administrative capability level.
- Status: invited, active, suspended, or removed.
- Joined or invited time.

Tenant membership is not the same as application access. A person can be a product user without being a tenant administrator.

## Profile

A profile stores display and personal information for a user. It is for presentation and user experience, not authorization.

Fields can include:

- Display name.
- First and last name.
- Avatar.
- Locale.
- Timezone.
- Bio or product-specific profile fields.

Do not use profile fields as the source of access control. Use roles, permissions, memberships, and policies.

## Identity Provider

An identity provider is a way to prove who a user is.

Provider types include:

- Built-in email/password.
- Passwordless email or SMS.
- Social OAuth/OIDC providers.
- Enterprise OIDC providers.
- SAML providers.

Provider detail screens usually show status, configuration, mapping, routing rules, registration behavior, and client connections.

## User Identity

A user identity links one Auth user to one provider subject. For example, the same user may have a local password identity and a Google identity.

Fields you will commonly see:

- Provider.
- Upstream subject.
- Linked Auth user.
- Email or profile claims copied from the provider.
- Created time and last-used time.

Use a stable provider subject for linking. Do not trust email alone for account linking.

## Client

A client is an application that uses Auth for login.

Fields you will commonly see:

- Client name.
- Client type.
- Redirect URIs.
- Logout URIs.
- Allowed origins.
- Login methods.
- Provider connections.
- Consent settings.
- Token/session behavior.

Create one client for each application or integration that needs its own redirect, origin, consent, or token policy.

## Sessions And Devices

A session keeps a user signed in. A device records browser or device context used for account review, remembered MFA, or security decisions.

Users see their own sessions and devices in account self-service. Administrators may inspect them from user detail when they have permission.

Never expose raw tokens, cookies, or device fingerprints in normal UI.

## Roles And Permissions

Roles and permissions decide what a user, member, service, or workload can do.

Keep these separate:

- Tenant member roles control administration in the console.
- Application roles control product or API access.
- Service permissions control service-to-service access.
- Workload identity rules control trusted machine identities.

## Choosing The Right Object

Use a tenant when you need a separate security and configuration boundary.

Use a user when you need a human account.

Use a member when that user should administer the tenant.

Use a profile when you need display data.

Use a provider when users need a login method.

Use a client when an application needs Auth login.

Use roles and permissions when you need authorization.

## Common Mistakes

- Using email as a global user ID.
- Treating tenant members as all users.
- Granting tenant admin access through application roles.
- Using display name for authorization.
- Creating providers without connecting them to clients.
- Linking accounts by unverified email alone.
- Exposing provider tokens or session tokens in UI.
