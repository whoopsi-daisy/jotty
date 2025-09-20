"use server";

import { rename, rmdir } from "fs/promises";
import { join } from "path";
import { existsSync, readdirSync, statSync } from "fs";
import { Result } from "@/app/_types";

function hasMarkdownFiles(dirPath: string): boolean {
    try {
        const items = readdirSync(dirPath);

        for (const item of items) {
            const itemPath = join(dirPath, item);
            const stat = statSync(itemPath);

            if (stat.isDirectory()) {
                if (hasMarkdownFiles(itemPath)) {
                    return true;
                }
            } else if (item.endsWith('.md')) {
                return true;
            }
        }

        return false;
    } catch (error) {
        return true;
    }
}

export async function renameDocsFolderAction(): Promise<Result<null>> {
    try {
        const dataDir = join(process.cwd(), "data");
        const docsPath = join(dataDir, "docs");
        const notesPath = join(dataDir, "notes");

        if (!existsSync(docsPath)) {
            return { success: false, error: "Docs folder not found" };
        }

        if (existsSync(notesPath)) {
            try {
                if (hasMarkdownFiles(notesPath)) {
                    return { success: false, error: "Notes folder already exists with markdown files" };
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
            error: error instanceof Error ? error.message : "Failed to rename folder"
        };
    }
}
