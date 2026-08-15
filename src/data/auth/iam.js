// Endpoint details for this Auth API section.

const group = {
  "slug": "iam",
  "label": "IAM",
  "description": "Resource APIs, permissions, roles, policies, services, policy bindings, policy history, policy bundles, and service-to-service authorization decisions.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/apis/",
      "summary": "List API resource definitions.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/apis/{api_uuid}",
      "summary": "Read one API resource definition.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/apis/",
      "summary": "Create an API resource definition.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/apis/{api_uuid}",
      "summary": "Update an API resource definition.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/apis/{api_uuid}/status",
      "summary": "Change API resource status.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/apis/{api_uuid}",
      "summary": "Delete an API resource definition.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/permissions/",
      "summary": "List permissions.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/permissions/{permission_uuid}",
      "summary": "Read one permission.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/permissions/",
      "summary": "Create a permission.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/permissions/{permission_uuid}",
      "summary": "Update a permission.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/permissions/{permission_uuid}/status",
      "summary": "Change permission status.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/permissions/{permission_uuid}",
      "summary": "Delete a permission.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/roles/",
      "summary": "List roles.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/roles/{role_uuid}",
      "summary": "Read one role.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/roles/",
      "summary": "Create a role.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/roles/{role_uuid}",
      "summary": "Update a role.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/roles/{role_uuid}/status",
      "summary": "Change role status.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/roles/{role_uuid}",
      "summary": "Delete a role.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/roles/{role_uuid}/permissions",
      "summary": "List permissions assigned to a role.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/roles/{role_uuid}/permissions",
      "summary": "Assign permissions to a role.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/roles/{role_uuid}/permissions/{permission_uuid}",
      "summary": "Remove a permission from a role.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/policies/",
      "summary": "List policies.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/policies/{policy_uuid}",
      "summary": "Read one policy.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/policies/{policy_uuid}/services",
      "summary": "List services using a policy.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/policies/{policy_uuid}/history",
      "summary": "List policy version history.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/policies/{policy_uuid}/history/{version_number}",
      "summary": "Read one policy history version.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/policies/",
      "summary": "Create a policy.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/policies/{policy_uuid}",
      "summary": "Update a policy.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/policies/{policy_uuid}/status",
      "summary": "Change policy status.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/policies/{policy_uuid}",
      "summary": "Delete a policy.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/services/me/policy-bundle",
      "summary": "Read the calling service principal policy bundle.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/services/",
      "summary": "List services.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/services/{service_uuid}",
      "summary": "Read one service.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/services/",
      "summary": "Create a service.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/services/{service_uuid}",
      "summary": "Update a service.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/services/{service_uuid}/status",
      "summary": "Change service status.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/services/{service_uuid}",
      "summary": "Delete a service.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/services/{service_uuid}/policies/{policy_uuid}",
      "summary": "Assign a policy to a service.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/services/{service_uuid}/policies/{policy_uuid}",
      "summary": "Remove a policy from a service.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/authorize/",
      "summary": "Evaluate an authorization decision.",
      "surface": "Internal management API"
    }
  ]
};

export default group;
