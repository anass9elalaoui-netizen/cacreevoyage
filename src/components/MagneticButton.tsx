'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export interface MagneticButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactElement
  strength?: number
  className?: string
}

export default function MagneticButton({ children, strength = 0.4, className = '', ...props }: MagneticButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Motion values for translation
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring configuration for the rubbery pull
  const springConfig = { stiffness: 200, damping: 20, mass: 0.8 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  // Inner parallax
  const innerX = useSpring(useMotionValue(0), springConfig)
  const innerY = useSpring(useMotionValue(0), springConfig)

  const [isHovered, setIsHovered] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const pointerFine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    setReducedMotion(reduced)
    // Disable translation effect if not a fine pointer
    if (!pointerFine) {
      setIsDisabled(true)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDisabled || reducedMotion) return
    if (!containerRef.current) return

    const { clientX, clientY } = e
    const { width, height, left, top } = containerRef.current.getBoundingClientRect()
    
    // Calculate distance from center
    const centerX = left + width / 2
    const centerY = top + height / 2
    
    const distanceX = clientX - centerX
    const distanceY = clientY - centerY

    x.set(distanceX * strength)
    y.set(distanceY * strength)
    
    innerX.set(distanceX * (strength * 0.6))
    innerY.set(distanceY * (strength * 0.6))
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (isDisabled || reducedMotion) return
    x.set(0)
    y.set(0)
    innerX.set(0)
    innerY.set(0)
  }

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    // Call original onClick if it exists
    if (React.isValidElement(children) && (children.props as any).onClick) {
      (children.props as any).onClick(e)
    }

    if (reducedMotion) return

    const target = e.currentTarget
    const rect = target.getBoundingClientRect()
    
    // Calculate click coordinates relative to the button
    const relX = e.clientX - rect.left
    const relY = e.clientY - rect.top

    // Create ripple element
    const ripple = document.createElement('span')
    ripple.style.position = 'absolute'
    ripple.style.borderRadius = '50%'
    ripple.style.background = 'rgba(255,255,255,0.25)'
    ripple.style.pointerEvents = 'none'
    ripple.style.transform = 'translate(-50%, -50%)'
    ripple.style.left = `${relX}px`
    ripple.style.top = `${relY}px`
    ripple.style.width = '0px'
    ripple.style.height = '0px'
    ripple.style.zIndex = '0'

    // Add relative and overflow-hidden if missing
    if (window.getComputedStyle(target).position === 'static') {
      target.style.position = 'relative'
    }
    target.style.overflow = 'hidden'

    target.appendChild(ripple)

    // Ensure children of the button (like text) sit above the ripple
    Array.from(target.children).forEach((child) => {
      if (child !== ripple) {
        ;(child as HTMLElement).style.position = 'relative'
        ;(child as HTMLElement).style.zIndex = '1'
      }
    })

    const anim = ripple.animate(
      [
        { width: '0px', height: '0px', opacity: 1 },
        { width: '300%', height: '300%', opacity: 0 }
      ],
      { duration: 500, easing: 'ease-out' }
    )

    anim.onfinish = () => ripple.remove()
  }

  // Clone the child to inject the click handler and base classes
  const childProps = React.isValidElement(children) ? (children.props as any) : {}
  const childClassName = `${childProps.className || ''} relative overflow-hidden`.trim()
  
  const clonedChild = React.isValidElement(children) 
    ? React.cloneElement(children, {
        onClick: handleClick,
        className: childClassName,
      } as any) 
    : children

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={isHovered ? { scale: 1.04 } : { scale: 1 }}
      transition={springConfig}
      style={{
        x: springX,
        y: springY,
      }}
      className={`inline-block ${className}`}
      {...(props as any)}
    >
      <motion.div
        style={{
          x: innerX,
          y: innerY,
        }}
        className="w-full h-full"
      >
        {clonedChild}
      </motion.div>
    </motion.div>
  )
}
