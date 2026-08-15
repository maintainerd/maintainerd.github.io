// Endpoint details for this Auth API section.

const management = "Internal management API";

const jsonContentHeader = {
  "name": "Content-Type",
  "value": "application/json",
  "required": true,
  "description": "Required when the endpoint accepts a JSON request body. Security-setting updates accept a partial JSON object containing only the fields to change."
};

const jsonAcceptHeader = {
  "name": "Accept",
  "value": "application/json",
  "required": false,
  "description": "Use when the caller wants an explicit JSON response."
};

const bearerAuthHeader = {
  "name": "Authorization",
  "value": "Bearer <access_token>",
  "required": true,
  "description": "Required. The endpoint is mounted behind JWT authentication and user-context resolution. Tenant context is derived from the authenticated caller."
};

const jwtReadHeaders = [jsonAcceptHeader, bearerAuthHeader];
const jwtJsonHeaders = [jsonContentHeader, jsonAcceptHeader, bearerAuthHeader];

const emptyBody = {
  "type": "None",
  "description": "This endpoint does not accept a request body.",
  "fields": [],
  "example": null
};

const validationErrorResponse = {
  "status": "400 Bad Request",
  "description": "The JSON body or query string failed validation.",
  "example": {
    "success": false,
    "error": "Validation failed",
    "details": {
      "Type": "Type is required"
    }
  }
};

const invalidBodyResponse = {
  "status": "400 Bad Request",
  "description": "The request body was not valid JSON, was empty, contained unknown fields, or contained trailing data.",
  "example": {
    "success": false,
    "error": "Invalid request body"
  }
};

const tenantMissingResponse = {
  "status": "401 Unauthorized",
  "description": "The authenticated context does not resolve a tenant.",
  "example": {
    "success": false,
    "error": "Tenant not found in context"
  }
};

const userMissingResponse = {
  "status": "401 Unauthorized",
  "description": "The authenticated context does not resolve a user actor.",
  "example": {
    "success": false,
    "error": "User not found in context"
  }
};

const forbiddenResponse = {
  "status": "403 Forbidden",
  "description": "The authenticated caller does not hold the required permission.",
  "example": {
    "success": false,
    "error": "Insufficient permissions"
  }
};

const stepUpResponse = {
  "status": "403 Forbidden",
  "description": "The operation requires step-up authentication and the caller's session has not completed it recently.",
  "example": {
    "success": false,
    "error": "Step-up authentication required",
    "code": "step_up_required"
  }
};

const internalErrorResponse = {
  "status": "500 Internal Server Error",
  "description": "An unexpected service or persistence error occurred.",
  "example": {
    "success": false,
    "error": "An unexpected error occurred"
  }
};

const invalidRuleUuidResponse = {
  "status": "400 Bad Request",
  "description": "The ip_restriction_rule_uuid path value is not a valid UUID.",
  "example": {
    "success": false,
    "error": "Invalid IP restriction rule UUID"
  }
};

const ruleNotFoundResponse = {
  "status": "404 Not Found",
  "description": "No IP restriction rule matches the UUID in the caller's tenant.",
  "example": {
    "success": false,
    "error": "ip restriction rule not found"
  }
};

const ruleExample = {
  "ip_restriction_rule_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "description": "Office network",
  "type": "allow",
  "ip_address": "203.0.113.10",
  "status": "active",
  "created_at": "2026-08-01T09:00:00Z",
  "updated_at": "2026-08-10T09:00:00Z"
};

// Config shape builders. Each returns an endpoint whose GET returns the full
// normalized config and whose PUT applies a partial merge.
const configEndpoints = (key, label, getExample, putExample, fields, notes) => [
  {
    "method": "GET",
    "path": `/security-settings/${key}`,
    "summary": `Read ${label.toLowerCase()} security settings.`,
    "surface": management,
    "details": {
      "overview": `Returns the tenant's full normalized ${label.toLowerCase()} configuration: shipped defaults merged with the stored values, so every field is always present.`,
      "notes": [
        "Requires the security-setting:read permission.",
        ...notes
      ],
      "parameters": [],
      "headers": jwtReadHeaders,
      "requestBody": emptyBody,
      "responses": [
        {
          "status": "200 OK",
          "description": `The ${label.toLowerCase()} configuration.`,
          "example": {
            "success": true,
            "data": getExample,
            "message": `${label} config retrieved successfully`
          }
        },
        tenantMissingResponse,
        forbiddenResponse,
        {
          "status": "500 Internal Server Error",
          "description": `The stored configuration could not be loaded.`,
          "example": {
            "success": false,
            "error": `Failed to get ${label} config`
          }
        }
      ]
    }
  },
  {
    "method": "PUT",
    "path": `/security-settings/${key}`,
    "summary": `Update ${label.toLowerCase()} security settings.`,
    "surface": management,
    "details": {
      "overview": `Applies a partial update to the tenant's ${label.toLowerCase()} configuration. The body is a patch: only the supplied fields change, the patch is merged over stored values and defaults, then the full merged config is re-validated and stored. Every update is audited with the actor, IP address, and user agent.`,
      "notes": [
        "Requires the security-setting:update permission and step-up authentication.",
        "Omitted fields keep their stored values; unknown fields are rejected.",
        "A patch that produces an invalid merged combination is rejected.",
        "The response returns the full merged configuration.",
        "Every update writes a security_settings_audit row (old and new config, actor, IP, user agent) in the same transaction.",
        ...notes
      ],
      "parameters": [],
      "headers": jwtJsonHeaders,
      "requestBody": {
        "type": "JSON object (partial)",
        "description": `Partial ${label.toLowerCase()} configuration patch. Only the fields to change are required.`,
        "fields": fields,
        "example": putExample
      },
      "responses": [
        {
          "status": "200 OK",
          "description": `The ${label.toLowerCase()} configuration was updated. The data is the full merged configuration.`,
          "example": {
            "success": true,
            "data": getExample,
            "message": `${label} config updated successfully`
          }
        },
        tenantMissingResponse,
        forbiddenResponse,
        stepUpResponse,
        invalidBodyResponse,
        {
          "status": "500 Internal Server Error",
          "description": `The merged configuration failed validation or could not be stored.`,
          "example": {
            "success": false,
            "error": `Failed to update ${label} config`
          }
        }
      ]
    }
  }
];

const mfaConfigExample = {
  "mode": "optional",
  "allowed_methods": ["totp", "webauthn", "recovery_code"],
  "totp_issuer": "Maintainerd-Auth",
  "trusted_device_period_days": 14,
  "grace_period_days": 30,
  "preferred_method": "webauthn",
  "allow_sms": false,
  "allow_email_otp": false,
  "totp_digits": 6,
  "totp_period_seconds": 30,
  "recovery_codes_count": 10,
  "require_mfa_for_sensitive_actions": true,
  "admin_grace_period_days": 0,
  "step_up_ttl_minutes": 5
};

const mfaConfigFields = [
  { "name": "mode", "type": "string", "required": false, "description": "Enforcement mode: disabled, optional, or enforced." },
  { "name": "allowed_methods", "type": "array of strings", "required": false, "description": "Enrollable methods: totp, webauthn, sms, email_otp, recovery_code." },
  { "name": "totp_issuer", "type": "string", "required": false, "description": "TOTP issuer label. Required when totp is an allowed method." },
  { "name": "trusted_device_period_days", "type": "integer", "required": false, "description": "Days a trusted device is remembered. 0-365." },
  { "name": "grace_period_days", "type": "integer", "required": false, "description": "Enrollment grace period. 0-90." },
  { "name": "preferred_method", "type": "string", "required": false, "description": "Preferred method; must be in allowed_methods." },
  { "name": "allow_sms", "type": "boolean", "required": false, "description": "Allows SMS enrollment." },
  { "name": "allow_email_otp", "type": "boolean", "required": false, "description": "Allows email OTP enrollment." },
  { "name": "totp_digits", "type": "integer", "required": false, "description": "TOTP code length: 6 or 8." },
  { "name": "totp_period_seconds", "type": "integer", "required": false, "description": "TOTP time step. 30-90." },
  { "name": "recovery_codes_count", "type": "integer", "required": false, "description": "Recovery codes issued: 0, or 8-16." },
  { "name": "require_mfa_for_sensitive_actions", "type": "boolean", "required": false, "description": "Requires step-up on sensitive self-service actions." },
  { "name": "admin_grace_period_days", "type": "integer", "required": false, "description": "Admin-only enrollment grace period. 0-90." },
  { "name": "step_up_ttl_minutes", "type": "integer", "required": false, "description": "Step-up freshness window in minutes. 1-60. Also drives the RequireStepUp middleware." }
];

const passwordConfigExample = {
  "min_length": 12,
  "max_length": 128,
  "require_uppercase": false,
  "require_lowercase": false,
  "require_number": false,
  "require_symbol": false,
  "reject_common_passwords": true,
  "check_hibp": true,
  "password_history_count": 5,
  "max_age_days": 0,
  "temporary_password_validity_hours": 72,
  "hash_algorithm": "argon2id",
  "min_strength_score": 2
};

const passwordConfigFields = [
  { "name": "min_length", "type": "integer", "required": false, "description": "Minimum password length. At least 1." },
  { "name": "max_length", "type": "integer", "required": false, "description": "Maximum password length. 64-128." },
  { "name": "require_uppercase", "type": "boolean", "required": false, "description": "Require an uppercase character." },
  { "name": "require_lowercase", "type": "boolean", "required": false, "description": "Require a lowercase character." },
  { "name": "require_number", "type": "boolean", "required": false, "description": "Require a digit." },
  { "name": "require_symbol", "type": "boolean", "required": false, "description": "Require a special character." },
  { "name": "reject_common_passwords", "type": "boolean", "required": false, "description": "Reject common-password blocklist matches." },
  { "name": "check_hibp", "type": "boolean", "required": false, "description": "HaveIBeenPwned k-anonymity breach check." },
  { "name": "password_history_count", "type": "integer", "required": false, "description": "Previous hashes checked for reuse. 0-24; 0 disables." },
  { "name": "max_age_days", "type": "integer", "required": false, "description": "Forced rotation after N days. 0-3650; 0 disables." },
  { "name": "temporary_password_validity_hours", "type": "integer", "required": false, "description": "Lifetime of admin-issued temporary passwords. 1-720." },
  { "name": "hash_algorithm", "type": "string", "required": false, "description": "One of argon2id, bcrypt, scrypt, pbkdf2." },
  { "name": "min_strength_score", "type": "integer", "required": false, "description": "Minimum guessability score. 0-4." }
];

const sessionConfigExample = {
  "access_token_ttl_minutes": 15,
  "refresh_token_ttl_days": 30,
  "max_concurrent_sessions": 5,
  "idle_timeout_minutes": 30,
  "absolute_timeout_hours": 24,
  "rotate_refresh_tokens": true,
  "refresh_token_reuse_interval_seconds": 10,
  "cookie_secure": true,
  "cookie_http_only": true,
  "cookie_same_site": "Lax",
  "revoke_sessions_on_password_change": true
};

const sessionConfigFields = [
  { "name": "access_token_ttl_minutes", "type": "integer", "required": false, "description": "Access token lifetime in minutes. 1-60." },
  { "name": "refresh_token_ttl_days", "type": "integer", "required": false, "description": "Refresh token lifetime in days. 1-365." },
  { "name": "max_concurrent_sessions", "type": "integer", "required": false, "description": "Concurrent sessions per user. 0 or more." },
  { "name": "idle_timeout_minutes", "type": "integer", "required": false, "description": "Idle timeout in minutes. At least 1." },
  { "name": "absolute_timeout_hours", "type": "integer", "required": false, "description": "Hard absolute timeout in hours. At least 1." },
  { "name": "rotate_refresh_tokens", "type": "boolean", "required": false, "description": "Rotate refresh tokens on use." },
  { "name": "refresh_token_reuse_interval_seconds", "type": "integer", "required": false, "description": "Reuse grace interval in seconds. 0 or more." },
  { "name": "cookie_secure", "type": "boolean", "required": false, "description": "Secure cookie flag." },
  { "name": "cookie_http_only", "type": "boolean", "required": false, "description": "HttpOnly cookie flag." },
  { "name": "cookie_same_site", "type": "string", "required": false, "description": "One of Strict, Lax, None. None requires cookie_secure." },
  { "name": "revoke_sessions_on_password_change", "type": "boolean", "required": false, "description": "Revoke all sessions when the password changes." }
];

const threatConfigExample = {
  "brute_force_detection_enabled": true,
  "impossible_travel_detection_enabled": true,
  "new_device_notification_enabled": true,
  "velocity_check_enabled": true,
  "risk_based_step_up_enabled": false,
  "compromised_credential_monitoring_enabled": true,
  "ip_reputation_check_enabled": false,
  "block_tor_exit_nodes": false,
  "risk_step_up_threshold": 21,
  "risk_block_threshold": 81,
  "velocity_failures_per_ip_per_hour": 50,
  "distinct_accounts_per_ip_per_hour": 10
};

const threatConfigFields = [
  { "name": "brute_force_detection_enabled", "type": "boolean", "required": false, "description": "Brute-force detection." },
  { "name": "impossible_travel_detection_enabled", "type": "boolean", "required": false, "description": "Impossible-travel detection." },
  { "name": "new_device_notification_enabled", "type": "boolean", "required": false, "description": "New-device notification." },
  { "name": "velocity_check_enabled", "type": "boolean", "required": false, "description": "Velocity checking." },
  { "name": "risk_based_step_up_enabled", "type": "boolean", "required": false, "description": "Risk-based step-up." },
  { "name": "compromised_credential_monitoring_enabled", "type": "boolean", "required": false, "description": "Compromised-credential monitoring." },
  { "name": "ip_reputation_check_enabled", "type": "boolean", "required": false, "description": "IP reputation check. Must stay false: no provider is configured." },
  { "name": "block_tor_exit_nodes", "type": "boolean", "required": false, "description": "Tor exit-node blocking. Must stay false: no source is configured." },
  { "name": "risk_step_up_threshold", "type": "integer", "required": false, "description": "Risk score (0-100) at which step-up fires." },
  { "name": "risk_block_threshold", "type": "integer", "required": false, "description": "Risk score (0-100) at which login is blocked." },
  { "name": "velocity_failures_per_ip_per_hour", "type": "integer", "required": false, "description": "Failed logins per IP per hour. At least 1." },
  { "name": "distinct_accounts_per_ip_per_hour", "type": "integer", "required": false, "description": "Distinct accounts per IP per hour. At least 1." }
];

const lockoutConfigExample = {
  "enabled": true,
  "max_failed_attempts": 5,
  "lockout_duration_minutes": 30,
  "progressive_lockout": true,
  "auto_unlock": true,
  "reset_count_on_success": true,
  "observation_window_minutes": 15,
  "max_lockout_duration_minutes": 60,
  "progression_reset_hours": 24,
  "notify_user_on_lockout": true
};

const lockoutConfigFields = [
  { "name": "enabled", "type": "boolean", "required": false, "description": "Master switch for lockout enforcement." },
  { "name": "max_failed_attempts", "type": "integer", "required": false, "description": "Failures before lockout. 1-100." },
  { "name": "lockout_duration_minutes", "type": "integer", "required": false, "description": "Base lockout duration in minutes. At least 1." },
  { "name": "progressive_lockout", "type": "boolean", "required": false, "description": "Escalate lockout durations on repeated lockouts." },
  { "name": "auto_unlock", "type": "boolean", "required": false, "description": "Auto-unlock after the duration." },
  { "name": "reset_count_on_success", "type": "boolean", "required": false, "description": "Reset the failure counter on successful login." },
  { "name": "observation_window_minutes", "type": "integer", "required": false, "description": "Failure counting window in minutes. At least 1." },
  { "name": "max_lockout_duration_minutes", "type": "integer", "required": false, "description": "Ceiling for progressive lockout. At least lockout_duration_minutes." },
  { "name": "progression_reset_hours", "type": "integer", "required": false, "description": "Hours until the progression level resets. At least 1." },
  { "name": "notify_user_on_lockout", "type": "boolean", "required": false, "description": "Notify the user when locked out." }
];

const registrationConfigExample = {
  "self_registration_enabled": true,
  "require_email_verification": true,
  "require_phone_verification": false,
  "allowed_email_domains": [],
  "blocked_email_domains": [],
  "auto_confirm_enabled": false,
  "verification_token_ttl_hours": 24,
  "captcha_on_signup": false,
  "registration_rate_limit_per_ip_per_hour": 10
};

const registrationConfigFields = [
  { "name": "self_registration_enabled", "type": "boolean", "required": false, "description": "Allow self-service signup." },
  { "name": "require_email_verification", "type": "boolean", "required": false, "description": "Require email verification after signup." },
  { "name": "require_phone_verification", "type": "boolean", "required": false, "description": "Require phone verification after signup." },
  { "name": "allowed_email_domains", "type": "array of strings", "required": false, "description": "Allowlist (empty = allow all). Exact entries or *.domain wildcards." },
  { "name": "blocked_email_domains", "type": "array of strings", "required": false, "description": "Blocklist. Bare entries also match subdomains. Must not overlap the allowlist." },
  { "name": "auto_confirm_enabled", "type": "boolean", "required": false, "description": "Activate accounts without email confirmation. Cannot be true with require_email_verification." },
  { "name": "verification_token_ttl_hours", "type": "integer", "required": false, "description": "Verification token lifetime in hours. At least 1." },
  { "name": "captcha_on_signup", "type": "boolean", "required": false, "description": "CAPTCHA on signup. Must default off until the first-party form emits captcha tokens." },
  { "name": "registration_rate_limit_per_ip_per_hour", "type": "integer", "required": false, "description": "Signup attempts per IP per hour. At least 1." }
];

const tokenConfigExample = {
  "clock_skew_leeway_seconds": 30,
  "additional_id_token_claims": ["roles", "tenant_id"],
  "additional_access_token_claims": ["roles", "tenant_id"],
  "signing_algorithm": "RS256",
  "require_pkce": true
};

const tokenConfigFields = [
  { "name": "clock_skew_leeway_seconds", "type": "integer", "required": false, "description": "JWT clock-skew tolerance in seconds. 0-300." },
  { "name": "additional_id_token_claims", "type": "array of strings", "required": false, "description": "Extra claims added to ID tokens. Only roles and tenant_id are supported." },
  { "name": "additional_access_token_claims", "type": "array of strings", "required": false, "description": "Extra claims added to access tokens. Only roles and tenant_id are supported." },
  { "name": "signing_algorithm", "type": "string", "required": false, "description": "One of RS256 or PS256." },
  { "name": "require_pkce", "type": "boolean", "required": false, "description": "Require PKCE for the authorization-code flow." }
];

const mfaEndpoints = configEndpoints(
  "mfa", "General", mfaConfigExample, { "mode": "enforced", "step_up_ttl_minutes": 10 }, mfaConfigFields,
  [
    "The MFA write is the most destructive setting on this router: it can switch off enforced MFA, which degrades sensitive-action step-up gates to pass-throughs. It is step-up gated for that reason.",
    "sms in allowed_methods requires allow_sms=true; email_otp requires allow_email_otp=true.",
    "mode=enforced forces an effective required authentication context of acr=2 for tenant sessions."
  ]
);

const passwordEndpoints = configEndpoints(
  "password", "Password", passwordConfigExample, { "min_length": 14, "check_hibp": true }, passwordConfigFields,
  [
    "The merged configuration must satisfy min_length <= max_length.",
    "Legacy alias keys are accepted only on the read path; PUT rejects unknown fields."
  ]
);

const sessionEndpoints = configEndpoints(
  "session", "Session", sessionConfigExample, { "access_token_ttl_minutes": 10 }, sessionConfigFields,
  [
    "cookie_same_site=None requires cookie_secure=true.",
    "Per-client overrides only ever shorten the tenant values.",
    "revoke_sessions_on_password_change defaults to true when the stored value is unreadable (secure default)."
  ]
);

const threatEndpoints = configEndpoints(
  "threat", "Threat", threatConfigExample, { "risk_based_step_up_enabled": true }, threatConfigFields,
  [
    "risk_step_up_threshold must be less than or equal to risk_block_threshold.",
    "ip_reputation_check_enabled and block_tor_exit_nodes must stay false until a provider is configured; enabling either is rejected to prevent silent fail-open."
  ]
);

const lockoutEndpoints = configEndpoints(
  "lockout", "IP", lockoutConfigExample, { "max_failed_attempts": 3 }, lockoutConfigFields,
  [
    "max_lockout_duration_minutes must be greater than or equal to lockout_duration_minutes.",
    "The enforcement loader never treats a missing row as lockout-off: it falls back to defaults so lockout can never be silently disabled by a DB blip."
  ]
);

const registrationEndpoints = configEndpoints(
  "registration", "Registration", registrationConfigExample, { "require_email_verification": true }, registrationConfigFields,
  [
    "allowed_email_domains and blocked_email_domains must not overlap.",
    "auto_confirm_enabled and require_email_verification cannot both be true.",
    "Blocklist entries match subdomains; allowlist entries are exact unless prefixed with *."
  ]
);

const tokenEndpoints = configEndpoints(
  "token", "Token", tokenConfigExample, { "clock_skew_leeway_seconds": 60 }, tokenConfigFields,
  [
    "ES256 is deliberately rejected: the key store is RSA-only and ES256 would make every token issuance fail.",
    "The serialized token config must stay below 4 KB.",
    "A client-level require_pkce=true or a public client always forces PKCE on; the resolver only ever escalates."
  ]
);

const ruleTypeField = {
  "name": "type",
  "type": "string",
  "required": true,
  "description": "Rule action: allow, deny, whitelist, or blacklist."
};

const ruleIpField = {
  "name": "ip_address",
  "type": "string",
  "required": true,
  "description": "IPv4 address. 1-50 characters."
};

const ruleDescriptionField = {
  "name": "description",
  "type": "string",
  "required": false,
  "description": "Description. At most 500 characters."
};

const ruleStatusField = {
  "name": "status",
  "type": "string",
  "required": false,
  "description": "One of active or inactive. Defaults to active when omitted."
};

const group = {
  "slug": "security-controls",
  "label": "Security Controls",
  "description": "Tenant security configuration APIs for MFA policy, password policy, session policy, threat controls, lockout rules, registration controls, token policy, and IP restriction rules.",
  "endpoints": [
    ...mfaEndpoints,
    ...passwordEndpoints,
    ...sessionEndpoints,
    ...threatEndpoints,
    ...lockoutEndpoints,
    ...registrationEndpoints,
    ...tokenEndpoints,
    {
      "method": "GET",
      "path": "/ip-restriction-rules/",
      "summary": "List IP restriction rules.",
      "surface": management,
      "details": {
        "overview": "Lists the tenant's IP restriction rules with pagination, filtering, and sorting. Enforcement loads only active rules, cached with a short TTL.",
        "notes": [
          "Requires the ip-restriction-rule:read permission.",
          "type accepts allow, deny, whitelist, or blacklist as an exact match.",
          "ip_address and description filters are case-insensitive substring matches.",
          "Results are scoped to the authenticated caller's tenant."
        ],
        "parameters": [
          {
            "name": "status",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Exact status match (single value)."
          },
          {
            "name": "type",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Exact rule type: allow, deny, whitelist, or blacklist."
          },
          {
            "name": "ip_address",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Case-insensitive substring match on the IP address."
          },
          {
            "name": "description",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Case-insensitive substring match on the description."
          },
          {
            "name": "page",
            "in": "query",
            "type": "integer",
            "required": false,
            "description": "Page number, starting at 1. Defaults to 1."
          },
          {
            "name": "limit",
            "in": "query",
            "type": "integer",
            "required": false,
            "description": "Page size. Defaults to 20, maximum 100."
          },
          {
            "name": "sort_by",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Field to sort by. Unknown fields fall back to created_at descending."
          },
          {
            "name": "sort_order",
            "in": "query",
            "type": "string",
            "required": false,
            "description": "Sort direction: asc or desc."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The paginated IP restriction rule list.",
            "example": {
              "success": true,
              "data": {
                "rows": [ruleExample],
                "total": 1,
                "page": 1,
                "limit": 20,
                "total_pages": 1
              },
              "message": "IP restriction rules retrieved successfully"
            }
          },
          tenantMissingResponse,
          forbiddenResponse,
          validationErrorResponse,
          {
            "status": "500 Internal Server Error",
            "description": "An unexpected service or persistence error occurred.",
            "example": {
              "success": false,
              "error": "Failed to get IP restriction rules"
            }
          }
        ]
      }
    },
    {
      "method": "GET",
      "path": "/ip-restriction-rules/{ip_restriction_rule_uuid}",
      "summary": "Read one IP restriction rule.",
      "surface": management,
      "details": {
        "overview": "Returns one IP restriction rule by UUID, scoped to the caller's tenant.",
        "notes": [
          "Requires the ip-restriction-rule:read permission.",
          "Rules in another tenant respond as not found."
        ],
        "parameters": [
          {
            "name": "ip_restriction_rule_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the IP restriction rule."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The IP restriction rule.",
            "example": {
              "success": true,
              "data": ruleExample,
              "message": "IP restriction rule retrieved successfully"
            }
          },
          tenantMissingResponse,
          invalidRuleUuidResponse,
          forbiddenResponse,
          ruleNotFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/ip-restriction-rules/",
      "summary": "Create an IP restriction rule.",
      "surface": management,
      "details": {
        "overview": "Creates an IP restriction rule for the tenant. Active rules are enforced on the protected auth surfaces: deny wins over allow, and with allow rules present an unmatched IP is denied.",
        "notes": [
          "Requires the ip-restriction-rule:create permission.",
          "ip_address accepts IPv4 only (IPv6 and CIDR are rejected by validation).",
          "status defaults to active when omitted.",
          "Duplicate (type, ip_address) rows are permitted; there is no uniqueness constraint."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "IP restriction rule creation payload.",
          "fields": [ruleDescriptionField, ruleTypeField, ruleIpField, ruleStatusField],
          "example": {
            "description": "Office network",
            "type": "allow",
            "ip_address": "203.0.113.10",
            "status": "active"
          }
        },
        "responses": [
          {
            "status": "201 Created",
            "description": "The IP restriction rule was created.",
            "example": {
              "success": true,
              "data": ruleExample,
              "message": "IP restriction rule created successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "500 Internal Server Error",
            "description": "An unexpected service or persistence error occurred.",
            "example": {
              "success": false,
              "error": "Failed to create IP restriction rule"
            }
          }
        ]
      }
    },
    {
      "method": "PUT",
      "path": "/ip-restriction-rules/{ip_restriction_rule_uuid}",
      "summary": "Update an IP restriction rule.",
      "surface": management,
      "details": {
        "overview": "Replaces an IP restriction rule's fields. The update is a full replacement of description, type, ip_address, and status.",
        "notes": [
          "Requires the ip-restriction-rule:update permission.",
          "status defaults to active when omitted, so a PUT without status reactivates an inactive rule.",
          "Rules in another tenant respond as not found."
        ],
        "parameters": [
          {
            "name": "ip_restriction_rule_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the IP restriction rule."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "IP restriction rule update payload.",
          "fields": [ruleDescriptionField, ruleTypeField, ruleIpField, ruleStatusField],
          "example": {
            "description": "Office network (updated)",
            "type": "deny",
            "ip_address": "203.0.113.10",
            "status": "active"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The IP restriction rule was updated.",
            "example": {
              "success": true,
              "data": ruleExample,
              "message": "IP restriction rule updated successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          invalidRuleUuidResponse,
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          ruleNotFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "PATCH",
      "path": "/ip-restriction-rules/{ip_restriction_rule_uuid}/status",
      "summary": "Change IP restriction rule status.",
      "surface": management,
      "details": {
        "overview": "Updates only a rule's status. Setting a rule to inactive removes it from enforcement immediately (enforcement loads only active rules).",
        "notes": [
          "Requires the ip-restriction-rule:update permission.",
          "Only status and updated_by change; all other fields are untouched."
        ],
        "parameters": [
          {
            "name": "ip_restriction_rule_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the IP restriction rule."
          }
        ],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "IP restriction rule status payload.",
          "fields": [
            {
              "name": "status",
              "type": "string",
              "required": true,
              "description": "One of active or inactive."
            }
          ],
          "example": {
            "status": "inactive"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The rule status was updated.",
            "example": {
              "success": true,
              "data": ruleExample,
              "message": "IP restriction rule status updated successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          invalidRuleUuidResponse,
          forbiddenResponse,
          validationErrorResponse,
          invalidBodyResponse,
          ruleNotFoundResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/ip-restriction-rules/{ip_restriction_rule_uuid}",
      "summary": "Delete an IP restriction rule.",
      "surface": management,
      "details": {
        "overview": "Soft-deletes an IP restriction rule. The rule stops being enforced immediately.",
        "notes": [
          "Requires the ip-restriction-rule:delete permission.",
          "Rules in another tenant respond as not found."
        ],
        "parameters": [
          {
            "name": "ip_restriction_rule_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the IP restriction rule."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The rule was deleted. The response carries the deleted record.",
            "example": {
              "success": true,
              "data": ruleExample,
              "message": "IP restriction rule deleted successfully"
            }
          },
          tenantMissingResponse,
          invalidRuleUuidResponse,
          forbiddenResponse,
          ruleNotFoundResponse,
          internalErrorResponse
        ]
      }
    }
  ]
};

export default group;
