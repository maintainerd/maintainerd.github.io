# OAuth & OIDC

Auth acts as an OAuth 2.0 authorization server and OpenID Connect provider. Applications use OAuth to obtain tokens for access, and they use OpenID Connect to verify who the signed-in user is.

Use this page to understand how OAuth/OIDC works in Auth, which flow to choose, what each option controls, and what a developer should verify before integrating an application. Endpoint paths, request payloads, response schemas, and generated client examples belong in the API reference.

## How OAuth And OIDC Fit Into Auth

OAuth answers: **Can this application get access, and what can it access?**

OpenID Connect answers: **Who signed in, and which issuer proved it?**

Auth combines both:

- The application is represented by a client record.
- The tenant owns users, clients, providers, scopes, policies, consent, and security rules.
- The hosted identity UI handles login, MFA, registration, account linking, and consent.
- The public identity API acts as the OAuth/OIDC issuer.
- Auth signs tokens with its configured signing keys.
- Applications validate tokens against Auth's issuer and public keys.

For client setup fields, see [Applications & clients](#clients). For issuer and hostname planning, see [Hostnames & tenant URLs](#surfaces-hostnames).

## Where Developers Use It

Developers usually interact with OAuth/OIDC in four places:

- Application configuration: client ID, redirect URI, logout URI, issuer, scopes, and token handling.
- Browser login: the application sends the user to Auth's hosted identity UI.
- Token validation: the application verifies issuer, audience, expiry, signature, and claims.
- Logout and revocation: the application ends its own session and asks Auth to end or revoke related Auth state when appropriate.

Administrators configure the client and provider options in the console. Developers wire the application to those configured values.

## Issuer

The issuer is the public identity origin for Auth. It is configured with `APP_PUBLIC_HOSTNAME`.

Example issuer:

```text
https://identity-api.auth.example.com
```

The issuer must remain stable for applications that validate tokens. Changing it affects discovery metadata, token validation, JWKS lookup, and downstream application configuration.

Tenant frontend URLs and console URLs are different from the issuer. Do not use an application domain or console hostname as the issuer. Hostname roles are explained in [Hostnames & tenant URLs](#surfaces-hostnames).

## Discovery And Metadata

OIDC discovery lets applications find Auth's issuer metadata without hard-coding every protocol location.

Discovery metadata tells applications:

- Issuer.
- Authorization location.
- Token exchange location.
- JWKS location.
- UserInfo availability.
- Supported response types.
- Supported grant types.
- Supported scopes.
- Supported signing algorithms.
- Logout behavior where advertised.

Use discovery in application configuration when the framework supports it. If a library asks for an issuer URL, provide Auth's public issuer origin. If a library asks for metadata or JWKS directly, use the values published by discovery.

Do not copy endpoint payload examples into this guide. Use the API reference when you need exact paths or generated client behavior.

## JWKS And Signing Keys

JWKS is the public key set applications use to verify JWT signatures.

Applications should:

- Load JWKS from Auth's published metadata.
- Cache keys according to the application's library behavior.
- Refresh keys when a token header uses an unknown key ID.
- Reject tokens signed by unknown keys.
- Reject tokens with the wrong issuer.
- Reject tokens with the wrong audience.
- Reject expired tokens.

Auth signs tokens with the configured JWT signing key. Signing key setup and rotation are covered in [Secrets & keys](#secrets).

## Tokens

Auth can issue several token types depending on the client and grant.

Access token represents delegated access to a protected resource. Resource APIs validate access tokens before serving protected data.

ID token is an OIDC token for the application. It describes the authentication event and user identity for the client.

Refresh token lets an application continue a session without sending the user through a full login every time. Refresh tokens require careful storage, rotation, and revocation.

Device code and CIBA state are short-lived flow artifacts used by specialized interaction models.

Authorization code is a short-lived value returned to the application's callback during authorization code flow. The application exchanges it through the token flow.

Treat tokens and authorization codes as credentials. Do not log them, place them in issue trackers, expose them in analytics, or store them in browser locations that the application does not control.

## Claims

Claims are token fields that describe the issuer, subject, audience, time bounds, tenant, client, scopes, and user attributes.

Important concepts:

- Issuer identifies the Auth deployment that issued the token.
- Subject identifies the user or service principal inside Auth.
- Audience identifies the intended recipient or resource.
- Client ID identifies the application that requested the token.
- Tenant context tells downstream services which tenant the principal belongs to.
- Expiration limits token lifetime.
- Scopes describe delegated access requested by the application.
- Roles, permissions, or policy-related claims should be consumed according to the integration model selected by the service.

Applications should not use email as the stable user key. Use the subject and tenant context. Email can change, and the same email can exist in different tenants.

## Scopes

Scopes describe the access an application is asking for.

Common OIDC scopes:

- `openid`: required for OpenID Connect login.
- `email`: asks for email-related claims when policy allows them.
- `profile`: asks for profile-related claims when policy allows them.

Application or API-specific scopes should be meaningful to users and administrators. Avoid broad scopes when a narrower scope describes the access accurately.

Consent behavior depends on the client configuration, requested scopes, tenant policy, and whether previous consent can be reused.

## Audience

Audience tells a resource which token was meant for it.

Applications and APIs should reject tokens with the wrong audience. A token issued for one API should not be accepted by another API unless the tenant and resource model explicitly allow it.

When protecting an application API, register the resource and permissions in Auth, then validate access tokens according to the API's expected issuer and audience. See [Protect an API](#protect-api).

## Client Configuration Controls Protocol Behavior

OAuth/OIDC behavior is not configured only by application code. The client record controls:

- Allowed redirect URIs.
- Allowed post-logout redirect URIs.
- Allowed CORS origins.
- Allowed grant types.
- Allowed response types.
- Token endpoint authentication method.
- Token lifetimes.
- Consent behavior.
- Identity provider connections.
- Sender-constrained token requirements such as DPoP where supported.

If a flow fails, check the client record before changing application code.

## Authorization Code With PKCE

Authorization code with PKCE is the recommended browser login flow for web, single-page, and mobile applications.

Use it for:

- Backend web applications.
- Browser-based single-page applications.
- Mobile applications.
- Desktop applications that use a supported redirect pattern.

How it works:

1. The application starts login with its client ID, redirect URI, requested scopes, and PKCE challenge.
2. Auth resolves tenant and client context.
3. The hosted identity UI shows allowed login methods.
4. The user signs in.
5. Auth completes MFA, registration, account linking, or consent if required.
6. Auth returns an authorization code to the registered redirect URI.
7. The application exchanges the code with the matching PKCE verifier.
8. Auth issues tokens according to the client and tenant policy.
9. The application validates tokens and establishes its own application session.

For web applications, keep token exchange on the server. For SPA and mobile applications, use PKCE and keep token storage conservative.

## Web Application Pattern

A backend web application can protect a client secret and keep tokens server-side.

Recommended configuration:

- Client type: web application.
- Grant: authorization code.
- PKCE: enabled.
- Token endpoint authentication: confidential method supported by the deployment.
- Redirect URIs: exact HTTPS callbacks.
- Post-logout redirect URIs: exact HTTPS return URLs.
- Session: application-owned secure session after Auth returns tokens.

Recommended workflow:

1. Create a client in Auth.
2. Add the production application origin.
3. Add exact HTTPS redirect and post-logout redirect URIs.
4. Enable authorization code with PKCE.
5. Configure token endpoint authentication.
6. Connect allowed identity providers.
7. Configure consent if the app is external or requests user-visible scopes.
8. Configure the application with issuer, client ID, client secret, redirect URI, and scopes.
9. Test login, token validation, refresh behavior, logout, and error handling.

## SPA And Mobile Pattern

SPAs and mobile apps are public clients. They cannot protect a client secret.

Recommended configuration:

- Client type: single-page application or mobile application.
- Grant: authorization code.
- PKCE: required.
- Token endpoint authentication: none or the public-client method supported by Auth.
- Redirect URIs: exact HTTPS callbacks or approved mobile redirect values.
- Access-token lifetime: conservative.
- Refresh-token behavior: enable only when storage and rotation are handled safely.

Recommended workflow:

1. Create a public client.
2. Do not configure a client secret.
3. Add exact redirect URIs.
4. Add post-logout redirect URIs.
5. Add CORS origins for browser applications that call Auth from JavaScript.
6. Enable authorization code with PKCE.
7. Connect allowed identity providers.
8. Configure the app with issuer, client ID, redirect URI, and scopes.
9. Test login from the real application origin or mobile redirect environment.

## Machine-To-Machine Pattern

Machine-to-machine clients represent services, jobs, or automation. They do not represent a signed-in human user.

Recommended configuration:

- Client type: machine-to-machine.
- Grant: client credentials or another service-authentication method supported by the deployment.
- Token endpoint authentication: client secret, private-key JWT, mTLS, or configured workload identity.
- User login grants: disabled.
- Refresh tokens: disabled unless the service model explicitly requires them.
- Permissions: least privilege for the target API.

Recommended workflow:

1. Create a machine client.
2. Select the service authentication method.
3. Configure the service credentials.
4. Register the resource API and permissions the workload needs.
5. Assign only required permissions.
6. Store credentials in the configured secret provider.
7. Validate access token issuer, audience, expiration, and signature in the receiving service.
8. Review audit events after first use.

## Refresh Tokens

Refresh tokens extend a session without a full login. They are useful for applications that need session continuity, but they increase risk if stored poorly.

Use refresh tokens when:

- The application has a clear session lifetime requirement.
- The client can store refresh tokens safely.
- Rotation and replay handling are enabled where supported.
- Revocation is part of logout and account-security workflows.

Avoid refresh tokens for machine clients and simple applications that can redirect users through normal login when needed.

## Client Credentials

Client credentials is for service access. The resulting token represents the client, not a user.

Use it when:

- A backend service calls another backend service.
- A scheduled job needs API access.
- A deployment automation needs a scoped service identity.

Do not use client credentials to impersonate users. If an operation needs human attribution, use an integration model that preserves a user actor or an explicit `on_behalf_of` context where supported by the service surface.

## Device Code

Device code is for devices that cannot comfortably enter credentials, such as TVs, command-line tools, appliances, or constrained terminals.

How users experience it:

1. The device starts authorization.
2. Auth gives the device a user-facing code and verification location.
3. The user opens the verification location on another device.
4. The user signs in and approves the request.
5. The original device polls until Auth returns the result or the code expires.

Use device code only for products that truly need this interaction model. Keep code lifetimes short and show clear device/app identity to the user.

## CIBA

CIBA is a backchannel authentication model where a client initiates authentication without a direct front-channel browser redirect.

Use it only when the product intentionally supports out-of-band approval, such as a trusted mobile authenticator or managed approval workflow.

Important controls:

- The client must be explicitly allowed to use CIBA.
- User notification templates must be configured.
- Approval and denial events should be audited.
- Expiration and polling intervals should be conservative.
- The user must understand which application is requesting approval.

## Token Exchange

Token exchange is for controlled delegation between token types, services, or audiences.

Use it when:

- A service needs a token for a downstream audience.
- The platform needs to exchange an external proof for an Auth-issued token.
- A controlled delegation workflow is part of the service architecture.

Token exchange should be narrowly scoped. Validate the source token, destination audience, tenant context, actor context, and allowed policy before issuing a new token.

## Pushed Authorization Requests

Pushed Authorization Requests let a client send authorization parameters to Auth before redirecting the browser.

Use PAR when:

- Authorization requests contain sensitive or complex parameters.
- The application wants to reduce tampering in front-channel URLs.
- The tenant or client policy requires stronger request integrity.

PAR does not replace redirect URI validation, PKCE, consent, or normal client policy. It strengthens how the authorization request is delivered.

## DPoP And Sender-Constrained Tokens

DPoP binds tokens to a client-held key so a stolen token is harder to reuse from another client.

Use DPoP when:

- The client can generate and protect a signing key.
- The application can sign token and resource requests.
- The resource server validates DPoP proofs.
- The client can handle nonce challenges.

DPoP is most useful for public clients and high-risk browser/resource interactions. gRPC service traffic should use the certificate-bound or mTLS model configured for that surface rather than HTTP DPoP.

## UserInfo

UserInfo is an OIDC profile surface. Applications use it when they need current user profile claims from Auth after receiving an access token that allows profile access.

Use UserInfo for profile display or account linking support. Do not use UserInfo as the only authorization check for a protected API. Resource authorization should validate access tokens and permissions for the target resource.

## Consent

Consent asks the user to approve application access.

Consent may appear when:

- The application is external.
- The client is configured to require consent.
- Requested scopes need user approval.
- Previous consent is missing, expired, or revoked.

Consent should show a recognizable application name, logo where configured, requested scopes, policy URL, and terms URL. Client consent settings are configured in [Applications & clients](#clients).

## Logout And Session End

OAuth/OIDC logout has two parts:

- The application ends its own local session.
- Auth ends or updates the Auth-side browser/session/token state when requested and allowed.

Post-logout redirect URIs must be registered on the client. Do not send users to arbitrary return URLs after logout.

Back-channel logout lets Auth notify registered clients or relying parties about session changes without relying on the browser. Use it only when the application is built to receive and process those notifications.

## Revocation

Revocation invalidates token state before normal expiry.

Use revocation when:

- A user signs out.
- A refresh token is rotated or replaced.
- An administrator revokes sessions.
- A client is compromised.
- A user changes credentials or MFA state.

Applications should also clear their own application sessions. Auth token revocation does not automatically remove cookies or sessions owned by downstream applications.

## Introspection

Introspection lets trusted services check token status centrally instead of relying only on local JWT validation.

Use introspection when:

- Token revocation state must be checked immediately.
- The receiving service cannot safely validate JWTs locally.
- The deployment requires centralized policy decisions for a sensitive resource.

Local JWT validation is still appropriate for many resource APIs. Choose the model based on revocation requirements, latency, availability, and trust boundaries.

## Dynamic Client Registration

Dynamic client registration is an internal management capability for provisioning clients through trusted administrative surfaces.

Use it for controlled automation, not public self-service onboarding. Public applications should be created through the console or another trusted management workflow with tenant permissions, audit records, and review.

## Common Workflow

To integrate a user-facing application:

1. Confirm Auth's public issuer hostname.
2. Create a client in [Applications & clients](#clients).
3. Choose the correct client type.
4. Add exact HTTPS redirect URIs.
5. Add exact post-logout redirect URIs.
6. Add CORS origins when the browser app needs them.
7. Enable authorization code with PKCE.
8. Configure token endpoint authentication based on whether the client is public or confidential.
9. Connect identity providers.
10. Configure consent.
11. Configure the application with issuer, client ID, redirect URI, scopes, and token handling.
12. Use discovery and JWKS through the application framework where possible.
13. Test login, MFA, consent, token validation, refresh, logout, and error handling.

To integrate a resource API:

1. Register the API and permissions in Auth.
2. Decide which clients can receive tokens for the API.
3. Validate access token issuer, audience, signature, expiration, tenant context, and required scopes or permissions.
4. Decide whether local JWT validation is enough or whether introspection is required.
5. Test expired, revoked, wrong-audience, wrong-issuer, and missing-permission tokens.

For resource protection details, see [Protect an API](#protect-api).

## Permissions And Security

OAuth/OIDC configuration is sensitive because it controls redirects, tokens, consent, and application trust.

Administrative changes that should be audited include:

- Creating or disabling clients.
- Adding redirect URIs.
- Adding post-logout redirect URIs.
- Adding CORS origins.
- Changing grant types.
- Changing response types.
- Changing token endpoint authentication.
- Enabling refresh tokens.
- Changing token lifetimes.
- Connecting identity providers.
- Disabling consent.
- Rotating signing keys.
- Revoking tokens or sessions.
- Enabling dynamic client registration automation.

Depending on tenant policy, these changes may require step-up MFA.

## Production Checklist

Before sending real users through OAuth/OIDC:

- Issuer uses the intended HTTPS public identity hostname.
- Application uses the issuer from configuration, not a hard-coded older hostname.
- Client type matches the application architecture.
- Redirect URIs are exact HTTPS URLs.
- Post-logout redirect URIs are exact HTTPS URLs.
- Browser CORS origins are exact origins without paths.
- Authorization code with PKCE is enabled for browser and mobile clients.
- Public clients do not have client secrets.
- Confidential client secrets are stored server-side.
- Access-token lifetime is appropriate for the risk.
- Refresh-token behavior is intentional and tested.
- JWKS validation is configured in the application.
- Audience validation is configured in resource APIs.
- Consent text, policy URL, terms URL, and logo are reviewed.
- Connected identity providers are tested from the hosted identity UI.
- Logout clears both Auth-side and application-side sessions.
- Revocation behavior is tested for compromised sessions.

## Troubleshooting

If login fails before the user sees a login screen, check client ID, tenant hostname, redirect URI, client status, and allowed grant type.

If login succeeds but callback fails, compare the returned callback with the registered redirect URI and the route implemented by the application.

If token exchange fails, check PKCE verifier, client authentication method, client secret, grant type, redirect URI, and code expiration.

If tokens are rejected by the application, check issuer, audience, JWKS refresh, signing key ID, expiration, clock skew, and whether the application is reading the correct environment configuration.

If consent appears unexpectedly, check client consent requirements, requested scopes, previous consent records, and consent lifetime.

If consent does not appear when expected, check whether the client is first-party, whether consent is disabled, or whether previous consent is still valid.

If refresh fails, check refresh-token lifetime, rotation, replay detection, revocation state, client status, and user session state.

If logout does not return to the application, check post-logout redirect URI configuration and the application's local session cleanup.

If a resource API accepts a token meant for another API, fix audience validation immediately.

If a browser app receives CORS errors, compare the browser origin with the client CORS origin and any operator-level CORS allowlist.
