"use client";

import { Share2, Users } from "lucide-react";
import { cn } from "@/app/_utils/utils";
import { getCurrentUser } from "@/app/_server/actions/users/current";
import { useState, useEffect } from "react";

interface SharedItemIndicatorProps {
    itemId: string;
    itemType: "checklist" | "document";
    owner: string;
    isShared?: boolean;
    className?: string;
    showText?: boolean;
}

export function SharedItemIndicator({
    itemId,
    itemType,
    owner,
    isShared = false,
    className,
    showText = false,
}: SharedItemIndicatorProps) {
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [isSharedByMe, setIsSharedByMe] = useState(false);

    useEffect(() => {
        const loadCurrentUser = async () => {
            try {
                const user = await getCurrentUser();
                setCurrentUser(user?.username || null);
                setIsSharedByMe(user?.username === owner);
            } catch (error) {
                console.error("Error loading current user:", error);
            }
        };

        loadCurrentUser();
    }, [owner]);

    if (!isShared) return null;

    const isOwnedByMe = currentUser === owner;
    const isSharedWithMe = !isOwnedByMe && isShared;

    return (
        <div
            className={cn(
                "flex items-center gap-1",
                className
            )}
        >
            {isOwnedByMe ? (
                // Item is shared by me
                <div className="flex items-center gap-1">
                    <Share2 className="h-3 w-3 text-primary" />
                    {showText && (
                        <span className="text-xs text-primary font-medium">shared</span>
                    )}
                </div>
            ) : isSharedWithMe ? (
                // Item is shared with me
                <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    {showText && (
                        <span className="text-xs text-muted-foreground">
                            by {owner}
                        </span>
                    )}
                </div>
            ) : null}
        </div>
    );
}

// Simple dot indicator for compact display
export function SharedItemDot({
    itemId,
    itemType,
    owner,
    isShared = false,
    className,
}: SharedItemIndicatorProps) {
    const [currentUser, setCurrentUser] = useState<string | null>(null);

    useEffect(() => {
        const loadCurrentUser = async () => {
            try {
                const user = await getCurrentUser();
                setCurrentUser(user?.username || null);
            } catch (error) {
                console.error("Error loading current user:", error);
            }
        };

        loadCurrentUser();
    }, [owner]);

    if (!isShared) return null;

    const isOwnedByMe = currentUser === owner;
    const isSharedWithMe = !isOwnedByMe && isShared;

    return (
        <div
            className={cn(
                "w-2 h-2 rounded-full",
                isOwnedByMe
                    ? "bg-primary" // Shared by me - primary color
                    : "bg-muted-foreground", // Shared with me - muted color
                className
            )}
            title={
                isOwnedByMe
                    ? "Shared by you"
                    : `Shared by ${owner}`
            }
        />
    );
}
