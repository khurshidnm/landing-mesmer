"use server";

import Projects from "@/database/projects.model";
import { connectToDatabase } from "@/lib/mongoose";

export const getProjects = async (
  slug?: string,
  page = 1,
  limit = 10
): Promise<string> => {
  try {
    await connectToDatabase();

    if (!slug) {
      const skip = (page - 1) * limit;

      const totalItems = await Projects.countDocuments({});
      const totalPages = Math.ceil(totalItems / limit);

      const projects = await Projects.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return JSON.stringify({
        projects,
        pagination: {
          totalItems,
          totalPages,
          currentPage: page,
          limit,
        },
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
