import { NextRequest, NextResponse } from "next/server"
import { generateClip, generatePoster } from "@/lib/fal"
import { PalmierError, generatePalmierClip } from "@/lib/palmier"
import { generatePollinationsClip, generatePollinationsPoster, isPollinationsConfigured } from "@/lib/pollinations"
import { isFalConfigured } from "@/lib/config"

export const maxDuration = 300

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const prompt = String(body.prompt || "")
    const wantVideo = Boolean(body.wantVideo)
    const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl : undefined
    if (!prompt) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 })
    }

    if (wantVideo) {
      if (isPollinationsConfigured()) {
        try {
          const clip = await generatePollinationsClip(prompt)
          if (clip) {
            return NextResponse.json({ mediaUrl: clip, mediaType: "video", provider: "pollinations" })
          }
        } catch (error) {
          console.error("pollinations video", error)
        }
      }
      try {
        const mediaUrl = await generatePalmierClip(prompt, imageUrl)
        if (mediaUrl) {
          return NextResponse.json({
            mediaUrl,
            mediaType: "video",
            provider: "palmier",
          })
        }
      } catch (error) {
        const code = error instanceof PalmierError ? error.code : "failed"
        const message = error instanceof Error ? error.message : "Palmier generation failed"
        console.error("palmier media", error)
        if (code === "auth" || code === "offline" || !isFalConfigured()) {
          return NextResponse.json(
            { mediaUrl: null, mediaType: null, provider: "palmier", error: message, code },
            { status: code === "auth" ? 401 : 503 }
          )
        }
      }

      if (isFalConfigured()) {
        const videoUrl = await generateClip(prompt)
        if (videoUrl) {
          return NextResponse.json({ mediaUrl: videoUrl, mediaType: "video", provider: "fal" })
        }
      }
    }

    if (isPollinationsConfigured()) {
      try {
        const poster = await generatePollinationsPoster(prompt)
        if (poster) {
          return NextResponse.json({ mediaUrl: poster, mediaType: "image", posterUrl: poster, provider: "pollinations" })
        }
      } catch (error) {
        console.error("pollinations poster", error)
      }
    }
    const posterUrl = await generatePoster(prompt)
    if (!posterUrl) {
      return NextResponse.json({ mediaUrl: null, mediaType: null })
    }
    return NextResponse.json({ mediaUrl: posterUrl, mediaType: "image", posterUrl, provider: "fal" })
  } catch (error) {
    console.error("media", error)
    return NextResponse.json({ mediaUrl: null, mediaType: null })
  }
}
