"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "fade" | "scale"
  distance?: number
  duration?: number
  easing?: number[]
  staggerChildren?: boolean
  staggerDelay?: number
}

export function ScrollReveal({
  children,
  className,
  threshold = 0.1,
  rootMargin = "-50px",
  triggerOnce = true,
  delay = 0,
  direction = "up",
  distance = 40,
  duration = 0.8,
  easing: any = [0.22, 1, 0.36, 1],
  staggerChildren = false,
  staggerDelay = 0.08,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { 
    once: triggerOnce, 
    margin: rootMargin as any,
    amount: threshold 
  })
  
  const [hasAnimated, setHasAnimated] = useState(false)
  
  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true)
    }
  }, [isInView, hasAnimated])

  const getInitialVariants = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: distance }
      case "down":
        return { opacity: 0, y: -distance }
      case "left":
        return { opacity: 0, x: distance }
      case "right":
        return { opacity: 0, x: -distance }
      case "fade":
        return { opacity: 0 }
      case "scale":
        return { opacity: 0, scale: 0.9 }
      default:
        return { opacity: 0, y: distance }
    }
  }

  const getAnimateVariants = () => ({
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
  })

  const transition: any = {
    duration,
    delay,
    ease: [0.22, 1, 0.36, 1],
  }

  return (
    <motion.div
      ref={ref}
      initial={getInitialVariants()}
      animate={isInView ? getAnimateVariants() : getInitialVariants()}
      transition={transition}
      className={cn(className)}
      style={{ willChange: "transform, opacity" }}
    >
      {staggerChildren ? (
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: staggerDelay,
                delayChildren: delay,
              },
            },
          }}
        >
          {typeof children === "object" && Array.isArray(children) ? (
            children.map((child, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              >
                {child}
              </motion.div>
            ))
          ) : (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              {children}
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div
          variants={{
            hidden: getInitialVariants(),
            visible: getAnimateVariants(),
          }}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  )
}

/* Hook for scroll progress */
export function useScrollProgress() {
  const { scrollYProgress } = useScroll()
  return scrollYProgress
}

/* Hook for parallax effect */
export function useParallax(speed = 0.5) {
  const { scrollY } = useScroll()
  return useTransform(scrollY, [0, window.innerHeight], [0, -window.innerHeight * speed])
}

/* Hook for scroll-based transform */
export function useScrollTransform(inputRange: number[], outputRange: number[]) {
  const { scrollYProgress } = useScroll()
  return useTransform(scrollYProgress, inputRange, outputRange)
}

/* Scroll-triggered counter */
interface CounterProps {
  end: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function Counter({ 
  end, 
  duration = 2, 
  decimals = 0, 
  prefix = "", 
  suffix = "",
  className 
}: CounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" as any })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (isInView) {
      let startTime: number
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
        const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
        const current = Math.floor(end * eased)
        setCount(current)
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setCount(end)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [isInView, end, duration])

  return (
    <motion.div ref={ref} className={cn("font-display font-bold", className)}>
      {prefix}
      {count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </motion.div>
  )
}

/* Scroll-triggered progress bar */
interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  color?: "primary" | "secondary" | "success" | "warning"
  height?: number
  animated?: boolean
}

export function ProgressBar({ 
  value, 
  max = 100, 
  className, 
  color = "primary",
  height = 8,
  animated = true
}: ProgressBarProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" as any })
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (isInView && animated) {
      const targetWidth = (value / max) * 100
      let startTime: number
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / 1000, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setWidth(targetWidth * eased)
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setWidth(targetWidth)
        }
      }
      requestAnimationFrame(animate)
    } else if (isInView) {
      setWidth((value / max) * 100)
    }
  }, [isInView, value, max, animated])

  const colors = {
    primary: "bg-gradient-to-r from-rose-600 to-rose-500",
    secondary: "bg-gradient-to-r from-amber-600 to-amber-500",
    success: "bg-gradient-to-r from-green-600 to-green-500",
    warning: "bg-gradient-to-r from-amber-500 to-orange-500",
  }

  return (
    <div ref={ref} className={cn("rounded-full overflow-hidden", className)} style={{ height: `${height}px` }}>
      <div 
        className={cn(colors[color], "rounded-full transition-all duration-1000 ease-out")}
        style={{ width: `${width}%`, height: "100%" }}
      />
    </div>
  )
}

/* Scroll-triggered text reveal */
interface TextRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  stagger?: boolean
  staggerDelay?: number
}

export function TextReveal({ 
  children, 
  className, 
  delay = 0, 
  stagger = false, 
  staggerDelay = 0.03 
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" as any })

  const text = typeof children === "string" ? children : String(children)
  const words = stagger ? text.split(" ") : [text]

  return (
    <div ref={ref} className={cn("inline-block overflow-hidden", className)}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: "0%" }}
          transition={{ 
            duration: 0.6, 
            delay: delay + (stagger ? i * staggerDelay : 0), 
            ease: [0.22, 1, 0.36, 1] 
          }}
          className="inline-block"
        >
          {word}{stagger && " "}
        </motion.span>
      ))}
    </div>
  )
}