"use server";

import News from "@/database/news.model";
import { connectToDatabase } from "@/lib/mongoose";
import { IPagination } from "@/types";

export const getNews = async ({
  page = 1,
  limit = 10,
  slug = null,
}: {
  page?: number;
  limit?: number;
  slug?: string | null;
}): Promise<string> => {
  try {
    await connectToDatabase();

    if (!slug) {
      // Calculate skip value for pagination
      const skip = (page - 1) * limit;

      // Get paginated news
      const news = await News.find({})
        .sort({ createdAt: -1 }) // Sort by creation date, newest first
        .skip(skip)
        .limit(limit);

      const total = await News.countDocuments();
      const pages = Math.ceil(total / limit);
      const next = page < pages ? page + 1 : 1;
      const prev = page > 1 ? page - 1 : pages;
      const pagination: IPagination = {
        page,
        limit,
        total,
        pages,
        next,
        prev,
      };

      // Return news with pagination metadata
      return JSON.stringify({
        news,
        pagination,
      });
    }

    const news = await News.findOne({ slug });
    return JSON.stringify(news);
  } catch (error) {
    console.log(error);
    return JSON.stringify({ error: (error as Error).message });
  }
};
