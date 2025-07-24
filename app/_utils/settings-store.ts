import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'sunset' | 'ocean' | 'forest' | 'nord' | 'dracula' | 'monokai' | 'github-dark' | 'tokyo-night' | 'catppuccin' | 'rose-pine' | 'gruvbox' | 'solarized-dark'

interface SettingsState {
  theme: Theme
  showEmojis: boolean
  setTheme: (theme: Theme) => void
  setShowEmojis: (show: boolean) => void
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      showEmojis: true,
      setTheme: (theme) => set({ theme }),
      setShowEmojis: (show) => set({ showEmojis: show }),
    }),
    {
      name: 'checklist-settings',
    }
  )
) 