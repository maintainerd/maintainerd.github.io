<script>
  import PageHero from "@/components/ui/PageHero.svelte";
  import { apiBaseUrls, apiEndpointCount, apiGroups } from "@/data/authApi.js";

  const methodClass = (method) => method.toLowerCase();
  const endpointLabel = (count) => `${count} endpoint${count === 1 ? "" : "s"}`;
</script>

<svelte:head>
  <title>Auth API Reference | Maintainerd</title>
  <meta name="description" content="API reference overview for Auth endpoint families and integration contracts." />
  <link rel="canonical" href="https://maintainerd.github.io/services/auth/api/" />
</svelte:head>

<main>
  <PageHero
    eyebrow="API reference"
    title="Auth API"
    lede={`${apiEndpointCount} Auth API operations grouped by product area. This catalog is the source map for the detailed endpoint reference, including methods, request URLs, headers, bodies, permissions, and status-specific responses.`}
    breadcrumbs={[
      { href: "/", label: "Maintainerd" },
      { href: "/services/auth/docs/", label: "Auth" },
      { label: "API" }
    ]}
  />

  <section class="section docs-layout">
    <aside class="side-nav api-nav" aria-label="Auth API endpoints">
      <a href="/services/auth/docs/">Docs</a>
      <a aria-current="page" href="/services/auth/api/">API reference</a>
      <a href="/services/">All services</a>
      <span class="side-nav-label">Endpoint groups</span>
      {#each apiGroups as group}
        <a href={`#${group.slug}`}>
          <span>{group.label}</span>
          <small>{group.endpoints.length}</small>
        </a>
      {/each}
    </aside>
    <div class="content-flow">
      <div class="callout">
        <h2>Base URLs</h2>
        <p>
          Auth separates public identity traffic from management operations. Endpoint rows below identify the
          surface so developers know which hostname and authentication model apply before using a route.
        </p>
        <div class="endpoint-list compact">
          {#each apiBaseUrls as base}
            <div class="endpoint-row">
              <strong>{base.label}</strong>
              <code>{base.url}</code>
              <p>{base.description}</p>
            </div>
          {/each}
        </div>
      </div>

      {#each apiGroups as group}
        <section class="api-group" id={group.slug}>
          <div class="api-group-head">
            <div>
              <p class="eyebrow">{endpointLabel(group.endpoints.length)}</p>
              <h2>{group.label}</h2>
              <p class="section-lede">{group.description}</p>
            </div>
          </div>
          <div class="endpoint-list">
            {#each group.endpoints as endpoint}
              <article class="endpoint-card">
                <div class="endpoint-line">
                  <span class={`api-method ${methodClass(endpoint.method)}`}>{endpoint.method}</span>
                  <code>{endpoint.path}</code>
                </div>
                <span class="surface-pill">{endpoint.surface}</span>
                <p>{endpoint.summary}</p>
              </article>
            {/each}
          </div>
        </section>
      {/each}
    </div>
  </section>
</main>
