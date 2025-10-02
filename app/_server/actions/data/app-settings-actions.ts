"use server";

import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/app/_server/actions/users";
import { Result } from "@/app/_types";

interface AppSettings {
  appName: string;
  appDescription: string;
  "16x16Icon": string;
  "32x32Icon": string;
  "180x180Icon": string;
}

const DATA_SETTINGS_PATH = path.join(process.cwd(), "data", "settings.json");
const CONFIG_SETTINGS_PATH = path.join(
  process.cwd(),
  "config",
  "settings.json"
);

export async function getAppSettingsAction(): Promise<Result<AppSettings>> {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    let settings: AppSettings;
    try {
      const settingsContent = await fs.readFile(DATA_SETTINGS_PATH, "utf-8");
      settings = JSON.parse(settingsContent);
    } catch {
      try {
        const settingsContent = await fs.readFile(
          CONFIG_SETTINGS_PATH,
          "utf-8"
        );
        settings = JSON.parse(settingsContent);
      } catch {
        settings = {
          appName: "",
          appDescription: "",
          "16x16Icon": "",
          "32x32Icon": "",
          "180x180Icon": "",
        };
      }
    }

    return { success: true, data: settings };
  } catch (error) {
    console.error("Error reading app settings:", error);
    return { success: false, error: "Failed to read settings" };
  }
}

export async function updateAppSettingsAction(
  formData: FormData
): Promise<Result<null>> {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    const appName = (formData.get("appName") as string) || "";
    const appDescription = (formData.get("appDescription") as string) || "";
    const icon16x16 = (formData.get("16x16Icon") as string) || "";
    const icon32x32 = (formData.get("32x32Icon") as string) || "";
    const icon180x180 = (formData.get("180x180Icon") as string) || "";

    const settings: AppSettings = {
      appName,
      appDescription,
      "16x16Icon": icon16x16,
      "32x32Icon": icon32x32,
      "180x180Icon": icon180x180,
    };

    const dataDir = path.dirname(DATA_SETTINGS_PATH);
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    await fs.writeFile(DATA_SETTINGS_PATH, JSON.stringify(settings, null, 2));

    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true, data: null };
  } catch (error) {
    console.error("Error saving app settings:", error);
    return { success: false, error: "Failed to save settings" };
  }
}

export async function uploadAppIconAction(
  formData: FormData
): Promise<Result<{ url: string; filename: string }>> {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    const file = formData.get("file") as File;
    const iconType = formData.get("iconType") as string;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    if (!["16x16Icon", "32x32Icon", "180x180Icon"].includes(iconType)) {
      return { success: false, error: "Invalid icon type" };
    }

    if (!file.type.startsWith("image/")) {
      return { success: false, error: "File must be an image" };
    }

    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "File size must be less than 5MB" };
    }

    const uploadsDir = path.join(process.cwd(), "data", "uploads", "app-icons");
    try {
      await fs.access(uploadsDir);
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    const timestamp = Date.now();
    const extension = path.extname(file.name);
    const filename = `${iconType}-${timestamp}${extension}`;
    const filepath = path.join(uploadsDir, filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filepath, buffer);

    const publicUrl = `/api/app-icons/${filename}`;

    return {
      success: true,
      data: { url: publicUrl, filename },
    };
  } catch (error) {
    console.error("Error uploading app icon:", error);
    return { success: false, error: "Failed to upload icon" };
  }
}
