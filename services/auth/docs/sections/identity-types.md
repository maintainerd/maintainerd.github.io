# Identity Types

Auth separates identity into concrete objects because each object answers a different question:

- Who owns the boundary? The tenant.
- Who is the human? The user.
- What is that user's relationship to the tenant? The tenant member.
- What personal details can the user present? The profile.
- Which authentication source proved the user? The identity provider and user identity.
- Which application is asking Auth to sign someone in? The client.
- Which backend service or workload is acting without a browser user? The service identity or workload federation.
- What proof is carried at runtime? The session and token claims.

That separation is important for developers. It lets one tenant use local password login, Google, GitHub, Microsoft Entra ID, Auth0, Cognito, GitLab, SAML, or another Auth deployment without changing the external application's OAuth integration. It also lets a user link several upstream identities while still remaining one tenant-scoped Auth user.

## Quick Map

Use this map when deciding which Auth object you need to create or inspect.

- Tenant: the isolation boundary for users, clients, providers, roles, services, APIs, policies, registration flows, branding, messaging, events, and security settings.
- User: the human account inside one tenant.
- Tenant member: the user's tenant relationship and tenant-level administrative role, such as `owner`, `admin`, or `member`.
- Profile: the user's display and personal information.
- Identity provider: the built-in or upstream system that can authenticate a user.
- User identity: the link between a user and a provider subject.
- Client: the downstream OAuth/OIDC application that redirects users to Auth.
- Client identity provider connection: the join that decides which login options appear for one client.
- Service: an API or resource principal inside the tenant.
- Service-bound client: an `m2m` client that can act as a service and receive service context.
- Workload identity federation: a trust rule that lets an external workload exchange its OIDC token for an Auth access token without storing a long-lived client secret.
- Session and token: runtime proof containing user, client, tenant, provider, session, authentication-method, and subject-type information.

## Tenant

A tenant is the ownership and isolation boundary.

Users are tenant-scoped. Auth treats email and username uniqueness as tenant-local, so the same email address can exist as separate accounts in different tenants. A tenant also owns the objects that shape authentication and authorization: clients, identity providers, roles, permissions, policies, services, APIs, registration flows, invites, branding, templates, messaging configuration, webhook configuration, and security settings.

Tenant records usually include a stable tenant identifier, a DNS-safe name or slug, a display name, lifecycle status, whether the tenant is the system tenant, timestamps, and optional metadata. The exact API schema belongs in the API reference; the conceptual point is that every tenant-scoped object must resolve back to this boundary.

For standalone deployments, you may run Auth with one tenant and treat it as the identity boundary for your application. In the Maintainerd ecosystem, Auth can also be operated under a control plane where tenant creation, first-party clients, and platform services are coordinated by the wider system.

## User

A user is the human account inside a tenant.

The user record stores the account identity Auth owns: username, email, phone, password state, status, verification state, MFA enrollment flags, password lifecycle flags, lockout counters, metadata, and audit fields. It is not the same thing as a Google account, GitHub account, SAML subject, or application client.

Important user rules:

- A user belongs to one tenant.
- A user can authenticate with the built-in provider if password or passwordless login is enabled for the client.
- A user can have linked upstream identities from external providers.
- A user can enroll MFA methods such as TOTP, WebAuthn, SMS, email OTP, or backup-code based flows.
- A user can hold application and API roles through Auth's IAM model.
- A user can also have a tenant member record when they need tenant administration access.

Do not expose password hashes, MFA seeds, backup codes, refresh tokens, provider tokens, or recovery secrets through user list or detail screens.

## Tenant Member

A tenant member is the user's administrative relationship to a tenant.

The member row answers: "What tenant-level role does this user have?" Auth supports the built-in member roles:

- `owner`: tenant owner with the highest tenant administration responsibility.
- `admin`: tenant administrator with management access according to permissions and policy.
- `member`: regular tenant member without automatic broad administration rights.

Do not use a tenant member as the user's login identity. The user is the account. The member is the tenant administration relationship around that account. This distinction matters when you build admin screens, tenant switchers, audit logs, owner-transfer workflows, and permission checks.

Use tenant membership for tenant administration. Use IAM roles and policies for product authorization.

## Profile

A profile stores user-facing personal details.

Use the profile for display and personal information such as first name, middle name, last name, display name, birthdate, gender, profile image or URL, default profile flag, and metadata. Keep authentication decisions anchored to the user, identity provider, user identity, tenant member, role, permission, and policy records instead of a display profile.

Profiles are helpful for UI and personalization. They should not become security authority. A profile display name should not decide whether someone can manage a tenant, call an API, or access a protected application.

## Identity Providers

An identity provider is the authentication source Auth can use for sign-in, linking, and federation.

Auth supports these provider types:

- `system`: the built-in Auth provider, represented by the Maintainerd provider.
- `social`: consumer OAuth/OIDC providers such as Google, GitHub, GitLab, Facebook, LinkedIn, Microsoft, and X.
- `enterprise`: enterprise OIDC providers such as Auth0, AWS Cognito, Microsoft Entra ID, GitLab, or another Auth deployment.
- `saml`: SAML 2.0 providers.

Provider records are tenant-scoped. They can include display details, provider type, public identifier, status, JIT provisioning behavior, registration behavior, token-federation behavior, email-domain routing, upstream token audiences, and connection details such as issuer, client ID, encrypted client secret, OAuth endpoints, SAML entity metadata, certificates, and attribute mappings.

Provider secrets are server-side credentials. Configure them through the management surface or deployment secret process, and never return them to browser applications.

## User Identities

A user identity links one Auth user to one provider subject.

Important user identity fields and meanings:

- `tenant_id`: keeps the link inside one tenant.
- `user_id`: identifies the Auth user that owns the link.
- `identity_provider_id`: identifies the configured provider.
- `provider`: names the provider family or configured provider key.
- `sub`: stores the provider's stable subject for that user.
- `metadata`: stores normalized upstream claims such as email, name, picture, locale, and verification state.
- `jit_provisioned_at`: records when Auth created the user from an upstream login.
- `provisioning_source`: records where the identity came from.

The built-in provider anchors a local Auth account. When a user signs in with an external provider and JIT provisioning is allowed, Auth still creates or resolves a local user and records the external provider subject as a linked identity. That means the downstream app deals with one Auth user even if the user can sign in through multiple providers.

## Account Linking

Account linking protects users when an upstream provider returns an email address that already belongs to a local Auth account.

Instead of silently merging accounts, Auth creates a short-lived account-link request. The user must authenticate as the existing Auth account in the same tenant and confirm the link. After confirmation, Auth attaches the external provider subject to the existing user.

Use account linking when:

- A user already has password login and later wants to add Google, GitHub, Microsoft, SAML, or another external provider.
- A social login returns the same email as an existing tenant user.
- You want the hosted account surface to let users manage their connected identities.

Do not unlink the built-in system identity from a user. External identities can be linked and unlinked, but the local Auth identity is the anchor that keeps the account stable inside the tenant.

## Login Methods

A login method is not the same thing as an identity type.

Login methods are ways a user proves control of an account. Auth can expose password login, self-registration, invite registration, passwordless magic link, external OAuth/OIDC login, SAML login, and MFA step-up methods. MFA methods such as TOTP, WebAuthn, SMS, email OTP, and backup codes strengthen an existing login; they do not create a separate user identity type.

The hosted identity app asks Auth which login methods are available for a client. The result is driven by the client's enabled identity-provider connections and registration settings. Registration requirements are resolved separately from registration context, so changing a registration flow should not accidentally change which sign-in buttons appear.

## Clients

A client is the downstream OAuth/OIDC application that uses Auth.

External applications integrate by creating a client and using that client's runtime OAuth identifier in authorize, token, logout, and connection-discovery flows. In API responses, be careful with naming: an internal client UUID and a runtime OAuth client identifier may both exist.

Client types:

- `traditional`: server-rendered or backend web application that can keep a secret.
- `spa`: browser-only public application; it cannot keep a secret and must use public-client protections such as PKCE.
- `mobile`: native public application; it cannot keep a secret and supports app-scheme redirect URIs.
- `m2m`: machine-to-machine client for service credentials and client-credentials flows.

Client options commonly control redirect URIs, post-logout redirect URIs, allowed origins, grant types, response types, token authentication method, PKCE requirements, registration availability, magic-link availability, DPoP behavior, token lifetimes, and linked identity-provider connections.

## Client Identity Provider Connections

A client identity-provider connection decides which providers are available to a specific client.

This is the object that turns a tenant-level provider into a login option for one app. For example, a tenant can have Google, GitHub, and SAML configured, while the customer portal only shows Google and SAML.

Keep at least one enabled provider connection for a client. If you remove the built-in system provider connection, password login, local self-registration, and magic-link based local account flows will no longer appear for that client.

## First-Party And External Apps

External apps use OAuth client identifiers.

First-party Auth surfaces, such as the Auth console and hosted identity app, use seeded system clients and tenant context. External applications should not depend on first-party tenant-only routes unless they are intentionally building inside the Maintainerd ecosystem.

For external applications, the usual conceptual flow is:

1. Create or choose a tenant.
2. Create an OAuth client for your app.
3. Register redirect URIs, allowed origins, CORS origins, login URIs, and logout URIs.
4. Connect the identity providers that should appear on that client's login page.
5. Send the user through hosted login using the OAuth client identifier.
6. Exchange the authorization result in your application.
7. Validate ID-token and access-token claims.
8. Use the access token for Auth-protected APIs.

Exact authorize URLs, token requests, and discovery responses belong in the API reference.

## Service Identity

A service identity represents a backend service or API principal.

In Auth, a service is an IAM resource owned by the tenant. An `m2m` client can be bound to a service. That binding is a privilege grant because tokens issued to the client can carry service context, and policy checks can resolve that service principal.

Only `m2m` clients can be service-bound. Public clients cannot keep a credential, and traditional clients are user-facing applications rather than machine principals.

Service-bound client options commonly include service binding, allowed scopes, token authentication method, credential material, token lifetime, and policy grants. Exact request and token schema details belong in the API reference.

## Workload Identity Federation

Workload identity federation is for keyless workload authentication.

Instead of storing a long-lived client secret in a deployment platform, you configure a trust rule that accepts an external OIDC token from a workload platform such as Kubernetes, GitHub Actions, GitLab CI, or another issuer you trust. Auth validates issuer, audience, and subject pattern, maps configured attributes, and issues an Auth access token for the mapped client or service.

Federation options commonly include issuer URL, audience, subject claim, subject pattern, allowed scopes, mapped attributes, active status, and target client or service. Federated workload tokens use workload-specific authentication-method and subject-type claims. This makes them different from browser-user sessions even when they access the same authorization layer.

## Sessions And Token Claims

Tokens are the runtime proof that an identity flow completed.

Common claims and roles:

- `sub`: the subject. For user flows, this is the user identifier. For service flows, it can identify the client or service principal.
- `tenant_id`: the tenant identifier. Downstream services use it to keep authorization tenant-aware.
- `client_id`: the OAuth client identifier that requested the token.
- `provider_id`: the token realm. Auth-issued user tokens are anchored to the tenant realm instead of a single upstream provider.
- `sid`: the session identifier, used for session management and logout.
- `amr`: authentication methods used, such as password, OTP, MFA, WebAuthn, SMS, magic link, or workload federation.
- `acr`: authentication context level. Auth uses lower context for single-factor authentication and elevated context for MFA or step-up.
- `sub_type`: subject class for non-standard browser flows, such as service, device, CIBA, or token exchange.
- `svc`: service principal name, present when a service-bound client or workload identity flow acts as a service.

Exact claim shape, token lifetime behavior, signing keys, and validation rules belong in the API reference and token documentation.

## Choosing The Right Identity Shape

Use these common scenarios as a starting point.

- A browser user signs in with email and password: create a tenant user, keep the built-in provider connected to the client, and issue a user session.
- A browser user signs in with Google or GitHub: configure an identity provider, connect it to the client, allow JIT provisioning if desired, then link the provider subject to an Auth user.
- A company wants SAML SSO for employees: create a SAML identity provider, map attributes, optionally map email domains for discovery, and connect that provider to the relevant clients.
- A developer wants their own app to use Auth: create an OAuth client, register redirect/origin/logout URIs, connect the login providers, and use standard OAuth authorization code with PKCE.
- A backend service calls another service: create an IAM service, create an `m2m` client, bind the client to the service, grant explicit scopes, and use client credentials.
- A CI job needs temporary access: create a workload identity federation rule for the external OIDC issuer and map it to the service-bound client.
- A user wants one account with multiple login buttons: keep one Auth user and link multiple user identities.

## Common Mistakes

- Do not treat an identity provider as an OAuth client. The provider is upstream; the client is your downstream app.
- Do not use an internal management client UUID as the runtime OAuth client identifier unless the API response explicitly identifies it as the runtime identifier.
- Do not remove every enabled provider connection from a client. The hosted login page needs those connections to know what to show.
- Do not remove the built-in provider connection if the client should support password login, local registration, or local magic-link login.
- Do not model MFA as a separate user identity. MFA is an authentication method represented by MFA enrollment state and token authentication-method claims.
- Do not use tenant member role as a substitute for IAM roles, permissions, or policy checks.
- Do not bind a service to a `spa`, `mobile`, or `traditional` client. Service binding is only for `m2m` clients.
- Do not put long-lived client secrets into browser or mobile applications. Use public client flows with PKCE.
- Do not assume an email address globally identifies a person. Auth scopes users and linked identities to the tenant.
