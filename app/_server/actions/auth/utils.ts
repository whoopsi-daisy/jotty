"use server";

import fs from "fs/promises";
import path from "path";
import { cookies } from "next/headers";

interface User {
  username: string;
  passwordHash: string;
  isAdmin: boolean;
  isSuperAdmin?: boolean;
  createdAt?: string;
  lastLogin?: string;
}

const USERS_FILE = path.join(process.cwd(), "data", "users", "users.json");
const SESSIONS_FILE = path.join(
  process.cwd(),
  "data",
  "users",
  "sessions.json"
);

export async function readUsers(): Promise<User[]> {
  console.log("readUsers() called");
  console.log("readUsers() - USERS_FILE path:", USERS_FILE);
  try {
    await fs.access(USERS_FILE);
    console.log("readUsers() - file exists and is accessible");
    const content = await fs.readFile(USERS_FILE, "utf-8");
    console.log("readUsers() - file content length:", content.length);
    const users = JSON.parse(content);
    console.log("readUsers() - parsed users:", users);
    return users;
  } catch (error) {
    console.log("readUsers() - error:", error);
    return [];
  }
}

export async function readSessions(): Promise<Record<string, string>> {
  try {
    await fs.access(SESSIONS_FILE);
    const content = await fs.readFile(SESSIONS_FILE, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    return {};
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const sessionId = cookies().get("session")?.value;
  if (!sessionId) return null;

  const users = await readUsers();
  const sessions = await readSessions();
  const username = sessions[sessionId];

  return users.find((u) => u.username === username) || null;
}

export async function hasUsers(): Promise<boolean> {
  console.log("hasUsers() called");
  try {
    const users = await readUsers();
    console.log("hasUsers() - users array:", users);
    console.log("hasUsers() - users length:", users.length);
    const result = users.length > 0;
    console.log("hasUsers() - returning:", result);
    return result;
  } catch (error) {
    console.log("hasUsers() - error:", error);
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

export async function writeUsers(users: User[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error writing users:", error);
    throw error;
  }
}
