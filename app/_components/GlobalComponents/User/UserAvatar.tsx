import React from 'react';
import { cn } from '@/app/_utils/global-utils';

interface UserAvatarProps {
    username: string;
    avatarUrl?: string | null;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
    username,
    avatarUrl,
    className,
    size = 'md',
}) => {
    const sizeClasses = {
        sm: 'h-6 w-6 text-xs',
        md: 'h-8 w-8 text-sm',
        lg: 'h-10 w-10 text-base',
    };

    return (
        <div
            className={cn(
                'relative rounded-full bg-muted flex items-center justify-center font-semibold text-muted-foreground flex-shrink-0',
                sizeClasses[size],
                className
            )}
        >
            <img
                src={avatarUrl || `https://avatar.iran.liara.run/username?username=${username}`}
                alt={`${username}'s avatar`}
                className="w-full h-full object-cover rounded-full"
            />
        </div>
    );
};
