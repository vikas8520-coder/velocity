import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    plan: v.union(v.literal("free"), v.literal("pro"), v.literal("enterprise")),
    brands: v.array(v.object({
      id: v.string(),
      name: v.string(),
      description: v.string(),
      color: v.string(),
      niches: v.array(v.string()),
      targetAudience: v.string(),
      tone: v.string(),
      socialHandles: v.object({
        tiktok: v.optional(v.string()),
        instagram: v.optional(v.string()),
        youtube: v.optional(v.string()),
      }),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  content: defineTable({
    userId: v.id("users"),
    brandId: v.string(),
    format: v.string(),
    platform: v.string(),
    status: v.union(
      v.literal("generating"),
      v.literal("pending_review"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("scheduled"),
      v.literal("published"),
      v.literal("failed")
    ),
    title: v.string(),
    script: v.string(),
    caption: v.string(),
    hashtags: v.array(v.string()),
    mediaUrl: v.optional(v.string()),
    mediaType: v.optional(v.union(v.literal("image"), v.literal("video"))),
    referenceContent: v.optional(v.object({
      url: v.string(),
      title: v.string(),
      platform: v.string(),
      views: v.number(),
      engagementRate: v.number(),
    })),
    scheduledAt: v.optional(v.number()),
    publishedAt: v.optional(v.number()),
    metadata: v.object({
      generationPrompt: v.string(),
      modelUsed: v.string(),
      duration: v.optional(v.number()),
      aspectRatio: v.string(),
    }),
    analytics: v.optional(v.object({
      views: v.number(),
      likes: v.number(),
      comments: v.number(),
      shares: v.number(),
      saves: v.number(),
      clickThroughRate: v.number(),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_status", ["userId", "status"])
    .index("by_brand", ["brandId"])
    .index("by_scheduled", ["scheduledAt"]),

  trendingContent: defineTable({
    platform: v.string(),
    niche: v.string(),
    title: v.string(),
    url: v.string(),
    thumbnailUrl: v.string(),
    views: v.number(),
    likes: v.number(),
    comments: v.number(),
    shares: v.number(),
    engagementRate: v.number(),
    postedAt: v.number(),
    authorHandle: v.string(),
    authorFollowers: v.number(),
    tags: v.array(v.string()),
    fetchedAt: v.number(),
  }).index("by_platform_niche", ["platform", "niche"])
    .index("by_engagement", ["engagementRate"]),

  scheduledPosts: defineTable({
    contentId: v.id("content"),
    userId: v.id("users"),
    platform: v.string(),
    scheduledAt: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("posting"),
      v.literal("posted"),
      v.literal("failed")
    ),
    externalId: v.optional(v.string()),
    error: v.optional(v.string()),
    retryCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_scheduled", ["scheduledAt"])
    .index("by_content", ["contentId"]),

  analyticsEvents: defineTable({
    contentId: v.id("content"),
    userId: v.id("users"),
    platform: v.string(),
    eventType: v.union(
      v.literal("view"),
      v.literal("like"),
      v.literal("comment"),
      v.literal("share"),
      v.literal("save"),
      v.literal("click")
    ),
    value: v.number(),
    timestamp: v.number(),
    metadata: v.optional(v.any()),
  }).index("by_content", ["contentId"])
    .index("by_user_platform", ["userId", "platform"])
    .index("by_timestamp", ["timestamp"]),

  customerCalls: defineTable({
    userId: v.id("users"),
    customerEmail: v.string(),
    customerName: v.string(),
    businessType: v.string(),
    signupReason: v.string(),
    loveScore: v.number(),
    outcomes: v.object({
      tiktokViews: v.number(),
      instagramViews: v.number(),
      youtubeViews: v.number(),
      conversions: v.number(),
      revenue: v.number(),
    }),
    notes: v.string(),
    callDate: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_love_score", ["loveScore"]),
})