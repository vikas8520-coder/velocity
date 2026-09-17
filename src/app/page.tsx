"use client"

import { Nav } from "@/components/landing/Nav"
import { Hero } from "@/components/landing/Hero"
import { Logowall, defaultLogos } from "@/components/landing/Logowall"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { Showcase } from "@/components/landing/Showcase"
import { Testimonials } from "@/components/landing/Testimonials"
import { Pricing } from "@/components/landing/Pricing"
import { Footer } from "@/components/landing/Footer"
import { Button } from "@/components/ui/Button"
import { motion } from "framer-motion"
import { ArrowRight as ArrowRightIcon, Play as PlayIcon } from "lucide-react"
import type { ShowcaseItem } from "@/components/landing/Showcase"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

const showcaseItems: ShowcaseItem[] = [
  {
    id: "1",
    title: "3 AI Tools That Replaced My $500/mo Stack",
    description: "Hook demo showing how to save thousands on SaaS subscriptions",
    thumbnail: "https://picsum.photos/seed/velocity1/600/1067",
    videoUrl: "https://media.aftermark.ai/usefastlane/video/demo-1.mp4",
    type: "hook",
    platform: "tiktok",
    tags: ["AI", "SaaS", "Productivity", "Tools"],
    stats: { views: 2400000, likes: 180000, comments: 3200 }
  },
  {
    id: "2",
    title: "My Morning Routine for 10x Output",
    description: "Slideshow format breaking down a high-performance morning routine",
    thumbnail: "https://picsum.photos/seed/velocity2/600/1067",
    type: "slideshow",
    platform: "instagram",
    tags: ["Productivity", "Routine", "Habits", "Success"],
    stats: { views: 890000, likes: 67000, comments: 1800 }
  },
  {
    id: "3",
    title: "Laundry Hack: Never Sort Again",
    description: "Before/After showing the myth of laundry sorting debunked",
    thumbnail: "https://picsum.photos/seed/velocity3/600/1067",
    videoUrl: "https://media.aftermark.ai/usefastlane/video/demo-3.mp4",
    type: "before-after",
    platform: "youtube",
    tags: ["LifeHack", "Laundry", "TimeSaver", "Home"],
    stats: { views: 1200000, likes: 89000, comments: 2100 }
  },
  {
    id: "4",
    title: "This AI Trend Is Everywhere Right Now",
    description: "Trending adaptation of viral format for AI productivity niche",
    thumbnail: "https://picsum.photos/seed/velocity4/600/1067",
    type: "trending-adapt",
    platform: "tiktok",
    tags: ["AI", "Trending", "Viral", "Productivity"],
    stats: { views: 3100000, likes: 245000, comments: 5600 }
  },
  {
    id: "5",
    title: "Stop Using ChatGPT Wrong!",
    description: "UGC-style video showing better prompting techniques",
    thumbnail: "https://picsum.photos/seed/velocity5/600/1067",
    type: "ugc",
    platform: "instagram",
    tags: ["ChatGPT", "Prompting", "AI", "Tips"],
    stats: { views: 1500000, likes: 112000, comments: 3400 }
  },
  {
    id: "6",
    title: "How I Built My SaaS from $0 to $10K/MRR",
    description: "Storytelling format documenting the entrepreneurial journey",
    thumbnail: "https://picsum.photos/seed/velocity6/600/1067",
    type: "storytelling",
    platform: "linkedin",
    tags: ["SaaS", "Entrepreneur", "BuildInPublic", "Growth"],
    stats: { views: 560000, likes: 34000, comments: 890 }
  },
  {
    id: "7",
    title: "The $0 to $10K/Month Automation Stack",
    description: "Hook demo revealing the exact tools for business automation",
    thumbnail: "https://picsum.photos/seed/velocity7/600/1067",
    videoUrl: "https://media.aftermark.ai/usefastlane/video/demo-7.mp4",
    type: "hook",
    platform: "tiktok",
    tags: ["Automation", "Business", "NoCode", "Income"],
    stats: { views: 3100000, likes: 245000, comments: 5600 }
  },
  {
    id: "8",
    title: "5 Habits That 10x'd My Productivity",
    description: "Slideshow carousel of high-impact daily habits",
    thumbnail: "https://picsum.photos/seed/velocity8/600/1067",
    type: "slideshow",
    platform: "instagram",
    tags: ["Habits", "Productivity", "Success", "Growth"],
    stats: { views: 2100000, likes: 156000, comments: 4200 }
  }
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Nav transparent />
      
      <main className="pt-16 lg:pt-20">
        {/* Hero */}
        <Hero />
        
        {/* Logowall */}
        <ScrollReveal direction="fade" delay={0.1} className="py-12 border-y border-card-border bg-bg-muted/30">
          <section className="py-12 border-y border-card-border bg-bg-muted/30">
            <div className="container-main">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center text-sm text-fg-muted mb-8 uppercase tracking-wider"
              >
                Trusted by 10,000+ teams worldwide
              </motion.p>
              <Logowall logos={defaultLogos} />
            </div>
          </section>
        </ScrollReveal>

        {/* How It Works */}
        <ScrollReveal direction="up" delay={0.1} className="relative">
          <HowItWorks />
        </ScrollReveal>

        {/* Showcase */}
        <ScrollReveal direction="up" delay={0.15} className="relative">
          <Showcase
            items={showcaseItems}
            title="Recent Creations"
            subtitle="See what brands are creating with Velocity"
            variant="grid"
          />
        </ScrollReveal>

        {/* Testimonials */}
        <ScrollReveal direction="up" delay={0.2} className="relative">
          <Testimonials variant="grid" />
        </ScrollReveal>

        {/* Pricing */}
        <ScrollReveal direction="up" delay={0.25} className="relative">
          <Pricing />
        </ScrollReveal>

        {/* CTA Section */}
        <ScrollReveal direction="fade" delay={0.1} className="relative">
          <section className="section bg-gradient-to-br from-primary/5 via-bg to-secondary/5">
            <div className="container-main text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto"
              >
                <p className="eyebrow-primary mb-4">Ready to Start?</p>
                <h2 className="heading-2 mb-6">Join 10,000+ creators making viral content</h2>
                <p className="lead mb-8">
                  Start free, upgrade when you're ready. No credit card required.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" onClick={() => {}}>
                    Start Free — No Credit Card
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => {}}>
                    Watch Demo
                    <PlayIcon className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <p className="text-sm text-fg-muted mt-6">
                  Free tier forever • Cancel anytime • SOC 2 certified
                </p>
              </motion.div>
            </div>
          </section>
        </ScrollReveal>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  )
}