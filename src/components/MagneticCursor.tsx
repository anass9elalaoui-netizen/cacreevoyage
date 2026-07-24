'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function MagneticCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    // Only run on desktop devices
    if (window.matchMedia('(pointer: fine)').matches) {
      setIsDesktop(true)
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }
    
    const handleMouseLeave = () => setIsVisible(false)

    // Elements that trigger the hover scale effect
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Traverse up to see if it's an interactive element
      if (
        target.closest('a') || 
        target.closest('button') || 
        target.closest('input') || 
        target.closest('[role="button"]') ||
        target.closest('.cursor-pointer')
      ) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.documentElement.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [isVisible])

  if (!isDesktop || !isVisible) return null

  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[99999]"
      style={{ mixBlendMode: 'difference' }}
      animate={{
        x: mousePosition.x - 8,
        y: mousePosition.y - 8,
        scale: isHovering ? 3 : 1,
        opacity: isVisible ? 1 : 0
      }}
      transition={{
        type: "spring",
        stiffness: 800,
        damping: 40,
        mass: 0.2,
      }}
    />
  )
}
