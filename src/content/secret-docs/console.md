# Console

Secret ships **its own console** — a first-class single-page app rather than a page inside another service's dashboard, because Secret is adoptable alone. In the local development stack it is served at `console.secret.maintainerd.local`.

It is React with Vite, TypeScript, Tailwind, and Radix, authenticating with OAuth 2.0 authorization code plus PKCE against Auth and calling this service's `/api/v1` with the resulting bearer token. It follows the same design language as Auth's console: the same shell, spacing, type scale, colour tokens, tables, dialogs, forms, and empty states.

## What It Can Do

| Surface | Route | Notes |
|---|---|---|
| Folder tree and secret browser | `/browse` | **Metadata only.** Key, description, tags, version, rotated-at, expires-at. Folder tree, breadcrumb, create and move folders, imports. |
| Secret detail | Dialog | Overview, version history, rotation. Deliberately not a route — see [The rules it holds](#the-rules-it-holds). |
| Reveal | Dialog | Explicit, per-secret, audited. Value behind a click, copy-to-clipboard, reference chain shown. |
| Create, new version, edit metadata | Dialog | The value input is a password field with a show toggle, base64-encoded on the wire. Metadata edits use an endpoint that cannot change a value. |
| Version history and rollback | Dialog tab | Rollback appends a version rather than rewriting history, and the confirmation says so. |
| Rotation | Dialog tab | View or set the policy (interval plus random generator), and rotate now with a random or supplied value. |
| Projects | `/projects` | Create, list, delete. Slugs are permanent — they are resource-name segments. |
| Environments | `/projects/:slug` | Per project, ordered by position. |
| Webhooks | `/webhooks` | Per-project endpoint CRUD. The signing key is shown once. |
| Deliveries | `/webhooks/:endpointUuid` | Recent deliveries — resource name and version, never a value. |
| Deleted and recovery | `/deleted` | Restore, or destroy permanently with a type-to-confirm. |
| Audit log | `/audit` | Filterable. Reveals and reference hops are visually distinct. |
| Setup wizard | `/setup` | First-run standalone provisioning against `POST /api/v1/setup`. |

What a signed-in user can actually do comes from **their grants in Auth**, not from what the console requests. See [Permissions](#permissions).

## The OAuth Client It Expects

The console is the **frontend SPA client** from [Standalone setup](#standalone-setup) step 5. In standalone mode you create it by hand in Auth's console; in core-attached mode Core creates it from a template.

Either way it must have:

| Setting | Value |
|---|---|
| Grant type | `authorization_code`, with PKCE **required** (`S256`) |
| Client type | **Public** — no client secret |
| Redirect URI | `https://<console-host>/auth/callback` |
| Post-logout redirect URI | `https://<console-host>` |
| Scopes | `openid profile email` |
| Audience | The same value as the service's `AUTH_AUDIENCE` |

Its client id is `SECRET_CONSOLE_CLIENT_ID`. **The service validates that variable at boot** in standalone mode outside development, and this console signs in with it, so there is exactly one value to set and no way for the two halves to disagree.

**Do not confuse it with `SECRET_CLIENT_ID` and `SECRET_CLIENT_SECRET`**, which are the service's own backend machine-to-machine client. That secret must never appear in `config.js`, in a `.env` consumed by the bundler, or in anything else served to a browser.

## Configuration

Every setting can be supplied at **build** time (`.env`) or at **run** time (`window.__ENV__`, written by `public/config.js`), so one built image targets any operator without a rebuild. None of them is a secret — this is a public OAuth client and `config.js` is served to every browser.

Each setting has two accepted names. The **runtime** name is the service's own variable name, so a standalone operator sets the value once and both halves read it; the **build-time** `VITE_` name is what a local `.env` uses. Runtime wins when both are present.

| Runtime (`window.__ENV__`) | Build time (`.env`) | Default | Purpose |
|---|---|---|---|
| `SECRET_API_BASE_URL` | `VITE_SECRET_API_BASE_URL` | `/api/v1` | Where Secret's REST API lives. Same-origin by default, which keeps the bearer token off a cross-origin preflight. |
| `AUTH_ISSUER` | `VITE_OAUTH_ISSUER_URL` | — | Hosted identity origin; `/authorize` and `/end-session` hang off it. The same value the service enforces as `iss`. |
| `SECRET_CONSOLE_TOKEN_URL` | `VITE_OAUTH_TOKEN_URL` | — | Absolute URL of the OAuth token endpoint on Auth's public API. |
| `SECRET_CONSOLE_CLIENT_ID` | `VITE_OAUTH_CLIENT_ID` | — | This console's public SPA client id. The service validates the same variable at boot in standalone mode. |
| `AUTH_AUDIENCE` | `VITE_OAUTH_AUDIENCE` | — | The resource-API audience Secret enforces. The token must be minted **for** Secret or its verifier rejects it. |
| `SECRET_CONSOLE_SCOPE` | `VITE_OAUTH_SCOPE` | — | Extra scopes beyond `openid profile email`. |

### Rendering `config.js`

The built app loads `/config.js` before the application bundle. Render it from the environment wherever the files are served — an init container, a ConfigMap, an entrypoint on the static host:

```sh
cat > "$CONSOLE_DIR/config.js" <<EOF
window.__ENV__ = {
  SECRET_API_BASE_URL: "${SECRET_API_BASE_URL:-}",
  AUTH_ISSUER: "${AUTH_ISSUER:-}",
  SECRET_CONSOLE_TOKEN_URL: "${SECRET_CONSOLE_TOKEN_URL:-}",
  SECRET_CONSOLE_CLIENT_ID: "${SECRET_CONSOLE_CLIENT_ID:-}",
  AUTH_AUDIENCE: "${AUTH_AUDIENCE:-}",
  SECRET_CONSOLE_SCOPE: "${SECRET_CONSOLE_SCOPE:-}"
};
EOF
```

### Serving The Files

The console is static files, served by your web server or CDN — **the Secret process does not serve them.** The production image bakes the built app at `/srv/console` and declares `CONSOLE_DIR`, but the service has no static handler today, so that path is a placeholder for a future capability rather than a working configuration. Serve the built app yourself and proxy `/api/` to Secret so the app is same-origin.

The image deliberately keeps `/srv/console` root-owned and read-only to the service user, so the vault process cannot rewrite the UI it ships — which is also why the image does not render `config.js` itself.

## Authentication

OAuth 2.0 **authorization code plus PKCE** against Auth's hosted identity app. The console is a public client, and the access token it receives is sent as a bearer to Secret's `/api/v1`, which verifies it against Auth's JWKS, issuer, and audience.

| Behaviour | Detail |
|---|---|
| No token is stored anywhere | It lives in a module-level variable for the lifetime of the page — not localStorage, not sessionStorage, not a cookie. |
| No refresh token is requested | An administrative surface must not hold a long-lived credential, so `offline_access` is never asked for. |
| No profile is fetched | There is no userinfo call, so the session menu says what it can honestly say — that a session is held, in memory only — rather than inventing a display name. |
| Continuity across a reload | On boot the app runs a `prompt=none` authorization in a hidden frame. While the identity session is alive the operator sees nothing; once it is gone they land on a visible sign-in. A `401` from any API call takes the same path. |

## The Rules It Holds

These are not stylistic. Each one exists because the alternative turns a single audited read into an unbounded number of unaudited ones.

1. **A list never fetches a value.** Everything on the browse screen comes from the metadata listing, whose response type has no value field. Revealing is a separate call behind a separate grant.
2. **A revealed value lives in memory only.** It is held in the reveal dialog's state and nowhere else — not in storage, not in the query cache. It is dropped on close and on navigation.
3. **Reveal is visibly marked as audited.** The dialog opens with an alert saying the read wrote a row naming the operator, before the value appears.
4. **A secret's address never enters a URL.** Secret detail is a dialog, not a route, because a route would put the address in browser history, the referer header, and every proxy log in between — the same reason the service made reveal a `POST`. The browse listing does not mirror a searched-for key name into the query string either.
5. **The setup gate fails closed.** An unreadable setup status is treated as *not* set up, so the wizard is the landing surface rather than a full console pointed at a vault that may not exist.
6. **`401` goes to login; `403` becomes an in-place "not permitted" state.** Metadata access and value access are separate grants, so a `403` means "you are signed in and lack this" — bouncing it to identity would loop forever.
7. **Nothing logs a request or response body.** A put body carries a plaintext and a reveal response carries one; the API client and the error boundary print statuses and messages only.

## Guard-Open Mode

If the issuer, the token URL, and the client id are **all** absent, the console runs without a bearer token and shows a permanent, non-dismissible banner plus a "Guard open" chip in the brand bar.

That matches a service running with `APP_ENV=development` and no `AUTH_JWKS_URL`, `AUTH_ISSUER`, or `AUTH_AUDIENCE`, whose guard serves every caller as a blanket-granted principal. **It is the local-development posture and must never be pointed at a production vault.**

A *partial* identity configuration is treated as none, deliberately: it would otherwise send the operator to an authorize endpoint whose code can never be exchanged.

## Known Limits

Stated here rather than worked around silently.

| Limit | Detail |
|---|---|
| List endpoints page but do not search or sort | `GET /secrets`, `/audit`, `/webhooks`, and `/projects` accept only `page` and `limit`, so search, filters, and sortable headers operate on the fetched page. The audit page carries an on-screen notice saying so. |
| Audit filtering is client-side | The service does not filter the trail by action, actor, resource, or date yet. |
| The browse list cannot flag references | A secret's metadata does not carry its value type, so whether a value is a reference is read from its current version. The flag appears in the detail dialog rather than costing a call per row. |
| There is no "get one webhook endpoint" route | The endpoint detail page picks it out of the project's list. |
| There is no unauthenticated capability endpoint | The console cannot ask the service whether its guard is enforced or open, so guard-open mode is inferred from the absence of identity configuration rather than discovered. |
