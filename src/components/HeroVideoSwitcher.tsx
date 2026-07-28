"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Compass } from 'lucide-react';

export interface HeroSlide {
  id: string;
  label: string;
  subtitle: string;
  title: string;
  videoUrl: string;
}

export interface HeroVideoSwitcherProps {
  slides?: HeroSlide[];
}

const FALLBACK_SLIDES: HeroSlide[] = [
  { id: 'eden', label: 'Éden Tropical', subtitle: "L'Évasion Parfaite", title: 'Éden Tropical', videoUrl: '/SECTION%20FRAME/Ocean_waves_on_white_sand_202607241712.mp4' },
  { id: 'desert', label: 'Désert & Étoiles', subtitle: "L'Évasion Parfaite", title: 'Désert & Étoiles', videoUrl: '/SECTION%20FRAME/Orange_sand_dunes_starry_sky_202607241713.mp4' },
  { id: 'safari', label: 'Safari Signature', subtitle: "L'Évasion Parfaite", title: 'Safari Signature', videoUrl: '/SECTION%20FRAME/Elephants_walking_in_savanna_1080p_202607241712.mp4' },
  { id: 'asie', label: 'Asie Mystique', subtitle: "L'Évasion Parfaite", title: 'Asie Mystique', videoUrl: '/SECTION%20FRAME/Mist_over_emerald_waters_Ha_202607241712.mp4' },
];

export default function HeroVideoSwitcher({ slides = FALLBACK_SLIDES }: HeroVideoSwitcherProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Safety check in case empty array is passed
  const currentSlides = slides && slides.length > 0 ? slides : FALLBACK_SLIDES;

  const dustParticles = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2, // 2px to 6px
      left: Math.random() * 100, // 0 to 100vw
      top: Math.random() * 100, // 0 to 100vh
      duration: Math.random() * 20 + 20, // 20s to 40s
      delay: Math.random() * 10, // 0 to 10s
    }))
  }, [])

  return (
    <section className="relative w-full h-screen overflow-hidden bg-slate-50 dark:bg-[#060D1F] snap-center">
      {/* Z-index 0: Background Video Layer */}
      <div className="absolute inset-0 z-0 bg-black">
        {currentSlides.map((slide, index) => (
          <video
            key={slide.id}
            src={slide.videoUrl}
            autoPlay
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        {/* Subtle overlay for text legibility, ensuring premium feel */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      {/* Atmospheric Dust Particles (Light Mode Only) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden dark:hidden mix-blend-screen opacity-60">
        {dustParticles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white blur-[1px]"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animation: `dustDrift ${particle.duration}s infinite linear`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Z-index 10: Transparent PNG Overlay with continuous "train-bob" animation */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center overflow-hidden"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Desktop Frame (Hidden on Mobile) */}
        <Image alt="Luxury Window Desktop" className="hidden md:block object-cover object-center scale-[1.02]" fill priority src="/SECTION%20FRAME/cadre-desktop.png"/>
        {/* Mobile Frame (Hidden on Desktop) */}
        <Image alt="Luxury Window Mobile" className="block md:hidden object-cover object-center scale-[1.02]" fill priority src="/SECTION%20FRAME/cadre-mobile.png"/>
      </motion.div>

      {/* Z-index 20: UI Elements */}
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-end px-6 pb-[19vh] md:pb-[18vh]">
        
        {/* Main Typography */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none pb-20 md:pb-32">
          {/* Eyebrow / Subtitle */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] mb-4 text-white/90 uppercase flex items-center gap-2 md:gap-4 font-sans"
          >
            <span className="w-8 h-[1px] bg-white/50" />
            {currentSlides[activeIndex].subtitle}
            <span className="w-8 h-[1px] bg-white/50" />
          </motion.div>

          {/* Main Heading */}
          <motion.h2 
            key={activeIndex} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-[clamp(4.5rem,8vw,8rem)] leading-none text-white drop-shadow-2xl text-center px-4 w-full max-w-[65vw] md:max-w-4xl mx-auto"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {currentSlides[activeIndex].title}
          </motion.h2>
        </div>

        {/* Switcher Buttons (Bottom Center) */}
        <div className="z-50 w-[75vw] md:w-max p-1 md:p-1.5 grid grid-cols-2 gap-1 md:flex md:flex-row md:gap-1 rounded-xl md:rounded-full liquid-glass pointer-events-auto">
          {currentSlides.map((slide, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={slide.id}
                onClick={() => setActiveIndex(index)}
                className={`flex items-center justify-center whitespace-nowrap px-2 py-2 md:px-5 md:py-2.5 text-[10px] md:text-sm rounded-lg md:rounded-full transition-all duration-300 gap-2 ${
                  isActive 
                    ? 'bg-white/90 dark:bg-white/10 text-slate-900 dark:text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                    : 'text-slate-800/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                style={{ fontFamily: "system-ui, sans-serif", fontWeight: 500 }}
              >
                {isActive && <Play className="w-3 h-3 fill-current" />}
                {slide.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
