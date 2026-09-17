import { NextRequest, NextResponse } from "next/server"
import { generateMultipleContents } from "@/lib/ai-generation"

const platformSpecs: Record<string, { maxDuration: number; aspectRatio: string }> = {
  tiktok: { maxDuration: 60, aspectRatio: "9:16" },
  instagram: { maxDuration: 90, aspectRatio: "9:16" },
  youtube: { maxDuration: 60, aspectRatio: "9:16" },
}

export async function POST(request: NextRequest) {
  try {
    // Demo mode - skip auth
    // const { userId } = await auth()
    // if (!userId) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const body = await request.json()
    const { brandId, format, platform, referenceContentId, count = 5, customPrompt } = body

    if (!brandId || !format || !platform) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get user's brand info - in production, fetch from Convex
    const brand = {
      id: brandId,
      name: brandId === "saga-os" ? "SAGA OS" : brandId === "aiarsenal" ? "AIArsenal" : "LaundryApp",
      description: brandId === "saga-os" 
        ? "AI-powered life operating system for productivity and automation"
        : brandId === "aiarsenal"
        ? "Curated directory of the best AI tools with honest reviews"
        : "On-demand laundry and dry cleaning service with app booking",
      niches: brandId === "saga-os" 
        ? ["productivity", "AI", "automation", "life hacking"]
        : brandId === "aiarsenal"
        ? ["AI tools", "software reviews", "tech tutorials"]
        : ["laundry", "convenience", "service apps"],
      targetAudience: brandId === "saga-os"
        ? "Tech-savvy professionals wanting to automate their life"
        : brandId === "aiarsenal"
        ? "Developers and businesses looking for AI tools"
        : "Busy urban professionals and families",
      tone: brandId === "saga-os"
        ? "Expert, practical, slightly geeky but accessible"
        : brandId === "aiarsenal"
        ? "Objective, thorough, developer-friendly"
        : "Friendly, reliable, time-saving",
    }

    const contents = await generateMultipleContents(
      {
        brand,
        format,
        platform,
        customPrompt,
      },
      count
    )

    const savedContents = contents.map(content => ({
      id: `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      ...content,
      brandId,
      format,
      platform,
      status: "pending_review",
      hashtags: content.hashtags,
      metadata: {
        generationPrompt: content.generationPrompt,
        modelUsed: platform === "tiktok" ? "claude-3-5-sonnet" : "gpt-4o",
        duration: platformSpecs[platform].maxDuration,
        aspectRatio: platformSpecs[platform].aspectRatio,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }))

    return NextResponse.json({ contents: savedContents })
  } catch (error) {
    console.error("Generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    )
  }
}