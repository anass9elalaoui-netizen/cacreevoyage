import { getPayload } from 'payload'
import configPromise from '@payload-config'

export interface SiteSettings {
  whatsappNumber: string
  contactPhone: string
  contactEmail: string
  address?: string
  instagramUrl?: string
  facebookUrl?: string
  tiktokUrl?: string
  youtubeUrl?: string
  brandIdentity?: any
  homepageHero?: any
  seoDefaults?: any
  reviewBadges?: any
  trustStats?: any[]
}

const DEFAULTS: SiteSettings = {
  whatsappNumber: '+212661373347',
  contactPhone: '+212661373347',
  contactEmail: 'contact@cacreevoyage.com',
  instagramUrl: 'https://www.instagram.com/cacreevoyage/',
}

/**
 * Fetch the site-settings global from Payload CMS.
 * Uses `next.revalidate = 60` so data refreshes within 60 seconds of a CMS edit.
 */
export async function getSiteSettings(locale?: string): Promise<SiteSettings> {
  try {
    const payload = await getPayload({ config: configPromise })
    const raw = await payload.findGlobal({
      slug: 'site-settings',
      ...(locale ? { locale: locale as any } : {}),
    }) as any

    return {
      whatsappNumber: raw?.whatsappNumber || DEFAULTS.whatsappNumber,
      contactPhone: raw?.contactPhone || DEFAULTS.contactPhone,
      contactEmail: raw?.contactEmail || DEFAULTS.contactEmail,
      address: raw?.address || undefined,
      instagramUrl: raw?.instagramUrl || DEFAULTS.instagramUrl,
      facebookUrl: raw?.facebookUrl || undefined,
      tiktokUrl: raw?.tiktokUrl || undefined,
      youtubeUrl: raw?.youtubeUrl || undefined,
      brandIdentity: raw?.brandIdentity || null,
      homepageHero: raw?.homepageHero || null,
      seoDefaults: raw?.seoDefaults || null,
      reviewBadges: raw?.reviewBadges || undefined,
      trustStats: raw?.trustStats || [],
    }
  } catch (err) {
    console.error('Error fetching site settings:', err)
    return DEFAULTS
  }
}

/**
 * Strip non-digit characters from a phone number for use in wa.me links.
 * e.g. "+212 661-898865" → "212661898865"
 */
export function cleanWhatsAppNumber(num: string): string {
  return num.replace(/\D/g, '')
}
