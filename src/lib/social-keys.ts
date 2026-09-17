import { readFileSync, writeFileSync, existsSync } from "node:fs"
import path from "node:path"

export const SOCIAL_KEY_FIELDS = [
  "YOUTUBE_API_KEY",
  "META_APP_ID",
  "META_APP_SECRET",
  "INSTAGRAM_ACCESS_TOKEN",
  "FACEBOOK_PAGE_ACCESS_TOKEN",
  "TIKTOK_CLIENT_KEY",
  "TIKTOK_CLIENT_SECRET",
  "LINKEDIN_CLIENT_ID",
  "LINKEDIN_CLIENT_SECRET",
  "X_BEARER_TOKEN",
  "X_API_KEY",
  "X_API_SECRET",
  "PINTEREST_ACCESS_TOKEN",
  "REDDIT_CLIENT_ID",
  "REDDIT_CLIENT_SECRET",
] as const

export type SocialKeyName = (typeof SOCIAL_KEY_FIELDS)[number]

const FILE = path.join(process.cwd(), ".social-keys.json")

function filled(value?: string) {
  if (!value) return false
  const v = value.trim()
  if (!v || /placeholder|changeme|your[-_]?key|^xxx$/i.test(v)) return false
  return v.length >= 8
}

function readFileKeys(): Partial<Record<SocialKeyName, string>> {
  try {
    if (!existsSync(FILE)) return {}
    const parsed = JSON.parse(readFileSync(FILE, "utf8")) as Record<string, string>
    const out: Partial<Record<SocialKeyName, string>> = {}
    for (const name of SOCIAL_KEY_FIELDS) {
      if (typeof parsed[name] === "string") out[name] = parsed[name]
    }
    return out
  } catch {
    return {}
  }
}

export function socialKey(name: SocialKeyName) {
  const fromFile = readFileKeys()[name]
  const fromEnv = process.env[name]
  const v = (fromFile || fromEnv || "").trim()
  return filled(v) ? v : ""
}

export function socialKeyStatus() {
  return Object.fromEntries(
    SOCIAL_KEY_FIELDS.map((name) => {
      const value = socialKey(name)
      return [
        name,
        {
          configured: Boolean(value),
          hint: value ? `••••${value.slice(-4)}` : "",
        },
      ]
    })
  ) as Record<SocialKeyName, { configured: boolean; hint: string }>
}

export function saveSocialKeys(patch: Partial<Record<SocialKeyName, string>>) {
  const current = readFileKeys()
  for (const name of SOCIAL_KEY_FIELDS) {
    if (patch[name] === undefined) continue
    const next = patch[name]!.trim()
    if (!next) {
      delete current[name]
      continue
    }
    current[name] = next
  }
  writeFileSync(FILE, JSON.stringify(current, null, 2), "utf8")
  return socialKeyStatus()
}

export function metaOembedToken() {
  const app = socialKey("META_APP_ID")
  const secret = socialKey("META_APP_SECRET")
  if (app && secret) return `${app}|${secret}`
  return socialKey("INSTAGRAM_ACCESS_TOKEN") || socialKey("FACEBOOK_PAGE_ACCESS_TOKEN")
}
