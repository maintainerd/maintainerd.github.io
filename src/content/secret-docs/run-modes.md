# Run Modes

Secret runs in one of two modes, selected by `MAINTAINERD_MODE`. They differ in **who creates this service's identity in Auth**, and therefore in what has to be in the environment before the process can enforce anything.

| Mode | Value | What It Means |
|---|---|---|
| Standalone *(default)* | `standalone` | You run Auth and Secret and nothing else. There is no Maintainerd Core anywhere. You create Secret's identity by hand in Auth's console and hand it over as environment variables. |
| Core-attached | `core` | Maintainerd Core provisions this service through its setup gRPC surface and records itself as the controller. |

An unrecognised value is a boot error naming both.

In neither mode does Secret manage authentication. Auth mints tokens and owns principals, roles, and grants; Secret enforces the permissions a token carries.

## Which One Is For You

| You Are | Use | Why |
|---|---|---|
| A team that wants a vault, already running Auth, with no interest in the rest of the platform. | Standalone | Nothing about Core is involved or required. You own the wiring, and the runbook is eight steps in Auth's console. |
| A developer running Secret locally. | Standalone with `APP_ENV=development` | The guard opens with a loud boot banner and the console talks to the API without a token. Never point this at a production vault. |
| An operator running the Maintainerd platform, where Core provisions services. | Core-attached | Core creates the service principal, the resource API, the twelve permissions, and both OAuth clients from its templates, so there is nothing to type twice. |

## Standalone

There is no Maintainerd Core anywhere. Auth is already running and set up. You create this service's identity by hand, in Auth's own console, and hand it to Secret as environment variables.

The REST setup wizard (`POST /api/v1/setup`) is the bootstrap path. Because Auth already exists, setup here only creates Secret's **own tenant mirror, default project, and default environment** — it does not create anything in Auth.

Required outside `APP_ENV=development`:

```text
AUTH_ISSUER   AUTH_JWKS_URL   AUTH_AUDIENCE
SECRET_CLIENT_ID
SECRET_CLIENT_SECRET  or  SECRET_CLIENT_PRIVATE_KEY_FILE
SECRET_CONSOLE_CLIENT_ID
```

Missing any of them is a boot error naming **all** of them at once — not a silent degrade, and not one restart per missing variable. The full runbook is on [Standalone setup](#standalone-setup); the variables are described on [Environment variables](#environment).

## Core-attached

Maintainerd Core provisions the service principal, the resource API, the permissions, and both clients from its templates, drives the gRPC `SetupService`, and records itself as this instance's controller.

**Core registers the same twelve permissions** a standalone operator registers by hand — the six data-plane actions and the six management ones — from its own catalog. The two modes converge: whichever provisions the instance, the vocabulary Auth knows is the vocabulary Secret's guard demands, so an instance that starts standalone and is later adopted by Core keeps working. The list is on [Permissions](#permissions), and the manual runbook for it is [Standalone setup](#standalone-setup) step 3.

Core cannot import Secret's package — Secret is optional and independently released — so the two lists are kept in step by review rather than by the compiler. A permission Secret demands and Core omits would exist nowhere in Auth, so no token could carry it and every route behind it would answer `403` to everyone, silently, and **only** in core-provisioned installs. If a controlled install shows that symptom, compare `GET /api/v1/setup/status` against what Auth actually has.

None of the standalone credentials are required here — they are Core's to provision — so booting before Core has run is normal, expected, and warned about rather than refused. The API answers `503` until it happens.

**The REST setup wizard refuses from the first boot in this mode**, with the error code `setup_orchestrated`. Two open first-run paths is a race whose winner owns the vault, and the REST one is reachable by anything on the network; declaring the mode closes that window instead of relying on the controller to win it.

In standalone mode the wizard behaves the other way: it is open until an orchestrator actually owns the instance. That is what keeps an instance that starts standalone and is later adopted by Core provisionable.

## Startup Posture

The mode and `APP_ENV` together decide what happens when the identity configuration is absent or incomplete.

| Situation | Result |
|---|---|
| `AUTH_JWKS_URL`, `AUTH_ISSUER`, and `AUTH_AUDIENCE` all set | Authorization is **enforced**. |
| A *partial* set — one or two of the three | **Boot error, in either mode.** A JWKS URL without an issuer and audience check accepts any token Auth ever signed, including tokens minted for a different service, so a partial configuration is treated as no configuration. |
| None set, `MAINTAINERD_MODE=standalone`, outside development | **Boot error** naming what to set. Standalone means you own this wiring; missing it is a mistake, not a choice. |
| None set, `MAINTAINERD_MODE=core`, outside development | Boots with a warning. Core has not provisioned the instance yet; the API answers `503` and gRPC serves health only until it does. |
| None set, `APP_ENV=development`, either mode | Opens in **development-open** mode with a loud boot banner naming every guard that is off, including "reveal gating — ANY caller can read ANY secret's decrypted value". |

Outside development, a missing auth configuration never degrades to open. Every guarded surface answers `503` / `codes.Unavailable`, `/readyz` reports not-ready, and the probes plus the self-guarded setup surface stay reachable so the instance can still be provisioned.

`APP_ENV` is matched against the exact string `development`, so a typo like `dev` or `Development` reads as production and fails closed.

## Setting The Mode

```bash
export MAINTAINERD_MODE=standalone   # the default; set it anyway, explicitly
```

The boot log states the mode and, in standalone, exactly which Auth it is enforcing against. See [Standalone setup](#standalone-setup) for the boot log fields and what to check when they are wrong.
