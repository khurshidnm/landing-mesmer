"use server";

import Constants from "@/database/consts.model";
import { connectToDatabase } from "@/lib/mongoose";

export const getConsts = async (): Promise<string> => {
  try {
    await connectToDatabase();
    const certificates = await Constants.findOne({});
    return JSON.stringify(certificates);
  } catch (error) {
    console.log(error);
    return error as string;
  }
};
