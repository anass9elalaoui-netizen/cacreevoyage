/**
 * Deploy-safe `payload migrate`.
 *
 * Plain `payload migrate` asks an interactive question when the database was ever
 * schema-pushed in dev mode (a `payload_migrations` row with batch -1). On a
 * non-interactive deploy that prompt answers "no" and the process exits 0 without
 * migrating — the build would then ship code against an old schema.
 * This script fails loudly instead, then runs pending migrations.
 *
 * Usage: npm run migrate   (runs automatically before `next build`)
 */
import { getPayload } from 'payload'
import config from '../payload.config'

const payload = await getPayload({ config })

let devPushed = false
try {
  const { docs } = await payload.find({ collection: 'payload-migrations', limit: 0, pagination: false })
  devPushed = docs.some((m) => Number(m.batch) === -1)
} catch {
  // Fresh database: the migrations table does not exist yet
}

if (devPushed) {
  payload.logger.error(
    'This database was schema-pushed in dev mode (payload_migrations row with batch = -1). ' +
      'Remove that row once (see MIGRATIONS.md), then deploy again. Aborting so the build does not ship against an old schema.',
  )
  process.exit(1)
}

await payload.db.migrate()
process.exit(0)
