'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getDictionary } from '@/i18n/dictionaries'

/* ── Animation Configs ──────────────────────────────────────── */
const EASE_LUXURY = [0.16, 1, 0.3, 1] as const
const EASE_SMOOTH = [0.33, 1, 0.68, 1] as const

interface SubLink {
  label: string
  href: string
  icon: string
}

interface MenuLink {
  num: string
  label: string
  href: string
  description: string
  subLinks?: SubLink[]
}

const menuLinks: MenuLink[] = [
  {
    num: '01',
    label: 'Destinations',
    href: '/destinations',
    description: 'Explorez le monde avec nos circuits exclusifs',
    subLinks: [
      { label: 'International', href: '/destinations/international', icon: '✈' },
      { label: 'National — Maroc', href: '/destinations/national', icon: '◆' },
    ],
  },
  { num: '02', label: 'Nos Circuits', href: '/tours', description: 'Voyages organisés premium et authentiques' },
  { num: '03', label: 'Sur-Mesure', href: '/sur-mesure', description: 'Créez votre voyage sur mesure, 100% personnalisé' },
  { num: '04', label: 'Blog', href: '/blog', description: 'Récits de voyages, guides et inspirations' },
  { num: '05', label: 'À Propos', href: '/about', description: 'Notre histoire, notre passion du voyage' },
]

/* ── Main Component ──────────────────────────────────────────── */

export default function GlassNavbar({ brandIdentity }: { brandIdentity?: any }) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [lang, setLang] = useState('FR')
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false)

  /* ── Hydration-safe mount ─────────────────────────────────── */
  useEffect(() => {
    setIsMounted(true)
    const params = new URLSearchParams(window.location.search)
    const currentLocale = params.get('locale') || 'fr'
    setLang(currentLocale.toUpperCase())
  }, [])

  /* ── Scroll tracking ──────────────────────────────────────── */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* ── Lock body scroll when menu is open ───────────────────── */
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  const switchLanguage = useCallback((newLang: string) => {
    setLang(newLang.toUpperCase())
    const params = new URLSearchParams(window.location.search)
    params.set('locale', newLang.toLowerCase())
    window.location.search = params.toString()
  }, [])

  const localeStr = lang.toLowerCase()
  const t = getDictionary(localeStr).nav

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false
    return pathname.startsWith(path)
  }

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
    setHoveredIndex(null)
    setExpandedIndex(null)
  }, [])

  const toggleExpand = useCallback((idx: number) => {
    setExpandedIndex(prev => prev === idx ? null : idx)
  }, [])

  const logoText = brandIdentity?.logoText || 'Ça Crée Voyage'
  const logoHeight = brandIdentity?.logoHeight || 28
  const logoImage = typeof brandIdentity?.logoImage === 'object' && brandIdentity?.logoImage?.url
    ? brandIdentity.logoImage.url
    : null

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          NAVBAR — Glass pill, fixed top
      ══════════════════════════════════════════════════════════ */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_LUXURY }}
        className={`fixed top-4 inset-x-0 mx-auto w-[92%] max-w-6xl h-14 rounded-full z-50 flex items-center px-6 justify-between transition-all duration-500 bg-[#0B132B]/90 backdrop-blur-xl border border-white/[0.06] ${isScrolled
            ? 'shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
            : 'shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
          }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group relative z-[60]">
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

        {/* ── Desktop Links (lg+) ────────────────────────────── */}
        <div className="hidden lg:flex items-center gap-5 text-sm font-medium">
          {/* Destinations with Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsDesktopDropdownOpen(true)}
            onMouseLeave={() => setIsDesktopDropdownOpen(false)}
          >
            <button
              className={`flex items-center gap-1.5 transition-colors hover:text-brand-blue drop-shadow-md ${isActive('/destinations') ? 'text-brand-blue' : 'text-white'}`}
            >
              {t.destinations}
              <svg
                className={`w-3 h-3 transition-transform duration-300 ${isDesktopDropdownOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <AnimatePresence>
              {isDesktopDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: EASE_LUXURY }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-[#0B132B]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] overflow-hidden"
                >
                  <Link
                    href="/destinations/international"
                    className="flex items-center gap-3 px-5 py-3.5 text-white/80 hover:bg-white/5 hover:text-white transition-all text-sm group"
                  >
                    <span className="text-brand-blue/60 text-xs">✈</span>
                    <span>{t.international}</span>
                    <svg className="w-3 h-3 ml-auto opacity-0 -translate-x-1 group-hover:opacity-50 group-hover:translate-x-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <div className="mx-4 h-px bg-white/5" />
                  <Link
                    href="/destinations/national"
                    className="flex items-center gap-3 px-5 py-3.5 text-white/80 hover:bg-white/5 hover:text-white transition-all text-sm group"
                  >
                    <span className="text-brand-gold/60 text-xs">◆</span>
                    <span>{t.national}</span>
                    <svg className="w-3 h-3 ml-auto opacity-0 -translate-x-1 group-hover:opacity-50 group-hover:translate-x-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/tours"
            className={`transition-colors hover:text-brand-blue drop-shadow-md ${isActive('/tours') ? 'text-brand-blue' : 'text-white'}`}
          >
            {t.tours}
          </Link>
          <Link
            href="/sur-mesure"
            className="bg-brand-blue hover:bg-brand-blue/80 text-white px-5 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all duration-300 shadow-[0_0_20px_rgba(56,163,165,0.2)] hover:shadow-[0_0_30px_rgba(56,163,165,0.3)]"
          >
            {t.custom}
          </Link>
          <Link
            href="/blog"
            className={`transition-colors hover:text-brand-blue drop-shadow-md ${isActive('/blog') ? 'text-brand-blue' : 'text-white'}`}
          >
            {t.blog}
          </Link>
          <Link
            href="/about"
            className={`transition-colors hover:text-brand-blue drop-shadow-md ${isActive('/about') ? 'text-brand-blue' : 'text-white'}`}
          >
            {t.about}
          </Link>
        </div>

        {/* ── Right Side — Desktop ───────────────────────────── */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href="https://wa.me/212661373347"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1fb855] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors shadow-[0_4px_16px_rgba(37,211,102,0.25)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            WhatsApp
          </a>
          {isMounted && (
            <div className="flex items-center gap-1 text-xs font-medium text-white/60">
              <button
                onClick={() => switchLanguage('fr')}
                className={`transition-colors ${lang === 'FR' ? 'text-white font-bold' : 'hover:text-white'}`}
              >
                FR
              </button>
              <span className="opacity-40">|</span>
              <button
                onClick={() => switchLanguage('en')}
                className={`transition-colors ${lang === 'EN' ? 'text-white font-bold' : 'hover:text-white'}`}
              >
                EN
              </button>
            </div>
          )}
        </div>

        {/* ── Mobile Menu Toggle ─────────────────────────────── */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-white hover:text-brand-blue transition-colors flex items-center gap-3 relative z-[60]"
          aria-label="Menu"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]" />
          </span>
          <div className="flex flex-col gap-[5px] w-6">
            <motion.span
              animate={isMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: EASE_LUXURY }}
              className="block h-[2px] w-full bg-current origin-center"
            />
            <motion.span
              animate={isMenuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="block h-[2px] w-4 bg-current"
            />
            <motion.span
              animate={isMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: EASE_LUXURY }}
              className="block h-[2px] w-full bg-current origin-center"
            />
          </div>
        </button>
      </motion.nav>

      {/* ══════════════════════════════════════════════════════════
          FULL-SCREEN MENU OVERLAY
      ══════════════════════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <motion.div
            key="menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_LUXURY }}
            className="fixed inset-0 z-[90] w-screen h-[100dvh]"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-[#040610]/[0.97] backdrop-blur-3xl"
            />

            {/* Subtle radial gradient orb */}
            <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-brand-blue/[0.03] rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand-gold/[0.02] rounded-full blur-[120px] pointer-events-none" />

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.2, duration: 0.4, ease: EASE_LUXURY }}
              onClick={closeMenu}
              className="absolute top-6 right-6 z-[101] w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 group"
              aria-label="Fermer le menu"
            >
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* ── Menu Layout Container ──────────────────────── */}
            <div className="relative z-[100] h-full w-full flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">

              {/* ── LEFT PANEL — Navigation ─────────────────── */}
              <div className="flex-1 flex flex-col px-8 md:px-16 lg:px-20 xl:px-28 pt-24 lg:pt-20 pb-6 lg:pb-16 lg:justify-center">

                {/* Eyebrow */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5, ease: EASE_SMOOTH }}
                  className="mb-6 lg:mb-10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-px bg-brand-gold/40" />
                    <span className="uppercase tracking-[0.25em] text-brand-gold/80 text-[10px] font-sans font-medium">
                      Menu
                    </span>
                  </div>
                </motion.div>

                {/* Navigation Links */}
                <nav className="flex flex-col">
                  {menuLinks.map((item, idx) => {
                    const hasSubLinks = item.subLinks && item.subLinks.length > 0
                    const isExpanded = expandedIndex === idx

                    return (
                      <motion.div
                        key={item.num}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + idx * 0.07, duration: 0.6, ease: EASE_SMOOTH }}
                        className="border-b border-white/[0.04] last:border-b-0"
                      >
                        {/* Main Link Row */}
                        <div
                          className={`flex items-center py-4 lg:py-5 cursor-pointer group transition-all duration-400 ${
                            hoveredIndex !== null && hoveredIndex !== idx ? 'opacity-25' : 'opacity-100'
                          }`}
                          onMouseEnter={() => setHoveredIndex(idx)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          onClick={() => {
                            if (hasSubLinks) {
                              toggleExpand(idx)
                            }
                          }}
                        >
                          {/* Number */}
                          <span className="font-sans text-white/20 text-[11px] tracking-[0.15em] w-10 shrink-0 tabular-nums">
                            {item.num}
                          </span>

                          {/* Label — link or button depending on subLinks */}
                          {hasSubLinks ? (
                            <span className="font-serif text-3xl md:text-4xl lg:text-6xl xl:text-7xl text-white tracking-tight leading-[1.05] transition-colors duration-300 group-hover:text-brand-blue flex-1">
                              {item.label}
                            </span>
                          ) : (
                            <Link
                              href={item.href}
                              onClick={closeMenu}
                              className="font-serif text-3xl md:text-4xl lg:text-6xl xl:text-7xl text-white tracking-tight leading-[1.05] transition-colors duration-300 group-hover:text-brand-blue flex-1"
                            >
                              {item.label}
                            </Link>
                          )}

                          {/* Active dot */}
                          {isActive(item.href) && (
                            <motion.div
                              layoutId="menuActive"
                              className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0 mx-3"
                              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                          )}

                          {/* Expand/collapse chevron for items with sublinks */}
                          {hasSubLinks && (
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.3, ease: EASE_LUXURY }}
                              className="shrink-0 ml-3 w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 group-hover:text-white/70 group-hover:border-white/15 transition-all"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </motion.div>
                          )}

                          {/* Arrow for non-expandable items (desktop) */}
                          {!hasSubLinks && (
                            <motion.div
                              initial={{ opacity: 0, x: -8 }}
                              animate={hoveredIndex === idx ? { opacity: 0.5, x: 0 } : { opacity: 0, x: -8 }}
                              transition={{ duration: 0.25 }}
                              className="hidden lg:block shrink-0 ml-3 text-white/50"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                              </svg>
                            </motion.div>
                          )}
                        </div>

                        {/* ── Sub-links Accordion ────────────── */}
                        <AnimatePresence>
                          {hasSubLinks && isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.4, ease: EASE_LUXURY }}
                              className="overflow-hidden"
                            >
                              <div className="pl-10 pb-4 flex flex-col gap-1">
                                {/* View all destinations link */}
                                <Link
                                  href={item.href}
                                  onClick={closeMenu}
                                  className="group/sub flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.03] transition-all duration-300"
                                >
                                  <span className="w-6 h-6 rounded-lg bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue text-[10px] shrink-0">
                                    ⊞
                                  </span>
                                  <div className="flex-1">
                                    <span className="text-white/90 text-sm font-sans font-medium group-hover/sub:text-brand-blue transition-colors">
                                      Toutes les destinations
                                    </span>
                                  </div>
                                  <svg className="w-3.5 h-3.5 text-white/20 group-hover/sub:text-white/40 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </Link>

                                {/* Sub-links */}
                                {item.subLinks!.map((sub, subIdx) => (
                                  <motion.div
                                    key={sub.href}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: subIdx * 0.08, duration: 0.3, ease: EASE_SMOOTH }}
                                  >
                                    <Link
                                      href={sub.href}
                                      onClick={closeMenu}
                                      className="group/sub flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.03] transition-all duration-300"
                                    >
                                      <span className={`w-6 h-6 rounded-lg ${subIdx === 0 ? 'bg-brand-blue/10 border-brand-blue/20 text-brand-blue' : 'bg-brand-gold/10 border-brand-gold/20 text-brand-gold'} border flex items-center justify-center text-[10px] shrink-0`}>
                                        {sub.icon}
                                      </span>
                                      <div className="flex-1">
                                        <span className="text-white/80 text-sm font-sans font-medium group-hover/sub:text-white transition-colors">
                                          {sub.label}
                                        </span>
                                      </div>
                                      <svg className="w-3.5 h-3.5 text-white/15 group-hover/sub:text-white/40 group-hover/sub:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </Link>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </nav>
              </div>

              {/* ── RIGHT PANEL — Info (lg+) ──────────────────── */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.7, ease: EASE_LUXURY }}
                className="hidden lg:flex lg:w-[380px] xl:w-[440px] flex-col justify-between border-l border-white/[0.04] px-10 xl:px-14 py-16"
              >
                {/* Top */}
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-8">
                    <span className="font-serif text-2xl text-brand-gold/50">✦</span>
                  </div>
                  <h3 className="font-serif text-2xl xl:text-3xl text-white mb-3 tracking-tight leading-tight">
                    Votre voyage<br />commence ici
                  </h3>
                  <p className="text-white/30 text-sm font-sans leading-relaxed mb-8">
                    Des circuits exclusifs au Maroc et à l&apos;international, conçus avec passion et expertise depuis plus de 10 ans.
                  </p>

                  {/* CTA */}
                  <Link
                    href="/sur-mesure"
                    onClick={closeMenu}
                    className="inline-flex items-center gap-3 bg-brand-blue hover:bg-brand-blue/80 text-white px-7 py-4 rounded-2xl text-sm font-medium transition-all duration-300 shadow-[0_0_30px_rgba(56,163,165,0.2)] hover:shadow-[0_0_40px_rgba(56,163,165,0.35)] group"
                  >
                    Créer mon voyage
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>

                {/* Bottom */}
                <div className="flex flex-col gap-5">
                  <div className="w-full h-px bg-white/[0.05]" />
                  <div className="flex flex-col gap-2.5">
                    <span className="uppercase tracking-[0.2em] text-brand-gold/60 text-[10px] font-sans font-semibold">
                      Contact
                    </span>
                    <div className="flex flex-col gap-1.5 text-white/30 text-sm font-sans">
                      <a href="https://wa.me/212661373347" className="hover:text-white/70 transition-colors flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-[#25D366]/10 flex items-center justify-center shrink-0">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 text-[#25D366]">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                        </span>
                        +212 6 61 37 33 47
                      </a>
                      <a href="mailto:contact@cacreevoyage.com" className="hover:text-white/70 transition-colors pl-7">
                        contact@cacreevoyage.com
                      </a>
                    </div>
                  </div>

                  {/* Language */}
                  {isMounted && (
                    <div className="flex items-center gap-2 text-[11px] font-medium">
                      <button
                        onClick={() => switchLanguage('fr')}
                        className={`px-3 py-1.5 rounded-lg border transition-all duration-300 ${lang === 'FR' ? 'bg-white/[0.06] border-white/[0.12] text-white' : 'border-white/[0.04] text-white/25 hover:text-white/50 hover:border-white/[0.1]'}`}
                      >
                        FR
                      </button>
                      <button
                        onClick={() => switchLanguage('en')}
                        className={`px-3 py-1.5 rounded-lg border transition-all duration-300 ${lang === 'EN' ? 'bg-white/[0.06] border-white/[0.12] text-white' : 'border-white/[0.04] text-white/25 hover:text-white/50 hover:border-white/[0.1]'}`}
                      >
                        EN
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* ── MOBILE BOTTOM — CTA + Contact (lg:hidden) ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5, ease: EASE_SMOOTH }}
                className="lg:hidden px-8 pb-8 mt-auto shrink-0"
              >
                <div className="border-t border-white/[0.06] pt-5 flex flex-col gap-4">
                  {/* CTA */}
                  <Link
                    href="/sur-mesure"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2.5 w-full bg-brand-blue hover:bg-brand-blue/80 text-white py-4 rounded-2xl text-sm font-medium transition-all duration-300 shadow-[0_0_24px_rgba(56,163,165,0.2)]"
                  >
                    Créer mon voyage
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>

                  {/* Contact + Lang row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <a
                        href="https://wa.me/212661373347"
                        className="flex items-center gap-1.5 text-white/30 text-xs font-sans hover:text-white/60 transition-colors"
                      >
                        <span className="w-5 h-5 rounded-md bg-[#25D366]/10 flex items-center justify-center">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 text-[#25D366]">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                        </span>
                        <span className="hidden sm:inline">+212 6 61 37 33 47</span>
                      </a>
                      <a href="mailto:contact@cacreevoyage.com" className="text-white/20 text-[10px] font-sans hover:text-white/50 transition-colors hidden sm:block">
                        contact@cacreevoyage.com
                      </a>
                    </div>

                    {/* Language pills */}
                    {isMounted && (
                      <div className="flex items-center gap-1.5 text-[10px] font-medium">
                        <button
                          onClick={() => switchLanguage('fr')}
                          className={`px-2.5 py-1 rounded-lg border transition-all ${lang === 'FR' ? 'bg-white/[0.06] border-white/[0.12] text-white' : 'border-white/[0.04] text-white/25'}`}
                        >
                          FR
                        </button>
                        <button
                          onClick={() => switchLanguage('en')}
                          className={`px-2.5 py-1 rounded-lg border transition-all ${lang === 'EN' ? 'bg-white/[0.06] border-white/[0.12] text-white' : 'border-white/[0.04] text-white/25'}`}
                        >
                          EN
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
