'use client'

import React, { useEffect, useRef, useState } from 'react'

type LazyVideoProps = Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'autoPlay' | 'preload'> & {
  src: string
  poster?: string
  /** Play when visible. When false the video is paused and, if never loaded, not downloaded. */
  active?: boolean
  /** Wait for the page `load` event + idle time before downloading (secondary, non-LCP videos). */
  defer?: boolean
}

/**
 * Muted looping background video that only downloads once it is near the viewport,
 * pauses when off-screen, and shows `poster` until the first frame is ready.
 * Hidden elements (display:none) never intersect, so they never download.
 */
export default function LazyVideo({ src, poster, active = true, defer = false, ...rest }: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isIdle, setIsIdle] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)

  // Visibility
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { rootMargin: '200px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Page idle (only matters for deferred videos)
  useEffect(() => {
    if (!defer) return
    let cancel = () => {}
    const markIdle = () => {
      if ('requestIdleCallback' in window) {
        const id = window.requestIdleCallback(() => setIsIdle(true), { timeout: 3000 })
        cancel = () => window.cancelIdleCallback(id)
      } else {
        const id = setTimeout(() => setIsIdle(true), 1500)
        cancel = () => clearTimeout(id)
      }
    }
    if (document.readyState === 'complete') markIdle()
    else window.addEventListener('load', markIdle, { once: true })
    return () => {
      window.removeEventListener('load', markIdle)
      cancel()
    }
  }, [defer])

  // Once a video starts loading it keeps its src (no re-download when toggling)
  useEffect(() => {
    if (isVisible && active && (!defer || isIdle)) setShouldLoad(true)
  }, [isVisible, active, defer, isIdle])

  // Play / pause
  useEffect(() => {
    const el = ref.current
    if (!el || !shouldLoad) return
    if (isVisible && active) el.play().catch(() => {})
    else el.pause()
  }, [isVisible, active, shouldLoad])

  return (
    <video
      ref={ref}
      src={shouldLoad ? src : undefined}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay={shouldLoad}
      preload={shouldLoad ? 'auto' : 'none'}
      {...rest}
    />
  )
}
