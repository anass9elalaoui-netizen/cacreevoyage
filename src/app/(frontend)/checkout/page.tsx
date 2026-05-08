'use client'

import React, { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const TOTAL_STEPS = 3

interface FormData {
  clientName: string
  clientPhone: string
  clientEmail: string
  passengers: number
  travelDate: string
  specialRequests: string
}

function CheckoutForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const tourId = searchParams.get('tour') || ''
  const tourTitle = searchParams.get('title') || 'Voyage Sur Mesure'
  const tourDuration = searchParams.get('duration') || ''
  const departureDateParam = searchParams.get('departure') || ''
  const returnDateParam = searchParams.get('return') || ''

  // Determine if this is a fixed-date group tour
  const hasFixedDates = Boolean(departureDateParam && returnDateParam)

  // Format dates for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    passengers: 1,
    travelDate: departureDateParam, // Pre-fill with departure date for fixed tours
    specialRequests: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const goNext = () => {
    setDirection(1)
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS - 1))
  }
  const goPrev = () => {
    setDirection(-1)
    setCurrentStep((s) => Math.max(s - 1, 0))
  }
  const setField = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setFormData((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      // Convert tourId to number for the relationship field
      const numericTourId = parseInt(tourId, 10)

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourId: isNaN(numericTourId) ? tourId : numericTourId,
          clientName: formData.clientName,
          clientPhone: formData.clientPhone,
          clientEmail: formData.clientEmail || undefined,
          passengers: formData.passengers,
          travelDate: hasFixedDates ? departureDateParam : (formData.travelDate || undefined),
          specialRequests: formData.specialRequests || undefined,
          status: 'pending_virement',
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Une erreur est survenue.')
      }
      router.push('/checkout/success')
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  }

  const stepValid = () => {
    switch (currentStep) {
      case 0:
        return (
          formData.clientName.trim().length > 0 &&
          formData.clientPhone.trim().length > 0
        )
      case 1:
        return formData.passengers >= 1
      case 2:
        return true
      default:
        return false
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0B132B]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B132B] via-[#0d1a33] to-[#0B132B] z-0" />
      <div className="absolute top-0 left-0 w-full h-full opacity-20 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-blue/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-[95%] max-w-2xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-12 lg:p-16 overflow-hidden"
      >
        {/* Tour Badge */}
        <div className="mb-8 text-center">
          <span className="uppercase tracking-widest text-brand-blue font-semibold text-xs mb-2 block">
            Réservation
          </span>
          <h1 className="text-2xl md:text-3xl font-serif text-white mb-2">
            {tourTitle}
          </h1>
          {tourDuration && (
            <span className="text-white/40 text-sm font-light">{tourDuration}</span>
          )}
        </div>

        {/* Fixed Dates Display — Group Tours */}
        {hasFixedDates && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8 p-5 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg className="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="uppercase tracking-[0.15em] text-brand-blue font-semibold text-xs">
                Dates confirmées
              </span>
            </div>
            <p className="text-white font-serif text-lg">
              {formatDate(departureDateParam)} — {formatDate(returnDateParam)}
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <div key="wizard" className="relative">
            {/* Progress */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/50 text-xs font-medium tracking-widest uppercase">
                  Étape {String(currentStep + 1).padStart(2, '0')} / {String(TOTAL_STEPS).padStart(2, '0')}
                </span>
              </div>
              <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-brand-blue"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((currentStep + 1) / TOTAL_STEPS) * 100}%`,
                  }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                />
              </div>
            </div>

            <AnimatePresence custom={direction} mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="step0"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">
                    Vos coordonnées
                  </h2>
                  <p className="text-white/50 text-sm font-light mb-6">
                    Comment pouvons-nous vous contacter ?
                  </p>
                  <div className="space-y-5">
                    <input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) => setField('clientName', e.target.value)}
                      placeholder="Nom complet"
                      className="w-full text-lg text-white bg-transparent border-b border-white/30 placeholder-white/50 focus:border-brand-blue outline-none py-3 transition-colors"
                    />
                    <input
                      type="tel"
                      value={formData.clientPhone}
                      onChange={(e) => setField('clientPhone', e.target.value)}
                      placeholder="Téléphone"
                      className="w-full text-lg text-white bg-transparent border-b border-white/30 placeholder-white/50 focus:border-brand-blue outline-none py-3 transition-colors"
                    />
                    <input
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => setField('clientEmail', e.target.value)}
                      placeholder="Email (optionnel)"
                      className="w-full text-lg text-white bg-transparent border-b border-white/30 placeholder-white/50 focus:border-brand-blue outline-none py-3 transition-colors"
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">
                    Détails du voyage
                  </h2>
                  <p className="text-white/50 text-sm font-light mb-6">
                    {hasFixedDates
                      ? 'Combien de voyageurs participent ?'
                      : 'Combien de voyageurs et quand ?'}
                  </p>
                  <div className="space-y-5">
                    <div>
                      <label className="text-white/50 text-xs uppercase tracking-widest mb-2 block">
                        Nombre de passagers
                      </label>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            setField(
                              'passengers',
                              Math.max(1, formData.passengers - 1),
                            )
                          }
                          className="w-12 h-12 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors flex items-center justify-center text-xl"
                        >
                          −
                        </button>
                        <span className="text-2xl font-serif text-white w-8 text-center">
                          {formData.passengers}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setField(
                              'passengers',
                              Math.min(20, formData.passengers + 1),
                            )
                          }
                          className="w-12 h-12 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors flex items-center justify-center text-xl"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Conditional Date Logic: Show picker ONLY for Sur Mesure */}
                    {!hasFixedDates && (
                      <div>
                        <label className="text-white/50 text-xs uppercase tracking-widest mb-2 block">
                          Date de voyage souhaitée
                        </label>
                        <input
                          type="date"
                          value={formData.travelDate}
                          onChange={(e) =>
                            setField('travelDate', e.target.value)
                          }
                          className="w-full text-lg text-white bg-transparent border-b border-white/30 placeholder-white/50 focus:border-brand-blue outline-none py-3 transition-colors"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">
                    Demandes spéciales
                  </h2>
                  <p className="text-white/50 text-sm font-light mb-6">
                    Activités, ambiance, préférences... tout ce qui compte.
                  </p>
                  <textarea
                    value={formData.specialRequests}
                    onChange={(e) =>
                      setField('specialRequests', e.target.value)
                    }
                    placeholder="Je souhaite un surclassement, un guide francophone, une chambre avec vue..."
                    rows={5}
                    className="w-full text-lg text-white bg-transparent border-b border-white/30 placeholder-white/30 focus:border-brand-blue outline-none py-4 transition-colors resize-none"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-6"
              >
                {error}
              </motion.p>
            )}

            <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={goPrev}
                  className="text-white/50 hover:text-white text-sm font-medium transition-colors"
                >
                  ← Précédent
                </button>
              ) : (
                <div />
              )}
              {currentStep < TOTAL_STEPS - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!stepValid()}
                  className="bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-full font-medium text-sm transition-all shadow-[0_0_20px_rgba(56,163,165,0.2)] hover:shadow-[0_0_30px_rgba(56,163,165,0.4)] hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-none"
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !stepValid()}
                  className="bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-full font-medium text-sm transition-all shadow-[0_0_20px_rgba(56,163,165,0.3)] hover:shadow-[0_0_30px_rgba(56,163,165,0.5)] hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-none"
                >
                  {isSubmitting
                    ? 'Envoi en cours...'
                    : 'Confirmer la réservation'}
                </button>
              )}
            </div>
          </div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B132B] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-brand-blue rounded-full animate-spin" />
        </div>
      }
    >
      <CheckoutForm />
    </Suspense>
  )
}
