# Quickstart

This quickstart runs the released `maintainerd-auth` image locally with PostgreSQL, Redis, and an nginx HTTPS edge. It is the fastest way to try Auth with clean browser URLs, hosted login, OIDC discovery, and the admin console without building from source.

Use this for local evaluation. For production, keep the same surface model, but replace the local certificate, local hostnames, sample passwords, and env-backed secrets with your own infrastructure.

## What You Will Run

- `xreyc/maintainerd-auth:latest`: the all-in-one Auth image.
- PostgreSQL: persistent Auth database.
- Redis: cache, rate-limit, session, and short-lived state support.
- nginx: local HTTPS reverse proxy for the browser-facing hostnames.
- A generated `.env`: local JWT keys, encryption key, HMAC key, database settings, hostnames, and cookie settings.
- A generated self-signed TLS certificate for the local `.maintainerd.local` hostnames.

The Auth image itself serves the backend, admin console, hosted identity UI, workers, probes, metrics, and optional gRPC listener. nginx only gives the local quickstart clean HTTPS hostnames.

## Prerequisites

- Docker with Compose support.
- `openssl`.
- Permission to add local hostnames to your hosts file.
- A browser where you can accept a one-time self-signed certificate warning.

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

The script appends local-only secrets to `.env`:

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

- `console.auth.maintainerd.local`: admin console.
- `identity.auth.maintainerd.local`: hosted identity UI.
- `console-api.auth.maintainerd.local`: internal management API behind nginx.
- `identity-api.auth.maintainerd.local`: public identity API and OIDC issuer behind nginx.

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

- Setup wizard: `https://console.auth.maintainerd.local/setup/tenant`
- Admin console: `https://console.auth.maintainerd.local`
- Hosted identity UI: `https://identity.auth.maintainerd.local`
- OIDC discovery: `https://identity-api.auth.maintainerd.local/.well-known/openid-configuration`
- Public JWKS: `https://identity-api.auth.maintainerd.local/.well-known/jwks.json`

## Verify The Runtime

Check the public OIDC discovery document:

```bash
curl -k https://identity-api.auth.maintainerd.local/.well-known/openid-configuration
```

Check the public API health through nginx:

```bash
curl -k https://identity-api.auth.maintainerd.local/readyz
```

Check the console in your browser:

```text
https://console.auth.maintainerd.local
```

If you need to inspect the private in-container ports from Docker, the Auth container serves:

- `3000`: embedded admin console.
- `3001`: embedded hosted identity UI.
- `8080`: internal management API.
- `8081`: public identity API and OIDC issuer.
- `8082`: management health and Prometheus metrics.

The quickstart does not publish those ports directly. nginx is the entry point.

## First Things To Configure

After the setup wizard, a useful first pass is:

1. Configure email before testing registration, invites, reset password, magic links, and email verification.
2. Configure SMS before testing SMS login or SMS MFA.
3. Review password, MFA, session, lockout, registration, and threat controls.
4. Create an OAuth client for your app.
5. Add redirect and post-logout redirect URIs.
6. Optionally create an external identity provider and attach it to that client.
7. Start an OAuth login request with that app's `client_id`.
8. Register services, APIs, permissions, roles, and policies if your app has protected APIs.

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

The quickstart does not configure a real email or SMS provider. Configure providers in the console before testing those flows. For local-only OTP testing, the sample env includes `MAINTAINERD_DEV_LOG_OTP=true` as a commented option; never enable that in production.

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

- Use real DNS and trusted TLS certificates.
- Keep the internal management API and management port private.
- Use `APP_ENV=production`.
- Use `DB_SSLMODE=require` or stricter.
- Replace sample passwords.
- Source secrets from a provider such as files, AWS Secrets Manager, AWS SSM, Vault, Azure Key Vault, or GCP Secret Manager.
- Keep `COOKIE_SECURE=true`.
- Configure observability before traffic: logs, traces, metrics, health checks, and alerts.
- Pin a specific `xreyc/maintainerd-auth` image version instead of `latest`.
