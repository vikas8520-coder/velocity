import { NextRequest, NextResponse } from "next/server"
import { collectVisuals } from "@/lib/brand-ingest"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 })
  try {
    const visuals = await collectVisuals(url)
    return NextResponse.json(visuals)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "visuals failed", images: [] },
      { status: 500 }
    )
  }
}
