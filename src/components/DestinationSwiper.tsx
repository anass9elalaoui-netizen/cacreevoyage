'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

interface Destination {
  id: string | number
  title: string
  slug: string
  headerMedia?: { url?: string; mimeType?: string } | null
  theme?: string
}

function DestinationCard({ dest, index }: { dest: Destination; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.03, 1.05])
  const blur = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    ['blur(0px)', 'blur(0px)', 'blur(4px)', 'blur(6px)'],
  )

  let headerUrl =
    typeof dest.headerMedia === 'object' && dest.headerMedia?.url
      ? dest.headerMedia.url
      : null
  let isVideo =
    typeof dest.headerMedia === 'object' &&
    dest.headerMedia?.mimeType?.startsWith('video')

  // Cinematic Video Fallback for Egypt
  if (!headerUrl && (dest.slug === 'egypte' || dest.title.toLowerCase().includes('égypte') || dest.title.toLowerCase().includes('egypt'))) {
    headerUrl = '/egypte-cinematic.mp4'
    isVideo = true
  }

  const themeLabel: Record<string, string> = {
    ocean: 'Océan',
    desert: 'Désert',
    mountain: 'Montagne',
    culture: 'Culture',
    forest_nature: 'Forêt & Nature',
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
      className="relative flex-shrink-0 w-[280px] md:w-[340px] h-[420px] md:h-[480px] rounded-[2rem] overflow-hidden snap-center cursor-pointer group"
    >
      {/* Background Media with DOF */}
      <div className="absolute inset-0 overflow-hidden z-0 bg-slate-200 dark:bg-[#0B132B]">
        {headerUrl && isVideo ? (
          <motion.video
            src={headerUrl}
            autoPlay
            loop
            muted
            playsInline
            style={{ scale, filter: blur }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : headerUrl ? (
          <motion.div style={{ scale, filter: blur }} className="absolute inset-0">
            <Image
              src={headerUrl}
              alt={dest.title || 'Destination'}
              fill
              className="object-cover z-0"
              sizes="340px"
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 liquid-glass animate-pulse flex items-center justify-center">
            <span className="text-slate-400 dark:text-white/30 font-serif italic text-sm">Visuel en préparation...</span>
          </div>
        )}
      </div>

      {/* Strict Vignette Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/40 dark:from-[#0B132B]/90 dark:via-[#0B132B]/30 to-transparent z-10 pointer-events-none" suppressHydrationWarning />

      {/* Ambient Glow behind card */}
      <div className="absolute -inset-2 bg-brand-blue/5 rounded-[2.5rem] blur-[40px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Glassmorphism Title Container */}
      <div className="absolute bottom-5 left-5 right-5 z-20">
        <div className="bg-white/70 dark:bg-[#0B132B]/60 backdrop-blur-xl border border-white/60 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-none rounded-2xl px-5 py-4">
          {dest.theme && (
            <span className="text-brand-blue text-[10px] uppercase tracking-[0.2em] font-semibold mb-1 block">
              {themeLabel[dest.theme] || dest.theme}
            </span>
          )}
          <h3 className="text-xl md:text-2xl font-serif text-slate-900 dark:text-white leading-tight">
            {dest.title}
          </h3>
        </div>
      </div>

      {/* Clickable overlay */}
      <Link
        href={`/destinations/${dest.slug}`}
        className="absolute inset-0 z-30"
        aria-label={`Découvrir ${dest.title}`}
      />
    </motion.div>
  )
}

export default function DestinationSwiper({
  destinations,
  title,
  subtitle,
}: {
  destinations: Destination[]
  title: string
  subtitle?: string
}) {
  if (!destinations || destinations.length === 0) return null

  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = dir === 'left' ? -380 : 380
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <section className="relative w-full py-20 md:py-28 overflow-hidden">
      {/* Section Header */}
      <div className="px-4 md:px-12 lg:px-20 mb-10 md:mb-14 flex items-end justify-between">
        <div>
          <span className="uppercase tracking-[0.2em] text-brand-blue font-semibold text-xs mb-3 block">
            {subtitle || 'Destinations'}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow-none tracking-tighter leading-none">
            {title}
          </h2>
        </div>

        {/* Navigation Arrows */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => scroll('left')}
            className="w-12 h-12 rounded-full border border-slate-200 dark:border-white/20 bg-white/50 dark:bg-white/5 backdrop-blur-md flex items-center justify-center text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all hover:scale-105"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-12 h-12 rounded-full border border-slate-200 dark:border-white/20 bg-white/50 dark:bg-white/5 backdrop-blur-md flex items-center justify-center text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all hover:scale-105"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-5 md:gap-6 pb-4 px-4 md:px-12 lg:px-20 hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {destinations.map((dest, index) => (
          <DestinationCard key={dest.id} dest={dest} index={index} />
        ))}
      </div>
    </section>
  )
}
