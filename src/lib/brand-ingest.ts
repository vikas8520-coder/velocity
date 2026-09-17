import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { z } from "zod"
import { isAnthropicConfigured, isOpenAIConfigured } from "@/lib/config"
import type { BrandProfile } from "@/lib/utils"
import { fetchSocialProfile, parseSocialUrl } from "@/lib/social"

const ProfileSchema = z.object({
  name: z.string(),
  description: z.string(),
  tagline: z.string(),
  niches: z.array(z.string()).min(1).max(6),
  targetAudience: z.string(),
  tone: z.string(),
  color: z.string().describe("Hex color like #be185d"),
})

function decode(html: string) {
  return html
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .trim()
}

function meta(html: string, key: string) {
  const a = html.match(
    new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]*content=["']([^"']+)["']`, "i")
  )
  const b = html.match(
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["']${key}["']`, "i")
  )
  return decode((a?.[1] || b?.[1] || "").slice(0, 400))
}

function tag(html: string, name: string) {
  const m = html.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"))
  return decode((m?.[1] || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 200))
}

function hostnameName(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "")
    const stem = host.split(".")[0] || "Brand"
    return stem.charAt(0).toUpperCase() + stem.slice(1)
  } catch {
    return "Brand"
  }
}

function instagramUser(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "")
    if (!host.includes("instagram.com")) return null
    const parts = new URL(url).pathname.split("/").filter(Boolean)
    const skip = new Set(["p", "reel", "reels", "stories", "tv", "explore", "accounts"])
    const user = parts.find((p) => !skip.has(p.toLowerCase()))
    if (!user || user.length < 2) return null
    return user.replace(/^@/, "")
  } catch {
    return null
  }
}

function colorFromName(name: string) {
  const palette = ["#be185d", "#9f1239", "#b45309", "#1d4ed8", "#0f766e", "#7c3aed", "#18181b"]
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return palette[hash % palette.length]
}

function normalizeUrl(input: string) {
  const trimmed = input.trim()
  if (!trimmed) throw new Error("Website URL is required")
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

async function fetchText(url: string) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "VelocityBot/1.0 (brand ingest)",
      Accept: "text/html,text/plain,application/xhtml+xml",
    },
    redirect: "follow",
  })
  if (!res.ok) throw new Error(`Fetch failed ${res.status}`)
  return await res.text()
}

function absUrl(pageUrl: string, src: string) {
  try {
    return new URL(src, pageUrl).toString()
  } catch {
    return ""
  }
}

function collectImages(pageUrl: string, html: string) {
  const found: string[] = []
  const push = (src?: string) => {
    if (!src) return
    const full = absUrl(pageUrl, src.split(" ")[0].replace(/["']/g, ""))
    if (!full.startsWith("http")) return
    if (/\.svg(\?|$)/i.test(full)) return
    if (found.includes(full)) return
    found.push(full)
  }
  push(meta(html, "og:image"))
  push(meta(html, "twitter:image"))
  for (const m of html.matchAll(/<img[^>]+(?:src|data-src)=["']([^"']+)["']/gi)) {
    if (found.length >= 8) break
    push(m[1])
  }
  return found
}

export function pageScreenshot(url: string) {
  return `https://image.thum.io/get/width/720/crop/1280/noanimate/${url}`
}

async function scrapeSite(url: string) {
  try {
    const html = await fetchText(url)
    return {
      title: tag(html, "title") || meta(html, "og:title"),
      description: meta(html, "description") || meta(html, "og:description"),
      siteName: meta(html, "og:site_name"),
      image: meta(html, "og:image"),
      images: collectImages(url, html),
      headings: [...html.matchAll(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/gi)]
        .slice(0, 8)
        .map((m) => decode(m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")))
        .filter(Boolean),
      source: "html" as const,
    }
  } catch {
    const md = await fetchText(`https://r.jina.ai/${url}`)
    const lines = md.split("\n").map((l) => l.trim()).filter(Boolean)
    const images = [...md.matchAll(/https?:\/\/\S+\.(?:png|jpe?g|webp)/gi)].map((m) => m[0]).slice(0, 6)
    return {
      title: lines.find((l) => l.startsWith("Title:"))?.replace(/^Title:\s*/, "") || "",
      description: lines.slice(0, 12).join(" ").slice(0, 400),
      siteName: "",
      image: images[0] || "",
      images,
      headings: lines.filter((l) => l.startsWith("#")).slice(0, 8).map((l) => l.replace(/^#+\s*/, "")),
      source: "jina" as const,
    }
  }
}

function visualSet(websiteUrl: string, scraped: { images: string[]; image: string }) {
  const ig = instagramUser(websiteUrl)
  const extras = ig
    ? [`https://unavatar.io/instagram/${ig}`, `https://unavatar.io/${ig}`]
    : []
  const screenshot = pageScreenshot(websiteUrl)
  return [...new Set([screenshot, ...extras, ...scraped.images, scraped.image].filter(Boolean))].slice(0, 8)
}

export async function collectVisuals(rawUrl: string) {
  const websiteUrl = normalizeUrl(rawUrl)
  const scraped = await scrapeSite(websiteUrl)
  const images = visualSet(websiteUrl, scraped)
  return {
    screenshot: pageScreenshot(websiteUrl),
    images,
  }
}

export async function ingestBrand(rawUrl: string): Promise<BrandProfile> {
  const websiteUrl = normalizeUrl(rawUrl)
  const social = parseSocialUrl(websiteUrl) ? await fetchSocialProfile(websiteUrl) : null
  const scraped = social
    ? {
        title: social.name,
        description: social.description,
        siteName: social.name,
        image: social.image || "",
        images: social.images,
        headings: [social.name, social.handle && `@${social.handle}`].filter(Boolean) as string[],
        source: "social" as const,
      }
    : await scrapeSite(websiteUrl)
  const fallbackName = scraped.siteName || scraped.title.split("|")[0].split("–")[0].trim() || hostnameName(websiteUrl)

  let profile: z.infer<typeof ProfileSchema> | null = null
  if (isOpenAIConfigured() || isAnthropicConfigured()) {
    const model = isOpenAIConfigured()
      ? openai("gpt-4o-mini")
      : anthropic("claude-3-5-sonnet-20241022")
    try {
      const { object } = await generateObject({
        model,
        schema: ProfileSchema,
        prompt: `Extract a short-form marketing brand profile from this website.

URL: ${websiteUrl}
Title: ${scraped.title}
Description: ${scraped.description}
Headings: ${scraped.headings.join(" | ")}

Return a concise profile a TikTok/Reels generator can use.`,
      })
      profile = object
    } catch (error) {
      console.error("Brand LLM extract failed", error)
    }
  }

  const socialHandle = social?.handle || instagramUser(websiteUrl)
  const name =
    profile?.name ||
    social?.name ||
    (socialHandle ? socialHandle.replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : fallbackName)
  const media = visualSet(websiteUrl, scraped)
  const network = social?.network
  return {
    id: `brand_${crypto.randomUUID()}`,
    name,
    websiteUrl,
    description:
      profile?.description ||
      scraped.description ||
      (socialHandle
        ? `${network || "Social"} @${socialHandle}. Short-form content from this profile.`
        : `${name} helps customers get results faster.`),
    tagline: profile?.tagline || scraped.headings[0] || (socialHandle ? `@${socialHandle}` : `Grow with ${name}`),
    color: profile?.color?.startsWith("#") ? profile.color : colorFromName(name),
    niches: profile?.niches?.length
      ? profile.niches
      : network
        ? ["creator", network, "social"]
        : guessNiches(`${scraped.title} ${scraped.description}`),
    targetAudience:
      profile?.targetAudience ||
      (socialHandle ? `Followers of @${socialHandle}` : "Founders, indie hackers, and small teams who need distribution"),
    tone: profile?.tone || "Direct, confident, native to short-form video",
    logoUrl: media.find((u) => u.includes("unavatar")) || scraped.image || undefined,
    media,
    createdAt: Date.now(),
  }
}

function guessNiches(text: string) {
  const hay = text.toLowerCase()
  const catalog: Array<[string, string[]]> = [
    ["AI", ["ai", "gpt", "llm", "machine learning"]],
    ["SaaS", ["saas", "software", "platform", "dashboard"]],
    ["productivity", ["productiv", "workflow", "automat"]],
    ["e-commerce", ["shop", "store", "commerce", "product"]],
    ["fitness", ["fit", "gym", "health", "wellness"]],
    ["finance", ["pay", "bank", "money", "invoice"]],
    ["marketing", ["market", "growth", "content", "seo"]],
  ]
  const hits = catalog.filter(([, keys]) => keys.some((k) => hay.includes(k))).map(([n]) => n)
  return hits.length ? hits.slice(0, 4) : ["consumer apps", "growth"]
}
