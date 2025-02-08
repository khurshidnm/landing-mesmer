"use server";

import Vacancies from "@/database/vacancies.model";
import { connectToDatabase } from "@/lib/mongoose";

export const getVacancies = async (id?: string): Promise<string> => {
  try {
    await connectToDatabase();
    if (!id) {
      const project = await Vacancies.find({});
      return JSON.stringify(project);
    } else {
      const project = await Vacancies.findOne({ _id: id });
      return JSON.stringify(project);
    }
  } catch (error) {
    console.log(error);
    return error as string;
  }
};
