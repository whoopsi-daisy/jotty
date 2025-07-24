"use client"

import { useState } from "react"
import { Trash2, Plus } from "lucide-react"
import { deleteList, createItem, updateItemAction, deleteItemAction } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { ChecklistItem } from "./checklist-item"

interface Item {
  id: string
  text: string
  completed: boolean
  order: number
}

interface List {
  id: string
  title: string
  items: Item[]
}

interface ChecklistCardProps {
  list: List
  onUpdate?: () => void
}

export function ChecklistCard({ list, onUpdate }: ChecklistCardProps) {
  const [newItemText, setNewItemText] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemText.trim()) return

    setIsLoading(true)
    const result = await createItem(list.id, newItemText.trim())
    setIsLoading(false)

    if (result.success) {
      setNewItemText("")
      onUpdate?.()
    }
  }

  const handleDeleteList = async () => {
    if (confirm("Are you sure you want to delete this list?")) {
      await deleteList(list.id)
      onUpdate?.()
    }
  }

  const handleToggleItem = async (itemId: string, completed: boolean) => {
    await updateItemAction(list.id, itemId, { completed })
    onUpdate?.()
  }

  const handleDeleteItem = async (itemId: string) => {
    await deleteItemAction(list.id, itemId)
    onUpdate?.()
  }

  const incompleteItems = list.items.filter(item => !item.completed)
  const completedItems = list.items.filter(item => item.completed)

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-foreground">{list.title}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDeleteList}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2 mb-4">
        {incompleteItems.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            onToggle={handleToggleItem}
            onDelete={handleDeleteItem}
          />
        ))}
      </div>

      {completedItems.length > 0 && (
        <div className="border-t border-border pt-4 mb-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Completed</h4>
          <div className="space-y-2">
            {completedItems.map((item) => (
              <ChecklistItem
                key={item.id}
                item={item}
                onToggle={handleToggleItem}
                onDelete={handleDeleteItem}
                completed
              />
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleCreateItem} className="flex gap-2">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Add new item..."
          className="flex-1 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          disabled={isLoading}
        />
        <Button type="submit" size="sm" disabled={isLoading || !newItemText.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
} 