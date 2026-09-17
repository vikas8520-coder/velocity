import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique()
  },
})

export const ensure = mutation({
  args: {
    clerkId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique()
    const now = Date.now()
    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email ?? existing.email,
        name: args.name ?? existing.name,
        imageUrl: args.imageUrl ?? existing.imageUrl,
        updatedAt: now,
      })
      return existing._id
    }
    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email ?? `${args.clerkId}@velocity.local`,
      name: args.name,
      imageUrl: args.imageUrl,
      plan: "free",
      createdAt: now,
      updatedAt: now,
    })
  },
})
