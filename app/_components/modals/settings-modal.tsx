"use client"

import { Settings, Moon, Sun, Sunset, Waves, Trees, CloudMoon, Palette, Terminal, Github, Monitor, Coffee, Flower2, Flame, Palmtree } from 'lucide-react'
import { Button } from '@/app/_components/ui/elements/button'
import { Dropdown } from '@/app/_components/ui/elements/dropdown'
import { Modal } from '@/app/_components/ui/elements/modal'
import { useSettings } from '@/app/_utils/settings-store'
import { useRef } from 'react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

const THEMES = [
  { id: 'light' as const, name: 'Light', icon: Sun },
  { id: 'dark' as const, name: 'Dark', icon: Moon },
  { id: 'sunset' as const, name: 'Sunset', icon: Sunset },
  { id: 'ocean' as const, name: 'Ocean', icon: Waves },
  { id: 'forest' as const, name: 'Forest', icon: Trees },
  { id: 'nord' as const, name: 'Nord', icon: CloudMoon },
  { id: 'dracula' as const, name: 'Dracula', icon: Palette },
  { id: 'monokai' as const, name: 'Monokai', icon: Terminal },
  { id: 'github-dark' as const, name: 'GitHub Dark', icon: Github },
  { id: 'tokyo-night' as const, name: 'Tokyo Night', icon: Monitor },
  { id: 'catppuccin' as const, name: 'Catppuccin', icon: Coffee },
  { id: 'rose-pine' as const, name: 'Rose Pine', icon: Flower2 },
  { id: 'gruvbox' as const, name: 'Gruvbox', icon: Flame },
  { id: 'solarized-dark' as const, name: 'Solarized Dark', icon: Palmtree },
]

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, showEmojis, setTheme, setShowEmojis } = useSettings()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-muted-foreground" />
          <span>Settings</span>
        </div>
      }
    >
      {/* Theme Selection */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">Theme</h3>
        <Dropdown
          value={theme}
          options={THEMES}
          onChange={setTheme}
        />
      </div>

      {/* Emoji Toggle */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">Features</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm">Show Emojis</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={showEmojis}
                onChange={(e) => setShowEmojis(e.target.checked)}
                className="sr-only"
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${showEmojis ? 'bg-primary' : 'bg-muted'
                }`}>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showEmojis ? 'translate-x-4' : 'translate-x-0'
                  }`} />
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Done Button */}
      <div className="flex justify-end">
        <Button onClick={onClose}>
          Done
        </Button>
      </div>
    </Modal>
  )
} 