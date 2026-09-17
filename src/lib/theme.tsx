"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

type Theme = "light" | "dark"

const ThemeContext = createContext<{
  theme: Theme
  toggle: () => void
  setTheme: (theme: Theme) => void
}>({
  theme: "light",
  toggle: () => {},
  setTheme: () => {},
})

function apply(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light")

  useEffect(() => {
    const stored = window.localStorage.getItem("velocity-theme")
    const next: Theme =
      stored === "dark" || stored === "light"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
    setThemeState(next)
    apply(next)
  }, [])

  const value = useMemo(
    () => ({
      theme,
      setTheme: (next: Theme) => {
        setThemeState(next)
        window.localStorage.setItem("velocity-theme", next)
        apply(next)
      },
      toggle: () => {
        setThemeState((current) => {
          const next = current === "dark" ? "light" : "dark"
          window.localStorage.setItem("velocity-theme", next)
          apply(next)
          return next
        })
      },
    }),
    [theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
