<script>
  import { ChevronDown } from "@lucide/svelte";
  import { onMount, tick } from "svelte";
  import PageHero from "@/components/ui/PageHero.svelte";
  import { apiBaseUrls, apiGroupNav, findApiGroupNav, loadApiGroup } from "@/data/authApi.js";

  const methodClass = (method) => method.toLowerCase();
  const endpointLabel = (count) => `${count} endpoint${count === 1 ? "" : "s"}`;
  const requiredLabel = (value) => (value ? "Required" : "Optional");
  const formatExample = (value) => (typeof value === "string" ? value : JSON.stringify(value, null, 2));
  const baseUrlsSlug = "base-urls";
  const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const endpointId = (groupSlug, endpoint) => `${groupSlug}-${methodClass(endpoint.method)}-${slugify(endpoint.path)}`;

  let activeSlug = baseUrlsSlug;
  let activeGroup = null;
  let activeEndpointId = "";
  let loadingGroup = false;
  let loadRequestId = 0;

  const normalizeSlug = (slug) => {
    if (slug === baseUrlsSlug) return baseUrlsSlug;
    const group = findApiGroupNav(slug);
    if (group) return group.slug;
    return apiGroupNav.find((item) => slug.startsWith(`${item.slug}-`))?.slug || baseUrlsSlug;
  };

  const loadActiveGroup = async (slug, shouldScroll = false) => {
    const nextSlug = normalizeSlug(slug);
    const requestId = ++loadRequestId;

    activeSlug = nextSlug;

    if (nextSlug === baseUrlsSlug) {
      activeGroup = null;
      activeEndpointId = "";
      loadingGroup = false;

      if (shouldScroll) {
        await tick();
        document.getElementById(nextSlug)?.scrollIntoView({ block: "start" });
      }

      return;
    }

    loadingGroup = true;

    const group = await loadApiGroup(nextSlug);

    if (requestId !== loadRequestId) {
      return;
    }

    activeGroup = group;
    activeEndpointId = group.endpoints.some((endpoint) => endpointId(group.slug, endpoint) === slug) ? slug : "";
    loadingGroup = false;

    if (shouldScroll) {
      await tick();
      document.getElementById(activeEndpointId || nextSlug)?.scrollIntoView({ block: "start" });
    }
  };

  const toggleEndpoint = async (endpoint) => {
    if (!activeGroup) return;
    const nextEndpointId = endpointId(activeGroup.slug, endpoint);
    activeEndpointId = activeEndpointId === nextEndpointId ? "" : nextEndpointId;
    history.replaceState(null, "", `#${activeEndpointId || activeGroup.slug}`);

    if (activeEndpointId) {
      await tick();
      document.getElementById(activeEndpointId)?.scrollIntoView({ block: "nearest" });
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
    loadActiveGroup(hashSlug() || baseUrlsSlug, Boolean(window.location.hash));

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
  <title>Auth API Reference | Maintainerd</title>
  <meta name="description" content="API reference overview for Auth endpoint families and integration contracts." />
  <link rel="canonical" href="https://maintainerd.github.io/services/auth/api/" />
</svelte:head>

<main>
  <PageHero
    compact
    breadcrumbs={[
      { href: "/", label: "Maintainerd" },
      { href: "/services/auth/docs/", label: "Auth" },
      { label: "API" }
    ]}
  />

  <section class="section docs-layout">
    <aside class="side-nav api-nav" aria-label="Auth API endpoints">
      <span class="side-nav-label">Reference</span>
      <a href={`#${baseUrlsSlug}`} noroute aria-current={activeSlug === baseUrlsSlug ? "location" : undefined}>
        <span>Base URLs</span>
      </a>
      <span class="side-nav-label">Endpoint groups</span>
      {#each apiGroupNav as group}
        <a href={`#${group.slug}`} noroute aria-current={activeSlug === group.slug ? "location" : undefined}>
          <span>{group.label}</span>
          <small>{group.endpointCount}</small>
        </a>
      {/each}
    </aside>
    <div class="content-flow">
      {#if activeSlug === baseUrlsSlug}
        <section class="api-group" id={baseUrlsSlug}>
          <div class="api-group-head">
            <div>
              <p class="eyebrow">Reference</p>
              <h2>Base URLs</h2>
              <p class="section-lede">
                Auth separates public identity traffic from management operations. Use the base URL that matches
                the endpoint surface before appending the documented path.
              </p>
            </div>
          </div>
          <div class="endpoint-list">
            {#each apiBaseUrls as base}
              <div class="endpoint-row">
                <strong>{base.label}</strong>
                <code>{base.url}</code>
                <p>{base.description}</p>
              </div>
            {/each}
          </div>
        </section>
      {:else if loadingGroup && !activeGroup}
        <section class="api-group">
          <div class="api-group-head">
            <div>
              <p class="eyebrow">Loading</p>
              <h2>Loading API section</h2>
              <p class="section-lede">Preparing the selected endpoint group.</p>
            </div>
          </div>
        </section>
      {:else if activeGroup}
        <section class="api-group" id={activeGroup.slug}>
          <div class="api-group-head">
            <div>
              <p class="eyebrow">{endpointLabel(activeGroup.endpoints.length)}</p>
              <h2>{activeGroup.label}</h2>
              <p class="section-lede">{activeGroup.description}</p>
            </div>
          </div>
          <div class="endpoint-list">
            {#each activeGroup.endpoints as endpoint}
              {@const currentEndpointId = endpointId(activeGroup.slug, endpoint)}
              {@const isEndpointOpen = activeEndpointId === currentEndpointId}
              <article class:is-open={isEndpointOpen} class="endpoint-card" id={currentEndpointId}>
                <button
                  class="endpoint-summary"
                  type="button"
                  aria-expanded={isEndpointOpen}
                  aria-controls={`${currentEndpointId}-detail`}
                  onclick={() => toggleEndpoint(endpoint)}
                >
                  <span class="endpoint-summary-main">
                    <span class="endpoint-line">
                      <span class={`api-method ${methodClass(endpoint.method)}`}>{endpoint.method}</span>
                      <code>{endpoint.path}</code>
                    </span>
                    <span class="endpoint-summary-text">{endpoint.summary}</span>
                    <span class="surface-pill">{endpoint.surface}</span>
                  </span>
                  <span class="accordion-indicator" aria-hidden="true">
                    <ChevronDown size={18} strokeWidth={2.25} />
                  </span>
                </button>
                {#if endpoint.details && isEndpointOpen}
                  <div class="endpoint-detail" id={`${currentEndpointId}-detail`}>
                    <p>{endpoint.details.overview}</p>
                    {#if endpoint.details.notes?.length}
                      <ul class="detail-notes">
                        {#each endpoint.details.notes as note}
                          <li>{note}</li>
                        {/each}
                      </ul>
                    {/if}

                    <div class="detail-block">
                      <h3>Headers</h3>
                      <div class="detail-table">
                        <table class="header-table">
                          <colgroup>
                            <col class="name-column" />
                            <col class="value-column" />
                            <col class="required-column" />
                            <col class="description-column" />
                          </colgroup>
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Value</th>
                              <th>Required</th>
                              <th>Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {#each endpoint.details.headers as header}
                              <tr>
                                <td data-label="Name"><code>{header.name}</code></td>
                                <td data-label="Value"><code>{header.value}</code></td>
                                <td data-label="Required">{requiredLabel(header.required)}</td>
                                <td data-label="Description">{header.description}</td>
                              </tr>
                            {/each}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div class="detail-block">
                      <h3>Request Body</h3>
                      <p>{endpoint.details.requestBody.description}</p>
                      {#if endpoint.details.requestBody.fields.length}
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
                              {#each endpoint.details.requestBody.fields as field}
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
                      {/if}
                      {#if endpoint.details.requestBody.example}
                        <pre><code>{formatExample(endpoint.details.requestBody.example)}</code></pre>
                      {/if}
                    </div>

                    <div class="detail-block">
                      <h3>Responses</h3>
                      <div class="response-list">
                        {#each endpoint.details.responses as response}
                          <article class="response-card">
                            <h4>{response.status}</h4>
                            <p>{response.description}</p>
                            <pre><code>{formatExample(response.example)}</code></pre>
                          </article>
                        {/each}
                      </div>
                    </div>
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
