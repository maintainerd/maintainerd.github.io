<script>
  export let pathname = "/";

  const navItems = [
    { href: "/services/", label: "Services" },
    { href: "/community/", label: "Community" },
    { href: "/blog/", label: "Blog" },
    { href: "/about/", label: "About" }
  ];

  let isOpen = false;

  const isActive = (href) => pathname === href || pathname.startsWith(href);
</script>

<header class="topbar">
  <nav class="nav" aria-label="Primary">
    <a class="brand" href="/">
      <img src="/assets/maintainerd-mark.svg" alt="" />
      <span>Maintainerd</span>
    </a>
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
        <a class="nav-link" aria-current={isActive(item.href) ? "page" : undefined} href={item.href}>{item.label}</a>
      {/each}
      <a class="nav-link-muted" href="https://github.com/maintainerd" target="_blank" rel="noopener noreferrer">GitHub</a>
    </div>
  </nav>
</header>
