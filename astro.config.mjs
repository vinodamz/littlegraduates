import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://thelittlegraduates.in',
  integrations: [sitemap()],
  trailingSlash: 'ignore',
});
