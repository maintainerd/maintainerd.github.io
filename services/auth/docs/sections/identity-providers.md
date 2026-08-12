# Identity Providers

Identity providers let Auth accept identities from built-in, social, enterprise, OIDC/OAuth2, and SAML sources.

## Provider Types

- `system`: built-in Maintainerd identity provider.
- `social`: social OAuth/OIDC providers.
- `enterprise`: enterprise OIDC/OAuth2 providers.
- `saml`: SAML identity providers.

## Provider Keys Exposed In Console

- `maintainerd`
- `saml`
- `cognito`
- `auth0`
- `google`
- `facebook`
- `github`
- `gitlab`
- `microsoft`
- `linkedin`
- `twitter`

## OIDC/OAuth2 Provider Configuration

- Issuer.
- Provider client ID.
- Provider client secret.
- Scopes.
- Attribute mapping.
- UserInfo endpoint.
- Authorization endpoint.
- Token endpoint.
- Allowed audiences.
- Email domains for home-realm discovery.
- JIT provisioning toggle.
- Token federation toggle.

## SAML Provider Configuration

- Entity ID.
- SSO URL.
- Optional SLO URL.
- Signing certificate.
- NameID format.
- Attribute mapping.
- Service-provider metadata URL.
- Assertion Consumer Service URL.

## User Journeys

- Home-realm discovery chooses a provider from the user's email domain.
- OAuth2 callback exchanges an upstream authorization code.
- SAML ACS receives the upstream SAML response.
- Account-link flows attach an upstream identity to an existing Auth user.

## Per-Client Login Options

Identity providers are tenant resources, but login options are exposed through a client-aware connections lookup. Attach a provider to the target OAuth client when it should appear for that app's hosted login journey.
