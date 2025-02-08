"use server";

import Certificates from "@/database/certificates.model";
import { connectToDatabase } from "@/lib/mongoose";

export const getSertificates = async (id?: string): Promise<string> => {
  try {
    await connectToDatabase();
    if (!id) {
      const news = await Certificates.find({});
      return JSON.stringify(news);
    }
    const certificates = await Certificates.findOne({ _id: id });
    return JSON.stringify(certificates);
  } catch (error) {
    console.log(error);
    return error as string;
  }
};
