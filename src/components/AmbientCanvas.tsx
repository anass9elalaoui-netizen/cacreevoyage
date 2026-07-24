'use client'

import React, { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export default function AmbientCanvas() {
  const [mounted, setMounted] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 })

  useEffect(() => {
    setMounted(true)
    const handleMouseMove = (e: MouseEvent) => {
      // Offset from center, ranging from -100 to 100 pixels
      const x = (e.clientX / window.innerWidth - 0.5) * 200
      const y = (e.clientY / window.innerHeight - 0.5) * 200
      mouseX.set(x)
      mouseY.set(y)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none transition-colors duration-1000 bg-slate-50 dark:bg-[#0B132B]">
      {/* SVG Noise Overlay for premium tactile feel */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] z-10 mix-blend-overlay pointer-events-none" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.75%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />
      
      {/* Main interactive orbs simulating WebGL Fluid */}
      <motion.div
        style={{ x: springX, y: springY }}
        className="absolute inset-0 w-full h-full flex items-center justify-center transform-gpu"
      >
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-50 dark:opacity-20 bg-[#E6F4FA] dark:bg-[#1C8CC9] mix-blend-normal transform-gpu"
        />
        <motion.div 
          animate={{ rotate: -360, scale: [1, 1.2, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute w-[50vw] h-[70vw] rounded-full blur-[140px] opacity-40 dark:opacity-[0.15] bg-[#E6F4FA]/80 dark:bg-[#49C0EA] mix-blend-normal translate-x-1/4 translate-y-1/4 transform-gpu"
        />
        <motion.div 
          animate={{ x: [0, 50, -50, 0], y: [0, -50, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[40vw] h-[40vw] rounded-full blur-[100px] opacity-60 dark:opacity-[0.08] bg-white dark:bg-[#49C0EA] mix-blend-normal -translate-x-1/3 -translate-y-1/3 transform-gpu"
        />
      </motion.div>
    </div>
  )
}
