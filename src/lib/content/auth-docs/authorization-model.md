# Authorization Model

Auth combines RBAC with IAM-style service authorization.

## RBAC

- Roles collect permissions.
- Users receive roles directly, by invitation, or through registration flows.
- Management routes use permission middleware.

## IAM Resources

- Services represent workloads that need policy decisions.
- APIs represent protected resource groups.
- Permissions describe allowed operations.
- Policies express document-based authorization rules.

## Decision Shape

- Default deny.
- Explicit deny takes precedence.
- Service-policy assignment controls which policies a workload receives.
- Sensitive authorization changes require step-up.

## Where Decisions Happen

- The console manages roles, permissions, policies, services, and APIs.
- Services fetch policy bundles or call the authorization endpoint.
- Auth emits events and audit records around security-relevant decisions.
