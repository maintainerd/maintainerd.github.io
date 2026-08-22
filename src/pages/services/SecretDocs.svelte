<script>
  import ServiceDocs from "@/pages/services/ServiceDocs.svelte";
  import { docsGroups, docsSections } from "@/data/secretDocs.js";

  export let hash = "";
</script>

<svelte:head>
  <title>Secret Documentation | Maintainerd</title>
  <meta name="description" content="Documentation for Secret, the Maintainerd envelope-encrypted, versioned secret manager." />
  <link rel="canonical" href="https://maintainerd.github.io/services/secret/docs/" />
</svelte:head>

<ServiceDocs
  collection="secret"
  groups={docsGroups}
  sections={docsSections}
  defaultSlug="introduction"
  navLabel="Secret documentation"
  breadcrumbs={[
    { href: "/", label: "Maintainerd" },
    { href: "/services/", label: "Services" },
    { href: "/services/secret/docs/", label: "Secret" },
    { label: "Docs" }
  ]}
  {hash}
/>
