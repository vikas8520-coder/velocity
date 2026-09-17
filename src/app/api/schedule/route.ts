import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Demo mode - skip auth
    // const { userId } = await auth()
    // if (!userId) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const body = await request.json()
    const { contentId, platform, scheduledAt } = body

    if (!contentId || !platform || !scheduledAt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In production, save to Convex scheduledPosts table
    // const scheduledPost = await convex.mutation(api.scheduledPosts.create, { ... })

    return NextResponse.json({ 
      success: true, 
      scheduledPost: {
        id: `sched_${Date.now()}`,
        contentId,
        platform,
        scheduledAt,
        status: "pending",
        createdAt: Date.now(),
      }
    })
  } catch (error) {
    console.error("Scheduling error:", error)
    return NextResponse.json(
      { error: "Failed to schedule post" },
      { status: 500 }
    )
  }
}