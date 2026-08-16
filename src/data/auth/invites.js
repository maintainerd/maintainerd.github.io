// Endpoint details for this Auth API section.

const publicIdentity = "Public identity API";
const management = "Internal management API";

const jsonContentHeader = {
  "name": "Content-Type",
  "value": "application/json",
  "required": true,
  "description": "Required when the endpoint accepts a JSON request body."
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

const noAuthHeader = {
  "name": "Authorization",
  "value": "Not required",
  "required": false,
  "description": "The public invite-context endpoint is unauthenticated. Context is resolved from the signed invite token only."
};

const publicReadHeaders = [jsonAcceptHeader, noAuthHeader];
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
  "description": "The JSON body failed validation.",
  "example": {
    "success": false,
    "error": "Validation failed",
    "details": {
      "Email": "Email is required"
    }
  }
};

const invalidBodyResponse = {
  "status": "400 Bad Request",
  "description": "The request body was not valid JSON.",
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

const invalidInviteUuidResponse = {
  "status": "400 Bad Request",
  "description": "The invite_uuid path value is not a valid UUID.",
  "example": {
    "success": false,
    "error": "Invalid invite UUID"
  }
};

const inviteRowExample = {
  "invite_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "invited_email": "alex@example.com",
  "status": "pending",
  "expires_at": "2026-08-18T09:00:00Z",
  "used_at": null,
  "created_at": "2026-08-15T09:00:00Z",
  "registration_flow_id": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
  "registration_flow_name": "customer-signup"
};

const group = {
  "slug": "invites",
  "label": "Invites",
  "description": "Invitation management APIs plus the public invite context endpoint used before invited-user registration.",
  "endpoints": [
    {
      "method": "GET",
      "path": "/invite/",
      "summary": "List invitations.",
      "surface": management,
      "details": {
        "overview": "Lists all invitations for the authenticated tenant. The response is a plain array (not paginated) with each invite's status, invited email, expiry, and optional registration-flow projection.",
        "notes": [
          "Requires the user:invite permission.",
          "Results are scoped to the authenticated caller's tenant.",
          "The registration_flow fields appear only when the invite was sent against a specific flow."
        ],
        "parameters": [],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The tenant's invitations.",
            "example": {
              "success": true,
              "data": [inviteRowExample],
              "message": "Invites retrieved successfully"
            }
          },
          tenantMissingResponse,
          forbiddenResponse,
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/invite/{invite_uuid}",
      "summary": "Read one invitation.",
      "surface": management,
      "details": {
        "overview": "Returns one invitation by UUID, scoped to the authenticated tenant. Includes status, invited email, expiry, and the registration-flow projection when one is attached.",
        "notes": [
          "Requires the user:invite permission.",
          "Invitations in another tenant respond as not found.",
          "The invite token itself is never returned by management endpoints."
        ],
        "parameters": [
          {
            "name": "invite_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the invitation."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The invitation was retrieved.",
            "example": {
              "success": true,
              "data": inviteRowExample,
              "message": "Invite retrieved successfully"
            }
          },
          tenantMissingResponse,
          invalidInviteUuidResponse,
          forbiddenResponse,
          {
            "status": "404 Not Found",
            "description": "No invitation matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "invite not found"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/invite/",
      "summary": "Send an invitation.",
      "surface": management,
      "details": {
        "overview": "Sends an invitation email to join the tenant. The invite is signed, single-use, and expires after 72 hours. When a registration flow is attached, the invited user registers through that flow and receives its roles on signup.",
        "notes": [
          "Requires the user:invite permission and step-up authentication.",
          "The email is validated for format (3-100 characters).",
          "The attached registration flow must exist, be active, and belong to the tenant.",
          "Roles granted through the invite flow cannot include roles the inviter does not possess — invites cannot be used to self-escalate.",
          "The invite token is stored as a digest and is never readable back.",
          "callback_url, when provided, is validated and embedded in the signed invite link."
        ],
        "parameters": [],
        "headers": jwtJsonHeaders,
        "requestBody": {
          "type": "JSON object",
          "description": "Invitation payload.",
          "fields": [
            {
              "name": "email",
              "type": "string",
              "required": true,
              "description": "Email address of the invited user. 3-100 characters, valid email format."
            },
            {
              "name": "registration_flow_id",
              "type": "string (UUID)",
              "required": false,
              "description": "Registration flow the invited user will onboard through. Defaults to standard registration when omitted."
            },
            {
              "name": "callback_url",
              "type": "string (URL)",
              "required": false,
              "description": "URL the invited user returns to after registration. Validated and embedded in the signed invite link."
            }
          ],
          "example": {
            "email": "alex@example.com",
            "registration_flow_id": "d8b4f2e0-3c5b-4f0a-9c1d-7e2f1a9b4c3d",
            "callback_url": "https://app.example.com/welcome"
          }
        },
        "responses": [
          {
            "status": "200 OK",
            "description": "The invitation was sent.",
            "example": {
              "success": true,
              "data": null,
              "message": "Invite sent successfully"
            }
          },
          tenantMissingResponse,
          userMissingResponse,
          forbiddenResponse,
          stepUpResponse,
          validationErrorResponse,
          invalidBodyResponse,
          {
            "status": "404 Not Found",
            "description": "The referenced registration flow (or its client) does not exist in the tenant.",
            "example": {
              "success": false,
              "error": "registration flow not found"
            }
          },
          {
            "status": "409 Conflict",
            "description": "A pending invitation already exists for this email in the tenant.",
            "example": {
              "success": false,
              "error": "an invitation for this email is already pending"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "POST",
      "path": "/invite/{invite_uuid}/resend",
      "summary": "Resend an invitation.",
      "surface": management,
      "details": {
        "overview": "Regenerates the invite token and re-sends the invitation email, resetting the expiry window to a fresh 72 hours. Only pending invitations can be resent.",
        "notes": [
          "Requires the user:invite permission and step-up authentication.",
          "A used, revoked, or expired invitation cannot be resent.",
          "The previous invite link stops working the moment the token is regenerated."
        ],
        "parameters": [
          {
            "name": "invite_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the pending invitation."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The invitation was re-sent with a fresh token and expiry.",
            "example": {
              "success": true,
              "data": null,
              "message": "Invite resent successfully"
            }
          },
          tenantMissingResponse,
          invalidInviteUuidResponse,
          forbiddenResponse,
          stepUpResponse,
          {
            "status": "404 Not Found",
            "description": "No invitation matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "invite not found"
            }
          },
          {
            "status": "409 Conflict",
            "description": "The invitation is not pending (used, revoked, or expired) and cannot be resent.",
            "example": {
              "success": false,
              "error": "invite is used and cannot be resent"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "DELETE",
      "path": "/invite/{invite_uuid}",
      "summary": "Revoke an invitation.",
      "surface": management,
      "details": {
        "overview": "Revokes a pending invitation. The signed invite link stops working immediately and the email address can be invited again afterwards.",
        "notes": [
          "Requires the user:invite permission.",
          "Only pending invitations can be revoked; used, revoked, or expired invitations respond as a conflict.",
          "The operation is audited."
        ],
        "parameters": [
          {
            "name": "invite_uuid",
            "in": "path",
            "type": "string (UUID)",
            "required": true,
            "description": "UUID of the invitation to revoke."
          }
        ],
        "headers": jwtReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The invitation was revoked.",
            "example": {
              "success": true,
              "data": null,
              "message": "Invite revoked successfully"
            }
          },
          tenantMissingResponse,
          invalidInviteUuidResponse,
          forbiddenResponse,
          {
            "status": "404 Not Found",
            "description": "No invitation matches the UUID in the caller's tenant.",
            "example": {
              "success": false,
              "error": "invite not found"
            }
          },
          {
            "status": "409 Conflict",
            "description": "The invitation is not pending and cannot be revoked.",
            "example": {
              "success": false,
              "error": "invite is used and cannot be revoked"
            }
          },
          internalErrorResponse
        ]
      }
    },
    {
      "method": "GET",
      "path": "/invite",
      "summary": "Read public invitation context from an invite token.",
      "surface": publicIdentity,
      "details": {
        "overview": "The public invite-context endpoint: given the signed invite token from the invitation email, returns what the invited user needs to see before registration — their email, the callback URL, the invite status, and expiry. The hosted identity app calls this to render the invited-user signup form.",
        "notes": [
          "Unauthenticated. The invite token is the only credential and is stored server-side as a digest.",
          "The response echoes back the raw token the caller supplied so the identity app can forward it to registration.",
          "A non-pending or expired invite responds with 410 Gone.",
          "The invite determines the tenant-side invitation context; no tenant parameter is accepted."
        ],
        "parameters": [
          {
            "name": "invite_token",
            "in": "query",
            "type": "string",
            "required": true,
            "description": "Signed invite token from the invitation email link."
          }
        ],
        "headers": publicReadHeaders,
        "requestBody": emptyBody,
        "responses": [
          {
            "status": "200 OK",
            "description": "The invitation context for the pending invite.",
            "example": {
              "success": true,
              "data": {
                "invite_token": "signed-invite-token",
                "email": "alex@example.com",
                "callback_url": "https://app.example.com/welcome",
                "expires_at": "2026-08-18T09:00:00Z",
                "status": "pending"
              },
              "message": "Invite retrieved"
            }
          },
          {
            "status": "400 Bad Request",
            "description": "invite_token is missing from the query string.",
            "example": {
              "success": false,
              "error": "Invite token is required"
            }
          },
          {
            "status": "404 Not Found",
            "description": "The token does not match any invitation.",
            "example": {
              "success": false,
              "error": "invite not found"
            }
          },
          {
            "status": "410 Gone",
            "description": "The invitation has been used, revoked, or expired.",
            "example": {
              "success": false,
              "error": "Invite has expired"
            }
          },
          internalErrorResponse
        ]
      }
    }
  ]
};

export default group;
