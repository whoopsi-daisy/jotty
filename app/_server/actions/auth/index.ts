"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash } from "crypto";
import path from "path";
import {
  createSession,
  readSessionData,
  readSessions,
  removeSession,
  writeSessionData,
  writeSessions,
} from "../session";
import { readJsonFile, writeJsonFile } from "../file";
import { CHECKLISTS_FOLDER } from "@/app/_consts/checklists";
import fs from "fs/promises";
import { USERS_FILE } from "@/app/_consts/files";

interface User {
  username: string;
  passwordHash: string;
  isAdmin: boolean;
  isSuperAdmin?: boolean;
  createdAt?: string;
  lastLogin?: string;
}

const hashPassword = (password: string): string => {
  return createHash("sha256").update(password).digest("hex");
};

export const register = async (formData: FormData) => {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!username || !password || !confirmPassword) {
    return { error: "All fields are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  const users = await readJsonFile(USERS_FILE);

  const isFirstUser = users.length === 0;

  if (users.some((u: User) => u.username === username)) {
    return { error: "Username already exists" };
  }

  const newUser: User = {
    username,
    passwordHash: hashPassword(password),
    isAdmin: isFirstUser,
    isSuperAdmin: isFirstUser,
  };

  users.push(newUser);
  await writeJsonFile(users, USERS_FILE);

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
};

export const login = async (formData: FormData) => {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username and password are required" };
  }

  const users = await readJsonFile(USERS_FILE);
  const user = users.find((u: User) => u.username === username);

  if (!user || user.passwordHash !== hashPassword(password)) {
    return { error: "Invalid username or password" };
  }

  const userIndex = users.findIndex((u: User) => u.username === username);
  if (userIndex !== -1) {
    users[userIndex].lastLogin = new Date().toISOString();
    await writeJsonFile(users, USERS_FILE);
  }

  const sessionId = createHash("sha256")
    .update(Math.random().toString())
    .digest("hex");
  const sessions = await readSessions();
  sessions[sessionId] = username;

  await writeSessions(sessions);

  await createSession(sessionId, username);

  cookies().set("session", sessionId, {
    httpOnly: true,
    secure:
      process.env.NODE_ENV === "production" && process.env.HTTPS === "true",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });

  redirect("/");
};

export const logout = async () => {
  const sessionId = cookies().get("session")?.value;

  if (sessionId) {
    const sessions = await readSessionData();
    delete sessions[sessionId];
    await writeSessionData(sessions);

    await removeSession(sessionId);

    cookies().delete("session");
  }

  if (process.env.SSO_MODE === "oidc") {
    redirect("/api/oidc/logout");
  } else {
    redirect("/auth/login");
  }
};
