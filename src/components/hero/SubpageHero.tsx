'use client'

import React from 'react'
import Image from 'next/image'

interface SubpageHeroProps {
  title: string
  subtitle?: string
  description?: string
  backgroundUrl?: string
  isVideo?: boolean
  ctaLabel?: string
  ctaHref?: string
  badge1Number?: string
  badge1Label?: string
  badge2Number?: string
  badge2Label?: string
}

export default function SubpageHero({
  title,
  subtitle,
  description,
  backgroundUrl,
  isVideo,
  ctaLabel,
  ctaHref,
  badge1Number,
  badge1Label,
  badge2Number,
  badge2Label,
}: SubpageHeroProps) {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-[#0B132B]">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {backgroundUrl ? (
          isVideo ? (
            <video
              src={backgroundUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-80"
            />
          ) : (
            <Image
              src={backgroundUrl}
              alt={title}
              fill
              className="object-cover opacity-80"
              priority
            />
          )
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#0B132B] to-[#1a2744]">
            {/* Fallback ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#38A3A5]/10 rounded-full blur-[150px] pointer-events-none" />
          </div>
        )}
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/50 to-transparent" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center mt-16">
        {subtitle && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full mb-6 shadow-[0_0_30px_rgba(56,163,165,0.2)] inline-block">
            <span className="uppercase tracking-[0.2em] text-[#D4AF37] text-xs font-sans font-medium drop-shadow-md">
              {subtitle}
            </span>
          </div>
        )}
        
        <h1 
          className="text-5xl md:text-7xl lg:text-[6rem] font-serif text-white tracking-tight leading-[1.1] mb-6 drop-shadow-2xl"
          style={{ textShadow: '0 4px 40px rgba(0,0,0,0.6)' }}
        >
          {title}
        </h1>

        {description && (
          <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed max-w-2xl mb-10 drop-shadow-md">
            {description}
          </p>
        )}

        {/* CTA Button */}
        {ctaLabel && ctaHref && (
          <a
            href={ctaHref}
            className="inline-flex items-center gap-3 bg-[#D4AF37] hover:bg-[#C5A030] text-[#0B132B] px-8 py-4 rounded-full font-medium text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_25px_rgba(212,175,55,0.6)] hover:-translate-y-1"
          >
            {ctaLabel}
          </a>
        )}
        
        {/* Stats badges (optional) displayed at the bottom of the content area */}
        {(badge1Number || badge2Number) && (
           <div className="flex flex-wrap justify-center gap-6 mt-16">
             {badge1Number && badge1Label && (
               <div className="bg-white/5 backdrop-blur-md border border-white/15 rounded-2xl px-6 py-4 text-center min-w-[140px]">
                 <span className="text-[#D4AF37] text-3xl font-serif block leading-none mb-1">{badge1Number}</span>
                 <span className="text-white/60 text-[11px] uppercase tracking-widest">{badge1Label}</span>
               </div>
             )}
             {badge2Number && badge2Label && (
               <div className="bg-white/5 backdrop-blur-md border border-white/15 rounded-2xl px-6 py-4 text-center min-w-[140px]">
                 <span className="text-[#38A3A5] text-3xl font-serif block leading-none mb-1">{badge2Number}</span>
                 <span className="text-white/60 text-[11px] uppercase tracking-widest">{badge2Label}</span>
               </div>
             )}
           </div>
        )}
      </div>
    </section>
  )
}
