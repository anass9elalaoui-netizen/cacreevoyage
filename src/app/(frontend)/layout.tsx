import type { Metadata, Viewport } from 'next'
import { Manrope, Outfit } from 'next/font/google'
import '../globals.css'
import GlassNavbar from '@/components/GlassNavbar'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import CookieBanner from '@/components/CookieBanner'
import StarfieldCanvas from '@/components/StarfieldCanvas'
import FilmGrain from '@/components/FilmGrain'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { getSiteUrl } from '@/lib/siteUrl'

// Display font for the hero's destination names and headline
const outfitDisplay = Outfit({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-display',
  display: 'swap',
})

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

// viewport-fit=cover makes env(safe-area-inset-*) real; the page background reaches behind the phone's chrome
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0B132B' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'Ça Crée Voyage | Voyages de groupe à travers le monde',
    template: '%s | Ça Crée Voyage',
  },
  description: 'Découvrez nos voyages de groupe à travers le monde : dates, programmes et réservation sur WhatsApp.',
  icons: { icon: '/logo.jpeg', apple: '/logo.jpeg' },
}

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()

  return (
    <html lang="fr" className={`${outfitDisplay.variable} ${manropeHeading.variable} ${manropeBody.variable} lenis lenis-smooth`} suppressHydrationWarning>
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
