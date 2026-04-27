import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import GlassNavbar from '@/components/GlassNavbar'

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

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} lenis lenis-smooth`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0B132B] text-white antialiased relative">
        <GlassNavbar />
        <main className="relative flex min-h-screen flex-col">
          {children}
        </main>
      </body>
    </html>
  )
}
