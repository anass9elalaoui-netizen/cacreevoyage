import type { Metadata } from 'next'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Mentions Légales',
  description: 'Mentions légales de Ça Crée Voyage.',
}

export default function MentionsLegalesPage() {
  return (
    <>
      <main className="relative min-h-screen bg-brand-dark pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-12">
            Mentions Légales
          </h1>
          <div className="space-y-8 text-brand-silver text-base leading-relaxed font-sans">
            <section>
              <h2 className="font-serif text-2xl text-white mb-4">Éditeur du Site</h2>
              <p>
                Le site <strong className="text-white">cacreevoyage.com</strong> est édité par 
                Ça Crée Voyage, agence de voyages sur-mesure immatriculée au Maroc.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-white mb-4">Hébergement</h2>
              <p>
                Ce site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-white mb-4">Propriété Intellectuelle</h2>
              <p>
                L&apos;ensemble du contenu du site (textes, images, vidéos, logos, graphismes) est protégé 
                par les lois relatives à la propriété intellectuelle. Toute reproduction totale ou 
                partielle est strictement interdite sans autorisation écrite préalable.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-white mb-4">Contact</h2>
              <p>
                Email : <a href="mailto:contact@cacreevoyage.com" className="text-brand-blue hover:underline">contact@cacreevoyage.com</a><br />
                WhatsApp : +212 661 373 347
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
