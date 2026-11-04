'use client'

import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'

/** Phones only: keeps the price and the booking button in reach whenever the hero's own button is off screen. */
export default function TourMobileBar({
  price,
  fallback,
  from,
  perPerson,
  book,
  whatsappUrl,
}: {
  price?: string | null
  fallback: string
  from: string
  perPerson: string
  book: string
  whatsappUrl: string
}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const cta = document.getElementById('tour-hero-cta')
    if (!cta) return
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting))
    io.observe(cta)
    return () => io.disconnect()
  }, [])

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-slate-200 bg-white/95 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur-md transition-transform duration-300 dark:border-white/10 dark:bg-[#0B132B]/95 lg:hidden ${
        show ? 'translate-y-0' : 'pointer-events-none translate-y-full'
      }`}
    >
      <div className="min-w-0">
        {price ? <p className="text-[11px] leading-none text-slate-500 dark:text-white/50">{from}</p> : null}
        <p className="mt-1 truncate font-heading text-lg font-semibold leading-none text-brand-blue">
          {price ?? fallback}
          {price ? <span className="ml-1 font-body text-[11px] font-normal text-slate-500 dark:text-white/50">{perPerson}</span> : null}
        </p>
      </div>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={show ? 0 : -1}
        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white active:scale-[0.98]"
      >
        <MessageCircle className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        {book}
      </a>
    </div>
  )
}
