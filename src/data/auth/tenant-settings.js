// Endpoint details for this Auth API section.

const group = {
  "slug": "tenant-settings",
  "label": "Tenant Settings",
  "description": "Per-tenant runtime controls for rate limiting, audit behavior, and maintenance windows.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/tenant-settings/rate-limit",
      "summary": "Read tenant rate-limit configuration.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/tenant-settings/rate-limit",
      "summary": "Update tenant rate-limit configuration.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/tenant-settings/audit",
      "summary": "Read tenant audit logging configuration.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/tenant-settings/audit",
      "summary": "Update tenant audit logging configuration.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/tenant-settings/maintenance",
      "summary": "Read tenant maintenance window configuration.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/tenant-settings/maintenance",
      "summary": "Update tenant maintenance window configuration.",
      "surface": "Internal management API"
    }
  ]
};

export default group;
