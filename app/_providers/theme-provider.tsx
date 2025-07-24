"use client"

import { useEffect } from "react"
import { useSettings } from "@/app/_utils/settings-store"

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
    document.documentElement.classList.remove(...ALL_THEMES)
    document.documentElement.classList.add(theme)
  }, [theme])

  return <>{children}</>
} 