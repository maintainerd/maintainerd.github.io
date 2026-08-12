# Policies

Policies define document-based authorization rules for services.

## Policy Lifecycle

- List policies.
- Create policies.
- Read policy detail.
- Update policies.
- Change policy status.
- Delete policies.
- View services using a policy.

## Policy History

Policy history is available so operators can inspect previous versions and understand how authorization changed over time.

## Service Assignment

Policies become active for a workload when they are assigned to a service. Assignment and removal are sensitive operations and require step-up.

## Runtime Consumption

Services retrieve policy bundles from `/services/me/policy-bundle`. Auth supports `ETag` and `304 Not Modified` behavior for unchanged bundles.
