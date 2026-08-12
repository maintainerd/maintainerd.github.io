# System Defaults

Auth seeds a complete tenant baseline instead of leaving a new tenant as an empty shell.

## First-Run Seeding

First-run bootstrap creates the system tenant, then runs the same per-tenant seeding path used for newly created regular tenants.

## Per-Tenant Baseline

Each tenant receives:

- The tenant's own `auth` service record.
- API and permission records.
- Identity provider baseline.
- Seeded console and identity clients.
- Client URI records.
- Registered and super-admin roles.
- Role-permission grants.
- Registration flows.
- Email templates.
- SMS templates.
- Security settings.
- Branding settings.
- Tenant settings.
- Tenant-scoped event-type catalog.

The tenant baseline is idempotent and tenant-scoped.

## Control Policy

The orchestrator control policy is not blindly seeded into every tenant. It is built during setup when the control service is registered, so the grant is scoped to the service that receives it.

## Why This Matters

These defaults explain why a fresh tenant can immediately render login, console, role, template, branding, event, and policy experiences without manual low-level database setup.
