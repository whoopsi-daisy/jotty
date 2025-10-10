"use client";

import { CheckSquare, FileText } from "lucide-react";
import { Button } from "@/app/_components/GlobalComponents/Buttons/Button";
import { cn } from "@/app/_utils/global-utils";
import { AppMode } from "@/app/_types";
import { Modes } from "@/app/_types/enums";

interface SidebarNavigationProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

interface ModeOption {
  id: AppMode;
  label: string;
  icon: React.ElementType;
}

export const SidebarNavigation = ({
  mode,
  onModeChange,
}: SidebarNavigationProps) => {
  const modes: ModeOption[] = [
    {
      id: Modes.CHECKLISTS,
      label: "Checklists",
      icon: CheckSquare,
    },
    {
      id: Modes.NOTES,
      label: "Notes",
      icon: FileText,
    },
  ];

  return (
    <div className="flex gap-1 p-2 border-b border-border">
      {modes.map((modeOption: ModeOption) => {
        const Icon = modeOption.icon;
        return (
          <Button
            key={modeOption.id}
            variant={mode === modeOption.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onModeChange(modeOption.id)}
            className={cn(
              "flex-1 justify-start gap-2 py-6",
              mode === modeOption.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {modeOption.label}
          </Button>
        );
      })}
    </div>
  );
};
