"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { useWorkspace } from "@/lib/workspace"
import { Button } from "@/components/ui/Button"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

export function AppShell({ children }: { children: React.ReactNode }) {
  const brand = useWorkspace((s) => s.brand)
  const [live, setLive] = useState(false)
  const [clerk, setClerk] = useState(false)
  const [pipeline, setPipeline] = useState("Demo pipeline")
  const [needsPalmierSignIn, setNeedsPalmierSignIn] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [focusNote, setFocusNote] = useState("")

  const refreshStatus = useCallback(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((s) => {
        const palmierOn = Boolean(s.palmier?.canGenerate)
        const palmierOpen = Boolean(s.palmier?.reachable)
        setLive(Boolean(s.openai || s.anthropic || s.fal || palmierOn))
        setClerk(Boolean(s.clerk))
        setNeedsPalmierSignIn(palmierOpen && !palmierOn)
        if (palmierOn) setPipeline("Palmier Pro")
        else if (palmierOpen) setPipeline("Palmier — sign in")
        else if (s.openai || s.anthropic || s.fal) setPipeline("Live models")
        else setPipeline("Demo pipeline")
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    refreshStatus()
    const t = setInterval(refreshStatus, 4000)
    return () => clearInterval(t)
  }, [refreshStatus])

  async function openPalmierSignIn() {
    setHelpOpen(true)
    setFocusNote("Bringing Palmier Pro to the front…")
    try {
      await fetch("/api/palmier/focus", { method: "POST" })
      setFocusNote("Look at Palmier Pro (not this browser). A Google window should open.")
    } catch {
      setFocusNote("Could not focus Palmier. Open it from the Dock, then Sign in with Google.")
    }
    refreshStatus()
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-card-border bg-bg/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <Sparkles className="h-5 w-5 text-primary" />
            Velocity
          </Link>
          <div className="flex items-center gap-3 text-sm">
            {brand ? (
              <span className="hidden max-w-[16rem] truncate text-fg-muted sm:inline">{brand.name}</span>
            ) : null}
            {needsPalmierSignIn ? (
              <button
                type="button"
                onClick={openPalmierSignIn}
                className="rounded-full bg-warning-light px-2.5 py-1 text-[11px] font-semibold text-warning hover:opacity-90"
              >
                Palmier — sign in
              </button>
            ) : (
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${live ? "bg-success-light text-success" : "bg-bg-muted text-fg-muted"}`}
              >
                {pipeline}
              </span>
            )}
            <ThemeToggle />
            {clerk ? (
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  Account
                </Button>
              </Link>
            ) : null}
            <Link href="/app/settings">
              <Button variant="ghost" size="sm">
                Keys
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button variant="outline" size="sm">
                New brand
              </Button>
            </Link>
          </div>
        </div>
      </header>
      {helpOpen ? (
        <div className="border-b border-warning-border bg-warning-light px-4 py-4 text-sm text-fg">
          <div className="mx-auto max-w-6xl">
            <p className="font-semibold">Sign-in is in Palmier Pro, not in this browser.</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Switch to the Palmier Pro app (Dock or Cmd-Tab). Velocity cannot log you in here.</li>
              <li>On the left, click <strong>Sign in with Google</strong>. The button should say “Opening Google…”.</li>
              <li>If you are already in a project: Palmier Pro menu → <strong>Settings → Account → Sign in with Google</strong>.</li>
              <li>Finish Google in the popup. If nothing appears, check behind other windows or try again.</li>
              <li>This page turns green (“Palmier Pro”) when it worked. Then click Generate.</li>
            </ol>
            {focusNote ? <p className="mt-2 text-fg-muted">{focusNote}</p> : null}
            <button type="button" className="mt-3 text-xs font-semibold underline" onClick={() => setHelpOpen(false)}>
              Hide
            </button>
          </div>
        </div>
      ) : null}
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  )
}
