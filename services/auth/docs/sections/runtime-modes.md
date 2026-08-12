# Runtime Modes

Auth can be run as a standalone identity service, as a standalone service with selected gRPC runtime APIs, or as an Auth instance controlled by a Maintainerd control plane. The HTTP product surface is the same product in each mode; the mode mainly decides whether the gRPC listener exists and whether it exposes only runtime calls or the provisioning surface Core uses.

Use this section to choose the right operating shape before deployment. Use Setup for first-run bootstrap and Control plane for the deeper Core provisioning model.

## Always-On HTTP Runtime

Every normal Auth process starts the REST/API runtime after configuration, migrations, application wiring, JWT key setup, Redis setup, telemetry, and workers are ready.

The released `maintainerd-auth` image is an all-in-one binary. In embedded builds it serves:

- Internal management API on `:8080`.
- Public identity and OAuth/OIDC API on `:8081`.
- Management health, readiness, OpenAPI, and Prometheus metrics on `:8082` by default.
- Admin console SPA on `:3000`.
- Hosted identity SPA on `:3001`.

The internal management API should stay private. The public identity API is the issuer/data plane that browsers, external applications, OAuth clients, OIDC discovery, JWKS, login, registration, callbacks, account self-service, and federated identity flows use.

The management port is for machines and operators. Keep `/metrics`, `/readyz`, `/healthz`, `/livez`, and the management OpenAPI route internal to your deployment.

## Background Runtimes

Auth also starts background workers with the server process:

- Auth event retention.
- Tenant retention.
- Short-lived OAuth/session/challenge cleanup.
- Data erasure processing.
- Auth event partition management.
- Signing-key rotation when keys are database-owned.
- Secret refresh.
- Optional gRPC server startup.

These workers are part of every mode. gRPC starts in the background and logs startup failures, while the REST servers continue to own process lifetime.

## Mode Summary

Choose one of three runtime shapes.

## Standalone Mode

Standalone mode is the default. Leave both `CONTROL_PLANE_ENABLED` and `GRPC_ENABLED` unset or `false`.

In this mode Auth serves the HTTP product surface, hosted identity, console, probes, metrics, and workers. It does not bind the gRPC listener at all.

Use standalone mode when:

- You run one Auth deployment for your own organization or application.
- You want to administer Auth through the console and REST management API.
- You do not need peer services to call Auth over gRPC.
- You are not using Maintainerd Core to provision tenants, clients, services, APIs, roles, or policies.

Setup path:

- Use the console setup wizard or REST setup endpoints.
- Do not configure `SETUP_BOOTSTRAP_TOKEN`.
- Do not configure `CONTROL_PLANE_ENABLED`.

Operational posture:

- Publish only the browser-facing and public identity surfaces that your deployment needs.
- Keep the internal API and management port private.
- Use the console for tenant, client, identity provider, policy, user, messaging, branding, security, event, and webhook administration.

## Runtime gRPC Mode

Runtime gRPC mode is standalone Auth plus a machine interface for peer services. Set `GRPC_ENABLED=true` and leave `CONTROL_PLANE_ENABLED=false`.

This binds the gRPC listener on `:50051` and serves runtime-safe services without advertising or registering the pure administrative provisioning services.

Runtime gRPC mode is for:

- Authorization decisions through the gRPC PDP.
- OAuth token introspection.
- Service policy bundle reads.
- Default tenant lookup.
- User and profile reads needed by peer services.

With the control plane off, Auth does not register the administrative gRPC services:

- `SetupService`
- `TenantService`
- `TenantSettingService`
- `ServiceService`
- `APIService`
- `PermissionService`
- `PolicyService`
- `RoleService`
- `ClientService`
- `WorkloadIdentityFederationService`

Two mixed services remain registered because peer services need their read methods:

- `UserService`
- `UserProfileService`

Their write methods are refused when `CONTROL_PLANE_ENABLED` is not true. For example, gRPC user creation, user deletion, role assignment, profile mutation, and similar administrative operations belong to the control plane or REST/console administration, not runtime gRPC.

Use runtime gRPC mode when:

- Your application has multiple services that need fast policy checks or token introspection.
- You want machine-to-machine reads without letting an orchestrator configure the instance.
- You still want humans to administer Auth through the console and REST API.

TLS posture:

- In production, gRPC requires `GRPC_TLS_CERT_FILE` and `GRPC_TLS_KEY_FILE`.
- In non-production, gRPC can run without TLS if no cert/key is configured.
- Set `GRPC_REQUIRE_MTLS=true` and `GRPC_CLIENT_CA_FILE` when peer callers must authenticate with client certificates.
- `GRPC_REQUIRE_MTLS` is optional here because this mode is not the control plane.

Authentication posture:

- Application gRPC methods default-deny unless classified.
- Authenticated gRPC calls use bearer access tokens in authorization metadata.
- Permission-gated calls require service-account tokens bound to a tenant.
- Sensitive mutation methods that exist on mixed services require step-up where configured and are still refused when the control plane is off.

## Control-Plane Mode

Control-plane mode is for Maintainerd Core or another orchestrator that owns Auth provisioning over gRPC. Set `CONTROL_PLANE_ENABLED=true`.

This mode implies `GRPC_ENABLED=true`. You do not need to set both. If `CONTROL_PLANE_ENABLED=true`, Auth starts the gRPC listener and registers the full served gRPC surface.

Control-plane mode enables machine provisioning for:

- First-run setup through `SetupService`.
- Tenant lifecycle and tenant operational settings.
- Services, APIs, permissions, policies, and roles.
- Clients and their configuration.
- Workload identity federation.
- Runtime authorization, token introspection, and peer reads.

Control-plane mode is intentionally stricter than runtime gRPC mode:

- mTLS is mandatory.
- `GRPC_TLS_CERT_FILE` is required.
- `GRPC_TLS_KEY_FILE` is required.
- `GRPC_CLIENT_CA_FILE` is required.
- `GRPC_REQUIRE_MTLS=false` cannot downgrade this mode.
- `SETUP_BOOTSTRAP_TOKEN` is required for gRPC setup bootstrap.

The bootstrap token is sent to setup RPCs as gRPC metadata key `x-setup-token`. Once setup completes, normal calls use service-account access tokens and permission checks.

## Instance Roles

Control-plane deployments use `INSTANCE_ROLE` to distinguish the ecosystem system Auth instance from ordinary Auth instances that Core may provision.

`INSTANCE_ROLE=system` means this instance is the ecosystem system IAM. It may serve system-only provisioning methods such as registering the control service and creating the orchestrator client, resource API, roles, and console client during setup.

`INSTANCE_ROLE=regular` means this instance is application-scoped. It can be provisioned and used, but it must not answer system-only Core provisioning methods. Those calls should go to the system Auth instance.

`INSTANCE_ROLE` is fixed by configuration at process startup. It is not stored in the database and cannot be changed by an API call. With `CONTROL_PLANE_ENABLED` off, the role is inert because the control-plane listener does not exist.

## gRPC Surface By Mode

Standalone mode:

- gRPC listener is not bound.
- No gRPC health, reflection, runtime, or provisioning surface is exposed.
- Setup is REST/console based.

Runtime gRPC mode:

- gRPC listener binds to `:50051`.
- Pure administrative services are not registered.
- Runtime services are available.
- Mixed user/profile write methods are refused.
- Reflection is available only outside production.
- Health status is advertised for registered services.

Control-plane mode:

- gRPC listener binds to `:50051`.
- Full served gRPC surface is registered.
- Bootstrap setup methods require `x-setup-token`.
- Permission-gated methods require service-account access tokens.
- System-only provisioning RPCs require `INSTANCE_ROLE=system`.
- Mutating gRPC calls are audited.

## What Is REST-Only

Some operational and tenant administration features are intentionally REST/console-only, even when gRPC is enabled:

- Security settings such as password policy, MFA policy, lockout, sessions, token policy, threat controls, and IP rules.
- Identity provider management.
- Registration flows and invites.
- Branding and templates.
- Email and SMS provider configuration.
- Webhook endpoint management.
- Auth event browsing and export.
- Account self-service through the hosted identity app.

This keeps the gRPC contract focused on machine runtime and orchestrator provisioning. Tenant operators still use the console and REST management API for day-to-day administration.

## Choosing A Mode

Choose standalone mode for a normal self-hosted Auth deployment.

Choose runtime gRPC mode when other services need Auth as a PDP, introspection service, or peer identity reader, but you still administer the instance yourself.

Choose control-plane mode only when Core or a similar orchestrator provisions the instance. Plan mTLS, bootstrap token delivery, instance role, setup window, and private network access before enabling it.

## Common Misconfigurations

If a peer service gets connection refused on `:50051`, `GRPC_ENABLED` is probably false and `CONTROL_PLANE_ENABLED` is not true.

If the process refuses to start in production with gRPC enabled, configure `GRPC_TLS_CERT_FILE` and `GRPC_TLS_KEY_FILE`.

If the process refuses to start with `CONTROL_PLANE_ENABLED=true`, configure server TLS and `GRPC_CLIENT_CA_FILE`. Control-plane mode cannot run in cleartext or server-only TLS.

If gRPC setup returns `gRPC setup is disabled`, `SETUP_BOOTSTRAP_TOKEN` is not configured.

If a provisioning RPC says the control plane is disabled, the call reached an instance where `CONTROL_PLANE_ENABLED` is not true.

If a provisioning RPC says the instance is not the system Auth instance, direct that call to the deployment configured with `INSTANCE_ROLE=system`.

If a runtime gRPC caller can authenticate but receives permission denied, verify the access token is a service-account token, is bound to the correct tenant, and carries a service principal with the required policy.
