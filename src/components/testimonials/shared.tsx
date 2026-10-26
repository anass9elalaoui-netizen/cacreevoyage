import React from 'react'

/* ─── Types (testimonials fetched with depth 2) ─────────────────────── */
type MediaRef = { url?: string | null; mimeType?: string | null; alt?: string | null } | number | string | null | undefined

export interface TestimonialDoc {
  id: string | number
  travelerName?: string | null
  travelerOrigin?: string | null
  testimonialText?: string | null
  rating?: number | null
  platform?: string | null
  tripYear?: number | null
  media?: MediaRef
  videoPoster?: MediaRef
  travelerPhoto?: MediaRef
  destination?:
    | {
        id?: string | number
        title?: string | null
        slug?: string | null
        headerMedia?: MediaRef
        gallery?: { image?: MediaRef }[] | null
      }
    | number
    | string
    | null
}

export type Cover = { kind: 'image' | 'video'; url: string; alt: string }

const asMedia = (m: MediaRef) => (m && typeof m === 'object' && m.url ? m : null)
const isVideoMedia = (m: { url?: string | null; mimeType?: string | null }) =>
  Boolean(m.mimeType?.startsWith('video/') || m.url?.match(/\.(mp4|webm|mov)$/i))

export const destinationOf = (t: TestimonialDoc) =>
  t.destination && typeof t.destination === 'object' ? t.destination : null

/** Card image: traveler photo → destination cover (image or video still) → first gallery image → null (branded fallback). */
export function getTestimonialCover(t: TestimonialDoc): Cover | null {
  const photo = asMedia(t.travelerPhoto)
  if (photo && !isVideoMedia(photo)) return { kind: 'image', url: photo.url!, alt: photo.alt || t.travelerName || 'Voyageur' }

  const dest = destinationOf(t)
  const header = asMedia(dest?.headerMedia)
  if (header) return { kind: isVideoMedia(header) ? 'video' : 'image', url: header.url!, alt: dest?.title || 'Destination' }

  const galleryImage = dest?.gallery?.map((g) => asMedia(g.image)).find((m) => m && !isVideoMedia(m))
  if (galleryImage) return { kind: 'image', url: galleryImage.url!, alt: dest?.title || 'Destination' }

  return null
}

export function getVideo(t: TestimonialDoc) {
  const m = asMedia(t.media)
  return m && isVideoMedia(m) ? m.url! : null
}

export function getVideoPoster(t: TestimonialDoc) {
  const m = asMedia(t.videoPoster)
  return m && !isVideoMedia(m) ? m.url! : null
}

export const initialsOf = (name?: string | null) =>
  (name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

/* ─── Postcard stamp: destination + trip year ───────────────────────── */
export function PostcardStamp({ destination, year, className = '' }: { destination?: string | null; year?: number | null; className?: string }) {
  if (!destination && !year) return null
  return (
    <div
      className={`pointer-events-none select-none rotate-[-5deg] rounded-[3px] bg-[#FBF7EF] p-[3px] shadow-[0_4px_14px_rgba(11,19,43,0.25)] ${className}`}
      aria-label={[destination, year].filter(Boolean).join(' ')}
    >
      <div className="flex flex-col items-center justify-center rounded-[2px] border-[1.5px] border-dashed border-brand-blue/60 px-2.5 py-1.5 min-w-[72px]">
        {destination && (
          <span className="font-heading text-[10px] font-semibold uppercase leading-tight tracking-[0.18em] text-brand-blue">
            {destination}
          </span>
        )}
        {year && <span className="mt-0.5 text-[9px] font-medium tracking-[0.3em] text-brand-dark/60">{year}</span>}
      </div>
    </div>
  )
}

/* ─── Branded fallback when there is no photo nor destination cover ─── */
export function BrandedCover({ label }: { label?: string | null }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-brand-blue via-[#155f8f] to-brand-dark">
      <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand-cyan/30 blur-3xl" />
      <div className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      {/* Dotted flight path */}
      <svg className="absolute inset-0 h-full w-full text-white/35" viewBox="0 0 340 210" fill="none" aria-hidden="true">
        <path d="M-10 170 C 80 120, 150 190, 230 110 S 330 40, 360 60" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 7" strokeLinecap="round" />
        <path d="M236 103l12-4-3 12-3-4-4-1z" fill="currentColor" />
      </svg>
      <span className="absolute bottom-4 left-5 font-heading text-lg font-medium tracking-wide text-white/90">
        {label || 'Ça Crée Voyage'}
      </span>
    </div>
  )
}

/* ─── Platform badge (only for real review platforms) ───────────────── */
export function PlatformBadge({ platform }: { platform?: string | null }) {
  const p = platform?.toLowerCase()
  if (p === 'google') {
    return (
      <svg className="h-[14px] w-[14px]" viewBox="0 0 24 24" aria-label="Avis Google">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    )
  }
  if (p === 'tripadvisor') {
    return (
      <svg className="h-[14px] w-[14px] text-[#34E0A1]" viewBox="0 0 24 24" aria-label="Avis TripAdvisor">
        <circle cx="12" cy="12" r="10" fill="currentColor" />
        <circle cx="8" cy="12" r="3" fill="white" />
        <circle cx="16" cy="12" r="3" fill="white" />
        <circle cx="8" cy="12" r="1" fill="black" />
        <circle cx="16" cy="12" r="1" fill="black" />
      </svg>
    )
  }
  if (p === 'facebook') {
    return (
      <svg className="h-[14px] w-[14px] text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor" aria-label="Avis Facebook">
        <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.88v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
      </svg>
    )
  }
  return null
}

export function Stars({ rating = 5, className = '' }: { rating?: number | null; className?: string }) {
  const r = Math.max(0, Math.min(5, Math.round(rating ?? 5)))
  return (
    <div className={`flex gap-0.5 ${className}`} aria-label={`${r} sur 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={i < r ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}>
          ★
        </span>
      ))}
    </div>
  )
}
