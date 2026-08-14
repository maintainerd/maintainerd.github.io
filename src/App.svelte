<script>
  import { onMount } from "svelte";
  import Footer from "@/components/layout/Footer.svelte";
  import Header from "@/components/layout/Header.svelte";
  import AboutPage from "@/pages/About.svelte";
  import AuthApiPage from "@/pages/services/AuthApi.svelte";
  import AuthDocsPage from "@/pages/services/AuthDocs.svelte";
  import BlogPage from "@/pages/Blog.svelte";
  import CommunityPage from "@/pages/Community.svelte";
  import HomePage from "@/pages/Home.svelte";
  import NotFoundPage from "@/pages/NotFound.svelte";
  import ServiceDetailPage from "@/pages/services/ServiceDetail.svelte";
  import ServicesPage from "@/pages/services/Services.svelte";
  import { findService } from "@/data/services.js";
  import { location, startRouter } from "@/utils/router.js";

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
