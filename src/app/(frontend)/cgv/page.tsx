import type { Metadata } from 'next'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente',
  description: 'Conditions générales de vente de Ça Crée Voyage.',
}

export default function CGVPage() {
  return (
    <>
      <main className="relative min-h-screen bg-slate-50 dark:bg-brand-dark transition-colors duration-700 pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl text-slate-900 dark:text-white mb-12 tracking-tight font-bold">
            Conditions Générales de Vente
          </h1>
          <div className="space-y-8 text-slate-600 dark:text-brand-silver text-base leading-relaxed font-body">
            <section>
              <h2 className="font-heading text-2xl text-slate-900 dark:text-white mb-4">Objet</h2>
              <p>
                Les présentes conditions générales de vente régissent les relations contractuelles 
                entre Ça Crée Voyage et ses clients dans le cadre de la réservation de voyages 
                et circuits organisés.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-slate-900 dark:text-white mb-4">Réservation</h2>
              <p>
                Toute réservation est considérée comme définitive après réception d&apos;un acompte 
                de 30% du montant total du voyage. Le solde est exigible 30 jours avant la 
                date de départ.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-slate-900 dark:text-white mb-4">Tarifs</h2>
              <p>
                Les tarifs indiqués sur le site sont en Euros (EUR) par personne, sauf mention 
                contraire. Ils comprennent les prestations détaillées dans le programme du circuit. 
                Les vols internationaux, assurances et dépenses personnelles ne sont pas inclus 
                sauf indication contraire.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-slate-900 dark:text-white mb-4">Annulation</h2>
              <p>
                En cas d&apos;annulation par le client :<br />
                • Plus de 60 jours avant le départ : remboursement intégral de l&apos;acompte<br />
                • 30 à 60 jours : retenue de 50% du montant total<br />
                • Moins de 30 jours : aucun remboursement
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-slate-900 dark:text-white mb-4">Responsabilité</h2>
              <p>
                Ça Crée Voyage agit en qualité d&apos;organisateur de voyages et s&apos;engage à fournir 
                les prestations décrites dans le programme. Notre responsabilité est limitée aux 
                obligations contractuelles et aux cas prévus par la loi.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-slate-900 dark:text-white mb-4">Litiges</h2>
              <p>
                Tout litige relatif à l&apos;interprétation ou à l&apos;exécution des présentes conditions 
                sera soumis aux tribunaux compétents de Casablanca, Maroc.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
