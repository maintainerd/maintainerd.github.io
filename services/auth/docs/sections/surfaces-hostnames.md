# Surfaces & Hostnames

Surfaces and hostnames decide where administrators, users, applications, and services reach Auth. They affect redirects, cookies, passkeys, CORS, tenant routing, and security boundaries.

## Where To Configure Them

Hostnames appear in:

- Setup wizard for first-run console and identity hosts.
- Deployment configuration for process-level public and private origins.
- Tenant settings for tenant-specific host routing.
- Application client settings for redirect URIs, logout URIs, and allowed origins.
- Reverse proxy or ingress configuration.
- DNS and TLS configuration.

Most hostname changes require both Auth configuration and infrastructure changes.

## What The Screen Is For

The hostname settings help you answer:

- Where do administrators open the console?
- Where do users sign in?
- Which origin is the OAuth/OIDC issuer?
- Which surface is private management traffic?
- How are tenant-specific hosts resolved?
- Which domains can applications use for redirects and browser calls?
- Which hostnames are valid for passkeys?

If these answers are inconsistent, login and account flows fail in confusing ways.

## Surface Types

Console frontend is the administrator application.

Hosted identity frontend is the user-facing application for login, registration, MFA, consent, recovery, and account self-service.

Public identity API is the issuer and browser/application-facing identity surface.

Internal management API is the private administration and automation surface.

Management port is the operational surface for health, readiness, OpenAPI JSON, and metrics.

gRPC surface is the service-to-service surface when enabled.

Do not expose private management surfaces as public login surfaces.

## Hostname Fields

Public hostname is the origin applications use as the identity issuer and public identity API.

Private hostname is the origin the console uses for management actions.

Identity frontend hostname is where users interact with hosted Auth screens.

Console frontend hostname is where administrators use the console.

Tenant identity hostname is the tenant-specific user-facing host when tenants have custom or slug-based identity hosts.

Tenant console hostname is the tenant-specific admin host when tenant console routing is enabled.

Redirect URI is the application callback URL Auth can send users back to after login.

Logout URI is where Auth can send users after logout.

Allowed origin is a browser origin permitted to call the public identity surface where policy allows it.

WebAuthn relying-party ID is the domain boundary passkeys use.

Cookie domain is the domain boundary browser cookies use.

## Tenant Host Resolution

Tenant host resolution means Auth uses the hostname to determine which tenant owns the request.

This matters before login because the user may not be authenticated yet. Auth must know the tenant before it can show branding, provider buttons, registration rules, MFA policy, and account self-service options.

Use tenant-aware hostnames when:

- Each tenant should have branded identity screens.
- Tenant selection should come from a trusted host instead of a user-submitted ID.
- External applications need tenant-specific login destinations.

## Application Domains

External applications should be registered as clients. Their redirect URIs and allowed origins belong in client configuration, not just static CORS configuration.

When configuring an app, verify:

- The redirect URI exactly matches the application's callback.
- The logout URI is expected.
- The app origin is allowed only when browser calls require it.
- The app uses the correct issuer/public identity hostname.
- The app does not expect to share Auth's browser cookies.

Applications should use OAuth/OIDC tokens and their own application sessions.

## Cookies And SameSite

Cookies are browser state. Their hostname behavior depends on HTTPS, SameSite policy, and cookie domain.

Use host-only cookies when each Auth host should keep independent cookies.

Use a cookie domain only when Auth-owned subdomains need shared first-party session behavior and you control every subdomain in that domain.

Do not use cookie domain settings to share Auth cookies with arbitrary customer applications.

## WebAuthn And Passkeys

Passkeys are strict about origins and relying-party IDs. A passkey created for one domain cannot be freely used from another unrelated domain.

Before enabling passkeys, decide:

- Which identity host users will visit.
- Whether tenant subdomains share a parent domain.
- What relying-party ID should be used.
- Whether console and identity hosts need separate passkey behavior.

Changing passkey hostnames after launch can strand existing credentials.

## Reverse Proxy And TLS

Your reverse proxy or ingress should route each hostname to the correct Auth surface and preserve enough forwarding headers for Auth to detect scheme, host, and client IP safely.

Use TLS for browser-facing surfaces. Keep management and metrics private. Configure trusted proxy CIDRs so rate limits, audit context, and IP restrictions use the real client IP.

## Beginner Workflow

1. Pick console, identity, public API, and private API hostnames.
2. Create DNS records.
3. Configure TLS.
4. Set Auth hostname fields.
5. Configure the reverse proxy or ingress.
6. Complete setup.
7. Register an application client.
8. Add redirect and logout URIs.
9. Test login, logout, account settings, and passkeys.

## Permissions And Security

Hostname and surface changes are administrator or operator actions. They can affect every login and integration, so they should require strong permissions and audit records.

Protect:

- Private management hostname.
- Management port.
- gRPC hostname.
- Cookie domain.
- WebAuthn relying-party ID.
- Application redirect and logout URIs.

## Troubleshooting

If the login page shows the wrong tenant, check tenant host resolution and DNS.

If OAuth redirect fails, check the client's redirect URI and public issuer hostname.

If cookies are missing, check HTTPS, cookie domain, SameSite, and proxy headers.

If passkeys fail, check browser origin and relying-party ID.

If audit IPs show proxy addresses, check trusted proxy configuration.
