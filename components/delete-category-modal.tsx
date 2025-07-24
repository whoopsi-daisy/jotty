"use client"

import { Trash2, Folder, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DeleteCategoryModalProps {
  categoryName: string
  listCount: number
  onClose: () => void
  onConfirm: (deleteLists: boolean) => void
}

export function DeleteCategoryModal({ 
  categoryName, 
  listCount, 
  onClose, 
  onConfirm 
}: DeleteCategoryModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Delete Category
            </h3>
            <p className="text-sm text-muted-foreground">
              What would you like to do with the lists?
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-foreground mb-4">
            The category <span className="font-semibold">"{categoryName}"</span> contains{' '}
            <span className="font-semibold">{listCount} list{listCount !== 1 ? 's' : ''}</span>.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 border border-border rounded-lg">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Folder className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground text-sm">
                  Move to Uncategorized
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Keep all lists but remove them from this category
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Trash2 className="h-4 w-4 text-destructive" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground text-sm">
                  Delete All Lists
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Permanently delete all lists in this category
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-border text-foreground hover:bg-muted/50"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => onConfirm(false)}
            className="flex-1 text-primary hover:bg-primary/10 border-primary"
          >
            Move Lists
          </Button>
          <Button
            variant="destructive"
            onClick={() => onConfirm(true)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            Delete All
          </Button>
        </div>
      </div>
    </div>
  )
} 