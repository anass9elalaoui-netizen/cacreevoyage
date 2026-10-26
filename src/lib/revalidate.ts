import { revalidatePath, revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/**
 * Purge Next's caches after a CMS edit so changes show without a redeploy.
 * The site is small, so the whole layout is revalidated; the per-slug tag is
 * there for data cached with `unstable_cache(..., { tags: [slug] })`.
 * Wrapped in try/catch because hooks also run outside Next (seed scripts).
 */
function purge(tag: string) {
  try {
    revalidateTag(tag)
    revalidatePath('/', 'layout')
  } catch {
    // Not running inside a Next.js request (e.g. `npm run seed`) — nothing to purge
  }
}

export const revalidateCollectionAfterChange: CollectionAfterChangeHook = ({ doc, collection }) => {
  purge(collection.slug)
  return doc
}

export const revalidateCollectionAfterDelete: CollectionAfterDeleteHook = ({ doc, collection }) => {
  purge(collection.slug)
  return doc
}

export const revalidateGlobalAfterChange: GlobalAfterChangeHook = ({ doc, global }) => {
  purge(global.slug)
  return doc
}

/** Spread into a collection config: `hooks: { ...revalidateCollectionHooks }` */
export const revalidateCollectionHooks = {
  afterChange: [revalidateCollectionAfterChange],
  afterDelete: [revalidateCollectionAfterDelete],
}
