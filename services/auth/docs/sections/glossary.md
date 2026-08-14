# Glossary

This glossary explains the terms used across the Auth documentation. It is grouped by topic so a developer can connect a word to the part of the product where it appears.

Use this page when a console label, configuration field, token claim, event name, or documentation section uses a term that is easy to mix up with another one. For the full system layout, see [Architecture](#architecture). For exact API shapes, use the API reference.

## Product And Surfaces

| Term | Meaning | Where It Matters |
|---|---|---|
| Auth | Maintainerd Auth, the identity and access management service. It authenticates users, issues tokens, manages tenants, stores users and identities, evaluates authorization, and emits identity events. | The whole documentation set. |
| Hosted identity app | The public browser application where users sign in, register, complete MFA, grant consent, manage their account, and choose identity providers. | [Hosted login flow](#hosted-login-flow), [Login & registration](#login-registration), [Account self-service](#account). |
| Public identity API | The public API surface used by hosted identity and external applications for OAuth/OIDC, public account flows, discovery, token exchange, and userinfo. | [OAuth & OIDC](#oauth-oidc), [Protect an API](#protect-api). |
| Admin console | The private browser UI for administrators and operators. This is where tenants, clients, identity providers, users, roles, policies, security controls, messaging, events, and webhooks are configured. | Most configuration sections in the docs. |
| Internal management API | The private API used by the console and trusted automation to manage Auth configuration and operational state. It is not the public login API. | [Architecture](#architecture), [Deployment](#deployment), [Security controls](#security). |
| Management surface | The private operational surface for health, readiness, liveness, metrics, and OpenAPI JSON. It is meant for probes, monitoring, and platform operators. | [Deployment](#deployment), [Observability](#observability), [Troubleshooting](#troubleshooting). |
| Surface | A boundary where callers reach Auth: hosted identity, public identity API, console, management API, management surface, or gRPC. Each surface has different exposure and permissions. | [Architecture](#architecture), [Troubleshooting](#troubleshooting). |
| Origin | A browser security boundary made from scheme, host, and port. OAuth redirects, CORS, cookies, and hosted login behavior depend on origins matching what Auth and the client expect. | [Applications & clients](#clients), [OAuth & OIDC](#oauth-oidc), [Hostnames & tenant URLs](#surfaces-hostnames). |
| System hostname | A hostname that routes to system-level Auth behavior instead of a regular tenant. | [Hostnames & tenant URLs](#surfaces-hostnames), [Tenants & members](#tenants-members). |
| Tenant hostname | A hostname or subdomain that routes requests to a regular tenant. It controls branding, providers, clients, registration, security policy, and event behavior for that tenant. | [Hostnames & tenant URLs](#surfaces-hostnames). |

## Tenancy And Organization

| Term | Meaning | Where It Matters |
|---|---|---|
| Tenant | The root ownership boundary in Auth. A tenant owns users, identities, clients, providers, roles, policies, branding, security settings, messaging, events, webhooks, and operational settings. | [Tenants & members](#tenants-members), [Architecture](#architecture). |
| System tenant | The tenant used to operate Auth itself and hold system-level administration. It is not the same thing as a customer application tenant. | [Tenants & members](#tenants-members), [Setup](#setup). |
| Regular tenant | A tenant that represents an organization, customer, or application identity boundary. Regular tenants own their own users, clients, providers, rules, and events. | [Tenants & members](#tenants-members), [Hostnames & tenant URLs](#surfaces-hostnames). |
| Tenant slug | A DNS-safe tenant identifier used in tenant URLs and routing. It is usually the human-readable tenant reference developers use when planning hostnames. | [Hostnames & tenant URLs](#surfaces-hostnames). |
| Tenant member | A user who has administrator or operator access to a tenant in the console. Tenant membership is separate from simply being an end user who can sign in to an application. | [Tenants & members](#tenants-members), [Users & invites](#users-invites). |
| Tenant status | Lifecycle state that decides whether a tenant can be used. Suspended, inactive, or maintenance states can block login and management behavior. | [Tenants & members](#tenants-members), [Security controls](#security). |
| Maintenance mode | A tenant setting that temporarily blocks or limits tenant activity while operators perform planned work. | [Tenants & members](#tenants-members), [Troubleshooting](#troubleshooting). |
| Tenant settings | Tenant-level operational configuration such as rate limits, audit settings, lifecycle options, maintenance behavior, and other tenant-wide controls. | [Tenants & members](#tenants-members). |
| Multitenancy | The model where Auth routes and enforces identity behavior by tenant. Tenant context affects login, registration, clients, identity providers, roles, permissions, security settings, and events. | [Architecture](#architecture), [Hostnames & tenant URLs](#surfaces-hostnames). |

## Applications And Clients

| Term | Meaning | Where It Matters |
|---|---|---|
| Application | A product, website, mobile app, backend service, or external system that uses Auth. In OAuth/OIDC configuration, the application is represented by a client. | [Applications & clients](#clients), [External app setup](#external-app-setup). |
| Client | An OAuth/OIDC application registration. It defines redirect URLs, logout URLs, CORS origins, allowed grant types, scopes, token settings, provider access, and permissions. | [Applications & clients](#clients), [OAuth & OIDC](#oauth-oidc). |
| Client ID | The public identifier for a client. External apps use it to start OAuth/OIDC flows. It is not a secret. | [Applications & clients](#clients), [OAuth & OIDC](#oauth-oidc). |
| Client secret | A secret credential for confidential clients. It must be stored on a trusted server or secret manager and must not be placed in browser or mobile code. | [Applications & clients](#clients), [Secrets & keys](#secrets). |
| Public client | A client that cannot safely keep a secret, such as a browser SPA or native mobile app. Public clients should use PKCE. | [Applications & clients](#clients), [OAuth & OIDC](#oauth-oidc). |
| Confidential client | A client that can keep a secret, such as a server-rendered web app or backend service. | [Applications & clients](#clients), [OAuth & OIDC](#oauth-oidc). |
| SPA client | A single-page application client that runs in the browser. It normally uses Authorization Code with PKCE. | [Applications & clients](#clients), [OAuth & OIDC](#oauth-oidc). |
| Mobile client | A native application client. It normally uses PKCE and a registered app redirect pattern. | [Applications & clients](#clients), [OAuth & OIDC](#oauth-oidc). |
| Traditional web client | A server-side web application client. The server handles the code exchange and usually owns the application session. | [Applications & clients](#clients), [OAuth & OIDC](#oauth-oidc). |
| Machine-to-machine client | A client used by services or automation without an end-user browser session. | [Applications & clients](#clients), [Service authentication](#service-auth). |
| Redirect URI | The exact URL where Auth sends the browser after OAuth authorization. It must match a registered client redirect URI. | [Applications & clients](#clients), [OAuth & OIDC](#oauth-oidc). |
| Post-logout redirect URI | The URL where Auth may send the browser after sign-out. It must be allowed on the client. | [Applications & clients](#clients), [Tokens & sessions](#tokens-sessions). |
| CORS origin | A browser origin allowed to call configured Auth APIs. CORS controls browser access; it is not a substitute for authentication or authorization. | [Applications & clients](#clients), [Deployment](#deployment). |
| Grant type | The OAuth method a client is allowed to use, such as authorization code, refresh token, client credentials, device authorization, or token exchange. | [OAuth & OIDC](#oauth-oidc), [Applications & clients](#clients). |
| Scope | A requested OAuth capability or claim set. Scopes help describe what the client is asking for, but resource authorization still depends on roles, permissions, policy, and API checks. | [OAuth & OIDC](#oauth-oidc), [Protect an API](#protect-api). |
| Audience | The intended receiver of a token. APIs should reject tokens whose audience does not match the API or expected resource. | [Protect an API](#protect-api), [Tokens & sessions](#tokens-sessions). |

## Identity Providers And Federation

| Term | Meaning | Where It Matters |
|---|---|---|
| Identity provider | A source that authenticates users. Auth supports its built-in provider and external providers. | [Identity providers](#identity-providers). |
| Built-in provider | The native Maintainerd Auth provider. It handles local credentials, MFA, recovery, and account flows without requiring an external identity service. | [Identity providers](#identity-providers), [Login & registration](#login-registration). |
| External provider | A third-party or separate identity system used for sign-in, such as Google, GitHub, Microsoft, Okta, Auth0, Cognito, or another Maintainerd Auth deployment. | [Identity providers](#identity-providers), [Federated login client](#federated-login-client). |
| Maintainerd external provider | A Maintainerd Auth deployment configured as an external provider for another Maintainerd Auth tenant. This is useful when organizations want to trust each other's Maintainerd identity systems. | [Identity providers](#identity-providers), [Federated login client](#federated-login-client). |
| Brokered login | A login where Auth sends the user to an upstream provider, receives the provider callback, maps the external identity, and then issues Auth's own tokens. | [Identity providers](#identity-providers), [OAuth & OIDC](#oauth-oidc). |
| Federation | Trusting another identity system for authentication while keeping local tenant authorization, roles, permissions, and sessions in Auth. | [Identity providers](#identity-providers), [Federated login client](#federated-login-client). |
| Upstream provider | The external identity provider that performs the actual sign-in during brokered or federated login. | [Identity providers](#identity-providers). |
| Provider callback | The return path from an upstream provider back to Auth after the user completes authentication with that provider. | [Identity providers](#identity-providers), [Troubleshooting](#troubleshooting). |
| Subject | The stable identifier for a user or service inside an issuer. In tokens this is commonly represented by `sub`. | [OAuth & OIDC](#oauth-oidc), [Tokens & sessions](#tokens-sessions). |
| Identity link | A record that connects a local Auth user to a provider subject. It lets one user account sign in through one or more providers. | [Identity providers](#identity-providers), [Account self-service](#account). |
| Home realm discovery | Provider selection based on tenant, email domain, hints, or configured login rules. It helps route the user to the right sign-in method. | [Identity providers](#identity-providers), [Login & registration](#login-registration). |

## Users, Registration, And Account

| Term | Meaning | Where It Matters |
|---|---|---|
| User | A person record in Auth. A user may have profile data, credentials, identities, sessions, MFA methods, consent records, and tenant memberships. | [Users & invites](#users-invites), [Account self-service](#account). |
| User identity | The link between a user and a provider/client context. It records how the user is known by that identity provider. | [Users & invites](#users-invites), [Identity providers](#identity-providers). |
| Profile | User-owned personal information such as display name, avatar, contact fields, locale, timezone, or other profile attributes. | [Account self-service](#account), [Users & invites](#users-invites). |
| Invite | A tenant-issued invitation that lets a person join or access a tenant with controlled role assignment and expiration. | [Users & invites](#users-invites), [Registration flows](#registration-flows). |
| Invite redemption | The process where an invited user accepts an invite and Auth creates or connects the user to the tenant with the allowed roles. | [Users & invites](#users-invites). |
| Registration flow | A configured signup path that decides who can register, which checks are required, which providers are available, and which roles are assigned. | [Registration flows](#registration-flows). |
| Self-registration | A registration option that lets users create their own account without a direct invite, subject to tenant and client rules. | [Registration flows](#registration-flows), [Login & registration](#login-registration). |
| Email verification | A proof that the user controls the email address they registered or added to their account. | [Login & registration](#login-registration), [Messaging](#messaging). |
| Phone verification | A proof that the user controls the phone number they registered or added to their account. | [Login & registration](#login-registration), [Messaging](#messaging). |
| Account self-service | End-user account management: profile, password, MFA, sessions, trusted devices, identity links, consent, recovery, export, and deletion where enabled. | [Account self-service](#account). |
| Consent | User approval for a client to receive requested identity information or access. Consent can be required based on client trust and requested scopes. | [OAuth & OIDC](#oauth-oidc), [Account self-service](#account). |
| Trusted device | A remembered device that can reduce repeated MFA prompts within policy limits. | [MFA](#mfa), [Security controls](#security). |
| Data export | An account self-service or administrative function for obtaining user data in a controlled format. | [Account self-service](#account), [Data lifecycle](#data-lifecycle). |
| Data deletion | A user or administrator initiated erasure workflow, subject to tenant policy, retention, and legal requirements. | [Account self-service](#account), [Data lifecycle](#data-lifecycle). |

## Authentication And MFA

| Term | Meaning | Where It Matters |
|---|---|---|
| Authentication | Proving who the user or service is. Password login, external provider login, magic link, SMS login, MFA, and service tokens are authentication flows. | [Login & registration](#login-registration), [Service authentication](#service-auth). |
| Authorization | Deciding what an authenticated user, client, or service may do. Authorization uses tenant context, roles, permissions, policies, audience, and resource checks. | [Authorization model](#authorization-model), [Protect an API](#protect-api). |
| MFA | Multi-factor authentication. A second proof beyond the primary sign-in method, such as TOTP, SMS/email OTP, WebAuthn, passkey, or backup code. | [MFA](#mfa), [Security controls](#security). |
| TOTP | Time-based one-time password generated by authenticator apps. | [MFA](#mfa). |
| OTP | One-time password or code delivered through an approved channel such as email or SMS, or generated by an authenticator app. | [MFA](#mfa), [Messaging](#messaging). |
| WebAuthn | Web authentication standard for phishing-resistant authenticators and passkeys. | [MFA](#mfa). |
| Passkey | A WebAuthn credential that lets a user sign in or complete MFA using platform or synced credentials. | [MFA](#mfa). |
| Backup code | A recovery code generated for a user so they can complete MFA if their primary factor is unavailable. | [MFA](#mfa), [Account self-service](#account). |
| Step-up | A fresh stronger proof, usually MFA, required before sensitive actions such as changing security settings, rotating secrets, or deleting high-value data. | [Security controls](#security), [Account self-service](#account). |
| ACR | Authentication Context Class Reference. A token claim that describes the strength or recency of the authentication event, such as whether step-up occurred. | [Tokens & sessions](#tokens-sessions), [Security controls](#security). |
| Lockout | A temporary account protection state after too many failed attempts. | [Security controls](#security), [Troubleshooting](#troubleshooting). |
| Threat signal | A risk indicator such as impossible travel, unusual IP activity, velocity, failed attempts, or suspicious provider behavior. | [Security controls](#security), [Auth events](#audit). |

## OAuth, OIDC, Tokens, And Sessions

| Term | Meaning | Where It Matters |
|---|---|---|
| OAuth 2.0 | The authorization framework used by external applications to redirect users, request authorization, and obtain access tokens. | [OAuth & OIDC](#oauth-oidc). |
| OIDC | OpenID Connect. An identity layer on top of OAuth 2.0 that adds ID tokens, discovery, userinfo, issuer metadata, and standard identity claims. | [OAuth & OIDC](#oauth-oidc). |
| Issuer | The identity authority that issued a token. External APIs must verify the token issuer matches the expected Auth public issuer. | [OAuth & OIDC](#oauth-oidc), [Protect an API](#protect-api). |
| Discovery document | OIDC metadata that tells clients where to find issuer endpoints, JWKS, supported flows, signing algorithms, and related metadata. | [OAuth & OIDC](#oauth-oidc). |
| JWKS | JSON Web Key Set. The public signing keys clients and APIs use to verify Auth-issued JWTs. | [OAuth & OIDC](#oauth-oidc), [Protect an API](#protect-api). |
| JWT | JSON Web Token. A signed token format used for access tokens or ID tokens depending on flow and configuration. | [Tokens & sessions](#tokens-sessions), [Protect an API](#protect-api). |
| Access token | A token presented to APIs to access protected resources. APIs validate it before allowing requests. | [Protect an API](#protect-api), [Tokens & sessions](#tokens-sessions). |
| ID token | An OIDC token that describes the authentication event and user identity for the client. It is not a general API authorization token. | [OAuth & OIDC](#oauth-oidc), [Tokens & sessions](#tokens-sessions). |
| Refresh token | A credential used by eligible clients to obtain new access tokens without sending the user through full login again. | [Tokens & sessions](#tokens-sessions), [Security controls](#security). |
| Authorization code | A short-lived value returned to a registered redirect URI and exchanged by the client for tokens. | [OAuth & OIDC](#oauth-oidc). |
| PKCE | Proof Key for Code Exchange. A protection for public clients that binds the authorization request to the token exchange. | [OAuth & OIDC](#oauth-oidc), [Applications & clients](#clients). |
| PAR | Pushed Authorization Request. A flow where the client sends authorization parameters to Auth before redirecting the browser. | [OAuth & OIDC](#oauth-oidc). |
| Device authorization | OAuth flow for devices with limited input, where the user completes authorization on another device. | [OAuth & OIDC](#oauth-oidc). |
| CIBA | Client-Initiated Backchannel Authentication. A flow where the client starts authentication without relying on a front-channel browser redirect. | [OAuth & OIDC](#oauth-oidc). |
| Token exchange | OAuth flow where one token is exchanged for another token with a different audience, subject, or delegation context when allowed. | [OAuth & OIDC](#oauth-oidc), [Service authentication](#service-auth). |
| Token revocation | Invalidating a token or session so it can no longer be used. | [Tokens & sessions](#tokens-sessions), [Security controls](#security). |
| JTI | JWT ID. A unique token identifier used for revocation, replay detection, and denylist checks. | [Tokens & sessions](#tokens-sessions), [Database & Redis](#database-redis). |
| DPoP | Demonstrating Proof of Possession. A sender-constrained token mode where the client proves it holds a key for HTTP token and resource calls. | [OAuth & OIDC](#oauth-oidc), [Protect an API](#protect-api). |
| Session | The signed-in state associated with a browser, user, tenant, client, and policy. Sessions can expire, refresh, rotate, or be revoked. | [Tokens & sessions](#tokens-sessions), [Account self-service](#account). |
| Cookie policy | The secure cookie settings that control browser storage and cross-site behavior. HTTPS, secure cookies, SameSite, and domain settings must align with the deployment. | [Tokens & sessions](#tokens-sessions), [Deployment](#deployment). |

## Authorization, IAM, And APIs

| Term | Meaning | Where It Matters |
|---|---|---|
| IAM | Identity and Access Management. In Auth, IAM covers services, APIs, permissions, roles, policies, and authorization decisions. | [Authorization model](#authorization-model). |
| Service | A product, workload, or application surface that owns APIs and permissions. This is not the same as the Auth process itself. | [Resources](#resources), [Authorization model](#authorization-model). |
| API | A protected interface owned by a service. APIs group permissions for a specific product surface or resource area. | [Resources](#resources), [Protect an API](#protect-api). |
| Permission | A named action, such as `user:read` or `invoice:create`, that can be assigned to roles and checked by APIs. | [Authorization model](#authorization-model), [Resources](#resources). |
| Role | A collection of permissions assigned to users or granted through registration and invite flows. | [Authorization model](#authorization-model), [Users & invites](#users-invites). |
| System role | A pre-seeded role used by Auth itself or reserved system behavior. It should be changed carefully because it can affect administration. | [Authorization model](#authorization-model), [Tenants & members](#tenants-members). |
| Default role | A role automatically assigned to users during registration or provisioning when configured. | [Registration flows](#registration-flows), [Authorization model](#authorization-model). |
| Policy | A rule document used to express authorization behavior beyond simple role-to-permission assignment. | [Policies](#policies), [Authorization model](#authorization-model). |
| Service policy | A policy attached to a service or service/API relationship so downstream services can evaluate authorization consistently. | [Policies](#policies), [Resources](#resources). |
| Policy bundle | The set of policy data a service can fetch or cache to perform authorization decisions. | [Policies](#policies), [gRPC](#grpc). |
| PDP | Policy Decision Point. The component or service behavior that answers whether a caller is allowed to perform an action. | [Authorization model](#authorization-model), [gRPC](#grpc). |
| Resource server | An external API that receives access tokens and protects its own resources. | [Protect an API](#protect-api), [OAuth & OIDC](#oauth-oidc). |
| Resource-level authorization | Checks that go beyond broad permissions and decide whether a caller can act on a specific record or object. | [Protect an API](#protect-api). |
| On-behalf-of actor | A signed actor context used when a service performs a sensitive action for a real user. It preserves audit attribution. | [gRPC](#grpc), [Service authentication](#service-auth). |

## Security Controls

| Term | Meaning | Where It Matters |
|---|---|---|
| Password policy | Rules for password length, complexity, reuse, expiry, and reset behavior. | [Security controls](#security), [Login & registration](#login-registration). |
| MFA policy | Tenant rules that decide when MFA is optional, required, or required for sensitive actions. | [Security controls](#security), [MFA](#mfa). |
| Session policy | Rules for token lifetimes, refresh rotation, concurrent sessions, idle timeout, and revocation behavior. | [Security controls](#security), [Tokens & sessions](#tokens-sessions). |
| Lockout policy | Rules that temporarily block authentication after repeated failed attempts. | [Security controls](#security), [Troubleshooting](#troubleshooting). |
| Rate limit | A traffic control that limits repeated actions by IP, tenant, user, client, or endpoint class. | [Security controls](#security), [Troubleshooting](#troubleshooting). |
| IP restriction | Tenant rule that allows or blocks traffic by client IP or network range. | [Security controls](#security), [Deployment](#deployment). |
| CAPTCHA | A challenge used during risky or public registration flows to reduce automated abuse. | [Registration flows](#registration-flows), [Security controls](#security). |
| CSRF | Cross-Site Request Forgery. A browser attack class mitigated by secure cookies, SameSite policy, CSRF tokens, and route protections. | [Security controls](#security), [Tokens & sessions](#tokens-sessions). |
| HSTS | HTTP Strict Transport Security. A browser policy that tells the browser to use HTTPS for the site. | [Deployment](#deployment), [Transport security](#transport-security). |
| Trusted proxy CIDR | A configured network range for proxies whose forwarded headers Auth should trust. This protects client IP detection from spoofing. | [Deployment](#deployment), [Environment variables](#environment). |
| Sensitive action | An operation with elevated risk, such as changing secrets, security settings, identity links, MFA factors, passwords, tenant status, or deletion settings. | [Security controls](#security), [Account self-service](#account). |
| Sender-constrained token | A token that must be presented with proof that the caller owns a key or certificate. DPoP and certificate binding are sender-constrained patterns. | [Transport security](#transport-security), [OAuth & OIDC](#oauth-oidc). |

## Events, Webhooks, And Audit

| Term | Meaning | Where It Matters |
|---|---|---|
| Auth event | A security or identity event recorded by Auth, such as login success, login failure, MFA challenge, OAuth activity, account lockout, or authorization failure. | [Auth events](#audit). |
| Management audit log | A record of administrative mutations made through the console, management API, or privileged service path. It records actor, target, operation, result, and time. | [Auth events](#audit), [Observability](#observability). |
| Integration event | An event emitted for downstream systems to react to Auth activity. It can be delivered through webhooks or broker routes. | [Events & webhooks](#events-webhooks). |
| Event type | The named category of an event, used for subscriptions, filtering, routing, and documentation. | [Events & webhooks](#events-webhooks), [Auth events](#audit). |
| Event ID | The public unique identifier of an event. Webhook receivers should use it for deduplication. External integrations should not depend on internal database primary keys. | [Events & webhooks](#events-webhooks). |
| Webhook endpoint | A configured receiver URL where Auth sends subscribed integration events. | [Events & webhooks](#events-webhooks). |
| Webhook subscription | The event-type selection that decides which events an endpoint receives. | [Events & webhooks](#events-webhooks). |
| Webhook signing secret | A secret used to sign webhook deliveries so receivers can verify that the event came from Auth and was not modified. | [Events & webhooks](#events-webhooks), [Secrets & keys](#secrets). |
| Delivery attempt | One try to send a webhook event to a receiver. Attempts record outcome, response status, error, and timing. | [Events & webhooks](#events-webhooks), [Troubleshooting](#troubleshooting). |
| Replay | A controlled resend of an existing event or delivery, usually used after a receiver outage or integration fix. | [Events & webhooks](#events-webhooks). |
| Outbox | Durable event storage used so state changes and event delivery can be coordinated safely. Workers later claim outbox rows for delivery. | [Architecture](#architecture), [Events & webhooks](#events-webhooks). |
| At-least-once delivery | Delivery behavior where a receiver may receive the same event more than once. Receivers must deduplicate and make handlers idempotent. | [Events & webhooks](#events-webhooks), [Troubleshooting](#troubleshooting). |
| Broker delivery | Event delivery through a message broker such as RabbitMQ when configured. | [Events & webhooks](#events-webhooks). |

## Messaging, Branding, And Templates

| Term | Meaning | Where It Matters |
|---|---|---|
| Email provider | The SMTP or transactional email configuration Auth uses for verification, invites, password reset, notifications, and email OTP. | [Messaging](#messaging). |
| SMS provider | The provider Auth uses for SMS login, SMS OTP, phone verification, and SMS-based MFA where enabled. | [Messaging](#messaging), [MFA](#mfa). |
| Email template | Tenant-controlled content for email messages. Templates define what users receive for verification, invites, reset, and notifications. | [Messaging](#messaging). |
| SMS template | Tenant-controlled content for SMS messages. SMS templates should be short, clear, and compatible with provider limits. | [Messaging](#messaging). |
| Branding | Tenant-controlled visual identity such as logo, colors, display name, and hosted identity presentation. | [Branding](#branding), [Hosted login flow](#hosted-login-flow). |
| Login template | Presentation and copy configuration for hosted identity flows. | [Branding](#branding), [Login & registration](#login-registration). |
| Sender | The email address, SMS sender, or provider identity used when Auth sends outbound messages. | [Messaging](#messaging). |
| Suppression | A provider-side or configuration state where a destination stops receiving messages because of bounce, complaint, block, or policy. | [Messaging](#messaging), [Troubleshooting](#troubleshooting). |

## Runtime, Storage, And Operations

| Term | Meaning | Where It Matters |
|---|---|---|
| PostgreSQL | The durable database for tenants, users, clients, providers, sessions, OAuth artifacts, roles, policies, events, templates, audit logs, and setup state. | [Database & Redis](#database-redis), [Deployment](#deployment). |
| Redis | Shared short-lived infrastructure for cache, rate limits, challenge state, OAuth state, replay protection, denylist checks, and cross-replica coordination. | [Database & Redis](#database-redis), [Security controls](#security). |
| Migration | A database schema change applied during startup or deployment. Migrations keep the database compatible with the running Auth version. | [Database & Redis](#database-redis), [Troubleshooting](#troubleshooting). |
| Readiness | A signal that Auth can serve real traffic. It depends on required runtime dependencies such as database reachability, Redis state when configured, and signing keys. | [Troubleshooting](#troubleshooting), [Deployment](#deployment). |
| Liveness | A signal that the Auth process is alive. Liveness does not prove all dependencies are ready. | [Troubleshooting](#troubleshooting), [Deployment](#deployment). |
| Metrics | Numeric operational signals exposed for monitoring and alerting. | [Observability](#observability), [Troubleshooting](#troubleshooting). |
| Trace | A distributed request path that helps connect activity across Auth and other services. | [Observability](#observability), [Troubleshooting](#troubleshooting). |
| Request ID | A correlation value attached to requests and logs. It helps find the backend log entry for a browser or API error. | [Troubleshooting](#troubleshooting), [Observability](#observability). |
| Trace ID | A telemetry correlation value used to connect logs, traces, and events across services. | [Observability](#observability), [Troubleshooting](#troubleshooting). |
| Secret provider | The configured source for sensitive values, such as environment, AWS, GCP, Azure, Vault, or another supported provider. | [Secrets & keys](#secrets), [Environment variables](#environment). |
| Key rotation | Replacing signing or encryption keys while preserving the ability to validate or decrypt data during the transition. | [Secrets & keys](#secrets), [Tokens & sessions](#tokens-sessions). |
| Retention | Rules that decide how long logs, events, sessions, tokens, and other operational records remain available. | [Data lifecycle](#data-lifecycle), [Auth events](#audit). |
| Worker | Background process behavior inside Auth that handles event relay, retries, retention, key rotation, and other asynchronous tasks. | [Architecture](#architecture), [Lifecycle runners](#lifecycle-runners). |

## Service-To-Service And Control Plane

| Term | Meaning | Where It Matters |
|---|---|---|
| gRPC | Private service-to-service transport used for runtime authorization/introspection and optional control-plane provisioning. It is not the hosted login API. | [gRPC](#grpc), [Architecture](#architecture). |
| Runtime gRPC | The gRPC subset used by peer services for authorization decisions, token introspection, selected reads, and policy bundle access. | [gRPC](#grpc), [Service authentication](#service-auth). |
| Control plane | The privileged gRPC provisioning surface used by Maintainerd Core or trusted platform automation to configure Auth instances and IAM resources. | [gRPC](#grpc), [Setup](#setup). |
| System instance | An Auth instance allowed to answer system-level control-plane provisioning calls when configured for that role. | [gRPC](#grpc), [Architecture](#architecture). |
| Regular instance | An Auth instance that serves an application or organization tenant but does not answer system-level provisioning calls. | [gRPC](#grpc), [Architecture](#architecture). |
| Service authentication | Authentication for non-browser callers such as backend services, platform automation, and workers. | [Service authentication](#service-auth), [Workload identity](#workload-identity). |
| Workload identity | Federated identity for non-browser workloads. It lets services prove who they are without handling long-lived static credentials when configured. | [Workload identity](#workload-identity), [Service authentication](#service-auth). |
| mTLS | Mutual TLS. Both client and server present certificates so each side can verify the other. It is important for privileged service-to-service and control-plane traffic. | [Transport security](#transport-security), [gRPC](#grpc). |
| Certificate binding | A sender-constrained token pattern where a token is bound to the certificate used by the caller. | [Transport security](#transport-security), [gRPC](#grpc). |
| Bootstrap token | A one-time or tightly controlled setup credential used before normal principals exist. | [Setup](#setup), [Secrets & keys](#secrets). |

## Data, Identifiers, And Privacy

| Term | Meaning | Where It Matters |
|---|---|---|
| UUID | A public-safe identifier format used for external references. Integrations should prefer UUIDs or documented public identifiers instead of internal database primary keys. | [Events & webhooks](#events-webhooks), [API reference](https://maintainerd.github.io/services/auth/api/). |
| Internal primary key | An implementation detail used by the database. It should not be treated as the external contract for webhook payloads, API responses, or documentation examples. | [Events & webhooks](#events-webhooks), [Data lifecycle](#data-lifecycle). |
| PII | Personally identifiable information, such as email, phone number, name, address, or profile data. PII should be minimized in logs, events, tickets, and integrations. | [Security controls](#security), [Observability](#observability), [Data lifecycle](#data-lifecycle). |
| Claim | A named value inside a token, such as issuer, subject, audience, tenant, expiration, or authentication context. APIs should validate claims before trusting a token. | [Tokens & sessions](#tokens-sessions), [Protect an API](#protect-api). |
| Soft delete | A deletion style where records are marked deleted or inactive instead of being immediately removed from storage. | [Data lifecycle](#data-lifecycle), [Users & invites](#users-invites). |
| Hard delete | Permanent removal of data, usually reserved for explicit erasure workflows and retention cleanup. | [Data lifecycle](#data-lifecycle), [Account self-service](#account). |
| Data minimization | Keeping only the data needed for the feature, audit requirement, or integration. It reduces security and privacy risk. | [Data lifecycle](#data-lifecycle), [Security controls](#security). |

## Commonly Confused Terms

| This Term | Do Not Confuse It With | Difference |
|---|---|---|
| Tenant member | User | A tenant member can administer or operate a tenant. A user may simply sign in to an application. |
| Client | Service | A client is an OAuth application registration. A service is a protected product or workload that owns APIs and permissions. |
| Scope | Permission | A scope describes what a client asks for in OAuth. A permission is an authorization action used by Auth and APIs. |
| ID token | Access token | An ID token describes authentication and user identity to the client. An access token is presented to APIs. |
| Authentication | Authorization | Authentication proves identity. Authorization decides allowed actions. |
| External provider | External application | A provider authenticates users. An application uses Auth to sign users in. |
| Hosted identity app | Admin console | Hosted identity is for end users. The console is for administrators and operators. |
| Auth event | Webhook event | Auth events are security/audit records. Webhook events are integration deliveries to configured receivers. |
| Public identity API | Internal management API | Public identity handles OAuth and user-facing identity flows. Management API handles administrative configuration. |
| System tenant | Regular tenant | The system tenant operates Auth itself. A regular tenant owns application users, clients, and identity configuration. |
| UUID | Internal primary key | UUIDs or documented public IDs are external-safe. Internal primary keys are database implementation details. |
