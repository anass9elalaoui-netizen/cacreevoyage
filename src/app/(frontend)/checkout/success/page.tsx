import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function CheckoutSuccessPage() {
  const payload = await getPayload({ config: configPromise })

  const paymentSettings = await payload.findGlobal({
    slug: 'payment-settings',
  })

  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
  })

  const whatsappNumber =
    (siteSettings?.whatsappNumber as string) || '+212661373347'

  const waText = encodeURIComponent(
    "Bonjour, j'ai effectué une réservation sur votre site. J'aimerais confirmer les détails et recevoir les instructions de paiement.",
  )

  const qrUrl =
    paymentSettings?.qrCodeImage &&
      typeof paymentSettings.qrCodeImage === 'object' &&
      'url' in paymentSettings.qrCodeImage
      ? paymentSettings.qrCodeImage.url
      : null

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0B132B]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B132B] via-[#0d1a33] to-[#0B132B] z-0" />
      <div className="absolute top-0 left-0 w-full h-full opacity-20 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-blue/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-[95%] max-w-xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-12 text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-brand-blue/20 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-brand-blue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-heading text-white mb-3 tracking-tight font-bold">
          Réservation confirmée
        </h1>
        <p className="text-white/60 font-light mb-10 max-w-md mx-auto leading-relaxed">
          Votre demande a été enregistrée. Finalisez votre réservation par virement bancaire.
        </p>

        {/* Payment Info Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8 mb-8 text-left">
          <span className="text-brand-blue text-xs uppercase font-semibold mb-4 block tracking-wider">
            Informations de paiement
          </span>

          <div className="space-y-4">
            {paymentSettings?.bankName && (
              <div>
                <span className="text-white/40 text-xs uppercase tracking-wider block mb-1 font-semibold">
                  Banque
                </span>
                <p className="text-white font-medium leading-relaxed">
                  {String(paymentSettings.bankName)}
                </p>
              </div>
            )}
            {paymentSettings?.accountHolder && (
              <div>
                <span className="text-white/40 text-xs uppercase tracking-wider block mb-1 font-semibold">
                  Titulaire
                </span>
                <p className="text-white font-medium leading-relaxed">
                  {String(paymentSettings.accountHolder)}
                </p>
              </div>
            )}
            {paymentSettings?.ribNumber && (
              <div>
                <span className="text-white/40 text-xs uppercase tracking-wider block mb-1 font-semibold">
                  RIB
                </span>
                <p className="text-white font-mono text-lg tracking-wider bg-black/20 rounded-lg px-4 py-2 leading-relaxed">
                  {String(paymentSettings.ribNumber)}
                </p>
              </div>
            )}
            {paymentSettings?.iban && (
              <div>
                <span className="text-white/40 text-xs uppercase tracking-wider block mb-1 font-semibold">
                  IBAN
                </span>
                <p className="text-white font-mono text-sm break-all bg-black/20 rounded-lg px-4 py-2 leading-relaxed">
                  {String(paymentSettings.iban)}
                </p>
              </div>
            )}
          </div>

          {qrUrl && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <span className="text-white/40 text-xs uppercase tracking-wider block mb-3 font-semibold">
                QR Code de paiement
              </span>
              <div className="bg-white rounded-xl p-3 inline-block">
                <Image
                  src={qrUrl}
                  alt="QR Code de paiement"
                  width={160}
                  height={160}
                  className="rounded-lg"
                />
              </div>
            </div>
          )}
        </div>

        {/* WhatsApp CTA */}
        <a
          href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-medium text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(37,211,102,0.3)] hover:shadow-[0_0_40px_rgba(37,211,102,0.5)]"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.44h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Confirmer sur WhatsApp
        </a>

        <div className="mt-6">
          <Link
            href="/"
            className="text-white/40 hover:text-white text-sm transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </main>
  )
}
