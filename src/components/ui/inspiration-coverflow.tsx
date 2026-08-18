'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

interface InspirationCoverflowProps {
  destinationName: string
  images: { id: string; url: string; alt?: string }[]
  /** i18n labels — pass from the server component */
  labels?: {
    heading?: string
    description?: string
    cta?: string
  }
}

export function InspirationCoverflow({
  destinationName,
  images,
  labels,
}: InspirationCoverflowProps) {
  if (!images || images.length === 0) return null

  const heading = labels?.heading || 'Inspirez-vous.'
  const description =
    labels?.description ||
    `Nos experts conçoivent actuellement de nouvelles évasions pour ${destinationName}. Laissez-vous charmer par ces paysages et créons ensemble votre aventure sur mesure.`
  const cta = labels?.cta || 'Créer mon voyage sur mesure'

  return (
    <div className="w-full py-20 md:py-28 overflow-hidden relative flex flex-col items-center">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[50%] bg-brand-blue/5 dark:bg-blue-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Heading */}
      <div className="text-center z-10 mb-12 md:mb-16 px-4">
        <span className="uppercase text-brand-blue text-xs font-semibold mb-4 block tracking-wider">
          Inspiration
        </span>
        <h2
          className="text-3xl md:text-5xl lg:text-6xl font-heading text-slate-900 dark:text-white tracking-wide mb-5 font-medium"
          style={{ textShadow: '0 0 60px rgba(56,163,165,0.15)' }}
        >
          {heading}
        </h2>
        <p className="text-slate-600 dark:text-white/50 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-light">
          {description}
        </p>
      </div>

      {/* Swiper 3D Coverflow */}
      <div className="w-full max-w-7xl mx-auto pb-12">
        <Swiper
          effect="coverflow"
          grabCursor
          centeredSlides
          loop
          slidesPerView="auto"
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 200,
            modifier: 1.5,
            slideShadows: true,
          }}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          modules={[EffectCoverflow, Pagination, Autoplay]}
          className="w-full !pt-10 !pb-20 inspiration-coverflow"
        >
          {images.map((img, index) => (
            <SwiperSlide
              key={img.id || index}
              className="!w-[260px] md:!w-[380px] lg:!w-[460px]"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group">
                {/* CSS Reflection */}
                <div
                  className="w-full h-full relative"
                  style={{
                    WebkitBoxReflect:
                      'below 4px linear-gradient(transparent, transparent 70%, rgba(255,255,255,0.25))',
                  }}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || `Inspiration ${destinationName} ${index + 1}`}
                    fill
                    className="object-cover rounded-2xl"
                    sizes="(max-width: 768px) 260px, (max-width: 1024px) 380px, 460px"
                  />
                  {/* Premium glass border overlay */}
                  <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none" />
                  {/* Subtle vignette */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Primary CTA → Sur-Mesure */}
      <Link
        href={`/sur-mesure?destination=${encodeURIComponent(destinationName)}`}
        className="z-10 group relative inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white/5 dark:backdrop-blur-md dark:border dark:border-white/20 dark:text-white rounded-full font-medium dark:hover:bg-white dark:hover:text-black transition-all duration-500 shadow-lg shadow-slate-900/20 dark:shadow-[0_0_30px_rgba(56,163,165,0.15)] dark:hover:shadow-[0_0_40px_rgba(56,163,165,0.4)]"
      >
        {cta}
        <svg
          className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
          />
        </svg>
      </Link>

      {/* Custom pagination bullet styles */}
      <style jsx global>{`
        .inspiration-coverflow .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.3);
          opacity: 1;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }
        .inspiration-coverflow .swiper-pagination-bullet-active {
          background: #38A3A5;
          width: 24px;
          border-radius: 4px;
        }
        .inspiration-coverflow .swiper-slide {
          transition: all 0.4s ease;
        }
        .inspiration-coverflow .swiper-slide-active {
          transform: scale(1);
        }
      `}</style>
    </div>
  )
}
