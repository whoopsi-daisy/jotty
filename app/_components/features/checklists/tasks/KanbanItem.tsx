"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Item } from "@/app/_types";
import { cn } from "@/app/_utils/utils";
import { Clock, Target, Play, GripVertical, Timer, Pause, Square, RotateCcw, Circle, CheckCircle2, PauseCircle } from "lucide-react";
import { Button } from "@/app/_components/ui/elements/button";
import { Dropdown } from "@/app/_components/ui/elements/dropdown";
import { useState, useEffect } from "react";
import { updateItemStatusAction } from "@/app/_server/actions/data/actions";

interface KanbanItemProps {
    item: Item;
    isDragging?: boolean;
    checklistId: string;
    onUpdate?: () => void;
}

export function KanbanItem({ item, isDragging, checklistId, onUpdate }: KanbanItemProps) {
    const [isRunning, setIsRunning] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [totalTime, setTotalTime] = useState(0);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    useEffect(() => {
        const existingTime = item.timeEntries?.reduce((total, entry) => {
            if (entry.endTime) {
                const start = new Date(entry.startTime).getTime();
                const end = new Date(entry.endTime).getTime();
                return total + (end - start);
            }
            return total;
        }, 0) || 0;
        setTotalTime(Math.floor(existingTime / 1000));
    }, [item.timeEntries]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning && startTime) {
            interval = setInterval(() => {
                setCurrentTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, startTime]);

    const handleTimerToggle = async () => {
        if (isRunning) {
            setIsRunning(false);
            if (startTime) {
                const endTime = new Date();
                const newTimeEntry = {
                    id: Date.now().toString(),
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                    duration: Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
                };

                const updatedTimeEntries = [...(item.timeEntries || []), newTimeEntry];
                const formData = new FormData();
                formData.append("listId", checklistId);
                formData.append("itemId", item.id);
                formData.append("timeEntries", JSON.stringify(updatedTimeEntries));
                await updateItemStatusAction(formData);

                // Update local state immediately
                setTotalTime(prev => prev + Math.floor((endTime.getTime() - startTime.getTime()) / 1000));
                onUpdate?.();
            }
            setStartTime(null);
            setCurrentTime(0);
        } else {
            setIsRunning(true);
            setStartTime(new Date());
            setCurrentTime(0);
        }
    };

    const handleResetTimer = async () => {
        const formData = new FormData();
        formData.append("listId", checklistId);
        formData.append("itemId", item.id);
        formData.append("timeEntries", JSON.stringify([]));
        await updateItemStatusAction(formData);
        setTotalTime(0);
        onUpdate?.();
    };

    const handleStatusChange = async (newStatus: "todo" | "in_progress" | "completed" | "paused") => {
        const formData = new FormData();
        formData.append("listId", checklistId);
        formData.append("itemId", item.id);
        formData.append("status", newStatus);
        await updateItemStatusAction(formData);
        onUpdate?.();
    };

    const statusOptions = [
        { id: "todo" as const, name: "Todo", icon: Circle },
        { id: "in_progress" as const, name: "In Progress", icon: Play },
        { id: "completed" as const, name: "Completed", icon: CheckCircle2 },
        { id: "paused" as const, name: "Paused", icon: PauseCircle },
    ];

    const formatTimerTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case "todo":
                return "bg-muted/50 border-border";
            case "in_progress":
                return "bg-primary/10 border-primary/30";
            case "completed":
                return "bg-green-500/10 border-green-500/30";
            case "paused":
                return "bg-yellow-500/10 border-yellow-500/30";
            default:
                return "bg-muted/50 border-border";
        }
    };

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case "in_progress":
                return <Play className="h-3 w-3 text-primary" />;
            case "completed":
                return <Target className="h-3 w-3 text-green-600 dark:text-green-400" />;
            case "paused":
                return <Clock className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />;
            default:
                return null;
        }
    };

    const formatTime = (minutes?: number) => {
        if (!minutes) return null;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group relative bg-background border rounded-lg p-3 transition-all duration-200 hover:shadow-md",
                getStatusColor(item.status),
                (isDragging || isSortableDragging) && "opacity-50 scale-95 rotate-1 shadow-lg z-50"
            )}
        >
            <div
                {...attributes}
                {...listeners}
                className="absolute top-2 right-2 cursor-move text-muted-foreground hover:text-foreground opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity touch-manipulation"
            >
                <GripVertical className="h-4 w-4" />
            </div>
            <div className="space-y-2 pr-6">
                <div className="flex items-start gap-2">
                    <p className="text-sm font-medium text-foreground leading-tight flex-1">
                        {item.text}
                    </p>
                    <div className="flex-shrink-0">
                        {getStatusIcon(item.status)}
                    </div>
                </div>

                {(item.estimatedTime || item.targetDate) && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {item.estimatedTime && (
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(item.estimatedTime)}
                            </span>
                        )}
                        {item.targetDate && (
                            <span className="flex items-center gap-1">
                                <Target className="h-3 w-3" />
                                {new Date(item.targetDate).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                )}

                {item.timeEntries && item.timeEntries.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                        {item.timeEntries.length} time entr{item.timeEntries.length !== 1 ? 'ies' : 'y'}
                    </div>
                )}

                <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                            Total: {formatTimerTime(totalTime + currentTime)}
                        </div>
                        <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs touch-manipulation"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleTimerToggle();
                                }}
                            >
                                {isRunning ? (
                                    <>
                                        <Pause className="h-3 w-3" />
                                        <span className="hidden sm:inline ml-1">{formatTimerTime(currentTime)}</span>
                                    </>
                                ) : (
                                    <>
                                        <Timer className="h-3 w-3" />
                                        <span className="hidden sm:inline ml-1">Start</span>
                                    </>
                                )}
                            </Button>
                            {totalTime > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs touch-manipulation"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleResetTimer();
                                    }}
                                >
                                    <RotateCcw className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="sm:hidden">
                        <Dropdown
                            value={item.status || "todo"}
                            options={statusOptions}
                            onChange={(newStatus) => {
                                handleStatusChange(newStatus);
                            }}
                            className="text-xs"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
