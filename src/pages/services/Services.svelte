<script>
  import PageHero from "@/components/ui/PageHero.svelte";
  import ServiceCard from "@/components/ui/ServiceCard.svelte";
  import { externalCategories, maintainerdServices } from "@/data/services.js";

  let activeCategory = "all";

  $: visibleMaintainerd = activeCategory === "all" || activeCategory === "maintainerd";
  $: visibleCategories = activeCategory === "all"
    ? externalCategories
    : externalCategories.filter((category) => category.slug === activeCategory);
</script>

<svelte:head>
  <title>Services | Maintainerd</title>
  <meta name="description" content="Explore Maintainerd services and external Docker-image service categories that Maintainerd Core can provision." />
  <link rel="canonical" href="https://maintainerd.github.io/services/" />
</svelte:head>

<main>
  <PageHero
    eyebrow="Service catalog"
    title="Services Maintainerd can run or provision."
    lede="Maintainerd has two service families: Maintainerd-native services, and external services provisioned from Docker images through Core and runtime providers."
    breadcrumbs={[{ href: "/", label: "Maintainerd" }, { label: "Services" }]}
  />

  <section class="section">
    <div class="catalog-head">
      <div>
        <p class="eyebrow">Catalog</p>
        <h2>Choose a category.</h2>
        <p class="section-lede">
          Maintainerd services are platform building blocks. External services are Docker-image backed workloads
          that Core can manage through Docker or Kubernetes providers.
        </p>
      </div>
      <label class="select-field">
        <span>Category</span>
        <select bind:value={activeCategory}>
          <option value="all">All services</option>
          <option value="maintainerd">Maintainerd services</option>
          {#each externalCategories as category}
            <option value={category.slug}>{category.optionsLabel}</option>
          {/each}
        </select>
      </label>
    </div>

    {#if visibleMaintainerd}
      <section class="catalog-section">
        <div class="catalog-section-head">
          <div>
            <p class="eyebrow">Maintainerd services</p>
            <h2>Native platform services.</h2>
            <p class="section-lede">These services are part of the Maintainerd platform and are designed to work standalone or through Core.</p>
          </div>
        </div>
        <div class="service-grid">
          {#each maintainerdServices as service}
            <ServiceCard
              {service}
              href={service.href || `/services/${service.slug}/`}
              footerLeft={service.eyebrow}
              footerRight={`Open ${service.docsHref ? "docs" : "service"}`}
            />
          {/each}
        </div>
      </section>
    {/if}

    {#each visibleCategories as category}
      <section class="catalog-section">
        <div class="catalog-section-head">
          <div>
            <p class="eyebrow">External services</p>
            <h2>{category.title}.</h2>
          </div>
        </div>
        <div class="service-grid">
          {#each category.services as service}
            <ServiceCard
              {service}
              mark={service.mark}
              status="External"
              statusKind="planned"
              footerLeft="Docker image"
              footerRight={service.image}
            />
          {/each}
        </div>
      </section>
    {/each}
  </section>
</main>
