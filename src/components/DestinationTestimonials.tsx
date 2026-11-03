'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { motion, AnimatePresence, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
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

/**
 * Playlist thumbnail: cover image, and the 6 s silent preview playing while the row is hovered
 * (mouse devices only). The preview's src is only attached on the first hover (≤ 0.5 MB).
 */
function Thumb({ t, playing }: { t: TestimonialDoc; playing: boolean }) {
  const preview = getVideoPreview(t)
  const ref = useRef<HTMLVideoElement>(null)
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    if (playing && preview) setArmed(true)
  }, [playing, preview])

  useEffect(() => {
    const v = ref.current
    if (!v || !armed) return
    if (playing) v.play().catch(() => {})
    else v.pause()
  }, [playing, armed])

  return (
    <span className="relative h-[72px] w-14 shrink-0 overflow-hidden rounded-xl bg-brand-dark">
      <Cover t={t} sizes="56px" />
      {preview ? (
        <video
          ref={ref}
          src={armed ? preview : undefined}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${playing && armed ? 'opacity-100' : 'opacity-0'}`}
        />
      ) : null}
    </span>
  )
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

/** How long each destination stays featured before the section advances on its own (= preview length). */
const STEP_MS = 6000

/* ─── Featured card: silent preview loop, pointer tilt + light sheen, swipe to change destination ─── */
function Featured({
  t,
  direction,
  onPlay,
  onSwipe,
}: {
  t: TestimonialDoc
  direction: number
  onPlay: () => void
  onSwipe: (dir: 1 | -1) => void
}) {
  const reduce = useReducedMotion()
  const preview = getVideoPreview(t)
  const dragged = useRef(false)

  // Pointer tilt (motion values: no React re-render per mouse move)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateY = useSpring(useTransform(px, [0, 1], [-7, 7]), { stiffness: 150, damping: 18 })
  const rotateX = useSpring(useTransform(py, [0, 1], [6, -6]), { stiffness: 150, damping: 18 })
  const sheenX = useTransform(px, [0, 1], ['0%', '100%'])
  const sheenY = useTransform(py, [0, 1], ['0%', '100%'])
  const sheen = useMotionTemplate`radial-gradient(420px circle at ${sheenX} ${sheenY}, rgba(255,255,255,0.18), transparent 45%)`

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const onPointerLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <div className="mx-auto w-full max-w-[420px] [perspective:1200px]">
      <motion.div
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={reduce ? undefined : { rotateX, rotateY }}
        drag={reduce ? false : 'x'}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        dragSnapToOrigin
        // A new press clears the flag; a drag sets it, so the click that ends a drag is ignored
        onPointerDownCapture={() => {
          dragged.current = false
        }}
        onDragStart={() => {
          dragged.current = true
        }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60 || info.velocity.x < -400) onSwipe(1)
          else if (info.offset.x > 60 || info.velocity.x > 400) onSwipe(-1)
        }}
        className="relative aspect-[9/16] max-h-[80vh] touch-pan-y"
      >
        <button
          type="button"
          onClick={() => {
            if (!dragged.current) onPlay()
          }}
          className="group relative block h-full w-full overflow-hidden rounded-[1.75rem] bg-brand-dark text-left shadow-[0_30px_60px_-25px_rgba(11,19,43,0.55)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/60"
          aria-label={`Voir le témoignage vidéo : ${labelOf(t)}`}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={String(t.id)}
              className="absolute inset-0"
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: direction * 60, scale: 1.04 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: direction * -60, scale: 0.98 }}
              transition={{ duration: reduce ? 0.2 : 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Slow cinematic push-in while the destination is featured */}
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1 }}
                animate={reduce ? { scale: 1 } : { scale: 1.07 }}
                transition={{ duration: STEP_MS / 1000 + 2, ease: 'linear' }}
              >
                <Cover t={t} sizes="(max-width: 640px) 92vw, 420px" eager />
                {/* Silent 6 s loop on top of the cover (LazyVideo: only when visible, poster-only under reduced motion / Data Saver) */}
                {preview ? (
                  <LazyVideo src={preview} poster={getVideoPoster(t) || undefined} priority aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
                ) : null}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Light sheen following the pointer */}
          {!reduce && (
            <motion.span
              aria-hidden="true"
              style={{ background: sheen }}
              className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}

          <span className="absolute inset-x-0 bottom-0 z-[1] h-3/5 bg-gradient-to-t from-brand-deeper/95 via-brand-deeper/45 to-transparent pointer-events-none" />

          <span className="absolute inset-x-0 bottom-0 z-[2] flex flex-col gap-4 p-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={String(t.id)}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, delay: reduce ? 0 : 0.1 }}
                className="font-heading text-[2rem] leading-none font-medium text-white"
              >
                {labelOf(t)}
              </motion.span>
            </AnimatePresence>
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
      </motion.div>
    </div>
  )
}

export default function DestinationTestimonials({ testimonials }: { testimonials: TestimonialDoc[] }) {
  const items = testimonials.filter((t) => getVideo(t))
  const count = items.length
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const [inView, setInView] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const reduce = useReducedMotion()
  const close = useCallback(() => setOpenIndex(null), [])

  useEffect(() => setMounted(true), [])

  const go = useCallback(
    (next: number) => {
      if (count === 0) return
      setDirection(next > active ? 1 : -1)
      setActive(((next % count) + count) % count)
    },
    [active, count],
  )

  // Only run the auto-advance while the section is on screen
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Stories-style auto-advance: one destination every STEP_MS. Paused on hover / focus,
  // while the lightbox is open, off screen, and under prefers-reduced-motion.
  const autoplay = count > 1 && inView && !paused && openIndex === null && !reduce
  useEffect(() => {
    if (!autoplay) return
    const id = setTimeout(() => go(active + 1), STEP_MS)
    return () => clearTimeout(id)
  }, [autoplay, active, go])

  // Keep the active destination visible inside the mobile swipe row (scrolls the row, not the page)
  useEffect(() => {
    const tab = tabRefs.current[active]
    const row = tab?.parentElement
    if (!tab || !row || row.scrollWidth <= row.clientWidth) return
    row.scrollTo({ left: tab.offsetLeft - 16, behavior: reduce ? 'auto' : 'smooth' })
  }, [active, reduce])

  if (count === 0) return null
  const current = Math.min(active, count - 1)

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 bg-slate-50 dark:bg-transparent transition-colors duration-700 overflow-hidden"
    >
      <style dangerouslySetInnerHTML={{ __html: '@keyframes ccv-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}' }} />
      <div
        className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16 lg:items-center"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Header + playlist: first on mobile, right column on desktop (min-w-0 keeps the swipe row inside the grid) */}
        <div className="min-w-0 lg:order-2">
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-4xl md:text-5xl font-medium tracking-tight leading-[1.05] text-slate-900 dark:text-white"
          >
            Ils ont vécu <span className="text-brand-blue">l&apos;expérience</span>
          </motion.h2>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 max-w-[46ch] text-base leading-relaxed text-slate-600 dark:text-white/65"
          >
            Nos voyageurs racontent leur séjour en vidéo, destination par destination.
          </motion.p>

          <motion.div
            role="tablist"
            aria-label="Témoignages par destination"
            initial={reduce ? false : 'hidden'}
            whileInView="shown"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
            className="mt-8 -mx-4 px-4 flex gap-3 overflow-x-auto snap-x snap-mandatory hide-scrollbar sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:overflow-visible"
          >
            {items.map((t, i) => {
              const isActive = i === current
              return (
                <motion.button
                  key={String(t.id)}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  onClick={() => go(i)}
                  onMouseEnter={() => {
                    setHovered(i)
                    // Hover previews the destination on mouse devices (touch uses tap)
                    if (i !== current && window.matchMedia('(hover: hover)').matches) go(i)
                  }}
                  onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
                  className={`relative flex shrink-0 snap-start items-center gap-3.5 w-[220px] sm:w-auto overflow-hidden rounded-2xl p-2 pr-4 text-left border transition-colors duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/60 ${
                    isActive
                      ? 'border-transparent'
                      : 'bg-white/60 dark:bg-white/[0.04] border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/[0.08]'
                  }`}
                >
                  {/* Selection that glides from one destination to the next */}
                  {isActive ? (
                    <motion.span
                      layoutId="ccv-active-destination"
                      aria-hidden="true"
                      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-2xl border border-brand-blue/50 bg-white dark:bg-white/10 shadow-[0_10px_30px_-12px_rgba(28,140,201,0.45)]"
                    />
                  ) : null}
                  <span className="relative z-[1]">
                    <Thumb t={t} playing={!reduce && hovered === i} />
                  </span>
                  <span className="relative z-[1] min-w-0">
                    <span className={`block truncate font-heading text-base font-medium ${isActive ? 'text-brand-blue' : 'text-slate-900 dark:text-white'}`}>
                      {labelOf(t)}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-white/50">
                      <Play className="h-3 w-3" strokeWidth={2} />
                      Témoignage vidéo
                    </span>
                  </span>

                  {/* Story progress: fills while this destination is featured, freezes while paused */}
                  {isActive && count > 1 && !reduce ? (
                    <span
                      key={`progress-${current}`}
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 z-[1] h-[3px] origin-left bg-brand-blue"
                      style={{
                        animation: `ccv-progress ${STEP_MS}ms linear forwards`,
                        animationPlayState: autoplay ? 'running' : 'paused',
                      }}
                    />
                  ) : null}
                </motion.button>
              )
            })}
          </motion.div>
        </div>

        {/* Featured: second on mobile, left column on desktop */}
        <div className="min-w-0 lg:order-1">
          <Featured
            t={items[current]}
            direction={direction}
            onPlay={() => setOpenIndex(current)}
            onSwipe={(dir) => go(current + dir)}
          />
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
                  go(i)
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
