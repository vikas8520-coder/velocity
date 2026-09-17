"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface SpotlightProps {
  phrases: string[]
  className?: string
  speed?: number
  highlightColor?: string
}

export function Spotlight({ 
  phrases = [
    "AI UGC videos",
    "viral hooks",
    "trending adaptations",
    "influencer content",
    "meme marketing",
    "hook demos",
    "before/afters",
    "storytelling reels"
  ], 
  className,
  speed = 2000,
  highlightColor = "primary"
}: SpotlightProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const nextPhrase = useCallback(() => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % phrases.length)
      setIsAnimating(false)
    }, 300)
  }, [phrases.length])

  useEffect(() => {
    const interval = setInterval(nextPhrase, speed)
    return () => clearInterval(interval)
  }, [nextPhrase, speed])

  const highlightColors = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    accent: "bg-accent text-white",
    rose: "bg-rose-500 text-white",
    violet: "bg-violet-500 text-white",
    sky: "bg-sky-500 text-white",
  }

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative px-3 py-1 rounded-lg font-semibold text-sm"
        >
          <span className={cn("relative z-10 px-1", highlightColors[highlightColor as keyof typeof highlightColors])}>
            {phrases[currentIndex]}
          </span>
          {/* Background highlight */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "absolute inset-0 rounded-lg -z-10",
              highlightColors[highlightColor as keyof typeof highlightColors]
            )}
          />
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

/* RaceText - horizontal scrolling text */
interface RaceTextProps {
  text: string
  speed?: number
  className?: string
  direction?: "left" | "right"
  paused?: boolean
}

export function RaceText({ 
  text, 
  speed = 30, 
  className, 
  direction = "left",
  paused = false
}: RaceTextProps) {
  const [width, setWidth] = useState(0)

  return (
    <div 
      className={cn("overflow-hidden whitespace-nowrap", className)}
      onMouseEnter={() => setWidth(w => w)}
    >
      <motion.div
        style={{ 
          display: "inline-flex", 
          width: "max-content",
          animation: paused ? "none" : `race ${speed}s linear infinite`,
          animationDirection: direction === "right" ? "reverse" : "normal"
        }}
        className="whitespace-nowrap"
      >
        <span className="px-4 font-display font-medium text-fg-muted">
          {text}
        </span>
        <span className="px-4 font-display font-medium text-fg-muted">
          {text}
        </span>
        <span className="px-4 font-display font-medium text-fg-muted">
          {text}
        </span>
      </motion.div>
      <style jsx global>{`
        @keyframes race {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

/* Rotating text - vertical flip */
interface RotatingTextProps {
  items: string[]
  className?: string
  interval?: number
}

export function RotatingText({ 
  items = ["Create", "Schedule", "Publish", "Analyze", "Grow"],
  className,
  interval = 2000
}: RotatingTextProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % items.length)
    }, interval)
    return () => clearInterval(timer)
  }, [items.length, interval])

  return (
    <div className={cn("relative h-8 overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-semibold text-lg"
        >
          {items[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}