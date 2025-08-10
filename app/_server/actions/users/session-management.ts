"use server";

import { getCurrentUser, readSessions } from "@/app/_server/actions/auth/utils";
import { Result } from "@/app/_types";
import fs from "fs/promises";
import path from "path";

interface Session {
  id: string;
  username: string;
  userAgent: string;
  ipAddress: string;
  createdAt: string;
  lastActivity: string;
  isCurrent: boolean;
}

const SESSIONS_FILE = path.join(process.cwd(), "data", "users", "sessions.json");

export async function getSessionsAction(): Promise<Result<Session[]>> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    // For now, return mock sessions
    // In a real app, you would store and retrieve actual session data
    const mockSessions: Session[] = [
      {
        id: "1",
        username: currentUser.username,
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        ipAddress: "192.168.1.100",
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        lastActivity: new Date().toISOString(),
        isCurrent: true,
      },
      {
        id: "2",
        username: currentUser.username,
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
        ipAddress: "192.168.1.101",
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        lastActivity: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        isCurrent: false,
      },
    ];

    return {
      success: true,
      data: mockSessions,
    };
  } catch (error) {
    console.error("Error getting sessions:", error);
    return {
      success: false,
      error: "Failed to get sessions",
    };
  }
}

export async function terminateSessionAction(formData: FormData): Promise<Result<null>> {
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

    // In a real app, you would remove the session from storage
    // For now, just return success
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

export async function terminateAllOtherSessionsAction(): Promise<Result<null>> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    // In a real app, you would remove all other sessions from storage
    // For now, just return success
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
