'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

// ─── Types ───────────────────────────────────────────────────
interface Star {
  /** Normalized x position (0–1) */
  nx: number
  /** Normalized y position (0–1) */
  ny: number
  /** Rendered pixel size */
  size: number
  /** Base opacity (0.3–1.0) */
  baseOpacity: number
  /** Twinkle oscillation speed (radians per second) */
  twinkleSpeed: number
  /** Random phase offset so stars don't pulse together */
  twinklePhase: number
  /** Color hex string */
  color: string
  /** Whether this star has diffraction spikes */
  hasDiffraction: boolean
  /** Parallax / mouse depth factor (0.5–1.5) */
  depth: number
}

interface ShootingStar {
  /** Start x in pixels */
  x: number
  /** Start y in pixels */
  y: number
  /** Angle in radians */
  angle: number
  /** Trail length in pixels */
  length: number
  /** Animation start timestamp (ms) */
  startTime: number
  /** Total animation duration (ms) */
  duration: number
}

// ─── Constants ───────────────────────────────────────────────
const STAR_COUNT = 280
const SHOOTING_STAR_MIN_INTERVAL = 8000
const SHOOTING_STAR_MAX_INTERVAL = 14000
const SHOOTING_STAR_DURATION = 600
const PARALLAX_SCROLL_FACTOR = 0.12
const PARALLAX_MOUSE_FACTOR = 0.008
const FADE_IN_DURATION = 600
const FADE_OUT_DURATION = 400
const RESIZE_DEBOUNCE = 200

// ─── Gaussian-like random (Box–Muller, clamped to 0–1) ──────
function gaussianRandom(): number {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  let n = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  // Map standard normal → 0–1 with center bias (mean 0.5, sd ~0.22)
  n = n * 0.22 + 0.5
  return Math.max(0, Math.min(1, n))
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

// ─── Star generation (called once) ──────────────────────────
function generateStars(): Star[] {
  const stars: Star[] = []

  for (let i = 0; i < STAR_COUNT; i++) {
    // Color distribution: 92% white, 5% warm, 3% cool
    const colorRoll = Math.random()
    let color: string
    if (colorRoll < 0.92) color = '#ffffff'
    else if (colorRoll < 0.97) color = '#ffe8c8'
    else color = '#c8d8ff'

    const size = randomRange(0.4, 2.2)
    const isBright = size >= 2.0

    stars.push({
      nx: gaussianRandom(),
      ny: gaussianRandom(),
      size,
      baseOpacity: randomRange(0.3, 1.0),
      twinkleSpeed: randomRange(0.3, 1.8) * Math.PI * 2, // convert to rad/s
      twinklePhase: Math.random() * Math.PI * 2,
      color,
      hasDiffraction: isBright && stars.filter(s => s.hasDiffraction).length < 4,
      depth: randomRange(0.5, 1.5),
    })
  }

  // Ensure exactly 4 bright stars have diffraction
  const diffractionCount = stars.filter(s => s.hasDiffraction).length
  if (diffractionCount < 4) {
    const candidates = stars
      .filter(s => !s.hasDiffraction)
      .sort((a, b) => b.size - a.size)
    for (let i = 0; i < 4 - diffractionCount && i < candidates.length; i++) {
      candidates[i].hasDiffraction = true
      candidates[i].size = randomRange(2.0, 2.2)
    }
  }

  return stars
}

// ─── Shooting star spawner ───────────────────────────────────
function spawnShootingStar(w: number, h: number): ShootingStar {
  // Mostly left-to-right, slightly downward
  const angle = randomRange(-0.5, 0.6) // radians, roughly 30° spread
  const x = randomRange(w * 0.1, w * 0.9)
  const y = randomRange(0, h * 0.5) // upper half of viewport
  return {
    x,
    y,
    angle,
    length: randomRange(80, 140),
    startTime: performance.now(),
    duration: SHOOTING_STAR_DURATION,
  }
}

// ─── Component ───────────────────────────────────────────────
export default function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[] | null>(null)
  const rafRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5 }) // normalized 0–1
  const shootingStarRef = useRef<ShootingStar | null>(null)
  const nextShootingRef = useRef<number>(0)
  const canvasOpacityRef = useRef(0) // for fade in/out
  const fadeStartRef = useRef<number | null>(null)
  const fadeDirectionRef = useRef<'in' | 'out'>('in')
  const isDarkRef = useRef(false)
  const reducedMotionRef = useRef(false)

  const [isDark, setIsDark] = useState(false)

  // ─── Detect theme via MutationObserver on <html> class ────
  useEffect(() => {
    const html = document.documentElement
    const check = () => {
      const dark = html.classList.contains('dark')
      isDarkRef.current = dark
      setIsDark(dark)
    }

    check()

    const observer = new MutationObserver(() => check())
    observer.observe(html, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // ─── Detect prefers-reduced-motion ────────────────────────
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotionRef.current = mql.matches
    const handler = (e: MediaQueryListEvent) => { reducedMotionRef.current = e.matches }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  // ─── Mouse tracking (normalized) ──────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      }
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  // ─── Init stars once ──────────────────────────────────────
  useEffect(() => {
    if (!starsRef.current) {
      starsRef.current = generateStars()
    }
  }, [])

  // ─── Resize handler (debounced, rescales canvas) ──────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let resizeTimer: ReturnType<typeof setTimeout>

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize() // initial

    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(resize, RESIZE_DEBOUNCE)
    }

    window.addEventListener('resize', handleResize, { passive: true })
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  // ─── Render loop ──────────────────────────────────────────
  const drawFrame = useCallback((timestamp: number) => {
    const canvas = canvasRef.current
    const stars = starsRef.current
    if (!canvas || !stars) {
      rafRef.current = requestAnimationFrame(drawFrame)
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      rafRef.current = requestAnimationFrame(drawFrame)
      return
    }

    const w = window.innerWidth
    const h = window.innerHeight
    const timeSec = timestamp / 1000
    const reduced = reducedMotionRef.current
    const dark = isDarkRef.current

    // ─── Fade logic ─────────────────────────────────────
    if (dark && canvasOpacityRef.current < 1) {
      if (fadeStartRef.current === null || fadeDirectionRef.current !== 'in') {
        fadeStartRef.current = timestamp
        fadeDirectionRef.current = 'in'
      }
      const elapsed = timestamp - fadeStartRef.current
      canvasOpacityRef.current = Math.min(1, elapsed / FADE_IN_DURATION)
    } else if (!dark && canvasOpacityRef.current > 0) {
      if (fadeStartRef.current === null || fadeDirectionRef.current !== 'out') {
        fadeStartRef.current = timestamp
        fadeDirectionRef.current = 'out'
      }
      const elapsed = timestamp - fadeStartRef.current
      canvasOpacityRef.current = Math.max(0, 1 - elapsed / FADE_OUT_DURATION)
    }

    // Skip drawing if fully transparent
    if (canvasOpacityRef.current <= 0) {
      ctx.clearRect(0, 0, w, h)
      rafRef.current = requestAnimationFrame(drawFrame)
      return
    }

    // Apply canvas-level opacity only if changed
    const newOpacity = String(canvasOpacityRef.current)
    if (canvas.style.opacity !== newOpacity) {
      canvas.style.opacity = newOpacity
    }

    // Clear
    ctx.clearRect(0, 0, w, h)

    // Scroll parallax (read scrollY directly in rAF, no listener)
    const scrollOffset = window.scrollY * PARALLAX_SCROLL_FACTOR

    // Mouse offset (normalized, centered at 0.5)
    const mx = mouseRef.current.x - 0.5
    const my = mouseRef.current.y - 0.5

    // ─── Draw stars ─────────────────────────────────────
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i]

      // Position: normalized → pixels + parallax + mouse depth
      let sx = s.nx * w
      let sy = s.ny * h - scrollOffset * s.depth

      if (!reduced) {
        sx += mx * PARALLAX_MOUSE_FACTOR * w * s.depth
        sy += my * PARALLAX_MOUSE_FACTOR * h * s.depth
      }

      // Wrap vertically (parallax can push stars off-screen)
      sy = ((sy % h) + h) % h

      // Twinkle
      let opacity = s.baseOpacity
      if (!reduced) {
        const twinkle = Math.sin(timeSec * s.twinkleSpeed + s.twinklePhase)
        opacity = lerp(s.baseOpacity * 0.5, s.baseOpacity, (twinkle + 1) / 2)
      }

      // Draw star dot
      ctx.globalAlpha = opacity
      ctx.fillStyle = s.color
      ctx.beginPath()
      ctx.arc(sx, sy, s.size / 2, 0, Math.PI * 2)
      ctx.fill()

      // Diffraction spikes for bright stars
      if (s.hasDiffraction) {
        ctx.globalAlpha = opacity * 0.3
        ctx.strokeStyle = s.color
        ctx.lineWidth = 0.5
        const spikeLen = 6
        // 4 spokes at 45° angles
        for (let a = 0; a < 4; a++) {
          const angle = (Math.PI / 4) * a
          const dx = Math.cos(angle) * spikeLen
          const dy = Math.sin(angle) * spikeLen
          ctx.beginPath()
          ctx.moveTo(sx - dx, sy - dy)
          ctx.lineTo(sx + dx, sy + dy)
          ctx.stroke()
        }
      }
    }

    // ─── Shooting star ──────────────────────────────────
    if (!reduced) {
      // Spawn check
      if (!shootingStarRef.current && timestamp >= nextShootingRef.current) {
        shootingStarRef.current = spawnShootingStar(w, h)
        nextShootingRef.current = timestamp + randomRange(
          SHOOTING_STAR_MIN_INTERVAL,
          SHOOTING_STAR_MAX_INTERVAL,
        )
      }

      // Draw active shooting star
      const ss = shootingStarRef.current
      if (ss) {
        const elapsed = timestamp - ss.startTime
        const progress = Math.min(1, elapsed / ss.duration)

        if (progress >= 1) {
          shootingStarRef.current = null
        } else {
          // Ease: fast start, slow end
          const eased = 1 - Math.pow(1 - progress, 3)

          const headX = ss.x + Math.cos(ss.angle) * ss.length * 2 * eased
          const headY = ss.y + Math.sin(ss.angle) * ss.length * 2 * eased

          // Trail gradient from head backward
          const trailLen = ss.length * (1 - progress * 0.5)
          const tailX = headX - Math.cos(ss.angle) * trailLen
          const tailY = headY - Math.sin(ss.angle) * trailLen

          const gradient = ctx.createLinearGradient(headX, headY, tailX, tailY)
          gradient.addColorStop(0, `rgba(255, 255, 255, ${0.9 * (1 - progress)})`)
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

          ctx.globalAlpha = 1
          ctx.strokeStyle = gradient
          ctx.lineWidth = 1.5
          ctx.lineCap = 'round'
          ctx.beginPath()
          ctx.moveTo(headX, headY)
          ctx.lineTo(tailX, tailY)
          ctx.stroke()
        }
      }
    }

    ctx.globalAlpha = 1
    rafRef.current = requestAnimationFrame(drawFrame)
  }, [])

  // ─── Start / stop rAF loop based on visibility ────────────
  useEffect(() => {
    // Always run the loop so we can handle fade transitions
    nextShootingRef.current = performance.now() + randomRange(
      SHOOTING_STAR_MIN_INTERVAL,
      SHOOTING_STAR_MAX_INTERVAL,
    )
    rafRef.current = requestAnimationFrame(drawFrame)

    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [drawFrame])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        opacity: 0,
      }}
    />
  )
}
