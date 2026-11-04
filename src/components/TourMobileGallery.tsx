'use client'

import { useState } from 'react'
import Image from 'next/image'
import LazyVideo from '@/components/LazyVideo'

/**
 * Phone hero: swipe through the tour's photos with the browser's own scroll physics (scroll-snap),
 * like a photo gallery in an app. Only the first photo loads up front; the others load as they approach.
 */
export default function TourMobileGallery({
  title,
  imageUrl,
  videoUrl,
  images,
  sizes,
}: {
  title: string
  imageUrl?: string | null
  videoUrl?: string | null
  images: { url: string; alt: string }[]
  sizes: string
}) {
  const [index, setIndex] = useState(0)
  const total = images.length + 1

  return (
    <div className="relative">
      <div
        role="group"
        aria-label={`Photos : ${title}`}
        tabIndex={0}
        onScroll={(e) => {
          const el = e.currentTarget
          const next = Math.round(el.scrollLeft / el.clientWidth)
          if (next !== index) setIndex(next)
        }}
        className="hide-scrollbar flex h-[58svh] min-h-[340px] snap-x snap-mandatory overflow-x-auto overscroll-x-contain bg-brand-dark focus-visible:outline-none"
      >
        <div className="relative w-full shrink-0 snap-center overflow-hidden">
          <div className="absolute inset-0 motion-safe:[animation:ccv-push_14s_linear_both]">
            {imageUrl ? <Image src={imageUrl} alt={title} fill priority sizes={sizes} className="object-cover" /> : null}
            {videoUrl ? <LazyVideo src={videoUrl} priority aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" /> : null}
          </div>
        </div>
        {images.map((img) => (
          <div key={img.url} className="relative w-full shrink-0 snap-center bg-brand-dark">
            <Image src={img.url} alt={img.alt} fill sizes="100vw" loading="lazy" className="object-cover" />
          </div>
        ))}
      </div>

      {/* Sits just above the rounded sheet that overlaps the photos */}
      {total > 1 ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-10 right-4 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium tabular-nums text-white backdrop-blur-sm"
        >
          {index + 1} / {total}
        </span>
      ) : null}
    </div>
  )
}
