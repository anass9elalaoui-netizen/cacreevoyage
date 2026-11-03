'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import React, { useMemo } from 'react'

interface DepartureDate {
  date: string
  spotsLeft?: number
  status?: string
}

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
  departureDate?: string | null
  returnDate?: string | null
  departureDates?: DepartureDate[] | null
  seasons?: string[] | null
  tourStatus?: string | null
}

// Season icons and labels
const SEASON_MAP: Record<string, { icon: string; label: string }> = {
  spring: { icon: '🌸', label: 'Printemps' },
  summer: { icon: '☀️', label: 'Été' },
  autumn: { icon: '🍂', label: 'Automne' },
  winter: { icon: '❄️', label: 'Hiver' },
}

/**
 * Format a date string to a beautiful French locale display
 */
function formatDateFR(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Get the next upcoming departure from a departureDates array
 */
function getNextDeparture(departureDates: DepartureDate[] | null | undefined): DepartureDate | null {
  if (!departureDates || departureDates.length === 0) return null
  const now = new Date()
  const upcoming = departureDates
    .filter((d) => new Date(d.date) >= now && d.status !== 'Full')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  return upcoming[0] || null
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
  departureDate,
  returnDate,
  departureDates,
  seasons,
  tourStatus,
}: TourCardProps) {
  const imageUrl = thumbnail?.url || ''
  const durationText = logistics?.durationDays && logistics?.durationNights
    ? `${logistics.durationDays} Jours / ${logistics.durationNights} Nuits`
    : duration || ''

  const priceText = pricing?.basePrice
    ? `${pricing.basePrice.toLocaleString()} ${pricing.currency || '€'}`
    : null

  // Compute date display info
  const nextDeparture = useMemo(() => getNextDeparture(departureDates), [departureDates])

  const dateDisplay = useMemo(() => {
    // Priority 1: Next upcoming departure from departureDates array
    if (nextDeparture) {
      return {
        label: 'Prochain départ',
        date: formatDateFR(nextDeparture.date),
        status: nextDeparture.status,
        spotsLeft: nextDeparture.spotsLeft,
      }
    }
    // Priority 2: Fixed departure date
    if (departureDate) {
      return {
        label: 'Départ',
        date: formatDateFR(departureDate) + (returnDate ? ` — ${formatDateFR(returnDate)}` : ''),
        status: null,
        spotsLeft: null,
      }
    }
    return null
  }, [nextDeparture, departureDate, returnDate])

  // Status badge color
  const statusColor = useMemo(() => {
    if (tourStatus === 'sold_out') return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-400/30', label: 'Complet' }
    if (tourStatus === 'coming_soon') return { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-400/30', label: 'Bientôt' }
    if (nextDeparture?.status === 'Limited') return { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-400/30', label: 'Places limitées' }
    return null
  }, [tourStatus, nextDeparture])

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
              <span className="text-slate-400 dark:text-white/30 font-heading italic text-xs">Visuel en préparation...</span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/60 dark:from-[#0B132B]/95 dark:via-[#0B132B]/60 to-transparent z-10" suppressHydrationWarning />
        </motion.div>

        {/* ── DATE BADGE — Top-left corner ── */}
        {dateDisplay && (
          <motion.div
            className="absolute top-4 left-4 z-20"
            style={{ translateZ: 50 }}
          >
            <div className="liquid-glass border border-white/20 dark:border-white/10 rounded-2xl px-3.5 py-2.5 backdrop-blur-xl shadow-lg shadow-black/5">
              {/* Date label */}
              <span className="block text-[10px] uppercase tracking-widest text-brand-blue font-semibold mb-0.5">
                {dateDisplay.label}
              </span>
              {/* Date value */}
              <span className="block text-sm font-heading font-semibold text-slate-800 dark:text-white leading-tight">
                {dateDisplay.date}
              </span>
              {/* Spots left indicator */}
              {dateDisplay.spotsLeft != null && dateDisplay.spotsLeft > 0 && (
                <span className="flex items-center gap-1 mt-1">
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                    dateDisplay.spotsLeft <= 3 ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                  }`} />
                  <span className={`text-[10px] font-medium ${
                    dateDisplay.spotsLeft <= 3 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {dateDisplay.spotsLeft} place{dateDisplay.spotsLeft > 1 ? 's' : ''} restante{dateDisplay.spotsLeft > 1 ? 's' : ''}
                  </span>
                </span>
              )}
            </div>
          </motion.div>
        )}

        {/* ── SEASON PILLS — Below date badge or top-left ── */}
        {seasons && seasons.length > 0 && !dateDisplay && (
          <motion.div
            className="absolute top-4 left-4 z-20 flex gap-1.5 flex-wrap"
            style={{ translateZ: 50 }}
          >
            {seasons.map((season) => {
              const s = SEASON_MAP[season]
              if (!s) return null
              return (
                <span
                  key={season}
                  className="liquid-glass border border-white/20 dark:border-white/10 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold text-slate-700 dark:text-white/80 backdrop-blur-xl shadow-sm"
                >
                  {s.icon} {s.label}
                </span>
              )
            })}
          </motion.div>
        )}

        {/* ── STATUS BADGE — Below featured badge ── */}
        {statusColor && (
          <motion.div
            className={`absolute top-4 ${isFeatured ? 'right-4 top-14' : 'right-4'} z-20`}
            style={{ translateZ: 50 }}
          >
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border ${statusColor.bg} ${statusColor.text} ${statusColor.border}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {statusColor.label}
            </span>
          </motion.div>
        )}

        {/* Content (Bottom) - Popped out for parallax */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none"
          style={{ translateZ: 40 }} // Fixed Z pop out for 3D effect
        >
          {/* Scope badge */}
          {scope && (
            <span className="inline-block px-3 py-1 text-xs uppercase tracking-wider text-brand-blue liquid-glass border border-brand-blue/30 rounded-full mb-2 font-semibold">
              {scope === 'national' ? 'Maroc' : 'International'}
            </span>
          )}

          {/* Title */}
          <h3 className="font-heading text-2xl md:text-[26px] text-slate-900 dark:text-white mt-1 leading-tight drop-shadow-md">
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

          {/* Seasons row — show here if dates are also showing at top */}
          {seasons && seasons.length > 0 && dateDisplay && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {seasons.map((season) => {
                const s = SEASON_MAP[season]
                if (!s) return null
                return (
                  <span
                    key={season}
                    className="text-[10px] text-slate-500 dark:text-brand-silver/70"
                  >
                    {s.icon} {s.label}
                  </span>
                )
              })}
            </div>
          )}

          {/* Price + CTA row */}
          <div className="flex items-center justify-between mt-4">
            {priceText ? (
              <div>
                <span className="text-[11px] text-slate-500 dark:text-brand-silver">À partir de</span>
                <br />
                <span className="text-lg font-medium text-brand-blue dark:text-brand-blue">{priceText}/pers</span>
              </div>
            ) : (
              <div>
                <span className="text-sm text-slate-500 dark:text-brand-silver italic">Sur devis</span>
              </div>
            )}
            <span className="text-brand-blue text-sm font-body font-medium group-hover:translate-x-1 transition-transform duration-300 drop-shadow-sm dark:drop-shadow-none">
              Découvrir →
            </span>
          </div>
        </motion.div>

        {/* Featured badge - Also popped out */}
        {isFeatured && (
          <motion.div 
            className="absolute top-4 right-4 px-3 py-1 text-xs uppercase tracking-wider liquid-glass border border-brand-blue/40 text-slate-800 dark:text-brand-blue rounded-full font-semibold"
            style={{ translateZ: 50 }}
          >
            ⭐ Signature
          </motion.div>
        )}
      </MotionLink>
    </motion.div>
  )
}
