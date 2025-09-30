"use server";

import path from "path";
import { Checklist, Category } from "@/app/_types";
import {
  getUserDir,
  ensureDir,
  readFile,
  readDir,
} from "@/app/_server/utils/files";
import { getCurrentUser } from "@/app/_server/actions/users/current";
import { getItemsSharedWithUser } from "@/app/_server/actions/sharing/sharing-utils";
import { readUsers } from "@/app/_server/actions/auth/utils";
import fs from "fs/promises";
import { parseMarkdown } from "./checklist-utils";
import { readOrderFile } from "./file-actions";
import { CHECKLISTS_FOLDER } from "@/app/_consts/globalConsts";

const readListsRecursively = async (
  dir: string,
  basePath: string = "",
  owner: string
): Promise<Checklist[]> => {
  const lists: Checklist[] = [];
  const entries = await readDir(dir);

  const order = await readOrderFile(dir);
  const dirNames = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  const fileNames = entries
    .filter((e) => e.isFile() && e.name.endsWith(".md"))
    .map((e) => e.name);

  const orderedDirNames: string[] = order?.categories
    ? [
        ...order.categories.filter((n) => dirNames.includes(n)),
        ...dirNames
          .filter((n) => !order.categories!.includes(n))
          .sort((a, b) => a.localeCompare(b)),
      ]
    : dirNames.sort((a, b) => a.localeCompare(b));

  for (const dirName of orderedDirNames) {
    const categoryPath = basePath ? `${basePath}/${dirName}` : dirName;
    const categoryDir = path.join(dir, dirName);

    try {
      const files = await readDir(categoryDir);
      const mdFiles = files.filter((f) => f.isFile() && f.name.endsWith(".md"));

      const ids = mdFiles.map((f) => path.basename(f.name, ".md"));
      const categoryOrder = await readOrderFile(categoryDir);
      const orderedIds: string[] = categoryOrder?.items
        ? [
            ...categoryOrder.items.filter((id) => ids.includes(id)),
            ...ids
              .filter((id) => !categoryOrder.items!.includes(id))
              .sort((a, b) => a.localeCompare(b)),
          ]
        : ids.sort((a, b) => a.localeCompare(b));

      for (const id of orderedIds) {
        const fileName = `${id}.md`;
        const filePath = path.join(categoryDir, fileName);
        try {
          const content = await readFile(filePath);
          const stats = await fs.stat(filePath);
          lists.push(
            parseMarkdown(content, id, categoryPath, owner, false, stats)
          );
        } catch {}
      }
    } catch {}

    const subLists = await readListsRecursively(
      categoryDir,
      categoryPath,
      owner
    );
    lists.push(...subLists);
  }
  return lists;
};

export const getLists = async (username?: string) => {
  try {
    let userDir: string;
    let currentUser: any = null;

    if (username) {
      userDir = path.join(process.cwd(), "data", CHECKLISTS_FOLDER, username);
      currentUser = { username };
    } else {
      currentUser = await getCurrentUser();
      if (!currentUser) {
        return { success: false, error: "Not authenticated" };
      }
      userDir = await getUserDir();
    }
    await ensureDir(userDir);

    const lists = await readListsRecursively(userDir, "", currentUser.username);

    const sharedItems = await getItemsSharedWithUser(currentUser.username);
    for (const sharedItem of sharedItems.checklists) {
      try {
        const sharedFilePath = sharedItem.filePath
          ? path.join(
              process.cwd(),
              "data",
              CHECKLISTS_FOLDER,
              sharedItem.filePath
            )
          : path.join(
              process.cwd(),
              "data",
              CHECKLISTS_FOLDER,
              sharedItem.owner,
              sharedItem.category || "Uncategorized",
              `${sharedItem.id}.md`
            );

        const content = await fs.readFile(sharedFilePath, "utf-8");
        const stats = await fs.stat(sharedFilePath);
        lists.push(
          parseMarkdown(
            content,
            sharedItem.id,
            sharedItem.category || "Uncategorized",
            sharedItem.owner,
            true,
            stats
          )
        );
      } catch (error) {
        continue;
      }
    }

    return { success: true, data: lists };
  } catch (error) {
    console.error("Error in getLists:", error);
    return { success: false, error: "Failed to fetch lists" };
  }
};

const buildChecklistCategoryTree = async (
  dir: string,
  basePath: string = "",
  level: number = 0
): Promise<Category[]> => {
  const categories: Category[] = [];
  const entries = await readDir(dir);

  const order = await readOrderFile(dir);
  const dirNames = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  const orderedDirNames: string[] = order?.categories
    ? [
        ...order.categories.filter((n) => dirNames.includes(n)),
        ...dirNames
          .filter((n) => !order.categories!.includes(n))
          .sort((a, b) => a.localeCompare(b)),
      ]
    : dirNames.sort((a, b) => a.localeCompare(b));

  for (const dirName of orderedDirNames) {
    const categoryPath = basePath ? `${basePath}/${dirName}` : dirName;
    const categoryDir = path.join(dir, dirName);

    const files = await readDir(categoryDir);
    const count = files.filter(
      (file) => file.isFile() && file.name.endsWith(".md")
    ).length;

    const parent = basePath || undefined;

    categories.push({
      name: dirName,
      count,
      path: categoryPath,
      parent,
      level,
    });

    const subCategories: Category[] = await buildChecklistCategoryTree(
      categoryDir,
      categoryPath,
      level + 1
    );
    categories.push(...subCategories);
  }

  return categories;
};

export const getCategories = async () => {
  try {
    const userDir = await getUserDir();
    await ensureDir(userDir);

    const categories = await buildChecklistCategoryTree(userDir);

    return { success: true, data: categories };
  } catch (error) {
    return { success: false, error: "Failed to fetch categories" };
  }
};

export const getAllLists = async () => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "Not authenticated" };
    }

    const allLists: Checklist[] = [];

    const users = await readUsers();

    for (const user of users) {
      const userDir = path.join(
        process.cwd(),
        "data",
        CHECKLISTS_FOLDER,
        user.username
      );

      try {
        const userLists = await readListsRecursively(
          userDir,
          "",
          user.username
        );
        allLists.push(...userLists);
      } catch (error) {
        continue;
      }
    }

    return { success: true, data: allLists };
  } catch (error) {
    console.error("Error in getAllLists:", error);
    return { success: false, error: "Failed to fetch all lists" };
  }
};
