import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://interforma.digital',
  output: 'static',
  // URLs sin barra final (/agentes, /metodo). Debe coincidir con
  // "trailingSlash": false de vercel.json y con los canonical de cada página.
  trailingSlash: 'never',
  build: { format: 'directory' },
  integrations: [sitemap()],
});
