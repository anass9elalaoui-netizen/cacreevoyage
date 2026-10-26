'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import LazyVideo from '@/components/LazyVideo'
import {
  PostcardStamp,
  Stars,
  destinationOf,
  getVideo,
  getVideoPoster,
  type TestimonialDoc,
} from '@/components/testimonials/shared'

/* ─── Lightbox: the video (with sound) only loads once opened ───────── */
function VideoLightbox({ src, title, onClose }: { src: string; title: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-brand-deeper/85 backdrop-blur-md p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-[420px] aspect-[9/16] max-h-[85vh] rounded-2xl overflow-hidden bg-black shadow-2xl"
        initial={{ scale: 0.96, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 12 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Opened by a click, so playback with sound is allowed */}
        <video src={src} controls autoPlay playsInline className="absolute inset-0 h-full w-full object-contain" />
      </motion.div>
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

/* ─── Postcard card ─────────────────────────────────────────────────── */
function PostcardCard({ t, index, onPlay }: { t: TestimonialDoc; index: number; onPlay: () => void }) {
  const video = getVideo(t)!
  const poster = getVideoPoster(t)
  const dest = destinationOf(t)
  const firstName = t.travelerName?.trim() || 'Voyageur'
  const tilt = index % 2 === 0 ? '-rotate-[1.2deg]' : 'rotate-[1.2deg]'

  return (
    <article
      className={`group relative w-[300px] sm:w-[320px] shrink-0 rounded-[6px] bg-[#FBF7EF] p-3 pb-5 shadow-[0_18px_40px_-12px_rgba(11,19,43,0.35)] transition-transform duration-500 hover:rotate-0 hover:-translate-y-1 ${tilt}`}
    >
      {/* Photo area, printed-photo style */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[3px] bg-brand-dark">
        {poster ? (
          <Image src={poster} alt={`Témoignage de ${firstName}`} fill sizes="320px" loading="lazy" className="object-cover" />
        ) : (
          // No poster uploaded yet: a still frame (metadata only), never the full video
          <LazyVideo src={`${video}#t=0.5`} paused aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

        <PostcardStamp destination={dest?.title} year={t.tripYear} className="absolute top-3 right-3" />

        <button
          type="button"
          onClick={onPlay}
          className="absolute inset-0 flex items-center justify-center focus-visible:outline-none"
          aria-label={`Lire le témoignage vidéo de ${firstName}`}
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-brand-blue shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-110 group-focus-within:ring-4 group-focus-within:ring-brand-cyan/60">
            <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      </div>

      {/* Postcard back: stars, quote, signature */}
      <div className="px-2 pt-4">
        <Stars rating={t.rating} className="text-base" />
        {t.testimonialText && (
          <p className="mt-2 font-heading italic text-[1.05rem] leading-snug text-slate-800 line-clamp-3">
            &laquo;&nbsp;{t.testimonialText}&nbsp;&raquo;
          </p>
        )}
        <div className="mt-4 flex items-end justify-between border-t border-dashed border-brand-dark/15 pt-3">
          <div>
            <p className="font-heading text-lg leading-none text-brand-dark">{firstName}</p>
            {dest?.title && (
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-blue">
                {dest.title}
                {t.tripYear ? ` · ${t.tripYear}` : ''}
              </p>
            )}
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-brand-dark/40">Carte postale</span>
        </div>
      </div>
    </article>
  )
}

export default function DestinationTestimonials({ testimonials }: { testimonials: TestimonialDoc[] }) {
  const videoTestimonials = testimonials.filter((t) => getVideo(t))
  const [open, setOpen] = useState<TestimonialDoc | null>(null)
  const [mounted, setMounted] = useState(false)
  const close = useCallback(() => setOpen(null), [])

  useEffect(() => setMounted(true), [])

  if (videoTestimonials.length === 0) return null

  return (
    <section className="relative py-24 bg-slate-50 dark:bg-transparent transition-colors duration-700 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="uppercase text-brand-blue text-xs font-body mb-4 block font-semibold tracking-wider">Avis Clients</span>
          <h2 className="font-heading text-4xl md:text-5xl text-slate-900 dark:text-white tracking-tight font-bold">
            Ils Ont Vécu <span className="text-brand-blue">l&apos;Expérience</span>
          </h2>
        </div>

        <div className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 px-2 md:flex-wrap md:justify-center md:overflow-visible hide-scrollbar">
          {videoTestimonials.map((t, i) => (
            <div key={t.id} className="snap-center">
              <PostcardCard t={t} index={i} onPlay={() => setOpen(t)} />
            </div>
          ))}
        </div>
      </div>

      {/* Portal to <body>: <main> is a stacking context below the fixed navbar */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <VideoLightbox
                src={getVideo(open)!}
                title={`Témoignage vidéo de ${open.travelerName || 'voyageur'}`}
                onClose={close}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  )
}
