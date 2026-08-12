# Access Control

Auth combines RBAC with IAM-style services, APIs, permissions, and policy documents so users, clients, API keys, and services can be authorized consistently.

## Roles And Permissions

Roles collect permissions. They can be assigned directly to users, assigned through registration flows, or pre-assigned through invite flows.

Permissions describe operations on registered APIs, such as a user operation, policy operation, or service operation.

## Policies

Policies provide a document-based authorization layer. The evaluator uses default deny behavior, explicit deny precedence, wildcard matching, and service-policy assignments.

Policy history helps operators understand how authorization rules changed over time.

## API Keys

API keys support non-browser access patterns that do not need a user session. They can be scoped to APIs and permissions so access remains explicit.

## Management Authorization

Management routes use permission middleware. Console actions are not only UI actions; they map back to Auth's own authorization model.

