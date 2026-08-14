<script>
  import PageHero from "$lib/components/PageHero.svelte";
</script>

<svelte:head>
  <title>Blog | Maintainerd</title>
  <meta name="description" content="Maintainerd blog." />
  <link rel="canonical" href="https://maintainerd.github.io/blog/" />
</svelte:head>

<main>
  <PageHero title="Blog" breadcrumbs={[{ href: "/", label: "Maintainerd" }, { label: "Blog" }]} />
</main>
