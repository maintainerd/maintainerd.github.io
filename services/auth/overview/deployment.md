# Deployment

The released image is the supported way to run Auth. It embeds the backend, admin console, and identity UI in one container and expects PostgreSQL and Redis.

```bash
docker pull maintainerd/maintainerd-auth
```

## Public Surfaces

Expose the hosted identity UI and public identity API where browser redirects, OIDC discovery, JWKS, OAuth clients, and resource services need to resolve them.

## Controlled Surfaces

Keep the control plane and management metrics/probes restricted to trusted network paths and operator tooling.

## Local Quickstart Shape

The local quickstart uses clean HTTPS hostnames with PostgreSQL and Redis. The first operator flow starts in the setup wizard, creates the initial tenant and admin, then moves into the admin console.

Production deployments should use real TLS, production hostnames, required database TLS where appropriate, and a real secret provider.

