# Backend setup — forms, database, admin, CRM

The public site is fast static HTML. Three pieces add the dynamic features you asked for.
All are optional and layer in independently — the site works without them (forms fall back to email).

## 1. Database + admin dashboard (Supabase — the "MySQL/admin" part)

Supabase gives you a hosted Postgres database **and** a built-in secure admin dashboard with login —
no admin UI to build or maintain.

1. Create a free project at https://supabase.com
2. Open **SQL Editor**, paste the contents of `db/schema.sql`, click **Run** (creates the `inquiries` table)
3. Go to **Project Settings → API** and copy:
   - Project URL  → env var `SUPABASE_URL`
   - `service_role` key (secret) → env var `SUPABASE_SERVICE_KEY`
4. To view/manage submissions: **Table editor → inquiries**. Log in with your Supabase account.
   That logged-in table view *is* your admin dashboard.

## 2. Feed your existing CRM (mtt.thelittlegraduates.in)

Every submission is also POSTed (as JSON) to your CRM if you set:
   - `CRM_WEBHOOK_URL` — the endpoint in your admissions CRM that accepts a new lead
   - `CRM_API_KEY` — optional bearer token, if your CRM requires auth

I need from you: the CRM's "create lead / webhook" URL and whether it needs a key.
JSON sent: `{ type, name, phone, email, child_age, message, source, created_at }`

## 3. Email fallback (works with zero database)

If you set neither Supabase nor CRM, set `WEB3FORMS_KEY` (free at https://web3forms.com)
and every submission is emailed to info@thelittlegraduates.in.

## Where to put the env vars

In Netlify: **Site settings → Environment variables**. Add any of:
`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `CRM_WEBHOOK_URL`, `CRM_API_KEY`, `WEB3FORMS_KEY`,
`PUBLIC_WEB3FORMS_KEY`. Redeploy after adding.

## Blogs, photos, and videos

Staff add these at `https://thelittlegraduates.in/admin/` (Sveltia CMS, GitHub login):
- **Blog**: title, date, image, **video URL** (YouTube/Vimeo/mp4 — auto-embeds), body
- **Gallery**: add/remove photos
- **Programs / Events / Site settings**: editable too
Every save commits to GitHub and auto-deploys. No database needed for content.

## What I still need from you
1. Supabase project URL + service key (for the database + admin)
2. Your CRM's lead/webhook URL (+ key if any)
3. A web3forms key (optional email fallback)
Give me these and I'll wire and test them end to end.
