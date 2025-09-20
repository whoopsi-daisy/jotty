"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Users,
  FileText,
  CheckSquare,
  BarChart3,
  Edit,
  User,
} from "lucide-react";
import { cn } from "@/app/_utils/utils";
import { Button } from "@/app/_components/ui/elements/button";
import { Checklist, Note } from "@/app/_types";

interface SharedItemsListProps {
  items: (Checklist | Note)[];
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onItemClick: (item: Checklist | Note) => void;
  onEditItem?: (item: Checklist | Note) => void;
  isItemSelected: (item: Checklist | Note) => boolean;
  mode: "checklists" | "notes";
}

export function SharedItemsList({
  items,
  collapsed,
  onToggleCollapsed,
  onItemClick,
  onEditItem,
  isItemSelected,
  mode,
}: SharedItemsListProps) {
  const [collapsedUsers, setCollapsedUsers] = useState<Set<string>>(new Set());

  const sharedItems = items.filter((item) => item.isShared);

  if (sharedItems.length === 0) {
    return null;
  }

  const groupedByOwner = sharedItems.reduce((acc, item) => {
    const owner = item.owner || "Unknown";
    if (!acc[owner]) {
      acc[owner] = [];
    }
    acc[owner].push(item);
    return acc;
  }, {} as Record<string, (Checklist | Note)[]>);

  const toggleUserCollapsed = (owner: string) => {
    setCollapsedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(owner)) {
        newSet.delete(owner);
      } else {
        newSet.add(owner);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between group">
        <button
          onClick={onToggleCollapsed}
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors w-full text-left",
            "hover:bg-muted/50 cursor-pointer"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          <Users className="h-4 w-4 text-primary" />
          <span className="truncate font-medium text-primary">
            Shared with you
          </span>
          <span className="text-xs text-muted-foreground ml-auto">
            {sharedItems.length}
          </span>
        </button>
      </div>

      {!collapsed && (
        <div className="ml-6 space-y-1">
          {Object.entries(groupedByOwner).map(([owner, ownerItems]) => {
            const isUserCollapsed = collapsedUsers.has(owner);

            return (
              <div key={owner} className="space-y-1">
                <button
                  onClick={() => toggleUserCollapsed(owner)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors w-full text-left",
                    "hover:bg-muted/50 cursor-pointer"
                  )}
                >
                  {isUserCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate font-medium text-foreground">
                    {owner}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {ownerItems.length}
                  </span>
                </button>

                {!isUserCollapsed && (
                  <div className="ml-6 space-y-1">
                    {ownerItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center group/item"
                      >
                        <button
                          onClick={() => onItemClick(item)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors flex-1 text-left truncate",
                            isItemSelected(item)
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted/50 text-foreground"
                          )}
                        >
                          {mode === "notes" ? (
                            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <>
                              {"type" in item && item.type === "task" ? (
                                <BarChart3 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              ) : (
                                <CheckSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              )}
                            </>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="truncate">{item.title}</div>
                          </div>
                        </button>
                        {onEditItem && !isItemSelected(item) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditItem(item);
                            }}
                            className="h-8 w-8 p-0 opacity-0 hover:bg-muted/50 text-foreground group-hover/item:opacity-100 transition-opacity"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
