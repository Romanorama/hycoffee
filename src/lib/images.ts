import type { ImageMetadata } from 'astro';

const cmsImages = import.meta.glob<ImageMetadata>(
  '../assets/images/cms/**/*.{avif,jpeg,jpg,png,webp}',
  {
    eager: true,
    import: 'default',
  },
);

export function resolveCmsImage(src: string | null | undefined): ImageMetadata | null {
  if (!src) return null;

  const normalizedSrc = src
    .replace(/^(\.\.\/)+assets\/images\/cms\//, '../assets/images/cms/')
    .replace(/^\/?src\/assets\/images\/cms\//, '../assets/images/cms/');

  return cmsImages[normalizedSrc] ?? null;
}
