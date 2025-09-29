import { promises as fs } from "fs";
import path from "path";

export function sanitizeFilename(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

export async function generateUniqueFilename(
  directory: string,
  baseTitle: string,
  extension: string = ".md"
): Promise<string> {
  const sanitizedTitle = sanitizeFilename(baseTitle);
  let filename = `${sanitizedTitle}${extension}`;
  let counter = 1;

  while (true) {
    const filePath = path.join(directory, filename);
    try {
      await fs.access(filePath);
      filename = `${sanitizedTitle}-${counter}${extension}`;
      counter++;
    } catch {
      break;
    }
  }

  return filename;
}
