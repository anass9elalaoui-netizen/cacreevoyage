'use client'

import React, { useRef, useCallback } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import { motion } from 'framer-motion'
import type { Swiper as SwiperType } from 'swiper'
import { CarouselNavPill } from '@/components/ui/carousel-nav-pill'

import 'swiper/css'

interface Activity {
  id?: string
  title: string
  description: string
  location: string
  image: { url: string; alt?: string; width?: number; height?: number } | null
}

interface HomepageActivitiesProps {
  sectionTitle?: string
  sectionSubtitle?: string
  sectionDescription?: string
  activities: Activity[]
}

export default function HomepageActivities({
  sectionTitle = 'Activités & Aventures',
  sectionSubtitle = "Vivez l'extraordinaire",
  sectionDescription,
  activities,
}: HomepageActivitiesProps) {
  const swiperRef = useRef<SwiperType | null>(null)

  const handlePrev = useCallback(() => {
    swiperRef.current?.slidePrev()
  }, [])

  const handleNext = useCallback(() => {
    swiperRef.current?.slideNext()
  }, [])

  if (!activities || activities.length === 0) return null

  return (
    <section
      className="relative w-full py-16 lg:py-20 bg-slate-50 dark:bg-brand-dark transition-colors duration-700 overflow-hidden"
      aria-label={sectionTitle}
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[300px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none" />

      {/* ── HEADER: Flex-End Layout ── */}
      <div className="px-6 md:px-12 lg:px-20 mb-10 max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
        {/* Left — Text Block */}
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="uppercase text-brand-blue text-xs font-body mb-3 block font-semibold tracking-wider"
          >
            {sectionSubtitle}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-3xl md:text-5xl text-slate-900 dark:text-white mb-3 font-medium tracking-wide"
          >
            {sectionTitle}
          </motion.h2>
          {sectionDescription && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-slate-600 dark:text-brand-silver text-sm lg:text-base leading-relaxed"
            >
              {sectionDescription}
            </motion.p>
          )}
        </div>

        {/* Right — Control Pill */}
        <CarouselNavPill
          onPrev={handlePrev}
          onNext={handleNext}
          ariaLabelPrev="Activité précédente"
          ariaLabelNext="Activité suivante"
          className="self-end"
        />
      </div>

      {/* ── AMBIENT MOODBOARD CAROUSEL ── */}
      <div className="w-full activities-moodboard">
        <Swiper
          onSwiper={(swiper) => { swiperRef.current = swiper }}
          modules={[Autoplay]}
          loop
          speed={4000}
          slidesPerView={2.2}
          spaceBetween={12}
          allowTouchMove={false}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 14 },
            1024: { slidesPerView: 4.5, spaceBetween: 16 },
            1440: { slidesPerView: 5.5, spaceBetween: 18 },
          }}
          className="!px-6 md:!px-12 lg:!px-20"
        >
          {activities.map((activity, index) => {
            const imageUrl = activity.image?.url
            const dynamicAlt = `${activity.title} — ${activity.location}`

            return (
              <SwiperSlide key={activity.id || index}>
                <article className="relative h-[250px] md:h-[280px] rounded-xl overflow-hidden group">
                  {/* Full-bleed Image */}
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={dynamicAlt}
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 33vw, 22vw"
                      className="object-cover transition-transform duration-[1200ms] ease-luxury group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 to-brand-dark" />
                  )}

                  {/* Subtle dark gradient for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                  {/* Glass border */}
                  <div className="absolute inset-0 border border-white/10 rounded-xl pointer-events-none" />

                  {/* ── Text Overlay (SEO-visible, compact) ── */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    {/* Location */}
                    <span className="inline-flex items-center gap-1 text-brand-blue text-[9px] font-body font-semibold uppercase tracking-widest mb-1.5">
                      <svg
                        className="w-2.5 h-2.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {activity.location}
                    </span>

                    {/* Title — compact */}
                    <h3 className="font-heading text-lg md:text-xl text-white leading-snug font-medium tracking-wide drop-shadow-md">
                      {activity.title}
                    </h3>
                  </div>
                </article>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>

      {/* ── Continuous linear scroll animation ── */}
      <style jsx global>{`
        .activities-moodboard .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>
    </section>
  )
}
