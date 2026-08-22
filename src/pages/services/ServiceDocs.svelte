<script>
  import { onMount, tick } from "svelte";
  import PageHero from "@/components/ui/PageHero.svelte";
  import { loadDocContent, hasDoc } from "@/utils/docContent.js";
  import { renderMarkdown } from "@/utils/renderMarkdown.js";

  // The documentation reader every service's doc set uses. The collection name
  // selects the content directory in docContent.js; the groups and sections come
  // from that service's file under src/data/.
  export let collection;
  export let groups = [];
  export let sections = [];
  export let defaultSlug;
  export let navLabel = "Documentation";
  export let breadcrumbs = [];
  export let hash = "";

  let activeSlug = defaultSlug;
  let activeContent = "";
  let isLoading = true;
  let contentRequest = 0;
  let initialized = false;

  const findSection = (slug) => sections.find((section) => section.slug === slug);

  $: requestedSlug = hash.replace(/^#/, "") || defaultSlug;
  $: if (initialized && requestedSlug !== activeSlug && hasDoc(collection, requestedSlug)) {
    selectSection(requestedSlug, false);
  }
  $: activeSection = findSection(activeSlug) || sections[0];
  $: rendered = activeContent ? renderMarkdown(activeContent) : "";

  async function selectSection(slug, updateHash = true) {
    if (!hasDoc(collection, slug)) return;
    const requestId = ++contentRequest;
    activeSlug = slug;
    isLoading = true;
    const content = await loadDocContent(collection, slug);
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
      const nextSlug = window.location.hash.replace(/^#/, "") || defaultSlug;
      if (nextSlug !== activeSlug && hasDoc(collection, nextSlug)) {
        selectSection(nextSlug, false);
      }
    };

    initialized = true;
    selectSection(hasDoc(collection, requestedSlug) ? requestedSlug : defaultSlug, false);
    window.addEventListener("hashchange", syncFromHash);

    return () => {
      window.removeEventListener("hashchange", syncFromHash);
    };
  });
</script>

<main>
  <PageHero compact {breadcrumbs} />

  <section class="section docs-layout">
    <aside class="side-nav docs-nav" aria-label={navLabel}>
      {#each groups as group}
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
