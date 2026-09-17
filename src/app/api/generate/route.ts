import { NextRequest, NextResponse } from "next/server"
import { generateBatch } from "@/lib/ai-generation"
import type { BrandProfile, ContentFormat, Platform } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const brand = body.brand as BrandProfile | undefined
    if (!brand?.name || !brand?.id) {
      return NextResponse.json({ error: "brand is required" }, { status: 400 })
    }
    const contents = await generateBatch({
      brand,
      count: Number(body.count) || 4,
      format: body.format as ContentFormat | undefined,
      formats: Array.isArray(body.formats) ? (body.formats as ContentFormat[]) : undefined,
      platform: body.platform as Platform | undefined,
      angle: body.angle as string | undefined,
    })
    return NextResponse.json({ contents })
  } catch (error) {
    console.error("generate", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
