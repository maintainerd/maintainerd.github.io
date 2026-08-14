<script>
  import { onMount } from "svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Header from "$lib/components/Header.svelte";
  import AboutPage from "$lib/pages/AboutPage.svelte";
  import AuthApiPage from "$lib/pages/AuthApiPage.svelte";
  import AuthDocsPage from "$lib/pages/AuthDocsPage.svelte";
  import BlogPage from "$lib/pages/BlogPage.svelte";
  import CommunityPage from "$lib/pages/CommunityPage.svelte";
  import HomePage from "$lib/pages/HomePage.svelte";
  import NotFoundPage from "$lib/pages/NotFoundPage.svelte";
  import ServiceDetailPage from "$lib/pages/ServiceDetailPage.svelte";
  import ServicesPage from "$lib/pages/ServicesPage.svelte";
  import { findService } from "$lib/data/services.js";
  import { location, startRouter } from "$lib/router.js";

  let current = { path: "/", hash: "" };

  const unsubscribe = location.subscribe((value) => {
    current = value;
  });

  onMount(() => {
    const stopRouter = startRouter();
    return () => {
      unsubscribe();
      stopRouter();
    };
  });

  $: serviceMatch = current.path.match(/^\/services\/([^/]+)\/$/);
  $: service = serviceMatch ? findService(serviceMatch[1]) : null;
  $: isKnownRoute =
    current.path === "/" ||
    current.path === "/services/" ||
    current.path === "/community/" ||
    current.path === "/blog/" ||
    current.path === "/about/" ||
    current.path === "/services/auth/docs/" ||
    current.path === "/services/auth/api/" ||
    Boolean(service);
</script>

<div class="site-shell">
  <Header pathname={current.path} />
  {#if current.path === "/"}
    <HomePage />
  {:else if current.path === "/services/"}
    <ServicesPage />
  {:else if current.path === "/community/"}
    <CommunityPage />
  {:else if current.path === "/blog/"}
    <BlogPage />
  {:else if current.path === "/about/"}
    <AboutPage />
  {:else if current.path === "/services/auth/docs/"}
    <AuthDocsPage hash={current.hash} />
  {:else if current.path === "/services/auth/api/"}
    <AuthApiPage />
  {:else if service}
    <ServiceDetailPage {service} />
  {:else}
    <NotFoundPage />
  {/if}
  {#if isKnownRoute}
    <Footer />
  {/if}
</div>
