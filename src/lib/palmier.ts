import { copyFile, mkdir, readdir } from "node:fs/promises"
import path from "node:path"

const MCP_URL = process.env.PALMIER_MCP_URL || "http://127.0.0.1:19789/mcp"
const PROJECT_NAME = process.env.PALMIER_PROJECT_NAME || "Velocity Shorts"
const DEFAULT_MODEL = process.env.PALMIER_VIDEO_MODEL || "seedance-2-fast"

export class PalmierError extends Error {
  code: "offline" | "auth" | "failed"
  constructor(code: PalmierError["code"], message: string) {
    super(message)
    this.code = code
  }
}

type Json = Record<string, unknown>

class PalmierMcp {
  private sessionId: string | null = null
  private nextId = 1

  async initialize() {
    const payload = {
      jsonrpc: "2.0",
      id: this.nextId++,
      method: "initialize",
      params: {
        protocolVersion: "2025-03-26",
        capabilities: {},
        clientInfo: { name: "velocity", version: "0.1.0" },
      },
    }
    const { headers, body } = await this.post(payload)
    this.sessionId = headers.get("mcp-session-id") || headers.get("MCP-Session-Id")
    if (!this.sessionId) throw new PalmierError("offline", "Palmier MCP did not return a session")
    await this.post({ jsonrpc: "2.0", method: "notifications/initialized" }, false)
    return body
  }

  async call(name: string, args: Json = {}) {
    const payload = {
      jsonrpc: "2.0",
      id: this.nextId++,
      method: "tools/call",
      params: { name, arguments: args },
    }
    const { body } = await this.post(payload)
    if (body.error && typeof body.error === "object") {
      const msg = String((body.error as Json).message || "Palmier MCP error")
      throw new PalmierError(classify(msg), msg)
    }
    const result = (body.result || body) as Json
    if (result.isError) {
      const text = toolText(result)
      throw new PalmierError(classify(text), text || `${name} failed`)
    }
    if (result.structuredContent && typeof result.structuredContent === "object") {
      return result.structuredContent as Json
    }
    const text = toolText(result)
    if (text) {
      try {
        return JSON.parse(text) as Json
      } catch {
        return { text }
      }
    }
    return result
  }

  private async post(payload: Json, expectResult = true) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    }
    if (this.sessionId) headers["MCP-Session-Id"] = this.sessionId
    const res = await fetch(MCP_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    })
    if (!res.ok && res.status !== 200) {
      throw new PalmierError("offline", `Palmier MCP HTTP ${res.status}`)
    }
    const raw = await res.text()
    const body = expectResult ? parseMcpBody(raw) : {}
    return { headers: res.headers, body }
  }
}

function parseMcpBody(raw: string): Json {
  const trimmed = raw.trim()
  if (trimmed.startsWith("{")) return JSON.parse(trimmed) as Json
  const datas: string[] = []
  for (const line of raw.split("\n")) {
    if (line.startsWith("data:")) datas.push(line.slice(5).trim())
  }
  for (let i = datas.length - 1; i >= 0; i--) {
    if (!datas[i] || datas[i] === "[DONE]") continue
    try {
      return JSON.parse(datas[i]) as Json
    } catch {
      continue
    }
  }
  throw new PalmierError("failed", "Could not parse Palmier MCP response")
}

function toolText(result: Json) {
  const content = result.content
  if (!Array.isArray(content)) return typeof result.text === "string" ? result.text : ""
  return content
    .map((part) => (part && typeof part === "object" && "text" in part ? String((part as Json).text || "") : ""))
    .join("\n")
    .trim()
}

function classify(text: string): PalmierError["code"] {
  const t = text.toLowerCase()
  if (t.includes("sign in") || t.includes("signing in") || t.includes("not signed")) return "auth"
  if (t.includes("econnrefused") || t.includes("offline") || t.includes("fetch failed")) return "offline"
  return "failed"
}

async function withClient<T>(fn: (client: PalmierMcp) => Promise<T>) {
  const client = new PalmierMcp()
  try {
    await client.initialize()
  } catch (error) {
    if (error instanceof PalmierError) throw error
    throw new PalmierError("offline", "Palmier Pro is not reachable. Keep the app open on this Mac.")
  }
  return fn(client)
}

async function ensureProject(client: PalmierMcp) {
  const listed = await client.call("manage_project", { action: "list" })
  const projects = Array.isArray(listed.projects) ? (listed.projects as Json[]) : []
  const existing = projects.find((p) => String(p.name || "") === PROJECT_NAME)
  if (existing) {
    return client.call("manage_project", {
      action: "open",
      name: PROJECT_NAME,
    })
  }
  return client.call("manage_project", {
    action: "create",
    name: PROJECT_NAME,
    aspectRatio: "9:16",
    fps: 30,
    quality: "1080p",
  })
}

function assetStatus(asset: Json | undefined) {
  return String(asset?.generationStatus || "")
}

async function waitForAsset(client: PalmierMcp, id: string, timeoutMs = 180_000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const media = await client.call("get_media", { ids: [id] })
    const assets = Array.isArray(media.assets)
      ? (media.assets as Json[])
      : Array.isArray(media)
        ? (media as unknown as Json[])
        : []
    const asset = assets.find((a) => String(a.id || a.mediaRef || "") === id) || assets[0]
    const status = assetStatus(asset)
    if (asset && (!status || status === "ready")) return asset
    if (status === "failed") {
      throw new PalmierError("failed", String(asset?.error || asset?.reason || "Palmier generation failed"))
    }
    await new Promise((r) => setTimeout(r, 2500))
  }
  throw new PalmierError("failed", "Palmier generation timed out")
}

async function importStartFrame(client: PalmierMcp, imageUrl: string) {
  if (!/^https:\/\//i.test(imageUrl)) return null
  const imported = await client.call("import_media", {
    name: "velocity-frame",
    folder: "Velocity",
    source: { url: imageUrl },
  })
  const mediaRef = String(imported.mediaRef || imported.id || "")
  if (!mediaRef) return null
  if (imported.status === "ready") return mediaRef
  const ready = await waitForAsset(client, mediaRef, 60_000)
  return String(ready.id || mediaRef)
}

async function copyReadyFile(projectPath: string, mediaRef: string) {
  const mediaDir = path.join(projectPath, "media")
  const outDir = path.join(process.cwd(), "public", "generated")
  await mkdir(outDir, { recursive: true })
  let files: string[] = []
  try {
    files = await readdir(mediaDir)
  } catch {
    files = []
  }
  const match = files.find((f) => f.includes(mediaRef)) || files.sort().at(-1)
  if (!match) return null
  const destName = `${mediaRef.slice(0, 8)}-${match}`
  const dest = path.join(outDir, destName)
  await copyFile(path.join(mediaDir, match), dest)
  return `/generated/${destName}`
}

export async function isPalmierReachable() {
  try {
    const res = await fetch(MCP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2025-03-26",
          capabilities: {},
          clientInfo: { name: "velocity-health", version: "0.1.0" },
        },
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function palmierStatus() {
  const reachable = await isPalmierReachable()
  if (!reachable) {
    return { reachable: false, signedIn: false, canGenerate: false, project: null as string | null }
  }
  try {
    return await withClient(async (client) => {
      const project = await ensureProject(client)
      return {
        reachable: true,
        signedIn: project.canGenerate !== false,
        canGenerate: Boolean(project.canGenerate),
        project: String(project.name || PROJECT_NAME),
      }
    })
  } catch (error) {
    if (error instanceof PalmierError && error.code === "auth") {
      return { reachable: true, signedIn: false, canGenerate: false, project: PROJECT_NAME }
    }
    return { reachable: true, signedIn: false, canGenerate: false, project: PROJECT_NAME }
  }
}

export async function generatePalmierClip(prompt: string, imageUrl?: string) {
  return withClient(async (client) => {
    const project = await ensureProject(client)
    if (project.canGenerate === false) {
      throw new PalmierError(
        "auth",
        "Sign in to Palmier Pro (Settings → Account) to generate video. Keep the app open on this Mac."
      )
    }
    const startFrame = imageUrl ? await importStartFrame(client, imageUrl) : null
    const started = await client.call("generate_video", {
      prompt,
      model: DEFAULT_MODEL,
      aspectRatio: "9:16",
      duration: 5,
      resolution: "720p",
      name: prompt.slice(0, 40),
      folder: "Velocity",
      ...(startFrame ? { startFrameMediaRef: startFrame } : {}),
    })
    const mediaRef = String(started.mediaRef || started.id || "")
    if (!mediaRef) throw new PalmierError("failed", "Palmier did not return a media id")
    const ready = await waitForAsset(client, mediaRef)
    const projectPath = String(project.path || "")
    const copied = projectPath ? await copyReadyFile(projectPath, String(ready.id || mediaRef)) : null
    if (copied) return copied

    const outDir = path.join(process.cwd(), "public", "generated")
    await mkdir(outDir, { recursive: true })
    const dest = path.join(outDir, `${mediaRef}.mp4`)
    await client.call("create_timeline", { name: `Export ${mediaRef.slice(0, 6)}` })
    await client.call("add_clips", { entries: [{ mediaRef, startFrame: 0 }] })
    const exported = await client.call("export_project", {
      mode: "video",
      codec: "H.264",
      resolution: "720p",
      outputPath: dest,
      overwrite: true,
    })
    const jobId = String(exported.jobId || "")
    const start = Date.now()
    while (Date.now() - start < 120_000) {
      const jobs = await client.call("manage_exports", { action: "list" })
      const list = Array.isArray(jobs.exports) ? (jobs.exports as Json[]) : Array.isArray(jobs.items) ? (jobs.items as Json[]) : []
      const job = list.find((j) => String(j.jobId || j.id || "") === jobId) || list[0]
      const status = String(job?.status || "").toLowerCase()
      if (status.includes("complete") || status.includes("done") || status === "finished") {
        return `/generated/${path.basename(dest)}`
      }
      if (status.includes("fail") || status.includes("error") || status.includes("cancel")) {
        throw new PalmierError("failed", "Palmier export failed")
      }
      await new Promise((r) => setTimeout(r, 2000))
    }
    return `/generated/${path.basename(dest)}`
  })
}
