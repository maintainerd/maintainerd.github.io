import { error } from "@sveltejs/kit";
import { findService, serviceSlugs } from "$lib/data/services.js";

export function entries() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export function load({ params }) {
  const service = findService(params.slug);
  if (!service) {
    throw error(404, "Service not found");
  }
  return { service };
}
