# The Little Graduates — thelittlegraduates.in

Static site built with [Astro](https://astro.build). All content lives in this repo as markdown — fully version-controlled in git.

## Structure

- `src/content/blog/` — blog posts (markdown + frontmatter)
- `src/content/programs/` — program pages (Playgroup, Nursery, LKG, UKG, Daycare, Afterschool)
- `src/content/events/` — events
- `src/data/site.json` — phone, address, WhatsApp, logo and other site settings
- `src/data/gallery.json` — gallery images
- `src/pages/` — page templates (home, about, contact, book-a-tour, …)
- `public/admin/` — Sveltia CMS so non-technical staff can edit content in a browser

## Develop

```bash
npm install
npm run dev        # local preview at localhost:4321
npm run build      # production build to dist/
```

## One-time setup after cloning

1. **Localize media** (images still point at the old WordPress site):
   ```bash
   npm run fetch-media
   ```
   This downloads every referenced image into `public/media/` and rewrites content to local paths. Commit the result. Do this BEFORE retiring WordPress.
2. **Contact form**: create a free key at https://web3forms.com (emails go to info@thelittlegraduates.in) and set it as env var `PUBLIC_WEB3FORMS_KEY` in your host's dashboard.
3. **CMS**: in `public/admin/config.yml` set `repo: <your-github-username>/littlegraduates`. Staff then edit at `https://thelittlegraduates.in/admin/` (GitHub login; add staff as repo collaborators).

## Deploy (Netlify or Vercel)

1. Push this repo to GitHub.
2. Import the repo in Netlify/Vercel — framework auto-detected (Astro), build `npm run build`, output `dist/`.
3. Add the env var `PUBLIC_WEB3FORMS_KEY`.
4. Add custom domain `thelittlegraduates.in` and update DNS (A/CNAME records shown by the host).
5. Old WordPress URLs are redirected via `public/_redirects` (Netlify) / `vercel.json` (Vercel) to preserve SEO.

## Cutover checklist

- [ ] `npm run fetch-media` run and committed
- [ ] Form key configured and tested
- [ ] Gallery images added via CMS or `src/data/gallery.json`
- [ ] DNS switched; verify https://thelittlegraduates.in serves the new site
- [ ] Keep WordPress hosting for ~1 month as fallback, then cancel
