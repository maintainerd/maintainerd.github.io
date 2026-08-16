import { marked } from "marked";

// GitHub-style heading slug: lowercase, strip punctuation (keep word chars,
// spaces, hyphens), spaces -> hyphens, collapse repeats. Matches the in-page
// anchor links used across the docs (e.g. "Account And Step-Up Issues" ->
// "account-and-step-up-issues").
function githubSlug(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\- ]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Reset per parse so IDs don't accumulate across documents. Duplicate headings
// within one document get a numeric suffix, matching GitHub's behaviour.
let seen;

marked.use({
  renderer: {
    heading(token) {
      const inner = this.parser.parseInline(token.tokens);
      let id = githubSlug(token.text);
      const count = seen.get(id) || 0;
      seen.set(id, count + 1);
      if (count) id = `${id}-${count}`;
      return `<h${token.depth} id="${id}">${inner}</h${token.depth}>\n`;
    }
  }
});

export function renderMarkdown(markdown) {
  seen = new Map();
  return marked.parse(markdown || "", { gfm: true });
}
