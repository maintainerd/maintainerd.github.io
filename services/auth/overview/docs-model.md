# Docs Model

The Auth documentation should be split by reader intent.

## Overview

The overview explains what Auth is, what surfaces exist, what major concepts matter, and how the system fits together. This page is for orientation.

The overview also carries the top-level feature inventory so readers can see the full Auth surface before deciding whether they need developer guides or API reference pages.

## Developer Docs

The docs page should explain features and workflows in detail:

- How an external application uses Auth.
- How hosted login works.
- How OAuth redirects, PKCE, consent, refresh, and logout work.
- How developers configure clients, redirect URIs, scopes, and providers.
- How services use policy bundles and authorization checks.
- How operators configure MFA, sessions, password policy, email, SMS, branding, webhooks, and observability.

## API Reference

The API page should behave like Postman-style API documentation:

- Endpoint groups.
- Methods and paths.
- Auth requirements.
- Parameters.
- Request bodies.
- Response schemas.
- Status codes.
- Examples.

The overview should not become the API reference. It should stay high-level and link readers to the right next document.
