# Deployment

Auth is packaged as `maintainerd-auth`. The image contains the backend plus the built console and hosted identity surfaces in one binary.

## Deployment Shape

- Public identity/API surface reachable by browsers and external OAuth clients.
- Internal management/API surface reachable by the console and trusted operators.
- Management surface reachable by infrastructure for probes and metrics.
- Optional gRPC runtime surface for authorization, introspection, and peer reads.
- Optional Core control-plane surface for orchestrated provisioning.
- Embedded console and identity SPAs served by the backend in the production image.

## Production Checklist

- Use TLS at the edge.
- Keep the internal API and management port private.
- Configure `COOKIE_SECURE=true`.
- Use a stable `COOKIE_DOMAIN` only when sharing cookies across first-party subdomains.
- Store secrets in a secret provider rather than plain environment variables.
- Enable OpenTelemetry export and Prometheus scraping.
- Configure email before enabling user onboarding flows.
- Configure SMS before enabling SMS login or SMS MFA.
- Choose the runtime mode deliberately: standalone, runtime gRPC, or Core-managed.
- In control-plane mode, configure gRPC server TLS and client CA mTLS before boot.
