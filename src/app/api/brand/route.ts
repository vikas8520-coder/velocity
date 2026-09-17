import { NextRequest, NextResponse } from "next/server"
import { ingestBrand } from "@/lib/brand-ingest"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const url = String(body.url || "")
    if (!url.trim()) {
      return NextResponse.json({ error: "url is required" }, { status: 400 })
    }
    const brand = await ingestBrand(url)
    return NextResponse.json({ brand })
  } catch (error) {
    console.error("brand ingest", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to read website" },
      { status: 500 }
    )
  }
}
