# Deploy checklist — branch `edit-2026-10-26` (first deploy with migrations)

Do the steps in order. Estimated time: 20–30 min.

## 1. Backup (Neon console)
- [ ] Project `cacreevoyage` → Branches → `production` → **Create branch** → name `backup-before-deploy-2026-10` (from *Head*, current data).
- [ ] Note the time. Rollback = restore `production` from this branch.

## 2. One-time SQL on production (right before pushing)
- [ ] Neon console → branch **`production`** → SQL Editor, check you are on `production`:
  ```sql
  SELECT id, name, batch FROM payload_migrations;   -- expect one row: dev / -1
  DELETE FROM payload_migrations WHERE batch = -1;
  SELECT count(*) FROM payload_migrations;           -- expect 0
  ```
  (Until the deploy finishes, the live site keeps working: this table is only read by migrations.)

## 3. Hostinger environment variables (before the build — `NEXT_PUBLIC_*` is baked in at build time)
- [ ] `NEXT_PUBLIC_SERVER_URL` = `https://cacreevoyage.com` (no trailing slash, not localhost)
- [ ] `DATABASE_URI` = production branch (`ep-billowing-bar-alz0yc1r…`), unchanged
- [ ] `PAYLOAD_SECRET` = set (if missing, the code falls back to a public default — must be set)
- [ ] `S3_BUCKET=cacreevoyage-media`, `S3_ENDPOINT`, `S3_PUBLIC_URL`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` = production values, unchanged
- [ ] Build command `npm run build` (it now runs migrations first), start command `npm start`, Node 20 or newer

## 4. Push & deploy
- [ ] Merge `edit-2026-10-26` into `main` (or deploy the branch) and push.
- [ ] In the Hostinger build log, check:
  ```
  Migrating: 20261026_162302_baseline
  baseline: schema already present, recording as applied
  Migrated:  20261026_162302_baseline
  Migrating: 20261026_162739_testimonials_poster_trip_year
  Migrated:  20261026_162739_testimonials_poster_trip_year
  ✓ Compiled successfully
  ```
  If it stops with *"This database was schema-pushed in dev mode"*, step 2 was not applied on `production`: run it and redeploy.

## 5. Checks after deploy
- [ ] Home page loads, hero image visible immediately, no console errors.
- [ ] **Contact form**: send one test message on `/contact` → success message on screen.
- [ ] **Admin → Inquiries**: the test message is there (source *Page Contact*). Delete it afterwards.
- [ ] **Sitemap**: `https://cacreevoyage.com/sitemap.xml` and `/robots.txt` show `https://cacreevoyage.com/…`, never `localhost`.
- [ ] **Testimonials** (home): video postcards open the lightbox with sound; review cards show a photo / destination cover / blue branded cover, never grey.
- [ ] **Admin → Témoignages**: fields *Image de couverture de la vidéo* and *Année du voyage* are present. Fix the content mix-up: "Julien B." is labelled Vietnam but uses the Merzouga video.
- [ ] Footer links: À propos, Contact, CGV, Confidentialité, destinations — no 404.
- [ ] `/tours/does-not-exist` returns a 404 page.
- [ ] Neon `production`: `SELECT name, batch FROM payload_migrations;` → 2 rows, batch 1.

## Rollback
- Code: redeploy the previous commit on Hostinger.
- Database: the migration only **adds** two nullable columns to `testimonials`; the previous code ignores them, so a code rollback alone is safe. Full restore if ever needed: Neon → `production` → *Restore* from `backup-before-deploy-2026-10`.
