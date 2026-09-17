import { NextRequest, NextResponse } from "next/server"
import { SOCIAL_KEY_FIELDS, saveSocialKeys, socialKeyStatus, type SocialKeyName } from "@/lib/social-keys"
import { socialConfigured } from "@/lib/social"

export async function GET() {
  return NextResponse.json({
    keys: socialKeyStatus(),
    networks: socialConfigured(),
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, string>
    const patch: Partial<Record<SocialKeyName, string>> = {}
    for (const name of SOCIAL_KEY_FIELDS) {
      if (typeof body[name] === "string") patch[name] = body[name]
    }
    const keys = saveSocialKeys(patch)
    return NextResponse.json({ keys, networks: socialConfigured() })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save keys" },
      { status: 500 }
    )
  }
}
