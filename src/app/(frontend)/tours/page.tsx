import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Footer from '@/components/Footer'
import TourCard from '@/components/TourCard'
import SubpageHero from '@/components/hero/SubpageHero'
import { getDictionary } from '@/i18n/dictionaries'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
  const resolvedSearchParams = await searchParams
  const locale = (resolvedSearchParams.locale as string) || 'fr'
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Our Tours — Ça Crée Voyage' : 'Nos Circuits — Ça Crée Voyage',
    description: isEn ? 'Discover our collection of exceptional tours and journeys.' : 'Découvrez notre collection de circuits et voyages d\'exception.',
  }
}

export default async function ToursPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const locale = (searchParams.locale as string) || 'fr';
  const t = getDictionary(locale).toursList;
  const payload = await getPayload({ config: configPromise })

  // Fetch only available tours (limit to 50 for now)
  const { docs: tours } = await payload.find({
    collection: 'tours',
    depth: 1,
    limit: 50,
    sort: '-createdAt',
    locale: locale as any,
    where: {
      isAvailable: {
        equals: true,
      },
    },
  })

  // Fetch SubpageHeroes
  let heroData: any = {}
  try {
    const globals = await payload.findGlobal({
      slug: 'subpage-heroes',
      depth: 1,
      locale: locale as any,
    }) as any
    if (globals?.toursHero) {
      heroData = globals.toursHero
    }
  } catch {
    // Component will show fallback
  }

  const backgroundMedia = heroData.backgroundMedia
  const backgroundUrl = typeof backgroundMedia === 'object' && backgroundMedia?.url ? backgroundMedia.url : undefined
  const isVideo = typeof backgroundMedia === 'object' && backgroundMedia?.mimeType?.startsWith('video')

  return (
    <>
      <main className="relative min-h-screen bg-slate-50 dark:bg-brand-dark transition-colors duration-700 overflow-clip">
        {/* ── SUBPAGE HERO ── */}
        <SubpageHero 
          title={heroData.title || `${t.toursPrefix} ${t.toursHighlight}`}
          subtitle={heroData.subtitle || t.privateCollection}
          description={heroData.description}
          backgroundUrl={backgroundUrl}
          isVideo={isVideo}
          ctaLabel={heroData.ctaLabel}
          ctaHref={heroData.ctaHref}
          badge1Number={heroData.badgeStat1Number}
          badge1Label={heroData.badgeStat1Label}
          badge2Number={heroData.badgeStat2Number}
          badge2Label={heroData.badgeStat2Label}
        />

        {/* Ambient glows */}
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[150px] pointer-events-none" />

        {/* Tours Grid */}
        <section className="relative py-20 px-6">
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
              <div className="text-center py-20 bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
                <span className="text-4xl block mb-4 tracking-tight font-bold">✨</span>
                <h3 className="font-heading text-2xl text-slate-900 dark:text-white mb-2">{t.comingSoon}</h3>
                <p className="text-slate-600 dark:text-brand-silver leading-relaxed font-normal">{t.expertsPreparing}</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
