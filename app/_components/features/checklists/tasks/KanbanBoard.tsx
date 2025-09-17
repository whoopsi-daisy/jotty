"use client";

import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { Checklist } from "@/app/_types";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanItem } from "./KanbanItem";
import { ChecklistHeading } from "../../checklists/common/ChecklistHeading";
import { createItemAction, updateItemStatusAction, getLists, createBulkItemsAction } from "@/app/_server/actions/data/actions";
import { BulkPasteModal } from "@/app/_components/ui/modals/bulk-paste/BulkPasteModal";

interface KanbanBoardProps {
    checklist: Checklist;
    onUpdate: (updatedChecklist: Checklist) => void;
}

const columns = [
    { id: "todo", title: "Todo", status: "todo" as const },
    { id: "in_progress", title: "In Progress", status: "in_progress" as const },
    { id: "completed", title: "Completed", status: "completed" as const },
    { id: "paused", title: "Paused", status: "paused" as const },
];

export function KanbanBoard({ checklist, onUpdate }: KanbanBoardProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [localChecklist, setLocalChecklist] = useState(checklist);
    const [isLoading, setIsLoading] = useState(false);
    const [showBulkPasteModal, setShowBulkPasteModal] = useState(false);
    const [focusKey, setFocusKey] = useState(0);

    useEffect(() => {
        setLocalChecklist(checklist);
        setFocusKey(prev => prev + 1);
    }, [checklist]);

    const refreshChecklist = async () => {
        const result = await getLists();
        if (result.success && result.data) {
            const updatedChecklist = result.data.find(list => list.id === checklist.id);
            if (updatedChecklist) {
                setLocalChecklist(updatedChecklist);
                onUpdate(updatedChecklist);
            }
        }
    };

    const getItemsByStatus = (status: "todo" | "in_progress" | "completed" | "paused") => {
        return localChecklist.items.filter(item => item.status === status);
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeItem = localChecklist.items.find(item => item.id === activeId);
        if (!activeItem) return;

        let newStatus: "todo" | "in_progress" | "completed" | "paused";

        if (overId === "todo" || overId === "in_progress" || overId === "completed" || overId === "paused") {
            newStatus = overId;
        } else {
            const overItem = localChecklist.items.find(item => item.id === overId);
            if (!overItem) return;
            newStatus = overItem.status || "todo";
        }

        if (activeItem.status === newStatus) return;

        const formData = new FormData();
        formData.append("listId", localChecklist.id);
        formData.append("itemId", activeId);
        formData.append("status", newStatus);

        const result = await updateItemStatusAction(formData);

        if (result.success) {
            const updatedItems = localChecklist.items.map(item => {
                if (item.id === activeId) {
                    return { ...item, status: newStatus };
                }
                return item;
            });

            const updatedChecklist = {
                ...localChecklist,
                items: updatedItems,
                updatedAt: new Date().toISOString(),
            };

            setLocalChecklist(updatedChecklist);
            onUpdate(updatedChecklist);
        }
    };

    const handleAddItem = async (text: string) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("listId", localChecklist.id);
        formData.append("text", text);

        const result = await createItemAction(formData);
        setIsLoading(false);

        if (result.success && result.data) {
            const updatedList = {
                ...localChecklist,
                items: [...localChecklist.items, result.data],
                updatedAt: new Date().toISOString(),
            };
            setLocalChecklist(updatedList);
            onUpdate(updatedList);
            setFocusKey(prev => prev + 1);
        }
    };

    const handleBulkPaste = async (itemsText: string) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("listId", localChecklist.id);
        formData.append("itemsText", itemsText);
        const result = await createBulkItemsAction(formData);
        setIsLoading(false);

        if (result.success && result.data) {
            const updatedList = {
                ...localChecklist,
                items: [...localChecklist.items, ...result.data],
                updatedAt: new Date().toISOString(),
            };
            setLocalChecklist(updatedList);
            onUpdate(updatedList);
        }
    };

    const activeItem = activeId ? localChecklist.items.find(item => item.id === activeId) : null;

    return (
        <div className="h-full flex flex-col bg-background">
            <ChecklistHeading
                checklist={localChecklist}
                key={focusKey}
                onSubmit={handleAddItem}
                onBulkSubmit={() => setShowBulkPasteModal(true)}
                isLoading={isLoading}
                autoFocus={true}
                focusKey={focusKey}
                placeholder="Add new task..."
                submitButtonText="Add Task"
            />

            <div className="flex-1 overflow-hidden pb-[6em]">
                <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    <div className="h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-2 sm:p-4 overflow-x-auto">
                        {columns.map((column) => {
                            const items = getItemsByStatus(column.status);
                            return (
                                <KanbanColumn
                                    key={column.id}
                                    id={column.id}
                                    title={column.title}
                                    items={items}
                                    status={column.status}
                                    checklistId={localChecklist.id}
                                    onUpdate={refreshChecklist}
                                />
                            );
                        })}
                    </div>

                    <DragOverlay>
                        {activeItem ? (
                            <KanbanItem
                                item={activeItem}
                                isDragging
                                checklistId={localChecklist.id}
                                onUpdate={refreshChecklist}
                            />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>

            {showBulkPasteModal && (
                <BulkPasteModal
                    isOpen={showBulkPasteModal}
                    onClose={() => setShowBulkPasteModal(false)}
                    onSubmit={handleBulkPaste}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
}
