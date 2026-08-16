<script>
  import PageHero from "@/components/ui/PageHero.svelte";
</script>

<svelte:head>
  <title>Community | Maintainerd</title>
  <meta
    name="description"
    content="Get involved with Maintainerd: star the repos, report issues, contribute, and run the services yourself."
  />
  <link rel="canonical" href="https://maintainerd.github.io/community/" />
</svelte:head>

<main>
  <PageHero
    title="Community"
    lede="Maintainerd is open source and early. The best way to help is to run it, tell us what breaks, and shape what gets built next."
    breadcrumbs={[{ href: "/", label: "Maintainerd" }, { label: "Community" }]}
  />

  <section class="section">
    <p class="eyebrow">Get involved</p>
    <h2>Build Maintainerd with us.</h2>
    <p class="section-lede">
      Everything is public — source, APIs, and container images. Whether you file one issue or send a pull
      request, it helps decide what ships next.
    </p>
    <div class="compact-grid">
      <article class="capability">
        <h3>Star &amp; follow on GitHub</h3>
        <p>Watch releases and star the repos to follow progress across the platform.</p>
        <div class="feature-links">
          <a href="https://github.com/maintainerd" target="_blank" rel="noopener noreferrer">GitHub org</a>
        </div>
      </article>
      <article class="capability">
        <h3>Report issues &amp; request features</h3>
        <p>Hit a bug or want something built? Open an issue on the Auth repo — every report counts.</p>
        <div class="feature-links">
          <a href="https://github.com/maintainerd/maintainerd-auth/issues" target="_blank" rel="noopener noreferrer">Open an issue</a>
        </div>
      </article>
      <article class="capability">
        <h3>Contribute</h3>
        <p>Pull requests are welcome. The contributing guide covers the local dev setup and conventions.</p>
        <div class="feature-links">
          <a href="https://github.com/maintainerd/maintainerd-auth/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">Contributing guide</a>
        </div>
      </article>
      <article class="capability">
        <h3>Run Auth</h3>
        <p>Pull the all-in-one image and try the full OAuth 2.0 / OIDC provider on your own machine.</p>
        <div class="feature-links">
          <a href="https://hub.docker.com/r/xreyc/maintainerd-auth" target="_blank" rel="noopener noreferrer">Docker Hub</a>
          <a href="/services/auth/docs/">Get started</a>
        </div>
      </article>
    </div>
  </section>
</main>
