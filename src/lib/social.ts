import { metaOembedToken, socialKey } from "@/lib/social-keys"

export type SocialNetwork =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "linkedin"
  | "x"
  | "facebook"
  | "pinterest"
  | "reddit"

export interface SocialRef {
  network: SocialNetwork
  url: string
  handle: string
}

export interface SocialProfile {
  network: SocialNetwork
  handle: string
  name: string
  description: string
  image?: string
  images: string[]
  url: string
}

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase()
  } catch {
    return ""
  }
}

function pathParts(url: string) {
  try {
    return new URL(url).pathname.split("/").filter(Boolean)
  } catch {
    return []
  }
}

export function parseSocialUrl(raw: string): SocialRef | null {
  let url = raw.trim()
  if (!url) return null
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`
  const host = hostOf(url)
  const parts = pathParts(url)

  if (host.includes("instagram.com")) {
    const skip = new Set(["p", "reel", "reels", "stories", "tv", "explore", "accounts"])
    const handle = parts.find((p) => !skip.has(p.toLowerCase())) || ""
    return { network: "instagram", url, handle: handle.replace(/^@/, "") }
  }
  if (host.includes("tiktok.com")) {
    const at = parts.find((p) => p.startsWith("@"))
    return { network: "tiktok", url, handle: (at || parts[0] || "").replace(/^@/, "") }
  }
  if (host.includes("youtube.com") || host === "youtu.be") {
    let handle = ""
    if (parts[0]?.startsWith("@")) handle = parts[0].slice(1)
    else if (parts[0] === "channel" || parts[0] === "c" || parts[0] === "user") handle = parts[1] || ""
    else if (parts[0] === "shorts" || parts[0] === "watch") handle = ""
    else handle = parts[0] || ""
    return { network: "youtube", url, handle }
  }
  if (host.includes("linkedin.com")) {
    const handle = parts[0] === "in" || parts[0] === "company" ? parts[1] || "" : parts[0] || ""
    return { network: "linkedin", url, handle }
  }
  if (host === "x.com" || host.includes("twitter.com")) {
    const skip = new Set(["i", "intent", "share", "home", "explore", "search"])
    const handle = parts.find((p) => !skip.has(p.toLowerCase())) || ""
    return { network: "x", url, handle: handle.replace(/^@/, "") }
  }
  if (host.includes("facebook.com") || host.includes("fb.com")) {
    return { network: "facebook", url, handle: parts[0] || "" }
  }
  if (host.includes("pinterest.com")) {
    return { network: "pinterest", url, handle: parts[0] || "" }
  }
  if (host.includes("reddit.com")) {
    const handle = parts[0] === "r" || parts[0] === "user" || parts[0] === "u" ? parts[1] || "" : parts[0] || ""
    return { network: "reddit", url, handle }
  }
  return null
}

async function jsonGet(url: string, headers: Record<string, string> = {}) {
  const res = await fetch(url, {
    headers: { Accept: "application/json", ...headers },
    redirect: "follow",
  })
  if (!res.ok) throw new Error(`${res.status}`)
  return (await res.json()) as Record<string, unknown>
}

async function oembed(endpoint: string, target: string) {
  const url = `${endpoint}${endpoint.includes("?") ? "&" : "?"}url=${encodeURIComponent(target)}&format=json`
  return jsonGet(url)
}

export async function fetchSocialProfile(rawUrl: string): Promise<SocialProfile | null> {
  const ref = parseSocialUrl(rawUrl)
  if (!ref) return null
  const images: string[] = []
  let name = ref.handle || ref.network
  let description = ""
  let image: string | undefined

  try {
    if (ref.network === "tiktok") {
      const data = await oembed("https://www.tiktok.com/oembed", ref.url)
      titleFrom(data, (n, d, img) => {
        name = n || name
        description = d
        image = img
      })
    } else if (ref.network === "youtube") {
      try {
        const data = await oembed("https://www.youtube.com/oembed", ref.url)
        titleFrom(data, (n, d, img) => {
          name = n || name
          description = d
          image = img
        })
      } catch {
        /* continue to API */
      }
      const key = socialKey("YOUTUBE_API_KEY")
      if (key && ref.handle) {
        const handle = ref.handle.startsWith("@") ? ref.handle : `@${ref.handle}`
        const api = await jsonGet(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet,brandingSettings&forHandle=${encodeURIComponent(handle.replace(/^@/, ""))}&key=${encodeURIComponent(key)}`
        )
        const item = Array.isArray(api.items) ? (api.items[0] as Record<string, unknown>) : null
        const snippet = (item?.snippet || {}) as Record<string, unknown>
        const thumbs = (snippet.thumbnails || {}) as Record<string, { url?: string }>
        name = String(snippet.title || name)
        description = String(snippet.description || description).slice(0, 400)
        image = thumbs.high?.url || thumbs.medium?.url || thumbs.default?.url || image
        const banner = (item?.brandingSettings as { image?: { bannerExternalUrl?: string } } | undefined)?.image
          ?.bannerExternalUrl
        if (banner) images.push(banner)
      }
    } else if (ref.network === "instagram") {
      const token = metaOembedToken()
      if (token) {
        const data = await jsonGet(
          `https://graph.facebook.com/v21.0/instagram_oembed?url=${encodeURIComponent(ref.url)}&access_token=${encodeURIComponent(token)}`
        )
        titleFrom(data, (n, d, img) => {
          name = n || (ref.handle ? `@${ref.handle}` : name)
          description = d
          image = img
        })
      }
      if (ref.handle) {
        images.push(`https://unavatar.io/instagram/${ref.handle}`)
      }
    } else if (ref.network === "x") {
      const bearer = socialKey("X_BEARER_TOKEN")
      if (bearer && ref.handle) {
        const data = await jsonGet(`https://api.x.com/2/users/by/username/${encodeURIComponent(ref.handle)}?user.fields=description,profile_image_url,name`, {
          Authorization: `Bearer ${bearer}`,
        })
        const user = (data.data || {}) as Record<string, unknown>
        name = String(user.name || name)
        description = String(user.description || "")
        image = String(user.profile_image_url || "").replace("_normal", "_400x400") || undefined
      }
      if (ref.handle) images.push(`https://unavatar.io/twitter/${ref.handle}`)
    } else if (ref.network === "linkedin" && ref.handle) {
      images.push(`https://unavatar.io/${ref.handle}`)
      name = ref.handle.replace(/-/g, " ")
      description = `LinkedIn ${ref.url.includes("/company/") ? "company" : "profile"} ${ref.handle}`
    } else if (ref.network === "facebook") {
      const token = metaOembedToken()
      if (token) {
        try {
          const data = await jsonGet(
            `https://graph.facebook.com/v21.0/oembed_page?url=${encodeURIComponent(ref.url)}&access_token=${encodeURIComponent(token)}`
          )
          titleFrom(data, (n, d, img) => {
            name = n || name
            description = d
            image = img
          })
        } catch {
          /* ignore */
        }
      }
    } else if (ref.network === "reddit" && ref.handle) {
      try {
        const data = await jsonGet(`https://www.reddit.com/r/${ref.handle}/about.json`, {
          "User-Agent": "VelocityBot/1.0",
        })
        const sub = ((data.data || {}) as Record<string, unknown>)
        name = String(sub.display_name_prefixed || name)
        description = String(sub.public_description || "")
        image = String(sub.icon_img || sub.community_icon || "").split("?")[0] || undefined
      } catch {
        name = `r/${ref.handle}`
      }
    }
  } catch (error) {
    console.error("social profile", ref.network, error)
  }

  if (image) images.unshift(image)
  if (ref.handle && !images.some((u) => u.includes("unavatar"))) {
    images.push(`https://unavatar.io/${ref.handle}`)
  }

  return {
    network: ref.network,
    handle: ref.handle,
    name: name || ref.handle || ref.network,
    description: description || `${ref.network} ${ref.handle ? "@" + ref.handle : "profile"}`,
    image: images[0],
    images: [...new Set(images.filter(Boolean))],
    url: ref.url,
  }
}

function titleFrom(
  data: Record<string, unknown>,
  assign: (name: string, description: string, image?: string) => void
) {
  const title = String(data.title || data.author_name || "")
  const author = String(data.author_name || "")
  const thumb = String(data.thumbnail_url || "")
  assign(title || author, author && title && author !== title ? `${author} — ${title}` : title, thumb || undefined)
}

export function socialConfigured() {
  return {
    youtube: Boolean(socialKey("YOUTUBE_API_KEY")),
    instagram: Boolean(metaOembedToken()),
    facebook: Boolean(metaOembedToken()),
    tiktok: Boolean(socialKey("TIKTOK_CLIENT_KEY")),
    linkedin: Boolean(socialKey("LINKEDIN_CLIENT_ID")),
    x: Boolean(socialKey("X_BEARER_TOKEN")),
    pinterest: Boolean(socialKey("PINTEREST_ACCESS_TOKEN")),
    reddit: Boolean(socialKey("REDDIT_CLIENT_ID")),
  }
}
