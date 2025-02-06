"use server";

import Projects from "@/database/projects.model";
import { connectToDatabase } from "@/lib/mongoose";

export const getProjects = async (slug?: string): Promise<string> => {
  try {
    await connectToDatabase();
    if (!slug) {
      const project = await Projects.find({});
      return JSON.stringify(project);
    } else {
      const project = await Projects.findOne({ slug });
      return JSON.stringify(project);
    }
  } catch (error) {
    console.log(error);
    return error as string;
  }
};
