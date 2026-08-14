# Observability

Auth exposes logs, traces, metrics, probes, and event streams for operations.

## Health And Readiness

- `/health`
- `/healthz`
- `/ready`
- `/readyz`
- `/livez`

These aliases are available on the public, internal, and management routers where mounted.

## Metrics

Prometheus metrics are served from the management surface at `/metrics`.

Important built-in metric families include:

- `build_info`: version and build metadata.
- `auth_events_total`: authentication and authorization event counter.
- `security_denials_total`: rate-limit, permission, and IP-denial counter.
- `audit_write_failures_total`: management audit write failure counter.

## OpenTelemetry

Set `OTEL_ENABLED=true` to enable tracing and OTLP log export. Auth uses standard `OTEL_*` environment variables for exporter endpoint, headers, TLS, and related OpenTelemetry SDK behavior.

Common values:

- `OTEL_ENABLED`
- `OTEL_SERVICE_NAME`
- `OTEL_EXPORTER_OTLP_ENDPOINT`
- `OTEL_EXPORTER_OTLP_HEADERS`

## Logs

Auth uses structured logging and includes request/security context where available. When OpenTelemetry is enabled, logs can be exported over OTLP.

## Correlation

Use request IDs, trace IDs, span IDs, auth events, and management audit records together when investigating identity or authorization behavior.

## Operational Workers

Auth event retention, tenant retention, OAuth cleanup, data erasure, auth-event partition management, signing-key rotation, secret refresh, and optional gRPC serving all run from the same process lifecycle. Worker errors are emitted through structured logs and, when enabled, OpenTelemetry log export.
