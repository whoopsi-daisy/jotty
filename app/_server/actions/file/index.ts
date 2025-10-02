"use server";

import { getCurrentUser } from "@/app/_server/actions/users";
import { DATA_DIR } from "@/app/_consts/files";
import fs from "fs/promises";
import path from "path";
import { Modes } from "@/app/_types/enums";

export async function ensureDir(dir: string) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

export const readJsonFile = async (filePath: string): Promise<any> => {
  try {
    const content = await fs.readFile(
      path.join(process.cwd(), filePath),
      "utf-8"
    );
    return JSON.parse(content);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return {};
  }
};

export const writeJsonFile = async (
  data: any,
  filePath: string
): Promise<void> => {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(
      path.join(process.cwd(), filePath),
      JSON.stringify(data, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Error writing data:", error);
    throw error;
  }
};

export const readFile = async (filePath: string): Promise<string> => {
  try {
    const content = await fs.readFile(
      path.join(process.cwd(), filePath),
      "utf-8"
    );
    return content;
  } catch (error) {
    return "";
  }
};

export async function getUserModeDir(mode: Modes): Promise<string> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  return path.join(process.cwd(), DATA_DIR, mode, user.username);
}

/**
 * @todo figure this out eventually, but for now it's too messy and I want this pull request to go through
 * Basically from client compoennt process.cwd is not available so I have added it to the previou functions.
 * From this comment on it's passed in via filePath/dirPath as these are ONLY called from server components.
 */

export async function serverReadFile(
  filePath: string,
  customReturn?: any
): Promise<string> {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch (error) {
    return customReturn || "";
  }
}

export async function serverWriteFile(filePath: string, content: string) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, "utf-8");
}

export async function serverDeleteFile(filePath: string) {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    // Ignore if file doesn't exist
  }
}

export async function serverReadDir(dirPath: string) {
  try {
    return await fs.readdir(dirPath, { withFileTypes: true });
  } catch (error) {
    return [];
  }
}

export async function serverDeleteDir(dirPath: string) {
  try {
    await fs.rm(dirPath, { recursive: true });
  } catch (error) {
    // Ignore if directory doesn't exist
  }
}
