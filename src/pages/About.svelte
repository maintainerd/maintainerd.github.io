<script>
  import PageHero from "@/components/ui/PageHero.svelte";
</script>

<svelte:head>
  <title>About | Maintainerd</title>
  <meta name="description" content="About Maintainerd and its self-hostable cloud platform direction." />
  <link rel="canonical" href="https://maintainerd.github.io/about/" />
</svelte:head>

<main>
  <PageHero
    title="About Maintainerd"
    lede="Maintainerd is an open-source cloud platform for teams that want service building blocks they can run, inspect, and own."
    breadcrumbs={[{ href: "/", label: "Maintainerd" }, { label: "About" }]}
  />

  <section class="section">
    <div class="two-col">
      <div>
        <p class="eyebrow">What it is</p>
        <h2>Cloud building blocks you run and own.</h2>
        <p class="section-lede">
          Maintainerd is a growing suite of self-hostable, cloud-style services. Each one runs standalone on
          infrastructure you already have, and they connect through a shared control plane when you want them
          to. No vendor lock-in and no rebuild — you keep the runtime, the data, and the keys.
        </p>
      </div>
      <div class="compact-grid" style="grid-template-columns:1fr">
        <article class="capability"><h3>Self-hostable</h3><p>Bring your own Docker host, Kubernetes cluster, or database. Licensed under Apache-2.0.</p></article>
        <article class="capability"><h3>Standalone first</h3><p>Adopt one service or the whole platform. Each stands on its own.</p></article>
        <article class="capability"><h3>Open &amp; inspectable</h3><p>Source, APIs, and container images are public. Nothing is a black box.</p></article>
      </div>
    </div>
  </section>

  <section class="band">
    <div class="section" style="padding-top:56px;padding-bottom:56px">
      <p class="eyebrow">Where it is today</p>
      <h2>Auth is live. More is on the way.</h2>
      <p class="section-lede">
        Auth — the identity and access service (OAuth 2.0 / OIDC, hosted login, MFA, federation, and
        multi-tenancy) — is available now as a single container. M9d-Core and the runtime providers
        (Docker, Kubernetes, database, storage, and more) are planned. Follow along and help shape it on GitHub.
      </p>
      <div class="feature-links">
        <a href="/services/">Browse services</a>
        <a href="https://github.com/maintainerd" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
    </div>
  </section>
</main>
