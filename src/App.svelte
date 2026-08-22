<script>
  import { links, Route, Router } from "svelte-routing";
  import Footer from "@/components/layout/Footer.svelte";
  import Header from "@/components/layout/Header.svelte";
  import AboutPage from "@/pages/About.svelte";
  import AuthApiPage from "@/pages/services/AuthApi.svelte";
  import AuthDocsPage from "@/pages/services/AuthDocs.svelte";
  import AuthGrpcPage from "@/pages/services/AuthGrpc.svelte";
  import CommunityPage from "@/pages/Community.svelte";
  import HomePage from "@/pages/Home.svelte";
  import NotFoundPage from "@/pages/NotFound.svelte";
  import SecretDocsPage from "@/pages/services/SecretDocs.svelte";
  import ServiceDetailPage from "@/pages/services/ServiceDetail.svelte";
  import ServicesPage from "@/pages/services/Services.svelte";
  import { findService } from "@/data/services.js";

  const normalizePath = (path) => {
    if (!path || path === "/") return "/";
    return path.endsWith("/") ? path : `${path}/`;
  };

  const serviceForPath = (path) => {
    const serviceMatch = normalizePath(path).match(/^\/services\/([^/]+)\/$/);
    return serviceMatch ? findService(serviceMatch[1]) : null;
  };

  const serviceForHeaderPath = (path) => {
    const serviceMatch = normalizePath(path).match(/^\/services\/([^/]+)(?:\/|$)/);
    return serviceMatch ? findService(serviceMatch[1]) : null;
  };

  const isKnownPath = (path) => {
    const currentPath = normalizePath(path);
    return (
      currentPath === "/" ||
      currentPath === "/services/" ||
      currentPath === "/community/" ||
      currentPath === "/about/" ||
      currentPath === "/services/auth/docs/" ||
      currentPath === "/services/auth/api/" ||
      currentPath === "/services/auth/grpc/" ||
      currentPath === "/services/secret/docs/" ||
      Boolean(serviceForPath(currentPath))
    );
  };
</script>

<Router let:location>
  <div class="site-shell" use:links>
    <Header pathname={normalizePath(location.pathname)} service={serviceForHeaderPath(location.pathname)} />
    <Route path="/">
      <HomePage />
    </Route>
    <Route path="/services">
      <ServicesPage />
    </Route>
    <Route path="/community">
      <CommunityPage />
    </Route>
    <Route path="/about">
      <AboutPage />
    </Route>
    <Route path="/services/auth/docs">
      <AuthDocsPage hash={location.hash} />
    </Route>
    <Route path="/services/auth/api">
      <AuthApiPage />
    </Route>
    <Route path="/services/auth/grpc">
      <AuthGrpcPage />
    </Route>
    <Route path="/services/secret/docs">
      <SecretDocsPage hash={location.hash} />
    </Route>
    <Route path="/services/:slug" let:params>
      {@const matchedService = findService(params.slug)}
      {#if matchedService}
        <ServiceDetailPage service={matchedService} />
      {:else}
        <NotFoundPage />
      {/if}
    </Route>
    <Route>
      <NotFoundPage />
    </Route>
    {#if isKnownPath(location.pathname)}
      <Footer />
    {/if}
  </div>
</Router>
