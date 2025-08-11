"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/app/_components/ui/elements/button";

interface ChecklistFormProps {
  onSubmit: (text: string) => void;
  isLoading?: boolean;
}

export function ChecklistForm({
  onSubmit,
  isLoading = false,
}: ChecklistFormProps) {
  const [newItemText, setNewItemText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    onSubmit(newItemText.trim());
    setNewItemText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-3 lg:p-6">
      <input
        type="text"
        value={newItemText}
        onChange={(e) => setNewItemText(e.target.value)}
        placeholder="Add new item..."
        className="flex-1 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        disabled={isLoading}
      />
      <Button
        type="submit"
        size="sm"
        disabled={isLoading || !newItemText.trim()}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  );
}
