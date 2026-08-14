# Maintainerd Website

[Official Website](https://maintainerd.github.io/)

Maintainerd is an open-source cloud platform: a self-hostable service catalog with AWS-style breadth and Coolify-style ownership. The site is intentionally multi-page so each service can grow into its own product area with overview pages, documentation, API reference, and examples.

## Development

The site is built with plain Svelte and Vite.

```bash
npm install
npm run dev
```

Build the production artifact locally with:

```bash
npm run build
```

The generated site is written to `dist/`. GitHub Actions deploys that folder to GitHub Pages on pushes to `main`.

The post-build script copies the SPA entry file to each known clean URL path, so GitHub Pages can serve routes such as `/services/` and `/services/auth/docs/` directly. It also writes `404.html` as a fallback for unknown client-side routes.

For repository settings, use GitHub Pages with GitHub Actions as the publishing source. The source app and the deployment workflow live in this repository; a second repository is not needed.

## Site Structure

- `/` - platform overview
- `/services/` - full service catalog
- `/services/<service>/` - individual service pages
- `/services/auth/docs/` - Auth documentation example
- `/services/auth/api/` - Auth API reference shell

## Source Structure

- `src/App.svelte` - top-level app and simple route switch
- `src/main.js` - browser entry point
- `src/components/layout/` - site-wide layout components such as the header and footer
- `src/components/ui/` - reusable presentation components such as page heroes and terminal blocks
- `src/pages/` - page-level screens, with service-specific pages grouped under `src/pages/services/`
- `src/data/` - service catalog and Auth documentation navigation data
- `src/content/auth-docs/` - Auth documentation markdown sections
- `src/utils/` - client-side routing and content-loading helpers
- `static/` - static images, icons, manifest, robots, verification, and `.nojekyll`
- `scripts/postbuild.js` - GitHub Pages clean URL generation

## Platform Positioning

Maintainerd provides built-in services such as Core, Domains, Docker, Kubernetes, Database, Auth, Secret, Gateway, Storage, Messaging, CMS, Workflow, Jobs, Observability, Billing, Project, and Support. Core can also orchestrate external applications and third-party container images from Docker Hub or private registries.

## Project Links

- GitHub: https://github.com/maintainerd
- Website: https://maintainerd.github.io/

## License

This site and documentation are part of the Maintainerd open-source project.
