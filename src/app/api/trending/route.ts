import { NextRequest, NextResponse } from "next/server"

const MOCK_TRENDING = [
  {
    id: "trend_1",
    platform: "tiktok",
    niche: "productivity",
    title: "3 years of gym progress in 30 seconds 💪",
    url: "https://tiktok.com/@fitnessjourney/video/123",
    thumbnailUrl: "https://picsum.photos/seed/trend1/400/700",
    views: 2_400_000,
    likes: 180_000,
    comments: 3_200,
    shares: 45_000,
    engagementRate: 0.095,
    postedAt: Date.now() - 86400000 * 2,
    authorHandle: "@fitnessjourney",
    authorFollowers: 120_000,
    tags: ["fitness", "transformation", "motivation", "gym"],
  },
  {
    id: "trend_2",
    platform: "instagram",
    niche: "AI",
    title: "This AI tool replaced my entire workflow 🤯",
    url: "https://instagram.com/reel/abc",
    thumbnailUrl: "https://picsum.photos/seed/trend2/400/700",
    views: 890_000,
    likes: 67_000,
    comments: 1_800,
    shares: 12_000,
    engagementRate: 0.091,
    postedAt: Date.now() - 86400000 * 1,
    authorHandle: "@aitoolsdaily",
    authorFollowers: 45_000,
    tags: ["AI", "productivity", "automation", "tools"],
  },
  {
    id: "trend_3",
    platform: "youtube",
    niche: "laundry",
    title: "Laundry hack that saves 3 hours/week ⏰",
    url: "https://youtube.com/shorts/xyz",
    thumbnailUrl: "https://picsum.photos/seed/trend3/400/700",
    views: 1_200_000,
    likes: 89_000,
    comments: 2_100,
    shares: 8_500,
    engagementRate: 0.083,
    postedAt: Date.now() - 86400000 * 3,
    authorHandle: "@lifehacks",
    authorFollowers: 200_000,
    tags: ["laundry", "lifehack", "timesaver", "home"],
  },
  {
    id: "trend_4",
    platform: "tiktok",
    niche: "productivity",
    title: "My $0 to $10k/month automation stack 🚀",
    url: "https://tiktok.com/@builder/video/456",
    thumbnailUrl: "https://picsum.photos/seed/trend4/400/700",
    views: 3_100_000,
    likes: 245_000,
    comments: 5_600,
    shares: 67_000,
    engagementRate: 0.102,
    postedAt: Date.now() - 86400000 * 4,
    authorHandle: "@builder",
    authorFollowers: 85_000,
    tags: ["automation", "business", "nocode", "income"],
  },
  {
    id: "trend_5",
    platform: "instagram",
    niche: "AI",
    title: "Stop using ChatGPT wrong! Do this instead 🎯",
    url: "https://instagram.com/reel/def",
    thumbnailUrl: "https://picsum.photos/seed/trend5/400/700",
    views: 1_500_000,
    likes: 112_000,
    comments: 3_400,
    shares: 28_000,
    engagementRate: 0.096,
    postedAt: Date.now() - 86400000 * 5,
    authorHandle: "@promptengineering",
    authorFollowers: 78_000,
    tags: ["ChatGPT", "prompting", "AI", "tips"],
  },
]

export async function GET(request: NextRequest) {
  try {
    // Demo mode - skip auth
    // const { userId } = await auth()
    // if (!userId) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    const platform = searchParams.get("platform")
    const niche = searchParams.get("niche")
    const limit = parseInt(searchParams.get("limit") || "10")

    let results = MOCK_TRENDING

    if (platform) {
      results = results.filter(r => r.platform === platform)
    }
    if (niche) {
      results = results.filter(r => r.niche === niche)
    }

    // Sort by engagement rate
    results.sort((a, b) => b.engagementRate - a.engagementRate)

    return NextResponse.json({ trending: results.slice(0, limit) })
  } catch (error) {
    console.error("Trending fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch trending content" },
      { status: 500 }
    )
  }
}