import { promises as fs } from "fs";
import path from "path";
import slugify from "slugify";

export const sanitizeFilename = (title: string): string => {
  const ascii = slugify(title, { lower: true, strict: true, locale: "en" });
  return ascii.replace(/^[.-]+|[.-]+$/g, "").replace(/\.+/g, ".");
};

export const generateUniqueFilename = async (
  directory: string,
  baseTitle: string,
  extension: string = ".md"
): Promise<string> => {
  let sanitizedTitle = sanitizeFilename(baseTitle);
  if (!sanitizedTitle) {
    const uid = `${Date.now().toString(36)}${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    sanitizedTitle = uid;
  }
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
};
