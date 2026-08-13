# Protect an API

Use this workflow when an external application owns an API and wants Auth to control which users, services, or clients can call it.

Protecting an API has two parts:

- Authentication proves the caller has a valid Auth-issued access token.
- Authorization decides whether that caller may perform the requested action on the requested resource.

The API remains responsible for enforcing the decision. Auth issues tokens, publishes signing keys, stores clients and permissions, and can provide central policy decisions. The external API validates the token, checks the required permission, confirms tenant and resource ownership, and rejects requests that do not pass.

For login and token issuance, see [OAuth & OIDC](#oauth-oidc). For client setup, see [Applications & clients](#clients). Endpoint paths, request payloads, response schemas, and generated examples belong in the [API reference](/services/auth/api/).

## When To Use It

Use API protection when:

- A web application, single-page application, mobile application, backend service, or integration calls your own backend API.
- Your API needs to know which tenant, user, service, client, scopes, or permissions are present.
- You need consistent access rules across application code, backend services, and administrative assignments.
- The UI should hide actions a user cannot perform, while the API still enforces the same rules server-side.
- Machine clients need service-to-service access without a human login.

Do not treat this as a UI-only feature. Buttons, menus, and screens can make the product easier to use, but the protected API must enforce authorization before it reads, changes, or returns protected data.

## Main Concepts

Resource server is the API that receives protected calls. It validates access tokens and enforces authorization decisions.

Client is the application asking for access. A browser app, backend web app, mobile app, or machine client has its own client record in Auth.

Access token is the credential the client presents to the API. The API should validate access tokens, not ID tokens.

Issuer is the Auth origin that issued the token. The API accepts tokens only from the expected issuer.

Audience identifies the intended API or resource. The API rejects tokens issued for another audience.

Scope describes delegated access requested by the client. Scopes are useful for coarse-grained API access, such as allowing an application to call a projects API.

Permission describes an application action. Permissions are useful for product behavior, such as reading a project, approving an invoice, or inviting a member.

Policy evaluates a caller, action, resource, tenant, and context. Policies are useful when the decision depends on resource ownership, tenant rules, environment, plan, or relationship.

## Authentication Versus Authorization

Authentication answers: **Is this a valid caller?**

Your API verifies the access token signature, issuer, audience, expiry, token type, tenant context, and caller identity. If authentication fails, the request is unauthenticated.

Authorization answers: **Can this valid caller do this action here?**

Your API checks scopes, permissions, roles, policy decisions, and resource ownership. If authentication passes but authorization fails, the caller is authenticated but not allowed.

Keep those two checks separate in code and in logs. It makes failures easier to debug and prevents accidental access when a valid user lacks permission for a specific action.

## Resource Server Flow

A standard protected API flow works like this:

1. The application signs in a user or authenticates a machine client through Auth.
2. Auth issues an access token for the configured API audience and requested scopes.
3. The application calls the external API and carries the token as a bearer credential.
4. The API extracts the bearer token before executing business logic.
5. The API validates the token locally or asks Auth to check token state centrally.
6. The API resolves tenant, subject, client, audience, scopes, and permissions from trusted token or authorization data.
7. The API checks whether the caller may perform the requested action.
8. The API confirms the requested resource belongs to the same tenant or an explicitly allowed cross-tenant relationship.
9. The API either processes the request or returns the correct denial response.
10. The API logs the decision with request ID, tenant, subject, client, action, resource, and result.

The bearer credential is normally carried in the `Authorization` header:

```text
Authorization: Bearer <access-token>
```

Never accept the token only from a query string. Query strings are commonly stored in browser history, server logs, analytics, proxies, and monitoring systems.

## Setup Overview

Set up the protected API in this order:

1. Register the application or machine client that will request tokens.
2. Register the API as a resource server or service-owned resource in Auth.
3. Define the audience the API expects.
4. Define scopes for broad API access.
5. Define permissions for application actions.
6. Attach permissions to roles or policies.
7. Assign roles through users, invites, groups, registration flows, or administrative membership.
8. Configure which clients may request access to the API.
9. Configure the external API with issuer, audience, JWKS discovery, and authorization behavior.
10. Test allowed, denied, expired-token, wrong-audience, and wrong-tenant cases.

This page explains the API protection model. The client redirect flow itself is covered in [OAuth & OIDC](#oauth-oidc).

## Required Administrative Access

The administrator configuring API protection needs access to the tenant where the API and clients are managed.

Typical setup requires permission to:

- Create or edit application clients.
- Create or edit service or resource-server records.
- Create or edit API audiences, scopes, and permissions.
- Create or edit roles or policies.
- Assign roles or membership to users and invited members.
- Connect clients to allowed identity providers when user login is part of the flow.
- View audit events when troubleshooting access decisions.

Use least privilege for ongoing operation. For example, a support administrator may need to view access assignments, while a security administrator or tenant owner should control permission and policy changes.

## Register The API

Register one API record for each backend boundary that validates tokens independently.

Use separate API records when services have different audiences, permission sets, ownership boundaries, or operational teams. Do not reuse one audience for unrelated APIs only because they are owned by the same company.

Example API planning values:

```text
API name:     Projects API
Audience:     https://api.app.example.com/projects
Owner tenant: Customer tenant
Token issuer: https://identity-api.auth.example.com
```

The audience should be stable. Changing it requires every client and resource server that depends on the old audience to be updated.

## Define Scopes

Scopes describe what access the client is asking Auth to issue into the token.

Use scopes for broad delegated access that makes sense at consent and client configuration time. Good scopes are understandable to administrators and, when shown, to users.

Examples:

```text
projects.read
projects.write
billing.read
offline_access
```

Use `openid`, `email`, and `profile` only for OpenID Connect identity information. Do not use identity scopes as authorization for your own API actions.

Avoid a single broad scope that covers the entire product unless the application truly needs full access. Narrow scopes make consent clearer and reduce the impact of a compromised token.

## Define Permissions

Permissions describe actions inside the protected application.

Use the `resource:action` pattern so permissions are easy to scan, group, and audit.

Examples:

```text
project:read
project:create
project:update
project:delete
invoice:read
invoice:approve
member:invite
```

Choose permission names from the API's business actions, not from implementation details. `invoice:approve` is clearer than `button:click` or `route:post`.

Keep read and write permissions separate. A user who can view a project should not automatically be able to edit or delete it.

## Assign Permissions To People And Clients

Permissions become useful only after they are assigned through roles, groups, policies, or client rules.

Common assignment paths:

- Tenant roles grant a bundle of permissions to users or members.
- Invites place a new user into the correct tenant role when they accept.
- Registration flows assign a default role for approved self-registration.
- Groups can represent departments, teams, or customer workspaces.
- Machine clients receive service permissions for backend automation.
- Policies add resource-level conditions such as owner, project member, tenant plan, or service relationship.

When a user signs in, Auth can issue token claims or support policy checks based on these assignments. Your API should still enforce resource-specific rules that only the API can know, such as whether a project ID belongs to the caller's tenant.

## Connect Clients To The API

The client that requests tokens must be allowed to request the API audience and scopes.

For each calling application, configure:

- Client type: web, single-page application, mobile, or machine-to-machine.
- Allowed grant type: authorization code with PKCE for user login, or client credentials for service access.
- Redirect and logout URLs for browser-based clients.
- Token endpoint authentication for confidential clients.
- Allowed audience for the protected API.
- Allowed scopes the client may request.
- Provider connections available to users of that client.
- Consent behavior when users must approve access.

Client setup fields are explained in [Applications & clients](#clients). OAuth redirect parameters are explained in [OAuth & OIDC](#oauth-oidc).

## Local JWT Validation

Most APIs should validate JWT access tokens locally for normal request handling. Local validation is fast and avoids calling Auth on every API request.

Use a mature JWT/OIDC library for your framework. Configure the library with Auth's issuer and discovery metadata instead of manually parsing tokens.

Your API should verify:

- The token is present as a bearer credential.
- The token signature is valid.
- The signing key is trusted and comes from Auth's JWKS.
- The token issuer matches the configured Auth issuer.
- The token audience matches the API's audience.
- The token is not expired.
- The token is not before its valid start time.
- The token type is appropriate for API access.
- The token algorithm is allowed by your configuration.
- The tenant claim matches the tenant context expected by the route or resource.
- The subject identifies a user or service principal.
- The client claim identifies an allowed calling client when your API requires that boundary.
- Required scopes or permissions are present before the handler runs.

Cache JWKS according to library support. Refresh JWKS when a token references an unknown key ID, then reject the token if the key is still unknown.

Do not decode a JWT and trust its fields without verifying the signature and issuer. Decoding is inspection; validation is the security check.

## Central Authorization Checks

Use central checks when the decision depends on Auth state that may change during the token lifetime.

Common reasons:

- Immediate revocation matters for the route.
- The token format is opaque or cannot be fully validated locally.
- The decision depends on current role, group, membership, tenant status, or policy state.
- The API wants Auth to evaluate a policy instead of duplicating that policy locally.
- A service wants a policy bundle that can be cached with a short lifetime.

Central checks trade latency for fresher decisions. Use them for high-risk actions, administrative actions, sensitive data access, or permissions that change frequently.

When central checks are unavailable, fail closed for protected actions. A missing authorization decision should not become access.

## Authorization Models

You can combine several models. Choose the smallest model that correctly represents the product.

Scope-based authorization checks whether the token grants broad access to an API area. Use it to decide whether the client may call the API at all.

Permission-based authorization checks named product actions such as `project:update` or `member:invite`. Use it for application features.

Role-based authorization maps many permissions to an operational role such as tenant administrator, billing manager, support agent, or project contributor.

Policy-based authorization evaluates caller, action, resource, tenant, and context. Use it when a decision depends on ownership, membership, tenant status, plan, region, or other business rules.

Resource ownership checks confirm that the requested record belongs to the tenant or subject. Your API usually owns this check because it owns the business data.

For most application APIs, a good pattern is:

```text
valid access token + correct audience + required permission + resource belongs to tenant
```

## Tenant Enforcement

In a multi-tenant system, tenant isolation is part of authorization.

Your API should:

- Read tenant context from validated Auth data.
- Compare tenant context against the requested resource.
- Reject requests where the resource belongs to another tenant.
- Avoid trusting tenant IDs from query strings, form fields, or route parameters unless they match validated Auth context.
- Keep tenant checks close to data access so every read and write uses the same boundary.

System tenant and regular tenant URL behavior is explained in [Hostnames & tenant URLs](#surfaces-hostnames). Member assignment and invitations are explained in [Users & invites](#users-invites).

## User Tokens And Machine Tokens

User tokens represent a signed-in person. Use them when the API action should be attributed to a user and evaluated against that user's tenant membership, roles, permissions, and resource access.

Machine tokens represent a backend client or service principal. Use them for scheduled jobs, internal integrations, import workers, automation, and service-to-service calls.

Do not use a machine token to impersonate a user unless the product has an explicit delegation model and the action is audited as delegated access.

When both a user and backend service are involved, decide which identity is authoritative for each route. A background worker may need its own service permission, while a user-triggered action may also require the user's permission.

## 401 And 403 Responses

Use `401 Unauthorized` when the request is not authenticated.

Return 401 when:

- The bearer token is missing.
- The bearer token cannot be parsed.
- The token signature is invalid.
- The token is expired.
- The issuer is wrong.
- The audience is wrong.

Use `403 Forbidden` when the request is authenticated but not allowed.

Return 403 when:

- The caller lacks the required scope or permission.
- The caller has the permission but not for this tenant.
- The resource belongs to another tenant.
- A policy denies the action.
- The tenant, user, service, or client is disabled for the requested operation.

This split helps client developers fix the right problem. A 401 usually means the caller needs to sign in again or obtain a valid token. A 403 usually means the caller needs different access or the action is intentionally denied.

## Implementation Checklist

Apply these checks before the route handler performs protected work:

1. Extract the bearer token from the authorization header.
2. Validate issuer, signature, key, expiry, token type, and audience.
3. Resolve tenant, subject, client, scopes, and permissions from trusted data.
4. Confirm the client is allowed to call this API when client boundary matters.
5. Check the required scope or permission for the route.
6. Load the resource using tenant-scoped data access.
7. Confirm the resource belongs to the same tenant or an explicitly allowed relationship.
8. Ask Auth for a central policy decision when the action requires current policy state.
9. Return 401 for authentication failures and 403 for authorization denials.
10. Log the decision without logging the token.

Build this as middleware or an interceptor so every protected route uses the same enforcement path.

## Common Integration Patterns

Web application with backend session:

1. The server-side web application signs the user in through authorization code with PKCE.
2. The web application stores its own secure session.
3. The backend obtains or stores access tokens server-side.
4. Calls from the web backend to the protected API include an access token for the API audience.
5. The protected API validates the token and checks permissions.

Single-page or mobile application:

1. The application signs the user in through authorization code with PKCE.
2. The application obtains an access token for the protected API.
3. The application sends the bearer token to the API.
4. The API validates the token locally and checks scopes, permissions, tenant, and resource ownership.
5. The application handles 401 by refreshing or restarting login, and handles 403 by showing an access-denied state.

Machine-to-machine integration:

1. The backend workload authenticates as a confidential machine client.
2. Auth issues an access token for the API audience.
3. The calling service sends the bearer token to the protected API.
4. The protected API validates the token and checks service permissions.
5. The API logs the service principal, client ID, action, resource, and result.

## Caching And Revocation

Use caching deliberately:

- JWKS can be cached because keys rotate through controlled signing-key changes.
- Policy bundles can be cached for a short lifetime when the API can tolerate that delay.
- Authorization decisions for sensitive actions should usually be checked at the time of the action.
- Revoked or disabled users, clients, services, and tenants may require central checks if immediate enforcement is required.

When authorization state changes often, prefer shorter token lifetimes or central checks for sensitive routes.

## Logging And Auditing

Protected APIs should record enough detail to explain why a request was allowed or denied.

Useful fields:

- Request ID or trace ID.
- Tenant ID.
- Subject ID.
- Client ID.
- Token audience.
- Route or operation name.
- Required permission.
- Resource identifier.
- Authorization result.
- Denial reason category.

Do not log access tokens, refresh tokens, authorization codes, client secrets, private keys, or full identity-provider assertions.

Use Auth audit events and application logs together when investigating access behavior. Audit event concepts are covered in [Audit events](#audit).

## Security Checklist

Before exposing a protected API:

- Use HTTPS for all application, Auth, and API traffic.
- Accept only access tokens for API authorization.
- Validate issuer and audience on every protected request.
- Use a standard JWT/OIDC library instead of custom token parsing.
- Reject expired, unsigned, wrongly signed, and wrong-audience tokens.
- Keep read and write permissions separate.
- Check tenant ownership before returning or changing data.
- Use central checks for high-risk or rapidly changing authorization state.
- Return 401 and 403 consistently.
- Log authorization decisions without logging secrets.
- Test allowed and denied cases for every permission.

## Troubleshooting

Token is rejected by the API: check issuer, audience, JWKS discovery, signing key rotation, clock skew, token type, and whether the application requested the correct API audience.

User can sign in but cannot call the API: check client access to the API audience, requested scopes, role assignment, invite acceptance, tenant membership, and permission mapping.

User can call one tenant's data from another tenant: check tenant resolution in the API and verify that data queries are tenant-scoped before loading resources.

Machine client fails authorization: check token endpoint authentication, allowed grant type, API audience, service permissions, and whether the API expects user-only permissions on that route.

Changes in Auth do not take effect immediately: check token lifetime, policy bundle cache lifetime, central authorization settings, and whether the API is using cached authorization data.
