"use client"

import { useState } from 'react'
import { ArrowLeft, Plus, Trash2, Edit3, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChecklistItem } from './checklist-item'
import { deleteList, createItem, updateItemAction, deleteItemAction, reorderItemsAction } from '@/app/actions'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

interface Item {
  id: string
  text: string
  completed: boolean
  order: number
}

interface List {
  id: string
  title: string
  category?: string
  items: Item[]
  createdAt: string
  updatedAt: string
}

interface ChecklistViewProps {
  list: List
  onUpdate: () => void
  onBack: () => void
  onEdit?: (checklist: List) => void
  onDelete?: () => void
}

export function ChecklistView({ list, onUpdate, onBack, onEdit, onDelete }: ChecklistViewProps) {
  const [newItemText, setNewItemText] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemText.trim()) return

    setIsLoading(true)
    const result = await createItem(list.id, newItemText.trim())
    setIsLoading(false)

    if (result.success) {
      setNewItemText("")
      onUpdate()
    }
  }

  const handleDeleteList = async () => {
    if (confirm("Are you sure you want to delete this checklist?")) {
      await deleteList(list.id)
      onDelete?.()
    }
  }

  const handleToggleItem = async (itemId: string, completed: boolean) => {
    await updateItemAction(list.id, itemId, { completed })
    onUpdate()
  }

  const handleDeleteItem = async (itemId: string) => {
    await deleteItemAction(list.id, itemId)
    onUpdate()
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = list.items.findIndex(item => item.id === active.id)
      const newIndex = list.items.findIndex(item => item.id === over?.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(list.items, oldIndex, newIndex)
        const itemIds = newItems.map(item => item.id)
        await reorderItemsAction(list.id, itemIds)
        onUpdate()
      }
    }
  }

  const incompleteItems = list.items.filter(item => !item.completed)
  const completedItems = list.items.filter(item => item.completed)
  const completedCount = completedItems.length
  const totalCount = list.items.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border px-3 py-2 lg:px-6 lg:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 lg:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="h-8 w-8 lg:h-10 lg:w-10 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <ArrowLeft className="h-4 w-4 lg:h-5 lg:w-5" />
            </Button>
            <div>
              <h2 className="text-lg lg:text-2xl font-bold text-foreground">{list.title}</h2>
              {list.category && (
                <p className="text-xs lg:text-sm text-muted-foreground mt-0.5 lg:mt-1">{list.category}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1 lg:gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit?.(list)}
              className="h-8 w-8 lg:h-10 lg:w-10 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <Edit3 className="h-4 w-4 lg:h-5 lg:w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteList}
              className="h-8 w-8 lg:h-10 lg:w-10 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 lg:h-5 lg:w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Progress - Fixed on mobile, normal on desktop */}
      {totalCount > 0 && (
        <div className="fixed lg:static bottom-0 left-0 right-0 z-10 bg-background border-t lg:border-t-0 lg:border-b border-border px-3 py-2 lg:px-6 lg:py-4">
          <div className="flex items-center justify-between mb-2 lg:mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Progress</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {completedCount} of {totalCount} completed
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full transition-all duration-300 bg-gradient-to-r from-primary/80 to-primary"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Content - Add padding bottom on mobile for fixed progress bar */}
      <div className="flex-1 overflow-y-auto p-3 lg:p-6 bg-background-secondary">
        <div className="max-w-4xl mx-auto space-y-4 lg:space-y-6 pb-20 lg:pb-0">
          {/* Add Item Form */}
          <div className="bg-background rounded-lg border border-border p-4">
            <form onSubmit={handleCreateItem} className="flex gap-3">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Add new item..."
                className="flex-1 px-4 py-2.5 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={isLoading || !newItemText.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add
              </Button>
            </form>
          </div>

          {/* Incomplete Items */}
          {incompleteItems.length > 0 && (
            <div className="bg-background rounded-lg border border-border p-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                To Do ({incompleteItems.length})
              </h3>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={incompleteItems.map(item => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {incompleteItems.map((item) => (
                      <ChecklistItem
                        key={item.id}
                        item={item}
                        onToggle={handleToggleItem}
                        onDelete={handleDeleteItem}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          {/* Completed Items */}
          {completedItems.length > 0 && (
            <div className="bg-background rounded-lg border border-border p-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Completed ({completedItems.length})
              </h3>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={completedItems.map(item => item.id)}
                  strategy={verticalListSortingStrategy}
                >
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
                </SortableContext>
              </DndContext>
            </div>
          )}

          {/* Empty State */}
          {list.items.length === 0 && (
            <div className="bg-background rounded-lg border border-border p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No items yet</h3>
              <p className="text-muted-foreground mb-6">
                Add your first item to get started with this checklist.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 