'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Testimonial = {
  id: string
  travelerName?: string
  travelerOrigin?: string
  rating?: number
  media?: {
    url?: string
    mimeType?: string
  }
  destination?: {
    id: string
    title: string
  }
}

export default function DestinationTestimonials({ testimonials }: { testimonials: Testimonial[] }) {
  // Filter out testimonials without a destination or media
  const validTestimonials = useMemo(() => {
    return testimonials.filter(t => t.destination && t.media?.url)
  }, [testimonials])

  // Get unique destinations
  const destinations = useMemo(() => {
    const destMap = new Map<string, { id: string, title: string }>()
    validTestimonials.forEach(t => {
      if (t.destination && !destMap.has(t.destination.id)) {
        destMap.set(t.destination.id, t.destination)
      }
    })
    return Array.from(destMap.values())
  }, [validTestimonials])

  const [activeTab, setActiveTab] = useState<string | null>(
    destinations.length > 0 ? destinations[0].id : null
  )

  const activeTestimonials = useMemo(() => {
    if (!activeTab) return []
    return validTestimonials.filter(t => t.destination?.id === activeTab)
  }, [activeTab, validTestimonials])

  // Play state for videos
  const [playingId, setPlayingId] = useState<string | null>(null)

  if (destinations.length === 0) {
    return null
  }

  return (
    <section className="py-24 bg-[#0B132B] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="uppercase tracking-[0.2em] text-brand-gold text-xs font-sans font-medium mb-4 block">
            Avis Clients
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
            Ils Ont Vécu <span className="text-brand-blue">l'Expérience</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {destinations.map(dest => (
            <button
              key={dest.id}
              onClick={() => {
                setActiveTab(dest.id)
                setPlayingId(null)
              }}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === dest.id
                  ? 'bg-brand-blue text-white shadow-[0_4px_20px_rgba(56,163,165,0.4)]'
                  : 'bg-white/5 text-white/70 border border-white/10 hover:border-white/30 hover:text-white'
                }`}
            >
              {dest.title}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {activeTestimonials.map(test => (
              <div
                key={test.id}
                className="relative aspect-[9/16] rounded-3xl overflow-hidden bg-black/50 border border-white/10 group shadow-xl"
              >
                {/* Media */}
                {test.media?.mimeType?.startsWith('video/') || test.media?.url?.match(/\.(mp4|webm|mov)$/i) ? (
                  <video
                    src={test.media.url}
                    className="w-full h-full object-cover"
                    loop
                    playsInline
                    controls={playingId === test.id}
                    onClick={() => {
                      if (playingId === test.id) setPlayingId(null)
                    }}
                    onPlay={() => setPlayingId(test.id)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 p-6 text-center">
                    <span className="text-4xl mb-4">🎵</span>
                    <p className="text-brand-silver text-sm italic mb-4">Témoignage Audio</p>
                    <audio
                      src={test.media?.url}
                      controls
                      className="w-full h-10"
                      onPlay={() => setPlayingId(test.id)}
                    />
                  </div>
                )}

                {/* Overlays (hide when playing video) */}
                {playingId !== test.id && test.media?.mimeType?.startsWith('video/') && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                )}

                {playingId !== test.id && (
                  <>
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 pointer-events-none">
                      <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
                      <span className="text-[10px] uppercase tracking-wider text-white font-medium">♪ Son</span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {test.media?.mimeType?.startsWith('video/') && (
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-blue/80 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                          <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                      <div className="flex gap-1 mb-2">
                        {Array.from({ length: test.rating || 5 }).map((_, i) => (
                          <span key={i} className="text-brand-gold text-sm">★</span>
                        ))}
                      </div>
                      <h3 className="text-white font-serif text-xl mb-1">{test.travelerName}</h3>
                      <p className="text-brand-silver text-xs">{test.travelerOrigin}</p>
                    </div>
                  </>
                )}

                {/* Invisible button to trigger video play if overlay is clicked */}
                {playingId !== test.id && test.media?.mimeType?.startsWith('video/') && (
                  <button
                    className="absolute inset-0 w-full h-full cursor-pointer z-20"
                    onClick={(e) => {
                      const video = e.currentTarget.parentElement?.querySelector('video');
                      if (video && video.play) {
                        video.play();
                        setPlayingId(test.id);
                      }
                    }}
                    aria-label="Play video"
                  />
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
