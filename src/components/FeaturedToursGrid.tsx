'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import TourCard from './TourCard'

interface Tour {
  id: string
  title: string
  slug: string
  excerpt?: string
  shortDescription?: string
  scope?: string
  duration?: string
  thumbnail?: { url: string; alt?: string } | null
  pricing?: { basePrice?: number; currency?: string } | null
  logistics?: {
    durationDays?: number
    durationNights?: number
    maxGroupSize?: number
    difficulty?: string
  } | null
  isFeatured?: boolean
  departureDate?: string | null
  returnDate?: string | null
  departureDates?: { date: string; spotsLeft?: number; status?: string }[] | null
  seasons?: string[] | null
  tourStatus?: string | null
}

interface FeaturedToursGridProps {
  tours: Tour[]
}

/** Phones: time each tour stays before the row moves on by itself. */
const AUTO_MS = 4500
/** Phones: pause after a touch before the row starts moving again. */
const RESUME_MS = 5000

/** Columns follow the number of tours, so a card never ends up alone on its row. */
function layoutFor(count: number) {
  if (count === 1) return 'md:grid-cols-1 md:max-w-sm'
  if (count === 2) return 'md:grid-cols-2 md:max-w-3xl'
  if (count === 3) return 'md:grid-cols-2 lg:grid-cols-3 md:max-w-7xl'
  if (count === 4) return 'md:grid-cols-2 md:max-w-4xl xl:grid-cols-4 xl:max-w-[1500px]'
  return 'md:grid-cols-2 lg:grid-cols-3 md:max-w-7xl'
}

export default function FeaturedToursGrid({ tours }: FeaturedToursGridProps) {
  const [active, setActive] = useState(0)
  const [isPhone, setIsPhone] = useState(false)
  const [inView, setInView] = useState(false)
  const [touching, setTouching] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reduce = useReducedMotion()
  const count = tours?.length ?? 0

  // Auto-move is for the phone row only: the desktop grid shows every tour at once
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    const update = () => setIsPhone(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  // Only moves while the visitor can actually see it
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(
    () => () => {
      if (resumeRef.current) clearTimeout(resumeRef.current)
    },
    [],
  )

  const autoplay = isPhone && inView && !touching && !reduce && count > 1

  useEffect(() => {
    if (!autoplay) return
    const id = setTimeout(() => {
      const track = trackRef.current
      const next = track?.children[(active + 1) % count] as HTMLElement | undefined
      // Scrolls the row, never the page
      if (track && next) track.scrollTo({ left: next.offsetLeft - 16, behavior: 'smooth' })
    }, AUTO_MS)
    return () => clearTimeout(id)
  }, [autoplay, active, count])

  const holdAuto = () => {
    if (resumeRef.current) clearTimeout(resumeRef.current)
    setTouching(true)
  }
  const releaseAuto = () => {
    if (resumeRef.current) clearTimeout(resumeRef.current)
    resumeRef.current = setTimeout(() => setTouching(false), RESUME_MS)
  }

  if (count === 0) return null

  const onScroll = () => {
    const track = trackRef.current
    if (!track) return
    if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 2) {
      setActive(count - 1)
      return
    }
    const cards = Array.from(track.children) as HTMLElement[]
    const nearest = cards.reduce(
      (best, card, i) => {
        const distance = Math.abs(card.offsetLeft - 16 - track.scrollLeft)
        return distance < best.distance ? { i, distance } : best
      },
      { i: 0, distance: Infinity },
    )
    setActive(nearest.i)
  }

  return (
    <section className="relative w-full py-16 md:py-24 bg-slate-50 dark:bg-transparent transition-colors duration-700 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Heading */}
      <div className="text-center mb-8 md:mb-16 px-6">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="uppercase text-brand-blue text-xs font-body mb-4 block font-semibold tracking-wider"
        >
          Circuits Signature
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading text-4xl md:text-6xl text-slate-900 dark:text-white mb-4 font-medium tracking-wide"
        >
          Nos Voyages d&apos;Exception
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-600 dark:text-brand-silver text-base md:text-lg max-w-xl mx-auto"
        >
          Des expériences triées sur le volet, conçues pour les voyageurs exigeants.
        </motion.p>
      </div>

      {/* Phones: one swipe row, the next card peeking. From tablets up: a grid. */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        onTouchStart={holdAuto}
        onTouchEnd={releaseAuto}
        onTouchCancel={releaseAuto}
        role="group"
        aria-label="Nos circuits signature"
        className={`hide-scrollbar relative flex snap-x snap-mandatory scroll-pl-4 gap-4 overflow-x-auto overscroll-x-contain px-4 pb-2 md:mx-auto md:grid md:snap-none md:gap-6 md:overflow-visible md:px-6 md:pb-0 ${layoutFor(count)}`}
      >
        {tours.map((tour) => (
          <div key={tour.id} className="w-[84%] max-w-[340px] shrink-0 snap-start snap-always md:w-auto md:max-w-none">
            <TourCard
              title={tour.title}
              slug={tour.slug}
              excerpt={tour.excerpt}
              shortDescription={tour.shortDescription}
              scope={tour.scope}
              duration={tour.duration}
              thumbnail={typeof tour.thumbnail === 'object' && tour.thumbnail ? tour.thumbnail : null}
              pricing={tour.pricing}
              logistics={tour.logistics}
              // The heading already says "Circuits Signature": a badge on every card would add nothing
              isFeatured={false}
              departureDate={tour.departureDate}
              returnDate={tour.returnDate}
              departureDates={tour.departureDates}
              seasons={tour.seasons}
              tourStatus={tour.tourStatus}
            />
          </div>
        ))}
      </div>

      {count > 1 ? (
        <div className="mt-4 flex items-center gap-3 px-4 md:hidden">
          <style dangerouslySetInnerHTML={{ __html: '@keyframes ccv-tour-fill{from{transform:scaleX(0)}to{transform:scaleX(1)}}' }} />
          <span className="shrink-0 text-xs font-medium tabular-nums text-slate-500 dark:text-white/60">
            {active + 1} / {count}
          </span>
          {/* One segment per tour: the current one fills until the row moves on */}
          <div aria-hidden="true" className="flex flex-1 gap-1.5">
            {tours.map((tour, i) => (
              <span key={tour.id} className="relative h-1 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                {i < active ? <span className="absolute inset-0 bg-brand-blue" /> : null}
                {i === active ? (
                  <span
                    key={`${active}-${autoplay}`}
                    className="absolute inset-0 origin-left bg-brand-blue"
                    style={autoplay ? { animation: `ccv-tour-fill ${AUTO_MS}ms linear forwards` } : undefined}
                  />
                ) : null}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}
