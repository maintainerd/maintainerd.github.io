import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const dist = "dist";
const routes = [
  "/services/",
  "/community/",
  "/about/",
  "/services/auth/",
  "/services/auth/docs/",
  "/services/auth/api/",
  "/services/auth/grpc/",
  "/services/core/",
  "/services/docker/",
  "/services/kubernetes/",
  "/services/database/",
  "/services/domains/",
  "/services/secret/",
  "/services/gateway/",
  "/services/storage/",
  "/services/messaging/",
  "/services/jobs/",
  "/services/observability/",
  "/services/billing/"
];

async function copyIndex(route) {
  const target = join(dist, route, "index.html");
  await mkdir(dirname(target), { recursive: true });
  await copyFile(join(dist, "index.html"), target);
}

async function writeSitemap() {
  const base = "https://maintainerd.github.io";
  const lastmod = "2026-08-15";
  const urls = ["/", ...routes];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((route) => `  <url><loc>${base}${route}</loc><lastmod>${lastmod}</lastmod></url>`).join("\n")}
</urlset>
`;
  await writeFile(join(dist, "sitemap.xml"), xml);
}

await Promise.all(routes.map(copyIndex));
await copyFile(join(dist, "index.html"), join(dist, "404.html"));
await writeSitemap();
