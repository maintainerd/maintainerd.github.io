// Endpoint details for this Auth API section.

const root = "Router root";
const management = "Management router";

const jsonAcceptHeader = {
  "name": "Accept",
  "value": "application/json",
  "required": false,
  "description": "Use when the caller wants the JSON probe or discovery response explicitly."
};

const metricsAcceptHeader = {
  "name": "Accept",
  "value": "text/plain",
  "required": false,
  "description": "Prometheus scrapers normally omit this header; text output is returned by the Prometheus handler."
};

const noAuthHeader = {
  "name": "Authorization",
  "value": "Not required",
  "required": false,
  "description": "These routes do not perform application-level bearer-token checks. Restrict private operational surfaces at the load balancer, ingress, firewall, VPN, or service mesh."
};

const emptyBody = {
  "type": "None",
  "description": "This endpoint does not accept a request body.",
  "fields": [],
  "example": null
};

const healthOk = {
  "status": "ok"
};

const readyOk = {
  "status": "ready",
  "version": "1.0.0",
  "dependency": {
    "database": "ok",
    "redis": "ok",
    "jwks": "ok"
  }
};

const readyUnavailable = {
  "status": "not ready",
  "version": "1.0.0",
  "dependency": {
    "database": "unreachable",
    "redis": "ok",
    "jwks": "ok"
  }
};

const liveOk = {
  "status": "ok",
  "version": "1.0.0"
};

const openApiExample = {
  "openapi": "3.1.0",
  "info": {
    "title": "maintainerd-auth",
    "version": "1.0.0"
  },
  "paths": {
    "/health": {},
    "/api/v1/oauth/token": {}
  }
};

const metricsExample = `# HELP build_info Build information about the running service
# TYPE build_info gauge
build_info{service="maintainerd-auth",version="1.0.0"} 1
# HELP auth_events_total Count of authentication/authorization events by category, type, and result
# TYPE auth_events_total counter
auth_events_total{category="AUTHN",event_type="authn_login_success",result="success"} 42`;

const jsonProbeResponses = [
  {
    "status": "200 OK",
    "description": "The process accepted the probe request.",
    "example": healthOk
  }
];

const healthDetails = {
  "overview": "Returns a lightweight process-health response. Use this endpoint when an ingress, load balancer, or monitor only needs to know that the HTTP process is running and responding.",
  "notes": [
    "The handler does not check PostgreSQL, Redis, signing keys, tenants, or other dependencies.",
    "It is mounted on the internal, public, and management routers.",
    "Use readiness endpoints when a caller needs to know whether the service can safely receive traffic."
  ],
  "headers": [jsonAcceptHeader, noAuthHeader],
  "requestBody": emptyBody,
  "responses": jsonProbeResponses
};

const readyDetails = {
  "overview": "Checks whether the instance is ready to serve traffic by validating core runtime dependencies.",
  "notes": [
    "The readiness check pings PostgreSQL, pings Redis when Redis is configured, and confirms the JWKS public key is loaded.",
    "Redis reports not configured without failing readiness when Redis is intentionally absent.",
    "Use this endpoint for load-balancer readiness checks and Kubernetes readiness probes."
  ],
  "headers": [jsonAcceptHeader, noAuthHeader],
  "requestBody": emptyBody,
  "responses": [
    {
      "status": "200 OK",
      "description": "All required dependencies are available and the service is ready.",
      "example": readyOk
    },
    {
      "status": "503 Service Unavailable",
      "description": "At least one required dependency is unavailable, unreachable, or not loaded.",
      "example": readyUnavailable
    }
  ]
};

const group = {
  "slug": "operations",
  "label": "Operations",
  "description": "Health, readiness, liveness, OpenAPI, and private metrics endpoints used by load balancers and operators.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/health",
      "summary": "Basic process health check.",
      "surface": root,
      "details": healthDetails
    },
    {
      "method": "GET",
      "path": "/healthz",
      "summary": "Kubernetes-style health check alias.",
      "surface": root,
      "details": {
        ...healthDetails,
        "overview": "Alias of /health for platforms that expect a healthz-style probe path.",
        "notes": [
          "The response body and status behavior match /health.",
          "The handler does not check dependency readiness.",
          "It is mounted on the internal, public, and management routers."
        ]
      }
    },
    {
      "method": "GET",
      "path": "/ready",
      "summary": "Readiness probe that checks whether dependencies are available.",
      "surface": root,
      "details": readyDetails
    },
    {
      "method": "GET",
      "path": "/readyz",
      "summary": "Kubernetes-style readiness check alias.",
      "surface": root,
      "details": {
        ...readyDetails,
        "overview": "Alias of /ready for platforms that expect a readyz-style probe path.",
        "notes": [
          "The response body and status behavior match /ready.",
          "Use this for Kubernetes readiness probes when the deployment convention prefers readyz.",
          "It is mounted on the internal, public, and management routers."
        ]
      }
    },
    {
      "method": "GET",
      "path": "/livez",
      "summary": "Liveness probe for process supervision.",
      "surface": root,
      "details": {
        "overview": "Returns a liveness response for process supervisors that need to know whether the service process is alive.",
        "notes": [
          "The response includes the application version.",
          "The handler does not check dependency readiness. Use /ready or /readyz for dependency-aware traffic routing.",
          "It is mounted on the internal, public, and management routers."
        ],
        "headers": [jsonAcceptHeader, noAuthHeader],
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The process is alive and responding.",
            "example": liveOk
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/openapi.json",
      "summary": "Machine-readable OpenAPI document exposed by the Auth service.",
      "surface": root,
      "details": {
        "overview": "Serves the embedded OpenAPI 3.1 document as JSON. Use this endpoint for generated clients, API explorers, documentation tooling, contract checks, and integration discovery.",
        "notes": [
          "The OpenAPI source is embedded into the Auth service image, so the runtime does not need filesystem access to serve it.",
          "The response uses Cache-Control: public, max-age=3600.",
          "It is mounted on the internal, public, and management routers."
        ],
        "headers": [jsonAcceptHeader, noAuthHeader],
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The OpenAPI document was encoded and returned as JSON.",
            "example": openApiExample
          },
          {
            "status": "500 Internal Server Error",
            "description": "The embedded OpenAPI document could not be parsed from YAML or encoded as JSON.",
            "example": "openapi spec parse error"
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/metrics",
      "summary": "Prometheus metrics endpoint on the private management router.",
      "surface": management,
      "details": {
        "overview": "Exposes Prometheus-format metrics for scraping by Prometheus, Grafana Alloy, OpenTelemetry Collector, or another private metrics collector.",
        "notes": [
          "This endpoint is mounted only on the management router and should be reachable only from trusted monitoring infrastructure.",
          "Metrics include Go/runtime series, HTTP instrumentation, build_info, auth_events_total, security_denials_total, and audit_write_failures_total when those counters have emitted data.",
          "Do not expose this path publicly. Protect it with private networking, firewall rules, ingress allowlists, VPN, or service-mesh policy."
        ],
        "headers": [metricsAcceptHeader, noAuthHeader],
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "Prometheus metrics were returned as text.",
            "example": metricsExample
          }
        ]
      }
    }
  ]
};

export default group;
