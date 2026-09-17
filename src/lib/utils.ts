import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M"
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K"
  return num.toString()
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export const PLATFORMS = [
  { id: "tiktok", name: "TikTok", icon: "music", color: "#010101" },
  { id: "instagram", name: "Instagram Reels", icon: "camera", color: "#E4405F" },
  { id: "youtube", name: "YouTube Shorts", icon: "play", color: "#FF0000" },
  { id: "linkedin", name: "LinkedIn", icon: "share", color: "#0A66C2" },
] as const

export type Platform = (typeof PLATFORMS)[number]["id"]

export const CONTENT_FORMATS = [
  { id: "slideshow", name: "Slideshow", description: "TikTok photo carousel. One idea per slide." },
  { id: "wall-of-text", name: "Wall of text", description: "Talking-head rant, product plug at the end." },
  { id: "video-hook", name: "Hook + demo", description: "3s shock hook, then your product on screen." },
  { id: "green-screen", name: "Green screen", description: "Meme / reaction remix of a trending clip." },
] as const

export type ContentFormat =
  | (typeof CONTENT_FORMATS)[number]["id"]
  | "hook-demo"
  | "trending-adapt"
  | "storytelling"
  | "before-after"

export function canonicalFormat(format: string | undefined): (typeof CONTENT_FORMATS)[number]["id"] {
  if (format === "slideshow") return "slideshow"
  if (format === "wall-of-text") return "wall-of-text"
  if (format === "green-screen") return "green-screen"
  if (format === "video-hook" || format === "hook-demo") return "video-hook"
  if (format === "before-after" || format === "trending-adapt") return "video-hook"
  if (format === "storytelling") return "wall-of-text"
  return "slideshow"
}

export const BRANDS = [
  { id: "custom", name: "Custom Brand", description: "Your product, learned from a URL", color: "#be185d" },
] as const

export type BrandId = (typeof BRANDS)[number]["id"] | string

export type ContentStatus =
  | "generating"
  | "pending_review"
  | "approved"
  | "rejected"
  | "scheduled"
  | "published"
  | "failed"

export interface BrandProfile {
  id: string
  name: string
  websiteUrl: string
  description: string
  tagline: string
  color: string
  niches: string[]
  targetAudience: string
  tone: string
  logoUrl?: string
  media?: string[]
  createdAt: number
}

export function screenshotUrl(site: string) {
  const normalized = /^https?:\/\//i.test(site) ? site : `https://${site}`
  return `https://image.thum.io/get/width/720/crop/1280/noanimate/${normalized}`
}

export function proxiedAsset(url: string) {
  return `/api/asset?url=${encodeURIComponent(url)}`
}

export interface ContentSlide {
  headline: string
  body: string
}

export interface ContentItem {
  id: string
  brandId: string
  title: string
  script: string
  caption: string
  hashtags: string[]
  slides?: ContentSlide[]
  format: ContentFormat
  platform: Platform
  mediaUrl?: string
  posterUrl?: string
  mediaType?: "image" | "video"
  visualPrompt?: string
  referenceContent?: {
    title: string
    angle: string
    platform: string
  }
  metadata: {
    generationPrompt: string
    modelUsed: string
    duration?: number
    aspectRatio: string
  }
  status: ContentStatus
  scheduledAt?: number
  createdAt: number
  updatedAt: number
}

export interface ScheduledPost {
  id: string
  contentId: string
  platform: Platform
  caption: string
  scheduledAt: number
  status: "pending" | "posted" | "failed"
  createdAt: number
}

export function newId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`
}
