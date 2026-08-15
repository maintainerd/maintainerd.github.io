// Endpoint details for this Auth API section.

const group = {
  "slug": "tenants-members",
  "label": "Tenants and Members",
  "description": "Tenant administration APIs for tenant lifecycle, tenant status, tenant membership, and ownership changes.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/tenants/",
      "summary": "List tenants available to the authenticated operator.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/tenants/{tenant_uuid}",
      "summary": "Read one tenant by UUID.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/tenants/",
      "summary": "Create a tenant.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/tenants/{tenant_uuid}",
      "summary": "Update tenant metadata such as name and status.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/tenants/{tenant_uuid}/status",
      "summary": "Change the active, inactive, or suspended status for a tenant.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/tenants/{tenant_uuid}",
      "summary": "Delete a tenant.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/tenants/{tenant_uuid}/members",
      "summary": "List tenant members.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/tenants/{tenant_uuid}/members",
      "summary": "Add a member to a tenant.",
      "surface": "Internal management API"
    },
    {
      "method": "PATCH",
      "path": "/tenants/{tenant_uuid}/members/{tenant_member_uuid}/role",
      "summary": "Change a tenant member role or ownership.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/tenants/{tenant_uuid}/members/{tenant_member_uuid}",
      "summary": "Remove a member from a tenant.",
      "surface": "Internal management API"
    }
  ]
};

export default group;
