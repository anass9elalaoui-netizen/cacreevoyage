import type { Metadata } from 'next'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'À Propos — Notre Histoire',
  description: "Découvrez l'histoire de Ça Crée Voyage, agence de voyages de luxe sur-mesure basée au Maroc.",
}

export default function AboutPage() {
  const philosophyPillars = [
    {
      icon: (
        <svg className="w-12 h-12 text-brand-blue" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
      title: "L'Excellence",
      description: "Chaque détail est pensé pour offrir une expérience irréprochable, de la première prise de contact jusqu'au retour.",
    },
    {
      icon: (
        <svg className="w-12 h-12 text-brand-blue" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
        </svg>
      ),
      title: "L'Authenticité",
      description: "Nous privilégions les rencontres humaines et les immersions culturelles pour des voyages qui touchent l'âme.",
    },
    {
      icon: (
        <svg className="w-12 h-12 text-brand-blue" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: 'Le Sur-Mesure',
      description: "Chaque voyage est unique, conçu autour de vos rêves, vos envies et votre rythme.",
    },
  ]

  return (
    <>
      <main className="relative min-h-screen bg-slate-50 dark:bg-brand-dark transition-colors duration-700 overflow-hidden">
        {/* ── Hero Section ── */}
        <section className="relative pt-32 pb-24 px-6">
          <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-brand-blue/6 rounded-full blur-[150px] pointer-events-none" />
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl">
              <span className="uppercase tracking-[0.2em] text-brand-blue text-xs font-sans font-medium mb-4 block">
                Notre Histoire
              </span>
              <h1 className="font-serif text-5xl md:text-7xl text-slate-900 dark:text-white leading-[1.1] mb-8">
                L&apos;Art du Voyage Créé
              </h1>
              <p className="text-slate-600 dark:text-brand-silver text-lg md:text-xl leading-relaxed max-w-2xl">
                Fondée au cœur du Maroc, Ça Crée Voyage est née d&apos;une passion simple : 
                transformer le voyage en œuvre d&apos;art. Nous croyons que chaque destination 
                raconte une histoire, et que chaque voyageur mérite de la vivre pleinement.
              </p>
            </div>
          </div>
        </section>

        {/* ── Philosophy Pillars ── */}
        <section className="relative py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {philosophyPillars.map((pillar, index) => (
                <div
                  key={index}
                  className="rounded-3xl p-8 md:p-10 border border-slate-200 dark:border-white/10 transition-all duration-300 hover:border-brand-blue/30 bg-white dark:bg-white/5 shadow-sm dark:shadow-none"
                  style={{
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <div className="mb-6">{pillar.icon}</div>
                  <h3 className="font-serif text-2xl md:text-3xl text-slate-900 dark:text-white mb-4">
                    {pillar.title}
                  </h3>
                  <p className="text-slate-600 dark:text-brand-silver text-sm md:text-base leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Section ── */}
        <section className="relative py-24 px-6 bg-slate-100 dark:bg-brand-deeper transition-colors duration-700">
          <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-brand-gold/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="font-serif text-4xl md:text-6xl text-slate-900 dark:text-white mb-6">
              Prêt à créer votre voyage ?
            </h2>
            <p className="text-slate-600 dark:text-brand-silver text-lg mb-10">
              Parlez-nous de vos rêves et laissez-nous les transformer en réalité.
            </p>
            <a
              href="/sur-mesure"
              className="inline-block bg-brand-blue hover:bg-brand-blue/90 text-white px-10 py-4 rounded-full font-sans text-sm uppercase tracking-[0.1em] font-medium transition-all duration-300 shadow-[0_4px_20px_rgba(56,163,165,0.3)] hover:shadow-[0_8px_30px_rgba(56,163,165,0.5)]"
            >
              Commencer maintenant
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
