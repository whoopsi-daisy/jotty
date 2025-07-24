"use client"

import { useState } from 'react'
import { createCategoryAction } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'

interface CreateCategoryModalProps {
  onClose: () => void
  onCreated: () => void
}

export function CreateCategoryModal({ onClose, onCreated }: CreateCategoryModalProps) {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)
    const result = await createCategoryAction(name.trim())
    setIsLoading(false)

    if (result.success) {
      onCreated()
    }
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Create New Category"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Category Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name..."
            className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            required
            disabled={isLoading}
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
            disabled={isLoading || !name.trim()}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLoading ? 'Creating...' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Modal>
  )
} 