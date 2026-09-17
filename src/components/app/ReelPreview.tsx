"use client"

import { useEffect, useMemo, useState } from "react"
import { Heart, MessageCircle, Share2, Music2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { canonicalFormat, cn, proxiedAsset, screenshotUrl, type BrandProfile, type ContentItem } from "@/lib/utils"
import { VideoPlayer } from "@/components/ui/VideoPlayer"

function shotsFor(brand: BrandProfile, content: ContentItem) {
  const laundryStock = (u: string) => u.includes("/generated/format-")
  const raw = [
    ...(brand.media || []),
    brand.logoUrl,
    screenshotUrl(brand.websiteUrl),
    content.posterUrl,
    content.mediaType === "image" ? content.mediaUrl : undefined,
  ].filter((u): u is string => typeof u === "string" && u.length > 0 && !laundryStock(u))
  const unique = [...new Set(raw)]
  if (!unique.length && content.posterUrl) unique.push(content.posterUrl)
  return unique.map((u) => (u.startsWith("/") || u.startsWith("blob:") ? u : proxiedAsset(u)))
}

export function ReelPreview({
  content,
  brand,
  className,
}: {
  content: ContentItem
  brand: BrandProfile
  className?: string
}) {
  const slides = content.slides?.length
    ? content.slides
    : [{ headline: content.title, body: brand.tagline }]
  const shots = useMemo(() => shotsFor(brand, content), [brand, content])
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    setSlide(0)
  }, [content.id])

  useEffect(() => {
    if (content.mediaType === "video" && content.mediaUrl) return
    const t = setInterval(() => setSlide((s) => (s + 1) % Math.max(slides.length, 1)), 2400)
    return () => clearInterval(t)
  }, [content.id, content.mediaType, content.mediaUrl, slides.length])

  if (content.mediaType === "video" && content.mediaUrl) {
    return (
      <div className={cn("relative h-full w-full overflow-hidden bg-black", className)}>
        <VideoPlayer
          src={content.mediaUrl}
          poster={content.posterUrl}
          autoPlay
          loop
          muted
          className="h-full w-full rounded-none"
        />
      </div>
    )
  }

  const current = slides[slide] || slides[0]
  const shot = shots[slide % Math.max(shots.length, 1)]
  const kind = canonicalFormat(content.format)
  const split = kind === "video-hook"

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-black text-white", className)}>
      {split && shots.length > 1 ? (
        <div className="absolute inset-0 grid grid-rows-2">
          <div className="relative overflow-hidden">
            <KenBurns src={shots[0]} />
            <span className="absolute left-3 top-3 z-10 rounded bg-white px-2 py-0.5 text-[10px] font-black uppercase text-black">
              Before
            </span>
          </div>
          <div className="relative overflow-hidden">
            <KenBurns src={shots[1] || shots[0]} />
            <span className="absolute left-3 top-3 z-10 rounded bg-rose-600 px-2 py-0.5 text-[10px] font-black uppercase">
              After
            </span>
          </div>
        </div>
      ) : (
        <KenBurns src={shot} />
      )}

      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20",
          kind === "green-screen" && "from-emerald-950/55 via-transparent"
        )}
      />

      <div className="absolute left-3 top-3 flex items-center gap-2">
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide backdrop-blur">
          {kind.replace("-", " ")}
        </span>
        <span className="rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold uppercase">
          {content.platform}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${content.id}-${slide}`}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.28 }}
          className="absolute inset-x-3 bottom-24 right-14 rounded-xl bg-black/55 p-3 backdrop-blur-sm"
        >
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
            @{brand.name.replace(/\s+/g, "").slice(0, 16).toLowerCase()}
          </p>
          <h3
            className="font-display text-[1.7rem] font-extrabold leading-[1.08] text-white"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,.85)" }}
          >
            {current.headline}
          </h3>
          {current.body ? (
            <p
              className="mt-2 max-w-[24ch] text-[15px] font-semibold leading-snug text-white"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,.9)" }}
            >
              {current.body}
            </p>
          ) : null}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-24 right-3 flex flex-col items-center gap-4 text-white">
        <RailIcon icon={Heart} label="24.1K" />
        <RailIcon icon={MessageCircle} label="312" />
        <RailIcon icon={Share2} label="Share" />
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 ring-2 ring-white/40">
          <Music2 className="h-4 w-4" />
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex gap-1">
        {slides.map((_, i) => (
          <span
            key={i}
            className={cn("h-0.5 flex-1 rounded-full", i === slide ? "bg-white" : "bg-white/30")}
          />
        ))}
      </div>
    </div>
  )
}

function KenBurns({ src }: { src?: string }) {
  const [loaded, setLoaded] = useState(false)
  if (!src) {
    return <div className="absolute inset-0 bg-zinc-900" />
  }
  return (
    <>
      {!loaded ? <div className="absolute inset-0 animate-pulse bg-zinc-800" /> : null}
      <motion.img
        key={src}
        src={src}
        alt=""
        initial={{ scale: 1, x: "0%" }}
        animate={{ scale: 1.14, x: "-2%" }}
        transition={{ duration: 2.5, ease: "linear" }}
        onLoad={() => setLoaded(true)}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </>
  )
}

function RailIcon({ icon: Icon, label }: { icon: typeof Heart; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur">
        <Icon className="h-5 w-5 fill-white" />
      </div>
      <span className="text-[10px] font-semibold">{label}</span>
    </div>
  )
}
