"use client"

import { ConvexProvider } from "convex/react"
import { convex } from "@/lib/convex"
import { ReactNode } from "react"

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!convex) return <>{children}</>
  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}