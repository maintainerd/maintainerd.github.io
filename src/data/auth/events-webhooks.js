// Endpoint details for this Auth API section.

const group = {
  "slug": "events-webhooks",
  "label": "Events and Webhooks",
  "description": "Webhook receiver configuration, subscriptions, delivery history, replay, auth event history, event type configuration, event routes, and management audit logs.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/webhook-endpoints/",
      "summary": "List webhook endpoints.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/webhook-endpoints/{webhook_endpoint_uuid}",
      "summary": "Read one webhook endpoint.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/webhook-endpoints/",
      "summary": "Create a webhook endpoint.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/webhook-endpoints/{webhook_endpoint_uuid}",
      "summary": "Update a webhook endpoint.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/webhook-endpoints/{webhook_endpoint_uuid}",
      "summary": "Delete a webhook endpoint.",
      "surface": "Internal management API"
    },
    {
      "method": "PATCH",
      "path": "/webhook-endpoints/{webhook_endpoint_uuid}/status",
      "summary": "Change webhook endpoint status.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/webhook-endpoints/{webhook_endpoint_uuid}/subscriptions",
      "summary": "List subscriptions for a webhook endpoint.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/webhook-endpoints/{webhook_endpoint_uuid}/subscriptions",
      "summary": "Add subscriptions to a webhook endpoint.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/webhook-endpoints/{webhook_endpoint_uuid}/subscriptions",
      "summary": "Remove subscriptions from a webhook endpoint.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/webhook-endpoints/{webhook_endpoint_uuid}/deliveries",
      "summary": "List delivery history for a webhook endpoint.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/webhook-replay/",
      "summary": "Replay a webhook delivery.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/auth-events/",
      "summary": "List authentication, authorization, and security events.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/auth-events/count",
      "summary": "Count auth events by filters.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/auth-events/export",
      "summary": "Export auth events.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/auth-events/{auth_event_uuid}",
      "summary": "Read one auth event.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/event-types/",
      "summary": "List available event types.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/tenant-event-types/",
      "summary": "Read event types enabled for the tenant.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/tenant-event-types/",
      "summary": "Enable or disable a tenant event type.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/event-routes/",
      "summary": "List event routes.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/event-routes/{event_route_uuid}",
      "summary": "Read one event route.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/event-routes/",
      "summary": "Create an event route.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/event-routes/{event_route_uuid}",
      "summary": "Update an event route.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/event-routes/{event_route_uuid}",
      "summary": "Delete an event route.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/management-audit-log/",
      "summary": "List management audit log entries.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/management-audit-log/{audit_log_uuid}",
      "summary": "Read one management audit log entry.",
      "surface": "Internal management API"
    }
  ]
};

export default group;
