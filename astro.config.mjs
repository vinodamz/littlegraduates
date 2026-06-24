import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://thelittlegraduates.in',
  output: 'static',
  integrations: [sitemap()],
  trailingSlash: 'ignore',
});
