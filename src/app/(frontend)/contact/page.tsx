import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import ContactForm from '@/components/ContactForm'
import { getSiteSettings, cleanWhatsAppNumber } from '@/lib/getSiteSettings'

export const metadata: Metadata = {
  title: 'Contact — Parlons de Votre Voyage',
  description: 'Contactez Ça Crée Voyage par WhatsApp, email ou formulaire pour planifier votre voyage de luxe sur-mesure.',
}

export default async function ContactPage() {
  const settings = await getSiteSettings()
  const cleanNumber = cleanWhatsAppNumber(settings.whatsappNumber)
  const formattedPhone = settings.whatsappNumber.replace(/(\+\d{3})(\d)(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5 $6')

  return (
    <>
      <main className="relative min-h-screen bg-slate-50 dark:bg-brand-dark transition-colors duration-700 overflow-hidden">
        <section className="relative pt-32 pb-24 px-6">
          <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none" />

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Left — Contact Form (3/5) */}
              <div className="lg:col-span-3">
                <span className="uppercase text-brand-blue text-xs font-body mb-4 block font-semibold tracking-wider">
                  Contact
                </span>
                <h1 className="font-heading text-4xl md:text-6xl text-slate-900 dark:text-white mb-8 font-medium tracking-wide">
                  Parlons de Votre Voyage
                </h1>

                <ContactForm />
              </div>

              {/* Right — Contact Info Card (2/5) */}
              <div className="lg:col-span-2">
                <div
                  className="rounded-3xl p-8 border border-slate-200 dark:border-white/10 sticky top-28 bg-white dark:bg-white/5 shadow-sm dark:shadow-none"
                  style={{
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <h3 className="font-heading text-2xl text-slate-900 dark:text-white mb-6">
                    Informations
                  </h3>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${cleanNumber}?text=Bonjour, je souhaite en savoir plus sur vos voyages`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="bg-[#25D366]/10 border border-[#25D366]/20 text-brand-blue px-3 py-3 rounded-2xl mb-4 transition-colors hover:bg-[#25D366]/20 flex items-center gap-3">
                      <span className="text-2xl">💬</span>
                      <div>
                        <p className="text-slate-900 dark:text-white text-sm font-medium leading-relaxed">WhatsApp</p>
                        <p className="text-slate-600 dark:text-brand-silver text-xs leading-relaxed font-normal">{formattedPhone || settings.whatsappNumber}</p>
                      </div>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/8 transition-colors mb-4 shadow-sm dark:shadow-none"
                  >
                    <span className="text-2xl">✉️</span>
                    <div>
                      <p className="text-slate-900 dark:text-white text-sm font-medium leading-relaxed">Email</p>
                      <p className="text-slate-600 dark:text-brand-silver text-xs leading-relaxed font-normal">{settings.contactEmail}</p>
                    </div>
                  </a>

                  {/* Address */}
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-6 shadow-sm dark:shadow-none">
                    <span className="text-2xl">📍</span>
                    <div>
                      <p className="text-slate-900 dark:text-white text-sm font-medium leading-relaxed">Bureau</p>
                      <p className="text-slate-600 dark:text-brand-silver text-xs leading-relaxed font-normal">
                        {settings.address || 'Casablanca, Maroc'}
                      </p>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="border-t border-slate-200 dark:border-white/10 pt-6">
                    <p className="text-slate-600 dark:text-brand-silver text-xs uppercase mb-3 font-semibold tracking-wider leading-relaxed">Suivez-nous</p>
                    <div className="flex gap-3">
                      {settings.instagramUrl && (
                        <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-brand-silver hover:text-brand-blue hover:border-brand-blue/30 transition-colors text-sm shadow-sm dark:shadow-none">
                          IG
                        </a>
                      )}
                      {settings.facebookUrl && (
                        <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-brand-silver hover:text-brand-blue hover:border-brand-blue/30 transition-colors text-sm shadow-sm dark:shadow-none">
                          FB
                        </a>
                      )}
                      {settings.tiktokUrl && (
                        <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-brand-silver hover:text-brand-blue hover:border-brand-blue/30 transition-colors text-sm shadow-sm dark:shadow-none">
                          TK
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer
        whatsappNumber={settings.whatsappNumber}
        contactEmail={settings.contactEmail}
        instagramUrl={settings.instagramUrl}
      />
    </>
  )
}
