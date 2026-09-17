"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Check, ChevronLeft, ChevronRight, Loader2, RefreshCw, Sparkles, X } from "lucide-react"
import { AppShell } from "@/components/app/AppShell"
import { ReelPreview } from "@/components/app/ReelPreview"
import { ScheduleSheet } from "@/components/app/ScheduleSheet"
import { Button } from "@/components/ui/Button"
import { formatNeedsVideo, mixToFormats, pickReference, MIX_LABELS, type MixKey } from "@/lib/formats"
import { useWorkspace } from "@/lib/workspace"
import { CONTENT_FORMATS, canonicalFormat, newId, type ContentFormat, type ContentItem, type Platform } from "@/lib/utils"

type Tab = "blitz" | "calendar"

export default function AppPage() {
  const router = useRouter()
  const brand = useWorkspace((s) => s.brand)
  const contents = useWorkspace((s) => s.contents)
  const scheduled = useWorkspace((s) => s.scheduled)
  const formatMix = useWorkspace((s) => s.formatMix)
  const setFormatMix = useWorkspace((s) => s.setFormatMix)
  const replaceQueue = useWorkspace((s) => s.replaceQueue)
  const setStatus = useWorkspace((s) => s.setStatus)
  const updateContent = useWorkspace((s) => s.updateContent)
  const schedule = useWorkspace((s) => s.schedule)

  const [tab, setTab] = useState<Tab>("blitz")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [hydrated, setHydrated] = useState(false)
  const [pending, setPending] = useState<ContentItem | null>(null)
  const [note, setNote] = useState("")
  const [lockedFormat, setLockedFormat] = useState<ContentFormat | null>(null)

  useEffect(() => {
    const finish = () => setHydrated(true)
    const unsub = useWorkspace.persist.onFinishHydration(finish)
    if (useWorkspace.persist.hasHydrated()) finish()
    return unsub
  }, [])

  const queue = useMemo(
    () =>
      contents.filter((c) => {
        if (c.status !== "pending_review" && c.status !== "generating") return false
        if (lockedFormat && canonicalFormat(c.format) !== lockedFormat) return false
        return true
      }),
    [contents, lockedFormat]
  )
  const current = queue[0]
  const rendering = Boolean(current && current.status === "generating")
  const reference = current ? pickReference(current.format, current.createdAt) : null

  const enhanceMedia = useCallback(async (items: ContentItem[]) => {
    const frame = brand?.media?.find((u) => /^https?:\/\//i.test(u)) || brand?.logoUrl
    let lastError = ""
    for (const item of items) {
      if (!formatNeedsVideo(item.format)) {
        updateContent(item.id, { status: "pending_review" })
        continue
      }
      try {
        const res = await fetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: item.visualPrompt,
            wantVideo: true,
            imageUrl: frame,
          }),
        })
        const data = await res.json()
        if (data.error) lastError = data.error
        if (data.mediaUrl) {
          updateContent(item.id, {
            mediaUrl: data.mediaUrl,
            posterUrl: data.posterUrl || data.mediaUrl,
            mediaType: data.mediaType,
            status: "pending_review",
          })
        } else {
          updateContent(item.id, { status: "pending_review" })
        }
      } catch (e) {
        lastError = e instanceof Error ? e.message : "Video generate failed"
        updateContent(item.id, { status: "pending_review" })
      }
    }
    if (lastError) setError(lastError)
    return lastError
  }, [brand?.logoUrl, brand?.media, updateContent])

  const generate = useCallback(
    async (angle?: string, format?: ContentFormat) => {
      if (!brand) return
      setBusy(true)
      setError("")
      setNote("")
      try {
        const formats = format
          ? [format, format, format, format]
          : mixToFormats(formatMix, 4)
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brand, count: formats.length, formats, angle }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Generate failed")
        const batch = data.contents as ContentItem[]
        replaceQueue(batch)
        setTab("blitz")
        setNote("Each card is a 9:16 still for that viral format. Video APIs are not keyed yet, so this is the picture — not a script-only card.")
        const videoItems = batch.filter((item) => formatNeedsVideo(item.format))
        if (videoItems.length) await enhanceMedia(videoItems)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Generate failed")
        setNote("")
      } finally {
        setBusy(false)
      }
    },
    [brand, enhanceMedia, formatMix, replaceQueue]
  )

  useEffect(() => {
    if (!hydrated) return
    if (!brand) router.replace("/onboarding")
  }, [brand, hydrated, router])

  useEffect(() => {
    if (!hydrated || !brand?.websiteUrl) return
    if (brand.media && brand.media.length > 1) return
    let cancelled = false
    fetch(`/api/visuals?url=${encodeURIComponent(brand.websiteUrl)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !data.images?.length) return
        const latest = useWorkspace.getState().brand
        if (!latest) return
        useWorkspace.getState().setBrand({
          ...latest,
          media: data.images,
          logoUrl: latest.logoUrl || data.images[1],
        })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [hydrated, brand?.id, brand?.websiteUrl, brand?.media?.length])

  useEffect(() => {
    if (!hydrated || !brand) return
    if (contents.length === 0 && !busy) void generate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, brand])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!current || pending) return
      if (e.key === "ArrowRight") setPending(current)
      if (e.key === "ArrowLeft") setStatus(current.id, "rejected")
      if (e.key === "ArrowUp") void generate()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [current, generate, pending, setStatus])

  async function confirmSchedule(input: {
    platforms: Platform[]
    caption: string
    scheduledAt: number | null
  }) {
    if (!pending) return
    const res = await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contentId: pending.id,
        platforms: input.platforms,
        caption: input.caption,
        scheduledAt: input.scheduledAt,
      }),
    })
    const data = await res.json()
    for (const post of data.posts || []) {
      schedule({
        id: post.id || newId("sched"),
        contentId: pending.id,
        platform: post.platform,
        caption: post.caption,
        scheduledAt: post.scheduledAt,
        status: post.status,
        createdAt: Date.now(),
      })
    }
    setNote(data.note || "Saved")
    setPending(null)
    setTab("calendar")
  }

  if (!hydrated || !brand) {
    return (
      <AppShell>
        <div className="flex h-[60vh] items-center justify-center text-fg-muted">Loading workspace…</div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-fg-subtle">Blitz</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">{brand.name}</h1>
          <p className="mt-1 max-w-xl text-sm text-fg-muted">
            Swipe formats already winning on TikTok. Left is the viral structure. Center is your remix.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant={tab === "blitz" ? "primary" : "outline"} size="sm" onClick={() => setTab("blitz")}>
            Review ({queue.length})
          </Button>
          <Button variant={tab === "calendar" ? "primary" : "outline"} size="sm" onClick={() => setTab("calendar")}>
            Calendar ({scheduled.length})
          </Button>
          <Button size="sm" onClick={() => generate()} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate mix
          </Button>
        </div>
      </div>

      {error ? <p className="mb-4 rounded-lg border border-destructive-border bg-destructive-light px-3 py-2 text-sm text-destructive">{error}</p> : null}
      {note ? <p className="mb-4 rounded-lg border border-success-border bg-success-light px-3 py-2 text-sm text-success">{note}</p> : null}

      {tab === "blitz" ? (
        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
          <aside className="space-y-6">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-subtle">Formats</p>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => setLockedFormat(null)}
                  className={`rounded-md px-3 py-2 text-left text-sm ${!lockedFormat ? "bg-fg text-bg" : "text-fg-muted hover:bg-bg-muted"}`}
                >
                  All in mix
                </button>
                {CONTENT_FORMATS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setLockedFormat(f.id)
                      void generate(undefined, f.id)
                    }}
                    className={`rounded-md px-3 py-2 text-left text-sm ${lockedFormat === f.id ? "bg-fg text-bg" : "text-fg-muted hover:bg-bg-muted"}`}
                  >
                    <span className="block font-medium text-inherit">{f.name}</span>
                    <span className={`block text-[11px] ${lockedFormat === f.id ? "text-bg/70" : "text-fg-subtle"}`}>{f.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {reference ? (
              <div className="border-t border-border pt-5">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-subtle">Remixed from</p>
                <article className="rounded-lg border border-card-border bg-bg-elevated p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">{reference.views} views</p>
                  <h2 className="mt-1 font-display text-base font-semibold leading-snug">{reference.title}</h2>
                  <p className="mt-2 text-xs leading-relaxed text-fg-muted">{reference.hook}</p>
                  <p className="mt-2 text-[11px] text-fg-subtle">{reference.why}</p>
                </article>
              </div>
            ) : null}
          </aside>

          <section className="flex flex-col items-center">
            {current ? (
              <>
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.85}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 110) setPending(current)
                    else if (info.offset.x < -110) setStatus(current.id, "rejected")
                  }}
                  className="relative aspect-[9/16] w-full max-w-[340px] cursor-grab overflow-hidden rounded-[1.75rem] border border-zinc-800 bg-black shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)] active:cursor-grabbing"
                >
                  <ReelPreview content={current} brand={brand} />
                  {rendering ? (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/70 px-6 text-center text-white">
                      <Loader2 className="h-7 w-7 animate-spin" />
                      <p className="text-sm font-medium">Rendering hook + demo in Palmier</p>
                    </div>
                  ) : null}
                </motion.div>
                <p className="mt-4 max-w-sm text-center text-sm font-medium">{current.title}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-fg-subtle">
                  {canonicalFormat(current.format).replace("-", " ")} · {current.platform}
                </p>
                <div className="mt-5 flex w-full max-w-sm items-center gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setStatus(current.id, "rejected")}>
                    <X className="h-4 w-4" />
                    Skip
                  </Button>
                  <Button variant="ghost" className="flex-1" onClick={() => generate()} disabled={busy}>
                    <RefreshCw className="h-4 w-4" />
                    More
                  </Button>
                  <Button className="flex-1" onClick={() => setPending(current)}>
                    <Check className="h-4 w-4" />
                    Keep
                  </Button>
                </div>
                <p className="mt-3 flex items-center gap-2 text-[11px] text-fg-subtle">
                  <ChevronLeft className="h-3 w-3" /> skip
                  <ChevronRight className="h-3 w-3" /> schedule
                </p>
              </>
            ) : (
              <div className="flex min-h-[28rem] w-full max-w-md flex-col items-center justify-center border border-dashed border-border bg-bg-elevated p-8 text-center">
                <h2 className="font-display text-xl font-semibold">Deck is empty</h2>
                <p className="mt-2 text-sm text-fg-muted">Generate a mix of the four viral formats for {brand.name}.</p>
                <Button className="mt-5" onClick={() => generate()} disabled={busy}>
                  Generate mix
                </Button>
              </div>
            )}
          </section>

          <aside className="space-y-5">
            <div className="border border-card-border bg-bg-elevated p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-subtle">Mix</p>
              <p className="mt-1 text-xs text-fg-muted">Same sliders Fastlane uses: weights rebuild the Blitz deck.</p>
              <div className="mt-4 space-y-3">
                {MIX_LABELS.map((row) => (
                  <label key={row.key} className="block">
                    <span className="flex justify-between text-[11px] font-medium">
                      {row.label}
                      <span className="text-fg-subtle">{formatMix[row.key]}%</span>
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={formatMix[row.key]}
                      onChange={(e) => setFormatMix({ [row.key]: Number(e.target.value) } as Partial<Record<MixKey, number>>)}
                      className="mt-1 w-full accent-rose-700"
                    />
                  </label>
                ))}
                <label className="block">
                  <span className="flex justify-between text-[11px] font-medium">
                    Remix trending
                    <span className="text-fg-subtle">{formatMix.remix}%</span>
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={formatMix.remix}
                    onChange={(e) => setFormatMix({ remix: Number(e.target.value) })}
                    className="mt-1 w-full accent-rose-700"
                  />
                </label>
              </div>
              <Button className="mt-4 w-full" size="sm" onClick={() => generate()} disabled={busy}>
                Apply mix
              </Button>
            </div>
            {current ? (
              <div className="border border-card-border bg-bg-elevated p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-subtle">Script</p>
                <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap font-sans text-xs leading-relaxed text-fg-muted">
                  {current.script}
                </pre>
              </div>
            ) : null}
          </aside>
        </div>
      ) : (
        <div className="space-y-3">
          {scheduled.length === 0 ? (
            <p className="border border-dashed border-border p-10 text-center text-fg-muted">
              Keep a reel to fill the calendar.
            </p>
          ) : (
            scheduled.map((post) => {
              const item = contents.find((c) => c.id === post.contentId)
              return (
                <article key={post.id} className="flex items-center justify-between gap-4 border border-card-border bg-bg-elevated p-4">
                  <div>
                    <p className="font-medium">{item?.title || "Content"}</p>
                    <p className="text-sm text-fg-muted">
                      {item ? canonicalFormat(item.format).replace("-", " ") : "format"} · {post.platform} ·{" "}
                      {new Date(post.scheduledAt).toLocaleString()}
                    </p>
                  </div>
                  {item?.mediaUrl ? (
                    <a href={item.mediaUrl} download className="text-sm font-semibold text-primary">
                      Download
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="text-sm font-semibold text-primary"
                      onClick={() => navigator.clipboard.writeText(post.caption)}
                    >
                      Copy caption
                    </button>
                  )}
                </article>
              )
            })
          )}
        </div>
      )}

      {pending ? (
        <ScheduleSheet content={pending} onClose={() => setPending(null)} onConfirm={confirmSchedule} />
      ) : null}
    </AppShell>
  )
}
