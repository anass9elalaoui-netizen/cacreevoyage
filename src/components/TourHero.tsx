import Image from 'next/image'
import { ArrowDown, CalendarDays, Clock, MapPin, MessageCircle, Wallet } from 'lucide-react'
import LazyVideo from '@/components/LazyVideo'
import TourMobileGallery from '@/components/TourMobileGallery'

const RISE = 'motion-safe:[animation:ccv-rise_.7s_cubic-bezier(.16,1,.3,1)_both]'
/** Same value on both layouts: the browser preloads a single image for the first photo. */
const MAIN_SIZES = '(max-width: 1023px) 100vw, 640px'

interface TourHeroProps {
  title: string
  excerpt?: string | null
  scope: string
  duration?: string | null
  /** Only when it is not simply available: "Complet", "Bientôt" */
  status?: string | null
  departureCity?: string | null
  departureLabel: string
  /** e.g. "Acompte: 630 MAD (30% pour confirmer)" */
  deposit?: string | null
  imageUrl?: string | null
  videoUrl?: string | null
  /** Other photos of the tour: all of them swipeable on phones, the first two beside the main one on desktop */
  otherImages: { url: string; alt: string }[]
  dates?: string | null
  price?: string | null
  whatsappUrl: string
  labels: { dates: string; from: string; perPerson: string; onRequest: string; book: string; programme: string }
}

/**
 * Tour page opening.
 * Desktop: text, price and button beside a sharp photo mosaic.
 * Phones: swipeable photos, details in a sheet over them. The price lives in the bottom bar, not here.
 */
export default function TourHero({
  title,
  excerpt,
  scope,
  duration,
  status,
  departureCity,
  departureLabel,
  deposit,
  imageUrl,
  videoUrl,
  otherImages,
  dates,
  price,
  whatsappUrl,
  labels,
}: TourHeroProps) {
  const sides = otherImages.slice(0, 2)
  const single = sides.length < 2

  const facts = [
    dates ? { icon: CalendarDays, text: dates } : null,
    duration ? { icon: Clock, text: duration } : null,
    departureCity ? { icon: MapPin, text: `${departureLabel} ${departureCity}` } : null,
    deposit ? { icon: Wallet, text: deposit } : null,
  ].filter(Boolean) as { icon: typeof Clock; text: string }[]

  return (
    <section id="tour-hero" className="relative lg:px-6 lg:pb-16 lg:pt-28">
      <style
        dangerouslySetInnerHTML={{
          __html:
            '@keyframes ccv-rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}@keyframes ccv-push{from{transform:scale(1)}to{transform:scale(1.06)}}',
        }}
      />

      {/* Phones */}
      <div className="lg:hidden">
        <TourMobileGallery title={title} imageUrl={imageUrl} videoUrl={videoUrl} images={otherImages} sizes={MAIN_SIZES} />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14">
        {/* Desktop mosaic */}
        <div className="hidden grid-cols-3 grid-rows-2 gap-3 lg:order-2 lg:grid lg:h-[min(72vh,640px)]">
          <div className={`relative row-span-2 overflow-hidden rounded-3xl bg-brand-dark ${single ? 'col-span-3' : 'col-span-2'}`}>
            <div className="absolute inset-0 motion-safe:[animation:ccv-push_14s_linear_both]">
              {/* The photo stays underneath: some browsers cannot decode every video (HEVC .MOV) and would show nothing */}
              {imageUrl ? <Image src={imageUrl} alt={title} fill priority sizes={MAIN_SIZES} className="object-cover" /> : null}
              {videoUrl ? <LazyVideo src={videoUrl} priority aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" /> : null}
            </div>
          </div>
          {!single &&
            sides.map((img, i) => (
              <div
                key={img.url}
                className={`relative overflow-hidden rounded-3xl bg-slate-200 dark:bg-white/5 ${RISE}`}
                style={{ animationDelay: `${200 + i * 120}ms` }}
              >
                <Image src={img.url} alt={img.alt} fill sizes="240px" className="object-cover" />
              </div>
            ))}
        </div>

        {/* Sheet over the photos on phones, plain column on desktop */}
        <div className="relative z-10 -mt-7 rounded-t-[1.75rem] bg-slate-50 px-4 pt-6 dark:bg-[#0B132B] lg:order-1 lg:mt-0 lg:rounded-none lg:bg-transparent lg:px-0 lg:pt-0 lg:dark:bg-transparent">
          <p className={`text-sm font-semibold text-brand-blue ${RISE}`}>
            {scope}
            {duration ? <span className="hidden lg:inline"> · {duration}</span> : null}
            {status ? <span> · {status}</span> : null}
          </p>
          <h1
            className={`mt-2 font-heading text-[2rem] font-medium leading-[1.08] tracking-tight text-slate-900 dark:text-white md:text-5xl lg:mt-3 lg:text-6xl lg:leading-[1.05] ${RISE}`}
            style={{ animationDelay: '60ms' }}
          >
            {title}
          </h1>

          {/* Phones: the essentials at a glance */}
          {facts.length > 0 ? (
            <ul className="mt-4 space-y-2.5 lg:hidden">
              {facts.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-2.5 text-[15px] leading-snug text-slate-700 dark:text-white/80">
                  <Icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-brand-blue" strokeWidth={2} aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>
          ) : null}

          {/* Desktop */}
          {excerpt ? (
            <p className={`mt-4 hidden max-w-[52ch] text-lg leading-relaxed text-slate-600 dark:text-white/70 lg:block ${RISE}`} style={{ animationDelay: '120ms' }}>
              {excerpt}
            </p>
          ) : null}

          <dl
            className={`mt-5 hidden items-end gap-x-14 gap-y-3 border-y border-slate-200 py-4 dark:border-white/10 lg:flex lg:flex-wrap ${RISE}`}
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

          <div className={`mt-5 hidden flex-wrap items-center gap-x-5 gap-y-3 lg:flex ${RISE}`} style={{ animationDelay: '240ms' }}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-4 text-base font-semibold text-white shadow-[0_8px_24px_-8px_rgba(37,211,102,0.6)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
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
