"use client"

import { useEffect } from "react"
import { useSettings } from "@/lib/settings-store"

// Keep this in sync with the Theme type in settings-store.ts
const ALL_THEMES = [
  'light',
  'dark',
  'sunset',
  'ocean',
  'forest',
  'nord',
  'dracula',
  'monokai',
  'github-dark',
  'tokyo-night',
  'catppuccin',
  'rose-pine',
  'gruvbox',
  'solarized-dark'
] as const

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useSettings()

  useEffect(() => {
    // Remove all theme classes first
    document.documentElement.classList.remove(...ALL_THEMES)
    // Add the new theme class
    document.documentElement.classList.add(theme)
  }, [theme])

  return <>{children}</>
} 