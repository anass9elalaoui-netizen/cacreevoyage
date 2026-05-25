'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getDictionary, Locale } from '@/i18n/dictionaries'

interface BookingSidebarProps {
  tourId: string
  tourTitle: string
  pricing?: {
    basePrice?: number
    currency?: string
    depositPercentage?: number
  } | null
  logistics?: {
    durationDays?: number
    durationNights?: number
    maxGroupSize?: number
    difficulty?: string
    departureCity?: string
    languages?: string[]
  } | null
  duration?: string
  tourStatus?: string
  locale?: string
}

export default function BookingSidebar({
  tourId,
  tourTitle,
  pricing,
  logistics,
  duration,
  tourStatus,
  locale,
}: BookingSidebarProps) {
  // Try to use the passed locale, fallback to reading URL, or default to fr.
  const [currentLocale, setCurrentLocale] = useState<Locale>((locale as Locale) || 'fr')

  useEffect(() => {
    if (!locale && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setCurrentLocale((params.get('locale') as Locale) || 'fr')
    }
  }, [locale])

  const t = getDictionary(currentLocale).bookingSidebar

  const statusConfig = {
    available: { label: t.available, color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    coming_soon: { label: t.comingSoon, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    sold_out: { label: t.soldOut, color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  }

  const status = statusConfig[tourStatus as keyof typeof statusConfig] || statusConfig.available
  const depositAmount = pricing?.basePrice && pricing?.depositPercentage
    ? Math.round(pricing.basePrice * (pricing.depositPercentage / 100))
    : null

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', guests: '2' })

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const msg = `Bonjour, je souhaite réserver: ${tourTitle} prévu pour le ${duration || 'prochainement'}. Nom: ${formData.name}, Personnes: ${formData.guests}`
    const whatsappUrl = `https://wa.me/212661373347?text=${encodeURIComponent(msg)}`
    window.open(whatsappUrl, '_blank')
    setIsModalOpen(false)
  }

  return (
    <div className="sticky top-24">
      <div
        className="rounded-3xl p-8 border border-white/10 space-y-6"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
            {status.label}
          </span>
          {pricing?.basePrice && (
            <div className="text-right">
              <span className="text-[11px] text-brand-silver block">{t.from}</span>
              <span className="text-2xl font-serif text-brand-gold">
                {pricing.basePrice.toLocaleString()} {pricing.currency || '€'}
              </span>
              <span className="text-brand-silver text-xs">{t.pers}</span>
            </div>
          )}
        </div>

        {/* Quick Info */}
        <div className="space-y-3 py-4 border-y border-white/8">
          {duration && (
            <div className="flex justify-between text-sm">
              <span className="text-brand-silver">{t.duration}</span>
              <span className="text-white font-medium">{duration}</span>
            </div>
          )}
          {logistics?.maxGroupSize && (
            <div className="flex justify-between text-sm">
              <span className="text-brand-silver">{t.maxGroup}</span>
              <span className="text-white font-medium">{logistics.maxGroupSize} pers.</span>
            </div>
          )}
          {logistics?.difficulty && (
            <div className="flex justify-between text-sm">
              <span className="text-brand-silver">{t.difficulty}</span>
              <span className="text-white font-medium">{logistics.difficulty}</span>
            </div>
          )}
          {logistics?.departureCity && (
            <div className="flex justify-between text-sm">
              <span className="text-brand-silver">{t.departure}</span>
              <span className="text-white font-medium">{logistics.departureCity}</span>
            </div>
          )}
          {logistics?.languages && logistics.languages.length > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-brand-silver">{t.languages}</span>
              <span className="text-white font-medium">{logistics.languages.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Deposit info */}
        {depositAmount && (
          <div className="text-center py-3 rounded-xl bg-brand-gold/10 border border-brand-gold/20">
            <span className="text-brand-gold text-sm font-medium">
              {t.deposit} {depositAmount.toLocaleString()} {pricing?.currency || '€'}
            </span>
            <span className="text-brand-silver text-xs block mt-1">
              ({pricing?.depositPercentage}% {t.toConfirm})
            </span>
          </div>
        )}

        {/* Primary CTA — WhatsApp */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white py-4 rounded-full font-medium text-base transition-all shadow-[0_4px_20px_rgba(37,211,102,0.3)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.5)]"
        >
          <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          {t.bookWhatsapp}
        </button>

        {/* Secondary CTA — Sur-Mesure */}
        <Link
          href="/sur-mesure"
          className="flex items-center justify-center w-full bg-white/5 border border-white/15 hover:bg-white/10 text-white py-4 rounded-full font-medium text-base transition-all"
        >
          {t.customize}
        </Link>

        {/* No price fallback */}
        {!pricing?.basePrice && (
          <p className="text-center text-brand-silver text-xs italic">
            {t.onRequest}
          </p>
        )}
      </div>

      {/* WhatsApp Lead Capture Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121A33] border border-white/10 p-6 md:p-8 rounded-3xl w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-2xl font-serif text-white mb-2">{t.sendRequest}</h3>
            <p className="text-white/60 text-sm mb-6">{t.expertReply}</p>
            
            <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
              <div>
                <label className="block text-white/80 text-xs font-medium mb-1">{t.fullName}</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-blue/50 text-sm"
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label className="block text-white/80 text-xs font-medium mb-1">{t.guests}</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.guests}
                  onChange={(e) => setFormData(prev => ({ ...prev, guests: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-blue/50 text-sm"
                />
              </div>
              
              <button
                type="submit"
                className="w-full mt-4 bg-[#25D366] hover:bg-[#25D366]/90 text-white py-3.5 rounded-full font-medium text-sm transition-all"
              >
                {t.continue}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
