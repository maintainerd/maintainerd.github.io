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
        <p class="eyebrow">Open-source · vendor-neutral</p>
        <h1>Cloud services you run your way.</h1>
        <p class="lede">
          Maintainerd is a growing suite of open-source services — identity, containers, databases, storage,
          and more. Run each one built-in and self-hosted, or let Maintainerd manage your AWS, Azure, or GCP
          equivalent behind the scenes. One dashboard, no lock-in.
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
          Maintainerd is not a cloud provider — it sits on top of the infrastructure you already have.
          Every service ships with a built-in engine you can self-host, and can instead drive the
          equivalent on AWS, Azure, GCP, or bare metal from the same dashboard.
        </p>
      </div>
      <div class="compact-grid" style="grid-template-columns:1fr">
        <article class="capability"><h3>Built-in or bring your cloud</h3><p>Self-host the built-in engine, or manage your provider's equivalent behind the scenes.</p></article>
        <article class="capability"><h3>Standalone first</h3><p>Adopt only the services you need. Each runs on its own, or connects through Core.</p></article>
        <article class="capability"><h3>Yours to own</h3><p>You keep the runtime, the data, and the keys. Apache-2.0, no lock-in.</p></article>
      </div>
    </div>
  </section>
</main>
