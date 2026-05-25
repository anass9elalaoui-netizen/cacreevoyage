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
   KINETIC TEXT HELPER — absolute frame synchronization
   ────────────────────────────────────────────────────────────── */
const KineticScrollText = ({ frameIndex, startFrame, peakInFrame, peakOutFrame, endFrame, children, className }: any) => {
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

  /* ── Phase 1: SSR-safe mounting ──────────────────────────── */
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentFrameRef = useRef(1)

  // Mount check — runs only on client, never on server
  useEffect(() => {
    setMounted(true)
    setIsMobile(window.matchMedia('(max-width: 768px)').matches)

    const mql = window.matchMedia('(max-width: 768px)')
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  /* ── Scroll tracking (hooks called unconditionally) ──────── */
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

  const frameIndex = useTransform(smoothProgress, [0, 1], [1, frameCount])
  const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.05], [1, 0])

  // Mobile parallax offset — declared unconditionally (Rules of Hooks)
  const mobileParallaxY = useTransform(smoothProgress, [0, 1], [0, 120])

  /* ── Frame URL builder ───────────────────────────────────── */
  const frameUrl = useCallback(
    (n: number) => `${assetBaseUrl}/ezgif-frame-${String(n).padStart(3, '0')}.jpg`,
    [assetBaseUrl],
  )

  /* ── Phase 3: Desktop frame preloading ───────────────────── */
  useEffect(() => {
    // Guard: do not load frames on server or on mobile
    if (!mounted || isMobile) return

    let loadedCount = 0
    let cancelled = false
    const imgArray: HTMLImageElement[] = []

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image()
      img.src = frameUrl(i)
      img.onload = () => {
        if (cancelled) return
        loadedCount++
        if (loadedCount === frameCount) {
          imagesRef.current = imgArray
          setImagesLoaded(true)
        }
      }
      img.onerror = () => {
        if (cancelled) return
        loadedCount++
        if (loadedCount === frameCount) {
          imagesRef.current = imgArray
          setImagesLoaded(true)
        }
      }
      imgArray.push(img)
    }

    return () => {
      cancelled = true
      imagesRef.current = []
      setImagesLoaded(false)
    }
  }, [mounted, isMobile, frameCount, frameUrl])

  /* ── Phase 4: Canvas draw function ───────────────────────── */
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const images = imagesRef.current
    if (!images || images.length === 0) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    // Clamp index to valid range
    const clampedIdx = Math.max(0, Math.min(index - 1, images.length - 1))
    const img = images[clampedIdx]
    if (!img || !img.complete || img.naturalWidth === 0) return

    // DPR scaling for retina sharpness
    const dpr = window.devicePixelRatio || 1
    const logicalW = canvas.clientWidth
    const logicalH = canvas.clientHeight

    // Only resize the canvas buffer if dimensions changed
    if (canvas.width !== logicalW * dpr || canvas.height !== logicalH * dpr) {
      canvas.width = logicalW * dpr
      canvas.height = logicalH * dpr
    }

    // Reset transform before drawing
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Object-fit: cover math
    const iw = img.naturalWidth
    const ih = img.naturalHeight
    const scale = Math.max(logicalW / iw, logicalH / ih)
    const sw = logicalW / scale
    const sh = logicalH / scale
    const sx = (iw - sw) / 2
    const sy = (ih - sh) / 2

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, logicalW, logicalH)
  }, [])

  /* ── Scroll-driven frame scrubbing ───────────────────────── */
  useMotionValueEvent(frameIndex, 'change', (latest) => {
    if (!imagesLoaded || isMobile) return
    const idx = Math.round(latest as number)
    if (idx !== currentFrameRef.current) {
      currentFrameRef.current = idx
      requestAnimationFrame(() => drawFrame(idx))
    }
  })

  /* ── Draw first frame + resize handler ───────────────────── */
  useEffect(() => {
    if (!imagesLoaded || isMobile) return

    drawFrame(currentFrameRef.current)

    const onResize = () => drawFrame(currentFrameRef.current)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [imagesLoaded, isMobile, drawFrame])

  /* ══════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════ */

  // Phase 1 guard: SSR placeholder — no window access, no canvas, just a dark div
  if (!mounted) {
    return <div className="relative w-full bg-[#0B132B] h-[300vh] md:h-[250vh]">
      <div className="sticky top-0 left-0 w-full h-screen bg-[#0B132B]" />
    </div>
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#0B132B] overscroll-y-none h-[300vh] md:h-[250vh]"
      style={{ touchAction: 'pan-y' }}
    >
      {/* ── Sticky viewport ──────────────────────────────────── */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-clip bg-[#0B132B]">

        {/* Phase 2: Mobile — single image with parallax, zero frame loading */}
        {isMobile && (
          <motion.div
            style={{ y: mobileParallaxY }}
            className="absolute inset-0 w-full h-[115%] -top-[5%]"
          >
            <img
              src={`${assetBaseUrl}/ezgif-frame-001.jpg`}
              alt="Moroccan door"
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        {/* Phase 3: Desktop — full canvas cinematic scroll */}
        {!isMobile && (
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full will-change-transform transform-gpu transition-opacity duration-1000 ${
              imagesLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Dark luxury text scrim — ensures legibility over bright video */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0B132B]/90 via-[#0B132B]/40 to-transparent pointer-events-none" />

        {/* Cinematic vignette overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-[11]"
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
