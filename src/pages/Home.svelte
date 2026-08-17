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
      <svg viewBox="0 0 960 460" role="img" xmlns="http://www.w3.org/2000/svg" aria-label="Developers and ops interact only with Maintainerd, which runs on any infrastructure: on-premise, AWS, Azure, GCP, and more.">
        <defs>
          <marker id="ahb" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M1 1 L9 5 L1 9" fill="none" stroke="var(--blue)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </marker>
          <marker id="ahg" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M1 1 L9 5 L1 9" fill="none" stroke="var(--line-strong)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </marker>
        </defs>

        <text x="140" y="150" text-anchor="middle" font-size="13" font-weight="600" letter-spacing="0.07em" fill="var(--faint)">YOU</text>
        <text x="820" y="40" text-anchor="middle" font-size="13" font-weight="600" letter-spacing="0.07em" fill="var(--faint)">YOUR INFRASTRUCTURE</text>

        <line x1="582" y1="230" x2="714" y2="93"  stroke="var(--line-strong)" stroke-width="1.5" marker-end="url(#ahg)"/>
        <line x1="582" y1="230" x2="714" y2="165" stroke="var(--line-strong)" stroke-width="1.5" marker-end="url(#ahg)"/>
        <line x1="582" y1="230" x2="714" y2="237" stroke="var(--line-strong)" stroke-width="1.5" marker-end="url(#ahg)"/>
        <line x1="582" y1="230" x2="714" y2="309" stroke="var(--line-strong)" stroke-width="1.5" marker-end="url(#ahg)"/>
        <line x1="582" y1="230" x2="714" y2="381" stroke="var(--line-strong)" stroke-width="1.5" marker-end="url(#ahg)"/>

        <line x1="244" y1="230" x2="374" y2="230" stroke="var(--blue)" stroke-width="2.5" marker-end="url(#ahb)"/>
        <text x="309" y="219" text-anchor="middle" font-size="12.5" fill="var(--muted)">build &amp; deploy</text>

        <rect x="40" y="194" width="200" height="72" rx="12" fill="var(--paper)" stroke="var(--line-strong)" stroke-width="1.5"/>
        <text x="140" y="228" text-anchor="middle" font-size="19" font-weight="600" fill="var(--ink)">Developers &amp; Ops</text>
        <text x="140" y="250" text-anchor="middle" font-size="13" fill="var(--muted)">one platform to learn</text>

        <rect x="380" y="158" width="202" height="144" rx="16" fill="var(--blue)"/>
        <g fill="#ffffff" opacity="0.96" transform="translate(481,197)">
          <circle cx="-10" cy="3" r="8"/>
          <circle cx="2" cy="-4" r="11"/>
          <circle cx="13" cy="3" r="7"/>
          <rect x="-18" y="3" width="37" height="10" rx="5"/>
        </g>
        <text x="481" y="250" text-anchor="middle" font-size="24" font-weight="600" fill="#ffffff">Maintainerd</text>
        <text x="481" y="272" text-anchor="middle" font-size="13" fill="#ffffff" opacity="0.85">the cloud platform</text>

        <rect x="720" y="66"  width="200" height="54" rx="10" fill="var(--paper)" stroke="var(--line-strong)" stroke-width="1.25"/>
        <text x="820" y="99"  text-anchor="middle" font-size="18" font-weight="500" fill="var(--ink)">On-premise</text>
        <rect x="720" y="138" width="200" height="54" rx="10" fill="var(--paper)" stroke="var(--line-strong)" stroke-width="1.25"/>
        <text x="820" y="171" text-anchor="middle" font-size="18" font-weight="500" fill="var(--ink)">AWS</text>
        <rect x="720" y="210" width="200" height="54" rx="10" fill="var(--paper)" stroke="var(--line-strong)" stroke-width="1.25"/>
        <text x="820" y="243" text-anchor="middle" font-size="18" font-weight="500" fill="var(--ink)">Azure</text>
        <rect x="720" y="282" width="200" height="54" rx="10" fill="var(--paper)" stroke="var(--line-strong)" stroke-width="1.25"/>
        <text x="820" y="315" text-anchor="middle" font-size="18" font-weight="500" fill="var(--ink)">GCP</text>
        <rect x="720" y="354" width="200" height="54" rx="10" fill="var(--paper)" stroke="var(--line-strong)" stroke-width="1.25" stroke-dasharray="5 5"/>
        <text x="820" y="387" text-anchor="middle" font-size="18" font-weight="500" fill="var(--muted)">…and many more</text>
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
