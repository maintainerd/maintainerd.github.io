# Control Plane

The control plane is the machine surface Core uses to provision and maintain Auth inside the Maintainerd ecosystem. It is not the default deployment path.

## What Core Can Provision

Core-facing gRPC setup and provisioning covers:

- First tenant, admin, and profile bootstrap.
- Control service registration.
- Control-plane machine client creation.
- Resource API and permission registration.
- Role creation and permission grants.
- Console client registration.
- Tenant records and tenant settings.
- Services, APIs, permissions, policies, roles, clients, and workload identity federations.

## Bootstrap

The gRPC `SetupService` is gated by `SETUP_BOOTSTRAP_TOKEN`. If the token is empty, gRPC setup is disabled and standalone instances use the REST setup wizard instead.

`SETUP_WINDOW_TTL` bounds how long the orchestrated setup window remains open after process start. The default is `30m`, and the value must be positive.

## System Instance Boundary

System provisioning RPCs require both:

- `CONTROL_PLANE_ENABLED=true`
- `INSTANCE_ROLE=system`

Regular instances can still expose runtime gRPC when configured, but orchestrator provisioning RPCs fail closed. This is how Auth can be both a standalone product and a Core-managed component without exposing Core's provisioning authority everywhere.

## Caller Model

After bootstrap, permission-gated gRPC calls require service-account access tokens. Mutations that need a human actor use an `on_behalf_of` actor claim so audit attribution and tenant-escalation checks still have a user subject.
