import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { NOTES_FOLDER } from "@/app/_consts/notes";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string; filename: string } }
) {
  try {
    const { username } = params;
    const filename = decodeURIComponent(params.filename);

    const filePath = path.join(
      process.cwd(),
      "data",
      NOTES_FOLDER,
      username,
      "images",
      filename
    );

    try {
      const fileBuffer = await fs.readFile(filePath);
      const ext = path.extname(filename).toLowerCase();

      let contentType = "image/jpeg";
      switch (ext) {
        case ".png":
          contentType = "image/png";
          break;
        case ".gif":
          contentType = "image/gif";
          break;
        case ".webp":
          contentType = "image/webp";
          break;
        case ".svg":
          contentType = "image/svg+xml";
          break;
        default:
          contentType = "image/jpeg";
      }

      return new NextResponse(fileBuffer as any, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000",
        },
      });
    } catch (error) {
      return new NextResponse("Image not found", { status: 404 });
    }
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
