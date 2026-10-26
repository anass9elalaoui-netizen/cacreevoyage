# Database & storage environments, schema changes

| Environment | Database (Neon project `cacreevoyage`) | Storage (Cloudflare R2) | Where the settings live |
|---|---|---|---|
| Production (Hostinger) | branch `production` — host `ep-billowing-bar-alz0yc1r…` | bucket `cacreevoyage-media` | Hostinger env vars only |
| Local development | branch `dev` — host `ep-gentle-dew-alqvkldm-pooler…` | bucket `cacreevoyage-media-dev` (to create, see below) | local `.env` (git-ignored) |

Everything is selected by env vars (`DATABASE_URI`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_PUBLIC_URL`). No code or schema differs between environments.
Do **not** make the upload `prefix` env-dependent: the storage plugin turns it into a DB column default, which would leak into migrations.

Payload **never auto-pushes** the schema (`push: false` in `payload.config.ts`). All schema changes are migrations in `src/migrations/`.

## Shipping a schema change (3 steps)

1. Change a collection/global, then run `npm run migrate:create <name>` and `npm run migrate` locally (applies to the `dev` branch). Check the site.
2. Commit the new files in `src/migrations/` together with the code.
3. Deploy as usual: `npm run build` runs `npm run migrate` first, so production gets the migration before the new code is built.

## First deploy with migrations (one time)

Production was created with dev-mode push, so it carries a `payload_migrations` row with `batch = -1`. `npm run migrate` refuses to run while it exists (a deploy fails loudly instead of building against an old schema). Remove it once, right before that deploy:

```sql
DELETE FROM payload_migrations WHERE batch = -1;
```

No other step is needed: the baseline migration detects the existing schema, records itself as applied and creates nothing. Verified on 2026-10-26 on a branch copied from production (`deploy-test`, since deleted):

```
Migrating: 20261026_162302_baseline
baseline: schema already present, recording as applied
Migrated:  20261026_162302_baseline (101ms)
Migrating: 20261026_162739_testimonials_poster_trip_year
Migrated:  20261026_162739_testimonials_poster_trip_year (193ms)
→ payload_migrations: baseline (batch 1), testimonials_poster_trip_year (batch 1)
→ 424 → 426 columns, data unchanged (7 testimonials, 1 tour, 44 media)
```

A second deploy with nothing new prints only `Reading migration files…` and continues to `next build`.

## Dev storage bucket (one time, Cloudflare dashboard)

The current R2 API token is scoped to the production bucket (it cannot create or list buckets), so:

1. R2 → **Create bucket** `cacreevoyage-media-dev` → Settings → enable the **r2.dev public URL**.
2. R2 → **Manage API tokens** → create a token with *Object Read & Write* on `cacreevoyage-media-dev` **only**.
3. In the local `.env`: set `S3_BUCKET=cacreevoyage-media-dev`, the new `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY`, and `S3_PUBLIC_URL=<the dev r2.dev URL>` (`S3_ENDPOINT` stays the same account endpoint).
4. Run `npm run media:copy-to-dev`: copies every file referenced by the dev database into the dev bucket (downloads from the production public URL, read-only; dev-only files from `audit/dev-assets/`). It refuses to run while `S3_BUCKET` is the production bucket.

Until step 3 is done, local uploads still land in the production bucket — avoid uploading from the local admin.

## Refreshing dev

Neon console → branch `dev` → *Reset from parent* (copies production data), then `npm run migrate` and `npm run media:copy-to-dev`.
