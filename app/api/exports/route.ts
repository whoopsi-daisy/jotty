import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/app/_utils/api-utils";
import {
  exportAllChecklistsNotes,
  exportUserChecklistsNotes,
  exportAllUsersData,
  exportWholeDataFolder,
  getExportProgress,
} from "@/app/_server/actions/export";
import { ExportType } from "@/app/_types";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  return withApiAuth(request, async (user) => {
    try {
      const body = await request.json();
      const { type, username } = body;

      if (!type) {
        return NextResponse.json(
          { error: "Export type is required" },
          { status: 400 }
        );
      }

      let result;
      switch (type as ExportType) {
        case "all_checklists_notes":
          result = await exportAllChecklistsNotes();
          break;
        case "user_checklists_notes":
          if (!username) {
            return NextResponse.json(
              { error: "Username is required for user export" },
              { status: 400 }
            );
          }
          result = await exportUserChecklistsNotes(username);
          break;
        case "all_users_data":
          result = await exportAllUsersData();
          break;
        case "whole_data_folder":
          result = await exportWholeDataFolder();
          break;
        default:
          return NextResponse.json(
            { error: "Invalid export type" },
            { status: 400 }
          );
      }

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || `Failed to export ${type}` },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        downloadUrl: result.downloadUrl,
      });
    } catch (error) {
      console.error("API Export Error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}

export async function GET(request: NextRequest) {
  return withApiAuth(request, async (user) => {
    try {
      const progress = await getExportProgress();
      return NextResponse.json(progress);
    } catch (error) {
      console.error("API Export Progress Error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
