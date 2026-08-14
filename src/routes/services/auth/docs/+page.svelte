<script>
  import { onMount } from "svelte";
  import { marked } from "marked";
  import PageHero from "$lib/components/PageHero.svelte";
  import { loadDocContent } from "$lib/data/doc-content.js";
  import { docAnchors, docsGroups, docsSections, findDocSection } from "$lib/data/docs.js";

  export let data;

  let activeSlug = docsSections[0]?.slug || "introduction";
  let activeContent = data.initialContent || "";
  let isLoading = false;

  $: activeSection = findDocSection(activeSlug) || docsSections[0];
  $: rendered = activeContent ? marked.parse(activeContent, { gfm: true }) : "";

  async function selectSection(slug, pushState = true) {
    if (!findDocSection(slug)) return;
    activeSlug = slug;
    isLoading = true;
    if (pushState && typeof history !== "undefined") {
      history.replaceState(null, "", `#${slug}`);
    }
    activeContent = await loadDocContent(slug) || `# ${activeSection.title}\n\nThis section is not available yet.`;
    isLoading = false;
  }

  onMount(() => {
    const readHash = () => {
      const slug = window.location.hash.replace(/^#/, "");
      if (slug && findDocSection(slug)) {
        selectSection(slug, false);
      }
    };

    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  });
</script>

<svelte:head>
  <title>Auth Documentation | Maintainerd</title>
  <meta name="description" content="Documentation for Auth, the Maintainerd identity and access management service." />
  <link rel="canonical" href="https://maintainerd.github.io/services/auth/docs/" />
  <meta property="og:title" content="Auth Documentation | Maintainerd" />
  <meta property="og:description" content="Documentation for Auth, the Maintainerd identity and access management service." />
  <meta property="og:url" content="https://maintainerd.github.io/services/auth/docs/" />
  <meta property="og:image" content="https://maintainerd.github.io/assets/auth-console-identity-provider.png" />
</svelte:head>

<main>
  <PageHero
    eyebrow="Auth docs"
    title="Configure Maintainerd Auth for production."
    lede="Set up HTTPS hostnames, tenants, clients, identity providers, registration, login, account settings, events, and security controls."
    breadcrumbs={[
      { href: "/", label: "Maintainerd" },
      { href: "/services/", label: "Services" },
      { href: "/services/auth/docs/", label: "Auth" },
      { label: "Docs" }
    ]}
  />

  <section class="section docs-layout">
    <div class="hash-targets" aria-hidden="true">
      {#each docAnchors as slug}
        <span id={slug}></span>
      {/each}
    </div>
    <aside class="side-nav docs-nav" aria-label="Auth documentation">
      {#each docsGroups as group}
        <span class="side-nav-label">{group.label}</span>
        {#each group.sections as [slug, title]}
          <a
            href={`#${slug}`}
            aria-current={activeSlug === slug ? "page" : undefined}
            on:click|preventDefault={() => selectSection(slug)}
          >
            {title}
          </a>
        {/each}
      {/each}
    </aside>
    <article class="content-flow markdown-panel">
      {#if isLoading}
        <p class="loading-text">Loading section...</p>
      {:else if activeSection}
        <div class="markdown-content">{@html rendered}</div>
      {/if}
    </article>
  </section>
</main>
