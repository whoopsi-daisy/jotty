import { Item } from "@/app/_types";
import { TaskStatus } from "../_types/enums";

export const isItemCompleted = (item: Item, checklistType: string): boolean => {
  if (checklistType === "task") {
    return item.status === TaskStatus.COMPLETED;
  }
  return !!item.completed;
};

export const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

export const getCompletionRate = (
  items: Item[],
  checklistType?: string
): number => {
  const total = items.length;
  if (total === 0) return 0;
  const completed = items.filter((item) =>
    isItemCompleted(item, checklistType || "")
  ).length;
  return Math.round((completed / total) * 100);
};
