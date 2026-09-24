import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import Inquiry from "@/database/inquiry.model";
import fs from "fs";
import path from "path";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const inquiry = await Inquiry.findById(id).lean();
    if (!inquiry) {
      return NextResponse.json({ success: false, error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { inquiry } });
  } catch (error) {
    console.error("Error retrieving inquiry:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const allowedFields = ["status", "priority", "notes", "assignedTo", "budget"];
    const updateData: Record<string, any> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedInquiry) {
      return NextResponse.json({ success: false, error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry updated successfully",
      data: { inquiry: updatedInquiry },
    });
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json({ success: false, error: "Failed to update inquiry" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return NextResponse.json({ success: false, error: "Inquiry not found" }, { status: 404 });
    }

    // If inquiry has an uploaded file, safely remove it from disk
    if (inquiry.file?.filename) {
      const filePath = path.join(process.cwd(), "public", "uploads", "inquiries", inquiry.file.filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (fileErr) {
          console.error("Error deleting inquiry file from disk:", fileErr);
        }
      }
    }

    await Inquiry.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return NextResponse.json({ success: false, error: "Failed to delete inquiry" }, { status: 500 });
  }
}
