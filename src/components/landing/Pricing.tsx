"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { CheckCircle2, X, Sparkles, Zap, Film, Users, Target, Calendar, Upload, BarChart2, Lock, Globe, Shield, Cpu, Layers, Bot, Wand2, Mic, Share2, ExternalLink, ArrowRight } from "lucide-react"

interface PricingTier {
  name: string
  description: string
  price: {
    monthly: number
    yearly: number
  }
  features: string[]
  highlighted?: boolean
  cta: string
  ctaVariant: "primary" | "outline" | "secondary"
  badge?: string
  badgeColor?: "primary" | "secondary" | "accent" | "success"
  limitations?: string[]
}

const tiers: PricingTier[] = [
  {
    name: "Free",
    description: "Perfect for trying Velocity and creating your first viral content",
    price: { monthly: 0, yearly: 0 },
    features: [
      "5 AI generations per month",
      "3 content formats (Hook Demo, Slideshow, Before/After)",
      "TikTok & Instagram Reels publishing",
      "Basic analytics dashboard",
      "Trending content library access",
      "Swipe-style review interface",
      "FluidVoice audio recording (5 mins/month)",
      "Community support"
    ],
    limitations: [
      "Watermark on exported videos",
      "No YouTube Shorts or LinkedIn",
      "No team collaboration",
      "No API access"
    ],
    cta: "Start Free",
    ctaVariant: "outline",
    badge: "Most Popular Start",
    badgeColor: "primary"
  },
  {
    name: "Pro",
    description: "For creators and brands serious about scaling their short-form content",
    price: { monthly: 49, yearly: 39 },
    features: [
      "Unlimited AI generations",
      "All 8+ content formats",
      "All 4 platforms: TikTok, IG, YouTube, LinkedIn",
      "Advanced analytics & heatmaps",
      "AI performance insights",
      "Best-time scheduling optimization",
      "FluidVoice unlimited recording",
      "Custom brand voice training",
      "Remove watermarks",
      "Priority generation queue",
      "Email & chat support"
    ],
    highlighted: true,
    cta: "Get Started",
    ctaVariant: "primary",
    badge: "Best Value",
    badgeColor: "secondary"
  },
  {
    name: "Team",
    description: "For agencies and marketing teams managing multiple brands",
    price: { monthly: 149, yearly: 119 },
    features: [
      "Everything in Pro",
      "5 team seats included",
      "10 brand workspaces",
      "Team collaboration & approvals",
      "Shared asset library",
      "Custom approval workflows",
      "White-label reports",
      "API access",
      "Dedicated success manager",
      "SLA guarantee",
      "SSO/SAML authentication"
    ],
    cta: "Contact Sales",
    ctaVariant: "secondary",
    badge: "Enterprise Ready",
    badgeColor: "accent"
  }
]

const featureComparison = [
  { feature: "AI Generations", free: "5/month", pro: "Unlimited", team: "Unlimited" },
  { feature: "Content Formats", free: "3/8+", pro: "All 8+", team: "All 8+" },
  { feature: "Platforms", free: "TikTok, IG", pro: "All 4", team: "All 4" },
  { feature: "Video Export", free: "Watermarked", pro: "Clean", team: "Clean" },
  { feature: "Analytics", free: "Basic", pro: "Advanced + AI", team: "Advanced + AI" },
  { feature: "Scheduling", free: "Manual", pro: "Smart + Best Time", team: "Smart + Best Time" },
  { feature: "FluidVoice Audio", free: "5 min/month", pro: "Unlimited", team: "Unlimited" },
  { feature: "Brand Voices", free: "1", pro: "3", team: "10" },
  { feature: "Team Seats", free: "1", pro: "1", team: "5+" },
  { feature: "Approval Workflows", free: "No", pro: "No", team: "Yes" },
  { feature: "API Access", free: "No", pro: "No", team: "Yes" },
  { feature: "White-label Reports", free: "No", pro: "No", team: "Yes" },
  { feature: "SSO/SAML", free: "No", pro: "No", team: "Yes" },
  { feature: "Support", free: "Community", pro: "Priority", team: "Dedicated Manager" },
]

interface PricingProps {
  className?: string
  defaultYearly?: boolean
}

export function Pricing({ className, defaultYearly = true }: PricingProps) {
  const [yearly, setYearly] = useState(defaultYearly)

  return (
    <section className={cn("section", className)}>
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center max-w-2xl mx-auto"
        >
          <p className="eyebrow-primary mb-4">Simple, Transparent Pricing</p>
          <h2 className="heading-2 mb-4">Choose the plan that fits your pace</h2>
          <p className="lead">All plans include a 14-day free trial of Pro features. No credit card required.</p>
        </motion.div>

        {/* Yearly/Monthly Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-12 flex items-center justify-center gap-4"
        >
          <span className={cn("font-medium", !yearly ? "text-fg" : "text-fg-muted")}>
            Monthly
          </span>
          <div className="relative w-48 h-8 rounded-full bg-muted">
            <motion.div
              className="absolute top-0.5 left-0.5 h-7 w-[calc(50%-0.5rem)] rounded-full bg-primary shadow-md transition-transform duration-300"
              animate={{ x: yearly ? "100%" : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />
          </div>
          <span className={cn("font-medium", yearly ? "text-fg" : "text-fg-muted")}>
            Yearly
            <span className="ml-2 px-2 py-0.5 rounded-full bg-success-light text-success text-xs font-semibold">
              Save 20%
            </span>
          </span>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {tiers.map((tier, index) => (
            <motion.article
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={cn(
                "relative card p-8 flex flex-col",
                tier.highlighted && "border-primary shadow-xl shadow-primary/10",
                tier.highlighted && "ring-2 ring-primary/20"
              )}
            >
              {/* Highlight badge */}
              {tier.highlighted && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-white text-xs font-bold"
                >
                  {tier.badge}
                </motion.div>
              )}

              {/* Tier header */}
              <div className="mb-6 text-center">
                <span className={cn(
                  "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold",
                  tier.badgeColor === "primary" && "bg-primary-light text-primary",
                  tier.badgeColor === "secondary" && "bg-secondary-light text-secondary",
                  tier.badgeColor === "accent" && "bg-accent/10 text-accent",
                  tier.badgeColor === "success" && "bg-success-light text-success"
                )}>
                  {tier.badgeColor === "primary" && <Sparkles className="w-3 h-3" />}
                  {tier.badgeColor === "secondary" && <Zap className="w-3 h-3" />}
                  {tier.badgeColor === "accent" && <Target className="w-3 h-3" />}
                  {tier.badgeColor === "success" && <CheckCircle2 className="w-3 h-3" />}
                  {tier.badge || tier.name}
                </span>
                <h3 className="heading-3 mt-3 mb-1">{tier.name}</h3>
                <p className="text-fg-muted text-sm">{tier.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6 text-center">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-display font-extrabold text-5xl">
                    ${yearly ? tier.price.yearly : tier.price.monthly}
                  </span>
                  <span className="text-fg-muted self-end mb-1">/month</span>
                </div>
                {yearly && tier.price.monthly > 0 && (
                  <p className="text-sm text-fg-muted mt-1">
                    Billed ${tier.price.yearly * 12}/year
                    <span className="ml-2 px-1.5 py-0.5 rounded bg-success-light text-success text-xs font-medium">
                      Save ${(tier.price.monthly - tier.price.yearly) * 12}/yr
                    </span>
                  </p>
                )}
              </div>

              {/* CTA */}
              <Button 
                variant={tier.ctaVariant} 
                className="w-full mb-8"
                size="lg"
                onClick={() => {}}
              >
                {tier.cta}
                {tier.ctaVariant !== "outline" && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>

              {/* Features */}
              <ul className="space-y-3 flex-1">
                {tier.features.map((feature, i) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                    className="flex items-start gap-3 text-sm text-fg-muted"
                  >
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Limitations */}
              {tier.limitations && tier.limitations.length > 0 && (
                <div className="mt-6 pt-6 border-t border-card-border space-y-2">
                  {tier.limitations.map((limitation, i) => (
                    <motion.li
                      key={limitation}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                      className="flex items-start gap-3 text-sm text-fg-subtle"
                    >
                      <X className="w-5 h-5 text-destructive/50 flex-shrink-0 mt-0.5" />
                      <span>{limitation}</span>
                    </motion.li>
                  ))}
                </div>
              )}
            </motion.article>
          ))}
        </div>

        {/* Yearly savings note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-fg-muted"
        >
          Yearly billing saves 20% — that's 2.4 months free. All plans include 14-day Pro trial.
        </motion.p>

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-20"
        >
          <div className="text-center mb-8">
            <p className="eyebrow-primary mb-4">Feature Comparison</p>
            <h3 className="heading-3">See exactly what's included</h3>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-card-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted border-b border-card-border">
                  <th className="px-6 py-4 text-left font-medium text-fg">Feature</th>
                  <th className="px-6 py-4 text-center font-medium text-fg">Free</th>
                  <th className="px-6 py-4 text-center font-medium text-primary">Pro</th>
                  <th className="px-6 py-4 text-center font-medium text-secondary">Team</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border/50">
                {featureComparison.map((row, i) => (
                  <tr key={row.feature} className={cn("hover:bg-muted/50 transition-colors", i % 2 === 1 && "bg-muted/30")}>
                    <td className="px-6 py-4 font-medium text-fg">{row.feature}</td>
                    <td className="px-6 py-4 text-center text-fg-muted">{row.free}</td>
                    <td className="px-6 py-4 text-center text-primary font-medium">{row.pro}</td>
                    <td className="px-6 py-4 text-center text-secondary font-medium">{row.team}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-20"
        >
          <div className="text-center mb-8">
            <p className="eyebrow-primary mb-4">Questions?</p>
            <h3 className="heading-3">Frequently asked questions</h3>
          </div>
          <div className="max-w-2xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const faqs = [
  {
    q: "Can I switch plans later?",
    a: "Yes, you can upgrade or downgrade at any time. Upgrades take effect immediately, downgrades take effect at the end of your billing cycle."
  },
  {
    q: "What happens after my 14-day Pro trial?",
    a: "You'll be prompted to choose a plan. If you don't select one, you'll automatically move to the Free plan with its limitations."
  },
  {
    q: "Is there a limit on video length?",
    a: "Free plan: 30 seconds max. Pro/Team: 90 seconds for TikTok/Reels, 60 seconds for YouTube Shorts."
  },
  {
    q: "Can I use my own media assets?",
    a: "Yes! Pro and Team plans let you upload your own videos, images, and audio. Free plan uses only AI-generated assets."
  },
  {
    q: "How does FluidVoice integration work?",
    a: "FluidVoice runs locally on your device. Click the mic icon in Velocity, hold to record, and your voice is transcribed instantly — no cloud, no latency."
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a 30-day money-back guarantee on all paid plans. No questions asked."
  }
]

function FAQItem({ faq, index }: { faq: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 + index * 0.05 }}
      className="card overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-6 flex items-center justify-between gap-4 text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <span className="font-medium text-fg pr-8">{faq.q}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-fg-muted flex-shrink-0"
        >
          <Sparkles className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-6"
          >
            <p className="text-fg-muted leading-relaxed">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

import { useState } from "react"