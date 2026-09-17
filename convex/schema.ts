import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

const contentStatus = v.union(
  v.literal("generating"),
  v.literal("pending_review"),
  v.literal("approved"),
  v.literal("rejected"),
  v.literal("scheduled"),
  v.literal("published"),
  v.literal("failed")
)

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    plan: v.union(v.literal("free"), v.literal("pro"), v.literal("enterprise")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  brands: defineTable({
    userId: v.id("users"),
    name: v.string(),
    websiteUrl: v.string(),
    description: v.string(),
    tagline: v.string(),
    color: v.string(),
    niches: v.array(v.string()),
    targetAudience: v.string(),
    tone: v.string(),
    logoUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  content: defineTable({
    userId: v.id("users"),
    brandId: v.id("brands"),
    format: v.string(),
    platform: v.string(),
    status: contentStatus,
    title: v.string(),
    script: v.string(),
    caption: v.string(),
    hashtags: v.array(v.string()),
    slides: v.array(
      v.object({
        headline: v.string(),
        body: v.string(),
      })
    ),
    mediaUrl: v.optional(v.string()),
    posterUrl: v.optional(v.string()),
    mediaType: v.optional(v.union(v.literal("image"), v.literal("video"))),
    visualPrompt: v.optional(v.string()),
    referenceContent: v.optional(
      v.object({
        title: v.string(),
        angle: v.string(),
        platform: v.string(),
      })
    ),
    scheduledAt: v.optional(v.number()),
    publishedAt: v.optional(v.number()),
    metadata: v.object({
      generationPrompt: v.string(),
      modelUsed: v.string(),
      duration: v.optional(v.number()),
      aspectRatio: v.string(),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_status", ["userId", "status"])
    .index("by_brand", ["brandId"]),

  scheduledPosts: defineTable({
    contentId: v.id("content"),
    userId: v.id("users"),
    platform: v.string(),
    caption: v.string(),
    scheduledAt: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("posting"),
      v.literal("posted"),
      v.literal("failed")
    ),
    error: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_scheduled", ["scheduledAt"])
    .index("by_content", ["contentId"]),
})
