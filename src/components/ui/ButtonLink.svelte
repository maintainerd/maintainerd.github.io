<script>
  export let href;
  export let variant = "secondary";
  export let external = false;
</script>

<a
  class={`button ${variant}`}
  {href}
  target={external ? "_blank" : undefined}
  rel={external ? "noopener noreferrer" : undefined}
>
  <slot />
</a>
