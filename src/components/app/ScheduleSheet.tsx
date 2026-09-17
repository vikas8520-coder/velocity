"use client"

import { useState } from "react"
import { PLATFORMS, type ContentItem, type Platform } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"

export function ScheduleSheet({
  content,
  onClose,
  onConfirm,
}: {
  content: ContentItem
  onClose: () => void
  onConfirm: (input: { platforms: Platform[]; caption: string; scheduledAt: number | null }) => void
}) {
  const [platforms, setPlatforms] = useState<Platform[]>([content.platform])
  const [caption, setCaption] = useState(content.caption)
  const [when, setWhen] = useState<"now" | "later">("now")
  const [later, setLater] = useState("")

  function toggle(id: Platform) {
    setPlatforms((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center" role="dialog" aria-labelledby="schedule-title">
      <div className="w-full max-w-lg rounded-2xl border border-card-border bg-bg-elevated p-5 shadow-xl">
        <h2 id="schedule-title" className="font-display text-lg font-semibold">
          Schedule “{content.title}”
        </h2>
        <p className="mt-1 text-sm text-fg-muted">
          Fastlane posts from linked accounts. Velocity queues locally until TikTok / IG / YT OAuth is connected.
        </p>

        <fieldset className="mt-4">
          <legend className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">Platforms</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {PLATFORMS.map((p) => {
              const on = platforms.includes(p.id)
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggle(p.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                    on ? "border-primary bg-primary-light text-primary" : "border-border bg-bg-elevated text-fg-muted"
                  }`}
                >
                  {p.name}
                </button>
              )
            })}
          </div>
        </fieldset>

        <div className="mt-4">
          <Label htmlFor="caption">Caption</Label>
          <textarea
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={5}
            className="mt-1 w-full rounded-xl border border-input-border bg-input px-3 py-2 text-sm text-fg"
          />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setWhen("now")}
            className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold ${when === "now" ? "border-primary bg-primary-light text-primary" : "border-border bg-bg-elevated text-fg"}`}
          >
            Post now
          </button>
          <button
            type="button"
            onClick={() => setWhen("later")}
            className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold ${when === "later" ? "border-primary bg-primary-light text-primary" : "border-border bg-bg-elevated text-fg"}`}
          >
            Later
          </button>
        </div>
        {when === "later" ? (
          <input
            type="datetime-local"
            value={later}
            onChange={(e) => setLater(e.target.value)}
            className="mt-3 w-full rounded-xl border border-input-border px-3 py-2 text-sm"
          />
        ) : null}

        <div className="mt-5 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Keep in review
          </Button>
          <Button
            className="flex-1"
            disabled={!platforms.length}
            onClick={() =>
              onConfirm({
                platforms,
                caption,
                scheduledAt: when === "later" && later ? new Date(later).getTime() : null,
              })
            }
          >
            {when === "now" ? "Post" : "Schedule"}
          </Button>
        </div>
      </div>
    </div>
  )
}
