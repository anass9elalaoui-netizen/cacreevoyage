import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

const themeLabel: Record<string, string> = {
  ocean: 'Océan',
  desert: 'Désert',
  mountain: 'Montagne',
  culture: 'Culture',
  forest_nature: 'Forêt & Nature',
}

export default async function InternationalDestinationsPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: destinations } = await payload.find({
    collection: 'destinations',
    where: { scope: { equals: 'international' } },
    depth: 1,
    limit: 50,
  })

  return (
    <main className="relative w-full min-h-screen bg-slate-50 dark:bg-[#0B132B] transition-colors duration-700 overflow-x-hidden">
      {/* ── HERO HEADER ── */}
      <section className="relative w-full pt-40 pb-20 px-4 md:px-12 lg:px-20 text-center overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-blue/8 rounded-full blur-[180px] pointer-events-none" />

        <span className="relative z-10 uppercase tracking-[0.3em] text-brand-blue font-semibold text-xs mb-4 block drop-shadow-md">
          Destinations
        </span>
        <h1
          className="relative z-10 text-6xl md:text-8xl font-serif text-slate-900 dark:text-white tracking-tighter leading-none mb-6"
          style={{ textShadow: '0 0 60px rgba(56,163,165,0.15), 0 4px 20px rgba(0,0,0,0.5)' }}
        >
          Évasions Internationales
        </h1>
        <p className="relative z-10 text-slate-600 dark:text-white/50 text-lg md:text-xl font-light max-w-2xl mx-auto">
          Explorez nos plus belles destinations à travers le monde.
        </p>
      </section>

      {/* ── GRID ── */}
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
                  className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-lg dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)] hover:shadow-xl dark:hover:shadow-[0_16px_60px_rgba(56,163,165,0.15)] hover:border-slate-300 dark:hover:border-white/20 transition-all duration-500"
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
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-200 dark:from-[#0B132B] via-slate-300 dark:via-[#1a2744] to-slate-200 dark:to-[#0B132B]">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-brand-blue/8 rounded-full blur-[80px]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/60 dark:from-[#0B132B]/90 dark:via-[#0B132B]/30 to-transparent z-10" />

                    {/* Theme Badge */}
                    {dest.theme && (
                      <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 text-slate-700 dark:text-white/80 text-[10px] uppercase tracking-widest font-medium shadow-sm dark:shadow-none">
                          {themeLabel[dest.theme] || dest.theme}
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-6 left-6 right-6 z-20">
                      <div className="bg-white/80 dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/20 rounded-2xl px-5 py-4 inline-block shadow-sm dark:shadow-none">
                        <h3 className="text-2xl md:text-3xl font-serif text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow-md">
                          {dest.title}
                        </h3>
                        {dest.description && (
                          <p className="text-slate-500 dark:text-white/50 text-xs font-light mt-1 line-clamp-2">{dest.description}</p>
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
            <h2 className="text-3xl font-serif text-slate-900 dark:text-white mb-4">Aucune destination pour le moment</h2>
            <p className="text-slate-600 dark:text-white/40">Nos experts préparent actuellement nos itinéraires internationaux.</p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}
