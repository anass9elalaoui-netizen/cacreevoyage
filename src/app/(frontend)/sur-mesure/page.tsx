'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+212661373347'
const TOTAL_STEPS = 4

const budgetOptions = [
  { label: '< 10 000 MAD', value: 'under-10k' },
  { label: '10 000 - 25 000 MAD', value: '10k-25k' },
  { label: '25 000 - 50 000 MAD', value: '25k-50k' },
  { label: '50 000 - 100 000 MAD', value: '50k-100k' },
  { label: '> 100 000 MAD', value: 'over-100k' },
]

interface FormData {
  fullName: string
  email: string
  phone: string
  destinationWish: string
  budget: string
  message: string
}

export default function SurMesurePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    fullName: '', email: '', phone: '', destinationWish: '', budget: '', message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const goNext = () => { setDirection(1); setCurrentStep(s => Math.min(s + 1, TOTAL_STEPS - 1)) }
  const goPrev = () => { setDirection(-1); setCurrentStep(s => Math.max(s - 1, 0)) }
  const setField = (key: keyof FormData, value: string) => setFormData(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status: 'new' })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Une erreur est survenue.')
      }
      setSuccess(true)
      const waText = encodeURIComponent(
        `Nouvelle demande Sur Mesure:\nDestination: ${formData.destinationWish}\nPar: ${formData.fullName}\nEmail: ${formData.email}\nTéléphone: ${formData.phone}\nBudget: ${budgetOptions.find(b => b.value === formData.budget)?.label || formData.budget}\nMessage: ${formData.message || 'Aucun message'}`
      )
      window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${waText}`, '_blank')
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
      case 0: return formData.destinationWish.trim().length > 0
      case 1: return formData.budget !== ''
      case 2: return true
      case 3: return formData.fullName.trim().length > 0 && formData.email.trim().length > 0 && formData.phone.trim().length > 0
      default: return false
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0B132B]">
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0">
        <source src="/maroc%20imssfrane.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[#0B132B]/60 backdrop-blur-sm z-[1]" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} className="relative z-10 w-[95%] max-w-2xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-12 lg:p-16 overflow-hidden">
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5 }} className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-brand-blue/20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-2xl font-serif text-white mb-3">Demande envoyée</h3>
              <p className="text-white/70 font-light leading-relaxed">Votre demande est en cours d&apos;envoi vers notre équipe d&apos;experts.<br/>Une fenêtre WhatsApp s&apos;est ouverte. Vous pouvez modifier votre message avant de l&apos;envoyer.</p>
            </motion.div>
          ) : (
            <div key="wizard" className="relative">
              <div className="mb-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/50 text-xs font-medium tracking-widest uppercase">Étape {String(currentStep + 1).padStart(2, '0')} / {String(TOTAL_STEPS).padStart(2, '0')}</span>
                </div>
                <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-brand-blue" initial={{ width: 0 }} animate={{ width: `${((currentStep + 1) / TOTAL_STEPS) * 100}%` }} transition={{ duration: 0.4, ease: 'easeInOut' }} />
                </div>
              </div>
              <AnimatePresence custom={direction} mode="wait">
                {currentStep === 0 && (
                  <motion.div key="step0" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: 'easeInOut' }} className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">Où vous mène votre imagination ?</h2>
                    <p className="text-white/50 text-sm font-light mb-6">Tapez la destination de vos rêves.</p>
                    <input type="text" value={formData.destinationWish} onChange={e => setField('destinationWish', e.target.value)} placeholder="Ex: Zanzibar, Japon, Pérou..." className="w-full text-2xl md:text-3xl text-white bg-transparent border-b border-white/30 placeholder-white/30 focus:border-brand-blue outline-none py-4 transition-colors font-serif" autoFocus />
                  </motion.div>
                )}
                {currentStep === 1 && (
                  <motion.div key="step1" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: 'easeInOut' }} className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">Quel est votre budget estimé ?</h2>
                    <p className="text-white/50 text-sm font-light mb-6">Sélectionnez une fourchette.</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {budgetOptions.map(opt => (
                        <button key={opt.value} type="button" onClick={() => setField('budget', opt.value)} className={`relative rounded-2xl border px-4 py-6 text-center transition-all cursor-pointer ${formData.budget === opt.value ? 'border-brand-blue bg-white/10' : 'border-white/10 bg-white/[0.03] hover:bg-white/5'}`}>
                          <span className="text-white font-medium text-sm">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
                {currentStep === 2 && (
                  <motion.div key="step2" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: 'easeInOut' }} className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">Décrivez-nous votre voyage idéal.</h2>
                    <p className="text-white/50 text-sm font-light mb-6">Activités, ambiance, dates souhaitées... tout ce qui compte.</p>
                    <textarea value={formData.message} onChange={e => setField('message', e.target.value)} placeholder="Je rêve d'un safari au lever du soleil, suivi d'un dîner sur la plage..." rows={5} className="w-full text-lg text-white bg-transparent border-b border-white/30 placeholder-white/30 focus:border-brand-blue outline-none py-4 transition-colors resize-none" />
                  </motion.div>
                )}
                {currentStep === 3 && (
                  <motion.div key="step3" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: 'easeInOut' }} className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">Comment pouvons-nous vous contacter ?</h2>
                    <p className="text-white/50 text-sm font-light mb-6">Vos coordonnées pour finaliser votre projet.</p>
                    <div className="space-y-5">
                      <input type="text" value={formData.fullName} onChange={e => setField('fullName', e.target.value)} placeholder="Nom complet" className="w-full text-lg text-white bg-transparent border-b border-white/30 placeholder-white/50 focus:border-brand-blue outline-none py-3 transition-colors" />
                      <input type="email" value={formData.email} onChange={e => setField('email', e.target.value)} placeholder="Adresse email" className="w-full text-lg text-white bg-transparent border-b border-white/30 placeholder-white/50 focus:border-brand-blue outline-none py-3 transition-colors" />
                      <input type="tel" value={formData.phone} onChange={e => setField('phone', e.target.value)} placeholder="Téléphone" className="w-full text-lg text-white bg-transparent border-b border-white/30 placeholder-white/50 focus:border-brand-blue outline-none py-3 transition-colors" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {error && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-6">{error}</motion.p>}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">
                {currentStep > 0 ? (
                  <button type="button" onClick={goPrev} className="text-white/50 hover:text-white text-sm font-medium transition-colors">← Précédent</button>
                ) : <div />}
                {currentStep < TOTAL_STEPS - 1 ? (
                  <button type="button" onClick={goNext} disabled={!stepValid()} className="bg-brand-blue text-white px-8 py-3 rounded-full font-medium text-sm hover:bg-brand-blue/90 transition-all shadow-[0_0_20px_rgba(56,163,165,0.3)] hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-none">Suivant</button>
                ) : (
                  <button type="button" onClick={handleSubmit} disabled={isSubmitting || !stepValid()} className="bg-brand-blue text-white px-8 py-3 rounded-full font-medium text-sm hover:bg-brand-blue/90 transition-all shadow-[0_0_20px_rgba(56,163,165,0.3)] hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-none">{isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}</button>
                )}
              </div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
