# Quickstart

The fastest path is to run Auth with PostgreSQL and Redis, then complete the setup flow through the console.

## Minimum Runtime

- `maintainerd-auth` container.
- PostgreSQL database.
- Redis instance.
- Public hostname for the identity surface.
- Private/internal hostname for the management surface.
- Console hostname.
- Identity UI hostname.
- JWT signing key pair.
- 32-byte application encryption key.
- HMAC signing secret.

## First Run

1. Start PostgreSQL and Redis.
2. Start `maintainerd-auth` with the required environment variables.
3. Open the console setup route.
4. Create the initial tenant.
5. Create the initial admin.
6. Configure messaging, security, identity providers, OAuth clients, services, APIs, permissions, and policies.

## After Setup

- Keep the internal API and management port controlled.
- Expose only the public identity surface where browsers and OAuth clients need to reach it.
- Enable OpenTelemetry and scrape Prometheus metrics before production traffic.
- Follow the external app setup workflow when connecting a developer-owned application.
- Follow the protected API workflow when the app also needs Auth-backed authorization.
