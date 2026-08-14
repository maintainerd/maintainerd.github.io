# Messaging

Messaging covers email and SMS delivery for login, verification, MFA, recovery, invites, and operational identity flows.

## Email

Email configuration is tenant-scoped with system-tenant fallback. Current runtime delivery uses SMTP. Providers such as SES, Mailgun, SendGrid, Postmark, or Resend can be used through their SMTP relay.

Email config includes:

| Field | What It Controls |
|---|---|
| Provider | The SMTP-compatible delivery service used by the tenant. |
| Host | SMTP server hostname. |
| Port | SMTP server port. |
| Username | SMTP authentication username when required. |
| Password | SMTP authentication secret. |
| From address | Email address shown as the sender. |
| From name | Human-readable sender name. |
| Status | Whether email delivery is active for the tenant. |

## SMS

SMS configuration is tenant-scoped with system-tenant fallback.

Supported SMS providers:

| Provider | Use Case |
|---|---|
| `twilio` | SMS delivery through Twilio. |
| `sns` | SMS delivery through AWS SNS. |
| `vonage` | SMS delivery through Vonage. |

SMS config includes:

| Field | What It Controls |
|---|---|
| Provider | The SMS delivery service used by the tenant. |
| Account SID or provider account identifier | Provider account used for delivery. |
| Auth token | Provider authentication secret. |
| From number | Sender phone number or configured sender identity. |
| Status | Whether SMS delivery is active for the tenant. |

## Messaging Actions

| Action | Purpose |
|---|---|
| View email configuration | Shows the tenant's current email provider settings. |
| View email status | Confirms whether email delivery is configured and active. |
| Update email configuration | Changes SMTP provider details, sender details, or status. |
| View SMS configuration | Shows the tenant's current SMS provider settings. |
| View SMS status | Confirms whether SMS delivery is configured and active. |
| Update SMS configuration | Changes SMS provider details, sender details, or status. |

## Used By

| Flow | Messaging Dependency |
|---|---|
| Email verification | Email provider and email template. |
| Forgot password | Email provider and reset template. |
| Magic links | Email provider and magic-link template. |
| Invites | Email provider and invite template. |
| MFA email OTP | Email provider and OTP template. |
| SMS login | SMS provider and SMS template. |
| SMS MFA | SMS provider and SMS template. |
| CIBA and device-flow notifications | Email or SMS provider depending on tenant configuration. |
