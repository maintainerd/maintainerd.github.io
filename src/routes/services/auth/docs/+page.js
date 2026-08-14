import { loadDocContent } from "$lib/data/doc-content.js";

export async function load() {
  return {
    initialContent: await loadDocContent("introduction")
  };
}
