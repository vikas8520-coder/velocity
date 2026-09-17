import { NextRequest, NextResponse } from "next/server"
import { newId, type Platform } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contentId, platforms, caption, scheduledAt } = body as {
      contentId?: string
      platforms?: Platform[]
      caption?: string
      scheduledAt?: number
    }
    if (!contentId || !platforms?.length) {
      return NextResponse.json({ error: "contentId and platforms are required" }, { status: 400 })
    }
    const when = scheduledAt && scheduledAt > Date.now() + 15_000 ? scheduledAt : Date.now()
    const status = when <= Date.now() + 15_000 ? "posted" : "pending"
    const posts = platforms.map((platform) => ({
      id: newId("sched"),
      contentId,
      platform,
      caption: caption || "",
      scheduledAt: when,
      status,
      createdAt: Date.now(),
    }))
    return NextResponse.json({ posts, note: status === "posted" ? "Queued locally. Connect TikTok/IG/YT OAuth to publish live." : "Saved to calendar." })
  } catch (error) {
    console.error("schedule", error)
    return NextResponse.json({ error: "Failed to schedule" }, { status: 500 })
  }
}
