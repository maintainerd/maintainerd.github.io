<script>
  import { page } from "$app/stores";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import "../app.css";

  $: pathname = $page.url.pathname;
</script>

<svelte:head>
  <meta name="theme-color" content="#ffffff" />
  <meta name="robots" content="index, follow" />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
  <link rel="icon" href="/assets/favicon-32x32.png" type="image/png" sizes="32x32" />
  <link rel="icon" href="/assets/favicon-16x16.png" type="image/png" sizes="16x16" />
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <meta property="og:site_name" content="Maintainerd" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="site-shell">
  <Header {pathname} />
  <slot />
  <Footer />
</div>
