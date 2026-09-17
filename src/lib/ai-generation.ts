import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { z } from "zod"
import {
  CONTENT_FORMATS,
  canonicalFormat,
  screenshotUrl,
  type BrandProfile,
  type ContentFormat,
  type ContentItem,
  type ContentSlide,
  type Platform,
  newId,
} from "@/lib/utils"

function brandVisual(brand: BrandProfile, index = 0) {
  const shots = [...(brand.media || []), brand.logoUrl].filter((u): u is string => Boolean(u))
  if (!shots.length) return screenshotUrl(brand.websiteUrl)
  return shots[index % shots.length]
}
import { pickReference } from "@/lib/formats"
import { isAnthropicConfigured, isOpenAIConfigured } from "@/lib/config"

const ContentSchema = z.object({
  title: z.string(),
  script: z.string(),
  caption: z.string(),
  hashtags: z.array(z.string()).min(4).max(12),
  slides: z.array(z.object({ headline: z.string(), body: z.string() })).min(3).max(6),
  visualPrompt: z.string(),
})

const formatCopy: Record<(typeof CONTENT_FORMATS)[number]["id"], string> = {
  slideshow: "TikTok slideshow: 5 punchy slides. One idea per slide. Big type. Delay the product name until the last slide.",
  "wall-of-text": "Wall of text: talking-head rant for 12s, huge captions, mention the product only in the last line.",
  "video-hook": "Hook + demo: 0-3s shocked reaction, 3-8s pain, 8-20s screen recording of the product, 20-30s CTA.",
  "green-screen": "Green-screen meme: reaction face over a headline roasting the old way of working, punchline is this product.",
}

function slidesFrom(title: string, brand: BrandProfile, format: ContentFormat): ContentSlide[] {
  const niche = brand.niches[0] || "this"
  const id = canonicalFormat(format)
  if (id === "slideshow") {
    return [
      { headline: `Nobody talks about this in ${niche}`, body: "" },
      { headline: "1. The mess", body: "Too many chats. Zero system." },
      { headline: "2. The fix", body: brand.tagline.slice(0, 42) },
      { headline: "3. The proof", body: `${brand.name} in 20 seconds` },
      { headline: "Steal this", body: brand.websiteUrl.replace(/^https?:\/\//, "").slice(0, 28) },
    ]
  }
  if (id === "wall-of-text") {
    return [
      { headline: `Unpopular opinion about ${niche}`, body: "Read this." },
      { headline: "Everyone is still doing it the hard way", body: "And pretending that is a process." },
      { headline: brand.name, body: brand.tagline.slice(0, 48) },
    ]
  }
  if (id === "green-screen") {
    return [
      { headline: "Me watching people still do this manually", body: "" },
      { headline: brand.name, body: "The plot twist." },
    ]
  }
  return [
    { headline: title.split(" — ")[0].slice(0, 42), body: "Wait for it." },
    { headline: `Most ${niche} ops stall here`, body: "Too many chats. Zero system." },
    { headline: `Then ${brand.name} showed up`, body: brand.tagline.slice(0, 48) },
    { headline: "Try it today", body: brand.websiteUrl.replace(/^https?:\/\//, "").slice(0, 28) },
  ]
}

function mockPackage(
  brand: BrandProfile,
  format: ContentFormat,
  platform: Platform,
  variation: number
): Omit<ContentItem, "id" | "brandId" | "status" | "createdAt" | "updatedAt"> {
  const kind = canonicalFormat(format)
  const titles: Record<(typeof CONTENT_FORMATS)[number]["id"], string[]> = {
    slideshow: [`3 things ${brand.name} quietly fixed`, `Wait for slide 5`, `Nobody talks about this in ${brand.niches[0] || "this niche"}`],
    "wall-of-text": [`Unpopular ${brand.niches[0] || "ops"} opinion`, `Stop running this from WhatsApp`, `The rant your ICP already feels`],
    "video-hook": [`${brand.name} in 20 seconds`, `This reaction then the demo`, `I replaced 4 tools with ${brand.name}`],
    "green-screen": [`Me watching people still do this`, `Confused? Same.`, `The plot twist is ${brand.name}`],
  }
  const title = titles[kind][variation % titles[kind].length]
  const script =
    kind === "slideshow"
      ? `SLIDESHOW
1. Confession hook
2–4. List
5. CTA: ${brand.websiteUrl}`
      : kind === "wall-of-text"
        ? `[0-12s] RANT the pain for ${brand.targetAudience.split(",")[0]}
[12-18s] Only now name ${brand.name}
[18-25s] CTA ${brand.websiteUrl}`
        : kind === "green-screen"
          ? `[0-4s] Green-screen reaction over the old way
[4-12s] Punchline: ${brand.tagline}
[12-20s] CTA ${brand.websiteUrl}`
          : `[0-3s] HOOK / shocked face: "${title}"
[3-8s] PAIN
[8-18s] DEMO ${brand.name}
[18-25s] CTA ${brand.websiteUrl}`
  const handle = brand.name.toLowerCase().replace(/[^a-z0-9]+/g, "")
  return {
    title,
    script,
    caption: `${title}

${brand.tagline}

${brand.description}

Try it: ${brand.websiteUrl}`,
    hashtags: [handle, ...brand.niches.map((n) => n.replace(/\s+/g, "")), platform, "buildinpublic", "shortform"].slice(0, 10),
    slides: slidesFrom(title, brand, format),
    format: kind,
    platform,
    mediaUrl: brandVisual(brand, variation),
    posterUrl: brandVisual(brand, variation),
    mediaType: "image" as const,
    visualPrompt: `Vertical 9:16 ${kind} for ${brand.name}, ${brand.niches.join(", ")}, ${brand.tone}. ${formatCopy[kind]} Product: ${brand.description}. Photoreal iPhone footage. No other-brand logos.`,
    referenceContent: {
      title: pickReference(kind, variation).title,
      angle: pickReference(kind, variation).hook,
      platform,
    },
    metadata: {
      generationPrompt: `Mock ${kind} for ${brand.name} on ${platform} v${variation + 1}`,
      modelUsed: "velocity-mock",
      duration: 30,
      aspectRatio: "9:16",
    },
  }
}

async function llmPackage(
  brand: BrandProfile,
  format: ContentFormat,
  platform: Platform,
  angle?: string
) {
  const model = platform === "tiktok" && isAnthropicConfigured()
    ? anthropic("claude-3-5-sonnet-20241022")
    : isOpenAIConfigured()
      ? openai("gpt-4o-mini")
      : anthropic("claude-3-5-sonnet-20241022")

  const { object } = await generateObject({
    model,
    schema: ContentSchema,
    temperature: 0.85,
    prompt: `You write native short-form content.

BRAND
Name: ${brand.name}
Site: ${brand.websiteUrl}
What it is: ${brand.description}
Tagline: ${brand.tagline}
Niches: ${brand.niches.join(", ")}
Audience: ${brand.targetAudience}
Tone: ${brand.tone}

FORMAT: ${canonicalFormat(format)} — ${formatCopy[canonicalFormat(format)]}
PLATFORM: ${platform}
${angle ? `TRENDING ANGLE TO REMIX: ${angle}` : ""}

Return a 15-30s package. Slides are on-screen text (big, few words). visualPrompt is for a 9:16 video/image model.`,
  })
  return object
}

export async function generateBatch(input: {
  brand: BrandProfile
  count?: number
  format?: ContentFormat
  formats?: ContentFormat[]
  platform?: Platform
  angle?: string
}): Promise<ContentItem[]> {
  const count = Math.min(Math.max(input.count ?? 4, 1), 8)
  const now = Date.now()
  const formats = input.formats?.length
    ? input.formats
    : input.format
      ? Array.from({ length: count }, () => input.format as ContentFormat)
      : CONTENT_FORMATS.map((f) => f.id)
  const platforms: Platform[] = input.platform
    ? [input.platform]
    : ["tiktok", "instagram", "youtube"]
  const useLlm = isOpenAIConfigured() || isAnthropicConfigured()
  const items: ContentItem[] = []

  for (let i = 0; i < count; i++) {
    const format = formats[i % formats.length]
    const platform = platforms[i % platforms.length]
    try {
      const pack = useLlm
        ? await llmPackage(input.brand, format, platform, input.angle)
        : mockPackage(input.brand, format, platform, i)
      const slides = pack.slides?.length ? pack.slides : slidesFrom(pack.title, input.brand, format)
      items.push({
        id: newId("cnt"),
        brandId: input.brand.id,
        title: pack.title,
        script: pack.script,
        caption: pack.caption,
        hashtags: pack.hashtags,
        slides,
        format: canonicalFormat(format),
        platform,
        mediaUrl: brandVisual(input.brand, i),
        posterUrl: brandVisual(input.brand, i),
        mediaType: "image",
        visualPrompt:
          "visualPrompt" in pack && pack.visualPrompt
            ? pack.visualPrompt
            : mockPackage(input.brand, format, platform, i).visualPrompt,
        metadata: {
          generationPrompt: input.angle || `${format} ${platform}`,
          modelUsed: useLlm ? "llm" : "velocity-mock",
          duration: 30,
          aspectRatio: "9:16",
        },
        status: "pending_review",
        createdAt: now - i,
        updatedAt: now,
      })
    } catch (error) {
      console.error("generate item failed", error)
      const pack = mockPackage(input.brand, format, platform, i)
      items.push({
        id: newId("cnt"),
        brandId: input.brand.id,
        ...pack,
        status: "pending_review",
        createdAt: now - i,
        updatedAt: now,
      })
    }
  }
  return items
}

export const TRENDING_ANGLES = [
  { id: "nobody", title: "Nobody talks about this", angle: "Confession hook: 'Nobody talks about X in this niche'" },
  { id: "stack", title: "I replaced my stack", angle: "List of 3 tools replaced by this product" },
  { id: "shock", title: "Shocked face then demo", angle: "3s reaction, then screen recording of the product" },
  { id: "rant", title: "Unpopular opinion", angle: "Wall-of-text rant, product named last" },
  { id: "meme", title: "Green-screen meme", angle: "Reaction face over a headline roasting the old way" },
]
