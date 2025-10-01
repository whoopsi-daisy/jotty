"use server";

import path from "path";
import fs from "fs/promises";
import { getCurrentUser } from "@/app/_server/actions/users/current";
import { getDocsUserDir } from "@/app/_server/utils/notes-files";
import { getUserDir } from "@/app/_server/utils/files";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

export interface FileItem {
  fileName: string;
  name: string;
  url: string;
  type: "image" | "file";
  mimeType: string;
  size: number;
  uploadedAt: string;
}

function getFileType(mimeType: string): "image" | "file" {
  return ALLOWED_IMAGE_TYPES.includes(mimeType) ? "image" : "file";
}

function getFileExtension(fileName: string): string {
  return path.extname(fileName).toLowerCase();
}

function sanitizeBaseName(name: string): string {
  const normalized = name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  const replaced = normalized.replace(/[^a-zA-Z0-9._-]+/g, "-");
  const collapsed = replaced.replace(/-+/g, "-");
  return collapsed.replace(/^[.-]+|[.-]+$/g, "");
}

function encodePathSegmentStrict(segment: string): string {
  return encodeURIComponent(segment)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
}

export async function uploadFileAction(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);

    const userDir = await getDocsUserDir();
    const targetDir = isImage
      ? path.join(userDir, "images")
      : path.join(userDir, "files");

    await fs.mkdir(targetDir, { recursive: true });

    const originalExt = path.extname(file.name).toLowerCase();
    const originalBase = path.basename(file.name, originalExt);
    const sanitizedBase = sanitizeBaseName(originalBase);
    let fileName = `${sanitizedBase}${originalExt}`;
    let counter = 1;

    while (
      await fs
        .access(path.join(targetDir, fileName))
        .then(() => true)
        .catch(() => false)
    ) {
      fileName = `${sanitizedBase}-${counter}${originalExt}`;
      counter++;
    }

    const filePath = path.join(targetDir, fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await fs.writeFile(filePath, buffer);

    const safeFileName = encodePathSegmentStrict(fileName);
    const fileUrl = isImage
      ? `/api/image/${user.username}/${safeFileName}`
      : `/api/file/${user.username}/${safeFileName}`;

    return {
      success: true,
      data: {
        fileName: fileName,
        name: file.name,
        url: fileUrl,
        type: getFileType(file.type),
        mimeType: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      } as FileItem,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, error: "Failed to upload file" };
  }
}

export async function getFilesAction() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const userDir = await getDocsUserDir();
    const imagesDir = path.join(userDir, "images");
    const filesDir = path.join(userDir, "files");

    const allFiles: FileItem[] = [];

    try {
      await fs.access(imagesDir);
      const imageFiles = await fs.readdir(imagesDir);
      const imageItems = await Promise.all(
        imageFiles
          .filter((file) => {
            const ext = getFileExtension(file);
            return [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].includes(
              ext
            );
          })
          .map(async (file) => {
            const ext = getFileExtension(file);
            let mimeType = "image/jpeg";
            switch (ext) {
              case ".png":
                mimeType = "image/png";
                break;
              case ".gif":
                mimeType = "image/gif";
                break;
              case ".webp":
                mimeType = "image/webp";
                break;
              case ".svg":
                mimeType = "image/svg+xml";
                break;
            }

            const filePath = path.join(imagesDir, file);
            const stats = await fs.stat(filePath);

            return {
              fileName: file,
              name: file,
              url: `/api/image/${user.username}/${encodePathSegmentStrict(
                file
              )}`,
              type: "image" as const,
              mimeType,
              size: stats.size,
              uploadedAt: stats.birthtime.toISOString(),
            };
          })
      );
      allFiles.push(...imageItems);
    } catch {}

    try {
      await fs.access(filesDir);
      const fileFiles = await fs.readdir(filesDir);
      const fileItems = await Promise.all(
        fileFiles.map(async (file) => {
          const ext = getFileExtension(file);
          const mimeTypeMap: Record<string, string> = {
            ".pdf": "application/pdf",
            ".doc": "application/msword",
            ".docx":
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".xls": "application/vnd.ms-excel",
            ".xlsx":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ".ppt": "application/vnd.ms-powerpoint",
            ".pptx":
              "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            ".txt": "text/plain",
            ".csv": "text/csv",
            ".json": "application/json",
            ".zip": "application/zip",
            ".rar": "application/x-rar-compressed",
            ".7z": "application/x-7z-compressed",
            ".tar": "application/x-tar",
            ".gz": "application/gzip",
            ".mp4": "video/mp4",
            ".webm": "video/webm",
            ".mov": "video/quicktime",
            ".mp3": "audio/mpeg",
            ".wav": "audio/wav",
            ".ogg": "audio/ogg",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".gif": "image/gif",
            ".webp": "image/webp",
            ".svg": "image/svg+xml",
          };

          const mimeType = mimeTypeMap[ext] || "application/octet-stream";

          const filePath = path.join(filesDir, file);
          const stats = await fs.stat(filePath);

          return {
            fileName: file,
            name: file,
            url: `/api/file/${user.username}/${encodePathSegmentStrict(file)}`,
            type: "file" as const,
            mimeType,
            size: stats.size,
            uploadedAt: stats.birthtime.toISOString(),
          };
        })
      );
      allFiles.push(...fileItems);
    } catch {}

    allFiles.sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    return { success: true, data: allFiles };
  } catch (error) {
    console.error("Error getting files:", error);
    return { success: false, error: "Failed to get files" };
  }
}

export async function deleteFileAction(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const fileName = formData.get("fileName") as string;
    const fileType = formData.get("fileType") as string;

    if (!fileName || !fileType) {
      return { success: false, error: "Missing parameters" };
    }

    const userDir = await getDocsUserDir();
    const targetDir =
      fileType === "image"
        ? path.join(userDir, "images")
        : path.join(userDir, "files");
    const filePath = path.join(targetDir, fileName);

    try {
      await fs.unlink(filePath);
      return { success: true };
    } catch (error) {
      return { success: false, error: "File not found" };
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    return { success: false, error: "Failed to delete file" };
  }
}

export async function getSettings() {
  try {
    const dataSettingsPath = path.join(process.cwd(), "data", "settings.json");
    try {
      const settings = await fs.readFile(dataSettingsPath, "utf-8");
      return JSON.parse(settings);
    } catch {
      const configSettingsPath = path.join(
        process.cwd(),
        "config",
        "settings.json"
      );
      const settings = await fs.readFile(configSettingsPath, "utf-8");
      return JSON.parse(settings);
    }
  } catch (error) {
    return {
      appName: "",
      appDescription: "",
      "16x16Icon": "",
      "32x32Icon": "",
      "180x180Icon": "",
    };
  }
}

export interface OrderData {
  categories?: string[];
  items?: string[];
}

export async function readOrderFile(
  dirPath: string
): Promise<OrderData | null> {
  try {
    const filePath = path.join(dirPath, ".order.json");
    const content = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(content) as OrderData;
    const categories = Array.isArray(data.categories)
      ? data.categories
      : undefined;
    const items = Array.isArray(data.items) ? data.items : undefined;
    return { categories, items };
  } catch {
    return null;
  }
}

export async function writeOrderFile(
  dirPath: string,
  data: OrderData
): Promise<{ success: boolean }> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    const filePath = path.join(dirPath, ".order.json");
    const toWrite: OrderData = {};
    if (data.categories && data.categories.length > 0) {
      toWrite.categories = data.categories;
    }
    if (data.items && data.items.length > 0) {
      toWrite.items = data.items;
    }
    await fs.writeFile(filePath, JSON.stringify(toWrite, null, 2), "utf-8");
    return { success: true };
  } catch {
    return { success: false };
  }
}
