"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import { removeSession } from "../users/session-storage";

const SESSIONS_FILE = path.join(
  process.cwd(),
  "data",
  "users",
  "sessions.json"
);

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

export async function logout() {
  const sessionId = cookies().get("session")?.value;

  if (sessionId) {
    const sessions = await readSessions();
    delete sessions[sessionId];
    await writeSessions(sessions);

    await removeSession(sessionId);

    cookies().delete("session");
  }

  if (process.env.SSO_MODE === "oidc") {
    redirect("/api/oidc/logout");
  } else {
    redirect("/auth/login");
  }
}
