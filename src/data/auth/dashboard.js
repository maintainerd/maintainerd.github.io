// Endpoint details for this Auth API section.

const group = {
  "slug": "dashboard",
  "label": "Dashboard",
  "description": "Aggregate operational summary used by the management console dashboard.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/dashboard/summary",
      "summary": "Read dashboard summary metrics.",
      "surface": "Internal management API"
    }
  ]
};

export default group;
