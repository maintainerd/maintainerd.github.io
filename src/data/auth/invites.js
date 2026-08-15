// Endpoint details for this Auth API section.

const group = {
  "slug": "invites",
  "label": "Users and Invites",
  "description": "Invitation management APIs plus the public invite context endpoint used before invited-user registration.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/invite/",
      "summary": "List invitations.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/invite/{invite_uuid}",
      "summary": "Read one invitation.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/invite/",
      "summary": "Send an invitation.",
      "surface": "Internal management API"
    },
    {
      "method": "POST",
      "path": "/invite/{invite_uuid}/resend",
      "summary": "Resend an invitation.",
      "surface": "Internal management API"
    },
    {
      "method": "DELETE",
      "path": "/invite/{invite_uuid}",
      "summary": "Revoke an invitation.",
      "surface": "Internal management API"
    },
    {
      "method": "GET",
      "path": "/invite",
      "summary": "Read public invitation context from an invite token.",
      "surface": "Public identity API"
    }
  ]
};

export default group;
