# Services, APIs & Permissions

Services, APIs, and permissions are the building blocks for service authorization.

## Services

Services represent workloads. A service can be created, read, updated, disabled, deleted, and assigned policies.

## APIs

APIs represent protected resource surfaces. API records are used by permissions and token audience/resource scoping.

## Permissions

Permissions describe named operations. They are attached to roles and used by management route guards.

## Sensitive Changes

Updating, disabling, deleting, or reassigning authorization-bearing resources requires step-up because these changes alter decisions for active users or workloads.
