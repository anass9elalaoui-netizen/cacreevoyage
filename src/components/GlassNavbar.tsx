'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { getDictionary } from '@/i18n/dictionaries'

export default function GlassNavbar({ brandIdentity }: { brandIdentity?: any }) {
  const pathname = usePathname()
  const [isDestinationsOpen, setIsDestinationsOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const [lang, setLang] = useState('FR')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const currentLocale = params.get('locale') || 'fr'
    setLang(currentLocale.toUpperCase())
  }, [])

  const switchLanguage = (newLang: string) => {
    setLang(newLang.toUpperCase())
    const params = new URLSearchParams(window.location.search)
    params.set('locale', newLang.toLowerCase())
    window.location.search = params.toString()
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const localeStr = lang.toLowerCase();
  const t = getDictionary(localeStr).nav;

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
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-4 inset-x-0 mx-auto w-[92%] max-w-6xl h-14 rounded-full z-50 flex items-center px-6 justify-between transition-all duration-500 bg-[#0B132B] backdrop-blur-md border-b border-white/10 ${isScrolled
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
              className={`flex items-center gap-1 transition-colors hover:text-brand-blue drop-shadow-md ${isActive('/destinations') ? 'text-brand-blue' : 'text-white'
                }`}
            >
              {t.destinations}
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
                    {t.international}
                  </Link>
                  <Link href="/destinations/national" className="px-5 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors text-sm">
                    {t.national}
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/tours"
            className={`transition-colors hover:text-brand-blue drop-shadow-md ${isActive('/tours') ? 'text-brand-blue' : 'text-white'
              }`}
          >
            {t.tours}
          </Link>

          {/* Sur-Mesure CTA */}
          <Link
            href="/sur-mesure"
            className="bg-[#78B3CE] hover:bg-[#609ebc] text-white px-5 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-colors shadow-md"
          >
            {t.custom}
          </Link>

          <Link
            href="/blog"
            className={`transition-colors hover:text-brand-blue drop-shadow-md ${isActive('/blog') ? 'text-brand-blue' : 'text-white'
              }`}
          >
            {t.blog}
          </Link>

          <Link
            href="/about"
            className={`transition-colors hover:text-brand-blue drop-shadow-md ${isActive('/about') ? 'text-brand-blue' : 'text-white'
              }`}
          >
            {t.about}
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
              onClick={() => switchLanguage('fr')}
              className={`transition-colors ${lang === 'FR' ? 'text-white font-bold' : 'hover:text-white'}`}
            >
              FR
            </button>
            <span className="opacity-50">|</span>
            <button
              onClick={() => switchLanguage('en')}
              className={`transition-colors ${lang === 'EN' ? 'text-white font-bold' : 'hover:text-white'}`}
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

      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] w-screen h-[100dvh] bg-[#050814]/95 backdrop-blur-2xl md:hidden"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-6 right-6 text-white hover:text-[#C9A84C] transition-colors p-2 z-[101]"
              aria-label="Fermer"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col justify-between h-full w-full px-8 pt-32 pb-12 items-start text-left relative z-[100]">
              {/* Main Links Group */}
              <div className="flex flex-col gap-8">
                {[
                  { num: '01', label: 'Destinations', href: '/destinations' },
                  { num: '02', label: 'Nos Circuits', href: '/tours' },
                  { num: '03', label: 'Sur-Mesure', href: '/sur-mesure' },
                  { num: '04', label: 'Blog', href: '/blog' },
                ].map((item, idx) => (
                  <motion.div key={item.num} className="overflow-hidden flex flex-row items-baseline justify-start w-full">
                    <motion.div
                      initial={{ y: "120%", rotateZ: 5, opacity: 0 }}
                      animate={{ y: 0, rotateZ: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-baseline group"
                      >
                        <span className="font-sans text-[#A0ABC0] text-sm tracking-widest w-8 shrink-0">
                          {item.num}
                        </span>
                        <span className="font-serif text-5xl md:text-6xl text-white font-light tracking-wide group-hover:text-[#C9A84C] transition-colors">
                          {item.label}
                        </span>
                      </Link>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* Footer Block */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="border-t border-white/10 pt-8 mt-auto flex flex-col gap-4 w-full"
              >
                <span className="font-sans text-[#C9A84C] text-xs uppercase tracking-widest font-semibold">
                  Contactez-Nous
                </span>
                <div className="flex flex-col gap-1 text-white/50 text-sm font-sans">
                  <a href="https://wa.me/212661373347" className="hover:text-white transition-colors">
                    WhatsApp: +212 6 61 37 33 47
                  </a>
                  <a href="mailto:contact@cacreevoyage.com" className="hover:text-white transition-colors">
                    contact@cacreevoyage.com
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
