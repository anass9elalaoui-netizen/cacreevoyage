/**
 * Public site URL used for metadataBase, sitemap and robots.
 * Falls back to the production domain (never localhost) when the env var is missing.
 */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://cacreevoyage.com'
  return url.replace(/\/$/, '')
}
