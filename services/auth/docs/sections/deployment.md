# Deployment

Auth is shipped as the `maintainerd-auth` image. The production image runs one Go process that serves the backend APIs, the embedded admin console, the hosted identity app, background workers, telemetry, and the optional gRPC listener.

Use this page as the deployment runbook. It is intentionally broader than a copy-paste compose file: it explains what must exist before the container starts, which surfaces are public, which surfaces must stay private, how to wire secrets and data stores, and what to verify before a developer points an external application at Auth.

## Deployment Outcome

A healthy Auth deployment should give you:

- A public hosted identity app for login, registration, MFA, consent, password reset, account recovery, profile, sessions, trusted devices, and account self-service.
- A public identity API and OAuth/OIDC issuer used by browsers, external applications, SDKs, and relying parties.
- A private management API used by the admin console and trusted operators.
- A private management port used by infrastructure for readiness, liveness, metrics, and OpenAPI retrieval.
- A PostgreSQL database that persists tenants, users, clients, policies, roles, MFA state, sessions, OAuth state, audit history, events, and webhooks.
- A Redis instance for distributed rate limits, cache, token/session revocation, OAuth short-lived state, OTP throttling, and multi-replica coordination.
- Optional outbound delivery dependencies for SMTP, SMS, webhooks, RabbitMQ event routing, OpenTelemetry, and Core-controlled gRPC.

## Runtime Shape

The container image contains the backend and both browser apps. In production you normally deploy one image and put a TLS reverse proxy or ingress in front of it.

The process listens on these HTTP ports:

```text
:8080  internal management API
:8081  public identity API and OAuth/OIDC issuer
:8082  management port for /healthz, /readyz, /livez, /metrics, /openapi.json
:3000  embedded admin console
:3001  embedded hosted identity app
```

The optional gRPC listener is separate:

```text
:50051  optional gRPC runtime and control-plane surface
```

Expose only the browser-facing and public identity surfaces that your deployment actually needs. Keep `:8080`, `:8082`, and `:50051` private unless your architecture has a very specific internal route for them.

## Image Selection

Use the Docker image named `maintainerd-auth`. Pin a version in every non-local environment.

```yaml
services:
  auth:
    image: xreyc/maintainerd-auth:0.1.0
```

Avoid deploying `latest` to shared environments unless you intentionally want every restart to pull whatever was published most recently.

For local evaluation, `latest` is fine:

```yaml
services:
  auth:
    image: xreyc/maintainerd-auth:latest
```

The image already includes:

- The Go backend binary.
- The built admin console SPA.
- The built hosted identity SPA.
- Runtime CA certificates.
- `tini` as PID 1 so shutdown signals are forwarded and child processes are reaped.
- A container healthcheck that checks the internal API, public API, console, and identity app.

The image does not include PostgreSQL, Redis, RabbitMQ, SMTP, SMS providers, a TLS certificate, or a reverse proxy. Those are supplied by your platform.

## Required Platform Services

Before Auth starts, provide:

- PostgreSQL 17 or another compatible PostgreSQL deployment.
- Redis 7 or another compatible Redis deployment.
- DNS records for the system console host, system identity host, internal API host, and public issuer host.
- TLS termination for all browser and public API hostnames.
- A secret source for required credentials.
- Persistent storage for PostgreSQL.
- Network policy or firewall rules that separate public, internal, and management surfaces.

Optional platform services:

- SMTP relay for verification, invite, password reset, magic-link, and notification email.
- SMS provider configuration for SMS login and SMS MFA.
- RabbitMQ if tenant event routes should publish to a broker.
- An OpenTelemetry collector for traces and logs.
- Prometheus scraping for `/metrics`.
- Core plus gRPC mTLS certificates when Auth is controlled by the Maintainerd ecosystem.

## Required Environment

Auth fails fast when required configuration is missing. A production deployment should begin with this shape:

```env
APP_ENV=production
APP_VERSION=0.1.0
LOG_LEVEL=info

APP_FRONTEND_CONSOLE_HOSTNAME=https://console.auth.example.com
APP_FRONTEND_IDENTITY_HOSTNAME=https://identity.auth.example.com
APP_PRIVATE_HOSTNAME=https://console-api.auth.example.com
APP_PUBLIC_HOSTNAME=https://identity-api.auth.example.com

DB_HOST=postgres.example.internal
DB_PORT=5432
DB_USER=maintainerd_auth
DB_PASSWORD=replace-with-secret
DB_NAME=maintainerd_auth
DB_SSLMODE=require

REDIS_ADDR=redis.example.internal:6379
REDIS_PASSWORD=replace-with-secret
REDIS_TLS=true

COOKIE_SECURE=true
COOKIE_SAMESITE=lax

SECRET_PROVIDER=env
APP_ENCRYPTION_KEY=u8F3n6Qx9V2pL5rT0zY7cB4mD1hK8wAe
HMAC_SECRET_KEY=long-random-production-hmac-secret
JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----..."
JWT_PUBLIC_KEY="-----BEGIN RSA PUBLIC KEY-----..."
```

`APP_ENV` defaults to `production`. Production deployments should leave it unset or set it to `production` explicitly so stricter behavior such as HSTS, database SSL enforcement, gRPC TLS requirements, and strict secret-store transport checks remain active.

Use the Environment Variables, Secrets & Keys, Database & Redis, and Surfaces & Hostnames sections for the full reference. This page focuses on the deployment decisions and the minimum set that must come together.

## Hostname Plan

Plan four Auth hostnames first:

```env
APP_FRONTEND_CONSOLE_HOSTNAME=https://console.auth.example.com
APP_FRONTEND_IDENTITY_HOSTNAME=https://identity.auth.example.com
APP_PRIVATE_HOSTNAME=https://console-api.auth.example.com
APP_PUBLIC_HOSTNAME=https://identity-api.auth.example.com
```

Use full origins. Do not include `/api/v1` in these values.

These hostnames have different jobs:

- `APP_PUBLIC_HOSTNAME` is the OAuth/OIDC issuer and public identity API base. Discovery, JWKS, authorize, token, device, CIBA, PAR, token exchange, revocation, and public identity API behavior anchor here.
- `APP_PRIVATE_HOSTNAME` represents the internal management API. Keep it on a private network because it serves tenant, user, client, role, policy, identity provider, webhook, event, audit, branding, and settings management.
- `APP_FRONTEND_IDENTITY_HOSTNAME` is the hosted login and account-management app.
- `APP_FRONTEND_CONSOLE_HOSTNAME` is the admin console app.

Tenant hostnames are derived from the system frontend hostnames by prepending the tenant DNS slug:

```text
https://identity.auth.example.com        system identity host
https://acme.identity.auth.example.com   acme tenant identity host

https://console.auth.example.com         system console host
https://acme.console.auth.example.com    acme tenant console host
```

Because tenant routing depends on the incoming `Host` header, configure your reverse proxy to preserve the original host.

## Reverse Proxy

A typical production proxy layout is:

```text
console.auth.example.com       -> auth:3000
identity.auth.example.com      -> auth:3001
console-api.auth.example.com   -> auth:8080
identity-api.auth.example.com  -> auth:8081
auth-management.internal       -> auth:8082
```

The public internet normally needs:

- `console.auth.example.com` if operators access the console through the public edge.
- `identity.auth.example.com` for hosted login and self-service.
- `identity-api.auth.example.com` for OAuth/OIDC and public identity API calls.

Private networks should own:

- `console-api.auth.example.com` or the equivalent internal management API hostname.
- `auth-management.internal` or the equivalent management/metrics hostname.
- `:50051` when gRPC is enabled.

Forward these headers from the edge:

```text
Host: original request host
X-Forwarded-Proto: https
X-Forwarded-For: client IP chain
X-Real-IP: immediate client IP, if your proxy supports it
```

The deployed example can terminate TLS at Nginx and forward plain HTTP to the container, but the browser-facing scheme must still be HTTPS. Set `COOKIE_SECURE=true` when the edge terminates TLS.

## DNS And Certificates

Auth does not care whether DNS points at a single VPS, a managed load balancer, an ingress controller, a CDN, or a service mesh gateway. What matters is that the public hostname values resolve to the edge that routes to the correct Auth surface.

The records and commands below are examples, not a required Maintainerd topology. Use them as a reference for the kinds of hostnames and network rules Auth needs, then adapt the exact records, provider commands, certificate automation, and allowlists to your own deployment model. A standalone Auth install on one VPS, an EKS deployment behind an ALB, a private Kubernetes ingress, and a managed container platform can all be valid as long as the same surface boundaries are preserved.

For a single VPS or any deployment with one public edge IP, create A records like this:

```text
console.auth.example.com        A      203.0.113.10
identity.auth.example.com       A      203.0.113.10
identity-api.auth.example.com   A      203.0.113.10
console-api.auth.example.com    A      203.0.113.10
*.console.auth.example.com      A      203.0.113.10
*.identity.auth.example.com     A      203.0.113.10
```

If your server has IPv6, add matching AAAA records:

```text
console.auth.example.com        AAAA   2001:db8::10
identity.auth.example.com       AAAA   2001:db8::10
identity-api.auth.example.com   AAAA   2001:db8::10
console-api.auth.example.com    AAAA   2001:db8::10
*.console.auth.example.com      AAAA   2001:db8::10
*.identity.auth.example.com     AAAA   2001:db8::10
```

For a managed load balancer, point names at the load balancer DNS name instead:

```text
console.auth.example.com        CNAME  auth-edge-123.us-east-1.elb.amazonaws.com
identity.auth.example.com       CNAME  auth-edge-123.us-east-1.elb.amazonaws.com
identity-api.auth.example.com   CNAME  auth-edge-123.us-east-1.elb.amazonaws.com
console-api.auth.example.com    CNAME  auth-edge-123.us-east-1.elb.amazonaws.com
*.console.auth.example.com      CNAME  auth-edge-123.us-east-1.elb.amazonaws.com
*.identity.auth.example.com     CNAME  auth-edge-123.us-east-1.elb.amazonaws.com
```

Some DNS providers do not allow CNAME records at the zone apex. If you deploy Auth on the apex, use the provider's `ALIAS`, `ANAME`, or flattened CNAME feature. For Auth subdomains, ordinary CNAME records are normally fine.

Verify DNS before starting certificate issuance:

```bash
dig +short console.auth.example.com A
dig +short identity.auth.example.com A
dig +short identity-api.auth.example.com A
dig +short console-api.auth.example.com A
dig +short acme.console.auth.example.com A
dig +short acme.identity.auth.example.com A
```

For a load balancer target, verify CNAME resolution:

```bash
dig +short console.auth.example.com CNAME
dig +short identity.auth.example.com CNAME
dig +short acme.identity.auth.example.com CNAME
```

The wildcard records are for tenant frontend hosts. If tenant `acme` exists, Auth generates URLs like:

```text
https://acme.console.auth.example.com
https://acme.identity.auth.example.com
```

For system-only deployments, issue certificates for the four system hostnames:

```text
console.auth.example.com
identity.auth.example.com
console-api.auth.example.com
identity-api.auth.example.com
```

For multi-tenant deployments, include wildcard coverage for tenant frontend hosts:

```text
*.console.auth.example.com
*.identity.auth.example.com
```

Wildcard certificates require an ACME DNS-01 challenge. HTTP-01 can issue certificates for exact names, but it cannot issue `*.console.auth.example.com` or `*.identity.auth.example.com`.

Check the certificate after the edge is live:

```bash
openssl s_client -connect identity.auth.example.com:443 -servername identity.auth.example.com </dev/null 2>/dev/null | openssl x509 -noout -subject -issuer -dates
openssl s_client -connect acme.identity.auth.example.com:443 -servername acme.identity.auth.example.com </dev/null 2>/dev/null | openssl x509 -noout -subject -issuer -dates
```

If you use tenant-specific API hosts later, cover those explicitly as well. Auth's tenant frontend URL helper derives tenant console and identity hosts from the system frontend hostnames; DNS and TLS must be ready before those tenant links are sent in email, invites, resets, or account flows.

## Caddy Edge Example

Caddy is a simple way to run Auth behind automatic HTTPS on a VPS. This is only an example edge; the same routing can be implemented with Nginx, Traefik, Envoy, AWS ALB, GCP Load Balancing, Azure Application Gateway, EKS ingress, or any provider-specific ingress.

Do not copy this as the one blessed production setup. Copy the routing idea: frontend console traffic reaches `:3000`, hosted identity traffic reaches `:3001`, public issuer/API traffic reaches `:8081`, and management/API traffic stays private or explicitly allowlisted.

For exact hostnames only:

```caddyfile
{
	email ops@example.com
}

console.auth.example.com {
	reverse_proxy auth:3000
}

identity.auth.example.com {
	reverse_proxy auth:3001
}

identity-api.auth.example.com {
	reverse_proxy auth:8081
}
```

Keep the management API private when possible. If you must expose it through the edge, restrict it with network allowlists, VPN, identity-aware proxy, or equivalent controls:

```caddyfile
console-api.auth.example.com {
	@allowed remote_ip 198.51.100.0/24 203.0.113.42/32
	handle @allowed {
		reverse_proxy auth:8080
	}
	respond "forbidden" 403
}
```

For tenant wildcard hostnames, use a Caddy build with your DNS provider module and DNS-01 credentials. Cloudflare example:

```caddyfile
{
	email ops@example.com
}

*.console.auth.example.com {
	tls {
		dns cloudflare {env.CLOUDFLARE_API_TOKEN}
	}
	reverse_proxy auth:3000
}

*.identity.auth.example.com {
	tls {
		dns cloudflare {env.CLOUDFLARE_API_TOKEN}
	}
	reverse_proxy auth:3001
}
```

Build Caddy with the Cloudflare DNS module:

```dockerfile
FROM caddy:2-builder AS builder
RUN xcaddy build --with github.com/caddy-dns/cloudflare

FROM caddy:2
COPY --from=builder /usr/bin/caddy /usr/bin/caddy
```

Run Caddy in front of Auth:

```yaml
services:
  caddy:
    image: maintainerd-caddy:latest
    ports:
      - "80:80"
      - "443:443"
    environment:
      CLOUDFLARE_API_TOKEN: ${CLOUDFLARE_API_TOKEN}
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - auth

  auth:
    image: xreyc/maintainerd-auth:0.1.0
    env_file:
      - .env
```

Give the DNS API token the smallest scope your provider supports. For Cloudflare, use a token scoped to the target zone with DNS edit permission and zone read permission:

```text
Zone:DNS:Edit
Zone:Zone:Read
```

Caddy sets `Host`, `X-Forwarded-For`, and `X-Forwarded-Proto` for normal reverse proxy traffic. Auth should still be configured with `TRUSTED_PROXY_CIDRS` for the network range where Caddy or the load balancer reaches the container.

## Firewall And Allowlist Examples

These commands are provider-shaped examples. They show what to open and what to keep private; they are not the only way to secure Auth. Managed Kubernetes ingress policies, cloud security groups, private load balancers, VPNs, service mesh authorization, and host firewalls can all satisfy the same boundary.

Open only the public edge ports to the internet:

```text
80/tcp   public HTTP for ACME redirect or HTTP-01 challenge
443/tcp  public HTTPS
```

Keep these private:

```text
8080/tcp   internal management API
8082/tcp   management health, metrics, OpenAPI
50051/tcp  optional gRPC runtime/control plane
5432/tcp   PostgreSQL
6379/tcp   Redis
5671/tcp   RabbitMQ over TLS, if used
5672/tcp   RabbitMQ plain AMQP, private network only
```

Ubuntu `ufw` example for a single VPS:

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
ufw status verbose
```

Restrict SSH to your own IP when you know it:

```bash
ufw delete allow OpenSSH
ufw allow from 198.51.100.42/32 to any port 22 proto tcp
ufw reload
```

Allow an internal management network to reach the management API and management port:

```bash
ufw allow from 10.20.0.0/16 to any port 8080 proto tcp
ufw allow from 10.20.0.0/16 to any port 8082 proto tcp
```

Allow Core or peer services to reach gRPC only from the private network:

```bash
ufw allow from 10.30.0.0/16 to any port 50051 proto tcp
```

AWS security group examples:

```bash
aws ec2 authorize-security-group-ingress \
  --group-id sg_auth_edge \
  --ip-permissions 'IpProtocol=tcp,FromPort=80,ToPort=80,IpRanges=[{CidrIp=0.0.0.0/0}]'

aws ec2 authorize-security-group-ingress \
  --group-id sg_auth_edge \
  --ip-permissions 'IpProtocol=tcp,FromPort=443,ToPort=443,IpRanges=[{CidrIp=0.0.0.0/0}]'

aws ec2 authorize-security-group-ingress \
  --group-id sg_auth_private \
  --ip-permissions 'IpProtocol=tcp,FromPort=8082,ToPort=8082,IpRanges=[{CidrIp=10.20.0.0/16}]'
```

GCP firewall examples:

```bash
gcloud compute firewall-rules create auth-edge-https \
  --allow tcp:80,tcp:443 \
  --source-ranges 0.0.0.0/0 \
  --target-tags auth-edge

gcloud compute firewall-rules create auth-management-private \
  --allow tcp:8080,tcp:8082,tcp:50051 \
  --source-ranges 10.20.0.0/16 \
  --target-tags auth-internal
```

Azure NSG examples:

```bash
az network nsg rule create \
  --resource-group rg-auth \
  --nsg-name nsg-auth-edge \
  --name allow-https \
  --priority 100 \
  --access Allow \
  --protocol Tcp \
  --direction Inbound \
  --source-address-prefixes Internet \
  --destination-port-ranges 80 443

az network nsg rule create \
  --resource-group rg-auth \
  --nsg-name nsg-auth-private \
  --name allow-management-private \
  --priority 110 \
  --access Allow \
  --protocol Tcp \
  --direction Inbound \
  --source-address-prefixes 10.20.0.0/16 \
  --destination-port-ranges 8080 8082 50051
```

After applying rules, test from the right network. Confirm the public identity host is reachable, OIDC discovery is available, management readiness works from the private network, and the gRPC listener is reachable only from trusted private networks. Use the API reference for exact HTTP probe requests.

## Cookies And Browser Security

Production cookie defaults are secure:

```env
COOKIE_SECURE=true
COOKIE_SAMESITE=lax
```

Use `COOKIE_SAMESITE=lax` for browser login and federated SSO redirect compatibility. Use `none` only when you intentionally need cross-site cookies and are serving exclusively over HTTPS. Use `strict` only if you know your login and identity provider redirect flows will not need a cross-site top-level navigation to carry the cookie.

Leave `COOKIE_DOMAIN` unset for host-only cookies:

```env
COOKIE_DOMAIN=
```

Set it only when first-party Auth surfaces under the same parent domain should share one browser session:

```env
COOKIE_DOMAIN=auth.example.com
```

Do not set `COOKIE_DOMAIN` to an external application domain. External applications authenticate with OAuth/OIDC tokens and their own application session; they do not share Auth's browser cookie.

Production mode sends HSTS on HTTP responses. Make sure TLS is permanently ready before using preload-style domain policies at the edge.

## Secrets

Required deployment secrets:

- `APP_ENCRYPTION_KEY`: exactly 32 bytes. Encrypts stored secrets and sensitive data.
- `HMAC_SECRET_KEY`: signs reset, invite, magic-link, and other signed URL state.
- `DB_PASSWORD`: PostgreSQL password.
- `REDIS_PASSWORD`: required only if Redis AUTH is enabled.
- `JWT_PRIVATE_KEY` and `JWT_PUBLIC_KEY`: required JWT signing key material.
- `SETUP_BOOTSTRAP_TOKEN`: required only for Core/control-plane bootstrap over gRPC.
- `GRPC_TLS_CERT_FILE`, `GRPC_TLS_KEY_FILE`, and `GRPC_CLIENT_CA_FILE`: required for Core-controlled deployments and production gRPC TLS.

Example with environment-backed secrets:

```env
SECRET_PROVIDER=env
APP_ENCRYPTION_KEY=Z2D8Lw5xP9bq0M6nH3vY7rK1sT4uA2cE
HMAC_SECRET_KEY=change-this-to-a-long-random-hmac-secret
DB_PASSWORD=replace-with-real-db-password
REDIS_PASSWORD=replace-with-real-redis-password
JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----..."
JWT_PUBLIC_KEY="-----BEGIN RSA PUBLIC KEY-----..."
```

Example with AWS Secrets Manager:

```env
SECRET_PROVIDER=aws_secrets
SECRET_PREFIX=maintainerd/prod/auth
SECRET_STRICT=true
AWS_REGION=us-east-1
```

Store these secret names in AWS:

```text
maintainerd/prod/auth/app-encryption-key
maintainerd/prod/auth/hmac-secret-key
maintainerd/prod/auth/db-password
maintainerd/prod/auth/redis-password
maintainerd/prod/auth/jwt-private-key
maintainerd/prod/auth/jwt-public-key
```

Example with file-backed secrets, useful for Docker or Kubernetes-mounted secrets:

```env
SECRET_PROVIDER=file
SECRET_FILE_PATH=/run/secrets
SECRET_STRICT=true
```

Mount files like:

```text
/run/secrets/app-encryption-key
/run/secrets/hmac-secret-key
/run/secrets/db-password
/run/secrets/redis-password
/run/secrets/jwt-private-key
/run/secrets/jwt-public-key
```

When using a managed provider, leave `SECRET_STRICT=false` during migration if some secrets still come from env vars. Set `SECRET_STRICT=true` once every required secret is in the provider.

## Signing Keys

Auth requires JWT signing key material at startup. Provide the active key pair through the configured secret provider.

```env
JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----..."
JWT_PUBLIC_KEY="-----BEGIN RSA PUBLIC KEY-----..."
JWT_KEY_ID=maintainerd-auth-key-1
```

Use RSA key material compatible with the configured JWT algorithm. Rotation is done by updating the secret values and redeploying all replicas. Rotate carefully because relying parties cache JWKS and existing tokens remain valid until they expire.

For multi-replica deployments, every replica must receive the same active key pair and `JWT_KEY_ID` during a rollout. Do not let different replicas sign with different private keys under the same issuer.

## PostgreSQL

Auth requires PostgreSQL at startup. It connects, retries with exponential backoff, applies pool settings, then runs database migrations before serving traffic.

Production example:

```env
DB_HOST=postgres.example.internal
DB_PORT=5432
DB_USER=maintainerd_auth
DB_PASSWORD=replace-with-secret
DB_NAME=maintainerd_auth
DB_SSLMODE=require
DB_MAX_OPEN_CONNS=25
DB_MAX_IDLE_CONNS=10
DB_CONN_MAX_LIFETIME_SEC=300
DB_STATEMENT_TIMEOUT_MS=30000
```

Production mode refuses `DB_SSLMODE=disable`. Prefer `verify-full` when your PostgreSQL provider gives you a stable server hostname and CA chain:

```env
DB_SSLMODE=verify-full
```

The process runs migrations in-process at startup. Migrations use a PostgreSQL advisory lock, so rolling multiple replicas against the same database is safe: one replica applies pending migrations while the others wait and then observe the completed versions.

Operational expectations:

- Back up PostgreSQL before upgrading Auth.
- Keep `DB_STATEMENT_TIMEOUT_MS` low enough to bound runaway queries and high enough for normal admin/reporting actions.
- Size `DB_MAX_OPEN_CONNS` across all replicas so the total does not exceed the database server limit.
- Monitor readiness because `/readyz` pings PostgreSQL.
- Treat PostgreSQL as critical state. Losing it loses tenants, clients, users, policies, sessions, audit history, event state, webhook state, and MFA state.

## Redis

Auth requires Redis at startup. It pings Redis with retry/backoff before serving traffic.

Production example:

```env
REDIS_ADDR=redis.example.internal:6379
REDIS_PASSWORD=replace-with-secret
REDIS_TLS=true
```

`REDIS_ADDR` can also use a `rediss://` URL, which enables TLS automatically:

```env
REDIS_ADDR=rediss://redis.example.internal:6379
REDIS_TLS=false
```

Redis supports:

- Public and tenant-scoped rate limits.
- Session and token revocation fast paths.
- OAuth/OIDC transient state.
- OTP throttling and anti-abuse controls.
- Runtime caches.
- Multi-replica coordination for several security-sensitive flows.

Deploy Redis as a shared dependency for every Auth replica in the same environment. Do not give each replica its own isolated Redis instance.

## External Application Readiness

Before telling developers to integrate their own app, create at least one client in Auth and register its allowed URIs.

Example external web application:

```text
Application domain: https://app.customer.example
Redirect URI:       https://app.customer.example/auth/callback
CORS origin URI:    https://app.customer.example
Post logout URI:    https://app.customer.example/logout/callback
```

Deployment reminders:

- Do not put the external app domain in `APP_PUBLIC_HOSTNAME`; that variable is Auth's issuer.
- Register external app domains on client records.
- Redirect URI matching is exact, except for supported loopback redirects and mobile reverse-domain schemes.
- Credentialed browser API calls from an external app require a registered `cors_origin_uri` on the client or an operator-owned `CORS_ALLOWED_ORIGINS` entry.
- The OIDC issuer URL seen by the external app is `APP_PUBLIC_HOSTNAME`.

## CORS And Proxies

Static CORS origins are configured with:

```env
CORS_ALLOWED_ORIGINS=https://ops.example.com,https://admin.example.com
```

Tenant/client application origins should usually be stored as client `cors_origin_uri` entries instead. Those are scoped to the request tenant, which avoids accidentally allowing one tenant's browser application on another tenant's surface.

Client IP resolution affects rate limits, audit events, IP restriction rules, and abuse detection. Use explicit trusted proxy CIDRs in production:

```env
TRUSTED_PROXY_CIDRS=10.20.0.0/16,192.0.2.10/32
```

Use this only when the platform overwrites forwarding headers and you trust every immediate peer that can reach Auth:

```env
TRUST_ALL_PROXIES=true
```

Avoid `TRUST_ALL_PROXIES=true` on a public listener. A caller that can spoof `X-Forwarded-For` can confuse IP-based rate limits and restrictions.

## WebAuthn And Passkeys

Passkeys depend on hostname planning. If users enroll passkeys on more than one Auth subdomain, set the relying-party ID to a registrable parent domain:

```env
WEBAUTHN_RP_ID=auth.example.com
```

This allows passkeys across:

```text
identity.auth.example.com
acme.identity.auth.example.com
console.auth.example.com
acme.console.auth.example.com
```

If `WEBAUTHN_RP_ID` is unset, Auth derives the RP ID from `APP_PUBLIC_HOSTNAME`. That can be correct for a single host, but it is usually too narrow for multi-tenant or console-plus-identity passkey use.

## Messaging And Delivery

Email and SMS are configured inside Auth as tenant-level delivery settings, but the deployment must still provide reachable providers.

Email deployment requirements:

- An SMTP relay reachable from the Auth container.
- Sender domains and DNS records configured outside Auth.
- Tenant email configuration created in the console or API.
- Email templates reviewed for invite, verification, reset, magic-link, and notification flows.

SMS deployment requirements:

- A supported SMS delivery configuration reachable from the Auth container.
- Tenant SMS configuration created in the console or API.
- SMS templates reviewed for OTP and MFA flows.
- Rate limits monitored because SMS endpoints are abuse-prone and cost-bearing.

## Events, Webhooks, And RabbitMQ

Webhook delivery uses the database-backed event/outbox and delivery-history model. RabbitMQ is optional and only needed when tenant event routes should publish to a broker.

Enable RabbitMQ with:

```env
RABBITMQ_URL=amqps://maintainerd-auth:secret@rabbitmq.example.internal:5671/
```

When `RABBITMQ_URL` is unset, broker publishing is disabled cleanly. Webhook-related data still uses PostgreSQL. The broker exchange is declared by Auth as:

```text
maintainerd-auth.events
```

Deployment reminders:

- Use `amqps://` where your broker supports TLS.
- Create tenant event routes and consumer queue bindings so routed messages are not returned as unroutable.
- Monitor delivery history, retry state, quarantined endpoints, and outbox growth.
- Ensure outbound HTTPS from Auth to webhook endpoints is allowed by your network policy.

## Observability

Auth emits structured JSON logs to stdout. In production, collect stdout logs from the container runtime.

Enable OTLP traces and logs with:

```env
OTEL_ENABLED=true
OTEL_SERVICE_NAME=maintainerd-auth
OTEL_EXPORTER_OTLP_ENDPOINT=otel-collector.example.internal:4317
```

Auth also registers Prometheus metrics and exposes them on the private management surface. Scrape that surface only through private networking or a trusted HTTPS management route. Metrics include build information plus HTTP and auth-domain counters such as authentication events, security denials, and audit-write failures.

Useful deployment signals:

- Container restarts.
- `/readyz` failures.
- PostgreSQL connection errors.
- Redis connection errors.
- `security_denials_total` spikes.
- `auth_events_total` changes by result and event type.
- `audit_write_failures_total` above zero.
- Webhook delivery retries or quarantines.
- AMQP unroutable-message logs.
- gRPC health status if gRPC is enabled.

## Probes

The HTTP routers expose health, readiness, and liveness probes on the internal API, public API, and management port. Use the deployment platform's probe configuration to call the appropriate path for each lifecycle check, and use the API reference for exact endpoint paths.

Use `/livez` for liveness:

```yaml
livenessProbe:
  httpGet:
    path: /livez
    port: 8082
  initialDelaySeconds: 15
  periodSeconds: 30
```

Use `/readyz` for readiness:

```yaml
readinessProbe:
  httpGet:
    path: /readyz
    port: 8082
  initialDelaySeconds: 20
  periodSeconds: 10
```

`/readyz` checks:

- PostgreSQL reachability.
- Redis reachability.
- Loaded JWKS/signing key state.

The container healthcheck checks the internal API, public API, console, and identity app. If your orchestrator supports native probes, prefer probing `:8082` so health checks do not require public ingress.

## Startup And Migrations

Startup order:

1. Load configuration and secret provider.
2. Initialize OpenTelemetry logs, traces, and metrics.
3. Initialize JWT keys.
4. Connect to PostgreSQL.
5. Connect to Redis.
6. Run PostgreSQL migrations.
7. Wire domain services, event delivery, webhooks, cache, security, and OAuth services.
8. Start background workers.
9. Start REST servers and optional embedded frontend servers.
10. Start optional gRPC listener in the background.

Because migrations run inside the process, allow a generous startup window. The image healthcheck uses a 60-second start period. For Kubernetes or another scheduler, avoid killing the container too aggressively during first boot or after an upgrade with new migrations.

## Background Workers

Every replica starts the background workers. The current workers include:

- Auth-event retention.
- Tenant retention cleanup.
- OAuth cleanup for expired codes, tokens, challenges, and short-lived rows.
- Data erasure anonymization worker.
- Auth-event partition manager.
- Secret-backed signing-key refresh.
- Secret refresh for refreshable secrets.
- Optional gRPC server.

Design the deployment assuming these workers run alongside normal web traffic. Use shared PostgreSQL and Redis so workers and request handlers observe the same state.

## Standalone Deployment

Standalone is the default mode. Use it when you run Auth as the IAM system for your own application or organization.

Standalone defaults:

```env
GRPC_ENABLED=false
CONTROL_PLANE_ENABLED=false
SETUP_BOOTSTRAP_TOKEN=
```

Bootstrap path:

- Start Auth with PostgreSQL, Redis, hostnames, and required secrets.
- Visit the console.
- Complete the REST setup wizard.
- Create tenants, clients, identity providers, policies, roles, and users from the console or management API.

Standalone deployments may still enable runtime gRPC later if peer services need PDP authorization, token introspection, or user/profile reads.

## Runtime gRPC Deployment

Enable runtime gRPC when internal services need machine-to-machine authorization or identity reads, but you do not want Core to provision this Auth instance.

```env
GRPC_ENABLED=true
CONTROL_PLANE_ENABLED=false
GRPC_TLS_CERT_FILE=/etc/auth/grpc/tls.crt
GRPC_TLS_KEY_FILE=/etc/auth/grpc/tls.key
GRPC_CLIENT_CA_FILE=/etc/auth/grpc/client-ca.crt
GRPC_REQUIRE_MTLS=true
```

Runtime gRPC serves:

- Authorization checks.
- OAuth token introspection.
- User reads.
- User profile reads.

When `GRPC_REQUIRE_MTLS=true`, callers must present a client certificate issued by `GRPC_CLIENT_CA_FILE`.

Production gRPC should use TLS. Reflection is disabled in production.

## Core-Controlled Deployment

Enable control-plane mode only when Auth is managed by Core in the Maintainerd ecosystem.

```env
CONTROL_PLANE_ENABLED=true
INSTANCE_ROLE=system
SETUP_BOOTSTRAP_TOKEN=replace-with-secret-bootstrap-token
SETUP_WINDOW_TTL=30m

GRPC_TLS_CERT_FILE=/etc/auth/grpc/tls.crt
GRPC_TLS_KEY_FILE=/etc/auth/grpc/tls.key
GRPC_CLIENT_CA_FILE=/etc/auth/grpc/core-client-ca.crt
```

Important behavior:

- `CONTROL_PLANE_ENABLED=true` implies `GRPC_ENABLED=true`.
- Control-plane mode forces mTLS. `GRPC_REQUIRE_MTLS=false` cannot downgrade it.
- `GRPC_CLIENT_CA_FILE` must contain a PEM CA that issued Core's client certificate.
- `SETUP_BOOTSTRAP_TOKEN` gates the setup service used by Core.
- `SETUP_WINDOW_TTL` bounds the bootstrap window after process start and must be positive.
- `INSTANCE_ROLE=system` is the ecosystem system Auth instance.
- `INSTANCE_ROLE=regular` is for ordinary Auth instances provisioned by Core; administrative control-plane calls are not meant to run there.

Never expose the control-plane gRPC listener to the public internet.

## Kubernetes Example

This is a minimal deployment shape. Adapt names, namespaces, resources, probes, service mesh, and secret references to your platform.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: maintainerd-auth
spec:
  replicas: 2
  selector:
    matchLabels:
      app: maintainerd-auth
  template:
    metadata:
      labels:
        app: maintainerd-auth
    spec:
      containers:
        - name: auth
          image: xreyc/maintainerd-auth:0.1.0
          ports:
            - name: internal
              containerPort: 8080
            - name: public
              containerPort: 8081
            - name: management
              containerPort: 8082
            - name: console
              containerPort: 3000
            - name: identity
              containerPort: 3001
          envFrom:
            - configMapRef:
                name: maintainerd-auth-config
            - secretRef:
                name: maintainerd-auth-secrets
          readinessProbe:
            httpGet:
              path: /readyz
              port: management
            initialDelaySeconds: 20
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /livez
              port: management
            initialDelaySeconds: 15
            periodSeconds: 30
```

Example service split:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: maintainerd-auth-public
spec:
  selector:
    app: maintainerd-auth
  ports:
    - name: public
      port: 8081
      targetPort: public
    - name: identity
      port: 3001
      targetPort: identity
---
apiVersion: v1
kind: Service
metadata:
  name: maintainerd-auth-console
spec:
  selector:
    app: maintainerd-auth
  ports:
    - name: console
      port: 3000
      targetPort: console
---
apiVersion: v1
kind: Service
metadata:
  name: maintainerd-auth-internal
spec:
  selector:
    app: maintainerd-auth
  ports:
    - name: internal
      port: 8080
      targetPort: internal
    - name: management
      port: 8082
      targetPort: management
```

Route public ingress only to public, identity, and whichever console route your operator model allows. Keep the internal service reachable only from trusted namespaces, VPN, a private load balancer, or a service mesh policy.

## Docker Compose Example

For a small self-hosted deployment, the compose shape is:

```yaml
services:
  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_USER: maintainerd
      POSTGRES_PASSWORD: change-me
      POSTGRES_DB: maintainerd
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

  auth:
    image: xreyc/maintainerd-auth:0.1.0
    depends_on:
      - postgres
      - redis
    env_file:
      - .env

  nginx:
    image: nginx:latest
    depends_on:
      - auth
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./certs:/etc/nginx/certs:ro

volumes:
  pgdata:
```

The quickstart in the Auth repository expands this with local `.maintainerd.local` DNS, self-signed TLS certificates, and container routing.

## Scaling And Rollouts

Auth can run multiple replicas when they share the same PostgreSQL and Redis.

Rollout guidance:

- Use rolling deployments with readiness checks on `/readyz`.
- Keep old replicas serving until new replicas have connected to PostgreSQL and Redis, completed migrations, and loaded signing keys.
- Pin image versions and record `APP_VERSION` for metrics and support.
- Avoid changing hostname variables during a rolling deployment unless all clients and redirect URIs are prepared for the issuer change.
- Avoid rotating `APP_ENCRYPTION_KEY` without setting `APP_ENCRYPTION_KEYS_PREVIOUS` and planning re-encryption.
- Rotate operator-managed JWT keys carefully because relying parties cache JWKS.
- Keep JWT key material identical across replicas during each rollout.
- Keep `DB_MAX_OPEN_CONNS * replica_count` below the PostgreSQL server limit.
- Keep management and internal ports private even when horizontal scaling through a load balancer.

## Upgrade Checklist

Before upgrading:

- Read the release notes for migration, config, and API changes.
- Back up PostgreSQL.
- Confirm Redis persistence/HA posture matches your tolerance for rate-limit and revocation cache loss.
- Confirm the new image tag exists for every target architecture.
- Confirm secret provider access from the new runtime identity.
- Confirm `APP_ENV=production` and `DB_SSLMODE` is not `disable`.
- Confirm all hostname variables still match DNS and ingress.
- Confirm external clients are not hard-coded to an old issuer hostname.

During upgrade:

- Roll out one replica first when possible.
- Watch startup logs for config validation, database connection, Redis connection, migration success, signing-key initialization, and server start messages.
- Watch `/readyz` on the management port.
- Watch authentication, token, and denial metrics.

After upgrade:

- Load `/.well-known/openid-configuration` from `APP_PUBLIC_HOSTNAME`.
- Load JWKS from the discovered `jwks_uri`.
- Start an authorization-code flow through the hosted identity app.
- Log into the console.
- Create or update a test client redirect URI.
- Send a test email and SMS if those providers are enabled.
- Deliver a test webhook or broker event if events are enabled.

## Production Checklist

Before sending real traffic to Auth:

- Pin the `maintainerd-auth` image version.
- Set `APP_ENV=production`.
- Set all four hostname variables to HTTPS origins.
- Configure A, AAAA, CNAME, ALIAS, or ANAME records for your VPS, load balancer, ingress, or CDN edge.
- Configure wildcard DNS records for tenant console and identity hosts when multi-tenancy is enabled.
- Configure TLS certificates for system and wildcard tenant hosts.
- Preserve `Host`, `X-Forwarded-Proto`, and client IP forwarding headers at the proxy.
- Open only `80/tcp` and `443/tcp` publicly unless your platform has a stricter private edge model.
- Set `TRUSTED_PROXY_CIDRS` to your proxy or load-balancer ranges.
- Keep `:8080`, `:8082`, and `:50051` off the public internet.
- Use `COOKIE_SECURE=true`.
- Use `COOKIE_SAMESITE=lax` unless a specific browser flow requires another value.
- Set `COOKIE_DOMAIN` only for a parent domain you control.
- Use a secret provider for production credentials.
- Ensure `APP_ENCRYPTION_KEY` is exactly 32 bytes.
- Provide `JWT_PRIVATE_KEY`, `JWT_PUBLIC_KEY`, and a stable `JWT_KEY_ID`.
- Use PostgreSQL SSL in production.
- Size PostgreSQL connection pools across replicas.
- Use shared Redis for every replica.
- Enable Redis TLS when Redis is outside a private trusted network.
- Configure SMTP before enabling invite, verification, reset, or magic-link flows.
- Configure SMS before enabling SMS login or SMS MFA.
- Set `WEBAUTHN_RP_ID` before enrolling production passkeys.
- Register external application redirect, logout, origin, and CORS URIs on client records.
- Enable OTLP export or stdout log collection.
- Scrape Prometheus metrics from the private management port.
- Configure alerting for readiness, restarts, security denials, audit write failures, webhook failures, and dependency errors.
- If using runtime gRPC, configure server TLS and client CA mTLS.
- If using Core control-plane mode, configure `CONTROL_PLANE_ENABLED`, `INSTANCE_ROLE`, `SETUP_BOOTSTRAP_TOKEN`, `SETUP_WINDOW_TTL`, and gRPC mTLS before first boot.
