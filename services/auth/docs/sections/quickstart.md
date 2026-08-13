# Quickstart

The quickstart is the shortest path from an empty machine to a running Auth instance you can open in a browser. It is not a production deployment guide. Use it to learn the app, explore the console, and test login flows locally.

## What You Will See

After the quickstart starts, you should be able to open:

- Setup wizard: the first-run screen for creating the initial tenant and administrator.
- Console: the administrator app for tenant, user, provider, client, and policy management.
- Hosted identity UI: the user-facing login, registration, MFA, consent, recovery, and account screen.
- Health or readiness view: the operational signal that the runtime is reachable.

If you are new to Auth, the setup wizard is the first screen that matters. Do not start by editing users or providers before setup is complete.

## Before You Start

You need:

- Docker or another supported local container runtime.
- A local database and Redis if your quickstart does not bundle them.
- Local hostnames mapped to your machine.
- Browser access to the console and hosted identity UI hostnames.
- Permission to trust local TLS certificates if the quickstart uses HTTPS.

Local development can use test credentials and local-only secrets. Production must use real secrets, real TLS, stable hostnames, hardened cookies, persistent storage, and monitored background workers.

## First Screen: Setup Wizard

Open the setup wizard after Auth starts. The wizard exists because Auth needs a safe initial state before anyone can administer the system.

The setup wizard normally asks for:

- System tenant name: the first tenant that owns the installation.
- Tenant slug: the short stable identifier used in URLs and internal lookup.
- Admin email: the first administrator's sign-in and recovery email.
- Admin name: the display name shown in console and audit records.
- Initial password or password setup method: how the first admin proves access.
- Console hostname: where administrators will manage Auth.
- Identity hostname: where users will sign in and manage accounts.

Complete setup once. After setup is locked, normal administrators should use the console instead of returning to first-run setup.

## After Setup: Console Tour

Once setup is complete, sign in to the console and confirm these areas:

- Tenants: shows the current tenant, status, branding, rate limits, messaging, and security defaults.
- Members: shows who can administer the tenant and what role they have.
- Users: shows human accounts inside the tenant.
- Invites: shows pending onboarding links.
- Identity providers: shows password, passwordless, social, OIDC, or SAML login options.
- Registration flows: shows whether signup is open, invite-only, or provider-driven.
- Login and registration: shows how users will enter the hosted identity UI.
- Account self-service: shows what signed-in users can manage themselves.

The point of the quickstart is to make these screens understandable before you wire Auth into a real application.

## Configure The First Login

For a basic local test:

1. Confirm the tenant is active.
2. Confirm the console client is active.
3. Confirm the built-in provider is enabled.
4. Confirm password login is allowed.
5. Create or invite a test user.
6. Open the hosted identity UI.
7. Sign in as the test user.
8. Open account settings and review profile, sessions, and security controls.

If the login page does not show the method you expected, check the tenant, client, provider, and registration-flow settings. The hosted identity UI only shows methods that are actually allowed by backend policy.

## Local Fields To Verify

In the console or setup wizard, verify:

- Tenant status is active.
- Console hostname points to the local console.
- Identity hostname points to the local identity UI.
- Management surface is not publicly exposed.
- Database connection is healthy.
- Redis connection is healthy when enabled.
- Email and SMS providers are either configured or intentionally using local test behavior.
- Cookie and WebAuthn hostnames match the browser hostnames you are using.

These fields are boring in the good way: when they are correct, the rest of the app becomes easier to reason about.

## Common Local Issues

If the browser shows a certificate warning, confirm whether the quickstart uses self-signed local TLS. Trust it only for local development.

If a hostname does not resolve, check your local host mapping and make sure you are opening the hostname Auth expects, not only `localhost`.

If setup does not load, check that the database is reachable, migrations completed, and setup is not already locked.

If login works but passkeys fail, check WebAuthn origin and relying-party settings. Passkeys are hostname-sensitive.

If emails or SMS messages do not arrive, check whether messaging is configured for real delivery or local test output.

## When To Move To Production Docs

Move from quickstart to deployment docs when:

- Other people will use the instance.
- You need public hostnames.
- You need real TLS.
- You need durable database and Redis storage.
- You need real email or SMS delivery.
- You need monitoring, backups, scaling, or key rotation.
- You need a reverse proxy or Kubernetes.

The quickstart teaches the app. Deployment makes it safe to operate.
