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
  allToursLabel,
}: {
  panels?: HeroPanel[]
  /** The page's H1, from Site Settings */
  headline: string
  discoverLabel: string
  allToursLabel: string
}) {
  const destinations = panels && panels.length > 0 ? panels : FALLBACK_PANELS
  const [activeIndex, setActiveIndex] = useState(0)
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
    <div className="flex h-[100svh] w-full flex-col">
      {/* ═══════════════════════════════════════════════════════════════
          DESKTOP — expanding panels (lg+). Only the open panel plays its video.
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative z-0 hidden min-h-0 w-full flex-1 flex-row overflow-hidden bg-brand-dark lg:flex"
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
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 z-20 flex items-end justify-start p-6 pb-10 transition-opacity duration-200 ease-out ${
                  isActive ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <span
                  className="font-[family-name:var(--font-display)] rotate-180 whitespace-nowrap text-2xl font-medium text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]"
                  style={{ writingMode: 'vertical-rl' }}
                >
                  {dest.title}
                </span>
              </div>

              {/* Open panel */}
              <div
                className={`pointer-events-none absolute inset-0 z-30 flex flex-col items-start justify-end p-10 pb-14 transition-[opacity,transform] ${
                  isActive ? 'translate-y-0 opacity-100 delay-200 duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]' : 'translate-y-3 opacity-0 duration-150 ease-out'
                }`}
              >
                {dest.subtitle ? (
                  <p className="text-base font-medium text-white/95 [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]">{dest.subtitle}</p>
                ) : null}
                <h2 className="mt-2 max-w-[14ch] font-[family-name:var(--font-display)] text-[clamp(2.75rem,4.8vw,5rem)] font-semibold leading-none text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.45)] [text-wrap:balance]">
                  {dest.title}
                </h2>
                {/* The link covers the whole open panel */}
                <Link
                  href={dest.link}
                  aria-label={`${discoverLabel} : ${dest.title}`}
                  className={`group mt-6 rounded-full after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-4 focus-visible:after:ring-inset focus-visible:after:ring-brand-cyan/70 ${
                    isActive ? 'pointer-events-auto' : ''
                  }`}
                >
                  <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-dark shadow-lg transition-transform duration-150 ease-out group-hover:-translate-y-0.5 group-active:scale-[0.97]">
                    {discoverLabel}
                    <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  </span>
                </Link>
              </div>
            </div>
          )
        })}
      </section>

      {/* ══════════════════════════════════════════════════════════
          PHONES & TABLETS — full-screen swipe (lighter video rendition)
      ══════════════════════════════════════════════════════════ */}
      <div className="relative min-h-0 flex-1 lg:hidden">
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

              <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-start justify-end px-5 pb-[max(env(safe-area-inset-bottom,0px),3.75rem)]">
                {dest.subtitle ? (
                  <p className="text-[15px] font-medium text-white/95 [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]">{dest.subtitle}</p>
                ) : null}
                <h2 className="mt-1.5 font-[family-name:var(--font-display)] text-[clamp(2.5rem,12vw,4rem)] font-semibold leading-none text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.45)] [text-wrap:balance]">
                  {dest.title}
                </h2>
                <Link href={dest.link} aria-label={`${discoverLabel} : ${dest.title}`} className="pointer-events-auto mt-4 rounded-full active:scale-[0.97] transition-transform duration-100">
                  <span className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-dark shadow-lg">
                    {discoverLabel}
                    <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  </span>
                </Link>
              </div>
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

      {/* The page's only H1: on a calm surface under the video, so it is always readable */}
      <div className="flex shrink-0 items-center justify-between gap-6 bg-white px-5 pb-[max(env(safe-area-inset-bottom,0px),1rem)] pt-4 pr-24 dark:bg-brand-dark lg:px-10 lg:py-5 lg:pr-28">
        <h1 className="font-[family-name:var(--font-display)] text-xl font-medium leading-snug text-slate-900 [text-wrap:balance] dark:text-white lg:text-[1.75rem]">
          {headline}
        </h1>
        <Link href="/tours" className="group hidden shrink-0 items-center gap-2 text-sm font-semibold text-brand-blue md:inline-flex">
          {allToursLabel}
          <ArrowRight className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5" strokeWidth={2} aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
