<script>
  export let title = "Command";
  export let command;

  let label = "Copy";

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      label = "Copied";
      window.setTimeout(() => (label = "Copy"), 1200);
    } catch {
      label = "Copy failed";
    }
  }
</script>

<div class="terminal">
  <div class="terminal-header">
    <span>{title}</span>
    <button class="copy-button" type="button" onclick={copy}>{label}</button>
  </div>
  <pre>{command}</pre>
</div>
