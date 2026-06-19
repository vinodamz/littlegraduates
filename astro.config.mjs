import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';

export default defineConfig({
  site: 'https://thelittlegraduates.in',
  output: 'static',
  adapter: netlify(),
  integrations: [sitemap()],
  trailingSlash: 'ignore',
});
