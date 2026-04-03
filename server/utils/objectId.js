import mongoose from "mongoose";

export function parseObjectId(id, label = "id") {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return new mongoose.Types.ObjectId(id);
}
