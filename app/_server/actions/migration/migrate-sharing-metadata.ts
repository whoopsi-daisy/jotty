"use server";

import fs from "fs/promises";
import path from "path";
import { Result } from "@/app/_types";

const SHARING_DIR = path.join(process.cwd(), "data", "sharing");
const SHARED_ITEMS_FILE = path.join(SHARING_DIR, "shared-items.json");

export async function migrateSharingMetadataAction(): Promise<Result<{
    migrated: boolean;
    changes: string[];
}>> {
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
                    changes: ["No existing sharing metadata found - nothing to migrate"]
                }
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
                changes
            }
        };
    } catch (error) {
        console.error("Error migrating sharing metadata:", error);
        return {
            success: false,
            error: "Failed to migrate sharing metadata"
        };
    }
}
