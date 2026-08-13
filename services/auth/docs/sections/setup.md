# Setup

Setup is the one-time bootstrap that turns an empty Auth database into a usable identity system. It creates the system tenant, seeds the tenant baseline, creates the first administrator, and then locks the bootstrap surface so the instance can serve normal login, console, OAuth, and management traffic.

This page focuses on what setup does and how to run it. Use [Quickstart](#quickstart) for the local Docker runbook, [Deployment](#deployment) for production runtime shape, [Environment variables](#environment) for the complete configuration list, and [Secrets & keys](#secrets) for secret-provider details.

## What Setup Creates

The first tenant created during setup is the system tenant. Auth creates it as `pending`, runs the baseline seeders, creates the first admin owner, and then marks the tenant `active` when setup is completed.

The seeded baseline includes:

- The tenant-owned `auth` service and management API model.
- The enforced permission catalog.
- The built-in Maintainerd identity provider.
- System clients and their redirect/logout URI records.
- The `registered` and `super-admin` roles.
- Role-permission grants for self-service and administrator access.
- The owner invitation registration flow.
- Email and SMS templates.
- Default security settings.
- Default branding.
- Tenant settings.
- The tenant-scoped event type catalog for integration events and webhooks.

The control-plane policy is not seeded as a standing wildcard. In orchestrated setup, Auth builds the control policy only when the control service is registered, using the actions supplied by the orchestrator.

## Setup Status

The setup status endpoint returns four booleans:

- `is_tenant_setup`: at least one tenant exists.
- `is_admin_setup`: the bootstrap super-admin exists.
- `is_profile_setup`: the bootstrap admin already has a profile.
- `is_setup_complete`: the system tenant is `active`.

`is_profile_setup` is informational for the current console flow. Setup completion requires the tenant and admin, not the admin profile. If the admin has no profile after setup, the hosted identity app can collect it on first sign-in.

## Setup Modes

Auth has two setup paths.

### Standalone Setup

Standalone setup is the default path for a team running Auth as its own identity provider. `CONTROL_PLANE_ENABLED` is unset or `false`, and the operator uses the console wizard backed by REST setup endpoints.

Open the console setup wizard:

```text
https://console.auth.example.com/setup/tenant
```

In the local quickstart, the URL is:

```text
https://console.auth.maintainerd.local/setup/tenant
```

The wizard creates the tenant first, then creates the admin account, then calls setup completion. After completion, the console returns to `/` and the tenant is active for normal sign-in.

### Orchestrated Setup

Orchestrated setup is for Maintainerd Core or another control plane that provisions Auth over gRPC. Set `CONTROL_PLANE_ENABLED=true`, configure mTLS, provide `SETUP_BOOTSTRAP_TOKEN`, and have the orchestrator call `maintainerd.auth.v1.SetupService`.

When both the control plane and bootstrap credential are configured, the unauthenticated REST wizard is refused. This prevents a browser or network caller from racing the orchestrator to create the system tenant and first admin.

## Standalone Wizard Flow

Use this path when Auth is not controlled by Core.

1. Start Auth and wait for readiness.
2. Open `/setup/tenant` on the console host.
3. Enter a tenant slug and display name.
4. Continue to `/setup/admin`.
5. Enter the first administrator email and a strong password.
6. Submit the admin form. The console calls `create_admin`, then `complete`.
7. Sign in through the normal hosted identity flow.

Tenant slugs must be DNS-safe: lowercase letters, numbers, and hyphens, starting and ending with a letter or number. This matters because tenant names become subdomain labels in tenant-aware host routing.

The setup admin is created as an email-verified, active user. Auth assigns the `registered` role and the `super-admin` role, creates a tenant membership with role `owner`, and binds the admin identity to the seeded console client and built-in provider.

## REST Setup Surface

The console wizard is backed by setup actions on the management API. Those actions cover setup status, tenant creation, admin creation, optional profile creation, setup completion, and control-service registration.

This documentation explains the role of those actions instead of duplicating request samples. Use the dedicated API reference for exact paths, request bodies, response schemas, status codes, and generated client behavior.

The REST setup surface inherits global security middleware and adds stricter setup limits: setup bodies are small, setup requests time out quickly, and mutating setup actions are refused after setup locks.

Use the console wizard for operator-led setup. Direct setup calls are intended for automated bootstrap, debugging, or smoke tests.

## Profile During Setup

The profile creation setup action exists for unattended bootstrap flows that want to create the first admin profile before anyone signs in. It requires the admin to exist first, is idempotent, and returns the existing profile if it was already created.

The normal console setup flow does not call it. Profile completion belongs to the identity experience, where the first admin can provide personal details during sign-in if no profile exists yet.

## Core And gRPC Setup Flow

Core uses `SetupService` because a fresh instance has no users, roles, clients, or service principals yet. The gRPC bootstrap calls are authenticated with the per-instance bootstrap token in metadata key `x-setup-token`.

The high-level sequence is:

1. `GetSetupStatus`: inspect current bootstrap state.
2. `CreateTenant`: create the system tenant and seed the baseline.
3. `CreateAdmin`: create the first owner and super-admin.
4. `CreateProfile`: optionally pre-create the admin profile.
5. `RegisterControlService`: register Core or another orchestrator as a service principal and attach its explicit control policy.
6. `EnsureControlClient`: create the private-key JWT machine client that Core uses after setup.
7. `EnsureResourceAPI`: register resource APIs and their permissions.
8. `EnsureRole`: create a role from already-registered permissions and optionally assign it to the first admin.
9. `EnsureConsoleClient`: register the browser application used by operators.
10. `CompleteSetup`: mark the system tenant active and close setup.

The `Ensure*` calls are declarative get-or-create operations. They are designed for machine provisioning where a network response can be lost; the orchestrator can replay the same request and converge on the same records instead of leaving setup half-failed.

## Control-Plane Requirements

For orchestrated setup:

- Set `CONTROL_PLANE_ENABLED=true`.
- Provide `SETUP_BOOTSTRAP_TOKEN` through the configured secret provider.
- Configure `GRPC_TLS_CERT_FILE` and `GRPC_TLS_KEY_FILE`.
- Configure `GRPC_CLIENT_CA_FILE`.
- Use a positive `SETUP_WINDOW_TTL`; the default is `30m`.
- Use `INSTANCE_ROLE=system` for the ecosystem system Auth instance when calling system-only provisioning methods.

`CONTROL_PLANE_ENABLED=true` implies `GRPC_ENABLED=true` and forces mTLS. The process refuses to start a control plane without server certificate, server key, and client CA configuration.

If `SETUP_BOOTSTRAP_TOKEN` is empty, gRPC setup is disabled. That is expected for standalone installs, which bootstrap through the REST wizard.

For the full gRPC/control-plane deployment model, see [Architecture](#architecture), [Deployment](#deployment), and [Environment variables](#environment). This setup page only describes the bootstrap sequence and the settings that directly affect setup safety.

## Locking And Safety

Setup closes on an active system tenant. Auth does not keep a separate setup-state table; the active system tenant is the durable fact shared by all replicas.

In standalone mode, setup stays available until the tenant and admin are created and setup completion marks the system tenant active.

In orchestrated mode, setup is also bounded by `SETUP_WINDOW_TTL` from process start. If provisioning is abandoned past that deadline, mutating setup calls fail closed. Restart the instance to open a new setup window for the same fresh database.

After setup is locked, mutating setup calls return a conflict such as `setup is complete and locked`.

## After Setup

After setup completes, verify the runtime before configuring application login:

- Check readiness through the deployment probe, such as `/readyz`.
- Open the console and sign in with the bootstrap admin.
- Check OIDC discovery on the public identity API: `/.well-known/openid-configuration`.
- Confirm the seeded built-in identity provider exists.
- Configure messaging before enabling email verification, password reset, magic links, invite flows, or email MFA.
- Review security settings for password policy, MFA, lockout, session, token, and threat controls.
- Create or update clients for your external applications.
- Connect external identity providers to the specific clients that should show those login options.
- Configure branding and templates before sending users to hosted login.
- Enable and test events, webhooks, metrics, tracing, and logs for operations.

## Troubleshooting

If the setup page redirects away from `/setup/tenant`, check setup status through the console or API reference workflow. A completed or partially completed setup changes which wizard page is valid.

If `/setup/admin` redirects away, either the tenant has not been created yet or the admin already exists.

If login returns a tenant unavailable error after creating the admin manually, complete setup before attempting normal sign-in. Creating the admin alone is not enough; completion is what activates the system tenant.

If REST setup returns an orchestrator-managed error, this instance has `CONTROL_PLANE_ENABLED=true` and a bootstrap credential. Use gRPC `SetupService` from Core instead of the console wizard.

If gRPC setup returns `gRPC setup is disabled`, the instance has no `SETUP_BOOTSTRAP_TOKEN`. Add the token for orchestrated setup or use the standalone REST wizard.

If gRPC setup returns `invalid setup bootstrap token`, send the configured token in `x-setup-token` metadata and make sure the value came from the same secret provider the instance uses.

If gRPC setup returns a setup-window error, provisioning exceeded `SETUP_WINDOW_TTL`. Restart the fresh instance and rerun the orchestrator flow.

If `RegisterControlService` or an `Ensure*` RPC is refused on a regular instance, call it against the system Auth instance. System-only provisioning methods require `INSTANCE_ROLE=system`.
