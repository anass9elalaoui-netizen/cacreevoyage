'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

export type ContactState = { status: 'idle' | 'success' | 'error'; message?: string }

const SUBJECT_LABELS: Record<string, string> = {
  voyage: 'Demande de voyage',
  information: 'Informations générales',
  partenariat: 'Partenariat',
  autre: 'Autre',
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot — real visitors never see or fill this field
  if (String(formData.get('website') || '').trim()) {
    return { status: 'success' }
  }

  const fullName = String(formData.get('fullName') || '').trim().slice(0, 200)
  const email = String(formData.get('email') || '').trim().slice(0, 200)
  const phone = String(formData.get('phone') || '').trim().slice(0, 50)
  const subject = SUBJECT_LABELS[String(formData.get('subject') || '')] || SUBJECT_LABELS.autre
  const message = String(formData.get('message') || '').trim().slice(0, 5000)

  if (!fullName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: 'error', message: 'Merci de renseigner votre nom et un email valide.' }
  }

  try {
    const payload = await getPayload({ config: configPromise })
    await payload.create({
      collection: 'inquiries',
      data: {
        fullName,
        email,
        phone: phone || undefined,
        message: `[${subject}] ${message}`.trim(),
        source: 'contact-page',
        status: 'new',
      },
    })
    return { status: 'success' }
  } catch (err) {
    console.error('Contact form error:', err)
    return { status: 'error', message: "Une erreur est survenue. Écrivez-nous sur WhatsApp ou par email." }
  }
}
