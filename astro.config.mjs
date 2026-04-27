// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import netlify from '@astrojs/netlify';
import keystatic from '@keystatic/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://hycoffee.de',
  integrations: [react(), markdoc(), keystatic()],
  adapter: netlify(),
  output: 'server',
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
