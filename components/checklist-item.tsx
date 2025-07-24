"use client"

import { Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { findMatchingEmoji } from '@/lib/emoji-utils'
import { useSettings } from '@/lib/settings-store'

interface Item {
  id: string
  text: string
  completed: boolean
  order: number
}

interface ChecklistItemProps {
  item: Item
  onToggle: (itemId: string, completed: boolean) => void
  onDelete: (itemId: string) => void
  completed?: boolean
}

export function ChecklistItem({
  item,
  onToggle,
  onDelete,
  completed = false
}: ChecklistItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const { showEmojis } = useSettings()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Get matching emoji for the item text
  const emoji = showEmojis ? findMatchingEmoji(item.text) : ''
  const displayText = showEmojis ? `${emoji}  ${item.text}` : item.text

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-3 p-3 bg-background hover:bg-muted/50 border border-border rounded-lg transition-all duration-200",
        isDragging && "opacity-50 scale-95 rotate-1 shadow-lg z-50",
        completed && "opacity-80"
      )}
    >
      {/* Drag Handle */}
      <button
        type="button" 
        {...attributes}
        {...listeners}
        className="text-muted-foreground hover:text-foreground cursor-move touch-manipulation"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Checkbox */}
      <div className="relative flex items-center">
        <input
          type="checkbox"
          checked={item.completed}
          onChange={(e) => onToggle(item.id, e.target.checked)}
          className={cn(
            "h-4 w-4 rounded border-input focus:ring-2 focus:ring-offset-2 focus:ring-ring",
            "bg-background transition-colors duration-200",
            item.completed && "bg-primary border-primary"
          )}
        />
      </div>

      {/* Text */}
      <span
        className={cn(
          "flex-1 text-sm transition-all duration-200",
          item.completed
            ? "line-through text-muted-foreground"
            : "text-foreground"
        )}
      >
        {displayText}
      </span>

      {/* Delete Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(item.id)}
        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
} 