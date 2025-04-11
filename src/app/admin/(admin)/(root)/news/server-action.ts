"use server";

import News from "@/database/news.model";
import { connectToDatabase } from "@/lib/mongoose";

export const getNews = async (
  slug?: string,
  page = 1,
  limit = 10
): Promise<string> => {
  try {
    await connectToDatabase();

    if (!slug) {
      // Calculate skip value for pagination
      const skip = (page - 1) * limit;

      // Get total count for pagination
      const totalItems = await News.countDocuments({});
      const totalPages = Math.ceil(totalItems / limit);

      // Get paginated news
      const news = await News.find({})
        .sort({ createdAt: -1 }) // Sort by creation date, newest first
        .skip(skip)
        .limit(limit);

      // Return news with pagination metadata
      return JSON.stringify({
        news,
        pagination: {
          totalItems,
          totalPages,
          currentPage: page,
          limit,
        },
      });
    }

    const news = await News.findOne({ slug });
    return JSON.stringify(news);
  } catch (error) {
    console.log(error);
    return JSON.stringify({ error: (error as Error).message });
  }
};
