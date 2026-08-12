# Messaging

Messaging covers email and SMS delivery for login, verification, MFA, recovery, invites, and operational identity flows.

## Email

Email configuration is tenant-scoped with system-tenant fallback. Current runtime delivery uses SMTP. Providers such as SES, Mailgun, SendGrid, Postmark, or Resend can be used through their SMTP relay.

Email config includes:

- Provider.
- Host.
- Port.
- Username.
- Password.
- From address.
- From name.
- Status.

## SMS

SMS configuration is tenant-scoped with system-tenant fallback.

Supported SMS providers:

- `log`: development/no-op style provider that writes SMS messages to logs.
- `twilio`.
- `sns`.
- `vonage`.

SMS config includes:

- Provider.
- Account SID or provider account identifier.
- Auth token.
- From number.
- Status.

## Messaging Routes

- Read email configuration.
- Read email configuration status.
- Update email configuration.
- Read SMS configuration.
- Read SMS configuration status.
- Update SMS configuration.

## Used By

- Email verification.
- Forgot password.
- Magic links.
- Invites.
- MFA email OTP.
- SMS login.
- SMS MFA.
- CIBA and device-flow notifications.
