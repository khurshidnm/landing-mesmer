import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import mime from "mime";

export async function GET(req: Request, props: { params: Promise<{ filename: string }> }) {
  try {
    const { filename } = await props.params;

    if (!filename) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const safeFilename = path.basename(filename);
    if (!safeFilename || safeFilename !== filename || filename.includes("..")) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    const uploadDir = path.resolve(process.env.ROOT_PATH ?? process.cwd(), "public/uploads");
    const filePath = path.join(uploadDir, safeFilename);

    if (!filePath.startsWith(uploadDir)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = mime.getType(filePath) || "application/octet-stream";

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving upload:", error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
