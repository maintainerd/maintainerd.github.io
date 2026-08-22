# Standalone Setup

This is the complete runbook for `MAINTAINERD_MODE=standalone` — Auth plus Secret, no Maintainerd Core. You create Secret's identity by hand in Auth's console, hand it to Secret as environment variables, then run the first-run wizard.

Follow the steps in order. Everything in steps 1 to 7 happens in **Auth's console**, before Secret starts.

If Core provisions your services, none of this applies — see [Run modes](#run-modes).

## Before You Start

| Prerequisite | Why |
|---|---|
| Auth is running and its own setup is complete. | Secret verifies tokens against Auth's JWKS, issuer, and audience. It creates nothing in Auth. |
| A PostgreSQL database exists for Secret. | Migrations are embedded and applied on boot. |
| You can generate and store a 32-byte root key outside the database. | A store cannot unlock itself. See [Security](#security). |
| You have a hostname for the console. | The SPA client's redirect URIs are absolute. |

## The Steps, In Order

| Step | In Auth's Console | Produces |
|---:|---|---|
| 1 | Create the service principal for Secret. | The identity Auth knows the vault by. |
| 2 | Create the resource API and give it an identifier. | `AUTH_AUDIENCE` |
| 3 | Register the twelve `secret:` permissions on that resource API. | The vocabulary tokens can carry. |
| 4 | Create the backend m2m client. | `SECRET_CLIENT_ID` plus `SECRET_CLIENT_SECRET` or `SECRET_CLIENT_PRIVATE_KEY_FILE` |
| 5 | Create the frontend SPA client for the console. | `SECRET_CONSOLE_CLIENT_ID` |
| 6 | Note Auth's issuer and JWKS URL. | `AUTH_ISSUER`, `AUTH_JWKS_URL` |
| 7 | Grant your operators permissions on the resource API. | What a signed-in human can actually do. |
| 8 | Start Secret and run the first-run wizard. | Secret's tenant mirror, default project, and default environment. |

### 1. Create The Service Principal

Create the service principal for Secret. This is the identity Auth knows the vault by. Note its tenant.

### 2. Create The Resource API

Create the resource API for Secret and give it an **identifier** — for example `maintainerd-secret`.

This identifier is the `aud` claim Secret will demand, so write it down: it becomes `AUTH_AUDIENCE`. Use the identifier, not the resource API's display name. That substitution is one of the two most common ways a working configuration produces `401` on every call; the other is a trailing slash on the issuer.

### 3. Register The Permissions

Register **exactly** these twelve on that resource API, spelled exactly like this:

```text
secret:ReadMetadata      secret:GetSecret         secret:PutSecret
secret:DeleteSecret      secret:RotateSecret      secret:ListSecrets
secret:ManageProject     secret:ManageEnvironment secret:ManageFolder
secret:ManageRotation    secret:ReadAudit         secret:Admin
```

The list is not decorative and it is not a superset to trim. Secret's guard demands these strings. A permission that exists in the guard and not in Auth can never be carried by any token, so **every call using it answers `403` regardless of who makes it, with nothing in any log saying why.**

A running instance reports the same list at `GET /api/v1/setup/status` (with the setup token or `secret:Admin`), derived from the code that enforces it. Check against that rather than against a document if they ever disagree.

What each permission guards is on the [Permissions](#permissions) page.

### 4. Create The Backend m2m Client

Create a **confidential** client with the `client_credentials` grant for the Secret service itself, and grant it the permissions it needs.

Keep its **client id** and either its **client secret** or its **private key**, depending on the client authentication method you chose:

| Method | Variables | Notes |
|---|---|---|
| Client secret | `SECRET_CLIENT_ID` + `SECRET_CLIENT_SECRET` | The simpler option. |
| `private_key_jwt` | `SECRET_CLIENT_ID` + `SECRET_CLIENT_PRIVATE_KEY_FILE` | Stronger, because the credential never leaves the host. |

Setting both `SECRET_CLIENT_SECRET` and `SECRET_CLIENT_PRIVATE_KEY_FILE` is a boot error.

### 5. Create The Frontend SPA Client

Create a **public** client for Secret's console — `authorization_code` with PKCE (`S256`) **required**, no client secret — with:

| Setting | Value |
|---|---|
| Redirect URI | `https://<console-host>/auth/callback` |
| Post-logout redirect URI | `https://<console-host>` |
| Scopes | `openid profile email` |
| Audience | The resource-API identifier from step 2 |

Keep its **client id**. It becomes `SECRET_CONSOLE_CLIENT_ID`.

### SPA Client Versus Backend Client

These are **two different clients** and confusing them is the most common way to get this setup wrong.

| | Backend m2m client (step 4) | Frontend SPA client (step 5) |
|---|---|---|
| Client type | Confidential | Public |
| Grant | `client_credentials` | `authorization_code` + PKCE (`S256`) |
| Has a secret | Yes — a client secret or a private key | **No.** A public client has no secret. |
| Who uses it | The Secret service process | The browser, on behalf of a signed-in operator |
| Variable | `SECRET_CLIENT_ID` / `SECRET_CLIENT_SECRET` | `SECRET_CONSOLE_CLIENT_ID` |
| Where the value may appear | Process environment, a mounted file | The browser — it is published in every page load |

`SECRET_CLIENT_SECRET` must never appear in the console's `config.js`, in a `.env` consumed by Vite, or in anything else served to a browser. `config.js` is downloaded by every visitor.

`SECRET_CONSOLE_CLIENT_ID` is not a credential, but it is still required outside development: a console pointed at a client id that does not exist sends the operator to an error they cannot act on. The service validates it at boot and the console signs in with it, so there is one value per concept and no way for the two halves to disagree.

### 6. Note The Issuer And JWKS URL

Record Auth's hosted identity origin and its JWKS endpoint. They become `AUTH_ISSUER` and `AUTH_JWKS_URL`.

All three of `AUTH_ISSUER`, `AUTH_JWKS_URL`, and `AUTH_AUDIENCE` must be set together or not at all. A partial set is a boot error in either run mode.

### 7. Grant Your Operators Permissions

What a signed-in user can do in the console comes from **their grants in Auth**, not from what the console asks for.

Start people on `secret:ReadMetadata` and add `secret:GetSecret` deliberately — they are separate grants precisely so that reveal is a decision. Grants can be narrowed to a project or an environment; see the grant grammar on [Permissions](#permissions).

### 8. Start Secret

Set the variables below and start the process, then open the console and run the first-run wizard.

## Worked Example

```bash
# --- what you created in Auth, steps 1-6 ------------------------------------
export MAINTAINERD_MODE=standalone                # the default; set it anyway, explicitly
export AUTH_ISSUER=https://identity.auth.example/
export AUTH_JWKS_URL=https://identity-api.auth.example/.well-known/jwks.json
export AUTH_AUDIENCE=maintainerd-secret           # the resource-API identifier (step 2)

export SECRET_CLIENT_ID=secret-backend            # backend m2m client (step 4)
export SECRET_CLIENT_SECRET=...                   # or SECRET_CLIENT_PRIVATE_KEY_FILE=/run/secrets/secret-client.pem
export SECRET_CONSOLE_CLIENT_ID=secret-console    # frontend SPA client (step 5)

# --- this service's own configuration ---------------------------------------
export APP_ENV=production
export DB_HOST=... DB_PORT=5432 DB_USER=... DB_PASSWORD=... DB_NAME=maintainerd_secret
export DB_SSLMODE=require                         # "disable" is refused outside development
export SECRET_ROOT_KEY=$(openssl rand -hex 32)    # store this OUTSIDE the database
export SETUP_BOOTSTRAP_TOKEN=$(openssl rand -hex 24)

./bin/secretd
```

The complete variable list, with defaults, is on [Environment variables](#environment).

## First Boot

Migrations are embedded and applied on boot. The boot log states, in order, the app environment and mode, the run mode with the identity it will enforce against, the root key that was loaded, and the authorization posture.

| Log line | Fields | What To Check |
|---|---|---|
| `starting maintainerd-secret` | `app_env`, `mode`, `grpc_port`, `http_port`, `root_key_provider` | `mode` reads `standalone (an operator provisions this instance; auth is configured by environment)`. |
| `run mode: standalone` | `auth_issuer`, `auth_audience`, `auth_jwks_url`, `client_id`, `client_auth`, `console_client_id` | Any of them printing `(not set)` is the variable to fix. |
| `root of trust loaded` | `kek_id` | The root key was accepted. |
| `migrations applied` | — | The schema is current. |
| `authorization: ENFORCED` | `service`, `mode`, the permission list | `mode=enforced`. If it reads `DEV-OPEN` you are not enforcing anything; if it reads `UNAVAILABLE` the API is answering `503`. |

The issuer and the audience are logged on purpose: they appear in every token this service verifies, and they are the two values most often subtly wrong. **Neither the client secret nor the private-key path is ever logged.**

## Provision The Instance

The first-run wizard is at `POST /api/v1/setup`, gated by `SETUP_BOOTSTRAP_TOKEN` in the `X-Setup-Token` header, compared in constant time and rate-limited per client IP.

```bash
curl -X POST https://secret.example/api/v1/setup \
  -H "X-Setup-Token: $SETUP_BOOTSTRAP_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"controller":"ops@example.com","tenant":"acme","project":"platform","environment":"prod"}'
```

| Field | Required | Default |
|---|---|---|
| `controller` | Yes | — Identifies the operator closing the setup window. Recorded on the durable lock and in the audit trail. |
| `tenant` | No | `SECRET_DEFAULT_TENANT` |
| `tenant_display_name` | No | Cosmetic. |
| `project` | No | `SECRET_DEFAULT_PROJECT` |
| `environment` | No | `SECRET_DEFAULT_ENVIRONMENT` |
| `auth_tenant_uuid` | No | Links this tenant mirror to an Auth tenant. Optional in standalone mode, which owns its own tenant names. |

The minimal standalone bootstrap is a `POST` with only a controller name. The console's wizard at `/setup` drives the same endpoint.

The setup lock is a durable row in the database, not process memory, so the window does not reopen on restart.

## Verify

```bash
curl https://secret.example/api/v1/setup/status
```

An anonymous caller gets **one bit** — `{"completed": true}` — and nothing else. The controller identity, the tenant, the Auth tenant it maps to, and the enforced permission list are reconnaissance about a vault, and they require the setup token or a verified `secret:Admin` grant:

```bash
curl https://secret.example/api/v1/setup/status -H "X-Setup-Token: $SETUP_BOOTSTRAP_TOKEN"
```

The privileged response carries `completed`, `controller`, `controller_kind`, `mode`, `completed_at`, `tenant`, `auth_tenant_uuid`, `project`, `environment`, `permissions`, and `rest_wizard_open`. Compare `permissions` against what you registered in step 3.

Then open the console and sign in. See [Console](#console).

## Troubleshooting

| Symptom | Likely Cause |
|---|---|
| The process refuses to start, naming several variables. | Standalone mode outside development with an incomplete identity configuration. It names all of them at once, so fix them in one pass. |
| The process refuses to start, naming `AUTH_JWKS_URL, AUTH_ISSUER, AUTH_AUDIENCE`. | You set one or two of the three. A partial set is treated as no configuration. |
| Every call answers `503`. | The guard resolved to unavailable — the identity configuration is absent outside development. Check the `authorization:` boot line. |
| Every call answers `401`. | The token's `iss` or `aud` does not match. Compare the `run mode: standalone` log fields against the token. A trailing slash on the issuer, or the resource API's *name* instead of its *identifier*, are the usual causes. |
| Every call using one permission answers `403`, regardless of who makes it. | That permission string is not registered in Auth, so no token can carry it. Re-check step 3 against `GET /api/v1/setup/status`. |
| A signed-in operator can browse but not reveal. | Working as designed. `secret:GetSecret` is a separate grant from `secret:ReadMetadata`. |
| The wizard answers `setup_orchestrated`. | `MAINTAINERD_MODE=core`, or an orchestrator already owns this instance. Use the gRPC `SetupService`. |
| The wizard answers `setup_disabled`. | `SETUP_BOOTSTRAP_TOKEN` is not set. It is required outside development. |
| The process refuses to start, complaining about `DB_SSLMODE`. | `disable` is not allowed outside development. |
