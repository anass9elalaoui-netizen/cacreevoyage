import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import SurMesureForm from '@/components/SurMesureForm'

export const metadata: Metadata = {
  title: 'Voyage Sur-Mesure — Créez Votre Itinéraire',
  description: 'Créez votre voyage sur-mesure avec Ça Crée Voyage. Destinations, budget, style — tout est personnalisable.',
}

export default function SurMesurePage() {
  return (
    <>
      <main className="relative min-h-screen bg-brand-dark overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-brand-gold/5 rounded-full blur-[150px] pointer-events-none" />

        <section className="relative pt-32 pb-24 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Hero Text */}
            <div className="text-center mb-16">
              <span className="uppercase tracking-[0.2em] text-brand-gold text-xs font-sans font-medium mb-4 block">
                Sur Mesure
              </span>
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-[1.1]">
                Créez le Voyage<br />
                <span className="text-brand-blue">de Vos Rêves</span>
              </h1>
              <p className="text-brand-silver text-lg max-w-xl mx-auto">
                En 5 étapes simples, décrivez votre voyage idéal.
                Nos experts se chargent du reste.
              </p>
            </div>

            {/* Multi-Step Form */}
            <SurMesureForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
