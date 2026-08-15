// Endpoint details for this Auth API section.

const group = {
  "slug": "account-self-service",
  "label": "Account Self-Service",
  "description": "Authenticated user-owned APIs for account details, profile management, devices, sessions, consent, recovery, settings, external identity links, and self-service erasure.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/account/",
      "summary": "Read the authenticated user's account.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/account/email/change",
      "summary": "Start an email change flow.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/account/email/verify",
      "summary": "Verify and complete an email change.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/account/phone/send-verification",
      "summary": "Send a phone verification code.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/account/phone/verify",
      "summary": "Verify a phone number.",
      "surface": "Public identity API"
    },
    {
      "method": "PUT",
      "path": "/account/username",
      "summary": "Change the authenticated user's username.",
      "surface": "Public identity API"
    },
    {
      "method": "PUT",
      "path": "/account/password",
      "summary": "Change the authenticated user's password.",
      "surface": "Public identity API"
    },
    {
      "method": "DELETE",
      "path": "/account/",
      "summary": "Delete the authenticated user's account.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/account/export",
      "summary": "Export the authenticated user's account data.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/account/sessions",
      "summary": "List the authenticated user's sessions.",
      "surface": "Public identity API"
    },
    {
      "method": "DELETE",
      "path": "/account/sessions",
      "summary": "Revoke all sessions for the authenticated user.",
      "surface": "Public identity API"
    },
    {
      "method": "DELETE",
      "path": "/account/sessions/others",
      "summary": "Revoke all sessions except the current session.",
      "surface": "Public identity API"
    },
    {
      "method": "DELETE",
      "path": "/account/sessions/{session_uuid}",
      "summary": "Revoke one session owned by the authenticated user.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/account/consent",
      "summary": "Record consent for the authenticated user.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/me/devices",
      "summary": "List the authenticated user's trusted devices.",
      "surface": "Public identity API"
    },
    {
      "method": "DELETE",
      "path": "/me/devices/{device_uuid}",
      "summary": "Remove one trusted device from the authenticated user.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/me/erasure-request",
      "summary": "Request erasure of the authenticated user's data.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/profile/",
      "summary": "Read the authenticated user's default profile.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/profile/",
      "summary": "Create or update the default profile.",
      "surface": "Public identity API"
    },
    {
      "method": "PUT",
      "path": "/profile/",
      "summary": "Update the default profile.",
      "surface": "Public identity API"
    },
    {
      "method": "DELETE",
      "path": "/profile/",
      "summary": "Delete the default profile.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/profiles/",
      "summary": "List all profiles for the authenticated user.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/profiles/",
      "summary": "Create a profile for the authenticated user.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/profiles/{profile_uuid}",
      "summary": "Read one profile owned by the authenticated user.",
      "surface": "Public identity API"
    },
    {
      "method": "PUT",
      "path": "/profiles/{profile_uuid}",
      "summary": "Update one profile owned by the authenticated user.",
      "surface": "Public identity API"
    },
    {
      "method": "PUT",
      "path": "/profiles/{profile_uuid}/set-default",
      "summary": "Set a profile as the default profile.",
      "surface": "Public identity API"
    },
    {
      "method": "DELETE",
      "path": "/profiles/{profile_uuid}",
      "summary": "Delete one profile owned by the authenticated user.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/profiles/{profile_uuid}/picture",
      "summary": "Upload a profile picture.",
      "surface": "Public identity API"
    },
    {
      "method": "DELETE",
      "path": "/profiles/{profile_uuid}/picture",
      "summary": "Delete a profile picture.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/profiles/{profile_uuid}/picture",
      "summary": "Read a profile picture.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/recovery/backup-code",
      "summary": "Recover an account by verifying a backup code.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/account/identities/",
      "summary": "List external identities linked to the authenticated user.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/account/identities/link",
      "summary": "Link an external identity to the authenticated user.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/account/identities/link/start",
      "summary": "Start an OAuth identity-link redirect.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/account/identities/link/callback",
      "summary": "Complete an OAuth identity-link callback.",
      "surface": "Public identity API"
    },
    {
      "method": "DELETE",
      "path": "/account/identities/{identity_uuid}",
      "summary": "Unlink an external identity from the authenticated user.",
      "surface": "Public identity API"
    },
    {
      "method": "POST",
      "path": "/user-settings/",
      "summary": "Create or update user settings.",
      "surface": "Public identity API"
    },
    {
      "method": "GET",
      "path": "/user-settings/",
      "summary": "Read user settings.",
      "surface": "Public identity API"
    },
    {
      "method": "DELETE",
      "path": "/user-settings/",
      "summary": "Delete user settings.",
      "surface": "Public identity API"
    }
  ]
};

export default group;
