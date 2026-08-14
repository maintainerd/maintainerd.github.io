# gRPC

Auth exposes gRPC for selected service integration paths, and for Core provisioning when the control plane is explicitly enabled.

## Runtime

- gRPC server on `:50051` when enabled.
- TLS in production.
- Optional mTLS for non-control-plane runtime gRPC.
- Mandatory mTLS for control-plane mode.
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

Use `GRPC_ENABLED` for standalone runtime gRPC. Use `CONTROL_PLANE_ENABLED` when Core owns the machine surface. Control-plane mode implies `GRPC_ENABLED=true`, forces mTLS, and requires `GRPC_TLS_CERT_FILE`, `GRPC_TLS_KEY_FILE`, and `GRPC_CLIENT_CA_FILE`.

## Surface Split

Without the control plane, gRPC serves runtime calls such as authorization, token introspection, and user/profile reads. Administrative services are not registered, and mixed user/profile write methods are refused.

With the control plane enabled, Core provisioning services are available. System provisioning RPCs also require `INSTANCE_ROLE=system`; regular instances fail closed and are administered through the console/REST surface.
