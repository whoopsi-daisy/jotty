"use server";

import { createHash } from "crypto";
import { Result, User } from "@/app/_types";
import { getCurrentUser } from "@/app/_server/actions/users";
import { readJsonFile, writeJsonFile } from "../file";
import { USERS_FILE } from "@/app/_consts/files";

export async function updateProfileAction(
  formData: FormData
): Promise<Result<null>> {
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

    const users = await readJsonFile(USERS_FILE);
    const userIndex = users.findIndex(
      (user: User) => user.username === currentUser.username
    );

    if (userIndex === -1) {
      return {
        success: false,
        error: "User not found",
      };
    }

    if (newUsername !== currentUser.username) {
      const usernameExists = users.find(
        (user: User) => user.username === newUsername
      );
      if (usernameExists) {
        return {
          success: false,
          error: "Username already exists",
        };
      }
    }

    if (newPassword) {
      if (!currentPassword) {
        return {
          success: false,
          error: "Current password is required to change password",
        };
      }

      const currentPasswordHash = createHash("sha256")
        .update(currentPassword)
        .digest("hex");
      if (users[userIndex].passwordHash !== currentPasswordHash) {
        return {
          success: false,
          error: "Current password is incorrect",
        };
      }
    }

    users[userIndex].username = newUsername;

    if (newPassword) {
      const newPasswordHash = createHash("sha256")
        .update(newPassword)
        .digest("hex");
      users[userIndex].passwordHash = newPasswordHash;
    }

    await writeJsonFile(users, USERS_FILE);

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
