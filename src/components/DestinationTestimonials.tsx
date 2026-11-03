'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Play, Volume2, VolumeX, X } from 'lucide-react'
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

/** Destination page of a testimonial, when it is linked to one in the admin. */
const destinationHref = (t: TestimonialDoc) => {
  const slug = destinationOf(t)?.slug
  return slug ? `/destinations/${slug}` : null
}

const items = (n: number) => Array.from({ length: n }, (_, i) => i)

/** Country flag from /public/flags (SVG, because emoji flags do not display on Windows). Decorative: the name sits next to it. */
function Flag({ code, className = '' }: { code?: string | null; className?: string }) {
  const [broken, setBroken] = useState(false)
  useEffect(() => setBroken(false), [code])
  if (!code || broken) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/flags/${code.trim().toLowerCase()}.svg`}
      alt=""
      loading="lazy"
      onError={() => setBroken(true)}
      className={`inline-block shrink-0 rounded-[3px] object-cover ring-1 ${className}`}
    />
  )
}

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
    <span className="relative block h-[72px] w-14 shrink-0 overflow-hidden rounded-xl bg-brand-dark">
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
        <Flag code={t.countryCode} className="mr-2 h-4 w-[22px] align-[-2px] ring-white/30" />
        {labelOf(t)}
        {t.tripYear ? <span className="text-white/50">, {t.tripYear}</span> : null}
        <span className="mt-1 block text-xs text-white/45">
          {index + 1} sur {items.length}
        </span>
        {destinationHref(t) ? (
          <Link
            href={destinationHref(t)!}
            onClick={onClose}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-brand-dark transition-transform duration-200 hover:-translate-y-0.5"
          >
            Découvrir {labelOf(t)}
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        ) : null}
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

/* ─── Featured card: silent preview, sound on request, story segments, swipe, neighbours peeking on mobile ─── */
function Featured({
  t,
  prev,
  next,
  index,
  count,
  direction,
  running,
  advancing,
  sound,
  onSound,
  onPlay,
  onSwipe,
}: {
  t: TestimonialDoc
  prev: TestimonialDoc
  next: TestimonialDoc
  index: number
  count: number
  direction: number
  running: boolean
  advancing: boolean
  sound: boolean
  onSound: (on: boolean) => void
  onPlay: () => void
  onSwipe: (dir: 1 | -1) => void
}) {
  const reduce = useReducedMotion()
  const preview = getVideoPreview(t)
  const href = destinationHref(t)
  const dragged = useRef(false)
  const soundRef = useRef<HTMLVideoElement>(null)
  const [soundLive, setSoundLive] = useState(false)

  // Replacing the src aborts the previous play(): that is not a refusal from the browser
  const start = (v: HTMLVideoElement, url: string) => {
    v.src = url
    v.muted = false
    v.play().catch((e: Error) => {
      if (e.name !== 'AbortError') onSound(false)
    })
  }

  const toggleSound = () => {
    if (dragged.current) return
    const v = soundRef.current
    if (!v) return
    if (sound) {
      onSound(false)
      return
    }
    // Started inside the tap: browsers only allow sound from a user gesture
    start(v, pickPlaybackUrl(t))
    onSound(true)
  }

  // Sound stays on when the destination changes; stopping it releases the full video
  useEffect(() => {
    const v = soundRef.current
    if (!v) return
    if (!sound) {
      setSoundLive(false)
      if (v.getAttribute('src')) {
        v.pause()
        v.removeAttribute('src')
        v.load()
      }
      return
    }
    const url = pickPlaybackUrl(t)
    if (v.getAttribute('src') !== url) {
      setSoundLive(false)
      start(v, url)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sound, t])

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

  const peek =
    'absolute inset-y-8 z-0 w-2/5 overflow-hidden rounded-[1.25rem] bg-brand-dark opacity-75 transition-opacity active:opacity-100 lg:hidden'

  return (
    <div className="relative isolate mx-auto w-full max-w-[420px] [perspective:1200px]">
      {/* Mobile: the neighbours peek out on both sides, a visible promise that there is more to see */}
      {count > 1 ? (
        <>
          {count > 2 ? (
            <button type="button" onClick={() => onSwipe(-1)} aria-label={`Témoignage précédent : ${labelOf(prev)}`} className={`${peek} left-0`}>
              <Cover t={prev} sizes="160px" />
            </button>
          ) : null}
          <button type="button" onClick={() => onSwipe(1)} aria-label={`Témoignage suivant : ${labelOf(next)}`} className={`${peek} right-0`}>
            <Cover t={next} sizes="160px" />
          </button>
        </>
      ) : null}

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
        className="group relative z-[1] mx-auto aspect-[9/16] w-[84%] max-w-[calc(80vh*0.5625)] touch-pan-y lg:w-full"
      >
        <button
          type="button"
          onClick={() => {
            if (!dragged.current) onPlay()
          }}
          className="absolute inset-0 block overflow-hidden rounded-[1.75rem] bg-brand-dark text-left shadow-[0_24px_50px_-28px_rgba(11,19,43,0.4)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/60"
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
              <div
                className="absolute inset-0"
                style={
                  reduce
                    ? undefined
                    : {
                        animation: `ccv-pushin ${STEP_MS + 2000}ms linear forwards`,
                        animationPlayState: running ? 'running' : 'paused',
                      }
                }
              >
                <Cover t={t} sizes="(max-width: 640px) 84vw, 420px" eager />
                {/* Silent 6 s loop on top of the cover (LazyVideo: only when visible, poster-only under reduced motion / Data Saver) */}
                {preview ? (
                  <LazyVideo src={preview} poster={getVideoPoster(t) || undefined} priority paused={soundLive} aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
                ) : null}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* The video with sound: its src is only set once the visitor asks for sound */}
          <video
            ref={soundRef}
            playsInline
            preload="none"
            onPlaying={() => setSoundLive(true)}
            onEnded={() => {
              if (count > 1) onSwipe(1)
              else onSound(false)
            }}
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${soundLive ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Light sheen following the pointer */}
          {!reduce && (
            <motion.span
              aria-hidden="true"
              style={{ background: sheen }}
              className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}

          {/* Just enough shade to read the text: the traveller stays bright */}
          <span className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24 bg-gradient-to-b from-black/30 to-transparent" />
          <span className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[45%] bg-gradient-to-t from-brand-deeper/75 via-brand-deeper/25 to-transparent" />
        </button>

        {/* Story segments: how many testimonials there are, and how far along we are */}
        {count > 1 ? (
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-4 top-3.5 z-[2] flex gap-1">
            {items(count).map((i) => (
              <span key={i} className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/45">
                {i < index ? <span className="absolute inset-0 bg-white" /> : null}
                {i === index ? (
                  <span
                    key={`segment-${index}`}
                    className="absolute inset-0 origin-left bg-white"
                    style={
                      reduce
                        ? undefined
                        : {
                            animation: `ccv-progress ${STEP_MS}ms linear forwards`,
                            animationPlayState: advancing ? 'running' : 'paused',
                          }
                    }
                  />
                ) : null}
              </span>
            ))}
          </div>
        ) : null}

        {count > 1 ? (
          <span className="pointer-events-none absolute left-4 top-8 z-[2] text-xs font-semibold tabular-nums text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]">
            {index + 1} / {count}
          </span>
        ) : null}

        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={sound}
          aria-label={sound ? 'Couper le son' : 'Activer le son'}
          className="absolute right-3 top-7 z-[3] flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-brand-dark shadow-md backdrop-blur transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/60"
        >
          {sound ? (
            <Volume2 className={`h-5 w-5 text-brand-blue ${soundLive ? '' : 'animate-pulse'}`} strokeWidth={2} />
          ) : (
            <VolumeX className="h-5 w-5" strokeWidth={2} />
          )}
        </button>

        {/* Clicks pass through to the card; only the destination link catches them */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex flex-col gap-3 p-5 md:p-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={String(t.id)}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, delay: reduce ? 0 : 0.1 }}
              className="flex items-center gap-2.5 font-heading text-[2rem] leading-none font-medium text-white [text-shadow:0_1px_14px_rgba(0,0,0,0.4)]"
            >
              <Flag code={t.countryCode} className="h-6 w-8 shadow-md ring-white/60" />
              {labelOf(t)}
            </motion.span>
          </AnimatePresence>
          {t.testimonialText ? (
            <span className="text-sm leading-snug text-white/90 line-clamp-3 [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]">&laquo;&nbsp;{t.testimonialText}&nbsp;&raquo;</span>
          ) : null}
          <span className="flex flex-wrap items-center gap-2">
            <span aria-hidden="true" className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-brand-dark shadow-lg transition-transform duration-300 group-hover:-translate-y-0.5">
              <Play className="h-4 w-4 fill-brand-blue text-brand-blue" strokeWidth={1.5} />
              Voir le témoignage
            </span>
            {href ? (
              <Link
                href={href}
                draggable={false}
                onClick={(e) => {
                  if (dragged.current) e.preventDefault()
                }}
                className="pointer-events-auto inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/50 bg-white/20 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-colors duration-200 hover:bg-white hover:text-brand-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/60"
              >
                Découvrir {labelOf(t)}
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
            ) : null}
          </span>
        </div>
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
  const [sound, setSound] = useState(false)
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
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Stories-style auto-advance: one destination every STEP_MS. Paused on hover / focus,
  // while the lightbox is open, off screen, and under prefers-reduced-motion.
  const autoplay = count > 1 && inView && !paused && !sound && openIndex === null && !reduce

  // Sound never outlives the section: it stops off screen and when the full video opens
  useEffect(() => {
    if (!inView || openIndex !== null) setSound(false)
  }, [inView, openIndex])
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
      <style dangerouslySetInnerHTML={{ __html: '@keyframes ccv-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}@keyframes ccv-pushin{from{transform:scale(1)}to{transform:scale(1.07)}}' }} />
      <div
        className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16 lg:items-center"
        // Pointer type matters: a tap fires a fake mouseenter with no leave, which froze the section on phones
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') setPaused(true)
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === 'mouse') setPaused(false)
        }}
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
            className="mt-8 -mx-4 px-4 flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-px-4 hide-scrollbar sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:overflow-visible"
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
                  whileTap={reduce ? undefined : { scale: 0.98 }}
                  onClick={() => go(i)}
                  onPointerEnter={(e) => {
                    // Hover previews the destination on mouse devices (touch uses tap)
                    if (e.pointerType !== 'mouse') return
                    setHovered(i)
                    if (i !== current) go(i)
                  }}
                  onPointerLeave={() => setHovered((h) => (h === i ? null : h))}
                  className={`relative flex shrink-0 snap-start items-center gap-3.5 w-[220px] sm:w-auto rounded-2xl p-2 pr-4 text-left border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/60 ${
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
                  <span className="relative z-[1] block shrink-0">
                    <Thumb t={t} playing={!reduce && hovered === i} />
                  </span>
                  <span className="relative z-[1] min-w-0">
                    <span className={`flex items-center gap-2 font-heading text-base font-medium ${isActive ? 'text-brand-blue' : 'text-slate-900 dark:text-white'}`}>
                      <Flag code={t.countryCode} className="h-3.5 w-[19px] ring-black/10 dark:ring-white/20" />
                      <span className="truncate">{labelOf(t)}</span>
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-white/50">
                      <Play className="h-3 w-3" strokeWidth={2} />
                      Témoignage vidéo
                    </span>
                  </span>

                  {/* Story progress: fills while this destination is featured, freezes while paused */}
                  {isActive && count > 1 && !reduce ? (
                    <span aria-hidden="true" className="absolute inset-0 z-[1] overflow-hidden rounded-2xl pointer-events-none">
                      <span
                        key={`progress-${current}`}
                        className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-brand-blue"
                        style={{
                          animation: `ccv-progress ${STEP_MS}ms linear forwards`,
                          animationPlayState: autoplay ? 'running' : 'paused',
                        }}
                      />
                    </span>
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
            prev={items[(current - 1 + count) % count]}
            next={items[(current + 1) % count]}
            index={current}
            count={count}
            direction={direction}
            running={inView && openIndex === null}
            advancing={autoplay}
            sound={sound}
            onSound={setSound}
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
