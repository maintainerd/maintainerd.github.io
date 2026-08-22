// Documentation pages are authored as raw markdown, one file per page and one
// directory per service. Each directory is a COLLECTION, and every collection is
// loaded through this one module: adding a service's docs means adding a glob here
// plus a navigation file under src/data/, never a second loading mechanism.
const collections = {
  auth: {
    dir: "../content/auth-docs",
    modules: import.meta.glob("../content/auth-docs/*.md", {
      query: "?raw",
      import: "default"
    })
  },
  secret: {
    dir: "../content/secret-docs",
    modules: import.meta.glob("../content/secret-docs/*.md", {
      query: "?raw",
      import: "default"
    })
  }
};

const slugsFor = (collection) =>
  new Set(
    Object.keys(collections[collection].modules).map((path) =>
      path.slice(path.lastIndexOf("/") + 1, -3)
    )
  );

const slugsByCollection = Object.fromEntries(
  Object.keys(collections).map((collection) => [collection, slugsFor(collection)])
);

// The set of slugs in a collection that have a real content file. Used to decide
// whether a hash target is a doc page to load, versus an in-page section anchor.
export const docSlugs = (collection) => slugsByCollection[collection] || new Set();

export const hasDoc = (collection, slug) => docSlugs(collection).has(slug);

export async function loadDocContent(collection, slug) {
  const entry = collections[collection];
  if (!entry) return null;
  const loader = entry.modules[`${entry.dir}/${slug}.md`];
  if (!loader) return null;
  return loader();
}
