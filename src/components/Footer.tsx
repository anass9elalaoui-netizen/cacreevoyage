import React from 'react'
import Link from 'next/link'

/* ─── SVG Icons (inline for zero-dependency) ───────────────── */

function InstagramIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.657 0-3.216-.5-4.51-1.358l-.324-.194-2.866.852.852-2.866-.194-.324A7.963 7.963 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" clipRule="evenodd" />
    </svg>
  )
}

function BankTransferIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
  )
}

function QRCodeIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#060D1F] text-white overflow-hidden">
      {/* ── Top Divider — Ambient glow line ──────────────────── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-px bg-gradient-to-r from-transparent via-brand-blue/40 to-transparent" suppressHydrationWarning />

      {/* ── Ambient Background Glow ──────────────────────────── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-blue/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-20 pb-12">
        {/* ── 4-Column Grid ──────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* COL 1 — Brand & Bio */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6 group">
              <span className="font-serif text-3xl tracking-wide text-white group-hover:text-brand-blue transition-colors drop-shadow-[0_2px_8px_rgba(56,163,165,0.3)]">
                Ça Crée Voyage
              </span>
            </Link>
            <p className="text-white/50 text-sm font-light leading-relaxed mb-6 max-w-xs">
              Agence de voyages sur mesure basée au Maroc. Nous dessinons des itinéraires d'exception pour les voyageurs exigeants — du désert de Merzouga aux archipels du Pacifique.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/cacreevoyage"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://wa.me/212600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          {/* COL 2 — Destinations */}
          <div>
            <h4 className="uppercase tracking-[0.2em] text-brand-blue font-semibold text-xs mb-6">
              Destinations
            </h4>
            <div className="flex flex-col gap-1">
              <span className="text-white/30 text-[10px] uppercase tracking-widest mb-1">International</span>
              {['Philippines', 'Turquie', 'Zanzibar', 'Égypte', 'Vietnam'].map((name) => (
                <Link
                  key={name}
                  href={`/destinations/${name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`}
                  className="text-white/60 text-sm font-light hover:text-white hover:translate-x-1 transition-all duration-300 py-1"
                >
                  {name}
                </Link>
              ))}
              <span className="text-white/30 text-[10px] uppercase tracking-widest mt-3 mb-1">Maroc</span>
              {['Merzouga', 'Dakhla', 'Imlil', 'Imsfrane'].map((name) => (
                <Link
                  key={name}
                  href={`/destinations/${name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`}
                  className="text-white/60 text-sm font-light hover:text-white hover:translate-x-1 transition-all duration-300 py-1"
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>

          {/* COL 3 — Support */}
          <div>
            <h4 className="uppercase tracking-[0.2em] text-brand-blue font-semibold text-xs mb-6">
              Support
            </h4>
            <div className="flex flex-col gap-1">
              {[
                { label: 'À propos', href: '/a-propos' },
                { label: 'Contact', href: '/sur-mesure' },
                { label: 'Mentions Légales', href: '/mentions-legales' },
                { label: 'Conditions Générales', href: '/conditions-generales' },
                { label: 'Politique de Confidentialité', href: '/politique-confidentialite' },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-white/60 text-sm font-light hover:text-white hover:translate-x-1 transition-all duration-300 py-1"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* COL 4 — Payments */}
          <div>
            <h4 className="uppercase tracking-[0.2em] text-brand-blue font-semibold text-xs mb-6">
              Paiement
            </h4>
            <p className="text-white/50 text-sm font-light leading-relaxed mb-6">
              Réglez en toute sécurité par virement bancaire ou QR code.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
                <BankTransferIcon />
                <span className="text-white/50 text-[10px] uppercase tracking-wider">Virement</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
                <QRCodeIcon />
                <span className="text-white/50 text-[10px] uppercase tracking-wider">QR Code</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ─────────────────────────────────────── */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-white/30 text-xs font-light">
            © {new Date().getFullYear()} Ça Crée Voyage. Tous droits réservés.
          </span>
          <span className="text-white/20 text-xs font-light">
            Conçu avec passion au Maroc 🇲🇦
          </span>
        </div>
      </div>
    </footer>
  )
}
