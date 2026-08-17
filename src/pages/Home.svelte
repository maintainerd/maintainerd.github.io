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
        <p class="eyebrow">Open-source · self-hostable</p>
        <h1>The cloud platform you run and own.</h1>
        <p class="lede">
          Maintainerd is an open-source suite of the product and platform services teams rebuild for every
          app — identity, storage, messaging, databases, and more — packaged so you can run and own them
          yourself. Bring your own infrastructure and Maintainerd gives you the services that sit on top.
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
        <h2>Maintainerd runs the platform. You bring the infrastructure.</h2>
        <p class="section-lede">
          Maintainerd is the software that turns infrastructure into a complete cloud platform. Point it at
          whatever you run — on-premise, your own servers, or any cloud provider — and it gives you the
          services to build and operate on top. Same platform, anywhere you host it.
        </p>
      </div>
      <div class="compact-grid" style="grid-template-columns:1fr">
        <article class="capability"><h3>Standalone first</h3><p>Adopt only what you need. Each service runs on its own.</p></article>
        <article class="capability"><h3>Self-hostable</h3><p>You keep the runtime, the data, and the keys. Apache-2.0, no lock-in.</p></article>
        <article class="capability"><h3>Ecosystem-ready</h3><p>Connect services through a shared control plane when you want one.</p></article>
      </div>
    </div>
  </section>
</main>
