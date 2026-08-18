import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/Footer'
import { getDictionary } from '@/i18n/dictionaries'
import { DestinationInspiration } from '@/components/ui/destination-inspiration'
export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DestinationPage({ params, searchParams }: Args) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const locale = (resolvedSearchParams.locale as string) || 'fr'
  const t = getDictionary(locale).destinationPage
  const payload = await getPayload({ config: configPromise })

  // 1. Fetch the Destination record by slug (case-insensitive via lowercase)
  const { docs: destDocs } = await payload.find({
    collection: 'destinations',
    where: { slug: { equals: slug.toLowerCase() } },
    depth: 1,
    limit: 1,
    locale: locale as any,
  })

  const destination = destDocs[0]
  if (!destination) return notFound()

  // 2. Fetch all Tours belonging to this destination
  const { docs: allTours } = await payload.find({
    collection: 'tours',
    where: { destination: { equals: destination.id } },
    depth: 2,
    limit: 24,
    locale: locale as any,
  })

  // 3. Filter to only show tours that are open for bookings
  const activeTours = allTours.filter((tour: any) => tour.isAvailable === true)

  // Resolve header media URL
  const headerMedia = destination.headerMedia
  const headerUrl = typeof headerMedia === 'object' && headerMedia?.url ? headerMedia.url : null
  const isVideo = typeof headerMedia === 'object' && headerMedia?.mimeType?.startsWith('video')


  // Theme label mapping
  const themeLabel: Record<string, string> = {
    ocean: 'Océan',
    desert: 'Désert',
    mountain: 'Montagne',
    culture: 'Culture',
    forest_nature: 'Forêt & Nature',
  }
  const themeLabelEn: Record<string, string> = {
    ocean: 'Ocean',
    desert: 'Desert',
    mountain: 'Mountain',
    culture: 'Culture',
    forest_nature: 'Forest & Nature',
  }

  return (
    <main className="relative w-full min-h-screen bg-slate-50 dark:bg-[#0B132B] transition-colors duration-700 overflow-x-hidden">
      {activeTours.length === 0 ? (
        <DestinationInspiration destination={destination} />
      ) : (
        <>
          {/* ──────────────────────────────────────────────────────────
              CINEMATIC HEADER BANNER
          ─────────────────────────────────────────────────────────── */}
          <section className="relative w-full h-[70vh] overflow-hidden bg-slate-100 dark:bg-brand-dark flex-shrink-0 transition-colors duration-700">
        {/* Header Media */}
        {headerUrl && isVideo ? (
          <video
            src={headerUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        ) : headerUrl ? (
          <Image
            src={headerUrl}
            alt={destination.title}
            fill
            priority
            className="object-cover z-0"
          />
        ) : (
          /* Cinematic gradient fallback — NEVER a white page */
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 dark:from-[#0B132B] via-slate-300 dark:via-[#1a2744] to-slate-200 dark:to-[#0B132B]" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/8 rounded-full blur-[180px]" />
            <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-brand-blue/5 rounded-full blur-[120px]" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/60 dark:from-[#0B132B] dark:via-[#0B132B]/60 to-transparent z-10" />

        {/* Centered Text */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-20 px-4 text-center">
          {destination.theme && (
            <span className="uppercase text-brand-blue font-semibold text-xs mb-4 drop-shadow-md tracking-wider">
              {locale === 'en' ? (themeLabelEn[destination.theme] || destination.theme) : (themeLabel[destination.theme] || destination.theme)}
            </span>
          )}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading text-slate-900 dark:text-white leading-none mb-6 drop-shadow-sm dark:drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)] font-medium tracking-wide"
              style={{ textShadow: '0 0 60px rgba(56,163,165,0.15), 0 4px 20px rgba(0,0,0,0.5)' }}
          >
            {destination.title}
          </h1>
          {destination.description && (
            <p className="text-slate-700 dark:text-white/60 text-lg md:text-xl font-light max-w-2xl drop-shadow-sm dark:drop-shadow-md mb-8 leading-relaxed">
              {destination.description}
            </p>
          )}

          {/* Download PDF Program */}
          {destination.programPDF?.url && (
            <a
              href={destination.programPDF.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-3 bg-[#D4AF37]/20 border border-[#D4AF37]/40 hover:bg-[#D4AF37]/30 text-[#D4AF37] px-8 py-3.5 rounded-full font-medium transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] backdrop-blur-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Télécharger le Guide PDF
            </a>
          )}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          TOURS GRID — Dark Luxury Theme
      ─────────────────────────────────────────────────────────── */}
      <section id="circuits" className="relative z-10 py-24 px-4 md:px-12 lg:px-20">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-brand-blue/3 rounded-full blur-[120px] pointer-events-none" />

        <div className="mb-16 flex items-end justify-between relative z-10">
              <div>
                <span className="uppercase text-brand-blue font-semibold text-xs mb-3 block tracking-wider">
                  {t.toursLabel}
                </span>
                <h2 className="text-4xl md:text-5xl font-heading text-slate-900 dark:text-white mb-2 tracking-tight font-bold">
                  {t.ourTours}
                </h2>
                <p className="text-slate-600 dark:text-white/40 font-light text-lg leading-relaxed">
                  {activeTours.length} {t.itinerariesAvailable}
                </p>
              </div>
              <Link
                href="/sur-mesure"
                className="hidden md:inline-flex items-center gap-2 text-brand-blue font-medium hover:text-slate-900 dark:hover:text-white transition-colors text-sm"
              >
                {t.customTour}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
              {activeTours.map((tour) => {
                const thumb = typeof tour.thumbnail === 'object' && tour.thumbnail?.url
                  ? tour.thumbnail.url
                  : null

                return (
                  <Link
                    key={tour.id}
                    href={`/tours/${tour.slug}`}
                    className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-lg dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)] hover:shadow-xl dark:hover:shadow-[0_16px_60px_rgba(56,163,165,0.15)] hover:border-slate-300 dark:hover:border-white/20 transition-all duration-500"
                  >
                    {/* Tour Image */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-200/50 dark:bg-brand-dark/30">
                      {thumb ? (
                        <Image
                          src={thumb}
                          alt={tour.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-200 dark:from-[#0B132B] to-slate-300 dark:to-[#1a2744]">
                          <span className="text-slate-400 dark:text-white/20 font-heading italic text-sm">{t.imageComingSoon}</span>
                        </div>
                      )}

                      {/* Gradient Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-[#0B132B]/90 via-transparent to-transparent z-10" />

                      {/* Duration Badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <span className="px-4 py-1.5 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 text-slate-700 dark:text-white text-xs font-medium shadow-sm dark:shadow-none">
                          {tour.duration}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-8 flex flex-col gap-3 flex-1">
                      <h3 className="text-2xl font-heading text-slate-900 dark:text-white group-hover:text-brand-blue transition-colors duration-300 leading-tight">
                        {tour.title}
                      </h3>
                      {tour.excerpt && (
                        <p className="text-slate-500 dark:text-white/40 font-light text-sm leading-relaxed line-clamp-3">
                          {tour.excerpt}
                        </p>
                      )}
                      <div className="mt-auto pt-4 flex items-center gap-2 text-brand-blue font-medium text-sm">
                        {t.viewItinerary}
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
      </section>
      </>
      )}

      {/* ── FOOTER ── */}
      <Footer />
    </main>
  )
}
