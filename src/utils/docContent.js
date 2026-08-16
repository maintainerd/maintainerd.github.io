const modules = import.meta.glob("../content/auth-docs/*.md", {
  query: "?raw",
  import: "default"
});

// The set of slugs that have a real content file. Used to decide whether a
// hash target is a doc page to load, versus an in-page section anchor.
export const docSlugs = new Set(
  Object.keys(modules).map((path) => path.slice(path.lastIndexOf("/") + 1, -3))
);

export const hasDoc = (slug) => docSlugs.has(slug);

export async function loadDocContent(slug) {
  const loader = modules[`../content/auth-docs/${slug}.md`];
  if (!loader) return null;
  return loader();
}
