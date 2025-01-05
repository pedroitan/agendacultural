import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    image: z.string(),
    tags: z.array(z.string())
  })
});

const events = defineCollection({
  type: 'content',
  schema: z.object({
    evento: z.string(),
    tipo_de_evento: z.string(),
    horário_de_início: z.date(),
    horário_de_término: z.date(),
    local: z.string(),
    proprietário: z.string(),
    descrição: z.string(),
    flyer: z.string().url()
  })
});

export const collections = { blog, events };
