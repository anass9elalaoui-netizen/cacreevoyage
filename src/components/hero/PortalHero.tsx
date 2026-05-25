'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion'

/* ──────────────────────────────────────────────────────────────
   TYPES
   ────────────────────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────────────────────
   KINETIC TEXT — staggered opacity/blur/y bound to frame index
   ────────────────────────────────────────────────────────────── */
const KineticScrollText = ({
  frameIndex,
  startFrame,
  peakInFrame,
  peakOutFrame,
  endFrame,
  children,
  className,
}: any) => {
  const blurValue = useTransform(
    frameIndex,
    [startFrame, peakInFrame, peakOutFrame, endFrame],
    ['blur(12px)', 'blur(0px)', 'blur(0px)', 'blur(12px)'],
  )
  const yValue = useTransform(frameIndex, [startFrame, endFrame], [50, -50])
  const opacityValue = useTransform(
    frameIndex,
    [startFrame, peakInFrame, peakOutFrame, endFrame],
    [0, 1, 1, 0],
  )

  return (
    <motion.div
      style={{ opacity: opacityValue, y: yValue, filter: blurValue }}
      className={`transform-gpu will-change-[opacity,transform,filter] ${className}`}
    >
      {children}
    </motion.div>
  )
}

/* ──────────────────────────────────────────────────────────────
   PORTAL HERO COMPONENT
   ────────────────────────────────────────────────────────────── */
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
  /* ── State ──────────────────────────────────────────────── */
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [firstBatchReady, setFirstBatchReady] = useState(false)

  /* ── Refs ───────────────────────────────────────────────── */
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentFrameRef = useRef(1)
  const lastDrawnRef = useRef(-1)
  const rafRef = useRef(0)

  /* ──────────────────────────────────────────────────────────
     Phase 1: SSR-safe mount check
     - window does not exist on the server
     - all browser API access lives inside useEffect
     ────────────────────────────────────────────────────────── */
  useEffect(() => {
    setMounted(true)
    setIsMobile(window.matchMedia('(max-width: 768px)').matches)

    const mql = window.matchMedia('(max-width: 768px)')
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  /* ──────────────────────────────────────────────────────────
     Scroll tracking — all hooks unconditional (Rules of Hooks)
     ────────────────────────────────────────────────────────── */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    mass: 0.05,
    restDelta: 0.001,
  })

  /* ── Phase A (0.0 → 0.75): Door opening + text ──────── */
  // Frames 1→142 are compressed into the first 75% of scroll
  const frameIndex = useTransform(smoothProgress, [0, 0.75], [1, frameCount], { clamp: true })

  // Scroll indicator fades out by 5% scroll
  const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.05], [1, 0])

  // Mobile parallax — declared unconditionally
  const mobileParallaxY = useTransform(smoothProgress, [0, 1], [0, 80])

  /* ── Phase B (0.75 → 1.0): Portal zoom-through ─────── */
  // Scale the canvas from 1x to 15x, zooming into the open doorway
  const canvasScale = useTransform(smoothProgress, [0.75, 1.0], [1, 15], { clamp: true })

  // Fade the entire sticky container out between 90% and 100% scroll
  // This seamlessly reveals the next website section underneath
  const portalOpacity = useTransform(smoothProgress, [0.9, 1.0], [1, 0], { clamp: true })

  /* ── Frame URL builder ─────────────────────────────────── */
  const frameUrl = useCallback(
    (n: number) =>
      `${assetBaseUrl}/ezgif-frame-${String(n).padStart(3, '0')}.jpg`,
    [assetBaseUrl],
  )

  /* ──────────────────────────────────────────────────────────
     Phase 2 (mobile): no frame loading at all
     Phase 3 (desktop): progressive preloading
     - Show first frame as soon as it loads (don't wait for 142)
     - Continue loading remaining frames in background
     ────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!mounted || isMobile) return

    let cancelled = false
    const imgArray: HTMLImageElement[] = new Array(frameCount)

    // Track which frames have loaded
    const loaded = new Set<number>()

    const loadFrame = (idx: number) => {
      return new Promise<void>((resolve) => {
        const img = new Image()
        img.src = frameUrl(idx + 1) // frames are 1-indexed
        img.onload = () => {
          if (!cancelled) {
            imgArray[idx] = img
            loaded.add(idx)
            // As soon as frame 0 is ready, mark first batch ready
            if (idx === 0) {
              imagesRef.current = imgArray
              setFirstBatchReady(true)
            }
          }
          resolve()
        }
        img.onerror = () => resolve() // skip broken frames
      })
    }

    // Load frame 0 first for instant display
    loadFrame(0).then(async () => {
      if (cancelled) return
      // Load remaining frames in batches of 10
      const BATCH = 10
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
      setFirstBatchReady(false)
    }
  }, [mounted, isMobile, frameCount, frameUrl])

  /* ──────────────────────────────────────────────────────────
     Canvas draw function
     - DPR-aware for retina sharpness
     - Object-fit: cover mapping
     - Skips redundant redraws
     ────────────────────────────────────────────────────────── */
  const drawFrame = useCallback((index: number) => {
    if (index === lastDrawnRef.current) return

    const canvas = canvasRef.current
    if (!canvas) return

    const images = imagesRef.current
    if (!images || images.length === 0) return

    // Clamp and find nearest loaded frame
    const target = Math.max(0, Math.min(index - 1, frameCount - 1))
    let img = images[target]

    // Fallback: search for nearest loaded frame if target isn't ready
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let d = 1; d < frameCount; d++) {
        if (target - d >= 0 && images[target - d]?.complete && images[target - d]?.naturalWidth > 0) {
          img = images[target - d]
          break
        }
        if (target + d < frameCount && images[target + d]?.complete && images[target + d]?.naturalWidth > 0) {
          img = images[target + d]
          break
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    // DPR scaling
    const dpr = window.devicePixelRatio || 1
    const logicalW = canvas.clientWidth
    const logicalH = canvas.clientHeight

    if (canvas.width !== logicalW * dpr || canvas.height !== logicalH * dpr) {
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
  }, [frameCount])

  /* ── Scroll-driven frame scrubbing ─────────────────────── */
  useMotionValueEvent(frameIndex, 'change', (latest) => {
    if (!firstBatchReady || isMobile) return
    const idx = Math.round(latest as number)
    if (idx !== currentFrameRef.current) {
      currentFrameRef.current = idx
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => drawFrame(idx))
    }
  })

  /* ── Draw first frame + handle resize ──────────────────── */
  useEffect(() => {
    if (!firstBatchReady || isMobile) return

    // Draw initial frame
    lastDrawnRef.current = -1
    drawFrame(currentFrameRef.current)

    const onResize = () => {
      lastDrawnRef.current = -1 // force redraw on resize
      drawFrame(currentFrameRef.current)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [firstBatchReady, isMobile, drawFrame])

  /* ══════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════ */

  // Phase 1: SSR placeholder — matches scroll container structure
  if (!mounted) {
    return (
      <div className="relative w-full bg-[#0B132B] h-[400vh]">
        <div className="sticky top-0 left-0 w-full h-screen bg-[#0B132B]" />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#0B132B] overscroll-y-none"
      style={{ touchAction: 'pan-y', height: isMobile ? '300vh' : '400vh' }}
    >
      {/* ── Phase 1: Sticky viewport (locked to screen) ────── */}
      <motion.div
        className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-[#0B132B]"
        style={{ opacity: portalOpacity }}
      >

        {/* Phase 2: Mobile — single hero image, parallax scroll */}
        {isMobile && (
          <motion.div
            style={{ y: mobileParallaxY }}
            className="absolute inset-0 w-full h-[115%] -top-[5%]"
          >
            <img
              src={`${assetBaseUrl}/ezgif-frame-001.jpg`}
              alt="Ça Crée Voyage — Moroccan door"
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        {/* Phase 3: Desktop — canvas flipbook + portal zoom */}
        {!isMobile && (
          <motion.div
            className="absolute inset-0 w-full h-full"
            style={{
              scale: canvasScale,
              transformOrigin: '50% 60%', // center of the doorway opening
            }}
          >
            <canvas
              ref={canvasRef}
              className={`w-full h-full will-change-transform transform-gpu transition-opacity duration-700 ${
                firstBatchReady ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </motion.div>
        )}

        {/* ── Cinematic overlays ─────────────────────────────── */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0B132B]/90 via-[#0B132B]/40 to-transparent pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none z-[11]"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 40%, rgba(11,19,43,0.55) 100%)',
          }}
        />

        {/* ── OVERLAY 1: Left-aligned (frames 1–45) ──────────── */}
        <KineticScrollText
          frameIndex={frameIndex}
          startFrame={1}
          peakInFrame={5}
          peakOutFrame={35}
          endFrame={45}
          className="absolute left-[8%] top-[45%] md:top-[35%] z-20 max-w-xl pointer-events-none"
        >
          <h1 className="font-serif text-5xl md:text-7xl text-[#FFFFFF] font-light leading-tight drop-shadow-lg">
            {textPhase1Title} <br />
            <span className="italic text-[#C9A84C]">{textPhase1Sub}</span>
          </h1>
        </KineticScrollText>

        {/* ── OVERLAY 2: Centered (frames 45–95) ─────────────── */}
        <KineticScrollText
          frameIndex={frameIndex}
          startFrame={45}
          peakInFrame={55}
          peakOutFrame={85}
          endFrame={95}
          className="absolute inset-x-0 text-center top-[45%] md:top-[12%] z-20 pointer-events-none drop-shadow-2xl"
        >
          <h2 className="font-serif text-4xl md:text-6xl text-white font-light tracking-wide">
            {textPhase2Title}
          </h2>
          <p className="font-sans text-sm md:text-base text-[#C9A84C] uppercase tracking-[0.3em] mt-4 font-light">
            {textPhase2Sub}
          </p>
        </KineticScrollText>

        {/* ── OVERLAY 3: Bottom CTA (frames 95–150) ──────────── */}
        <KineticScrollText
          frameIndex={frameIndex}
          startFrame={95}
          peakInFrame={105}
          peakOutFrame={142}
          endFrame={150}
          className="absolute inset-x-0 bottom-[120px] md:bottom-16 z-30 flex flex-col items-center pointer-events-none"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-white font-light mb-6 drop-shadow-xl">
            {textPhase3Title}
          </h2>
          <a
            href="/sur-mesure"
            className="pointer-events-auto px-10 py-4 rounded-full border border-[#38A3A5]/50 text-[#38A3A5] font-sans text-xs md:text-sm uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[#38A3A5]/10 hover:border-[#38A3A5] backdrop-blur-md flex items-center gap-3"
          >
            {ctaLabel} <span>&rarr;</span>
          </a>
        </KineticScrollText>

        {/* ── Scroll indicator ───────────────────────────────── */}
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
