"use client";

import { AlertTriangle, CheckSquare, BarChart3 } from "lucide-react";
import { Button } from "@/app/_components/ui/elements/button";
import { Modal } from "@/app/_components/ui/modals/Modal";
import { ChecklistType } from "@/app/_types";

interface ConversionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentType: ChecklistType;
  newType: ChecklistType;
}

export function ConversionConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  currentType,
  newType,
}: ConversionConfirmModalProps) {
  const isConvertingToSimple = newType === "simple";
  const hasTaskData = currentType === "task";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Convert Checklist Type"
      titleIcon={<AlertTriangle className="h-5 w-5 text-destructive" />}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            {currentType === "task" ? (
              <BarChart3 className="h-4 w-4 text-primary" />
            ) : (
              <CheckSquare className="h-4 w-4 text-primary" />
            )}
            <span className="text-sm font-medium text-foreground">
              {currentType === "task" ? "Task Project" : "Simple Checklist"}
            </span>
          </div>
          <span className="text-muted-foreground">→</span>
          <div className="flex items-center gap-2">
            {newType === "task" ? (
              <BarChart3 className="h-4 w-4 text-primary" />
            ) : (
              <CheckSquare className="h-4 w-4 text-primary" />
            )}
            <span className="text-sm font-medium text-foreground">
              {newType === "task" ? "Task Project" : "Simple Checklist"}
            </span>
          </div>
        </div>

        {isConvertingToSimple && hasTaskData && (
          <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
            <h3 className="text-sm font-medium text-destructive mb-2">
              ⚠️ Data Loss Warning
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• All task statuses will be reset</li>
              <li>• Time tracking data will be lost</li>
              <li>• Estimated times will be removed</li>
              <li>• Target dates will be cleared</li>
              <li>• Items will use simple completed/not completed</li>
            </ul>
          </div>
        )}

        {!isConvertingToSimple && (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <h3 className="text-sm font-medium text-primary mb-2">
              ✨ Enhanced Features
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Kanban board with drag & drop</li>
              <li>• Task status tracking (Todo, In Progress, Completed)</li>
              <li>• Time tracking with timer</li>
              <li>• Estimated time and target dates</li>
              <li>• Mobile-friendly status buttons</li>
            </ul>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          {isConvertingToSimple && hasTaskData
            ? "This action cannot be undone. Are you sure you want to convert to a simple checklist?"
            : "Are you sure you want to convert this checklist type?"}
        </p>
      </div>

      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button
          variant={
            isConvertingToSimple && hasTaskData ? "destructive" : "default"
          }
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="flex-1"
        >
          {isConvertingToSimple && hasTaskData ? "Convert & Reset" : "Convert"}
        </Button>
      </div>
    </Modal>
  );
}
