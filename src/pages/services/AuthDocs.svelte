<script>
  import ServiceDocs from "@/pages/services/ServiceDocs.svelte";
  import { docsGroups, docsSections } from "@/data/authDocs.js";

  export let hash = "";
</script>

<svelte:head>
  <title>Auth Documentation | Maintainerd</title>
  <meta name="description" content="Documentation for Auth, the Maintainerd identity and access management service." />
  <link rel="canonical" href="https://maintainerd.github.io/services/auth/docs/" />
</svelte:head>

<ServiceDocs
  collection="auth"
  groups={docsGroups}
  sections={docsSections}
  defaultSlug="introduction"
  navLabel="Auth documentation"
  breadcrumbs={[
    { href: "/", label: "Maintainerd" },
    { href: "/services/", label: "Services" },
    { href: "/services/auth/docs/", label: "Auth" },
    { label: "Docs" }
  ]}
  {hash}
/>
