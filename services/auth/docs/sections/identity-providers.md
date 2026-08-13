# Identity Providers

Identity providers are the login sources Auth can use to prove who a user is. A provider can be local to Auth, such as the built-in Maintainerd provider, or external, such as another Maintainerd Auth deployment, Google, Microsoft Entra ID, GitHub, GitLab, Okta, Auth0, a generic OIDC issuer, or a SAML identity provider.

Use this page when configuring provider records from the Auth console. Endpoint paths, payloads, response schemas, and generated client examples belong in the API reference.

## Where To Find It

In the console, open the tenant, then open **Identity providers**.

The area usually contains:

- Provider list.
- Create provider.
- Provider detail.
- Provider status.
- Protocol configuration.
- Credentials and certificates.
- Scopes or requested attributes.
- Attribute mapping.
- Domain routing.
- Just-in-time provisioning.
- Account linking.
- Client connections.
- Test connection or test login.
- Security and audit state.

Provider configuration is administrative. Users see the result as login buttons, SSO choices, account-linking options, invite registration options, or unavailable login methods in the hosted identity UI.

## How Identity Providers Fit Into Auth

Applications integrate with Auth, not directly with every upstream provider. Auth then brokers login to the selected provider, validates the upstream result, maps claims into a tenant-scoped Auth user, applies tenant policy, applies client policy, completes MFA, registration, or consent when required, and issues Auth-owned tokens to the application.

This matters because one application client can support several login methods without implementing Google, Microsoft, GitHub, SAML, and customer-specific OIDC separately. The application trusts Auth as its issuer. Auth decides which upstream providers are allowed for each tenant and client.

Identity provider configuration affects:

- Which login methods appear on the hosted identity UI.
- Whether an upstream login can create a new user.
- Whether an upstream identity can link to an existing user.
- Which email domains route users to enterprise SSO.
- Which claims become Auth user profile fields.
- Which clients can use the provider.
- Which audit and security events are created during login.

## Provider List

The provider list shows login sources configured for the selected tenant.

Common columns:

- Name: administrator-facing provider label.
- Type: built-in, Maintainerd, OIDC, OAuth2, SAML, email, SMS, or passwordless.
- Status: draft, enabled, disabled, misconfigured, or error.
- Connected clients: applications allowed to show the provider.
- Domains: email domains or routing hints associated with the provider.
- JIT provisioning: whether provider login can create users.
- Updated: when configuration last changed.

A provider can exist without appearing on a login page. It must be enabled, connected to the client, allowed by registration and security policy, and valid for the current tenant.

## Provider Detail Fields

Name is the label administrators see in the console. It may also appear to users as a login button label, so use a name users recognize, such as `Google`, `Microsoft`, `GitHub`, `Acme SSO`, or `Maintainerd`.

Type decides which protocol and configuration fields apply.

Status controls whether Auth can use the provider for login or account linking.

Client connections decide which application clients can show or use the provider.

Issuer identifies the upstream OIDC provider. It must match the issuer value in tokens and discovery metadata.

Authorization URL, token URL, UserInfo URL, and JWKS URL are used when the provider is OAuth2/OIDC but discovery is not available or not sufficient.

Client ID is the public identifier issued by the upstream provider for Auth.

Client secret is the credential issued by the upstream provider for Auth. Store it as a protected provider secret and never expose it in frontend configuration.

Scopes define which identity data Auth asks from the upstream provider. For OIDC login, use `openid`, then add `email` and `profile` when the provider supports them.

Redirect URI or callback URL is the Auth URL that the upstream provider sends the browser back to after login. Copy the exact value shown in Auth into the upstream provider's app registration.

Attribute mapping decides how upstream claims become Auth user fields.

Domain routing decides whether email domains send users toward this provider before the user manually chooses a login method.

JIT provisioning decides whether a provider login can create a new Auth user.

Account linking decides whether an upstream identity can attach to an existing Auth user.

Allowed audiences are used when Auth accepts upstream tokens or validates provider-specific audiences.

SAML entity ID, SSO URL, SLO URL, and signing certificate are used for SAML providers.

## Built-In Maintainerd Provider

The built-in Maintainerd provider is created during setup. It represents Auth-managed local login for the tenant.

Use it when users need local Auth accounts, email/password login, password reset, account recovery, or when the tenant should continue to support local credentials alongside external SSO.

The built-in provider is different from adding Maintainerd as an external identity provider. The built-in provider uses the current Auth deployment's own user store. An external Maintainerd provider trusts another organization's Maintainerd Auth deployment as an upstream OIDC issuer.

Common controls:

- Password login availability.
- Email verification behavior.
- Password reset behavior.
- Magic-link behavior where enabled.
- Lockout behavior.
- MFA requirements.
- Account recovery behavior.

Typical setup:

1. Open **Identity providers**.
2. Confirm the seeded **Maintainerd** provider exists.
3. Open the provider detail.
4. Confirm local login methods that the tenant should allow.
5. Confirm password, verification, lockout, and MFA policy in the tenant security settings.
6. Configure messaging before enabling email verification, password reset, magic links, or email MFA.
7. Connect the built-in provider to each client that should show local login.
8. Test login through the hosted identity UI.

Do not disable the only working login method for tenant administrators. Add and test an external provider before removing local admin access.

## Maintainerd As An External Provider

Use Maintainerd as an external provider when another organization also runs Maintainerd Auth and your tenant wants to trust that organization's Auth deployment for login.

In this model:

- The upstream organization runs its own Maintainerd Auth.
- Your Auth tenant creates an external provider that points to the upstream Maintainerd issuer.
- The upstream Maintainerd Auth creates a client for your Auth deployment.
- Users authenticate at the upstream organization.
- Your Auth deployment receives the upstream identity result, maps it to a tenant user, applies local tenant policy, and issues local Auth tokens to your application.

This is still brokered login. Your application continues to integrate with your Auth deployment.

### Maintainerd External Provider Setup

In your Auth console:

1. Open the target tenant.
2. Open **Identity providers**.
3. Choose **Create provider**.
4. Choose **Maintainerd** if available, or choose **OIDC**.
5. Enter a provider name such as `Acme Maintainerd SSO`.
6. Copy the redirect URI or callback URL shown by Auth for this provider.
7. Leave the provider in draft while configuring the upstream side.

In the upstream organization's Maintainerd Auth console:

1. Open the upstream tenant that owns the users.
2. Open **Applications** or **Clients**.
3. Create a confidential web client for your Auth deployment.
4. Use a recognizable name, such as `Example Auth federation`.
5. Add the redirect URI copied from your Auth provider screen.
6. Enable authorization code flow.
7. Enable PKCE if the upstream deployment requires it for web clients.
8. Set scopes to include `openid`, `email`, and `profile`.
9. Configure consent according to the upstream organization's policy.
10. Save the client.
11. Copy the upstream issuer URL, client ID, and client secret.

Back in your Auth console:

1. Paste the upstream issuer URL.
2. Paste the upstream client ID.
3. Paste the upstream client secret.
4. Set scopes to `openid email profile` unless the upstream organization requires a narrower set.
5. Map subject from `sub`.
6. Map email from `email`.
7. Map email verification from `email_verified` when available.
8. Map display name from `name`.
9. Map avatar from `picture` when available.
10. Configure domain routing if users with specific email domains should be sent to this provider.
11. Decide whether JIT provisioning is allowed.
12. Decide whether account linking is allowed.
13. Test the provider connection.
14. Enable the provider.
15. Connect the provider to the application clients that should offer this login option.
16. Test login from the hosted identity UI.

Use verified email only as a matching signal. The stable identity key should be the upstream issuer plus upstream subject.

## Generic OIDC Provider

Use a generic OIDC provider for any upstream identity system that publishes OIDC discovery metadata and issues ID tokens.

Information to collect from the upstream provider:

- Issuer URL.
- Client ID.
- Client secret or private-key authentication configuration.
- Redirect URI registered at the provider.
- Supported scopes.
- Claim names for subject, email, email verification, name, and groups.
- JWKS or discovery metadata availability.
- Logout behavior if single logout is required.

Upstream provider setup:

1. Sign in to the upstream provider's administrator console.
2. Create an OIDC application or OAuth application for Auth.
3. Choose web application or confidential application when Auth will hold a server-side secret.
4. Add the redirect URI copied from Auth.
5. Allow authorization code flow.
6. Enable `openid`, `email`, and `profile` scopes when supported.
7. Disable implicit or password grants unless the provider specifically requires them for its own product.
8. Save the application.
9. Copy the issuer URL, client ID, and client secret.

Auth setup:

1. Open **Identity providers** in the tenant.
2. Create an OIDC provider.
3. Enter the issuer URL.
4. Enter the client ID and client secret.
5. Enter scopes.
6. Configure attribute mapping.
7. Configure domain routing if needed.
8. Configure JIT provisioning and account linking.
9. Test discovery and login.
10. Enable the provider.
11. Connect it to one or more clients.

## Google Provider

Use Google when users should sign in with Google accounts or Google Workspace accounts.

In Google Cloud:

1. Open the Google Cloud console.
2. Select or create the project that owns the OAuth app.
3. Configure the OAuth consent screen.
4. Open **APIs & Services**.
5. Open **Credentials**.
6. Create an OAuth client ID.
7. Choose **Web application**.
8. Add the redirect URI copied from Auth under authorized redirect URIs.
9. Save the OAuth client.
10. Copy the client ID and client secret.

In Auth:

1. Open **Identity providers**.
2. Create a Google provider or a generic OIDC provider.
3. Enter the Google issuer URL when using generic OIDC.
4. Enter the Google client ID and client secret.
5. Set scopes to `openid email profile`.
6. Map subject from `sub`.
7. Map email from `email`.
8. Map email verification from `email_verified`.
9. Map display name from `name`.
10. Map avatar from `picture`.
11. Add domain routing for Google Workspace domains when the tenant should route those users to Google automatically.
12. Configure JIT provisioning only when the tenant trusts Google or the selected Workspace domains to introduce users.
13. Test login.
14. Enable the provider.
15. Connect it to the required application clients.

Use domain routing carefully. A public Gmail address should not automatically imply membership in a private tenant.

## Microsoft Entra ID Provider

Use Microsoft Entra ID when users should sign in with Microsoft work, school, or tenant-managed accounts.

In Microsoft Entra admin center:

1. Open **Identity**.
2. Open **Applications**.
3. Open **App registrations**.
4. Choose **New registration**.
5. Enter a name for the application.
6. Choose the supported account type: single tenant for one organization, or multitenant when several Entra tenants may use the provider.
7. Add a web redirect URI copied from Auth.
8. Register the application.
9. Copy the application client ID.
10. Copy the tenant ID when using a tenant-specific issuer.
11. Open **Certificates & secrets**.
12. Create a client secret.
13. Copy the secret value before leaving the page.

In Auth:

1. Open **Identity providers**.
2. Create a Microsoft provider or generic OIDC provider.
3. Enter the issuer for the Entra tenant or multitenant authority selected by your policy.
4. Enter the application client ID.
5. Enter the client secret.
6. Set scopes to include `openid`, `email`, and `profile` when available.
7. Map subject from the stable upstream subject claim.
8. Map email from the email or preferred username claim selected for the tenant.
9. Map display name from `name`.
10. Configure domain routing for the organization's verified email domains.
11. Decide whether JIT provisioning is allowed.
12. Test login with a user from the intended Entra tenant.
13. Enable the provider.
14. Connect it to the required clients.

For enterprise tenants, prefer a tenant-specific issuer unless the product intentionally supports multitenant Microsoft login.

## GitHub Provider

Use GitHub when users should sign in with GitHub accounts.

In GitHub:

1. Open GitHub settings for the account or organization that should own the OAuth app.
2. Open **Developer settings**.
3. Open **OAuth Apps**.
4. Choose **New OAuth App**.
5. Enter the application name.
6. Enter the application homepage URL.
7. Enter the authorization callback URL copied from Auth.
8. Register the application.
9. Copy the client ID.
10. Generate and copy the client secret.

In Auth:

1. Open **Identity providers**.
2. Create a GitHub provider or OAuth2 provider.
3. Enter the GitHub client ID.
4. Enter the GitHub client secret.
5. Configure scopes needed for login. Use the minimum scopes required to receive identity and email information.
6. Map the stable provider subject from the GitHub user ID.
7. Map username from the GitHub login name if useful.
8. Map email from the verified email data returned by GitHub.
9. Configure account linking conservatively because GitHub users may have multiple email addresses.
10. Test login.
11. Enable the provider.
12. Connect it to the required clients.

GitHub OAuth Apps have a stricter callback model than some OIDC providers. If different Auth environments or tenants need different callback URLs, create separate GitHub OAuth apps.

## GitLab Provider

Use GitLab when users should sign in with GitLab.com or a self-managed GitLab instance.

In GitLab:

1. Open the user, group, or instance administration area that should own the OAuth application.
2. Open **Applications**.
3. Create a new application.
4. Enter a name for Auth.
5. Add the redirect URI copied from Auth.
6. Mark the application confidential when GitLab should issue a secret for server-side use.
7. Select scopes required for login, usually identity-oriented scopes such as OpenID, profile, and email when available.
8. Save the application.
9. Copy the application ID.
10. Copy the secret.
11. Note the GitLab base URL or issuer for the selected GitLab instance.

In Auth:

1. Open **Identity providers**.
2. Create a GitLab provider, OIDC provider, or OAuth2 provider.
3. Enter the GitLab base URL or issuer.
4. Enter the application ID as the client ID.
5. Enter the secret as the client secret.
6. Configure scopes.
7. Map subject from the stable GitLab user identifier.
8. Map username, email, name, and avatar where available.
9. Configure domain routing only for domains the tenant controls.
10. Test login.
11. Enable the provider.
12. Connect it to the required clients.

For self-managed GitLab, confirm the public GitLab URL in metadata matches the URL users will actually reach.

## Okta Provider

Use Okta when a customer or organization manages workforce identity through Okta.

In Okta:

1. Sign in to the Okta administrator console.
2. Open **Applications**.
3. Create an app integration.
4. Choose OIDC as the sign-in method.
5. Choose web application for a confidential server-side integration.
6. Add the sign-in redirect URI copied from Auth.
7. Add sign-out redirect behavior if the tenant requires coordinated logout.
8. Assign the app integration to the users or groups allowed to use it.
9. Save the app integration.
10. Copy the Okta domain or issuer.
11. Copy the client ID.
12. Copy the client secret.

In Auth:

1. Open **Identity providers**.
2. Create an Okta provider or generic OIDC provider.
3. Enter the Okta issuer.
4. Enter the client ID and client secret.
5. Set scopes to include `openid`, `email`, and `profile`.
6. Map subject from `sub`.
7. Map email and email verification from the Okta claims available to the app.
8. Map name and groups if the tenant uses them.
9. Configure domain routing for the organization's verified domains.
10. Decide whether JIT provisioning should create users or whether invites are required.
11. Test login with an assigned Okta user.
12. Enable the provider.
13. Connect it to the required clients.

If login fails for a valid user, check Okta app assignment before changing Auth mappings.

## Auth0 Provider

Use Auth0 when another system uses Auth0 as its identity layer and Auth should trust it as an upstream OIDC provider.

In Auth0:

1. Open the Auth0 dashboard.
2. Open **Applications**.
3. Create an application or select the application that represents Auth.
4. Choose a regular web application or another confidential application type appropriate for server-side token exchange.
5. Add the redirect URI copied from Auth to allowed callback URLs.
6. Add logout URLs if coordinated logout is required.
7. Confirm allowed web origins if the Auth0 tenant requires them for the selected flow.
8. Save the application.
9. Copy the Auth0 domain.
10. Copy the client ID.
11. Reveal and copy the client secret.

In Auth:

1. Open **Identity providers**.
2. Create an Auth0 provider or generic OIDC provider.
3. Enter the Auth0 issuer based on the Auth0 domain.
4. Enter the client ID.
5. Enter the client secret.
6. Set scopes to `openid email profile`.
7. Map subject from `sub`.
8. Map email from `email`.
9. Map email verification from `email_verified`.
10. Configure organization, connection, or domain routing only when the tenant needs that Auth0 behavior.
11. Test login.
12. Enable the provider.
13. Connect it to the required clients.

Auth0 can route users through its own upstream connections. Treat the Auth0 subject and issuer as the stable external identity presented to Auth.

## AWS Cognito Provider

Use AWS Cognito when users should sign in through an existing Cognito user pool.

In AWS:

1. Open the AWS console.
2. Open **Amazon Cognito**.
3. Open the user pool that owns the users.
4. Confirm the user pool has a hosted domain or custom domain configured.
5. Open app integration or app clients.
6. Create an app client for Auth or select an existing confidential app client.
7. Enable authorization code flow.
8. Add the redirect URI copied from Auth to the allowed callback URLs.
9. Add logout URLs if coordinated logout is required.
10. Enable scopes such as `openid`, `email`, and `profile`.
11. Save the app client.
12. Copy the user pool domain or issuer.
13. Copy the app client ID.
14. Copy the app client secret when the app client is confidential.

In Auth:

1. Open **Identity providers**.
2. Create an AWS Cognito provider or generic OIDC provider.
3. Enter the Cognito issuer for the user pool.
4. Enter the app client ID.
5. Enter the app client secret when configured.
6. Set scopes to `openid email profile` unless the user pool requires different scopes.
7. Map subject from `sub`.
8. Map email from `email`.
9. Map email verification from `email_verified`.
10. Map display name from `name` when available.
11. Configure domain routing only when the tenant owns the routed domains.
12. Decide whether JIT provisioning is allowed.
13. Test login.
14. Enable the provider.
15. Connect it to the required clients.

Confirm Cognito app client settings match the Auth flow. A public Cognito app client without a secret and a confidential Auth provider expecting a secret will not behave the same way.

## Sign In With Apple Provider

Use Sign in with Apple when users should sign in with Apple accounts.

Apple setup is different from many OIDC providers because the client secret is generated from Apple developer key material.

In Apple Developer:

1. Open the Apple Developer account used by the organization.
2. Enable **Sign in with Apple** for the primary App ID if the product also has an Apple platform app.
3. Create a Services ID for the web sign-in integration.
4. Configure the Services ID for Sign in with Apple.
5. Add the website domain used by Auth.
6. Add the return URL copied from Auth.
7. Create or select a Sign in with Apple private key.
8. Record the Team ID.
9. Record the Services ID. This is the client ID used by Auth.
10. Record the Key ID for the private key.
11. Download and protect the private key.

In Auth:

1. Open **Identity providers**.
2. Create an Apple provider or compatible OIDC provider.
3. Enter the Apple issuer if the provider type requires it.
4. Enter the Services ID as the client ID.
5. Configure the client secret using the generated Apple client-secret value or the key material fields supported by Auth.
6. Set scopes to request name and email when the tenant needs them.
7. Map subject from the Apple subject claim.
8. Map email from the Apple email claim when provided.
9. Treat name as first-login data because Apple may provide it only during the first successful authorization.
10. Configure account linking conservatively.
11. Test login with an Apple account.
12. Enable the provider.
13. Connect it to the required clients.

Store Apple private key material and generated client secrets with the same care as other provider secrets. Plan rotation before the key expires or is revoked.

## Generic OAuth2 Provider

Use generic OAuth2 only when the upstream provider is not OIDC but can still provide enough identity information for Auth to map a user safely.

Information to collect:

- Authorization URL.
- Token URL.
- UserInfo or profile URL.
- Client ID.
- Client secret.
- Redirect URI registered at the provider.
- Scopes required to read user identity.
- Field that contains the stable user ID.
- Field that contains verified email, if available.

Setup:

1. Create an OAuth application in the upstream provider console.
2. Add the redirect URI copied from Auth.
3. Enable authorization code flow.
4. Copy the client ID and client secret.
5. In Auth, create an OAuth2 provider.
6. Enter the authorization, token, and profile URLs.
7. Enter the client ID and client secret.
8. Configure scopes.
9. Map the stable subject field.
10. Map email only when the provider can indicate that it is verified.
11. Test login.
12. Enable the provider.
13. Connect it to the required clients.

Prefer OIDC when available because OIDC defines issuer, subject, ID token, discovery, and JWKS behavior more clearly.

## Generic SAML Provider

Use SAML for enterprise SSO where the customer's identity provider sends signed assertions to Auth.

Information to collect from Auth:

- Auth service provider entity ID.
- Assertion consumer service URL.
- Single logout URL if supported and required.
- Auth service provider metadata file or metadata URL when available.

Information to collect from the SAML identity provider:

- Identity provider entity ID.
- SSO URL.
- SLO URL when used.
- Signing certificate.
- NameID format.
- Attribute names for email, name, given name, family name, groups, and stable ID.

In Auth:

1. Open **Identity providers**.
2. Create a SAML provider.
3. Enter a provider name users will recognize.
4. Copy the Auth service provider metadata or the individual service provider values.
5. Leave the provider in draft.

In the customer's SAML identity provider:

1. Create a SAML service provider or enterprise application for Auth.
2. Paste the Auth service provider entity ID.
3. Paste the Auth assertion consumer service URL.
4. Add the Auth single logout URL if the tenant will use SLO.
5. Configure NameID format.
6. Configure signed assertions or signed responses according to tenant policy.
7. Add attributes for stable subject, email, email verification if available, display name, first name, last name, and groups if used.
8. Download or copy the identity provider metadata.
9. Copy the identity provider signing certificate if metadata import is not used.

Back in Auth:

1. Upload or paste the identity provider metadata, or enter entity ID, SSO URL, SLO URL, and signing certificate manually.
2. Configure NameID and attribute mapping.
3. Configure domain routing if email domains should route users to SAML.
4. Configure JIT provisioning and account linking.
5. Test SAML login with a user assigned to the SAML application.
6. Enable the provider.
7. Connect it to the required clients.

Coordinate SAML setup with the customer's identity team. Certificate rotation, assertion signing, clock skew, and attribute names are common sources of production failures.

## Email, SMS, And Passwordless Providers

Email and SMS login methods depend on tenant messaging configuration. Configure messaging before enabling email OTP, SMS login, magic links, password reset, invite delivery, or email/SMS MFA.

Typical setup:

1. Open **Messaging** for the tenant.
2. Configure the email or SMS delivery provider.
3. Test delivery.
4. Open **Identity providers** or the tenant login-method settings.
5. Enable the email, SMS, or passwordless method.
6. Confirm OTP lifetime, retry limits, lockout, and MFA policy.
7. Connect the login method to the relevant clients when the UI requires per-client availability.
8. Test the hosted identity UI.

For messaging configuration details, see [Messaging](#messaging).

## Attribute Mapping

Attribute mapping tells Auth how to translate upstream identity data into Auth user data.

Recommended mappings:

- Stable subject: upstream `issuer` plus stable subject or user ID.
- Email: upstream verified email claim or verified email field.
- Email verification: upstream verification flag where available.
- Display name: name or display name claim.
- First name and last name: given-name and family-name claims where available.
- Avatar: picture or avatar URL where available.
- Groups or roles: upstream authorization hints that must be mapped deliberately.

Use the upstream subject as the identity key. Do not link accounts by email alone unless the email is verified and policy explicitly allows it.

## Domain Routing

Domain routing sends users toward a provider based on email domain or tenant policy.

Use it for:

- Enterprise SSO domains.
- Google Workspace domains.
- Microsoft Entra tenant domains.
- Customer-owned domains with verified ownership.

Avoid routing public consumer domains such as common webmail domains unless the tenant intentionally owns that experience.

Domain routing should improve user experience, not bypass policy. Provider status, client connection, registration flow, JIT provisioning, account linking, MFA, and tenant status still apply.

## JIT Provisioning

Just-in-time provisioning lets Auth create a user during provider login.

Use JIT only when:

- The tenant trusts the provider to introduce users.
- Domain routing or provider assignment is narrow enough.
- Default roles are conservative.
- Registration policy allows provider-created accounts.
- The upstream email or identifier is trustworthy.

Disable JIT when every user must be invited, approved, or migrated first.

## Account Linking

Account linking connects an external provider identity to an existing Auth user.

Use it when the same person should be able to sign in with multiple methods. Require fresh proof before linking and protect against takeover when provider emails match existing accounts.

Do not let users unlink their last usable login method unless another recovery path exists.

## Client Connections

Connecting a provider to a client allows that application to show or use the provider during login.

This is why a provider may be configured and enabled but still not appear on a login page. The tenant provider must be enabled, the client must be active, and the provider must be connected to that client.

To connect a provider:

1. Open the provider.
2. Confirm status is enabled.
3. Open client connections.
4. Select each client that should show the provider.
5. Save.
6. Open the hosted identity UI for that client.
7. Confirm the provider appears.
8. Complete a test login.

For client setup details, see [Applications & clients](#clients).

## Brokered Login

Brokered login means Auth sits between your application and an upstream identity provider.

The application talks to Auth. Auth talks to the upstream provider. After the upstream provider proves the user, Auth maps that proof into an Auth user, applies tenant policy, applies client policy, completes MFA or registration when required, and then issues Auth-owned tokens back to the application.

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
- Another organization runs Maintainerd Auth and should be trusted as an upstream issuer.
- A product wants social login without building each provider directly into every app.
- A service needs Auth to normalize identities from multiple upstream systems.

Federation does not mean every upstream account automatically becomes a valid Auth user. Tenant policy still decides whether JIT provisioning is enabled, whether invites are required, whether email domains are allowed, whether MFA is required, and which client can use the provider.

Auth should be the policy point. The upstream provider proves identity; Auth decides how that proof applies inside the tenant.

## Common Workflow

1. Open **Identity providers**.
2. Create or select a provider.
3. Choose the provider type.
4. Copy the redirect URI or service provider metadata from Auth.
5. Create the matching application in the upstream identity provider.
6. Paste the Auth redirect URI or SAML metadata into the upstream provider.
7. Copy the upstream client ID, client secret, issuer, metadata, or certificate.
8. Enter those values in Auth.
9. Configure scopes or SAML attributes.
10. Configure attribute mapping.
11. Configure domain routing when needed.
12. Decide whether JIT provisioning and account linking are allowed.
13. Test the provider.
14. Enable the provider.
15. Connect it to a client.
16. Test login from the hosted identity UI.
17. Review security events and audit records.

## Permissions And Security

Provider management requires tenant provider-management permissions. Depending on tenant policy, sensitive provider changes may require step-up MFA.

Sensitive provider actions include:

- Creating a provider.
- Enabling or disabling a provider.
- Changing client secrets.
- Changing signing certificates.
- Changing issuer, token, authorization, or metadata URLs.
- Changing attribute mapping.
- Enabling JIT provisioning.
- Enabling account linking.
- Adding domain routing.
- Connecting a provider to a production client.
- Disabling the only working login method.
- Deleting a provider.

Audit these changes because provider configuration controls who can prove identity and how upstream accounts become local Auth users.

## Troubleshooting

If a provider does not appear on the login page, check provider status, client connection, tenant status, client status, registration policy, and security policy.

If the upstream provider rejects the login request, compare the redirect URI in the upstream provider with the value shown by Auth.

If callback validation fails, check issuer, client credentials, redirect configuration, state, nonce, signing keys, certificates, and clock skew.

If users are created unexpectedly, check JIT provisioning, registration flow, domain routing, default access, and provider connection scope.

If account linking attaches the wrong account, check subject mapping and email verification policy immediately.

If a SAML login fails, check entity ID, ACS URL, NameID format, assertion signature, certificate validity, required attributes, and clock skew.

If Microsoft, Okta, or SAML users cannot sign in even though the provider configuration looks correct, confirm the user is assigned to the upstream application.

If Google Workspace routing sends the wrong users to Google, check domain routing and whether the tenant is using public consumer domains instead of verified workspace domains.

If Maintainerd external login fails, confirm the upstream Maintainerd client has the exact redirect URI copied from the downstream Auth provider screen and that the downstream provider issuer matches the upstream public issuer.
