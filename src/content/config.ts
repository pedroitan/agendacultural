/**
 * Content Configuration
 * @module contentConfig
 * @description Defines content collections and their schemas
 * @see {@link https://docs.astro.build/en/guides/content-collections/}
 */
import { defineCollection, z } from 'astro:content';

/**
 * Blog collection configuration
 * @constant {object}
 * @description Defines schema for blog posts
 * @property {string} title - Post title
 * @property {string} description - Post description
 * @property {Date} pubDate - Publication date
 * @property {string} image - Featured image URL
 * @property {string[]} tags - Array of tags
 */
const blog = defineCollection({
  /**
   * Blog collection details:
   * - Content type: Markdown/MDX
   * - Required fields:
   *   - title: Post title
   *   - description: SEO description
   *   - pubDate: Publication date
   *   - image: Featured image URL
   *   - tags: Array of tags for categorization
   * - File location: src/content/blog/
   * - File extension: .md or .mdx
   */
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    image: z.string(),
    tags: z.array(z.string())
  })
});

/**
 * Events collection configuration
 * @constant {object}
 * @description Defines schema for events
 * @property {string} evento - Event name
 * @property {string} tipo_de_evento - Event type
 * @property {Date} horário_de_início - Start date/time
 * @property {Date} horário_de_término - End date/time
 * @property {string} local - Event location
 * @property {string} proprietário - Event owner
 * @property {string} descrição - Event description
 * @property {string} flyer - Event flyer image URL
 */
const events = defineCollection({
  /**
   * Events collection details:
   * - Content type: JSON/Markdown
   * - Required fields:
   *   - evento: Event name
   *   - tipo_de_evento: Event type/category
   *   - horário_de_início: Start date/time
   *   - horário_de_término: End date/time
   *   - local: Event location
   *   - proprietário: Event organizer
   *   - descrição: Event description
   *   - flyer: Event image URL
   * - File location: src/content/events/
   * - File extension: .json or .md
   */
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

/**
 * Exported content collections
 * @constant {object}
 * @property {object} blog - Blog collection
 * @property {object} events - Events collection
 */
export const collections = { blog, events };
