import mongoose from "mongoose";
import { env } from "./env.js";
import { initGridFSBucket } from "./gridfs.js";

/**
 * Connects to MongoDB and initializes the GridFS bucket for binary file storage.
 */
export async function connectDB() {
  mongoose.set("strictQuery", true);
  const conn = await mongoose.connect(env.mongoUri);
  initGridFSBucket();
  console.log("GridFS bucket ready (default: fs)");
  return conn;
}
