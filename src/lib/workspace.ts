"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { BrandProfile, ContentItem, ContentStatus, ScheduledPost } from "@/lib/utils"
import { DEFAULT_MIX, type FormatMix } from "@/lib/formats"

function demoUserId() {
  if (typeof window === "undefined") return "demo_local"
  const key = "velocity_demo_user"
  const existing = window.localStorage.getItem(key)
  if (existing) return existing
  const id = `demo_${crypto.randomUUID()}`
  window.localStorage.setItem(key, id)
  return id
}

interface WorkspaceState {
  userId: string
  brand: BrandProfile | null
  contents: ContentItem[]
  scheduled: ScheduledPost[]
  formatMix: FormatMix
  setBrand: (brand: BrandProfile) => void
  setFormatMix: (mix: Partial<FormatMix>) => void
  addContents: (items: ContentItem[]) => void
  replaceQueue: (items: ContentItem[]) => void
  updateContent: (id: string, patch: Partial<ContentItem>) => void
  setStatus: (id: string, status: ContentStatus) => void
  schedule: (post: ScheduledPost) => void
  reset: () => void
}

export const useWorkspace = create<WorkspaceState>()(
  persist(
    (set) => ({
      userId: "demo_local",
      brand: null,
      contents: [],
      scheduled: [],
      formatMix: DEFAULT_MIX,
      setBrand: (brand) => set({ brand }),
      setFormatMix: (mix) => set((s) => ({ formatMix: { ...s.formatMix, ...mix } })),
      addContents: (items) =>
        set((s) => ({
          contents: [...items, ...s.contents.filter((c) => !items.some((n) => n.id === c.id))],
        })),
      replaceQueue: (items) =>
        set((s) => ({
          contents: [
            ...items,
            ...s.contents.filter((c) => c.status !== "pending_review" && c.status !== "generating"),
          ],
        })),
      updateContent: (id, patch) =>
        set((s) => ({
          contents: s.contents.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: Date.now() } : c)),
        })),
      setStatus: (id, status) =>
        set((s) => ({
          contents: s.contents.map((c) =>
            c.id === id ? { ...c, status, updatedAt: Date.now() } : c
          ),
        })),
      schedule: (post) =>
        set((s) => ({
          scheduled: [post, ...s.scheduled],
          contents: s.contents.map((c) =>
            c.id === post.contentId
              ? {
                  ...c,
                  status: post.status === "posted" ? "published" : "scheduled",
                  scheduledAt: post.scheduledAt,
                  updatedAt: Date.now(),
                }
              : c
          ),
        })),
      reset: () => set({ brand: null, contents: [], scheduled: [] }),
    }),
    {
      name: "velocity-workspace",
      partialize: (s) => ({
        ...s,
        contents: s.contents.map((c) => ({
          ...c,
          mediaUrl: c.mediaUrl?.startsWith("blob:") ? undefined : c.mediaUrl,
          mediaType: c.mediaUrl?.startsWith("blob:") ? undefined : c.mediaType,
        })),
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return
        if (typeof window !== "undefined" && state.userId === "demo_local") {
          state.userId = demoUserId()
        }
        if (!state.formatMix) state.formatMix = DEFAULT_MIX
      },
    }
  )
)
