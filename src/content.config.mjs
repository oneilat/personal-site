import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    kicker: z.string(),
    date: z.string(),
    order: z.number().int(),
    publish: z.boolean(),
    color: z.enum(['green', 'blue', 'aqua', 'purple']),
  }),
});

export const collections = { projects };
