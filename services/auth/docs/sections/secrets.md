# Secrets & Keys

Secrets and keys protect Auth's database access, token signing, encrypted storage, signed links, provider credentials, and setup trust. They are operationally sensitive and should be managed deliberately.

## Where To Configure Them

Configure secrets in the secret provider selected for the Auth deployment:

- Local environment for development.
- Container file secrets.
- AWS Secrets Manager or SSM Parameter Store.
- HashiCorp Vault.
- GCP Secret Manager.
- Azure Key Vault.
- Maintainerd control-plane secret configuration when available.

The console should never show raw secret values. It may show whether required secrets are present, which provider is selected, key IDs, rotation status, and validation errors.

## Required Secrets

`DB_PASSWORD` lets Auth connect to PostgreSQL. Without it, Auth cannot load durable identity state.

`JWT_PRIVATE_KEY` signs access tokens, ID tokens, and other JWTs. It must remain private.

`JWT_PUBLIC_KEY` verifies tokens and is published through JWKS. It must match the private key.

`APP_ENCRYPTION_KEY` encrypts sensitive stored values such as provider credentials, client secrets, webhook signing secrets, TOTP seeds, and stored signing-key material. It must be exactly the required key size after normalization.

`HMAC_SECRET_KEY` signs short-lived links and state values such as invites, magic links, password reset links, SAML state, and other tamper-resistant URL values.

## Optional Secrets

`REDIS_PASSWORD` is required only when Redis AUTH is enabled.

`APP_ENCRYPTION_KEYS_PREVIOUS` stores retired decrypt-only encryption keys during key rotation.

`SETUP_BOOTSTRAP_TOKEN` gates orchestrated gRPC setup when Auth is provisioned by Core or another control plane.

Broker URLs, provider client secrets, webhook signing secrets, email credentials, and SMS credentials should also be treated as secrets even when they are configured through console screens instead of startup environment.

## Secret Provider Fields

`SECRET_PROVIDER` selects the active secret source.

`SECRET_PREFIX` scopes names in providers that support a path or namespace.

`SECRET_STRICT` decides whether missing provider values can fall back to process environment variables. Use relaxed behavior while migrating. Use strict behavior once production secrets are fully in the provider.

Provider-specific fields tell Auth how to reach the selected backend, such as AWS region, Vault address, Vault AppRole values, GCP project, or Azure Key Vault URL.

## How Values Are Interpreted

Auth normalizes secret values consistently:

- Leading and trailing whitespace is trimmed.
- Values with a base64 marker are decoded before validation.
- Required secrets fail startup when empty.
- Key material is validated before Auth serves traffic.

This lets operators store binary-safe values in providers that only accept strings.

## JWT Signing Keys

JWT signing keys prove that tokens came from Auth. Applications and services verify tokens using the public key published through JWKS.

Important fields:

- Private key: signs tokens and must never leave the server side.
- Public key: verifies tokens and may be distributed through JWKS.
- Key ID: identifies the active key to token consumers.
- Rotation period: controls background refresh behavior where configured.

Rotate JWT keys carefully. Every replica must agree on active key material, and token consumers need time to refresh JWKS before old tokens expire.

## Application Encryption Key

The application encryption key protects secrets stored by Auth itself. If this key is lost, encrypted provider credentials and other protected records may become unreadable.

Use previous encryption keys during rotation. The new key writes new encrypted values. Previous keys let Auth read older values until they are re-encrypted.

Do not remove previous keys until you know no stored values still need them.

## HMAC Secret

The HMAC secret protects signed links and signed state. Rotating it invalidates outstanding signed URLs and browser state values.

Plan HMAC rotation around link lifetimes. Wait for old invite links, magic links, password reset links, and signed login state to expire before removing old behavior.

## Bootstrap Token

The setup bootstrap token is only for orchestrated setup. It should be temporary, high-entropy, and available only to the control plane or setup automation.

Standalone deployments normally use the setup wizard and do not need a bootstrap token.

## Rotation Workflow

1. Generate the new secret or key with strong randomness.
2. Add it to the configured secret provider.
3. Keep any required previous key available for read or validation windows.
4. Deploy all replicas with the same provider state.
5. Confirm readiness, signing, encryption, and login behavior.
6. Re-encrypt data or wait for old tokens and links to expire where required.
7. Remove retired material only after it is no longer needed.

## Permissions And Security

Only deployment operators or owner-level administrators should manage startup secrets and key rotation.

Protect secrets from:

- Source control.
- Browser-visible frontend configuration.
- Container image layers.
- Build logs.
- Runtime logs.
- Issue trackers and chat tools.
- Screenshots of production settings.

## Troubleshooting

If Auth fails startup with a missing secret, check the selected provider, prefix, strict mode, provider credentials, and secret name mapping.

If tokens cannot be verified, check that the private key, public key, and key ID match across replicas.

If encrypted provider settings cannot be read, check the current and previous application encryption keys.

If invite, reset, or magic links suddenly fail, check HMAC secret rotation and link expiration windows.
