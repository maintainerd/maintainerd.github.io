# Setup

Setup is the one-time bootstrap that turns an empty Auth database into a usable identity system. It creates the system tenant, seeds the tenant baseline, creates the first administrator, and then locks the bootstrap surface so the instance can serve normal login, console, OAuth, and management traffic.

This page focuses on what setup does and how to run it. Use [Quickstart](#quickstart) for the local Docker runbook, [Deployment](#deployment) for production runtime shape, [Environment variables](#environment) for the complete configuration list, and [Secrets & keys](#secrets) for secret-provider details.

## What Setup Creates

The first tenant created during setup is the system tenant. Auth creates it as `pending`, runs the baseline seeders, creates the first admin owner, and then marks the tenant `active` when setup is completed.

The seeded baseline includes:

| Created Item | What It Is Used For |
|---|---|
| Tenant-owned `auth` service and management API model | Gives Auth its own registered service/API structure for authorization. |
| Enforced permission catalog | Defines the operations that can be granted to roles and checked by management routes. |
| Built-in Maintainerd identity provider | Provides the native sign-in method used before external providers are configured. |
| System clients and URI records | Allows the seeded console and identity surfaces to complete browser flows. |
| `registered` and `super-admin` roles | Gives the first admin both normal account access and full tenant administration. |
| Role-permission grants | Connects seeded roles to self-service and administrator permissions. |
| Owner invitation registration flow | Supports the initial owner onboarding path. |
| Email and SMS templates | Provides baseline messaging content for verification, invites, OTP, and recovery flows. |
| Default security settings | Establishes starting policy for password, MFA, sessions, lockout, registration, and threat controls. |
| Default branding | Gives the console and hosted identity UI initial tenant presentation. |
| Tenant settings | Establishes tenant-level operational defaults. |
| Tenant-scoped event type catalog | Enables integration event and webhook configuration after setup. |

The control-plane policy is not seeded as a standing wildcard. In orchestrated setup, Auth builds the control policy only when the control service is registered, using the actions supplied by the orchestrator.

## Setup Status

The setup status endpoint returns four booleans:

| Status Field | Meaning | How To Interpret It |
|---|---|---|
| `is_tenant_setup` | At least one tenant exists. | The tenant step has run. |
| `is_admin_setup` | The bootstrap super-admin exists. | The admin step has run. |
| `is_profile_setup` | The bootstrap admin already has a profile. | Informational for the current console flow. |
| `is_setup_complete` | The system tenant is `active`. | Setup is locked for normal runtime use. |

`is_profile_setup` is informational for the current console flow. Setup completion requires the tenant and admin, not the admin profile. If the admin has no profile after setup, the hosted identity app can collect it on first sign-in.

## Setup Modes

Auth has two setup paths.

| Mode | Used By | Surface | When To Use It |
|---|---|---|---|
| Standalone setup | Teams running Auth directly. | Console wizard backed by REST setup actions. | Use when Auth is not controlled by Maintainerd Core. |
| Orchestrated setup | Maintainerd Core or trusted platform automation. | gRPC `SetupService` over the control plane. | Use when Auth is provisioned by a control plane with mTLS and a bootstrap credential. |

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

| Step | Screen Or Action | Result |
|---:|---|---|
| 1 | Start Auth and wait for readiness. | The setup wizard can safely talk to the backend. |
| 2 | Open `/setup/tenant` on the console host. | The tenant setup screen appears. |
| 3 | Enter a tenant slug and display name. | Auth creates the system tenant and baseline records. |
| 4 | Continue to `/setup/admin`. | The first administrator screen appears. |
| 5 | Enter the first administrator email and a strong password. | Auth has enough information to create the owner account. |
| 6 | Submit the admin form. | The console creates the admin and completes setup. |
| 7 | Sign in through the normal hosted identity flow. | Auth is now in normal runtime behavior. |

Tenant slugs must be DNS-safe: lowercase letters, numbers, and hyphens, starting and ending with a letter or number. This matters because tenant names become subdomain labels in tenant-aware host routing.

The setup admin is created as an email-verified, active user. Auth assigns the `registered` role and the `super-admin` role, creates a tenant membership with role `owner`, and binds the admin identity to the seeded console client and built-in provider.

## REST Setup Surface

The console wizard is backed by setup actions on the management API. Those actions cover setup status, tenant creation, admin creation, optional profile creation, setup completion, and control-service registration.

| Setup Action | Role In Setup |
|---|---|
| Setup status | Tells the console which setup step is still valid. |
| Tenant creation | Creates the system tenant and seeded baseline. |
| Admin creation | Creates the first owner and super-admin account. |
| Optional profile creation | Pre-creates the first admin profile for unattended bootstrap flows. |
| Setup completion | Marks the system tenant active and locks setup. |
| Control-service registration | Registers the orchestrator service when setup is managed by a control plane. |

This documentation explains the role of those actions instead of duplicating request samples. Use the dedicated API reference for exact paths, request bodies, response schemas, status codes, and generated client behavior.

The REST setup surface inherits global security middleware and adds stricter setup limits: setup bodies are small, setup requests time out quickly, and mutating setup actions are refused after setup locks.

Use the console wizard for operator-led setup. Direct setup calls are intended for automated bootstrap, debugging, or smoke tests.

## Profile During Setup

The profile creation setup action exists for unattended bootstrap flows that want to create the first admin profile before anyone signs in. It requires the admin to exist first, is idempotent, and returns the existing profile if it was already created.

The normal console setup flow does not call it. Profile completion belongs to the identity experience, where the first admin can provide personal details during sign-in if no profile exists yet.

## Core And gRPC Setup Flow

Core uses `SetupService` because a fresh instance has no users, roles, clients, or service principals yet. The gRPC bootstrap calls are authenticated with the per-instance bootstrap token in metadata key `x-setup-token`.

The high-level sequence is:

| Order | SetupService Operation | Purpose |
|---:|---|---|
| 1 | `GetSetupStatus` | Inspect current bootstrap state. |
| 2 | `CreateTenant` | Create the system tenant and seed the baseline. |
| 3 | `CreateAdmin` | Create the first owner and super-admin. |
| 4 | `CreateProfile` | Optionally pre-create the admin profile. |
| 5 | `RegisterControlService` | Register Core or another orchestrator as a service principal and attach its explicit control policy. |
| 6 | `EnsureControlClient` | Create the private-key JWT machine client that Core uses after setup. |
| 7 | `EnsureResourceAPI` | Register resource APIs and their permissions. |
| 8 | `EnsureRole` | Create a role from already-registered permissions and optionally assign it to the first admin. |
| 9 | `EnsureConsoleClient` | Register the browser application used by operators. |
| 10 | `CompleteSetup` | Mark the system tenant active and close setup. |

The `Ensure*` calls are declarative get-or-create operations. They are designed for machine provisioning where a network response can be lost; the orchestrator can replay the same request and converge on the same records instead of leaving setup half-failed.

## Control-Plane Requirements

For orchestrated setup:

| Requirement | Why It Matters |
|---|---|
| `CONTROL_PLANE_ENABLED=true` | Enables the privileged setup and provisioning surface. |
| `SETUP_BOOTSTRAP_TOKEN` from the configured secret provider | Authenticates bootstrap calls before normal users and service principals exist. |
| `GRPC_TLS_CERT_FILE` and `GRPC_TLS_KEY_FILE` | Gives the gRPC listener server TLS identity. |
| `GRPC_CLIENT_CA_FILE` | Lets Auth verify trusted control-plane clients. |
| Positive `SETUP_WINDOW_TTL` | Limits how long a fresh instance accepts mutating setup calls. The default is `30m`. |
| `INSTANCE_ROLE=system` for the ecosystem system Auth instance | Required when calling system-only provisioning methods. |

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

| Check | Why It Matters |
|---|---|
| Check readiness through the deployment probe, such as `/readyz`. | Confirms Auth can serve real traffic. |
| Open the console and sign in with the bootstrap admin. | Confirms the first administrator can operate the tenant. |
| Check OIDC discovery on the public identity API: `/.well-known/openid-configuration`. | Confirms the public issuer surface is reachable. |
| Confirm the seeded built-in identity provider exists. | Confirms native sign-in is available before external providers are configured. |
| Configure messaging before enabling email verification, password reset, magic links, invite flows, or email MFA. | These flows cannot deliver messages until email/SMS is configured. |
| Review security settings for password policy, MFA, lockout, session, token, and threat controls. | The defaults should match your organization's access policy before users arrive. |
| Create or update clients for your external applications. | Applications cannot use Auth until they have registered clients. |
| Connect external identity providers to the specific clients that should show those login options. | Provider buttons appear only for connected clients. |
| Configure branding and templates before sending users to hosted login. | Users should see the correct tenant identity and message copy. |
| Enable and test events, webhooks, metrics, tracing, and logs for operations. | Operations and integrations need evidence before traffic begins. |

## Troubleshooting

If the setup page redirects away from `/setup/tenant`, check setup status through the console or API reference workflow. A completed or partially completed setup changes which wizard page is valid.

If `/setup/admin` redirects away, either the tenant has not been created yet or the admin already exists.

If login returns a tenant unavailable error after creating the admin manually, complete setup before attempting normal sign-in. Creating the admin alone is not enough; completion is what activates the system tenant.

If REST setup returns an orchestrator-managed error, this instance has `CONTROL_PLANE_ENABLED=true` and a bootstrap credential. Use gRPC `SetupService` from Core instead of the console wizard.

If gRPC setup returns `gRPC setup is disabled`, the instance has no `SETUP_BOOTSTRAP_TOKEN`. Add the token for orchestrated setup or use the standalone REST wizard.

If gRPC setup returns `invalid setup bootstrap token`, send the configured token in `x-setup-token` metadata and make sure the value came from the same secret provider the instance uses.

If gRPC setup returns a setup-window error, provisioning exceeded `SETUP_WINDOW_TTL`. Restart the fresh instance and rerun the orchestrator flow.

If `RegisterControlService` or an `Ensure*` RPC is refused on a regular instance, call it against the system Auth instance. System-only provisioning methods require `INSTANCE_ROLE=system`.
