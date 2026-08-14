<script>
  import PageHero from "$lib/components/PageHero.svelte";
</script>

<svelte:head>
  <title>About | Maintainerd</title>
  <meta name="description" content="About Maintainerd and its self-hostable cloud platform direction." />
  <link rel="canonical" href="https://maintainerd.github.io/about/" />
  <meta property="og:title" content="About | Maintainerd" />
  <meta property="og:url" content="https://maintainerd.github.io/about/" />
</svelte:head>

<main>
  <PageHero
    title="About Maintainerd"
    lede="Maintainerd is an open-source cloud platform for teams that want service building blocks they can run, inspect, and own."
    breadcrumbs={[{ href: "/", label: "Maintainerd" }, { label: "About" }]}
  />
</main>
