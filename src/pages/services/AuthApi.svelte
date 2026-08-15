<script>
  import PageHero from "@/components/ui/PageHero.svelte";
  import { apiBaseUrls, apiEndpointCount, apiGroups } from "@/data/authApi.js";

  const methodClass = (method) => method.toLowerCase();
  const endpointLabel = (count) => `${count} endpoint${count === 1 ? "" : "s"}`;
  const requiredLabel = (value) => (value ? "Required" : "Optional");
  const prettyJson = (value) => JSON.stringify(value, null, 2);
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
        <a href={`#${group.slug}`} noroute>
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
                {#if endpoint.details}
                  <div class="endpoint-detail">
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
                        <table>
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
                                <td><code>{header.name}</code></td>
                                <td><code>{header.value}</code></td>
                                <td>{requiredLabel(header.required)}</td>
                                <td>{header.description}</td>
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
                          <table>
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
                                  <td><code>{field.name}</code></td>
                                  <td>{field.type}</td>
                                  <td>{requiredLabel(field.required)}</td>
                                  <td>{field.description}</td>
                                </tr>
                              {/each}
                            </tbody>
                          </table>
                        </div>
                      {/if}
                      {#if endpoint.details.requestBody.example}
                        <pre><code>{prettyJson(endpoint.details.requestBody.example)}</code></pre>
                      {/if}
                    </div>

                    <div class="detail-block">
                      <h3>Responses</h3>
                      <div class="response-list">
                        {#each endpoint.details.responses as response}
                          <article class="response-card">
                            <h4>{response.status}</h4>
                            <p>{response.description}</p>
                            <pre><code>{prettyJson(response.example)}</code></pre>
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
      {/each}
    </div>
  </section>
</main>
