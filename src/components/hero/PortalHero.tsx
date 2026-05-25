'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  MotionValue,
} from 'framer-motion'

/* ══════════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════════ */
interface PortalHeroProps {
  assetBaseUrl?: string
  frameCount?: number
  textPhase1Title?: string
  textPhase1Sub?: string
  textPhase2Title?: string
  textPhase2Sub?: string
  textPhase3Title?: string
  ctaLabel?: string
}

/* ══════════════════════════════════════════════════════════════
   FLOATING TEXT — vertical parallax with staggered opacity
   Each message floats upward and fades in/out at its own scroll phase.
   ══════════════════════════════════════════════════════════════ */
function FloatingMessage({
  scrollProgress,
  enterStart,
  enterEnd,
  exitStart,
  exitEnd,
  children,
  className,
}: {
  scrollProgress: MotionValue<number>
  enterStart: number
  enterEnd: number
  exitStart: number
  exitEnd: number
  children: React.ReactNode
  className?: string
}) {
  // Vertical parallax: text drifts up from below center to above center
  const y = useTransform(
    scrollProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    ['30vh', '0vh', '0vh', '-30vh'],
  )
  // Opacity: fade in → hold → fade out
  const opacity = useTransform(
    scrollProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0, 1, 1, 0],
  )
  // Blur: sharp during hold, blurred at edges
  const filter = useTransform(
    scrollProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    ['blur(8px)', 'blur(0px)', 'blur(0px)', 'blur(8px)'],
  )

  return (
    <motion.div
      style={{ y, opacity, filter }}
      className={`absolute inset-0 z-20 flex items-center justify-center pointer-events-none transform-gpu will-change-[opacity,transform,filter] ${className || ''}`}
    >
      {children}
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════════
   PORTAL HERO COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function PortalHero({
  assetBaseUrl = '/hero-frames',
  frameCount = 142,
  textPhase1Title = "L'art du voyage sur-mesure.",
  textPhase1Sub = 'Chaque grand voyage commence par une porte fermée.',
  textPhase2Title = 'Éveillez vos sens.',
  textPhase2Sub = "Un monde d'exceptions s'ouvre à vous.",
  textPhase3Title = 'Prenez votre envol.',
  ctaLabel = 'Créer Mon Voyage',
}: PortalHeroProps) {
  /* ────────────────────────────────────────────────────────────
     Phase 1: SSR Safety & Mobile Bifurcation
     ──────────────────────────────────────────────────────────── */
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [firstFrameReady, setFirstFrameReady] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentFrameRef = useRef(1)
  const lastDrawnRef = useRef(-1)

  useEffect(() => {
    setMounted(true)
    setIsMobile(window.innerWidth < 768)

    const mql = window.matchMedia('(max-width: 768px)')
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  /* ────────────────────────────────────────────────────────────
     Phase 2: Scroll tracking (all hooks unconditional)
     Outer container = 250vh, sticky inner = 100vh
     scrollYProgress: 0.0 → 1.0 over the 250vh distance
     ──────────────────────────────────────────────────────────── */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.05,
    restDelta: 0.0005,
  })

  // Scroll indicator fades fast
  const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.04], [1, 0])

  /* ────────────────────────────────────────────────────────────
     Phase 4 (Desktop): Frame index mapped to 0.0→0.5 scroll
     Door fully open (frame 142) by 50% scroll
     ──────────────────────────────────────────────────────────── */
  const desktopFrameIndex = useTransform(
    smoothProgress,
    [0, 0.5],
    [1, frameCount],
    { clamp: true },
  )

  /* ────────────────────────────────────────────────────────────
     Phase 4 (Desktop): Zoom-through scale 0.5→0.9
     Canvas scales from 1x to 20x into the doorway
     ──────────────────────────────────────────────────────────── */
  const desktopCanvasScale = useTransform(
    smoothProgress,
    [0.5, 0.9],
    [1, 20],
    { clamp: true },
  )

  /* ────────────────────────────────────────────────────────────
     Phase 3 (Mobile): Single image zoom 0.0→0.8
     Scales from 1x to 20x (no canvas, no 142 frames)
     ──────────────────────────────────────────────────────────── */
  const mobileZoomScale = useTransform(
    smoothProgress,
    [0, 0.8],
    [1, 20],
    { clamp: true },
  )

  /* ────────────────────────────────────────────────────────────
     Phase exit: Sticky container opacity fade 0.9→1.0
     Reveals the website section below seamlessly
     ──────────────────────────────────────────────────────────── */
  const containerFadeOpacity = useTransform(
    smoothProgress,
    [0.88, 1.0],
    [1, 0],
    { clamp: true },
  )

  /* ── Frame URL builder ─────────────────────────────────── */
  const frameUrl = useCallback(
    (n: number) =>
      `${assetBaseUrl}/ezgif-frame-${String(n).padStart(3, '0')}.jpg`,
    [assetBaseUrl],
  )

  /* ────────────────────────────────────────────────────────────
     Phase 4: Desktop progressive frame preloading
     Load frame 1 first for instant display, then batch the rest
     ──────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!mounted || isMobile) return

    let cancelled = false
    const imgArray: HTMLImageElement[] = new Array(frameCount)

    const loadFrame = (idx: number): Promise<void> =>
      new Promise((resolve) => {
        const img = new Image()
        img.src = frameUrl(idx + 1)
        img.onload = () => {
          if (!cancelled) {
            imgArray[idx] = img
            if (idx === 0) {
              imagesRef.current = imgArray
              setFirstFrameReady(true)
            }
          }
          resolve()
        }
        img.onerror = () => resolve()
      })

    // Load frame 0 immediately for instant first paint
    loadFrame(0).then(async () => {
      if (cancelled) return
      const BATCH = 8
      for (let start = 1; start < frameCount; start += BATCH) {
        if (cancelled) break
        const batch: Promise<void>[] = []
        for (let i = start; i < Math.min(start + BATCH, frameCount); i++) {
          batch.push(loadFrame(i))
        }
        await Promise.all(batch)
      }
    })

    return () => {
      cancelled = true
      imagesRef.current = []
      setFirstFrameReady(false)
    }
  }, [mounted, isMobile, frameCount, frameUrl])

  /* ────────────────────────────────────────────────────────────
     Canvas draw function — DPR-aware, object-fit: cover
     ──────────────────────────────────────────────────────────── */
  const drawFrame = useCallback(
    (index: number) => {
      if (index === lastDrawnRef.current) return

      const canvas = canvasRef.current
      if (!canvas) return

      const images = imagesRef.current
      if (!images || images.length === 0) return

      const target = Math.max(0, Math.min(index - 1, frameCount - 1))
      let img = images[target]

      // Fallback: nearest loaded frame
      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let d = 1; d < frameCount; d++) {
          const lo = images[target - d]
          const hi = images[target + d]
          if (target - d >= 0 && lo?.complete && lo.naturalWidth > 0) {
            img = lo
            break
          }
          if (target + d < frameCount && hi?.complete && hi.naturalWidth > 0) {
            img = hi
            break
          }
        }
      }
      if (!img || !img.complete || img.naturalWidth === 0) return

      const ctx = canvas.getContext('2d', { alpha: false })
      if (!ctx) return

      const dpr = window.devicePixelRatio || 1
      const logicalW = canvas.clientWidth
      const logicalH = canvas.clientHeight

      if (
        canvas.width !== logicalW * dpr ||
        canvas.height !== logicalH * dpr
      ) {
        canvas.width = logicalW * dpr
        canvas.height = logicalH * dpr
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Object-fit: cover
      const iw = img.naturalWidth
      const ih = img.naturalHeight
      const scale = Math.max(logicalW / iw, logicalH / ih)
      const sw = logicalW / scale
      const sh = logicalH / scale
      const sx = (iw - sw) / 2
      const sy = (ih - sh) / 2

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, logicalW, logicalH)
      lastDrawnRef.current = index
    },
    [frameCount],
  )

  /* ── Scroll-driven scrubbing ───────────────────────────── */
  useMotionValueEvent(desktopFrameIndex, 'change', (latest) => {
    if (!firstFrameReady || isMobile) return
    const idx = Math.round(latest as number)
    if (idx !== currentFrameRef.current) {
      currentFrameRef.current = idx
      requestAnimationFrame(() => drawFrame(idx))
    }
  })

  /* ── Initial draw + resize ─────────────────────────────── */
  useEffect(() => {
    if (!firstFrameReady || isMobile) return

    lastDrawnRef.current = -1
    drawFrame(currentFrameRef.current)

    const onResize = () => {
      lastDrawnRef.current = -1
      drawFrame(currentFrameRef.current)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [firstFrameReady, isMobile, drawFrame])

  /* ══════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════ */

  // Phase 1: SSR placeholder — dark screen, no browser APIs
  if (!mounted) {
    return (
      <div className="relative w-full h-[250vh] bg-[#050B14]">
        <div className="sticky top-0 w-full h-screen bg-[#050B14]" />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[250vh] bg-[#050B14]"
      style={{ touchAction: 'pan-y' }}
    >
      {/* ── Sticky viewport (locked to screen while scrolling 250vh) ── */}
      <motion.div
        className="sticky top-0 w-full h-screen overflow-hidden bg-[#050B14]"
        style={{ opacity: containerFadeOpacity }}
      >
        {/* ════════════════════════════════════════════════════
           MOBILE: Single image zoom-through (zero RAM overhead)
           ════════════════════════════════════════════════════ */}
        {isMobile && (
          <motion.div
            className="absolute inset-0 w-full h-full"
            style={{
              scale: mobileZoomScale,
              transformOrigin: '50% 55%',
            }}
          >
            <img
              src={`${assetBaseUrl}/ezgif-frame-${String(frameCount).padStart(3, '0')}.jpg`}
              alt="Ça Crée Voyage — Moroccan door"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════
           DESKTOP: Canvas flipbook (0→0.5) + zoom (0.5→0.9)
           ════════════════════════════════════════════════════ */}
        {!isMobile && (
          <motion.div
            className="absolute inset-0 w-full h-full"
            style={{
              scale: desktopCanvasScale,
              transformOrigin: '50% 55%',
            }}
          >
            <canvas
              ref={canvasRef}
              className={`w-full h-full transition-opacity duration-500 ${
                firstFrameReady ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </motion.div>
        )}

        {/* ── Cinematic overlays ──────────────────────────────── */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050B14]/80 via-[#050B14]/30 to-transparent pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none z-[11]"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 40%, rgba(5,11,20,0.5) 100%)',
          }}
        />

        {/* ════════════════════════════════════════════════════
           Phase 5: Vertical text parallax — 3 staggered messages
           Each floats upward and fades in/out at its own scroll window
           ════════════════════════════════════════════════════ */}

        {/* Message 1: "L'art du voyage sur-mesure." — scroll 0.0 → 0.20 */}
        <FloatingMessage
          scrollProgress={smoothProgress}
          enterStart={0.0}
          enterEnd={0.04}
          exitStart={0.14}
          exitEnd={0.20}
        >
          <div className="text-center max-w-3xl px-6">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-white font-light leading-tight drop-shadow-lg">
              {textPhase1Title}
            </h1>
            <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-[#C9A84C] mt-4 drop-shadow-md">
              {textPhase1Sub}
            </p>
          </div>
        </FloatingMessage>

        {/* Message 2: "Éveillez vos sens." — scroll 0.18 → 0.38 */}
        <FloatingMessage
          scrollProgress={smoothProgress}
          enterStart={0.18}
          enterEnd={0.23}
          exitStart={0.33}
          exitEnd={0.38}
        >
          <div className="text-center max-w-2xl px-6">
            <h2 className="font-serif text-4xl md:text-6xl text-white font-light tracking-wide drop-shadow-lg">
              {textPhase2Title}
            </h2>
            <p className="font-sans text-sm md:text-base text-[#C9A84C] uppercase tracking-[0.3em] mt-4 font-light">
              {textPhase2Sub}
            </p>
          </div>
        </FloatingMessage>

        {/* Message 3: "Prenez votre envol." + CTA — scroll 0.35 → 0.52 */}
        <FloatingMessage
          scrollProgress={smoothProgress}
          enterStart={0.35}
          enterEnd={0.40}
          exitStart={0.47}
          exitEnd={0.52}
        >
          <div className="text-center flex flex-col items-center">
            <h2 className="font-serif text-4xl md:text-5xl text-white font-light mb-8 drop-shadow-xl">
              {textPhase3Title}
            </h2>
            <a
              href="/sur-mesure"
              className="pointer-events-auto px-10 py-4 rounded-full border border-[#38A3A5]/50 text-[#38A3A5] font-sans text-xs md:text-sm uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[#38A3A5]/10 hover:border-[#38A3A5] backdrop-blur-md flex items-center gap-3"
            >
              {ctaLabel} <span>&rarr;</span>
            </a>
          </div>
        </FloatingMessage>

        {/* ── Scroll indicator ────────────────────────────────── */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
          style={{ opacity: scrollIndicatorOpacity }}
        >
          <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-sans">
            Scroll
          </span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </motion.div>
      </motion.div>
    </div>
  )
}
