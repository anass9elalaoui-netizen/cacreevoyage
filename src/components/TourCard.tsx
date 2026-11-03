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

const MONTH_NAMES_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']

/**
 * Parse a date string into { day, month, year } for calendar-style display
 */
function parseDateParts(dateStr: string) {
  const d = new Date(dateStr)
  return {
    day: d.getDate(),
    month: MONTH_NAMES_FR[d.getMonth()],
    year: d.getFullYear(),
  }
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

/**
 * Count total upcoming departures
 */
function countUpcoming(departureDates: DepartureDate[] | null | undefined): number {
  if (!departureDates) return 0
  const now = new Date()
  return departureDates.filter((d) => new Date(d.date) >= now && d.status !== 'Full').length
}

// Convert Link to a motion component so we can pass motion styles directly
const MotionLink = motion(Link)

/** ── Mini Calendar Chip ─────────────────────────────── */
function CalendarChip({ day, month }: { day: number; month: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-[42px] h-[46px] rounded-xl bg-white/90 dark:bg-white/10 shadow-sm">
      <span className="text-[10px] uppercase font-bold leading-none text-brand-blue tracking-wide">
        {month}
      </span>
      <span className="text-[20px] font-heading font-bold leading-none text-slate-900 dark:text-white -mt-0.5">
        {day}
      </span>
    </div>
  )
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
  const upcomingCount = useMemo(() => countUpcoming(departureDates), [departureDates])

  const dateInfo = useMemo(() => {
    // Priority 1: Next upcoming departure from departureDates array
    if (nextDeparture) {
      const dep = parseDateParts(nextDeparture.date)
      return {
        type: 'next' as const,
        departure: dep,
        return: null as ReturnType<typeof parseDateParts> | null,
        spotsLeft: nextDeparture.spotsLeft,
        status: nextDeparture.status,
        moreCount: upcomingCount > 1 ? upcomingCount - 1 : 0,
      }
    }
    // Priority 2: Fixed departure/return date
    if (departureDate) {
      const dep = parseDateParts(departureDate)
      const ret = returnDate ? parseDateParts(returnDate) : null
      return {
        type: 'fixed' as const,
        departure: dep,
        return: ret,
        spotsLeft: null as number | null | undefined,
        status: null as string | null | undefined,
        moreCount: 0,
      }
    }
    return null
  }, [nextDeparture, upcomingCount, departureDate, returnDate])

  // Status badge
  const statusBadge = useMemo(() => {
    if (tourStatus === 'sold_out') return { color: 'bg-red-500', label: 'Complet' }
    if (tourStatus === 'coming_soon') return { color: 'bg-amber-500', label: 'Bientôt' }
    if (nextDeparture?.status === 'Limited') return { color: 'bg-amber-500', label: 'Dernières places' }
    return null
  }, [tourStatus, nextDeparture])

  // 3D Tilt & Parallax Logic
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 })
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])
  
  const translateZImage = useTransform(mouseXSpring, [-0.5, 0.5], ["-20px", "20px"])

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const xPct = (e.clientX - rect.left) / rect.width - 0.5
    const yPct = (e.clientY - rect.top) / rect.height - 0.5
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
      style={{ perspective: 1000 }}
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
        {/* Background Image */}
        <motion.div 
          className="absolute inset-0 z-0 bg-slate-100 dark:bg-[#0B132B]"
          style={{ 
            translateZ: translateZImage, 
            scale: 1.1
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

        {/* ── CALENDAR DATE DISPLAY — Top-left ── */}
        {dateInfo && (
          <motion.div
            className="absolute top-4 left-4 z-20"
            style={{ translateZ: 55 }}
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
          >
            <div className="flex items-stretch gap-0 rounded-2xl overflow-hidden shadow-xl shadow-black/10 border border-white/30 dark:border-white/10">
              {/* Left: Calendar chip(s) */}
              <div className="flex items-center gap-0 bg-white/70 dark:bg-white/5 backdrop-blur-2xl px-2 py-2">
                <CalendarChip day={dateInfo.departure.day} month={dateInfo.departure.month} />
                {dateInfo.return && (
                  <>
                    <div className="flex flex-col items-center justify-center px-1.5">
                      <svg width="16" height="8" viewBox="0 0 16 8" fill="none" className="text-brand-blue">
                        <path d="M0 4H14M14 4L10.5 0.5M14 4L10.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <CalendarChip day={dateInfo.return.day} month={dateInfo.return.month} />
                  </>
                )}
              </div>

              {/* Right: Meta info strip */}
              <div className="flex flex-col justify-center bg-brand-blue/10 dark:bg-brand-blue/20 backdrop-blur-2xl px-3 py-2 min-w-[80px] border-l border-brand-blue/10">
                <span className="text-[9px] uppercase tracking-[0.15em] font-bold text-brand-blue leading-none">
                  {dateInfo.type === 'next' ? 'Prochain' : 'Départ'}
                </span>
                <span className="text-[9px] uppercase tracking-[0.15em] font-bold text-brand-blue leading-none mt-0.5">
                  {dateInfo.type === 'next' ? 'départ' : dateInfo.departure.year.toString()}
                </span>

                {/* Spots left */}
                {dateInfo.spotsLeft != null && dateInfo.spotsLeft > 0 && (
                  <span className="flex items-center gap-1 mt-1.5">
                    <span className={`w-[5px] h-[5px] rounded-full ${
                      dateInfo.spotsLeft <= 3 ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                    }`} />
                    <span className={`text-[9px] font-semibold leading-none ${
                      dateInfo.spotsLeft <= 3 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {dateInfo.spotsLeft} place{dateInfo.spotsLeft > 1 ? 's' : ''}
                    </span>
                  </span>
                )}

                {/* More departures */}
                {dateInfo.moreCount > 0 && (
                  <span className="text-[8px] text-brand-blue/70 font-medium mt-1 leading-none">
                    +{dateInfo.moreCount} autre{dateInfo.moreCount > 1 ? 's' : ''} date{dateInfo.moreCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── SEASON PILLS — Top-left when no dates ── */}
        {seasons && seasons.length > 0 && !dateInfo && (
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

        {/* ── STATUS BADGE ── */}
        {statusBadge && (
          <motion.div
            className={`absolute ${isFeatured ? 'top-14' : 'top-4'} right-4 z-20`}
            style={{ translateZ: 50 }}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-lg text-slate-800 dark:text-white">
              <span className={`w-2 h-2 rounded-full ${statusBadge.color} animate-pulse`} />
              {statusBadge.label}
            </span>
          </motion.div>
        )}

        {/* Content (Bottom) */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none"
          style={{ translateZ: 40 }}
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

          {/* Seasons row — inline when dates are at top */}
          {seasons && seasons.length > 0 && dateInfo && (
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

        {/* Featured badge */}
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
