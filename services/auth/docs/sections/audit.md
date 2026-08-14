# Auth Events

Auth events are tenant-scoped security records written by Auth when authentication, authorization, session, user, OAuth, MFA, token, and audit-trail access activity happens.

Use this section when an administrator or developer needs to understand what Auth records, how to read those records in the console, which filters are available, what each event type means, and how retention works.

Auth events are different from [Events & webhooks](#events-webhooks). Auth events are for security review, monitoring, investigation, and compliance evidence inside Auth. Events and webhooks are for notifying external applications that Auth state changed.

## What Auth Events Are For

Auth events answer security and operational questions such as:

- Did this user successfully log in?
- Why did a login fail?
- Was MFA enrolled, skipped by trusted device, or required again?
- Was a token created, refreshed, reused, revoked, or deleted?
- Did OAuth consent succeed, fail, get denied, or get revoked?
- Did a role, policy, or permission change affect authorization?
- Did a user get locked out after repeated failures?
- Did an administrator export the auth-event audit trail?
- Which IP address, user agent, request trace, or timestamp belongs to the event?

Auth events are append-only records. Ordinary application code should not update or delete them. Cleanup happens through retention or tenant deletion.

## Where To Find It

In the console, select the tenant you want to review, then open **Auth events** from the operations or monitoring area.

The Auth events area should provide:

- Event list: a tenant-scoped list of auth events.
- Event filters: category, event type, severity, result, date range, user, and IP address.
- Event detail: one event with metadata, description, error reason, trace ID, IP address, and user agent.
- Event count by type: a quick count for a selected event type.
- Export: JSON or CSV export for investigation and compliance workflows.
- Retention view: the tenant's configured audit retention and masking behavior when exposed in tenant settings.

Typical review flow:

1. Select the correct tenant first. Auth events are tenant-scoped, so the same user or client activity in another tenant appears in that tenant's own event list.
2. Start with a narrow date range. For incidents, use the time reported by the user, alert, or upstream application.
3. Filter by category and result. For example, use `AUTHN` plus `failure` when investigating login problems.
4. Add the event type when the failure area is known. For example, use `authn_oauth_client_auth_fail` when an OAuth client cannot authenticate.
5. Open the event detail and correlate `trace_id`, `ip_address`, `user_agent`, timestamp, and metadata with application logs.
6. Export only after the view is narrowed to the evidence you need.

## Permissions

Reading Auth events requires:

| Permission | Allows |
|---|---|
| `auth_event:read` | List auth events, view event details, count events by type, and export auth events. |

The caller must also be operating inside the tenant being reviewed. Auth events are not a global cross-tenant feed in the normal console workflow.

Grant this permission carefully. Auth events can contain security-sensitive context such as IP addresses, user agents, error reasons, trace IDs, and selected metadata. A support operator may need read access for troubleshooting, but broad export access should be limited to trusted administrators and compliance workflows.

This permission does not grant access to management audit logs. Management audit-log access is a separate administrative concern covered by `audit:read`.

## Auth Event Record Fields

Each Auth event record describes one security-relevant occurrence.

| Field | Meaning |
|---|---|
| `auth_event_id` | Public UUID for the auth event. Use it when referencing a specific event in the console or exports. |
| `ip_address` | Client IP address resolved by Auth. Trusted proxy configuration affects this value. |
| `user_agent` | User agent string when the request provides one. |
| `category` | High-level event category, such as `AUTHN`, `AUTHZ`, `SESSION`, `USER`, or `SYSTEM`. |
| `event_type` | Specific event name, such as `authn_login_success` or `authn_oauth_token_exchange`. |
| `severity` | Event severity: `INFO`, `WARN`, or `CRITICAL`. |
| `result` | Outcome: `success` or `failure`. |
| `description` | Human-readable context for the event when available. |
| `error_reason` | Failure reason when available. |
| `trace_id` | Trace correlation value for connecting the auth event to logs and telemetry. |
| `metadata` | Structured context for investigation. This should not be treated as an authorization source. |
| `created_at` | Time Auth recorded the event. |

Internal database IDs are not exposed in Auth event responses. Actor and target user relationships are stored internally for tenant-scoped lookup, but external responses use the auth event UUID and contextual fields rather than leaking integer primary keys.

## Categories

Categories group related event types.

| Category | Meaning | Common Use |
|---|---|---|
| `AUTHN` | Authentication, MFA, OAuth, token, and login behavior. | Login investigation, account takeover review, token abuse review. |
| `AUTHZ` | Authorization checks and authorization model changes. | Permission debugging, policy review, access denial investigation. |
| `SESSION` | Session lifecycle and session misuse. | Session review, timeout behavior, suspicious expired-session usage. |
| `USER` | User lifecycle changes. | Account lifecycle auditing and user administration review. |
| `SYSTEM` | System-level security events and audit-trail access. | Startup/shutdown review, maintenance changes, audit export tracking. |

## Severity And Result

Severity describes how important the event is for review.

| Severity | Meaning |
|---|---|
| `INFO` | Normal security-relevant activity, such as successful login, token creation, or expected administrative activity. |
| `WARN` | Suspicious, failed, or policy-relevant activity that may require review. |
| `CRITICAL` | High-risk activity that should be reviewed quickly, such as token reuse, severe MFA conditions, or other critical security signals. |

Result describes whether the action succeeded.

| Result | Meaning |
|---|---|
| `success` | The action completed successfully. |
| `failure` | The action failed, was denied, or could not be completed. |

Use severity and result together. A failed login may be expected noise, but repeated failures, max-failure events, lockout, impossible travel, or token reuse should be treated as stronger signals.

## Complete Auth Event Catalog

These are the Auth event types defined by Auth. Some events are emitted only when the corresponding feature is used.

### Authentication And MFA

| Event Type | Category | Typical Severity | Result | What It Means |
|---|---|---|---|---|
| `authn_login_success` | `AUTHN` | `INFO` | `success` | A user successfully authenticated. |
| `authn_login_fail` | `AUTHN` | `WARN` | `failure` | A login attempt failed. |
| `authn_login_fail_max` | `AUTHN` | `WARN` or `CRITICAL` | `failure` | A user reached the maximum failed-login threshold. |
| `authn_login_lock` | `AUTHN` | `WARN` or `CRITICAL` | `failure` | Auth locked or restricted login because of policy or repeated failures. |
| `authn_login_successafterfail` | `AUTHN` | `INFO` or `WARN` | `success` | A login succeeded after prior failures. Review when investigating suspicious login patterns. |
| `authn_mfa_enrolled` | `AUTHN` | `INFO` | `success` | A user enrolled an MFA method. |
| `authn_mfa_trusted_device_trust` | `AUTHN` | `INFO` | `success` | A trusted device was established for MFA step-down. |
| `authn_mfa_trusted_device_skip` | `AUTHN` | `INFO` | `success` | MFA was skipped because a trusted device was accepted. |
| `authn_password_change` | `AUTHN` | `INFO` | `success` | A password was changed. |
| `authn_password_change_fail` | `AUTHN` | `WARN` | `failure` | A password change failed. |
| `authn_new_device` | `AUTHN` | `WARN` | `success` | Auth detected authentication from a new device. |
| `authn_impossible_travel` | `AUTHN` | `CRITICAL` | `failure` or `success` | Auth detected an impossible-travel signal. Review the account immediately. |

### Token Events

| Event Type | Category | Typical Severity | Result | What It Means |
|---|---|---|---|---|
| `authn_token_created` | `AUTHN` | `INFO` | `success` | Auth issued or created token material. |
| `authn_token_revoked` | `AUTHN` | `INFO` or `WARN` | `success` | Token material was revoked. |
| `authn_token_reuse` | `AUTHN` | `CRITICAL` | `failure` | Auth detected token reuse. Treat this as a strong compromise signal. |
| `authn_token_delete` | `AUTHN` | `INFO` | `success` | Token material was deleted or cleaned up. |

### OAuth And OIDC Events

| Event Type | Category | Typical Severity | Result | What It Means |
|---|---|---|---|---|
| `authn_oauth_authorize` | `AUTHN` | `INFO` | `success` or `failure` | An OAuth authorization request was processed. |
| `authn_oauth_consent` | `AUTHN` | `INFO` | `success` | A user granted consent to a client. |
| `authn_oauth_consent_deny` | `AUTHN` | `INFO` | `failure` | A user denied consent to a client. |
| `authn_oauth_consent_revoke` | `AUTHN` | `INFO` | `success` | A consent grant was revoked. |
| `authn_oauth_token_exchange` | `AUTHN` | `INFO` | `success` or `failure` | An OAuth code or grant was exchanged for tokens. |
| `authn_oauth_token_refresh` | `AUTHN` | `INFO` | `success` or `failure` | A refresh-token flow was processed. |
| `authn_oauth_token_revoke` | `AUTHN` | `INFO` | `success` or `failure` | An OAuth token revocation request was processed. |
| `authn_oauth_client_auth` | `AUTHN` | `INFO` | `success` | A confidential client authenticated successfully. |
| `authn_oauth_client_auth_fail` | `AUTHN` | `WARN` | `failure` | Client authentication failed. Review client credentials and suspicious client activity. |

### Authorization Events

| Event Type | Category | Typical Severity | Result | What It Means |
|---|---|---|---|---|
| `authz_fail` | `AUTHZ` | `WARN` | `failure` | A user, client, or service was denied an authorization decision. |
| `authz_change` | `AUTHZ` | `INFO` | `success` | Authorization data changed. |
| `authz_admin` | `AUTHZ` | `INFO` or `WARN` | `success` | An administrator performed authorization-related work. |
| `iam.policy.updated` | `AUTHZ` | `INFO` | `success` | An IAM policy was updated. |
| `iam.service.policy.assigned` | `AUTHZ` | `INFO` | `success` | A policy was assigned to a service. |
| `iam.service.policy.removed` | `AUTHZ` | `INFO` | `success` | A policy was removed from a service. |
| `privilege_permissions_changed` | `AUTHZ` | `INFO` or `WARN` | `success` | Permission or privilege assignments changed. |

### Session Events

| Event Type | Category | Typical Severity | Result | What It Means |
|---|---|---|---|---|
| `session_created` | `SESSION` | `INFO` | `success` | A session was created. |
| `session_renewed` | `SESSION` | `INFO` | `success` | A session was renewed. |
| `session_expired` | `SESSION` | `INFO` | `success` | A session expired. |
| `session_use_after_expire` | `SESSION` | `WARN` | `failure` | An expired session was used. Review for stale clients or suspicious reuse. |

### User Events

| Event Type | Category | Typical Severity | Result | What It Means |
|---|---|---|---|---|
| `user_created` | `USER` | `INFO` | `success` | A user was created. |
| `user_updated` | `USER` | `INFO` | `success` | User data changed. |
| `user_archived` | `USER` | `INFO` | `success` | A user was archived. |
| `user_deleted` | `USER` | `WARN` | `success` | A user was deleted. Review when deletion is unexpected. |

### System Events

| Event Type | Category | Typical Severity | Result | What It Means |
|---|---|---|---|---|
| `system_audit_export` | `SYSTEM` | `INFO` | `success` | A user exported Auth events. Exporting the audit trail is itself recorded. |
| `sys_startup` | `SYSTEM` | `INFO` | `success` | Auth started. |
| `sys_shutdown` | `SYSTEM` | `INFO` | `success` | Auth shut down normally. |
| `sys_crash` | `SYSTEM` | `CRITICAL` | `failure` | Auth crashed. |
| `sys_maintenance_config_updated` | `SYSTEM` | `INFO` or `WARN` | `success` | Maintenance configuration changed. |

## Console Filters

Use filters to narrow the event list before reviewing or exporting.

| Filter | Meaning |
|---|---|
| Category | Limits results to `AUTHN`, `AUTHZ`, `SESSION`, `USER`, or `SYSTEM`. |
| Event type | Limits results by event type. Event type filtering supports prefix-style matching, so a value such as `authn_oauth` can be used to review OAuth-related Auth events when the console exposes free-text filtering. |
| Severity | Limits results to `INFO`, `WARN`, or `CRITICAL`. |
| Result | Limits results to `success` or `failure`. |
| Date from | Includes events at or after the selected timestamp. |
| Date to | Includes events at or before the selected timestamp. |
| User | Limits results to events related to the selected user when supported by the view. |
| IP address | Limits results to a client IP address. IP filtering supports prefix-style matching for investigation workflows. |
| Sort | Sorts by allowed event fields. Newest-first is the normal investigation view. |
| Page and limit | Controls pagination. Normal list pages are capped at 100 rows. |

When filtering by user, Auth matches events where the selected user is either the actor or the target of the event. This matters for administrative actions where one user performs an action affecting another user.

Good investigation filters:

- Failed login review: category `AUTHN`, event type `authn_login_fail`, result `failure`.
- Lockout review: event type `authn_login_lock` or `authn_login_fail_max`.
- Token compromise review: event type `authn_token_reuse`.
- OAuth client review: event type `authn_oauth_client_auth_fail` or `authn_oauth_token_exchange`.
- Authorization denial review: category `AUTHZ`, event type `authz_fail`.
- Audit-trail access review: category `SYSTEM`, event type `system_audit_export`.

## Export

Auth events can be exported for investigation and compliance workflows.

Available export formats:

| Format | Use |
|---|---|
| JSON | Preserve structured metadata for deeper investigation or archival. |
| CSV | Review in spreadsheet tools or attach to compliance evidence. |

Exports use the same tenant scope and filters as the event list. Export is capped at 10,000 rows so the console can produce evidence without turning Auth into an unbounded bulk data pipeline.

Exporting Auth events creates a new `system_audit_export` Auth event. This means access to the audit trail is itself visible in the audit trail.

## Retention And Audit Configuration

Auth event persistence is controlled by tenant audit configuration.

| Setting | Meaning |
|---|---|
| Enabled | Turns Auth event persistence on or off for the tenant. Metrics can still count event activity even when persistence is skipped. |
| Retention days | Controls how long Auth events are retained before cleanup. |
| PII masking | Redacts sensitive values in descriptions, error reasons, and metadata before persistence. |
| Log level | Minimum severity stored for the tenant. For example, `warn` stores `WARN` and `CRITICAL` but skips `INFO`. |
| Event types | Optional allowlist of event types to persist. Empty means all event types are allowed. |

Default tenant audit configuration enables Auth event persistence, masks PII, and uses a retention period of 90 days. Legacy fallback behavior uses 365 days when tenant audit settings are unavailable.

Retention runs in the background. It deletes expired Auth events and drops expired partitions when partition cleanup is available. Deletion is not an ordinary user action; Auth events are otherwise append-only.

## Auth Events And Metrics

Auth records operational metrics for auth-event activity even when audit configuration chooses not to persist a specific event. This lets dashboards show true login, token, OAuth, MFA, and authorization event rates while tenant settings control the stored audit trail.

Use metrics for rate and alerting. Use Auth events for investigation detail.

## Auth Events Vs Management Audit Logs

Auth events focus on identity and security behavior: login, token, MFA, OAuth, authorization, session, user, and audit-trail access activity.

Management audit logs focus on administrative activity from the console and internal management APIs: who changed configuration, which resource was changed, and when the management action happened.

Use both during incidents:

1. Start with Auth events to understand authentication, authorization, session, token, and security signals.
2. Use management audit logs to identify administrative changes that may explain the behavior.
3. Correlate both with request IDs, trace IDs, infrastructure logs, and application logs.

## Operational Guidance

Review Auth events when:

- A user reports login problems.
- A tenant reports unexpected access denial.
- A token or session appears reused.
- A user is locked out.
- MFA behaves unexpectedly.
- OAuth consent or token exchange fails.
- A client authentication failure appears.
- An administrator exports the audit trail.
- Security automation flags new-device or impossible-travel behavior.

Monitor and alert on:

- Spikes in `authn_login_fail`.
- Any `authn_token_reuse`.
- Repeated `authn_oauth_client_auth_fail`.
- `authn_login_fail_max` and `authn_login_lock`.
- `session_use_after_expire`.
- `authz_fail` spikes for protected APIs.
- `system_audit_export` outside expected compliance workflows.
- Audit write failures in service logs or metrics.

## Troubleshooting

No Auth events appear: check tenant audit configuration, enabled status, event type allowlist, log level, retention, tenant selection, and whether the activity occurred after the current filters' date range.

Expected events are missing: confirm the feature path logs that event type, confirm the event severity is allowed by the tenant log level, and confirm the event type is not excluded by the tenant event-type allowlist.

Too many events appear: narrow filters by category, event type, result, IP address, user, and date range. Consider tenant audit configuration if noisy event types are not needed for compliance.

Export is too large: narrow the date range and event type before exporting.

IP address looks wrong: review trusted proxy and client IP configuration in [Deployment](#deployment), because proxy settings affect Auth events, rate limits, and abuse detection.

Trace correlation is missing: confirm request tracing is enabled and that the event was recorded inside a traced request path.
