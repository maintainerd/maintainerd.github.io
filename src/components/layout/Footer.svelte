<script>
  import BrandLogo from "@/components/ui/BrandLogo.svelte";
</script>

<footer class="footer">
  <div class="footer-inner">
    <div>
      <BrandLogo />
      <p>Open-source cloud services for teams that want platform capability without surrendering ownership.</p>
    </div>
    <div>
      <h3>Platform</h3>
      <a href="/services/">Services</a>
      <a href="/services/core/">Core</a>
      <a href="/services/docker/">Docker provider</a>
    </div>
    <div>
      <h3>Docs</h3>
      <a href="/services/auth/docs/">Auth docs</a>
      <a href="/services/auth/api/">Auth API</a>
      <a href="https://hub.docker.com/r/xreyc/maintainerd-auth" target="_blank" rel="noopener noreferrer">Docker Hub</a>
    </div>
    <div>
      <h3>Community</h3>
      <a href="/community/">Community</a>
      <a href="https://github.com/maintainerd/maintainerd-auth/issues" target="_blank" rel="noopener noreferrer">Issues</a>
      <a href="https://github.com/maintainerd" target="_blank" rel="noopener noreferrer">GitHub</a>
    </div>
  </div>
  <div class="footer-bottom">
    <span>© 2026 Maintainerd</span>
    <span>Apache-2.0 licensed</span>
  </div>
</footer>
