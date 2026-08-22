<script>
  import Badge from "@/components/ui/Badge.svelte";
  import ButtonLink from "@/components/ui/ButtonLink.svelte";
  import EmptyState from "@/components/ui/EmptyState.svelte";
  import PageHero from "@/components/ui/PageHero.svelte";
  import Terminal from "@/components/ui/Terminal.svelte";
  import { serviceNav } from "@/data/services.js";

  export let service;

  $: hasPublishedReference = Boolean(service.docsHref || service.apiHref);
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
    lede={hasPublishedReference ? service.description : ""}
    breadcrumbs={[
      { href: "/", label: "Maintainerd" },
      { href: "/services/", label: "Services" },
      { label: service.name }
    ]}
  >
    {#if hasPublishedReference}
      <div class="actions">
        <ButtonLink href={`/services/${service.slug}/#start`} variant="primary">Start here</ButtonLink>
        {#if service.docsHref}
          <ButtonLink href={service.docsHref}>Documentation</ButtonLink>
        {/if}
        {#if service.apiHref}
          <ButtonLink href={service.apiHref}>API reference</ButtonLink>
        {/if}
      </div>
    {/if}
  </PageHero>

  {#if hasPublishedReference}
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
        <div class="callout">
          <h3>Documentation</h3>
          <p>
            {service.name} already has dedicated documentation{service.apiHref ? " and API pages" : ""}.
            {service.docsBlurb || ""}
          </p>
          <div class="feature-links">
            {#if service.docsHref}<a href={service.docsHref}>Open docs</a>{/if}
            {#if service.apiHref}<a href={service.apiHref}>Open API reference</a>{/if}
          </div>
        </div>
      </div>
    </section>
  {:else}
    <section class="section">
      <EmptyState
        title={`${service.shortName || service.name} page is empty for now.`}
        message="Detailed documentation, API reference, setup notes, and examples will be added when this service is ready."
      />
    </section>
  {/if}
</main>
