"use server";

import { readSharingMetadata } from "./sharing-utils";
import { MostActiveSharer, SharedItem } from "@/app/_types";

interface GlobalSharing {
  success: boolean;
  data: {
    allSharedChecklists: SharedItem[];
    allSharedNotes: SharedItem[];
    sharingStats: {
      totalSharedChecklists: number;
      totalSharedNotes: number;
      totalSharingRelationships: number;
      totalPublicShares: number;
      mostActiveSharers: MostActiveSharer[];
    };
  };
}

export const getGlobalSharingAction = async (): Promise<GlobalSharing> => {
  try {
    const metadata = await readSharingMetadata();

    const allSharedChecklists = Object.values(metadata.checklists);
    const allSharedNotes = Object.values(metadata.notes);
    const allItems = [...allSharedChecklists, ...allSharedNotes];

    const totalSharedChecklists = allSharedChecklists.length;
    const totalSharedNotes = allSharedNotes.length;

    const totalSharingRelationships = allItems.length;

    const totalPublicShares = allItems.filter(
      (item) => item.isPubliclyShared
    ).length;

    const sharerCounts: Record<string, number> = {};
    allItems.forEach((item) => {
      sharerCounts[item.owner] = (sharerCounts[item.owner] || 0) + 1;
    });

    const mostActiveSharers = Object.entries(sharerCounts)
      .map(([username, sharedCount]) => ({ username, sharedCount }))
      .sort((a, b) => b.sharedCount - a.sharedCount)
      .slice(0, 5);

    return {
      success: true,
      data: {
        allSharedChecklists,
        allSharedNotes,
        sharingStats: {
          totalSharedChecklists,
          totalSharedNotes,
          totalSharingRelationships,
          mostActiveSharers,
          totalPublicShares,
        },
      },
    };
  } catch (error) {
    console.error("Error in getGlobalSharingAction:", error);

    return {
      success: false,
      data: {
        allSharedChecklists: [],
        allSharedNotes: [],
        sharingStats: {
          totalSharedChecklists: 0,
          totalSharedNotes: 0,
          totalSharingRelationships: 0,
          totalPublicShares: 0,
          mostActiveSharers: [],
        },
      },
    };
  }
};
