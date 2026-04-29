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
  blocks: WissenArticleBlock[];
}

export type WissenArticleBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'image'; image: ImageMetadata | null; alt: string; caption: string };

type WissenRawContent = {
  title?: string;
  subtitle?: string;
  body?: string;
  blocks?: readonly {
    discriminant: string;
    value?: {
      text?: string;
      image?: string | null;
      alt?: string;
      caption?: string;
    };
  }[];
};

function textToParagraphBlocks(text: string | undefined): WissenArticleBlock[] {
  return (text ?? '')
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => ({ type: 'paragraph', text: paragraph }));
}

function normalizeArticleBlocks(content: WissenRawContent | undefined, fallbackBody: string | undefined): WissenArticleBlock[] {
  const blocks = content?.blocks ?? [];
  if (blocks.length === 0) return textToParagraphBlocks(content?.body || fallbackBody);

  return blocks.flatMap((block): WissenArticleBlock[] => {
    const value = block.value ?? {};
    if (block.discriminant === 'subheading') {
      const text = value.text?.trim();
      return text ? [{ type: 'subheading', text }] : [];
    }

    if (block.discriminant === 'image') {
      return [{
        type: 'image',
        image: resolveCmsImage(value.image),
        alt: value.alt ?? '',
        caption: value.caption ?? '',
      }];
    }

    return textToParagraphBlocks(value.text);
  });
}

export async function getAllWissenArticles(lang: Lang = 'de'): Promise<WissenArticle[]> {
  const entries = await reader.collections.wissen.all();
  const categoryLabels = lang === 'en' ? CATEGORY_LABELS_EN : CATEGORY_LABELS;
  return entries
    .map(({ slug, entry }) => {
      const content = (lang === 'en' ? (entry.contentEn ?? entry.contentDe) : entry.contentDe) as WissenRawContent;
      const fallbackContent = entry.contentDe as WissenRawContent;
      const body = content?.body || fallbackContent?.body || '';
      return {
        slug,
        href: lang === 'en' ? `/en/knowledge/${slug}` : `/wissen/${slug}`,
        category: entry.category as WissenCategory,
        categoryLabel: categoryLabels[entry.category as WissenCategory],
        title: lang === 'en' ? content?.title || entry.title : entry.title,
        subtitle: content?.subtitle || fallbackContent?.subtitle || '',
        publishedAt: entry.publishedAt ?? '',
        readingTime: entry.readingTime ?? 5,
        readingTimeLabel: `${entry.readingTime ?? 5} ${lang === 'en' ? 'min' : 'Min'}`,
        image: resolveCmsImage(entry.heroImage),
        body,
        blocks: normalizeArticleBlocks(content, fallbackContent?.body),
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
