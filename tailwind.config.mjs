/**
 * Tailwind CSS configuration
 * @module tailwind.config
 * @description Configuration for Tailwind CSS styling framework
 * @see {@link https://tailwindcss.com/docs/configuration}
 * @type {import('tailwindcss').Config}
 */
/**
 * Main Tailwind configuration
 * @property {Array} content - Files to scan for class names
 * @property {string} darkMode - Dark mode strategy ('class' for class-based toggling)
 * @property {Object} theme - Theme customization
 * @property {Object} theme.extend - Extended theme values
 * @property {Object} theme.extend.colors - Custom color palette
 * @property {string} theme.extend.colors.theme-light - Light theme background color
 * @property {string} theme.extend.colors.theme-dark - Dark theme background color
 * @property {string} theme.extend.colors.accent-light - Light theme accent color
 * @property {string} theme.extend.colors.accent-dark - Dark theme accent color
 */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'theme-light': '#ffffff',
        'theme-dark': '#1a1a1a',
        'accent-light': '#2563eb',
        'accent-dark': '#60a5fa'
      }
    }
  },
  plugins: []
};
