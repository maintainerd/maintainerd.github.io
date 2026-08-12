# Glossary

## Auth

Maintainerd's identity and access service.

## Console

The administrator and operator UI.

## Identity UI

The hosted user-facing UI for login, consent, MFA, account, and OAuth browser flows.

## Tenant

The root ownership boundary for identity, access, configuration, and operational state.

## Client

An OAuth application registration.

## Provider

An identity source used for authentication or federation.

## Role

A collection of permissions assigned to users.

## Permission

A named operation used by route guards and authorization policy.

## Policy

A document-based authorization rule set assigned to services.

## Service

A workload or application surface that needs authorization decisions.

## Policy Bundle

The cached set of policies a service can fetch from Auth.

## Step-Up

A fresh MFA proof required before sensitive actions.

## Workload Identity

Federated service identity for non-browser workloads.

## Standalone Mode

The default Auth runtime. REST, OAuth/OIDC, frontends, workers, probes, and metrics run without exposing the Core provisioning listener.

## Control Plane

The mTLS gRPC machine surface Core uses to provision Auth instances and IAM resources.

## System Instance

The single Auth instance that acts as the Maintainerd ecosystem IAM and can answer Core provisioning RPCs.

## Regular Instance

An application-scoped Auth instance provisioned by Core. It can run Auth for an app but does not answer system provisioning RPCs.

## DPoP

OAuth sender-constrained token mode where the client proves possession of a key on token and HTTP resource requests.
