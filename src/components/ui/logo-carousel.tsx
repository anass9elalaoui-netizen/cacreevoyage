"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface Logo {
  name: string
  id: number
  img: React.ComponentType<any>
}

interface LogoColumnProps {
  logos: Logo[]
  index: number
  currentTime: number
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const distributeLogos = (allLogos: Logo[], columnCount: number): Logo[][] => {
  const shuffled = shuffleArray(allLogos)
  const columns: Logo[][] = Array.from({ length: columnCount }, () => [])

  shuffled.forEach((logo, index) => {
    columns[index % columnCount].push(logo)
  })

  const maxLength = Math.max(...columns.map((col) => col.length))
  columns.forEach((col) => {
    while (col.length < maxLength) {
      col.push(shuffled[Math.floor(Math.random() * shuffled.length)])
    }
  })

  return columns
}

const LogoColumn: React.FC<LogoColumnProps> = React.memo(
  ({ logos, index, currentTime }) => {
    const cycleInterval = 2500
    const columnDelay = index * 300
    const adjustedTime = (currentTime + columnDelay) % (cycleInterval * logos.length)
    const currentIndex = Math.floor(adjustedTime / cycleInterval)
    const CurrentLogo = useMemo(() => logos[currentIndex].img, [logos, currentIndex])

    return (
      <motion.div
        className="relative h-16 w-32 overflow-hidden md:h-24 md:w-48"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: index * 0.1,
          duration: 0.5,
          ease: "easeOut",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${logos[currentIndex].id}-${currentIndex}`}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ y: "10%", opacity: 0, filter: "blur(8px)" }}
            animate={{
              y: "0%",
              opacity: 1,
              filter: "blur(0px)",
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                mass: 1,
                bounce: 0.2,
                duration: 0.5,
              },
            }}
            exit={{
              y: "-20%",
              opacity: 0,
              filter: "blur(6px)",
              transition: {
                type: "tween",
                ease: "easeIn",
                duration: 0.3,
              },
            }}
          >
            <CurrentLogo className="h-20 w-20 max-h-[80%] max-w-[80%] object-contain md:h-32 md:w-32 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 dark:invert" />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    )
  }
)

LogoColumn.displayName = "LogoColumn"

interface LogoCarouselProps {
  columnCount?: number
  logos: Logo[]
}

export function LogoCarousel({ columnCount = 3, logos }: LogoCarouselProps) {
  const [logoSets, setLogoSets] = useState<Logo[][]>([])
  const [currentTime, setCurrentTime] = useState(0)

  const updateTime = useCallback(() => {
    setCurrentTime((prevTime) => prevTime + 100)
  }, [])

  useEffect(() => {
    const intervalId = setInterval(updateTime, 100)
    return () => clearInterval(intervalId)
  }, [updateTime])

  useEffect(() => {
    const distributedLogos = distributeLogos(logos, columnCount)
    setLogoSets(distributedLogos)
  }, [logos, columnCount])

  return (
    <div className="flex space-x-4 md:space-x-8">
      {logoSets.map((columnLogos, index) => (
        <LogoColumn
          currentTime={currentTime}
          index={index}
          key={index}
          logos={columnLogos}
        />
      ))}
    </div>
  )
}
