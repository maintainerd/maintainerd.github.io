# Runtime Modes

Auth can run as a standalone IAM service, as a standalone service with selected gRPC runtime APIs, or as a Maintainerd ecosystem instance managed by Core.

## Standalone Mode

Standalone mode is the default. With `CONTROL_PLANE_ENABLED` unset and `GRPC_ENABLED` unset, Auth serves REST, OAuth/OIDC, the console, the hosted identity UI, health checks, metrics, and background workers, but it does not bind the gRPC listener.

Use this mode when an organization runs Auth as its own identity provider and administers it through the console and REST API.

## Runtime gRPC Mode

Set `GRPC_ENABLED=true` when peer services need machine APIs without giving an orchestrator the provisioning surface. In this mode Auth serves runtime gRPC services such as authorization decisions, token introspection, and user/profile reads.

Administrative gRPC services are not registered when the control plane is off. Mixed user/profile write methods are refused, so enabling the runtime listener does not turn the deployment into a provisioning target.

## Control-Plane Mode

Set `CONTROL_PLANE_ENABLED=true` when Core owns this Auth instance through the machine control plane. This implies `GRPC_ENABLED=true`, forces mTLS, and enables provisioning RPCs.

Control-plane mode has two instance roles:

- `INSTANCE_ROLE=system`: the ecosystem system IAM. It may serve Core provisioning RPCs.
- `INSTANCE_ROLE=regular`: an application-scoped Auth instance provisioned by Core. It is managed through its console/REST surface and must not answer system provisioning RPCs.

`INSTANCE_ROLE` is configuration fixed at process startup. It is not stored in the database and cannot be changed by an API call.

## Choosing A Mode

- Single Auth deployment for your own app: standalone.
- Multiple services need policy checks or introspection over gRPC: runtime gRPC.
- Maintainerd Core provisions Auth instances and IAM resources: control-plane mode.
