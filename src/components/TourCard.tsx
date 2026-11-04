'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import React, { useMemo } from 'react'
import { ArrowRight, CalendarDays, Clock, Gauge, Star, Users } from 'lucide-react'

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

const SEASON_MAP: Record<string, { icon: string; label: string }> = {
  spring: { icon: '🌸', label: 'Printemps' },
  summer: { icon: '☀️', label: 'Été' },
  autumn: { icon: '🍂', label: 'Automne' },
  winter: { icon: '❄️', label: 'Hiver' },
}

const MONTHS_FR = [
  'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
  'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc',
]

/** Format a single date nicely in French (e.g. "22 Sept 2026") */
function formatShortDate(dateStr: string, includeYear = true): string {
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ''
    const day = d.getDate()
    const month = MONTHS_FR[d.getMonth()]
    const year = d.getFullYear()
    return includeYear ? `${day} ${month} ${year}` : `${day} ${month}`
  } catch {
    return ''
  }
}

/** Format a date range cleanly: "22 Sept — 05 Oct 2026" */
function formatDateRange(depStr?: string | null, retStr?: string | null): string {
  if (!depStr) return ''
  try {
    const d1 = new Date(depStr)
    if (isNaN(d1.getTime())) return ''
    if (!retStr) return formatShortDate(depStr, true)

    const d2 = new Date(retStr)
    if (isNaN(d2.getTime())) return formatShortDate(depStr, true)

    const sameYear = d1.getFullYear() === d2.getFullYear()
    const start = formatShortDate(depStr, !sameYear)
    const end = formatShortDate(retStr, true)
    return `${start} — ${end}`
  } catch {
    return ''
  }
}

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

  const durationText =
    duration ||
    (logistics?.durationDays && logistics?.durationNights
      ? `${logistics.durationDays}J / ${logistics.durationNights}N`
      : '')

  const priceText = pricing?.basePrice
    ? `${pricing.basePrice.toLocaleString('fr-FR')} ${pricing.currency || '€'}`
    : null

  // Find next upcoming departure if array exists
  const nextDeparture = useMemo(() => {
    if (!departureDates || departureDates.length === 0) return null
    const now = new Date()
    const upcoming = departureDates
      .filter((d) => {
        const dt = new Date(d.date)
        return !isNaN(dt.getTime()) && dt >= now && d.status !== 'Full'
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    // Never fall back to a past date: an expired date on the cover misleads visitors
    return upcoming[0] || null
  }, [departureDates])

  // Resolve active date badge text
  const dateBadge = useMemo(() => {
    // 1) Fixed departure date (and optional return), only while it is still upcoming
    const fixedIsUpcoming = departureDate ? new Date(departureDate).getTime() >= new Date().setHours(0, 0, 0, 0) : false
    if (departureDate && fixedIsUpcoming) {
      const formatted = formatDateRange(departureDate, returnDate)
      if (formatted) {
        return {
          text: formatted,
          spotsLeft: nextDeparture?.spotsLeft ?? null,
          isLimited: nextDeparture?.status === 'Limited' || tourStatus === 'coming_soon',
        }
      }
    }
    // 2) From departureDates array
    if (nextDeparture?.date) {
      const formatted = formatShortDate(nextDeparture.date, true)
      if (formatted) {
        return {
          text: formatted,
          spotsLeft: nextDeparture.spotsLeft ?? null,
          isLimited: nextDeparture.status === 'Limited',
        }
      }
    }
    return null
  }, [departureDate, returnDate, nextDeparture, tourStatus])

  // Status flags
  const isSoldOut = tourStatus === 'sold_out'
  const isComingSoon = tourStatus === 'coming_soon'

  // 3D Tilt & Parallax Physics
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x, { stiffness: 280, damping: 35 })
  const mouseYSpring = useSpring(y, { stiffness: 280, damping: 35 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg'])
  const translateZImage = useTransform(mouseXSpring, [-0.5, 0.5], ['-15px', '15px'])

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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={{ perspective: 1100 }}
      className="w-full"
    >
      <MotionLink
        href={`/tours/${slug}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="group relative block w-full aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer shadow-xl shadow-slate-900/10 dark:shadow-black/40 border border-slate-200/60 dark:border-white/10 hover:shadow-2xl hover:border-brand-blue/40 transition-[border,box-shadow] duration-500 bg-slate-900"
      >
        {/* ── Background Image Layer ── */}
        <motion.div
          className="absolute inset-0 z-0 bg-slate-900"
          style={{
            translateZ: translateZImage,
            scale: 1.08,
          }}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={thumbnail?.alt || title || 'Circuit'}
              fill
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center">
              <span className="text-white/40 font-heading italic text-xs tracking-wider">
                Visuel en préparation
              </span>
            </div>
          )}

          {/* Shade only behind the text: the photo stays bright and is what sells the trip */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent via-20% to-transparent pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 via-30% to-transparent to-60% pointer-events-none"
            aria-hidden="true"
          />
        </motion.div>

        {/* ── TOP BAR: Date Badge & Status Badges ── */}
        <div
          className="absolute top-0 inset-x-0 p-4 z-20 flex items-start justify-between gap-2 pointer-events-none"
          style={{ transform: 'translateZ(30px)' }}
        >
          {/* Left: Date Badge */}
          {dateBadge ? (
            <div className="flex items-center gap-2.5 pl-2 pr-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-xl text-slate-900 shadow-lg">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-brand-blue">
                <CalendarDays className="w-4 h-4 text-white" strokeWidth={2} aria-hidden="true" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-blue">
                  Prochain départ
                </span>
                <span className="text-[13px] font-semibold tracking-tight whitespace-nowrap text-slate-900">
                  {dateBadge.text}
                </span>
              </span>

              {/* Limited spots indicator */}
              {dateBadge.spotsLeft != null && dateBadge.spotsLeft > 0 && (
                <span className="ml-0.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-100 text-[9px] font-bold text-amber-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  {dateBadge.spotsLeft} pl.
                </span>
              )}
            </div>
          ) : seasons && seasons.length > 0 ? (
            /* Fallback to seasons if no date */
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xl text-slate-800 text-[11px] shadow-md">
              {seasons.map((s) => (
                <span key={s} title={SEASON_MAP[s]?.label || s}>
                  {SEASON_MAP[s]?.icon || '✨'}
                </span>
              ))}
              <span className="text-[10px] text-slate-600 font-medium ml-1">
                {SEASON_MAP[seasons[0]]?.label || 'Saisons'}
              </span>
            </div>
          ) : <div />}

          {/* Right: Signature or Status badge */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {isSoldOut ? (
              <span className="px-2.5 py-1 rounded-full bg-red-600/90 text-white border border-red-400/40 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-md">
                Complet
              </span>
            ) : isComingSoon ? (
              <span className="px-2.5 py-1 rounded-full bg-sky-600/90 text-white border border-sky-400/40 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-md">
                Bientôt
              </span>
            ) : isFeatured ? (
              <span className="px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-[10px] font-bold uppercase tracking-widest shadow-md flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" strokeWidth={0} aria-hidden="true" />
                <span>Signature</span>
              </span>
            ) : null}
          </div>
        </div>

        {/* ── BOTTOM CONTENT: Scope, Title, Meta Specs, Pricing & CTA ── */}
        <div
          className="absolute bottom-0 inset-x-0 p-5 md:p-6 z-20 flex flex-col justify-end pointer-events-none"
          style={{ transform: 'translateZ(35px)' }}
        >
          {/* Scope Tag */}
          <div className="mb-2">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-blue/90 text-white text-[10px] font-bold uppercase tracking-widest backdrop-blur-md shadow-sm border border-brand-cyan/30">
              {scope === 'national' ? 'Maroc' : 'International'}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-heading text-xl md:text-[22px] font-bold text-white leading-snug tracking-tight [text-shadow:0_1px_12px_rgba(0,0,0,0.45)] line-clamp-2">
            {title}
          </h3>

          {/* Specs / Meta Badges */}
          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
            {durationText && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/15 text-[11px] text-white/90 font-medium">
                <Clock className="w-3 h-3 opacity-80" strokeWidth={2} aria-hidden="true" />
                <span>{durationText}</span>
              </span>
            )}
            {logistics?.maxGroupSize && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/15 text-[11px] text-white/90 font-medium">
                <Users className="w-3 h-3 opacity-80" strokeWidth={2} aria-hidden="true" />
                <span>Max {logistics.maxGroupSize}</span>
              </span>
            )}
            {logistics?.difficulty && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/15 text-[11px] text-white/90 font-medium">
                <Gauge className="w-3 h-3 opacity-80" strokeWidth={2} aria-hidden="true" />
                <span>{logistics.difficulty}</span>
              </span>
            )}
          </div>

          {/* Subtle Divider */}
          <div className="w-full h-px bg-white/15 my-3.5" aria-hidden="true" />

          {/* Price & CTA Button */}
          <div className="flex items-center justify-between gap-3">
            <div>
              {priceText ? (
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-white/60 font-medium">
                    À partir de
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg md:text-xl font-heading font-bold text-white tracking-tight">
                      {priceText}
                    </span>
                    <span className="text-[11px] text-white/60 font-normal">/pers</span>
                  </div>
                </div>
              ) : (
                <span className="text-sm font-heading font-medium text-white">
                  Sur devis
                </span>
              )}
            </div>

            {/* CTA Button */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-brand-dark group-hover:bg-brand-blue group-hover:text-white text-xs font-semibold transition-colors duration-300 shadow-md">
              <span>Découvrir</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} aria-hidden="true" />
            </div>
          </div>
        </div>
      </MotionLink>
    </motion.div>
  )
}
