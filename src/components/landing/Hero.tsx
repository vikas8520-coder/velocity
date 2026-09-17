"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Sparkles, Zap, CheckCircle2, Play, MousePointerClick } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

interface HeroProps {
  className?: string
}

export function Hero({ className }: HeroProps) {
  const [mounted, setMounted] = useState(false)
  const scrollY = useMotionValue(0)
  const { scrollYProgress } = useScroll({ target: useRef<HTMLDivElement>(null), offset: ["start start", "end start"] })
  
  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      scrollY.set(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrollY])

  const y = useTransform(scrollY, [0, 500], [0, -150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3])
  const scale = useTransform(scrollY, [0, 500], [1, 0.95])
  const glowOpacity = useTransform(scrollY, [0, 200], [1, 0])

  return (
    <section 
      ref={useRef<HTMLDivElement>(null)}
      className={cn("relative overflow-hidden py-20 sm:py-28 lg:py-32 xl:py-40", className)}
    >
      {/* Animated background with multiple layers */}
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg-muted/50 to-bg" />
        
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1, 1.05, 1], opacity: [0, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "blur(120px)" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-3xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1, 1.08, 1], opacity: [0, 0.12, 0.08] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ filter: "blur(100px)" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full bg-accent/10 blur-3xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1, 1.1, 1], opacity: [0, 0.1, 0.05] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          style={{ filter: "blur(80px)" }}
        />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23d4d4d8' stroke-width='0.5'%3E%3Cpath d='M0 60h60M60 0v60'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }} />
        
        {/* Noise overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.02,
        }} />
      </div>

      {/* Scroll progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 -z-10 bg-transparent"
        style={{
          background: "linear-gradient(to right, var(--color-primary), var(--color-secondary))",
        }}
        animate={{ scaleX: scrollYProgress }}
        style={{ transformOrigin: "left center" }}
      />

      <div className="container-main relative">
        {/* Main content with scroll-based animations */}
        <motion.div
          style={{ y, opacity, scale, transformOrigin: "center center" }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Floating decorative elements */}
          <div className="absolute -top-20 -right-10 w-32 h-32 rounded-full bg-primary/5 blur-2xl animate-float" style={{ animationDelay: "0s" }} aria-hidden="true" />
          <div className="absolute -top-40 -left-10 w-24 h-24 rounded-full bg-secondary/10 blur-2xl animate-float" style={{ animationDelay: "2s" }} aria-hidden="true" />
          <div className="absolute bottom-20 -right-20 w-20 h-20 rounded-full bg-accent/10 blur-2xl animate-float" style={{ animationDelay: "4s" }} aria-hidden="true" />
          
          {/* Eyebrow with animated badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="eyebrow-primary mb-6 inline-flex items-center gap-2"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-5 h-5 flex items-center justify-center"
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
            <span>New: AI UGC Video Generator</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>AI Influencer Generator</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Hook Generator</span>
          </motion.div>

          {/* Headline with per-word animation */}
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="heading-1 font-display mb-6"
          >
            <span className="block reveal-up stagger-1">Turn trending videos into</span>
            <span className="block gradient-text-hero reveal-up stagger-2">content for your brand</span>
          </motion.h1>

          {/* Subheadline with typewriter effect */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lead mx-auto mb-12 max-w-3xl"
          >
            Create, schedule, and publish AI-generated shorts across TikTok, Instagram Reels, YouTube Shorts, and LinkedIn — all from one platform.
          </motion.p>

          {/* CTA Buttons with premium hover effects */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button 
              size="lg" 
              className="w-full sm:w-auto group relative overflow-hidden"
              onClick={() => {}}
            >
              <span className="relative z-10">Start Free — No Credit Card</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <ArrowRight 
                className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" 
              />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto group relative overflow-hidden"
              onClick={() => {}}
            >
              <Play className="w-4 h-4 mr-2 relative z-10" />
              <span className="relative z-10">Watch Demo</span>
              <motion.div
                className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </Button>
          </motion.div>

          {/* Trust indicators with stagger */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-fg-muted"
          >
            {[
              { icon: CheckCircle2, text: "Free tier forever" },
              { icon: CheckCircle2, text: "Cancel anytime" },
              { icon: CheckCircle2, text: "No credit card required" },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-2 group"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                  className="text-success"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </motion.div>
                <span className="group-hover:text-fg transition-colors">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Platform logos with hover effects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-6 opacity-50 hover:opacity-100 transition-opacity duration-500"
          >
            {[
              { label: "LinkedIn", icon: <span className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs">in</span> },
              { label: "TikTok", icon: <span className="w-8 h-8 rounded-full bg-[#FF0050] flex items-center justify-center text-white font-bold text-xs">TK</span> },
              { label: "Instagram", icon: <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#833AB4] to-[#FD1D1D] to-[#FCAF45] flex items-center justify-center text-white font-bold text-xs">IG</span> },
              { label: "YouTube", icon: <span className="w-8 h-8 rounded-full bg-[#FF0000] flex items-center justify-center text-white font-bold text-xs">YT</span> },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.1, y: -4 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 text-xs font-medium text-fg-muted group cursor-pointer"
              >
                {item.icon}
                <span className="group-hover:text-fg transition-colors">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator with mouse animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-fg-muted/50">
            <span className="text-xs uppercase tracking-wider font-medium">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-1"
            >
              <MousePointerClick className="w-5 h-5 opacity-60" />
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-6 bg-current/30 rounded-full"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}