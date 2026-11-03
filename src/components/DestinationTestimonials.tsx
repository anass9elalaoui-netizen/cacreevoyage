'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import LazyVideo from '@/components/LazyVideo'
import { Stars, destinationOf, getVideo, getVideoPoster, type TestimonialDoc } from '@/components/testimonials/shared'

/** "Turquie" from the linked destination, otherwise the traveler/group name typed in the admin. */
const labelOf = (t: TestimonialDoc) => destinationOf(t)?.title || t.travelerName?.trim() || 'Nos voyageurs'

/* ─── Lightbox: video with sound, loads only once opened; ← → between destinations ─── */
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
    'absolute top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors disabled:opacity-0'

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Témoignage vidéo — ${labelOf(t)}`}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-brand-deeper/90 backdrop-blur-md p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <div className="relative w-full max-w-[420px]" onClick={(e) => e.stopPropagation()}>
        <motion.div
          key={String(t.id)}
          className="relative w-full aspect-[9/16] max-h-[78vh] mx-auto rounded-2xl overflow-hidden bg-black shadow-2xl"
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        >
          {/* Opened by a click, so playback with sound is allowed */}
          <video
            src={getVideo(t)!}
            poster={getVideoPoster(t) || undefined}
            controls
            autoPlay
            playsInline
            className="absolute inset-0 h-full w-full object-contain"
          />
        </motion.div>

        <button type="button" onClick={() => onIndex(index - 1)} disabled={!hasPrev} className={`${arrow} -left-2 md:-left-16`} aria-label="Témoignage précédent">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button type="button" onClick={() => onIndex(index + 1)} disabled={!hasNext} className={`${arrow} -right-2 md:-right-16`} aria-label="Témoignage suivant">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <p className="text-center text-white/90 font-heading text-lg" onClick={(e) => e.stopPropagation()}>
        Témoignage {labelOf(t)}
        {t.tripYear ? <span className="text-white/50"> · {t.tripYear}</span> : null}
        <span className="block text-xs uppercase tracking-[0.25em] text-white/40 mt-1">
          {index + 1} / {items.length}
        </span>
      </p>

      <button
        ref={closeRef}
        onClick={onClose}
        className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
        aria-label="Fermer la vidéo"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  )
}

/* ─── One tall "story" card per destination ─────────────────────────── */
function StoryCard({ t, onPlay }: { t: TestimonialDoc; onPlay: () => void }) {
  const video = getVideo(t)!
  const poster = getVideoPoster(t)
  const label = labelOf(t)

  return (
    <button
      type="button"
      onClick={onPlay}
      id={`temoignage-${String(t.id)}`}
      className="group relative block w-[72vw] max-w-[300px] sm:w-[260px] shrink-0 snap-center aspect-[9/16] rounded-[1.75rem] overflow-hidden bg-brand-dark text-left shadow-[0_24px_50px_-20px_rgba(11,19,43,0.55)] ring-1 ring-black/5 dark:ring-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/60 transition-transform duration-500 hover:-translate-y-1.5"
      aria-label={`Lire le témoignage vidéo — ${label}`}
    >
      {poster ? (
        <Image src={poster} alt="" fill sizes="(max-width: 640px) 72vw, 260px" loading="lazy" className="object-cover transition-transform duration-700 group-hover:scale-105" />
      ) : (
        // No cover uploaded yet: a still frame (metadata only), never the full video
        <LazyVideo src={`${video}#t=1`} paused aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      )}

      {/* Legibility gradients */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/55 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-brand-deeper/95 via-brand-deeper/40 to-transparent" />

      {/* Top: video badge + year */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          Vidéo
        </span>
        {t.tripYear ? (
          <span className="rounded-full bg-black/35 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium tracking-widest text-white/90">{t.tripYear}</span>
        ) : null}
      </div>

      {/* Center: play */}
      <span className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-brand-blue shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-110">
        <span className="absolute inset-0 rounded-full border-2 border-white/60 animate-ping [animation-duration:2.4s] motion-reduce:hidden" />
        <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
      </span>

      {/* Bottom: destination title, optional quote */}
      <div className="absolute bottom-0 inset-x-0 p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-cyan">Témoignage</p>
        <h3 className="mt-1 font-heading text-[1.75rem] leading-none font-medium text-white">{label}</h3>
        {t.testimonialText ? (
          <p className="mt-3 font-heading italic text-sm leading-snug text-white/80 line-clamp-2">&laquo;&nbsp;{t.testimonialText}&nbsp;&raquo;</p>
        ) : null}
        {t.rating ? <Stars rating={t.rating} className="mt-3 text-sm" /> : null}
      </div>
    </button>
  )
}

export default function DestinationTestimonials({ testimonials }: { testimonials: TestimonialDoc[] }) {
  const items = testimonials.filter((t) => getVideo(t))
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const rowRef = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpenIndex(null), [])

  useEffect(() => setMounted(true), [])

  const scrollToCard = (id: string | number) => {
    const card = document.getElementById(`temoignage-${String(id)}`)
    const row = rowRef.current
    if (!card || !row) return
    row.scrollTo({ left: card.offsetLeft - row.clientWidth / 2 + card.clientWidth / 2, behavior: 'smooth' })
  }

  if (items.length === 0) return null

  return (
    <section className="relative py-24 bg-slate-50 dark:bg-transparent transition-colors duration-700 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="uppercase text-brand-blue text-xs font-body mb-4 block font-semibold tracking-wider">Avis clients · en vidéo</span>
          <h2 className="font-heading text-4xl md:text-5xl text-slate-900 dark:text-white tracking-tight font-bold">
            Ils Ont Vécu <span className="text-brand-blue">l&apos;Expérience</span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-white/60 max-w-xl mx-auto">
            Nos voyageurs racontent leur voyage, destination par destination.
          </p>
        </div>

        {/* Destination chips */}
        {items.length > 1 && (
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {items.map((t) => (
              <button
                key={String(t.id)}
                type="button"
                onClick={() => scrollToCard(t.id)}
                className="rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-white/5 px-4 py-1.5 text-sm text-slate-700 dark:text-white/80 hover:border-brand-blue hover:text-brand-blue transition-colors"
              >
                {labelOf(t)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Story row: swipe on mobile, centered wrap on large screens */}
      <div
        ref={rowRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory px-[14vw] sm:px-8 pb-8 pt-2 hide-scrollbar lg:justify-center lg:flex-wrap lg:overflow-visible lg:px-8"
      >
        {items.map((t, i) => (
          <StoryCard key={String(t.id)} t={t} onPlay={() => setOpenIndex(i)} />
        ))}
      </div>

      {/* Portal to <body>: <main> is a stacking context below the fixed navbar */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {openIndex !== null && <VideoLightbox items={items} index={openIndex} onIndex={setOpenIndex} onClose={close} />}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  )
}
