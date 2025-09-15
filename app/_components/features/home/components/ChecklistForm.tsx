"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, ClipboardList } from "lucide-react";
import { Button } from "@/app/_components/ui/elements/button";

interface ChecklistFormProps {
  onSubmit: (text: string) => void;
  onBulkSubmit?: (itemsText: string) => void;
  isLoading?: boolean;
  autoFocus?: boolean;
  focusKey?: number;
}

export function ChecklistForm({
  onSubmit,
  onBulkSubmit,
  isLoading = false,
  autoFocus = false,
  focusKey = 0,
}: ChecklistFormProps) {
  const [newItemText, setNewItemText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    onSubmit(newItemText.trim());
    setNewItemText("");
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusKey]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        ref={inputRef}
        type="text"
        value={newItemText}
        onChange={(e) => setNewItemText(e.target.value)}
        placeholder="Add new item..."
        className="flex-1 px-4 py-3 border border-input bg-background rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-ring transition-colors"
        disabled={isLoading}
      />
      <div className="flex gap-2">
        {onBulkSubmit && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => onBulkSubmit("")}
            disabled={isLoading}
            title="Bulk add items"
            className="px-4"
          >
            <ClipboardList className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Bulk</span>
          </Button>
        )}
        <Button
          type="submit"
          size="lg"
          disabled={isLoading || !newItemText.trim()}
          className="px-6"
        >
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Add Item</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>
    </form>
  );
}
