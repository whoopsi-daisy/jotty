"use client";

import { useState, useEffect } from "react";
import { Checklist } from "@/app/_types";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanBoard } from "./tasks/KanbanBoard";
import { useChecklist } from "./hooks/simple-checklist-hooks";

import { ChecklistHeader } from "./common/ChecklistHeader";
import { ChecklistHeading } from "./common/ChecklistHeading";
import { ChecklistBody } from "./simple/ChecklistBody";
import { ChecklistModals } from "./common/ChecklistModals";

interface ChecklistViewProps {
  list: Checklist;
  onUpdate: (updatedChecklist: Checklist) => void;
  onBack: () => void;
  onEdit?: (checklist: Checklist) => void;
  onDelete?: (deletedId: string) => void;
  currentUsername?: string;
  isAdmin?: boolean;
}

export const ChecklistView = ({
  list,
  onUpdate,
  onBack,
  onEdit,
  onDelete,
  currentUsername,
  isAdmin = false,
}: ChecklistViewProps) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const checklistHookProps = useChecklist({ list, onUpdate, onDelete });
  const {
    localList,
    setShowShareModal,
    handleConvertType,
    handleDeleteList,
    focusKey,
    handleCreateItem,
    setShowBulkPasteModal,
    isLoading,
  } = checklistHookProps;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const canDelete = localList.isShared
    ? isAdmin || currentUsername === localList.owner
    : true;
  const deleteHandler = canDelete ? handleDeleteList : undefined;

  if (!isClient) {
    return (
      <div className="h-full flex flex-col bg-background">
        <ChecklistHeader
          checklist={localList}
          onBack={onBack}
          onEdit={() => onEdit?.(list)}
        />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading checklist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <ChecklistHeader
        checklist={localList}
        onBack={onBack}
        onEdit={() => onEdit?.(list)}
        onDelete={deleteHandler}
        onShare={() => setShowShareModal(true)}
        onConvertType={handleConvertType}
      />

      {localList.type === "simple" && (
        <ChecklistHeading
          checklist={localList}
          key={focusKey}
          onSubmit={handleCreateItem}
          onBulkSubmit={() => setShowBulkPasteModal(true)}
          isLoading={isLoading}
          autoFocus={true}
          focusKey={focusKey}
          placeholder="Add new item..."
          submitButtonText="Add Item"
        />
      )}

      {localList.type === "simple" ? (
        <ChecklistBody
          {...checklistHookProps}
          sensors={sensors}
          isLoading={isLoading}
        />
      ) : (
        <div className="flex-1 overflow-hidden p-4">
          <KanbanBoard checklist={localList} onUpdate={onUpdate} />
        </div>
      )}

      <ChecklistModals {...checklistHookProps} isLoading={isLoading} />
    </div>
  );
};
