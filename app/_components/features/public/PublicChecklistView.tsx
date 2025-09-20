"use client";

import { useMemo } from "react";
import { Checklist, Item } from "@/app/_types";
import { CheckSquare, BarChart3, Clock, User, PauseCircle } from "lucide-react";
import { cn } from "@/app/_utils/utils";

interface PublicChecklistViewProps {
  checklist: Checklist;
}

const TASK_STATUS_CONFIG = {
  completed: {
    title: "Completed",
    Icon: CheckSquare,
    iconClassName: "text-green-600",
    badgeClassName: "bg-green-100 text-green-800",
  },
  in_progress: {
    title: "In Progress",
    Icon: BarChart3,
    iconClassName: "text-blue-600",
    badgeClassName: "bg-blue-100 text-blue-800",
  },
  paused: {
    title: "Paused",
    Icon: PauseCircle,
    iconClassName: "text-yellow-600",
    badgeClassName: "bg-yellow-100 text-yellow-800",
  },
  todo: {
    title: "To Do",
    Icon: CheckSquare,
    iconClassName: "text-muted-foreground",
    badgeClassName: "bg-gray-100 text-gray-800",
  },
};

const formatTrackedTime = (entries: any[] = []): string => {
  if (entries.length === 0) return "";
  const totalMilliseconds = entries.reduce((total, entry) => {
    const start = new Date(entry.startTime).getTime();
    const end = entry.endTime ? new Date(entry.endTime).getTime() : Date.now();
    return total + (end - start);
  }, 0);

  const totalMinutes = Math.floor(totalMilliseconds / 60000);
  if (totalMinutes < 1) return "Less than a minute";
  if (totalMinutes === 1) return "1 minute";
  return `${totalMinutes} minutes`;
};

export function PublicChecklistView({ checklist }: PublicChecklistViewProps) {
  const { completedCount, totalCount, progressPercentage } = useMemo(() => {
    const total = checklist.items.length;
    if (total === 0) {
      return { completedCount: 0, totalCount: 0, progressPercentage: 0 };
    }
    const completed = checklist.items.filter(
      (item) => item.completed || item.status === "completed"
    ).length;
    return {
      completedCount: completed,
      totalCount: total,
      progressPercentage: Math.round((completed / total) * 100),
    };
  }, [checklist.items]);

  const taskItemsByStatus = useMemo(() => {
    if (checklist.type !== "task") return null;
    return checklist.items.reduce(
      (acc: Record<string, Item[]>, item: Item) => {
        const status = item.status || "todo";
        if (acc[status]) {
          acc[status].push(item);
        }
        return acc;
      },
      { completed: [], in_progress: [], paused: [], todo: [] } as Record<string, Item[]>
    );
  }, [checklist.items, checklist.type]);

  const checklistIcon =
    checklist.type === "task" ? (
      <BarChart3 className="h-8 w-8 text-primary" />
    ) : (
      <CheckSquare className="h-8 w-8 text-primary" />
    );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {checklistIcon}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {checklist.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>by {checklist.owner}</span>
                </div>
                {checklist.category && <span>• {checklist.category}</span>}
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Updated {new Date(checklist.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {totalCount > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Progress</span>
                <span className="text-sm text-muted-foreground">
                  {completedCount} of {totalCount} completed ({progressPercentage}%)
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </header>

        <main className="space-y-6">
          {totalCount === 0 ? (
            <div className="text-center py-12">
              <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No items yet</h3>
              <p className="text-muted-foreground">This checklist is empty.</p>
            </div>
          ) : checklist.type === "task" && taskItemsByStatus ? (
            Object.entries(taskItemsByStatus)
              .sort(([a], [b]) => Object.keys(TASK_STATUS_CONFIG).indexOf(a) - Object.keys(TASK_STATUS_CONFIG).indexOf(b))
              .map(([status, items]: [string, Item[]]) => {
                if (items.length === 0) return null;
                const config = TASK_STATUS_CONFIG[status as keyof typeof TASK_STATUS_CONFIG];
                return (
                  <div key={status}>
                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                      <config.Icon className={cn("h-5 w-5", config.iconClassName)} />
                      {config.title} ({items.length})
                    </h3>
                    <div className="space-y-2">
                      {items.map((item: Item) => (
                        <ChecklistItem key={item.id} item={item} type="task" />
                      ))}
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="space-y-3">
              {checklist.items.map((item) => (
                <ChecklistItem key={item.id} item={item} type="simple" />
              ))}
            </div>
          )}
        </main>

        <footer className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            This checklist is shared publicly by {checklist.owner}
          </p>
        </footer>
      </div>
    </div>
  );
}

function ChecklistItem({ item, type }: { item: Item; type: "simple" | "task" }) {
  const isCompleted = item.completed || item.status === "completed";
  const statusConfig = item.status ? TASK_STATUS_CONFIG[item.status as keyof typeof TASK_STATUS_CONFIG] : null;

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border transition-colors",
        isCompleted
          ? "bg-muted/50 border-muted text-muted-foreground"
          : "bg-card border-border hover:bg-accent/50"
      )}
    >
      <div className="flex-shrink-0 mt-0.5">
        <div
          className={cn(
            "w-5 h-5 rounded border-2 flex items-center justify-center",
            isCompleted
              ? "bg-primary border-primary text-primary-foreground"
              : "border-muted-foreground"
          )}
        >
          {isCompleted && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-foreground">{item.text}</span>
          {type === "task" && item.status && statusConfig && (
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap",
                statusConfig.badgeClassName
              )}
            >
              {item.status.replace("_", " ")}
            </span>
          )}
        </div>
        {type === "task" && item.timeEntries && item.timeEntries.length > 0 && (
          <div className="text-xs text-muted-foreground">
            Time tracked: {formatTrackedTime(item.timeEntries)}
          </div>
        )}
      </div>
    </div>
  );
}