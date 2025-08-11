"use client";

import { Trash2, GripVertical } from "lucide-react";
import { Button } from "@/app/_components/ui/elements/button";
import { cn } from "@/app/_utils/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { findMatchingEmoji } from "@/app/_utils/emoji-utils";
import { useSettings } from "@/app/_utils/settings-store";
import { useState, useEffect } from "react";

interface Item {
  id: string;
  text: string;
  completed: boolean;
  order: number;
}

interface ChecklistItemProps {
  item: Item;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  completed?: boolean;
}

export function ChecklistItem({
  item,
  onToggle,
  onDelete,
  completed = false,
}: ChecklistItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const { showEmojis } = useSettings();
  const [emoji, setEmoji] = useState<string>("");

  useEffect(() => {
    if (showEmojis) {
      findMatchingEmoji(item.text).then(setEmoji);
    } else {
      setEmoji("");
    }
  }, [item.text, showEmojis]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const displayText = showEmojis ? `${emoji}  ${item.text}` : item.text;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-3 p-3 bg-background hover:bg-muted/50 border border-border rounded-lg transition-all duration-200",
        isDragging && "opacity-50 scale-95 rotate-1 shadow-lg z-50",
        completed && "opacity-80"
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="text-muted-foreground hover:text-foreground cursor-move touch-manipulation"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="relative flex items-center">
        <input
          type="checkbox"
          checked={item.completed}
          id={item.id}
          onChange={(e) => onToggle(item.id, e.target.checked)}
          className={cn(
            "h-5 w-5 rounded border-input focus:ring-2 focus:ring-offset-2 focus:ring-ring",
            "bg-background transition-colors duration-200",
            item.completed && "bg-primary border-primary"
          )}
        />
      </div>

      <label
        htmlFor={item.id}
        className={cn(
          "flex-1 text-sm transition-all duration-200 cursor-pointer",
          item.completed
            ? "line-through text-muted-foreground"
            : "text-foreground"
        )}
      >
        {displayText}
      </label>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(item.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
