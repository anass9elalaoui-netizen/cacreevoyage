'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

const destinations = [
  { id: 1, title: 'Maroc', subtitle: 'Aux Portes du Désert', video: '/maroc imssfrane.mp4', link: '/destinations/maroc' },
  { id: 2, title: 'Philippines', subtitle: 'Archipel Paradisiaque', video: '/philippines.MOV', link: '/destinations/philippines' },
  { id: 3, title: 'Tanzanie', subtitle: 'Safari Sauvage', video: '/tanzanie zanzibar safari.mp4', link: '/destinations/tanzanie' },
  { id: 4, title: 'Turquie', subtitle: 'Au Carrefour des Mondes', video: '/turkey.MOV', link: '/destinations/turquie' },
]

function ArrowRight() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  )
}

function DOFBackground({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const blur = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['blur(0px)', 'blur(0px)', 'blur(8px)'],
  )

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden z-0">
      <motion.video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        style={{ scale, filter: blur }}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  )
}

export default function HeroGallery() {
  const [hoveredId, setHoveredId] = useState<number>(1)

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          DESKTOP — 4-column expanding panel grid (lg+)
      ══════════════════════════════════════════════════════════ */}
      <section
        className="hidden lg:flex flex-row w-full h-screen overflow-hidden bg-black shrink-0 relative z-0"
        onMouseLeave={() => setHoveredId(1)}
      >
        {destinations.map((dest) => {
          const isExpanded = hoveredId === dest.id

          return (
            <div
              key={dest.id}
              onMouseEnter={() => setHoveredId(dest.id)}
              className={`group relative h-full transition-all duration-700 ease-in-out cursor-pointer overflow-hidden border-r border-white/5 last:border-r-0 ${
                isExpanded ? 'flex-[3]' : 'flex-[1]'
              }`}
            >
              <DOFBackground src={dest.video} />

              {/* Gradient Overlay — strict vignette spec */}
              <div
                className={`absolute inset-0 z-10 transition-opacity duration-700 bg-gradient-to-t from-[#0B132B]/90 via-[#0B132B]/30 to-transparent pointer-events-none ${
                  isExpanded ? 'opacity-100' : 'opacity-60'
                }`}
              />

              {/* Collapsed: Vertical destination label */}
              <div
                className={`absolute inset-0 z-20 flex items-center justify-center transition-all duration-500 pointer-events-none ${
                  isExpanded ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                <span
                  className="text-white/80 tracking-widest uppercase font-serif drop-shadow-md text-xl"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                  {dest.title}
                </span>
              </div>

              {/* Expanded: Glassmorphism card + CTA */}
              <div
                className={`absolute bottom-12 lg:bottom-16 left-1/2 -translate-x-1/2 w-[90%] max-w-sm p-8 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col items-center text-center z-30 transition-all duration-500 ${
                  isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
                }`}
              >
                <span className="uppercase tracking-widest text-brand-blue font-semibold text-xs mb-2 drop-shadow-sm">
                  {dest.subtitle}
                </span>
                <h2 className="text-5xl lg:text-6xl font-serif text-white tracking-tighter leading-none mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                  {dest.title}
                </h2>
                <div className="w-10 h-px bg-white/40 my-4" />
                <Link
                  href={dest.link}
                  className="mt-2 px-8 py-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-md text-white font-medium transition-all duration-300 shadow-[0_0_20px_rgba(56,163,165,0.2)] hover:shadow-[0_0_30px_rgba(56,163,165,0.4)] flex items-center gap-2 text-sm"
                >
                  Explorer <ArrowRight />
                </Link>
              </div>
            </div>
          )
        })}
      </section>

      {/* ══════════════════════════════════════════════════════════
          MOBILE — Horizontal full-screen swipe catalog (max-lg)
      ══════════════════════════════════════════════════════════ */}
      <section className="lg:hidden flex flex-row overflow-x-auto overflow-y-hidden snap-x snap-mandatory w-full h-[100dvh] hide-scrollbar shrink-0 bg-black relative z-0">
        {destinations.map((dest) => (
          <div
            key={dest.id}
            className="relative w-full min-w-full h-full flex-shrink-0 snap-center overflow-hidden"
          >
            <DOFBackground src={dest.video} />

            {/* Gradient Overlay — strict vignette spec */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/90 via-[#0B132B]/30 to-transparent z-10 pointer-events-none" />

            {/* Glassmorphism card — always visible on mobile */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] max-w-sm p-8 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col items-center text-center z-20">
              <span className="uppercase tracking-widest text-brand-blue font-semibold text-xs mb-2 drop-shadow-sm">
                {dest.subtitle}
              </span>
              <h2 className="text-5xl font-serif text-white tracking-tighter leading-none mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                {dest.title}
              </h2>
              <div className="w-10 h-px bg-white/40 my-4" />
              <Link
                href={dest.link}
                className="mt-2 px-8 py-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-md text-white font-medium transition-all duration-300 shadow-[0_0_20px_rgba(56,163,165,0.2)] hover:shadow-[0_0_30px_rgba(56,163,165,0.4)] flex items-center gap-2 text-sm"
              >
                Explorer <ArrowRight />
              </Link>
            </div>

            {/* Swipe Dots Indicator */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {destinations.map((d) => (
                <div
                  key={d.id}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    d.id === dest.id ? 'w-6 bg-white' : 'w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  )
}
