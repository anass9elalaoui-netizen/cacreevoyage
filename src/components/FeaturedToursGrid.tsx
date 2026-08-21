'use client'

import { motion, AnimatePresence } from 'framer-motion'
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
          className="uppercase text-brand-blue text-xs font-body mb-4 block font-semibold tracking-wider"
        >
          Circuits Signature
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading text-4xl md:text-6xl text-slate-900 dark:text-white mb-4 font-medium tracking-wide"
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

      {/* Content-Aware Animated Grid */}
      {/* Content-Aware Animated Flexbox Layout */}
      <div className="w-full px-4 md:px-6 mt-4 pb-8 flex justify-center">
        <motion.div
          layout
          className="flex flex-wrap justify-center items-start gap-8 w-full max-w-7xl mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {tours.map((tour, index) => {
              const thumbnailData =
                typeof tour.thumbnail === 'object' && tour.thumbnail
                  ? tour.thumbnail
                  : null

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    type: 'spring',
                    bounce: 0.3,
                  }}
                  key={tour.id}
                  className="w-full max-w-[380px] flex-shrink-0"
                >
                  <TourCard
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
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
