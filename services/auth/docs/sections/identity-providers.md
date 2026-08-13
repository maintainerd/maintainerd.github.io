# Identity Providers

Identity providers are the login sources Auth can use to prove who a user is. They include the built-in provider, passwordless methods, social providers, enterprise OIDC providers, and SAML providers.

## Where To Find It

In the console, open Identity providers for the tenant.

You should see:

- Provider list.
- Provider detail.
- Provider status.
- Configuration fields.
- Attribute mapping.
- Domain routing.
- Just-in-time provisioning.
- Client connections.
- Security and audit state.

Provider configuration is administrative. Users see the result as login buttons, SSO choices, account linking options, or unavailable methods in the hosted identity UI.

## Provider List

The provider list shows which login sources exist for the tenant.

Common columns:

- Name: administrator-facing provider label.
- Type: built-in, OIDC, OAuth2, SAML, email, SMS, or passwordless.
- Status: enabled, disabled, draft, misconfigured, or error.
- Connected clients: applications allowed to use the provider.
- Domains: email domains or routing hints associated with the provider.
- Last updated: when configuration changed.

A provider can exist but not appear on a login page until it is enabled and connected to the client.

## Provider Detail Fields

Name is the label administrators recognize.

Type decides which protocol and fields apply.

Status controls whether Auth can use the provider.

Client connections decide which applications can show or use the provider.

Scopes decide what information Auth asks from the upstream provider.

Attribute mapping decides how upstream claims become Auth user fields.

Domain routing decides whether email domains send users toward this provider.

JIT provisioning decides whether a provider login can create a new user.

Account linking decides whether an upstream identity can attach to an existing user.

## Built-In Provider

The built-in provider covers local Auth-managed login such as email/password and local account credentials.

Use it when users need Auth-managed accounts or when the tenant does not rely only on external SSO.

Important controls:

- Whether password login is enabled.
- Password policy.
- Password reset behavior.
- Email verification behavior.
- Lockout behavior.
- MFA requirements.

## OIDC And OAuth2 Providers

OIDC and OAuth2 providers let users sign in through external systems such as Google, GitHub, Microsoft, Auth0, Cognito, GitLab, or an enterprise identity system.

Common fields:

- Issuer or authorization server.
- Client ID.
- Client secret.
- Scopes.
- Callback behavior.
- Discovery metadata.
- Attribute mapping.
- Account-linking rules.

Client secrets must stay server-side. Do not expose them in browser configuration or docs pages.

## Brokered Login

Brokered login means Auth sits between your application and an upstream identity provider.

The application talks to Auth. Auth talks to the upstream provider. After the upstream provider proves the user, Auth maps that proof into an Auth user, applies tenant policy, applies client policy, completes MFA or registration when required, and then issues Auth-owned tokens back to the application.

This is important because your application should not need separate login integrations for Google, Microsoft, GitHub, SAML, and every customer IdP. The app integrates with Auth once. Auth brokers the provider-specific details.

Brokered login flow:

1. The application sends the user to Auth.
2. Auth resolves tenant and client context.
3. Auth shows the providers connected to that client.
4. The user chooses a provider.
5. Auth sends the user to the upstream provider.
6. The upstream provider returns the user to Auth.
7. Auth validates issuer, signature, audience, state, nonce, time, and provider-specific requirements.
8. Auth maps the upstream subject and claims.
9. Auth links or creates the Auth user only when policy allows it.
10. Auth completes MFA, consent, or registration steps when required.
11. Auth redirects the user back to the application.

The application receives Auth tokens, not raw upstream provider tokens.

## Federation

Federation is the trust relationship between Auth and another identity system.

Use federation when:

- A tenant wants users to sign in with a company identity provider.
- A customer has an existing OIDC or SAML provider.
- A product wants social login without building each provider directly into every app.
- A service needs Auth to normalize identities from multiple upstream systems.

Federation does not mean every upstream account automatically becomes a valid Auth user. Tenant policy still decides whether JIT provisioning is enabled, whether invites are required, whether email domains are allowed, whether MFA is required, and which client can use the provider.

Federated identity fields to understand:

- Provider subject: the stable upstream identifier for the user.
- Issuer or entity ID: the upstream system that made the assertion.
- Email claim: useful for display and matching, but not enough by itself for safe linking.
- Verification claim: whether the upstream provider says the email was verified.
- Groups or roles: optional upstream authorization hints that must be mapped deliberately.
- Auth user: the tenant-scoped user record created or linked after validation.

Auth should be the policy point. The upstream provider proves identity; Auth decides how that proof applies inside the tenant.

## SAML Providers

SAML providers support enterprise SSO where the upstream identity system sends signed assertions.

Common fields:

- Entity ID.
- SSO URL.
- Signing certificate.
- NameID format.
- Attribute mapping.
- Assertion validation behavior.
- Certificate rotation state.

SAML setup should be tested with the tenant's identity team before production rollout.

## Attribute Mapping

Attribute mapping tells Auth how to translate upstream identity data into Auth user data.

Common mappings:

- Stable subject.
- Email.
- Email verification.
- Display name.
- First and last name.
- Avatar.
- Locale.
- Groups or roles where supported.

Use stable provider subject as the identity key. Do not link accounts by email alone unless the email is verified and policy explicitly allows it.

## Client Connections

Connecting a provider to a client allows that application to use the provider during login.

This is why a provider may be configured but not visible on a login page. The tenant provider must be enabled, the client must be active, and the provider must be connected to that client.

## JIT Provisioning

Just-in-time provisioning lets Auth create a user during provider login.

Use it when:

- The tenant trusts the provider to introduce users.
- Default roles are conservative.
- Email-domain or group rules are clear.
- Registration policy allows provider-created accounts.

Avoid JIT when every user must be explicitly invited or approved first.

## Account Linking

Account linking connects an external provider identity to an existing Auth user.

Use it when the same person should be able to sign in with multiple methods. Require fresh proof and protect against takeover when provider emails match existing accounts.

Do not let users unlink their last usable login method unless recovery is available.

## Permissions And Security

Provider management requires tenant provider permissions. Creating, enabling, disabling, or changing provider secrets should require strong permissions and audit records.

Sensitive provider actions include:

- Enabling a provider.
- Changing client secret or certificate.
- Changing attribute mapping.
- Enabling JIT provisioning.
- Enabling account linking.
- Connecting a provider to a production client.
- Disabling the only working login method.

## Common Workflow

1. Open Identity providers.
2. Create or select the provider.
3. Choose provider type.
4. Fill protocol-specific fields.
5. Configure attribute mapping.
6. Decide whether JIT provisioning and account linking are allowed.
7. Enable the provider.
8. Connect it to a client.
9. Test login in the hosted identity UI.
10. Review security events and audit records.

## Troubleshooting

If a provider does not appear on the login page, check provider status, client connection, tenant status, client status, and login policy.

If callback validation fails, check issuer, client credentials, redirect configuration, state, nonce, certificates, and clock skew.

If users are created unexpectedly, check JIT provisioning, registration flow, domain routing, and default role rules.

If account linking attaches the wrong account, check subject mapping and email verification policy immediately.
