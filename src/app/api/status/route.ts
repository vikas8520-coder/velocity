import { NextResponse } from "next/server"
import { isAnthropicConfigured, isClerkConfigured, isConvexConfigured, isFalConfigured, isOpenAIConfigured } from "@/lib/config"
import { palmierStatus } from "@/lib/palmier"
import { isPollinationsConfigured } from "@/lib/pollinations"
import { socialConfigured } from "@/lib/social"

export async function GET() {
  const palmier = await palmierStatus()
  return NextResponse.json({
    clerk: isClerkConfigured(),
    openai: isOpenAIConfigured(),
    anthropic: isAnthropicConfigured(),
    fal: isFalConfigured(),
    convex: isConvexConfigured(),
    pollinations: isPollinationsConfigured(),
    social: socialConfigured(),
    palmier,
  })
}
