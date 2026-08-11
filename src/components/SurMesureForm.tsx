'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const steps = [
  { id: 1, title: 'Destination', icon: '🌍' },
  { id: 2, title: 'Dates & Style', icon: '📅' },
  { id: 3, title: 'Voyageurs', icon: '👥' },
  { id: 4, title: 'Contact', icon: '✉️' },
]

const destinations = [
  { value: 'maroc', label: 'Maroc', emoji: '🇲🇦' },
  { value: 'zanzibar', label: 'Zanzibar', emoji: '🏝️' },
  { value: 'turquie', label: 'Turquie', emoji: '🇹🇷' },
  { value: 'thailande', label: 'Thaïlande', emoji: '🇹🇭' },
  { value: 'indonesie', label: 'Indonésie', emoji: '🇮🇩' },
  { value: 'egypte', label: 'Égypte', emoji: '🇪🇬' },
  { value: 'autre', label: 'Autre', emoji: '✨' },
]

const travelStyles = [
  { value: 'aventure', label: 'Aventure & Nature', emoji: '🏔️' },
  { value: 'culture', label: 'Culture & Histoire', emoji: '🏛️' },
  { value: 'detente', label: 'Détente & Bien-être', emoji: '🧘' },
  { value: 'romantique', label: 'Romantique', emoji: '💕' },
  { value: 'famille', label: 'Famille', emoji: '👨‍👩‍👧‍👦' },
  { value: 'corporate', label: 'Corporate / Incentive', emoji: '🏢' },
]

export default function SurMesureForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    destination: '',
    otherDestination: '',
    travelStyle: '',
    preferredDates: '',
    flexibleDates: false,
    durationDays: '',
    travelers: '2',
    children: '0',
    fullName: '',
    email: '',
    phone: '',
    message: '',
  })

  const update = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const totalSteps = steps.length
  const next = () => setCurrentStep((s) => Math.min(s + 1, totalSteps))
  const prev = () => setCurrentStep((s) => Math.max(s - 1, 1))

  const handleSubmit = async () => {
    // Build WhatsApp message
    const dest = formData.destination === 'autre' ? formData.otherDestination : formData.destination
    const msg = `🌍 *Demande Sur-Mesure*\n\n` +
      `📍 Destination: ${dest}\n` +
      `🎯 Style: ${formData.travelStyle}\n` +
      `📅 Dates: ${formData.preferredDates || 'Flexible'}\n` +
      `⏱ Durée: ${formData.durationDays || 'À définir'} jours\n` +
      `👥 Voyageurs: ${formData.travelers} adultes, ${formData.children} enfants\n\n` +
      `👤 ${formData.fullName}\n` +
      `📧 ${formData.email}\n` +
      `📞 ${formData.phone}\n\n` +
      `💬 ${formData.message || 'Aucun message supplémentaire'}`

    const whatsappUrl = `https://wa.me/212661373347?text=${encodeURIComponent(msg)}`
    window.open(whatsappUrl, '_blank')
    setIsSubmitted(true)
  }

  const slideVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  }

  if (isSubmitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <span className="text-6xl mb-6 block font-medium tracking-wide">✨</span>
          <h2 className="font-heading text-4xl text-slate-900 dark:text-white mb-4 tracking-tight font-bold">Merci !</h2>
          <p className="text-slate-600 dark:text-brand-silver text-lg mb-8 leading-relaxed font-normal">
            Votre demande a été envoyée via WhatsApp. Nos experts vous répondront sous 24h.
          </p>
          <a href="/" className="text-brand-blue hover:underline text-sm">← Retour à l&apos;accueil</a>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 mb-12">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center gap-2">
            <button
              onClick={() => step.id < currentStep && setCurrentStep(step.id)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${step.id === currentStep
                  ? 'bg-brand-blue text-white shadow-[0_0_20px_rgba(56,163,165,0.4)]'
                  : step.id < currentStep
                    ? 'bg-brand-blue/30 text-brand-blue cursor-pointer'
                    : 'bg-white dark:bg-white/5 text-slate-400 dark:text-white/30 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none'
                }`}
            >
              {step.id < currentStep ? '✓' : step.icon}
            </button>
            {step.id < totalSteps && (
              <div className={`w-8 h-px ${step.id < currentStep ? 'bg-brand-blue/50' : 'bg-slate-200 dark:bg-white/10'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {/* STEP 1: Destination */}
          {currentStep === 1 && (
            <div>
              <h2 className="font-heading text-3xl md:text-4xl text-slate-900 dark:text-white mb-2 text-center tracking-tight font-bold">
                Où souhaitez-vous voyager ?
              </h2>
              <p className="text-slate-600 dark:text-brand-silver text-center mb-8 leading-relaxed font-normal">Choisissez votre destination de rêve</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {destinations.map((dest) => (
                  <button
                    key={dest.value}
                    onClick={() => update('destination', dest.value)}
                    className={`p-5 rounded-2xl border text-left transition-all duration-200 ${formData.destination === dest.value
                        ? 'bg-brand-blue/20 border-brand-blue/50 text-brand-blue dark:text-white'
                        : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/8 hover:border-slate-300 dark:hover:border-white/20 shadow-sm dark:shadow-none'
                      }`}
                  >
                    <span className="text-2xl block mb-2">{dest.emoji}</span>
                    <span className="text-sm font-medium">{dest.label}</span>
                  </button>
                ))}
              </div>
              {formData.destination === 'autre' && (
                <input
                  type="text"
                  placeholder="Précisez votre destination..."
                  value={formData.otherDestination}
                  onChange={(e) => update('otherDestination', e.target.value)}
                  className="w-full mt-4 px-5 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-brand-blue/50 text-sm shadow-sm dark:shadow-none"
                />
              )}
            </div>
          )}

          {/* STEP 2: Dates & Style */}
          {currentStep === 2 && (
            <div>
              <h2 className="font-heading text-3xl md:text-4xl text-slate-900 dark:text-white mb-2 text-center tracking-tight font-bold">
                Quand et comment ?
              </h2>
              <p className="text-slate-600 dark:text-brand-silver text-center mb-8 leading-relaxed font-normal">Vos préférences de dates et de style</p>
              <div className="space-y-6">
                <div>
                  <label className="block text-slate-600 dark:text-brand-silver text-sm mb-2">Dates souhaitées</label>
                  <input
                    type="text"
                    placeholder="Ex: 15 Juin — 25 Juin 2026"
                    value={formData.preferredDates}
                    onChange={(e) => update('preferredDates', e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-brand-blue/50 text-sm shadow-sm dark:shadow-none"
                  />
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.flexibleDates}
                      onChange={(e) => update('flexibleDates', e.target.checked)}
                      className="rounded border-slate-300 dark:border-white/20 bg-white dark:bg-white/5"
                    />
                    <span className="text-slate-600 dark:text-brand-silver text-xs">Mes dates sont flexibles</span>
                  </label>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-brand-silver text-sm mb-2">Durée souhaitée (jours)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    placeholder="Ex: 10"
                    value={formData.durationDays}
                    onChange={(e) => update('durationDays', e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-brand-blue/50 text-sm shadow-sm dark:shadow-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-brand-silver text-sm mb-3">Style de voyage</label>
                  <div className="grid grid-cols-2 gap-3">
                    {travelStyles.map((style) => (
                      <button
                        key={style.value}
                        onClick={() => update('travelStyle', style.value)}
                        className={`p-4 rounded-2xl border text-left transition-all duration-200 ${formData.travelStyle === style.value
                            ? 'bg-brand-blue/20 border-brand-blue/50 text-brand-blue dark:text-white'
                            : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/8 shadow-sm dark:shadow-none'
                          }`}
                      >
                        <span className="text-xl">{style.emoji}</span>
                        <span className="text-xs font-medium block mt-1">{style.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Travelers */}
          {currentStep === 3 && (
            <div>
              <h2 className="font-heading text-3xl md:text-4xl text-slate-900 dark:text-white mb-2 text-center tracking-tight font-bold">
                Qui voyage ?
              </h2>
              <p className="text-slate-600 dark:text-brand-silver text-center mb-8 leading-relaxed font-normal">Nombre de voyageurs</p>
              <div className="space-y-6 max-w-sm mx-auto">
                <div>
                  <label className="block text-slate-600 dark:text-brand-silver text-sm mb-2">Adultes</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => update('travelers', String(Math.max(1, parseInt(formData.travelers) - 1)))}
                      className="w-12 h-12 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none"
                    >−</button>
                    <span className="text-3xl font-heading text-slate-900 dark:text-white w-12 text-center tracking-tight font-bold">{formData.travelers}</span>
                    <button
                      onClick={() => update('travelers', String(parseInt(formData.travelers) + 1))}
                      className="w-12 h-12 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none"
                    >+</button>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-brand-silver text-sm mb-2">Enfants (0-12 ans)</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => update('children', String(Math.max(0, parseInt(formData.children) - 1)))}
                      className="w-12 h-12 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none"
                    >−</button>
                    <span className="text-3xl font-heading text-slate-900 dark:text-white w-12 text-center tracking-tight font-bold">{formData.children}</span>
                    <button
                      onClick={() => update('children', String(parseInt(formData.children) + 1))}
                      className="w-12 h-12 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none"
                    >+</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Contact */}
          {currentStep === 4 && (
            <div>
              <h2 className="font-heading text-3xl md:text-4xl text-slate-900 dark:text-white mb-2 text-center tracking-tight font-bold">
                Dernière étape
              </h2>
              <p className="text-slate-600 dark:text-brand-silver text-center mb-8 leading-relaxed font-normal">Vos coordonnées pour recevoir votre devis</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-600 dark:text-brand-silver text-sm mb-2">Prénom & Nom *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => update('fullName', e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-brand-blue/50 text-sm shadow-sm dark:shadow-none"
                    placeholder="Votre nom complet"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-brand-silver text-sm mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => update('email', e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-brand-blue/50 text-sm shadow-sm dark:shadow-none"
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-brand-silver text-sm mb-2">Téléphone / WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-brand-blue/50 text-sm shadow-sm dark:shadow-none"
                    placeholder="+33 6 XX XX XX XX"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-brand-silver text-sm mb-2">Message (optionnel)</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => update('message', e.target.value)}
                    rows={4}
                    className="w-full px-5 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-brand-blue/50 text-sm resize-none shadow-sm dark:shadow-none"
                    placeholder="Des envies particulières, des questions..."
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-10">
        {currentStep > 1 ? (
          <button
            onClick={prev}
            className="px-6 py-3 rounded-full text-sm font-medium text-slate-600 dark:text-brand-silver border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white transition-all bg-white dark:bg-transparent shadow-sm dark:shadow-none"
          >
            ← Retour
          </button>
        ) : (
          <div />
        )}

        {currentStep < totalSteps ? (
          <button
            onClick={next}
            className="px-8 py-3 rounded-full text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue/90 transition-all shadow-[0_4px_16px_rgba(56,163,165,0.3)]"
          >
            Suivant →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!formData.fullName || !formData.email}
            className="px-8 py-3 rounded-full text-sm font-medium text-white bg-[#25D366] hover:bg-[#25D366]/90 transition-all shadow-[0_4px_16px_rgba(37,211,102,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💬 Envoyer via WhatsApp
          </button>
        )}
      </div>
    </div>
  )
}
