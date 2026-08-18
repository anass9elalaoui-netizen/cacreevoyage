"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import { ArrowRight, Calendar, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import "swiper/css";
import "swiper/css/effect-coverflow";

export function DestinationInspiration({ destination }: { destination: any }) {
  const images = destination.gallery || [];
  
  // Safely grab the video URL from Payload CMS fields
  const videoUrl = 
    (typeof destination.heroVideo === 'object' ? destination.heroVideo?.url : null) || 
    (typeof destination.headerMedia === 'object' ? destination.headerMedia?.url : null);

  return (
    <section className="w-full relative min-h-screen flex flex-col items-center overflow-hidden bg-slate-50 dark:bg-[#050B14] transition-colors duration-300">
      
      {/* 1. CINEMATIC VIDEO BACKGROUND WITH FADE EFFECT */}
      {videoUrl && (
        <div className="absolute inset-0 w-full h-[80vh] z-0">
          <video 
            src={videoUrl} 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-50"
          />
          {/* Header Gradient Fade matching the background */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/60 to-slate-50 dark:from-transparent dark:via-[#050B14]/60 dark:to-[#050B14]" />
        </div>
      )}

      {/* Fallback ambient glow if no video exists */}
      {!videoUrl && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-[#38A3A5]/20 blur-[150px] rounded-full pointer-events-none z-0" />
      )}

      {/* 2. TEXT CONTENT (Elegant Normal Weight) */}
      <div className="z-10 w-full max-w-4xl mx-auto px-4 flex flex-col items-center text-center pt-48 mb-16 relative">
        <p className="text-sm font-normal tracking-widest text-[#38A3A5] uppercase mb-4 drop-shadow-sm">
          Inspiration
        </p>
        <h1 className="text-5xl md:text-6xl text-slate-900 dark:text-white font-normal tracking-tight mb-6 drop-shadow-md">
          Découvrez {destination.title || destination.name}
        </h1>
        <p className="text-slate-700 dark:text-slate-200 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mb-10 drop-shadow-sm">
          Nos experts conçoivent actuellement de nouveaux itinéraires exclusifs pour {destination.title || destination.name}. Laissez-vous inspirer par ces paysages et créons ensemble votre voyage parfait.
        </p>

        {/* Data Pills */}
        <div className="flex flex-wrap justify-center items-center gap-3">
          {destination.bestTimeToVisit && (
            <div className="flex items-center gap-2 bg-white/40 dark:bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-slate-200 dark:border-white/20 shadow-sm">
              <Calendar className="w-4 h-4 text-[#38A3A5]"/>
              <span className="text-slate-900 dark:text-white text-sm font-normal">Idéal : {destination.bestTimeToVisit}</span>
            </div>
          )}
          {destination.highlights?.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-2 bg-white/40 dark:bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-slate-200 dark:border-white/20 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-[#38A3A5]"/>
              <span className="text-slate-900 dark:text-white text-sm font-normal">{item.highlight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. 3D IMAGE SLIDER (Mirror Hall Effect, No Infinite Loop) */}
      {images.length > 0 && (
        <div className="w-full max-w-[100vw] relative z-10 mt-4 mb-24">
          <Swiper 
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            loop={false}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 150,
              modifier: 2,
              slideShadows: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            modules={[EffectCoverflow, Autoplay]}
            className="w-full !py-10"
          >
            {images.map((item: any, index: number) => {
              const img = typeof item.image === 'object' ? item.image : item;
              return (
                <SwiperSlide className="!w-[260px] md:!w-[340px]" key={img?.id || index}>
                  <div className="relative aspect-[3/4] rounded-2xl overflow-visible group">
                    {/* Enhanced Mirror Reflection */}
                    <div 
                      className="w-full h-full relative transition-transform duration-700 group-hover:-translate-y-3"
                      style={{ 
                        WebkitBoxReflect: "below 0px linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 40%)" 
                      }}
                    >
                      <Image 
                        src={img?.url || ''} 
                        alt={img?.alt || `Inspiration ${destination.title || destination.name}`} 
                        fill 
                        className="object-cover rounded-2xl shadow-2xl" 
                      />
                      <div className="absolute inset-0 border border-slate-900/10 dark:border-white/10 rounded-2xl pointer-events-none" />
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}

      {/* 4. CALL TO ACTION */}
      <div className="z-10 pb-24">
        <Link className="group flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-[#050B14] rounded-full font-normal hover:scale-105 transition-all duration-300 shadow-xl" href={`/sur-mesure?destination=${destination.slug}`}>
          Créer mon voyage sur mesure
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
        </Link>
      </div>

    </section>
  );
}
