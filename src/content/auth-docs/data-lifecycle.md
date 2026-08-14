# Data Lifecycle

Auth owns account data, security state, session state, audit trails, auth events, webhook delivery state, and erasure workflows.

## Account Data

The identity surface includes account data export, profile management, email and username changes, password changes, session management, trusted-device management, linked identities, consents, and account deletion.

Account-management state-changing routes are first-party only and cookie-authenticated routes also use CSRF protection.

## Erasure

Auth supports both:

- Self-service erasure requests from the identity app.
- Admin-created erasure requests from the management API.

The erasure worker processes due requests and anonymizes user data across identities, MFA factors, trusted devices, tokens, sessions, and related account records. Self-service account deletion uses the same anonymization path as admin erasure.

## Retention

Auth has retention workers for auth events and tenant data. OAuth cleanup removes expired short-lived rows such as authorization codes, device/CIBA state, DPoP nonces, challenges, and temporary token material.

## Audit And Traceability

Management audit logs, auth events, webhook delivery history, request IDs, and trace IDs are part of the lifecycle story. Use them together when documenting incident investigation, user lifecycle reviews, and compliance evidence.
