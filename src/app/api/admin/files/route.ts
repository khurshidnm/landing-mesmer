import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? process.cwd(), "public/uploads");

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!fs.existsSync(UPLOAD_DIR)) {
      return NextResponse.json({ success: true, files: [] });
    }

    const items = fs.readdirSync(UPLOAD_DIR, { withFileTypes: true });
    const files = items
      .filter((item) => item.isFile() && !item.name.startsWith("."))
      .map((item) => {
        const filePath = path.join(UPLOAD_DIR, item.name);
        const stats = fs.statSync(filePath);
        return {
          name: item.name,
          url: `/api/uploads/${item.name}`,
          size: stats.size,
          updatedAt: stats.mtime.toISOString(),
          extension: path.extname(item.name).toLowerCase(),
        };
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return NextResponse.json({ success: true, files });
  } catch (error) {
    console.error("Error reading uploads:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("name");

    if (!filename) {
      return NextResponse.json(
        { success: false, error: "Filename is required" },
        { status: 400 }
      );
    }

    const safeFilename = path.basename(filename);
    const filePath = path.join(UPLOAD_DIR, safeFilename);

    if (!filePath.startsWith(UPLOAD_DIR) || !fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 }
      );
    }

    fs.unlinkSync(filePath);

    return NextResponse.json({ success: true, message: "File deleted" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
