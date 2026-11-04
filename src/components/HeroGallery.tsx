'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import LazyVideo from '@/components/LazyVideo'

export interface HeroPanel {
  title: string
  subtitle?: string
  video: string
  /** Lighter rendition for phones and tablets; the main video is used when empty */
  videoMobile?: string
  poster?: string
  link: string
}

// Used until the "Hero Gallery" global is filled in the CMS
const FALLBACK_PANELS: HeroPanel[] = [
  { title: "Zanzibar", subtitle: "Éden Tropical", video: "/zanzibar video.MP4", poster: "/posters/hero-zanzibar.webp", link: "/destinations/zanzibar" },
  { title: "Vietnam", subtitle: "L'Asie Authentique", video: "/vitnam.mp4", poster: "/posters/hero-vietnam.webp", link: "/destinations/vietnam" },
  { title: "Tanzanie", subtitle: "Safari Sauvage", video: "/tanzanie zanzibar safari.mp4", poster: "/posters/hero-tanzanie.webp", link: "/destinations/zanzibar" },
  { title: "Merzouga", subtitle: "Magie du Désert", video: "/marzougua maroc.MP4", poster: "/posters/hero-merzouga.webp", link: "/destinations/national" },
]

/** Same value on both layouts, so the browser preloads a single image for the first poster. */
const POSTER_SIZES = '(max-width: 1023px) 100vw, 60vw'
/** Dark only behind the text: the footage stays bright. */
const TEXT_SHADE = 'absolute inset-x-0 bottom-0 z-10 h-[55%] bg-gradient-to-t from-brand-deeper/90 via-brand-deeper/40 to-transparent pointer-events-none'

/**
 * The video fades in over its own first frame once it is really playing, so the still image is never
 * seen as a separate "cover" and there is no black flash or jump.
 */
function HeroVideo({ src, active, className = '' }: { src: string; active: boolean; className?: string }) {
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    if (!active) setPlaying(false)
  }, [active])
  return (
    <LazyVideo
      src={src}
      active={active}
      priority={active}
      onPlaying={() => setPlaying(true)}
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-out ${playing ? 'opacity-100' : 'opacity-0'} ${className}`}
    />
  )
}

export default function HeroGallery({
  panels,
  headline,
  discoverLabel,
}: {
  panels?: HeroPanel[]
  /** The page's H1, from Site Settings */
  headline: string
  discoverLabel: string
}) {
  const destinations = panels && panels.length > 0 ? panels : FALLBACK_PANELS
  const [activeIndex, setActiveIndex] = useState(0)
  const current = destinations[activeIndex] ?? destinations[0]
  // Phones get the 480 px rendition; tablets use the swipe layout too, but are wide enough to need the 720 px one
  const [isPhone, setIsPhone] = useState(true)
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    const update = () => setIsPhone(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  // Mobile tracking
  const mobileRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const container = mobileRef.current
    if (!container) return
    const handleScroll = () => {
      const newIndex = Math.round(container.scrollLeft / container.offsetWidth)
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < destinations.length) {
        setActiveIndex(newIndex)
      }
    }
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [activeIndex, destinations.length])

  // Mouse tracking for parallax
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 150 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  const x = useTransform(springX, [-1, 1], ['-2%', '2%'])
  const y = useTransform(springY, [-1, 1], ['-2%', '2%'])

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window
    // Normalize -1 to 1
    mouseX.set((clientX / innerWidth) * 2 - 1)
    mouseY.set((clientY / innerHeight) * 2 - 1)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div className="relative h-[100svh] w-full overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════════
          DESKTOP — expanding panels (lg+). Only the open panel plays its video.
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative z-0 hidden h-full w-full flex-row overflow-hidden bg-brand-dark lg:flex"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {destinations.map((dest, index) => {
          const isActive = activeIndex === index
          return (
            <div
              key={index}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              className={`relative h-full cursor-pointer overflow-hidden border-r border-white/15 transition-[flex-grow] duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] last:border-r-0 ${
                isActive ? 'flex-[3]' : 'flex-[1]'
              }`}
            >
              {/* Parallax media */}
              <motion.div
                className="pointer-events-none absolute inset-[-4%] z-0 h-[108%] w-[108%]"
                style={{ x: isActive ? x : 0, y: isActive ? y : 0 }}
              >
                {/* The poster is the video's first frame, so the video starts without a visible jump */}
                {dest.poster ? (
                  <Image src={dest.poster} alt="" fill quality={90} priority={index === 0} sizes={POSTER_SIZES} className="object-cover" />
                ) : null}
                <HeroVideo src={dest.video} active={isActive} />
              </motion.div>

              <div className={TEXT_SHADE} />

              {/* Closed panel: name reads vertically */}
              <div
                className={`pointer-events-none absolute inset-0 z-20 flex items-end justify-start p-6 pb-10 transition-opacity duration-200 ease-out ${
                  isActive ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <h2
                  className="font-[family-name:var(--font-display)] rotate-180 whitespace-nowrap text-2xl font-medium text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]"
                  style={{ writingMode: 'vertical-rl' }}
                >
                  {dest.title}
                </h2>
              </div>

              {/* The whole panel opens the destination */}
              <Link
                href={dest.link}
                aria-label={`${discoverLabel} : ${dest.title}`}
                className="absolute inset-0 z-[25] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-brand-cyan/70"
              />
            </div>
          )
        })}
      </section>

      {/* ══════════════════════════════════════════════════════════
          PHONES & TABLETS — full-screen swipe (lighter video rendition)
      ══════════════════════════════════════════════════════════ */}
      <div className="relative h-full lg:hidden">
        <section
          ref={mobileRef}
          className="hide-scrollbar relative z-0 flex h-full w-full snap-x snap-mandatory flex-row overflow-x-auto overscroll-x-contain bg-brand-dark"
        >
          {destinations.map((dest, index) => (
            <div key={index} className="relative h-full w-full min-w-full flex-shrink-0 snap-center snap-always overflow-hidden">
              {dest.poster ? (
                <Image src={dest.poster} alt="" fill quality={90} priority={index === 0} sizes={POSTER_SIZES} className="object-cover" />
              ) : null}
              <HeroVideo className="z-0" src={isPhone && dest.videoMobile ? dest.videoMobile : dest.video} active={index === activeIndex} />

              <div className={TEXT_SHADE} />

              <h2 className="sr-only">{dest.title}</h2>
            </div>
          ))}
        </section>

        {/* Outside the scrolling row, so the markers stay visible on every panel */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-7 z-40 flex justify-center gap-2">
          {destinations.map((_, dotIndex) => (
            <div
              key={dotIndex}
              className={`h-[3px] rounded-full transition-all duration-500 ease-out ${dotIndex === activeIndex ? 'w-8 bg-white' : 'w-4 bg-white/45'}`}
            />
          ))}
        </div>
      </div>

      {/* One text block for the whole hero. It holds the page's only H1 and, on desktop,
          slides with the open panel using the same curve and duration. */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-30 flex w-full flex-col items-start px-5 pb-[max(env(safe-area-inset-bottom,0px),3.75rem)] transition-[left] duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] lg:left-[calc(var(--hero-active)*var(--hero-step))] lg:w-1/2 lg:p-10 lg:pb-12"
        style={{ '--hero-active': activeIndex, '--hero-step': `${100 / (destinations.length + 2)}%` } as React.CSSProperties}
      >
        <h1 className="text-sm font-medium text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.65)] lg:text-base">{headline}</h1>
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col items-start"
        >
          <p className="mt-1.5 font-[family-name:var(--font-display)] text-[clamp(2.75rem,13vw,4rem)] font-semibold leading-none text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.45)] [text-wrap:balance] lg:mt-2 lg:text-[clamp(3rem,5vw,5.25rem)]">
            {current.title}
          </p>
          {current.subtitle ? (
            <p className="mt-2 text-[15px] text-white/95 [text-shadow:0_1px_10px_rgba(0,0,0,0.65)] lg:mt-3 lg:text-lg">{current.subtitle}</p>
          ) : null}
          <Link
            href={current.link}
            aria-label={`${discoverLabel} : ${current.title}`}
            className="group pointer-events-auto mt-4 rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/70 lg:mt-5"
          >
            <span className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-dark shadow-lg transition-transform duration-150 ease-out group-hover:-translate-y-0.5 group-active:scale-[0.97]">
              {discoverLabel}
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
