'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion'
import Image from 'next/image'

interface TrailImage {
  id: number
  x: number
  y: number
  src: string
}

interface CursorTrailProps {
  images: string[]
  children: React.ReactNode
}

export default function CursorTrail({ images, children }: CursorTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [trail, setTrail] = useState<TrailImage[]>([])
  const [isHovering, setIsHovering] = useState(false)
  
  // Disable on touch devices or if prefers-reduced-motion
  const [isDisabled, setIsDisabled] = useState(false)

  // Track coordinates for the distance calculation
  const lastPos = useRef({ x: -1000, y: -1000 })
  const imageIndex = useRef(0)
  const trailId = useRef(0)

  // RequestAnimationFrame tracking
  const rafId = useRef<number | null>(null)
  const pendingMousePos = useRef<{ x: number; y: number } | null>(null)

  // Motion values for the custom cursor
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  // Spring config for the custom cursor (60ms lag)
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    // Check for reduced motion and touch devices
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    
    if (mediaQuery.matches || isTouch || !images || images.length === 0) {
      setIsDisabled(true)
      return
    }

    // Preload images
    images.forEach((src) => {
      const img = new window.Image()
      img.src = src
    })

    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [images])

  const spawnImage = useCallback((x: number, y: number) => {
    const src = images[imageIndex.current % images.length]
    imageIndex.current += 1
    const id = trailId.current++
    
    // Add a slight random offset
    const offsetX = (Math.random() - 0.5) * 30 // ±15px
    const offsetY = (Math.random() - 0.5) * 20 // ±10px

    setTrail((prev) => {
      const newTrail = [...prev, { id, x: x + offsetX, y: y + offsetY, src }]
      // Max 8 images visible simultaneously
      if (newTrail.length > 8) {
        return newTrail.slice(newTrail.length - 8)
      }
      return newTrail
    })

    // Remove the image after 400ms
    setTimeout(() => {
      setTrail((prev) => prev.filter((img) => img.id !== id))
    }, 400)
  }, [images])

  const processMouseMove = useCallback(() => {
    if (!pendingMousePos.current || !containerRef.current) return
    const { x, y } = pendingMousePos.current
    pendingMousePos.current = null

    // Get mouse position relative to container
    const rect = containerRef.current.getBoundingClientRect()
    const relX = x - rect.left
    const relY = y - rect.top

    // Update custom cursor
    cursorX.set(x)
    cursorY.set(y)

    // Calculate distance from last spawned image
    const dx = relX - lastPos.current.x
    const dy = relY - lastPos.current.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > 28) {
      lastPos.current = { x: relX, y: relY }
      spawnImage(relX, relY)
    }

    rafId.current = null
  }, [cursorX, cursorY, spawnImage])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDisabled) return
    pendingMousePos.current = { x: e.clientX, y: e.clientY }
    
    // Custom cursor updates instantly, throttle the image spawn via rAF
    if (rafId.current === null) {
      rafId.current = requestAnimationFrame(processMouseMove)
    }
  }, [isDisabled, processMouseMove])

  const handleMouseEnter = useCallback(() => {
    if (isDisabled) return
    setIsHovering(true)
  }, [isDisabled])

  const handleMouseLeave = useCallback(() => {
    if (isDisabled) return
    setIsHovering(false)
    // Fade out all remaining images
    setTrail([])
  }, [isDisabled])

  if (isDisabled) {
    return <>{children}</>
  }

  return (
    <>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative cursor-none w-full"
      >
        {children}

        {/* Trail Images Layer */}
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          <AnimatePresence mode="sync">
            {trail.map((img) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 0.85, scale: 1.0 }}
                exit={{ opacity: 0, scale: 0.95, y: -12 }}
                transition={{ 
                  enter: { duration: 0.2, ease: 'easeOut' },
                  exit: { duration: 0.35, ease: 'easeIn' }
                }}
                className="absolute w-[120px] h-[80px] rounded-lg overflow-hidden border border-white/10 shadow-2xl"
                style={{
                  left: img.x - 60, // Center horizontally
                  top: img.y - 40,  // Center vertically
                }}
              >
                <Image
                  src={img.src}
                  alt="Destination Trail"
                  fill
                  className="object-cover"
                  sizes="120px"
                  unoptimized // Faster rendering for rapid trail
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Custom Cursor */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed pointer-events-none z-[110] w-3 h-3 rounded-full bg-slate-900 dark:bg-white dark:border dark:border-white/30 shadow-sm"
            style={{
              left: cursorXSpring,
              top: cursorYSpring,
              x: '-50%',
              y: '-50%',
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
