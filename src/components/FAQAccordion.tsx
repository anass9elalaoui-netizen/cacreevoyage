'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    question: 'Comment fonctionne un voyage sur-mesure ?',
    answer: "Tout commence par un échange avec nos experts. Vous nous partagez vos envies, votre budget et vos dates, et nous construisons un itinéraire 100% personnalisé. Chaque détail est ajusté jusqu'à ce que le voyage vous ressemble parfaitement.",
  },
  {
    question: 'Quelles destinations couvrez-vous ?',
    answer: "Nous proposons des circuits au Maroc (désert, montagne, côte atlantique) ainsi qu'à l'international : Zanzibar, Turquie, Thaïlande, Indonésie, et bien d'autres. Notre réseau de partenaires locaux s'étend sur 45+ destinations.",
  },
  {
    question: 'Quel est le délai pour organiser un voyage ?',
    answer: "Nous recommandons de nous contacter au moins 4 à 6 semaines avant votre départ pour un voyage optimal. Cependant, pour les demandes urgentes, nous pouvons organiser un séjour en 2 semaines selon la disponibilité.",
  },
  {
    question: 'Les vols sont-ils inclus ?',
    answer: "Par défaut, nos circuits n'incluent pas les vols internationaux afin de vous laisser la flexibilité de choisir votre compagnie et vos horaires. Nous pouvons cependant vous assister dans la recherche et la réservation de vos billets.",
  },
  {
    question: "Comment réserver et payer ?",
    answer: "La réservation se confirme par un acompte de 30% du montant total. Le solde est à régler 30 jours avant le départ. Nous acceptons les virements bancaires et les paiements par carte via notre plateforme sécurisée.",
  },
  {
    question: 'Proposez-vous une assurance voyage ?',
    answer: "Nous recommandons fortement de souscrire une assurance voyage. Nous pouvons vous orienter vers nos partenaires assureurs qui proposent des formules adaptées à votre type de voyage (annulation, rapatriement, bagages).",
  },
]

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="relative w-full py-24 bg-brand-dark overflow-hidden">
      <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="uppercase tracking-[0.2em] text-brand-blue text-xs font-sans font-medium mb-4 block"
          >
            FAQ
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl text-white"
          >
            Questions Fréquentes
          </motion.h2>
        </div>

        {/* Accordion items */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="rounded-2xl border border-white/8 overflow-hidden transition-colors"
              style={{
                background: openIndex === index ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
              }}
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left group"
              >
                <span className="font-sans text-white text-sm md:text-base font-medium pr-4">
                  {faq.question}
                </span>
                <motion.svg
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-5 h-5 text-brand-blue flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </motion.svg>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-brand-silver text-sm leading-relaxed border-t border-white/5 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
