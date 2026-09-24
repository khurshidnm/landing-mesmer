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
      const initialPassword =
        process.env.ADMIN_INITIAL_PASSWORD || "j8Wqf$cHGeFHiKZiiXo2";
      const initialUsername =
        process.env.ADMIN_INITIAL_USERNAME || "admin";
      const passwordHash = await hash(initialPassword, 10);
      await User.create({
        username: initialUsername,
        password: passwordHash,
      });
      console.log(`Initial admin user (${initialUsername}) created`);
    }
  } catch (err) {
    console.log(err);
  }
};
