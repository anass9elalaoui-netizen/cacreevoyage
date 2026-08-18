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
  { number: '847', label: 'Voyageurs Satisfaits' },
  { number: '5', label: "Années d'Excellence" },
  { number: '24', label: 'Destinations Couvertes' },
  { number: '94%', label: 'Clients qui Reviennent' },
]

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const [displayValue, setDisplayValue] = useState('0')
  const [suffixValue, setSuffixValue] = useState('')

  useEffect(() => {
    if (!isInView) return

    const numericMatch = value.match(/^(\d+)(.*)$/)
    if (!numericMatch) {
      setDisplayValue(value)
      return
    }

    const target = parseInt(numericMatch[1], 10)
    const suffix = numericMatch[2] || ''
    setSuffixValue(suffix)
    
    const duration = 2000
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      const eased = easeOutExpo(progress)
      const current = Math.round(target * eased)
      
      setDisplayValue(current.toString())

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, value])

  return (
    <span ref={ref} className="font-light text-[3.5rem]">
      {displayValue}
      {suffixValue && <span className="text-base font-normal ml-1">{suffixValue}</span>}
    </span>
  )
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
              <div className="font-serif text-brand-blue mb-2 leading-none flex items-baseline justify-center">
                <CountUp value={stat.number} />
              </div>
              <div className="text-xs md:text-sm uppercase tracking-[0.15em] text-brand-silver font-sans mt-2">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
