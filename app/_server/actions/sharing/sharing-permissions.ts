"use server";

import { getCurrentUser } from "@/app/_server/actions/users/current";
import { isItemSharedWithUser, getItemSharingMetadata } from "./sharing-utils";
import { Result, SharingPermissions } from "@/app/_types";

export async function checkSharingPermissionsAction(
  itemId: string,
  type: "checklist" | "document",
  owner: string
): Promise<Result<SharingPermissions>> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "Not authenticated" };
    }

    // Owner has full permissions
    if (currentUser.username === owner) {
      return {
        success: true,
        data: {
          canRead: true,
          canWrite: true,
          canShare: true,
        },
      };
    }

    // Check if item is shared with current user
    const isShared = await isItemSharedWithUser(
      itemId,
      type,
      owner,
      currentUser.username
    );

    if (!isShared) {
      return {
        success: true,
        data: {
          canRead: false,
          canWrite: false,
          canShare: false,
        },
      };
    }

    // Shared items have read/write permissions (as per requirements)
    return {
      success: true,
      data: {
        canRead: true,
        canWrite: true,
        canShare: false, // Only owner can share
      },
    };
  } catch (error) {
    console.error("Error in checkSharingPermissionsAction:", error);
    return { success: false, error: "Failed to check permissions" };
  }
}

export async function canAccessItemAction(
  itemId: string,
  type: "checklist" | "document",
  owner: string
): Promise<Result<boolean>> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "Not authenticated" };
    }

    // Owner can always access
    if (currentUser.username === owner) {
      return { success: true, data: true };
    }

    // Check if shared with current user
    const isShared = await isItemSharedWithUser(
      itemId,
      type,
      owner,
      currentUser.username
    );

    return { success: true, data: isShared };
  } catch (error) {
    console.error("Error in canAccessItemAction:", error);
    return { success: false, error: "Failed to check access" };
  }
}

export async function canEditItemAction(
  itemId: string,
  type: "checklist" | "document",
  owner: string
): Promise<Result<boolean>> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "Not authenticated" };
    }

    // Owner can always edit
    if (currentUser.username === owner) {
      return { success: true, data: true };
    }

    // Check if shared with current user (shared items have write permission)
    const isShared = await isItemSharedWithUser(
      itemId,
      type,
      owner,
      currentUser.username
    );

    return { success: true, data: isShared };
  } catch (error) {
    console.error("Error in canEditItemAction:", error);
    return { success: false, error: "Failed to check edit permissions" };
  }
}

export async function canShareItemAction(
  itemId: string,
  type: "checklist" | "document",
  owner: string
): Promise<Result<boolean>> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "Not authenticated" };
    }

    // Only owner can share
    const canShare = currentUser.username === owner;

    return { success: true, data: canShare };
  } catch (error) {
    console.error("Error in canShareItemAction:", error);
    return { success: false, error: "Failed to check share permissions" };
  }
}
