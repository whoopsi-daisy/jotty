"use server";

import { getCurrentUser, readUsers, writeUsers } from "@/app/_server/actions/auth/utils";
import { createHash } from "crypto";
import { Result } from "@/app/_types";

export async function updateProfileAction(formData: FormData): Promise<Result<null>> {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return {
                success: false,
                error: "Not authenticated",
            };
        }

        const newUsername = formData.get("newUsername") as string;
        const currentPassword = formData.get("currentPassword") as string;
        const newPassword = formData.get("newPassword") as string;

        // Validate input
        if (!newUsername || newUsername.length < 3) {
            return {
                success: false,
                error: "Username must be at least 3 characters long",
            };
        }

        if (newPassword && newPassword.length < 6) {
            return {
                success: false,
                error: "New password must be at least 6 characters long",
            };
        }

        // Get all users
        const users = await readUsers();
        const userIndex = users.findIndex((user) => user.username === currentUser.username);

        if (userIndex === -1) {
            return {
                success: false,
                error: "User not found",
            };
        }

        // Check if new username already exists (if changing username)
        if (newUsername !== currentUser.username) {
            const usernameExists = users.find((user) => user.username === newUsername);
            if (usernameExists) {
                return {
                    success: false,
                    error: "Username already exists",
                };
            }
        }

        // Verify current password if changing password
        if (newPassword) {
            if (!currentPassword) {
                return {
                    success: false,
                    error: "Current password is required to change password",
                };
            }

            const currentPasswordHash = createHash("sha256").update(currentPassword).digest("hex");
            if (users[userIndex].passwordHash !== currentPasswordHash) {
                return {
                    success: false,
                    error: "Current password is incorrect",
                };
            }
        }

        // Update user
        users[userIndex].username = newUsername;

        if (newPassword) {
            const newPasswordHash = createHash("sha256").update(newPassword).digest("hex");
            users[userIndex].passwordHash = newPasswordHash;
        }

        // Write updated users to file
        await writeUsers(users);

        return {
            success: true,
            data: null,
        };
    } catch (error) {
        console.error("Error updating profile:", error);
        return {
            success: false,
            error: "Failed to update profile",
        };
    }
}
