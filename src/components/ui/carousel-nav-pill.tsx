'use client'

import React from 'react'

interface CarouselNavPillProps {
  onPrev: () => void
  onNext: () => void
  ariaLabelPrev?: string
  ariaLabelNext?: string
  className?: string
}

/**
 * Unified pill-shaped carousel navigation — Apple-style.
 * Two circular arrow buttons inside a single rounded-full container.
 */
export function CarouselNavPill({
  onPrev,
  onNext,
  ariaLabelPrev = 'Précédent',
  ariaLabelNext = 'Suivant',
  className = '',
}: CarouselNavPillProps) {
  return (
    <div
      className={`hidden md:flex items-center gap-1 p-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex-shrink-0 ${className}`}
    >
      <button
        onClick={onPrev}
        className="w-10 h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-slate-700 dark:text-white/80 hover:bg-slate-50 dark:hover:bg-white/20 hover:text-slate-900 dark:hover:text-white transition-all duration-300 shadow-sm dark:shadow-none"
        aria-label={ariaLabelPrev}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={onNext}
        className="w-10 h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-slate-700 dark:text-white/80 hover:bg-slate-50 dark:hover:bg-white/20 hover:text-slate-900 dark:hover:text-white transition-all duration-300 shadow-sm dark:shadow-none"
        aria-label={ariaLabelNext}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
