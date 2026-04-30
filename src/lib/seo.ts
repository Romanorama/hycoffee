import { getAllWissenArticles } from './wissen';

export const SITE_URL = 'https://hycoffee.de';
export const SITE_NAME = 'HyCoffee';
export const DEFAULT_DESCRIPTION =
  'HyCoffee importiert klimaresiliente Spezialitätenkaffees und verbindet Kaffeehandel mit Klimaanpassung, Forschung und fairen Lieferketten.';
export const DEFAULT_DESCRIPTION_EN =
  'HyCoffee imports climate-resilient specialty coffees and connects coffee trade with climate adaptation, research, and fair supply chains.';

export function toAbsoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function getBaseSchemas() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      legalName: 'HyCoffee UG (haftungsbeschränkt)',
      url: SITE_URL,
      email: 'info@hycoffee.de',
      sameAs: [
        'https://www.instagram.com/hycoffeeco/',
        'https://de.linkedin.com/company/hycoffee',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: ['de-DE', 'en-US'],
    },
  ];
}

export interface SitemapEntry {
  path: string;
  lastmod?: string;
}

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const articles = await getAllWissenArticles();
  const englishArticles = await getAllWissenArticles('en');
  const articleEntry = (article: { href: string; publishedAt: string; updatedAt: string }): SitemapEntry => ({
    path: article.href,
    lastmod: article.updatedAt || article.publishedAt || undefined,
  });
  const seen = new Set<string>();
  const entries: SitemapEntry[] = [];
  const push = (entry: SitemapEntry) => {
    if (seen.has(entry.path)) return;
    seen.add(entry.path);
    entries.push(entry);
  };
  ['/', '/kaffee', '/origins', '/ueber-uns', '/wissen'].forEach((path) => push({ path }));
  articles.forEach((article) => push(articleEntry(article)));
  ['/en/', '/en/coffee', '/en/origins', '/en/about', '/en/knowledge'].forEach((path) => push({ path }));
  englishArticles.forEach((article) => push(articleEntry(article)));
  return entries;
}
