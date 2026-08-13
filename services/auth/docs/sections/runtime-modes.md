# Runtime Modes

Runtime mode describes how Auth is operated. It affects which process responsibilities are enabled, which service surfaces are exposed, and how Auth participates in a Maintainerd deployment.

## Where To Find It

Runtime mode is usually chosen during setup and then reviewed from the console or deployment configuration.

Look for it in:

- Setup wizard: initial mode selection.
- Console settings: runtime summary and service registration state.
- Deployment configuration: environment values, process flags, and control-plane settings.
- Operations pages: health, readiness, background jobs, and gRPC status.

## What The Screen Is For

The runtime mode screen or summary should help operators answer:

- Is this Auth instance running by itself or under a control plane?
- Does it serve the console?
- Does it serve the hosted identity UI?
- Does it expose the public identity surface?
- Does it expose the internal management surface?
- Does it expose gRPC?
- Are background jobs running here?

This is operational information. It helps prevent exposing private surfaces or disabling workers by accident.

## Modes You Can Choose

Standalone mode runs Auth as a complete service. It is the simplest option for quickstart evaluation, small deployments, and teams that want Auth to own its own runtime.

Runtime gRPC mode keeps Auth's HTTP identity surfaces available while also exposing service-to-service gRPC behavior for Maintainerd runtimes.

Control-plane mode is used when Maintainerd Core controls service lifecycle, registration, discovery, and orchestration.

Some installations split responsibilities across instances. For example, one instance may serve HTTP traffic while another runs background jobs. If you split roles, make sure every required role is running somewhere.

## Fields And Controls

Mode shows the selected operating model: standalone, runtime gRPC, or control-plane integrated.

HTTP enabled means Auth serves browser and API traffic.

Console enabled means the embedded administrator UI is available.

Identity UI enabled means the hosted login and account UI is available.

Management surface enabled means private administrative routes are available. This should be internal or strongly protected.

Public identity surface enabled means login, OAuth, OIDC discovery, JWKS, callbacks, registration, and self-service can operate.

gRPC enabled means Auth accepts service-to-service traffic.

Background jobs enabled means workers process cleanup, lifecycle, events, key rotation, webhook delivery, erasure, and related tasks.

Instance role tells you whether the process is expected to serve web traffic, run workers, serve gRPC, or combine those responsibilities.

## How To Choose A Mode

Use standalone mode when you want the easiest mental model. One service owns the console, identity UI, APIs, and workers.

Use runtime gRPC mode when Auth needs to participate as a Maintainerd runtime service while still owning identity traffic.

Use control-plane mode when Maintainerd Core is responsible for orchestration and service registration.

Use split instance roles only when you have production operational needs such as scaling web traffic separately from background jobs.

## Beginner Workflow

1. Start with standalone mode locally.
2. Complete setup.
3. Confirm the console and hosted identity UI both load.
4. Confirm background jobs are running.
5. Add gRPC only when another Maintainerd service or Core actually needs it.
6. Move to split roles only after you understand which work each process performs.

## Permissions And Security

Viewing runtime mode may be allowed to operators with read-only administration access. Changing runtime mode is a deployment or owner-level action because it can expose private surfaces or stop required workers.

Protect these especially carefully:

- Management surface exposure.
- gRPC listener exposure.
- Bootstrap tokens.
- Control-plane registration credentials.
- Worker shutdown or role changes.

## Troubleshooting

If the console loads but login does not work, check whether the public identity surface and identity UI are enabled.

If setup completes but background tasks never run, check worker role configuration.

If Maintainerd Core cannot reach Auth, check runtime mode, gRPC enablement, service registration, network routing, and control-plane credentials.

If private management routes are reachable from the public internet, fix routing before continuing.
