# What It Is

M9d Auth is Maintainerd's self-hostable identity and access platform. It gives teams a single service for authentication, federation, OAuth 2.0, OpenID Connect, users, tenants, clients, policies, API keys, MFA, sessions, service authorization, audit events, and operational controls.

It runs as one all-in-one image: the Go backend, the admin console, and the hosted identity UI are compiled into the same service. You bring PostgreSQL and Redis, then decide which surfaces are public and which stay controlled.

![M9d Auth console interface preview](/assets/m9d-auth-console.png)

## Who It Serves

- Application users use the hosted identity UI for login, registration, reset-password, MFA, consent, and account self-service.
- Administrators use the console to manage tenants, users, members, clients, providers, roles, permissions, policies, templates, webhooks, and security settings.
- Services use OAuth service clients, service principals, policy bundles, authorization checks, gRPC authorization, token introspection, and audit-ready event trails.

## How To Think About It

M9d Auth is not only a login box. It is the identity boundary and authorization brain for the system. External apps can use it as a self-hosted OAuth/OIDC provider, while Maintainerd services can use it as the central place for service identity and policy decisions.

For the complete overview-level feature map, open the **Features** section in the side navigation. That section captures the shipped Auth capabilities across authentication, OAuth/OIDC, MFA, federation, tenants, IAM, sessions, secrets, security, audit, webhooks, email/SMS, REST, gRPC, architecture, and deployment.
