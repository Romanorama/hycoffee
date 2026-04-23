import type { ImageMetadata } from 'astro';
import wissen1 from '../assets/images/origins-arabica-1.webp';
import wissen2 from '../assets/images/ambe-anaerobic.webp';
import wissen3 from '../assets/images/excelsa.webp';
import wissen4 from '../assets/images/banner.webp';
import wissen5 from '../assets/images/origins-excelsa-1.webp';
import wissen6 from '../assets/images/disco3.webp';

export interface WissenArticle {
  category: string;
  title: string;
  subtitle: string;
  readingTime: string;
  image: ImageMetadata;
  href: string;
}

export const wissenArticles: WissenArticle[] = [
  {
    category: 'Klimawandel',
    title: 'Wie Hitze den Arabica-Anbau veraendert',
    subtitle: 'Warum steigende Durchschnittstemperaturen die Hoehenlagen neu definieren.',
    readingTime: '5 Min',
    image: wissen1,
    href: '/wissen/klimawandel-kaffeeanbau',
  },
  {
    category: 'Klimaresilienter Kaffee',
    title: 'Agroforst als Antwort auf Trockenstress',
    subtitle: 'Schattenbaeume stabilisieren Ertraege und verbessern die Bodenfeuchte.',
    readingTime: '7 Min',
    image: wissen2,
    href: '/wissen/klimawandel-kaffeeanbau',
  },
  {
    category: 'Excelsa',
    title: 'Excelsa im Cupping: Fruchtig und wuerzig',
    subtitle: 'Ein Blick auf Geschmack, Struktur und Blend-Potenzial fuer Roestereien.',
    readingTime: '6 Min',
    image: wissen3,
    href: '/wissen/klimawandel-kaffeeanbau',
  },
  {
    category: 'Klimawandel',
    title: 'Wasserknappheit in Ostafrika',
    subtitle: 'Welche Regionen besonders betroffen sind und welche Strategien greifen.',
    readingTime: '4 Min',
    image: wissen4,
    href: '/wissen/klimawandel-kaffeeanbau',
  },
  {
    category: 'Klimaresilienter Kaffee',
    title: 'Neue Sorten fuer stabile Ernten',
    subtitle: 'Wie Selektion und Diversitaet die Lieferkette robuster machen.',
    readingTime: '8 Min',
    image: wissen5,
    href: '/wissen/klimawandel-kaffeeanbau',
  },
  {
    category: 'Excelsa',
    title: 'Vom Feld bis zur Roestung: Excelsa Prozess',
    subtitle: 'Verarbeitungsschritte, die das Profil von Excelsa praegen.',
    readingTime: '5 Min',
    image: wissen6,
    href: '/wissen/klimawandel-kaffeeanbau',
  },
];

export function getRandomWissenArticles(count: number) {
  const shuffled = [...wissenArticles];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled.slice(0, count);
}
