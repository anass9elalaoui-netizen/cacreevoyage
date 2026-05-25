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
   FLOATING TEXT — vertical parallax with staggered fade
   ══════════════════════════════════════════════════════════════ */
function FloatingMessage({
  scrollProgress,
  yStops,
  yValues,
  opacityStops,
  opacityValues,
  children,
}: {
  scrollProgress: MotionValue<number>
  yStops: number[]
  yValues: string[]
  opacityStops: number[]
  opacityValues: number[]
  children: React.ReactNode
}) {
  const y = useTransform(scrollProgress, yStops, yValues)
  const opacity = useTransform(scrollProgress, opacityStops, opacityValues)

  return (
    <motion.div
      style={{ y, opacity }}
      className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none transform-gpu will-change-[opacity,transform]"
    >
      {children}
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════════
   BUILD FRAME LIST — full 142 on desktop, ~30 on mobile
   ══════════════════════════════════════════════════════════════ */
function buildFrameList(totalFrames: number, mobile: boolean): number[] {
  if (!mobile) {
    // Desktop: every frame 1..142
    return Array.from({ length: totalFrames }, (_, i) => i + 1)
  }
  // Mobile: every 5th frame + always include the last frame
  const STEP = 5
  const frames: number[] = []
  for (let i = 1; i <= totalFrames; i += STEP) {
    frames.push(i)
  }
  if (frames[frames.length - 1] !== totalFrames) {
    frames.push(totalFrames)
  }
  return frames // ~30 frames
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
  /* ── State ─────────────────────────────────────────────── */
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [ready, setReady] = useState(false)

  /* ── Refs ──────────────────────────────────────────────── */
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const frameListRef = useRef<number[]>([])
  const lastDrawnRef = useRef(-1)

  /* ────────────────────────────────────────────────────────
     Phase 1: SSR Safety
     ──────────────────────────────────────────────────────── */
  useEffect(() => {
    const mobile = window.innerWidth < 768
    setIsMobile(mobile)
    setMounted(true)

    const mql = window.matchMedia('(max-width: 768px)')
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  /* ────────────────────────────────────────────────────────
     Scroll tracking — 350vh distance, all hooks unconditional
     ──────────────────────────────────────────────────────── */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.05,
    restDelta: 0.0005,
  })

  /* ────────────────────────────────────────────────────────
     Phase 3: The Split Transform Math
     ──────────────────────────────────────────────────────── */

  // 1. Door Opens: scroll 0.0 → 0.45 → frame array index
  //    We transform to a normalized 0→1 within the 0→0.45 range,
  //    then multiply by array length in the draw function
  const doorProgress = useTransform(
    smoothProgress,
    [0, 0.45],
    [0, 1],
    { clamp: true },
  )

  // 2. Deep Zoom: scroll 0.45 → 0.85 → scale 1 → 25
  const canvasScale = useTransform(
    smoothProgress,
    [0.45, 0.85],
    [1, 25],
    { clamp: true },
  )

  // 3. Seamless Exit: scroll 0.85 → 1.0 → opacity 1 → 0
  const exitOpacity = useTransform(
    smoothProgress,
    [0.85, 1.0],
    [1, 0],
    { clamp: true },
  )

  // Scroll indicator
  const scrollIndicatorOpacity = useTransform(
    smoothProgress,
    [0, 0.03],
    [1, 0],
  )

  /* ── Frame URL builder ─────────────────────────────────── */
  const frameUrl = useCallback(
    (n: number) =>
      `${assetBaseUrl}/ezgif-frame-${String(n).padStart(3, '0')}.jpg`,
    [assetBaseUrl],
  )

  /* ────────────────────────────────────────────────────────
     Phase 2: Frame Preloading
     Desktop = all 142 frames
     Mobile  = ~30 frames (every 5th + last)
     ──────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!mounted) return

    const frameList = buildFrameList(frameCount, isMobile)
    frameListRef.current = frameList

    let cancelled = false
    let loadedCount = 0
    const totalToLoad = frameList.length
    const imgArray: HTMLImageElement[] = new Array(totalToLoad)

    const loadFrame = (arrayIdx: number): Promise<void> =>
      new Promise((resolve) => {
        const img = new Image()
        img.src = frameUrl(frameList[arrayIdx])
        img.onload = () => {
          if (!cancelled) {
            imgArray[arrayIdx] = img
            loadedCount++
            // Mark ready as soon as first frame loads
            if (arrayIdx === 0) {
              imagesRef.current = imgArray
              setReady(true)
            }
          }
          resolve()
        }
        img.onerror = () => {
          loadedCount++
          resolve()
        }
      })

    // Load frame 0 first for instant display
    loadFrame(0).then(async () => {
      if (cancelled) return
      const BATCH = 6
      for (let start = 1; start < totalToLoad; start += BATCH) {
        if (cancelled) break
        const batch: Promise<void>[] = []
        for (
          let i = start;
          i < Math.min(start + BATCH, totalToLoad);
          i++
        ) {
          batch.push(loadFrame(i))
        }
        await Promise.all(batch)
      }
    })

    return () => {
      cancelled = true
      imagesRef.current = []
      frameListRef.current = []
      setReady(false)
    }
  }, [mounted, isMobile, frameCount, frameUrl])

  /* ────────────────────────────────────────────────────────
     Canvas draw — DPR-aware, object-fit: cover
     ──────────────────────────────────────────────────────── */
  const drawFrame = useCallback((arrayIndex: number) => {
    if (arrayIndex === lastDrawnRef.current) return

    const canvas = canvasRef.current
    if (!canvas) return

    const images = imagesRef.current
    if (!images || images.length === 0) return

    // Clamp to valid range
    const idx = Math.max(0, Math.min(arrayIndex, images.length - 1))
    let img = images[idx]

    // Fallback: nearest loaded frame
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let d = 1; d < images.length; d++) {
        const lo = images[idx - d]
        const hi = images[idx + d]
        if (idx - d >= 0 && lo?.complete && lo.naturalWidth > 0) {
          img = lo
          break
        }
        if (idx + d < images.length && hi?.complete && hi.naturalWidth > 0) {
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

    const iw = img.naturalWidth
    const ih = img.naturalHeight
    const scale = Math.max(logicalW / iw, logicalH / ih)
    const sw = logicalW / scale
    const sh = logicalH / scale
    const sx = (iw - sw) / 2
    const sy = (ih - sh) / 2

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, logicalW, logicalH)
    lastDrawnRef.current = arrayIndex
  }, [])

  /* ── Scroll-driven scrubbing ───────────────────────────── */
  useMotionValueEvent(doorProgress, 'change', (latest) => {
    if (!ready) return
    const images = imagesRef.current
    if (!images || images.length === 0) return
    // Map 0→1 progress to array index 0→(length-1)
    const arrayIdx = Math.round((latest as number) * (images.length - 1))
    requestAnimationFrame(() => drawFrame(arrayIdx))
  })

  /* ── Initial draw + resize ─────────────────────────────── */
  useEffect(() => {
    if (!ready) return

    lastDrawnRef.current = -1
    drawFrame(0)

    const onResize = () => {
      lastDrawnRef.current = -1
      const images = imagesRef.current
      if (images && images.length > 0) {
        const progress = doorProgress.get()
        const idx = Math.round(progress * (images.length - 1))
        drawFrame(idx)
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [ready, drawFrame, doorProgress])

  /* ══════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════ */

  // SSR placeholder
  if (!mounted) {
    return (
      <div className="relative w-full h-[350vh] bg-[#050B14]">
        <div className="sticky top-0 w-full h-screen bg-[#050B14]" />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[350vh] bg-[#050B14]"
      style={{ touchAction: 'pan-y' }}
    >
      {/* ── Sticky viewport ──────────────────────────────────── */}
      <motion.div
        className="sticky top-0 w-full h-screen overflow-hidden bg-[#050B14]"
        style={{ opacity: exitOpacity }}
      >
        {/* ── Canvas with zoom transform ──────────────────────── */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            scale: canvasScale,
            transformOrigin: '50% 55%',
          }}
        >
          <canvas
            ref={canvasRef}
            className={`w-full h-full transition-opacity duration-500 ${
              ready ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </motion.div>

        {/* ── Cinematic overlays ──────────────────────────────── */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050B14]/80 via-[#050B14]/25 to-transparent pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none z-[11]"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 40%, rgba(5,11,20,0.5) 100%)',
          }}
        />

        {/* ══════════════════════════════════════════════════════
           Phase 4: Vertical Text Parallax — 3 staggered messages
           All text lives within the 0.0 → 0.45 door-opening phase
           ══════════════════════════════════════════════════════ */}

        {/* Message 1: scroll 0.0 → 0.15 → 0.25 */}
        <FloatingMessage
          scrollProgress={smoothProgress}
          yStops={[0, 0.05, 0.15, 0.25]}
          yValues={['50vh', '0vh', '0vh', '-50vh']}
          opacityStops={[0, 0.05, 0.15, 0.25]}
          opacityValues={[0, 1, 1, 0]}
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

        {/* Message 2: scroll 0.15 → 0.30 → 0.40 */}
        <FloatingMessage
          scrollProgress={smoothProgress}
          yStops={[0.15, 0.20, 0.30, 0.40]}
          yValues={['50vh', '0vh', '0vh', '-50vh']}
          opacityStops={[0.15, 0.20, 0.30, 0.40]}
          opacityValues={[0, 1, 1, 0]}
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

        {/* Message 3: scroll 0.30 → 0.40 → 0.50 */}
        <FloatingMessage
          scrollProgress={smoothProgress}
          yStops={[0.30, 0.35, 0.42, 0.50]}
          yValues={['50vh', '0vh', '0vh', '-50vh']}
          opacityStops={[0.30, 0.35, 0.42, 0.50]}
          opacityValues={[0, 1, 1, 0]}
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
