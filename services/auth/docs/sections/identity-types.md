# Identity Types

Auth separates identity into several concrete objects because each object answers a different question:

- Who owns the boundary? The tenant.
- Who is the human? The user.
- What is that user's relationship to the tenant? The tenant member.
- What personal details can the user present? The profile.
- Which authentication source proved the user? The identity provider and user identity.
- Which application is asking Auth to sign someone in? The client.
- Which backend service or workload is acting without a browser user? The service identity or workload federation.
- What proof is being carried at runtime? The session and token claims.

That separation is important for developers. It lets one tenant use local password login, Google, GitHub, Microsoft Entra ID, Auth0, Cognito, GitLab, SAML, or another Auth deployment without changing the external application's OAuth integration. It also lets a user link several upstream identities while still remaining one tenant-scoped Auth user.

## Quick Map

Use this map when deciding which Auth object you need to create or inspect.

- Tenant: the isolation boundary for users, clients, providers, roles, services, APIs, policies, registration flows, branding, messaging, events, and security settings.
- User: the human account inside one tenant.
- Tenant member: the user's tenant relationship and tenant-level administrative role, such as `owner`, `admin`, or `member`.
- Profile: the user's display and personal information.
- Identity provider: the built-in or upstream system that can authenticate a user.
- User identity: the link between a user and a provider subject, such as `provider=google` and `sub=10987654321`.
- Client: the downstream OAuth/OIDC application that redirects users to Auth.
- Client identity provider connection: the join that decides which login options appear for one client.
- Service: an API/resource principal inside the tenant.
- Service-bound client: an `m2m` client that can act as a service and receive a `svc` claim.
- Workload identity federation: a trust rule that lets an external workload exchange its OIDC token for an Auth access token without storing a long-lived client secret.
- Session and token: runtime proof containing claims such as `sub`, `client_id`, `tenant_id`, `provider_id`, `sid`, `amr`, `acr`, `sub_type`, and sometimes `svc`.

## Tenant

A tenant is the ownership and isolation boundary.

Users are tenant-scoped. Auth treats email and username uniqueness as tenant-local, so the same email address can exist as separate accounts in different tenants. A tenant also owns the objects that shape authentication and authorization: clients, identity providers, roles, permissions, policies, services, APIs, registration flows, invites, branding, templates, messaging configuration, webhook configuration, and security settings.

For standalone deployments, you may run Auth with one tenant and treat it as the identity boundary for your application. In the Maintainerd ecosystem, Auth can also be operated under a control plane where tenant creation, first-party clients, and platform services are coordinated by the wider system.

Example tenant shape:

```json
{
  "tenant_id": "6a6eb931-3f50-4f60-81c1-15b3be0c9f4a",
  "name": "acme",
  "display_name": "Acme",
  "status": "active",
  "is_system": false
}
```

## User

A user is the human account inside a tenant.

The user record stores the account identity Auth owns: username, email, phone, password hash, status, verification state, MFA enrollment flags, password lifecycle fields, login counters, metadata, and audit fields. It is not the same thing as a Google account, GitHub account, SAML subject, or application client.

Important user rules:

- A user belongs to one tenant.
- A user can authenticate with the built-in provider if password or passwordless login is enabled for the client.
- A user can have linked upstream identities from external providers.
- A user can enroll MFA methods such as TOTP, WebAuthn, SMS, or backup-code based flows.
- A user can hold tenant roles and permissions through Auth's IAM model.

Example user shape:

```json
{
  "user_id": "1d8f6cb5-920f-4c35-bd8a-cb4ce2a92598",
  "tenant_id": "6a6eb931-3f50-4f60-81c1-15b3be0c9f4a",
  "email": "mira@example.com",
  "username": "mira",
  "status": "active",
  "is_email_verified": true,
  "is_totp_enabled": true,
  "is_webauthn_enabled": false
}
```

## Tenant Member

A tenant member is the user's relationship to a tenant.

The member row answers: "What tenant-level role does this user have?" Auth supports the built-in member roles:

- `owner`: tenant owner.
- `admin`: tenant administrator.
- `member`: regular tenant member.

Do not use a tenant member as the user's login identity. The user is the account. The member is the tenant relationship around that account. This distinction matters when you build admin screens, tenant switchers, audit logs, or owner-transfer workflows.

Example member shape:

```json
{
  "tenant_member_id": "8458334e-a94a-4bf7-8ea3-51bec0bbca26",
  "tenant_id": "6a6eb931-3f50-4f60-81c1-15b3be0c9f4a",
  "user_id": "1d8f6cb5-920f-4c35-bd8a-cb4ce2a92598",
  "role": "admin"
}
```

## Profile

A profile stores user-facing personal details.

Use the profile for display and personal information such as first name, middle name, last name, display name, birthdate, gender, profile URL, default profile flag, and metadata. Keep authentication decisions anchored to the user, identity provider, user identity, member, role, permission, and policy records instead of a display profile.

Example profile shape:

```json
{
  "display_name": "Mira Reyes",
  "first_name": "Mira",
  "last_name": "Reyes",
  "gender": "prefer_not_to_say",
  "profile_url": "https://cdn.example.com/profiles/mira.png",
  "is_default": true
}
```

## Identity Providers

An identity provider is the authentication source Auth can use for sign-in, linking, and federation.

Auth supports these provider types:

- `system`: the built-in Auth provider, represented by `provider=maintainerd`.
- `social`: consumer OAuth/OIDC providers such as Google, GitHub, GitLab, Facebook, LinkedIn, Microsoft, and X.
- `enterprise`: enterprise OIDC providers such as Auth0, AWS Cognito, Microsoft Entra ID, GitLab, or another Auth deployment.
- `saml`: SAML 2.0 providers.

Provider records are tenant-scoped and include the provider key, display name, provider type, public identifier, status, JIT provisioning behavior, registration behavior, token-federation behavior, optional email-domain routing, optional upstream token audiences, and connection details such as issuer, client ID, encrypted client secret, OAuth endpoints, SAML entity metadata, certificates, and attribute mappings.

Example OIDC provider:

```json
{
  "identifier": "google-workspace",
  "display_name": "Google Workspace",
  "provider": "google",
  "provider_type": "social",
  "issuer": "https://accounts.google.com",
  "provider_client_id": "1234567890-example.apps.googleusercontent.com",
  "allow_jit_provisioning": true,
  "allow_registration": true,
  "allow_token_federation": false,
  "email_domains": ["example.com"],
  "status": "active"
}
```

Example SAML provider:

```json
{
  "identifier": "okta-saml",
  "display_name": "Okta SAML",
  "provider": "saml",
  "provider_type": "saml",
  "config": {
    "entity_id": "https://idp.example.com/app/acme/saml",
    "sso_url": "https://idp.example.com/app/acme/sso/saml",
    "name_id_format": "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
    "attribute_mapping": {
      "email": "email",
      "name": "displayName"
    }
  },
  "allow_jit_provisioning": true,
  "status": "active"
}
```

Provider secrets are server-side credentials. They should be configured through the management surface or environment/secret process for your deployment, and should never be returned to browser applications.

## User Identities

A user identity links one Auth user to one provider subject.

The important fields are:

- `tenant_id`: keeps the link inside one tenant.
- `user_id`: the Auth user that owns the link.
- `identity_provider_id`: the configured provider.
- `provider`: the provider key such as `maintainerd`, `google`, `github`, `microsoft`, or `saml`.
- `sub`: the provider's stable subject for that user.
- `metadata`: normalized upstream claims such as email, name, picture, locale, and verification state.
- `jit_provisioned_at`: when Auth created the user from an upstream login.
- `provisioning_source`: where the identity came from.

The built-in provider anchors a local Auth account. When a user signs in with an external provider and JIT provisioning is allowed, Auth still creates or resolves a local user and records the external provider subject as a linked identity. That means the downstream app deals with one Auth user even if the user can sign in through multiple providers.

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
    "name": "Mira Reyes",
    "picture": "https://avatars.githubusercontent.com/u/98453412"
  }
}
```

## Account Linking

Account linking protects users when an upstream provider returns an email address that already belongs to a local Auth account.

Instead of silently merging accounts, Auth creates a short-lived account-link request. The user must authenticate as the existing Auth account in the same tenant and confirm the link. After confirmation, Auth attaches the external `(provider, sub)` pair to the existing user.

Use account linking when:

- A user already has password login and later wants to add Google, GitHub, Microsoft, SAML, or another external provider.
- A social login returns the same email as an existing tenant user.
- You want the hosted account surface to let users manage their connected identities.

Do not unlink the built-in system identity from a user. External identities can be linked and unlinked, but the local Auth identity is the anchor that keeps the account stable inside the tenant.

## Login Methods

A login method is not the same thing as an identity type.

Login methods are ways a user proves control of an account. Auth can expose password login, self-registration, invite registration, passwordless magic link, external OAuth/OIDC login, SAML login, and MFA step-up methods. MFA methods such as TOTP, WebAuthn, SMS, and backup codes strengthen an existing login; they do not create a separate user identity type.

The hosted identity app asks Auth which login methods to show for a client through:

```http
GET /oauth/connections?client_id=your-oauth-client-id
```

The response can include:

```json
{
  "password_enabled": true,
  "registration_enabled": true,
  "magic_link_enabled": false,
  "connections": [
    {
      "identifier": "google-workspace",
      "display_name": "Google Workspace",
      "provider": "google",
      "provider_type": "social",
      "is_default": true,
      "display_order": 0
    }
  ]
}
```

The login options come from the client's enabled identity-provider connections. Registration requirements are resolved separately from the registration context, so changing a registration flow should not change which sign-in buttons appear.

## Clients

A client is the downstream OAuth/OIDC application that uses Auth.

External applications integrate by creating a client and using that client's OAuth `client_id` in authorize, token, logout, and connection-discovery flows. In API responses, be careful with naming: the management `client_id` field may be the client's public UUID, while the OAuth `client_id` that your app uses at runtime is the client's `identifier`.

Client types:

- `traditional`: server-rendered or backend web application that can keep a secret.
- `spa`: browser-only public application; it cannot keep a secret and uses `token_endpoint_auth_method=none`.
- `mobile`: native public application; it cannot keep a secret and supports app-scheme redirect URIs.
- `m2m`: machine-to-machine client for service credentials and client-credentials flows.

Example SPA client:

```json
{
  "name": "customer-portal",
  "display_name": "Customer Portal",
  "client_type": "spa",
  "domain": "https://portal.example.com",
  "identifier": "customer-portal_7KS2bV9E",
  "grant_types": ["authorization_code", "refresh_token"],
  "response_types": ["code"],
  "token_endpoint_auth_method": "none",
  "require_pkce": true,
  "allow_registration": true,
  "allow_magic_link": false
}
```

Example traditional web client:

```json
{
  "name": "admin-web",
  "display_name": "Admin Web",
  "client_type": "traditional",
  "domain": "https://admin.example.com",
  "identifier": "admin-web_Qv94De1Z",
  "token_endpoint_auth_method": "client_secret_basic",
  "grant_types": ["authorization_code", "refresh_token"],
  "response_types": ["code"],
  "require_pkce": true
}
```

## Client Identity Provider Connections

A client identity-provider connection decides which providers are available to a specific client.

This is the object that turns a tenant-level provider into a login option for one app. For example, a tenant can have Google, GitHub, and SAML configured, while the customer portal only shows Google and SAML.

Example connection list for one client:

```json
[
  {
    "client": "customer-portal_7KS2bV9E",
    "provider": "maintainerd",
    "enabled": true,
    "is_default": true,
    "display_order": 0
  },
  {
    "client": "customer-portal_7KS2bV9E",
    "provider": "google-workspace",
    "enabled": true,
    "is_default": false,
    "display_order": 10
  },
  {
    "client": "customer-portal_7KS2bV9E",
    "provider": "okta-saml",
    "enabled": true,
    "is_default": false,
    "display_order": 20
  }
]
```

Keep at least one enabled provider connection for a client. If you remove the built-in system provider connection, password login, local self-registration, and magic-link based local account flows will no longer appear for that client.

## First-Party And External Apps

External apps use `client_id`.

First-party Auth surfaces, such as the Auth console and hosted identity app, use seeded system clients and tenant context. External applications should not depend on first-party tenant-only routes unless they are intentionally building inside the Maintainerd ecosystem.

For external applications, the usual shape is:

1. Create or choose a tenant.
2. Create an OAuth client for your app.
3. Register redirect URIs, allowed origins, CORS origins, login URIs, and logout URIs.
4. Connect the identity providers that should appear on that client's login page.
5. Send the user to the hosted authorize URL with the OAuth client identifier.
6. Exchange the authorization code in your application.
7. Validate the ID token and use the access token for Auth-protected APIs.

Example authorize request:

```http
GET /oauth/authorize?client_id=customer-portal_7KS2bV9E&response_type=code&scope=openid%20profile%20email&redirect_uri=https%3A%2F%2Fportal.example.com%2Fauth%2Fcallback&state=opaque-state&nonce=opaque-nonce&code_challenge=base64url-sha256&code_challenge_method=S256
```

## Service Identity

A service identity represents a backend service or API principal.

In Auth, a service is an IAM resource owned by the tenant. An `m2m` client can be bound to a service. That binding is a privilege grant because tokens issued to the client can carry the `svc` claim, and policy checks can resolve that service principal.

Only `m2m` clients can be service-bound. Public clients cannot keep a credential, and traditional clients are user-facing applications rather than machine principals.

Example service-bound client:

```json
{
  "name": "billing-worker",
  "display_name": "Billing Worker",
  "client_type": "m2m",
  "service_id": "f3fb5cd3-a446-4737-8c9e-302048542f2e",
  "identifier": "billing-worker_V1Xr9Q",
  "token_endpoint_auth_method": "client_secret_basic",
  "grant_types": ["client_credentials"],
  "allowed_scopes": ["billing:read", "billing:write"]
}
```

When the client authenticates successfully, Auth can issue an access token with service context:

```json
{
  "sub": "billing-worker_V1Xr9Q",
  "sub_type": "service",
  "client_id": "billing-worker_V1Xr9Q",
  "svc": "billing",
  "scope": "billing:read billing:write",
  "tenant_id": "6a6eb931-3f50-4f60-81c1-15b3be0c9f4a"
}
```

## Workload Identity Federation

Workload identity federation is for keyless workload authentication.

Instead of storing a long-lived client secret in a deployment platform, you configure a trust rule that accepts an external OIDC token from a workload platform such as Kubernetes, GitHub Actions, GitLab CI, or another issuer you trust. Auth validates issuer, audience, and subject pattern, maps configured attributes, and issues an Auth access token for the mapped client/service.

Example federation rule:

```json
{
  "name": "github-actions-release",
  "client_id": "billing-worker-client-uuid",
  "issuer_url": "https://token.actions.githubusercontent.com",
  "audience": "maintainerd-auth",
  "subject_claim": "sub",
  "subject_pattern": "repo:acme/billing:ref:refs/heads/main",
  "allowed_scopes": ["billing:deploy"],
  "attribute_mapping": {
    "repository": "repository",
    "workflow": "workflow",
    "ref": "ref"
  },
  "is_active": true
}
```

Federated workload tokens use `amr=["wif"]` and `sub_type="service"`. This makes them different from browser-user sessions even when they access the same authorization layer.

## Sessions And Token Claims

Tokens are the runtime proof that an identity flow completed.

Common claims:

- `sub`: the subject. For user flows, this is the user UUID. For service flows, it can be the client or service principal subject.
- `tenant_id`: the tenant UUID. Auth uses the opaque tenant UUID in tokens, not the internal database key.
- `client_id`: the OAuth client identifier that requested the token.
- `provider_id`: the token realm. Auth-issued user tokens are anchored to the tenant realm instead of a single upstream provider.
- `sid`: the session identifier, used for session management and logout.
- `amr`: authentication methods used, such as `pwd`, `otp`, `mfa`, `webauthn`, `sms`, `magic_link`, or `wif`.
- `acr`: authentication context level. Auth uses `1` for single-factor authentication and `2` for MFA or elevated context.
- `sub_type`: subject class for non-standard browser flows, such as `service`, `device`, `ciba`, or `exchange`.
- `svc`: service principal name, present when a service-bound client or workload identity flow acts as a service.

Example user token claims:

```json
{
  "sub": "1d8f6cb5-920f-4c35-bd8a-cb4ce2a92598",
  "tenant_id": "6a6eb931-3f50-4f60-81c1-15b3be0c9f4a",
  "client_id": "customer-portal_7KS2bV9E",
  "provider_id": "acme",
  "scope": "openid profile email",
  "sid": "sess_01JZK0N6RX8AJYJ11NVKJ2PGPS",
  "amr": ["pwd", "otp"],
  "acr": "2"
}
```

## Choosing The Right Identity Shape

Use these common scenarios as a starting point.

- A browser user signs in with email and password: create a tenant user, keep the built-in provider connected to the client, and issue a user session.
- A browser user signs in with Google or GitHub: configure an identity provider, connect it to the client, allow JIT provisioning if desired, then link the provider subject to an Auth user.
- A company wants SAML SSO for employees: create a SAML identity provider, map attributes, optionally map email domains for discovery, and connect that provider to the relevant clients.
- A developer wants their own app to use Auth: create an OAuth client, register redirect/origin/logout URIs, connect the login providers, and use standard OAuth authorization code with PKCE.
- A backend service calls another service: create an IAM service, create an `m2m` client, bind the client to the service, grant explicit scopes, and use `client_credentials`.
- A CI job needs temporary access: create a workload identity federation rule for the external OIDC issuer and map it to the service-bound client.
- A user wants one account with multiple login buttons: keep one Auth user and link multiple user identities.

## Common Mistakes

- Do not treat an identity provider as an OAuth client. The provider is upstream; the client is your downstream app.
- Do not use the management client UUID as the OAuth `client_id` unless the API response explicitly identifies it as the runtime `identifier`.
- Do not remove every enabled provider connection from a client. The hosted login page needs those connections to know what to show.
- Do not remove the built-in provider connection if the client should support password login, local registration, or local magic-link login.
- Do not model MFA as a separate user identity. MFA is an authentication method recorded through `amr` and represented by MFA enrollment state.
- Do not use tenant member role as a substitute for IAM roles, permissions, or policy checks.
- Do not bind a service to a `spa`, `mobile`, or `traditional` client. Service binding is only for `m2m` clients.
- Do not put long-lived client secrets into browser or mobile applications. Use public client flows with PKCE.
- Do not assume an email address globally identifies a person. Auth scopes users and linked identities to the tenant.
