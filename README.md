# Maintainerd Website

[Official Website](https://maintainerd.github.io/)

Maintainerd is an open-source cloud platform: a self-hostable service catalog with AWS-style breadth and Coolify-style ownership. The site is intentionally multi-page so each service can grow into its own product area with overview pages, documentation, API reference, and examples.

## Development

The site is built with SvelteKit and prerendered as a static site for GitHub Pages.

```bash
npm install
npm run dev
```

Build the production artifact locally with:

```bash
npm run build
```

The generated site is written to `build/`. GitHub Actions deploys that folder to GitHub Pages on pushes to `main`.

For repository settings, use GitHub Pages with GitHub Actions as the publishing source. The source app and the deployment workflow live in this repository; a second repository is not needed.

## Site Structure

- `/` - platform overview
- `/services/` - full service catalog
- `/services/<service>/` - individual service pages
- `/services/auth/docs/` - Auth documentation example
- `/services/auth/api/` - Auth API reference shell

## Source Structure

- `src/routes/` - SvelteKit pages and static routes
- `src/lib/components/` - shared navigation, footer, hero, terminal, and card components
- `src/lib/data/` - service catalog and Auth documentation navigation data
- `src/lib/content/auth-docs/` - Auth documentation markdown sections
- `static/` - static images, icons, manifest, robots, verification, and `.nojekyll`

## Platform Positioning

Maintainerd provides built-in services such as Core, Domains, Docker, Kubernetes, Database, Auth, Secret, Gateway, Storage, Messaging, CMS, Workflow, Jobs, Observability, Billing, Project, and Support. Core can also orchestrate external applications and third-party container images from Docker Hub or private registries.

## Project Links

- GitHub: https://github.com/maintainerd
- Website: https://maintainerd.github.io/

## License

This site and documentation are part of the Maintainerd open-source project.
