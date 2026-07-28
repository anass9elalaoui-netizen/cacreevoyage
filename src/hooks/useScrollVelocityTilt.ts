'use client'

import { useScroll, useVelocity, useSpring, useTransform, MotionValue } from 'framer-motion'
import { useState, useEffect } from 'react'

export function useScrollVelocityTilt(options?: {
  maxTilt?: number
  spring?: { stiffness: number; damping: number; mass: number }
}): { rotateY: MotionValue<number>; rotateX: MotionValue<number> } {
  const maxTilt = options?.maxTilt ?? 3
  const springConfig = options?.spring ?? { stiffness: 120, damping: 28, mass: 0.6 }

  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)

  const [reducedMotion, setReducedMotion] = useState(false)
  const [hasFinePointer, setHasFinePointer] = useState(true)

  useEffect(() => {
    const mediaQueryMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQueryMotion.matches)
    
    // Check if the device has a fine pointer (mouse/trackpad). Touch devices shouldn't do tilt since scrolling overlaps with touching.
    const mediaQueryPointer = window.matchMedia('(pointer: fine)')
    setHasFinePointer(mediaQueryPointer.matches)
  }, [])

  // velocity / 1200 * maxTilt
  const rawRotateY = useTransform(scrollVelocity, [-1200, 0, 1200], [maxTilt, 0, -maxTilt])
  const rawRotateX = useTransform(scrollVelocity, [-1200, 0, 1200], [-maxTilt * 0.5, 0, maxTilt * 0.5])

  // Apply spring physics
  const springRotateY = useSpring(rawRotateY, springConfig)
  const springRotateX = useSpring(rawRotateX, springConfig)

  // Fallbacks if not supported
  const fallbackY = useTransform(scrollY, () => 0)
  const fallbackX = useTransform(scrollY, () => 0)

  if (reducedMotion || !hasFinePointer) {
    return { rotateY: fallbackY, rotateX: fallbackX }
  }

  return { rotateY: springRotateY, rotateX: springRotateX }
}
