<script>
  import { ChevronDown } from "@lucide/svelte";
  import { onMount, tick } from "svelte";
  import PageHero from "@/components/ui/PageHero.svelte";
  import { defaultGrpcGroupSlug, findGrpcGroupNav, grpcGroupNav, grpcPackage, grpcRpcCount } from "@/data/authGrpc.js";

  const baseSlug = "overview";
  const rpcLabel = (count) => `${count} RPC${count === 1 ? "" : "s"}`;
  const requiredLabel = (value) => (value ? "Required" : "Optional");
  const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const rpcId = (groupSlug, rpc) => `${groupSlug}-${slugify(rpc.name)}`;

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
      {:else if activeGroup}
        <section class="api-group" id={activeGroup.slug}>
          <div class="api-group-head">
            <div>
              <p class="eyebrow">{rpcLabel(activeGroup.rpcCount)}</p>
              <h2>{activeGroup.label}</h2>
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
                      </div>
                    {:else if rpc.request !== "Empty"}
                      <div class="detail-block">
                        <h3>Request — {rpc.request}</h3>
                        <p>The request message carries no fields.</p>
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
      {/if}
    </div>
  </section>
</main>
