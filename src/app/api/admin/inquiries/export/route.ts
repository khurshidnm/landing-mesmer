import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import Inquiry from "@/database/inquiry.model";

function escapeCsvField(field: any): string {
  if (field === null || field === undefined) return '""';
  const str = String(field);
  return `"${str.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "all";
    const inquiryType = searchParams.get("inquiryType")?.trim() || "all";
    const country = searchParams.get("country")?.trim() || "all";

    const filter: Record<string, any> = {};
    if (status && status !== "all") filter.status = status;
    if (inquiryType && inquiryType !== "all") filter.inquiryTypes = { $in: [inquiryType] };
    if (country && country !== "all") filter.country = country;
    if (search) {
      const searchRegex = new RegExp(search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "i");
      filter.$or = [
        { company: searchRegex },
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { message: searchRegex },
      ];
    }

    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 }).lean();

    const headers = [
      "Inquiry ID",
      "Date (UTC)",
      "Company",
      "Contact Name",
      "Email",
      "Phone",
      "Country",
      "Inquiry Types",
      "Status",
      "Priority",
      "Project Scope / Message",
      "Internal Notes",
      "File Attachment",
      "UTM Source",
      "UTM Campaign",
      "UTM Medium",
      "Referrer",
      "Locale",
      "IP Address",
    ];

    const rows = inquiries.map((inq: any) => [
      inq._id.toString(),
      inq.createdAt ? new Date(inq.createdAt).toISOString() : "",
      inq.company || "",
      inq.name || "",
      inq.email || "",
      inq.phone || "",
      inq.country || "",
      Array.isArray(inq.inquiryTypes) ? inq.inquiryTypes.join(", ") : "",
      inq.status || "new",
      inq.priority || "medium",
      inq.message || "",
      inq.notes || "",
      inq.file?.url ? `https://www.mesmer.uz${inq.file.url}` : "",
      inq.utm?.source || "",
      inq.utm?.campaign || "",
      inq.utm?.medium || "",
      inq.utm?.referrer || "",
      inq.locale || "en",
      inq.ip || "",
    ]);

    const csvContent =
      "\uFEFF" + // UTF-8 BOM for Excel compatibility
      headers.map(escapeCsvField).join(",") +
      "\n" +
      rows.map((row) => row.map(escapeCsvField).join(",")).join("\n");

    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `mesmer_leads_${dateStr}.csv`;

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting inquiries:", error);
    return NextResponse.json({ success: false, error: "Export failed" }, { status: 500 });
  }
}
