"use client"

import { useEffect, useState } from "react"
import { useSettings } from "@/app/_utils/settings-store"
import { getCustomThemeColors } from "@/app/_consts/themes"

const BUILT_IN_THEMES = [
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
  const [customThemeColors, setCustomThemeColors] = useState<{ [key: string]: any }>({})

  useEffect(() => {
    const loadCustomColors = async () => {
      try {
        const colors = await getCustomThemeColors()
        setCustomThemeColors(colors)
      } catch (error) {
        console.error('Failed to load custom theme colors:', error)
      }
    }

    loadCustomColors()
  }, [])

  useEffect(() => {
    const allThemes = [...BUILT_IN_THEMES, ...Object.keys(customThemeColors)]
    document.documentElement.classList.remove(...allThemes)
    document.documentElement.classList.add(theme)

    if (customThemeColors[theme]) {
      const styleId = 'custom-theme-styles'
      let styleElement = document.getElementById(styleId) as HTMLStyleElement

      if (!styleElement) {
        styleElement = document.createElement('style')
        styleElement.id = styleId
        document.head.appendChild(styleElement)
      }

      const cssVariables = Object.entries(customThemeColors[theme])
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n        ')

      const cssContent = `
        .${theme} {
          ${cssVariables}
        }
      `

      styleElement.textContent = cssContent
    }
  }, [theme, customThemeColors])

  return <>{children}</>
} 