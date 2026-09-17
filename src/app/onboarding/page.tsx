"use client"

import { FormEvent, Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { useWorkspace } from "@/lib/workspace"
import type { BrandProfile, ContentItem } from "@/lib/utils"

function OnboardingForm() {
  const router = useRouter()
  const params = useSearchParams()
  const setBrand = useWorkspace((s) => s.setBrand)
  const replaceQueue = useWorkspace((s) => s.replaceQueue)
  const [url, setUrl] = useState(params.get("url") || "")
  const [status, setStatus] = useState<"idle" | "reading" | "writing">("idle")
  const [error, setError] = useState("")
  const [preview, setPreview] = useState<BrandProfile | null>(null)

  async function run(site: string) {
    setError("")
    setStatus("reading")
    try {
      const brandRes = await fetch("/api/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: site }),
      })
      const brandData = await brandRes.json()
      if (!brandRes.ok) throw new Error(brandData.error || "Could not read that site")
      const brand = brandData.brand as BrandProfile
      setPreview(brand)
      setBrand(brand)
      setStatus("writing")
      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, count: 5 }),
      })
      const genData = await genRes.json()
      if (!genRes.ok) throw new Error(genData.error || "Could not generate content")
      replaceQueue(genData.contents as ContentItem[])
      router.push("/app")
    } catch (e) {
      setStatus("idle")
      setError(e instanceof Error ? e.message : "Something went wrong")
    }
  }

  useEffect(() => {
    const initial = params.get("url")
    if (initial) void run(initial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    void run(url)
  }

  const busy = status !== "idle"

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-16">
      <div className="mb-8 flex items-center justify-between font-display text-xl font-bold">
        <span className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Velocity
        </span>
        <ThemeToggle />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Step 1 · Brand</p>
      <h1 className="mt-2 font-display text-3xl font-bold">Enter your website</h1>
      <p className="mt-2 text-fg-muted">
        We learn the product, audience, and tone, then fill Blitz with shorts you can swipe and schedule.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <Label htmlFor="url">Website URL</Label>
          <Input
            id="url"
            type="url"
            required
            placeholder="https://yourapp.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-1 h-12 rounded-xl"
            disabled={busy}
          />
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {status === "reading" ? "Learning your brand…" : status === "writing" ? "Writing shorts…" : "Build my queue"}
        </Button>
      </form>

      {preview ? (
        <div className="mt-8 rounded-2xl border border-card-border bg-bg-elevated p-4">
          <p className="text-xs uppercase tracking-wide text-fg-subtle">Detected</p>
          <p className="mt-1 font-semibold">{preview.name}</p>
          <p className="mt-1 text-sm text-fg-muted">{preview.description}</p>
        </div>
      ) : null}
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="p-10 text-fg-muted">Loading…</div>}>
      <OnboardingForm />
    </Suspense>
  )
}
