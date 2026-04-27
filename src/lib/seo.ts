import { getAllWissenArticles } from './wissen';

export const SITE_URL = 'https://hycoffee.de';
export const SITE_NAME = 'HyCoffee';
export const DEFAULT_DESCRIPTION =
  'HyCoffee importiert klimaresiliente Spezialitaetenkaffees und verbindet Kaffeehandel mit Klimaanpassung, Forschung und fairen Lieferketten.';

export function toAbsoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function getBaseSchemas() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      legalName: 'HyCoffee UG (haftungsbeschraenkt)',
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
      inLanguage: 'de-DE',
    },
  ];
}

export async function getSitemapPaths() {
  const articles = await getAllWissenArticles();
  return Array.from(
    new Set([
      '/',
      '/kaffee',
      '/origins',
      '/ueber-uns',
      '/wissen',
      ...articles.map((article) => article.href),
    ]),
  );
}
