# Applications & Clients

Applications and clients represent the software that uses Auth for sign-in, token issuance, logout, consent, and service authorization. A client record tells Auth which application is asking for access, which tenant it belongs to, where users may be redirected, which identity providers can appear, which OAuth/OIDC flows are allowed, and how tokens should be handled.

Use this page when configuring a production web application, single-page application, mobile application, backend service, or Maintainerd-owned first-party surface from the Auth console. Endpoint paths, payloads, response schemas, and generated client usage belong in the API reference.

## Where To Find It

In the console, open the tenant, then open **Applications** or **Clients**.

The area usually contains:

| Screen Or Setting | What It Controls |
|---|---|
| Client list | Inventory of applications registered in the tenant. |
| Create client | Adds a new application boundary. |
| Client detail | Name, type, status, description, and ownership context. |
| Redirect URI settings | Login callback URLs allowed for the client. |
| Post-logout redirect URI settings | Logout return URLs allowed for the client. |
| CORS origin settings | Browser origins allowed to call permitted Auth APIs. |
| OAuth/OIDC grant and response settings | Which protocol flows the client can use. |
| Token endpoint authentication settings | How confidential clients prove their identity. |
| Client secret or key settings | Credential material for confidential clients. |
| Identity provider connections | Which providers appear for this application. |
| Consent settings | Whether and how users approve requested access. |
| Token lifetime settings | How long issued tokens remain usable. |
| Security options | Sender-constrained token requirements such as DPoP where supported. |

End users do not manage client records directly. They experience client configuration through hosted login, registration, consent, logout, account self-service, and application redirects.

## How Clients Fit Into Auth

A tenant can have many clients. Create a separate client when an application needs its own redirect URIs, CORS origins, provider choices, token lifetimes, consent behavior, or audit trail.

Client configuration is evaluated during several flows:

| Flow | Client Settings Used |
|---|---|
| Hosted login | Tenant, client status, redirect URI, provider connections, and registration policy. |
| Consent | Client name, logo, policy URL, terms URL, scopes, and consent settings. |
| Logout | Post-logout redirect URIs before returning the browser to an application. |
| Token issuance | Client type, allowed grant types, token endpoint authentication method, token lifetimes, and sender-constraining requirements. |
| Browser API calls | Tenant context and registered CORS origins when cross-origin access is allowed. |

Auth deployment hostnames are configured separately from application client URLs. For system and tenant URL patterns, see [Hostnames & tenant URLs](#surfaces-hostnames).

## Client List

The client list is the inventory of applications registered in the selected tenant.

Common columns:

| Column | What It Means |
|---|---|
| Name | Administrator-facing application name. |
| Client ID | Public identifier used by the application during OAuth/OIDC flows. |
| Type | Web, single-page application, mobile, machine-to-machine, or first-party. |
| Status | Whether the client can start flows and receive tokens. |
| Redirect count | Number of allowed login callback URLs. |
| Provider connections | Login providers available to this application. |
| Updated | When the client was last changed. |

Disable a client when the application should no longer start login, complete token exchange, refresh tokens, or appear as an allowed relying party.

## Create Client

Create one client per application boundary. Do not reuse one client across unrelated products that only share the same tenant. Separate clients make redirects, consent, token policies, and provider availability easier to reason about.

Before creating a client, decide:

| Decision | Why It Matters |
|---|---|
| Which application owns the client | Keeps audit, redirects, provider choices, and token policy scoped to one application boundary. |
| Which domain the application uses | Determines origins, redirects, CORS, cookies, and user trust. |
| Which callback URL receives users after login | OAuth redirects must match exactly. |
| Which URL receives users after logout | Logout redirects must be explicitly allowed. |
| Whether browser calls need CORS access | Browser JavaScript requires allowed origins for cross-origin calls. |
| Whether the app can protect a client secret | Decides whether the client is public or confidential. |
| Which identity providers should be shown | Controls login options for the application. |
| Whether users should approve consent | Controls user approval and trust prompts. |
| Which token lifetime is appropriate | Balances user experience, revocation, and token exposure risk. |

For a web application hosted at `https://app.example.com`, typical URL values are:

```text
Application origin:       https://app.example.com
Redirect URI:             https://app.example.com/auth/callback
Post-logout redirect URI: https://app.example.com/logout/callback
CORS origin:              https://app.example.com
```

Redirect and logout URLs must match the real application routes exactly. Do not use wildcard redirects for browser applications.

## Client Detail Fields

| Field | What It Controls |
|---|---|
| Name | Label administrators see in the console. It may also appear to users during login or consent. |
| Description | Explains what the application is for, such as customer portal, mobile app, or backend worker. |
| Client ID | Public identifier for the application. It is not a secret. |
| Client secret | Credential for confidential clients that can protect secrets server-side. Never place it in browser, mobile, public repository, or downloadable configuration. |
| Client type | Expected security model based on where the application runs and whether it can keep a secret. |
| Status | Whether Auth accepts new flows for the client. Disabling is often safer than deleting during investigation. |
| Application origin | Browser origin for the application and useful ownership context for CORS or first-party checks. |
| Redirect URIs | Exact HTTPS callback URLs where Auth may send users after login. |
| Post-logout redirect URIs | Exact HTTPS URLs where Auth may send users after logout. |
| CORS origins | Browser origins allowed to call permitted Auth browser-facing APIs when cross-origin access is required. |
| Grant types | OAuth/OIDC flows the client may use. |
| Response types | Authorization responses the client may request. |
| Token endpoint authentication method | How a confidential client proves its identity during token exchange. |
| Access-token lifetime | How long issued access tokens remain usable. |
| Refresh-token lifetime | How long the application can continue a user session without full login. |
| Consent requirement | Whether users must approve requested access before Auth returns them to the application. |
| Logo URL, policy URL, terms URL | User-facing trust information during consent or login screens. |
| Provider connections | Identity providers that appear for this client in the hosted identity UI. |

## Client Types

| Client Type | What It Represents | Recommended Pattern |
|---|---|---|
| Web application | Server-rendered or backend-owned application. | Authorization code with PKCE, server-side session, secure cookies, exact HTTPS redirect URIs, and protected client secret. |
| Single-page application | Browser application. | Authorization code with PKCE, exact HTTPS redirect URIs, short-lived tokens, and no client secret. |
| Mobile application | Native app on a user device. | Authorization code with PKCE and platform-appropriate redirect behavior. |
| Machine-to-machine client | Backend workload without human login. | Service authorization, scheduled jobs, automation, or backend-to-backend access. |
| First-party system client | Maintainerd-owned console and hosted identity surfaces. | Reserved for Auth-owned surfaces, not customer applications. |

## Public And Confidential Clients

Public clients cannot keep a secret. Browser and mobile clients are public clients. They rely on PKCE, exact redirects, HTTPS, origin checks, sender-constrained tokens where configured, and careful token storage.

Confidential clients can protect credentials server-side. Backend web applications and machine clients are usually confidential clients. They can use a client secret or stronger methods such as private-key JWT when supported by the deployment.

Choose public or confidential based on where the secret would live. If the secret would be shipped to a browser, mobile app, desktop app, or customer-controlled device, the client is public.

## Grant Types

| Grant Type | Use It For | Caution |
|---|---|---|
| Authorization code | Human login for web, SPA, and mobile clients. | Use PKCE for browser and mobile applications, and prefer it for web applications. |
| Refresh token | Continuing a session without full login every time. | Enable only when the application can store and rotate refresh tokens safely. |
| Client credentials | Machine-to-machine access. | Represents the client itself, not an end user. |
| Device code | Input-constrained devices where the user authorizes on another device. | Use only for device-style products. |
| Token exchange | Controlled delegation between services or token types. | Use only when relying services and audiences are clearly defined. |
| CIBA | Backchannel authentication without a direct browser redirect. | Use only for products that intentionally support that model. |

Do not enable grants because they are available. Enable only the grants the application actually uses.

## Response Types

Response types describe what the authorization endpoint can return to the client.

For most browser-based applications, use the authorization code response. Avoid implicit-style responses for production browser applications because tokens returned directly through the browser are harder to protect.

Keep response types aligned with the selected grant types. If a response type is not required by the application integration, leave it disabled.

## Token Endpoint Authentication

Token endpoint authentication applies when the client exchanges a code, refresh token, or machine credential at the token endpoint.

Common choices:

| Method | Use It For |
|---|---|
| None | Public clients that cannot protect a secret. |
| Client secret | Confidential clients that store a secret server-side. |
| Private-key JWT | Confidential clients that authenticate with an asymmetric key instead of a shared secret. |
| Mutual TLS or certificate-bound methods | Deployments that require client certificates for high-trust service traffic. |

Use the strongest method your application and operating model can support. For production service clients, prefer asymmetric or certificate-based authentication when available.

## Redirect And Logout URIs

Redirect URIs are security boundaries. Auth should redirect only to URLs that belong to the application.

Use exact HTTPS URLs:

```text
https://app.example.com/auth/callback
https://admin.example.com/oauth/callback
```

Post-logout redirect URIs are also exact allowlist entries:

```text
https://app.example.com/logout/callback
https://admin.example.com/signed-out
```

Do not add a broad domain, wildcard, marketing homepage, or shared callback owned by another application. A redirect URI mistake can send authorization codes or user state to the wrong place.

## CORS Origins

CORS origins control which browser origins can call allowed Auth browser APIs from JavaScript.

Use origin values, not full callback paths:

```text
https://app.example.com
https://admin.example.com
```

Register CORS origins on the client when a browser application needs cross-origin calls. Use environment-level `CORS_ALLOWED_ORIGINS` only for operator-owned exceptions. Hostname and CORS boundaries are explained in [Hostnames & tenant URLs](#surfaces-hostnames).

## Identity Provider Connections

A provider connection makes a tenant identity provider available to a specific client.

This matters because a tenant can have many providers, but each application may need only a subset. The admin console might allow built-in password login and Microsoft SSO, while a customer-facing portal might allow Google, SAML, or invite-based onboarding.

To connect a provider:

1. Create or enable the provider in [Identity providers](#identity-providers).
2. Open the client.
3. Open provider connections or login methods.
4. Select the provider.
5. Save the client.
6. Open the hosted identity UI for that client and verify the provider appears.

If a provider is enabled but not connected to the client, users should not see it for that application.

## Consent

Consent asks the user to approve application access. Use consent when the application is external, requests user data, requests privileged scopes, or needs a user-visible approval record.

Consent settings can include:

- Whether consent is required.
- Which scopes are visible to users.
- Whether previously granted consent can be reused.
- How long consent remains valid.
- Application logo.
- Policy URL.
- Terms URL.

Internal first-party surfaces may not require a user-facing consent screen. External applications should usually present clear consent so users understand which application is requesting access.

## Token And Session Settings

Shorter access-token lifetimes reduce exposure if a token leaks. Longer lifetimes reduce token refresh frequency but increase risk.

Refresh-token settings control how long an application can keep a user signed in. Use refresh-token rotation and revocation where supported.

Machine clients should not receive user refresh tokens because they do not represent a human browser session.

Browser applications should use HTTPS, PKCE, secure storage appropriate to the application type, exact redirect URIs, and short access-token lifetimes.

If the client supports DPoP or another sender-constrained token mode, enable it when the application can reliably sign requests and handle nonce challenges. Sender-constrained tokens reduce the value of a stolen bearer token.

## Common Workflows

To create a web application client:

1. Open **Applications** or **Clients**.
2. Create a client.
3. Choose web application.
4. Enter the application name and production origin.
5. Add exact HTTPS redirect URIs.
6. Add exact HTTPS post-logout redirect URIs.
7. Select authorization code and PKCE.
8. Configure token endpoint authentication for the backend.
9. Configure consent if users should approve access.
10. Connect the identity providers this app can use.
11. Save the client.
12. Test login, consent, token exchange, logout, and account self-service entry points.

To create an SPA or mobile client:

1. Create a client.
2. Choose single-page application or mobile application.
3. Do not configure a client secret.
4. Enable authorization code with PKCE.
5. Add exact HTTPS redirect URIs or supported mobile redirect values.
6. Add post-logout redirect URIs.
7. Add CORS origins for browser-based apps that call Auth from JavaScript.
8. Keep token lifetimes conservative.
9. Connect allowed identity providers.
10. Test login from the real application environment.

To create a machine client:

1. Create a client.
2. Choose machine-to-machine.
3. Use client credentials, private-key JWT, mTLS, or the supported service authentication method for the deployment.
4. Assign only the service permissions required by the workload.
5. Keep user login grants disabled.
6. Store credentials in the configured secret provider.
7. Review audit records after first use.

## Permissions And Security

Client management requires tenant client-management permissions. Depending on the tenant policy, sensitive client changes may require step-up MFA.

Sensitive client actions include:

- Creating a production client.
- Enabling or disabling a client.
- Adding redirect URIs.
- Adding post-logout redirect URIs.
- Adding CORS origins.
- Changing client type.
- Creating or rotating a client secret.
- Changing token endpoint authentication.
- Enabling refresh tokens.
- Connecting identity providers.
- Disabling consent.
- Changing token lifetimes.
- Enabling DPoP or certificate-bound behavior.
- Deleting a client.

Audit these changes because a client controls where users are redirected and which application can receive tokens.

## Troubleshooting

If login says the redirect URI is invalid, compare the application callback with the client redirect URI exactly, including scheme, host, path, and trailing slash.

If the wrong provider appears, check provider status and client-provider connections.

If a provider is missing, check tenant status, client status, provider status, registration policy, and whether the provider is connected to the client.

If browser calls fail with CORS, compare the browser origin with the client CORS origin. CORS origin values should not include paths.

If logout does not return to the app, check the post-logout redirect URI configuration.

If a public client asks for a client secret, recheck the client type and token endpoint authentication method.

If tokens are rejected by the application, check issuer hostname, audience, JWKS refresh, token lifetime, client ID, and sender-constrained token settings.

If users are created unexpectedly after provider login, check provider JIT provisioning, registration flow, default access, domain routing, and provider connection scope.
