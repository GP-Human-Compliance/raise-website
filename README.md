# raise-website

Static landing site for [www.raise-app.de](https://www.raise-app.de).

SvelteKit SPA built with `@sveltejs/adapter-static`, deployed to GitHub Pages
via the workflow in `.github/workflows/pages.yml`.

## Develop

```sh
npm install
npm run dev
```

## Build

```sh
npm run build         # → build/  (with index.html + 404.html SPA fallback)
npm run preview
```

## Content

All public content (texts, images, animations, store badges) is committed in
this repo. There is no runtime CMS:

- `src/lib/content/` — JSON snapshots, one file per Strapi collection × locale
  (`de`, `en`)
- `static/strapi-media/` — image/SVG/Rive assets referenced from those JSONs

Two video files (the hero/landing MP4s in DE and EN) are too large for the
GitHub Pages 100MB-per-file limit and are still served from the original
Strapi-CDN. URLs in the JSON point at the absolute Strapi URL for those.

### Refresh content from Strapi

If anything changes in the upstream Strapi instance and you want to re-pull:

```sh
npm run refresh-content
```

This re-runs `scripts/snapshot-strapi.mjs` against
`raise-strapi.prod.bitingbit.cloud` (token + URL are baked into the script —
they were already public in the previous build's JS bundle) and overwrites
`src/lib/content/` + `static/strapi-media/` in place. Commit the diff.

## Deploy

Pushing to `main` triggers `.github/workflows/pages.yml`, which builds the
site and publishes to GitHub Pages. Custom domain `www.raise-app.de` is
configured via the `static/CNAME` file (copied to the build root).

DNS (Strato): `www` CNAME → `<org>.github.io`.

## Store badges

The "Jetzt Testen" section links to App Store and Google Play. URLs are
placeholders (`#`) in `src/routes/landing/components/TesterRegistration.svelte`
until the apps are live in the stores.
