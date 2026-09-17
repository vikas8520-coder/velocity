"use client"

import { useState } from "react"
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { 
  Zap, Sparkles, Film, Users, 
  Calendar, Upload, BarChart2, Target,
  ArrowRight, CheckCircle2, Play, Shield, Globe, Award, Bot, Layers, Cpu, Wand2, Mic, Share2, ExternalLink
} from "lucide-react"
import { VideoPlayer } from "@/components/ui/VideoPlayer"

interface Step {
  number: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  features: string[]
  videoUrl?: string
  thumbnail?: string
}

const steps: Step[] = [
  {
    number: "01",
    title: "Connect Your Brand",
    description: "Add your website or describe your product. Velocity extracts your brand voice, visual style, and key messaging automatically.",
    icon: Sparkles,
    features: [
      "Auto-detect brand colors & fonts",
      "Extract key value propositions",
      "Identify target audience",
      "Analyze competitor content"
    ]
  },
  {
    number: "02",
    title: "Discover Trending Content",
    description: "Browse viral videos in your niche. Filter by platform, topic, engagement rate, and format to find the perfect reference.",
    icon: Target,
    features: [
      "Real-time trending feed",
      "Filter by niche & platform",
      "Engagement rate sorting",
      "Save references to library"
    ]
  },
  {
    number: "03",
    title: "Generate with AI",
    description: "Select a trending format and Velocity adapts it to your brand. Generate scripts, captions, hashtags, and video concepts in seconds.",
    icon: Film,
    features: [
      "5+ content formats",
      "Multi-platform optimization",
      "Brand voice consistency",
      "Unlimited variations"
    ]
  },
  {
    number: "04",
    title: "Review & Approve",
    description: "Swipe through generated content like Tinder. Approve, reject, or regenerate with feedback. Record voiceovers directly in-app.",
    icon: CheckCircle2,
    features: [
      "Tinder-style swipe UI",
      "Voice recording (FluidVoice)",
      "One-click regeneration",
      "Team collaboration"
    ]
  },
  {
    number: "05",
    title: "Schedule & Publish",
    description: "Connect your social accounts and auto-publish to TikTok, Instagram, YouTube, and LinkedIn. Best-time scheduling included.",
    icon: Calendar,
    features: [
      "Multi-platform publishing",
      "Best-time optimization",
      "Draft & approval workflow",
      "Cross-posting"
    ]
  },
  {
    number: "06",
    title: "Analyze & Iterate",
    description: "Track views, engagement, and conversions across all platforms. Get AI-powered insights on what works and what to improve.",
    icon: BarChart2,
    features: [
      "Cross-platform analytics",
      "Engagement heatmaps",
      "AI performance insights",
      "Automated reports"
    ]
  }
]

interface HowItWorksProps {
  className?: string
}

export function HowItWorks({ className }: HowItWorksProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)

  return (
    <section className={cn("section bg-bg-muted", className)}>
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center max-w-2xl mx-auto"
        >
          <p className="eyebrow-primary mb-4">How It Works</p>
          <h2 className="heading-2 mb-4">From idea to viral in minutes</h2>
          <p className="lead">
            Six simple steps to turn trending content into your brand's next viral hit.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.article
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => setCurrentStep(index)}
              className={cn(
                "group relative card cursor-pointer p-8 flex flex-col overflow-hidden",
                currentStep === index && "ring-2 ring-primary/30 border-primary/40"
              )}
            >
              <div className="mb-6 flex items-center gap-3">
                <span className="font-display font-bold text-3xl text-primary/20">
                  {step.number}
                </span>
                <div className="w-full h-px bg-border" />
              </div>
              <div className="mb-6 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <step.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="heading-4 mb-3">{step.title}</h3>
              <p className="text-fg-muted mb-6 flex-1 text-sm leading-relaxed">{step.description}</p>
              <ul className="space-y-2">
                {step.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-fg-muted">
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>

        {/* Mobile stepper */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="lg:hidden mb-12"
        >
          <div className="flex overflow-x-auto snap-x p-4 -mx-4 px-4 gap-4">
            {steps.map((step, index) => (
              <motion.button
                key={step.number}
                onClick={() => setCurrentStep(index)}
                className={cn(
                  "w-20 flex-shrink-0 flex flex-col items-center snap-center transition-all duration-300",
                  currentStep === index
                    ? "bg-primary text-white"
                    : "bg-white text-fg-muted hover:bg-primary/5"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={{ scale: currentStep === index ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2"
                  style={{ backgroundColor: currentStep === index ? "rgba(255,255,255,0.2)" : "rgba(190,24,93,0.1)" }}
                >
                  <step.icon className={cn("w-5 h-5", currentStep === index ? "text-white" : "text-primary")} />
                </motion.div>
                <span className="font-display font-bold text-2xl">{step.number}</span>
                <span className="text-xs text-center text-fg-muted mt-1 hidden sm:block">{step.title}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Interactive Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 30, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -30, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="grid lg:grid-cols-2 gap-12 items-center"
              >
                <div className="order-2 lg:order-1">
                  <div className="flex items-center gap-3 mb-6">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                      className="font-display font-bold text-4xl text-primary/20"
                    >
                      {steps[currentStep].number}
                    </motion.span>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full h-px bg-gradient-to-r from-primary to-secondary"
                    />
                  </div>
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="heading-2 mb-4"
                  >
                    {steps[currentStep].title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="lead mb-8"
                  >
                    {steps[currentStep].description}
                  </motion.p>
                  
                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-3"
                  >
                    {steps[currentStep].features.map((feature, i) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 + i * 0.08, type: "spring", stiffness: 300 }}
                        className="flex items-center gap-3 text-fg-muted"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 + i * 0.08 }}
                          className="w-8 h-8 rounded-full bg-success-light flex items-center justify-center flex-shrink-0"
                        >
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        </motion.div>
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
                
                <div className="order-1 lg:order-2 relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="relative aspect-video rounded-2xl overflow-hidden"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-primary/5 via-bg to-secondary/5 flex items-center justify-center relative overflow-hidden rounded-2xl">
                      {steps[currentStep].videoUrl ? (
                        <VideoPlayer
                          src={steps[currentStep].videoUrl!}
                          poster={steps[currentStep].thumbnail}
                          autoPlay
                          loop
                          muted
                          className="w-full h-full rounded-2xl"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <motion.div
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
                            >
                              <Play className="w-10 h-10 text-primary" />
                            </motion.div>
<p className="text-fg-muted">Step {steps[currentStep].number} Demo</p>
                          </div>
                        </div>
                        )}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <motion.span
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                          className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur text-white text-xs font-medium"
                        >
                          Step {steps[currentStep].number}
                        </motion.span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-3 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30 transition-colors border border-white/10"
                        >
                          <Play className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Step indicator dots */}
            <div className="flex items-center justify-center gap-2 mt-10">
              {steps.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                    currentStep === index
                      ? "bg-primary w-10"
                      : "bg-zinc-300 hover:bg-zinc-400"
                  )}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation arrows */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <motion.button
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-ghost p-3 rounded-xl"
                aria-label="Previous step"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
              </motion.button>
              <motion.button
                onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
                disabled={currentStep === steps.length - 1}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary p-3 rounded-xl"
                aria-label="Next step"
              >
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}