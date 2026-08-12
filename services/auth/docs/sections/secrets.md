# Secrets & Keys

Auth uses a secret manager abstraction so sensitive values can come from environment variables, files, cloud secret stores, or Vault.

## Secret Provider Selection

- `SECRET_PROVIDER`: defaults to `env`.
- `SECRET_PREFIX`: defaults to `maintainerd/auth`.
- `SECRET_STRICT`: controls strict provider behavior.

## Supported Providers

- `env`: reads secrets directly from environment variables.
- `file`: reads secrets from local files or Docker secrets.
- `aws_ssm`: reads from AWS SSM Parameter Store.
- `aws_secrets`: reads from AWS Secrets Manager.
- `vault`: reads from HashiCorp Vault KV.
- `azure`: reads from Azure Key Vault.
- `gcp`: reads from GCP Secret Manager.

## Provider Configuration

- `SECRET_FILE_PATH`: defaults to `/run/secrets`.
- `AWS_REGION`: defaults to `us-east-1` for AWS providers.
- `VAULT_ADDR`: Vault address.
- `VAULT_TOKEN`: Vault token.
- `VAULT_MOUNT`: defaults to `secret`.
- `VAULT_SECRET_FIELD`: defaults to `value`.
- `VAULT_ROLE_ID` and `VAULT_SECRET_ID`: AppRole inputs when used.

## Key Responsibilities

- JWT keys sign and verify access tokens and OIDC ID tokens.
- Application encryption keys protect stored provider secrets and messaging credentials.
- HMAC secret signs short-lived URLs and links.
- Retired encryption keys allow old ciphertext to remain readable after rotation.
