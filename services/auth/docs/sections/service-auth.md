# Service Auth

Service authorization is the runtime path for Maintainerd services and external workloads that need central policy decisions.

## Integration Paths

- Fetch a service policy bundle from `/services/me/policy-bundle`.
- Call `/authorize/` for an authorization decision.
- Use JWT-authenticated service identity.
- Use gRPC authorization for protected service methods when gRPC is enabled.

## Policy Bundles

Policy bundles let services cache authorization rules locally. `ETag` and `304 Not Modified` support reduce unnecessary transfers.

## Authorization Endpoint

The authorization endpoint evaluates a service request against Auth's policy model.

## Operational Guidance

- Treat service authorization as a runtime dependency.
- Cache policy bundles with their ETag.
- Emit service-side decision logs with Auth trace identifiers when available.
