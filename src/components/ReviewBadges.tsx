'use client'

import React from 'react'
import { motion } from 'framer-motion'

/* ── Types ─────────────────────────────────────────────────── */

interface ReviewBadgeData {
  enabled?: boolean
  rating?: string
  reviewCount?: string
  profileUrl?: string
  quote?: string
}

interface ReviewBadgesProps {
  google?: ReviewBadgeData
  trustpilot?: ReviewBadgeData
}

/* ── Star Renderer ─────────────────────────────────────────── */

function Stars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating - fullStars >= 0.5

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${
            i < fullStars
              ? 'text-yellow-400'
              : i === fullStars && hasHalf
                ? 'text-yellow-400/50'
                : 'text-slate-200 dark:text-white/10'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

/* ── Google Icon ────────────────────────────────────────────── */

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

/* ── Trustpilot Icon ───────────────────────────────────────── */

function TrustpilotIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path d="M12 1l3.09 6.26L22 8.27l-5 4.87 1.18 6.88L12 16.77l-6.18 3.25L7 13.14 2 8.27l6.91-1.01L12 1z" fill="#00B67A" />
    </svg>
  )
}

/* ── Main Component ────────────────────────────────────────── */

export default function ReviewBadges({ google, trustpilot }: ReviewBadgesProps) {
  const showGoogle = google?.enabled !== false
  const showTrustpilot = trustpilot?.enabled !== false

  if (!showGoogle && !showTrustpilot) return null

  const googleRating = parseFloat(google?.rating || '4.9')
  const trustpilotRating = parseFloat(trustpilot?.rating || '4.8')

  return (
    <div className="relative flex flex-col gap-5 w-full max-w-sm lg:max-w-none">
      {/* ── Google Reviews Card ──────────────────────────── */}
      {showGoogle && (
        <motion.a
          href={google?.profileUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20, rotate: 0 }}
          whileInView={{ opacity: 1, y: 0, rotate: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.02, rotate: 0 }}
          className="group relative w-full lg:w-72 p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-none backdrop-blur-md hover:bg-slate-50 dark:hover:bg-white/[0.06] transition-all duration-500 cursor-pointer block"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
              <GoogleIcon />
            </div>
            <div>
              <p className="text-slate-900 dark:text-white text-sm font-sans font-medium leading-tight">Google Reviews</p>
              <p className="text-slate-500 dark:text-white/30 text-[10px] font-sans">{google?.reviewCount || '120+'} avis</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2.5 mb-4">
            <span className="text-slate-900 dark:text-white text-2xl font-sans font-bold tracking-tight">{google?.rating || '4.9'}</span>
            <Stars rating={googleRating} />
          </div>

          {/* Quote */}
          {google?.quote && (
            <p className="text-slate-600 dark:text-white/60 text-xs font-sans italic leading-relaxed line-clamp-2">
              &ldquo;{google.quote}&rdquo;
            </p>
          )}

          {/* Hover CTA */}
          <div className="mt-4 flex items-center gap-1.5 text-brand-blue dark:text-brand-blue/80 hover:text-brand-blue/80 text-[10px] font-sans font-medium uppercase tracking-wider transition-colors">
            <span>Voir tous les avis</span>
            <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </motion.a>
      )}

      {/* ── Trustpilot Card ──────────────────────────────── */}
      {showTrustpilot && (
        <motion.a
          href={trustpilot?.profileUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20, rotate: 0 }}
          whileInView={{ opacity: 1, y: 0, rotate: -1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.02, rotate: 0 }}
          className="group relative w-full lg:w-72 p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-none backdrop-blur-md hover:bg-slate-50 dark:hover:bg-white/[0.06] transition-all duration-500 cursor-pointer block lg:translate-x-8"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#00B67A]/10 border border-[#00B67A]/20 flex items-center justify-center">
              <TrustpilotIcon />
            </div>
            <div>
              <p className="text-slate-900 dark:text-white text-sm font-sans font-medium leading-tight">Trustpilot</p>
              <p className="text-slate-500 dark:text-white/30 text-[10px] font-sans">{trustpilot?.reviewCount || '85+'} avis</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2.5 mb-4">
            <span className="text-slate-900 dark:text-white text-2xl font-sans font-bold tracking-tight">{trustpilot?.rating || '4.8'}</span>
            <Stars rating={trustpilotRating} />
          </div>

          {/* Trustpilot green bar rating */}
          <div className="flex items-center gap-1 mb-3">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex-1 h-1 rounded-full overflow-hidden bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-[#00B67A]"
                  style={{
                    width: star >= 4 ? `${85 + Math.random() * 15}%` : star === 3 ? '12%' : '3%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Quote */}
          {trustpilot?.quote && (
            <p className="text-slate-600 dark:text-white/60 text-xs font-sans italic leading-relaxed line-clamp-2">
              &ldquo;{trustpilot.quote}&rdquo;
            </p>
          )}

          {/* Hover CTA */}
          <div className="mt-4 flex items-center gap-1.5 text-[#00B67A] dark:text-[#00B67A]/80 hover:text-[#00B67A]/80 text-[10px] font-sans font-medium uppercase tracking-wider transition-colors">
            <span>Voir sur Trustpilot</span>
            <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </motion.a>
      )}
    </div>
  )
}
