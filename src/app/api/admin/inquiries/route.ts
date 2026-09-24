import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import Inquiry from "@/database/inquiry.model";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "all";
    const inquiryType = searchParams.get("inquiryType")?.trim() || "all";
    const country = searchParams.get("country")?.trim() || "all";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));

    // Build filter query
    const filter: Record<string, any> = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (inquiryType && inquiryType !== "all") {
      filter.inquiryTypes = { $in: [inquiryType] };
    }

    if (country && country !== "all") {
      filter.country = country;
    }

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

    const skip = (page - 1) * limit;

    const [inquiries, totalFiltered, countsAgg] = await Promise.all([
      Inquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Inquiry.countDocuments(filter),
      Inquiry.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Format KPI counts
    const counts: Record<string, number> = {
      total: 0,
      new: 0,
      contacted: 0,
      qualified: 0,
      proposal_sent: 0,
      won: 0,
      lost: 0,
      spam: 0,
      inPipeline: 0,
    };

    countsAgg.forEach((item: { _id: string; count: number }) => {
      if (item._id && counts[item._id] !== undefined) {
        counts[item._id] = item.count;
      }
      counts.total += item.count;
    });

    counts.inPipeline =
      (counts.contacted || 0) +
      (counts.qualified || 0) +
      (counts.proposal_sent || 0);

    return NextResponse.json({
      success: true,
      data: {
        inquiries,
        pagination: {
          total: totalFiltered,
          page,
          limit,
          totalPages: Math.ceil(totalFiltered / limit) || 1,
        },
        counts,
      },
    });
  } catch (error) {
    console.error("Error fetching admin inquiries:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}
