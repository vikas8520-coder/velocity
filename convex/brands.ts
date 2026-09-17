import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const listByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("brands")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()
  },
})

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    return await ctx.db.insert("brands", {
      ...args,
      createdAt: now,
      updatedAt: now,
    })
  },
})
