const PRODUCTION_URL = 'https://cacreevoyage.com'

/**
 * Public site URL used for metadataBase, sitemap and robots.
 * Falls back to the production domain when the env var is missing, and ignores a
 * localhost value in production builds (Hostinger had NEXT_PUBLIC_SERVER_URL=http://localhost:3000,
 * which put localhost URLs in the live sitemap and robots.txt).
 */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_APP_URL || PRODUCTION_URL
  const isLocal = /\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(url)
  if (isLocal && process.env.NODE_ENV === 'production') return PRODUCTION_URL
  return url.replace(/\/$/, '')
}
