'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

/* ─── Types ──────────────────────────────────────────────── */
interface StoryDay {
  dayNumber: number
  title: string
  location: string
  activities: { activity: string; id?: string }[]
  media?: { url?: string; mimeType?: string } | null
}

/* ─── Stagger Timing ─────────────────────────────────────── */
const badgeVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

const titleVariants = {
  hidden: { x: -30, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut', delay: 0.15 } },
}

const locationVariants = {
  hidden: { x: -30, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut', delay: 0.25 } },
}

/* ─── Single Story Card ──────────────────────────────────── */
function StoryCard({ day, index }: { day: StoryDay; index: number }) {
  const mediaUrl = typeof day.media === 'object' && day.media?.url ? day.media.url : null
  const isVideo = typeof day.media === 'object' && day.media?.mimeType?.startsWith('video')

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ amount: 0.5 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative flex-shrink-0 h-[72vh] min-h-[500px] max-h-[680px] aspect-[9/16] mx-auto overflow-hidden rounded-3xl snap-center group"
    >
      {/* ── Background Media ── */}
      {mediaUrl && isVideo ? (
        <video
          src={mediaUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      ) : mediaUrl ? (
        <Image
          src={mediaUrl}
          alt={day.title}
          fill
          className="object-cover z-0 transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 85vw, 350px"
        />
      ) : (
        /* Cinematic gradient fallback */
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B132B] via-[#162040] to-[#0B132B]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-brand-blue/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[150px] h-[150px] bg-brand-blue/5 rounded-full blur-[80px]" />
        </div>
      )}

      {/* ── Cinematic Overlay ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/60 to-transparent z-10" />

      {/* ── Day Badge — drops from top ── */}
      <motion.div
        variants={badgeVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.5 }}
        className="absolute top-6 left-6 z-20"
      >
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs font-semibold uppercase drop-shadow-lg tracking-wider">
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
          Jour {String(day.dayNumber).padStart(2, '0')}
        </span>
      </motion.div>

      {/* ── Content Block — bottom positioned ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-8 flex flex-col gap-3">
        {/* Title — slides from bottom */}
        <motion.h3
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.5 }}
          className="text-xl md:text-2xl font-semibold font-heading text-white leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] tracking-tight"
          style={{ textShadow: '0 0 40px rgba(56,163,165,0.12)' }}
        >
          {day.title}
        </motion.h3>

        {/* Location — slides from left with delay */}
        <motion.div
          variants={locationVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.5 }}
          className="flex items-center gap-2 text-brand-blue"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <span className="text-xs md:text-sm font-medium tracking-wide">{day.location}</span>
        </motion.div>

        {/* Activities — staggered slide from bottom */}
        <div className="flex flex-col gap-1.5 mt-2">
          {day.activities.map((act, actIdx) => (
            <motion.div
              key={act.id || actIdx}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ amount: 0.5 }}
              transition={{
                duration: 0.4,
                ease: 'easeOut',
                delay: 0.35 + actIdx * 0.08,
              }}
              className="flex items-start gap-2.5"
            >
              <span className="w-1.5 h-1.5 mt-2 rounded-full bg-brand-blue/60 flex-shrink-0" />
              <span className="text-white/70 text-sm font-light leading-relaxed">{act.activity}</span>
            </motion.div>
          ))}
        </div>

        {/* Glassmorphism bottom bar */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <span className="text-white/30 text-[10px] uppercase font-semibold tracking-wider">
            {day.activities.length} activité{day.activities.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Main StoryTimeline Component ─────────────────────── */
export default function StoryTimeline({ itinerary }: { itinerary: StoryDay[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  if (!itinerary || itinerary.length === 0) return null

  // Sort by dayNumber
  const sorted = [...itinerary].sort((a, b) => a.dayNumber - b.dayNumber)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const cardWidth = scrollRef.current.querySelector('div')?.offsetWidth || 350
    const amount = dir === 'left' ? -(cardWidth + 24) : cardWidth + 24
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <div className="relative w-full mt-8 md:mt-12 pb-8">
      {/* ── Navigation Arrows ── */}
      <div className="hidden md:flex items-center justify-end gap-3 mb-6 px-4 md:px-12 lg:px-20">
        <button
          onClick={() => scroll('left')}
          className="w-12 h-12 rounded-full border border-slate-300 dark:border-white/20 bg-white/80 dark:bg-white/5 backdrop-blur-md flex items-center justify-center text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
          aria-label="Previous day"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => scroll('right')}
          className="w-12 h-12 rounded-full border border-slate-300 dark:border-white/20 bg-white/80 dark:bg-white/5 backdrop-blur-md flex items-center justify-center text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
          aria-label="Next day"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ── Horizontal Scroll Track ── */}
      <div
        ref={scrollRef}
        className="flex items-center justify-center gap-6 pb-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full min-h-[60vh]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {sorted.map((day, index) => (
          <StoryCard key={day.dayNumber} day={day} index={index} />
        ))}
      </div>

      {/* ── Progress Dots (Mobile) ── */}
      <div className="flex md:hidden items-center justify-center gap-1.5 mt-4">
        {sorted.map((day) => (
          <div
            key={day.dayNumber}
            className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-white/20"
          />
        ))}
      </div>
    </div>
  )
}
