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

const PRELOAD_BATCH = 20
const CONCURRENT_BATCH = 10

/* ──────────────────────────────────────────────────────────────
   KINETIC TEXT HELPER — absolute frame synchronization
   ────────────────────────────────────────────────────────────── */
const KineticScrollText = ({ frameIndex, startFrame, peakInFrame, peakOutFrame, endFrame, children, className }: any) => {
  // Map directly to the absolute video frames (1 to 150)
  const blurValue = useTransform(frameIndex, [startFrame, peakInFrame, peakOutFrame, endFrame], ["blur(12px)", "blur(0px)", "blur(0px)", "blur(12px)"]);
  const yValue = useTransform(frameIndex, [startFrame, endFrame], [50, -50]);
  const opacityValue = useTransform(frameIndex, [startFrame, peakInFrame, peakOutFrame, endFrame], [0, 1, 1, 0]);

  return (
    <motion.div
      style={{ opacity: opacityValue, y: yValue, filter: blurValue }}
      className={`transform-gpu will-change-[opacity,transform,filter] ${className}`}
    >
      {children}
    </motion.div>
  );
};

/* ──────────────────────────────────────────────────────────────
   COMPONENT
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
  /* ── refs ─────────────────────────────────────────────────── */
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bitmapsRef = useRef<(ImageBitmap | null)[]>([])
  const currentFrameRef = useRef(0)
  const lastDrawnFrame = useRef<number>(-1)
  const rafRef = useRef<number>(0)

  /* ── state ───────────────────────────────────────────────── */
  const [isPreloaded, setIsPreloaded] = useState(false)

  /* ── scroll tracking ─────────────────────────────────────── */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Snappy trackpad physics — high stiffness eliminates lag, low mass for instant response
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    mass: 0.05,
    restDelta: 0.001,
  })

  const frameIndex = useTransform(smoothProgress, [0, 1], [1, frameCount])

  /* ── scroll indicator ────────────────────────────────────── */

  // Scroll indicator (fades by 0.05)
  const scrollIndicatorOpacity = useTransform(
    smoothProgress,
    [0, 0.05],
    [1, 0],
  )

  /* ── Phase 1: Concurrent ImageBitmap loader (GPU-ready) ──── */
  const frameUrl = useCallback(
    (n: number) => `${assetBaseUrl}/ezgif-frame-${String(n).padStart(3, '0')}.jpg`,
    [assetBaseUrl],
  )

  const loadBatch = useCallback(
    async (startIdx: number, endIdx: number, store: (ImageBitmap | null)[]) => {
      const promises: Promise<void>[] = []
      for (let i = startIdx; i <= endIdx; i++) {
        promises.push(
          fetch(frameUrl(i))
            .then(res => res.blob())
            .then(blob => createImageBitmap(blob))
            .then(bitmap => { store[i - 1] = bitmap })
            .catch(() => {}) // Swallow individual failures silently
        )
      }
      return Promise.all(promises)
    },
    [frameUrl],
  )

  useEffect(() => {
    const bitmaps: (ImageBitmap | null)[] = new Array(frameCount).fill(null)
    bitmapsRef.current = bitmaps

    let cancelled = false

    const preloadFirst = async () => {
      await loadBatch(1, Math.min(PRELOAD_BATCH, frameCount), bitmaps)
      if (!cancelled) setIsPreloaded(true)
    }

    const loadRemaining = async () => {
      for (let batchStart = PRELOAD_BATCH + 1; batchStart <= frameCount; batchStart += CONCURRENT_BATCH) {
        if (cancelled) break
        const batchEnd = Math.min(batchStart + CONCURRENT_BATCH - 1, frameCount)
        await loadBatch(batchStart, batchEnd, bitmaps)
      }
    }

    preloadFirst().then(() => {
      if (!cancelled) loadRemaining()
    })

    return () => {
      cancelled = true
      // Clean up bitmaps to free GPU memory
      bitmaps.forEach(bmp => bmp?.close())
    }
  }, [frameCount, loadBatch])

  /* ── Phase 2: Canvas drawing — draw cache + alpha:false ───── */
  const drawFrame = useCallback((index: number) => {
    if (index === lastDrawnFrame.current) return // KILL REDUNDANT DRAWS

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D | null
    if (!ctx) return

    const bitmaps = bitmapsRef.current

    // Bulletproof: fallback to nearest available frame
    let activeBitmap = bitmaps[index]
    if (!activeBitmap) {
      const available = bitmaps.filter(Boolean) as ImageBitmap[]
      if (available.length === 0) return
      activeBitmap = available[Math.min(index, available.length - 1)]
    }

    const cw = canvas.width
    const ch = canvas.height
    const iw = activeBitmap.width
    const ih = activeBitmap.height

    // object-fit: cover math
    const scale = Math.max(cw / iw, ch / ih)
    const sw = cw / scale
    const sh = ch / scale
    const sx = (iw - sw) / 2
    const sy = (ih - sh) / 2

    ctx.drawImage(activeBitmap, sx, sy, sw, sh, 0, 0, cw, ch)

    lastDrawnFrame.current = index // UPDATE CACHE
  }, [])

  /* ── resize handler ──────────────────────────────────────── */
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      lastDrawnFrame.current = -1 // Force redraw after resize
      drawFrame(currentFrameRef.current)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [drawFrame])

  /* ── scroll → frame render loop ──────────────────────────── */
  useMotionValueEvent(frameIndex, 'change', (latest) => {
    const idx = Math.round(latest)
    if (idx !== currentFrameRef.current) {
      currentFrameRef.current = idx
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => drawFrame(idx))
    }
  })

  /* ── draw first frame once preloaded ─────────────────────── */
  useEffect(() => {
    if (isPreloaded) {
      drawFrame(0)
    }
  }, [isPreloaded, drawFrame])

  /* ══════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════ */
  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#0B132B] overscroll-y-none h-[300vh] md:h-[250vh]"
      style={{ touchAction: 'pan-y' }}
    >
      {/* ── Sticky viewport ──────────────────────────────────── */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-clip">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full will-change-transform transform-gpu transition-opacity duration-1000 ${
            isPreloaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Dark luxury text scrim — ensures legibility over bright video */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0B132B]/90 via-[#0B132B]/40 to-transparent pointer-events-none" suppressHydrationWarning />

        {/* Cinematic vignette overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-[11]"
          suppressHydrationWarning
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 40%, rgba(11,19,43,0.55) 100%)',
          }}
        />

        {/* ── OVERLAY 1: Left-aligned (Scroll 0 – 0.30) ─────── */}
        <KineticScrollText 
          frameIndex={frameIndex} startFrame={1} peakInFrame={5} peakOutFrame={35} endFrame={45}
          className="absolute left-[8%] top-[45%] md:top-[35%] z-20 max-w-xl pointer-events-none"
        >
          <h1 className="font-serif text-5xl md:text-7xl text-[#FFFFFF] font-light leading-tight drop-shadow-lg">
            {textPhase1Title} <br />
            <span className="italic text-[#C9A84C]">{textPhase1Sub}</span>
          </h1>
        </KineticScrollText>

        {/* ── OVERLAY 2: Top-centered (Scroll 0.35 – 0.70) ───── */}
        <KineticScrollText 
          frameIndex={frameIndex} startFrame={45} peakInFrame={55} peakOutFrame={85} endFrame={95}
          className="absolute inset-x-0 text-center top-[45%] md:top-[12%] z-20 pointer-events-none drop-shadow-2xl"
        >
          <h2 className="font-serif text-4xl md:text-6xl text-white font-light tracking-wide">
            {textPhase2Title}
          </h2>
          <p className="font-sans text-sm md:text-base text-[#C9A84C] uppercase tracking-[0.3em] mt-4 font-light">
            {textPhase2Sub}
          </p>
        </KineticScrollText>

        {/* ── OVERLAY 3: Bottom-centered (Scroll 0.75 – 1.0) ── */}
        <KineticScrollText 
          frameIndex={frameIndex} startFrame={95} peakInFrame={105} peakOutFrame={142} endFrame={150}
          className="absolute inset-x-0 bottom-[120px] md:bottom-16 z-30 flex flex-col items-center pointer-events-none"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-white font-light mb-6 drop-shadow-xl">
            {textPhase3Title}
          </h2>
          {/* Ocean Cyan luxury pill CTA — brand identity */}
          <a 
            href="/sur-mesure" 
            className="pointer-events-auto px-10 py-4 rounded-full border border-[#38A3A5]/50 text-[#38A3A5] font-sans text-xs md:text-sm uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[#38A3A5]/10 hover:border-[#38A3A5] backdrop-blur-md flex items-center gap-3"
          >
            {ctaLabel} <span>&rarr;</span>
          </a>
        </KineticScrollText>

        {/* ── Scroll indicator (fades by 0.05) ─────────────── */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
          style={{ opacity: scrollIndicatorOpacity }}
        >
          <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-sans">
            Scroll
          </span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </motion.div>
      </div>
    </div>
  )
}
