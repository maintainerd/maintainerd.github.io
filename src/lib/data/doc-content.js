const modules = import.meta.glob("../content/auth-docs/*.md", {
  query: "?raw",
  import: "default"
});

export async function loadDocContent(slug) {
  const loader = modules[`../content/auth-docs/${slug}.md`];
  if (!loader) return null;
  return loader();
}
