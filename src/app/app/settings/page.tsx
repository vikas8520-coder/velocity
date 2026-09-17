"use client"

import { FormEvent, useEffect, useState } from "react"
import { AppShell } from "@/components/app/AppShell"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"

type KeyState = Record<string, { configured: boolean; hint: string }>

const GROUPS: { title: string; blurb: string; docs: string; fields: { name: string; label: string }[] }[] = [
  {
    title: "YouTube",
    blurb: "Data API key. Reads channel name, avatar, and banners from youtube.com/@handle or /shorts links.",
    docs: "https://console.cloud.google.com/apis/credentials",
    fields: [{ name: "YOUTUBE_API_KEY", label: "YouTube Data API key" }],
  },
  {
    title: "Instagram & Facebook",
    blurb: "Meta app ID + secret unlock Instagram oEmbed. A user/page token is needed for Graph media.",
    docs: "https://developers.facebook.com/apps/",
    fields: [
      { name: "META_APP_ID", label: "Meta app ID" },
      { name: "META_APP_SECRET", label: "Meta app secret" },
      { name: "INSTAGRAM_ACCESS_TOKEN", label: "Instagram access token" },
      { name: "FACEBOOK_PAGE_ACCESS_TOKEN", label: "Facebook page token" },
    ],
  },
  {
    title: "TikTok",
    blurb: "Client key/secret for Login Kit and posting. Profile oEmbed works without them.",
    docs: "https://developers.tiktok.com/",
    fields: [
      { name: "TIKTOK_CLIENT_KEY", label: "TikTok client key" },
      { name: "TIKTOK_CLIENT_SECRET", label: "TikTok client secret" },
    ],
  },
  {
    title: "LinkedIn",
    blurb: "OAuth app for posting. Profile ingest is limited without a member token.",
    docs: "https://www.linkedin.com/developers/apps",
    fields: [
      { name: "LINKEDIN_CLIENT_ID", label: "LinkedIn client ID" },
      { name: "LINKEDIN_CLIENT_SECRET", label: "LinkedIn client secret" },
    ],
  },
  {
    title: "X (Twitter)",
    blurb: "Bearer token reads @handle profiles. API key/secret are for posting later.",
    docs: "https://developer.x.com/en/portal/dashboard",
    fields: [
      { name: "X_BEARER_TOKEN", label: "X bearer token" },
      { name: "X_API_KEY", label: "X API key" },
      { name: "X_API_SECRET", label: "X API secret" },
    ],
  },
  {
    title: "Pinterest & Reddit",
    blurb: "Optional. Reddit public about.json works without a key; Pinterest needs a token.",
    docs: "https://developers.pinterest.com/",
    fields: [
      { name: "PINTEREST_ACCESS_TOKEN", label: "Pinterest access token" },
      { name: "REDDIT_CLIENT_ID", label: "Reddit client ID" },
      { name: "REDDIT_CLIENT_SECRET", label: "Reddit client secret" },
    ],
  },
]

export default function SettingsPage() {
  const [keys, setKeys] = useState<KeyState>({})
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [note, setNote] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetch("/api/settings/social")
      .then((r) => r.json())
      .then((d) => setKeys(d.keys || {}))
      .catch(() => setError("Could not load key status"))
  }, [])

  async function save(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError("")
    setNote("")
    try {
      const res = await fetch("/api/settings/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Save failed")
      setKeys(data.keys || {})
      setDraft({})
      setNote("Keys saved on this machine. They never leave the server or get shown again.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setBusy(false)
    }
  }

  return (
    <AppShell>
      <div className="mb-8 border-b border-border pb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-fg-subtle">Connections</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">Social keys</h1>
        <p className="mt-2 max-w-2xl text-sm text-fg-muted">
          Paste API keys so Velocity can read Instagram, TikTok, YouTube, LinkedIn, X, and the rest when you drop a
          profile URL. Live posting still needs OAuth per account — these keys are the app credentials for ingest and
          future publish.
        </p>
      </div>

      {error ? <p className="mb-4 rounded-lg border border-destructive-border bg-destructive-light px-3 py-2 text-sm text-destructive">{error}</p> : null}
      {note ? <p className="mb-4 rounded-lg border border-success-border bg-success-light px-3 py-2 text-sm text-success">{note}</p> : null}

      <form onSubmit={save} className="space-y-8">
        {GROUPS.map((group) => (
          <section key={group.title} className="border border-card-border bg-bg-elevated p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-lg font-semibold">{group.title}</h2>
              <a href={group.docs} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary">
                Get keys
              </a>
            </div>
            <p className="mt-1 text-sm text-fg-muted">{group.blurb}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {group.fields.map((field) => {
                const status = keys[field.name]
                return (
                  <div key={field.name}>
                    <Label htmlFor={field.name}>
                      {field.label}
                      {status?.configured ? (
                        <span className="ml-2 text-[11px] font-semibold text-success">saved {status.hint}</span>
                      ) : (
                        <span className="ml-2 text-[11px] text-fg-subtle">not set</span>
                      )}
                    </Label>
                    <Input
                      id={field.name}
                      type="password"
                      autoComplete="off"
                      placeholder={status?.configured ? "Leave blank to keep current" : "Paste key"}
                      value={draft[field.name] || ""}
                      onChange={(e) => setDraft((d) => ({ ...d, [field.name]: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                )
              })}
            </div>
          </section>
        ))}
        <Button type="submit" disabled={busy}>
          {busy ? "Saving…" : "Save keys"}
        </Button>
      </form>
    </AppShell>
  )
}
