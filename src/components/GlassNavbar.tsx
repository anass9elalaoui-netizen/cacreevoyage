'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function GlassNavbar() {
  const pathname = usePathname()
  const [isDestinationsOpen, setIsDestinationsOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false
    return pathname.startsWith(path)
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-4 inset-x-0 mx-auto w-[92%] max-w-5xl h-14 rounded-full bg-[#0B132B]/60 backdrop-blur-lg border border-white/10 z-50 flex items-center px-6 justify-between transition-all shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
    >
      <Link href="/" className="flex items-center gap-2 group">
        {/* We can place the logo here or just text */}
        <span className="font-serif text-xl tracking-wide text-white group-hover:text-brand-blue transition-colors drop-shadow-md">
          Ça Crée Voyage
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link
          href="/"
          className={`transition-colors hover:text-brand-blue drop-shadow-md ${
            pathname === '/' ? 'text-brand-blue' : 'text-white'
          }`}
        >
          Accueil
        </Link>

        {/* Destinations Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setIsDestinationsOpen(true)}
          onMouseLeave={() => setIsDestinationsOpen(false)}
        >
          <button
            className={`flex items-center gap-1 transition-colors hover:text-brand-blue drop-shadow-md ${
              isActive('/destinations') ? 'text-brand-blue' : 'text-white'
            }`}
          >
            Destinations
            <svg
              className={`w-4 h-4 transition-transform ${isDestinationsOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <AnimatePresence>
            {isDestinationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 bg-[#0B132B]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden"
              >
                <Link
                  href="/destinations/international"
                  className="px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  International
                </Link>
                <Link
                  href="/destinations/national"
                  className="px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  National (Maroc)
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Link
          href="/sur-mesure"
          className={`transition-colors hover:text-brand-blue drop-shadow-md ${
            isActive('/sur-mesure') ? 'text-brand-blue' : 'text-white'
          }`}
        >
          Sur Mesure
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden text-white hover:text-brand-blue transition-colors drop-shadow-md"
        aria-label="Menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-20 mx-auto w-[92%] max-w-sm bg-[#0B132B]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-6 flex flex-col gap-4 z-50 md:hidden"
          >
            <Link href="/" onClick={() => setIsMobileOpen(false)} className={`text-lg font-medium ${pathname === '/' ? 'text-brand-blue' : 'text-white/80'}`}>
              Accueil
            </Link>
            <div className="border-t border-white/10 pt-2">
              <span className="text-white/40 text-xs uppercase tracking-widest mb-2 block">Destinations</span>
              <Link href="/destinations/international" onClick={() => setIsMobileOpen(false)} className="block text-white/70 hover:text-white py-2">
                International
              </Link>
              <Link href="/destinations/national" onClick={() => setIsMobileOpen(false)} className="block text-white/70 hover:text-white py-2">
                National (Maroc)
              </Link>
            </div>
            <Link href="/sur-mesure" onClick={() => setIsMobileOpen(false)} className={`text-lg font-medium ${isActive('/sur-mesure') ? 'text-brand-blue' : 'text-white/80'}`}>
              Sur Mesure
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
