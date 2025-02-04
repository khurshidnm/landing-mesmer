import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

interface Params {
  params: {
    filename: string;
  };
}

export async function GET(req: Request, { params }: Params) {
  const { filename } = params;

  if (!filename) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), "public/uploads", filename);

  try {
    const fileBuffer = await fs.readFile(filePath);
    return new Response(fileBuffer, {
      headers: { "Content-Type": "image/png" },
    });
  } catch (error) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
