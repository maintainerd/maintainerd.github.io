<script>
  import { onMount, tick } from "svelte";
  import PageHero from "@/components/ui/PageHero.svelte";
  import { docsGroups, docsSections, findDocSection } from "@/data/authDocs.js";
  import { loadDocContent, hasDoc } from "@/utils/docContent.js";
  import { renderMarkdown } from "@/utils/renderMarkdown.js";

  export let hash = "";

  let activeSlug = "introduction";
  let activeContent = "";
  let isLoading = true;
  let contentRequest = 0;
  let initialized = false;

  $: requestedSlug = hash.replace(/^#/, "") || "introduction";
  $: if (initialized && requestedSlug !== activeSlug && hasDoc(requestedSlug)) {
    selectSection(requestedSlug, false);
  }
  $: activeSection = findDocSection(activeSlug) || docsSections[0];
  $: rendered = activeContent ? renderMarkdown(activeContent) : "";

  async function selectSection(slug, updateHash = true) {
    if (!hasDoc(slug)) return;
    const requestId = ++contentRequest;
    activeSlug = slug;
    isLoading = true;
    const content = await loadDocContent(slug);
    if (requestId !== contentRequest) return;
    activeContent = content || `# ${activeSection.title}\n\nThis section is not available yet.`;
    isLoading = false;

    if (updateHash) {
      history.replaceState(null, "", `#${slug}`);
      await tick();
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  }

  onMount(() => {
    const syncFromHash = () => {
      const nextSlug = window.location.hash.replace(/^#/, "") || "introduction";
      if (nextSlug !== activeSlug && hasDoc(nextSlug)) {
        selectSection(nextSlug, false);
      }
    };

    initialized = true;
    selectSection(hasDoc(requestedSlug) ? requestedSlug : "introduction", false);
    window.addEventListener("hashchange", syncFromHash);

    return () => {
      window.removeEventListener("hashchange", syncFromHash);
    };
  });
</script>

<svelte:head>
  <title>Auth Documentation | Maintainerd</title>
  <meta name="description" content="Documentation for Auth, the Maintainerd identity and access management service." />
  <link rel="canonical" href="https://maintainerd.github.io/services/auth/docs/" />
</svelte:head>

<main>
  <PageHero
    compact
    breadcrumbs={[
      { href: "/", label: "Maintainerd" },
      { href: "/services/", label: "Services" },
      { href: "/services/auth/docs/", label: "Auth" },
      { label: "Docs" }
    ]}
  />

  <section class="section docs-layout">
    <aside class="side-nav docs-nav" aria-label="Auth documentation">
      {#each docsGroups as group}
        <span class="side-nav-label">{group.label}</span>
        {#each group.sections as [slug, title]}
          <a
            href={`#${slug}`}
            noroute
            aria-current={activeSlug === slug ? "page" : undefined}
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
