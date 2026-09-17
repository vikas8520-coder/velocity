import { NextResponse } from "next/server"
import { TRENDING_ANGLES } from "@/lib/ai-generation"
import { VIRAL_REFERENCES } from "@/lib/formats"

export async function GET() {
  return NextResponse.json({
    angles: TRENDING_ANGLES,
    references: VIRAL_REFERENCES,
  })
}
