"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Star, Quote, Sparkles, Zap, CheckCircle2, ArrowRight, ExternalLink, Shield, Users, Globe, Award } from "lucide-react"

interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  company: string
  avatar?: string
  results?: {
    metric: string
    value: string
  }[]
  platform?: "tiktok" | "instagram" | "youtube" | "linkedin"
  featured?: boolean
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    quote: "Velocity completely changed how we approach short-form content. What used to take our team weeks now takes hours. We've 10x'd our output and seen a 340% increase in engagement.",
    author: "Sarah Chen",
    role: "Head of Growth",
    company: "Notion",
    results: [
      { metric: "Output Increase", value: "10x" },
      { metric: "Engagement", value: "+340%" },
      { metric: "Time Saved", value: "40 hrs/week" }
    ],
    featured: true
  },
  {
    id: "2",
    quote: "The trending content library is a game-changer. We never run out of ideas, and the AI adaptation keeps our brand voice consistent across all platforms.",
    author: "Marcus Johnson",
    role: "Founder",
    company: "Linear",
    results: [
      { metric: "Content/week", value: "50+" },
      { metric: "Followers", value: "+120K" }
    ]
  },
  {
    id: "3",
    quote: "FluidVoice integration is brilliant. I dictate scripts while walking between meetings, and they're ready to approve when I sit down. Zero friction.",
    author: "Emily Rodriguez",
    role: "Content Director",
    company: "Vercel",
    results: [
      { metric: "Scripts/day", value: "15+" },
      { metric: "Approval time", value: "< 2 min" }
    ]
  },
  {
    id: "4",
    quote: "We manage 12 client brands. Velocity's team workspaces and approval workflows saved us from spreadsheet hell. Best agency tool we've bought.",
    author: "David Park",
    role: "Creative Director",
    company: "NoGood Agency",
    results: [
      { metric: "Brands managed", value: "12" },
      { metric: "Team efficiency", value: "+300%" }
    ]
  },
  {
    id: "5",
    quote: "The trending adaptation feature is unfair. We take viral formats in our niche and make them ours. Competitors are copying our content now.",
    author: "Lisa Wang",
    role: "Marketing Lead",
    company: "Ramp",
    results: [
      { metric: "Viral hits", value: "8" },
      { metric: "CAC reduction", value: "-45%" }
    ]
  },
  {
    id: "6",
    quote: "Best-time scheduling alone paid for the year. Our posts now hit when our audience is actually awake. Simple but powerful.",
    author: "James Kim",
    role: "Social Media Manager",
    company: "Supabase",
    results: [
      { metric: "Reach increase", value: "+78%" },
      { metric: "Click-through", value: "+23%" }
    ]
  }
]

interface TestimonialsProps {
  className?: string
  variant?: "grid" | "carousel" | "featured"
}

export function Testimonials({ className, variant = "grid" }: TestimonialsProps) {
  if (variant === "featured") {
    const featured = testimonials.find(t => t.featured) || testimonials[0]
    const others = testimonials.filter(t => !t.featured).slice(0, 3)

    return (
      <section className={cn("section", className)}>
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center max-w-2xl mx-auto"
          >
            <p className="eyebrow-primary mb-4">Loved by Teams</p>
            <h2 className="heading-2 mb-4">Trusted by the world's fastest-growing brands</h2>
            <p className="lead">See why 10,000+ creators and teams choose Velocity.</p>
          </motion.div>

          {/* Featured testimonial */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="card card-gradient p-10 md:p-16 max-w-4xl mx-auto relative">
              <Quote className="absolute top-8 left-8 w-16 h-16 text-primary/10" />
              
              <div className="relative z-10">
                <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed mb-8 font-medium">
                  "{featured.quote}"
                </p>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{featured.author}</p>
                    <p className="text-sm text-fg-muted">{featured.role} at {featured.company}</p>
                  </div>
                </div>

                {/* Results */}
                {featured.results && (
                  <div className="flex flex-wrap gap-6">
                    {featured.results.map((result, i) => (
                      <motion.div
                        key={result.metric}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-center gap-2 p-3 rounded-xl bg-white/50 backdrop-blur"
                      >
                        <div className="font-bold text-primary">{result.value}</div>
                        <span className="text-sm text-fg-muted">{result.metric}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.article>

          {/* Other testimonials */}
          <div className="grid md:grid-cols-3 gap-6">
            {others.map((testimonial, i) => (
              <motion.article
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="card p-6 hover:shadow-xl transition-shadow"
              >
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <p className="text-fg mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{testimonial.author}</p>
                    <p className="text-xs text-fg-muted">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
                {testimonial.results && (
                  <div className="mt-4 flex gap-4 text-xs">
                    {testimonial.results.map((result, j) => (
                      <span key={j} className="px-2 py-1 rounded bg-muted text-fg-muted">
                        {result.value} {result.metric}
                      </span>
                    ))}
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Carousel variant
  if (variant === "carousel") {
    const [current, setCurrent] = useState(0)

    return (
      <section className={cn("section", className)}>
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center max-w-2xl mx-auto"
          >
            <p className="eyebrow-primary mb-4">Loved by Teams</p>
            <h2 className="heading-2 mb-4">What our customers say</h2>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="card p-10 md:p-16 text-center"
              >
                <Quote className="w-12 h-12 text-primary/20 mx-auto mb-6" />
                <p className="text-2xl md:text-3xl leading-relaxed mb-8 font-medium max-w-2xl mx-auto">
                  "{testimonials[current].quote}"
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">{testimonials[current].author}</p>
                    <p className="text-sm text-fg-muted">{testimonials[current].role}, {testimonials[current].company}</p>
                  </div>
                </div>
                {testimonials[current].results && (
                  <div className="mt-8 flex justify-center gap-8">
                    {testimonials[current].results!.map((result, i) => (
                      <div key={i} className="text-center">
                        <p className="font-display font-bold text-3xl text-primary">{result.value}</p>
                        <p className="text-sm text-fg-muted">{result.metric}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button variant="ghost" size="icon" onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}>
                <ArrowRight className="w-5 h-5 rotate-180" />
              </Button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      current === i ? "bg-primary w-8" : "bg-muted hover:bg-muted-hover"
                    )}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>
              <Button variant="ghost" size="icon" onClick={() => setCurrent(c => Math.min(testimonials.length - 1, c + 1))} disabled={current === testimonials.length - 1}>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Grid variant
  return (
    <section className={cn("section", className)}>
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center max-w-2xl mx-auto"
        >
          <p className="eyebrow-primary mb-4">Loved by Teams</p>
          <h2 className="heading-2 mb-4">Trusted by 10,000+ creators and teams</h2>
          <p className="lead">See why the world's fastest-growing brands choose Velocity.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.article
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={cn("card p-6 hover:shadow-xl transition-all", testimonial.featured && "border-primary ring-2 ring-primary/20")}
            >
              {testimonial.featured && (
                <div className="flex items-center gap-2 mb-4 px-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="px-2 py-0.5 rounded-full bg-primary-light text-primary text-xs font-semibold">
                    Featured
                  </span>
                </div>
              )}

              <Quote className="w-8 h-8 text-primary/20 mb-4" />
              <p className="text-fg mb-6 leading-relaxed">"{testimonial.quote}"</p>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{testimonial.author}</p>
                  <p className="text-xs text-fg-muted">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>

              {testimonial.results && (
                <div className="flex flex-wrap gap-3 pt-4 border-t border-card-border">
                  {testimonial.results.map((result, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + j * 0.05 }}
                      className="px-3 py-1.5 rounded-xl bg-primary-light text-primary text-xs font-semibold"
                    >
                      {result.value} {result.metric}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.article>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <TrustBadge icon={Shield} label="SOC 2 Certified" desc="Enterprise-grade security" />
          <TrustBadge icon={Globe} label="Global CDN" desc="Lightning-fast worldwide" />
          <TrustBadge icon={Award} label="#1 Product Hunt" desc="Top launch of the month" />
          <TrustBadge icon={Users} label="10,000+ Teams" desc="And growing daily" />
        </motion.div>
      </div>
    </section>
  )
}

function TrustBadge({ icon: Icon, label, desc }: { icon: React.ComponentType<{ className?: string }>; label: string; desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card p-6 text-center hover:shadow-lg transition-shadow"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <p className="font-semibold mb-1">{label}</p>
      <p className="text-sm text-fg-muted">{desc}</p>
    </motion.div>
  )
}

import { useState } from "react"