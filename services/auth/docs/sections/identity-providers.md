# Identity Providers

Identity providers let Auth accept proof of identity from the built-in Maintainerd account system, social OAuth/OIDC providers, enterprise OIDC providers, and SAML providers.

Use this section when deciding how users sign in, how external identities become Auth users, how providers appear per application, and how provider secrets should be handled. Exact endpoints, request bodies, response schemas, callback contracts, and generated-client examples belong in the API reference.

## Mental Model

An identity provider is upstream from Auth. It proves something about the user. Auth then maps that proof into a tenant-scoped Auth user.

The downstream application should not need to care whether the user signed in with password, Google, GitHub, Microsoft Entra ID, Auth0, Cognito, GitLab, SAML, or another Auth deployment. The application receives Auth-issued identity and access tokens after Auth has resolved tenant, client, provider, user, account-linking, MFA, and policy rules.

Important objects:

- Tenant provider: the provider configuration owned by one tenant.
- User identity: the link between an Auth user and an upstream provider subject.
- Client provider connection: the setting that decides whether a provider appears for one OAuth client.
- Registration flow: onboarding rules that decide whether a provider can create users and which roles new users receive.
- Account-link request: a protected confirmation flow used when an upstream identity might belong to an existing user.

## Provider Types

Auth groups providers by behavior.

- `system`: the built-in Maintainerd identity provider for local Auth accounts.
- `social`: OAuth/OIDC providers commonly used by consumers or developers.
- `enterprise`: OIDC/OAuth2 providers used by organizations and workforce identity systems.
- `saml`: SAML 2.0 identity providers.

The provider type changes which configuration fields matter, how callbacks are processed, how metadata is discovered, and what validation is required.

## Provider Keys

The console exposes provider families so operators can create the right kind of provider without memorizing protocol details.

Common provider keys:

- `maintainerd`: built-in Auth provider for local accounts.
- `saml`: generic SAML provider.
- `cognito`: AWS Cognito.
- `auth0`: Auth0.
- `google`: Google OAuth/OIDC.
- `facebook`: Facebook Login.
- `github`: GitHub OAuth.
- `gitlab`: GitLab OAuth/OIDC.
- `microsoft`: Microsoft or Microsoft Entra ID.
- `linkedin`: LinkedIn.
- `twitter`: X/Twitter.

Provider keys are not the same as OAuth client identifiers. The provider key describes the upstream login system. The OAuth client identifies the downstream application using Auth.

## Built-In Provider

The built-in provider is Auth's local account system. It supports tenant-local users, password login when enabled, local registration when allowed, password recovery, magic-link style flows when enabled, and local account anchoring.

Keep the built-in provider connected to a client when that client should support local email/password, local self-registration, invite registration, or local magic-link flows. Removing it from a client means the hosted login page will no longer show local Auth account options for that application.

The built-in identity should normally remain attached to a user. External identities can be linked and unlinked, but the local Auth identity is the stable account anchor inside the tenant.

## Social Providers

Social providers are external OAuth/OIDC login sources such as Google, GitHub, GitLab, Facebook, LinkedIn, Microsoft, and X/Twitter.

Use social providers when:

- Users should sign in with existing personal or developer accounts.
- You want a low-friction hosted login option.
- The provider is acceptable for the tenant's security and compliance model.
- You want optional just-in-time user creation from social login.

Social provider configuration usually includes a provider app registration, client ID, client secret, scopes, redirect/callback settings, issuer or known endpoints, UserInfo behavior, account-linking behavior, and attribute mapping.

Social provider claims should be treated as upstream data, not as final authorization. Auth should still resolve the tenant user, account status, role assignments, MFA requirements, registration rules, and client policy.

## Enterprise OIDC Providers

Enterprise OIDC providers are organization-managed identity systems such as Auth0, AWS Cognito, Microsoft Entra ID, GitLab, or another Auth deployment.

Use enterprise OIDC providers when:

- A customer or tenant wants workforce SSO.
- The upstream provider has centralized lifecycle and security controls.
- Login should be routed by email domain or tenant policy.
- You want to accept upstream tokens for federation in controlled cases.

Enterprise configuration usually includes issuer, discovery metadata, client ID, client secret, scopes, expected audiences, authorization endpoint, token endpoint, UserInfo endpoint, JWKS, email-domain rules, JIT provisioning behavior, registration behavior, and attribute mapping.

For enterprise SSO, pay close attention to issuer, audience, subject, email verification, and tenant routing. Do not trust an upstream email claim by itself when provider identity and tenant context are not also validated.

## SAML Providers

SAML providers support SAML 2.0 login from enterprise identity systems.

Use SAML when:

- The customer's identity provider is SAML-only.
- Workforce SSO depends on SAML metadata exchange.
- The organization requires signed assertions and SAML attribute mapping.
- You need enterprise login without OAuth/OIDC support from the upstream IdP.

SAML configuration usually includes entity ID, SSO URL, optional SLO URL, signing certificate, NameID format, attribute mapping, Auth service-provider metadata, and assertion consumer service settings.

SAML assertions must be validated carefully. Auth should verify signatures, issuer, audience, destination, time conditions, replay protections, and required attributes before resolving or creating a user.

## Provider Status

Provider status controls whether a provider is usable at runtime.

Common status meanings:

- Active: the provider can appear for connected clients and process login.
- Inactive: the provider exists but should not be offered or used.
- Misconfigured: the provider failed validation or is missing required data.
- Pending: the provider is being configured and should not be used yet.

Provider status is important because the hosted login page should not offer a broken provider. Runtime callback handlers should also reject inactive or misconfigured providers even if a user reaches an old link.

## OIDC/OAuth2 Options

OIDC/OAuth2 providers commonly need these options:

- Issuer: the upstream authority that issued tokens and metadata.
- Client ID: the upstream app identifier registered with the provider.
- Client secret: the upstream app credential; store it as a secret and never return it in plaintext.
- Scopes: claims and user data the provider is asked to return.
- Authorization endpoint: where users authenticate upstream.
- Token endpoint: where Auth exchanges the upstream authorization result.
- UserInfo endpoint: where Auth can fetch additional profile claims.
- JWKS or signing keys: how Auth validates upstream tokens.
- Attribute mapping: how upstream claims become Auth user fields and profile fields.
- Email-domain rules: how home-realm discovery routes users by email domain.
- Allowed audiences: which upstream token audiences Auth accepts when token federation is enabled.
- JIT provisioning flag: whether upstream login can create a user automatically.
- Registration flag: whether this provider can be used for registration.
- Token federation flag: whether Auth can accept upstream tokens for federation scenarios.

Developer behavior:

- Validate issuer and audience before trusting upstream tokens.
- Store client secrets encrypted or through the configured secret provider.
- Use provider discovery when available, but allow explicit endpoints for providers that need manual configuration.
- Treat upstream profile claims as untrusted input until mapped and validated.
- Never expose upstream access tokens or refresh tokens to browser apps or admin list views.

## SAML Options

SAML providers commonly need these options:

- Entity ID: the upstream IdP identifier.
- SSO URL: where Auth sends users for SAML login.
- Optional SLO URL: where logout coordination is supported.
- Signing certificate: used to validate signed assertions.
- NameID format: how the upstream subject is represented.
- Attribute mapping: how assertion attributes map into Auth fields.
- Service-provider metadata: Auth metadata that the upstream IdP needs.
- Assertion Consumer Service settings: where the upstream IdP returns SAML responses.

Developer behavior:

- Require signed assertions or signed responses according to tenant policy.
- Validate audience, destination, recipient, issuer, and time conditions.
- Use replay protection for assertions.
- Map a stable subject claim, not a mutable display name.
- Rotate certificates carefully and test metadata before enabling the provider.

## Attribute Mapping

Attribute mapping translates upstream claims into Auth fields.

Common mapped values:

- Subject: stable upstream user identifier.
- Email: account email.
- Email verified: whether the upstream provider has verified the email.
- Name or display name: profile display value.
- First and last name: structured profile fields.
- Picture or avatar: optional profile image URL.
- Groups or roles: optional upstream authorization hints.
- Locale or timezone: optional profile or metadata values.

Mappings should be explicit. Do not rely on every provider using the same claim names or semantics. For example, one provider may use `email`, another may use a SAML attribute URI, and another may omit verification state entirely.

Groups and upstream roles should not automatically become application permissions unless a tenant policy explicitly maps them. Upstream group names are external data and may not match Auth IAM roles safely.

## Home-Realm Discovery

Home-realm discovery chooses a provider based on the user's email domain or tenant policy.

Use it when a tenant has multiple providers and wants users from specific domains to route to a specific enterprise IdP. For example, a tenant may use local Auth accounts for contractors, Google Workspace for one domain, and SAML for employees.

Important options:

- Email domain list: which domains map to the provider.
- Default provider: fallback when no domain rule matches.
- Client connection: whether the chosen provider is enabled for the requesting application.
- Registration behavior: whether new users can be created from this route.

Developer behavior:

- Normalize domains before comparison.
- Do not route by unverified email after login without validating provider identity.
- Keep home-realm discovery tenant-scoped.
- Hide internal provider details from public discovery responses.

## Just-In-Time Provisioning

JIT provisioning creates an Auth user when a valid upstream login arrives and no matching user exists.

Use JIT provisioning when:

- The tenant trusts the upstream identity provider to create users.
- Users should not need pre-created Auth accounts.
- The provider returns enough stable identity information.
- Registration policy allows the user to enter the tenant.

Be careful with JIT provisioning because it turns login into account creation. It should check tenant status, provider status, client connection, registration settings, email-domain rules, account-linking rules, and role assignment policy before creating a user.

JIT-created users should still have normal Auth account state, profiles, user identities, audit records, and optional role assignment through registration flows.

## Token Federation

Token federation lets Auth accept an upstream token in controlled scenarios and issue an Auth token after validating it.

Use token federation when:

- A trusted upstream provider already authenticated the user or workload.
- You need Auth-issued tokens for downstream Maintainerd services.
- The provider token has a predictable issuer, audience, subject, and signing key.

Important options:

- Allowed audiences.
- Trusted issuer.
- Subject mapping.
- Scope mapping.
- Client or service binding.
- Active status.

Developer behavior:

- Validate issuer, audience, expiry, signature, and subject before exchange.
- Do not accept arbitrary upstream tokens.
- Keep token federation disabled unless the tenant explicitly needs it.
- Audit successful and failed federation attempts.

## Account Linking

Account linking attaches an upstream provider identity to an existing Auth user.

Use account linking when:

- A user already has local password login and wants to add Google, GitHub, Microsoft, SAML, or another provider.
- A social or enterprise login returns an email matching an existing tenant user.
- The hosted account surface lets users manage connected identities.

Do not silently merge accounts based on email alone. Auth should require the user to authenticate as the existing Auth account and confirm the link. This prevents an upstream provider with a matching email from taking over a local account.

## Per-Client Login Options

Identity providers are tenant resources, but login options are exposed per OAuth client.

This means a tenant can configure several providers, then choose which ones appear for each application. A customer portal might show Google and SAML. An admin console might show only the built-in provider plus enterprise SSO. A mobile app might show a different subset.

Client provider connections commonly control:

- Whether the provider is enabled for that client.
- Whether the provider is the default option.
- Display order.
- Whether local registration, password login, or magic-link options are available.
- Whether the provider can be used for registration.

Keep at least one usable login option connected to each client. If every provider connection is removed or inactive, the hosted login page will have nothing useful to show for that app.

## User Journeys

Identity providers participate in several user journeys:

- Hosted login: the user chooses or is routed to a provider, then Auth resolves the upstream proof into an Auth user session.
- Home-realm discovery: Auth chooses a provider from the user's email domain or tenant policy.
- JIT registration: an upstream login creates an Auth user when allowed.
- Invite registration: an invited user completes onboarding through an allowed provider.
- Account linking: a signed-in user attaches an upstream identity to an existing Auth account.
- Provider callback: Auth validates upstream OIDC/OAuth2 or SAML results and continues the Auth flow.
- Account self-service: the user reviews, links, or unlinks external identities.

## Permissions

Identity provider administration should be protected by tenant-scoped management permissions.

Typical permission areas:

- Provider read: list and view configured providers.
- Provider create: add a new OIDC/OAuth2 or SAML provider.
- Provider update: edit provider metadata, mappings, status, or behavior.
- Provider secret update: rotate or replace upstream client secrets and certificates.
- Provider delete: remove a provider when allowed.
- Provider test: run metadata, discovery, or callback validation checks.
- Client provider connection read: view which providers are enabled for clients.
- Client provider connection write: attach, detach, reorder, or set defaults per client.
- User identity read: inspect linked identities.
- User identity write: link or unlink provider identities.

Sensitive actions such as changing provider secrets, enabling JIT provisioning, enabling token federation, replacing SAML certificates, or connecting a provider to a production client should require strong authorization and may require step-up MFA.

## Security Boundaries

Provider configuration contains sensitive material and affects account access.

Security expectations:

- Store provider client secrets, SAML private material, signing secrets, and provider tokens as secrets.
- Return secret presence or status, not plaintext secret values.
- Validate callbacks server-side.
- Validate OIDC issuer, audience, signature, expiry, nonce, and state where applicable.
- Validate SAML signatures, issuer, audience, destination, recipient, time conditions, and replay protections.
- Keep provider configuration tenant-scoped.
- Audit provider creation, update, status change, secret rotation, delete, and connection changes.
- Do not expose upstream access tokens or refresh tokens to browsers or admin list views.

## Events And Audit

Provider changes should emit audit records and, where configured, integration events.

Audit-worthy actions:

- Provider created.
- Provider updated.
- Provider status changed.
- Provider secret rotated.
- Provider certificate changed.
- Provider attached to or detached from a client.
- JIT provisioning enabled or disabled.
- Token federation enabled or disabled.
- User identity linked or unlinked.
- Provider login failed because validation failed.

Audit records should include actor, tenant, provider, action, result, timestamp, request ID, and reason when available. They should not include provider client secrets, upstream tokens, SAML assertions, or raw callback payloads.

## Developer Workflow

For per-client federated login:

1. Confirm the tenant is active.
2. Create or select the identity provider.
3. Configure provider-specific options and secrets.
4. Test discovery, metadata, signing keys, or SAML metadata.
5. Configure attribute mapping.
6. Decide whether JIT provisioning, registration, token federation, and home-realm discovery should be enabled.
7. Attach the provider to the OAuth client that should show it.
8. Confirm the hosted login page shows only the expected providers for that client.
9. Test login with a user that should succeed.
10. Test login with a user that should be rejected.
11. Review audit events and auth events.

## Developer Checklist

Before shipping provider integration, verify:

- Provider belongs to the correct tenant.
- Provider status is active only after configuration has been tested.
- Provider secrets are not returned in responses or logs.
- OIDC issuer, audience, signature, expiry, state, and nonce validation are correct.
- SAML signatures, audience, destination, time conditions, and replay protections are enforced.
- Attribute mapping produces stable user identity keys.
- Email-domain routing is tenant-scoped.
- JIT provisioning is enabled only when tenant policy allows it.
- Token federation is enabled only for trusted issuers and audiences.
- Provider is attached only to clients that should show it.
- At least one usable login method remains for each client.
- Account linking requires explicit confirmation when an existing user may be affected.
- Provider changes are audited.
- API request and response details are documented in the API reference, not duplicated in this conceptual page.

## Troubleshooting

If a provider does not appear on hosted login, check provider status, client provider connection, tenant status, registration settings, display order, and whether the client is using the expected tenant.

If OIDC login fails before returning to Auth, check upstream redirect URI configuration, client ID, client secret, scopes, issuer metadata, and provider availability.

If OIDC callback validation fails, check issuer, audience, state, nonce, token expiry, signing keys, and clock skew.

If SAML login fails, check entity ID, SSO URL, signing certificate, NameID format, assertion audience, ACS configuration, time conditions, and replay protection.

If a user is created unexpectedly, check JIT provisioning, registration flow rules, email-domain routing, and invite-registration behavior.

If a user cannot link an external identity, check whether the provider is active, whether account linking is allowed, whether the upstream subject is already linked, and whether the user confirmed the link from the existing Auth account.
