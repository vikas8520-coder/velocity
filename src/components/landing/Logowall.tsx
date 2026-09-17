"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface LogoItem {
  name: string
  src: string
  alt: string
  width?: number
  height?: number
}

interface LogowallProps {
  logos: LogoItem[]
  className?: string
  speed?: number
  paused?: boolean
  direction?: "left" | "right"
  gap?: number
  showGradient?: boolean
}

export const defaultLogos: LogoItem[] = [
  { name: "Bitcoin.com", src: "https://media.aftermark.ai/usefastlane/img/logowall-bitcoin-com.png", alt: "Bitcoin.com", width: 140, height: 40 },
  { name: "Bluechew", src: "https://media.aftermark.ai/usefastlane/img/logowall-bluechew.png", alt: "Bluechew", width: 120, height: 40 },
  { name: "Cameo", src: "https://media.aftermark.ai/usefastlane/img/logowall-cameo.png", alt: "Cameo", width: 100, height: 40 },
  { name: "cbdMD", src: "https://media.aftermark.ai/usefastlane/img/logowall-cbdmd.png", alt: "cbdMD", width: 100, height: 40 },
  { name: "Coursera", src: "https://media.aftermark.ai/usefastlane/img/logowall-coursera.png", alt: "Coursera", width: 120, height: 40 },
  { name: "Deel", src: "https://media.aftermark.ai/usefastlane/img/logowall-deel.png", alt: "Deel", width: 80, height: 40 },
  { name: "Employment Hero", src: "https://media.aftermark.ai/usefastlane/img/logowall-employment-hero.png", alt: "Employment Hero", width: 160, height: 40 },
  { name: "Fastic", src: "https://media.aftermark.ai/usefastlane/img/logowall-fastic.png", alt: "Fastic", width: 100, height: 40 },
  { name: "Function Health", src: "https://media.aftermark.ai/usefastlane/img/logowall-function-health.png", alt: "Function Health", width: 140, height: 40 },
  { name: "Gopuff", src: "https://media.aftermark.ai/usefastlane/img/logowall-gopuff.png", alt: "Gopuff", width: 100, height: 40 },
  { name: "Groupon", src: "https://media.aftermark.ai/usefastlane/img/logowall-groupon.png", alt: "Groupon", width: 100, height: 40 },
  { name: "Happy Dad", src: "https://media.aftermark.ai/usefastlane/img/logowall-happy-dad.png", alt: "Happy Dad", width: 120, height: 40 },
  { name: "Hevy", src: "https://media.aftermark.ai/usefastlane/img/logowall-hevy.png", alt: "Hevy", width: 80, height: 40 },
  { name: "Hostinger", src: "https://media.aftermark.ai/usefastlane/img/logowall-hostinger.png", alt: "Hostinger", width: 100, height: 40 },
  { name: "Hypelist", src: "https://media.aftermark.ai/usefastlane/img/logowall-hypelist.png", alt: "Hypelist", width: 100, height: 40 },
  { name: "MaxRewards", src: "https://media.aftermark.ai/usefastlane/img/logowall-maxrewards.png", alt: "MaxRewards", width: 120, height: 40 },
  { name: "Popeyes", src: "https://media.aftermark.ai/usefastlane/img/logowall-popeyes.png", alt: "Popeyes", width: 100, height: 40 },
  { name: "Pudgy Penguins", src: "https://media.aftermark.ai/usefastlane/img/logowall-pudgy-penguins.png", alt: "Pudgy Penguins", width: 140, height: 40 },
  { name: "Revolut", src: "https://media.aftermark.ai/usefastlane/img/logowall-revolut.png", alt: "Revolut", width: 100, height: 40 },
  { name: "Ridge", src: "https://media.aftermark.ai/usefastlane/img/logowall-ridge.png", alt: "Ridge", width: 80, height: 40 },
  { name: "Rocket", src: "https://media.aftermark.ai/usefastlane/img/logowall-rocket.png", alt: "Rocket", width: 80, height: 40 },
  { name: "Stan", src: "https://media.aftermark.ai/usefastlane/img/logowall-stan.png", alt: "Stan", width: 80, height: 40 },
]

export function Logowall({ 
  logos = defaultLogos, 
  className,
  speed = 30,
  paused: initialPaused = false,
  direction = "left",
  gap = 48,
  showGradient = true
}: LogowallProps) {
  const [containerWidth, setContainerWidth] = useState(0)
  const [paused, setPaused] = useState(initialPaused)
  const trackRef = useRef<HTMLDivElement>(null)

  // Calculate total width for seamless looping
  useEffect(() => {
    if (trackRef.current) {
      setContainerWidth(trackRef.current.scrollWidth / 2)
    }
  }, [])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Gradient masks */}
      {showGradient && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-bg to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-bg to-transparent pointer-events-none" />
        </>
      )}

      <div 
        className="flex whitespace-nowrap"
        ref={trackRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{
          animation: paused ? "none" : `marquee ${speed}s linear infinite`,
          animationDirection: direction === "right" ? "reverse" : "normal",
          gap: `${gap}px`,
        }}
      >
        {/* First pass */}
        <div className="flex items-center gap-[48px]" style={{ minWidth: "max-content" }}>
          {logos.map((logo, i) => (
            <motion.div
              key={`${logo.name}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300 filter grayscale"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                loading="lazy"
                decoding="async"
                className="max-h-10 w-auto"
              />
            </motion.div>
          ))}
        </div>
        
        {/* Second pass for seamless loop */}
        <div className="flex items-center gap-[48px]" style={{ minWidth: "max-content" }}>
          {logos.map((logo, i) => (
            <motion.div
              key={`${logo.name}-${i}-dup`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300 filter grayscale"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                loading="lazy"
                decoding="async"
                className="max-h-10 w-auto"
              />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

import { useState, useRef, useEffect } from "react"

/* Static logowall for sections that don't need animation */
interface StaticLogowallProps {
  logos?: LogoItem[]
  className?: string
  columns?: number
}

export function StaticLogowall({ 
  logos = defaultLogos, 
  className,
  columns = 8
}: StaticLogowallProps) {
  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-8 items-center", className)}>
      {logos.map((logo, i) => (
        <motion.div
          key={logo.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className="flex items-center justify-center p-4 hover:opacity-70 transition-opacity filter grayscale"
        >
          <img
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            loading="lazy"
            decoding="async"
            className="max-h-10 w-auto"
          />
        </motion.div>
      ))}
    </div>
  )
}

/* Animated logowall with vertical stacking */
export function VerticalLogowall({ 
  logos = defaultLogos, 
  className,
  speed = 40
}: LogowallProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="flex flex-col" style={{
        animation: `vertical-marquee ${speed}s linear infinite`
      }}>
        <div className="flex flex-col gap-8">
          {logos.map((logo, i) => (
            <motion.div
              key={`${logo.name}-${i}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity filter grayscale"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                loading="lazy"
                className="max-h-10 w-auto"
              />
            </motion.div>
          ))}
        </div>
        
        <div className="flex flex-col gap-8">
          {logos.map((logo, i) => (
            <motion.div
              key={`${logo.name}-${i}-dup`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity filter grayscale"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                loading="lazy"
                className="max-h-10 w-auto"
              />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes vertical-marquee {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
      `}</style>
    </div>
  )
}