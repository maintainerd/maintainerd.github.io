<script>
  import BrandLogo from "@/components/ui/BrandLogo.svelte";

  export let pathname = "/";
  export let service = null;

  const siteNavItems = [
    { href: "/services/", label: "Services" },
    { href: "/community/", label: "Community" },
    { href: "/blog/", label: "Blog" },
    { href: "/about/", label: "About" }
  ];

  let isOpen = false;

  $: navItems = service
    ? [
        { href: service.docsHref || `/services/${service.slug}/`, label: "Docs" },
        { href: service.apiHref || "", label: "API Reference", disabled: !service.apiHref },
        { href: service.githubHref || "https://github.com/maintainerd", label: "Github", external: true }
      ]
    : siteNavItems;

  const isActive = (href) => pathname === href || pathname.startsWith(href);
</script>

<header class="topbar">
  <nav class="nav" aria-label="Primary">
    <BrandLogo />
    <button
      class="menu-button"
      type="button"
      aria-label="Open navigation"
      aria-expanded={isOpen}
      onclick={() => (isOpen = !isOpen)}
    >
      <span></span>
    </button>
    <div class:is-open={isOpen} class="nav-links">
      {#each navItems as item}
        {#if item.disabled}
          <span class="nav-link is-disabled" aria-disabled="true">{item.label}</span>
        {:else}
          <a
            class="nav-link"
            aria-current={!item.external && isActive(item.href) ? "page" : undefined}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
          >
            {item.label}
          </a>
        {/if}
      {/each}
      {#if !service}
        <a class="nav-link-muted" href="https://github.com/maintainerd" target="_blank" rel="noopener noreferrer">Github</a>
      {/if}
    </div>
  </nav>
</header>
