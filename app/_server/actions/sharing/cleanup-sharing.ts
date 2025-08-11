"use server";

import { readSharingMetadata, writeSharingMetadata } from "./sharing-utils";
import { getAllLists } from "../data/actions";
import { getAllDocs } from "../data/docs-actions";
import { Result } from "@/app/_types";

export async function cleanupSharingMetadataAction(): Promise<
  Result<{
    removedChecklists: number;
    removedDocuments: number;
  }>
> {
  try {
    const metadata = await readSharingMetadata();
    const allLists = await getAllLists();
    const allDocs = await getAllDocs();

    if (
      !allLists.success ||
      !allDocs.success ||
      !allLists.data ||
      !allDocs.data
    ) {
      return {
        success: false,
        error: "Failed to fetch content for cleanup",
      };
    }

    const existingChecklistIds = new Set(allLists.data.map((list) => list.id));
    const existingDocumentIds = new Set(allDocs.data.map((doc) => doc.id));

    let removedChecklists = 0;
    let removedDocuments = 0;

    const checklistsToRemove: string[] = [];
    for (const [id, sharedItem] of Object.entries(metadata.checklists)) {
      if (!existingChecklistIds.has(id)) {
        checklistsToRemove.push(id);
        removedChecklists++;
      }
    }

    const documentsToRemove: string[] = [];
    for (const [id, sharedItem] of Object.entries(metadata.documents)) {
      if (!existingDocumentIds.has(id)) {
        documentsToRemove.push(id);
        removedDocuments++;
      }
    }

    for (const id of checklistsToRemove) {
      delete metadata.checklists[id];
    }

    for (const id of documentsToRemove) {
      delete metadata.documents[id];
    }

    await writeSharingMetadata(metadata);

    return {
      success: true,
      data: {
        removedChecklists,
        removedDocuments,
      },
    };
  } catch (error) {
    console.error("Error cleaning up sharing metadata:", error);
    return {
      success: false,
      error: "Failed to cleanup sharing metadata",
    };
  }
}

export async function validateSharingMetadataAction(): Promise<
  Result<{
    validChecklists: number;
    validDocuments: number;
    orphanedChecklists: number;
    orphanedDocuments: number;
  }>
> {
  try {
    const metadata = await readSharingMetadata();
    const allLists = await getAllLists();
    const allDocs = await getAllDocs();

    if (
      !allLists.success ||
      !allDocs.success ||
      !allLists.data ||
      !allDocs.data
    ) {
      return {
        success: false,
        error: "Failed to fetch content for validation",
      };
    }

    const existingChecklistIds = new Set(allLists.data.map((list) => list.id));
    const existingDocumentIds = new Set(allDocs.data.map((doc) => doc.id));

    let validChecklists = 0;
    let validDocuments = 0;
    let orphanedChecklists = 0;
    let orphanedDocuments = 0;

    for (const [id, sharedItem] of Object.entries(metadata.checklists)) {
      if (existingChecklistIds.has(id)) {
        validChecklists++;
      } else {
        orphanedChecklists++;
      }
    }

    for (const [id, sharedItem] of Object.entries(metadata.documents)) {
      if (existingDocumentIds.has(id)) {
        validDocuments++;
      } else {
        orphanedDocuments++;
      }
    }

    return {
      success: true,
      data: {
        validChecklists,
        validDocuments,
        orphanedChecklists,
        orphanedDocuments,
      },
    };
  } catch (error) {
    console.error("Error validating sharing metadata:", error);
    return {
      success: false,
      error: "Failed to validate sharing metadata",
    };
  }
}
