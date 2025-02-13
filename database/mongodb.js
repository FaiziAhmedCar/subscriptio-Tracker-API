import { config } from "dotenv";
config();
import mongoose from "mongoose";

const DB_URI = process.env.MONGODB_URI;

if (!DB_URI) {
  console.error("MongoDB URI is missing. Please check your configuration");
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`MongoDB connected successfully`);
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
};

export default connectDB;