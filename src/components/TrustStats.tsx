'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

interface Stat {
  number: string
  label: string
}

interface TrustStatsProps {
  stats?: Stat[]
}

// Default stats if not provided via CMS
const defaultStats: Stat[] = [
  { number: '500+', label: 'Voyageurs Satisfaits' },
  { number: '8', label: "Années d'Excellence" },
  { number: '45+', label: 'Destinations Couvertes' },
  { number: '98%', label: 'Clients qui Reviennent' },
]

function AnimatedNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const [displayValue, setDisplayValue] = useState('0')

  useEffect(() => {
    if (!isInView) return

    // Extract numeric part and suffix
    const numericMatch = value.match(/^(\d+)(.*)$/)
    if (!numericMatch) {
      setDisplayValue(value)
      return
    }

    const target = parseInt(numericMatch[1], 10)
    const suffix = numericMatch[2] || ''
    const duration = 2000
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(target * eased)
      setDisplayValue(`${current}${suffix}`)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, value])

  return <span ref={ref}>{displayValue}</span>
}

export default function TrustStats({ stats }: TrustStatsProps) {
  const items = stats && stats.length > 0 ? stats : defaultStats

  return (
    <section className="relative w-full py-10 border-y border-white/5 backdrop-blur-md bg-brand-glass">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {items.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="font-serif text-4xl md:text-5xl text-brand-blue mb-2">
                <AnimatedNumber value={stat.number} />
              </div>
              <div className="text-xs md:text-sm uppercase tracking-[0.15em] text-brand-silver font-sans">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
