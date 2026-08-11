'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { RichText } from '@payloadcms/richtext-lexical/react'

function DOFImage({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1.05])
  const blur = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    ['blur(0px)', 'blur(0px)', 'blur(6px)', 'blur(8px)'],
  )

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-lg aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl"
    >
      {/* Ambient Glow behind image */}
      <div className="absolute -inset-4 bg-brand-blue/10 rounded-[2.5rem] blur-[60px] -z-10" />
      <motion.div style={{ scale, filter: blur }} className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </motion.div>
    </div>
  )
}

export default function ItineraryTimeline({ blocks }: { blocks: any[] }) {
  if (!blocks || blocks.length === 0) return null

  return (
    <div className="relative max-w-6xl mx-auto py-16">
      {/* Central Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-brand-dark/10 hidden md:block" />

      <div className="flex flex-col gap-24 md:gap-32">
        {blocks.map((block, index) => {
          const isEven = index % 2 === 1
          const imageUrl =
            typeof block.dayImage === 'object' && block.dayImage?.url
              ? block.dayImage.url
              : null
          const dayTitle = block.dayTitle || `Jour 0${index + 1}`

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className={`flex flex-col md:flex-row items-center gap-12 lg:gap-24 relative ${
                isEven ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-brand-blue shadow-[0_0_20px_rgba(56,163,165,0.6)] hidden md:block z-10" />

              {/* Image Side with DOF */}
              <div className="w-full md:w-1/2 flex justify-center">
                {imageUrl ? (
                  <DOFImage src={imageUrl} alt={dayTitle} />
                ) : (
                  <div className="w-full max-w-lg aspect-[4/5] rounded-[2rem] bg-brand-dark/5 flex items-center justify-center">
                    <span className="text-brand-dark/40 font-heading italic">
                      Image indisponible
                    </span>
                  </div>
                )}
              </div>

              {/* Text Side — Razor Sharp */}
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <span className="h-px w-12 bg-brand-blue block" />
                  <h3 className="text-sm font-semibold text-brand-blue uppercase tracking-wider">
                    Jour {String(index + 1).padStart(2, '0')}
                  </h3>
                </div>
                <h2 className="text-3xl md:text-5xl font-heading text-brand-dark mb-8 leading-tight tracking-tight font-bold">
                  {block.dayTitle}
                </h2>
                <div className="text-brand-dark/70 font-light text-lg leading-relaxed space-y-4">
                  {block.dayContent && <RichText data={block.dayContent} />}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
