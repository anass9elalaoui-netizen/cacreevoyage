'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Testimonial {
  id: string
  travelerName: string
  travelerOrigin?: string
  travelerPhoto?: { url: string; alt?: string } | null
  rating: number
  testimonialText: string
  platform?: string
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[]
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-sm ${i < rating ? 'text-brand-gold' : 'text-white/20'}`}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  if (!testimonials || testimonials.length === 0) return null

  return (
    <section className="relative w-full py-24 bg-brand-deeper overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2" />

      {/* Heading */}
      <div className="text-center mb-12 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-serif text-4xl md:text-5xl text-white mb-4"
        >
          Ce que disent nos Voyageurs
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-brand-silver text-lg max-w-xl mx-auto"
        >
          Des expériences inoubliables racontées par ceux qui les ont vécues.
        </motion.p>
      </div>

      {/* Horizontal scroll carousel */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 md:px-12 pb-4 hide-scrollbar"
      >
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="flex-shrink-0 snap-center min-w-[340px] max-w-[420px] rounded-3xl p-8 border border-white/8"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            {/* Star Rating */}
            <StarRating rating={testimonial.rating} />

            {/* Quote */}
            <p className="font-serif text-xl md:text-[22px] italic text-white leading-relaxed mt-4 mb-6 line-clamp-5">
              &ldquo;{testimonial.testimonialText}&rdquo;
            </p>

            {/* Traveler Info */}
            <div className="flex items-center gap-3 mt-auto">
              {/* Avatar */}
              {testimonial.travelerPhoto?.url ? (
                <Image
                  src={testimonial.travelerPhoto.url}
                  alt={testimonial.travelerName}
                  width={48}
                  height={48}
                  className="rounded-full object-cover w-12 h-12"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue font-medium text-lg">
                  {testimonial.travelerName.charAt(0)}
                </div>
              )}

              <div>
                <p className="text-white text-sm font-medium">
                  {testimonial.travelerName}
                </p>
                {testimonial.travelerOrigin && (
                  <p className="text-brand-silver text-xs">
                    {testimonial.travelerOrigin}
                  </p>
                )}
              </div>

              {/* Platform badge */}
              {testimonial.platform && (
                <span className="ml-auto text-[11px] text-brand-silver border border-white/10 rounded-full px-2 py-0.5">
                  {testimonial.platform}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
