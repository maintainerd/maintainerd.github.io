# Secrets & Keys

Auth separates ordinary configuration from credential material. Hostnames, ports, runtime mode, pool sizes, and feature toggles are normal environment variables. Passwords, signing keys, encryption keys, and bootstrap credentials are loaded through the secret provider selected by `SECRET_PROVIDER`.

For the quickstart, `SECRET_PROVIDER=env` is usually enough. For production deployments, move the same secret names into a secret manager and let Auth read them from that provider.

## Required Secrets

Auth needs these secrets before it can serve traffic:

| Secret | Required Shape | What It Protects |
|---|---|---|
| `DB_PASSWORD` | PostgreSQL password string. | Database access. |
| `JWT_PRIVATE_KEY` | RSA private key in PEM format. | Signing access tokens, ID tokens, and other JWTs. |
| `JWT_PUBLIC_KEY` | Matching RSA public key in PEM format. | Token verification and JWKS publishing. |
| `APP_ENCRYPTION_KEY` | Exactly 32 bytes after normalization. | AES-256 encryption for stored secrets. |
| `HMAC_SECRET_KEY` | Non-empty random secret. | Signed URLs and signed state values. |

These values must never be committed to source control, baked into frontend bundles, logged, sent to browsers, or copied into issue trackers.

## Secret Value Examples

These examples show valid shapes only. Generate your own values for every environment.

```env
DB_PASSWORD='replace-with-a-long-random-database-password'
APP_ENCRYPTION_KEY=base64:gynBDhdZQkEO+JBOdiryYBPo5WB/wtU4BzoilY4y1M0=
HMAC_SECRET_KEY=base64:ZD4f9tVsRNMYwasQq+32KRxP3GwH6kM8ZpA/XUjD1lY=
JWT_PRIVATE_KEY='-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----'
JWT_PUBLIC_KEY='-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----'
```

`APP_ENCRYPTION_KEY` must decode to exactly 32 bytes. `HMAC_SECRET_KEY` must be non-empty and should be generated with strong randomness. JWT keys must be a matching RSA private/public PEM pair.

## Optional Secrets

| Secret | When To Set It | Purpose |
|---|---|---|
| `REDIS_PASSWORD` | Redis requires AUTH. | Authenticates Redis connections. |
| `APP_ENCRYPTION_KEYS_PREVIOUS` | Rotating the application encryption key. | Decrypt-only list of retired 32-byte keys. |
| `SETUP_BOOTSTRAP_TOKEN` | Using gRPC setup through Core or another control plane. | Authenticates bootstrap before normal principals exist. |

`RABBITMQ_URL` contains a broker password when credentials are embedded in the URL. It is read as an environment variable, but should be handled like a secret operational value.

## Secret Provider Selection

| Setting | Default | Purpose |
|---|---|---|
| `SECRET_PROVIDER` | `env` | Selects `env`, `file`, `aws_secrets`, `aws_ssm`, `vault`, `gcp`, or `azure_kv`. |
| `SECRET_PREFIX` | `maintainerd/auth` | Namespace or path prefix used by AWS and Vault providers. |
| `SECRET_STRICT` | `false` | When `false`, a missing secret in a non-env provider can fall back to the same process environment key. When `true`, the configured provider is authoritative and missing values fail startup. |

Use `SECRET_STRICT=false` while migrating a deployment gradually from environment variables to a secret manager. After every required and optional secret has moved into the provider, set `SECRET_STRICT=true`.

## Value Normalization

Every provider uses the same normalization rules:

| Rule | Effect |
|---|---|
| Leading and trailing whitespace is trimmed. | File, cloud, and environment secrets behave consistently. |
| Values prefixed with `base64:` are base64-decoded. | Binary key material can be stored safely as text. |
| Empty required secrets fail startup. | Auth does not serve traffic with missing critical key material. |

This makes file secrets, cloud secrets, and environment variables behave the same way. It also means a generated binary key can be stored safely as `base64:<encoded-value>`.

## Provider Naming

Auth looks up the same logical keys regardless of provider, but each provider maps key names differently.

For `env`, the key is the environment variable name:

```env
JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
APP_ENCRYPTION_KEY=base64:...
```

For `file`, secret names are lowercased and underscores become hyphens under `SECRET_FILE_PATH`:

```text
/run/secrets/jwt-private-key
/run/secrets/jwt-public-key
/run/secrets/app-encryption-key
/run/secrets/hmac-secret-key
```

For `aws_secrets`, names use `SECRET_PREFIX` plus a hyphenated key:

```text
maintainerd/auth/jwt-private-key
maintainerd/auth/app-encryption-key
```

Example AWS Secrets Manager values for a production prefix:

```text
maintainerd/prod/auth/db-password          -> replace-with-a-long-random-database-password
maintainerd/prod/auth/redis-password       -> replace-with-a-long-random-redis-password
maintainerd/prod/auth/app-encryption-key   -> base64:gynBDhdZQkEO+JBOdiryYBPo5WB/wtU4BzoilY4y1M0=
maintainerd/prod/auth/hmac-secret-key      -> base64:ZD4f9tVsRNMYwasQq+32KRxP3GwH6kM8ZpA/XUjD1lY=
maintainerd/prod/auth/jwt-private-key      -> -----BEGIN RSA PRIVATE KEY-----...
maintainerd/prod/auth/jwt-public-key       -> -----BEGIN PUBLIC KEY-----...
```

Example AWS CLI commands:

```bash
aws secretsmanager create-secret \
  --name maintainerd/prod/auth/app-encryption-key \
  --secret-string 'base64:gynBDhdZQkEO+JBOdiryYBPo5WB/wtU4BzoilY4y1M0='

aws secretsmanager create-secret \
  --name maintainerd/prod/auth/db-password \
  --secret-string 'replace-with-a-long-random-database-password'
```

For `aws_ssm`, parameter paths use `SECRET_PREFIX` with a leading slash:

```text
/maintainerd/auth/jwt-private-key
/maintainerd/auth/app-encryption-key
```

For `vault`, Auth reads Vault KV v2 at:

```text
<VAULT_MOUNT>/data/<SECRET_PREFIX>/<key-lowercased-hyphens>
```

Each Vault secret must contain the field named by `VAULT_SECRET_FIELD`, default `value`.

For `gcp`, `SECRET_PREFIX` is not applied. Auth reads the latest version of a hyphenated secret in `GCP_PROJECT_ID`:

```text
projects/<GCP_PROJECT_ID>/secrets/jwt-private-key/versions/latest
```

For `azure_kv`, `SECRET_PREFIX` is not applied. Auth reads a hyphenated Azure Key Vault secret name:

```text
jwt-private-key
app-encryption-key
```

## Provider Configuration

- `SECRET_FILE_PATH`: optional, default `/run/secrets`. Used by the `file` provider.
- `AWS_REGION`: optional, default `us-east-1`. Used by `aws_secrets` and `aws_ssm`.
- `VAULT_ADDR`: optional Vault address. Use HTTPS for production deployments.
- `VAULT_TOKEN`: optional. Static Vault token. If unset, Auth uses AppRole.
- `VAULT_MOUNT`: optional, default `secret`. Vault KV v2 mount.
- `VAULT_SECRET_FIELD`: optional, default `value`. Field read from each Vault secret.
- `VAULT_ROLE_ID`: required when using Vault AppRole.
- `VAULT_SECRET_ID`: required when using Vault AppRole.
- `GCP_PROJECT_ID`: required when `SECRET_PROVIDER=gcp`.
- `AZURE_KEYVAULT_URL`: required when `SECRET_PROVIDER=azure_kv`.

AWS uses the standard AWS credential chain. GCP uses Application Default Credentials. Azure uses `DefaultAzureCredential`, including environment credentials, workload identity, managed identity, and Azure CLI credentials for operator-managed secret access.

## Fallback And Failure Behavior

Fallback is allowed only for absent secrets, not for broken providers.

When `SECRET_PROVIDER` is not `env` and `SECRET_STRICT=false`, Auth may fall back to the same key in process environment variables only if the provider returns a definitive not-found response.

Auth does not fall back when the provider is unavailable, unauthorized, misconfigured, returns malformed data, times out after retries, or cannot be reached securely. Those are startup or refresh failures because the operator expected Auth to read the secret store.

Remote provider reads are retried up to three times. Local providers such as `env` and `file` fail immediately because missing environment variables and missing files are deterministic.

## JWT Signing Keys

`JWT_PRIVATE_KEY` and `JWT_PUBLIC_KEY` are the token signing key pair. Auth validates that:

- Both values are present.
- The private key parses as an RSA private key.
- The public key parses as an RSA public key.
- The private and public keys belong to the same key pair.
- The key strength passes the runtime validation.

`JWT_KEY_ID` controls the key ID used when the process installs the configured key pair. It defaults to `maintainerd-auth-key-1`.

`SECRET_REFRESH_PERIOD_SECONDS` controls how often Auth re-fetches provider-backed secrets. When `JWT_PRIVATE_KEY` or `JWT_PUBLIC_KEY` changes, Auth reloads the key material and reinstalls the configured signing key without requiring a process restart.

Coordinate JWT key rotation carefully. The provider-backed key path is operator-managed: update every replica consistently, expect JWKS to publish the newly configured key, and plan around the lifetime of tokens signed by the previous key. Do not rotate only one replica or one secret value; the private key, public key, and key ID must move together.

## Application Encryption Key

`APP_ENCRYPTION_KEY` protects secrets stored by Auth itself. It must be exactly 32 bytes after normalization because it is used as AES-256 key material.

Auth uses this key for encrypted-at-rest values such as provider credentials, client secrets, webhook signing secrets, TOTP seeds, and stored signing-key material where that path is used.

New encrypted values are written with a key tag:

```text
k1:<key-id>:<ciphertext>
```

The key ID is a short fingerprint derived from the key. It lets Auth choose the correct current or retired key during decryption without storing the key itself.

## Previous Encryption Keys

`APP_ENCRYPTION_KEYS_PREVIOUS` is for decrypt-only retired keys during rotation.

Use it when changing `APP_ENCRYPTION_KEY`:

1. Keep the old `APP_ENCRYPTION_KEY`.
2. Generate a new 32-byte `APP_ENCRYPTION_KEY`.
3. Put the old key into `APP_ENCRYPTION_KEYS_PREVIOUS`.
4. Deploy with both values.
5. Re-encrypt stored secrets so new rows use the new key.
6. Remove the retired key only after no stored encrypted values need it.

Every value in `APP_ENCRYPTION_KEYS_PREVIOUS` must also be exactly 32 bytes. If a tagged value cannot be decrypted by the current or previous keys, Auth fails closed for that value and logs that the encryption key set needs attention.

## HMAC Secret

`HMAC_SECRET_KEY` configures Auth's signed URL signer and signed state helpers.

It is used for:

- Invite registration links.
- Magic-link login links.
- Password reset links.
- Signed login and registration parameters.
- SAML provider state signing.
- Other short-lived URL parameters that must be tamper resistant.

Rotate this key carefully. Links and state values signed with the previous key will stop validating after the new key is deployed. For a clean rotation, wait for outstanding invite, magic-link, and password-reset URLs to expire before removing or replacing the old key in active traffic.

## Control-Plane Bootstrap Token

`SETUP_BOOTSTRAP_TOKEN` is optional and secret-backed. It gates the gRPC setup service used when Auth is provisioned by Core or another control plane.

Standalone Auth usually leaves it unset. In standalone mode, first-time setup is performed through the REST setup wizard.

When control-plane mode is enabled, treat `SETUP_BOOTSTRAP_TOKEN` like a one-deployment bootstrap credential:

- Generate it with strong randomness.
- Provide it only to the orchestrator that performs setup.
- Keep the gRPC setup window bounded with `SETUP_WINDOW_TTL`.
- Do not log it or store it in frontend configuration.

## Local Key Generation

The quickstart setup script generates quickstart secrets:

```bash
cd examples/quickstart
./setup.sh
```

It generates:

- RSA JWT private and public PEM keys.
- A random 32-byte application encryption key.
- A random HMAC key.

The helper stores binary random values with the `base64:` prefix so Auth decodes them before use.

For manual generation, the Auth repository also includes `scripts/generate-jwt-keys.sh`.

Manual shape for a local `.env`:

```env
SECRET_PROVIDER=env
APP_ENCRYPTION_KEY=base64:gynBDhdZQkEO+JBOdiryYBPo5WB/wtU4BzoilY4y1M0=
HMAC_SECRET_KEY=base64:ZD4f9tVsRNMYwasQq+32KRxP3GwH6kM8ZpA/XUjD1lY=
JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
```

## Production Practices

For production deployments:

- Prefer `SECRET_PROVIDER=file`, `aws_secrets`, `aws_ssm`, `vault`, `gcp`, or `azure_kv` over plain environment variables.
- Leave `APP_ENV` unset or set `APP_ENV=production` explicitly so secure-by-default behavior remains active.
- Set `SECRET_STRICT=true` after migration to a secret provider is complete.
- Use HTTPS for Vault and any remote secret-store transport.
- Use provider IAM, Vault policies, or managed identity to restrict Auth to only the secrets it needs.
- Rotate JWT keys deliberately and coordinate across replicas.
- Keep previous application encryption keys until every stored value has been re-encrypted.
- Treat broker URLs, provider credentials, client secrets, webhook signing secrets, and SMS/email credentials as secrets even when they are configured through management APIs instead of environment variables.
- Keep all secret-backed values out of `VITE_*` variables and `/config.js`; those are browser-visible.
