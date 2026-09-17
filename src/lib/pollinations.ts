import { writeFile, mkdir } from "node:fs/promises"
import path from "node:path"

function pollinationsKey() {
  return (process.env.POLLINATIONS_API_KEY || process.env.POLLINATIONS_KEY || "").trim()
}

export function isPollinationsConfigured() {
  const key = pollinationsKey()
  return key.startsWith("sk_") || key.startsWith("pk_")
}

export async function generatePollinationsPoster(prompt: string) {
  if (!isPollinationsConfigured()) return null
  const encoded = encodeURIComponent(prompt.slice(0, 400))
  const url = `https://gen.pollinations.ai/image/${encoded}?width=768&height=1344&nologo=true`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${pollinationsKey()}` },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Pollinations ${res.status}: ${text.slice(0, 180)}`)
  }
  const buf = Buffer.from(await res.arrayBuffer())
  const dir = path.join(process.cwd(), "public", "generated")
  await mkdir(dir, { recursive: true })
  const name = `poll-${Date.now()}.jpg`
  await writeFile(path.join(dir, name), buf)
  return `/generated/${name}`
}

export async function generatePollinationsClip(prompt: string) {
  if (!isPollinationsConfigured()) return null
  const encoded = encodeURIComponent(prompt.slice(0, 400))
  const url = `https://gen.pollinations.ai/video/${encoded}?duration=5&aspectRatio=9:16`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${pollinationsKey()}` },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Pollinations video ${res.status}: ${text.slice(0, 180)}`)
  }
  const type = res.headers.get("content-type") || ""
  if (!type.includes("mp4") && !type.includes("octet-stream")) {
    const text = await res.text()
    throw new Error(`Pollinations video not mp4: ${text.slice(0, 180)}`)
  }
  const buf = Buffer.from(await res.arrayBuffer())
  const dir = path.join(process.cwd(), "public", "generated")
  await mkdir(dir, { recursive: true })
  const name = `poll-${Date.now()}.mp4`
  await writeFile(path.join(dir, name), buf)
  return `/generated/${name}`
}
