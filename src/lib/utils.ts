import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export const PLATFORMS = [
  { id: "tiktok", name: "TikTok", icon: "music", color: "#000000" },
  { id: "instagram", name: "Instagram Reels", icon: "camera", color: "#E4405F" },
  { id: "youtube", name: "YouTube Shorts", icon: "play", color: "#FF0000" },
] as const

export type Platform = typeof PLATFORMS[number]["id"]

export const CONTENT_FORMATS = [
  { id: "hook-demo", name: "Hook Demo", description: "Problem → Solution in 15s" },
  { id: "slideshow", name: "Slideshow", description: "Carousel-style educational content" },
  { id: "trending-adapt", name: "Trending Adaptation", description: "Adapt viral content to your niche" },
  { id: "storytelling", name: "Storytelling", description: "Personal journey narrative" },
  { id: "before-after", name: "Before/After", description: "Transformation showcase" },
] as const

export type ContentFormat = typeof CONTENT_FORMATS[number]["id"]

export const BRANDS = [
  { id: "saga-os", name: "SAGA OS", description: "AI-powered life operating system", color: "#8B5CF6" },
  { id: "aiarsenal", name: "AIArsenal", description: "AI tools directory & reviews", color: "#3B82F6" },
  { id: "laundryapp", name: "LaundryApp", description: "On-demand laundry service", color: "#10B981" },
  { id: "custom", name: "Custom Brand", description: "Add your own brand", color: "#6B7280" },
] as const

export type BrandId = typeof BRANDS[number]["id"]

export interface ContentItem {
  id: string
  title: string
  script: string
  caption: string
  hashtags: string[]
  format: ContentFormat
  platform: Platform
  mediaUrl?: string
  mediaType?: "image" | "video"
  referenceContent?: {
    url: string
    title: string
    platform: string
    views: number
    engagementRate: number
  }
  metadata: {
    generationPrompt: string
    modelUsed: string
    duration?: number
    aspectRatio: string
  }
  brandId: BrandId
  status?: "generating" | "pending_review" | "approved" | "rejected" | "scheduled" | "published" | "failed"
  createdAt?: number
  updatedAt?: number
}