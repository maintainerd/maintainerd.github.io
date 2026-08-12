# Surfaces & Hostnames

Auth separates browser, management, public identity, management probes, and machine-to-machine traffic.

## HTTP Ports

- `:8080`: internal management API. This is the console/control surface and should stay private.
- `:8081`: public identity/data-plane API. This serves OAuth/OIDC, hosted identity flows, public tenant/client lookup, and account self-service.
- `:8082`: management port. This serves health, readiness, OpenAPI, and Prometheus metrics.
- `:3000`: embedded admin console in the production image.
- `:3001`: embedded hosted identity UI in the production image.

## Embedded Frontends

The production Docker image embeds the built console and identity SPAs into the Go binary.

The console serves its API same-origin:

- `/api/` maps to the internal management router.
- `/public-api/` maps to the public identity router.

The identity UI serves only public identity APIs:

- `/api/` maps to the public identity router.
- `/.well-known/` maps to public OIDC discovery and JWKS.

## Tenant Host Resolution

`APP_FRONTEND_IDENTITY_HOSTNAME` and `APP_FRONTEND_CONSOLE_HOSTNAME` define the system-tenant hosts. Regular tenants are resolved as a single subdomain label before that base host.

Example shape:

- System identity: `auth.example.com`
- Tenant identity: `acme.auth.example.com`
- System console: `console.auth.example.com`
- Tenant console: `acme.console.auth.example.com`

Auth treats the incoming host as authoritative for tenant-bound browser flows. A regular tenant cannot drive a client through the bare system host, and a deeper nested hostname is not accepted as a tenant slug.

## Frontend Configuration

In the embedded image, frontend runtime config is injected through `/config.js`. In split-host development or deployment, the SPAs can be pointed at explicit API bases with the `VITE_AUTH_*` variables.
