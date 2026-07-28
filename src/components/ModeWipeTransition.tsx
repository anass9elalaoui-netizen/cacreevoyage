'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'

// ─── Constants ───────────────────────────────────────────────
const WIPE_DURATION = 700
const MIDPOINT = 350
const FADE_DURATION = 150
const WIPE_EASING = 'cubic-bezier(0.76, 0, 0.24, 1)'

const MODE_COLORS = {
  dark: '#0a0a1a',
  light: '#fdf8f0',
} as const

// ─── Reduced-motion detection ────────────────────────────────
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mql.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return reduced
}

// ─── Types ───────────────────────────────────────────────────
interface WipeOrigin {
  x: number
  y: number
}

// ─── Hook: useWipeTransition ─────────────────────────────────
/**
 * Returns a function `triggerWipe(origin, themeSwapFn)` that:
 *   1. Shows a full-viewport overlay in the NEW mode's color
 *   2. Animates clip-path circle from the toggle button position
 *   3. At the midpoint (350ms), calls `themeSwapFn()` to swap the theme
 *   4. Fades out the overlay and cleans up
 */
export function useWipeTransition() {
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const isAnimating = useRef(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setPortalTarget(document.body)
  }, [])

  const triggerWipe = useCallback(
    (origin: WipeOrigin, currentTheme: 'light' | 'dark', themeSwapFn: () => void) => {
      if (isAnimating.current) return
      isAnimating.current = true

      const overlay = overlayRef.current
      if (!overlay) {
        // Fallback: just swap immediately
        themeSwapFn()
        isAnimating.current = false
        return
      }

      const newTheme = currentTheme === 'dark' ? 'light' : 'dark'

      // ─── Reduced-motion path: instant cross-fade ─────────
      if (prefersReducedMotion) {
        overlay.style.backgroundColor = MODE_COLORS[newTheme]
        overlay.style.clipPath = 'none'
        overlay.style.opacity = '0'

        const fadeIn = overlay.animate(
          [{ opacity: '0' }, { opacity: '1' }],
          { duration: 100, fill: 'forwards' },
        )

        fadeIn.onfinish = () => {
          themeSwapFn()

          const fadeOut = overlay.animate(
            [{ opacity: '1' }, { opacity: '0' }],
            { duration: 200, fill: 'forwards' },
          )

          fadeOut.onfinish = () => {
            isAnimating.current = false
          }
        }

        return
      }

      // ─── Full wipe path ──────────────────────────────────
      const { x, y } = origin

      overlay.style.backgroundColor = MODE_COLORS[newTheme]
      overlay.style.opacity = '1'
      overlay.style.clipPath = `circle(0% at ${x}px ${y}px)`

      const wipeAnimation = overlay.animate(
        [
          { clipPath: `circle(0% at ${x}px ${y}px)` },
          { clipPath: `circle(150% at ${x}px ${y}px)` },
        ],
        {
          duration: WIPE_DURATION,
          easing: WIPE_EASING,
          fill: 'forwards',
        },
      )

      // Execute theme swap at midpoint
      const midpointTimer = setTimeout(() => {
        themeSwapFn()
      }, MIDPOINT)

      // Fade out after wipe completes
      wipeAnimation.onfinish = () => {
        const fadeOut = overlay.animate(
          [{ opacity: '1' }, { opacity: '0' }],
          { duration: FADE_DURATION, fill: 'forwards' },
        )

        fadeOut.onfinish = () => {
          overlay.style.opacity = '0'
          overlay.style.clipPath = 'circle(0% at 0px 0px)'
          isAnimating.current = false
        }
      }

      // Safety cleanup on cancel
      wipeAnimation.oncancel = () => {
        clearTimeout(midpointTimer)
        isAnimating.current = false
      }
    },
    [prefersReducedMotion],
  )

  const WipeOverlay = useCallback(() => {
    if (!portalTarget) return null

    return createPortal(
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          pointerEvents: 'none',
          opacity: 0,
          clipPath: 'circle(0% at 0px 0px)',
          willChange: 'clip-path, opacity',
        }}
      />,
      portalTarget,
    )
  }, [portalTarget])

  return { triggerWipe, WipeOverlay, isAnimating: isAnimating }
}
