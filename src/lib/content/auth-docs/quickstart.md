# Quickstart

This quickstart runs `maintainerd-auth` with PostgreSQL, Redis, and an nginx HTTPS edge. It is the fastest way to try Auth with clean browser URLs, hosted login, OIDC discovery, and the admin console.

Use this for local evaluation. For production, keep the same surface model, but replace the local certificate, local hostnames, sample passwords, and env-backed secrets with your own infrastructure.

## What You Will Run

| Component | Purpose |
|---|---|
| `xreyc/maintainerd-auth:latest` | The all-in-one Auth image. |
| PostgreSQL | Persistent Auth database. |
| Redis | Cache, rate-limit, session, and short-lived state support. |
| nginx | HTTPS reverse proxy for the browser-facing hostnames used by the quickstart. |
| Generated `.env` | JWT keys, encryption key, HMAC key, database settings, hostnames, and cookie settings. |
| Generated TLS certificate | Self-signed certificate for the quickstart `.maintainerd.local` hostnames. |

The Auth image itself serves the backend, admin console, hosted identity UI, workers, probes, metrics, and optional gRPC listener. nginx only gives the local quickstart clean HTTPS hostnames.

## Prerequisites

| Requirement | Why You Need It |
|---|---|
| Docker with Compose support | Runs Auth, PostgreSQL, Redis, and nginx together. |
| `openssl` | Generates local key material and the quickstart TLS certificate. |
| Permission to edit the hosts file | Maps the quickstart hostnames to your machine. |
| Browser certificate approval | The quickstart certificate is self-signed, so the browser asks for one-time approval. |

On Linux and macOS, the hosts file is usually `/etc/hosts`. On Windows, it is usually `C:\Windows\System32\drivers\etc\hosts`.

## 1. Create An Empty Folder

Create a folder for the quickstart files:

```bash
mkdir maintainerd-auth-quickstart
cd maintainerd-auth-quickstart
```

## 2. Download The Quickstart Files

Download these four files from the `maintainerd-auth` repository:

- [docker-compose.yml](https://raw.githubusercontent.com/maintainerd/maintainerd-auth/main/examples/quickstart/docker-compose.yml)
- [.env.example](https://raw.githubusercontent.com/maintainerd/maintainerd-auth/main/examples/quickstart/.env.example)
- [nginx.conf](https://raw.githubusercontent.com/maintainerd/maintainerd-auth/main/examples/quickstart/nginx.conf)
- [setup.sh](https://raw.githubusercontent.com/maintainerd/maintainerd-auth/main/examples/quickstart/setup.sh)

With `curl`:

```bash
curl -fsSLO https://raw.githubusercontent.com/maintainerd/maintainerd-auth/main/examples/quickstart/docker-compose.yml
curl -fsSLO https://raw.githubusercontent.com/maintainerd/maintainerd-auth/main/examples/quickstart/.env.example
curl -fsSLO https://raw.githubusercontent.com/maintainerd/maintainerd-auth/main/examples/quickstart/nginx.conf
curl -fsSLO https://raw.githubusercontent.com/maintainerd/maintainerd-auth/main/examples/quickstart/setup.sh
```

## 3. Generate Local Secrets And TLS

Copy the sample environment file, then run the setup script:

```bash
cp .env.example .env
chmod +x setup.sh
./setup.sh
```

The script appends quickstart secrets to `.env`:

- `APP_ENCRYPTION_KEY`
- `HMAC_SECRET_KEY`
- `JWT_PRIVATE_KEY`
- `JWT_PUBLIC_KEY`

It also creates a self-signed TLS certificate in `certs/` for the local console, identity, console API, and identity API hostnames.

Do not commit the generated `.env` or `certs/` directory.

## 4. Add Local Hostnames

Add the quickstart hostnames to your hosts file:

```bash
sudo tee -a /etc/hosts >/dev/null <<'EOF'
127.0.0.1 console.auth.maintainerd.local identity.auth.maintainerd.local console-api.auth.maintainerd.local identity-api.auth.maintainerd.local
EOF
```

These names map the browser and nginx to your local Docker stack:

| Hostname | What It Opens |
|---|---|
| `console.auth.maintainerd.local` | Admin console. |
| `identity.auth.maintainerd.local` | Hosted identity UI. |
| `console-api.auth.maintainerd.local` | Internal management API behind nginx. |
| `identity-api.auth.maintainerd.local` | Public identity API and OIDC issuer behind nginx. |

## 5. Start Auth

Start the stack:

```bash
docker compose up -d
```

Check that the containers are running:

```bash
docker compose ps
```

Follow logs if startup is still settling:

```bash
docker compose logs -f auth nginx
```

Auth runs database migrations at startup, so the first boot can take a moment before readiness passes.

## 6. Open The Setup Wizard

Open:

```text
https://console.auth.maintainerd.local/setup/tenant
```

Your browser will warn about the self-signed local certificate. Accept it for this local setup, then create:

1. The first tenant.
2. The first admin user.
3. The initial admin profile if prompted.

After setup, use the admin console to configure messaging, security, identity providers, OAuth clients, roles, permissions, policies, branding, events, and webhooks.

## Local URLs

| URL | Purpose |
|---|---|
| `https://console.auth.maintainerd.local/setup/tenant` | Setup wizard. |
| `https://console.auth.maintainerd.local` | Admin console. |
| `https://identity.auth.maintainerd.local` | Hosted identity UI. |
| `https://identity-api.auth.maintainerd.local` | Public identity API and OIDC issuer. |

## Verify The Runtime

Use the browser and Docker logs for the quickstart verification path:

| Check | Expected Result |
|---|---|
| Open the console host. | The setup wizard loads. |
| Complete tenant and admin setup. | The first tenant is active and the admin can sign in. |
| Open the hosted identity UI. | A sign-in flow can start. |
| Check the Auth container. | Docker reports the container is running and healthy. |
| Check nginx routing. | Console and identity hostnames resolve through nginx. |

Use the API reference for exact health, discovery, and JWKS request details when you need command-line probes.

If you need to inspect the private in-container ports from Docker, the Auth container serves:

| Port | Surface |
|---:|---|
| `3000` | Embedded admin console. |
| `3001` | Embedded hosted identity UI. |
| `8080` | Internal management API. |
| `8081` | Public identity API and OIDC issuer. |
| `8082` | Management health and Prometheus metrics. |

The quickstart does not publish those ports directly. nginx is the entry point.

## First Things To Configure

After the setup wizard, a useful first pass is:

| Order | Task | Why It Comes Early |
|---:|---|---|
| 1 | Configure email. | Registration, invites, reset password, magic links, and email verification depend on it. |
| 2 | Configure SMS if you need it. | SMS login and SMS MFA need provider configuration before testing. |
| 3 | Review password, MFA, session, lockout, registration, and threat controls. | These settings change how users can sign in and recover accounts. |
| 4 | Create an OAuth client for your app. | External applications need a registered client before redirecting users to Auth. |
| 5 | Add redirect and post-logout redirect URIs. | OAuth and logout only work for registered URLs. |
| 6 | Add an external identity provider if needed and attach it to the client. | Provider login options appear only when the provider is connected to the client. |
| 7 | Start an OAuth login request with the app's `client_id`. | This proves the client, provider, redirect, and hosted identity flow are connected. |
| 8 | Register services, APIs, permissions, roles, and policies if your app has protected APIs. | The app needs authorization data before enforcing protected resource access. |

Use **External app setup**, **Federated login per client**, and **Protect an API** for the next guide-level workflows.

## Common Issues

### The Browser Shows A Certificate Warning

That is expected for the local quickstart. `setup.sh` creates a self-signed certificate for local HTTPS. Accept it only for this local environment.

### The Hostname Does Not Resolve

Re-check your hosts file. All four quickstart hostnames should point to `127.0.0.1`.

### The Setup Page Does Not Load

Check the stack:

```bash
docker compose ps
docker compose logs auth nginx
```

The first boot runs migrations before the app is fully ready. If Postgres is still starting, wait and retry.

### Passkey Enrollment Fails Locally

The quickstart sets `WEBAUTHN_RP_ID=auth.maintainerd.local` so passkeys can work across the local console, identity, and tenant subdomains. If you change hostnames, update the RP ID to a registrable parent of those surfaces.

### Email Or SMS Codes Do Not Arrive

The quickstart does not configure a real email or SMS provider. Configure providers in the console before testing those flows so Auth behaves like the environment users will actually run.

## Stop Or Reset

Stop the stack:

```bash
docker compose down
```

Delete all local database state and start fresh:

```bash
docker compose down -v
```

If you reset volumes, rerun setup from the browser after starting the stack again.

## Production Differences

For production:

| Area | Production Expectation |
|---|---|
| DNS and TLS | Use real DNS and trusted TLS certificates. |
| Private surfaces | Keep the internal management API and management port private. |
| Runtime environment | Leave `APP_ENV` unset or set `APP_ENV=production` explicitly. Auth defaults to production behavior when `APP_ENV` is not provided. |
| Database transport | Use `DB_SSLMODE=require` or stricter. |
| Credentials | Replace sample passwords. |
| Secret storage | Source secrets from a provider such as files, AWS Secrets Manager, AWS SSM, Vault, Azure Key Vault, or GCP Secret Manager. |
| Cookies | Keep `COOKIE_SECURE=true`. |
| Observability | Configure logs, traces, metrics, health checks, and alerts before traffic. |
| Image tag | Pin a specific `xreyc/maintainerd-auth` image version instead of `latest`. |
