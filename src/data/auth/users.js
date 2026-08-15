// Endpoint details for this Auth API section.

const group = {
  "slug": "users",
  "label": "Users",
  "description": "Administrative user APIs for account lifecycle, status, verification, roles, MFA visibility, identities, devices, sessions, consents, profiles, lockout remediation, and erasure requests.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/users/",
      "summary": "List users with pagination and filtering.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/users/membership-candidates",
      "summary": "List system-tenant users that can be added as tenant members.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/users/{user_uuid}",
      "summary": "Read one user by UUID.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/users/",
      "summary": "Create a user.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/users/{user_uuid}",
      "summary": "Update a user record.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/users/{user_uuid}/password",
      "summary": "Set a user's password administratively.",
      "surface": "Internal management API"
    },
    {
      "method": "PATCH",
      "path": "/users/{user_uuid}/status",
      "summary": "Change a user's status.",
      "surface": "Internal management API"
    },
    {
      "method": "PATCH",
      "path": "/users/{user_uuid}/verify-email",
      "summary": "Mark a user's email as verified.",
      "surface": "Internal management API"
    },
    {
      "method": "PATCH",
      "path": "/users/{user_uuid}/verify-phone",
      "summary": "Mark a user's phone number as verified.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/users/{user_uuid}",
      "summary": "Delete a user.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/users/{user_uuid}/force-password-change",
      "summary": "Require a password change on the next login.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/users/{user_uuid}/roles",
      "summary": "List roles assigned to a user.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/users/{user_uuid}/roles",
      "summary": "Assign roles to a user.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/users/{user_uuid}/roles/{role_uuid}",
      "summary": "Remove a role from a user.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/users/{user_uuid}/mfa",
      "summary": "Read a user's MFA enrollment status for administration.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/users/{user_uuid}/identities",
      "summary": "List external identities linked to a user.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/users/{user_uuid}/identities",
      "summary": "Link an external identity to a user.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/users/{user_uuid}/identities/{identity_uuid}",
      "summary": "Unlink an external identity from a user.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/users/{user_uuid}/devices",
      "summary": "List trusted devices for a user.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/users/{user_uuid}/devices/{device_uuid}",
      "summary": "Revoke a user's trusted device.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/users/{user_uuid}/consents",
      "summary": "List consent records for a user.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/users/{user_uuid}/consents/withdraw",
      "summary": "Withdraw consent on behalf of a user.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/users/{user_uuid}/sessions",
      "summary": "List active sessions for a user.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/users/{user_uuid}/sessions/{session_uuid}",
      "summary": "Revoke a single user session.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/users/{user_uuid}/sessions",
      "summary": "Revoke all sessions for a user.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/users/{user_uuid}/unlock",
      "summary": "Clear a user's failed-login lockout.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/users/{user_uuid}/profiles",
      "summary": "List profiles for a user.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/users/{user_uuid}/profiles",
      "summary": "Create a profile for a user.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/users/{user_uuid}/profiles/{profile_uuid}",
      "summary": "Read one user profile.",
      "surface": "Internal management API"
    },
    {
      "method": "PUT",
      "path": "/users/{user_uuid}/profiles/{profile_uuid}",
      "summary": "Update one user profile.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/users/{user_uuid}/profiles/{profile_uuid}",
      "summary": "Delete one user profile.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/users/{user_uuid}/erasure-requests",
      "summary": "Create an administrative data-erasure request for a user.",
      "surface": "Internal management API"
    }
  ]
};

export default group;
