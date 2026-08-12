# Auth Documentation

Auth is Maintainerd's self-hostable identity and access platform. These docs are organized around the way Auth is operated and integrated: setup, configuration, identity, OAuth, authorization, messaging, events, observability, and runtime operations.

This documentation is sourced from the current `maintainerd-auth` backend, `web/console`, `web/identity`, and protobuf service surface.

## What Auth Includes

- A Go backend that exposes public identity APIs, internal management APIs, management probes, metrics, and gRPC.
- A hosted identity UI for login, registration, consent, MFA, account management, sessions, devices, and linked identities.
- An admin console for tenants, users, clients, identity providers, registration flows, roles, permissions, policies, services, APIs, webhooks, templates, messaging, security, and observability views.
- Runtime integrations for PostgreSQL, Redis, OpenTelemetry, Prometheus, SMTP, SMS providers, webhook delivery, and secret managers.

## How To Read These Docs

Start with **Quickstart** and **Setup** when deploying a new instance. Use **Environment variables**, **Secrets & keys**, and **Database & Redis** for runtime configuration. Use the Identity, OAuth, and Authorization groups when integrating external apps or Maintainerd services.
