import { config, fields, collection, singleton } from '@keystatic/core';

const assetImage = (section: string, relativePathToSrc: '../' | '../../') => ({
  directory: `src/assets/images/cms/${section}`,
  publicPath: `${relativePathToSrc}assets/images/cms/${section}/`,
});

const contentImage = (section: string) => assetImage(section, '../../');
const dataImage = (section: string) => assetImage(section, '../');
const publicFile = (directory: string, publicPath: string) => ({ directory, publicPath });

const articleBlocks = (lang: 'de' | 'en') => fields.blocks(
  {
    paragraph: {
      label: lang === 'de' ? 'Textabsatz' : 'Paragraph',
      schema: fields.object({
        text: fields.text({
          label: lang === 'de' ? 'Text' : 'Text',
          multiline: true,
          description: lang === 'de'
            ? 'Absätze durch Leerzeile trennen.'
            : 'Separate paragraphs with a blank line.',
        }),
      }),
    },
    subheading: {
      label: lang === 'de' ? 'Zwischentitel' : 'Subheading',
      schema: fields.object({
        text: fields.text({ label: lang === 'de' ? 'Zwischentitel' : 'Subheading' }),
      }),
    },
    image: {
      label: lang === 'de' ? 'Bild' : 'Image',
      schema: fields.object({
        image: fields.image({
          label: lang === 'de' ? 'Bild' : 'Image',
          ...contentImage('wissen'),
        }),
        alt: fields.text({ label: lang === 'de' ? 'Alt-Text' : 'Alt text' }),
        caption: fields.text({
          label: lang === 'de' ? 'Bildunterschrift' : 'Caption',
          multiline: true,
        }),
      }),
    },
  },
  {
    label: lang === 'de' ? 'Artikelblöcke' : 'Article blocks',
    description: lang === 'de'
      ? 'Absätze, Zwischentitel und Bilder frei kombinieren und sortieren.'
      : 'Combine and reorder paragraphs, subheadings, and images.',
  },
);

export default config({
  storage: import.meta.env.PROD
    ? { kind: 'github', repo: 'Romanorama/hycoffee' }
    : { kind: 'local' },

  ui: {
    brand: { name: 'HyCoffee' },
    navigation: {
      Inhalt: ['home', 'kaffee', 'wissen', 'originsPage', 'ueberUns'],
      Sammlungen: ['kaffeeSamples', 'originStories', 'press', 'team'],
      Rechtliches: ['impressum', 'agb', 'datenschutz'],
      Global: ['global'],
    },
  },

  collections: {
    wissen: collection({
      label: 'Wissen',
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
        contentDe: fields.object(
          {
            subtitle: fields.text({ label: 'Untertitel', multiline: true }),
            heroImageAlt: fields.text({ label: 'Titelbild Alt-Text' }),
            body: fields.text({
              label: 'Inhalt',
              multiline: true,
              description: 'Legacy-Fallback. Für neue Artikel bitte Artikelblöcke verwenden.',
            }),
            blocks: articleBlocks('de'),
          },
          { label: 'Deutsch' },
        ),
        contentEn: fields.object(
          {
            title: fields.text({ label: 'Title' }),
            subtitle: fields.text({ label: 'Subtitle', multiline: true }),
            heroImageAlt: fields.text({ label: 'Hero image alt text' }),
            body: fields.text({
              label: 'Body',
              multiline: true,
              description: 'Legacy fallback. For new articles, use Article blocks.',
            }),
            blocks: articleBlocks('en'),
          },
          { label: 'English' },
        ),
        publishedAt: fields.date({ label: 'Veröffentlicht am' }),
        updatedAt: fields.date({
          label: 'Zuletzt aktualisiert am',
          description: 'Optional. Wenn gesetzt, wird der Artikel als aktualisiert markiert (für SEO und Sitemap).',
        }),
        readingTime: fields.integer({ label: 'Lesezeit (Minuten)', defaultValue: 5 }),
        heroImage: fields.image({
          label: 'Titelbild',
          ...contentImage('wissen'),
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
        price: fields.text({ label: 'Preis (z.B. 13,90 €/kg)' }),
        availability: fields.text({ label: 'Verfügbarkeit (z.B. 6x60kg)' }),
        arrival: fields.text({ label: 'Ankunft (z.B. Mai 2026)' }),
        variety: fields.text({ label: 'Varietät' }),
        harvest: fields.text({ label: 'Ernte' }),
        region: fields.text({ label: 'Region' }),
        altitude: fields.text({ label: 'Höhe' }),
        flavourNotes: fields.text({ label: 'Flavour Notes', multiline: true }),
        contentDe: fields.object(
          {
            intro: fields.text({ label: 'Einleitung', multiline: true }),
            heroImageAlt: fields.text({ label: 'Produktbild Alt-Text' }),
            resilienceText: fields.text({ label: 'Klimaresilienz-Text', multiline: true }),
            socialText: fields.text({ label: 'Sozial-Text', multiline: true }),
          },
          { label: 'Deutsch' },
        ),
        contentEn: fields.object(
          {
            intro: fields.text({ label: 'Intro', multiline: true }),
            heroImageAlt: fields.text({ label: 'Product image alt text' }),
            resilienceText: fields.text({ label: 'Climate resilience text', multiline: true }),
            socialText: fields.text({ label: 'Social impact text', multiline: true }),
          },
          { label: 'English' },
        ),
        heroImage: fields.image({
          label: 'Produktbild',
          ...contentImage('kaffee'),
        }),
        pdfDownload: fields.file({
          label: 'Product Sheet (PDF)',
          ...publicFile('public/downloads', '/downloads/'),
        }),
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
        contentDe: fields.object(
          {
            excerpt: fields.text({ label: 'Beschreibung', multiline: true }),
            logoAlt: fields.text({ label: 'Medien-Logo Alt-Text' }),
            featureImageAlt: fields.text({ label: 'Feature-Bild Alt-Text' }),
          },
          { label: 'Deutsch' },
        ),
        contentEn: fields.object(
          {
            excerpt: fields.text({ label: 'Description', multiline: true }),
            logoAlt: fields.text({ label: 'Media logo alt text' }),
            featureImageAlt: fields.text({ label: 'Feature image alt text' }),
          },
          { label: 'English' },
        ),
        readingTime: fields.integer({ label: 'Lesezeit (Minuten)', defaultValue: 2 }),
        externalLink: fields.url({ label: 'Link zum Artikel' }),
        sortOrder: fields.integer({
          label: 'Reihenfolge',
          description: 'Niedrige Zahlen erscheinen zuerst. Neue Einträge können damit wie die bestehenden Karten einsortiert werden.',
          defaultValue: 0,
        }),
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
        species: fields.text({ label: 'Art / Species (Arabica / Excelsa)' }),
        contentDe: fields.object(
          {
            region: fields.text({ label: 'Region' }),
            image1Alt: fields.text({ label: 'Bild 1 Alt-Text' }),
            image2Alt: fields.text({ label: 'Bild 2 Alt-Text' }),
            body: fields.text({
              label: 'Text',
              multiline: true,
              description: 'Absätze durch Leerzeile trennen.',
            }),
          },
          { label: 'Deutsch' },
        ),
        contentEn: fields.object(
          {
            region: fields.text({ label: 'Region' }),
            image1Alt: fields.text({ label: 'Image 1 alt text' }),
            image2Alt: fields.text({ label: 'Image 2 alt text' }),
            body: fields.text({
              label: 'Text',
              multiline: true,
              description: 'Separate paragraphs with a blank line.',
            }),
          },
          { label: 'English' },
        ),
        image1: fields.image({
          label: 'Bild 1',
          ...contentImage('origins'),
        }),
        image2: fields.image({
          label: 'Bild 2',
          ...contentImage('origins'),
        }),
        sortOrder: fields.integer({ label: 'Reihenfolge', defaultValue: 0 }),
      },
    }),

    team: collection({
      label: 'Team (Kontaktkarten)',
      slugField: 'name',
      path: 'src/content/team/*',
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        contentDe: fields.object(
          {
            role: fields.text({ label: 'Rolle' }),
            portraitAlt: fields.text({ label: 'Portrait Alt-Text' }),
          },
          { label: 'Deutsch' },
        ),
        contentEn: fields.object(
          {
            role: fields.text({ label: 'Role' }),
            portraitAlt: fields.text({ label: 'Portrait alt text' }),
          },
          { label: 'English' },
        ),
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
        contentDe: fields.object(
          {
            footerTagline: fields.text({ label: 'Footer-Claim' }),
            newsletterLabel: fields.text({ label: 'Newsletter-Label' }),
            newsletterButton: fields.text({ label: 'Newsletter-Button' }),
            navContactLabel: fields.text({ label: 'Navi-Kontakt-Button' }),
          },
          { label: 'Deutsch' },
        ),
        contentEn: fields.object(
          {
            footerTagline: fields.text({ label: 'Footer tagline' }),
            newsletterLabel: fields.text({ label: 'Newsletter label' }),
            newsletterButton: fields.text({ label: 'Newsletter button' }),
            navContactLabel: fields.text({ label: 'Nav contact button' }),
          },
          { label: 'English' },
        ),
      },
    }),

    home: singleton({
      label: 'Home',
      path: 'src/data/home/',
      previewUrl: 'http://localhost:4321/',
      schema: {
        contentDe: fields.object(
          {
            heroHeadline: fields.text({ label: 'Hero-Überschrift', multiline: true }),
            heroCtaLabel: fields.text({ label: 'Hero-Button' }),
            tiles: fields.array(
              fields.object({
                category: fields.text({ label: 'Kategorie' }),
                heading: fields.text({ label: 'Überschrift' }),
                body: fields.text({ label: 'Text', multiline: true }),
                ctaLabel: fields.text({ label: 'Button-Text' }),
              }),
              {
                label: 'Tiles',
                itemLabel: (p) => p.fields.heading.value || 'Tile',
                validation: { length: { min: 2, max: 2 } },
              },
            ),
            valuesHeading: fields.text({ label: 'Values-Überschrift' }),
            valuesBody: fields.text({ label: 'Values-Text', multiline: true }),
            teamBlurb: fields.text({ label: 'Team-Einleitung', multiline: true }),
            teamMissionHeading: fields.text({ label: 'Mission-Überschrift' }),
            teamCtaLabel: fields.text({ label: 'Team-Button' }),
            speciesHeading: fields.text({ label: 'Species-Überschrift', multiline: true }),
            heroImageAlt: fields.text({ label: 'Hero-Bild Alt-Text' }),
            teamStripImageAlts: fields.array(
              fields.text({ label: 'Alt-Text' }),
              {
                label: 'Team-Fotostreifen Alt-Texte',
                itemLabel: (p) => p.value || 'Alt-Text',
              },
            ),
            speciesExpandedPhotoAlt: fields.text({ label: 'Species-Foto Alt-Text' }),
            speciesExpandedBody: fields.text({ label: 'Species-Text', multiline: true }),
            scienceLabel: fields.text({ label: 'Science-Label' }),
            scienceHeading: fields.text({ label: 'Science-Überschrift' }),
            scienceBody: fields.text({ label: 'Science-Text', multiline: true }),
            scienceCtaLabel: fields.text({ label: 'Science-Button' }),
            pressHeading: fields.text({ label: 'Presse-Überschrift' }),
          },
          { label: 'Deutsch' },
        ),
        contentEn: fields.object(
          {
            heroHeadline: fields.text({ label: 'Hero headline', multiline: true }),
            heroCtaLabel: fields.text({ label: 'Hero button' }),
            tiles: fields.array(
              fields.object({
                category: fields.text({ label: 'Category' }),
                heading: fields.text({ label: 'Heading' }),
                body: fields.text({ label: 'Text', multiline: true }),
                ctaLabel: fields.text({ label: 'Button text' }),
              }),
              {
                label: 'Tiles',
                itemLabel: (p) => p.fields.heading.value || 'Tile',
                validation: { length: { min: 2, max: 2 } },
              },
            ),
            valuesHeading: fields.text({ label: 'Values heading' }),
            valuesBody: fields.text({ label: 'Values text', multiline: true }),
            teamBlurb: fields.text({ label: 'Team intro', multiline: true }),
            teamMissionHeading: fields.text({ label: 'Mission heading' }),
            teamCtaLabel: fields.text({ label: 'Team button' }),
            speciesHeading: fields.text({ label: 'Species heading', multiline: true }),
            heroImageAlt: fields.text({ label: 'Hero image alt text' }),
            teamStripImageAlts: fields.array(
              fields.text({ label: 'Alt text' }),
              {
                label: 'Team photo strip alt texts',
                itemLabel: (p) => p.value || 'Alt text',
              },
            ),
            speciesExpandedPhotoAlt: fields.text({ label: 'Species photo alt text' }),
            speciesExpandedBody: fields.text({ label: 'Species text', multiline: true }),
            scienceLabel: fields.text({ label: 'Science label' }),
            scienceHeading: fields.text({ label: 'Science heading' }),
            scienceBody: fields.text({ label: 'Science text', multiline: true }),
            scienceCtaLabel: fields.text({ label: 'Science button' }),
            pressHeading: fields.text({ label: 'Press heading' }),
          },
          { label: 'English' },
        ),
        heroImage: fields.image({
          label: 'Hero-Bild',
          ...dataImage('home'),
        }),
        heroCtaUrl: fields.text({ label: 'Hero-Button-Link' }),

        tiles: fields.array(
          fields.object({
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
            itemLabel: (p) => p.fields.ctaUrl.value || 'Tile',
            validation: { length: { min: 2, max: 2 } },
          },
        ),

        teamStripImages: fields.array(
          fields.image({
            label: 'Bild',
            ...dataImage('team-strip'),
          }),
          { label: 'Team-Fotostreifen', itemLabel: (p) => p.value?.filename ?? 'Bild' },
        ),
        speciesVisibleDe: fields.checkbox({
          label: 'Species-Sektion anzeigen (Deutsch)',
          description: 'Wenn aktiv, wird die "130 Kaffeearten"-Sektion auf der deutschen Startseite angezeigt.',
          defaultValue: false,
        }),
        speciesVisibleEn: fields.checkbox({
          label: 'Species-Sektion anzeigen (Englisch)',
          description: 'Wenn aktiv, wird die "130 Kaffeearten"-Sektion auf der englischen Startseite angezeigt.',
          defaultValue: false,
        }),
        speciesExpandedPhoto: fields.image({
          label: 'Species-Foto',
          ...dataImage('home'),
        }),
        scienceFeaturedArticles: fields.array(
          fields.relationship({ label: 'Artikel', collection: 'wissen' }),
          {
            label: 'Empfohlene Artikel (3 auswählen, sonst werden zufällige gezeigt)',
            itemLabel: (p) => p.value ?? 'Artikel',
            validation: { length: { max: 3 } },
          },
        ),
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
        contentDe: fields.object(
          {
            heroText: fields.text({ label: 'Hero-Text', multiline: true }),
            heroImageAlt: fields.text({ label: 'Hero-Bild Alt-Text' }),
            stripImageAlts: fields.array(
              fields.text({ label: 'Alt-Text' }),
              {
                label: 'Fotostreifen Alt-Texte',
                itemLabel: (p) => p.value || 'Alt-Text',
              },
            ),
            storyHeading: fields.text({ label: 'Story-Überschrift' }),
            storyBody: fields.text({
              label: 'Story-Text',
              multiline: true,
              description: 'Absätze durch Leerzeile trennen.',
            }),
            originsBannerText: fields.text({ label: 'Origins-Banner-Text' }),
            originsBannerCtaLabel: fields.text({ label: 'Origins-Banner-Button' }),
            sayHiHeading: fields.text({ label: 'Say-Hi-Überschrift' }),
          },
          { label: 'Deutsch' },
        ),
        contentEn: fields.object(
          {
            heroText: fields.text({ label: 'Hero text', multiline: true }),
            heroImageAlt: fields.text({ label: 'Hero image alt text' }),
            stripImageAlts: fields.array(
              fields.text({ label: 'Alt text' }),
              {
                label: 'Photo strip alt texts',
                itemLabel: (p) => p.value || 'Alt text',
              },
            ),
            storyHeading: fields.text({ label: 'Story heading' }),
            storyBody: fields.text({
              label: 'Story text',
              multiline: true,
              description: 'Separate paragraphs with a blank line.',
            }),
            originsBannerText: fields.text({ label: 'Origins banner text' }),
            originsBannerCtaLabel: fields.text({ label: 'Origins banner button' }),
            sayHiHeading: fields.text({ label: 'Say hi heading' }),
          },
          { label: 'English' },
        ),
        sayHiEmail: fields.text({ label: 'Say-Hi-Email' }),
      },
    }),

    originsPage: singleton({
      label: 'Origin',
      path: 'src/data/origins/',
      schema: {
        contentDe: fields.object(
          {
            ugandaHeading: fields.text({ label: 'Uganda-Überschrift', defaultValue: 'Uganda' }),
            kenyaHeading: fields.text({ label: 'Kenia-Überschrift', defaultValue: 'Kenia' }),
          },
          { label: 'Deutsch' },
        ),
        contentEn: fields.object(
          {
            ugandaHeading: fields.text({ label: 'Uganda heading', defaultValue: 'Uganda' }),
            kenyaHeading: fields.text({ label: 'Kenya heading', defaultValue: 'Kenya' }),
          },
          { label: 'English' },
        ),
      },
    }),

    kaffee: singleton({
      label: 'Kaffee kaufen',
      path: 'src/data/kaffee/',
      schema: {
        contentDe: fields.object(
          {
            pageHeading: fields.text({ label: 'Seiten-Überschrift' }),
            pageIntro: fields.text({ label: 'Seiten-Einleitung', multiline: true }),
            tableNameLabel: fields.text({ label: 'Tabelle: Name', defaultValue: 'Name' }),
            tableSpeciesLabel: fields.text({ label: 'Tabelle: Art', defaultValue: 'Art' }),
            tableCountryLabel: fields.text({ label: 'Tabelle: Land', defaultValue: 'Land' }),
            tableProcessLabel: fields.text({ label: 'Tabelle: Verarbeitung', defaultValue: 'Verarbeitung' }),
            tablePriceLabel: fields.text({ label: 'Tabelle: Preis', defaultValue: 'Preis' }),
            tableAvailabilityLabel: fields.text({ label: 'Tabelle: Verfügbarkeit', defaultValue: 'Verfügbar' }),
            tableArrivalLabel: fields.text({ label: 'Tabelle: Ankunft', defaultValue: 'Ankunft' }),
            addSampleLabel: fields.text({ label: 'Button: Sample hinzufügen', defaultValue: 'Sample hinzufügen' }),
            addedSampleLabel: fields.text({ label: 'Button: Hinzugefügt', defaultValue: 'Hinzugefügt' }),
            soldOutLabel: fields.text({ label: 'Button: Ausverkauft', defaultValue: 'Ausverkauft' }),
            productSheetLabel: fields.text({ label: 'Button: Product Sheet', defaultValue: 'Product Sheet' }),
            checkoutButtonLabel: fields.text({ label: 'Checkout-Button', defaultValue: 'Anfragen' }),
            checkoutEmptyLabel: fields.text({ label: 'Checkout: keine Samples', defaultValue: '0 Samples ausgewählt' }),
            checkoutSoldOutLabel: fields.text({ label: 'Checkout: ausverkauft', defaultValue: 'Samples ausverkauft' }),
            checkoutSingleLabel: fields.text({ label: 'Checkout: ein Sample', defaultValue: '1 Sample ausgewählt' }),
            checkoutMultipleLabel: fields.text({
              label: 'Checkout: mehrere Samples',
              defaultValue: '{count} Samples ausgewählt',
              description: 'Nutze {count} als Platzhalter für die Anzahl.',
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
          { label: 'Deutsch' },
        ),
        contentEn: fields.object(
          {
            pageHeading: fields.text({ label: 'Page heading' }),
            pageIntro: fields.text({ label: 'Page intro', multiline: true }),
            tableNameLabel: fields.text({ label: 'Table: name', defaultValue: 'Name' }),
            tableSpeciesLabel: fields.text({ label: 'Table: species', defaultValue: 'Species' }),
            tableCountryLabel: fields.text({ label: 'Table: country', defaultValue: 'Country' }),
            tableProcessLabel: fields.text({ label: 'Table: process', defaultValue: 'Process' }),
            tablePriceLabel: fields.text({ label: 'Table: price', defaultValue: 'Price' }),
            tableAvailabilityLabel: fields.text({ label: 'Table: availability', defaultValue: 'Available' }),
            tableArrivalLabel: fields.text({ label: 'Table: arrival', defaultValue: 'Arrival' }),
            addSampleLabel: fields.text({ label: 'Button: add sample', defaultValue: 'Add Sample' }),
            addedSampleLabel: fields.text({ label: 'Button: added', defaultValue: 'Added' }),
            soldOutLabel: fields.text({ label: 'Button: sold out', defaultValue: 'Sold out' }),
            productSheetLabel: fields.text({ label: 'Button: product sheet', defaultValue: 'Product Sheet' }),
            checkoutButtonLabel: fields.text({ label: 'Checkout button', defaultValue: 'Check out' }),
            checkoutEmptyLabel: fields.text({ label: 'Checkout: no samples', defaultValue: '0 samples added' }),
            checkoutSoldOutLabel: fields.text({ label: 'Checkout: sold out', defaultValue: 'Samples sold out' }),
            checkoutSingleLabel: fields.text({ label: 'Checkout: one sample', defaultValue: '1 sample added' }),
            checkoutMultipleLabel: fields.text({
              label: 'Checkout: multiple samples',
              defaultValue: '{count} samples added',
              description: 'Use {count} as the placeholder for the number.',
            }),
            soldOutPopupKicker: fields.text({ label: 'Sold-out popup: Kicker', defaultValue: 'Samples' }),
            soldOutPopupTitle: fields.text({ label: 'Sold-out popup: Title' }),
            soldOutPopupCopy: fields.text({
              label: 'Sold-out popup: Text',
              multiline: true,
            }),
            soldOutPopupPrimaryLabel: fields.text({
              label: 'Sold-out popup: Primary button',
              defaultValue: 'Notify me',
            }),
            soldOutPopupPrimaryHref: fields.text({
              label: 'Sold-out popup: Primary button link',
            }),
          },
          { label: 'English' },
        ),
        samplesSoldOut: fields.checkbox({
          label: 'Samples ausverkauft (globaler Schalter)',
          description:
            'Wenn aktiviert: alle "Add Sample"-Buttons werden zu "Sold out" und das Popup erscheint beim Klick.',
          defaultValue: false,
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
