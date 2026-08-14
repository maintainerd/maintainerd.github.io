<script>
  import { brandAssets } from "@/data/assets.js";

  export let href = "/";
  export let label = "Maintainerd";
  export let showText = true;
</script>

<a class="brand" {href} aria-label={label}>
  <img src={brandAssets.mark} alt="" />
  {#if showText}
    <span>{label}</span>
  {/if}
</a>
