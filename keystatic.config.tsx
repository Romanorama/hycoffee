import { config, fields, collection, singleton } from '@keystatic/core';

const assetImage = (section: string, relativePathToSrc: '../' | '../../') => ({
  directory: `src/assets/images/cms/${section}`,
  publicPath: `${relativePathToSrc}assets/images/cms/${section}/`,
});

const contentImage = (section: string) => assetImage(section, '../../');
const dataImage = (section: string) => assetImage(section, '../');
const publicFile = (directory: string, publicPath: string) => ({ directory, publicPath });

export default config({
  storage: { kind: 'local' },

  ui: {
    brand: { name: 'HyCoffee' },
    navigation: {
      Inhalt: ['home', 'ueberUns', 'originsPage', 'kaffee'],
      Sammlungen: ['wissen', 'kaffeeSamples', 'originStories', 'press', 'team'],
      Rechtliches: ['impressum', 'agb', 'datenschutz'],
      Global: ['global'],
    },
  },

  collections: {
    wissen: collection({
      label: 'Wissen-Artikel',
      slugField: 'title',
      path: 'src/content/wissen/*',
      schema: {
        title: fields.slug({ name: { label: 'Titel' } }),
        category: fields.select({
          label: 'Kategorie',
          options: [
            { label: 'Klimawandel', value: 'klimawandel' },
            { label: 'Klimaresilienter Kaffee', value: 'klimaresilient' },
            { label: 'Excelsa', value: 'excelsa' },
          ],
          defaultValue: 'klimawandel',
        }),
        subtitle: fields.text({ label: 'Untertitel', multiline: true }),
        publishedAt: fields.date({ label: 'Veröffentlicht am' }),
        readingTime: fields.integer({ label: 'Lesezeit (Minuten)', defaultValue: 5 }),
        heroImage: fields.image({
          label: 'Titelbild',
          ...contentImage('wissen'),
        }),
        body: fields.text({
          label: 'Inhalt',
          multiline: true,
          description: 'Absätze durch Leerzeile trennen.',
        }),
      },
    }),

    kaffeeSamples: collection({
      label: 'Kaffee-Samples',
      slugField: 'name',
      path: 'src/content/kaffee-samples/*',
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        species: fields.select({
          label: 'Art',
          options: [
            { label: 'Arabica', value: 'arabica' },
            { label: 'Excelsa', value: 'excelsa' },
          ],
          defaultValue: 'arabica',
        }),
        country: fields.text({ label: 'Herkunftsland' }),
        score: fields.text({ label: 'Score' }),
        process: fields.text({ label: 'Verarbeitung' }),
        variety: fields.text({ label: 'Varietät' }),
        harvest: fields.text({ label: 'Ernte' }),
        region: fields.text({ label: 'Region' }),
        altitude: fields.text({ label: 'Höhe' }),
        flavourNotes: fields.text({ label: 'Flavour Notes', multiline: true }),
        intro: fields.text({ label: 'Einleitung', multiline: true }),
        heroImage: fields.image({
          label: 'Produktbild',
          ...contentImage('kaffee'),
        }),
        pdfDownload: fields.file({
          label: 'Product Sheet (PDF)',
          ...publicFile('public/downloads', '/downloads/'),
        }),
        resilienceText: fields.text({ label: 'Klimaresilienz-Text', multiline: true }),
        socialText: fields.text({ label: 'Sozial-Text', multiline: true }),
        available: fields.checkbox({ label: 'Verfügbar', defaultValue: true }),
        sortOrder: fields.integer({ label: 'Reihenfolge', defaultValue: 0 }),
      },
    }),

    press: collection({
      label: 'Presse',
      slugField: 'title',
      path: 'src/content/press/*',
      schema: {
        title: fields.slug({ name: { label: 'Titel' } }),
        outlet: fields.text({ label: 'Medium (z.B. ARTE, ZDF)' }),
        logoImage: fields.image({
          label: 'Medien-Logo',
          ...contentImage('press'),
        }),
        featureImage: fields.image({
          label: 'Feature-Bild',
          ...contentImage('press'),
        }),
        excerpt: fields.text({ label: 'Beschreibung', multiline: true }),
        readingTime: fields.integer({ label: 'Lesezeit (Minuten)', defaultValue: 2 }),
        externalLink: fields.url({ label: 'Link zum Artikel' }),
      },
    }),

    originStories: collection({
      label: 'Origin-Stories',
      slugField: 'title',
      path: 'src/content/origin-stories/*',
      schema: {
        title: fields.slug({ name: { label: 'Titel' } }),
        country: fields.select({
          label: 'Land',
          options: [
            { label: 'Uganda', value: 'uganda' },
            { label: 'Kenia', value: 'kenia' },
          ],
          defaultValue: 'uganda',
        }),
        species: fields.text({ label: 'Art (Arabica / Excelsa)' }),
        region: fields.text({ label: 'Region' }),
        image1: fields.image({
          label: 'Bild 1',
          ...contentImage('origins'),
        }),
        image1Alt: fields.text({ label: 'Bild 1 Alt-Text' }),
        image2: fields.image({
          label: 'Bild 2',
          ...contentImage('origins'),
        }),
        image2Alt: fields.text({ label: 'Bild 2 Alt-Text' }),
        sortOrder: fields.integer({ label: 'Reihenfolge', defaultValue: 0 }),
        body: fields.text({
          label: 'Text',
          multiline: true,
          description: 'Absätze durch Leerzeile trennen.',
        }),
      },
    }),

    team: collection({
      label: 'Team (Kontaktkarten)',
      slugField: 'name',
      path: 'src/content/team/*',
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        role: fields.text({ label: 'Rolle' }),
        email: fields.text({ label: 'E-Mail' }),
        phone: fields.text({ label: 'Telefon' }),
        portrait: fields.image({
          label: 'Portraitfoto',
          ...contentImage('team'),
        }),
        sortOrder: fields.integer({ label: 'Reihenfolge', defaultValue: 0 }),
      },
    }),
  },

  singletons: {
    global: singleton({
      label: 'Global (Kontakt, Footer, Social)',
      path: 'src/data/global/',
      previewUrl: 'http://localhost:4321/',
      schema: {
        email: fields.text({ label: 'E-Mail' }),
        phone: fields.text({ label: 'Telefon' }),
        address: fields.text({ label: 'Adresse', multiline: true }),
        instagramUrl: fields.url({ label: 'Instagram URL' }),
        linkedinUrl: fields.url({ label: 'LinkedIn URL' }),
        footerTagline: fields.text({ label: 'Footer-Claim' }),
        newsletterLabel: fields.text({ label: 'Newsletter-Label' }),
        newsletterButton: fields.text({ label: 'Newsletter-Button' }),
        navContactLabel: fields.text({ label: 'Navi-Kontakt-Button' }),
      },
    }),

    home: singleton({
      label: 'Home',
      path: 'src/data/home/',
      previewUrl: 'http://localhost:4321/',
      schema: {
        heroHeadline: fields.text({ label: 'Hero-Überschrift', multiline: true }),
        heroImage: fields.image({
          label: 'Hero-Bild',
          ...dataImage('home'),
        }),
        heroCtaLabel: fields.text({ label: 'Hero-Button' }),
        heroCtaUrl: fields.text({ label: 'Hero-Button-Link' }),

        tiles: fields.array(
          fields.object({
            category: fields.text({ label: 'Kategorie' }),
            heading: fields.text({ label: 'Überschrift' }),
            body: fields.text({ label: 'Text', multiline: true }),
            ctaLabel: fields.text({ label: 'Button-Text' }),
            ctaUrl: fields.text({ label: 'Button-Link' }),
            color: fields.select({
              label: 'Farbe',
              options: [
                { label: 'Violett', value: 'violet' },
                { label: 'Grün', value: 'green' },
              ],
              defaultValue: 'violet',
            }),
          }),
          {
            label: 'Tiles',
            itemLabel: (p) => p.fields.heading.value || 'Tile',
            validation: { length: { min: 2, max: 2 } },
          },
        ),

        valuesHeading: fields.text({ label: 'Values-Überschrift' }),
        valuesBody: fields.text({ label: 'Values-Text', multiline: true }),

        teamStripImages: fields.array(
          fields.image({
            label: 'Bild',
            ...dataImage('team-strip'),
          }),
          { label: 'Team-Fotostreifen', itemLabel: (p) => p.value?.filename ?? 'Bild' },
        ),
        teamBlurb: fields.text({ label: 'Team-Einleitung', multiline: true }),
        teamMissionHeading: fields.text({ label: 'Mission-Überschrift' }),
        teamCtaLabel: fields.text({ label: 'Team-Button' }),

        speciesHeading: fields.text({ label: 'Species-Überschrift', multiline: true }),
        speciesExpandedPhoto: fields.image({
          label: 'Species-Foto',
          ...dataImage('home'),
        }),
        speciesExpandedBody: fields.text({ label: 'Species-Text', multiline: true }),

        scienceLabel: fields.text({ label: 'Science-Label' }),
        scienceHeading: fields.text({ label: 'Science-Überschrift' }),
        scienceBody: fields.text({ label: 'Science-Text', multiline: true }),
        scienceCtaLabel: fields.text({ label: 'Science-Button' }),
        scienceFeaturedArticles: fields.array(
          fields.relationship({ label: 'Artikel', collection: 'wissen' }),
          {
            label: 'Empfohlene Artikel (3 auswählen, sonst werden zufällige gezeigt)',
            itemLabel: (p) => p.value ?? 'Artikel',
            validation: { length: { max: 3 } },
          },
        ),

        pressHeading: fields.text({ label: 'Presse-Überschrift' }),
      },
    }),

    ueberUns: singleton({
      label: 'Über uns',
      path: 'src/data/ueber-uns/',
      schema: {
        stripImages: fields.array(
          fields.image({
            label: 'Bild',
            ...dataImage('strip'),
          }),
          { label: 'Fotostreifen', itemLabel: (p) => p.value?.filename ?? 'Bild' },
        ),
        heroImage: fields.image({
          label: 'Hero-Bild',
          ...dataImage('about'),
        }),
        heroText: fields.text({ label: 'Hero-Text', multiline: true }),
        storyHeading: fields.text({ label: 'Story-Überschrift' }),
        storyBody: fields.text({
          label: 'Story-Text',
          multiline: true,
          description: 'Absätze durch Leerzeile trennen.',
        }),
        originsBannerText: fields.text({ label: 'Origins-Banner-Text' }),
        originsBannerCtaLabel: fields.text({ label: 'Origins-Banner-Button' }),
        sayHiHeading: fields.text({ label: 'Say-Hi-Überschrift' }),
        sayHiEmail: fields.text({ label: 'Say-Hi-Email' }),
      },
    }),

    originsPage: singleton({
      label: 'Origins-Seite',
      path: 'src/data/origins/',
      schema: {
        ugandaHeading: fields.text({ label: 'Uganda-Überschrift', defaultValue: 'Uganda' }),
        kenyaHeading: fields.text({ label: 'Kenia-Überschrift', defaultValue: 'Kenia' }),
      },
    }),

    kaffee: singleton({
      label: 'Kaffee-Seite',
      path: 'src/data/kaffee/',
      schema: {
        pageHeading: fields.text({ label: 'Seiten-Überschrift' }),
        pageIntro: fields.text({ label: 'Seiten-Einleitung', multiline: true }),
        samplesSoldOut: fields.checkbox({
          label: 'Samples ausverkauft (globaler Schalter)',
          description:
            'Wenn aktiviert: alle "Add Sample"-Buttons werden zu "Sold out" und das Popup erscheint beim Klick.',
          defaultValue: false,
        }),
        soldOutPopupKicker: fields.text({ label: 'Sold-out-Popup: Kicker', defaultValue: 'Samples' }),
        soldOutPopupTitle: fields.text({ label: 'Sold-out-Popup: Titel' }),
        soldOutPopupCopy: fields.text({
          label: 'Sold-out-Popup: Text',
          multiline: true,
        }),
        soldOutPopupPrimaryLabel: fields.text({
          label: 'Sold-out-Popup: Primär-Button',
          defaultValue: 'Benachrichtige mich',
        }),
        soldOutPopupPrimaryHref: fields.text({
          label: 'Sold-out-Popup: Primär-Button-Link (z.B. mailto:...)',
        }),
      },
    }),

    impressum: singleton({
      label: 'Impressum',
      path: 'src/data/impressum/',
      schema: {
        heading: fields.text({ label: 'Seiten-Überschrift' }),
        sections: fields.array(
          fields.object({
            heading: fields.text({ label: 'Abschnitt-Überschrift' }),
            body: fields.text({
              label: 'Text',
              multiline: true,
              description:
                'Absätze durch Leerzeile trennen. Links: [Text](https://url). Zeilenumbruch: einfach Enter drücken.',
            }),
          }),
          {
            label: 'Abschnitte',
            itemLabel: (p) => p.fields.heading.value || 'Abschnitt',
          },
        ),
      },
    }),

    agb: singleton({
      label: 'AGB',
      path: 'src/data/agb/',
      schema: {
        heading: fields.text({ label: 'Seiten-Überschrift' }),
        sections: fields.array(
          fields.object({
            heading: fields.text({ label: 'Abschnitt-Überschrift' }),
            body: fields.text({
              label: 'Text',
              multiline: true,
              description:
                'Absätze durch Leerzeile trennen. Links: [Text](https://url). Zeilenumbruch: einfach Enter drücken.',
            }),
          }),
          {
            label: 'Abschnitte',
            itemLabel: (p) => p.fields.heading.value || 'Abschnitt',
          },
        ),
      },
    }),

    datenschutz: singleton({
      label: 'Datenschutzerklärung',
      path: 'src/data/datenschutz/',
      schema: {
        heading: fields.text({ label: 'Seiten-Überschrift' }),
        sections: fields.array(
          fields.object({
            heading: fields.text({ label: 'Abschnitt-Überschrift' }),
            body: fields.text({
              label: 'Text',
              multiline: true,
              description:
                'Absätze durch Leerzeile trennen. Links: [Text](https://url). Zeilenumbruch: einfach Enter drücken.',
            }),
          }),
          {
            label: 'Abschnitte',
            itemLabel: (p) => p.fields.heading.value || 'Abschnitt',
          },
        ),
      },
    }),
  },
});
