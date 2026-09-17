import type { ContentFormat } from "@/lib/utils"
import { CONTENT_FORMATS, canonicalFormat } from "@/lib/utils"

export type MixKey = "slideshow" | "wallOfText" | "videoHook" | "greenScreen"

export type FormatMix = {
  slideshow: number
  wallOfText: number
  videoHook: number
  greenScreen: number
  remix: number
}

export const DEFAULT_MIX: FormatMix = {
  slideshow: 25,
  wallOfText: 25,
  videoHook: 25,
  greenScreen: 25,
  remix: 60,
}

export interface ViralReference {
  id: string
  format: (typeof CONTENT_FORMATS)[number]["id"]
  title: string
  views: string
  niche: string
  hook: string
  why: string
}

/** Structures taken from Fastlane walkthroughs (left-rail “remixed from”). */
export const VIRAL_REFERENCES: ViralReference[] = [
  {
    id: "ss-3reasons",
    format: "slideshow",
    title: "3 things nobody tells you",
    views: "2.8M",
    niche: "SaaS",
    hook: "Slide 1 is the confession. Slides 2–4 are the list. Last slide is the CTA.",
    why: "TikTok photo mode. Fastlane’s studio keeps ~40 high-performing slideshow templates.",
  },
  {
    id: "ss-wait",
    format: "slideshow",
    title: "Wait for the last slide",
    views: "1.1M",
    niche: "Consumer apps",
    hook: "Hold the product name until slide 5.",
    why: "Retention from delayed reveal — same structure Fastlane remixed for Strong.app.",
  },
  {
    id: "wot-rant",
    format: "wall-of-text",
    title: "Unpopular opinion in this niche",
    views: "890K",
    niche: "Founders",
    hook: "Rant the pain for 12s. Mention the product in the last line only.",
    why: "Fastlane manual studio: pick UGC face + trending audio + ‘ranting’ style.",
  },
  {
    id: "wot-typing",
    format: "wall-of-text",
    title: "Laptop rant overlay",
    views: "640K",
    niche: "Productivity",
    hook: "Talking head at a laptop. Huge captions. No b-roll until the CTA.",
    why: "Their vibe-coder tutorial uses a typing-on-laptop avatar for this format.",
  },
  {
    id: "hook-shock",
    format: "video-hook",
    title: "Shocked face → app demo",
    views: "3.1M",
    niche: "Mobile apps",
    hook: "0–3s reaction. Cut to screen recording of the product solving it.",
    why: "Official Fastlane demo: ‘hook and someone doing a shocked reaction, then demoing the app’.",
  },
  {
    id: "hook-gym",
    format: "video-hook",
    title: "3 years in the gym",
    views: "1.4M",
    niche: "Fitness",
    hook: "Pattern interrupt caption, then split to product footage.",
    why: "Starter Story walkthrough used this as the canonical hook-demo.",
  },
  {
    id: "gs-confused",
    format: "green-screen",
    title: "I’m confused",
    views: "4.2M",
    niche: "Memes",
    hook: "Green-screen face over a headline. Punchline is your product.",
    why: "Fastlane launch demo: Johnny Depp ‘I’m confused’ green-screen meme.",
  },
  {
    id: "gs-sydney",
    format: "green-screen",
    title: "Celebrity reaction meme",
    views: "2.0M",
    niche: "Memes",
    hook: "Trending face + one-line roast of the old way of working.",
    why: "‘How I use Fastlane’ video: generate a green-screen meme in one click.",
  },
]

export function referencesFor(format: ContentFormat) {
  const id = canonicalFormat(format)
  return VIRAL_REFERENCES.filter((r) => r.format === id)
}

export function pickReference(format: ContentFormat, salt = 0) {
  const pool = referencesFor(format)
  return pool[Math.abs(salt) % pool.length] || VIRAL_REFERENCES[0]
}

export function mixToFormats(mix: FormatMix, count: number): (typeof CONTENT_FORMATS)[number]["id"][] {
  const weights: { id: (typeof CONTENT_FORMATS)[number]["id"]; w: number }[] = [
    { id: "slideshow", w: mix.slideshow },
    { id: "wall-of-text", w: mix.wallOfText },
    { id: "video-hook", w: mix.videoHook },
    { id: "green-screen", w: mix.greenScreen },
  ]
  const total = weights.reduce((s, x) => s + Math.max(0, x.w), 0) || 1
  const out: (typeof CONTENT_FORMATS)[number]["id"][] = []
  for (let i = 0; i < count; i++) {
    let cursor = ((i + 1) * 37) % total
    let chosen = weights[0].id
    for (const row of weights) {
      cursor -= Math.max(0, row.w)
      if (cursor <= 0) {
        chosen = row.id
        break
      }
    }
    out.push(chosen)
  }
  const unique = CONTENT_FORMATS.map((f) => f.id).filter((id) => weights.find((w) => w.id === id && w.w > 0))
  unique.forEach((id, i) => {
    if (i < out.length) out[i] = id
  })
  return out
}

export function formatNeedsVideo(format: ContentFormat) {
  const id = canonicalFormat(format)
  return id === "video-hook" || id === "green-screen"
}

export function posterForFormat(format: ContentFormat) {
  return `/generated/format-${canonicalFormat(format)}.jpg`
}

export const MIX_LABELS: { key: MixKey; label: string }[] = [
  { key: "slideshow", label: "Slideshows" },
  { key: "wallOfText", label: "Wall of text" },
  { key: "videoHook", label: "Hook + demo" },
  { key: "greenScreen", label: "Green screen" },
]
