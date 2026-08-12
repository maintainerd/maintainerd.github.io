# Audit Events

Auth records security and management activity through auth events and management audit logs.

## Auth Events

Auth events cover authentication and authorization activity such as login, token issuance, token revocation, consent, lockout, MFA, and related identity activity.

## Management Audit Log

The management audit log tracks administrative activity from the console and internal API.

## Console Views

- Monitoring page.
- Auth event detail page.
- Management audit-log detail page.

## Operational Expectations

- Preserve audit logs according to tenant and compliance requirements.
- Alert on audit write failures.
- Use trace IDs and request IDs to correlate events with infrastructure logs.
