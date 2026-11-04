import { MessageCircle } from 'lucide-react'

/** Phones only: the one place the price appears, with the booking button always in reach of the thumb. */
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
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-slate-200 bg-white/95 px-4 pb-[max(env(safe-area-inset-bottom,0px),12px)] pt-3 backdrop-blur-md dark:border-white/10 dark:bg-[#0B132B]/95 lg:hidden">
      <div className="min-w-0">
        {price ? <p className="text-[11px] leading-none text-slate-500 dark:text-white/50">{from}</p> : null}
        <p className="mt-1 truncate font-heading text-xl font-semibold leading-none tracking-tight text-brand-blue">
          {price ?? fallback}
          {price ? <span className="ml-1 font-body text-[11px] font-normal text-slate-500 dark:text-white/50">{perPerson}</span> : null}
        </p>
      </div>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-[15px] font-semibold text-white transition-transform duration-100 ease-out active:scale-[0.97]"
      >
        <MessageCircle className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />
        {book}
      </a>
    </div>
  )
}
