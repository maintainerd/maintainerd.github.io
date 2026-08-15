// Endpoint details for this Auth API section.

const group = {
  "slug": "tenant-discovery",
  "label": "Tenant Discovery",
  "description": "Unauthenticated tenant lookup endpoints used by the identity app and console to resolve tenant context before authentication.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/tenant/",
      "summary": "Resolve the default tenant for the request host.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/tenant/{name}",
      "summary": "Resolve a tenant by slug, name, or identifier.",
      "surface": "Public identity API"
    }
  ]
};

export default group;
