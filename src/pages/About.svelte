<script>
  import PageHero from "@/components/ui/PageHero.svelte";
</script>

<svelte:head>
  <title>About | Maintainerd</title>
  <meta name="description" content="Maintainerd's mission: a complete, open-source cloud platform you run and own — on-premise or on any infrastructure you already have." />
  <link rel="canonical" href="https://maintainerd.github.io/about/" />
</svelte:head>

<main>
  <PageHero
    title="About Maintainerd"
    lede="A complete, open-source cloud platform you run and own — on your own hardware, or on any infrastructure you already have."
    breadcrumbs={[{ href: "/", label: "Maintainerd" }, { label: "About" }]}
  />

  <section class="section">
    <div class="two-col">
      <div>
        <p class="eyebrow">Our mission</p>
        <h2>Own your platform. Don't rent it.</h2>
        <p class="section-lede">
          Most teams assemble their stack from a dozen managed services, watch the bill climb every month, and
          get locked into a single provider to run anything seriously. Maintainerd exists to change that.
        </p>
        <p class="section-lede">
          It's a complete suite of the product and platform services teams rebuild for every app — identity,
          storage, databases, messaging, CI/CD, and more — packaged so you can run and own them yourself. You
          bring the infrastructure; Maintainerd is the software that turns it into a full cloud platform.
        </p>
      </div>
      <div class="compact-grid" style="grid-template-columns:1fr">
        <article class="capability"><h3>Own it, not rent it</h3><p>Self-host the whole stack. You keep the runtime, the data, and the keys.</p></article>
        <article class="capability"><h3>Runs anywhere</h3><p>On-premise, your own servers, or any cloud provider — the same platform, everywhere.</p></article>
        <article class="capability"><h3>Open source</h3><p>Inspect it, extend it, send a PR. Apache-2.0, no lock-in.</p></article>
      </div>
    </div>
  </section>

  <section class="band">
    <div class="section" style="padding-top:60px;padding-bottom:60px">
      <p class="eyebrow">What we're building toward</p>
      <h2>A cloud platform you never outgrow.</h2>
      <p class="section-lede">
        Maintainerd starts with identity and grows service by service — object storage, databases, CI/CD, and
        beyond — until you can run a real platform without depending on a big-name cloud provider, and without
        the headache of wiring it all together yourself. Learn one platform, and let Maintainerd handle the rest.
      </p>
      <div class="feature-links">
        <a href="/services/">Browse the roadmap</a>
        <a href="https://github.com/maintainerd" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="two-col">
      <div>
        <p class="eyebrow">Where it is today</p>
        <h2>Auth is live. More is on the way.</h2>
        <p class="section-lede">
          <strong>maintainerd-auth</strong> (v0.1.0) is available now — a full OAuth 2.0 / OpenID Connect
          provider with MFA, SAML federation, and multi-tenancy, self-hostable in a single container. M9d-Core
          and the runtime providers (Docker, Kubernetes, database, storage, and more) come next.
        </p>
        <div class="feature-links">
          <a href="/services/auth/docs/">Auth docs</a>
          <a href="https://hub.docker.com/r/xreyc/maintainerd-auth" target="_blank" rel="noopener noreferrer">Docker Hub</a>
        </div>
      </div>
      <article class="callout">
        <p class="eyebrow">Founder</p>
        <h3>Reyco Seguma</h3>
        <p>
          I started Maintainerd because I wanted a complete cloud platform I could host anywhere and truly
          own — without the ballooning bills or the lock-in. It's early, open source, and built in the open.
          Feedback and contributions are always welcome.
        </p>
        <div class="feature-links">
          <a href="https://github.com/xreyc" target="_blank" rel="noopener noreferrer">@xreyc on GitHub</a>
        </div>
      </article>
    </div>
  </section>
</main>
