<script>
  import BrandLogo from "@/components/ui/BrandLogo.svelte";

  export let pathname = "/";
  export let service = null;

  const siteNavItems = [
    { href: "/services/", label: "Services" },
    { href: "/community/", label: "Community" },
    { href: "/about/", label: "About" }
  ];

  let isOpen = false;

  $: navItems = service
    ? [
        { href: service.docsHref || `/services/${service.slug}/`, label: "Docs" },
        { href: service.apiHref || "", label: "API Reference", disabled: !service.apiHref },
        { href: service.grpcHref || "", label: "gRPC Reference", disabled: !service.grpcHref }
      ]
    : siteNavItems;

  $: githubHref = (service && service.githubHref) || "https://github.com/maintainerd";

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
      <a
        class="nav-github"
        href={githubHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        title="GitHub"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
          <path
            d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z"
          />
        </svg>
      </a>
    </div>
  </nav>
</header>
