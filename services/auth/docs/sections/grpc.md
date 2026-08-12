# gRPC

Auth exposes gRPC for selected control-plane and service integration paths.

## Runtime

- gRPC server on `:50051`.
- Optional TLS.
- Optional mTLS.
- gRPC health service.
- gRPC reflection.
- Auth interceptor.
- Logging interceptor.
- Recovery interceptor.
- OpenTelemetry stats handler.

## Protobuf Services

- `SetupService`
- `TenantService`
- `TenantSettingService`
- `UserService`
- `UserProfileService`
- `ClientService`
- `APIService`
- `PermissionService`
- `PolicyService`
- `RoleService`
- `ServiceService`
- `AuthorizationService`
- `OAuthIntrospectionService`
- `WorkloadIdentityFederationService`

## Configuration

Use `GRPC_ENABLED` for standalone gRPC. Use `CONTROL_PLANE_ENABLED` when the control plane owns the machine surface. Control-plane mode forces mTLS.
