import { createReader } from '@keystatic/core/reader';
import type { ImageMetadata } from 'astro';
import keystaticConfig from '../../keystatic.config';

export const reader = createReader(process.cwd(), keystaticConfig);

const cmsImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/**/*.{webp,jpg,jpeg,png,avif}',
  { eager: true },
);

export function resolveCmsImage(
  relativePath: string | null | undefined,
): ImageMetadata | null {
  if (!relativePath) return null;
  const stripped = relativePath.replace(/^(\.\.\/)+/, '');
  const key = `/src/${stripped}`;
  return cmsImages[key]?.default ?? null;
}
