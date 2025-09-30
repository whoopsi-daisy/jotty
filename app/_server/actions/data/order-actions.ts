"use server";

import path from "path";
import { revalidatePath } from "next/cache";
import { getUserDir } from "@/app/_server/utils/files";
import { getDocsUserDir } from "@/app/_server/utils/notes-files";
import { writeOrderFile, readOrderFile } from "./file-actions";
import { Modes } from "@/app/_types/enums";

export const setCategoryOrderAction = async (formData: FormData) => {
  try {
    const type = formData.get("type") as string;
    const parent = (formData.get("parent") as string) || "";
    const categoriesStr = formData.get("categories") as string;
    const categories = JSON.parse(categoriesStr) as string[];

    const baseDir =
      type === Modes.NOTES ? await getDocsUserDir() : await getUserDir();
    const dirPath = parent ? path.join(baseDir, parent) : baseDir;

    const existing = await readOrderFile(dirPath);
    const data = { categories, items: existing?.items };
    const result = await writeOrderFile(dirPath, data);
    if (!result.success) return { error: "Failed to write order" };

    try {
      revalidatePath("/");
    } catch {}
    return { success: true };
  } catch {
    return { error: "Failed to set category order" };
  }
};

export const setChecklistOrderInCategoryAction = async (formData: FormData) => {
  try {
    const type = formData.get("type") as string;
    const category = (formData.get("category") as string) || "Uncategorized";
    const itemsStr = formData.get("items") as string;
    const items = JSON.parse(itemsStr) as string[];

    const baseDir =
      type === Modes.NOTES ? await getDocsUserDir() : await getUserDir();
    const dirPath = path.join(baseDir, category);

    const existing = await readOrderFile(dirPath);
    const data = { categories: existing?.categories, items };
    const result = await writeOrderFile(dirPath, data);
    if (!result.success) return { error: "Failed to write order" };

    try {
      revalidatePath("/");
    } catch {}
    return { success: true };
  } catch {
    return { error: "Failed to set item order" };
  }
};
