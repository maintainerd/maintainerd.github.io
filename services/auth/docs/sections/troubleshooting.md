# Troubleshooting

Troubleshooting starts by identifying the surface: public identity, internal API, management port, console, identity UI, database, Redis, messaging, or upstream provider.

## First Checks

- Confirm the request hostname matches the intended surface.
- Check `/ready` or `/readyz`.
- Check `/metrics` on the management surface.
- Check structured logs for request ID and trace ID.
- Confirm PostgreSQL and Redis connectivity.
- Confirm required secrets are loaded by the configured secret provider.

## Common Areas

- OAuth redirect URI mismatch.
- Public `client_id` versus first-party tenant/system-client context.
- Cookie domain or SameSite mismatch.
- Missing SMTP config for email-based flows.
- Missing SMS config for SMS login or SMS MFA.
- Identity provider issuer, callback, certificate, or audience mismatch.
- Tenant maintenance, tenant status, IP restriction, or rate-limit denial.
- Missing step-up proof for sensitive actions.

## Debugging Rule

Trace the exact browser URL, API hostname, tenant context, client context, and route surface before changing configuration.
