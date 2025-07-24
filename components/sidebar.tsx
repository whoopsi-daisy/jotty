"use client"

import { useState } from 'react'
import {
  Search,
  Plus,
  Folder,
  FolderPlus,
  Home,
  X,
  Edit3,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { deleteCategoryAction, moveChecklistAction } from '@/app/actions'
import { DeleteCategoryModal } from './delete-category-modal'

interface Checklist {
  id: string
  title: string
  category?: string
  items: any[]
  createdAt: string
  updatedAt: string
}

interface Category {
  name: string
  count: number
}

interface SidebarProps {
  selectedChecklist: string | null
  onSelectChecklist: (id: string | null) => void
  onUpdate: () => void
  isOpen: boolean
  onClose: () => void
  onOpenCreateModal: () => void
  onOpenCategoryModal: () => void
  onOpenEditModal: (checklist: Checklist) => void
  categories: Category[]
  checklists: Checklist[]
}

export function Sidebar({
  selectedChecklist,
  onSelectChecklist,
  onUpdate,
  isOpen,
  onClose,
  onOpenCreateModal,
  onOpenCategoryModal,
  onOpenEditModal,
  categories,
  checklists
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)

  const filteredChecklists = (checklists || []).filter(list =>
    list.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (list.category && list.category.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const groupedChecklists = (categories || []).map(category => ({
    ...category,
    checklists: filteredChecklists.filter(list =>
      (list.category || 'Uncategorized') === category.name
    )
  }))

  const handleChecklistSelect = (id: string | null) => {
    onSelectChecklist(id)
    onClose() // Close sidebar on mobile after selection
  }

  const handleDeleteCategory = async (categoryName: string) => {
    setCategoryToDelete(categoryName)
    setShowDeleteCategoryModal(true)
  }

  const handleConfirmDeleteCategory = async (deleteLists: boolean) => {
    if (!categoryToDelete) return

    try {
      if (deleteLists) {
        // Delete the category and all its lists
        const result = await deleteCategoryAction(categoryToDelete)
        if (result.success) {
          onUpdate()
        } else {
          alert('Failed to delete category')
        }
      } else {
        // Move all lists to uncategorized
        const categoryLists = checklists.filter(list => list.category === categoryToDelete)
        for (const list of categoryLists) {
          await moveChecklistAction(list.id, undefined) // undefined = uncategorized
        }
        // Then delete the empty category
        const result = await deleteCategoryAction(categoryToDelete)
        if (result.success) {
          onUpdate()
        } else {
          alert('Failed to delete category')
        }
      }
    } catch (error) {
      alert('An error occurred while processing the category deletion')
    } finally {
      setShowDeleteCategoryModal(false)
      setCategoryToDelete(null)
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-background border-r border-border transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h1 className="text-xl font-bold text-foreground">Checklists</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenCreateModal}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground lg:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search checklists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-4 space-y-6">
              {/* Home */}
              <div>
                <div
                  onClick={() => handleChecklistSelect(null)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
                    !selectedChecklist
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Home className="h-4 w-4" />
                  Home
                </div>
              </div>

              {/* Categories */}
              {groupedChecklists.map((category) => (
                <div key={category.name}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Folder className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground capitalize">
                        {category.name}
                      </span>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteCategory(category.name)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="space-y-1">
                    {category.checklists.map((checklist) => (
                      <div
                        key={checklist.id}
                        onClick={() => handleChecklistSelect(checklist.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 group cursor-pointer",
                          selectedChecklist === checklist.id
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <span className="truncate font-medium">{checklist.title}</span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                              e.stopPropagation()
                              onOpenEditModal(checklist)
                            }}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenCategoryModal}
              className="w-full"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              New Category
            </Button>
          </div>
        </div>
      </div>
      
      {/* Delete Category Modal */}
      {showDeleteCategoryModal && categoryToDelete && (
        <DeleteCategoryModal
          categoryName={categoryToDelete}
          listCount={checklists.filter(list => list.category === categoryToDelete).length}
          onClose={() => {
            setShowDeleteCategoryModal(false)
            setCategoryToDelete(null)
          }}
          onConfirm={handleConfirmDeleteCategory}
        />
      )}
    </>
  )
} 