# Integration Overview

This section is the map for developers using Auth from their own application.

## What A Developer Usually Configures

- A tenant that owns the app's identity and access state.
- An OAuth client for the application.
- Redirect and post-logout redirect URIs.
- Allowed grant types and response types.
- Login methods for that client.
- Optional external identity providers.
- Optional consent behavior.
- Optional API/service records, permissions, roles, and policies.
- Optional webhooks and audit/event monitoring.

## Browser App Pattern

For a web, SPA, or mobile application, the application redirects the user to Auth's hosted identity UI. Auth handles login, MFA, provider selection, consent, and OAuth continuation, then redirects back to the app's callback URI.

The app uses:

- `client_id` to identify itself on public OAuth paths.
- OIDC discovery to find endpoints and JWKS.
- Authorization code with PKCE for browser/mobile clients.
- Tokens and UserInfo to establish the application session.

## Resource API Pattern

If the application exposes its own API, register the API as a service resource in Auth. Define permissions, assign them through roles and policies, then verify access tokens or call Auth's authorization/introspection surfaces.

## Login Method Pattern

Auth can show different login options per client. A tenant can add an external identity provider, then attach that provider to a specific client so it appears only for that app's hosted login journey.

## Maintainerd Apps Versus External Apps

First-party Maintainerd surfaces use seeded system clients and tenant-aware host routing. Developer-owned external apps use normal OAuth `client_id` flows and should not rely on first-party console or identity clients.
