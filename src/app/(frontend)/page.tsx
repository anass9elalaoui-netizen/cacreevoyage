import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import DestinationSwiper from '@/components/DestinationSwiper'
import ReelsShowcase from '@/components/ReelsShowcase'
import Footer from '@/components/Footer'
import HeroGallery from '@/components/HeroGallery'

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

  // Fetch testimonials with depth 1 to resolve videoReel media
  const { docs: testimonials } = await payload.find({
    collection: 'testimonials',
    depth: 1,
    limit: 10,
  })

  return (
    <main className="relative w-full min-h-screen flex flex-col overflow-x-hidden">
      {/* ──────────────────────────────────────────────────────────
          HERO SECTION — Cinematic 4-panel video gallery
      ─────────────────────────────────────────────────────────── */}
      <HeroGallery />

      {/* ──────────────────────────────────────────────────────────
          ROW 1 — ÉVASIONS INTERNATIONALES
      ─────────────────────────────────────────────────────────── */}
      <div className="relative bg-[#0B132B] w-full">
        {/* Decorative ambient glow */}
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
          REELS SHOWCASE SECTION
      ─────────────────────────────────────────────────────────── */}
      <section className="relative w-full py-32 bg-brand-dark overflow-hidden">
        <div className="relative px-4 md:px-12 mb-8 flex flex-col items-center text-center">
          <span className="uppercase tracking-widest text-brand-blue font-semibold mb-4 text-sm drop-shadow-md">
            Témoignages
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-4 drop-shadow-lg">
            L'Expérience par Nos Voyageurs
          </h2>
          <p className="text-white/60 font-light text-xl tracking-wide max-w-2xl">
            Des moments authentiques capturés aux quatre coins du globe.
          </p>
        </div>

        {testimonials && testimonials.length > 0 ? (
          <ReelsShowcase testimonials={testimonials} />
        ) : (
          <div className="px-4 md:px-12 py-12 text-center">
            <p className="text-white/30 italic">Les témoignages arrivent bientôt.</p>
          </div>
        )}
      </section>

      {/* ──────────────────────────────────────────────────────────
          SUR MESURE CTA SECTION
      ─────────────────────────────────────────────────────────── */}
      <section className="relative w-full py-32 bg-brand-dark flex justify-center px-4">
        <div className="relative z-20 flex flex-col items-center text-center p-12 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/10 max-w-4xl w-full">
          <h2 className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-tighter drop-shadow-md">
            Prêt à partir ?
          </h2>
          <p className="text-white/80 text-xl font-light mb-10 max-w-xl mx-auto">
            Contactez nos experts pour dessiner le voyage qui ne ressemble qu'à vous.
          </p>
          <Link
            href="/sur-mesure"
            className="inline-block bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-md text-white px-10 py-5 rounded-full font-medium text-lg transition-all shadow-[0_0_30px_rgba(56,163,165,0.3)] hover:shadow-[0_0_40px_rgba(56,163,165,0.5)] hover:scale-105"
          >
            Créer mon voyage
          </Link>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          FOOTER
      ─────────────────────────────────────────────────────────── */}
      <Footer />
    </main>
  )
}
