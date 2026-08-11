import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import '../globals.css'
import GlassNavbar from '@/components/GlassNavbar'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import CookieBanner from '@/components/CookieBanner'
import StarfieldCanvas from '@/components/StarfieldCanvas'
import FilmGrain from '@/components/FilmGrain'

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  title: {
    default: 'Ça Crée Voyage — Voyages Sur Mesure',
    template: '%s | Ça Crée Voyage',
  },
  description: 'Circuits et voyages sur mesure. Laissez-vous inspirer par nos destinations d\'exception.',
}

import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const payload = await getPayload({ config: configPromise })
  
  let brandIdentity = null
  try {
    const settings = await payload.findGlobal({ slug: 'site-settings' }) as any
    if (settings?.brandIdentity) {
      brandIdentity = settings.brandIdentity
    }
  } catch (err) {
    console.error('Error fetching site settings in layout', err)
  }

  return (
    <html lang="fr" className={`${manropeHeading.variable} ${manropeBody.variable} lenis lenis-smooth`} suppressHydrationWarning>
      <body className="antialiased relative" suppressHydrationWarning>
        <FilmGrain />
        <StarfieldCanvas />
        <GlassNavbar brandIdentity={brandIdentity} />
        <main className="relative z-[1] flex min-h-screen flex-col">
          {children}
        </main>
        <FloatingWhatsApp />
        <CookieBanner />
      </body>
    </html>
  )
}

