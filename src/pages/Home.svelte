<script>
  import ButtonLink from "@/components/ui/ButtonLink.svelte";
  import ServiceCard from "@/components/ui/ServiceCard.svelte";
  import { maintainerdServices } from "@/data/services.js";
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
          <ButtonLink href="/services/" variant="primary">Browse services</ButtonLink>
          <ButtonLink href="https://github.com/maintainerd" external>GitHub</ButtonLink>
        </div>
      </div>
    </div>
  </section>

  <section class="band">
    <div class="section" id="services" style="padding-top:64px;padding-bottom:64px">
      <p class="eyebrow">Service catalog</p>
      <h2>Everything, in one place.</h2>
      <p class="section-lede">Independent services that stand alone or connect through Core. Browse the catalog to see what is available and what is planned.</p>
      <div class="service-grid">
        {#each maintainerdServices as service}
          <ServiceCard {service} href={service.href || `/services/${service.slug}/`} />
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
