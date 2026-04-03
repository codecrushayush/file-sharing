import crypto from "crypto";
import { FileMetadata } from "../models/FileMetadata.js";

export async function createUniqueShareToken() {
  for (let i = 0; i < 12; i += 1) {
    const token = crypto.randomBytes(24).toString("hex");
    const dup = await FileMetadata.findOne({ shareToken: token }).select("_id").lean();
    if (!dup) return token;
  }
  throw new Error("Could not allocate a unique share token");
}
