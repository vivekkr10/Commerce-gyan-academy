import mongoose from "mongoose";
import { config } from "./env.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection failed: ", error.message);
    process.exit(1);
  }
};

export default connectDB;
