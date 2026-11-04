import { notFound, permanentRedirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Check, Clock, Gauge, MapPin, Sun, Users } from 'lucide-react'
import ItineraryTimeline from '@/components/ItineraryTimeline'
import StoryCarousel from '@/components/ui/StoryCarousel'
import Footer from '@/components/Footer'
import BookingSidebar from '@/components/BookingSidebar'
import { getSiteSettings, cleanWhatsAppNumber } from '@/lib/getSiteSettings'

import { getDictionary, Locale } from '@/i18n/dictionaries'
import TourHero from '@/components/TourHero'
import TourMobileBar from '@/components/TourMobileBar'

/**
 * Old tour URLs that were renamed in the CMS → their current slug. Visitors and search
 * engines following an old link get a permanent redirect instead of a 404.
 */
const LEGACY_TOUR_SLUGS: Record<string, string> = {
  'zanzibar-appel-du-paradis-22-septembre-au-05-octobre': 'zanzibar-appel-du-paradis',
}

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params, searchParams }: Args): Promise<Metadata> {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const locale = (resolvedSearchParams.locale as string) || 'fr'
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'tours',
    where: { slug: { equals: slug.toLowerCase() } },
    limit: 1,
    depth: 1,
    locale: locale as any,
  })
  const tour = docs[0] as any
  if (!tour) return { title: 'Circuit non trouvé' }

  return {
    title: tour.seo?.metaTitle || tour.title,
    description: tour.seo?.metaDescription || tour.excerpt,
  }
}

export default async function TourPage({ params, searchParams }: Args) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const locale = (resolvedSearchParams.locale as string) || 'fr'
  const t = getDictionary(locale).tourPage
  const bookingT = getDictionary(locale).bookingSidebar
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'tours',
    where: { slug: { equals: slug.toLowerCase() } },
    depth: 2,
    limit: 1,
    locale: locale as any,
  })

  const tour = docs[0] as any
  if (!tour) {
    const renamed = LEGACY_TOUR_SLUGS[slug.toLowerCase()]
    if (renamed) permanentRedirect(`/tours/${renamed}`)
    notFound()
  }

  const siteSettings = await getSiteSettings(locale)
  const cleanWaNumber = cleanWhatsAppNumber(siteSettings.whatsappNumber)

  const heroVideoUrl = typeof tour.heroVideo === 'object' && tour.heroVideo?.url ? tour.heroVideo.url : null
  const thumbnailUrl = typeof tour.thumbnail === 'object' && tour.thumbnail?.url ? tour.thumbnail.url : null

  // Determine which itinerary format is available
  const hasStoryDays = tour.storyDays && Array.isArray(tour.storyDays) && tour.storyDays.length > 0
  const hasLegacyBlocks = tour.itineraryBlocks && Array.isArray(tour.itineraryBlocks) && tour.itineraryBlocks.length > 0

  // Format dates for hero display
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  const hasFixedDates = Boolean(tour.departureDate && tour.returnDate)

  // "19 – 22 novembre 2026": short enough to stay on one line on a phone
  const formatRange = (from: string, to: string) => {
    const a = new Date(from)
    const b = new Date(to)
    const sameMonth = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
    const start = sameMonth
      ? String(a.getDate())
      : a.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    return `${start} – ${b.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`
  }

  const priceText = tour.pricing?.basePrice
    ? `${tour.pricing.basePrice.toLocaleString('fr-FR')} ${tour.pricing.currency || '€'}`
    : null
  const depositText = tour.pricing?.basePrice && tour.pricing?.depositPercentage
    ? `${bookingT.deposit} ${Math.round(tour.pricing.basePrice * (tour.pricing.depositPercentage / 100)).toLocaleString('fr-FR')} ${tour.pricing.currency || '€'} (${tour.pricing.depositPercentage}% ${bookingT.toConfirm})`
    : null
  const bookingUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(`Bonjour, je suis intéressé(e) par le circuit "${tour.title}". Pouvez-vous me donner plus d'informations ?`)}`

  // Duration text
  const plural = (n: number, word: string) => `${n} ${word}${n > 1 ? 's' : ''}`
  const durationText = tour.logistics?.durationDays && tour.logistics?.durationNights
    ? `${plural(tour.logistics.durationDays, 'Jour')} / ${plural(tour.logistics.durationNights, 'Nuit')}`
    : tour.duration || ''

  // Photos added in the admin under "gallery"
  const galleryImages = (tour.gallery ?? []).flatMap((g: any) =>
    typeof g.image === 'object' && g.image?.url ? [{ url: g.image.url, alt: g.image.alt || tour.title }] : [],
  )

  return (
    <main className="relative w-full min-h-screen pb-20 lg:pb-0 bg-slate-50 dark:bg-[#0B132B] transition-colors duration-700 overflow-x-hidden">
      {/* ──────────────────────────────────────────────────────────
          HERO SECTION
      ─────────────────────────────────────────────────────────── */}
      <TourHero
        title={tour.title}
        excerpt={tour.excerpt}
        scope={tour.scope === 'national' ? 'Maroc' : 'International'}
        duration={durationText}
        status={tour.tourStatus === 'sold_out' ? bookingT.soldOut : tour.tourStatus === 'coming_soon' ? bookingT.comingSoon : null}
        departureCity={tour.logistics?.departureCity}
        departureLabel={t.departure}
        deposit={depositText}
        imageUrl={thumbnailUrl}
        videoUrl={heroVideoUrl}
        otherImages={galleryImages.filter((img: { url: string }) => img.url !== thumbnailUrl)}
        dates={hasFixedDates ? formatRange(tour.departureDate, tour.returnDate) : null}
        price={priceText}
        whatsappUrl={bookingUrl}
        labels={{ dates: t.heroDates, from: t.heroFrom, perPerson: t.heroPerPerson, onRequest: t.heroOnRequest, book: t.heroBook, programme: t.heroProgramme }}
      />

      {/* ──────────────────────────────────────────────────────────
          MAIN CONTENT + SIDEBAR LAYOUT
      ─────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 lg:pt-8 pb-8 md:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Main content (2/3) */}
          <div className="lg:col-span-2 space-y-12 lg:space-y-20">
            {/* Tour Overview */}
            <section>
              <span className="uppercase text-brand-blue text-xs font-body mb-4 hidden lg:block font-semibold tracking-wider">
                {t.overview}
              </span>
              <h2 className="font-heading text-2xl md:text-4xl text-slate-900 dark:text-white mb-3 lg:mb-6 tracking-tight font-medium lg:font-bold">
                {t.about}
              </h2>

              {/* Meta badges */}
              <div className="flex flex-wrap gap-3 lg:mb-8 [&>span:not(.hidden)]:mb-3 lg:[&>span]:mb-0">
                {durationText && (
                  <span className="hidden lg:inline-block px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-white/80 shadow-sm dark:shadow-none">
                    <Clock className="mr-2 inline h-4 w-4 align-[-3px] text-brand-blue" strokeWidth={2} aria-hidden="true" />{durationText}
                  </span>
                )}
                {tour.logistics?.maxGroupSize && (
                  <span className="px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-white/80 shadow-sm dark:shadow-none">
                    <Users className="mr-2 inline h-4 w-4 align-[-3px] text-brand-blue" strokeWidth={2} aria-hidden="true" />Max {tour.logistics.maxGroupSize} pers.
                  </span>
                )}
                {tour.logistics?.difficulty && (
                  <span className="px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-white/80 shadow-sm dark:shadow-none">
                    <Gauge className="mr-2 inline h-4 w-4 align-[-3px] text-brand-blue" strokeWidth={2} aria-hidden="true" />{tour.logistics.difficulty}
                  </span>
                )}
                {tour.logistics?.departureCity && (
                  <span className="hidden lg:inline-block px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-white/80 shadow-sm dark:shadow-none">
                    <MapPin className="mr-2 inline h-4 w-4 align-[-3px] text-brand-blue" strokeWidth={2} aria-hidden="true" />{t.departure} {tour.logistics.departureCity}
                  </span>
                )}
                {tour.seasons && tour.seasons.length > 0 && (
                  <span className="px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-white/80 shadow-sm dark:shadow-none">
                    <Sun className="mr-2 inline h-4 w-4 align-[-3px] text-brand-blue" strokeWidth={2} aria-hidden="true" />{tour.seasons.join(', ')}
                  </span>
                )}
              </div>

              <p className="text-slate-600 dark:text-brand-silver text-base leading-relaxed font-normal">
                {tour.shortDescription || tour.excerpt}
              </p>

              {/* Animated Scroll Indicator */}
              <div className="mt-10 hidden lg:flex flex-col items-start opacity-80 hover:opacity-100 transition-opacity">
                <a href="#itinerary" className="flex items-center gap-4 text-brand-blue group cursor-pointer">
                  <span className="text-xs uppercase tracking-widest font-semibold">Découvrir l'itinéraire</span>
                  <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center group-hover:bg-brand-blue/20 transition-colors">
                    <svg className="w-5 h-5 animate-bounce mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </a>
              </div>
            </section>

            {/* Departure dates table */}
            {tour.departureDates && tour.departureDates.length > 0 && (
              <section>
                <h2 className="font-heading text-3xl text-slate-900 dark:text-white mb-8 tracking-tight font-bold">{t.departureDates}</h2>
                <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm dark:shadow-none">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-white/5">
                        <th className="text-left px-6 py-3 text-slate-600 dark:text-brand-silver uppercase tracking-wider text-xs font-semibold">{t.date}</th>
                        <th className="text-left px-6 py-3 text-slate-600 dark:text-brand-silver uppercase tracking-wider text-xs font-semibold">{t.spots}</th>
                        <th className="text-left px-6 py-3 text-slate-600 dark:text-brand-silver uppercase tracking-wider text-xs font-semibold">{t.status}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tour.departureDates.map((dep: any, i: number) => (
                        <tr key={i} className="border-t border-slate-200 dark:border-white/5 bg-white dark:bg-transparent">
                          <td className="px-6 py-4 text-slate-900 dark:text-white">{formatDate(dep.date)}</td>
                          <td className="px-6 py-4 text-slate-600 dark:text-brand-silver">{dep.spotsLeft ?? '—'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${dep.status === 'Available' ? 'bg-green-500/20 text-green-400' :
                                dep.status === 'Limited' ? 'bg-yellow-500/20 text-yellow-400' :
                                  dep.status === 'Full' ? 'bg-red-500/20 text-red-400' :
                                    'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white/60'
                              }`}>
                              {dep.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>

          {/* Right: Booking Sidebar (1/3) */}
          <div className="hidden lg:block lg:col-span-1">
            <BookingSidebar
              tourId={String(tour.id)}
              tourTitle={tour.title}
              pricing={tour.pricing}
              logistics={tour.logistics}
              duration={durationText}
              tourStatus={tour.tourStatus}
              locale={locale}
              programPDF={typeof tour.programPDF === 'object' ? tour.programPDF : undefined}
              whatsappNumber={siteSettings.whatsappNumber}
            />
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          TRAVEL STORY CAROUSEL — Drag-based 9:16 Cards
      ─────────────────────────────────────────────────────────── */}
      <section id="itinerary" className="relative z-10 scroll-mt-20 pt-4 md:pt-16 pb-12 md:pb-32">
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-left lg:text-center mb-6 md:mb-20 px-4 relative z-10">
          <span className="uppercase text-brand-blue font-semibold text-xs mb-4 block drop-shadow-md tracking-wider">
            {t.itinerary}
          </span>
          <h2 className="text-2xl md:text-6xl font-heading text-slate-900 dark:text-white mb-2 lg:mb-6 font-medium tracking-tight lg:tracking-wide"
            style={{ textShadow: '0 0 40px rgba(56,163,165,0.1)' }}
          >
            {t.dayByDay}
          </h2>
          {/* Only long programmes are a swipe */}
          {tour.storyDays?.length > 5 ? (
            <p className="text-slate-600 dark:text-white/50 font-light text-xl max-w-2xl mx-auto leading-relaxed">
              {t.swipe}
            </p>
          ) : null}
        </div>

        {hasStoryDays ? (
          <StoryCarousel itinerary={tour.storyDays as any[]} />
        ) : hasLegacyBlocks ? (
          <div className="px-4 md:px-12">
            <ItineraryTimeline blocks={tour.itineraryBlocks} />
          </div>
        ) : (
          <div className="text-center text-slate-500 dark:text-white/30 italic py-12 relative z-10">
            {t.detailsSoon}
          </div>
        )}

        {/* Relocated PDF Download Button */}
        {typeof tour.programPDF === 'object' && tour.programPDF?.url && (
          <div className="mt-16 flex justify-center px-4 relative z-20">
            <a
              href={tour.programPDF.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-brand-blue/10 border border-brand-blue/30 hover:bg-brand-blue/20 text-brand-blue px-8 py-4 rounded-full font-medium text-base transition-all max-w-sm w-full md:w-auto backdrop-blur-sm"
            >
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Télécharger le Programme (PDF)
            </a>
          </div>
        )}
      </section>

      {/* ──────────────────────────────────────────────────────────
          WHAT IS INCLUDED
      ─────────────────────────────────────────────────────────── */}
      {tour.pricing?.priceIncludes?.length > 0 && (
        <section className="relative px-4 md:px-6 pb-10 md:pb-28">
          <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none md:p-12">
            <h2 className="font-heading text-2xl font-medium tracking-tight text-slate-900 dark:text-white md:text-4xl">{t.includes}</h2>
            <ul className="mt-5 grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2 lg:mt-8 lg:grid-cols-3 lg:gap-y-4">
              {tour.pricing.priceIncludes.map((item: any, i: number) => (
                <li key={i} className="flex items-start gap-3 text-[15px] leading-snug text-slate-700 dark:text-white/80">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" strokeWidth={2.5} aria-hidden="true" />
                  {item.item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ──────────────────────────────────────────────────────────
          PHOTO GALLERY
      ─────────────────────────────────────────────────────────── */}
      {galleryImages.length > 0 && (
        <section className="relative hidden px-6 pb-8 lg:block">
          <div className="max-w-6xl mx-auto">
            <h2 className="mb-10 text-center font-heading text-4xl md:text-5xl font-medium tracking-tight text-slate-900 dark:text-white">
              {t.gallery}
            </h2>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {galleryImages.map((img: { url: string; alt: string }) => (
                <div
                  key={img.url}
                  className="group relative aspect-[4/5] w-[47%] overflow-hidden rounded-2xl bg-slate-200 dark:bg-white/5 md:w-[31%]"
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 47vw, 360px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ──────────────────────────────────────────────────────────
          BOOKING CTA SECTION
      ─────────────────────────────────────────────────────────── */}
      <section className="hidden lg:block py-32 text-center px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <span className="uppercase text-brand-blue font-semibold mb-4 text-sm block tracking-wider">
            {t.takeAction}
          </span>
          <h2 className="text-4xl md:text-5xl font-heading text-slate-900 dark:text-white mb-6 tracking-tight font-bold">
            {t.interested}
          </h2>
          <p className="text-slate-600 dark:text-white/50 text-lg font-light mb-10 max-w-2xl mx-auto leading-relaxed">
            {t.contactExperts}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(`Bonjour, je suis intéressé(e) par le circuit "${tour.title}". Pouvez-vous me donner plus d'informations ?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#25D366] hover:bg-[#25D366]/90 text-white px-10 py-5 rounded-full font-medium text-lg transition-all shadow-[0_4px_20px_rgba(37,211,102,0.3)]"
            >
              {t.bookWhatsapp}
            </a>
          </div>
        </div>
      </section>

      <TourMobileBar
        price={priceText}
        fallback={t.heroOnRequest}
        from={t.heroFrom}
        perPerson={t.heroPerPerson}
        book={t.heroBookShort}
        whatsappUrl={bookingUrl}
      />

      <Footer
        whatsappNumber={siteSettings.whatsappNumber}
        contactEmail={siteSettings.contactEmail}
        instagramUrl={siteSettings.instagramUrl}
      />
    </main>
  )
}
