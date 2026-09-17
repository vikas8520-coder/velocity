import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

const status = v.union(
  v.literal("generating"),
  v.literal("pending_review"),
  v.literal("approved"),
  v.literal("rejected"),
  v.literal("scheduled"),
  v.literal("published"),
  v.literal("failed")
)

export const listByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("content")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()
    return rows.sort((a, b) => b.createdAt - a.createdAt)
  },
})

export const insert = mutation({
  args: {
    userId: v.id("users"),
    brandId: v.id("brands"),
    format: v.string(),
    platform: v.string(),
    status,
    title: v.string(),
    script: v.string(),
    caption: v.string(),
    hashtags: v.array(v.string()),
    slides: v.array(v.object({ headline: v.string(), body: v.string() })),
    mediaUrl: v.optional(v.string()),
    posterUrl: v.optional(v.string()),
    mediaType: v.optional(v.union(v.literal("image"), v.literal("video"))),
    visualPrompt: v.optional(v.string()),
    metadata: v.object({
      generationPrompt: v.string(),
      modelUsed: v.string(),
      duration: v.optional(v.number()),
      aspectRatio: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    return await ctx.db.insert("content", {
      ...args,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const setStatus = mutation({
  args: {
    id: v.id("content"),
    status,
    scheduledAt: v.optional(v.number()),
    mediaUrl: v.optional(v.string()),
    posterUrl: v.optional(v.string()),
    mediaType: v.optional(v.union(v.literal("image"), v.literal("video"))),
  },
  handler: async (ctx, args) => {
    const { id, ...patch } = args
    await ctx.db.patch(id, { ...patch, updatedAt: Date.now() })
  },
})
