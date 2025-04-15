import User from "@/database/user.model";
import { hash } from "bcrypt";
import mongoose, { ConnectOptions } from "mongoose";

let isConncected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI) {
    return console.log("MISSING MONGODB_URI");
  }

  if (isConncected) {
    return;
  }

  try {
    const options: ConnectOptions = {
      dbName: "mesmer-admin",
      autoCreate: true,
    };
    await mongoose.connect(process.env.MONGODB_URI!, options);
    isConncected = true;
    console.log("MongoDB is connected");
    const admins_count = await User.countDocuments();
    console.log(admins_count);
    if (admins_count === 0) {
      const passwordHash = await hash("admin", 10);
      await User.create({
        username: "admin",
        password: passwordHash,
      });
      console.log("Admin created");
    }
  } catch (err) {
    console.log(err);
  }
};
