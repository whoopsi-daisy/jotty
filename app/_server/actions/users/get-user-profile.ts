"use server";

import { getCurrentUser } from "@/app/_server/actions/auth/utils";
import { User } from "@/app/_types";
import { Result } from "@/app/_types";

type UserProfile = {
    username: string;
    isAdmin: boolean;
    createdAt?: string;
    lastLogin?: string;
};

export async function getUserProfileAction(): Promise<Result<UserProfile>> {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return {
                success: false,
                error: "Not authenticated",
            };
        }

        // For now, return basic user info
        // In a real app, you might want to store and retrieve createdAt/lastLogin
        const profile: UserProfile = {
            username: user.username,
            isAdmin: user.isAdmin,
            createdAt: new Date().toISOString(), // Mock data for now
            lastLogin: new Date().toISOString(), // Mock data for now
        };

        return {
            success: true,
            data: profile,
        };
    } catch (error) {
        console.error("Error getting user profile:", error);
        return {
            success: false,
            error: "Failed to get user profile",
        };
    }
}
