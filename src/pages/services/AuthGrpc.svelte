<script>
  import { ChevronDown } from "@lucide/svelte";
  import { onMount, tick } from "svelte";
  import PageHero from "@/components/ui/PageHero.svelte";
  import { defaultGrpcGroupSlug, findGrpcGroupNav, grpcGroupNav, grpcPackage, grpcRpcCount, protoBaseUrl, protoRawBaseUrl } from "@/data/authGrpc.js";

  const baseSlug = "overview";
  const rpcLabel = (count) => `${count} RPC${count === 1 ? "" : "s"}`;
  const requiredLabel = (value) => (value ? "Required" : "Optional");
  const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const rpcId = (groupSlug, rpc) => `${groupSlug}-${slugify(rpc.name)}`;
  const formatExample = (value) => (typeof value === "string" ? value : JSON.stringify(value, null, 2));

  const rpcAuthLabel = (rpc) => {
    if (rpc.auth === "bootstrap") return "bootstrap token";
    if (rpc.auth === "infrastructure") return "no auth";
    if (rpc.permission === "") return "service token";
    return `service token · ${rpc.permission}`;
  };

  const protoLinks = (group) => {
    if (!group.proto) return null;
    if (group.protoExternal) {
      return {
        view: group.proto,
        download: group.proto.replace("/blob/", "/raw/")
      };
    }
    return {
      view: `${protoBaseUrl}/${group.proto}`,
      download: `${protoRawBaseUrl}/${group.proto}`
    };
  };

  let activeSlug = baseSlug;
  let activeGroup = null;
  let activeRpcId = "";

  const normalizeSlug = (slug) => {
    if (slug === baseSlug) return baseSlug;
    const group = findGrpcGroupNav(slug);
    if (group) return group.slug;
    return grpcGroupNav.find((item) => slug.startsWith(`${item.slug}-`))?.slug || baseSlug;
  };

  const loadActiveGroup = async (slug, shouldScroll = false) => {
    const nextSlug = normalizeSlug(slug);
    activeSlug = nextSlug;

    if (nextSlug === baseSlug) {
      activeGroup = null;
      activeRpcId = "";

      if (shouldScroll) {
        await tick();
        document.getElementById(nextSlug)?.scrollIntoView({ block: "start" });
      }

      return;
    }

    activeGroup = findGrpcGroupNav(nextSlug);
    activeRpcId = activeGroup.rpcs.some((rpc) => rpcId(activeGroup.slug, rpc) === slug) ? slug : "";

    if (shouldScroll) {
      await tick();
      document.getElementById(activeRpcId || nextSlug)?.scrollIntoView({ block: "start" });
    }
  };

  const toggleRpc = async (rpc) => {
    if (!activeGroup) return;
    const nextRpcId = rpcId(activeGroup.slug, rpc);
    activeRpcId = activeRpcId === nextRpcId ? "" : nextRpcId;
    history.replaceState(null, "", `#${activeRpcId || activeGroup.slug}`);

    if (activeRpcId) {
      await tick();
      document.getElementById(activeRpcId)?.scrollIntoView({ block: "nearest" });
    }
  };

  const hashSlug = () => {
    const rawHash = window.location.hash.replace(/^#/, "");

    try {
      return decodeURIComponent(rawHash);
    } catch {
      return rawHash;
    }
  };

  onMount(() => {
    loadActiveGroup(hashSlug() || baseSlug, Boolean(window.location.hash));

    const handleHashChange = () => {
      loadActiveGroup(hashSlug(), true);
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  });
</script>

<svelte:head>
  <title>Auth gRPC Reference | Maintainerd</title>
  <meta name="description" content="gRPC service reference for Auth's control plane: services, RPCs, and message contracts." />
  <link rel="canonical" href="https://maintainerd.github.io/services/auth/grpc/" />
</svelte:head>

<main>
  <PageHero
    compact
    breadcrumbs={[
      { href: "/", label: "Maintainerd" },
      { href: "/services/auth/docs/", label: "Auth" },
      { label: "gRPC" }
    ]}
  />

  <section class="section docs-layout">
    <aside class="side-nav api-nav" aria-label="Auth gRPC services">
      <span class="side-nav-label">Reference</span>
      <a href={`#${baseSlug}`} noroute aria-current={activeSlug === baseSlug ? "location" : undefined}>
        <span>Overview</span>
      </a>
      <span class="side-nav-label">Services</span>
      {#each grpcGroupNav as group}
        <a href={`#${group.slug}`} noroute aria-current={activeSlug === group.slug ? "location" : undefined}>
          <span>{group.label}</span>
          <small>{group.rpcCount}</small>
        </a>
      {/each}
    </aside>
    <div class="content-flow">
      {#if activeSlug === baseSlug}
        <section class="api-group" id={baseSlug}>
          <div class="api-group-head">
            <div>
              <p class="eyebrow">Reference</p>
              <h2>gRPC Overview</h2>
              <p class="section-lede">
                The Auth control plane is exposed as a gRPC surface under the {grpcPackage} package. It is the
                privileged provisioning API used by Maintainerd Core and trusted platform automation to configure
                tenants, users, clients, IAM resources, and federation. The reference lists every service and RPC;
                per-RPC contracts are documented service by service.
              </p>
            </div>
          </div>
          <div class="endpoint-list">
            <div class="endpoint-row">
              <strong>Package</strong>
              <code>{grpcPackage}</code>
              <p>All services live under this protobuf package.</p>
            </div>
            <div class="endpoint-row">
              <strong>Services</strong>
              <code>{grpcGroupNav.length}</code>
              <p>gRPC services registered on the control plane.</p>
            </div>
            <div class="endpoint-row">
              <strong>RPCs</strong>
              <code>{grpcRpcCount}</code>
              <p>Total RPC methods across every service.</p>
            </div>
          </div>
        </section>
        <section class="api-group" id="authentication">
          <div class="api-group-head">
            <div>
              <p class="eyebrow">How it works</p>
              <h2>Authentication &amp; Authorization</h2>
              <p class="section-lede">
                The gRPC control plane is an opt-in, machine-to-machine surface (GRPC_ENABLED=true). Every call
                passes through a chain of recovery, logging, timeout, authentication, and audit interceptors, and
                every RPC is classified into one of three authentication modes below.
              </p>
            </div>
          </div>
          <div class="endpoint-list">
            <div class="endpoint-row">
              <strong>Transport</strong>
              <code>mTLS</code>
              <p>When CONTROL_PLANE_ENABLED=true the listener requires mutual TLS: the server cert, key, and the CA that signs
              the caller's client certificate are mandatory, and client certificates are required and verified. The control
              plane refuses to serve without it.</p>
            </div>
            <div class="endpoint-row">
              <strong>Bootstrap</strong>
              <code>x-setup-token metadata</code>
              <p>All SetupService RPCs authenticate with the pre-shared SETUP_BOOTSTRAP_TOKEN sent as the x-setup-token
              metadata key — no accounts exist at first boot. The token is compared in constant time, rate limited, and the
              setup service locks every bootstrap RPC once the system tenant is active.</p>
            </div>
            <div class="endpoint-row">
              <strong>Service tokens</strong>
              <code>authorization: Bearer &lt;access_token&gt;</code>
              <p>Everything else requires an access token in the authorization metadata. Access tokens only — ID tokens are
              refused — and DPoP-bound tokens cannot be used over gRPC. The token's service principal (svc claim) is resolved
              and its policy bundle is evaluated against the permission mapped to the RPC (shown on every RPC card).</p>
            </div>
            <div class="endpoint-row">
              <strong>Default deny</strong>
              <code>PermissionDenied</code>
              <p>Any maintainerd.auth.v1 method not explicitly classified is refused. Health and reflection are the only
              unauthenticated infrastructure calls.</p>
            </div>
            <div class="endpoint-row">
              <strong>Certificate binding</strong>
              <code>RFC 8705</code>
              <p>Clients with a registered mTLS certificate thumbprint must present their token over a connection bound to
              that exact certificate, so a stolen token is not a plain bearer credential.</p>
            </div>
            <div class="endpoint-row">
              <strong>Step-up</strong>
              <code>acr=2</code>
              <p>Dangerous mutations (secret access, tenant deletion, user status changes, and similar) additionally require a
              step-up token carrying an elevated acr claim.</p>
            </div>
            <div class="endpoint-row">
              <strong>On-behalf-of</strong>
              <code>on_behalf_of claim</code>
              <p>RPCs that mutate state on behalf of a human require the token to carry the acting user's UUID in the
              on_behalf_of claim. The actor is both the audit attribution and the subject of the membership and escalation
              guards, and it must live in the token's own tenant.</p>
            </div>
            <div class="endpoint-row">
              <strong>Instance split</strong>
              <code>CONTROL_PLANE_ENABLED</code>
              <p>Administrative services are only registered when the control plane is enabled. Runtime deployments serve only
              the PDP, token introspection, and the read-only peer calls (policy bundle, default tenant, user reads).</p>
            </div>
            <div class="endpoint-row">
              <strong>Rate limits</strong>
              <code>600 req/min</code>
              <p>Per-principal rate limiting (600 requests per minute by default) applies after authentication; throttled
              callers receive ResourceExhausted.</p>
            </div>
          </div>
        </section>
        <section class="api-group" id="errors">
          <div class="api-group-head">
            <div>
              <p class="eyebrow">Convention</p>
              <h2>Error Model</h2>
              <p class="section-lede">
                Errors follow standard gRPC status codes. Validation failures carry a BadRequest detail with per-field
                violations; throttled callers receive a RetryInfo detail with the backoff delay.
              </p>
            </div>
          </div>
          <div class="endpoint-list">
            <div class="endpoint-row">
              <strong>Unauthenticated</strong>
              <code>16</code>
              <p>Missing, malformed, or invalid credentials: no bearer token, wrong bootstrap token, expired access token, or a DPoP-bound token over gRPC.</p>
            </div>
            <div class="endpoint-row">
              <strong>PermissionDenied</strong>
              <code>7</code>
              <p>The caller's policy bundle does not allow the mapped permission, the method is unclassified, or a boundary check (tenant, instance role, on-behalf-of) failed.</p>
            </div>
            <div class="endpoint-row">
              <strong>InvalidArgument</strong>
              <code>3</code>
              <p>Request validation failed; the BadRequest detail lists the violating fields.</p>
            </div>
            <div class="endpoint-row">
              <strong>AlreadyExists</strong>
              <code>6</code>
              <p>A unique constraint is violated (duplicate name or record), or a locked bootstrap RPC was called after setup completed.</p>
            </div>
            <div class="endpoint-row">
              <strong>NotFound</strong>
              <code>5</code>
              <p>The referenced record does not exist in the caller's scope.</p>
            </div>
            <div class="endpoint-row">
              <strong>FailedPrecondition</strong>
              <code>9</code>
              <p>A control-plane-only method was called on an instance that has the control plane disabled.</p>
            </div>
            <div class="endpoint-row">
              <strong>ResourceExhausted</strong>
              <code>8</code>
              <p>Rate limit exceeded; RetryInfo carries the backoff delay.</p>
            </div>
            <div class="endpoint-row">
              <strong>Internal</strong>
              <code>13</code>
              <p>An unexpected server-side failure.</p>
            </div>
          </div>
        </section>
      {:else if activeGroup}
        {#key activeGroup}
          {@const links = protoLinks(activeGroup)}
          <section class="api-group" id={activeGroup.slug}>
            <div class="api-group-head">
              <div>
                <p class="eyebrow">{rpcLabel(activeGroup.rpcCount)}</p>
                <div class="api-group-title-row">
                  <h2>{activeGroup.label}</h2>
                  {#if links}
                    <div class="proto-links">
                      <a href={links.download} target="_blank" rel="noopener noreferrer">Download .proto</a>
                    </div>
                  {/if}
                </div>
                <p class="section-lede">{activeGroup.description}</p>
              </div>
            </div>
          <div class="endpoint-list">
            {#each activeGroup.rpcs as rpc}
              {@const currentRpcId = rpcId(activeGroup.slug, rpc)}
              {@const isRpcOpen = activeRpcId === currentRpcId}
              <article class:is-open={isRpcOpen} class="endpoint-card" id={currentRpcId}>
                <button
                  class="endpoint-summary"
                  type="button"
                  aria-expanded={isRpcOpen}
                  aria-controls={`${currentRpcId}-detail`}
                  onclick={() => toggleRpc(rpc)}
                >
                  <span class="endpoint-summary-main">
                    <span class="endpoint-line">
                      <span class="api-method rpc">{rpc.name}</span>
                      <code>{rpc.request}</code>
                      <span class="rpc-arrow" aria-hidden="true">→</span>
                      <code>{rpc.response}</code>
                    </span>
                    <span class="endpoint-summary-text">{rpc.details ? rpc.details.overview : "Detailed contract coming soon."}</span>
                    <span class="rpc-badges">
                      <span class="surface-pill">{rpcAuthLabel(rpc)}</span>
                      {#if rpc.stepUp}
                        <span class="surface-pill is-stepup">step-up required</span>
                      {/if}
                      {#if rpc.actorRequired}
                        <span class="surface-pill is-stepup">on_behalf_of required</span>
                      {/if}
                    </span>
                  </span>
                  <span class="accordion-indicator" aria-hidden="true">
                    <ChevronDown size={18} strokeWidth={2.25} />
                  </span>
                </button>
                {#if rpc.details && isRpcOpen}
                  <div class="endpoint-detail" id={`${currentRpcId}-detail`}>
                    <p>{rpc.details.overview}</p>
                    {#if rpc.details.notes?.length}
                      <ul class="detail-notes">
                        {#each rpc.details.notes as note}
                          <li>{note}</li>
                        {/each}
                      </ul>
                    {/if}

                    {#if rpc.details.requestFields?.length}
                      <div class="detail-block">
                        <h3>Request — {rpc.request}</h3>
                        <div class="detail-table">
                          <table class="request-table">
                            <colgroup>
                              <col class="name-column" />
                              <col class="value-column" />
                              <col class="required-column" />
                              <col class="description-column" />
                            </colgroup>
                            <thead>
                              <tr>
                                <th>Field</th>
                                <th>Type</th>
                                <th>Required</th>
                                <th>Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {#each rpc.details.requestFields as field}
                                <tr>
                                  <td data-label="Field"><code>{field.name}</code></td>
                                  <td data-label="Type">{field.type}</td>
                                  <td data-label="Required">{requiredLabel(field.required)}</td>
                                  <td data-label="Description">{field.description}</td>
                                </tr>
                              {/each}
                            </tbody>
                          </table>
                        </div>
                        {#if rpc.details.requestExample !== undefined}
                          <pre><code>{formatExample(rpc.details.requestExample)}</code></pre>
                        {/if}
                      </div>
                    {:else if rpc.request !== "Empty"}
                      <div class="detail-block">
                        <h3>Request — {rpc.request}</h3>
                        <p>The request message carries no fields.</p>
                        {#if rpc.details.requestExample !== undefined}
                          <pre><code>{formatExample(rpc.details.requestExample)}</code></pre>
                        {/if}
                      </div>
                    {/if}

                    {#if rpc.details.responseFields?.length}
                      <div class="detail-block">
                        <h3>Response — {rpc.response}</h3>
                        <div class="detail-table">
                          <table class="request-table">
                            <colgroup>
                              <col class="name-column" />
                              <col class="value-column" />
                              <col class="description-column" />
                            </colgroup>
                            <thead>
                              <tr>
                                <th>Field</th>
                                <th>Type</th>
                                <th>Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {#each rpc.details.responseFields as field}
                                <tr>
                                  <td data-label="Field"><code>{field.name}</code></td>
                                  <td data-label="Type">{field.type}</td>
                                  <td data-label="Description">{field.description}</td>
                                </tr>
                              {/each}
                            </tbody>
                          </table>
                        </div>
                        {#if rpc.details.responseExample !== undefined}
                          <pre><code>{formatExample(rpc.details.responseExample)}</code></pre>
                        {/if}
                      </div>
                    {/if}

                    {#if rpc.details.errors?.length}
                      <div class="detail-block">
                        <h3>Errors</h3>
                        <div class="response-list">
                          {#each rpc.details.errors as error}
                            <article class="response-card">
                              <h4>{error.code}</h4>
                              <p>{error.description}</p>
                            </article>
                          {/each}
                        </div>
                      </div>
                    {/if}
                  </div>
                {/if}
              </article>
            {/each}
          </div>
          </section>
        {/key}
      {/if}
    </div>
  </section>
</main>
