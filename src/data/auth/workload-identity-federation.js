// Endpoint details for this Auth API section.

const group = {
  "slug": "workload-identity-federation",
  "label": "Workload Identity Federation",
  "description": "Configuration APIs for trusted workload identity federation providers used by services and automation.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/workload-identity-federations/",
      "summary": "List workload identity federation providers.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/workload-identity-federations/{workload_identity_federation_uuid}",
      "summary": "Read one workload identity federation provider.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/workload-identity-federations/",
      "summary": "Create a workload identity federation provider.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/workload-identity-federations/{workload_identity_federation_uuid}",
      "summary": "Update a workload identity federation provider.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/workload-identity-federations/{workload_identity_federation_uuid}",
      "summary": "Delete a workload identity federation provider.",
      "surface": "Internal management API"
    }
  ]
};

export default group;
