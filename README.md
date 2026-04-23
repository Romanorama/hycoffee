# HyCoffee Website

Astro site for HyCoffee.

## Local Commands

```sh
npm install
npm run dev
npm run build
npm run preview
```

## Image Workflow

Published page images live in `src/assets/images/` and are imported from Astro pages/components. Use Astro's `Image` or `Picture` components so the build can resize, encode, and preload images through the configured Sharp pipeline.

`public/images/` is only for static files that must keep a fixed public URL, such as logos used directly in markup. Do not put large content photography there because files in `public/` bypass Astro image optimization.

Raw source material and client-provided image dumps should stay local in ignored working folders such as `_contenttxtinfo/`. When a new image is needed on the site, export/convert the selected file to a web-ready asset in `src/assets/images/`, import it from the page or component, and commit only that final asset.

See `docs/image-workflow.md` for export sizes, naming rules, CMS image handling, and the preview loop.

## Current Public Assets

- `public/favicon.svg`
- `public/favicon.ico`
- `public/fonts/`
- `public/images/logo-light.svg`
- `public/images/inv-Hy-mono.svg`
