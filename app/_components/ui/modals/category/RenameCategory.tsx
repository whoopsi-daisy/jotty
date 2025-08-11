"use client";

import { useState } from "react";
import { Button } from "@/app/_components/ui/elements/button";
import { Edit3 } from "lucide-react";
import { Modal } from "../../elements/modal";

interface RenameCategoryModalProps {
  isOpen: boolean;
  categoryName: string;
  onClose: () => void;
  onRename: (oldName: string, newName: string) => Promise<void>;
}

export function RenameCategoryModal({
  isOpen,
  categoryName,
  onClose,
  onRename,
}: RenameCategoryModalProps) {
  const [newName, setNewName] = useState(categoryName);
  const [isRenaming, setIsRenaming] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newName === categoryName) return;

    setIsRenaming(true);
    try {
      await onRename(categoryName, newName.trim());
      onClose();
    } catch (error) {
      console.error("Failed to rename category:", error);
    } finally {
      setIsRenaming(false);
    }
  };

  const handleClose = () => {
    setNewName(categoryName);
    onClose();
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Rename Category"
      titleIcon={<Edit3 className="h-5 w-5 text-primary" />}
    >
      <p className="text-sm text-muted-foreground mb-4">
        Enter a new name for &quot;{categoryName}&quot;
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Category Name
          </label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Enter category name..."
            autoFocus
          />
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isRenaming}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              !newName.trim() || newName === categoryName || isRenaming
            }
          >
            {isRenaming ? "Renaming..." : "Rename"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
