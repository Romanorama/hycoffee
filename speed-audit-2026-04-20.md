# Speed Audit — Homepage (`/`)

_Date: 2026-04-20 · Scope: static code review of [src/pages/index.astro](src/pages/index.astro) and its components/assets_

## Summary

**Critical:** the page loads **~85 MB** of raw images with zero optimization. A single team photo (`team-4.jpg`) is **13 MB**. Image optimization is not configured ([astro.config.mjs](astro.config.mjs) is empty), so nothing is being transformed to WebP/AVIF, resized, or lazy-loaded.

## Findings (ordered by impact)

### 1. Image weight — catastrophic
- `public/images/` total: **85 MB**, `dist/`: 95 MB.
- Team strip alone ([Team.astro:7-23](src/components/Team.astro#L7-L23)): **~57 MB across 8 photos**, displayed at only **181 px tall** — up to ~50× oversize. Each is referenced twice for a marquee loop (browser de-dupes, but still tens of MB decoded in memory on a `will-change: transform` layer).
- [press-arte.jpg](public/images/press-arte.jpg): **5.0 MB**, used 4× as placeholder in [Press.astro](src/components/Press.astro).
- [hero.jpg](public/images/hero.jpg): **1.3 MB** — this is your LCP image.
- [inv-Hy-mono.svg](public/images/inv-Hy-mono.svg): 234 KB SVG — almost certainly has embedded raster data.
- Media logos are PNG (39–152 KB each) — should be SVG.

### 2. No Astro image pipeline
All images use raw `<img src="/images/…">` from `/public` → no WebP/AVIF, no srcset, no intrinsic sizing, no auto-lazy. Moving to `/src/assets/` + `<Image>` component unlocks all of that for free.

### 3. Missing image attributes (all components)
- No `width`/`height` → **CLS** risk, especially on hero.
- No `loading="lazy"` on below-fold images (Team, Press).
- No `decoding="async"`.
- Hero image missing `fetchpriority="high"` → delayed LCP.

### 4. Fonts
- [global.css:2-18](src/styles/global.css#L2-L18) declares `.woff` + `.woff2` — modern browsers only use `.woff2`, so the `.woff` refs are dead weight in the CSS.
- `HALTimezone-Regular.woff2` 128 KB and `DGMSprinter-Regular.woff2` 58 KB: **not preloaded** → FOUT on first paint.
- `font-display: swap` is set correctly.

### 5. Render-path JS
- [BaseLayout.astro:20-82](src/layouts/BaseLayout.astro#L20-L82) reveal script is inline and runs early, calling `getBoundingClientRect()` per section — minor layout thrash, acceptable but could be simplified.
- [Navigation.astro](src/components/Navigation.astro) has `backdrop-filter: blur(8px)` on 4 elements (`nav-top`, `nav-bottom`, `nav-filter`, `nav-contact-popover`) — expensive continuous repaint, noticeable on low-end devices.

### 6. Misc
- Team marquee holds 16 decoded photos on a GPU layer (`will-change: transform`) — once optimized this is fine; today it's a memory hog.
- `scroll-behavior: smooth` global — cosmetic, not perf.

## Recommended fix order (biggest ROI first)

1. **Shrink team photos to ~250 px tall / ~50 KB each** (WebP). Saves ~56 MB instantly.
2. **Shrink [press-arte.jpg](public/images/press-arte.jpg) to ~300 KB**, provide real images for the other 3 cards.
3. **Shrink [hero.jpg](public/images/hero.jpg) to ~200 KB** WebP, add `fetchpriority="high"` + `<link rel="preload" as="image">` in [BaseLayout.astro](src/layouts/BaseLayout.astro).
4. Add `width`, `height`, `loading="lazy"`, `decoding="async"` to all `<img>` except hero.
5. Preload `HALTimezone-Regular.woff2`; drop `.woff` sources.
6. Re-export [inv-Hy-mono.svg](public/images/inv-Hy-mono.svg) (234 KB → should be <10 KB).
7. Adopt Astro's `<Image>` (move images to `src/assets/`) so all of the above becomes automatic.
8. Convert media logo PNGs ([media-arte.png](public/images/media-arte.png), [media-focus.png](public/images/media-focus.png), etc.) to SVG.

**Rough projected impact:** page weight drops from ~85 MB → ~2–3 MB; LCP likely improves 3–8 s on typical broadband; CLS score should go from poor to ~0.

## Raw data

### Largest image files

| File | Size | Used on |
|---|---|---|
| team-4.jpg | 13 MB | Team strip |
| team-6.jpg | 9.6 MB | Team strip |
| team-2.jpg | 9.3 MB | Team strip |
| team-8.jpg | 8.2 MB | Team strip |
| team-3.jpg | 7.2 MB | Team strip |
| press-arte.jpg | 5.0 MB | Press (×4) |
| team-5.jpg | 4.2 MB | Team strip |
| DSC_4484.png | 3.6 MB | — |
| team-1.jpg | 3.7 MB | Team strip |
| team-7.jpg | 1.8 MB | Team strip |
| about-strip.jpg | 1.5 MB | About page |
| hero.jpg | 1.3 MB | **Hero (LCP)** |
| wissen-4.jpeg | 1.2 MB | Wissen |
| inv-Hy-mono.svg | 234 KB | Footer |

### Font files

| File | Size |
|---|---|
| HALTimezone-Regular.woff2 | 128 KB |
| HALTimezone-Regular.woff | 179 KB |
| DGMSprinter-Regular.woff2 | 58 KB |
| DGMSprinter-Regular.woff | 77 KB |
