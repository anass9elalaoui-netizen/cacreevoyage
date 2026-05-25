import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Footer from '@/components/Footer'
import TourCard from '@/components/TourCard'
import HeroGallery from '@/components/HeroGallery'

export const metadata: Metadata = {
  title: 'Nos Circuits — Ça Crée Voyage',
  description: 'Découvrez notre collection de circuits et voyages d\'exception.',
}

export default async function ToursPage() {
  const payload = await getPayload({ config: configPromise })

  // Fetch all tours (limit to 50 for now)
  const { docs: tours } = await payload.find({
    collection: 'tours',
    depth: 1,
    limit: 50,
    sort: '-createdAt',
  })

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
    // No hero gallery configured yet
  }

  return (
    <>
      <main className="relative min-h-screen bg-brand-dark overflow-clip">
        {/* ── HERO GALLERY — 4-panel cinematic grid ── */}
        <HeroGallery panels={heroPanels} />

        {/* Ambient glows */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[150px] pointer-events-none" />

        {/* Cinematic Header */}
        <section className="relative pt-40 pb-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <span className="uppercase tracking-[0.2em] text-brand-gold text-xs font-sans font-medium mb-4 block">
              Collection Privée
            </span>
            <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 leading-[1.1]">
              Nos <span className="text-brand-blue">Circuits</span>
            </h1>
            <p className="text-brand-silver text-lg max-w-2xl mx-auto">
              Plongez dans notre sélection de voyages immersifs. 
              Chaque itinéraire est pensé pour éveiller vos sens et créer des souvenirs impérissables.
            </p>
          </div>
        </section>

        {/* Tours Grid */}
        <section className="relative pb-32 px-6">
          <div className="max-w-7xl mx-auto">
            {tours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tours.map((tour: any) => (
                  <TourCard
                    key={tour.id}
                    title={tour.title}
                    slug={tour.slug || tour.id}
                    shortDescription={tour.shortDescription || tour.tagline}
                    pricing={tour.pricing}
                    thumbnail={tour.thumbnail}
                    scope={tour.scope || 'international'}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                <span className="text-4xl block mb-4">✨</span>
                <h3 className="font-serif text-2xl text-white mb-2">De nouvelles destinations arrivent</h3>
                <p className="text-brand-silver">Nos experts préparent actuellement de nouveaux circuits.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
