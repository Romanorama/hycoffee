import type { ImageMetadata } from 'astro';
import { reader, resolveCmsImage } from './cms';
import type { Lang } from './i18n';

const CATEGORY_LABELS: Record<WissenCategory, string> = {
  klimawandel: 'Klimawandel',
  klimaresilient: 'Klimaresilienter Kaffee',
  excelsa: 'Excelsa',
};

const CATEGORY_LABELS_EN: Record<WissenCategory, string> = {
  klimawandel: 'Climate change',
  klimaresilient: 'Climate-resilient coffee',
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

export async function getAllWissenArticles(lang: Lang = 'de'): Promise<WissenArticle[]> {
  const entries = await reader.collections.wissen.all();
  const categoryLabels = lang === 'en' ? CATEGORY_LABELS_EN : CATEGORY_LABELS;
  return entries
    .map(({ slug, entry }) => {
      const content = lang === 'en' ? (entry.contentEn ?? entry.contentDe) : entry.contentDe;
      const fallbackContent = entry.contentDe;
      return {
        slug,
        href: lang === 'en' ? `/en/knowledge/${slug}` : `/wissen/${slug}`,
        category: entry.category as WissenCategory,
        categoryLabel: categoryLabels[entry.category as WissenCategory],
        title: entry.title,
        subtitle: content?.subtitle || fallbackContent?.subtitle || '',
        publishedAt: entry.publishedAt ?? '',
        readingTime: entry.readingTime ?? 5,
        readingTimeLabel: `${entry.readingTime ?? 5} ${lang === 'en' ? 'min' : 'Min'}`,
        image: resolveCmsImage(entry.heroImage),
        body: content?.body || fallbackContent?.body || '',
      };
    })
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''));
}

export async function getRandomWissenArticles(count: number, lang: Lang = 'de'): Promise<WissenArticle[]> {
  const all = await getAllWissenArticles(lang);
  const shuffled = [...all];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}
