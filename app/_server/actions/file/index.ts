"use server";

import fs from "fs/promises";
import path from "path";

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
