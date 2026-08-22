# Environment Variables

Secret reads all of its runtime configuration from environment variables. Every variable below is listed with its default. Which ones are **required** depends on the run mode — see [Run modes](#run-modes).

Configuration is read, validated, and frozen before any surface is built, so an invalid value is a boot error rather than a request-time surprise. **A malformed numeric or boolean value is a boot error, not a silent fallback to the default** — a typo in a retention setting is a configuration change nobody made.

## App

| Var | Default | Purpose |
|---|---|---|
| `MAINTAINERD_MODE` | `standalone` | `standalone` or `core`. Selects who provisions this service's identity in Auth. An unrecognised value is a boot error naming both. |
| `APP_ENV` | `development` | `development` enables the ephemeral-key path and an open setup window; any other value fails closed. Matched exactly, so `dev` or `Development` reads as production. |
| `LOG_LEVEL` | `info` | `debug`, `info`, `warn`, or `error`. |
| `GRPC_PORT` | `9092` | The gRPC listener. |
| `HTTP_PORT` | `8092` | The HTTP listener. |

## Identity

Required in `MAINTAINERD_MODE=standalone`, outside development. You create every one of these by hand in Auth's console — see [Standalone setup](#standalone-setup). Missing any of them is a boot error naming all of them at once.

| Var | Default | Purpose |
|---|---|---|
| `AUTH_ISSUER` | — | The `iss` a token must carry. Auth's hosted identity origin. |
| `AUTH_JWKS_URL` | — | Auth's JWKS endpoint — where token-verifying keys come from. |
| `AUTH_AUDIENCE` | — | The `aud` a token must carry: this service's **resource-API identifier** in Auth. |
| `SECRET_CLIENT_ID` | — | This service's own **backend m2m** client id in Auth. |
| `SECRET_CLIENT_SECRET` | — | That client's secret. **Never log it, never put it in the console's `config.js`.** Exactly one of this or the private key. |
| `SECRET_CLIENT_PRIVATE_KEY_FILE` | — | Path to a private key for `private_key_jwt` client authentication — stronger, because the credential never leaves the host. Setting both this and `SECRET_CLIENT_SECRET` is a boot error. |
| `SECRET_CONSOLE_CLIENT_ID` | — | The console's **public SPA** client id. Not a credential — it is published in the browser — but required: a console pointed at a client id that does not exist sends the operator to an error they cannot act on. The console reads this same variable name. |

In `MAINTAINERD_MODE=core`, **none of the above is required.** Core provisions all of it and supplies the values; booting before that has happened is the normal pre-provisioning state and is warned about, not refused. The API answers `503` in the meantime.

`AUTH_JWKS_URL`, `AUTH_ISSUER`, and `AUTH_AUDIENCE` must be set **together or not at all**, in either mode. A partial set is a boot error: a JWKS URL without an issuer and audience check accepts any token Auth ever signed, including tokens minted for a different service, so a partial configuration is treated as no configuration.

## Database

`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` are required in every mode.

| Var | Default | Purpose |
|---|---|---|
| `DB_HOST` `DB_PORT` `DB_USER` `DB_PASSWORD` `DB_NAME` | — | Connection details; never logged. |
| `DB_SSLMODE` | `disable` | `disable` is refused outside `APP_ENV=development`. |
| `DB_MAX_OPEN_CONNS` | `25` | Pool ceiling. |
| `DB_MAX_IDLE_CONNS` | `5` | Pool floor. Must not exceed the ceiling. |
| `DB_CONN_MAX_LIFETIME_SEC` | `300` | Connection lifetime. |
| `DB_CONN_MAX_IDLE_SEC` | `90` | Idle connection lifetime. |
| `DB_STATEMENT_TIMEOUT_MS` | `30000` | Server-side statement timeout. |

Migrations are embedded and applied on boot.

## Root Of Trust

The root key always comes from **outside** the database — a store cannot unlock itself. See [Security](#security).

| Var | Default | Purpose |
|---|---|---|
| `SECRET_ROOT_KEY_PROVIDER` | `env` | `env`, `file`, `aws_kms`, `gcp_kms`, or `azure_kv`. The three KMS providers are registered but **not built**: the configuration validates and construction fails with a clear message. |
| `SECRET_ROOT_KEY` | — | The 32-byte AES-256 root key as hex or base64, for the `env` provider. **Required outside development.** Never log it. |
| `SECRET_ROOT_KEY_FILE` | — | Sealed key file for the `file` provider. Required when the provider is `file`; the file must not be group- or world-readable. |

Outside `APP_ENV=development` a missing or malformed root key is a boot error, never a silently generated one. A generated key makes every secret written before the next restart permanently undecryptable, and the failure is invisible until it is far too late.

## Store Policy

| Var | Default | Purpose |
|---|---|---|
| `SECRET_KEEP_VERSIONS` | `10` | Default versions retained per secret. Minimum 1. Pruning deletes the oldest and never the current version. |
| `SECRET_RECOVERY_WINDOW` | `720h` | How long a deleted secret stays restorable. `0` is refused outside development, because it makes every delete immediately unrecoverable. Negative values are refused everywhere. |
| `SECRET_REWRAP_BATCH_SIZE` | `500` | Versions re-wrapped per root-key rotation query. |

## References, Rotation, And Webhooks

| Var | Default | Purpose |
|---|---|---|
| `SECRET_REFERENCE_MAX_DEPTH` | `8` | Backstop on reference-chain depth. Cycles are detected precisely, not merely bounded. |
| `SECRET_ROTATION_ENABLED` | `true` | Runs the background rotator. Turning it off **preserves every policy**. |
| `SECRET_ROTATION_INTERVAL` | `5m` | How often the rotator scans for due secrets. |
| `SECRET_ROTATION_BATCH` | `50` | Secrets rotated per pass. |
| `SECRET_WEBHOOKS_ENABLED` | `true` | Deliver change and rotation notifications. A delivery never carries a value. |
| `SECRET_WEBHOOK_CONCURRENCY` | `4` | Parallel deliveries per event. |
| `SECRET_WEBHOOK_MAX_TIMEOUT_SEC` | `30` | Ceiling on a per-endpoint delivery timeout, applied at registration and again at delivery. |
| `SECRET_WEBHOOK_MAX_ATTEMPTS` | `10` | Ceiling on a per-endpoint retry count, applied the same way. |

## Setup And Default Scope

| Var | Default | Purpose |
|---|---|---|
| `SETUP_BOOTSTRAP_TOKEN` | — | Gates **both** first-run surfaces: the REST wizard (`X-Setup-Token`) and the gRPC `SetupService` (`x-setup-token`). **Required outside development**; never log it. |
| `SECRET_DEFAULT_SCOPE_AUTOCREATE` | `true` | Create the default tenant, project, and environment on boot. |
| `SECRET_DEFAULT_TENANT` | `default` | The scope the flat-key RPCs address. |
| `SECRET_DEFAULT_PROJECT` | `default` | " |
| `SECRET_DEFAULT_ENVIRONMENT` | `default` | " |

## Request Limits

Bounds on request **content**. They are installed before any surface is built, so there is no window in which a request is validated against the defaults rather than your configuration.

| Var | Default | Purpose |
|---|---|---|
| `SECRET_MAX_VALUE_BYTES` | `65536` | Largest secret value accepted. Must be smaller than `HTTP_MAX_BODY_BYTES`, or the body reader refuses first and the operator debugs a `413` while reading a 64 KiB limit. |
| `SECRET_MAX_BATCH_ITEMS` | `100` | Items per batch get or put. An unbounded batch is a bulk-decryption endpoint. |
| `SECRET_MAX_TAGS` | `32` | Tags per secret. |
| `SECRET_MAX_TAG_LENGTH` | `64` | Characters per tag. |
| `SECRET_MAX_PAGE_LIMIT` | `200` | Largest page a list endpoint will return. |
| `SECRET_MAX_DESCRIPTION_LENGTH` | `500` | Characters in a secret's description. |

## Rate Limits

Per-principal budgets for the mutating and revealing surfaces, and a per-IP budget for the setup surface. The REST and gRPC surfaces spend **one** budget: a per-transport budget is not a budget.

| Var | Default | Purpose |
|---|---|---|
| `SECRET_RATE_LIMIT_ENABLED` | `true` | Turns the limiter off. Off is a supported configuration for a deployment that meters at its ingress; it is not the default. |
| `SECRET_RATE_LIMIT_WINDOW` | `1m` | The counting window every budget is measured over. |
| `SECRET_RATE_LIMIT_REVEAL` | `300` | Reveal surfaces, per principal per window — the single reveal and the batch get. This is the exfiltration bound. |
| `SECRET_RATE_LIMIT_WRITE` | `120` | Every mutating surface, per principal per window. |
| `SECRET_RATE_LIMIT_SETUP` | `10` | The self-guarded setup surface, per client IP per window. Keyed by IP because there is no principal yet. |

The limiter is **per process, not cluster-wide**. With N replicas behind a load balancer the effective ceiling is N times the configured one. It is a brute-force and burst dampener, not a distributed quota. See [Security](#security).

## Server Timeouts

| Var | Default | Purpose |
|---|---|---|
| `HTTP_READ_HEADER_TIMEOUT` | `10s` | Header read deadline. |
| `HTTP_READ_TIMEOUT` | `15s` | Request read deadline. |
| `HTTP_WRITE_TIMEOUT` | `60s` | Response write deadline. |
| `HTTP_IDLE_TIMEOUT` | `120s` | Keep-alive idle deadline. |
| `HTTP_REQUEST_TIMEOUT` | `30s` | Per-request deadline on the `/api/v1` group. Must be **shorter** than `HTTP_WRITE_TIMEOUT`, or the write deadline fires first and the client sees a truncated response instead of an error. This cross-check is a boot error. |
| `HTTP_MAX_BODY_BYTES` | `4194304` | Request body cap, applied before routing — the setup surface is unauthenticated and the guard has not run yet. |
| `SHUTDOWN_TIMEOUT` | `20s` | Graceful shutdown budget. |
| `SECRET_READINESS_TIMEOUT` | `2s` | Bounds the dependency probes `/readyz` performs. A probe that hangs must report not-ready rather than hang with it. |

## Console Configuration

The console is a separate single-page app with its own configuration, which can be supplied at build time or at run time. Its settings are documented on [Console](#console). Three of them are read by the same names the service uses — `AUTH_ISSUER`, `AUTH_AUDIENCE`, and `SECRET_CONSOLE_CLIENT_ID` — so a standalone operator sets those values once and both halves read them.

**Never put `SECRET_CLIENT_SECRET`, or any other backend credential, in the console's configuration.** It is downloaded by every visitor.
