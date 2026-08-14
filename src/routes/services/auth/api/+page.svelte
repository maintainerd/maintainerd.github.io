<script>
  import PageHero from "$lib/components/PageHero.svelte";

  const endpointFamilies = [
    { method: "POST", methodKind: "post", title: "Setup", summary: "Bootstrap platform setup, create the initial tenant, and prepare the Auth service for use." },
    { method: "GET", methodKind: "", title: "Tenants", summary: "Manage tenant records, memberships, ownership rules, and organization-level access." },
    { method: "POST", methodKind: "post", title: "OAuth", summary: "Authorize clients, exchange tokens, handle consent, silent auth, and end-session flows." },
    { method: "GET", methodKind: "", title: "Users", summary: "Operate users, account status, profile data, sessions, and security state." },
    { method: "POST", methodKind: "post", title: "Clients", summary: "Register OAuth clients, first-party clients, redirect URIs, secrets, grants, and policies." },
    { method: "GET", methodKind: "", title: "Policies", summary: "Read roles, permissions, policy bundles, and service-to-service authorization rules." },
    { method: "POST", methodKind: "post", title: "MFA", summary: "Enroll, challenge, verify, recover, and enforce multifactor authentication." },
    { method: "DEL", methodKind: "delete", title: "Sessions", summary: "Clear local sessions, revoke tokens, and coordinate logout across identity surfaces." }
  ];
</script>

<svelte:head>
  <title>Auth API Reference | Maintainerd</title>
  <meta name="description" content="API reference overview for Auth endpoint families and integration contracts." />
  <link rel="canonical" href="https://maintainerd.github.io/services/auth/api/" />
  <meta property="og:title" content="Auth API Reference | Maintainerd" />
  <meta property="og:description" content="API reference overview for Auth endpoint families and integration contracts." />
  <meta property="og:url" content="https://maintainerd.github.io/services/auth/api/" />
  <meta property="og:image" content="https://maintainerd.github.io/assets/m9d-auth-console.png" />
</svelte:head>

<main>
  <PageHero
    eyebrow="API reference"
    title="Auth API"
    lede="A product-level reference shell for Auth endpoint families. This page is ready for exact OpenAPI expansion as the public release stabilizes."
    breadcrumbs={[
      { href: "/", label: "Maintainerd" },
      { href: "/services/auth/docs/", label: "Auth" },
      { label: "API" }
    ]}
  />

  <section class="section docs-layout">
    <aside class="side-nav">
      <a href="/services/auth/docs/">Docs</a>
      <a aria-current="page" href="/services/auth/api/">API reference</a>
      <a href="/services/">All services</a>
    </aside>
    <div class="content-flow">
      <h2>Endpoint families</h2>
      <div class="doc-grid">
        {#each endpointFamilies as endpoint}
          <article class="api-box">
            <h3><span class={`api-method ${endpoint.methodKind}`}>{endpoint.method}</span>{endpoint.title}</h3>
            <p>{endpoint.summary}</p>
          </article>
        {/each}
      </div>
      <h2>Reference direction</h2>
      <p class="section-lede">
        As Auth approaches public release, this page should link to generated OpenAPI, SDK examples,
        OAuth flow diagrams, response schemas, and service-auth examples for other Maintainerd services.
      </p>
    </div>
  </section>
</main>
