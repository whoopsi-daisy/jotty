"use client"

import { Trash2, Folder, AlertTriangle } from 'lucide-react'
import { Button } from '@/app/_components/ui/elements/button'
import { Modal } from '@/app/_components/ui/elements/modal'

interface DeleteCategoryModalProps {
  isOpen: boolean
  categoryName: string
  onClose: () => void
  onConfirm: () => void
}

export function DeleteCategoryModal({
  isOpen,
  categoryName,
  onClose,
  onConfirm
}: DeleteCategoryModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Trash2 className="h-5 w-5 text-destructive" />
          <span>Delete Category</span>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete the category "{categoryName}"? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  )
} 