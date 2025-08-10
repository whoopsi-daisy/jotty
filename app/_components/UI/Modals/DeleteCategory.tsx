"use client";

import { Trash2, Folder, AlertTriangle } from "lucide-react";
import { Button } from "@/app/_components/UI/Elements/button";
import { Modal } from "@/app/_components/UI/Elements/modal";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  categoryName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteCategoryModal({
  isOpen,
  categoryName,
  onClose,
  onConfirm,
}: DeleteCategoryModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Category"
      titleIcon={<Trash2 className="h-5 w-5 text-destructive" />}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete the category &quot;{categoryName}
          &quot;?
          <br /> <br />
          <span className="text-destructive">
            This WILL delete all documents in this category and cannot be
            undone.
          </span>
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
  );
}
