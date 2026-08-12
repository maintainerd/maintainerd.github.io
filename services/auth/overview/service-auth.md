# Service Auth

Maintainerd services can use Auth as a token authority and policy decision point instead of duplicating authorization logic in every service.

## Flow

```text
client_credentials token
+ service principal claims
+ GET /api/v1/services/me/policy-bundle
+ local authorization cache or POST /api/v1/authorize/
```

Service clients receive OAuth `client_credentials` tokens with service identity claims. Resource services can fetch their policy bundle with ETag support, evaluate locally, or call the authorization endpoint when a centralized decision is needed.

## Policy Bundles

The policy bundle endpoint lets a service fetch the rules relevant to itself. Bundles are cacheable with ETag support so services can avoid unnecessary reloads.

## gRPC Authorization

The same model backs gRPC authorization. Bearer metadata is validated, service claims are checked, methods map to permissions, and the policy decision point decides whether the request is allowed.

