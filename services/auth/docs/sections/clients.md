# Applications & Clients

Clients represent applications that use Auth.

## Client Types

- Traditional web applications.
- Single-page applications.
- Mobile applications.
- Machine-to-machine clients.
- First-party system clients.

## Client Configuration

- Client identifier.
- Client secret behavior for confidential clients.
- Redirect URIs.
- Post-logout redirect URIs.
- Grant types.
- Response types.
- Token endpoint authentication method.
- Access-token TTL.
- Refresh-token TTL.
- Consent requirement.
- Logo URI.
- Policy URI.
- Terms URI.

## External Versus First-Party

External applications use `client_id` on public OAuth paths. First-party Maintainerd surfaces preserve tenant context and are guarded as system clients where needed.
