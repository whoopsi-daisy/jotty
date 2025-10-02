"use server";

import fs from "fs/promises";
import { headers } from "next/headers";
import { Result } from "@/app/_types";
import { readJsonFile, writeJsonFile } from "../file";
import { SESSION_DATA_FILE, SESSIONS_FILE } from "@/app/_consts/files";

export interface SessionData {
  id: string;
  username: string;
  userAgent: string;
  ipAddress: string;
  createdAt: string;
  lastActivity: string;
}

export interface Session {
  [key: string]: string;
}

export async function readSessionData(): Promise<Record<string, SessionData>> {
  return await readJsonFile(SESSION_DATA_FILE);
}

export async function writeSessionData(
  sessions: Record<string, SessionData>
): Promise<void> {
  await writeJsonFile(sessions, SESSION_DATA_FILE);
}

export const writeSessions = async (sessions: Session): Promise<void> => {
  await writeJsonFile(sessions, SESSIONS_FILE);
};

export const readSessions = async (): Promise<Session> => {
  return await readJsonFile(SESSIONS_FILE);
};

export async function createSession(
  sessionId: string,
  username: string
): Promise<void> {
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "Unknown";
  const forwarded = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  const ipAddress = forwarded || realIp || "Unknown";

  const sessionData: SessionData = {
    id: sessionId,
    username,
    userAgent,
    ipAddress,
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
  };

  const sessions = await readSessionData();
  sessions[sessionId] = sessionData;
  await writeSessionData(sessions);
}

export async function updateSessionActivity(sessionId: string): Promise<void> {
  const sessions = await readSessionData();
  if (sessions[sessionId]) {
    sessions[sessionId].lastActivity = new Date().toISOString();
    await writeSessionData(sessions);
  }
}

export async function removeSession(sessionId: string): Promise<void> {
  const sessions = await readSessionData();
  delete sessions[sessionId];
  await writeSessionData(sessions);
}

export async function getSessionsForUser(
  username: string
): Promise<SessionData[]> {
  const sessions = await readSessionData();
  return Object.values(sessions).filter(
    (session) => session.username === username
  );
}

export async function removeAllSessionsForUser(
  username: string,
  exceptSessionId?: string
): Promise<void> {
  const sessions = await readSessionData();
  const sessionsToRemove = Object.entries(sessions)
    .filter(
      ([id, session]) =>
        session.username === username &&
        (!exceptSessionId || id !== exceptSessionId)
    )
    .map(([id]) => id);

  for (const sessionId of sessionsToRemove) {
    delete sessions[sessionId];
  }

  await writeSessionData(sessions);
}

export async function clearAllSessions(): Promise<Result<null>> {
  try {
    await fs.writeFile(SESSIONS_FILE, JSON.stringify({}), "utf-8");
    await fs.writeFile(SESSION_DATA_FILE, JSON.stringify({}), "utf-8");

    return { success: true };
  } catch (error) {
    console.error("Error clearing all sessions:", error);
    return {
      success: false,
      error: "Failed to clear all sessions",
    };
  }
}
