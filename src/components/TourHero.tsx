import Image from 'next/image'
import { ArrowDown, CalendarDays, MessageCircle } from 'lucide-react'
import LazyVideo from '@/components/LazyVideo'

const RISE = 'motion-safe:[animation:ccv-rise_.7s_cubic-bezier(.16,1,.3,1)_both]'

interface TourHeroProps {
  title: string
  excerpt?: string | null
  label: string
  imageUrl?: string | null
  videoUrl?: string | null
  /** Up to two extra photos beside the main one on desktop */
  sideImages: { url: string; alt: string }[]
  dates?: string | null
  price?: string | null
  whatsappUrl: string
  labels: { dates: string; from: string; perPerson: string; onRequest: string; book: string; programme: string }
}

/**
 * Tour page opening. Photos are shown sharp, at their own proportions, instead of a vertical photo
 * stretched behind a card. Phones get the photo first, then the title, dates and price straight away.
 */
export default function TourHero({ title, excerpt, label, imageUrl, videoUrl, sideImages, dates, price, whatsappUrl, labels }: TourHeroProps) {
  const sides = sideImages.slice(0, 2)
  const single = sides.length < 2

  return (
    <section id="tour-hero" className="relative pb-10 lg:px-6 lg:pb-16 lg:pt-28">
      <style
        dangerouslySetInnerHTML={{
          __html:
            '@keyframes ccv-rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}@keyframes ccv-push{from{transform:scale(1)}to{transform:scale(1.06)}}',
        }}
      />
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14">
        {/* Photos: first on phones, right column on desktop */}
        <div className="grid h-[44svh] min-h-[280px] grid-cols-3 grid-rows-2 gap-3 lg:order-2 lg:h-[min(72vh,640px)]">
          <div className={`relative row-span-2 overflow-hidden rounded-b-[2rem] bg-brand-dark lg:rounded-3xl ${single ? 'col-span-3' : 'col-span-3 lg:col-span-2'}`}>
            <div className="absolute inset-0 motion-safe:[animation:ccv-push_14s_linear_both]">
              {/* The photo stays underneath: some browsers cannot decode every video (HEVC .MOV) and would show nothing */}
              {imageUrl ? (
                <Image src={imageUrl} alt={title} fill priority sizes="(max-width: 1024px) 100vw, 640px" className="object-cover" />
              ) : null}
              {videoUrl ? (
                <LazyVideo src={videoUrl} priority aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
              ) : null}
            </div>
          </div>
          {!single &&
            sides.map((img, i) => (
              <div
                key={img.url}
                className={`relative hidden overflow-hidden rounded-3xl bg-slate-200 dark:bg-white/5 lg:block ${RISE}`}
                style={{ animationDelay: `${200 + i * 120}ms` }}
              >
                <Image src={img.url} alt={img.alt} fill sizes="240px" className="object-cover" />
              </div>
            ))}
        </div>

        {/* Text */}
        <div className="px-4 pt-7 lg:order-1 lg:px-0 lg:pt-0">
          <p className={`text-sm font-semibold text-brand-blue ${RISE}`}>{label}</p>
          <h1
            className={`mt-3 font-heading text-4xl font-medium leading-[1.05] tracking-tight text-slate-900 dark:text-white md:text-5xl lg:text-6xl ${RISE}`}
            style={{ animationDelay: '60ms' }}
          >
            {title}
          </h1>
          {excerpt ? (
            <p className={`mt-4 max-w-[52ch] text-base leading-relaxed text-slate-600 dark:text-white/70 lg:text-lg ${RISE}`} style={{ animationDelay: '120ms' }}>
              {excerpt}
            </p>
          ) : null}

          <dl
            className={`mt-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-y border-slate-200 py-4 dark:border-white/10 lg:justify-start lg:gap-x-14 ${RISE}`}
            style={{ animationDelay: '180ms' }}
          >
            {dates ? (
              <div>
                <dt className="text-xs text-slate-500 dark:text-white/50">{labels.dates}</dt>
                <dd className="mt-1 flex items-start gap-1.5 whitespace-nowrap text-[15px] font-medium leading-snug text-slate-900 dark:text-white">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" strokeWidth={2} aria-hidden="true" />
                  {dates}
                </dd>
              </div>
            ) : null}
            <div>
              {price ? <dt className="text-xs text-slate-500 dark:text-white/50">{labels.from}</dt> : null}
              <dd className="mt-1 whitespace-nowrap font-heading text-2xl font-semibold leading-none tracking-tight text-brand-blue">
                {price ?? labels.onRequest}
                {price ? <span className="ml-1 font-body text-xs font-normal text-slate-500 dark:text-white/50">{labels.perPerson}</span> : null}
              </dd>
            </div>
          </dl>

          <div className={`mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 ${RISE}`} style={{ animationDelay: '240ms' }}>
            <a
              id="tour-hero-cta"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-4 text-base font-semibold text-white shadow-[0_8px_24px_-8px_rgba(37,211,102,0.6)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              {labels.book}
            </a>
            <a href="#itinerary" className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-blue">
              {labels.programme}
              <ArrowDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" strokeWidth={2} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
