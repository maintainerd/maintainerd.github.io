<script>
  import Badge from "@/components/ui/Badge.svelte";

  export let service;
  export let href = null;
  export let footerLeft = "";
  export let footerRight = "";
  export let status = service.status;
  export let statusKind = service.statusKind;
  export let title = service.shortName || service.name;
  export let icon = service.icon || "";
  export let mark = service.mark || "";
</script>

{#if href}
  <a class="service-card" {href}>
    <div class="service-kicker">
      {#if icon}
        <img class="service-icon" src={icon} alt="" />
      {:else if mark}
        <span class="service-mark">{mark}</span>
      {/if}
      {#if status}
        <Badge kind={statusKind}>{status}</Badge>
      {/if}
    </div>
    <h3>{title}</h3>
    <p>{service.summary}</p>
    {#if footerLeft || footerRight}
      <footer>
        <span>{footerLeft}</span>
        <span class="text-link">{footerRight}</span>
      </footer>
    {/if}
  </a>
{:else}
  <article class="service-card">
    <div class="service-kicker">
      {#if icon}
        <img class="service-icon" src={icon} alt="" />
      {:else if mark}
        <span class="service-mark">{mark}</span>
      {/if}
      {#if status}
        <Badge kind={statusKind}>{status}</Badge>
      {/if}
    </div>
    <h3>{title}</h3>
    <p>{service.summary}</p>
    {#if footerLeft || footerRight}
      <footer>
        <span>{footerLeft}</span>
        <span class="text-link">{footerRight}</span>
      </footer>
    {/if}
  </article>
{/if}
