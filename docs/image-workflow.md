# Image Workflow

Use this workflow for local development and CMS-edited images.

## Folder Rules

- `src/assets/images/`: committed images used by hand-coded Astro pages/components.
- `src/assets/images/cms/`: committed images uploaded through Keystatic.
- `public/images/`: stable public URL assets only, currently logos used directly in markup.
- `_contenttxtinfo/`, `Images/`, `Guide Image*/`, `Logo/`, `Typography/`: ignored local working/source folders.

Images in `src/assets/images/` and `src/assets/images/cms/` can go through Astro's image pipeline. Images in `public/` are copied as-is and bypass optimization.

## Export Targets

Start from the raw file, crop it intentionally, and export only the final asset into `src/assets/images/` or through Keystatic.

| Use case | Long edge | Format | Quality |
| --- | ---: | --- | ---: |
| Home/page hero | 2200-2600 px | `.webp` | 72-78 |
| Two-column editorial image | 1400-1800 px | `.webp` | 72-78 |
| Product/card image | 1200-1600 px | `.webp` | 72-78 |
| Team strip/photo | 1200-1800 px | `.webp` | 70-76 |
| Logos/icons | Vector SVG when possible | `.svg` | n/a |

Keep source filenames descriptive and lowercase, for example `origins-west-nile-drying-beds.webp`. Avoid spaces, umlauts, and camera export names for committed assets.

## Hand-Coded Astro Images

Import committed images directly:

```astro
---
import { Image, Picture } from 'astro:assets';
import heroImage from '../assets/images/hero.webp';
---

<Picture
  src={heroImage}
  alt="Klimaresilienter Kaffeeanbau"
  widths={[768, 1280, 1920]}
  sizes="(max-width: 768px) 100vw, 50vw"
  formats={['avif', 'webp']}
  quality={72}
/>
```

Use `Picture` for important large photos where AVIF/WebP variants help. Use `Image` for simpler inline images.

## Keystatic Images

Keystatic image fields now write uploads to `src/assets/images/cms/<section>/`. The saved content value is a relative path back into `src/assets`, not a `/public` URL.

When rendering CMS-driven pages, resolve that saved string before passing it to Astro's `Image` or `Picture` component:

```astro
---
import { Image } from 'astro:assets';
import { resolveCmsImage } from '../lib/images';

const heroImage = resolveCmsImage(entry.data.heroImage);
---

{heroImage && (
  <Image
    src={heroImage}
    alt={entry.data.title}
    widths={[768, 1280, 1920]}
    sizes="(max-width: 768px) 100vw, 50vw"
    format="webp"
    quality={72}
  />
)}
```

## Preview Loop

Run the dev server while editing:

```sh
npm run dev
```

Before committing or pushing:

```sh
npm run build
```

Use production preview when you want to inspect the built site:

```sh
npm run preview
```
