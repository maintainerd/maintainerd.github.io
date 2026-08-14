import { docsSections } from "$lib/data/docs.js";
import { maintainerdServices } from "$lib/data/services.js";

export const prerender = true;

export function GET() {
  const base = "https://maintainerd.github.io";
  const staticRoutes = ["/", "/services/", "/community/", "/blog/", "/about/", "/services/auth/docs/", "/services/auth/api/"];
  const serviceRoutes = maintainerdServices
    .filter((service) => service.slug !== "auth")
    .map((service) => `/services/${service.slug}/`);
  const urls = [...staticRoutes, ...serviceRoutes];
  const lastmod = "2026-08-15";

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((route) => `  <url><loc>${base}${route}</loc><lastmod>${lastmod}</lastmod></url>`)
  .join("\n")}
${docsSections
  .map((section) => `  <url><loc>${base}/services/auth/docs/#${section.slug}</loc><lastmod>${lastmod}</lastmod></url>`)
  .join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml"
    }
  });
}
