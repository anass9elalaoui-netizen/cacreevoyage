'use client'

import { useEffect, useState } from 'react'

export default function FilmGrain() {
  const [isLightMode, setIsLightMode] = useState(false)

  useEffect(() => {
    const checkMode = () => {
      // In this app, 'dark' class is typically toggled on html or body
      const isDark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark')
      setIsLightMode(!isDark)
    }

    checkMode()

    const observer = new MutationObserver(() => {
      checkMode()
    })

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  if (!isLightMode) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-none transition-opacity duration-1000 ease-in-out opacity-[0.035]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    />
  )
}
