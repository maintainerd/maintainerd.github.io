// Endpoint details for this Auth API section.

const group = {
  "slug": "clients",
  "label": "Applications and Clients",
  "description": "Public client discovery plus administrative OAuth client lifecycle, secrets, configuration, URIs, identity-provider connections, API audiences, permissions, and role assignments.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/client",
      "summary": "Resolve public client context.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/client/console",
      "summary": "Resolve console client context.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/clients/",
      "summary": "List OAuth clients.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/clients/{client_uuid}",
      "summary": "Read one OAuth client.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/clients/{client_uuid}/rotate-secret",
      "summary": "Rotate a confidential client secret.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/clients/{client_uuid}/config",
      "summary": "Read generated client configuration.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/clients/",
      "summary": "Create an OAuth client.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/clients/{client_uuid}",
      "summary": "Update an OAuth client.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/clients/{client_uuid}/status",
      "summary": "Change client status.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/clients/{client_uuid}",
      "summary": "Delete an OAuth client.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/clients/{client_uuid}/uris",
      "summary": "List redirect, logout, and origin URI records.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/clients/{client_uuid}/uris",
      "summary": "Create a client URI record.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/clients/{client_uuid}/uris/{client_uri_uuid}",
      "summary": "Update a client URI record.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/clients/{client_uuid}/uris/{client_uri_uuid}",
      "summary": "Delete a client URI record.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/clients/{client_uuid}/identity_providers",
      "summary": "List identity-provider connections for a client.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/clients/{client_uuid}/identity_providers",
      "summary": "Connect an identity provider to a client.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/clients/{client_uuid}/identity_providers/{client_identity_provider_uuid}",
      "summary": "Update a client identity-provider connection.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/clients/{client_uuid}/identity_providers/{client_identity_provider_uuid}",
      "summary": "Remove a client identity-provider connection.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/clients/{client_uuid}/apis",
      "summary": "List APIs assigned to a client.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/clients/{client_uuid}/apis",
      "summary": "Assign APIs to a client.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/clients/{client_uuid}/apis/{api_uuid}",
      "summary": "Remove an API assignment from a client.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/clients/{client_uuid}/apis/{api_uuid}/permissions",
      "summary": "List API permissions assigned to a client.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/clients/{client_uuid}/apis/{api_uuid}/permissions",
      "summary": "Assign API permissions to a client.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/clients/{client_uuid}/apis/{api_uuid}/permissions/{permission_uuid}",
      "summary": "Remove an API permission from a client.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/clients/{client_uuid}/roles",
      "summary": "List roles assigned to a client.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/clients/{client_uuid}/roles",
      "summary": "Assign a role to a client.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/clients/{client_uuid}/roles/{role_uuid}",
      "summary": "Remove a role from a client.",
      "surface": "Internal management API"
    }
  ]
};

export default group;
