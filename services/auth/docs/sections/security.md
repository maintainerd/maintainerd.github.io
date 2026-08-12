# Security Controls

Security controls are configured by operators and enforced by backend middleware, account flows, OAuth flows, and management routes.

## Console Security Sections

- MFA configuration.
- Password policy configuration.
- Session management configuration.
- Token configuration.
- Lockout configuration.
- Registration configuration.
- Threat controls.

## Runtime Enforcement

- Public IP rate limiting.
- Stricter credential-endpoint rate limiting.
- Tenant request rate limiting.
- Tenant maintenance gate.
- Tenant status gate.
- IP restriction rules.
- CSRF protection for cookie-authenticated state-changing account routes.
- First-party client requirement for account-management routes.
- Management-client requirement for the internal API.
- gRPC system-instance gate for Core provisioning RPCs.
- mTLS requirement for the control plane.
- DPoP sender-constrained access-token enforcement on HTTP resource routes.
- Certificate-bound access-token enforcement for configured gRPC clients.
- Request size limits.
- Request timeouts.
- CORS allow-list enforcement.
- Security headers.

## Sensitive Actions

Sensitive administrative and account actions require step-up when the current policy requires stronger proof.
