'use client'

import { useMemo } from 'react'

// ─── Types ───────────────────────────────────────────────────
interface EmberParticle {
  id: number
  size: number
  color: string
  xDrift: number
  yTravel: number
  duration: number
  delay: number
}

// ─── Constants ───────────────────────────────────────────────
const EMBER_COUNT = 12
const EMBER_COLORS = ['#ff8c42', '#ffb347', '#ff6b1a']

function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

// ─── Component ───────────────────────────────────────────────
export default function CampfireGlow() {
  // Generate ember particles once at mount
  const embers = useMemo<EmberParticle[]>(() => {
    return Array.from({ length: EMBER_COUNT }, (_, i) => ({
      id: i,
      size: randomRange(3, 5),
      color: EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)],
      xDrift: randomRange(-40, 40),
      yTravel: randomRange(80, 160),
      duration: randomRange(2, 4),
      delay: randomRange(0, 3),
    }))
  }, [])

  return (
    <>
      {/* ── Campfire radial glow ───────────────────────────────── */}
      <div
        aria-hidden="true"
        className="campfire-glow absolute inset-0 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-700"
      >
        <div className="campfire-glow__radial absolute bottom-0 left-0 right-0 h-[70%]" />
      </div>

      {/* ── Ember particles ────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-700 z-10"
      >
        {embers.map((ember) => (
          <div
            key={ember.id}
            className="campfire-ember absolute rounded-full"
            style={{
              width: `${ember.size}px`,
              height: `${ember.size}px`,
              backgroundColor: ember.color,
              opacity: 0.6,
              bottom: '0px',
              left: '50%',
              '--ember-x-drift': `${ember.xDrift}px`,
              '--ember-y-travel': `${ember.yTravel}px`,
              '--ember-duration': `${ember.duration}s`,
              '--ember-delay': `${ember.delay}s`,
              animationName: 'ember-rise',
              animationDuration: `var(--ember-duration)`,
              animationDelay: `var(--ember-delay)`,
              animationTimingFunction: 'ease-out',
              animationIterationCount: 'infinite',
            } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  )
}
