# Database environments & schema changes

| Environment | Database (Neon project `cacreevoyage`) | Where the URL lives |
|---|---|---|
| Production (Hostinger) | branch `production` — host `ep-billowing-bar-alz0yc1r…` | Hostinger env vars only |
| Local development | branch `dev` — host `ep-gentle-dew-alqvkldm-pooler…` | local `.env` (git-ignored) |

Uploads: both environments share the R2 bucket (`media/`). Use a separate bucket for dev if full isolation is needed (do not make the upload prefix env-dependent: it becomes a DB column default).

Payload **never auto-pushes** the schema (`push: false` in `payload.config.ts`). All schema changes are migrations in `src/migrations/`.

## Deploying a schema change (3 steps)

1. Change a collection/global, then run `npm run migrate:create <name>` and `npm run migrate` locally (applies to the `dev` branch). Check the site.
2. Commit the new files in `src/migrations/` together with the code.
3. Deploy as usual: `npm run build` runs `npm run migrate` first, so production gets the migration before the new code is built.

## Safety

- `npm run migrate` (`src/scripts/migrate.ts`) refuses to run if the database was ever dev-pushed (a `payload_migrations` row with `batch = -1`), so a deploy fails loudly instead of building against an old schema.
- **One-time on production** (before the first deploy that uses migrations), remove the old dev-push marker:
  ```sql
  DELETE FROM payload_migrations WHERE batch = -1;
  ```
  The first `npm run migrate` on production then records the baseline (it detects the existing schema and changes nothing) and applies any newer migrations.
- To refresh `dev` with current production data: Neon console → branch `dev` → *Reset from parent*, then `npm run migrate`.
