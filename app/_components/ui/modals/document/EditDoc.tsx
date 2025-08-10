"use client";

import { useState, useEffect } from "react";
import { X, FileText, Plus } from "lucide-react";
import { Button } from "@/app/_components/ui/elements/button";
import {
  updateDocAction,
  createDocsCategoryAction,
} from "@/app/_server/actions/data/docs-actions";
import { Document, Category } from "@/app/_types";
import { Modal } from "../../elements/modal";

interface EditDocModalProps {
  doc: Document;
  onClose: () => void;
  onUpdated: () => void;
  categories: Category[];
}

export function EditDocModal({
  doc,
  onClose,
  onUpdated,
  categories,
}: EditDocModalProps) {
  const [title, setTitle] = useState(doc.title);
  const [category, setCategory] = useState(doc.category || "");
  const [newCategory, setNewCategory] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);

  useEffect(() => {
    setTitle(doc.title);
    setCategory(doc.category || "");
  }, [doc]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsUpdating(true);

    try {
      // Create new category if needed
      if (showNewCategory && newCategory.trim()) {
        const categoryFormData = new FormData();
        categoryFormData.append("name", newCategory.trim());
        await createDocsCategoryAction(categoryFormData);
      }

      // Update the document
      const formData = new FormData();
      formData.append("id", doc.id);
      formData.append("title", title.trim());
      formData.append(
        "category",
        showNewCategory ? newCategory.trim() : category
      );
      formData.append("content", doc.content);

      const result = await updateDocAction(formData);

      if (result.success) {
        onUpdated();
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Edit Document"
      titleIcon={<FileText className="h-5 w-5 text-primary" />}
    >
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="text-sm font-medium text-foreground"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="Enter document title..."
            autoFocus
            required
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="text-sm font-medium text-foreground"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="Enter document title..."
            autoFocus
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="category"
            className="text-sm font-medium text-foreground"
          >
            Category
          </label>
          {!showNewCategory ? (
            <div className="flex gap-2">
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value="">Select a category...</option>
                <option value="Uncategorized">Uncategorized</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewCategory(true)}
                className="px-3"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="Enter new category name..."
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowNewCategory(false);
                  setNewCategory("");
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!title.trim() || isUpdating}
            className="flex-1"
          >
            {isUpdating ? "Updating..." : "Update Document"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
