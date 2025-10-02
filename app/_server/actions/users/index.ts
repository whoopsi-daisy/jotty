"use server";

import { CHECKLISTS_DIR, NOTES_DIR, USERS_FILE } from "@/app/_consts/files";
import { readJsonFile, writeJsonFile } from "../file";
import { Result } from "@/app/_types";
import { User } from "@/app/_types";
import { readSessions, removeAllSessionsForUser } from "../session";
import fs from "fs/promises";
import { cookies } from "next/headers";
import { createHash } from "crypto";

export async function createUser(
  formData: FormData
): Promise<Result<Omit<User, "passwordHash">>> {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const isAdmin = formData.get("isAdmin") === "true";

    if (!username || !password || !confirmPassword) {
      return {
        success: false,
        error: "Username, password, and confirm password are required",
      };
    }

    if (username.length < 3) {
      return {
        success: false,
        error: "Username must be at least 3 characters long",
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters long",
      };
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        error: "Passwords do not match",
      };
    }

    const existingUsers = await readJsonFile(USERS_FILE);
    const userExists = existingUsers.find(
      (user: User) => user.username === username
    );

    if (userExists) {
      return {
        success: false,
        error: "Username already exists",
      };
    }

    const hashedPassword = createHash("sha256").update(password).digest("hex");

    const newUser: User = {
      username,
      passwordHash: hashedPassword,
      isAdmin,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    const updatedUsers = [...existingUsers, newUser];

    await writeJsonFile(updatedUsers, USERS_FILE);

    const { passwordHash: _, ...userWithoutPassword } = newUser;

    return {
      success: true,
      data: userWithoutPassword,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      error: "Failed to create user",
    };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const users = await readJsonFile(USERS_FILE);

  const sessionId = cookies().get("session")?.value;
  if (!sessionId) return null;

  const sessions = await readSessions();
  const username = sessions[sessionId];
  return users.find((u: User) => u.username === username) || null;
}

async function _deleteUserCore(username: string): Promise<Result<null>> {
  const allUsers = await readJsonFile(USERS_FILE);
  const userIndex = allUsers.findIndex(
    (user: User) => user.username === username
  );

  if (userIndex === -1) {
    return { success: false, error: "User not found" };
  }

  const userToDelete = allUsers[userIndex];
  if (userToDelete.isAdmin) {
    const adminCount = allUsers.filter((user: User) => user.isAdmin).length;
    if (adminCount === 1) {
      return { success: false, error: "Cannot delete the last admin user" };
    }
  }

  await removeAllSessionsForUser(username);

  try {
    await fs.rm(CHECKLISTS_DIR(username), { recursive: true, force: true });

    const docsDir = NOTES_DIR(username);
    await fs.rm(docsDir, { recursive: true, force: true });
  } catch (error) {
    console.warn(
      `Warning: Could not clean up data files for ${username}:`,
      error
    );
  }

  allUsers.splice(userIndex, 1);
  await writeJsonFile(allUsers, USERS_FILE);

  return { success: true, data: null };
}

export async function deleteUser(formData: FormData): Promise<Result<null>> {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser?.isAdmin) {
      return { success: false, error: "Unauthorized: Admin access required" };
    }

    const usernameToDelete = formData.get("username") as string;
    if (!usernameToDelete) {
      return { success: false, error: "Username is required" };
    }

    return await _deleteUserCore(usernameToDelete);
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

export async function deleteAccount(formData: FormData): Promise<Result<null>> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "Not authenticated" };
    }

    const confirmPassword = formData.get("confirmPassword") as string;
    if (!confirmPassword) {
      return { success: false, error: "Password confirmation is required" };
    }

    const users = await readJsonFile(USERS_FILE);
    const userRecord = users.find(
      (user: User) => user.username === currentUser.username
    );
    if (!userRecord) {
      return { success: false, error: "User not found" };
    }

    const passwordHash = createHash("sha256")
      .update(confirmPassword)
      .digest("hex");
    if (userRecord.passwordHash !== passwordHash) {
      return { success: false, error: "Incorrect password" };
    }

    return await _deleteUserCore(currentUser.username);
  } catch (error) {
    console.error("Error in deleteAccount:", error);
    return { success: false, error: "Failed to delete account" };
  }
}

export async function hasUsers(): Promise<boolean> {
  try {
    const users = await readJsonFile(USERS_FILE);
    return users.length > 0;
  } catch (error) {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.isAdmin || false;
}

export async function getUsername(): Promise<string> {
  const user = await getCurrentUser();
  return user?.username || "";
}

export async function getUsers() {
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    return { error: "Unauthorized" };
  }

  const users = await readJsonFile(USERS_FILE);
  return users.map(({ username, isAdmin, isSuperAdmin }: User) => ({
    username,
    isAdmin,
    isSuperAdmin,
  }));
}

export async function toggleAdmin(formData: FormData) {
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    return { error: "Unauthorized" };
  }

  const username = formData.get("username") as string;
  if (!username) {
    return { error: "Username is required" };
  }

  const users = await readJsonFile(USERS_FILE);
  const userToUpdate = users.find((u: User) => u.username === username);

  if (!userToUpdate) {
    return { error: "User not found" };
  }

  userToUpdate.isAdmin = !userToUpdate.isAdmin;
  await writeJsonFile(users, USERS_FILE);

  return { success: true };
}
