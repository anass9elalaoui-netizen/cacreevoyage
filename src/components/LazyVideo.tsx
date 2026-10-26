'use client'

import React, { useEffect, useId, useRef, useState } from 'react'

type LazyVideoProps = Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'autoPlay' | 'preload'> & {
  src: string
  poster?: string
  /** Allowed to load/play. When false the video is paused and its buffers released (unless `priority`). */
  active?: boolean
  /** Wait for the page `load` event + idle time before downloading (secondary, non-LCP videos). */
  defer?: boolean
  /** Click-to-play mode: never autoplays (sound only after a user click), loads metadata near the viewport. */
  paused?: boolean
  /** Gets a play slot first and is never unloaded (active hero panel, active carousel card). */
  priority?: boolean
}

/* ─── Shared play coordinator: at most MAX_PLAYING background videos play at once ─── */
const MAX_PLAYING = 2
type Entry = { el: HTMLVideoElement; wants: boolean; priority: boolean; ratio: number }
const registry = new Map<string, Entry>()
let scheduled = false

function schedulePlayback() {
  if (scheduled) return
  scheduled = true
  requestAnimationFrame(() => {
    scheduled = false
    const ranked = [...registry.values()]
      .filter((e) => e.wants)
      .sort((a, b) => Number(b.priority) - Number(a.priority) || b.ratio - a.ratio)
    const winners = new Set(ranked.slice(0, MAX_PLAYING))
    for (const e of registry.values()) {
      if (winners.has(e)) {
        if (e.el.paused) e.el.play().catch(() => {})
      } else if (!e.el.paused) {
        e.el.pause()
      }
    }
  })
}

/** Reduced motion or Data Saver: background videos show their poster only. */
function useLiteMode() {
  const [lite, setLite] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
    const update = () => setLite(mql.matches || saveData)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])
  return lite
}

/**
 * Muted looping background video that only downloads near the viewport, releases its
 * buffers when it leaves (src removed + load()), and shares MAX_PLAYING play slots
 * with every other LazyVideo on the page. Hidden (display:none) videos never load.
 */
export default function LazyVideo({
  src,
  poster,
  active = true,
  defer = false,
  paused = false,
  priority = false,
  ...rest
}: LazyVideoProps) {
  const id = useId()
  const ref = useRef<HTMLVideoElement>(null)
  const lite = useLiteMode()
  const [isNear, setIsNear] = useState(false)
  const [ratio, setRatio] = useState(0)
  const [isIdle, setIsIdle] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)
  const wasLoaded = useRef(false)

  // Near the viewport (load / release) and visible ratio (play ranking)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const near = new IntersectionObserver(([e]) => setIsNear(e.isIntersecting), { rootMargin: '200px' })
    const visible = new IntersectionObserver(([e]) => setRatio(e.isIntersecting ? e.intersectionRatio : 0), {
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    })
    near.observe(el)
    visible.observe(el)
    return () => {
      near.disconnect()
      visible.disconnect()
    }
  }, [])

  // Page idle (only matters for deferred videos)
  useEffect(() => {
    if (!defer) return
    let cancel = () => {}
    const markIdle = () => {
      if ('requestIdleCallback' in window) {
        const handle = window.requestIdleCallback(() => setIsIdle(true), { timeout: 3000 })
        cancel = () => window.cancelIdleCallback(handle)
      } else {
        const handle = setTimeout(() => setIsIdle(true), 1500)
        cancel = () => clearTimeout(handle)
      }
    }
    if (document.readyState === 'complete') markIdle()
    else window.addEventListener('load', markIdle, { once: true })
    return () => {
      window.removeEventListener('load', markIdle)
      cancel()
    }
  }, [defer])

  // Load when near + allowed; release when far away or inactive (priority videos stay loaded)
  useEffect(() => {
    if (lite && !paused) {
      setShouldLoad(false)
      return
    }
    if (isNear && active && (!defer || isIdle || priority)) setShouldLoad(true)
    else if (!priority && (!isNear || !active)) setShouldLoad(false)
  }, [lite, paused, isNear, active, defer, isIdle, priority])

  // Actually free decoder/network buffers after the src attribute is removed
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (shouldLoad) wasLoaded.current = true
    else if (wasLoaded.current) {
      el.removeAttribute('src')
      el.load()
      wasLoaded.current = false
    }
  }, [shouldLoad])

  // Register with the play coordinator (background videos only)
  useEffect(() => {
    const el = ref.current
    if (!el || paused) return
    registry.set(id, { el, wants: false, priority, ratio: 0 })
    return () => {
      registry.delete(id)
      schedulePlayback()
    }
  }, [id, paused, priority])

  useEffect(() => {
    const entry = registry.get(id)
    if (!entry) return
    entry.wants = shouldLoad && active && ratio > 0
    entry.priority = priority
    entry.ratio = ratio
    schedulePlayback()
  }, [id, shouldLoad, active, ratio, priority])

  // Switching into click-to-play mode (e.g. a carousel card losing focus) stops playback
  useEffect(() => {
    if (paused) ref.current?.pause()
  }, [paused])

  // Click-to-play videos: pause when scrolled out of view
  useEffect(() => {
    const el = ref.current
    if (paused && el && !isNear && !el.paused) el.pause()
  }, [paused, isNear])

  const loadSrc = paused ? (lite ? src : shouldLoad ? src : undefined) : shouldLoad ? src : undefined

  return (
    <video
      ref={ref}
      src={loadSrc}
      poster={poster}
      muted
      loop
      playsInline
      preload={!loadSrc ? 'none' : paused ? (lite ? 'none' : 'metadata') : 'auto'}
      {...rest}
    />
  )
}
