"use client"

import { useState, useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { Play, ExternalLink, Zap, Sparkles, Users, Film, Image, Share2, Heart, MessageSquare, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { VideoPlayer } from "@/components/ui/VideoPlayer"

export interface ShowcaseItem {
  id: string
  title: string
  description: string
  thumbnail: string
  videoUrl?: string
  type: "video" | "image" | "ugc" | "influencer" | "meme" | "hook" | "slideshow" | "storytelling" | "before-after" | "trending-adapt"
  platform: "tiktok" | "instagram" | "youtube" | "linkedin"
  stats?: {
    views: number
    likes: number
    comments: number
  }
  tags?: string[]
}

interface ShowcaseProps {
  items: ShowcaseItem[]
  title?: string
  subtitle?: string
  className?: string
  variant?: "grid" | "carousel" | "featured"
}

const typeIcons = {
  video: Film,
  image: Image,
  ugc: Users,
  influencer: Sparkles,
  meme: Zap,
  hook: Zap,
  slideshow: Image,
  storytelling: Film,
  "before-after": Zap,
  "trending-adapt": Sparkles,
}

const typeLabels = {
  video: "AI Video",
  image: "AI Image",
  ugc: "UGC Style",
  influencer: "Influencer",
  meme: "Meme",
  hook: "Hook Demo",
  slideshow: "Slideshow",
  storytelling: "Storytelling",
  "before-after": "Before/After",
  "trending-adapt": "Trending Adapt",
}

const platformColors = {
  tiktok: "#000000",
  instagram: "#E4405F",
  youtube: "#FF0000",
  linkedin: "#0A66C2",
}

export function Showcase({ 
  items, 
  title = "Content Showcase", 
  subtitle = "See what brands are creating with Velocity",
  className,
  variant = "grid"
}: ShowcaseProps) {
  if (variant === "featured") {
    const featured = items[0]
    const rest = items.slice(1, 4)
    
    return (
      <section className={cn("section", className)}>
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 text-center max-w-2xl mx-auto"
          >
            <p className="eyebrow-primary mb-4">Featured Creation</p>
            <h2 className="heading-2 mb-4">{title}</h2>
            <p className="lead">{subtitle}</p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-6">
            <motion.article
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden group">
                {featured.videoUrl ? (
                  <VideoPlayer
                    src={featured.videoUrl}
                    poster={featured.thumbnail}
                    autoPlay
                    loop
                    muted
                    className="w-full h-full"
                  />
                ) : (
                  <>
                    <img
                      src={featured.thumbnail}
                      alt={featured.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                      <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <motion.span
                            whileHover={{ scale: 1.1 }}
                            className="px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur text-white text-xs font-semibold"
                          >
                            {typeLabels[featured.type]}
                          </motion.span>
                          <motion.span
                            whileHover={{ scale: 1.1 }}
                            className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur text-white text-xs font-semibold"
                            style={{ backgroundColor: platformColors[featured.platform] }}
                          >
                            {featured.platform}
                          </motion.span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors border border-white/10"
                          aria-label="Watch full video"
                        >
                          <Play className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-6 p-6 card-strong"
                >
                  <h3 className="heading-4 mb-3">{featured.title}</h3>
                  <p className="text-fg-muted mb-4">{featured.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {featured.tags?.map(tag => (
                      <motion.span
                        key={tag}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1 rounded-full bg-muted text-xs text-fg-muted hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
                      >
                        #{tag}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </motion.article>

              <div className="lg:col-span-5 space-y-4">
                {rest.map((item, i) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="group"
                  >
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden">
                      {item.videoUrl ? (
                        <VideoPlayer
                          src={item.videoUrl}
                          poster={item.thumbnail}
                          autoPlay
                          loop
                          muted
                          className="w-full h-full"
                        />
                      ) : (
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      )}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className="px-2 py-1 rounded bg-primary/90 backdrop-blur text-white text-xs font-semibold"
                        >
                          {typeLabels[item.type]}
                        </motion.span>
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className="px-2 py-1 rounded bg-white/20 backdrop-blur text-white text-xs font-semibold"
                          style={{ backgroundColor: platformColors[item.platform] }}
                        >
                          {item.platform}
                        </motion.span>
                      </div>
                    </div>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-3 font-medium text-sm line-clamp-1"
                    >
                      {item.title}
                    </motion.p>
                  </motion.article>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 text-center"
            >
              <Button variant="outline" size="lg" onClick={() => {}}>
                View All Creations
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </section>
      )
    }

    return (
      <section className={cn("section", className)}>
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 text-center max-w-2xl mx-auto"
          >
            <p className="eyebrow-primary mb-4">Recent Creations</p>
            <h2 className="heading-2 mb-4">{title}</h2>
            <p className="lead">{subtitle}</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item, i) => (
              <ShowcaseCard key={item.id} item={item} index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <Button variant="outline" size="lg" onClick={() => {}}>
              View All Creations
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    )
  }
}

function ShowcaseCard({ item, index }: { item: ShowcaseItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  
  const y = useTransform(scrollYProgress, [0, 1], [20, -20])
  const rotateX = useTransform(scrollYProgress, [0, 1], [-3, 3])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.02])

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 40 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ y, rotateX, scale }}
      className="group"
    >
      <div className="relative aspect-video rounded-2xl overflow-hidden card-premium">
        {item.videoUrl ? (
          <VideoPlayer
            src={item.videoUrl}
            poster={item.thumbnail}
            autoPlay
            loop
            muted
            className="w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <>
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="px-2.5 py-1 rounded bg-primary/95 backdrop-blur text-white text-xs font-semibold"
                  >
                    {typeLabels[item.type]}
                  </motion.span>
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="px-2 py-1 rounded bg-white/20 backdrop-blur text-white text-xs font-semibold"
                    style={{ backgroundColor: platformColors[item.platform] }}
                  >
                    {item.platform}
                  </motion.span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors border border-white/10"
                  aria-label="Watch full video"
                >
                  <Play className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </>
        )}
        
        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-zinc-900/90 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {item.tags?.slice(0, 4).map(tag => (
                <motion.span
                  key={tag}
                  whileHover={{ scale: 1.08, y: -2 }}
                  className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur text-white text-xs font-medium hover:bg-white/20 transition-all cursor-pointer border border-white/10"
                >
                  #{tag}
                </motion.span>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-white/10 backdrop-blur text-white hover:bg-white/20 transition-colors border border-white/10"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
        
        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/20 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.article>
  )
}