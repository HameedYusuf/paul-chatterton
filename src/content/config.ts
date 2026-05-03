import { defineCollection, z } from 'astro:content';

const publications = defineCollection({
  type: 'content',
  schema: z.object({
    title:    z.string(),
    year:     z.number(),
    type:     z.enum(['Journal Article', 'Book', 'Report', 'Comment Piece', 'Book Chapter', 'Preprint']),
    citation: z.string(),
    url:      z.string().optional(),
    abstract: z.string().optional(),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    role:        z.string(),
    description: z.string(),
    impact:      z.string().optional(),
    url:         z.string().optional(),
    image:       z.string().optional(),
    gallery:     z.array(z.string()).optional(),
    order:       z.number().default(99),
  }),
});

const media = defineCollection({
  type: 'content',
  schema: z.object({
    title:    z.string(),
    type:     z.enum(['Podcast', 'Video', 'Talk', 'Press']),
    platform: z.string().optional(),
    url:      z.string(),
    image:    z.string().optional(),
    date:     z.string().optional(),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title:   z.string(),
    date:    z.string(),
    excerpt: z.string(),
    outlet:  z.string().optional(),
    url:     z.string().optional(),
  }),
});

export const collections = { publications, projects, media, blog };
