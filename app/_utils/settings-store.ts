import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type BuiltInTheme = 'system' | 'light' | 'dark' | 'sunset' | 'ocean' | 'forest' | 'nord' | 'dracula' | 'monokai' | 'github-dark' | 'tokyo-night' | 'catppuccin' | 'rose-pine' | 'gruvbox' | 'solarized-dark'
type Theme = BuiltInTheme | string

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

interface SettingsState {
  theme: Theme
  showEmojis: boolean
  autosaveNotes: boolean
  setTheme: (theme: Theme) => void
  setShowEmojis: (show: boolean) => void
  setAutosaveNotes: (enabled: boolean) => void
  getResolvedTheme: () => 'light' | 'dark' | string
}

export const useSettings = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      showEmojis: true,
      autosaveNotes: true,
      setTheme: (theme) => set({ theme }),
      setShowEmojis: (show) => set({ showEmojis: show }),
      setAutosaveNotes: (enabled) => set({ autosaveNotes: enabled }),
      getResolvedTheme: () => {
        const { theme } = get();
        if (theme === 'system') {
          return getSystemTheme();
        }
        return theme;
      },
    }),
    {
      name: 'checklist-settings',
    }
  )
) 