export type Lang = 'de' | 'en';

export const DEFAULT_LANG: Lang = 'de';

export const locales: Record<Lang, { html: string; og: string; label: string }> = {
  de: { html: 'de', og: 'de_DE', label: 'DE' },
  en: { html: 'en', og: 'en_US', label: 'EN' },
};

const deToEnPaths: Record<string, string> = {
  '/': '/en/',
  '/kaffee': '/en/coffee',
  '/wissen': '/en/knowledge',
  '/origins': '/en/origins',
  '/ueber-uns': '/en/about',
  '/agb': '/agb',
  '/datenschutz': '/datenschutz',
  '/impressum': '/impressum',
};

const enToDePaths = Object.fromEntries(
  Object.entries(deToEnPaths).map(([de, en]) => [normalizePath(en), de]),
) as Record<string, string>;

export function normalizePath(pathname: string) {
  if (pathname === '/') return '/';
  return pathname.replace(/\/+$/, '');
}

export function getLangFromPath(pathname: string): Lang {
  return normalizePath(pathname).startsWith('/en') ? 'en' : 'de';
}

export function getLocalizedPath(pathname: string, targetLang: Lang) {
  const path = normalizePath(pathname);
  if (targetLang === 'en') {
    if (path.startsWith('/wissen/')) return path.replace('/wissen/', '/en/knowledge/');
    return deToEnPaths[path] ?? (path.startsWith('/en') ? path : `/en${path}`);
  }

  if (path.startsWith('/en/knowledge/')) return path.replace('/en/knowledge/', '/wissen/');
  return enToDePaths[path] ?? (path.replace(/^\/en(?=\/|$)/, '') || '/');
}

export function getNavPath(route: 'home' | 'coffee' | 'knowledge' | 'origins' | 'about', lang: Lang) {
  const paths: Record<typeof route, Record<Lang, string>> = {
    home: { de: '/', en: '/en/' },
    coffee: { de: '/kaffee', en: '/en/coffee' },
    knowledge: { de: '/wissen', en: '/en/knowledge' },
    origins: { de: '/origins', en: '/en/origins' },
    about: { de: '/ueber-uns', en: '/en/about' },
  };
  return paths[route][lang];
}

export const ui = {
  de: {
    contact: 'Kontakt',
    menu: 'MENU',
    close: 'CLOSE',
    nav: {
      home: 'Home',
      coffee: 'Kaffee kaufen',
      knowledge: 'Wissen',
      origins: 'Origins',
      about: 'Über Uns',
    },
    footer: {
      contact: 'Kontakt',
      navigation: 'Navigation',
      follow: 'Folge uns',
      newsletterCopy: 'Join the growing community',
      rights: 'All rights reserved.',
      subscribeLabel: 'Newsletter abonnieren',
    },
    knowledge: {
      readArticle: 'Artikel lesen',
      related: 'RELATED',
      min: 'Min',
    },
  },
  en: {
    contact: 'Contact',
    menu: 'MENU',
    close: 'CLOSE',
    nav: {
      home: 'Home',
      coffee: 'Buy coffee',
      knowledge: 'Knowledge',
      origins: 'Origins',
      about: 'About',
    },
    footer: {
      contact: 'Contact',
      navigation: 'Navigation',
      follow: 'Follow us',
      newsletterCopy: 'Join the growing community',
      rights: 'All rights reserved.',
      subscribeLabel: 'Subscribe to newsletter',
    },
    knowledge: {
      readArticle: 'Read article',
      related: 'RELATED',
      min: 'min',
    },
  },
} satisfies Record<Lang, unknown>;
