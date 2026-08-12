# Setup

Setup is the first-run path that prepares an Auth instance for use. The backend exposes setup status and bootstrap routes, and the console exposes `/setup/tenant` and `/setup/admin`.

## Setup Capabilities

- Check setup status.
- Complete setup.
- Create the first tenant.
- Create the first admin.
- Create the first profile.
- Register the control service when Auth is connected to a control plane.

## Bootstrap Token

`SETUP_BOOTSTRAP_TOKEN` is optional but recommended for controlled environments. It is loaded through the configured secret provider, so production deployments can keep the bootstrap credential outside plain environment variables.

## Setup Window

`SETUP_WINDOW_TTL` controls how long setup remains valid. It defaults to `30m` and must be a positive duration.

## Production Notes

- Treat setup as a short-lived bootstrap state.
- Use a secret-backed bootstrap token.
- Complete tenant and admin setup before exposing the public identity surface.
- Verify `/ready` or `/readyz` before sending traffic.
