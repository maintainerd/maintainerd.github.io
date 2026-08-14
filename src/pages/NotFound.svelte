<script>
  import ButtonLink from "@/components/ui/ButtonLink.svelte";
</script>

<svelte:head>
  <title>Page not found | Maintainerd</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<main>
  <section class="page-hero">
    <div class="section">
      <p class="eyebrow">Not found</p>
      <h1>Page not found.</h1>
      <p class="lede">The page you opened does not exist.</p>
      <div class="actions">
        <ButtonLink href="/services/" variant="primary">Browse services</ButtonLink>
        <ButtonLink href="/">Go home</ButtonLink>
      </div>
    </div>
  </section>
</main>
