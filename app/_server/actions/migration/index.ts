"use server";

import { rename, rmdir } from "fs/promises";
import { join } from "path";
import { existsSync, readdirSync, statSync } from "fs";
import { Result } from "@/app/_types";
import { DEPRECATED_DOCS_FOLDER, NOTES_FOLDER } from "@/app/_consts/notes";
import fs from "fs/promises";
import { SHARING_DIR, SHARED_ITEMS_FILE } from "@/app/_consts/files";

const hasMarkdownFiles = (dirPath: string): boolean => {
  try {
    const items = readdirSync(dirPath);

    for (const item of items) {
      const itemPath = join(dirPath, item);
      const stat = statSync(itemPath);

      if (stat.isDirectory()) {
        if (hasMarkdownFiles(itemPath)) {
          return true;
        }
      } else if (item.endsWith(".md")) {
        return true;
      }
    }

    return false;
  } catch (error) {
    return true;
  }
};

export const renameDocsFolder = async (): Promise<Result<null>> => {
  try {
    const dataDir = join(process.cwd(), "data");
    const docsPath = join(dataDir, DEPRECATED_DOCS_FOLDER);
    const notesPath = join(dataDir, NOTES_FOLDER);

    if (!existsSync(docsPath)) {
      return { success: false, error: "Docs folder not found" };
    }

    if (existsSync(notesPath)) {
      try {
        if (hasMarkdownFiles(notesPath)) {
          return {
            success: false,
            error: "Notes folder already exists with markdown files",
          };
        } else {
          await rmdir(notesPath, { recursive: true });
        }
      } catch (error) {
        return { success: false, error: "Cannot access notes folder" };
      }
    }

    await rename(docsPath, notesPath);

    return { success: true };
  } catch (error) {
    console.error("Error renaming docs folder:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to rename folder",
    };
  }
};

export const migrateSharingMetadata = async (): Promise<
  Result<{
    migrated: boolean;
    changes: string[];
  }>
> => {
  try {
    await fs.mkdir(SHARING_DIR, { recursive: true });

    let metadata: any;
    let changes: string[] = [];

    try {
      const content = await fs.readFile(SHARED_ITEMS_FILE, "utf-8");
      metadata = JSON.parse(content);
    } catch (error) {
      return {
        success: true,
        data: {
          migrated: false,
          changes: ["No existing sharing metadata found - nothing to migrate"],
        },
      };
    }

    let needsMigration = false;

    if (metadata.documents !== undefined && metadata.notes === undefined) {
      metadata.notes = metadata.documents;
      delete metadata.documents;
      needsMigration = true;
      changes.push("Renamed 'documents' key to 'notes'");
    }

    if (metadata.checklists === undefined) {
      metadata.checklists = {};
      needsMigration = true;
      changes.push("Added missing 'checklists' key");
    }

    if (metadata.notes === undefined) {
      metadata.notes = {};
      needsMigration = true;
      changes.push("Added missing 'notes' key");
    }

    if (needsMigration) {
      await fs.writeFile(SHARED_ITEMS_FILE, JSON.stringify(metadata, null, 2));
      changes.push("Updated sharing metadata file");
    }

    return {
      success: true,
      data: {
        migrated: needsMigration,
        changes,
      },
    };
  } catch (error) {
    console.error("Error migrating sharing metadata:", error);
    return {
      success: false,
      error: "Failed to migrate sharing metadata",
    };
  }
};
