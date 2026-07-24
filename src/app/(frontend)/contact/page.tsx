import type { Metadata } from 'next'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Contact — Parlons de Votre Voyage',
  description: 'Contactez Ça Crée Voyage par WhatsApp, email ou formulaire pour planifier votre voyage de luxe sur-mesure.',
}

export default function ContactPage() {
  return (
    <>
      <main className="relative min-h-screen bg-slate-50 dark:bg-brand-dark transition-colors duration-700 overflow-hidden">
        <section className="relative pt-32 pb-24 px-6">
          <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none" />

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Left — Contact Form (3/5) */}
              <div className="lg:col-span-3">
                <span className="uppercase tracking-[0.2em] text-brand-blue text-xs font-sans font-medium mb-4 block">
                  Contact
                </span>
                <h1 className="font-serif text-4xl md:text-6xl text-slate-900 dark:text-white mb-8">
                  Parlons de Votre Voyage
                </h1>

                <form
                  action="/api/inquiries"
                  method="POST"
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-600 dark:text-brand-silver text-sm mb-2 font-sans">Prénom & Nom</label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        className="w-full px-5 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-brand-blue/50 transition-colors text-sm shadow-sm dark:shadow-none"
                        placeholder="Votre nom complet"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-brand-silver text-sm mb-2 font-sans">Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-5 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-brand-blue/50 transition-colors text-sm shadow-sm dark:shadow-none"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-brand-silver text-sm mb-2 font-sans">Téléphone / WhatsApp</label>
                    <input
                      type="tel"
                      name="phone"
                      className="w-full px-5 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-brand-blue/50 transition-colors text-sm shadow-sm dark:shadow-none"
                      placeholder="+33 6 XX XX XX XX"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-brand-silver text-sm mb-2 font-sans">Sujet</label>
                    <select
                      name="subject"
                      className="w-full px-5 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-brand-blue/50 transition-colors text-sm shadow-sm dark:shadow-none"
                    >
                      <option value="voyage" className="bg-slate-50 dark:bg-brand-dark">Demande de voyage</option>
                      <option value="information" className="bg-slate-50 dark:bg-brand-dark">Informations générales</option>
                      <option value="partenariat" className="bg-slate-50 dark:bg-brand-dark">Partenariat</option>
                      <option value="autre" className="bg-slate-50 dark:bg-brand-dark">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-brand-silver text-sm mb-2 font-sans">Message</label>
                    <textarea
                      name="message"
                      rows={6}
                      className="w-full px-5 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-brand-blue/50 transition-colors text-sm resize-none shadow-sm dark:shadow-none"
                      placeholder="Décrivez votre projet de voyage..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full md:w-auto bg-brand-blue hover:bg-brand-blue/90 text-white px-10 py-4 rounded-full font-sans text-sm uppercase tracking-[0.1em] font-medium transition-all duration-300 shadow-[0_4px_20px_rgba(56,163,165,0.3)] hover:shadow-[0_8px_30px_rgba(56,163,165,0.5)]"
                  >
                    Envoyer le message
                  </button>
                </form>
              </div>

              {/* Right — Contact Info Card (2/5) */}
              <div className="lg:col-span-2">
                <div
                  className="rounded-3xl p-8 border border-slate-200 dark:border-white/10 sticky top-28 bg-white dark:bg-white/5 shadow-sm dark:shadow-none"
                  style={{
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <h3 className="font-serif text-2xl text-slate-900 dark:text-white mb-6">
                    Informations
                  </h3>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/212661373347?text=Bonjour, je souhaite en savoir plus sur vos voyages"
                    target="_blank"
                    rel="noopener noreferrer"
                    <div className="bg-[#25D366]/10 border border-[#25D366]/20 text-brand-blue px-3 py-3 rounded-2xl mb-4 transition-colors hover:bg-[#25D366]/20 flex items-center gap-3">
                      <span className="text-2xl">💬</span>
                      <div>
                        <p className="text-slate-900 dark:text-white text-sm font-medium">WhatsApp</p>
                        <p className="text-slate-600 dark:text-brand-silver text-xs">+212 661 373 347</p>
                      </div>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:contact@cacreevoyage.com"
                    className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/8 transition-colors mb-4 shadow-sm dark:shadow-none"
                  >
                    <span className="text-2xl">✉️</span>
                    <div>
                      <p className="text-slate-900 dark:text-white text-sm font-medium">Email</p>
                      <p className="text-slate-600 dark:text-brand-silver text-xs">contact@cacreevoyage.com</p>
                    </div>
                  </a>

                  {/* Address */}
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-6 shadow-sm dark:shadow-none">
                    <span className="text-2xl">📍</span>
                    <div>
                      <p className="text-slate-900 dark:text-white text-sm font-medium">Bureau</p>
                      <p className="text-slate-600 dark:text-brand-silver text-xs leading-relaxed">
                        Casablanca, Maroc
                      </p>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="border-t border-slate-200 dark:border-white/10 pt-6">
                    <p className="text-slate-600 dark:text-brand-silver text-xs uppercase tracking-widest mb-3">Suivez-nous</p>
                    <div className="flex gap-3">
                      <a href="#" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-brand-silver hover:text-brand-blue hover:border-brand-blue/30 transition-colors text-sm shadow-sm dark:shadow-none">
                        IG
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-brand-silver hover:text-brand-blue hover:border-brand-blue/30 transition-colors text-sm shadow-sm dark:shadow-none">
                        FB
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-brand-silver hover:text-brand-blue hover:border-brand-blue/30 transition-colors text-sm shadow-sm dark:shadow-none">
                        TK
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
