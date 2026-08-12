# Protect An API

Use this workflow when the developer's application has an API that needs authorization decisions from Auth.

## 1. Register The Service

Create a service record for the application or resource server. The service represents the workload that owns protected resources.

## 2. Register APIs And Permissions

Create API records and define permissions for the actions the resource server protects.

Examples:

- `project:read`
- `project:create`
- `project:update`
- `project:delete`

## 3. Assign Permissions

Attach permissions to roles, and assign roles to users through the console, registration flows, or invites.

## 4. Create Policies

Policies describe what principals can do against resources. Attach policies to services so resource servers can fetch a policy bundle or ask Auth for an authorization decision.

## 5. Enforce At Runtime

The resource server can:

- Verify JWT access tokens locally with JWKS.
- Use OAuth introspection when token state must be checked centrally.
- Fetch `/services/me/policy-bundle` for cached service policy data.
- Call `/authorize/` for runtime authorization decisions.
- Use gRPC authorization when runtime gRPC is enabled.

## 6. Observe Decisions

Use auth events, management audit logs, request IDs, trace IDs, and metrics to investigate denials and access behavior.
