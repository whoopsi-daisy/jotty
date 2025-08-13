"use server";

import { cookies } from "next/headers";
import { createHash } from "crypto";
import { readUsers, writeUsers } from "@/app/_server/actions/auth/utils";
import { User } from "@/app/_types";
import { Result } from "@/app/_types";

type UserWithoutPassword = Omit<User, "passwordHash">;

export async function createUserAction(
  formData: FormData
): Promise<Result<UserWithoutPassword>> {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const isAdmin = formData.get("isAdmin") === "true";

    // Validate input
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

    // Check if user already exists
    const existingUsers = await readUsers();
    const userExists = existingUsers.find((user) => user.username === username);

    if (userExists) {
      return {
        success: false,
        error: "Username already exists",
      };
    }

    // Hash password
    const hashedPassword = createHash("sha256").update(password).digest("hex");

    // Create new user
    const newUser: User = {
      username,
      passwordHash: hashedPassword,
      isAdmin,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    // Add user to users array
    const updatedUsers = [...existingUsers, newUser];

    // Write updated users to file
    await writeUsers(updatedUsers);

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = newUser;

    return {
      success: true,
      data: userWithoutPassword as UserWithoutPassword,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      error: "Failed to create user",
    };
  }
}
