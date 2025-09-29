import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    const filepath = path.join(
      process.cwd(),
      "data",
      "uploads",
      "app-icons",
      filename
    );

    try {
      const file = await fs.readFile(filepath);

      // Determine content type based on file extension
      const ext = path.extname(filename).toLowerCase();
      let contentType = "application/octet-stream";

      switch (ext) {
        case ".png":
          contentType = "image/png";
          break;
        case ".jpg":
        case ".jpeg":
          contentType = "image/jpeg";
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
      }

      return new NextResponse(file, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error serving app icon:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
