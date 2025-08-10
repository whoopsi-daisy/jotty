"use client"

import { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Trash2, Edit3, CheckCircle, Share2, Users } from 'lucide-react'
import { Button } from '@/app/_components/ui/elements/button'
import { ChecklistItem } from './ChecklistItem'
import { ShareModal } from '@/app/_components/ui/modals/sharing/ShareModal'
import { deleteListAction, createItemAction, updateItemAction, deleteItemAction, reorderItemsAction } from '@/app/_server/actions/data/actions'
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
import { Checklist } from '@/app/_types'

interface ChecklistViewProps {
  list: Checklist
  onUpdate: () => void
  onBack: () => void
  onEdit?: (checklist: Checklist) => void
  onDelete?: () => void
}

export function ChecklistView({ list, onUpdate, onBack, onEdit, onDelete }: ChecklistViewProps) {
  const [newItemText, setNewItemText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [localList, setLocalList] = useState(list)

  // Update localList when prop changes
  useEffect(() => {
    setLocalList(list)
  }, [list])

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
    const formData = new FormData()
    formData.append('listId', localList.id)
    formData.append('text', newItemText.trim())
    const result = await createItemAction(formData)
    setIsLoading(false)

    if (result.success && result.data) {
      setNewItemText("")
      // Update local state immediately
      setLocalList(prev => ({
        ...prev,
        items: [...prev.items, result.data]
      }))
    }
    onUpdate()
  }

  const handleDeleteList = async () => {
    if (confirm("Are you sure you want to delete this checklist?")) {
      const formData = new FormData()
      formData.append('id', localList.id)
      formData.append('category', localList.category || 'Uncategorized')
      await deleteListAction(formData)
      onDelete?.()
    }
  }

  const handleToggleItem = async (itemId: string, completed: boolean) => {
    const formData = new FormData()
    formData.append('listId', localList.id)
    formData.append('itemId', itemId)
    formData.append('completed', String(completed))
    const result = await updateItemAction(formData)

    if (result.success) {
      // Update local state immediately
      setLocalList(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.id === itemId ? { ...item, completed } : item
        )
      }))
    }
    onUpdate()
  }

  const handleDeleteItem = async (itemId: string) => {
    const formData = new FormData()
    formData.append('listId', localList.id)
    formData.append('itemId', itemId)
    const result = await deleteItemAction(formData)

    if (result.success) {
      // Update local state immediately
      setLocalList(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== itemId)
      }))
    }
    onUpdate()
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = localList.items.findIndex(item => item.id === active.id)
      const newIndex = localList.items.findIndex(item => item.id === over?.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(localList.items, oldIndex, newIndex)
        const itemIds = newItems.map(item => item.id)
        const formData = new FormData()
        formData.append('listId', localList.id)
        formData.append('itemIds', JSON.stringify(itemIds))
        const result = await reorderItemsAction(formData)

        if (result.success) {
          // Update local state immediately
          setLocalList(prev => ({
            ...prev,
            items: newItems
          }))
        }
        onUpdate()
      }
    }
  }

  const incompleteItems = localList.items.filter(item => !item.completed)
  const completedItems = localList.items.filter(item => item.completed)
  const completedCount = completedItems.length
  const totalCount = localList.items.length
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
              <div className="flex items-center gap-2">
                <h2 className="text-lg lg:text-2xl font-bold text-foreground">{localList.title}</h2>
                {localList.isShared && (
                  <div title="Shared item">
                    <Users className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                  </div>
                )}
              </div>
              {localList.category && (
                <p className="text-xs lg:text-sm text-muted-foreground mt-0.5 lg:mt-1">{localList.category}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 lg:gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShareModal(true)}
              className="h-8 w-8 lg:h-10 lg:w-10 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <Share2 className="h-4 w-4 lg:h-5 lg:w-5" />
            </Button>
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

      {totalCount > 0 && (
        <div className="fixed lg:static bottom-0 left-0 right-0 z-10 bg-background border-t lg:border-t-0 lg:border-b border-border px-3 py-4 lg:px-6 lg:py-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between mb-2 lg:mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Progress</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {completedCount} of {totalCount} completed
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5 max-w-4xl mx-auto">
            <div
              className="h-2.5 rounded-full transition-all duration-300 bg-gradient-to-r from-primary/80 to-primary"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3 lg:p-6 bg-background-secondary">
        <div className="max-w-4xl mx-auto space-y-4 lg:space-y-6 pb-20 lg:pb-0">
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

          {localList.items.length === 0 && (
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

      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          itemId={localList.id}
          itemTitle={localList.title}
          itemType="checklist"
          itemCategory={localList.category}
          itemOwner={localList.owner || ""}
        />
      )}
    </div>
  )
} 