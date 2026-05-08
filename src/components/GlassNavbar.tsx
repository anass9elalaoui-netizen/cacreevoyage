'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function GlassNavbar({ brandIdentity }: { brandIdentity?: any }) {
  const pathname = usePathname()
  const [isDestinationsOpen, setIsDestinationsOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  // Language state (UI only)
  const [lang, setLang] = useState('FR')

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false
    return pathname.startsWith(path)
  }

  const logoText = brandIdentity?.logoText || 'Ça Crée Voyage'
  const logoHeight = brandIdentity?.logoHeight || 28
  const logoImage = typeof brandIdentity?.logoImage === 'object' && brandIdentity?.logoImage?.url 
    ? brandIdentity.logoImage.url 
    : null

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-4 inset-x-0 mx-auto w-[92%] max-w-6xl h-14 rounded-full z-50 flex items-center px-6 justify-between transition-all duration-500 bg-[#0B132B] backdrop-blur-md border-b border-white/10 ${
        isScrolled
          ? 'shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
          : 'shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
      }`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        {logoImage ? (
          <img 
            src={logoImage} 
            alt={logoText} 
            style={{ height: `${logoHeight}px`, width: 'auto' }} 
            className="object-contain"
          />
        ) : (
          <span className="font-serif text-xl tracking-wide text-white group-hover:text-brand-blue transition-colors drop-shadow-md">
            {logoText}
          </span>
        )}
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-5 text-sm font-medium">
        
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
              className={`w-3.5 h-3.5 transition-transform duration-200 ${isDestinationsOpen ? 'rotate-180' : ''}`}
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
                className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-52 bg-[#0B132B]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden"
              >
                <Link href="/destinations/international" className="px-5 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors text-sm">
                  🌍 International
                </Link>
                <Link href="/destinations/national" className="px-5 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors text-sm">
                  🇲🇦 Maroc
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Link
          href="/tours"
          className={`transition-colors hover:text-brand-blue drop-shadow-md ${
            isActive('/tours') ? 'text-brand-blue' : 'text-white'
          }`}
        >
          Nos Circuits
        </Link>
        
        {/* Sur-Mesure CTA */}
        <Link
          href="/sur-mesure"
          className="bg-[#78B3CE] hover:bg-[#609ebc] text-white px-5 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-colors shadow-md"
        >
          Sur-Mesure
        </Link>

        <Link
          href="/blog"
          className={`transition-colors hover:text-brand-blue drop-shadow-md ${
            isActive('/blog') ? 'text-brand-blue' : 'text-white'
          }`}
        >
          Blog
        </Link>

        <Link
          href="/about"
          className={`transition-colors hover:text-brand-blue drop-shadow-md ${
            isActive('/about') ? 'text-brand-blue' : 'text-white'
          }`}
        >
          À Propos
        </Link>
      </div>

      {/* Right Side Actions (Desktop) */}
      <div className="hidden md:flex items-center gap-4">
        {/* WhatsApp Button */}
        <a
          href="https://wa.me/212661373347"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#4ADE80] hover:bg-[#22c55e] text-[#0B132B] px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          WhatsApp
        </a>

        {/* Language Switcher */}
        <div className="flex items-center gap-1 text-xs font-medium text-white/70">
          <button 
            onClick={() => setLang('FR')} 
            className={`transition-colors ${lang === 'FR' ? 'text-white' : 'hover:text-white'}`}
          >
            FR
          </button>
          <span className="opacity-50">|</span>
          <button 
            onClick={() => setLang('EN')} 
            className={`transition-colors ${lang === 'EN' ? 'text-white' : 'hover:text-white'}`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden text-white hover:text-brand-blue transition-colors drop-shadow-md flex items-center gap-3"
        aria-label="Menu"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ADE80]"></span>
        </span>
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
            className="fixed inset-x-0 top-20 mx-auto w-[92%] max-w-sm bg-[#0B132B]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-6 flex flex-col gap-3 z-50 md:hidden"
          >
            {/* Mobile Destinations */}
            <div className="border-b border-white/10 pb-3 mb-1">
              <span className="text-white/40 text-xs uppercase tracking-widest mb-2 block">Destinations</span>
              <Link href="/destinations/international" onClick={() => setIsMobileOpen(false)} className="block text-white/70 hover:text-white py-2 text-sm">
                🌍 International
              </Link>
              <Link href="/destinations/national" onClick={() => setIsMobileOpen(false)} className="block text-white/70 hover:text-white py-2 text-sm">
                🇲🇦 Maroc
              </Link>
            </div>

            <Link href="/tours" onClick={() => setIsMobileOpen(false)} className="text-base font-medium py-2 text-white/80">
              Nos Circuits
            </Link>
            
            <Link
              href="/sur-mesure"
              onClick={() => setIsMobileOpen(false)}
              className="mt-1 mb-2 text-center bg-[#78B3CE] text-white px-6 py-3 rounded-full text-sm uppercase tracking-wider font-medium shadow-md"
            >
              Sur-Mesure
            </Link>

            <Link href="/blog" onClick={() => setIsMobileOpen(false)} className="text-base font-medium py-2 text-white/80">
              Blog
            </Link>

            <Link href="/about" onClick={() => setIsMobileOpen(false)} className="text-base font-medium py-2 text-white/80">
              À Propos
            </Link>

            {/* Mobile Language and WhatsApp */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
              <div className="flex items-center gap-2 text-sm font-medium text-white/70">
                <button onClick={() => setLang('FR')} className={lang === 'FR' ? 'text-white' : ''}>FR</button>
                <span className="opacity-50">|</span>
                <button onClick={() => setLang('EN')} className={lang === 'EN' ? 'text-white' : ''}>EN</button>
              </div>

              <a
                href="https://wa.me/212661373347"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#4ADE80] text-[#0B132B] px-4 py-2 rounded-full text-xs font-semibold"
              >
                WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
