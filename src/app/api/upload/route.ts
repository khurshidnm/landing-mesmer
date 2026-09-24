import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { generateUniqueFilename } from "@/lib/helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? process.cwd(), "public/uploads");

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".svg",
  ".pdf",
  ".doc",
  ".docx",
]);

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "You are not authenticated",
        },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No valid file uploaded",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "File size exceeds the 25MB limit",
        },
        { status: 400 }
      );
    }

    const originalName = path.basename(file.name);
    const fileExtension = path.extname(originalName).toLowerCase();

    if (!ALLOWED_EXTENSIONS.has(fileExtension)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file extension (${fileExtension}). Allowed: ${Array.from(ALLOWED_EXTENSIONS).join(", ")}`,
        },
        { status: 400 }
      );
    }

    const baseName = originalName.slice(0, originalName.length - fileExtension.length);
    const saveName = generateUniqueFilename(baseName, fileExtension);

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    fs.writeFileSync(path.resolve(UPLOAD_DIR, saveName), buffer);

    return NextResponse.json({
      success: true,
      name: saveName,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "Internal server error during upload",
      },
      { status: 500 }
    );
  }
};