import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/Footer'
import SubpageHero from '@/components/hero/SubpageHero'
import { getDictionary } from '@/i18n/dictionaries'

export const dynamic = 'force-dynamic'

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

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedSearchParams = await searchParams
  const locale = (resolvedSearchParams.locale as string) || 'fr'
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Our Destinations — Ça Crée Voyage' : 'Nos Destinations — Ça Crée Voyage',
    description: isEn ? 'From Morocco to the world, find your next adventure.' : 'Du Maroc aux quatre coins du monde, trouvez votre prochaine aventure.',
  }
}

export default async function DestinationsPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const locale = (searchParams.locale as string) || 'fr';
  const t = getDictionary(locale).destinationsList;
  const payload = await getPayload({ config: configPromise })

  // Fetch all destinations
  const { docs: destinations } = await payload.find({
    collection: 'destinations',
    depth: 1,
    limit: 50,
    locale: locale as any,
  })

  // Fetch SubpageHeroes
  let heroData: any = {}
  try {
    const globals = await payload.findGlobal({
      slug: 'subpage-heroes',
      depth: 1,
      locale: locale as any,
    }) as any
    if (globals?.destinationsHero) {
      heroData = globals.destinationsHero
    }
  } catch {
    // Component will show fallback
  }

  const backgroundMedia = heroData.backgroundMedia
  const backgroundUrl = typeof backgroundMedia === 'object' && backgroundMedia?.url ? backgroundMedia.url : undefined
  const isVideo = typeof backgroundMedia === 'object' && backgroundMedia?.mimeType?.startsWith('video')

  return (
    <main className="relative w-full min-h-screen bg-slate-50 dark:bg-[#0B132B] transition-colors duration-700 overflow-x-clip">
      {/* ── SUBPAGE HERO ── */}
      <SubpageHero 
        title={heroData.title || t.title}
        subtitle={heroData.subtitle || t.explore}
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

      {/* ── SCOPE FILTERS ── */}
      <section className="relative w-full pt-12 pb-8 px-4 text-center overflow-clip">
        <div className="relative z-10 flex justify-center gap-4">
          <Link
            href="/destinations/international"
            className="px-6 py-3 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none backdrop-blur-xl text-slate-700 dark:text-white/80 text-sm uppercase tracking-widest font-medium hover:bg-slate-50 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300"
          >
            International
          </Link>
          <Link
            href="/destinations/national"
            className="px-6 py-3 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none backdrop-blur-xl text-slate-700 dark:text-white/80 text-sm uppercase tracking-widest font-medium hover:bg-slate-50 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300"
          >
            Maroc
          </Link>
        </div>
      </section>

      {/* ── DESTINATIONS GRID ── */}
      <section className="relative w-full px-4 md:px-12 lg:px-20 pb-32">
        {/* Ambient Glow */}
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />

        {destinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
            {destinations.map((dest) => {
              const headerMedia = dest.headerMedia
              const headerUrl = typeof headerMedia === 'object' && headerMedia?.url ? headerMedia.url : null
              const isVideo = typeof headerMedia === 'object' && headerMedia?.mimeType?.startsWith('video')

              return (
                <Link
                  key={dest.id}
                  href={`/destinations/${dest.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-sm shadow-xl dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)] hover:shadow-2xl dark:hover:shadow-[0_16px_60px_rgba(56,163,165,0.15)] hover:border-slate-300 dark:hover:border-white/20 transition-all duration-500"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    {headerUrl && isVideo ? (
                      <video
                        src={headerUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : headerUrl ? (
                      <Image
                        src={headerUrl}
                        alt={dest.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0B132B] via-[#1a2744] to-[#0B132B]">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-brand-blue/8 rounded-full blur-[80px]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-50/90 via-slate-50/30 dark:from-[#0B132B]/90 dark:via-[#0B132B]/30 to-transparent z-10" />

                    {/* Theme Badge */}
                    {dest.theme && (
                      <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 text-slate-700 dark:text-white/80 text-[10px] uppercase tracking-widest font-medium shadow-sm dark:shadow-none">
                          {locale === 'en' ? (themeLabelEn[dest.theme] || dest.theme) : (themeLabel[dest.theme] || dest.theme)}
                        </span>
                      </div>
                    )}

                    {/* Scope Badge */}
                    <div className="absolute top-4 right-4 z-20">
                      <span className={`px-3 py-1 rounded-full backdrop-blur-xl border text-[10px] uppercase tracking-widest font-medium ${
                        dest.scope === 'international'
                          ? 'bg-brand-blue/15 border-brand-blue/30 text-brand-blue'
                          : 'bg-brand-gold/15 border-brand-gold/30 text-brand-gold'
                      }`}>
                        {dest.scope === 'international' ? 'International' : (locale === 'en' ? 'Morocco' : 'Maroc')}
                      </span>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 z-20">
                      <div className="bg-white/70 dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/20 rounded-2xl px-5 py-4 inline-block shadow-lg dark:shadow-none">
                        <h3 className="text-2xl md:text-3xl font-serif text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow-md">
                          {dest.title}
                        </h3>
                        {dest.description && (
                          <p className="text-slate-600 dark:text-white/50 text-xs font-light mt-1 line-clamp-2">{dest.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center relative z-10">
            <h2 className="text-3xl font-serif text-slate-900 dark:text-white mb-4">{t.emptyTitle}</h2>
            <p className="text-slate-600 dark:text-white/40">{t.emptySubtitle}</p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}
