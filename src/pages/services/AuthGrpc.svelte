<script>
  import { onMount, tick } from "svelte";
  import PageHero from "@/components/ui/PageHero.svelte";
  import { defaultGrpcGroupSlug, findGrpcGroupNav, grpcGroupNav, grpcPackage, grpcRpcCount } from "@/data/authGrpc.js";

  const baseSlug = "overview";
  const rpcLabel = (count) => `${count} RPC${count === 1 ? "" : "s"}`;

  let activeSlug = baseSlug;
  let activeGroup = null;

  const normalizeSlug = (slug) => {
    if (slug === baseSlug) return baseSlug;
    const group = findGrpcGroupNav(slug);
    return group ? group.slug : baseSlug;
  };

  const loadActiveGroup = async (slug, shouldScroll = false) => {
    const nextSlug = normalizeSlug(slug);
    activeSlug = nextSlug;
    activeGroup = nextSlug === baseSlug ? null : findGrpcGroupNav(nextSlug);

    if (shouldScroll) {
      await tick();
      document.getElementById(nextSlug)?.scrollIntoView({ block: "start" });
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
              <article class="endpoint-card">
                <div class="endpoint-summary is-static">
                  <span class="endpoint-summary-main">
                    <span class="endpoint-line">
                      <span class="api-method rpc">{rpc.name}</span>
                      <code>{rpc.request}</code>
                      <span class="rpc-arrow" aria-hidden="true">→</span>
                      <code>{rpc.response}</code>
                    </span>
                    <span class="endpoint-summary-text">Detailed contract coming soon.</span>
                  </span>
                </div>
              </article>
            {/each}
          </div>
        </section>
      {/if}
    </div>
  </section>
</main>
