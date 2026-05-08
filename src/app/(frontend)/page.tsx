import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import DestinationSwiper from '@/components/DestinationSwiper'
import ReelsShowcase from '@/components/ReelsShowcase'
import Footer from '@/components/Footer'
import HeroGallery from '@/components/HeroGallery'
import TrustStats from '@/components/TrustStats'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import DestinationTestimonials from '@/components/DestinationTestimonials'
import FeaturedToursGrid from '@/components/FeaturedToursGrid'
import FAQAccordion from '@/components/FAQAccordion'

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  // Fetch international destinations
  const { docs: internationalDestinations } = await payload.find({
    collection: 'destinations',
    where: { scope: { equals: 'international' } },
    depth: 1,
    limit: 20,
  })

  // Fetch national (Maroc) destinations
  const { docs: nationalDestinations } = await payload.find({
    collection: 'destinations',
    where: { scope: { equals: 'national' } },
    depth: 1,
    limit: 20,
  })

  // Fetch featured tours
  const { docs: featuredTours } = await payload.find({
    collection: 'tours',
    where: { isFeatured: { equals: true } },
    depth: 1,
    limit: 6,
    sort: 'featuredOrder',
  })

  // Fallback: if no featured tours, get latest tours
  const toursToShow = featuredTours.length > 0 ? featuredTours : (await payload.find({
    collection: 'tours',
    depth: 1,
    limit: 6,
    sort: '-createdAt',
  })).docs

  // Fetch highlighted testimonials
  const { docs: testimonials } = await payload.find({
    collection: 'testimonials',
    depth: 1,
    limit: 10,
  })

  // Fetch trust stats from SiteSettings
  let trustStats: { number: string; label: string }[] = []
  try {
    const settings = await payload.findGlobal({ slug: 'site-settings' }) as any
    if (settings?.trustStats && settings.trustStats.length > 0) {
      trustStats = settings.trustStats
    }
  } catch {
    // Fallback to defaults in component
  }

  // Fetch HeroGallery panels
  let heroPanels: any[] = []
  try {
    const heroGallery = await payload.findGlobal({
      slug: 'hero-gallery',
      depth: 1,
    }) as any
    if (heroGallery?.panels && heroGallery.panels.length > 0) {
      heroPanels = heroGallery.panels
    }
  } catch {
    // No hero gallery configured yet — component will show fallback
  }

  return (
    <main className="relative w-full min-h-screen flex flex-col overflow-x-hidden">
      {/* ──────────────────────────────────────────────────────────
          HERO SECTION — Cinematic 4-panel video gallery
      ─────────────────────────────────────────────────────────── */}
      <HeroGallery panels={heroPanels} />

      {/* ──────────────────────────────────────────────────────────
          TRUST STATS — Animated counter bar
      ─────────────────────────────────────────────────────────── */}
      <TrustStats stats={trustStats.length > 0 ? trustStats : undefined} />

      {/* ──────────────────────────────────────────────────────────
          ROW 1 — ÉVASIONS INTERNATIONALES
      ─────────────────────────────────────────────────────────── */}
      <div className="relative bg-[#0B132B] w-full">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none" />
        <DestinationSwiper
          destinations={internationalDestinations as any[]}
          title="Évasions Internationales"
          subtitle="Découvrez le monde"
        />
      </div>

      {/* ──────────────────────────────────────────────────────────
          ROW 2 — TRÉSORS DU MAROC
      ─────────────────────────────────────────────────────────── */}
      <div className="relative bg-[#0B132B] w-full">
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />
        <DestinationSwiper
          destinations={nationalDestinations as any[]}
          title="Trésors du Maroc"
          subtitle="L'âme du royaume"
        />
      </div>

      {/* ──────────────────────────────────────────────────────────
          FEATURED TOURS GRID
      ─────────────────────────────────────────────────────────── */}
      {toursToShow.length > 0 && (
        <FeaturedToursGrid tours={toursToShow as any[]} />
      )}

      {/* ──────────────────────────────────────────────────────────
          VIDEO TESTIMONIALS BY DESTINATION
      ─────────────────────────────────────────────────────────── */}
      {testimonials && testimonials.length > 0 && (
        <DestinationTestimonials testimonials={testimonials as any[]} />
      )}

      {/* ──────────────────────────────────────────────────────────
          TESTIMONIALS CAROUSEL (TEXT)
      ─────────────────────────────────────────────────────────── */}
      {testimonials && testimonials.length > 0 && (
        <TestimonialsCarousel testimonials={testimonials.map((t: any) => ({
          id: t.id,
          travelerName: t.travelerName || t.clientName || 'Voyageur',
          travelerOrigin: t.travelerOrigin,
          travelerPhoto: typeof t.travelerPhoto === 'object' ? t.travelerPhoto : null,
          rating: t.rating || 5,
          testimonialText: t.testimonialText || '',
          platform: t.platform,
        }))} />
      )}

      {/* ──────────────────────────────────────────────────────────
          SUR MESURE PHILOSOPHY BLOCK
      ─────────────────────────────────────────────────────────── */}
      <section className="relative w-full py-32 bg-brand-dark overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[180px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left — Text */}
          <div>
            <span className="uppercase tracking-[0.2em] text-brand-gold text-xs font-sans font-medium mb-4 block">
              Notre Philosophie
            </span>
            <h2 className="font-serif text-4xl md:text-6xl text-white mb-8 leading-[1.1]">
              Chaque voyage est une œuvre unique
            </h2>
            <p className="text-brand-silver text-lg leading-relaxed mb-8">
              Chez Ça Crée Voyage, nous ne proposons pas de voyages standard. 
              Chaque itinéraire est conçu sur-mesure, du premier sourire à la dernière 
              étoile, pour créer des souvenirs qui vous ressemblent.
            </p>
            <div className="space-y-4">
              {[
                '🧭 Itinéraires 100% personnalisés',
                '🏨 Hébergements triés sur le volet',
                '🗺️ Guides locaux passionnés',
                '✨ Attention aux moindres détails',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/80 text-sm font-sans">
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Link
              href="/sur-mesure"
              className="inline-block mt-10 bg-brand-gold/20 border border-brand-gold/30 hover:bg-brand-gold/30 text-brand-gold px-8 py-4 rounded-full font-sans text-sm uppercase tracking-[0.1em] font-medium transition-all duration-300"
            >
              Créer votre voyage sur-mesure
            </Link>
          </div>

          {/* Right — Decorative glass cards */}
          <div className="relative hidden lg:block">
            <div className="absolute top-0 right-0 w-64 h-80 rounded-3xl bg-white/5 border border-white/8 backdrop-blur-md transform rotate-3 translate-x-4" />
            <div className="absolute top-8 right-8 w-64 h-80 rounded-3xl bg-white/5 border border-white/8 backdrop-blur-md transform -rotate-2" />
            <div className="relative w-64 h-80 rounded-3xl bg-white/8 border border-white/12 backdrop-blur-md flex items-center justify-center transform translate-x-12 translate-y-4">
              <span className="font-serif text-6xl text-brand-gold/60">✦</span>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          FAQ SECTION
      ─────────────────────────────────────────────────────────── */}
      <FAQAccordion />

      {/* ──────────────────────────────────────────────────────────
          FINAL CTA SECTION
      ─────────────────────────────────────────────────────────── */}
      <section className="relative w-full py-32 bg-brand-deeper flex justify-center px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative z-20 flex flex-col items-center text-center p-12 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/10 max-w-4xl w-full">
          <h2 className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-tighter drop-shadow-md">
            Prêt à partir ?
          </h2>
          <p className="text-white/80 text-xl font-light mb-10 max-w-xl mx-auto">
            Contactez nos experts pour dessiner le voyage qui ne ressemble qu&apos;à vous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/sur-mesure"
              className="inline-block bg-brand-blue hover:bg-brand-blue/90 text-white px-10 py-5 rounded-full font-medium text-lg transition-all shadow-[0_0_30px_rgba(56,163,165,0.3)] hover:shadow-[0_0_40px_rgba(56,163,165,0.5)]"
            >
              Créer mon voyage
            </Link>
            <a
              href="https://wa.me/212661373347?text=Bonjour, je souhaite en savoir plus sur vos voyages"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#25D366]/20 border border-[#25D366]/30 hover:bg-[#25D366]/30 text-[#25D366] px-10 py-5 rounded-full font-medium text-lg transition-all"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <Footer />
    </main>
  )
}
