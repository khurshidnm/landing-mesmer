import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { filename: string } }) {
  const { filename } = await params;

  if (!filename) return NextResponse.json({ error: "File not found" }, { status: 404 });

  const filePath = path.join(process.cwd(), "public/uploads", filename);

  try {
    const fileBuffer = fs.readFileSync(filePath);
    return new Response(fileBuffer, {
      headers: { "Content-Type": "image/png" }, // MIME turiga qarab o‘zgartiring
    });
  } catch (error) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
