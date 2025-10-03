"use server";

import fs from "fs/promises";
import { cookies, headers } from "next/headers";
import { Result } from "@/app/_types";
import { readJsonFile, writeJsonFile } from "../file";
import { SESSION_DATA_FILE, SESSIONS_FILE } from "@/app/_consts/files";
import { getCurrentUser } from "../users";

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

  const sessionsData = await readSessionData();
  const sessions = await readSessions();
  sessionsData[sessionId] = sessionData;
  sessions[sessionId] = username;
  await writeSessions(sessions);
  await writeSessionData(sessionsData);
}

export async function updateSessionActivity(sessionId: string): Promise<void> {
  const sessionsData = await readSessionData();
  if (sessionsData[sessionId]) {
    sessionsData[sessionId].lastActivity = new Date().toISOString();
    await writeSessionData(sessionsData);
  }
}

export async function removeSession(sessionId: string): Promise<void> {
  const sessionsData = await readSessionData();
  const sessions = await readSessions();
  delete sessionsData[sessionId];
  delete sessions[sessionId];
  await writeSessionData(sessionsData);
  await writeSessions(sessions);
}

export async function getSessionsForUser(
  username: string
): Promise<SessionData[]> {
  const sessions = await readSessionData();
  return Object.values(sessions).filter(
    (session) => session.username === username
  );
}

export const getSessionId = async (): Promise<string> => {
  return cookies().get("session")?.value || "";
};

export async function removeAllSessionsForUser(
  username: string,
  exceptSessionId?: string
): Promise<void> {
  const sessionsData = await readSessionData();
  const sessions = await readSessions();
  const sessionsToRemove = Object.entries(sessionsData)
    .filter(
      ([id, sessionData]) =>
        sessionData.username === username &&
        (!exceptSessionId || id !== exceptSessionId)
    )
    .map(([id]) => id);

  for (const sessionId of sessionsToRemove) {
    delete sessionsData[sessionId];
    delete sessions[sessionId];
  }

  await writeSessionData(sessionsData);
  await writeSessions(sessions);
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

export async function terminateSession(
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

    const sessionId = formData.get("sessionId") as string;

    if (!sessionId) {
      return {
        success: false,
        error: "Session ID is required",
      };
    }

    await removeSession(sessionId);

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    console.error("Error terminating session:", error);
    return {
      success: false,
      error: "Failed to terminate session",
    };
  }
}

export async function terminateAllOtherSessions(): Promise<Result<null>> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const sessionId = cookies().get("session")?.value;

    await removeAllSessionsForUser(currentUser.username, sessionId);

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    console.error("Error terminating all other sessions:", error);
    return {
      success: false,
      error: "Failed to terminate sessions",
    };
  }
}
