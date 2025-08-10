"use server";

import fs from "fs/promises";
import path from "path";
import { headers } from "next/headers";

interface SessionData {
    id: string;
    username: string;
    userAgent: string;
    ipAddress: string;
    createdAt: string;
    lastActivity: string;
}

const SESSIONS_FILE = path.join(process.cwd(), "data", "users", "session-data.json");

export async function readSessionData(): Promise<Record<string, SessionData>> {
    try {
        await fs.access(SESSIONS_FILE);
        const content = await fs.readFile(SESSIONS_FILE, "utf-8");
        return JSON.parse(content);
    } catch (error) {
        return {};
    }
}

export async function writeSessionData(sessions: Record<string, SessionData>): Promise<void> {
    try {
        await fs.mkdir(path.dirname(SESSIONS_FILE), { recursive: true });
        await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
    } catch (error) {
        console.error("Error writing session data:", error);
        throw error;
    }
}

export async function createSession(sessionId: string, username: string): Promise<void> {
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

export async function getSessionsForUser(username: string): Promise<SessionData[]> {
    const sessions = await readSessionData();
    return Object.values(sessions).filter(session => session.username === username);
}

export async function removeAllSessionsForUser(username: string, exceptSessionId?: string): Promise<void> {
    const sessions = await readSessionData();
    const sessionsToRemove = Object.entries(sessions)
        .filter(([id, session]) =>
            session.username === username &&
            (!exceptSessionId || id !== exceptSessionId)
        )
        .map(([id]) => id);

    for (const sessionId of sessionsToRemove) {
        delete sessions[sessionId];
    }

    await writeSessionData(sessions);
}
