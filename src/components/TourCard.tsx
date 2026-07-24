'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import React from 'react'

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

// Convert Link to a motion component so we can pass motion styles directly
const MotionLink = motion(Link)

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

  // 3D Tilt & Parallax Logic
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 })
  
  // Rotate up to 10 degrees based on mouse position
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])
  
  // Parallax translate Z for the inner elements
  const translateZImage = useTransform(mouseXSpring, [-0.5, 0.5], ["-20px", "20px"]) // Subtle push back
  const translateZContent = useTransform(mouseXSpring, [-0.5, 0.5], ["30px", "-30px"]) // Subtle pop out

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    
    const width = rect.width
    const height = rect.height
    
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    
    x.set(xPct)
    y.set(yPct)
  }
  
  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      style={{ perspective: 1000 }} // perspective on the wrapper so child can rotate 3D
    >
      <MotionLink
        href={`/tours/${slug}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ 
          rotateX, 
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className="group block relative rounded-3xl overflow-hidden aspect-[3/4] cursor-pointer"
      >
        {/* Background Image Wrapper (Pushed back slightly for parallax) */}
        <motion.div 
          className="absolute inset-0 z-0 bg-slate-100 dark:bg-[#0B132B]"
          style={{ 
            translateZ: translateZImage, 
            scale: 1.1 // Scale up slightly so edges don't show when rotating
          }}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={thumbnail?.alt || title || 'Placeholder'}
              fill
              className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 liquid-glass animate-pulse flex items-center justify-center z-0">
              <span className="text-slate-400 dark:text-white/30 font-serif italic text-xs">Visuel en préparation...</span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/60 dark:from-[#0B132B]/95 dark:via-[#0B132B]/60 to-transparent z-10" suppressHydrationWarning />
        </motion.div>

        {/* Content (Bottom) - Popped out for parallax */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none"
          style={{ translateZ: 40 }} // Fixed Z pop out for 3D effect
        >
          {/* Scope badge */}
          {scope && (
            <span className="inline-block px-3 py-1 text-xs uppercase tracking-wider font-medium text-brand-blue liquid-glass border border-brand-blue/30 rounded-full mb-2">
              {scope === 'national' ? 'Maroc' : 'International'}
            </span>
          )}

          {/* Title */}
          <h3 className="font-serif text-2xl md:text-[26px] text-slate-900 dark:text-white mt-1 leading-tight drop-shadow-md">
            {title}
          </h3>

          {/* Meta row */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {durationText && (
              <span className="text-xs text-slate-600 dark:text-brand-silver flex items-center gap-1">
                🕐 {durationText}
              </span>
            )}
            {logistics?.maxGroupSize && (
              <span className="text-xs text-slate-600 dark:text-brand-silver flex items-center gap-1">
                👥 Max {logistics.maxGroupSize}
              </span>
            )}
            {logistics?.difficulty && (
              <span className="text-xs text-slate-600 dark:text-brand-silver flex items-center gap-1">
                ⭐ {logistics.difficulty}
              </span>
            )}
          </div>

          {/* Price + CTA row */}
          <div className="flex items-center justify-between mt-4">
            {priceText ? (
              <div>
                <span className="text-[11px] text-slate-500 dark:text-brand-silver">À partir de</span>
                <br />
                <span className="text-lg font-medium text-brand-blue dark:text-brand-gold">{priceText}/pers</span>
              </div>
            ) : (
              <div>
                <span className="text-sm text-slate-500 dark:text-brand-silver italic">Sur devis</span>
              </div>
            )}
            <span className="text-brand-blue text-sm font-sans font-medium group-hover:translate-x-1 transition-transform duration-300 drop-shadow-sm dark:drop-shadow-none">
              Découvrir →
            </span>
          </div>
        </motion.div>

        {/* Featured badge - Also popped out */}
        {isFeatured && (
          <motion.div 
            className="absolute top-4 right-4 px-3 py-1 text-xs font-medium uppercase tracking-wider liquid-glass border border-brand-gold/40 text-slate-800 dark:text-brand-gold rounded-full"
            style={{ translateZ: 50 }}
          >
            ⭐ Signature
          </motion.div>
        )}
      </MotionLink>
    </motion.div>
  )
}
