'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const destinations = [
  { title: "Zanzibar", subtitle: "Éden Tropical", video: "/zanzibar video.MP4", link: "/destinations/zanzibar", id: 0 },
  { title: "Vietnam", subtitle: "L'Asie Authentique", video: "/vitnam.mp4", link: "/destinations/vietnam", id: 1 },
  { title: "Tanzanie", subtitle: "Safari Sauvage", video: "/tanzanie zanzibar safari.mp4", link: "/destinations/tanzanie", id: 2 },
  { title: "Merzouga", subtitle: "Magie du Désert", video: "/marzougua maroc.MP4", link: "/destinations/national", id: 3 },
]

export default function HeroGallery3D() {
  const [activeIndex, setActiveIndex] = useState(0)

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % destinations.length)
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + destinations.length) % destinations.length)
  }

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden bg-slate-50 dark:bg-[#0B132B]">
      
      {/* 1. Background Video Layer */}
      {destinations.map((dest, i) => (
        <video
          key={dest.id}
          src={dest.video}
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity ease-in-out z-0 ${
            i === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDuration: '1200ms' }}
        />
      ))}

      {/* 2. Bimodal Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-50/90 via-slate-50/30 to-transparent dark:from-[#0B132B]/95 dark:via-[#0B132B]/50 dark:to-transparent pointer-events-none" />

      {/* 3. 3D Coverflow Carousel UI */}
      {/* We use perspective to give 3D depth to the rotated cards */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: '1200px' }}>
        {destinations.map((dest, i) => {
          const isActive = i === activeIndex
          
          // Calculate relative position (-1, 0, 1 etc.)
          let offset = i - activeIndex
          
          // Wrap around logic for smooth circular feel (only strictly works visually for 3+ items)
          if (offset === destinations.length - 1) offset = -1
          if (offset === -(destinations.length - 1)) offset = 1

          const isLeft = offset === -1
          const isRight = offset === 1

          let x = 0
          let rotateY = 0
          let scale = 1
          let opacity = 1
          let zIndex = 10
          let blur = "0px"

          if (isActive) {
            x = 0; rotateY = 0; scale = 1; opacity = 1; zIndex = 30; blur = "0px";
          } else if (isLeft) {
            x = -110; rotateY = 35; scale = 0.8; opacity = 0.6; zIndex = 20; blur = "3px";
          } else if (isRight) {
            x = 110; rotateY = -35; scale = 0.8; opacity = 0.6; zIndex = 20; blur = "3px";
          } else {
            // Hidden cards
            x = offset > 0 ? 200 : -200; rotateY = offset > 0 ? -45 : 45; scale = 0.6; opacity = 0; zIndex = 10; blur = "8px";
          }

          return (
            <motion.div
              key={dest.id}
              initial={false}
              animate={{
                x: `${x}%`,
                rotateY,
                scale,
                opacity,
                filter: `blur(${blur})`
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 25, mass: 1 }}
              className={`absolute flex flex-col items-center justify-center p-8 lg:p-12 text-center w-[85vw] md:w-[60vw] lg:w-[45vw] rounded-[2.5rem] liquid-glass ${
                isActive ? 'pointer-events-auto cursor-default' : 'pointer-events-auto cursor-pointer'
              }`}
              style={{ zIndex }}
              onClick={() => {
                if (isLeft) handlePrev()
                if (isRight) handleNext()
              }}
            >
              <span className="text-brand-cyan text-xs md:text-sm uppercase mb-4 font-body font-semibold tracking-wider">
                {dest.subtitle}
              </span>
              <h2 className="text-[clamp(3.5rem,8vw,7.5rem)] leading-[0.95] text-slate-900 dark:text-white mb-6 font-['Instrument_Serif'] font-medium tracking-wide">
                {dest.title}
              </h2>
              
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    <Link href={dest.link} className="inline-block bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-full text-sm font-medium hover:scale-105 transition-transform font-body">
                      Explorer la destination
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Desktop Navigation Arrows */}
      <div className="absolute inset-y-0 left-0 right-0 z-30 hidden md:flex items-center justify-between px-8 lg:px-16 pointer-events-none">
        <button
          onClick={handlePrev}
          className="w-14 h-14 rounded-full liquid-glass flex items-center justify-center text-slate-900 dark:text-white pointer-events-auto hover:scale-110 transition-transform"
          aria-label="Previous"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="w-14 h-14 rounded-full liquid-glass flex items-center justify-center text-slate-900 dark:text-white pointer-events-auto hover:scale-110 transition-transform"
          aria-label="Next"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Progress / Pagination */}
      <div className="absolute bottom-12 left-0 right-0 z-30 flex justify-center gap-3 pointer-events-none">
        {destinations.map((_, dotIndex) => (
          <div
            key={dotIndex}
            className={`h-[4px] rounded-full transition-all duration-500 ease-out ${
              dotIndex === activeIndex ? 'w-10 bg-slate-900 dark:bg-white' : 'w-4 bg-slate-900/30 dark:bg-white/30'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
