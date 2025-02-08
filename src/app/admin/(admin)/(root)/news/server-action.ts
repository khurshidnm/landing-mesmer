"use server";

import News from "@/database/news.model";
import { connectToDatabase } from "@/lib/mongoose";

export const getNews = async (slug?: string): Promise<string> => {
  try {
    await connectToDatabase();
    if (!slug) {
      const news = await News.find({});
      return JSON.stringify(news);
    }
    const news = await News.findOne({ slug });
    return JSON.stringify(news);
  } catch (error) {
    console.log(error);
    return error as string;
  }
};
