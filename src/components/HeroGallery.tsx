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
const TEXT_SHADE = 'absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-brand-deeper/85 via-brand-deeper/35 to-transparent pointer-events-none'

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
    <div className="relative w-full">
      {/* The page's only H1: one element shared by both layouts */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 bg-gradient-to-b from-brand-deeper/55 to-transparent px-4 pb-16 pt-[92px] lg:pt-[108px]">
        <h1 className="mx-auto max-w-3xl text-center font-heading text-[1.375rem] font-medium leading-snug tracking-tight text-white [text-shadow:0_1px_14px_rgba(0,0,0,0.45)] [text-wrap:balance] lg:text-3xl">
          {headline}
        </h1>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          DESKTOP — expanding panels (lg+). Only the open panel plays its video.
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative z-0 hidden h-[100svh] w-full flex-row overflow-hidden bg-brand-dark lg:flex"
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
              className={`relative h-full cursor-pointer overflow-hidden border-r border-white/15 transition-all duration-700 ease-luxury last:border-r-0 ${
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
                  <Image src={dest.poster} alt="" fill priority={index === 0} sizes={POSTER_SIZES} className="object-cover" />
                ) : null}
                <LazyVideo className="absolute inset-0 h-full w-full object-cover" src={dest.video} active={isActive} priority={isActive} />
              </motion.div>

              <div className={TEXT_SHADE} />

              {/* Closed panel: name reads vertically */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 z-20 flex items-center justify-center transition-all duration-500 ${
                  isActive ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
                }`}
              >
                <span
                  className="whitespace-nowrap font-heading text-2xl font-semibold tracking-widest text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.55)]"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                  {dest.title}
                </span>
              </div>

              {/* Open panel */}
              <div
                className={`pointer-events-none absolute inset-0 z-30 flex flex-col items-start justify-end p-10 pb-14 transition-all duration-700 ${
                  isActive ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
              >
                {dest.subtitle ? (
                  <p className="text-base font-medium text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]">{dest.subtitle}</p>
                ) : null}
                <h2 className="mt-1 max-w-[14ch] font-heading text-[clamp(2.75rem,5vw,5.5rem)] font-medium leading-[1.03] tracking-tight text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.4)] [text-wrap:balance]">
                  {dest.title}
                </h2>
                {/* The link covers the whole open panel */}
                <Link
                  href={dest.link}
                  className={`group mt-6 rounded-full after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-4 focus-visible:after:ring-inset focus-visible:after:ring-brand-cyan/70 ${
                    isActive ? 'pointer-events-auto' : ''
                  }`}
                >
                  <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-dark shadow-lg transition-transform duration-200 group-hover:-translate-y-0.5">
                    {discoverLabel} {dest.title}
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
      <div className="relative lg:hidden">
        <section
          ref={mobileRef}
          className="hide-scrollbar relative z-0 flex h-[100svh] w-full snap-x snap-mandatory flex-row overflow-x-auto overscroll-x-contain bg-brand-dark"
        >
          {destinations.map((dest, index) => (
            <div key={index} className="relative h-full w-full min-w-full flex-shrink-0 snap-center snap-always overflow-hidden">
              {dest.poster ? (
                <Image src={dest.poster} alt="" fill priority={index === 0} sizes={POSTER_SIZES} className="object-cover" />
              ) : null}
              <LazyVideo
                className="absolute inset-0 z-0 h-full w-full object-cover"
                src={isPhone && dest.videoMobile ? dest.videoMobile : dest.video}
                active={index === activeIndex}
                priority={index === activeIndex}
              />

              <div className={TEXT_SHADE} />

              <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-start justify-end px-5 pb-[max(env(safe-area-inset-bottom,0px),3.75rem)]">
                {dest.subtitle ? (
                  <p className="text-[15px] font-medium text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]">{dest.subtitle}</p>
                ) : null}
                <h2 className="mt-1 font-heading text-[clamp(2.5rem,12vw,4rem)] font-medium leading-[1.05] tracking-tight text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.4)] [text-wrap:balance]">
                  {dest.title}
                </h2>
                <Link href={dest.link} className="pointer-events-auto mt-4 rounded-full active:scale-[0.97] transition-transform duration-100">
                  <span className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-dark shadow-lg">
                    {discoverLabel} {dest.title}
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
    </div>
  )
}
