/**
 * Slugify a string: lowercase, remove diacritics, replace spaces/special chars with dashes.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Format a duration string for display.
 */
export function formatDuration(duration: string): string {
  return duration
}

/**
 * Safe array check — returns empty array if value is undefined/null/not an array.
 */
export function safeArray<T>(value: T[] | null | undefined): T[] {
  if (!Array.isArray(value)) return []
  return value
}

/**
 * Truncate text to a max length, appending ellipsis.
 */
export function truncate(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

/**
 * Resolve a Payload media URL — handles both full URLs (R2) and relative paths.
 */
export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  return `${base}${url}`
}
