'use client'

import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function MagneticButton({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const { clientX, clientY } = e
    const { height, width, left, top } = ref.current.getBoundingClientRect()
    
    // Calculate the distance from the center of the button
    const middleX = clientX - (left + width / 2)
    const middleY = clientY - (top + height / 2)

    // Move the button slightly towards the mouse
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 })
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 })
  }

  const { x, y } = position

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, mass: 0.1 }}
      className={`inline-block ${className}`}
    >
      <motion.div
        animate={{ x: x * 0.5, y: y * 0.5 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, mass: 0.1 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
