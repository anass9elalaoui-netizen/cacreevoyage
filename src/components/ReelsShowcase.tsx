'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Use a permissive type that matches Payload's generic JsonObject & TypeWithID output
type Testimonial = Record<string, any> & { id: string | number }

export default function ReelsShowcase({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials || testimonials.length === 0) return null

  return (
    <div className="w-full flex overflow-x-auto hide-scrollbar snap-x snap-mandatory py-12 px-4 md:px-12 gap-6 md:gap-10">
      {/* Spacer for start */}
      <div className="shrink-0 w-4 md:w-12 snap-center" />

      {testimonials.map((testimonial) => (
        <ReelCard key={testimonial.id} testimonial={testimonial} />
      ))}

      {/* Spacer for end */}
      <div className="shrink-0 w-4 md:w-12 snap-center" />
    </div>
  )
}

function ReelCard({ testimonial }: { testimonial: Testimonial }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)

  const videoUrl = typeof testimonial.videoReel === 'object' && testimonial.videoReel?.url 
    ? testimonial.videoReel.url 
    : '/témoignage maroc marzougua.MOV' // Fallback to local asset

  // Setup Intersection Observer for mobile scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => {})
          } else {
            videoRef.current?.pause()
          }
        })
      },
      { threshold: 0.6 }
    )

    if (videoRef.current) observer.observe(videoRef.current)
    return () => observer.disconnect()
  }, [])

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="shrink-0 snap-center relative aspect-[9/16] w-[280px] md:w-[320px] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl cursor-pointer bg-slate-200/50 dark:bg-[#0B132B]/50 hover:shadow-[0_20px_50px_rgba(28,140,201,0.15)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-shadow duration-300"
    >
      <video
        ref={videoRef}
        src={videoUrl}
        muted={isMuted}
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-transparent to-white/30 dark:from-[#0B132B]/95 dark:via-transparent dark:to-[#0B132B]/40 z-10 pointer-events-none" />

      {/* Volume Toggle */}
      <button 
        onClick={toggleMute}
        className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full liquid-glass flex items-center justify-center hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
      >
        {isMuted ? (
          <svg className="w-5 h-5 text-slate-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-slate-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>

      {/* Glassmorphism Badge */}
      <div className="absolute bottom-6 left-6 right-6 z-20">
        <div className="p-4 rounded-2xl liquid-glass shadow-lg flex flex-col">
          <span className="text-slate-900 dark:text-white font-medium text-lg mb-1 dark:drop-shadow-md">
            {testimonial.clientName}
          </span>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-slate-700 dark:text-white/80 text-sm font-light truncate dark:drop-shadow-md">
              {testimonial.tourReference}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
