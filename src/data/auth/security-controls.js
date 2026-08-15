// Endpoint details for this Auth API section.

const group = {
  "slug": "security-controls",
  "label": "Security Controls",
  "description": "Tenant security configuration APIs for MFA policy, password policy, session policy, threat controls, lockout rules, registration controls, token policy, and IP restriction rules.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/security-settings/mfa",
      "summary": "Read MFA security settings.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/security-settings/mfa",
      "summary": "Update MFA security settings.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/security-settings/password",
      "summary": "Read password policy settings.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/security-settings/password",
      "summary": "Update password policy settings.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/security-settings/session",
      "summary": "Read session policy settings.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/security-settings/session",
      "summary": "Update session policy settings.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/security-settings/threat",
      "summary": "Read threat protection settings.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/security-settings/threat",
      "summary": "Update threat protection settings.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/security-settings/lockout",
      "summary": "Read lockout policy settings.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/security-settings/lockout",
      "summary": "Update lockout policy settings.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/security-settings/registration",
      "summary": "Read registration policy settings.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/security-settings/registration",
      "summary": "Update registration policy settings.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/security-settings/token",
      "summary": "Read token policy settings.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/security-settings/token",
      "summary": "Update token policy settings.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/ip-restriction-rules/",
      "summary": "List IP restriction rules.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/ip-restriction-rules/{ip_restriction_rule_uuid}",
      "summary": "Read one IP restriction rule.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/ip-restriction-rules/",
      "summary": "Create an IP restriction rule.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/ip-restriction-rules/{ip_restriction_rule_uuid}",
      "summary": "Update an IP restriction rule.",
      "surface": "Internal management API"
    },
    {
      "method": "PATCH",
      "path": "/ip-restriction-rules/{ip_restriction_rule_uuid}/status",
      "summary": "Change IP restriction rule status.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/ip-restriction-rules/{ip_restriction_rule_uuid}",
      "summary": "Delete an IP restriction rule.",
      "surface": "Internal management API"
    }
  ]
};

export default group;
