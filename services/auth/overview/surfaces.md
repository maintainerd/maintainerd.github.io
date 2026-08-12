# Surfaces

M9d Auth separates browser, public API, control API, and management concerns. That separation lets a deployment expose only the pieces that need to be reachable while keeping operator and metrics paths controlled.

## Admin Console

The admin console is the operator UI. It manages tenants, users, members, OAuth clients, identity providers, roles, permissions, policies, API keys, security settings, branding, templates, webhooks, and operational configuration.

## Hosted Identity UI

The hosted identity UI is the user-facing browser experience. It owns login, registration, MFA, consent, reset-password, account, profile, and OAuth browser journeys.

## Public Identity API

The public API is the data plane. It serves OAuth/OIDC, discovery, JWKS, public auth flows, self-service account APIs, and service-token endpoints that must resolve for browser redirects, client SDKs, and resource services.

## Control And Management APIs

The control plane manages tenants, users, clients, providers, IAM resources, events, templates, and settings. The management port exposes health checks and Prometheus metrics for operators.

