'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import CinematicPanel from './CinematicPanel'

interface HeroGalleryProps {
  panels?: any[]
}

export default function HeroGallery({ panels = [] }: HeroGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const mobileRef = useRef<HTMLDivElement>(null)

  /* ── activation handlers ─────────────────────────────────────── */
  const activate = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  const resetToFirst = useCallback(() => {
    setActiveIndex(0)
  }, [])

  /* ── mobile scroll tracking (snap scroll → activeIndex) ─────── */
  useEffect(() => {
    const container = mobileRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const panelWidth = container.offsetWidth
      const newIndex = Math.round(scrollLeft / panelWidth)
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < panels.length) {
        setActiveIndex(newIndex)
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [activeIndex, panels.length])

  /* ── guard: no panels ──────────────────────────────────────── */
  if (panels.length === 0) {
    return (
      <section className="relative w-full h-screen bg-brand-dark flex items-center justify-center">
        <p className="text-white/40 font-serif text-xl">Hero Gallery — configurez les 4 panneaux dans l&apos;admin</p>
      </section>
    )
  }

  /* ═══════════════════════════════════════════════════════════════
      DESKTOP — 4-column expanding panel grid (lg+)
  ═══════════════════════════════════════════════════════════════ */
  return (
    <>
      <section
        className="hidden lg:flex flex-row w-full h-screen overflow-hidden bg-black shrink-0 relative z-0"
        onMouseLeave={resetToFirst}
      >
        {panels.map((panel, index) => {
          const isExpanded = activeIndex === index

          return (
            <div
              key={index}
              onMouseEnter={() => activate(index)}
              className={`relative h-full transition-all duration-700 ease-in-out cursor-pointer overflow-hidden border-r border-white/5 last:border-r-0 ${
                isExpanded ? 'flex-[3]' : 'flex-[1]'
              }`}
            >
              <CinematicPanel
                panel={panel}
                index={index}
                isActive={isExpanded}
                onActivate={() => activate(index)}
              />

              {/* Collapsed: Vertical destination label (desktop only) */}
              <div
                className={`absolute inset-0 z-20 flex items-center justify-center transition-all duration-500 pointer-events-none ${
                  isExpanded ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                <span
                  className="text-white/80 tracking-widest uppercase font-serif drop-shadow-md text-xl"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                  {panel.title}
                </span>
              </div>
            </div>
          )
        })}
      </section>

      {/* ══════════════════════════════════════════════════════════
          MOBILE — Horizontal full-screen swipe catalog (max-lg)
      ══════════════════════════════════════════════════════════ */}
      <section
        ref={mobileRef}
        className="lg:hidden flex flex-row overflow-x-auto overflow-y-hidden snap-x snap-mandatory w-full h-[100dvh] hide-scrollbar shrink-0 bg-black relative z-0"
      >
        {panels.map((panel, index) => (
          <div
            key={index}
            className="relative w-full min-w-full h-full flex-shrink-0 snap-center overflow-hidden"
          >
            <CinematicPanel
              panel={panel}
              index={index}
              isActive={activeIndex === index}
              onActivate={() => activate(index)}
            />
          </div>
        ))}

        {/* Luxury Dash Pagination */}
        <div className="absolute bottom-28 left-0 right-0 z-40 flex justify-center gap-2">
          {panels.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setActiveIndex(index)
                const container = mobileRef.current
                if (container) {
                  container.scrollTo({
                    left: index * container.offsetWidth,
                    behavior: 'smooth',
                  })
                }
              }}
              aria-label={`Slide ${index + 1}`}
              className={`h-[2px] rounded-full transition-all duration-500 ease-out ${
                index === activeIndex ? 'w-8 bg-white' : 'w-4 bg-white/30'
              }`}
            />
          ))}
        </div>
      </section>
    </>
  )
}
