'use client'

import { motion } from 'framer-motion'
import TourCard from './TourCard'

interface Tour {
  id: string
  title: string
  slug: string
  excerpt?: string
  shortDescription?: string
  scope?: string
  duration?: string
  thumbnail?: { url: string; alt?: string } | null
  pricing?: { basePrice?: number; currency?: string } | null
  logistics?: {
    durationDays?: number
    durationNights?: number
    maxGroupSize?: number
    difficulty?: string
  } | null
  isFeatured?: boolean
}

interface FeaturedToursGridProps {
  tours: Tour[]
}

export default function FeaturedToursGrid({ tours }: FeaturedToursGridProps) {
  if (!tours || tours.length === 0) return null

  return (
    <section className="relative w-full py-24 bg-slate-50 dark:bg-transparent transition-colors duration-700 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Heading */}
      <div className="text-center mb-16 px-6">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="uppercase tracking-[0.2em] text-brand-blue text-xs font-sans font-medium mb-4 block"
        >
          Circuits Signature
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-4xl md:text-6xl text-slate-900 dark:text-white mb-4"
        >
          Nos Voyages d&apos;Exception
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-600 dark:text-brand-silver text-lg max-w-xl mx-auto"
        >
          Des expériences triées sur le volet, conçues pour les voyageurs exigeants.
        </motion.p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => {
            const thumbnailData = typeof tour.thumbnail === 'object' && tour.thumbnail ? tour.thumbnail : null
            return (
              <TourCard
                key={tour.id}
                title={tour.title}
                slug={tour.slug}
                excerpt={tour.excerpt}
                shortDescription={tour.shortDescription}
                scope={tour.scope}
                duration={tour.duration}
                thumbnail={thumbnailData}
                pricing={tour.pricing}
                logistics={tour.logistics}
                isFeatured={tour.isFeatured}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
