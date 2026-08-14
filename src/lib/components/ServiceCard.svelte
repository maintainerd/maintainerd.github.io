<script>
  export let service;
  export let external = false;
</script>

{#if service.href}
  <a class="service-card" href={service.href}>
    <slot name="kicker" />
    <h3>{service.shortName || service.name}</h3>
    <p>{service.summary}</p>
    <slot name="footer" />
  </a>
{:else}
  <article class="service-card">
    <slot name="kicker" />
    <h3>{service.name}</h3>
    <p>{service.summary}</p>
    <slot name="footer" />
  </article>
{/if}
