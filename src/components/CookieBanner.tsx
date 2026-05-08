'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined')
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-5xl mx-auto rounded-2xl border border-white/10 bg-brand-deeper/95 backdrop-blur-xl p-6 md:p-8 shadow-[0_-8px_32px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
              {/* Text */}
              <div className="flex-1">
                <h3 className="text-white font-medium text-base mb-1">
                  🍪 Ce site utilise des cookies
                </h3>
                <p className="text-brand-silver text-sm leading-relaxed">
                  Nous utilisons des cookies pour améliorer votre expérience de navigation, 
                  analyser le trafic du site et personnaliser le contenu. En continuant, 
                  vous acceptez notre{' '}
                  <a
                    href="/confidentialite"
                    className="text-brand-blue hover:underline transition-colors"
                  >
                    politique de confidentialité
                  </a>.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 flex-shrink-0">
                <button
                  onClick={handleDecline}
                  className="px-5 py-2.5 rounded-full text-sm font-medium text-brand-silver border border-white/10 hover:border-white/20 hover:text-white transition-all duration-300"
                >
                  Paramétrer
                </button>
                <button
                  onClick={handleAccept}
                  className="px-6 py-2.5 rounded-full text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue/90 transition-all duration-300 shadow-[0_4px_16px_rgba(56,163,165,0.3)]"
                >
                  Accepter
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
