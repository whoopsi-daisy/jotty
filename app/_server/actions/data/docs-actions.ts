"use server";

import { revalidatePath } from "next/cache";
import path from "path";
import { Document, Category } from "@/app/_types";
import {
  getDocsUserDir,
  ensureDocsDir,
  readDocsFile,
  writeDocsFile,
  deleteDocsFile,
  readDocsDir,
  deleteDocsDir,
} from "@/app/_server/utils/docs-files";
import fs from "fs/promises";

const parseMarkdownDoc = (
  content: string,
  id: string,
  category: string
): Document => {
  const lines = content.split("\n");
  const titleLine = lines.find((line) => line.startsWith("# "));
  const title = titleLine?.replace(/^#\s*/, "") || "Untitled Document";

  // Remove the title line from content to get the actual document content
  const contentWithoutTitle = lines
    .filter((line) => !line.startsWith("# ") || line !== titleLine)
    .join("\n")
    .trim();

  return {
    id,
    title,
    content: contentWithoutTitle,
    category,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const docToMarkdown = (doc: Document): string => {
  const header = `# ${doc.title}`;
  const content = doc.content || "";

  return `${header}\n\n${content}`;
};

export const getDocs = async () => {
  try {
    const userDir = await getDocsUserDir();
    await ensureDocsDir(userDir);

    const categories = await readDocsDir(userDir);
    const docs: Document[] = [];

    for (const category of categories) {
      if (!category.isDirectory()) continue;

      const categoryDir = path.join(userDir, category.name);
      try {
        const files = await readDocsDir(categoryDir);
        for (const file of files) {
          if (file.isFile() && file.name.endsWith(".md")) {
            const id = path.basename(file.name, ".md");
            const content = await readDocsFile(
              path.join(categoryDir, file.name)
            );
            docs.push(parseMarkdownDoc(content, id, category.name));
          }
        }
      } catch (error) {
        continue;
      }
    }

    return { success: true, data: docs };
  } catch (error) {
    return { error: "Failed to fetch documents" };
  }
};

export const getDocsCategories = async () => {
  try {
    const userDir = await getDocsUserDir();
    await ensureDocsDir(userDir);

    const entries = await readDocsDir(userDir);
    const categories: Category[] = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const categoryDir = path.join(userDir, entry.name);
        const files = await readDocsDir(categoryDir);
        const count = files.filter(
          (file) => file.isFile() && file.name.endsWith(".md")
        ).length;
        categories.push({ name: entry.name, count });
      }
    }

    return { success: true, data: categories };
  } catch (error) {
    return { error: "Failed to fetch document categories" };
  }
};

export const createDocAction = async (formData: FormData) => {
  try {
    const title = formData.get("title") as string;
    const category = (formData.get("category") as string) || "Uncategorized";
    const content = (formData.get("content") as string) || "";

    const userDir = await getDocsUserDir();
    const id = Date.now().toString();
    const categoryDir = path.join(userDir, category);
    const filePath = path.join(categoryDir, `${id}.md`);

    const newDoc: Document = {
      id,
      title,
      content,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await writeDocsFile(filePath, docToMarkdown(newDoc));
    revalidatePath("/");
    return { success: true, data: newDoc };
  } catch (error) {
    return { error: "Failed to create document" };
  }
};

export const updateDocAction = async (formData: FormData) => {
  try {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;

    const docs = await getDocs();
    if (!docs.success) {
      throw new Error(docs.error);
    }

    const doc = docs.data.find((d) => d.id === id);
    if (!doc) {
      throw new Error("Document not found");
    }

    const updatedDoc = {
      ...doc,
      title,
      content,
      category,
      updatedAt: new Date().toISOString(),
    };

    const userDir = await getDocsUserDir();

    // If category changed, delete old file and create new one
    if (doc.category !== category) {
      const oldFilePath = path.join(
        userDir,
        doc.category || "Uncategorized",
        `${id}.md`
      );
      await deleteDocsFile(oldFilePath);
    }

    const newFilePath = path.join(
      userDir,
      category || "Uncategorized",
      `${id}.md`
    );
    await writeDocsFile(newFilePath, docToMarkdown(updatedDoc));

    revalidatePath("/");
    return { success: true, data: updatedDoc };
  } catch (error) {
    return { error: "Failed to update document" };
  }
};

export const deleteDocAction = async (formData: FormData) => {
  try {
    const id = formData.get("id") as string;
    const category = formData.get("category") as string;

    const userDir = await getDocsUserDir();
    const filePath = path.join(
      userDir,
      category || "Uncategorized",
      `${id}.md`
    );
    await deleteDocsFile(filePath);

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete document" };
  }
};

export const createDocsCategoryAction = async (formData: FormData) => {
  try {
    const name = formData.get("name") as string;

    const userDir = await getDocsUserDir();
    const categoryDir = path.join(userDir, name);
    await ensureDocsDir(categoryDir);

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Failed to create document category" };
  }
};

export const deleteDocsCategoryAction = async (formData: FormData) => {
  try {
    const name = formData.get("name") as string;

    const userDir = await getDocsUserDir();
    const categoryDir = path.join(userDir, name);
    await deleteDocsDir(categoryDir);

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete document category" };
  }
};

export const renameDocsCategoryAction = async (formData: FormData) => {
  try {
    const oldName = formData.get("oldName") as string;
    const newName = formData.get("newName") as string;

    if (!oldName || !newName) {
      return { error: "Both old and new names are required" };
    }

    const userDir = await getDocsUserDir();
    const oldCategoryDir = path.join(userDir, oldName);
    const newCategoryDir = path.join(userDir, newName);

    // Check if old directory exists
    if (
      !(await fs
        .access(oldCategoryDir)
        .then(() => true)
        .catch(() => false))
    ) {
      return { error: "Category not found" };
    }

    // Check if new directory already exists
    if (
      await fs
        .access(newCategoryDir)
        .then(() => true)
        .catch(() => false)
    ) {
      return { error: "Category with new name already exists" };
    }

    // Rename the directory
    await fs.rename(oldCategoryDir, newCategoryDir);

    // Update all files in the category to reflect the new category name
    const files = await readDocsDir(newCategoryDir);
    for (const file of files) {
      if (file.isFile() && file.name.endsWith(".md")) {
        const filePath = path.join(newCategoryDir, file.name);
        const content = await readDocsFile(filePath);
        const fileId = file.name.replace(".md", "");
        const doc = parseMarkdownDoc(content, fileId, newName);
        doc.category = newName;
        doc.updatedAt = new Date().toISOString();
        await writeDocsFile(filePath, docToMarkdown(doc));
      }
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Failed to rename document category" };
  }
};
