# Transport Security

Auth uses different transport rules for public browser flows, internal management traffic, gRPC, and sender-constrained OAuth tokens.

## Public And Internal HTTP

Terminate TLS at the edge for public browser traffic. Keep the internal management API and management port private. Cookie security is controlled with:

- `COOKIE_SECURE`
- `COOKIE_SAMESITE`
- `COOKIE_DOMAIN`

Cookie-authenticated state-changing routes use CSRF protection. Bearer and DPoP tokens are explicit credentials and are not treated as ambient browser cookies.

## gRPC TLS

Production gRPC requires TLS certificate and key configuration. A non-control-plane gRPC listener can require mTLS with `GRPC_REQUIRE_MTLS=true`.

Control-plane mode always requires mTLS. When `CONTROL_PLANE_ENABLED=true`, Auth refuses to start unless these are valid:

- `GRPC_TLS_CERT_FILE`
- `GRPC_TLS_KEY_FILE`
- `GRPC_CLIENT_CA_FILE`

`GRPC_REQUIRE_MTLS=false` cannot downgrade a control-plane instance.

## Certificate-Bound Tokens

gRPC can enforce certificate-bound access tokens for registered clients. When a client has a certificate thumbprint, the caller must present the matching verified client certificate on the mTLS connection.

## DPoP

HTTP OAuth/resource paths support DPoP sender-constrained tokens. Clients can require DPoP, token responses can carry `token_type=DPoP`, access tokens carry `cnf.jkt`, refresh tokens preserve the DPoP key binding, and required clients use server-issued single-use `DPoP-Nonce` values.

DPoP-bound access tokens are refused over gRPC because a DPoP proof is bound to an HTTP method and URL, not to a gRPC method.
