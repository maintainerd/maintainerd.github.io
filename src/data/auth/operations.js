// Endpoint details for this Auth API section.

const group = {
  "slug": "operations",
  "label": "Operations",
  "description": "Health, readiness, liveness, OpenAPI, and private metrics endpoints used by load balancers and operators.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/health",
      "summary": "Basic process health check.",
      "surface": "Router root"
    },
    {
      "method": "GET",
      "path": "/healthz",
      "summary": "Kubernetes-style health check alias.",
      "surface": "Router root"
    },
    {
      "method": "GET",
      "path": "/ready",
      "summary": "Readiness probe that checks whether dependencies are available.",
      "surface": "Router root"
    },
    {
      "method": "GET",
      "path": "/readyz",
      "summary": "Kubernetes-style readiness check alias.",
      "surface": "Router root"
    },
    {
      "method": "GET",
      "path": "/livez",
      "summary": "Liveness probe for process supervision.",
      "surface": "Router root"
    },
    {
      "method": "GET",
      "path": "/openapi.json",
      "summary": "Machine-readable OpenAPI document exposed by the Auth service.",
      "surface": "Router root"
    },
    {
      "method": "GET",
      "path": "/metrics",
      "summary": "Prometheus metrics endpoint on the private management router.",
      "surface": "Management router"
    }
  ]
};

export default group;
