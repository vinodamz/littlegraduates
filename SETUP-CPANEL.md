# Deploy to cPanel (subdomain test: new.thelittlegraduates.in)

Fully automatic pipeline: edit content → push to GitHub → GitHub Action builds → cPanel Git pulls & deploys.

## A. One-time GitHub side (already in repo)
- `.github/workflows/deploy.yml` builds the site on every push to `main` and publishes the
  finished static files to a branch called `deploy`.
- `.cpanel.yml` tells cPanel where to copy those files. **Edit `CPANELUSER`** in it to your
  cPanel username (and confirm the subdomain path).

## B. cPanel — create the subdomain
1. cPanel → **Domains / Subdomains** → create `new.thelittlegraduates.in`.
2. Note its Document Root (e.g. `/home/CPANELUSER/new.thelittlegraduates.in`). Put that exact
   path in `.cpanel.yml` (the `DEPLOYPATH` line).

## C. cPanel — create the database (for form submissions)
1. cPanel → **MySQL® Databases** → create a database, e.g. `littlegraduates`.
2. Create a DB user + password, add the user to the database with **All Privileges**.
3. cPanel → **phpMyAdmin** → select the database → SQL tab → paste `db/schema.sql` → Go.
4. In the subdomain's `api/` folder, create `config.php` (copy from `api/config.sample.php`)
   and fill in the DB name/user/password + notify email. **Do not commit config.php.**

## D. cPanel — Git Version Control (same as mtt)
1. cPanel → **Git™ Version Control** → Create.
2. Clone URL: `https://github.com/vinodamz/littlegraduates.git`
3. **Branch: `deploy`** (not main — that branch holds the pre-built files).
4. Repository path: anywhere, e.g. `/home/CPANELUSER/repos/littlegraduates`.
5. After it clones, use **Manage → Pull or Deploy → Deploy HEAD Commit** to publish.
6. For auto-deploy on each push, add a GitHub webhook to your cPanel deploy endpoint
   (same setup you used for mtt), or click Deploy after edits.

## Result
- Public site served from your cPanel at the subdomain.
- Tour & fees forms POST to `/api/inquiry.php` → saved in MySQL + emailed + (optional) sent to your CRM.
- View submissions in phpMyAdmin (table `inquiries`) — that's your admin view.
- Content edits via `/admin` (CMS) commit to GitHub → Action rebuilds → cPanel deploys.

## What I need from you to finish wiring
- Your cPanel username (to set the path in `.cpanel.yml`).
- Confirm subdomain document root.
- DB name/user (not the password) so I can pre-fill config.sample.php for you to copy.
