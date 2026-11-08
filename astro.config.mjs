import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://interforma.digital',
  output: 'hybrid',
  adapter: vercel({ maxDuration: 30 }),
  // URLs sin barra final (/agentes, /metodo). Debe coincidir con
  // "trailingSlash": false de vercel.json y con los canonical de cada página.
  trailingSlash: 'never',
  build: { format: 'directory' },
  integrations: [sitemap()],
});
