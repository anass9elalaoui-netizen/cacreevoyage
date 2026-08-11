'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

// Temporary interface since we might not have the generated types perfectly synced yet
interface Media {
  url: string
  alt?: string
}

interface Tour {
  id: string
  title: string
  duration: string
  thumbnail?: Media | string | null
  heroVideo?: Media | string | null
}

const TourCard = ({ tour }: { tour: Tour }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  // Safely resolve URLs (handle both expanded depth and unexpanded ID cases)
  const thumbnailUrl = typeof tour.thumbnail === 'object' && tour.thumbnail?.url ? tour.thumbnail.url : null
  const videoUrl = typeof tour.heroVideo === 'object' && tour.heroVideo?.url ? tour.heroVideo.url : null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative min-w-[280px] h-[400px] md:min-w-[320px] md:h-[480px] rounded-[2rem] overflow-hidden snap-center group cursor-pointer border border-white/10 shadow-glass flex-shrink-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Thumbnail Layer */}
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={tour.title || 'Tour Thumbnail'}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-brand-dark/50 flex items-center justify-center">
          <span className="text-white/50 text-sm">No Image</span>
        </div>
      )}

      {/* Video Layer (Hover-to-Play) */}
      {videoUrl && (
        <video
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 z-10 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/30 to-transparent z-20 pointer-events-none" />

      {/* Card Content UI */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-30 pointer-events-none flex flex-col justify-end h-full">
        <h3 className="font-heading text-2xl md:text-3xl text-white mb-1 leading-tight drop-shadow-md transition-transform duration-300 group-hover:-translate-y-1 tracking-tight font-bold">
          {tour.title}
        </h3>
        <p className="text-brand-blue font-medium text-sm md:text-base transition-transform duration-300 group-hover:-translate-y-1 leading-relaxed">
          {tour.duration}
        </p>
      </div>
    </motion.div>
  )
}

export default function DestinationCarousel({ tours }: { tours: any[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative w-full">
      {/* Horizontal Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 px-4 md:px-12 hide-scrollbar w-full"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  )
}
