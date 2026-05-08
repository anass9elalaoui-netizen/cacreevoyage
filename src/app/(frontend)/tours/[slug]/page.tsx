import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import Link from 'next/link'
import ItineraryTimeline from '@/components/ItineraryTimeline'
import StoryCarousel from '@/components/ui/StoryCarousel'
import Footer from '@/components/Footer'
import BookingSidebar from '@/components/BookingSidebar'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'tours',
    where: { slug: { equals: slug.toLowerCase() } },
    limit: 1,
    depth: 1,
  })
  const tour = docs[0] as any
  if (!tour) return { title: 'Circuit non trouvé' }

  return {
    title: tour.seo?.metaTitle || tour.title,
    description: tour.seo?.metaDescription || tour.excerpt,
  }
}

export default async function TourPage({ params }: Args) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'tours',
    where: { slug: { equals: slug.toLowerCase() } },
    depth: 2,
    limit: 1,
  })

  const tour = docs[0] as any
  if (!tour) return notFound()

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

  // Duration text
  const durationText = tour.logistics?.durationDays && tour.logistics?.durationNights
    ? `${tour.logistics.durationDays} Jours / ${tour.logistics.durationNights} Nuits`
    : tour.duration || ''

  return (
    <main className="relative w-full min-h-screen bg-[#0B132B] overflow-x-hidden">
      {/* ──────────────────────────────────────────────────────────
          HERO SECTION
      ─────────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[100vh] flex flex-col items-center justify-end pb-24 shrink-0">
        {/* Background Media */}
        {heroVideoUrl ? (
          <video
            src={heroVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        ) : thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={tour.title}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0B132B] via-[#1a2744] to-[#0B132B]" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/8 rounded-full blur-[180px]" />
          </div>
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/40 to-transparent z-10" />

        {/* Glass Card Content */}
        <div className="relative z-20 glass-card p-10 md:p-14 w-[90%] max-w-4xl text-center flex flex-col items-center transform translate-y-16">
          <span className="uppercase tracking-widest text-brand-blue font-semibold mb-4 text-sm">
            {tour.scope === 'national' ? 'Maroc' : 'International'} • {durationText}
          </span>

          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 drop-shadow-md leading-tight"
            style={{ textShadow: '0 0 60px rgba(56,163,165,0.15), 0 4px 20px rgba(0,0,0,0.5)' }}
          >
            {tour.title}
          </h1>

          <p className="text-white/70 text-lg md:text-xl max-w-2xl font-light mb-8">
            {tour.excerpt}
          </p>

          {/* Fixed Dates Badge */}
          {hasFixedDates && (
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-brand-blue/10 border border-brand-blue/25 mb-8">
              <svg className="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-white font-serif text-sm md:text-base">
                {formatDate(tour.departureDate)} — {formatDate(tour.returnDate)}
              </span>
            </div>
          )}

          <div className="w-px h-16 bg-gradient-to-b from-brand-blue to-transparent animate-pulse" />
          <span className="text-white/50 text-xs tracking-widest uppercase mt-4">Scroll to discover</span>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          MAIN CONTENT + SIDEBAR LAYOUT
      ─────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Main content (2/3) */}
          <div className="lg:col-span-2 space-y-20">
            {/* Tour Overview */}
            <section>
              <span className="uppercase tracking-[0.2em] text-brand-blue text-xs font-sans font-medium mb-4 block">
                Aperçu
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">
                À propos de ce circuit
              </h2>

              {/* Meta badges */}
              <div className="flex flex-wrap gap-3 mb-8">
                {durationText && (
                  <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/80">
                    🕐 {durationText}
                  </span>
                )}
                {tour.logistics?.maxGroupSize && (
                  <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/80">
                    👥 Max {tour.logistics.maxGroupSize} pers.
                  </span>
                )}
                {tour.logistics?.difficulty && (
                  <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/80">
                    ⭐ {tour.logistics.difficulty}
                  </span>
                )}
                {tour.logistics?.departureCity && (
                  <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/80">
                    📍 Départ: {tour.logistics.departureCity}
                  </span>
                )}
                {tour.seasons && tour.seasons.length > 0 && (
                  <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/80">
                    🌤️ {tour.seasons.join(', ')}
                  </span>
                )}
              </div>

              <p className="text-brand-silver text-base leading-relaxed">
                {tour.shortDescription || tour.excerpt}
              </p>
            </section>

            {/* Includes / Excludes */}
            {(tour.pricing?.priceIncludes?.length > 0 || tour.pricing?.priceExcludes?.length > 0) && (
              <section>
                <h2 className="font-serif text-3xl text-white mb-8">Ce qui est inclus</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {tour.pricing?.priceIncludes?.length > 0 && (
                    <div className="rounded-2xl p-6 bg-white/5 border border-white/8">
                      <h3 className="text-white font-medium text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">✓</span>
                        Inclus
                      </h3>
                      <ul className="space-y-2">
                        {tour.pricing.priceIncludes.map((item: any, i: number) => (
                          <li key={i} className="text-brand-silver text-sm flex items-start gap-2">
                            <span className="text-green-400 mt-0.5">•</span>
                            {item.item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {tour.pricing?.priceExcludes?.length > 0 && (
                    <div className="rounded-2xl p-6 bg-white/5 border border-white/8">
                      <h3 className="text-white font-medium text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-xs">✕</span>
                        Non inclus
                      </h3>
                      <ul className="space-y-2">
                        {tour.pricing.priceExcludes.map((item: any, i: number) => (
                          <li key={i} className="text-brand-silver text-sm flex items-start gap-2">
                            <span className="text-red-400 mt-0.5">•</span>
                            {item.item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Departure dates table */}
            {tour.departureDates && tour.departureDates.length > 0 && (
              <section>
                <h2 className="font-serif text-3xl text-white mb-8">Dates de départ</h2>
                <div className="rounded-2xl border border-white/8 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white/5">
                        <th className="text-left px-6 py-3 text-brand-silver uppercase tracking-wider text-xs font-medium">Date</th>
                        <th className="text-left px-6 py-3 text-brand-silver uppercase tracking-wider text-xs font-medium">Places</th>
                        <th className="text-left px-6 py-3 text-brand-silver uppercase tracking-wider text-xs font-medium">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tour.departureDates.map((dep: any, i: number) => (
                        <tr key={i} className="border-t border-white/5">
                          <td className="px-6 py-4 text-white">{formatDate(dep.date)}</td>
                          <td className="px-6 py-4 text-brand-silver">{dep.spotsLeft ?? '—'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              dep.status === 'Available' ? 'bg-green-500/20 text-green-400' :
                              dep.status === 'Limited' ? 'bg-yellow-500/20 text-yellow-400' :
                              dep.status === 'Full' ? 'bg-red-500/20 text-red-400' :
                              'bg-white/10 text-white/60'
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
          <div className="lg:col-span-1">
            <BookingSidebar
              tourId={String(tour.id)}
              tourTitle={tour.title}
              pricing={tour.pricing}
              logistics={tour.logistics}
              duration={durationText}
              tourStatus={tour.tourStatus}
            />
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          TRAVEL STORY CAROUSEL — Drag-based 9:16 Cards
      ─────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-24 md:py-32">
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-20 px-4 relative z-10">
          <span className="uppercase tracking-[0.3em] text-brand-blue font-semibold text-xs mb-4 block drop-shadow-md">
            Itinéraire
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6"
              style={{ textShadow: '0 0 40px rgba(56,163,165,0.1)' }}
          >
            Votre Voyage, Jour par Jour
          </h2>
          <p className="text-white/50 font-light text-xl max-w-2xl mx-auto">
            Glissez pour explorer chaque étape de votre aventure.
          </p>
        </div>

        {hasStoryDays ? (
          <StoryCarousel itinerary={tour.storyDays as any[]} />
        ) : hasLegacyBlocks ? (
          <div className="px-4 md:px-12">
            <ItineraryTimeline blocks={tour.itineraryBlocks} />
          </div>
        ) : (
          <div className="text-center text-white/30 italic py-12 relative z-10">
            Détails de l&apos;itinéraire bientôt disponibles.
          </div>
        )}
      </section>

      {/* ──────────────────────────────────────────────────────────
          BOOKING CTA SECTION
      ─────────────────────────────────────────────────────────── */}
      <section className="py-32 text-center px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <span className="uppercase tracking-widest text-brand-blue font-semibold mb-4 text-sm block">
            Passez à l&apos;action
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
            Intéressé par ce voyage ?
          </h2>
          <p className="text-white/50 text-lg font-light mb-10 max-w-2xl mx-auto">
            Contactez nos experts pour l&apos;adapter à vos envies et créer un séjour qui ne ressemble qu&apos;à vous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/212661373347?text=${encodeURIComponent(`Bonjour, je suis intéressé(e) par le circuit "${tour.title}". Pouvez-vous me donner plus d'informations ?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#25D366] hover:bg-[#25D366]/90 text-white px-10 py-5 rounded-full font-medium text-lg transition-all shadow-[0_4px_20px_rgba(37,211,102,0.3)]"
            >
              💬 Réserver via WhatsApp
            </a>
            <Link
              href="/sur-mesure"
              className="inline-block bg-white/10 border border-white/20 hover:bg-white/20 text-white px-10 py-5 rounded-full font-medium text-lg transition-all"
            >
              Personnaliser ce voyage
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
