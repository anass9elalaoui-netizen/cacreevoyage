import React from 'react'
import Image from 'next/image'
import LazyVideo from '@/components/LazyVideo'
import {
  BrandedCover,
  PlatformBadge,
  PostcardStamp,
  Stars,
  destinationOf,
  getTestimonialCover,
  initialsOf,
  type TestimonialDoc,
} from '@/components/testimonials/shared'

interface TestimonialsSectionProps {
  testimonials: TestimonialDoc[]
}

const TestimonialCard = ({ data }: { data: TestimonialDoc }) => {
  const cover = getTestimonialCover(data)
  const dest = destinationOf(data)
  const photo = data.travelerPhoto && typeof data.travelerPhoto === 'object' ? data.travelerPhoto.url : null

  return (
    <div className="flex-shrink-0 w-[340px] h-[380px] bg-white dark:bg-[#111827] rounded-3xl overflow-hidden relative shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-white/5 flex flex-col group">
      {/* Image: traveler photo → destination cover → branded fallback (never grey) */}
      <div className="h-[55%] relative w-full overflow-hidden">
        {cover?.kind === 'image' ? (
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            sizes="340px"
            loading="lazy"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : cover?.kind === 'video' ? (
          // Destination cover is a video: show one still frame, loaded near the viewport only
          <LazyVideo
            src={`${cover.url}#t=0.5`}
            paused
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <BrandedCover />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <PostcardStamp destination={dest?.title} year={data.tripYear} className="absolute top-4 right-4" />
      </div>

      <div className="flex-1 relative pt-8 px-6 pb-6 flex flex-col items-center">
        {/* Avatar: author photo if uploaded, otherwise initials */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-[52px] h-[52px] rounded-full border-2 border-white dark:border-[#111827] overflow-hidden bg-brand-blue/10">
          {photo ? (
            <Image src={photo} alt={data.travelerName || 'Voyageur'} fill sizes="52px" className="object-cover" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-brand-blue">
              {initialsOf(data.travelerName)}
            </span>
          )}
        </div>

        <Stars rating={data.rating} className="justify-center my-3 text-sm" />

        {data.testimonialText && (
          <p className="font-heading italic text-[0.95rem] text-slate-700 dark:text-slate-300 text-center line-clamp-2 leading-relaxed font-normal">
            &laquo;&nbsp;{data.testimonialText}&nbsp;&raquo;
          </p>
        )}

        <div className="mt-auto w-full flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[0.75rem] tracking-[0.1em] font-medium text-slate-900 dark:text-white leading-tight">
              {data.travelerName}
            </span>
            {data.travelerOrigin && (
              <span className="text-[0.65rem] text-slate-500 uppercase mt-0.5 font-semibold tracking-wider">
                {data.travelerOrigin}
              </span>
            )}
          </div>
          <PlatformBadge platform={data.platform} />
        </div>
      </div>
    </div>
  )
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null

  // Duplicate for marquee infinite loop
  const loopItems = [...testimonials, ...testimonials]

  return (
    <section className="w-full py-20 md:py-32 overflow-hidden bg-slate-50/50 dark:bg-transparent">
      <div className="max-w-[1400px] mx-auto px-6 mb-12 flex flex-col items-center text-center">
        <span className="uppercase text-brand-blue font-semibold text-xs mb-4 block tracking-wider">
          Ce que nos voyageurs disent
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow-none leading-tight max-w-2xl font-medium tracking-wide">
          120+ aventures. Des sourires qui durent.
        </h2>
      </div>

      <div className="relative w-full overflow-hidden group">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 12px)); } /* 12px accounts for half the gap */
          }
          .animate-marquee {
            animation: marquee 40s linear infinite;
            display: flex;
            width: max-content;
            will-change: transform;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-marquee { animation: none; }
          }
        `}} />

        {/* Fading edges for the marquee */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-slate-50/50 dark:from-[#0B132B] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-slate-50/50 dark:from-[#0B132B] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee gap-6 px-6">
          {loopItems.map((testim, i) => (
            <TestimonialCard key={`${testim.id}-${i}`} data={testim} />
          ))}
        </div>
      </div>
    </section>
  )
}
