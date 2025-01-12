/**
 * Astro configuration file
 * @module astro.config
 * @description Configuration for the Astro static site generator
 * @see {@link https://docs.astro.build/en/reference/configuration-reference/}
 */

import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

/**
 * Main Astro configuration
 * @type {import('astro').AstroUserConfig}
 * @property {string} site - The base URL for the production site
 * @property {Array} integrations - List of Astro integrations
 * @property {Object} markdown - Markdown processing configuration
 * @property {Object} markdown.shikiConfig - Syntax highlighting configuration
 */
export default defineConfig({
  site: 'https://pedroitan.github.io/agenda_cultural',
  integrations: [mdx(), sitemap(), tailwind()],
  markdown: {
    shikiConfig: {
      theme: 'dracula',
      wrap: true
    }
  },
  devToolbar: {
    enabled: false
  }
});
