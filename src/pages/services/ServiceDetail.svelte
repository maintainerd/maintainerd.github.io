<script>
  import Badge from "@/components/ui/Badge.svelte";
  import ButtonLink from "@/components/ui/ButtonLink.svelte";
  import PageHero from "@/components/ui/PageHero.svelte";
  import Terminal from "@/components/ui/Terminal.svelte";
  import { serviceNav } from "@/data/services.js";

  export let service;
</script>

<svelte:head>
  <title>{service.name} | Maintainerd Services</title>
  <meta name="description" content={`${service.name} is a Maintainerd service. ${service.headline}`} />
  <link rel="canonical" href={`https://maintainerd.github.io/services/${service.slug}/`} />
</svelte:head>

<main>
  <PageHero
    service
    eyebrow={service.eyebrow}
    title={service.name}
    lede={service.description}
    breadcrumbs={[
      { href: "/", label: "Maintainerd" },
      { href: "/services/", label: "Services" },
      { label: service.name }
    ]}
  >
    <div class="actions">
      <ButtonLink href={`/services/${service.slug}/#start`} variant="primary">Start here</ButtonLink>
      {#if service.docsHref}
        <ButtonLink href={service.docsHref}>Documentation</ButtonLink>
      {:else}
        <ButtonLink href="/services/auth/docs/">Documentation model</ButtonLink>
      {/if}
    </div>
  </PageHero>

  <section class="section service-layout" id="start">
    <aside class="side-nav" aria-label="Services">
      {#each serviceNav as item}
        <a aria-current={item.href === `/services/${service.slug}/` || item.href === service.docsHref ? "page" : undefined} href={item.href}>
          {item.label}
        </a>
      {/each}
    </aside>
    <div class="content-flow">
      <Badge kind={service.statusKind}>{service.status}</Badge>
      <h2>{service.headline}</h2>
      <p class="section-lede">{service.description}</p>
      <Terminal title="Container image" command={service.command} />
      <div class="compact-grid">
        {#each service.features as feature}
          <article class="capability">
            <h3>{feature}</h3>
            <p>Available through the service contract and designed to connect back into Core.</p>
          </article>
        {/each}
      </div>
      {#if service.docsHref || service.apiHref}
        <div class="callout">
          <h3>Documentation</h3>
          <p>
            Auth already has dedicated documentation and API pages. Use them for setup, client configuration,
            identity providers, OAuth/OIDC integration, tenant management, security controls, and troubleshooting.
          </p>
          <div class="feature-links">
            {#if service.docsHref}<a href={service.docsHref}>Open docs</a>{/if}
            {#if service.apiHref}<a href={service.apiHref}>Open API reference</a>{/if}
          </div>
        </div>
      {:else}
        <div class="callout">
          <h3>Docs and API shape</h3>
          <p>
            Every Maintainerd service page is ready to grow into the same pattern: overview, installation,
            configuration, operational guide, API reference, and examples. Auth already has dedicated documentation
            and API pages.
          </p>
        </div>
      {/if}
    </div>
  </section>
</main>
