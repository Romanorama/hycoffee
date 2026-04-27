import type { ImageMetadata } from 'astro';
import { reader, resolveCmsImage } from './cms';

const CATEGORY_LABELS: Record<WissenCategory, string> = {
  klimawandel: 'Klimawandel',
  klimaresilient: 'Klimaresilienter Kaffee',
  excelsa: 'Excelsa',
};

export type WissenCategory = 'klimawandel' | 'klimaresilient' | 'excelsa';

export interface WissenArticle {
  slug: string;
  href: string;
  category: WissenCategory;
  categoryLabel: string;
  title: string;
  subtitle: string;
  publishedAt: string;
  readingTime: number;
  readingTimeLabel: string;
  image: ImageMetadata | null;
  body: string;
}

export async function getAllWissenArticles(): Promise<WissenArticle[]> {
  const entries = await reader.collections.wissen.all();
  return entries
    .map(({ slug, entry }) => ({
      slug,
      href: `/wissen/${slug}`,
      category: entry.category as WissenCategory,
      categoryLabel: CATEGORY_LABELS[entry.category as WissenCategory],
      title: entry.title,
      subtitle: entry.subtitle,
      publishedAt: entry.publishedAt ?? '',
      readingTime: entry.readingTime ?? 5,
      readingTimeLabel: `${entry.readingTime ?? 5} Min`,
      image: resolveCmsImage(entry.heroImage),
      body: entry.body,
    }))
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''));
}

export async function getRandomWissenArticles(count: number): Promise<WissenArticle[]> {
  const all = await getAllWissenArticles();
  const shuffled = [...all];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}
