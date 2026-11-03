'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react'
import LazyVideo from '@/components/LazyVideo'
import {
  destinationOf,
  getVideo,
  getVideoPoster,
  getVideoPreview,
  pickPlaybackUrl,
  type TestimonialDoc,
} from '@/components/testimonials/shared'

/** "Turquie" from the linked destination, otherwise the name typed in the admin. */
const labelOf = (t: TestimonialDoc) => destinationOf(t)?.title || t.travelerName?.trim() || 'Nos voyageurs'

/** Poster image, or a single still frame when no cover has been uploaded (metadata only). */
function Cover({ t, sizes, eager = false }: { t: TestimonialDoc; sizes: string; eager?: boolean }) {
  const poster = getVideoPoster(t)
  if (poster) {
    return <Image src={poster} alt="" fill sizes={sizes} loading={eager ? 'eager' : 'lazy'} className="object-cover" />
  }
  return <LazyVideo src={`${getVideo(t)}#t=1`} paused aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
}

/* ─── Lightbox: adaptive rendition with sound, loads only once opened; arrows between destinations ─── */
function VideoLightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: TestimonialDoc[]
  index: number
  onIndex: (i: number) => void
  onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const t = items[index]
  const hasPrev = index > 0
  const hasNext = index < items.length - 1

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && hasNext) onIndex(index + 1)
      if (e.key === 'ArrowLeft' && hasPrev) onIndex(index - 1)
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [index, hasNext, hasPrev, onClose, onIndex])

  const arrow =
    'absolute top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 active:scale-95 transition disabled:pointer-events-none disabled:opacity-0'

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Témoignage vidéo : ${labelOf(t)}`}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-5 bg-brand-deeper/90 backdrop-blur-md p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <div className="relative w-full max-w-[420px]" onClick={(e) => e.stopPropagation()}>
        <div className="relative w-full aspect-[9/16] max-h-[78vh] mx-auto rounded-2xl overflow-hidden bg-black shadow-2xl">
          {/* Opened by a click, so playback with sound is allowed. Light rendition on phones / slow networks. */}
          <video
            key={String(t.id)}
            src={pickPlaybackUrl(t)}
            poster={getVideoPoster(t) || undefined}
            controls
            autoPlay
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-contain"
          />
        </div>
        <button type="button" onClick={() => onIndex(index - 1)} disabled={!hasPrev} className={`${arrow} -left-3 md:-left-20`} aria-label="Destination précédente">
          <ChevronLeft className="h-5 w-5" strokeWidth={2} />
        </button>
        <button type="button" onClick={() => onIndex(index + 1)} disabled={!hasNext} className={`${arrow} -right-3 md:-right-20`} aria-label="Destination suivante">
          <ChevronRight className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>

      <p className="text-center font-heading text-lg text-white" onClick={(e) => e.stopPropagation()}>
        {labelOf(t)}
        {t.tripYear ? <span className="text-white/50">, {t.tripYear}</span> : null}
        <span className="mt-1 block text-xs text-white/45">
          {index + 1} sur {items.length}
        </span>
      </p>

      <button
        ref={closeRef}
        onClick={onClose}
        className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
        aria-label="Fermer la vidéo"
      >
        <X className="h-5 w-5" strokeWidth={2} />
      </button>
    </motion.div>
  )
}

/* ─── Featured card: silent preview loop (or cover), one clear call to action ─── */
function Featured({ t, onPlay }: { t: TestimonialDoc; onPlay: () => void }) {
  const reduce = useReducedMotion()
  const preview = getVideoPreview(t)

  return (
    <button
      type="button"
      onClick={onPlay}
      className="group relative block w-full max-w-[420px] mx-auto aspect-[9/16] max-h-[80vh] overflow-hidden rounded-[1.75rem] bg-brand-dark text-left shadow-[0_30px_60px_-25px_rgba(11,19,43,0.55)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/60"
      aria-label={`Voir le témoignage vidéo : ${labelOf(t)}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={String(t.id)}
          className="absolute inset-0"
          initial={reduce ? false : { opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <Cover t={t} sizes="(max-width: 640px) 92vw, 420px" eager />
          {/* Silent 6 s loop on top of the cover (LazyVideo: only when visible, poster-only under reduced motion / Data Saver) */}
          {preview ? (
            <LazyVideo src={preview} poster={getVideoPoster(t) || undefined} priority aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
          ) : null}
        </motion.div>
      </AnimatePresence>

      <span className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-brand-deeper/95 via-brand-deeper/45 to-transparent pointer-events-none" />

      <span className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6">
        <span className="font-heading text-[2rem] leading-none font-medium text-white">{labelOf(t)}</span>
        {t.testimonialText ? (
          <span className="text-sm leading-snug text-white/85 line-clamp-3">&laquo;&nbsp;{t.testimonialText}&nbsp;&raquo;</span>
        ) : null}
        <span className="inline-flex w-fit items-center gap-2.5 rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-dark shadow-lg transition-transform duration-300 group-hover:-translate-y-0.5 group-active:scale-[0.98]">
          <Play className="h-4 w-4 fill-brand-blue text-brand-blue" strokeWidth={1.5} />
          Voir le témoignage
          {t.tripYear ? <span className="font-normal text-slate-500">{t.tripYear}</span> : null}
        </span>
      </span>
    </button>
  )
}

export default function DestinationTestimonials({ testimonials }: { testimonials: TestimonialDoc[] }) {
  const items = testimonials.filter((t) => getVideo(t))
  const [active, setActive] = useState(0)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const close = useCallback(() => setOpenIndex(null), [])

  useEffect(() => setMounted(true), [])

  if (items.length === 0) return null
  const current = Math.min(active, items.length - 1)

  return (
    <section className="relative py-20 md:py-28 bg-slate-50 dark:bg-transparent transition-colors duration-700 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16 lg:items-center">
        {/* Header + playlist: first on mobile, right column on desktop (min-w-0 keeps the swipe row inside the grid) */}
        <div className="min-w-0 lg:order-2">
          <h2 className="font-heading text-4xl md:text-5xl font-medium tracking-tight leading-[1.05] text-slate-900 dark:text-white">
            Ils ont vécu <span className="text-brand-blue">l&apos;expérience</span>
          </h2>
          <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-slate-600 dark:text-white/65">
            Nos voyageurs racontent leur séjour en vidéo. Choisissez une destination.
          </p>

          <div
            role="tablist"
            aria-label="Témoignages par destination"
            className="mt-8 -mx-4 px-4 flex gap-3 overflow-x-auto snap-x snap-mandatory hide-scrollbar sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:overflow-visible"
          >
            {items.map((t, i) => {
              const isActive = i === current
              return (
                <button
                  key={String(t.id)}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(i)}
                  className={`flex shrink-0 snap-start items-center gap-3.5 w-[220px] sm:w-auto rounded-2xl p-2 pr-4 text-left border transition duration-300 active:scale-[0.98] ${
                    isActive
                      ? 'bg-white dark:bg-white/10 border-brand-blue/50 shadow-[0_10px_30px_-12px_rgba(28,140,201,0.45)]'
                      : 'bg-white/60 dark:bg-white/[0.04] border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/[0.08]'
                  }`}
                >
                  <span className="relative h-[72px] w-14 shrink-0 overflow-hidden rounded-xl bg-brand-dark">
                    <Cover t={t} sizes="56px" />
                  </span>
                  <span className="min-w-0">
                    <span className={`block truncate font-heading text-base font-medium ${isActive ? 'text-brand-blue' : 'text-slate-900 dark:text-white'}`}>
                      {labelOf(t)}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-white/50">
                      <Play className="h-3 w-3" strokeWidth={2} />
                      Témoignage vidéo
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Featured: second on mobile, left column on desktop */}
        <div className="min-w-0 lg:order-1">
          <Featured t={items[current]} onPlay={() => setOpenIndex(current)} />
        </div>
      </div>

      {/* Portal to <body>: <main> is a stacking context below the fixed navbar */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {openIndex !== null && (
              <VideoLightbox
                items={items}
                index={openIndex}
                onIndex={(i) => {
                  setOpenIndex(i)
                  setActive(i)
                }}
                onClose={close}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  )
}
