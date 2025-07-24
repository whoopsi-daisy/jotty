"use client"

import { useState } from 'react'
import { X, Folder, ListTodo } from 'lucide-react'
import { createList } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Dropdown } from '@/components/ui/dropdown'
import { Modal } from '@/components/ui/modal'

interface Category {
  name: string
  count: number
}

interface CreateListModalProps {
  onClose: () => void
  onCreated: () => void
  categories: Category[]
}

export function CreateListModal({ onClose, onCreated, categories }: CreateListModalProps) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Format categories for the dropdown
  const categoryOptions = [
    { id: '', name: 'Uncategorized', icon: ListTodo },
    ...categories.map(cat => ({
      id: cat.name,
      name: `${cat.name} (${cat.count})`,
      icon: Folder
    }))
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)
    const result = await createList(title.trim(), category || undefined)
    setIsLoading(false)

    if (result.success) {
      onCreated()
    }
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Create New Checklist"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Checklist Name *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter checklist name..."
            className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Category
          </label>
          <Dropdown
            value={category}
            options={categoryOptions}
            onChange={setCategory}
            className="w-full"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 border-border text-foreground hover:bg-muted/50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !title.trim()}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLoading ? 'Creating...' : 'Create Checklist'}
          </Button>
        </div>
      </form>
    </Modal>
  )
} 