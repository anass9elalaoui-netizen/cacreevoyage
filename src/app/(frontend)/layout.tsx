import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import GlassNavbar from '@/components/GlassNavbar'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import CookieBanner from '@/components/CookieBanner'
import AmbientCanvas from '@/components/AmbientCanvas'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
    <html lang="fr" className={`${inter.variable} lenis lenis-smooth`} suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased relative" suppressHydrationWarning>
        <AmbientCanvas />
        <GlassNavbar brandIdentity={brandIdentity} />
        <main className="relative flex min-h-screen flex-col">
          {children}
        </main>
        <FloatingWhatsApp />
        <CookieBanner />
      </body>
    </html>
  )
}

