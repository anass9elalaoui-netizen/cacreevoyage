import type { Metadata } from 'next'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Politique de Confidentialité',
  description: 'Politique de confidentialité et de protection des données personnelles de Ça Crée Voyage.',
}

export default function ConfidentialitePage() {
  return (
    <>
      <main className="relative min-h-screen bg-brand-dark pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl text-white mb-12 tracking-tight font-bold">
            Politique de Confidentialité
          </h1>
          <div className="space-y-8 text-brand-silver text-base leading-relaxed font-body">
            <section>
              <h2 className="font-heading text-2xl text-white mb-4">Collecte des Données</h2>
              <p>
                Nous collectons les informations que vous nous fournissez volontairement via nos formulaires 
                de contact et de demande de voyage : nom, email, numéro de téléphone, préférences de voyage 
                et budget estimé.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-white mb-4">Utilisation des Données</h2>
              <p>
                Vos données sont utilisées exclusivement pour répondre à vos demandes de voyage, 
                personnaliser nos offres et améliorer votre expérience. Nous ne vendons ni ne 
                partageons vos données avec des tiers non autorisés.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-white mb-4">Cookies</h2>
              <p>
                Ce site utilise des cookies pour améliorer votre expérience de navigation et 
                analyser le trafic. Vous pouvez paramétrer vos préférences de cookies via la 
                bannière affichée lors de votre première visite.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-white mb-4">Vos Droits</h2>
              <p>
                Conformément au RGPD et aux lois marocaines sur la protection des données, vous disposez 
                d&apos;un droit d&apos;accès, de rectification, de suppression et de portabilité de vos données. 
                Pour exercer ces droits, contactez-nous à{' '}
                <a href="mailto:contact@cacreevoyage.com" className="text-brand-blue hover:underline">
                  contact@cacreevoyage.com
                </a>.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-white mb-4">Durée de Conservation</h2>
              <p>
                Vos données personnelles sont conservées pour une durée maximale de 3 ans à compter 
                de votre dernière interaction avec notre agence, sauf obligation légale contraire.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
