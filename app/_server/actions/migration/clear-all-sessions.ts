"use server";

import fs from "fs/promises";
import path from "path";
import { Result } from "@/app/_types";

const SESSIONS_FILE = path.join(process.cwd(), "data", "users", "sessions.json");
const SESSION_DATA_FILE = path.join(process.cwd(), "data", "users", "session-data.json");

export async function clearAllSessionsAction(): Promise<Result<null>> {
    try {
        await fs.writeFile(SESSIONS_FILE, JSON.stringify({}), "utf-8");

        await fs.writeFile(SESSION_DATA_FILE, JSON.stringify({}), "utf-8");

        return { success: true };
    } catch (error) {
        console.error("Error clearing all sessions:", error);
        return {
            success: false,
            error: "Failed to clear all sessions"
        };
    }
}
