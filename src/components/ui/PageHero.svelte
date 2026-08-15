<script>
  export let eyebrow = "";
  export let title;
  export let lede = "";
  export let breadcrumbs = [];
  export let service = false;
  export let compact = false;
</script>

<section class={`${service ? "service-hero" : "page-hero"}${compact ? " compact-hero" : ""}`}>
  <div class="section">
    {#if breadcrumbs.length}
      <div class="breadcrumbs">
        {#each breadcrumbs as crumb}
          {#if crumb.href}
            <a href={crumb.href}>{crumb.label}</a>
          {:else}
            <span>{crumb.label}</span>
          {/if}
          {#if crumb !== breadcrumbs[breadcrumbs.length - 1]}
            <span>/</span>
          {/if}
        {/each}
      </div>
    {/if}
    {#if eyebrow}<p class="eyebrow">{eyebrow}</p>{/if}
    {#if title}<h1>{title}</h1>{/if}
    {#if lede}<p class="lede">{lede}</p>{/if}
    <slot />
  </div>
</section>
