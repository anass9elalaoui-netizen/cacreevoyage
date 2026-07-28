'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Testimonial = {
  id: string
  travelerName?: string
  travelerOrigin?: string
  testimonialText?: string
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
    <section className="py-24 bg-slate-50 dark:bg-transparent relative transition-colors duration-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="uppercase tracking-[0.2em] text-brand-gold text-xs font-sans font-medium mb-4 block">
            Avis Clients
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-slate-900 dark:text-white mb-6">
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
                  : 'bg-white/80 dark:bg-white/5 text-slate-600 dark:text-white/70 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              {dest.title}
            </button>
          ))}
        </div>

        {/* Video & Text Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 gap-12 max-w-5xl mx-auto"
          >
            {activeTestimonials.map(test => (
              <div
                key={test.id}
                className="flex flex-col md:flex-row bg-white dark:bg-[#111827] rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-white/5"
              >
                {/* Media Container */}
                <div className="w-full md:w-[400px] shrink-0 relative bg-black min-h-[300px] md:min-h-[500px]">
                  {test.media?.mimeType?.startsWith('video/') || test.media?.url?.match(/\.(mp4|webm|mov)$/i) ? (
                    <video
                      src={test.media.url}
                      className="absolute inset-0 w-full h-full object-cover"
                      loop
                      playsInline
                      controls={playingId === test.id}
                      onClick={() => {
                        if (playingId === test.id) setPlayingId(null)
                      }}
                      onPlay={() => setPlayingId(test.id)}
                    />
                  ) : test.media?.mimeType?.startsWith('audio/') ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 p-6 text-center absolute inset-0">
                      <span className="text-4xl mb-4">🎵</span>
                      <p className="text-white/70 text-sm italic mb-4">Témoignage Audio</p>
                      <audio
                        src={test.media?.url}
                        controls
                        className="w-full h-10"
                        onPlay={() => setPlayingId(test.id)}
                      />
                    </div>
                  ) : (
                    <img 
                      src={test.media?.url} 
                      alt="Témoignage média" 
                      className="absolute inset-0 w-full h-full object-cover" 
                    />
                  )}

                  {/* Play Overlay (hide when playing) */}
                  {playingId !== test.id && test.media?.mimeType?.startsWith('video/') && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
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

                {/* Content Container */}
                <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16 flex-1">
                  <div className="flex gap-1.5 mb-8">
                    {Array.from({ length: test.rating || 5 }).map((_, i) => (
                      <span key={i} className="text-yellow-500 text-2xl">★</span>
                    ))}
                  </div>
                  
                  <p className="font-serif italic text-2xl md:text-3xl text-slate-800 dark:text-slate-200 leading-snug mb-10">
                    "{test.testimonialText || "Une expérience inoubliable avec Ça Crée Voyage."}"
                  </p>
                  
                  <div className="mt-auto">
                    <h3 className="text-slate-900 dark:text-white font-medium text-xl uppercase tracking-wider mb-2">
                      {test.travelerName}
                    </h3>
                    <p className="text-slate-500 text-base">
                      {test.travelerOrigin}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
