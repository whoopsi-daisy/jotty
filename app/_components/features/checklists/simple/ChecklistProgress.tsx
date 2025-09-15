"use client";

import { CheckCircle } from "lucide-react";
import { Checklist } from "@/app/_types";

interface ChecklistProgressProps {
  checklist: Checklist;
}

export function ChecklistProgress({ checklist }: ChecklistProgressProps) {
  const completedCount = checklist.items.filter((item) => {
    if (checklist.type === "task") {
      return item.status === "completed";
    }
    return item.completed;
  }).length;
  const totalCount = checklist.items.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-muted/50 px-3 py-2 lg:px-6 lg:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {completedCount} of {totalCount} completed
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="mt-2 w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
