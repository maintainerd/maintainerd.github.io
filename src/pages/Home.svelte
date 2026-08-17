<script>
  import ButtonLink from "@/components/ui/ButtonLink.svelte";
  import ServiceCard from "@/components/ui/ServiceCard.svelte";
  import { maintainerdServices } from "@/data/services.js";
</script>

<svelte:head>
  <title>Maintainerd | Open-source cloud platform</title>
  <meta
    name="description"
    content="Maintainerd is an open-source cloud platform: self-hostable services for identity, storage, messaging, databases, jobs, observability, billing, and more."
  />
  <link rel="canonical" href="https://maintainerd.github.io/" />
</svelte:head>

<main>
  <section class="hero">
    <div class="hero-inner">
      <div class="hero-copy">
        <p class="eyebrow">Open-source · self-hostable</p>
        <h1>The cloud platform you run and own.</h1>
        <p class="lede">
          Maintainerd is an open-source suite of the product and platform services teams rebuild for every
          app — identity, storage, messaging, databases, and more — packaged so you can run and own them
          yourself. Bring your own infrastructure and Maintainerd gives you the services that sit on top.
        </p>
        <div class="hero-actions">
          <ButtonLink href="/services/" variant="primary">Browse services</ButtonLink>
          <ButtonLink href="https://github.com/maintainerd" external>GitHub</ButtonLink>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <p class="eyebrow">One platform, any infrastructure</p>
    <h2>You learn Maintainerd. It handles the rest.</h2>
    <p class="section-lede">
      Teams juggle a different playbook for every provider. Maintainerd sits in the middle — you build
      against one platform, and it runs on whatever infrastructure you bring.
    </p>
    <div class="flow-diagram">
      <svg viewBox="0 0 896 380" role="img" xmlns="http://www.w3.org/2000/svg" aria-label="Developers and ops interact with Maintainerd, which runs on any infrastructure: on-premise, AWS, Azure, GCP, and more.">
        <defs>
          <marker id="ahb" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M1 1 L9 5 L1 9" fill="none" stroke="var(--blue)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </marker>
          <marker id="ahg" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M1 1 L9 5 L1 9" fill="none" stroke="var(--line-strong)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </marker>
        </defs>

        <rect x="10" y="8" width="876" height="364" rx="18" fill="none" stroke="var(--line-strong)" stroke-width="1.25" stroke-dasharray="6 6"/>

        <path d="M450 185 C575 185 575 53 672 53"   fill="none" stroke="var(--line-strong)" stroke-width="1.5" marker-end="url(#ahg)"/>
        <path d="M450 185 C575 185 575 119 672 119" fill="none" stroke="var(--line-strong)" stroke-width="1.5" marker-end="url(#ahg)"/>
        <path d="M450 185 C590 185 590 185 672 185" fill="none" stroke="var(--line-strong)" stroke-width="1.5" marker-end="url(#ahg)"/>
        <path d="M450 185 C575 185 575 251 672 251" fill="none" stroke="var(--line-strong)" stroke-width="1.5" marker-end="url(#ahg)"/>
        <path d="M450 185 C575 185 575 317 672 317" fill="none" stroke="var(--line-strong)" stroke-width="1.5" marker-end="url(#ahg)"/>

        <line x1="123" y1="185" x2="370" y2="185" stroke="var(--blue)" stroke-width="2.5" marker-end="url(#ahb)"/>
        <text x="246" y="176" text-anchor="middle" font-size="12" fill="var(--muted)">build &amp; deploy</text>

        <circle cx="95" cy="185" r="28" fill="var(--blue-tint)" stroke="var(--blue)" stroke-width="1.5"/>
        <circle cx="95" cy="180" r="6" fill="var(--blue)"/>
        <path d="M84 197 c0 -9 22 -9 22 0 z" fill="var(--blue)"/>
        <text x="95" y="231" text-anchor="middle" font-size="14" font-weight="600" fill="var(--ink)">Developers &amp; Ops</text>

        <circle cx="410" cy="185" r="40" fill="var(--blue)"/>
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04Z" fill="#ffffff" transform="translate(410 184) scale(1.5) translate(-12 -12)"/>
        <text x="410" y="243" text-anchor="middle" font-size="16" font-weight="600" fill="var(--ink)">Maintainerd</text>

        <circle cx="700" cy="53" r="28" fill="var(--paper)" stroke="var(--line-strong)" stroke-width="1.25"/>
        <image href="/assets/logos/on-premise.svg" x="685" y="38" width="30" height="30"/>
        <text x="740" y="58" text-anchor="start" font-size="16" font-weight="500" fill="var(--ink)">On-premise</text>
        <circle cx="700" cy="119" r="28" fill="var(--paper)" stroke="var(--line-strong)" stroke-width="1.25"/>
        <image href="/assets/logos/aws.svg" x="685" y="104" width="30" height="30"/>
        <text x="740" y="124" text-anchor="start" font-size="16" font-weight="500" fill="var(--ink)">AWS</text>
        <circle cx="700" cy="185" r="28" fill="var(--paper)" stroke="var(--line-strong)" stroke-width="1.25"/>
        <image href="/assets/logos/azure.svg" x="685" y="170" width="30" height="30"/>
        <text x="740" y="190" text-anchor="start" font-size="16" font-weight="500" fill="var(--ink)">Azure</text>
        <circle cx="700" cy="251" r="28" fill="var(--paper)" stroke="var(--line-strong)" stroke-width="1.25"/>
        <image href="/assets/logos/gcp.svg" x="685" y="236" width="30" height="30"/>
        <text x="740" y="256" text-anchor="start" font-size="16" font-weight="500" fill="var(--ink)">GCP</text>
        <circle cx="700" cy="317" r="28" fill="var(--paper)" stroke="var(--line-strong)" stroke-width="1.25" stroke-dasharray="5 5"/>
        <g stroke="var(--faint)" stroke-width="2.6" stroke-linecap="round"><line x1="692" y1="317" x2="708" y2="317"/><line x1="700" y1="309" x2="700" y2="325"/></g>
        <text x="740" y="322" text-anchor="start" font-size="16" font-weight="500" fill="var(--muted)">and many more</text>
      </svg>
    </div>
  </section>

  <section class="band">
    <div class="section" id="services" style="padding-top:64px;padding-bottom:64px">
      <p class="eyebrow">Service catalog</p>
      <h2>Everything, in one place.</h2>
      <p class="section-lede">Independent services that stand alone or connect through Core. Browse the catalog to see what is available and what is planned.</p>
      <div class="service-grid">
        {#each maintainerdServices as service}
          <ServiceCard {service} href={service.href || `/services/${service.slug}/`} />
        {/each}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="two-col">
      <div>
        <p class="eyebrow">How it works</p>
        <h2>Maintainerd runs the platform. You bring the infrastructure.</h2>
        <p class="section-lede">
          Maintainerd is the software that turns infrastructure into a complete cloud platform. Point it at
          whatever you run — on-premise, your own servers, or any cloud provider — and it gives you the
          services to build and operate on top. Same platform, anywhere you host it.
        </p>
      </div>
      <div class="compact-grid" style="grid-template-columns:1fr">
        <article class="capability"><h3>Standalone first</h3><p>Adopt only what you need. Each service runs on its own.</p></article>
        <article class="capability"><h3>Self-hostable</h3><p>You keep the runtime, the data, and the keys. Apache-2.0, no lock-in.</p></article>
        <article class="capability"><h3>Ecosystem-ready</h3><p>Connect services through a shared control plane when you want one.</p></article>
      </div>
    </div>
  </section>
</main>
