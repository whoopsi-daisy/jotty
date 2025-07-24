"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash } from "crypto";
import fs from "fs/promises";
import path from "path";

interface User {
  username: string;
  passwordHash: string;
  isAdmin: boolean;
  isSuperAdmin?: boolean;
}

const USERS_FILE = path.join(process.cwd(), "data", "users", "users.json");
const SESSIONS_FILE = path.join(
  process.cwd(),
  "data",
  "users",
  "sessions.json"
);

// Helper to hash passwords consistently
function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

// Helper to read users file
async function readUsers(): Promise<User[]> {
  try {
    const content = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    return [];
  }
}

// Helper to write users file
async function writeUsers(users: User[]) {
  await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// Helper to read sessions
async function readSessions(): Promise<Record<string, string>> {
  try {
    const content = await fs.readFile(SESSIONS_FILE, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    return {};
  }
}

// Helper to write sessions
async function writeSessions(sessions: Record<string, string>) {
  await fs.mkdir(path.dirname(SESSIONS_FILE), { recursive: true });
  await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
}

export async function register(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!username || !password || !confirmPassword) {
    return { error: "All fields are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  const users = await readUsers();

  // Check if this is first user (admin)
  const isFirstUser = users.length === 0;

  // Check if username already exists
  if (users.some((u) => u.username === username)) {
    return { error: "Username already exists" };
  }

  // Create new user
  const newUser: User = {
    username,
    passwordHash: hashPassword(password),
    isAdmin: isFirstUser,
    isSuperAdmin: isFirstUser,
  };

  users.push(newUser);
  await writeUsers(users);

  // Create session for new user
  const sessionId = createHash("sha256")
    .update(Math.random().toString())
    .digest("hex");
  const sessions = await readSessions();
  sessions[sessionId] = username;

  await writeSessions(sessions);

  // Set session cookie
  cookies().set("session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  // Create user's checklist directory
  const userChecklistDir = path.join(
    process.cwd(),
    "data",
    "checklists",
    username
  );
  await fs.mkdir(userChecklistDir, { recursive: true });

  redirect("/");
}
