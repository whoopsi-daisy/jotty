"use client"

import { Menu, RefreshCw, Settings } from 'lucide-react'
import { Button } from './button'

interface HeaderProps {
  title: string
  subtitle?: string
  showSidebarToggle?: boolean
  onSidebarToggle?: () => void
  onRefresh?: () => void
  isRefreshing?: boolean
  onOpenSettings?: () => void
}

export function Header({
  title,
  subtitle,
  showSidebarToggle = false,
  onSidebarToggle,
  onRefresh,
  isRefreshing = false,
  onOpenSettings
}: HeaderProps) {
  return (
    <header className="bg-background border-b border-border px-4 py-3 lg:px-6 lg:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showSidebarToggle && onSidebarToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSidebarToggle}
              className="lg:hidden h-10 w-10 p-0 text-muted-foreground hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-foreground">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="h-10 w-10 p-0 text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          )}
          {onOpenSettings && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenSettings}
              className="h-10 w-10 p-0 text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
} 