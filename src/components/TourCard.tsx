'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface TourCardProps {
  title: string
  slug: string
  excerpt?: string
  shortDescription?: string
  scope?: string
  duration?: string
  thumbnail?: {
    url: string
    alt?: string
  } | null
  pricing?: {
    basePrice?: number
    currency?: string
  } | null
  logistics?: {
    durationDays?: number
    durationNights?: number
    maxGroupSize?: number
    difficulty?: string
  } | null
  isFeatured?: boolean
}

export default function TourCard({
  title,
  slug,
  excerpt,
  shortDescription,
  scope,
  duration,
  thumbnail,
  pricing,
  logistics,
  isFeatured,
}: TourCardProps) {
  const imageUrl = thumbnail?.url || ''
  const durationText = logistics?.durationDays && logistics?.durationNights
    ? `${logistics.durationDays} Jours / ${logistics.durationNights} Nuits`
    : duration || ''

  const priceText = pricing?.basePrice
    ? `${pricing.basePrice.toLocaleString()} ${pricing.currency || '€'}`
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <Link
        href={`/tours/${slug}`}
        className="group block relative rounded-3xl overflow-hidden aspect-[3/4] cursor-pointer"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={thumbnail?.alt || title}
              fill
              className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0B132B] via-[#1a2744] to-[#0B132B]" />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/40 to-transparent" />
        </div>

        {/* Content (Bottom) */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Scope badge */}
          {scope && (
            <span className="inline-block px-3 py-1 text-xs uppercase tracking-wider font-medium text-brand-blue bg-brand-blue/20 rounded-full mb-2">
              {scope === 'national' ? 'Maroc' : 'International'}
            </span>
          )}

          {/* Title */}
          <h3 className="font-serif text-2xl md:text-[26px] text-white mt-1 leading-tight">
            {title}
          </h3>

          {/* Meta row */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {durationText && (
              <span className="text-xs text-brand-silver flex items-center gap-1">
                🕐 {durationText}
              </span>
            )}
            {logistics?.maxGroupSize && (
              <span className="text-xs text-brand-silver flex items-center gap-1">
                👥 Max {logistics.maxGroupSize}
              </span>
            )}
            {logistics?.difficulty && (
              <span className="text-xs text-brand-silver flex items-center gap-1">
                ⭐ {logistics.difficulty}
              </span>
            )}
          </div>

          {/* Price + CTA row */}
          <div className="flex items-center justify-between mt-4">
            {priceText ? (
              <div>
                <span className="text-[11px] text-brand-silver">À partir de</span>
                <br />
                <span className="text-lg font-medium text-brand-gold">{priceText}/pers</span>
              </div>
            ) : (
              <div>
                <span className="text-sm text-brand-silver italic">Sur devis</span>
              </div>
            )}
            <span className="text-brand-blue text-sm font-sans font-medium group-hover:translate-x-1 transition-transform duration-300">
              Découvrir →
            </span>
          </div>
        </div>

        {/* Featured badge */}
        {isFeatured && (
          <div className="absolute top-4 right-4 px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-gold bg-brand-gold/20 border border-brand-gold/30 rounded-full">
            ⭐ Signature
          </div>
        )}
      </Link>
    </motion.div>
  )
}
