"use server";

import Projects from "@/database/projects.model";
import { connectToDatabase } from "@/lib/mongoose";
import { IPagination } from "@/types";

export const getProjects = async ({
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
      const skip = (page - 1) * limit;

      const projects = await Projects.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Projects.countDocuments();
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

      return JSON.stringify({
        projects,
        pagination,
      });
    } else {
      const project = await Projects.findOne({ slug });
      return JSON.stringify(project);
    }
  } catch (error) {
    console.log(error);
    return JSON.stringify({ error: (error as Error).message });
  }
};
