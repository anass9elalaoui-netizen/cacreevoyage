'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Link from 'next/link'

const destinations = [
  { title: "Zanzibar", subtitle: "Éden Tropical", video: "/zanzibar video.MP4", link: "/destinations/zanzibar" },
  { title: "Vietnam", subtitle: "L'Asie Authentique", video: "/vitnam.mp4", link: "/destinations/vietnam" },
  { title: "Tanzanie", subtitle: "Safari Sauvage", video: "/tanzanie zanzibar safari.mp4", link: "/destinations/tanzanie" },
  { title: "Merzouga", subtitle: "Magie du Désert", video: "/marzougua maroc.MP4", link: "/destinations/national" },
]

export default function HeroGallery() {
  const [activeIndex, setActiveIndex] = useState(0)
  
  // Mobile tracking
  const mobileRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const container = mobileRef.current
    if (!container) return
    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const panelWidth = container.offsetWidth
      const newIndex = Math.round(scrollLeft / panelWidth)
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < destinations.length) {
        setActiveIndex(newIndex)
      }
    }
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [activeIndex])

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
    <>
      {/* ═══════════════════════════════════════════════════════════════
          DESKTOP — 4-column expanding panel grid (lg+)
      ═══════════════════════════════════════════════════════════════ */}
      <section 
        className="w-full h-[100dvh] hidden lg:flex flex-row overflow-hidden relative z-0 bg-cloud dark:bg-brand-dark"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {destinations.map((dest, index) => {
          const isActive = activeIndex === index
          return (
            <div
              key={index}
              onMouseEnter={() => setActiveIndex(index)}
              className={`relative h-full transition-all duration-700 ease-luxury cursor-pointer overflow-hidden border-r border-slate-200/20 dark:border-white/10 last:border-r-0 ${
                isActive ? 'flex-[3]' : 'flex-[1]'
              }`}
            >
              {/* Parallax Video */}
              <motion.div 
                className="absolute inset-[-4%] w-[108%] h-[108%] z-0 pointer-events-none"
                style={{ x: isActive ? x : 0, y: isActive ? y : 0 }}
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="object-cover w-full h-full"
                  src={dest.video}
                />
              </motion.div>

              {/* Bimodal Atmospheric Overlay */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-50/70 via-slate-50/20 dark:from-[#0B132B]/90 dark:via-[#0B132B]/40 to-transparent transition-colors duration-500 pointer-events-none" />

              {/* Collapsed State: Vertical Text */}
              <div
                className={`absolute inset-0 z-20 flex items-center justify-center transition-all duration-500 pointer-events-none ${
                  isActive ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                <span
                  className="text-slate-900 dark:text-white/80 uppercase font-heading drop-shadow-md text-2xl whitespace-nowrap font-bold tracking-widest"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                  {dest.title}
                </span>
              </div>

              {/* Active State: Liquid Glass Content Card */}
              <div
                className={`absolute inset-0 z-30 flex flex-col items-center justify-end pb-24 transition-all duration-700 pointer-events-none ${
                  isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="liquid-glass rounded-[2rem] p-8 flex flex-col items-center justify-center text-center max-w-lg w-full mx-8 pointer-events-auto">
                  <span className="text-brand-cyan text-xs uppercase mb-2 font-semibold tracking-wider">
                    {dest.subtitle}
                  </span>
                  <h2 className="text-[clamp(3rem,6vw,6rem)] font-heading leading-[1.05] text-slate-900 dark:text-white mb-4 font-medium tracking-wide">
                    {dest.title}
                  </h2>
                  <Link href={dest.link} className="bg-brand-blue text-white px-8 py-3 rounded-full text-sm mt-4 hover:scale-105 transition-transform">
                    Explorer
                  </Link>
                </div>
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
        className="w-full h-[100dvh] lg:hidden flex flex-row overflow-x-auto snap-x snap-mandatory hide-scrollbar relative z-0 bg-cloud dark:bg-brand-dark"
      >
        {destinations.map((dest, index) => (
          <div
            key={index}
            className="relative w-full min-w-full h-full flex-shrink-0 snap-center overflow-hidden"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 object-cover w-full h-full z-0"
              src={dest.video}
            />

            {/* Bimodal Atmospheric Overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-50/70 via-slate-50/20 dark:from-[#0B132B]/90 dark:via-[#0B132B]/40 to-transparent pointer-events-none" />

            {/* Content */}
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-end pb-24 px-4 pointer-events-none">
              <div className="liquid-glass rounded-[2rem] p-8 flex flex-col items-center justify-center text-center w-full max-w-[90%] pointer-events-auto">
                <span className="text-brand-cyan text-xs uppercase mb-2 font-semibold tracking-wider">
                  {dest.subtitle}
                </span>
                <h2 className="text-[clamp(2.5rem,8vw,4rem)] font-heading leading-[1.05] text-slate-900 dark:text-white mb-4 font-medium tracking-wide">
                  {dest.title}
                </h2>
                <Link href={dest.link} className="bg-brand-blue text-white px-8 py-3 rounded-full text-sm mt-4 hover:scale-105 transition-transform">
                  Explorer
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Mobile Pagination Dots */}
        <div className="absolute bottom-8 left-0 right-0 z-40 flex justify-center gap-2 pointer-events-none">
          {destinations.map((_, dotIndex) => (
            <div
              key={dotIndex}
              className={`h-[3px] rounded-full transition-all duration-500 ease-out ${
                dotIndex === activeIndex ? 'w-8 bg-brand-cyan' : 'w-4 bg-slate-400/50 dark:bg-white/20'
              }`}
            />
          ))}
        </div>
      </section>
    </>
  )
}
