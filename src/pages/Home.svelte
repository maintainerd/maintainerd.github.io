<script>
  import Terminal from "@/components/ui/Terminal.svelte";
  import { maintainerdServices } from "@/data/services.js";

  const auth = maintainerdServices.find((service) => service.slug === "auth");
</script>

<svelte:head>
  <title>Maintainerd | Open-source cloud platform</title>
  <meta
    name="description"
    content="Maintainerd is an open-source cloud platform: self-hostable services for identity, storage, messaging, databases, jobs, observability, billing, and more."
  />
  <link rel="canonical" href="https://maintainerd.github.io/" />
</svelte:head>

<main>
  <section class="hero">
    <div class="hero-inner">
      <div class="hero-copy">
        <p class="eyebrow">Open-source cloud platform</p>
        <h1>Cloud services you host and own.</h1>
        <p class="lede">
          Maintainerd is a growing suite of self-hostable services: identity, storage, messaging, databases,
          jobs, and more. Adopt a single service or run the whole platform on infrastructure you already control.
        </p>
        <div class="hero-actions">
          <a class="button primary" href="/services/">Browse services</a>
          <a class="button secondary" href="/services/auth/docs/">Auth · v0.1.1</a>
          <a class="button secondary" href="https://github.com/maintainerd" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
    </div>
  </section>

  {#if auth}
    <section class="section">
      <p class="eyebrow">Available now</p>
      <h2>Auth</h2>
      <p class="section-lede">The first service is shipping.</p>
      <div class="feature" style="margin-top:24px">
        <img src={auth.icon} alt="" />
        <div>
          <div class="meta">
            <h3 style="margin:0">Auth</h3>
            <span class="badge version">{auth.status}</span>
          </div>
          <p style="color:var(--muted);margin:0">{auth.description}</p>
          <Terminal title="Container image" command={auth.command} />
          <div class="feature-links">
            <a href="/services/auth/docs/">Docs</a>
            <a href="/services/auth/api/">API</a>
            <a href={auth.dockerHref} target="_blank" rel="noopener noreferrer">Docker Hub</a>
            <a href={auth.githubHref} target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </div>
    </section>
  {/if}

  <section class="band">
    <div class="section" id="services" style="padding-top:64px;padding-bottom:64px">
      <p class="eyebrow">Service catalog</p>
      <h2>Everything, in one place.</h2>
      <p class="section-lede">Independent services that stand alone or connect through Core. Everything past Auth is on the roadmap.</p>
      <div class="service-grid">
        {#each maintainerdServices as service}
          <a class="service-card" href={service.href || `/services/${service.slug}/`}>
            <div class="service-kicker">
              <img class="service-icon" src={service.icon} alt="" />
              <span class={`badge ${service.statusKind}`}>{service.status}</span>
            </div>
            <h3>{service.shortName || service.name}</h3>
            <p>{service.summary}</p>
          </a>
        {/each}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="two-col">
      <div>
        <p class="eyebrow">How it works</p>
        <h2>Own the runtime. Skip the rebuild.</h2>
        <p class="section-lede">
          Maintainerd is not a cloud provider. Bring your own Docker host, Kubernetes cluster, or database:
          each service runs on top of what you already have.
        </p>
      </div>
      <div class="compact-grid" style="grid-template-columns:1fr">
        <article class="capability"><h3>Standalone first</h3><p>Adopt only the services you need. Each runs on its own.</p></article>
        <article class="capability"><h3>Self-hostable</h3><p>You keep the runtime, the data, and the keys. Apache-2.0.</p></article>
        <article class="capability"><h3>Connected when you want</h3><p>Link services through Core for a shared control plane.</p></article>
      </div>
    </div>
  </section>
</main>
