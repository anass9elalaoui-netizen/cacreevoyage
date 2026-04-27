import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ slug: string }>
}

export default async function DestinationPage({ params }: Args) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  // 1. Fetch the Destination record by slug (case-insensitive via lowercase)
  const { docs: destDocs } = await payload.find({
    collection: 'destinations',
    where: { slug: { equals: slug.toLowerCase() } },
    depth: 1,
    limit: 1,
  })

  const destination = destDocs[0]
  if (!destination) return notFound()

  // 2. Fetch all Tours belonging to this destination
  const { docs: tours } = await payload.find({
    collection: 'tours',
    where: { destination: { equals: destination.id } },
    depth: 2,
    limit: 24,
  })

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

  return (
    <main className="relative w-full min-h-screen bg-[#0B132B] overflow-x-hidden">
      {/* ──────────────────────────────────────────────────────────
          CINEMATIC HEADER BANNER
      ─────────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[70vh] overflow-hidden bg-brand-dark flex-shrink-0">
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
            <div className="absolute inset-0 bg-gradient-to-br from-[#0B132B] via-[#1a2744] to-[#0B132B]" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/8 rounded-full blur-[180px]" />
            <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-brand-blue/5 rounded-full blur-[120px]" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/60 to-transparent z-10" />

        {/* Centered Text */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-20 px-4 text-center">
          {destination.theme && (
            <span className="uppercase tracking-[0.3em] text-brand-blue font-semibold text-xs mb-4 drop-shadow-md">
              {themeLabel[destination.theme] || destination.theme}
            </span>
          )}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white tracking-tighter leading-none mb-6 drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
              style={{ textShadow: '0 0 60px rgba(56,163,165,0.15), 0 4px 20px rgba(0,0,0,0.5)' }}
          >
            {destination.title}
          </h1>
          {destination.description && (
            <p className="text-white/60 text-lg md:text-xl font-light max-w-2xl drop-shadow-md">
              {destination.description}
            </p>
          )}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          TOURS GRID — Dark Luxury Theme
      ─────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-24 px-4 md:px-12 lg:px-20">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-brand-blue/3 rounded-full blur-[120px] pointer-events-none" />

        {tours.length > 0 ? (
          <>
            <div className="mb-16 flex items-end justify-between relative z-10">
              <div>
                <span className="uppercase tracking-[0.2em] text-brand-blue font-semibold text-xs mb-3 block">
                  Circuits
                </span>
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-2">
                  Nos Circuits
                </h2>
                <p className="text-white/40 font-light text-lg">
                  {tours.length} itinéraire{tours.length > 1 ? 's' : ''} disponible{tours.length > 1 ? 's' : ''}
                </p>
              </div>
              <Link
                href="/sur-mesure"
                className="hidden md:inline-flex items-center gap-2 text-brand-blue font-medium hover:text-white transition-colors text-sm"
              >
                Circuit sur mesure
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
              {tours.map((tour) => {
                const thumb = typeof tour.thumbnail === 'object' && tour.thumbnail?.url
                  ? tour.thumbnail.url
                  : null

                return (
                  <Link
                    key={tour.id}
                    href={`/tours/${tour.slug}`}
                    className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm shadow-[0_8px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_16px_60px_rgba(56,163,165,0.15)] hover:border-white/20 transition-all duration-500"
                  >
                    {/* Tour Image */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-dark/30">
                      {thumb ? (
                        <Image
                          src={thumb}
                          alt={tour.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0B132B] to-[#1a2744]">
                          <span className="text-white/20 font-serif italic text-sm">Image bientôt disponible</span>
                        </div>
                      )}

                      {/* Gradient Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/90 via-transparent to-transparent z-10" />

                      {/* Duration Badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs font-medium drop-shadow-md">
                          {tour.duration}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-8 flex flex-col gap-3 flex-1">
                      <h3 className="text-2xl font-serif text-white group-hover:text-brand-blue transition-colors duration-300 leading-tight">
                        {tour.title}
                      </h3>
                      {tour.excerpt && (
                        <p className="text-white/40 font-light text-sm leading-relaxed line-clamp-3">
                          {tour.excerpt}
                        </p>
                      )}
                      <div className="mt-auto pt-4 flex items-center gap-2 text-brand-blue font-medium text-sm">
                        Voir l'itinéraire
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        ) : (
          /* ── EMPTY STATE — Dark Luxury ── */
          <div className="flex flex-col items-center justify-center py-32 text-center relative z-10">
            <div className="w-20 h-20 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center mb-8">
              <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6"
                style={{ textShadow: '0 0 40px rgba(56,163,165,0.1)' }}
            >
              En cours de préparation
            </h2>
            <p className="text-white/50 font-light text-lg max-w-lg mb-10">
              Nos experts préparent actuellement de nouveaux itinéraires pour{' '}
              <strong className="font-medium text-white">{destination.title}</strong>.
              Contactez-nous pour un voyage entièrement sur mesure.
            </p>
            <Link
              href={`/sur-mesure?destination=${encodeURIComponent(destination.title)}`}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-md text-white px-10 py-4 rounded-full font-medium transition-all shadow-[0_0_30px_rgba(56,163,165,0.2)] hover:shadow-[0_0_40px_rgba(56,163,165,0.4)] hover:scale-105"
            >
              Demander un voyage sur mesure
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        )}
      </section>

      {/* ── FOOTER ── */}
      <Footer />
    </main>
  )
}
