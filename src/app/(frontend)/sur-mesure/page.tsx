import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import SurMesureForm from '@/components/SurMesureForm'

import { getDictionary } from '@/i18n/dictionaries'

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
  const resolvedSearchParams = await searchParams
  const locale = (resolvedSearchParams.locale as string) || 'fr'
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Tailor-Made Trip — Create Your Itinerary' : 'Voyage Sur-Mesure — Créez Votre Itinéraire',
    description: isEn ? 'Create your tailor-made trip with Ça Crée Voyage. Destinations, budget, style — everything is customizable.' : 'Créez votre voyage sur-mesure avec Ça Crée Voyage. Destinations, budget, style — tout est personnalisable.',
  }
}

export default async function SurMesurePage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const locale = (searchParams.locale as string) || 'fr';
  const t = getDictionary(locale).surMesurePage;
  return (
    <>
      <main className="relative min-h-screen bg-brand-dark overflow-clip">
        {/* Ambient glows */}
        <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-brand-gold/5 rounded-full blur-[150px] pointer-events-none" />

        <section className="relative pt-32 pb-24 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Hero Text */}
            <div className="text-center mb-16">
              <span className="uppercase text-brand-gold text-xs font-body mb-4 block font-semibold tracking-wider">
                {t.tag}
              </span>
              <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-[1.1] font-medium tracking-wide">
                {t.title1}<br />
                <span className="text-brand-blue">{t.title2}</span>
              </h1>
              <p className="text-brand-silver text-lg max-w-xl mx-auto leading-relaxed font-normal">
                {t.subtitle}
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
