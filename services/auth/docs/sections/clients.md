# Applications & Clients

Clients are the applications that use Auth for sign-in. A client tells Auth which application is asking for login, where Auth may redirect users, which identity providers the app can show, which grants it can use, and how tokens and consent should behave.

Use this page when you are setting up a production web app, single-page app, mobile app, or machine client from the Auth console. API request details belong in the API reference.

## Where To Find It

In the console, open the tenant, then open Applications or Clients.

You should see:

- Client list.
- Create client.
- Client detail.
- Redirect and logout URI settings.
- CORS origin settings.
- OAuth/OIDC settings.
- Login method or provider connections.
- Token lifetime settings.
- Consent settings.
- Client secret settings for confidential clients.

Users do not normally see client records directly. They experience client settings through hosted login, consent, logout, and application redirects.

## Client List

The client list shows applications registered in the tenant.

Common columns:

- Name: administrator-facing application name.
- Client ID: public identifier used by the application.
- Type: web, SPA, mobile, machine-to-machine, or first-party.
- Status: active, disabled, draft, or archived.
- Redirect count: how many callback URLs are allowed.
- Provider connections: which login providers the client can show.
- Updated: when the client was last changed.

Disable a client when the application should no longer start login or receive tokens.

## Client Detail Fields

Name is the label administrators and users may recognize.

Client ID identifies the application during OAuth/OIDC flows. It is not a secret.

Client secret is used only by confidential clients that can keep secrets server-side. Do not use a client secret in browser-only applications.

Client type controls the expected security model.

Redirect URIs are exact HTTPS callback URLs where Auth may send users after login.

Post-logout redirect URIs are exact HTTPS URLs where Auth may send users after logout.

CORS origins are browser origins allowed to call permitted Auth browser APIs.

Grant types control which OAuth/OIDC flows the client may use.

Response types control which authorization responses the client may request.

Token endpoint authentication method controls how confidential clients authenticate to token exchange.

Access-token lifetime controls how long access tokens remain usable.

Refresh-token lifetime controls how long the app can keep a user signed in without a full login.

Consent requirement controls whether users must approve requested access.

Logo, policy, and terms URLs help users recognize the application during consent or login screens.

Provider connections decide which identity providers appear for this client.

## Client Types

Traditional web application is a server-rendered or backend-owned app that can keep a client secret. Use authorization code with PKCE and a server-side session.

Single-page application runs in the browser and cannot keep a client secret. Use authorization code with PKCE and HTTPS redirect URIs.

Mobile application runs on a device and cannot keep a normal web secret. Use authorization code with PKCE and platform-appropriate redirect behavior.

Machine-to-machine client represents a backend service. Use it only for service authorization, not human login.

First-party system client is reserved for Maintainerd-owned console and identity surfaces. Do not model customer apps as system clients.

## Production URL Examples

For a web application hosted at `https://app.example.com`, configure:

```text
Application origin:      https://app.example.com
Redirect URI:            https://app.example.com/auth/callback
Post-logout redirect URI: https://app.example.com/logout/callback
CORS origin:             https://app.example.com
```

For a tenant-specific app hosted at `https://portal.customer.example`, configure that exact origin and callback. Do not use wildcard redirects for browser clients.

For Auth itself, system tenant URLs normally look like:

```text
Console:       https://console.auth.example.com
Identity UI:   https://identity.auth.example.com
Public API:    https://identity-api.auth.example.com
Private API:   https://console-api.auth.example.com
```

For a regular tenant named `acme`, tenant frontend URLs normally look like:

```text
Tenant console:     https://acme.console.auth.example.com
Tenant identity UI: https://acme.identity.auth.example.com
```

Applications should redirect users to Auth. They should not collect Auth passwords directly.

## Provider Connections

A provider connection makes a tenant identity provider available to a specific client.

This matters because a tenant can have many providers, but each application may need only some of them. For example, the admin console may allow built-in password login and Microsoft SSO, while a customer-facing app may allow Google and invite-based registration.

To connect a provider:

1. Create or enable the provider in Identity providers.
2. Open the client.
3. Open provider connections or login methods.
4. Select the provider.
5. Save.
6. Open the hosted identity UI for that client and verify the provider appears.

If a provider is enabled but not connected to the client, users should not see it for that application.

## Consent

Consent asks the user to approve application access. Use it when the application is external, asks for user data, or requests scopes the user should understand.

Consent fields can include:

- Whether consent is required.
- Which scopes are user-visible.
- Application logo.
- Policy URL.
- Terms URL.
- Consent lifetime.

Internal first-party surfaces may not need a user-facing consent screen, but external applications usually should be explicit.

## Token And Session Choices

Short access-token lifetimes reduce risk when a token leaks.

Refresh tokens keep users signed in longer but require careful rotation and revocation.

Machine clients should not receive user refresh tokens.

Browser applications should use HTTPS, PKCE, secure cookies or secure application storage, and exact redirect URIs.

## Common Workflow

1. Open Applications or Clients.
2. Create a client.
3. Choose the client type.
4. Enter name and production application URL.
5. Add exact HTTPS redirect URIs.
6. Add exact HTTPS post-logout redirect URIs.
7. Add CORS origins only when browser calls require them.
8. Choose grants and token behavior.
9. Configure consent if users should approve access.
10. Connect allowed identity providers.
11. Save the client.
12. Test login through the hosted identity UI.
13. Test logout and token/session behavior.

## Permissions And Security

Client management requires tenant client permissions.

Sensitive changes include:

- Adding redirect URIs.
- Adding logout URIs.
- Adding CORS origins.
- Changing client type.
- Changing client secret behavior.
- Enabling refresh tokens.
- Connecting identity providers.
- Disabling consent.
- Changing token lifetimes.

These changes should be audited and may require step-up MFA for administrators.

## Troubleshooting

If login says the redirect URI is invalid, compare the application callback with the client redirect URI exactly.

If the wrong provider appears, check provider status and client-provider connections.

If browser calls fail with CORS, check the client CORS origin and the actual browser origin.

If logout does not return to the app, check post-logout redirect URI configuration.

If tokens are rejected by your app, check issuer hostname, audience, JWKS refresh, token lifetime, and client ID.
