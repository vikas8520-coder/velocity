import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const listByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("scheduledPosts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()
    return rows.sort((a, b) => a.scheduledAt - b.scheduledAt)
  },
})

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    const id = await ctx.db.insert("scheduledPosts", {
      ...args,
      createdAt: now,
      updatedAt: now,
    })
    await ctx.db.patch(args.contentId, {
      status: args.status === "posted" ? "published" : "scheduled",
      scheduledAt: args.scheduledAt,
      publishedAt: args.status === "posted" ? now : undefined,
      updatedAt: now,
    })
    return id
  },
})
