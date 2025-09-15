"use client";

import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { Checklist } from "@/app/_types";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanItem } from "./KanbanItem";
import { createItemAction, updateItemStatusAction, getLists } from "@/app/_server/actions/data/actions";
import { Plus, Users } from "lucide-react";
import { Button } from "@/app/_components/ui/elements/button";

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
    const [newItemText, setNewItemText] = useState("");
    const [isAddingItem, setIsAddingItem] = useState(false);

    useEffect(() => {
        setLocalChecklist(checklist);
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

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemText.trim()) return;

        setIsAddingItem(true);
        const formData = new FormData();
        formData.append("listId", localChecklist.id);
        formData.append("text", newItemText.trim());

        const result = await createItemAction(formData);
        setIsAddingItem(false);

        if (result.success && result.data) {
            const updatedList = {
                ...localChecklist,
                items: [...localChecklist.items, result.data],
                updatedAt: new Date().toISOString(),
            };
            setLocalChecklist(updatedList);
            onUpdate(updatedList);
            setNewItemText("");
        }
    };

    const activeItem = activeId ? localChecklist.items.find(item => item.id === activeId) : null;

    return (
        <div className="h-full flex flex-col bg-background">
            <div className="p-4 border-b border-border">
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-xl font-semibold text-foreground">{localChecklist.title}</h2>
                        {localChecklist.isShared && (
                            <div title="Shared item">
                                <Users className="h-4 w-4 text-primary" />
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>ID: {localChecklist.id}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                        Drag tasks between columns to update their status
                    </p>
                </div>

                <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        placeholder="Add new task..."
                        className="flex-1 px-4 py-3 border border-input bg-background rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-ring transition-colors"
                        disabled={isAddingItem}
                    />
                    <Button
                        type="submit"
                        size="lg"
                        disabled={isAddingItem || !newItemText.trim()}
                        className="px-6 sm:px-6"
                    >
                        <Plus className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Add Task</span>
                        <span className="sm:hidden">Add</span>
                    </Button>
                </form>
            </div>

            <div className="flex-1 overflow-hidden">
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
        </div>
    );
}
