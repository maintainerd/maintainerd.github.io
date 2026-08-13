# Setup

Setup is the first-run flow that creates the initial operating state for Auth. It gives the installation a tenant, an administrator, required application records, and enough configuration for the console and hosted identity UI to work.

## Where To Find It

Open the setup wizard from the setup hostname or setup path provided by your deployment. You should see it only before Auth has been initialized.

After setup is complete, setup should be locked. Future changes belong in the console under tenant settings, members, clients, providers, policies, and operations.

## What The Setup Screen Is For

The setup screen answers four questions:

- Who owns this Auth installation first?
- Who is the first administrator?
- Which hostnames should the console and identity app use?
- Which runtime mode should the instance follow?

Setup should create the minimum safe starting point. It should not be used as a general administration tool.

## Fields You Will See

System tenant name is the human-readable name for the first tenant. It appears in the console and may appear in user-facing identity screens depending on branding.

Tenant slug is the stable short identifier for the tenant. It can be used in tenant-aware routing and should be chosen carefully because changing slugs can affect URLs and integrations.

Administrator email is the first admin's login and recovery email. Use an address owned by the person or team responsible for the deployment.

Administrator display name helps identify the first admin in the console and audit records.

Initial credential setup decides how the first admin signs in. A local password is common for development; production should follow the security policy you intend to keep.

Console hostname is where administrators open the Auth console.

Identity hostname is where users complete login, registration, MFA, consent, recovery, and account self-service.

Management API hostname is the private management surface. It should not be treated as a public login site.

Runtime mode decides whether Auth runs standalone, as a runtime service, or under a Maintainerd control plane.

## Setup Modes

Standalone setup is for a single Auth deployment that owns its own console, hosted identity UI, database, Redis, and background jobs.

Runtime gRPC setup is for an Auth runtime that exposes service functionality to a control plane while still serving HTTP identity traffic.

Control-plane setup is for environments where Maintainerd Core owns service registration, lifecycle, and orchestration.

Choose the mode that matches how you will operate the instance. Changing mode later can require hostname, secret, and service-registration changes.

## Setup Workflow

1. Start Auth with database and required secrets available.
2. Open the setup wizard.
3. Enter the tenant, admin, hostname, and runtime values.
4. Review the summary before saving.
5. Submit setup once.
6. Sign in to the console as the first administrator.
7. Confirm setup is locked.
8. Continue configuration from the console.

If setup fails partway through, do not keep retrying blindly. Check database connectivity, secret availability, existing setup state, and logs.

## What Setup Creates

Setup commonly creates:

- The first tenant.
- The first tenant member.
- The first admin user.
- Console and identity application records.
- Required built-in roles or permissions.
- Initial runtime settings.
- Setup lock state.
- Audit records for the bootstrap action.

It may also create default providers, system clients, or templates depending on the runtime package.

## Permissions And Safety

Before setup is complete, the setup wizard is protected by bootstrap controls instead of normal tenant permissions. After setup is locked, normal permissions take over.

Setup should be safe by default:

- It should run only once.
- It should require bootstrap authorization when exposed outside local development.
- It should not leave bootstrap tokens valid forever.
- It should not expose generated secrets in normal pages.
- It should audit the bootstrap action.

## After Setup

After setup, go to the console and configure:

- Tenant status and settings.
- Tenant members.
- Hostnames and branding.
- Secrets and signing keys.
- Email and SMS delivery.
- Identity providers.
- Registration flows.
- Application clients.
- Login and account self-service policies.

Do not use setup as a replacement for these console pages.

## Troubleshooting

If the setup page says setup is already complete, sign in to the console instead.

If setup cannot save, check database connectivity, migrations, secret configuration, and whether another setup attempt already created partial state.

If the first admin cannot sign in, check the admin email, password or credential method, tenant status, console client status, and identity hostname.

If setup appears publicly reachable after completion, check routing and setup lock behavior immediately.
