'use client'

import React, { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

/* ── helpers ──────────────────────────────────────────────────── */

function resolveMediaUrl(media: any): string | undefined {
  if (!media) return undefined
  if (typeof media === 'object') {
    if (media.url) return media.url
    if (media.filename) return `/media/${media.filename}`
  }
  return undefined
}

function resolvePanelLink(panel: any): string {
  if (panel.linkType === 'destination' && panel.destination) {
    const slug =
      typeof panel.destination === 'object'
        ? panel.destination.slug
        : panel.destination
    if (slug) return `/destinations/${slug}`
  }
  if (panel.linkType === 'tour' && panel.tour) {
    const slug =
      typeof panel.tour === 'object' ? panel.tour.slug : panel.tour
    if (slug) return `/tours/${slug}`
  }
  return '/'
}

/* ── component ─────────────────────────────────────────────────── */

interface CinematicPanelProps {
  panel: any
  index: number
  isActive: boolean
  onActivate: () => void
  paginationSlot?: React.ReactNode
}

export default function CinematicPanel({
  panel,
  index,
  isActive,
  onActivate,
  paginationSlot,
}: CinematicPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  /* DOF scroll effect */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const blur = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['blur(0px)', 'blur(0px)', 'blur(8px)']
  )

  /* Video lifecycle: play when active, pause when inactive */
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isActive) {
      video.load()
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          /* Autoplay blocked — silent fail, poster remains visible */
        })
      }
    } else {
      video.pause()
    }
  }, [isActive])

  const posterUrl = resolveMediaUrl(panel.posterImage)
  const videoUrl = resolveMediaUrl(panel.backgroundVideo)
  const link = resolvePanelLink(panel)

  return (
    <div
      ref={containerRef}
      className="group relative h-full overflow-hidden cursor-pointer"
      onMouseEnter={onActivate}
      onTouchStart={onActivate}
    >
      {/* ══════════════════════════════════════════════════════════
          MEDIA STACK — Poster + Video with DOF scroll effect
      ══════════════════════════════════════════════════════════ */}
      <motion.div
        style={{ scale, filter: blur }}
        className="absolute inset-0 z-0"
      >
        {/* Poster image (visible before/while video loads) */}
        {posterUrl && (
          <Image
            src={posterUrl}
            alt={panel.title || 'Hero panel'}
            fill
            priority={index === 0}
            loading={index === 0 ? 'eager' : 'lazy'}
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 25vw"
          />
        )}

        {/* Video overlay */}
        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            preload={isActive ? 'auto' : 'none'}
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
          MASKING DIV — mix-blend-overlay at 40% opacity
      ══════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 bg-[#0B132B]/40 mix-blend-overlay z-10 pointer-events-none" />

      {/* ══════════════════════════════════════════════════════════
          GRADIENT OVERLAY — strict vignette spec
      ══════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/90 via-[#0B132B]/30 to-transparent z-10 pointer-events-none" />

      {/* ══════════════════════════════════════════════════════════
          CONTENT — Glassmorphism card + CTA
      ══════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-8 lg:pb-16 pointer-events-none">
        <div className="w-[88%] max-w-sm px-6 py-6 lg:p-8 rounded-[1.75rem] lg:rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col items-center text-center gap-1 transition-all duration-500 pointer-events-auto">
          {panel.subtitle && (
            <span className="uppercase tracking-widest text-brand-blue font-semibold text-[10px] lg:text-xs drop-shadow-sm">
              {panel.subtitle}
            </span>
          )}
          <h2 className="text-3xl lg:text-6xl font-serif text-white tracking-tighter leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            {panel.title}
          </h2>
          <div className="w-10 h-px bg-white/40 my-2 lg:my-4" />
          {paginationSlot}
          <Link
            href={link}
            className="px-8 py-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-md text-white font-medium transition-all duration-300 shadow-[0_0_20px_rgba(56,163,165,0.2)] hover:shadow-[0_0_30px_rgba(56,163,165,0.4)] flex items-center gap-2 text-sm"
          >
            Explorer
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
