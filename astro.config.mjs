import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://interforma.digital',
  output: 'static',
  integrations: [sitemap()],
});
