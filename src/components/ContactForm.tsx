'use client'

import { useActionState } from 'react'
import { submitContact, type ContactState } from '@/app/(frontend)/contact/actions'

const inputClass =
  'w-full px-5 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-brand-blue/50 transition-colors text-sm shadow-sm dark:shadow-none'
const labelClass = 'block text-slate-600 dark:text-brand-silver text-sm mb-2 font-body'

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState<ContactState, FormData>(submitContact, { status: 'idle' })

  if (state.status === 'success') {
    return (
      <div className="rounded-3xl p-8 border border-[#25D366]/30 bg-[#25D366]/10" role="status">
        <p className="font-heading text-2xl text-slate-900 dark:text-white mb-2">Merci, message bien reçu !</p>
        <p className="text-slate-600 dark:text-brand-silver text-sm leading-relaxed">
          Notre équipe vous répond très vite, généralement dans la journée.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-fullName" className={labelClass}>Prénom & Nom</label>
          <input id="contact-fullName" type="text" name="fullName" required className={inputClass} placeholder="Votre nom complet" />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>Email</label>
          <input id="contact-email" type="email" name="email" required className={inputClass} placeholder="votre@email.com" />
        </div>
      </div>

      <div>
        <label htmlFor="contact-phone" className={labelClass}>Téléphone / WhatsApp</label>
        <input id="contact-phone" type="tel" name="phone" className={inputClass} placeholder="+33 6 XX XX XX XX" />
      </div>

      <div>
        <label htmlFor="contact-subject" className={labelClass}>Sujet</label>
        <select
          id="contact-subject"
          name="subject"
          className="w-full px-5 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-brand-blue/50 transition-colors text-sm shadow-sm dark:shadow-none"
        >
          <option value="voyage" className="bg-slate-50 dark:bg-brand-dark">Demande de voyage</option>
          <option value="information" className="bg-slate-50 dark:bg-brand-dark">Informations générales</option>
          <option value="partenariat" className="bg-slate-50 dark:bg-brand-dark">Partenariat</option>
          <option value="autre" className="bg-slate-50 dark:bg-brand-dark">Autre</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>Message</label>
        <textarea id="contact-message" name="message" rows={6} className={`${inputClass} resize-none`} placeholder="Décrivez votre projet de voyage..." />
      </div>

      {/* Honeypot — hidden from humans, bots fill it */}
      <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === 'error' && (
        <p className="text-red-500 text-sm" role="alert">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full md:w-auto bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-60 text-white px-10 py-4 rounded-full font-body text-sm uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(56,163,165,0.3)] hover:shadow-[0_8px_30px_rgba(56,163,165,0.5)] font-semibold tracking-wider"
      >
        {isPending ? 'Envoi…' : 'Envoyer le message'}
      </button>
    </form>
  )
}
