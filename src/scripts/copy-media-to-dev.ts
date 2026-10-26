/**
 * Fill the DEV R2 bucket with the files referenced by the dev database.
 *
 * - Reads every `media` doc from the database in .env (Neon branch "dev").
 * - Downloads each file from the PRODUCTION public URL (read-only, no prod credentials)
 *   or from audit/dev-assets/ for dev-only uploads, then uploads it to the dev bucket.
 * - Skips files already in the dev bucket. Refuses to write to the production bucket.
 *
 * Usage (after S3_* in .env point to the dev bucket):  npm run media:copy-to-dev
 */
import fs from 'node:fs'
import path from 'node:path'
import { S3Client, HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getPayload } from 'payload'
import config from '../payload.config'

const PROD_BUCKET = 'cacreevoyage-media'
const PROD_PUBLIC_URL = process.env.PROD_S3_PUBLIC_URL || 'https://pub-925c6a08cfd74451a3f7e27ee1e4c8d3.r2.dev'
const LOCAL_DIR = path.resolve(process.cwd(), 'audit/dev-assets')
const PREFIX = 'media'

const bucket = process.env.S3_BUCKET || ''
if (!bucket || bucket === PROD_BUCKET) {
  console.error(`Refusing to run: S3_BUCKET is "${bucket}". Point .env to the dev bucket first (see MIGRATIONS.md).`)
  process.exit(1)
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
})

const payload = await getPayload({ config })
const { docs } = await payload.find({ collection: 'media', limit: 0, pagination: false, depth: 0 })

let copied = 0
let skipped = 0
const missing: string[] = []

for (const doc of docs) {
  const filename = doc.filename
  if (!filename) continue
  const Key = `${PREFIX}/${filename}`

  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucket, Key }))
    skipped++
    continue
  } catch {
    // not in the dev bucket yet
  }

  let body: Buffer | null = null
  const local = path.join(LOCAL_DIR, filename)
  if (fs.existsSync(local)) {
    body = fs.readFileSync(local)
  } else {
    const res = await fetch(`${PROD_PUBLIC_URL}/${PREFIX}/${encodeURIComponent(filename)}`)
    if (res.ok) body = Buffer.from(await res.arrayBuffer())
  }

  if (!body) {
    missing.push(filename)
    continue
  }

  await s3.send(new PutObjectCommand({ Bucket: bucket, Key, Body: body, ContentType: doc.mimeType || undefined }))
  copied++
  payload.logger.info(`copied ${Key} (${(body.length / 1048576).toFixed(1)} MB)`)
}

payload.logger.info(`done: ${copied} copied, ${skipped} already present, ${missing.length} missing`)
if (missing.length) payload.logger.warn(`missing (not found in production nor audit/dev-assets): ${missing.join(', ')}`)
process.exit(0)
