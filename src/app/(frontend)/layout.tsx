import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import '../globals.css'
import GlassNavbar from '@/components/GlassNavbar'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import CookieBanner from '@/components/CookieBanner'
import StarfieldCanvas from '@/components/StarfieldCanvas'
import FilmGrain from '@/components/FilmGrain'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { getSiteUrl } from '@/lib/siteUrl'

const manropeHeading = Manrope({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

const manropeBody = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'Ça Crée Voyage — Voyages Sur Mesure',
    template: '%s | Ça Crée Voyage',
  },
  description: 'Circuits et voyages sur mesure. Laissez-vous inspirer par nos destinations d\'exception.',
}

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()

  return (
    <html lang="fr" className={`${manropeHeading.variable} ${manropeBody.variable} lenis lenis-smooth`} suppressHydrationWarning>
      <body className="antialiased relative" suppressHydrationWarning>
        <FilmGrain />
        <StarfieldCanvas />
        <GlassNavbar
          brandIdentity={settings.brandIdentity}
          whatsappNumber={settings.whatsappNumber}
          contactEmail={settings.contactEmail}
        />
        <main className="relative z-[1] flex min-h-screen flex-col">
          {children}
        </main>
        <FloatingWhatsApp whatsappNumber={settings.whatsappNumber} />
        <CookieBanner />
      </body>
    </html>
  )
}
