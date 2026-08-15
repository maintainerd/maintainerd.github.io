// Endpoint details for this Auth API section.

const group = {
  "slug": "registration-flows",
  "label": "Registration Flows",
  "description": "Registration-flow configuration APIs for self-registration rules, invite-based onboarding behavior, default roles, status, and lifecycle.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/registration_flows/",
      "summary": "List registration flows.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/registration_flows/{registration_flow_uuid}",
      "summary": "Read one registration flow.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/registration_flows/",
      "summary": "Create a registration flow.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/registration_flows/{registration_flow_uuid}",
      "summary": "Update a registration flow.",
      "surface": "Internal management API"
    },
    {
      "method": "PATCH",
      "path": "/registration_flows/{registration_flow_uuid}/status",
      "summary": "Change registration-flow status.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/registration_flows/{registration_flow_uuid}",
      "summary": "Delete a registration flow.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/registration_flows/{registration_flow_uuid}/roles",
      "summary": "Assign roles to a registration flow.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/registration_flows/{registration_flow_uuid}/roles",
      "summary": "List roles assigned to a registration flow.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/registration_flows/{registration_flow_uuid}/roles/{role_uuid}",
      "summary": "Remove a role from a registration flow.",
      "surface": "Internal management API"
    }
  ]
};

export default group;
