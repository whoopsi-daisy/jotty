"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash } from "crypto";
import fs from "fs/promises";
import path from "path";
import { CHECKLISTS_FOLDER } from "@/app/_consts/globalConsts";

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

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

async function readUsers(): Promise<User[]> {
  try {
    const content = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    return [];
  }
}

async function writeUsers(users: User[]) {
  await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

async function readSessions(): Promise<Record<string, string>> {
  try {
    const content = await fs.readFile(SESSIONS_FILE, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    return {};
  }
}

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

  const isFirstUser = users.length === 0;

  if (users.some((u) => u.username === username)) {
    return { error: "Username already exists" };
  }

  const newUser: User = {
    username,
    passwordHash: hashPassword(password),
    isAdmin: isFirstUser,
    isSuperAdmin: isFirstUser,
  };

  users.push(newUser);
  await writeUsers(users);

  const sessionId = createHash("sha256")
    .update(Math.random().toString())
    .digest("hex");
  const sessions = await readSessions();
  sessions[sessionId] = username;

  await writeSessions(sessions);

  cookies().set("session", sessionId, {
    httpOnly: true,
    secure:
      process.env.NODE_ENV === "production" && process.env.HTTPS === "true",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });

  const userChecklistDir = path.join(
    process.cwd(),
    "data",
    CHECKLISTS_FOLDER,
    username
  );
  await fs.mkdir(userChecklistDir, { recursive: true });

  redirect("/");
}
