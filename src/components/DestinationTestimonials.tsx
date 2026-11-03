'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react'
import LazyVideo from '@/components/LazyVideo'
import { destinationOf, getVideo, getVideoPoster, type TestimonialDoc } from '@/components/testimonials/shared'

/** "Turquie" from the linked destination, otherwise the name typed in the admin. */
const labelOf = (t: TestimonialDoc) => destinationOf(t)?.title || t.travelerName?.trim() || 'Nos voyageurs'

/** Poster image, or a single still frame when no cover has been uploaded (metadata only). */
function Cover({ t, sizes, eager = false }: { t: TestimonialDoc; sizes: string; eager?: boolean }) {
  const poster = getVideoPoster(t)
  if (poster) {
    return (
      <Image
        src={poster}
        alt=""
        fill
        sizes={sizes}
        loading={eager ? 'eager' : 'lazy'}
        className="object-cover"
      />
    )
  }
  return <LazyVideo src={`${getVideo(t)}#t=1`} paused aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
}

/* ─── Lightbox: the video (with sound) only loads once opened; arrows move between destinations ─── */
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
          {/* Opened by a click, so playback with sound is allowed */}
          <video
            key={String(t.id)}
            src={getVideo(t)!}
            poster={getVideoPoster(t) || undefined}
            controls
            autoPlay
            playsInline
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

export default function DestinationTestimonials({ testimonials }: { testimonials: TestimonialDoc[] }) {
  const items = testimonials.filter((t) => getVideo(t))
  const [active, setActive] = useState(0)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const reduce = useReducedMotion()
  const close = useCallback(() => setOpenIndex(null), [])

  useEffect(() => setMounted(true), [])

  if (items.length === 0) return null
  const featured = items[Math.min(active, items.length - 1)]

  return (
    <section className="relative py-20 md:py-28 bg-slate-50 dark:bg-transparent transition-colors duration-700 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:items-center">
        {/* Header: first on mobile, right column on desktop (min-w-0: the swipe row must not widen the grid) */}
        <div className="min-w-0 lg:order-2">
          <h2 className="font-heading text-4xl md:text-5xl font-medium tracking-tight leading-[1.05] text-slate-900 dark:text-white">
            Ils ont vécu <span className="text-brand-blue">l&apos;expérience</span>
          </h2>
          <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-slate-600 dark:text-white/65">
            Nos voyageurs racontent leur séjour en vidéo. Choisissez une destination pour les écouter.
          </p>

          {/* Destination picker: grid on desktop, swipe row on mobile */}
          <div
            role="tablist"
            aria-label="Témoignages par destination"
            className="mt-8 -mx-4 px-4 flex gap-3 overflow-x-auto snap-x snap-mandatory hide-scrollbar sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 sm:overflow-visible lg:grid-cols-4"
          >
            {items.map((t, i) => {
              const isActive = i === active
              return (
                <button
                  key={String(t.id)}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(i)}
                  className={`group relative shrink-0 snap-start w-[30%] min-w-[104px] sm:w-auto aspect-[4/5] overflow-hidden rounded-2xl bg-brand-dark text-left transition duration-300 active:scale-[0.98] ${
                    isActive
                      ? 'ring-2 ring-brand-blue ring-offset-2 ring-offset-slate-50 dark:ring-offset-brand-dark'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <Cover t={t} sizes="(max-width: 640px) 30vw, 140px" />
                  <span className="absolute inset-0 bg-gradient-to-t from-brand-deeper/85 via-brand-deeper/10 to-transparent" />
                  <span className="absolute inset-x-2.5 bottom-2.5 font-heading text-sm font-medium leading-tight text-white">
                    {labelOf(t)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Featured player: second on mobile, left column on desktop */}
        <div className="min-w-0 lg:order-1">
          <div className="relative mx-auto w-full max-w-[400px] aspect-[9/16] max-h-[78vh] overflow-hidden rounded-[1.75rem] bg-brand-dark shadow-[0_30px_60px_-25px_rgba(11,19,43,0.55)]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={String(featured.id)}
                className="absolute inset-0"
                initial={reduce ? false : { opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <Cover t={featured} sizes="(max-width: 640px) 90vw, 400px" eager />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand-deeper/90 via-brand-deeper/35 to-transparent pointer-events-none" />

            <button
              type="button"
              onClick={() => setOpenIndex(Math.min(active, items.length - 1))}
              className="group absolute inset-0 flex items-center justify-center focus-visible:outline-none"
              aria-label={`Lire le témoignage vidéo : ${labelOf(featured)}`}
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-brand-blue shadow-[0_12px_32px_rgba(11,19,43,0.35)] transition-transform duration-300 group-hover:scale-105 group-active:scale-95 group-focus-visible:ring-4 group-focus-visible:ring-brand-cyan/60">
                <Play className="ml-1 h-8 w-8 fill-current" strokeWidth={1.5} />
              </span>
            </button>

            <div className="absolute inset-x-0 bottom-0 p-6 pointer-events-none">
              <h3 className="font-heading text-3xl font-medium leading-none text-white">{labelOf(featured)}</h3>
              {featured.testimonialText ? (
                <p className="mt-3 text-sm leading-snug text-white/85 line-clamp-3">
                  &laquo;&nbsp;{featured.testimonialText}&nbsp;&raquo;
                </p>
              ) : (
                <p className="mt-2 text-sm text-white/70">
                  Témoignage vidéo{featured.tripYear ? `, ${featured.tripYear}` : ''}
                </p>
              )}
            </div>
          </div>
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
