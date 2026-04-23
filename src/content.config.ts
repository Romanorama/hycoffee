import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const wissen = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/wissen' }),
});

const kaffeeSamples = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/kaffee-samples' }),
});

const press = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/press' }),
});

const originStories = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/origin-stories' }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/team' }),
});

export const collections = { wissen, kaffeeSamples, press, originStories, team };
