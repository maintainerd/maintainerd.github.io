# Identity Types

Auth uses several identity concepts. Keeping them separate makes integrations easier to reason about.

## Tenant

A tenant is the ownership boundary. It owns users, members, clients, identity providers, roles, permissions, policies, services, APIs, registration flows, invites, branding, templates, security settings, messaging config, and webhook config.

## User

A user is a human account. Users can authenticate, hold sessions, enroll MFA, own profiles, link upstream identities, and receive roles.

## Member

A member is the user's relationship to a tenant. Membership carries tenant-specific access and administrative role context.

## Profile

A profile stores user-facing identity details such as display information and avatar data. Auth supports default and multiple profiles.

## Client

A client is an OAuth application registration. External apps use public OAuth client flows with `client_id`. First-party Maintainerd surfaces use explicit system clients and tenant context.

## Identity Provider

An identity provider is an upstream or built-in authentication source. Auth supports system, social, enterprise, and SAML provider types.

## Linked Identity

A linked identity connects a user to an upstream provider subject. Users can view, link, and unlink identities from the hosted account surface.

## Service Identity

A service identity represents a workload or service that needs policy bundles or authorization checks.

## Workload Identity Federation

Workload identity federation maps external workload credentials into Auth-managed service identity without treating the workload as a browser user.
