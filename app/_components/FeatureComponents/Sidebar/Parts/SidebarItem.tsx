"use client";

import {
  FileText,
  CheckSquare,
  BarChart3,
  Edit,
  Users,
  Globe,
} from "lucide-react";
import { Button } from "@/app/_components/GlobalComponents/Buttons/Button";
import { cn } from "@/app/_utils/global-utils";
import { AppMode, Checklist, Note } from "@/app/_types";
import { Modes } from "@/app/_types/enums";

interface SharingStatus {
  isShared: boolean;
  isPubliclyShared: boolean;
  sharedWith: string[];
}

interface SidebarItemProps {
  item: Checklist | Note;
  mode: AppMode;
  isSelected: boolean;
  onItemClick: (item: Checklist | Note) => void;
  onEditItem?: (item: Checklist | Note) => void;
  sharingStatus?: SharingStatus | null;
  style?: React.CSSProperties;
}

export const SidebarItem = ({
  item,
  mode,
  isSelected,
  onItemClick,
  onEditItem,
  sharingStatus,
  style,
}: SidebarItemProps) => {
  return (
    <div className="flex items-center group/item" style={style}>
      <button
        onClick={() => onItemClick(item)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors flex-1 text-left truncate",
          isSelected
            ? "bg-primary/10 text-primary"
            : "hover:bg-muted/50 text-foreground"
        )}
      >
        {mode === Modes.NOTES ? (
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
        <span className="truncate flex-1">{item.title}</span>

        <div className="flex items-center gap-1 flex-shrink-0">
          {sharingStatus?.isPubliclyShared && (
            <Globe className="h-3 w-3 text-primary" />
          )}
          {sharingStatus?.isShared && !sharingStatus.isPubliclyShared && (
            <Users className="h-3 w-3 text-primary" />
          )}
        </div>
      </button>

      {onEditItem && !isSelected && (
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
  );
};
