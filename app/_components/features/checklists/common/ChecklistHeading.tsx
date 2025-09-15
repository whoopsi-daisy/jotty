"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, ClipboardList, Users } from "lucide-react";
import { Button } from "@/app/_components/ui/elements/button";
import { Checklist } from "@/app/_types";

interface ChecklistHeadingProps {
    checklist: Checklist;
    onSubmit: (text: string) => void;
    onBulkSubmit?: () => void;
    isLoading?: boolean;
    autoFocus?: boolean;
    focusKey?: number;
    placeholder?: string;
    submitButtonText?: string;
}

export function ChecklistHeading({
    checklist,
    onSubmit,
    onBulkSubmit,
    isLoading = false,
    autoFocus = false,
    focusKey = 0,
    placeholder = "Add new item...",
    submitButtonText = "Add Item",
}: ChecklistHeadingProps) {
    const [newItemText, setNewItemText] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemText.trim()) return;

        onSubmit(newItemText.trim());
        setNewItemText("");
    };

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [focusKey, autoFocus]);

    return (
        <div className="p-6 border-b border-border bg-gradient-to-r from-background to-muted/20">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">{checklist.title}</h2>
                    {checklist.isShared && (
                        <div title="Shared item" className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full">
                            <Users className="h-3 w-3 text-primary" />
                            <span className="text-xs font-medium text-primary">Shared</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                        <span className="font-medium">ID:</span>
                        <span className="font-mono bg-muted px-2 py-1 rounded text-xs">{checklist.id}</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                    ref={inputRef}
                    type="text"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 px-4 py-3 border border-input bg-background rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-ring transition-all duration-200 shadow-sm"
                    disabled={isLoading}
                />
                <div className="flex gap-3">
                    {onBulkSubmit && (
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={onBulkSubmit}
                            disabled={isLoading}
                            title="Bulk add items"
                            className="px-4 shadow-sm"
                        >
                            <ClipboardList className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Bulk</span>
                        </Button>
                    )}
                    <Button
                        type="submit"
                        size="lg"
                        disabled={isLoading || !newItemText.trim()}
                        className="px-6 shadow-sm"
                    >
                        <Plus className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">{submitButtonText}</span>
                        <span className="sm:hidden">Add</span>
                    </Button>
                </div>
            </form>
        </div>
    );
}
