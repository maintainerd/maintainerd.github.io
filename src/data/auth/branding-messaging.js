// Endpoint details for this Auth API section.

const group = {
  "slug": "branding-messaging",
  "label": "Branding and Messaging",
  "description": "Branding records, active theme control, public branding lookup, email and SMS templates, and delivery-provider configuration.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/branding/",
      "summary": "List branding configurations.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/branding/",
      "summary": "Create branding configuration.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/branding/{branding_uuid}",
      "summary": "Update branding configuration.",
      "surface": "Internal management API"
    },
    {
      "method": "PATCH",
      "path": "/branding/{branding_uuid}/restore",
      "summary": "Restore system branding values.",
      "surface": "Internal management API"
    },
    {
      "method": "PATCH",
      "path": "/branding/{branding_uuid}/activate",
      "summary": "Activate a branding configuration.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/branding/{branding_uuid}",
      "summary": "Delete branding configuration.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/public/branding",
      "summary": "Read public branding for the request tenant.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/public/branding/{branding_id}/logo",
      "summary": "Serve a public branding logo asset.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/email_templates/",
      "summary": "List email templates.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/email_templates/{email_template_uuid}",
      "summary": "Read one email template.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/email_templates/{email_template_uuid}",
      "summary": "Update one email template.",
      "surface": "Internal management API"
    },
    {
      "method": "PATCH",
      "path": "/email_templates/{email_template_uuid}/status",
      "summary": "Change email template status.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/sms_templates/",
      "summary": "List SMS templates.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/sms_templates/{sms_template_uuid}",
      "summary": "Read one SMS template.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/sms_templates/{sms_template_uuid}",
      "summary": "Update one SMS template.",
      "surface": "Internal management API"
    },
    {
      "method": "PATCH",
      "path": "/sms_templates/{sms_template_uuid}/status",
      "summary": "Change SMS template status.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/email-config/",
      "summary": "Read email delivery configuration.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/email-config/status",
      "summary": "Read email delivery provider status.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/email-config/",
      "summary": "Update email delivery configuration.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/sms-config/",
      "summary": "Read SMS delivery configuration.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/sms-config/status",
      "summary": "Read SMS delivery provider status.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/sms-config/",
      "summary": "Update SMS delivery configuration.",
      "surface": "Internal management API"
    }
  ]
};

export default group;
