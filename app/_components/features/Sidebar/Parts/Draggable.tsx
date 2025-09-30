"use client";

import { ReactNode, CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DraggableProps {
    id: string;
    data: Record<string, unknown>;
    className?: string;
    style?: CSSProperties;
    children: ReactNode;
}

export const Draggable = ({ id, data, className, style, children }: DraggableProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, data });
    const combinedStyle: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : undefined,
        ...style,
    };
    return (
        <div ref={setNodeRef} {...attributes} {...listeners} className={className} style={combinedStyle}>
            {children}
        </div>
    );
}


