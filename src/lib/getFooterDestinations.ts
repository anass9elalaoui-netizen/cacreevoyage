import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export type FooterDestination = { title: string; slug: string; scope: 'national' | 'international' }

/**
 * Destinations listed in the footer, read from the CMS so links never point to
 * a destination that was renamed or deleted. Memoised per request.
 */
export const getFooterDestinations = cache(async (): Promise<FooterDestination[]> => {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'destinations',
      depth: 0,
      limit: 50,
      sort: 'title',
      select: { title: true, slug: true, scope: true },
    })
    return docs
      .filter((d) => d.slug && d.title)
      .map((d) => ({ title: d.title as string, slug: d.slug as string, scope: d.scope as FooterDestination['scope'] }))
  } catch (error) {
    console.error('Error fetching footer destinations:', error)
    return []
  }
})
