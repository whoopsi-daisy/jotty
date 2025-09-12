"use server";

import { getCurrentUser } from "@/app/_server/actions/auth/utils";
import { getLists } from "../data/actions";
import { getDocs } from "../data/docs-actions";
import {
  getItemsSharedByUser,
  getItemsSharedWithUser,
} from "../sharing/sharing-utils";
import { Result } from "@/app/_types";

export interface UserDataExport {
  user: {
    username: string;
    isAdmin: boolean;
    createdAt?: string;
    lastLogin?: string;
  };
  checklists: any[];
  notes: any[];
  sharedByMe: {
    checklists: any[];
    notes: any[];
  };
  sharedWithMe: {
    checklists: any[];
    notes: any[];
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

    // Get user's notes
    const docsResult = await getDocs();
    const notes = docsResult.success ? docsResult.data || [] : [];

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
      checklists: checklists.filter((list) => !list.isShared), // Only own checklists
      notes: notes.filter((doc) => !doc.isShared), // Only own notes
      sharedByMe: {
        checklists: sharedByMe.checklists,
        notes: sharedByMe.notes,
      },
      sharedWithMe: {
        checklists: sharedWithMe.checklists,
        notes: sharedWithMe.notes,
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
