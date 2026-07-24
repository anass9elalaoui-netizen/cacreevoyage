'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function ScrollTextReveal({ text, className = '' }: { text: string, className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.4"]
  })

  const words = text.split(" ")

  return (
    <p ref={containerRef} className={`flex flex-wrap gap-x-[0.3em] gap-y-1 ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length
        const end = start + (1 / words.length)
        
        return (
          <Word key={i} word={word} progress={scrollYProgress} range={[start, end]} />
        )
      })}
    </p>
  )
}

function Word({ word, progress, range }: { word: string, progress: any, range: number[] }) {
  const opacity = useTransform(progress, range, [0.2, 1])
  
  return (
    <motion.span style={{ opacity }} className="relative">
      {word}
    </motion.span>
  )
}
