'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  PanInfo,
} from 'framer-motion'

/* ─── Types ──────────────────────────────────────────────── */
interface StoryDay {
  dayNumber: number
  title: string
  location: string
  activities: { activity: string; id?: string }[]
  media?: { url?: string; mimeType?: string } | null
}

/* ─── Focus Pull Card ────────────────────────────────────── */
function StoryCard({
  day,
  index,
  activeIndex,
}: {
  day: StoryDay
  index: number
  activeIndex: number
}) {
  const isActive = index === activeIndex
  const offset = Math.abs(index - activeIndex)

  const mediaUrl = typeof day.media === 'object' && day.media?.url ? day.media.url : null
  const isVideo = typeof day.media === 'object' && day.media?.mimeType?.startsWith('video')

  return (
    <motion.div
      className="relative flex-shrink-0 h-[72vh] min-h-[500px] max-h-[680px] aspect-[9/16] mx-auto overflow-hidden rounded-3xl"
      animate={{
        scale: isActive ? 1 : Math.max(0.8, 1 - offset * 0.1),
        opacity: isActive ? 1 : Math.max(0.3, 1 - offset * 0.35),
        filter: isActive ? 'blur(0px)' : `blur(${Math.min(offset * 4, 8)}px)`,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }}
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
          className="object-cover z-0"
          sizes="(max-width: 768px) 85vw, 400px"
        />
      ) : (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B132B] via-[#162040] to-[#0B132B]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-brand-blue/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[150px] h-[150px] bg-brand-blue/5 rounded-full blur-[80px]" />
        </div>
      )}

      {/* ── Cinematic Overlay ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/55 to-transparent z-10" />

      {/* ── Day Badge — drops from top ── */}
      <motion.div
        className="absolute top-6 left-6 z-20"
        animate={isActive ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 250, damping: 22, delay: isActive ? 0.1 : 0 }}
      >
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs font-semibold uppercase drop-shadow-lg tracking-wider">
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
          Jour {String(day.dayNumber).padStart(2, '0')}
        </span>
      </motion.div>

      {/* ── Content Block ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-8 flex flex-col gap-3">
        {/* Title — slides from left */}
        <motion.h3
          className="text-xl md:text-2xl font-semibold font-heading text-white leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] tracking-tight"
          style={{ textShadow: '0 0 40px rgba(56,163,165,0.12)' }}
          animate={isActive ? { x: 0, opacity: 1 } : { x: -30, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: isActive ? 0.15 : 0 }}
        >
          {day.title}
        </motion.h3>

        {/* Location */}
        <motion.div
          className="flex items-center gap-2 text-brand-blue"
          animate={isActive ? { x: 0, opacity: 1 } : { x: -30, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: isActive ? 0.25 : 0 }}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <span className="text-xs md:text-sm font-medium tracking-wide">{day.location}</span>
        </motion.div>

        {/* Activities — staggered from bottom */}
        <div className="flex flex-col gap-1.5 mt-2">
          {day.activities.map((act, actIdx) => (
            <motion.div
              key={act.id || actIdx}
              className="flex items-start gap-2.5"
              animate={isActive ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 180,
                damping: 18,
                delay: isActive ? 0.35 + actIdx * 0.1 : 0,
              }}
            >
              <span className="w-1.5 h-1.5 mt-2 rounded-full bg-brand-blue/60 flex-shrink-0" />
              <span className="text-white/70 text-sm font-light leading-relaxed">{act.activity}</span>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <motion.div
          className="mt-3 pt-3 border-t border-white/10"
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: isActive ? 0.5 : 0, duration: 0.3 }}
        >
          <span className="text-white/30 text-[10px] uppercase font-semibold tracking-wider">
            {day.activities.length} activité{day.activities.length > 1 ? 's' : ''}
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}

function VerticalStoryCard({ day, index }: { day: StoryDay, index: number }) {
  const mediaUrl = typeof day.media === 'object' && day.media?.url ? day.media.url : null
  const isVideo = typeof day.media === 'object' && day.media?.mimeType?.startsWith('video')

  return (
    <div className="relative h-[72vh] min-h-[500px] max-h-[680px] aspect-[9/16] mx-auto overflow-hidden rounded-3xl group">
      {/* ── Background Media ── */}
      {mediaUrl && isVideo ? (
        <video src={mediaUrl} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0" />
      ) : mediaUrl ? (
        <Image src={mediaUrl} alt={day.title} fill className="object-cover z-0" />
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0B132B] via-[#162040] to-[#0B132B]" />
      )}

      {/* ── Cinematic Overlay ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/55 to-transparent z-10" />

      {/* ── Day Badge ── */}
      <div className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs font-semibold uppercase drop-shadow-lg tracking-wider">
        Jour {String(day.dayNumber).padStart(2, '0')}
      </div>

      {/* ── Content Block ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-8 flex flex-col gap-3">
        <h3 className="text-xl md:text-2xl font-semibold font-heading text-white leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] tracking-tight">
          {day.title}
        </h3>
        <div className="flex items-center gap-2 text-brand-blue">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <span className="text-xs md:text-sm font-medium tracking-wide">{day.location}</span>
        </div>
        <div className="flex flex-col gap-1.5 mt-2">
          {day.activities.map((act, actIdx) => (
            <div key={act.id || actIdx} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 mt-2 rounded-full bg-brand-blue/60 flex-shrink-0" />
              <span className="text-white/70 text-sm font-light leading-relaxed">{act.activity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Main StoryCarousel Component ─────────────────────── */
export default function StoryCarousel({ itinerary }: { itinerary: StoryDay[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)

  if (!itinerary || itinerary.length === 0) return null

  const sorted = [...itinerary].sort((a, b) => a.dayNumber - b.dayNumber)
  const count = sorted.length

  if (count <= 5) {
    return (
      <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto px-4 md:px-12 lg:px-20">
        {sorted.map((day, index) => (
          <VerticalStoryCard key={day.dayNumber} day={day} index={index} />
        ))}
      </div>
    )
  }

  // Card width calculation based on 9:16 aspect ratio
  const getCardWidth = useCallback(() => {
    if (typeof window === 'undefined') return 340
    const h = Math.min(Math.max(window.innerHeight * 0.72, 500), 680)
    return h * (9 / 16)
  }, [])

  const getGap = useCallback(() => {
    if (typeof window === 'undefined') return 24
    return window.innerWidth >= 768 ? 24 : 20
  }, [])

  // Calculate drag constraints for justify-center track
  const getDragConstraints = useCallback(() => {
    if (typeof window === 'undefined') return { left: -2000, right: 0 }
    const step = getCardWidth() + getGap()
    const limit = ((count - 1) / 2) * step
    return { left: -limit, right: limit }
  }, [count, getCardWidth, getGap])

  // Snap to card on drag end
  const handleDragEnd = useCallback(
    (_: any, info: PanInfo) => {
      const cardW = getCardWidth()
      const gap = getGap()
      const step = cardW + gap
      const offset = info.offset.x
      const velocity = info.velocity.x

      let newIndex = activeIndex
      if (offset < -50 || velocity < -500) {
        newIndex = Math.min(activeIndex + 1, count - 1)
      } else if (offset > 50 || velocity > 500) {
        newIndex = Math.max(activeIndex - 1, 0)
      }

      setActiveIndex(newIndex)

      // Center the active card based on a justify-center track
      const centerIndex = (count - 1) / 2
      const targetX = (centerIndex - newIndex) * step

      animate(x, targetX, {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      })
    },
    [activeIndex, count, getCardWidth, getGap, x],
  )

  // Initial centering
  useEffect(() => {
    const timer = setTimeout(() => {
      const step = getCardWidth() + getGap()
      const centerIndex = (count - 1) / 2
      const targetX = (centerIndex - activeIndex) * step
      animate(x, targetX, { type: 'spring', stiffness: 200, damping: 25 })
    }, 100)
    return () => clearTimeout(timer)
  }, [getCardWidth, getGap, count, activeIndex, x])

  // Navigate via arrow buttons
  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, count - 1))
      setActiveIndex(clamped)
      const cardW = getCardWidth()
      const gap = getGap()
      const step = cardW + gap
      const centerIndex = (count - 1) / 2
      const targetX = (centerIndex - clamped) * step

      animate(x, targetX, {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      })
    },
    [count, getCardWidth, getGap, x],
  )

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goTo(activeIndex - 1)
      } else if (e.key === 'ArrowRight') {
        goTo(activeIndex + 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, goTo])


  return (
    <div className="relative w-full overflow-hidden mt-8 md:mt-12 pb-8">
      {/* ── Navigation Arrows ── */}
      <div className="hidden md:flex items-center justify-end gap-3 mb-6 px-4 md:px-12 lg:px-20">
        <button
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          className="w-12 h-12 rounded-full border border-slate-300 dark:border-white/20 bg-white/80 dark:bg-white/5 backdrop-blur-md flex items-center justify-center text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
          aria-label="Previous day"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => goTo(activeIndex + 1)}
          disabled={activeIndex === count - 1}
          className="w-12 h-12 rounded-full border border-slate-300 dark:border-white/20 bg-white/80 dark:bg-white/5 backdrop-blur-md flex items-center justify-center text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
          aria-label="Next day"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ── Drag Track ── */}
      <motion.div
        ref={containerRef}
        className="flex items-center justify-center gap-6 cursor-grab active:cursor-grabbing w-full min-h-[60vh]"
        style={{ x }}
        drag="x"
        dragConstraints={getDragConstraints()}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
        onDragEnd={handleDragEnd}
      >
        {sorted.map((day, index) => (
          <StoryCard key={day.dayNumber} day={day} index={index} activeIndex={activeIndex} />
        ))}
      </motion.div>

      {/* ── Animated Pagination Indicator ── */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {sorted.map((day, index) => (
          <button
            key={day.dayNumber}
            onClick={() => goTo(index)}
            className="relative p-1"
            aria-label={`Go to Day ${day.dayNumber}`}
          >
            <div className="relative w-3 h-3 flex items-center justify-center">
              <div className={`rounded-full transition-all duration-300 ${index === activeIndex
                  ? 'w-8 h-2 bg-brand-blue shadow-[0_0_12px_rgba(56,163,165,0.6)]'
                  : 'w-2 h-2 bg-slate-400 dark:bg-white/20 hover:bg-slate-500 dark:hover:bg-white/40'
                }`} />
              {index === activeIndex && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(56,163,165,0.4) 0%, transparent 70%)',
                    width: '32px',
                    height: '32px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
