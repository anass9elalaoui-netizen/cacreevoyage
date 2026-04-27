import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import ItineraryTimeline from '@/components/ItineraryTimeline'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    slug: string
  }>
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

  const tour = docs[0]
  if (!tour) return notFound()

  const heroVideoUrl = typeof tour.heroVideo === 'object' && tour.heroVideo?.url ? tour.heroVideo.url : null
  const thumbnailUrl = typeof tour.thumbnail === 'object' && tour.thumbnail?.url ? tour.thumbnail.url : null

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
        
        {/* Dark Overlay gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/40 to-transparent z-10" />

        {/* Glass Card Content */}
        <div className="relative z-20 glass-card p-10 md:p-14 w-[90%] max-w-4xl text-center flex flex-col items-center transform translate-y-16">
          <span className="uppercase tracking-widest text-brand-blue font-semibold mb-4 text-sm">
            {tour.scope === 'national' ? 'Maroc' : 'International'} • {tour.duration}
          </span>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 drop-shadow-md leading-tight"
              style={{ textShadow: '0 0 60px rgba(56,163,165,0.15), 0 4px 20px rgba(0,0,0,0.5)' }}
          >
            {tour.title}
          </h1>
          
          <p className="text-white/70 text-lg md:text-xl max-w-2xl font-light mb-12">
            {tour.excerpt}
          </p>

          <div className="w-px h-16 bg-gradient-to-b from-brand-blue to-transparent animate-pulse" />
          <span className="text-white/50 text-xs tracking-widest uppercase mt-4">Scroll to discover</span>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          ITINERARY TIMELINE SECTION 
      ─────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-32 px-4 md:px-12 mt-24">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center mb-24 relative z-10">
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6"
              style={{ textShadow: '0 0 40px rgba(56,163,165,0.1)' }}
          >
            Votre Itinéraire
          </h2>
          <p className="text-white/50 font-light text-xl">
            Jour par jour, une immersion au cœur de l'authenticité.
          </p>
        </div>

        {tour.itineraryBlocks && tour.itineraryBlocks.length > 0 ? (
          <ItineraryTimeline blocks={tour.itineraryBlocks} />
        ) : (
          <div className="text-center text-white/30 italic py-12">
            Détails de l'itinéraire bientôt disponibles.
          </div>
        )}
      </section>

      {/* ──────────────────────────────────────────────────────────
          BOOKING CTA SECTION
      ─────────────────────────────────────────────────────────── */}
      <section className="py-32 text-center px-4 relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="uppercase tracking-widest text-brand-blue font-semibold mb-4 text-sm block">
            Passez à l'action
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6"
              style={{ textShadow: '0 0 40px rgba(56,163,165,0.1)' }}
          >
            Interessé par ce voyage ?
          </h2>
          <p className="text-white/50 text-lg font-light mb-10 max-w-2xl mx-auto">
            Chaque itinéraire est une toile vierge. Contactez nos experts pour l'adapter à vos envies et créer un séjour qui ne ressemble qu'à vous.
          </p>
          <Link
            href={`/checkout?tour=${tour.id}&title=${encodeURIComponent(tour.title)}`}
            className="inline-block bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-md text-white px-10 py-5 rounded-full font-medium text-lg transition-all shadow-[0_0_30px_rgba(56,163,165,0.3)] hover:shadow-[0_0_40px_rgba(56,163,165,0.5)] hover:scale-105"
          >
            Réserver maintenant
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
