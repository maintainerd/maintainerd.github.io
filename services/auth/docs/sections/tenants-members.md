# Tenants & Members

Tenants are the ownership boundary for Auth. Members connect users to tenants with tenant-specific access.

## Tenant Operations

- List tenants.
- Create a tenant.
- View tenant detail.
- Update tenant metadata.
- Change tenant status.
- Delete tenants when allowed.
- Read public tenant context for login screens.

## Tenant Settings

Tenant settings control tenant-level behavior such as:

- Rate limits.
- Audit behavior.
- Maintenance mode.
- Email and SMS configuration inheritance.
- Branding defaults.
- Security defaults.

## Membership

Tenant members represent who belongs to a tenant and what administrative access they have. Console member flows should preserve ownership rules and make owner/member transitions explicit.

## Integration Notes

- Public identity flows resolve tenant context before authentication.
- First-party Maintainerd apps keep tenant context separate from public `client_id` flows.
- Suspended or inactive tenants are blocked from authentication, OAuth, and account runtime paths.
