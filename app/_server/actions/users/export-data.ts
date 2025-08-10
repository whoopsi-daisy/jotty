"use server";

import { getCurrentUser } from "@/app/_server/actions/auth/utils";
import { getLists } from "../data/actions";
import { getDocs } from "../data/docs-actions";
import { getItemsSharedByUser, getItemsSharedWithUser } from "../sharing/sharing-utils";
import { Result } from "@/app/_types";

export interface UserDataExport {
    user: {
        username: string;
        isAdmin: boolean;
        createdAt?: string;
        lastLogin?: string;
    };
    checklists: any[];
    documents: any[];
    sharedByMe: {
        checklists: any[];
        documents: any[];
    };
    sharedWithMe: {
        checklists: any[];
        documents: any[];
    };
    exportDate: string;
}

export async function exportUserDataAction(): Promise<Result<UserDataExport>> {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return {
                success: false,
                error: "Not authenticated",
            };
        }

        // Get user's checklists
        const listsResult = await getLists();
        const checklists = listsResult.success ? listsResult.data || [] : [];

        // Get user's documents
        const docsResult = await getDocs();
        const documents = docsResult.success ? docsResult.data || [] : [];

        // Get items shared by user
        const sharedByMe = await getItemsSharedByUser(currentUser.username);

        // Get items shared with user
        const sharedWithMe = await getItemsSharedWithUser(currentUser.username);

        // Create export data
        const exportData: UserDataExport = {
            user: {
                username: currentUser.username,
                isAdmin: currentUser.isAdmin,
                createdAt: currentUser.createdAt,
                lastLogin: currentUser.lastLogin,
            },
            checklists: checklists.filter(list => !list.isShared), // Only own checklists
            documents: documents.filter(doc => !doc.isShared), // Only own documents
            sharedByMe: {
                checklists: sharedByMe.checklists,
                documents: sharedByMe.documents,
            },
            sharedWithMe: {
                checklists: sharedWithMe.checklists,
                documents: sharedWithMe.documents,
            },
            exportDate: new Date().toISOString(),
        };

        return {
            success: true,
            data: exportData,
        };
    } catch (error) {
        console.error("Error exporting user data:", error);
        return {
            success: false,
            error: "Failed to export user data",
        };
    }
}
