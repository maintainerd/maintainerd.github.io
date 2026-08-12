# Deployment

Auth is packaged as `maintainerd-auth`. The image contains the backend plus the built console and hosted identity surfaces.

## Deployment Shape

- Public identity/API surface reachable by browsers and external OAuth clients.
- Internal management/API surface reachable by the console and trusted operators.
- Management surface reachable by infrastructure for probes and metrics.
- Optional gRPC surface for control plane and service integration.

## Production Checklist

- Use TLS at the edge.
- Keep the internal API and management port private.
- Configure `COOKIE_SECURE=true`.
- Use a stable `COOKIE_DOMAIN` only when sharing cookies across first-party subdomains.
- Store secrets in a secret provider rather than plain environment variables.
- Enable OpenTelemetry export and Prometheus scraping.
- Configure email before enabling user onboarding flows.
- Configure SMS before enabling SMS login or SMS MFA.
