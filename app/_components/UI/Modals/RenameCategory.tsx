"use client";

import { useState } from "react";
import { Button } from "@/app/_components/UI/Elements/button";
import { Edit3 } from "lucide-react";
import { Modal } from "../Elements/modal";

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
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Edit3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Rename Category
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter a new name for &quot;{categoryName}&quot;
            </p>
          </div>
        </div>

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
      </div>
    </Modal>
  );
}
